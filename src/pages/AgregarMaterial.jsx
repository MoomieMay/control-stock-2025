import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaPlus } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { supabase } from '../services/supabaseClient';
import { actualizarBien, agregarBien, agregarMovimiento, existeCantMinima } from '../services/bienes';

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

  // Para el armado del Select de depósitos
  const [depositos, setDepositos] = useState([]);

  const [isDisabledProv, setIsDisabledProv] = useState(false);
  const [isCantidadMDisabled, setIsCantidadMDisabled] = useState(false);

  //Para modal de confirmación
  const [showModal, setShowModal] = useState(false);
  const [datosPendientes, setDatosPendientes] = useState(null);
  const [datosNuevos, setDatosNuevos] = useState(null);

  // Cargar nomencladores y proveedores al inicio
  useEffect(() => {
    const cargarDatos = async () => {
      const { data: noms, error: errorNoms } = await supabase.from('nomencladores').select('*');
      if (errorNoms) console.error('Error cargando nomencladores:', errorNoms);
      else setNomencladores(noms);

      const { data: provs, error: errorProvs } = await supabase.from('proveedores').select('*');
      if (errorProvs) console.error('Error cargando proveedores:', errorProvs);
      else setProveedores(provs);

      const { data: deps, error: errorDeps } = await supabase.from('depositos').select('*');
      if (errorDeps) console.error('Error cargando depósitos:', errorDeps);
      else setDepositos(deps);
    };

    cargarDatos();
  }, []);

  // Verifica si el CUIT ingresado es válido
  const esCUITValido = (cuit) => {
    const regex = /^\d{2}-\d{7,8}-\d{1}$/;
    return regex.test(cuit);
  };

  // Verifica si existe el bien con la nomenclador y el depósito seleccionados
  // y actualiza la cantidad mínima si es necesario
  const comprobarCantidadMinima = async (deposito, nomenclador) => {

    if (!nomenclador || !deposito) {
      setCantidadM('');
      setIsCantidadMDisabled(false);
      return;
    }

    try {
      const { data, error } = await existeCantMinima(deposito, nomenclador);

      if (error) {
        console.error('Error al verificar cantidad mínima:', error);
        toast.error('Error al verificar cantidad mínima:');
        setCantidadM('');
        setIsCantidadMDisabled(false);
      } else if (data) {
        setCantidadM(data.cantidad_minima);
        setIsCantidadMDisabled(true);
      } else {
        setCantidadM('');
        setIsCantidadMDisabled(false);
      }
    } catch (err) {
      console.error('Error al verificar cantidad mínima:', err);
      toast.error('Error al verificar cantidad mínima:');
      setCantidadM('');
      setIsCantidadMDisabled(false);
    }
  };
  // Maneja el cambio en el select de nomencladores
  const handleNomencladorChange = (e) => {
    const selectedId = e.target.value;
    setIdNomenclador(selectedId);
    const nom = nomencladores.find(n => n.id_nomenclador.toString() === selectedId);
    setNombreBien(nom ? nom.nombre_bien : '');
    comprobarCantidadMinima(deposito, selectedId);

  };

  const handleCUITChange = (e) => {
    const cuitIngresado = e.target.value;
    setCuit(cuitIngresado);

    if (!esCUITValido(cuitIngresado)) {
      // Si el CUIT aún no tiene el formato completo, no buscar
      setProveedor('');
      return;
    }

    const prov = proveedores.find(p => p.cuit_proveedor === cuitIngresado);

    if (prov) {
      setProveedor(prov.nombre_proveedor);
    } else {
      setProveedor('');
      toast.error('No se encontró un proveedor con ese CUIT.');
    }
  };

  // Maneja el cambio en el select de depósitos
  const handleDepositoChange = async (e) => {
    const nuevoDeposito = e.target.value;
    setDeposito(nuevoDeposito);
    comprobarCantidadMinima(nuevoDeposito, idNomenclador);
  };

  // Maneja el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const { data: existingItem, error: checkError } = await supabase
        .from('bienes')
        .select('id_nomenclador, id_deposito')
        .eq('id_nomenclador', parseInt(idNomenclador))
        .eq('id_deposito', parseInt(deposito));

      if (checkError) {
        toast.error('Error al verificar el bien existente.');
        return;
      }

      const bienPayload = {
        id_nomenclador: parseInt(idNomenclador),
        cantidad_bien: parseInt(cantidad),
        cantidad_minima: parseInt(cantidadM),
        tipo_pedidos: tipoCompra,
        id_deposito: parseInt(deposito),
        tipo_movimiento: 'Ingreso',
        cuit_proveedor: cuit,
        numero_factura: factura,
      };

      if (existingItem && existingItem.length > 0) {
        setDatosPendientes(bienPayload);
        setShowModal(true);
      } else {
        const { data: bienInsertado, error: errorBien } = await agregarBien(bienPayload);
        if (errorBien || !bienInsertado) {
          toast.error('Error al agregar el ítem.');
          return;
        }

        const { data: movInsertado, error: errorMov } = await agregarMovimiento({
          ...bienPayload,
          id_nomenclador: bienInsertado.id_nomenclador,
          id_deposito: bienInsertado.id_deposito
        });

        if (errorMov || !movInsertado) {
          // Rollback manual: eliminar el bien insertado
          await supabase
            .from('bienes')
            .delete()
            .eq('id_nomenclador', bienInsertado.id_nomenclador)
            .eq('id_deposito', bienInsertado.id_deposito);

          toast.error('Se agregó el bien, pero falló el movimiento. Se canceló el ingreso.');
          return;
        }

        toast.success('Ítem agregado correctamente.', {
          onClose: () => navigateTo('/admin'),
        });
        limpiarFormulario();
      }

    } catch (e) {
      console.error('Error inesperado:', e);
      toast.error('Error inesperado al agregar el ítem.');
    }
  };

  // Limpia el formulario después de agregar o actualizar un ítem
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

  // Verifica si el formulario es válido antes de enviar
  const esFormularioValido = () => {
    return (
      cantidad !== '' &&
      cantidadM !== '' &&
      deposito !== '' &&
      idNomenclador !== '' &&
      tipoCompra !== '' &&
      cuit !== '' &&
      proveedor !== ''
    );
  };

  // Función para actualizar el ítem existente
  const actBien = async (datos) => {
    try {
      actualizarBien(datos);
      agregarMovimiento(datos);
    }
    catch (error) {
      toast.error('Error al actualizar el ítem.');
      console.error(error);
    } finally {
      setShowModal(false);
      limpiarFormulario();
      toast.success('Ítem actualizado correctamente.', {
        onClose: () => navigateTo('/admin')
      });
    }
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
          <input type="number" className="form-control" value={cantidadM} onChange={(e) => setCantidadM(e.target.value)} required disabled={isCantidadMDisabled} />
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
            {depositos.map(dep => (
              <option key={dep.id_deposito} value={parseInt(dep.id_deposito)}>
                {dep.nombre_deposito}
              </option>
            ))}
          </select>
        </div>

        <div className="col-md-3 mb-3">
          <label className="form-label">CUIT Proveedor</label>
          <input type="text" className="form-control" value={cuit} disabled={isDisabledProv} onChange={handleCUITChange} required />
        </div>

        <div className="col-md-6 mb-3">
          <label className="form-label">Proveedor</label>
          <input type="text" className="form-control" value={proveedor} onChange={(e) => setProveedor(e.target.value)} disabled required />
        </div>

        <div className="col-md-3 mb-3">
          <label className="form-label">Número de Factura</label>
          <input type="text" className="form-control" value={factura} onChange={(e) => setFactura(e.target.value)} />
        </div>

        <div className="col-12 d-md-flex justify-content-md-end">
          <button type="submit" className="btn btn-primary" disabled={!esFormularioValido()}>
            <FaPlus className="me-2" />Agregar
          </button>
        </div>
      </form>
      <ToastContainer />
      {showModal && (
        <div className="modal show fade d-block" tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirmar actualización</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <div className="modal-body">
                <p>El ítem ya existe en este depósito. ¿Deseás actualizar los valores?</p>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancelar</button>
                <button className="btn btn-primary" onClick={() => actBien(datosPendientes)}>Actualizar</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Agregar;
