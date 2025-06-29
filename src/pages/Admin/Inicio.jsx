// src/pages/Admin/Inicio.jsx
import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FaPlus, FaDolly, FaExchangeAlt } from 'react-icons/fa'
import { obtenerBienes } from '../../services/bienes'

const Inicio = () => {
  const navigate = useNavigate()
  const [datos, setDatos] = useState([])

  useEffect(() => {
    const cargarDatos = async () => {
      const bienes = await obtenerBienes()
      setDatos(bienes)
    }

    cargarDatos()
  }, [])

  const hayStockMinimo = datos.some(item => item.cantidad_bien <= item.cantidad_minima)

  const handleTransferir = (item) => {
    navigate('/admin/transferir', { state: { item } })
  }

  const handleEntregar = (item) => {
    navigate('/admin/entregar', { state: { item } })
  }

  return (
    <div className='container mt-1'>
      <h4 className="text-secondary border-bottom d-md-flex justify-content-md-end mb-3">Listado de Existencias</h4>
      <div className="d-grid gap-2 d-md-flex justify-content-md-end mb-3">
        <Link to='/admin/agregar'>
          <button className="btn btn-dark p-2"><FaPlus className="me-2" />Agregar Nuevo Item</button>
        </Link>
      </div>
      {hayStockMinimo && (
        <span className="text-danger d-block mb-3">Verificar Stock Mínimo de Existencias</span>
      )}
      <table className="table table-responsive table-hover">
        <thead>
          <tr>
            <th>Nomenclador</th>
            <th>Item</th>
            <th>Cantidad en Depósito</th>
            <th>Cantidad Mínima</th>
            <th>Tipo de Pedido</th>
            <th>Depósito</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody className='table-group-divider'>
          {datos.map((item) => {
            const esStockMinimo = item.cantidad_bien <= item.cantidad_minima
            return (
              <tr key={item.ID_bien} className={esStockMinimo ? 'text-danger' : ''}>
                <td>{item.nomenclador}</td>
                <td>{item.nombre_bien}</td>
                <td>{item.cantidad_bien}</td>
                <td>{item.cantidad_minima}</td>
                <td>{item.tipo_pedidos}</td>
                <td>{item.nombre_deposito}</td>
                <td>
                  <button className="btn btn-sm btn-outline-dark me-2" title="Transferir" onClick={() => handleTransferir(item)}><FaExchangeAlt /></button>
                  <button className="btn btn-sm btn-outline-dark" title="Entregar" onClick={() => handleEntregar(item)}><FaDolly /></button>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

export default Inicio
