import React from 'react';
import { Page, Text, View, Document, Image, StyleSheet } from '@react-pdf/renderer';

// Definir estilos
const styles = StyleSheet.create({
  page: {
    padding: 25,
    flexDirection: 'row', // Alinea el contenido en fila (horizontalmente)
    justifyContent: 'center',
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1
  },
  logo: {
    height: 50,
    marginLeft: 'auto', // Coloca el logo a la derecha
    marginBottom: 10,
  },
  header: {
    fontSize: 14,
    marginBottom: 10,
    textAlign: 'right',
    textDecoration: 'underline',
    fontWeight: 'bold', // Texto en negrita
    color: 'gray', // Cambia el color del texto
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
  table: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#000',
  },
  tableHeader: {
    backgroundColor: '#f2f2f2',
    fontSize: 12,
    flex: 1,
    textAlign: 'center',
    padding: 5,

  },
  cell: {
    fontSize: 11,
    padding: 7,
    textAlign: 'left',
    flex: 1,
  },
});

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Los meses son 0-indexados
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

const Ingreso = ({ data }) => (
  <View>
    <Text style={styles.header}>Reporte de Ingresos</Text>
    <Text style={styles.subtitle}>Fecha Inicio: </Text>
    <Text style={styles.text}> {formatDate(data.datafront.fecha_inicio)}</Text>
    <Text style={styles.subtitle}>Fecha Fin: </Text>
    <Text style={styles.text}>{formatDate(data.datafront.fecha_fin)}</Text>
    <Text style={styles.subtitle}>Tipo de Movimiento:</Text>
    <Text style={styles.text}>Entrega</Text>
    {/* Tabla de datos */}
    <View style={styles.table}>
      <Text style={styles.tableHeader}>Fecha</Text>
      <Text style={styles.tableHeader}>Nomenclador</Text>
      <Text style={styles.tableHeader}>Cant.</Text>
      <Text style={styles.tableHeader}>Deposito</Text>
      <Text style={styles.tableHeader}>Proveedor</Text>
      <Text style={styles.tableHeader}>N° Factura</Text>
    </View>
    {data.data.map((item, index) => (
      <View style={styles.table} key={index}>
        <Text style={styles.cell}>{formatDate(item.fecha_movimiento)}</Text>
        <Text style={styles.cell}>{item.nomenclador}</Text>
        <Text style={styles.cell}>{item.cantidad_movimiento}</Text>
        <Text style={styles.cell}>{item.destino}</Text>
        <Text style={styles.cell}>{item.nombre_proveedor}</Text>
        <Text style={styles.cell}>{item.nro_factura}</Text>
      </View>
    ))}
  </View>
);

const Entrega = ({ data }) => (
  <View>
    <Text style={styles.header}>Reporte de Entregas</Text>
    <Text style={styles.subtitle}>Fecha Inicio: </Text>
    <Text style={styles.text}> {formatDate(data.datafront.fecha_inicio)}</Text>
    <Text style={styles.subtitle}>Fecha Fin: </Text>
    <Text style={styles.text}>{formatDate(data.datafront.fecha_fin)}</Text>
    <Text style={styles.subtitle}>Tipo de Movimiento: </Text>
    <Text style={styles.text}>Entrega</Text>
    {/* Tabla de datos */}
    <View style={styles.table}>
      <Text style={styles.tableHeader}>Fecha</Text>
      <Text style={styles.tableHeader}>Nomenclador</Text>
      <Text style={styles.tableHeader}>Origen</Text>
      <Text style={styles.tableHeader}>Destino</Text>
      <Text style={styles.tableHeader}>Cantidad</Text>
      <Text style={styles.tableHeader}>Receptor</Text>
    </View>
    {data.data.map((item, index) => (
      <View style={styles.table} key={index}>
        <Text style={styles.cell}>{formatDate(item.fecha_movimiento)}</Text>
        <Text style={styles.cell}>{item.nomenclador}</Text>
        <Text style={styles.cell}>{item.origen}</Text>
        <Text style={styles.cell}>{item.destino}</Text>
        <Text style={styles.cell}>{item.cantidad_movimiento}</Text>
        <Text style={styles.cell}>{item.usuario.nombre_usuario}</Text>
      </View>
    ))}
  </View>
);

const Transferencia = ({ data }) => (
  <View>
    <Text style={styles.header}>Reporte de Transferencias</Text>
    <Text style={styles.subtitle}>Fecha Inicio: </Text>
    <Text style={styles.text}> {formatDate(data.datafront.fecha_inicio)}</Text>
    <Text style={styles.subtitle}>Fecha Fin: </Text>
    <Text style={styles.text}>{formatDate(data.datafront.fecha_fin)}</Text>
    <Text style={styles.subtitle}>Tipo de Movimiento: </Text>
    <Text style={styles.text}>Transferencia</Text>
    {/* Tabla de datos */}
    <View style={styles.table}>
      <Text style={styles.tableHeader}>Fecha</Text>
      <Text style={styles.tableHeader}>Nomenclador</Text>
      <Text style={styles.tableHeader}>Origen</Text>
      <Text style={styles.tableHeader}>Destino</Text>
      <Text style={styles.tableHeader}>Cantidad</Text>
    </View>
    {data.data.map((item, index) => (
      <View style={styles.table} key={index}>
        <Text style={styles.cell}>{formatDate(item.fecha_movimiento)}</Text>
        <Text style={styles.cell}>{item.nomenclador}</Text>
        <Text style={styles.cell}>{item.origen}</Text>
        <Text style={styles.cell}>{item.destino}</Text>
        <Text style={styles.cell}>{item.cantidad_movimiento}</Text>
      </View>
    ))}
  </View>
);

const currentDate = new Date();
const Deposito = ({ data }) => (
  <View>
    <Text style={styles.header}>Reporte de Existencias por Depósito</Text>
    <Text style={styles.subtitle}>Fecha de Reporte: </Text>
    <Text style={styles.text}> {formatDate(currentDate)}</Text>
    <Text style={styles.subtitle}>Depósito: </Text>
    <Text style={styles.text}>{data.data[0].nombre_deposito}</Text>
    {/* Tabla de datos */}
    <View style={styles.table}>
      <Text style={styles.tableHeader}>Nomenclador</Text>
      <Text style={styles.tableHeader}>Item</Text>
      <Text style={styles.tableHeader}>Cantidad en Depósito</Text>
      <Text style={styles.tableHeader}>Cantidad Mínima</Text>
      <Text style={styles.tableHeader}>Tipo de Pedido</Text>
    </View>
    {data.data.map((item, index) => (
      <View style={styles.table} key={index}>
        <Text style={styles.cell}>{item.nomenclador}</Text>
        <Text style={styles.cell}>{item.nombre_bien}</Text>
        <Text style={styles.cell}>{item.cantidad_bien}</Text>
        <Text style={styles.cell}>{item.cantidad_minima}</Text>
        <Text style={styles.cell}>{item.tipo_pedidos}</Text>
      </View>
    ))}
  </View>
);

const ReportePDF = ({ data }) => {
  return (
    <Document>
      <Page style={styles.page}>
        <View style={styles.section}>
          <Image src="/logo.png" style={styles.logo} />
          {data.datafront.tipo === 'Ingreso' && <Ingreso data={data} />}
          {data.datafront.tipo === 'Entrega' && <Entrega data={data} />}
          {data.datafront.tipo === 'Transferencia' && <Transferencia data={data} />}
          {data.datafront.tipo === 'Deposito' && <Deposito data={data} />}
        </View>
      </Page>
    </Document>
  );
};

export default ReportePDF;