/**
 * Página de Postulaciones (Integración NextStepp & JobConnect)
 */

import {
  getPostulaciones,
  createPostulacion,
  updatePostulacion,
  deletePostulacion
} from '../postulaciones/services/postulaciones.service.js'
import '../postulaciones/postulaciones.css'
import { navigate } from '../router.js'

const PUESTOS_ES = [
  "Desarrollador Frontend Senior (React / Vue)",
  "Desarrollador Full Stack (Node.js & JavaScript)",
  "Ingeniero de Software Backend (Python / Django)",
  "Diseñador UI/UX & Diseñador de Producto",
  "Especialista en QA & Testing Automatizado",
  "DevOps Engineer & Cloud Architect (AWS/GCP)",
  "Líder Técnico de Desarrollo Web",
  "Desarrollador Mobile (Flutter / React Native)",
  "Analista de Datos & Business Intelligence",
  "Scrum Master & Coordinador Ágil de Proyectos"
]

const CARTAS_ES = [
  "Cuento con más de 5 años de experiencia liderando proyectos web de alto impacto, optimización de rendimiento y arquitecturas escalables.",
  "Especialista en el desarrollo de interfaces modernas, sistemas de diseño, accesibilidad web y consumo eficiente de APIs RESTful.",
  "Apasionado por las buenas prácticas de ingeniería, clean code, pruebas automatizadas y trabajo colaborativo en equipos multidisciplinarios.",
  "Amplia trayectoria en diseño de experiencia de usuario, flujos de interacción centrados en el usuario y prototipado de alta fidelidad.",
  "Experiencia comprobable en despliegue continuo, pipelines CI/CD, contenedorización con Docker y monitoreo en entornos de producción.",
  "Conocimientos avanzados en análisis de requerimientos, liderazgo técnico de squads ágiles y resolución de incidentes críticos."
]

const TAGS_MAP = {
  'history': ['Liderazgo', 'Gestión'],
  'american': ['Internacional', 'Inglés C1'],
  'crime': ['Ciberseguridad', 'Auditoría'],
  'french': ['Bilingüe', 'Remoto'],
  'fiction': ['Innovación', 'Creatividad'],
  'english': ['Inglés Avanzado', 'Global'],
  'magical': ['UI/UX', 'Figma'],
  'mystery': ['Resolución Problemas', 'Debug'],
  'love': ['Cultura', 'Teamwork'],
  'classic': ['Arquitectura', 'Patrones'],
  'general': ['JavaScript', 'HTML5', 'CSS3']
}

function adaptarPostulacion(post) {
  if (post.esModificado) return post

  const idxPuesto = (post.id - 1) % PUESTOS_ES.length
  const idxCarta = (post.id - 1) % CARTAS_ES.length

  const tagsTraducidos = Array.isArray(post.tags) && post.tags.length > 0
    ? post.tags.flatMap(t => TAGS_MAP[t.toLowerCase()] || [t.charAt(0).toUpperCase() + t.slice(1)])
    : ['JavaScript', 'Frontend', 'Remoto']

  return {
    ...post,
    title: PUESTOS_ES[idxPuesto],
    body: `${CARTAS_ES[idxCarta]} ${post.body ? `Nota adicional: ${post.body.slice(0, 80)}...` : ''}`,
    tags: tagsTraducidos.slice(0, 4)
  }
}

let postulacionesData = []

function escapeHTML(str) {
  if (!str) return ''
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

function showToast(title, message, type = 'success') {
  const toast = document.createElement('div')
  toast.className = `toast ${type === 'error' ? 'toast-error' : 'toast-success'}`
  toast.innerHTML = `
    <div style="font-weight:700; margin-bottom: 2px;">${escapeHTML(title)}</div>
    <div style="font-size:0.85rem; color:var(--text-secondary);">${escapeHTML(message)}</div>
  `
  document.body.appendChild(toast)
  requestAnimationFrame(() => toast.classList.add('show'))
  setTimeout(() => {
    toast.classList.remove('show')
    setTimeout(() => toast.remove(), 400)
  }, 3500)
}

export function renderPostulaciones() {
  const app = document.getElementById('app')
  if (!app) return

  app.innerHTML = `
    <!-- Top Navbar -->
    <nav class="navbar scrolled" id="navbar">
      <div class="navbar-inner">
        <a href="#/" class="navbar-logo">
          <span class="logo-icon">NS</span>
          NextStepp
        </a>
        <ul class="navbar-nav">
          <li><a href="#/">Inicio</a></li>
          <li><a href="#/admin/dashboard">Panel Admin</a></li>
          <li><a href="#/empresa/dashboard">Empresas</a></li>
          <li><a href="#/postulaciones" class="active">Postulaciones</a></li>
        </ul>
        <div class="navbar-actions">
          <button class="btn btn-primary" id="btnOpenCreateModal">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            Nueva Postulación
          </button>
        </div>
      </div>
    </nav>

    <!-- Main Container -->
    <main class="postulaciones-wrapper" style="margin-top: 80px;">
      <section class="dashboard-hero">
        <div>
          <h1 class="hero-title">Gestión de Postulaciones</h1>
          <p class="hero-desc">Monitorea y gestiona las solicitudes de empleo en tiempo real. Integrado con DummyJSON /posts API.</p>
        </div>
      </section>

      <!-- Stats Grid -->
      <section class="stats-container">
        <div class="stat-card">
          <div class="stat-icon" style="color: #38bdf8;">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>
          </div>
          <div>
            <div class="stat-number" id="statTotal">0</div>
            <div class="stat-label">Total Postulaciones</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon" style="color: #34d399;">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
          </div>
          <div>
            <div class="stat-number" id="statInterviewed">0</div>
            <div class="stat-label">En Entrevista</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon" style="color: #fbbf24;">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
          </div>
          <div>
            <div class="stat-number" id="statReview">0</div>
            <div class="stat-label">En Revisión</div>
          </div>
        </div>
      </section>

      <!-- Controls & Search -->
      <section class="controls-row">
        <div class="search-box">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          <input type="text" id="searchInput" class="search-input" placeholder="Buscar por vacante, candidato o palabra clave..." />
        </div>
        <select id="filterTag" class="filter-select">
          <option value="all">Todas las etiquetas</option>
        </select>
        <button class="btn btn-secondary" id="btnRefresh">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/></svg>
          Recargar
        </button>
      </section>

      <!-- Cards Grid -->
      <div id="loadingState" class="post-loading-container">
        <div class="spinner"></div>
        <p>Consultando postulaciones activas...</p>
      </div>
      <section class="postulaciones-grid" id="postsGrid" style="display: none;"></section>
    </main>

    <!-- Create Modal -->
    <div class="post-modal-overlay" id="createModal">
      <div class="post-modal-content">
        <div class="post-modal-header">
          <div class="post-modal-title">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><line x1="12" y1="11" x2="12" y2="17"></line><line x1="9" y1="14" x2="15" y2="14"></line></svg>
            Registrar Postulación
          </div>
          <button class="btn-icon" id="btnCloseCreateModal" style="color:var(--text-muted);">&times;</button>
        </div>
        <form id="formCreate">
          <div class="post-modal-body">
            <div class="form-group">
              <label class="form-label">Puesto o Vacante Solicitada *</label>
              <input type="text" class="form-input" id="createTitle" placeholder="Ej: Desarrollador Frontend React" required />
            </div>
            <div class="form-group">
              <label class="form-label">ID de Candidato *</label>
              <input type="number" class="form-input" id="createUserId" min="1" max="208" value="5" required />
            </div>
            <div class="form-group">
              <label class="form-label">Carta de Presentación / Perfil *</label>
              <textarea class="form-input" id="createBody" rows="4" placeholder="Describe brevemente la experiencia del postulante..." required></textarea>
            </div>
            <div class="form-group">
              <label class="form-label">Habilidades (Separadas por comas)</label>
              <input type="text" class="form-input" id="createTags" placeholder="React, TypeScript, CSS, Remoto" />
            </div>
          </div>
          <div class="post-modal-footer">
            <button type="button" class="btn btn-ghost" id="btnCancelCreate">Cancelar</button>
            <button type="submit" class="btn btn-primary" id="btnSubmitCreate">Guardar Postulación</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Edit Modal -->
    <div class="post-modal-overlay" id="editModal">
      <div class="post-modal-content">
        <div class="post-modal-header">
          <div class="post-modal-title">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
            Editar Postulación
          </div>
          <button class="btn-icon" id="btnCloseEditModal" style="color:var(--text-muted);">&times;</button>
        </div>
        <form id="formEdit">
          <input type="hidden" id="editPostId" />
          <div class="post-modal-body">
            <div class="form-group">
              <label class="form-label">Título de la Postulación / Puesto *</label>
              <input type="text" class="form-input" id="editTitle" required />
            </div>
            <div class="form-group">
              <label class="form-label">Detalles / Carta de Presentación *</label>
              <textarea class="form-input" id="editBody" rows="4" required></textarea>
            </div>
          </div>
          <div class="post-modal-footer">
            <button type="button" class="btn btn-ghost" id="btnCancelEdit">Cancelar</button>
            <button type="submit" class="btn btn-primary" id="btnSubmitEdit">Guardar Cambios</button>
          </div>
        </form>
      </div>
    </div>
  `

  initPostulacionesHandlers()
}

function initPostulacionesHandlers() {
  const postsGrid = document.getElementById('postsGrid')
  const loadingState = document.getElementById('loadingState')
  const searchInput = document.getElementById('searchInput')
  const filterTag = document.getElementById('filterTag')
  const btnRefresh = document.getElementById('btnRefresh')

  const createModal = document.getElementById('createModal')
  const editModal = document.getElementById('editModal')
  const btnOpenCreateModal = document.getElementById('btnOpenCreateModal')
  const btnCloseCreateModal = document.getElementById('btnCloseCreateModal')
  const btnCancelCreate = document.getElementById('btnCancelCreate')
  const btnCloseEditModal = document.getElementById('btnCloseEditModal')
  const btnCancelEdit = document.getElementById('btnCancelEdit')

  const formCreate = document.getElementById('formCreate')
  const formEdit = document.getElementById('formEdit')
  const editPostId = document.getElementById('editPostId')
  const editTitle = document.getElementById('editTitle')
  const editBody = document.getElementById('editBody')

  async function loadData() {
    try {
      if (postsGrid) postsGrid.style.display = 'none'
      if (loadingState) loadingState.style.display = 'flex'

      const res = await getPostulaciones(30, 0)
      postulacionesData = (res.posts || []).map(adaptarPostulacion)

      updateStats()
      populateTags()
      renderCards(postulacionesData)
    } catch (err) {
      console.error(err)
      showToast('Error de Conexión', err.message || 'No se pudieron obtener las postulaciones', 'error')
      if (postsGrid) {
        postsGrid.innerHTML = `
          <div class="empty-state">
            <div class="empty-state-icon">⚠️</div>
            <h3>Ocurrió un error al consultar la API</h3>
            <p style="color: var(--text-muted); margin-top: 0.5rem;">${escapeHTML(err.message)}</p>
          </div>
        `
        postsGrid.style.display = 'grid'
      }
    } finally {
      if (loadingState) loadingState.style.display = 'none'
    }
  }

  function updateStats() {
    const totalEl = document.getElementById('statTotal')
    const intEl = document.getElementById('statInterviewed')
    const revEl = document.getElementById('statReview')

    if (totalEl) totalEl.textContent = postulacionesData.length
    if (intEl) intEl.textContent = postulacionesData.filter(p => p.id % 3 === 0).length
    if (revEl) revEl.textContent = postulacionesData.filter(p => p.id % 3 === 1).length
  }

  function populateTags() {
    if (!filterTag) return
    const allTags = new Set()
    postulacionesData.forEach(p => {
      if (Array.isArray(p.tags)) {
        p.tags.forEach(t => allTags.add(t))
      }
    })
    filterTag.innerHTML = '<option value="all">Todas las etiquetas</option>'
    allTags.forEach(tag => {
      const opt = document.createElement('option')
      opt.value = tag
      opt.textContent = tag
      filterTag.appendChild(opt)
    })
  }

  function renderCards(list) {
    if (!postsGrid) return
    postsGrid.innerHTML = ''

    if (!list || list.length === 0) {
      postsGrid.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">💼</div>
          <h3>No se encontraron postulaciones</h3>
          <p style="color: var(--text-muted); margin-top: 0.5rem;">Intenta con otro término de búsqueda o crea una nueva postulación.</p>
        </div>
      `
      postsGrid.style.display = 'grid'
      return
    }

    list.forEach(post => {
      const card = document.createElement('article')
      card.className = 'post-card'
      card.id = `post-card-${post.id}`

      const statusMod = post.id % 3
      let badgeHtml = ''
      if (statusMod === 0) {
        badgeHtml = '<span class="status-tag interview">● Entrevista Agendada</span>'
      } else if (statusMod === 1) {
        badgeHtml = '<span class="status-tag review">● En Revisión</span>'
      } else {
        badgeHtml = '<span class="status-tag pending">● Nueva Solicitud</span>'
      }

      const tagsHtml = (post.tags || []).map(t => `<span class="tag-item">${escapeHTML(t)}</span>`).join('')

      card.innerHTML = `
        <div>
          <div class="card-header-top">
            <div class="candidate-profile">
              <div class="candidate-avatar">#${post.userId || 1}</div>
              <div>
                <div class="candidate-name">Candidato #${post.userId || 1}</div>
                <div class="candidate-id">Postulación Ref: #${post.id}</div>
              </div>
            </div>
            <div class="card-actions">
              <button class="btn-icon btn-edit" data-id="${post.id}" title="Editar postulación">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
              </button>
              <button class="btn-icon btn-delete" data-id="${post.id}" title="Retirar postulación" style="color:#f87171;">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
              </button>
            </div>
          </div>
          <h3 class="post-job-title">${escapeHTML(post.title)}</h3>
          <p class="post-job-body">${escapeHTML(post.body)}</p>
          <div class="tag-list">${tagsHtml}</div>
        </div>
        <div class="card-footer-status">
          ${badgeHtml}
          <span style="font-size:0.75rem; color:var(--text-muted);">Reacciones: ${post.reactions?.likes || 12} ❤️</span>
        </div>
      `
      postsGrid.appendChild(card)
    })

    postsGrid.style.display = 'grid'

    // Attach edit and delete listeners
    postsGrid.querySelectorAll('.btn-edit').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = parseInt(btn.dataset.id)
        const target = postulacionesData.find(p => p.id === id)
        if (target) {
          editPostId.value = target.id
          editTitle.value = target.title
          editBody.value = target.body
          editModal.classList.add('active')
        }
      })
    })

    postsGrid.querySelectorAll('.btn-delete').forEach(btn => {
      btn.addEventListener('click', async () => {
        const id = parseInt(btn.dataset.id)
        if (confirm(`¿Estás seguro de que deseas retirar la postulación #${id}?`)) {
          try {
            await deletePostulacion(id)
            postulacionesData = postulacionesData.filter(p => p.id !== id)
            updateStats()
            renderCards(postulacionesData)
            showToast('Postulación Retirada', `La postulación #${id} fue eliminada con éxito.`)
          } catch (e) {
            showToast('Error', e.message, 'error')
          }
        }
      })
    })
  }

  function applyFilters() {
    const keyword = (searchInput?.value || '').toLowerCase().trim()
    const selectedTag = filterTag?.value || 'all'

    const filtered = postulacionesData.filter(p => {
      const matchKey = !keyword ||
        p.title.toLowerCase().includes(keyword) ||
        p.body.toLowerCase().includes(keyword) ||
        String(p.userId).includes(keyword)
      const matchTag = selectedTag === 'all' || (p.tags && p.tags.includes(selectedTag))
      return matchKey && matchTag
    })

    renderCards(filtered)
  }

  searchInput?.addEventListener('input', applyFilters)
  filterTag?.addEventListener('change', applyFilters)
  btnRefresh?.addEventListener('click', loadData)

  // Modales
  btnOpenCreateModal?.addEventListener('click', () => {
    formCreate?.reset()
    createModal?.classList.add('active')
  })

  btnCloseCreateModal?.addEventListener('click', () => createModal?.classList.remove('active'))
  btnCancelCreate?.addEventListener('click', () => createModal?.classList.remove('active'))

  btnCloseEditModal?.addEventListener('click', () => editModal?.classList.remove('active'))
  btnCancelEdit?.addEventListener('click', () => editModal?.classList.remove('active'))

  formCreate?.addEventListener('submit', async (e) => {
    e.preventDefault()
    const title = document.getElementById('createTitle').value.trim()
    const userId = document.getElementById('createUserId').value
    const body = document.getElementById('createBody').value.trim()
    const tagsInput = document.getElementById('createTags').value.trim()
    const tags = tagsInput ? tagsInput.split(',').map(t => t.trim()).filter(Boolean) : ['General', 'Empleo']

    const submitBtn = document.getElementById('btnSubmitCreate')
    submitBtn.textContent = 'Guardando...'
    submitBtn.disabled = true

    try {
      const newPost = await createPostulacion({ title, userId, body, tags })
      const adapted = {
        ...newPost,
        id: postulacionesData.length ? Math.max(...postulacionesData.map(p => p.id)) + 1 : 101,
        title,
        body,
        tags,
        esModificado: true
      }
      postulacionesData.unshift(adapted)
      updateStats()
      renderCards(postulacionesData)
      createModal.classList.remove('active')
      showToast('¡Postulación Exitosa!', 'Tu solicitud se ha registrado en el sistema.', 'success')
    } catch (err) {
      showToast('Error al Postular', err.message, 'error')
    } finally {
      submitBtn.textContent = 'Guardar Postulación'
      submitBtn.disabled = false
    }
  })

  formEdit?.addEventListener('submit', async (e) => {
    e.preventDefault()
    const id = parseInt(editPostId.value)
    const title = editTitle.value.trim()
    const body = editBody.value.trim()

    const submitBtn = document.getElementById('btnSubmitEdit')
    submitBtn.textContent = 'Actualizando...'
    submitBtn.disabled = true

    try {
      await updatePostulacion(id, { title, body })
      const item = postulacionesData.find(p => p.id === id)
      if (item) {
        item.title = title
        item.body = body
        item.esModificado = true
      }
      renderCards(postulacionesData)
      editModal.classList.remove('active')
      showToast('Postulación Actualizada', `La postulación #${id} fue actualizada correctamente.`)
    } catch (err) {
      showToast('Error', err.message, 'error')
    } finally {
      submitBtn.textContent = 'Guardar Cambios'
      submitBtn.disabled = false
    }
  })

  loadData()
}
