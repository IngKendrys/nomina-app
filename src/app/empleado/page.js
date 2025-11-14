"use client"
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Plus, Trash2, Edit2, Save, X} from 'lucide-react';

export default function EmpleadoPage({loading, empleados, setLoading, cargarEmpleados}) {
  const [nuevoEmpleado, setNuevoEmpleado] = useState({
    nombre: "",
    cargo: "",
    salario_base: "",
    cedula: "",
  });
  const [editando, setEditando] = useState(null);
  const [empleadoEditando, setEmpleadoEditando] = useState(null);

  const agregarEmpleado = async () => {
    if (!nuevoEmpleado.nombre || !nuevoEmpleado.salario_base) {
      alert("Completa los campos requeridos");
      return;
    }

    setLoading(true);
    const { error } = await supabase.from("empleados").insert([
      {
        nombre: nuevoEmpleado.nombre,
        cargo: nuevoEmpleado.cargo,
        salario_base: parseFloat(nuevoEmpleado.salario_base),
        cedula: nuevoEmpleado.cedula,
      },
    ]);

    if (!error) {
      setNuevoEmpleado({ nombre: "", cargo: "", salario_base: "", cedula: "" });
      cargarEmpleados();
    }
    setLoading(false);
  };

  const eliminarEmpleado = async (id) => {
    if (confirm("¿Eliminar este empleado?")) {
      await supabase.from("empleados").delete("exact").eq("id",id)
      cargarEmpleados();
    }
  };

  const iniciarEdicion = (empleado) => {
    setEditando(empleado.id);
    setEmpleadoEditando({ ...empleado });
  };

  const actualizarEmpleado = async () => {
    await supabase
      .from("empleados")
      .update({
        nombre: empleadoEditando.nombre,
        cargo: empleadoEditando.cargo,
        salario_base: parseFloat(empleadoEditando.salario_base),
      })
      .eq("id", empleadoEditando.id);
    setEditando(null);
    setEmpleadoEditando(null);
    cargarEmpleados();
  };
  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Empleados</h2>

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h3 className="text-xl font-semibold mb-4">Agregar Empleado</h3>
        <div className="grid grid-cols-4 gap-4">
          <input
            type="text"
            placeholder="Nombre completo"
            value={nuevoEmpleado.nombre}
            onChange={(e) =>
              setNuevoEmpleado({ ...nuevoEmpleado, nombre: e.target.value })
            }
            className="border rounded px-3 py-2"
          />
          <input
            type="text"
            placeholder="Cedula"
            value={nuevoEmpleado.cedula}
            onChange={(e) =>
              setNuevoEmpleado({ ...nuevoEmpleado, cedula: e.target.value })
            }
            className="border rounded px-3 py-2"
          />
          <input
            type="text"
            placeholder="Cargo"
            value={nuevoEmpleado.cargo}
            onChange={(e) =>
              setNuevoEmpleado({ ...nuevoEmpleado, cargo: e.target.value })
            }
            className="border rounded px-3 py-2"
          />
          <input
            type="number"
            placeholder="Salario base"
            value={nuevoEmpleado.salario_base}
            onChange={(e) =>
              setNuevoEmpleado({
                ...nuevoEmpleado,
                salario_base: e.target.value,
              })
            }
            className="border rounded px-3 py-2"
          />
          <button
            onClick={agregarEmpleado}
            disabled={loading}
            className="bg-blue-600 text-white rounded px-4 py-2 hover:bg-blue-700 flex items-center justify-center gap-2 disabled:bg-gray-400"
          >
            <Plus size={18} />
            Agregar
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                Nombre
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                Cargo
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                Salario Base
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {empleados?.map((emp) => (
              <tr key={emp.id}>
                {editando === emp.id ? (
                  <>
                    <td className="px-6 py-4">
                      <input
                        type="text"
                        value={empleadoEditando.nombre}
                        onChange={(e) =>
                          setEmpleadoEditando({
                            ...empleadoEditando,
                            nombre: e.target.value,
                          })
                        }
                        className="border rounded px-2 py-1 w-full"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <input
                        type="text"
                        value={empleadoEditando.cargo}
                        onChange={(e) =>
                          setEmpleadoEditando({
                            ...empleadoEditando,
                            cargo: e.target.value,
                          })
                        }
                        className="border rounded px-2 py-1 w-full"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <input
                        type="number"
                        value={empleadoEditando.salario_base}
                        onChange={(e) =>
                          setEmpleadoEditando({
                            ...empleadoEditando,
                            salario_base: e.target.value,
                          })
                        }
                        className="border rounded px-2 py-1 w-full"
                      />
                    </td>
                    <td className="px-6 py-4 flex gap-2">
                      <button
                        onClick={actualizarEmpleado}
                        className="text-green-600 hover:text-green-800"
                      >
                        <Save size={18} />
                      </button>
                      <button
                        onClick={() => {
                          setEditando(null);
                          setEmpleadoEditando(null);
                        }}
                        className="text-gray-600 hover:text-gray-800"
                      >
                        <X size={18} />
                      </button>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {emp.nombre}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {emp.cargo}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 font-semibold">
                      ${parseFloat(emp.salario_base).toLocaleString("es-CO")}
                    </td>
                    <td className="px-6 py-4 flex gap-2">
                      <button
                        onClick={() => iniciarEdicion(emp)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => eliminarEmpleado(emp.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
        {empleados.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No hay empleados registrados. Agrega el primero arriba.
          </div>
        )}
      </div>
    </div>
  );
}
