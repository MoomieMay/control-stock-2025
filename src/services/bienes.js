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

// Esta función agrega un nuevo bien a la tabla 'bienes'.
export async function agregarBien(bien) {
  const { data, error } = await supabase
    .from('bienes')
    .insert([{
      id_nomenclador: bien.id_nomenclador,
      cantidad_bien: bien.cantidad_bien,
      cantidad_minima: bien.cantidad_minima,
      tipo_pedidos: bien.tipo_pedidos,
      id_deposito: bien.id_deposito,
    }]).select().single();

  if (error) {
    console.error('Error al agregar bien:', error)
    return null;
  }

  return {data, error};
}
// Esta función agrega un nuevo movimiento a la tabla 'movimientos' cuando se agrega un bien.
export async function agregarMovimiento(bien) {
// 1. Obtener nombre del depósito
  const { data: depositoData, error: depositoError } = await supabase
    .from('depositos')
    .select('nombre_deposito')
    .eq('id_deposito', bien.id_deposito)
    .single();

  if (depositoError || !depositoData) {
    console.error('Error al obtener el nombre del depósito:', depositoError);
    return null;
  }

  const nombreDeposito = depositoData.nombre_deposito;
// 2. Obtener id del proveedor
  const { data: proveedorData, error: proveedorError } = await supabase
    .from('proveedores')
    .select('id_proveedor')
    .eq('cuit_proveedor', bien.cuit_proveedor)
    .single();

  if (proveedorError || !proveedorData) {
    console.error('Error al obtener el id del proveedor:', proveedorError);
    return null;
  }

  const idProveedor = proveedorData.id_proveedor;

  const { data, error } = await supabase
    .from('movimientos')
    .insert([{
      id_nomenclador: bien.id_nomenclador,
      cantidad_movimiento: bien.cantidad_bien,
      fecha_movimiento: new Date().toISOString().split('T')[0],
      tipo_movimiento: 'Ingreso',
      origen: 'Proveedor',
      destino: nombreDeposito,
      id_usuario: null,
      id_proveedor: idProveedor,
      nro_factura: bien.numero_factura,
    }]).select()
    .single();

  if (error) {
    console.error('Error al agregar bien:', error)
    return null
  }

  return {data, error};
}

// Esta función actualiza la cantidad de un bien existente en la tabla 'bienes'.
export async function actualizarBien(bien) {
   // 1. Obtener el registro actual
  const { data: actual, error: fetchError } = await supabase
    .from('bienes')
    .select('cantidad_bien')
    .eq('id_nomenclador', parseInt(bien.id_nomenclador))
    .eq('id_deposito', parseInt(bien.id_deposito))
    .maybeSingle();

  if (fetchError) {
    console.error('Error al obtener bien actual:', fetchError);
    return null;
  }

  if (!actual) {
    console.error('No se encontró el bien para actualizar.');
    return null;
  }

  // 2. Calcular nuevas cantidades
  const nuevaCantidadBien = parseInt(actual.cantidad_bien + bien.cantidad_bien);

  // 3. Actualizar con los nuevos valores sumados
  const { data, error } = await supabase
    .from('bienes')
    .update({
      cantidad_bien: parseInt(nuevaCantidadBien),
    })
    .eq('id_nomenclador', parseInt(bien.id_nomenclador))
    .eq('id_deposito', parseInt(bien.id_deposito))
    .select();

  if (error) {
    console.error('Error al actualizar bien:', error);
    return null;
  }

  return data?.[0];
}

export async function existeCantMinima(nuevoDeposito, idNomenclador) {
  const { data, error } = await supabase
    .from('bienes')
    .select('cantidad_minima')
    .eq('id_deposito', nuevoDeposito)
    .eq('id_nomenclador', idNomenclador)
    .maybeSingle();

  return { data, error };
}

