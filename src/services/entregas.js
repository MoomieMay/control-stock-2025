import { supabase } from './supabaseClient';

export async function entregarBien({ nomenclador, cantidad_entregada, nro_factura, nombre_deposito, id_bien, cantidad_bien, legajo_usuario }) {
  try {
    // 1. Verificar existencia del bien
    
    if (cantidad_bien < cantidad_entregada) {
      throw new Error(`Cantidad insuficiente. Disponible: ${cantidad_bien}`);
    }

    // 2. Obtener id del usuario por legajo
    const { data: usuarioData, error: usuarioError } = await supabase
      .from('usuario_entrega') // Tabla de usuarios del sistema
      .select('id_usuarioe')
      .eq('legajo', legajo_usuario)
      .single();

    if (usuarioError || !usuarioData) {
      throw new Error('No se encontró un usuario con ese legajo.');
    }
    
    const { data: nomencladorData, error: nomencladorError } = await supabase
      .from('nomencladores') // Tabla de usuarios del sistema
      .select('id_nomenclador')
      .eq('nomenclador', nomenclador)
      .single();

    if (nomencladorError || !nomencladorData) {
      throw new Error('No se encontró un nomenclador con ese nombre.');
    }

    // 4. Actualizar cantidad del bien
    const nuevaCantidad = cantidad_bien - cantidad_entregada;

    const { error: updateError } = await supabase
      .from('bienes')
      .update({ cantidad_bien: nuevaCantidad })
      .eq('id_bien', id_bien);

    if (updateError) {
      throw new Error('No se pudo actualizar la cantidad del bien.');
    }

    // 5. Registrar movimiento
    const { data: movimientoData, error: movimientoError } = await supabase
      .from('movimientos')
      .insert([{
        id_nomenclador: nomencladorData.id_nomenclador,
        cantidad_movimiento: cantidad_entregada,
        fecha_movimiento: new Date().toISOString().split('T')[0],
        tipo_movimiento: 'Entrega',
        origen: nombre_deposito,
        destino: 'Receptor',
        id_usuario: usuarioData.id_usuarioe,
        id_proveedor: null,
        nro_factura: nro_factura || 'interno',
      }])
      .select()
      .single();

    if (movimientoError) {
      throw new Error('No se pudo registrar el movimiento.');
    }

    return { success: true, movimiento: movimientoData };

  } catch (err) {
    console.error('Error en entregarBien:', err.message);
    return { success: false, error: err.message };
  }
}