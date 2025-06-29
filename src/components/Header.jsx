import React from 'react'
import '../styles/Dashboard.css'

const Header = ({ username }) => {
    return (
        <header className="header border-bottom p-3">

            <div className='m-2 p-2 text-end'>
                <h4 className="text-end">Sistema de Control de Stock</h4>
                <small >{username}</small>
            </div>
            <img src="/logo.png" alt="Logo" className="header-logo" />

        </header>
    )
}

export default Header