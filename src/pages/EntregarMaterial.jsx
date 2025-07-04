import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaDolly } from 'react-icons/fa';
import { supabase } from '../services/supabaseClient';
import { Document, Page, Text, View, StyleSheet, Image, BlobProvider } from '@react-pdf/renderer';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { entregarBien } from '../services/entregas';

const Entregar = () => {
  const location = useLocation();
  const { item } = location.state || {};
  const navigate = useNavigate();

  const [cantidad, setCantidad] = useState('');
  const [legajo, setLegajo] = useState('');
  const [IDUsuarioE, setIDUsuarioE] = useState('');
  const [nombreReceptor, setNombreReceptor] = useState('');
  const [itemsSugeridos, setItemsSugeridos] = useState([]);
  const [generarPDF, setGenerarPDF] = useState(false);

  const formularioValido = cantidad && IDUsuarioE && nombreReceptor;

  // Enviar entrega a backend usando supabase
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!cantidad || !nombreReceptor || !legajo) {
      toast.error('Por favor, completa todos los campos antes de entregar.');
      return;
    }
    console.log(item)
    const result = await entregarBien({
      nomenclador: item.nomenclador,
      cantidad_entregada: parseInt(cantidad),
      nro_factura: 'interno',
      nombre_deposito: item.nombre_deposito,
      id_bien: parseInt(item.ID_bien),
      cantidad_bien: parseInt(item.cantidad_bien),
      legajo_usuario: parseInt(legajo),
    });

    if (result.success) {
      toast.success('Entrega registrada con éxito.');
      setGenerarPDF(true);
    } else {
      toast.error(result.error || 'Error al registrar la entrega.');
    }
  };

  // Buscar usuarios receptores por legajo
  const buscarUsuarios = async (nombre) => {
    if (!nombre) {
      setItemsSugeridos([]);
      return;
    }
    const { data, error } = await supabase
      .from('usuario_entrega') // Cambia por tu tabla de usuarios receptores
      .select('id_usuarioe, nombre_usuario, legajo')
      .ilike('nombre_usuario', `%${nombre}%`)
      .limit(5);

    if (error) {
      console.error(error);
      toast.error('Error buscando receptores');
    } else {
      setItemsSugeridos(data || []);
    }
  };

  const handleNombreChange = (e) => {
    const valor = e.target.value;
    setNombreReceptor(valor);
    if (!valor) {
      // Si el campo se borra, limpiar legajo y usuario
      setLegajo('');
      setIDUsuarioE('');
      setItemsSugeridos([]);
      return;
    }
    buscarUsuarios(valor);
  };

  const seleccionarUsuario = (usuario) => {
    setNombreReceptor(usuario.nombre_usuario);
    setLegajo(usuario.legajo);
    setIDUsuarioE(usuario.id_usuarioe);
    setItemsSugeridos([]);
  };

  const limpiarFormulario = () => {
    setCantidad('');
    setLegajo('');
    setIDUsuarioE('');
    setNombreReceptor('');
    setItemsSugeridos([]);
    setGenerarPDF(false);
  };

  const currentDate = new Date().toLocaleString();

  const MyDocument = () => (
    <Document>
      <Page style={styles.page}>
        <View style={styles.container}>
          <Image src="/logo.png" style={styles.logo} />
          <Text style={styles.header} fixed>
            Comprobante de Entrega
          </Text>

          <Text style={styles.subtitle}>Fecha y Hora de Entrega:</Text>
          <Text style={styles.text}>{currentDate}</Text>

          <Text style={styles.subtitle}>Item:</Text>
          <Text style={styles.text}>
            ({item?.nomenclador || ''}) {item?.nombre_bien || ''}
          </Text>

          <Text style={styles.subtitle}>Cantidad:</Text>
          <Text style={styles.text}>{cantidad}</Text>

          <Text style={styles.subtitle}>Origen:</Text>
          <Text style={styles.text}>{item?.nombre_deposito || ''}</Text>

          <Text style={styles.subtitle}>Receptor:</Text>
          <Text style={styles.text}>
            ({legajo}) {nombreReceptor}
          </Text>
        </View>
      </Page>
    </Document>
  );

  const handleDownloadClick = (url) => {
    window.open(url, '_blank');
    setTimeout(() => {
      navigate('/admin');
    }, 500);
  };

  return (
    <div className="container mt-1">
      <h4 className="text-secondary border-bottom d-md-flex justify-content-md-end mb-3">
        Entregar Item
      </h4>
      <form className="row" onSubmit={handleSubmit}>
        <div className="col-md-2 mb-3">
          <label htmlFor="nomenclador" className="form-label">
            Nomenclador
          </label>
          <input
            disabled
            type="text"
            className="form-control"
            id="nomenclador"
            value={item?.nomenclador || ''}
            readOnly
          />
        </div>
        <div className="col-md-6 mb-3">
          <label htmlFor="nombreItem" className="form-label">
            Nombre del Item
          </label>
          <input
            disabled
            type="text"
            className="form-control"
            id="nombreItem"
            value={item?.nombre_bien || ''}
            readOnly
          />
        </div>
        <div className="col-md-4 mb-3">
          <label htmlFor="nombre_deposito" className="form-label">
            Origen
          </label>
          <input
            disabled
            type="text"
            className="form-control"
            id="nombre_deposito"
            value={item?.nombre_deposito || ''}
            readOnly
          />
        </div>

        <div className="col-md-3 mb-3">
          <label htmlFor="cantidad" className="form-label">
            Cantidad
          </label>
          <input
            type="number"
            className="form-control"
            id="cantidad"
            required
            value={cantidad}
            onChange={(e) => setCantidad(e.target.value)}
          />
        </div>
        <div className="col-md-3 mb-3">
          <label htmlFor="legajo" className="form-label">
            Legajo Receptor
          </label>
          <input
            type="text"
            className="form-control"
            id="legajo"
            value={legajo}
            required
            disabled
          />
        </div>
        <div className="col-md-6 mb-3">
          <label htmlFor="nombreReceptor" className="form-label">
            Nombre Receptor
          </label>
          <input
            type="text"
            className="form-control"
            id="nombreReceptor"
            required
            value={nombreReceptor}
            onChange={handleNombreChange}
          />
          {itemsSugeridos.length > 0 && (
            <ul className="list-group">
              {itemsSugeridos.map((usuario) => (
                <li
                  key={usuario.id_usuarioe}
                  className="list-group-item"
                  onClick={() => seleccionarUsuario(usuario)}
                >
                  {usuario.nombre_usuario}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="col-12 d-md-flex justify-content-md-end">
          <button type="submit" className="btn btn-primary" disabled={!formularioValido}>
            <FaDolly className="me-2" />
            Entregar
          </button>
        </div>
      </form>

      <ToastContainer />

      {generarPDF && (
        <div className="col-12 d-md-flex justify-content-md-end mt-3">
          <BlobProvider document={<MyDocument />}>
            {({ url, loading, error }) =>
              loading ? (
                'Generando PDF...'
              ) : (
                <a
                  href="#"
                  onClick={() => handleDownloadClick(url)}
                  download="comprobante_entrega.pdf"
                >
                  Descargar PDF
                </a>
              )
            }
          </BlobProvider>
        </div>
      )}
    </div>
  );
};

const styles = StyleSheet.create({
  page: {
    padding: 25,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  container: {
    border: '1px solid black',
    padding: 20,
    width: '60%',
    margin: 'auto',
  },
  logo: {
    height: 50,
    marginLeft: 'auto',
    marginBottom: 10,
  },
  header: {
    fontSize: 14,
    marginBottom: 10,
    textAlign: 'right',
    textDecoration: 'underline',
    fontWeight: 'bold',
    color: 'gray',
  },
  subtitle: {
    fontSize: 12,
    marginTop: 10,
    marginBottom: 5,
    textDecoration: 'underline',
  },
  text: {
    fontSize: 12,
    marginBottom: 10,
  },
});

export default Entregar;

