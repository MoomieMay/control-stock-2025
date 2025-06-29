// src/pages/Admin/Dashboard.jsx
import React, { useEffect, useState } from 'react'
import { Link, Routes, Route, useNavigate } from 'react-router-dom'
import Inicio from './Inicio'
import ReportesAdmin from './Reportes'
import Instructivos from './Instructivos'
import Ayuda from './Ayuda'
import Transferir from './Transferir'
import Entregar from '../EntregarMaterial'
import Agregar from '../AgregarMaterial'
import Header from '../../components/Header'
import { supabase } from '../../services/supabaseClient'
import '../../styles/Dashboard.css' 

const Dashboard = () => {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [datos, setDatos] = useState([])
  const navigate = useNavigate()

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed)
  }

  useEffect(() => {
    fetchDatos()
  }, [])

  const fetchDatos = async () => {
    let { data, error } = await supabase
      .from('materiales')  // Ejemplo tabla materiales, cambiala por la que uses
      .select('*')

    if (error) {
      console.error(error)
    } else {
      setDatos(data)
    }
  }

  return (
    <div className="d-flex">
      <nav className={`sidebar bg-dark ${isCollapsed ? 'collapsed' : ''}`}>
        {/* sidebar top */}
        <div className="sidebar-top p-3 d-flex align-items-center justify-content-start">
          <div className="d-flex align-items-center">
            <button onClick={toggleSidebar} className="btn btn-dark">
              ☰
            </button>
          </div>
          {!isCollapsed && <h5 className="m-0 ms-3 text-white fw-bolder">Menu</h5>}
        </div>
        {/* sidebar middle */}
        <div className="sidebar-middle p-3">
          <ul className="nav flex-column">
            <li className="nav-item">
              <Link className="nav-link text-white" to="/admin/">
                Inicio
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-white" to="/admin/reportes">
                Reportes
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-white" to="/admin/instructivos">
                Instructivos
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-white" to="/admin/ayuda">
                Ayuda
              </Link>
            </li>
          </ul>
        </div>
        {/* sidebar bottom */}
        <div className="sidebar-bottom p-3 ms-3">
          <button
            className="btn btn-danger"
            onClick={async () => {
              await supabase.auth.signOut()
              navigate('/login')
            }}
          >
            Salir
          </button>
        </div>
      </nav>

      <div className="main-content d-flex flex-column flex-grow-1">
        <Header username="Administrador" />
        <main className="p-4 flex-grow-1">
          <Routes>
            <Route path="/" element={<Inicio datos={datos} />} />
            <Route path="reportes" element={<ReportesAdmin />} />
            <Route path="instructivos" element={<Instructivos />} />
            <Route path="ayuda" element={<Ayuda />} />
            <Route path="transferir" element={<Transferir />} />
            <Route path="entregar" element={<Entregar />} />
            <Route path="agregar" element={<Agregar />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}

export default Dashboard
