import './admin-modulos.css'
import { getEntrevistas, saveEntrevista, deleteEntrevista } from './services/entrevistas.service.js'

export function renderEntrevistas(container) {
  container.innerHTML = `
    <div class="admin-container">
      <div class="admin-header">
        <h2>Entrevistas / Notas</h2>
        <p>Programa nuevas entrevistas y mantén el registro de los candidatos.</p>
      </div>

      <div class="admin-grid">
        <div class="admin-card">
          <h3>Nueva Entrevista</h3>
          <form id="formEntrevista" class="admin-form">
            <div class="form-group">
              <label for="candidato">Candidato</label>
              <input type="text" id="candidato" class="admin-input" placeholder="Nombre completo" autocomplete="off" required />
            </div>
            <div class="form-group">
              <label for="fechaEntrevista">Fecha y Hora</label>
              <input type="datetime-local" id="fechaEntrevista" class="admin-input" autocomplete="off" required />
            </div>
            <div class="form-group">
              <label for="notas">Notas</label>
              <textarea id="notas" class="admin-input" placeholder="Notas de la entrevista..." autocomplete="off" rows="3"></textarea>
            </div>
            <button type="submit" class="btn-primary">+ Guardar Registro</button>
          </form>
        </div>

        <div class="admin-card">
          <h3>Historial de Entrevistas</h3>
          <div id="listaEntrevistas"></div>
        </div>
      </div>
    </div>
  `

  const form = container.querySelector('#formEntrevista')
  const lista = container.querySelector('#listaEntrevistas')

  function updateList() {
    const datos = getEntrevistas()
    if (datos.length === 0) {
      lista.innerHTML = `<p style="color: var(--text-muted); text-align: center; padding: 20px;">No hay entrevistas registradas aún.</p>`
      return
    }

    lista.innerHTML = datos.map((e, index) => {
      let fechaFormateada = 'Sin fecha'
      if (e.fecha) {
        const d = new Date(e.fecha)
        if (!isNaN(d.getTime())) {
          fechaFormateada = d.toLocaleString('es-CR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
          })
        }
      }

      return `
        <div class="item-card">
          <div>
            <strong>${e.candidato}</strong>
            <div style="font-size: 0.8rem; color: #3b82f6; margin-top: 2px;">📅 ${fechaFormateada}</div>
            <p>${e.notas || ''}</p>
          </div>
          <button data-index="${index}" class="btn-danger btn-eliminar">Eliminar</button>
        </div>
      `
    }).join('')

    lista.querySelectorAll('.btn-eliminar').forEach(btn => {
      btn.addEventListener('click', (evt) => {
        const idx = evt.target.getAttribute('data-index')
        deleteEntrevista(idx)
        updateList()
      })
    })
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault()
    saveEntrevista({
      candidato: container.querySelector('#candidato').value,
      fecha: container.querySelector('#fechaEntrevista').value,
      notas: container.querySelector('#notas')?.value || ''
    })
    form.reset()
    updateList()
  })

  updateList()
}