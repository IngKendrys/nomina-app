"use client"
import { useState, useEffect } from "react";
import { Plus, Trash2, Clock } from 'lucide-react';
import { supabase } from "@/lib/supabase";

const FESTIVOS = [
  '2025-01-01', '2025-01-06', '2025-03-24', '2025-04-17', '2025-04-18',
  '2025-05-01', '2025-06-02', '2025-06-23', '2025-06-30', '2025-07-20',
  '2025-08-07', '2025-08-18', '2025-10-13', '2025-11-03', '2025-11-17',
  '2025-12-08', '2025-12-25'
];

export default function RecargoPage({ empleados, loading, recargos, cargarRecargos, setLoading }) {
  const [nuevoRecargo, setNuevoRecargo] = useState({
    empleado_id: "",
    fecha: "",
    hora_inicio: "",
    hora_fin: "",
  });
  const [previewRecargo, setPreviewRecargo] = useState(null);

  const esFestivo = (fecha) => { return FESTIVOS.includes(fecha); };

  const getDiaSemana = (fecha) => { return new Date(fecha + "T00:00:00").getDay(); };

  const calcularHoras = (horaInicio, horaFin) => {
    const [hi, mi] = horaInicio.split(":")?.map(Number);
    const [hf, mf] = horaFin.split(":")?.map(Number);

    let minutosInicio = hi * 60 + mi;
    let minutosFin = hf * 60 + mf;

    if (minutosFin < minutosInicio) {
      minutosFin += 24 * 60;
    }

    return (minutosFin - minutosInicio) / 60;
  };

  const clasificarRecargo = (fecha, horaInicio, horaFin, salarioBase) => {
    const diaSemana = getDiaSemana(fecha);
    const esDomingo = diaSemana === 0;
    const festivo = esFestivo(fecha);

    const [hi, mi] = horaInicio.split(":")?.map(Number);
    const [hf, mf] = horaFin.split(":")?.map(Number);

    let minutosInicio = hi * 60 + mi;
    let minutosFin = hf * 60 + mf;

    if (minutosFin < minutosInicio) {
      minutosFin += 24 * 60;
    }

    const valorHoraBase = salarioBase / 220;
    let detalles = [];
    let valorTotal = 0;

    const rangos = [];

    let minutoCurrent = minutosInicio;

    while (minutoCurrent < minutosFin) {
      const minutosEnHora = minutoCurrent % (24 * 60);
      const horaActual = Math.floor(minutosEnHora / 60);

      let tipoRecargo = "";
      let porcentaje = 0;

      if (festivo) {
        if (horaActual >= 6 && horaActual < 18) {
          tipoRecargo = "Festivo Diurno";
          porcentaje = 75;
        } else {
          tipoRecargo = "Festivo Nocturno";
          porcentaje = 110;
        }
      } else if (esDomingo) {
        if (horaActual >= 0 && horaActual < 6) {
          tipoRecargo = "Nocturno Dominical";
          porcentaje = 110;
        } else if (horaActual >= 6 && horaActual < 18) {
          tipoRecargo = "Dominical";
          porcentaje = 75;
        } else {
          tipoRecargo = "Nocturno Dominical";
          porcentaje = 110;
        }
      } else {
        if (horaActual >= 6 && horaActual < 18) {
          tipoRecargo = "Diurno";
          porcentaje = 0;
        } else {
          tipoRecargo = "Nocturno";
          porcentaje = 35;
        }
      }

      let proximoCambio;
      if (festivo || esDomingo) {
        if (horaActual >= 0 && horaActual < 6) proximoCambio = 6 * 60;
        else if (horaActual >= 6 && horaActual < 18) proximoCambio = 18 * 60;
        else proximoCambio = 24 * 60;
      } else {
        if (horaActual >= 6 && horaActual < 18) proximoCambio = 18 * 60;
        else if (horaActual >= 18) proximoCambio = 24 * 60;
        else proximoCambio = 6 * 60;
      }

      const minutosHastaProximoCambio = proximoCambio - minutosEnHora;
      const minutosRestantes = minutosFin - minutoCurrent;
      const minutosEnEsteRango = Math.min(
        minutosHastaProximoCambio,
        minutosRestantes
      );

      const horasEnEsteRango = minutosEnEsteRango / 60;
      const valorSegmento = porcentaje > 0 ? valorHoraBase * (porcentaje / 100) * horasEnEsteRango : valorHoraBase * horasEnEsteRango;

      const existente = detalles.find((d) => d.tipo === tipoRecargo);
      if (existente) {
        existente.horas += horasEnEsteRango;
        existente.valor += valorSegmento;
      } else {
        detalles.push({
          tipo: tipoRecargo,
          porcentaje,
          horas: horasEnEsteRango,
          valor: valorSegmento,
        });
      }

      valorTotal += valorSegmento;
      minutoCurrent += minutosEnEsteRango;
    }

    return {
      detalles,
      valorTotal,
      horasTotales: calcularHoras(horaInicio, horaFin),
    };
  };

  const agregarRecargo = async () => {
    if (
      !nuevoRecargo.empleado_id ||
      !nuevoRecargo.fecha ||
      !nuevoRecargo.hora_inicio ||
      !nuevoRecargo.hora_fin
    ) {
      alert("Completa todos los campos");
      return;
    }

    setLoading(true);

    const empleado = empleados.find((e) => e.id === nuevoRecargo.empleado_id);
    if (!empleado) {
      alert("Empleado no encontrado");
      setLoading(false);
      return;
    }

    const resultado = clasificarRecargo(
      nuevoRecargo.fecha,
      nuevoRecargo.hora_inicio,
      nuevoRecargo.hora_fin,
      empleado.salario_base
    );

    const inserciones = resultado.detalles?.map((detalle) => ({
      empleado_id: nuevoRecargo.empleado_id,
      fecha: nuevoRecargo.fecha,
      tipo_recargo: detalle.tipo,
      horas: detalle.horas,
      valor_hora_base: empleado.salario_base / 240,
      porcentaje_recargo: detalle.porcentaje,
      valor_calculado: detalle.valor,
      hora_inicio: nuevoRecargo.hora_inicio,
      hora_fin: nuevoRecargo.hora_fin,
    }));

    const { error } = await supabase.from("recargos").insert(inserciones);

    if (!error) {
      setNuevoRecargo({
        empleado_id: "",
        fecha: "",
        hora_inicio: "",
        hora_fin: "",
      });
      setPreviewRecargo(null);
      cargarRecargos();
    }
    setLoading(false);
  };

  const eliminarRecargo = async (id) => {
    if (confirm("¿Eliminar este recargo?")) {
      await supabase.from("recargos").delete().eq("id", id);
      cargarRecargos();
    }
  };
  


  const calcularPreviewRecargo = () => {
    const empleado = empleados.find(e => e.id === nuevoRecargo.empleado_id);
    if (!empleado) return;

    const resultado = clasificarRecargo(
      nuevoRecargo.fecha,
      nuevoRecargo.hora_inicio,
      nuevoRecargo.hora_fin,
      empleado.salario_base
    );

    setPreviewRecargo(resultado);
  };
  
  useEffect(() => {
    if (
      nuevoRecargo.empleado_id &&
      nuevoRecargo.fecha &&
      nuevoRecargo.hora_inicio &&
      nuevoRecargo.hora_fin
    ) {
      calcularPreviewRecargo();
    }
  }, [nuevoRecargo]);

  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-800 mb-6">
        Recargos por Turnos
      </h2>

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Clock size={20} />
          Registrar Turno
        </h3>
        <div className="grid grid-cols-4 gap-4 mb-4">
          <select
            value={nuevoRecargo.empleado_id}
            onChange={(e) =>
              setNuevoRecargo({ ...nuevoRecargo, empleado_id: e.target.value })
            }
            className="border rounded px-3 py-2"
          >
            <option value="">Seleccionar empleado</option>
            {empleados?.map((emp) => (
              <option key={emp.id} value={emp.id}>
                {emp.nombre}
              </option>
            ))}
          </select>

          <input
            type="date"
            value={nuevoRecargo.fecha}
            onChange={(e) =>
              setNuevoRecargo({ ...nuevoRecargo, fecha: e.target.value })
            }
            className="border rounded px-3 py-2"
          />

          <input
            type="time"
            placeholder="Hora inicio"
            value={nuevoRecargo.hora_inicio}
            onChange={(e) =>
              setNuevoRecargo({ ...nuevoRecargo, hora_inicio: e.target.value })
            }
            className="border rounded px-3 py-2"
          />

          <input
            type="time"
            placeholder="Hora fin"
            value={nuevoRecargo.hora_fin}
            onChange={(e) =>
              setNuevoRecargo({ ...nuevoRecargo, hora_fin: e.target.value })
            }
            className="border rounded px-3 py-2"
          />
        </div>

        {previewRecargo && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <h4 className="font-semibold text-blue-900 mb-2">
              Vista Previa del Turno ({previewRecargo.horasTotales.toFixed(2)}{" "}
              horas totales)
            </h4>
            <div className="space-y-2">
              {previewRecargo.detalles?.map((detalle, idx) => (
                <div
                  key={idx}
                  className="flex justify-between items-center text-sm"
                >
                  <span className="text-gray-700">
                    <strong>{detalle.tipo}</strong> ({detalle.porcentaje}%
                    recargo) - {detalle.horas.toFixed(2)}h
                  </span>
                  <span className="font-semibold text-green-600">
                    $
                    {detalle.valor.toLocaleString("es-CO", {
                      maximumFractionDigits: 0,
                    })}
                  </span>
                </div>
              ))}
              <div className="pt-2 border-t border-blue-300 flex justify-between items-center">
                <span className="font-bold text-blue-900">TOTAL TURNO:</span>
                <span className="font-bold text-lg text-blue-600">
                  $
                  {previewRecargo.valorTotal.toLocaleString("es-CO", {
                    maximumFractionDigits: 0,
                  })}
                </span>
              </div>
            </div>
          </div>
        )}

        <button
          onClick={agregarRecargo}
          disabled={loading || !previewRecargo}
          className="w-full bg-green-600 text-white rounded px-4 py-3 hover:bg-green-700 flex items-center justify-center gap-2 disabled:bg-gray-400 font-semibold"
        >
          <Plus size={18} />
          Registrar Turno
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                Empleado
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                Fecha
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                Horario
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                Tipo
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                Horas
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                Valor
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                Acción
              </th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {recargos?.map((rec) => (
              <tr key={rec.id}>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {rec.empleados?.nombre}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">{rec.fecha}</td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {rec.hora_inicio} - {rec.hora_fin}
                </td>
                <td className="px-6 py-4 text-sm">
                  <span
                    className={`px-2 py-1 rounded text-xs font-semibold ${rec.tipo_recargo.includes("Festivo")
                      ? "bg-purple-100 text-purple-800"
                      : rec.tipo_recargo.includes("Dominical")
                        ? "bg-orange-100 text-orange-800"
                        : rec.tipo_recargo.includes("Nocturno")
                          ? "bg-indigo-100 text-indigo-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                  >
                    {rec.tipo_recargo}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {rec.horas.toFixed(2)}h
                </td>
                <td className="px-6 py-4 text-sm text-green-600 font-semibold">
                  ${parseFloat(rec.valor_calculado).toLocaleString("es-CO")}
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => eliminarRecargo(rec.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {recargos.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No hay turnos registrados. Registra el primero arriba.
          </div>
        )}
      </div>
    </div>
  );
}
