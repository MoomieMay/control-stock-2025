import React from 'react';
import 'bootstrap/dist/js/bootstrap.min.js'
import '../../styles/Dashboard.css';

import { FaHome, FaFileAlt, FaInfoCircle, FaSignOutAlt, FaBars, FaLink, FaPlus } from 'react-icons/fa';

const Ayuda = () => {
  return (
    <div className='container mt-1'>
      <h4 className="text-secondary border-bottom d-md-flex justify-content-md-end mb-3">Centro de Ayuda</h4>

      <div class="accordion" id="accordionExample">
        <div class="accordion-item">
          <h2 class="accordion-header">
            <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
              ¿Cómo agregar un nuevo elemento al listado de existencias?
            </button>
          </h2>
          <div id="collapseOne" class="accordion-collapse collapse " data-bs-parent="#accordionExample">
            <div class="accordion-body">
              <ol>
                <li>Desde la pantalla de inicio, localiza la tabla de existencias.
                  <li>En la parte superior de la tabla, haz clic en el botón "<FaPlus /> Agregar". </li>
                  <li>Completa el formulario que aparece:
                    <ul>
                      <li>Comienza a escribir el nombre del ítem, y se autocompletará con el nomenclador correspondiente.</li>
                      <li>Ingresa la cantidad a añadir.</li>
                      <li>Selecciona el tipo de compra.</li>
                      <li>Especifica el depósito al cual irá el ítem.</li>
                    </ul>
                  </li>
                  <li>Guarda los cambios para agregar el nuevo elemento al stock.</li></li>
              </ol>
            </div>
          </div>
          <div class="accordion-item">
            <h2 class="accordion-header">
              <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                ¿Cómo generar un reporte?
              </button>
            </h2>
            <div id="collapseTwo" class="accordion-collapse collapse" data-bs-parent="#accordionExample">
              <div class="accordion-body">
                <ol>
                  <li>Navega a la sección "Reportes" del sistema.</li>
                  <li>Selecciona las fechas entre las cuales deseas generar el reporte.</li>
                  <li>Elige el tipo de movimiento que quieres incluir en el reporte.</li>
                  <li>Haz clic en "Generar".</li>
                  <li>Espera a que el sistema procese el reporte y descarga el PDF cuando esté disponible.</li>
                </ol>
              </div>
            </div>
          </div>
          <div class="accordion-item">
            <h2 class="accordion-header">
              <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
                ¿Cómo realizo la entrega de un elemento?
              </button>
            </h2>
            <div id="collapseThree" class="accordion-collapse collapse" data-bs-parent="#accordionExample">
              <div class="accordion-body">
                <ol>
                  <li>En la tabla de existencias, encuentra el elemento que deseas entregar.
                    <li>Haz clic en el botón "Entrega" correspondiente a ese elemento. </li>
                    <li>Completa el formulario que aparece:
                      <ul>
                        <li>Verifica el nombre, nomenclador y origen del elemento.</li>
                        <li>Ingresa la cantidad a entregar.</li>
                        <li>Escribe el nombre de la persona que recibe la entrega (el legajo se completará automáticamente).</li>
                      </ul>
                    </li>
                    <li>Confirma y guarda la entrega.</li></li>
                </ol>
              </div>
            </div>
          </div>
          <div class="accordion-item">
            <h2 class="accordion-header">
              <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseFour" aria-expanded="false" aria-controls="collapseFour">
              ¿Cómo transfiero entre depósitos?
              </button>
            </h2>
            <div id="collapseFour" class="accordion-collapse collapse" data-bs-parent="#accordionExample">
              <div class="accordion-body">
                <ol>
                  <li>En la tabla de existencias, encuentra el elemento que deseas transferir.
                    <li>Haz clic en el botón "Transferencia" correspondiente a ese elemento. </li>
                    <li>Completa el formulario que aparece:
                      <ul>
                        <li>Verifica el nombre, nomenclador y origen del elemento.</li>
                        <li>Ingresa la cantidad a entregar.</li>
                        <li>Selecciona el depósito de destino.</li>
                      </ul>
                    </li>
                    <li>Confirma y guarda la transferencia.</li></li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Ayuda;