import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { FaExchangeAlt } from 'react-icons/fa'
import { Document, Page, Text, Image, View, StyleSheet, BlobProvider } from '@react-pdf/renderer'
import { ToastContainer, toast } from 'react-toastify'
import { supabase } from '../../services/supabaseClient'
import 'react-toastify/dist/ReactToastify.css'

const Transferir = () => {
  const location = useLocation()
  const { item } = location.state || {}
  const navigate = useNavigate()

  const [cantidad, setCantidad] = useState('')
  const [destino, setDestino] = useState('')
  const [generarPDF, setGenerarPDF] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Validación simple
    if (!cantidad || !destino) {
      toast.error('Completá todos los campos.')
      return
    }

    const { error } = await supabase.from('transferencias').insert([{
      cantidad: parseInt(cantidad),
      origen: item.nombre_deposito,
      nomenclador: item.nomenclador,
      nombre_item: item.nombre_bien,
      destino: destino,
      bien_id: item.ID_bien,
      fecha: new Date().toISOString()
    }])

    if (error) {
      console.error(error)
      toast.error('Error al registrar la transferencia')
    } else {
      toast.success(
        <div>
          <div>Transferencia registrada correctamente.</div>
          <div>En espera de confirmación del receptor.</div>
        </div>
      )
      setGenerarPDF(true)
    }
  }

  const currentDate = new Date().toLocaleString()

  const MyDocument = () => (
    <Document>
      <Page style={styles.page}>
        <View style={styles.container}>
          <Image src="/logo.png" style={styles.logo} />
          <Text style={styles.header}>Comprobante de Transferencia</Text>
          <Text style={styles.subtitle}>Fecha y Hora de Entrega:</Text>
          <Text style={styles.text}>{currentDate}</Text>
          <Text style={styles.subtitle}>Item:</Text>
          <Text style={styles.text}>({item.nomenclador}) {item.nombre_bien}</Text>
          <Text style={styles.subtitle}>Cantidad:</Text>
          <Text style={styles.text}>{cantidad}</Text>
          <Text style={styles.subtitle}>Origen:</Text>
          <Text style={styles.text}>{item.nombre_deposito}</Text>
          <Text style={styles.subtitle}>Destino:</Text>
          <Text style={styles.text}>{destino}</Text>
        </View>
      </Page>
    </Document>
  )

  const handleDownloadClick = (url) => {
    window.open(url, '_blank')
    setTimeout(() => {
      navigate('/admin')
    }, 500)
  }

  return (
    <div className="container mt-1">
      <h4 className="text-secondary border-bottom d-md-flex justify-content-md-end mb-3">Transferir Item</h4>
      <form className='row' onSubmit={handleSubmit}>
        <div className="col-md-2 mb-3">
          <label htmlFor="nomenclador" className="form-label">Nomenclador</label>
          <input disabled type="text" className="form-control" id="nomenclador" value={item.nomenclador} />
        </div>
        <div className="col-md-6 mb-3">
          <label htmlFor="nombreItem" className="form-label">Nombre del Item</label>
          <input disabled type="text" className="form-control" id="nombreItem" value={item.nombre_bien} />
        </div>
        <div className="col-md-4 mb-3">
          <label className="form-label">Origen</label>
          <input disabled type="text" className="form-control" value={item.nombre_deposito} />
        </div>
        <div className="col-md-6 mb-3">
          <label htmlFor="cantidad" className="form-label">Cantidad</label>
          <input type="number" className="form-control" id="cantidad" value={cantidad} onChange={(e) => setCantidad(e.target.value)} required />
        </div>
        <div className="col-md-6 mb-3">
          <label className="form-label">Destino</label>
          <select className="form-select" value={destino} onChange={(e) => setDestino(e.target.value)} required>
            <option value="">Seleccionar Destino</option>
            <option value="Mantenimiento">Mantenimiento</option>
            <option value="PAM">PAM</option>
            <option value="Laboratorio de Química">Laboratorio de Química</option>
            <option value="Cantina">Cantina</option>
          </select>
        </div>
        <div className='col-12 d-md-flex justify-content-md-end'>
          <button type="submit" className="btn btn-primary"><FaExchangeAlt className="me-2" />Transferir</button>
        </div>
      </form>

      <ToastContainer />

      {generarPDF && (
        <div className="col-12 d-md-flex justify-content-md-end mt-3">
          <BlobProvider document={<MyDocument />}>
            {({ url, loading, error }) =>
              loading ? 'Generando PDF...' : (
                <a href="#" onClick={() => handleDownloadClick(url)} download="transferencia_item.pdf">
                  Descargar PDF
                </a>
              )
            }
          </BlobProvider>
        </div>
      )}
    </div>
  )
}

const styles = StyleSheet.create({
  page: {
    padding: 25,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  container: {
    border: '1px solid black',
    padding: 20,
    width: '60%',
    height: '50%',
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
})

export default Transferir
