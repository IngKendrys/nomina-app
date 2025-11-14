import { Users, DollarSign, Calculator, ChevronDown, Clock, FileText } from 'lucide-react';

export default function Sidebar({ setVista, empleados, vista, setMenuRecargosAbierto, menuRecargosAbierto, subVistaRecargos, setSubVistaRecargos}) {
    return (
        <div className="w-64 bg-blue-900 text-white p-6 shrink-0">
            <h1 className="text-2xl font-bold mb-8">Sistema Nómina</h1>

            <nav className="space-y-2">
                <button
                    onClick={() => {setMenuRecargosAbierto(!menuRecargosAbierto), setVista("empleados"), setSubVistaRecargos('')}}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg transition ${vista === "empleados" ? "bg-blue-800" : "hover:bg-blue-800"
                        }`}
                >
                    <Users size={20} />
                    <span>Empleados</span>
                    <span className="ml-auto bg-blue-700 px-2 py-1 rounded text-xs">
                        {empleados.length}
                    </span>
                </button>

                <button
                    onClick={() => {
                            setMenuRecargosAbierto(!menuRecargosAbierto);
                    }}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg transition ${vista === 'recargos' ? 'bg-blue-800' : 'hover:bg-blue-800'
                        }`}
                >
                    <Calculator size={20} />
                    <span>Recargos</span>
                    <ChevronDown
                        size={16}
                        className={`ml-auto transition-transform ${menuRecargosAbierto ? 'rotate-180' : ''}`}
                    />
                </button>

                {menuRecargosAbierto && (
                    <div className="ml-4 mt-2 space-y-1">
                        <button
                            onClick={() => {setSubVistaRecargos('registrar'), setVista('recargos')}}
                            className={`w-full text-left px-3 py-2 rounded text-sm transition ${subVistaRecargos === 'registrar' ? 'bg-blue-700' : 'hover:bg-blue-800'
                                }`}
                        >
                            <Clock size={16} className="inline mr-2" />
                            Registrar Turnos
                        </button>
                        <button
                            onClick={() => {setSubVistaRecargos('reporte'), setVista('recargos')}}
                            className={`w-full text-left px-3 py-2 rounded text-sm transition ${subVistaRecargos === 'reporte' ? 'bg-blue-700' : 'hover:bg-blue-800'
                                }`}
                        >
                            <FileText size={16} className="inline mr-2" />
                            Reporte de Recargos
                        </button>
                    </div>
                    )}

                        {/* <button
                            onClick={() => setVista("nomina")}
                            className={`w-full flex items-center gap-3 p-3 rounded-lg transition ${vista === "nomina" ? "bg-blue-800" : "hover:bg-blue-800"
                                }`}
                        >
                            <DollarSign size={20} />
                            <span>Nómina</span>
                        </button> */}
                    </nav>
    </div>
    );
}
