"use client"
import { Filter, Download } from "lucide-react"
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import 'jspdf-autotable'

const generarPDF = (reporteRecargos, filtroMes, periodoReporte) => {
  const doc = new jsPDF('landscape');

  const titulo = periodoReporte === 'quincena1' ? 'Primera Quincena' :
    periodoReporte === 'quincena2' ? 'Segunda Quincena' : 'Mes Completo';

  doc.setFontSize(18);
  doc.text(`Reporte de Recargos - ${titulo}`, 14, 15);
  doc.setFontSize(12);
  doc.text(filtroMes, 14, 22);

  const tableData = [];

  reporteRecargos.forEach(reporte => {
    const row = {
      nombre: reporte.empleado.nombre,
      cedula: reporte.empleado.cedula || 'N/A',
      horasDiurno: 0,
      recargoDiurno: 0,
      horasNocturno: 0,
      recargoNocturno: 0,
      horasDominical: 0,
      recargoDominical: 0,
      horasNocturnoDominical: 0,
      recargoNocturnoDominical: 0,
      horasFestivoDiurno: 0,
      recargoFestivoDiurno: 0,
      horasFestivoNocturno: 0,
      recargoFestivoNocturno: 0,
      totalRecargos: reporte.valorTotal
    };

    Object.entries(reporte.porTipo).forEach(([tipo, datos]) => {
      if (tipo === 'Diurno') {
        row.horasDiurno = datos.horas?.toFixed(2);
        row.recargoDiurno = datos.valor?.toFixed(0);
      } else if (tipo === 'Nocturno') {
        row.horasNocturno = datos.horas?.toFixed(2);
        row.recargoNocturno = datos.valor?.toFixed(0);
      } else if (tipo === 'Dominical') {
        row.horasDominical = datos.horas?.toFixed(2);
        row.recargoDominical = datos.valor?.toFixed(0);
      } else if (tipo === 'Nocturno Dominical') {
        row.horasNocturnoDominical = datos.horas?.toFixed(2);
        row.recargoNocturnoDominical = datos.valor?.toFixed(0);
      } else if (tipo === 'Festivo Diurno') {
        row.horasFestivoDiurno = datos.horas?.toFixed(2);
        row.recargoFestivoDiurno = datos.valor?.toFixed(0);
      } else if (tipo === 'Festivo Nocturno') {
        row.horasFestivoNocturno = datos.horas?.toFixed(2);
        row.recargoFestivoNocturno = datos.valor?.toFixed(0);
      }
    });

    tableData.push(row);
  });

  const totales = {
    nombre: 'TOTAL',
    cedula: '',
    horasDiurno: tableData?.reduce((s, r) => s + parseFloat(r.horasDiurno || 0), 0)?.toFixed(2),
    recargoDiurno: tableData?.reduce((s, r) => s + parseFloat(r.recargoDiurno || 0), 0)?.toFixed(0),
    horasNocturno: tableData?.reduce((s, r) => s + parseFloat(r.horasNocturno || 0), 0)?.toFixed(2),
    recargoNocturno: tableData?.reduce((s, r) => s + parseFloat(r.recargoNocturno || 0), 0)?.toFixed(0),
    horasDominical: tableData?.reduce((s, r) => s + parseFloat(r.horasDominical || 0), 0)?.toFixed(2),
    recargoDominical: tableData?.reduce((s, r) => s + parseFloat(r.recargoDominical || 0), 0)?.toFixed(0),
    horasNocturnoDominical: tableData?.reduce((s, r) => s + parseFloat(r.horasNocturnoDominical || 0), 0)?.toFixed(2),
    recargoNocturnoDominical: tableData?.reduce((s, r) => s + parseFloat(r.recargoNocturnoDominical || 0), 0)?.toFixed(0),
    horasFestivoDiurno: tableData?.reduce((s, r) => s + parseFloat(r.horasFestivoDiurno || 0), 0)?.toFixed(2),
    recargoFestivoDiurno: tableData?.reduce((s, r) => s + parseFloat(r.recargoFestivoDiurno || 0), 0)?.toFixed(0),
    horasFestivoNocturno: tableData?.reduce((s, r) => s + parseFloat(r.horasFestivoNocturno || 0), 0)?.toFixed(2),
    recargoFestivoNocturno: tableData?.reduce((s, r) => s + parseFloat(r.recargoFestivoNocturno || 0), 0)?.toFixed(0),
    totalRecargos: tableData?.reduce((s, r) => s + parseFloat(r?.totalRecargos || 0), 0)?.toFixed(0)
  };

  tableData.push(totales);

  autoTable(doc, {
    startY: 28,
    head: [[
      'Nombre',
      'Cédula',
      'Horas Diurno',
      'Recargos Diurno',
      'Horas Nocturno',
      'Recargos Nocturno',
      'Horas Dominical',
      'Recargos Dominical',
      'Horas Noct. Dom.',
      'Recargo Noct. Dom.',
      'Horas Fest. Diurno',
      'Recargos Fest. Diurno',
      'Horas Fest. Noct.',
      'Recargos Fest. Noct.',
      'Total Recargos'
    ]],
    body: tableData?.map(row => [
      row.nombre,
      row.cedula,
      row.horasDiurno ? parseInt(row.horasDiurno) : '-',
      row.recargoDiurno ? `$${parseInt(row.recargoDiurno)?.toLocaleString('es-CO')}` : '-',
      row.horasNocturno ? parseInt(row.horasNocturno) : '-',
      row.recargoNocturno ? `$${parseInt(row.recargoNocturno)?.toLocaleString('es-CO')}` : '-',
      row.horasDominical ? parseInt(row.horasDominical) : '-',
      row.recargoDominical ? `$${parseInt(row.recargoDominical)?.toLocaleString('es-CO')}` : '-',
      row.horasNocturnoDominical ? parseInt(row.horasNocturnoDominical) : '-',
      row.recargoNocturnoDominical ? `$${parseInt(row.recargoNocturnoDominical)?.toLocaleString('es-CO')}` : '-',
      row.horasFestivoDiurno ? parseInt(row.horasFestivoDiurno) : '-',
      row.recargoFestivoDiurno ? `$${parseInt(row.recargoFestivoDiurno)?.toLocaleString('es-CO')}` : '-',
      row.horasFestivoNocturno ? parseInt(row.horasFestivoNocturno) : '-',
      row.recargoFestivoNocturno ? `$${parseInt(row.recargoFestivoNocturno)?.toLocaleString('es-CO')}` : '-',
      `$${parseInt(row?.totalRecargos)?.toLocaleString('es-CO')}`
    ]),
    styles: { fontSize: 7, cellPadding: 2 },
    headStyles: { fillColor: [37, 99, 235], fontSize: 7 },
    footStyles: { fillColor: [34, 197, 94], fontStyle: 'bold' },
    alternateRowStyles: { fillColor: [245, 247, 250] },
    didParseCell: function (data) {
      if (data.row.index === tableData?.length - 1) {
        data.cell.styles.fillColor = [34, 197, 94];
        data.cell.styles.textColor = [255, 255, 255];
        data.cell.styles.fontStyle = 'bold';
      }
    }
  });

  doc.save(`Reporte_Recargos_${filtroMes}_${periodoReporte}.pdf`);
};

export default function ReportePage({ filtroMes, recargos, empleados, periodoReporte, setPeriodoReporte, setFiltroMes }) {

  const filtrarRecargosPorPeriodo = () => {
    if (!filtroMes) return recargos;

    const [year, month] = filtroMes.split('-')?.map(Number);

    return recargos?.filter(rec => {
      const fechaRec = new Date(rec.fecha + 'T00:00:00');
      const diaRec = fechaRec.getDate();
      const mesRec = fechaRec.getMonth() + 1;
      const yearRec = fechaRec.getFullYear();

      if (yearRec !== year || mesRec !== month) return false;

      if (periodoReporte === 'quincena1') {
        return diaRec >= 1 && diaRec <= 15;
      } else if (periodoReporte === 'quincena2') {
        return diaRec >= 16;
      }
      return true; 
    });
  };

  const generarReporteRecargos = () => {
    const recargosFiltrados = filtrarRecargosPorPeriodo();

    const reportePorEmpleado = empleados?.map(emp => {
      const recargosEmp = recargosFiltrados?.filter(r => r.empleado_id === emp.id);

      const porTipo = {};
      recargosEmp.forEach(rec => {
        if (!porTipo[rec.tipo_recargo]) {
          porTipo[rec.tipo_recargo] = {
            horas: 0,
            valor: 0,
            cantidad: 0
          };
        }
        porTipo[rec.tipo_recargo].horas += parseFloat(rec.horas);
        porTipo[rec.tipo_recargo].valor += parseFloat(rec.valor_calculado);
        porTipo[rec.tipo_recargo].cantidad += 1;
      });

      const horasTotales = recargosEmp?.reduce((sum, r) => sum + parseFloat(r.horas), 0);
      const valorTotal = recargosEmp?.reduce((sum, r) => sum + parseFloat(r.valor_calculado), 0);

      return {
        empleado: emp,
        porTipo,
        horasTotales,
        valorTotal,
        cantidadTurnos: recargosEmp?.length
      };
    })?.filter(r => r.cantidadTurnos > 0);

    return reportePorEmpleado;
  };

  const reporteRecargos = generarReporteRecargos();
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">Reporte de Recargos</h2>
        <div className="flex gap-3 items-center">
          <Filter size={20} className="text-gray-600" />
          <input
            type="month"
            value={filtroMes}
            onChange={e => setFiltroMes(e.target.value)}
            className="border rounded px-3 py-2"
            placeholder="Seleccionar mes"
          />
          <select
            value={periodoReporte}
            onChange={e => setPeriodoReporte(e.target.value)}
            className="border rounded px-3 py-2"
          >
            <option value="mes">Mes Completo</option>
            <option value="quincena1">Primera Quincena (1-15)</option>
            <option value="quincena2">Segunda Quincena (16-30/31)</option>
          </select>
          {filtroMes && reporteRecargos?.length > 0 && (
            <button
              onClick={() => generarPDF(reporteRecargos, filtroMes, periodoReporte)}
              className="bg-red-600 text-white rounded px-4 py-2 hover:bg-red-700 flex items-center gap-2 font-semibold"
            >
              <Download size={18} />
              Descargar PDF
            </button>
          )}
        </div>
      </div>

      {!filtroMes && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <p className="text-yellow-800">
            ⚠️ <strong>Selecciona un mes</strong> para ver el reporte de recargos
          </p>
        </div>
      )}

      {filtroMes && (
        <>
          <div className="bg-linear-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-6 mb-6">
            <h3 className="font-bold text-green-900 mb-2">
              📊 Reporte de {periodoReporte === 'quincena1' ? 'Primera Quincena' : periodoReporte === 'quincena2' ? 'Segunda Quincena' : 'Mes Completo'}
            </h3>
            <p className="text-green-700 text-sm">
              Mostrando datos de: {filtroMes}
            </p>
          </div>

          {reporteRecargos?.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
              No hay recargos registrados en este periodo
            </div>
          ) : (
            <div className="space-y-6">
              {reporteRecargos?.map(reporte => {
                const recargosFiltrados = filtrarRecargosPorPeriodo();
                const recargosEmpleado = recargosFiltrados?.filter(r => r.empleado_id === reporte.empleado.id);
                const fechasTurnos = [...new Set(recargosEmpleado?.map(r => r.fecha))].sort();

                return (
                  <div key={reporte.empleado.id} className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="bg-linear-to-r from-blue-600 to-blue-700 text-white p-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="text-xl font-bold">{reporte.empleado.nombre}</h3>
                          <p className="text-blue-100 text-sm">{reporte.empleado.cargo}</p>
                          {reporte.empleado.cedula && (
                            <p className="text-blue-200 text-xs">CC: {reporte.empleado.cedula}</p>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-blue-100">Total Recargos</p>
                          <p className="text-2xl font-bold">${reporte.valorTotal?.toLocaleString('es-CO')}</p>
                          <p className="text-xs text-blue-100">{reporte.horasTotales} horas - {reporte.cantidadTurnos} turnos</p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-blue-50 border-b border-blue-100 px-4 py-2">
                      <p className="text-sm text-blue-900">
                        <strong>📅 Fechas de turnos:</strong> {fechasTurnos?.map(f => new Date(f + 'T00:00:00')?.toLocaleDateString('es-CO', { day: '2-digit', month: 'short' })).join(', ')}
                      </p>
                    </div>
                    <div className="p-4">
                      <h4 className="font-semibold text-gray-700 mb-3">Desglose por Tipo de Recargo:</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {Object.entries(reporte.porTipo).map(([tipo, datos]) => (
                          <div key={tipo} className="border rounded-lg p-4 hover:shadow-md transition">
                            <div className="flex items-start justify-between mb-2">
                              <span className={`px-2 py-1 rounded text-xs font-semibold ${tipo.includes('Festivo') ? 'bg-purple-100 text-purple-800' :
                                  tipo.includes('Dominical') ? 'bg-orange-100 text-orange-800' :
                                    tipo.includes('Nocturno') ? 'bg-indigo-100 text-indigo-800' :
                                      'bg-gray-100 text-gray-800'
                                }`}>
                                {tipo}
                              </span>
                              <span className="text-xs text-gray-500">{datos.cantidad} turnos</span>
                            </div>
                            <div className="space-y-1">
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Horas:</span>
                                <span className="font-semibold text-gray-900">{datos.horas}h</span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Valor:</span>
                                <span className="font-semibold text-green-600">
                                  ${datos.valor?.toLocaleString('es-CO')}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
              <div className="bg-linear-to-r from-green-600 to-emerald-600 text-white rounded-lg shadow p-6">
                <h3 className="text-xl font-bold mb-4">📈 Resumen Total del Periodo</h3>
                <div className="grid grid-cols-3 gap-6">
                  <div>
                    <p className="text-green-100 text-sm">Total Empleados</p>
                    <p className="text-3xl font-bold">{reporteRecargos?.length}</p>
                  </div>
                  <div>
                    <p className="text-green-100 text-sm">Total Horas</p>
                    <p className="text-3xl font-bold">
                      {reporteRecargos?.reduce((sum, r) => sum + r.horasTotales, 0)?.toFixed(1)}h
                    </p>
                  </div>
                  <div>
                    <p className="text-green-100 text-sm">Total Recargos</p>
                    <p className="text-3xl font-bold">
                      ${reporteRecargos?.reduce((sum, r) => sum + r.valorTotal, 0)?.toLocaleString('es-CO')}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>)}
    </div>
  )
}
