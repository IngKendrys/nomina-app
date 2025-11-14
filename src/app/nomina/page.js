export default function NominaPage({empleados, recargos}) {
  const calcularNomina = () => {
    return empleados?.map(emp => {
      const recargosEmpleado = recargos?.filter(r => r.empleado_id === emp.id);
      const totalRecargos = recargosEmpleado?.reduce((sum, r) => sum + parseFloat(r.valor_calculado), 0);
      return {
        ...emp,
        total_recargos: totalRecargos,
        total_pagar: parseFloat(emp.salario_base) + totalRecargos
      };
    });
  };

  const nomina = calcularNomina();
  const totalGeneral = nomina?.reduce((sum, n) => sum + n.total_pagar, 0);

  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Nómina del Mes</h2>

      <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                Empleado
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                Cargo
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                Salario Base
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                Recargos
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                Total a Pagar
              </th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {nomina?.map((emp) => (
              <tr key={emp.id}>
                <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                  {emp.nombre}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">{emp.cargo}</td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  ${parseFloat(emp.salario_base).toLocaleString("es-CO")}
                </td>
                <td className="px-6 py-4 text-sm text-green-600 font-semibold">
                  ${emp.total_recargos.toLocaleString("es-CO")}
                </td>
                <td className="px-6 py-4 text-sm text-blue-600 font-bold">
                  ${emp.total_pagar.toLocaleString("es-CO")}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot className="bg-blue-50">
            <tr>
              <td
                colSpan="4"
                className="px-6 py-4 text-right text-lg font-bold text-gray-900"
              >
                TOTAL NÓMINA:
              </td>
              <td className="px-6 py-4 text-lg font-bold text-blue-600">
                ${totalGeneral.toLocaleString("es-CO")}
              </td>
            </tr>
          </tfoot>
        </table>
        {nomina.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No hay empleados en la nómina.
          </div>
        )}
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          💡 <strong>Nota:</strong> Esta nómina incluye todos los recargos
          calculados automáticamente según los turnos registrados. El sistema
          detecta automáticamente el tipo de recargo según el día de la semana,
          festivos y horarios.
        </p>
      </div>
    </div>
  );
}
