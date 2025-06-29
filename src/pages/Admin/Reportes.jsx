import React from 'react';
import { Page, Text, View, Document, Image, StyleSheet, PDFDownloadLink } from '@react-pdf/renderer';
import { logoBase64 } from './logoBase64'; // Asegurate de que el path esté bien

// Estilos PDF
const styles = StyleSheet.create({
  page: {
    padding: 25,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1
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
  table: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#000',
  },
  tableHeader: {
    backgroundColor: '#f5f5f5',
    fontSize: 12,
    flex: 1,
    textAlign: 'center',
    padding: 5,
    borderWidth: 1,
    borderColor: '#000',
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
  return `${String(date.getDate()).padStart(2, '0')}-${String(date.getMonth() + 1).padStart(2, '0')}-${date.getFullYear()}`;
};

// Componentes por tipo de reporte
const Ingreso = ({ data }) => (
  <View>
    <Text style={styles.header}>Reporte de Ingresos</Text>
    <Text style={styles.subtitle}>Fecha Inicio: </Text>
    <Text style={styles.text}>{formatDate(data.datafront.fecha_inicio)}</Text>
    <Text style={styles.subtitle}>Fecha Fin: </Text>
    <Text style={styles.text}>{formatDate(data.datafront.fecha_fin)}</Text>
    <Text style={styles.subtitle}>Tipo de Movimiento:</Text>
    <Text style={styles.text}>Ingreso</Text>
    <View style={styles.table}>
      <Text style={styles.tableHeader}>Fecha</Text>
      <Text style={styles.tableHeader}>Item</Text>
      <Text style={styles.tableHeader}>Cantidad</Text>
      <Text style={styles.tableHeader}>Deposito</Text>
      <Text style={styles.tableHeader}>Proveedor</Text>
      <Text style={styles.tableHeader}>Factura</Text>
    </View>
    {data.data.map((item, index) => (
      <View style={styles.table} key={index}>
        <Text style={styles.cell}>{formatDate(item.fecha_ingreso)}</Text>
        <Text style={styles.cell}>{item.nombre_bien}</Text>
        <Text style={styles.cell}>{item.cantidad_ingresada}</Text>
        <Text style={styles.cell}>{item.destino_ingreso}</Text>
        <Text style={styles.cell}>{item.nombre_proveedor}</Text>
        <Text style={styles.cell}>{item.factura}</Text>
      </View>
    ))}
  </View>
);

const Entrega = ({ data }) => (
  <View>
    <Text style={styles.header}>Reporte de Entregas</Text>
    <Text style={styles.subtitle}>Fecha Inicio: </Text>
    <Text style={styles.text}>{formatDate(data.datafront.fecha_inicio)}</Text>
    <Text style={styles.subtitle}>Fecha Fin: </Text>
    <Text style={styles.text}>{formatDate(data.datafront.fecha_fin)}</Text>
    <Text style={styles.subtitle}>Tipo de Movimiento: </Text>
    <Text style={styles.text}>Entrega</Text>
    <View style={styles.table}>
      <Text style={styles.tableHeader}>Fecha</Text>
      <Text style={styles.tableHeader}>Item</Text>
      <Text style={styles.tableHeader}>Origen</Text>
      <Text style={styles.tableHeader}>Cantidad</Text>
      <Text style={styles.tableHeader}>Receptor</Text>
    </View>
    {data.data.map((item, index) => (
      <View style={styles.table} key={index}>
        <Text style={styles.cell}>{formatDate(item.fecha_entrega)}</Text>
        <Text style={styles.cell}>{item.nombre_bien}</Text>
        <Text style={styles.cell}>{item.deposito}</Text>
        <Text style={styles.cell}>{item.cantidad_entregada}</Text>
        <Text style={styles.cell}>{item.nombre_usuarioE}</Text>
      </View>
    ))}
  </View>
);

const Transferencia = ({ data }) => (
  <View>
    <Text style={styles.header}>Reporte de Transferencias</Text>
    <Text style={styles.subtitle}>Fecha Inicio: </Text>
    <Text style={styles.text}>{formatDate(data.datafront.fecha_inicio)}</Text>
    <Text style={styles.subtitle}>Fecha Fin: </Text>
    <Text style={styles.text}>{formatDate(data.datafront.fecha_fin)}</Text>
    <Text style={styles.subtitle}>Tipo de Movimiento: </Text>
    <Text style={styles.text}>Transferencia</Text>
    <View style={styles.table}>
      <Text style={styles.tableHeader}>Fecha</Text>
      <Text style={styles.tableHeader}>Item</Text>
      <Text style={styles.tableHeader}>Origen</Text>
      <Text style={styles.tableHeader}>Destino</Text>
      <Text style={styles.tableHeader}>Cantidad</Text>
    </View>
    {data.data.map((item, index) => (
      <View style={styles.table} key={index}>
        <Text style={styles.cell}>{formatDate(item.fecha_transferencia)}</Text>
        <Text style={styles.cell}>{item.nombre_bien}</Text>
        <Text style={styles.cell}>{item.origen_transferencia}</Text>
        <Text style={styles.cell}>{item.destino_transferencia}</Text>
        <Text style={styles.cell}>{item.cantidad_transferida}</Text>
      </View>
    ))}
  </View>
);

const Deposito = ({ data }) => {
  const currentDate = new Date();
  return (
    <View>
      <Text style={styles.header}>Reporte de Existencias por Depósito</Text>
      <Text style={styles.subtitle}>Fecha de Reporte: </Text>
      <Text style={styles.text}>{formatDate(currentDate)}</Text>
      <Text style={styles.subtitle}>Depósito: </Text>
      <Text style={styles.text}>{data.data[0]?.nombre_deposito}</Text>
      <View style={styles.table}>
        <Text style={styles.tableHeader}>Nomenclador</Text>
        <Text style={styles.tableHeader}>Item</Text>
        <Text style={styles.tableHeader}>Cantidad</Text>
        <Text style={styles.tableHeader}>Mínima</Text>
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
};

// Documento PDF completo
const ReportePDFDoc = ({ data }) => (
  <Document>
    <Page style={styles.page}>
      <View style={styles.section}>
        <Image src={logoBase64} style={styles.logo} />
        {data.datafront.tipo === 'ingreso' && <Ingreso data={data} />}
        {data.datafront.tipo === 'entrega' && <Entrega data={data} />}
        {data.datafront.tipo === 'transferencia' && <Transferencia data={data} />}
        {data.datafront.tipo === 'deposito' && <Deposito data={data} />}
      </View>
    </Page>
  </Document>
);

// Exporta tanto el documento como el botón de descarga
export const ReportePDFDownload = ({ data }) => (
  <PDFDownloadLink document={<ReportePDFDoc data={data} />} fileName="reporte.pdf">
    {({ loading }) => (
      <button className="btn btn-outline-dark mt-2">
        {loading ? 'Generando PDF...' : 'Descargar PDF'}
      </button>
    )}
  </PDFDownloadLink>
);

export default ReportePDFDoc;
