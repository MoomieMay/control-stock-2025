import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaPlus } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { supabase } from '../services/supabaseClient';

const Agregar = () => {
  const navigateTo = useNavigate();

  const [cantidad, setCantidad] = useState('');
  const [cantidadM, setCantidadM] = useState('');
  const [deposito, setDeposito] = useState('');
  const [idNomenclador, setIdNomenclador] = useState('');
  const [nombreBien, setNombreBien] = useState('');
  const [tipoCompra, setTipoCompra] = useState('');
  const [cuit, setCuit] = useState('');
  const [proveedor, setProveedor] = useState('');
  const [factura, setFactura] = useState('');

  const [nomencladores, setNomencladores] = useState([]);
  const [proveedores, setProveedores] = useState([]);

  const [isDisabledProv, setIsDisabledProv] = useState(false);

  // Cargar nomencladores y proveedores al inicio
  useEffect(() => {
    const cargarDatos = async () => {
      const { data: noms, error: errorNoms } = await supabase.from('nomencladores').select('*');
      if (errorNoms) console.error('Error cargando nomencladores:', errorNoms);
      else setNomencladores(noms);

      const { data: provs, error: errorProvs } = await supabase.from('proveedores').select('*');
      if (errorProvs) console.error('Error cargando proveedores:', errorProvs);
      else setProveedores(provs);
    };

    cargarDatos();
  }, []);

  const handleNomencladorChange = (e) => {
    const selectedId = e.target.value;
    setIdNomenclador(selectedId);
    const nom = nomencladores.find(n => n.id_nomenclador.toString() === selectedId);
    setNombreBien(nom ? nom.nombre_bien : '');
  };

  const handleProveedorChange = (e) => {
    const nombre = e.target.value;
    setProveedor(nombre);
    const prov = proveedores.find(p => p.nombre_proveedor === nombre);
    if (prov) {
      setCuit(prov.cuit_proveedor);
      setIsDisabledProv(true);
    } else {
      setCuit('');
      setIsDisabledProv(false);
    }
  };

  const handleDepositoChange = async (e) => {
    const nuevoDeposito = e.target.value;
    setDeposito(nuevoDeposito);

    if (idNomenclador) {
      const { data, error } = await supabase
        .from('bienes')
        .select('cantidad_minima')
        .eq('nombre_deposito', nuevoDeposito)
        .eq('id_nomenclador', idNomenclador)
        .maybeSingle();

      if (error) {
        console.error('Error obteniendo cantidad mínima:', error);
      } else if (data) {
        setCantidadM(data.cantidad_minima);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { error } = await supabase.from('bienes').insert([{
      id_nomenclador: parseInt(idNomenclador),
      cantidad_bien: parseInt(cantidad),
      cantidad_minima: parseInt(cantidadM),
      tipo_pedidos: tipoCompra,
      nombre_deposito: deposito
    }]);

    if (error) {
      toast.error('Error al agregar el ítem.');
      console.error(error);
    } else {
      toast.success('Ítem agregado correctamente.', {
        onClose: () => navigateTo('/admin')
      });
      limpiarFormulario();
    }
  };

  const limpiarFormulario = () => {
    setCantidad('');
    setCantidadM('');
    setDeposito('');
    setIdNomenclador('');
    setNombreBien('');
    setTipoCompra('');
    setCuit('');
    setProveedor('');
    setFactura('');
    setIsDisabledProv(false);
  };

  return (
    <div className="container mt-1">
      <h4 className="text-secondary border-bottom d-md-flex justify-content-md-end mb-3">Agregar Ítem</h4>
      <form className="row" onSubmit={handleSubmit}>
        <div className="col-md-3 mb-3">
          <label className="form-label">Nomenclador</label>
          <select className="form-select" value={idNomenclador} onChange={handleNomencladorChange} required>
            <option value="">Seleccione...</option>
            {nomencladores.map(n => (
              <option key={n.id_nomenclador} value={n.id_nomenclador}>
                {n.nomenclador}
              </option>
            ))}
          </select>
        </div>

        <div className="col-md-6 mb-3">
          <label className="form-label">Nombre del Bien</label>
          <input type="text" className="form-control" value={nombreBien} disabled />
        </div>

        <div className="col-md-3 mb-3">
          <label className="form-label">Cantidad Mínima</label>
          <input type="number" className="form-control" value={cantidadM} onChange={(e) => setCantidadM(e.target.value)} required />
        </div>

        <div className="col-md-3 mb-3">
          <label className="form-label">Cantidad a Ingresar</label>
          <input type="number" className="form-control" value={cantidad} onChange={(e) => setCantidad(e.target.value)} required />
        </div>

        <div className="col-md-4 mb-3">
          <label className="form-label">Tipo de Compra</label>
          <select className="form-select" value={tipoCompra} onChange={(e) => setTipoCompra(e.target.value)} required>
            <option value="">Seleccione una opción</option>
            <option value="Caja Chica">Caja Chica</option>
            <option value="Proceso De Compra">Proceso de Compra</option>
          </select>
        </div>

        <div className="col-md-5 mb-3">
          <label className="form-label">Depósito</label>
          <select className="form-select" value={deposito} onChange={handleDepositoChange} required>
            <option value="">Seleccione un depósito</option>
            <option value="Mantenimiento">Mantenimiento</option>
            <option value="PAM">PAM</option>
            <option value="Laboratorio de Quimica">Laboratorio de Quimica</option>
            <option value="Cantina">Cantina</option>
          </select>
        </div>

        <div className="col-md-3 mb-3">
          <label className="form-label">CUIT Proveedor</label>
          <input type="text" className="form-control" value={cuit} disabled={isDisabledProv} onChange={(e) => setCuit(e.target.value)} required />
        </div>

        <div className="col-md-6 mb-3">
          <label className="form-label">Proveedor</label>
          <input type="text" className="form-control" value={proveedor} onChange={handleProveedorChange} required />
        </div>

        <div className="col-md-3 mb-3">
          <label className="form-label">Número de Factura</label>
          <input type="text" className="form-control" value={factura} onChange={(e) => setFactura(e.target.value)} />
        </div>

        <div className="col-12 d-md-flex justify-content-md-end">
          <button type="submit" className="btn btn-primary">
            <FaPlus className="me-2" />Agregar
          </button>
        </div>
      </form>
      <ToastContainer />
    </div>
  );
};

export default Agregar;
