// src/pages/Login.jsx
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'
import '../styles/Login.css'
import { supabase } from '../services/supabaseClient'

const Login = () => {
  const [error, setError] = useState('')
  const navigateTo = useNavigate()
  const { register, handleSubmit, formState: { errors } } = useForm()

  const onSubmit = async (data) => {
    const { username, password } = data

    const { data: session, error } = await supabase.auth.signInWithPassword({
      email: username,  // si usás correo como usuario
      password: password
    })

    if (error) {
      setError('Credenciales incorrectas')
    } else {
      navigateTo('/admin')
    }
  }

  return (
    <div className="fondo">
      <div className="col-md-4">
        <div className="card border-0 rounded-3 shadow-lg">
          <div className="card-body">
            <div className="text-center mb-4">
              <img src="logo.png" alt="Logo" className="img-fluid logo-login" />
            </div>
            <h3 className="card-title mb-4 fs-5 text-center">Sistema de Control de Stock</h3>
            {error && <div className="alert alert-danger">{error}</div>}
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="form-floating mb-3">
                <input
                  id="username"
                  type="email"
                  className={`form-control ${errors.username ? 'is-invalid' : ''}`}
                  {...register('username', { required: 'Usuario es requerido' })}
                  placeholder="Usuario"
                />
                <label htmlFor="username">Usuario</label>
                {errors.username && <div className="invalid-feedback">{errors.username.message}</div>}
              </div>
              <div className="form-floating mb-3">
                <input
                  id="password"
                  type="password"
                  className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                  {...register('password', { required: 'Contraseña es requerida' })}
                  placeholder="Contraseña"
                />
                <label htmlFor="password">Contraseña</label>
                {errors.password && <div className="invalid-feedback">{errors.password.message}</div>}
              </div>
              <button type="submit" className="btn btn-lg w-100">Ingresar</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
