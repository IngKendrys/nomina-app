"use client"
import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import NominaPage from './nomina/page';
import Sidebar from './components/sidebar';
import EmpleadoPage from './empleado/page';
import RecargoPage from './recargo/registro/page';
import ReportePage from './recargo/reporte/page';

export default function SistemaNomina() {
  const [vista, setVista] = useState('empleados');
  const [loading, setLoading] = useState(false);
  const [empleados, setEmpleados] = useState([]);
  const [menuRecargosAbierto, setMenuRecargosAbierto] = useState(false);
  const [subVistaRecargos, setSubVistaRecargos] = useState('');
  const [recargos, setRecargos] = useState([]);
  const [filtroMes, setFiltroMes] = useState('');
  const [periodoReporte, setPeriodoReporte] = useState('mes');

  const cargarEmpleados = async () => {
    const { data, error } = await supabase
      .from("empleados")
      .select("*")
      .order("nombre");
    if (!error) setEmpleados(data || []);
  };
    const cargarRecargos = async () => {
    const { data, error } = await supabase
      .from("recargos")
      .select(
        `
            *,
            empleados (nombre)
          `
      )
      .order("fecha", { ascending: false });
    if (!error) setRecargos(data || []);
  };
  useEffect(() => {
    cargarEmpleados();
    cargarRecargos();
  }, []);

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar setVista={setVista} empleados={empleados} vista={vista} menuRecargosAbierto={menuRecargosAbierto} setMenuRecargosAbierto={setMenuRecargosAbierto} setSubVistaRecargos={setSubVistaRecargos} subVistaRecargos={subVistaRecargos}/>

      <div className="flex-1 overflow-auto p-8">
        {vista === 'empleados' && (
          <EmpleadoPage loading={loading} setLoading={setLoading} setEmpleados={setEmpleados} empleados={empleados} cargarEmpleados={cargarEmpleados}/>
        )}

        {subVistaRecargos === 'registrar' && (
          <RecargoPage loading={loading} empleados={empleados} recargos={recargos} cargarRecargos={cargarRecargos} setLoading={setLoading}/>
        )}

        {subVistaRecargos === 'reporte' && (
          <ReportePage filtroMes={filtroMes} setFiltroMes={setFiltroMes} recargos={recargos} empleados={empleados} periodoReporte={periodoReporte} setPeriodoReporte={setPeriodoReporte}/>
        )}

        {vista === 'nomina' && (
          <NominaPage empleados={empleados} recargos={recargos}/>
        )}
      </div>
    </div>
  );
}