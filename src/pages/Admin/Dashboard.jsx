// src/pages/Admin/Dashboard.jsx
import React, { useEffect, useState } from 'react'
import { Link, Routes, Route, useNavigate } from 'react-router-dom'
import { FaHome, FaFileAlt, FaInfoCircle, FaSignOutAlt, FaBars, FaQuestionCircle } from 'react-icons/fa'
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

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);


  const toggleSidebar = () => {
    if (!isMobile) {
      setIsCollapsed(!isCollapsed)
    }
  }

  useEffect(() => {
    fetchDatos()
  }, [])

  const fetchDatos = async () => {
    let { data, error } = await supabase
      .from('bienes')
      .select('*')

    if (error) {
      console.error(error)
    } else {
      setDatos(data)
    }
  }

  return (
    <div className="d-flex">
      <nav
        className={`sidebar bg-dark ${isMobile ? '' : isCollapsed ? 'collapsed' : ''
          }`}
      >
        {/* sidebar top */}
        <div className="sidebar-top p-3 ms-3 d-flex align-items-center justify-content-start">
          <div className="d-flex align-items-center">
            <div className="d-flex align-items-center cursor-pointer" onClick={toggleSidebar}>
              <FaBars className="text-white" size={20} />
            </div>
          </div>
          {!isCollapsed && <h5 className="m-0 ms-3 text-white fw-bolder">Menu</h5>}
        </div>
        {/* sidebar middle */}
        <div className="sidebar-middle p-3">
          <ul className="nav flex-column">
            <li className="nav-item">
              <Link className="nav-link text-white" to="/admin/">
                <FaHome className="me-2" />
                <span className={isCollapsed ? 'd-none' : ''}>Inicio</span>
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-white" to="/admin/reportes">
                <FaFileAlt className="me-2" />
                <span className={isCollapsed ? 'd-none' : ''}>Reportes</span>
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-white" to="/admin/instructivos">
                <FaInfoCircle className="me-2" />
                <span className={isCollapsed ? 'd-none' : ''}>Instructivos</span>
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-white" to="/admin/ayuda">
                <FaQuestionCircle className="me-2" />
                <span className={isCollapsed ? 'd-none' : ''}>Ayuda</span>
              </Link>
            </li>
          </ul>
        </div>
        {/* sidebar bottom */}
        <div className="sidebar-bottom py-3 ms-1">
          <button
            className="btn btn-uaco btn-logout"
            onClick={async () => {
              await supabase.auth.signOut()
              navigate('/login')
            }}
          >
            <FaSignOutAlt />
            <span className={isCollapsed ? 'd-none' : ''}>Salir</span>
          </button>
        </div>
      </nav>

      {/* Overlay (solo visible en móviles cuando está expandido) */}
      {isMobile && isCollapsed && (
        <div className="overlay active" onClick={() => setIsCollapsed(false)}></div>
      )}


      <div className={`main-content d-flex flex-column flex-grow-1 ${isMobile && isCollapsed ? 'shifted' : ''}`}>
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
