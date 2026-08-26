import '../style/admin-modulos.css'
import { getTareas, saveTarea, deleteTarea } from '../services/tareas.services.js'

export function renderTareas(container) {
  container.innerHTML = `
    <div class="admin-container">
      <div class="admin-header">
        <h2>Tareas del Reclutador</h2>
        <p>Organiza tus actividades pendientes por nivel de prioridad.</p>
      </div>

      <div class="admin-grid">
        <div class="admin-card">
          <h3>Nueva Tarea</h3>
          <form id="formTarea" class="admin-form">
            <div class="form-group">
              <label>Descripción</label>
              <input type="text" id="tituloTarea" class="admin-input" placeholder="Ej. Revisar CVs de Senior Dev" required />
            </div>
            <div class="form-group">
              <label>Prioridad</label>
              <select id="prioridad" class="admin-select">
                <option value="Alta">Alta</option>
                <option value="Media">Media</option>
                <option value="Baja">Baja</option>
              </select>
            </div>
            <button type="submit" class="btn-primary">+ Agregar Tarea</button>
          </form>
        </div>

        <div class="admin-card">
          <h3>Lista de Pendientes</h3>
          <div id="listaTareas"></div>
        </div>
      </div>
    </div>
  `

  const form = container.querySelector('#formTarea')
  const lista = container.querySelector('#listaTareas')

  function updateList() {
    const tareas = getTareas()
    if (tareas.length === 0) {
      lista.innerHTML = `<p style="color: var(--text-muted); text-align: center; padding: 20px;">No tienes tareas pendientes.</p>`
      return
    }

    lista.innerHTML = tareas.map((t, index) => {
      const priorityClass = `badge-${t.prioridad.toLowerCase()}`
      return `
        <div class="item-card">
          <div style="display: flex; flex-direction: column; gap: 6px;">
            <span class="badge ${priorityClass}" style="width: fit-content;">${t.prioridad}</span>
            <strong style="font-size: 1rem;">${t.titulo}</strong>
          </div>
          <button data-index="${index}" class="btn-danger btn-borrar-tarea">Completar</button>
        </div>
      `
    }).join('')

    lista.querySelectorAll('.btn-borrar-tarea').forEach(btn => {
      btn.addEventListener('click', (evt) => {
        const idx = evt.target.getAttribute('data-index')
        deleteTarea(idx)
        updateList()
      })
    })
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault()
    saveTarea({
      titulo: container.querySelector('#tituloTarea').value,
      prioridad: container.querySelector('#prioridad').value
    })
    form.reset()
    updateList()
  })

  updateList()
}