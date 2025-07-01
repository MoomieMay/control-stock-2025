import React, { useState } from 'react';
import { FaFileAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../services/supabaseClient';
import ReportePDF from '../ReportePDF';
import { ToastContainer, toast } from 'react-toastify';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { pdf } from '@react-pdf/renderer';
import '../../styles/Dashboard.css';

const Reportes = () => {
  const [reporteData, setReporteData] = useState(null);
  const navigate = useNavigate();

  const abrirPDFEnPestana = async () => {
    const blob = await pdf(<ReportePDF data={reporteData} />).toBlob();
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const fechaInicio = e.target.elements.fechaInicio.value;
    const fechaFin = e.target.elements.fechaFin.value;
    const tipoMovimiento = e.target.elements.tipoMovimiento.value;

    try {
      const { data, error } = await supabase
        .from('movimientos')
        .select('*')
        .gte('fecha_movimiento', fechaInicio)
        .lte('fecha_movimiento', fechaFin)
        .eq('tipo_movimiento', tipoMovimiento);

      if (error) {
        console.error('Error al consultar Supabase:', error);
        return;
      }

      if (data.length === 0) {
        toast.error('No se encontraron movimientos en ese rango.');
        return;
      }

      // Obtener ids únicos
      const idsNomencladores = [...new Set(data.map(m => m.id_nomenclador))];
      const idsProveedores = [...new Set(data.map(m => m.id_proveedor).filter(Boolean))];
      const idsUsuarios = [...new Set(data.map(m => m.id_usuario).filter(Boolean))];

      // Consultas en lote
      const { data: nomencladoresTodos } = await supabase
        .from('nomencladores')
        .select('id_nomenclador, nombre_bien, nomenclador')
        .in('id_nomenclador', idsNomencladores);

      const { data: proveedoresTodos } = await supabase
        .from('proveedores')
        .select('id_proveedor, nombre_proveedor')
        .in('id_proveedor', idsProveedores);

      const { data: usuariosTodos } = await supabase
        .from('usuario_entrega')
        .select('id_usuarioe, nombre_usuario, legajo')
        .in('id_usuarioe', idsUsuarios);

      // Diccionarios para acceso rápido
      const dicNomencladores = Object.fromEntries(
        nomencladoresTodos.map(n => [n.id_nomenclador, n])
      );

      const dicProveedores = Object.fromEntries(
        proveedoresTodos.map(p => [p.id_proveedor, p])
      );

      const dicUsuarios = Object.fromEntries(
        usuariosTodos.map(u => [u.id_usuarioe, u])
      );

      // Combinar datos
      const movimientosConNombres = data.map(mov => {
        const nom = dicNomencladores[mov.id_nomenclador] || {};
        const prov = dicProveedores[mov.id_proveedor] || {};
        const usuario = dicUsuarios[mov.id_usuario] || 'Sin usuario asignado';
        return {
          ...mov,
          nombre_item: nom.nombre_item || 'Desconocido',
          nomenclador: nom.nomenclador || 'Desconocido',
          nombre_proveedor: prov.nombre_proveedor || 'Sin proveedor',
          usuario: usuario
        };
      });
      const datosReporte = {
        data: movimientosConNombres,
        datafront: {
          fecha_inicio: fechaInicio,
          fecha_fin: fechaFin,
          tipo: tipoMovimiento,
        }
      };

      setReporteData(datosReporte);
    } catch (err) {
      toast.error('Ocurrió un error al generar el reporte.');
    }
  };

  return (
    <div className='container mt-1'>
      <h4 className="text-secondary border-bottom d-md-flex justify-content-md-end mb-3">Reportes de Movimientos</h4>
      <form className='row' onSubmit={handleSubmit}>
        <div className="col-md-6 mb-3">
          <label htmlFor="fechaInicio" className="form-label">Fecha Inicio</label>
          <input type="date" className="form-control" id="fechaInicio" required />
        </div>
        <div className="col-md-6 mb-3">
          <label htmlFor="fechaFin" className="form-label">Fecha Fin</label>
          <input type="date" className="form-control" id="fechaFin" required />
        </div>
        <div className="mb-3">
          <label htmlFor="tipoMovimiento" className="form-label">Tipo de Movimiento</label>
          <select className="form-select" id="tipoMovimiento" required>
            <option value="Transferencia">Transferencia</option>
            <option value="Ingreso">Ingreso</option>
            <option value="Entrega">Entrega</option>
          </select>
        </div>
        <div className='col-12 d-md-flex justify-content-md-end'>
          <button type="submit" className="btn btn-dark p-2"><FaFileAlt className="me-2" />Generar Reporte</button>
        </div>
      </form>

      {reporteData && (
        <div className="mt-3">
          <button onClick={abrirPDFEnPestana} className="btn btn-success">
            <FaFileAlt className="me-2" />Ver Reporte
          </button>
        </div>
      )}
      <ToastContainer />
    </div>
  );
};

export default Reportes;