// src/services/bienes.js
import { supabase } from './supabaseClient'

export async function obtenerBienes() {
  const { data, error } = await supabase
    .from('bienes')
    .select(`
      id_bien,
      cantidad_bien,
      cantidad_minima,
      tipo_pedidos,
      id_deposito,
      id_nomenclador,
      nomenclador: nomencladores(nomenclador, nombre_bien),
      deposito: depositos(nombre_deposito)
    `)

  if (error) {
    console.error('Error al obtener bienes:', error)
    return []
  }

  return data.map(item => ({
    ID_bien: item.id_bien,
    cantidad_bien: item.cantidad_bien,
    cantidad_minima: item.cantidad_minima,
    tipo_pedidos: item.tipo_pedidos,
    nombre_deposito: item.deposito?.nombre_deposito || '',
    nomenclador: item.nomenclador?.nomenclador || '',
    nombre_bien: item.nomenclador?.nombre_bien || '',
  }))
}
