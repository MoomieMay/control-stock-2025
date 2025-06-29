import React from 'react';
import { FaFileAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../services/supabaseClient'; 
import '../../styles/Dashboard.css'; // Asegúrate de tener este archivo CSS

const Reportes = () => {
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const fechaInicio = e.target.elements.fechaInicio.value;
    const fechaFin = e.target.elements.fechaFin.value;
    const tipoMovimiento = e.target.elements.tipoMovimiento.value;

    console.log('Filtro:', { fechaInicio, fechaFin, tipoMovimiento });

     try {
      const { data, error } = await supabase
        .from('movimientos')
        .select('*')
        .gte('fecha_mov', fechaInicio)
        .lte('fecha_mov', fechaFin)
        .eq('tipo_mov', tipoMovimiento);

      if (error) {
        console.error('Error al consultar Supabase:', error);
        return;
      }

      if (data.length === 0) {
        console.log('No se encontraron movimientos en ese rango.');
      } else {
        console.log('Datos obtenidos de Supabase:', data);
        // Acá podrías generar PDF, redirigir, etc.
      }
    } catch (err) {
      console.error('Error inesperado:', err);
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
            <option value="transferencia">Transferencia</option>
            <option value="ingreso">Ingreso</option>
            <option value="entrega">Entrega</option>
          </select>
        </div>
        <div className='col-12 d-md-flex justify-content-md-end'>
          <button type="submit" className="btn btn-dark p-2"><FaFileAlt className="me-2" />Generar Reporte</button>
        </div>
      </form>
    </div>
  );
};

export default Reportes;