import React from 'react';
import 'bootstrap/dist/js/bootstrap.min.js'
import '../../styles/Dashboard.css';
import { EmbedPDF } from "@simplepdf/react-embed-pdf";
import { FaHome, FaFileAlt, FaInfoCircle, FaSignOutAlt, FaBars, FaLink, FaPlus } from 'react-icons/fa';

const Instructivos = () => {
  return (
    <div className='container mt-1'>
      <h4 className="text-secondary border-bottom d-md-flex justify-content-md-end mb-3">Instructivos y Enlaces</h4>
      <h6 className="text-secondary border-bottom d-md-flex justify-content-md-start mb-3 mt-5">Res. SH 71-03 Manual de Clasificaciones Presupuestarias</h6>
      <div className="d-flex justify-content-center">
        <EmbedPDF
          mode="inline"
          style={{ width: 900, height: 800 }}
          documentURL="https://p6enbfiw.simplepdf.eu/form/2cfdad22e37d83c26abce6682dac50d482fdc45e0e7c761be766e6af99fb6b2d"
        />
      </div>
      <h6 className="text-secondary border-bottom d-md-flex justify-content-md-start mb-3 mt-5">Circuito de Compras</h6>

      <div className="d-flex justify-content-center">
        <EmbedPDF
          mode="inline"
          style={{ width: 900, height: 800 }}
          documentURL="https://p6enbfiw.simplepdf.eu/form/155e301f04468991270b573cef707eac82ee8bea991f5657da635b36db6e7649"
        />
      </div>
      <h6 className="text-secondary border-bottom d-md-flex justify-content-md-start mb-3 mt-5">SIU - DIAGUITA</h6>

      <div className="d-flex justify-content-center">
        <EmbedPDF
          mode="inline"
          style={{ width: 900, height: 800 }}
          documentURL="https://www.unpa.edu.ar/sites/default/files/descargas/Coberturas%20NODOCENTES/4.%20Materiales/2019/UACO/213-A041-S/SIU-DIAGUITA_Presentacion_ABM%20Personas_Compras_2018.pdf"
        />
      </div>
    </div>
  );
};

export default Instructivos;