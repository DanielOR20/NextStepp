import { getCurrentUser, logout } from '../../services/auth.service.js'
import { navigate } from '../../router/router.js'
import {
  getCompanies,
  getVacancies,
  updateCompany,
  updateVacancy,
  getCompanyById,
} from '../../services/store.service.js'
import { classifyCompany, classifyVacancy } from '../../services/ai.service.js'
import { getPostulaciones, createPostulacion, updatePostulacion, deletePostulacion } from '../postulaciones/services/postulaciones.service.js'
import { SIDEBAR_ITEMS } from '../../config/constants.js'
import { statusBadge } from '../../utils/helpers.js'
import Swal from 'sweetalert2'

let currentSection = 'dashboard'

let postulacionesData = []
let postulacionesPage = 1
let postulacionesSearch = ''
let postulacionesFilter = 'all'
const POST_PAGE_SIZE = 10

const PUESTOS_ES = [
  "Desarrollador Frontend Senior (React / TypeScript)",
  "Ingeniero de Software Full Stack (Node.js)",
  "Especialista en QA & Testing Automatizado",
  "Diseñador UI/UX & Producto Digital",
  "DevOps Engineer & Arquitecto Cloud (AWS)",
  "Desarrollador Mobile (Flutter / Android)",
  "Analista de Ciberseguridad & Auditoría",
  "Líder Técnico de Arquitectura de Software",
  "Administrador de Bases de Datos (PostgreSQL)",
  "Scrum Master & Coordinador de Equipos Ágiles"
]
const CARTAS_ES = [
  "Más de 5 años de experiencia liderando proyectos web, optimización continua y arquitecturas limpias.",
  "Especialista en desarrollo frontend, componentes reutilizables, consumo de APIs y accesibilidad.",
  "Amplia trayectoria en diseño de producto, pruebas continuas, CI/CD y despliegues productivos.",
  "Conocimiento sólido en bases de datos relacionales, backend escalable y seguridad informática."
]

const MODULE_RENDERERS = {
  dashboard: renderDashboard,
  vacantes: renderVacantes,
  empresas: renderEmpresas,
  postulaciones: renderPostulaciones,
  entrevistas: renderEntrevistas,
  reportes: renderReportes,
  tareas: renderTareas,
}

function guard() {
  const user = getCurrentUser()
  if (!user || (user.role !== 'admin' && user.role !== 'reclutador')) {
    navigate('/login')
    return null
  }
  return user
}

function renderSidebar(user) {
  return `
    <aside class="sidebar" id="sidebar">
      <div class="sidebar-header">
        <a href="#/" class="sidebar-logo">
          <span class="logo-icon">NS</span>
          <span class="sidebar-logo-text">NextStepp</span>
        </a>
        <button class="sidebar-toggle" id="sidebarToggle">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
        </button>
      </div>
      <nav class="sidebar-nav">
        ${SIDEBAR_ITEMS.map((item) => `
          <a href="#" class="sidebar-link ${currentSection === item.id ? 'active' : ''}" data-nav="${item.id}">
            <span class="sidebar-link-icon">${item.icon}</span>
            <span class="sidebar-link-label">${item.label}</span>
          </a>
        `).join('')}
      </nav>
      <div class="sidebar-footer">
        <div class="sidebar-user">
          <div class="sidebar-user-avatar">${user.name.charAt(0)}</div>
          <div class="sidebar-user-info">
            <span class="sidebar-user-name">${user.name}</span>
            <span class="sidebar-user-role">${user.role === 'admin' ? 'Administrador' : 'Reclutador'}</span>
          </div>
        </div>
        <button class="sidebar-logout" id="logoutBtn">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
          <span>Cerrar Sesión</span>
        </button>
      </div>
    </aside>
  `
}

function renderDashboard() {
  const companies = getCompanies()
  const vacancies = getVacancies()
  const pendingC = companies.filter((c) => c.companyStatus === 'pending').length
  const pendingV = vacancies.filter((v) => v.status === 'pending').length

  const modules = [
    { id: 'vacantes', title: 'Vacantes', desc: 'Revisa, clasifica con IA y aprueba vacantes.', color: '#6366f1', count: vacancies.length, badge: pendingV > 0 ? `${pendingV} pendientes` : null },
    { id: 'empresas', title: 'Empresas Clientes', desc: 'Verifica y aprueba empresas registradas.', color: '#06b6d4', count: companies.length, badge: pendingC > 0 ? `${pendingC} pendientes` : null },
    { id: 'postulaciones', title: 'Postulaciones', desc: 'Gestiona postulaciones de candidatos.', color: '#10b981', count: 0, badge: null },
    { id: 'entrevistas', title: 'Entrevistas / Notas', desc: 'Programa entrevistas y registra notas.', color: '#f59e0b', count: 0, badge: null },
    { id: 'reportes', title: 'Reportes', desc: 'Analiza KPIs, rankings y estados del proceso.', color: '#8b5cf6', count: 4, badge: 'Nuevo' },
    { id: 'tareas', title: 'Tareas del Reclutador', desc: 'Organiza tareas del equipo de reclutamiento.', color: '#ec4899', count: 0, badge: null },
  ]

  return `
    <header class="dashboard-header">
      <div>
        <h1>Dashboard</h1>
        <p>Panel de administración de NextStepp</p>
      </div>
      <span class="dashboard-role-badge admin">Admin</span>
    </header>

    <div class="admin-alerts">
      ${pendingC > 0 ? `
        <div class="admin-alert warning" data-goto="empresas">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          <span>${pendingC} empresa(s) pendiente(s) de verificación</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
        </div>
      ` : ''}
      ${pendingV > 0 ? `
        <div class="admin-alert info" data-goto="vacantes">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
          <span>${pendingV} vacante(s) pendiente(s) de revisión</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
        </div>
      ` : ''}
    </div>

    <div class="admin-section">
      <h2>Módulos</h2>
      <div class="modules-grid">
        ${modules.map((mod) => `
          <a href="#" class="module-card" data-goto="${mod.id}">
            <div class="module-card-icon" style="background: ${mod.color}20; color: ${mod.color}; border: 1px solid ${mod.color}33;">
              ${SIDEBAR_ITEMS.find(s => s.id === mod.id)?.icon || ''}
            </div>
            <h3>${mod.title}</h3>
            <p>${mod.desc}</p>
            <div class="module-card-footer">
              <span class="module-card-count">${mod.count} registros</span>
              ${mod.badge ? `<span class="module-card-badge">${mod.badge}</span>` : ''}
            </div>
            <span class="module-card-arrow">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
            </span>
          </a>
        `).join('')}
      </div>
    </div>
  `
}

function renderVacantes() {
  const companies = getCompanies()
  const vacancies = getVacancies()
  const pendingCompanies = companies.filter((c) => c.companyStatus === 'pending')
  const pendingVacancies = vacancies.filter((v) => v.status === 'pending')

  return `
    <header class="dashboard-header">
      <div><h1>Vacantes</h1><p>Revisión de empresas, vacantes y clasificación IA</p></div>
    </header>

    ${pendingCompanies.length > 0 ? `
    <div class="admin-section">
      <h2>Empresas Pendientes (${pendingCompanies.length})</h2>
      <div class="review-cards">
        ${pendingCompanies.map((company) => {
          const check = classifyCompany(company)
          return `
            <div class="review-card" data-company-id="${company.id}">
              <div class="review-card-header">
                <h3>${company.companyName}</h3>
                ${statusBadge(company.companyStatus)}
              </div>
              <div class="review-card-body">
                <div class="review-info-grid">
                  <div><span class="label">Legal:</span> ${company.legalName}</div>
                  <div><span class="label">RFC:</span> ${company.taxId}</div>
                  <div><span class="label">Teléfono:</span> ${company.phone}</div>
                  <div><span class="label">Web:</span> ${company.website}</div>
                  <div><span class="label">Representante:</span> ${company.representative}</div>
                </div>
                <div class="ai-report">
                  <h4>Verificación IA</h4>
                  <div class="ai-score-bar"><div class="ai-score-fill ${check.approved ? 'good' : 'bad'}" style="width:${check.score}%"></div></div>
                  <span class="ai-score-text">${check.score}% — ${check.approved ? 'Cumple' : 'No cumple'}</span>
                  <div class="check-grid compact">
                    ${check.checks.map((r) => `
                      <div class="check-item ${r.passed ? 'passed' : 'failed'}">
                        <span class="check-icon">${r.passed ? '✓' : '✗'}</span><span>${r.rule}</span>
                      </div>
                    `).join('')}
                  </div>
                </div>
              </div>
              <div class="review-card-actions">
                <button class="btn btn-success approve-company" data-id="${company.id}">Aprobar</button>
                <button class="btn btn-danger reject-company" data-id="${company.id}">Rechazar</button>
              </div>
            </div>`
        }).join('')}
      </div>
    </div>` : ''}

    <div class="admin-section">
      <h2>Vacantes Pendientes (${pendingVacancies.length})</h2>
      ${pendingVacancies.length === 0 ? '<p class="empty-text">No hay vacantes pendientes.</p>' : ''}
      <div class="review-cards">
        ${pendingVacancies.map((vacancy) => {
          const company = getCompanyById(vacancy.companyId)
          const ai = classifyVacancy(vacancy, company)
          return `
            <div class="review-card vacancy-review" data-vacancy-id="${vacancy.id}">
              <div class="review-card-header">
                <div>
                  <h3>${vacancy.positionName}</h3>
                  <span class="vacancy-company">${company ? company.companyName : 'Desconocida'}</span>
                </div>
                <div class="ai-final-score ${ai.recommended ? 'recommended' : ai.autoReject ? 'auto-reject' : 'review'}">
                  <span class="ai-final-number">${ai.finalScore}</span>
                  <span class="ai-final-label">${ai.autoReject ? 'RECHAZO AUTO' : ai.recommended ? 'RECOMENDADO' : 'REVISAR'}</span>
                </div>
              </div>
              <div class="review-card-body">
                <div class="vacancy-details-grid">
                  <div><span class="label">Ubicación:</span> ${vacancy.location}</div>
                  <div><span class="label">Modalidad:</span> ${vacancy.modality}</div>
                  <div><span class="label">Salario:</span> ${vacancy.salaryRange}</div>
                </div>
                <div class="vacancy-text-block"><strong>Descripción:</strong><p>${vacancy.description}</p></div>
                <div class="vacancy-text-block"><strong>Requisitos:</strong><p>${vacancy.requirements}</p></div>
                <div class="ai-report">
                  <h4>Clasificación IA</h4>
                  <div class="ai-score-bar"><div class="ai-score-fill ${ai.finalScore >= 70 ? 'good' : 'bad'}" style="width:${ai.finalScore}%"></div></div>
                  <div class="check-grid compact">
                    ${ai.checks.map((r) => `
                      <div class="check-item ${r.passed ? 'passed' : 'failed'}">
                        <span class="check-icon">${r.passed ? '✓' : '✗'}</span><span>${r.rule}</span>
                      </div>
                    `).join('')}
                  </div>
                </div>
                ${ai.security.flags.length > 0 ? `
                  <div class="ai-report security">
                    <h4>Alertas de Seguridad</h4>
                    ${ai.security.flags.map((f) => `
                      <div class="flag-item ${f.severity}"><span class="flag-severity">${f.severity.toUpperCase()}</span><span>${f.detail}</span></div>
                    `).join('')}
                  </div>` : ''}
              </div>
              <div class="review-card-actions">
                <button class="btn btn-success approve-vacancy" data-id="${vacancy.id}">Aprobar y Publicar</button>
                <button class="btn btn-danger reject-vacancy" data-id="${vacancy.id}">Rechazar</button>
              </div>
            </div>`
        }).join('')}
      </div>
    </div>

    <div class="admin-section">
      <h2>Todas las Vacantes (${vacancies.length})</h2>
      <div class="client-table-container">
        <table class="client-table">
          <thead><tr><th>Puesto</th><th>Empresa</th><th>Modalidad</th><th>Estado</th><th>IA</th></tr></thead>
          <tbody>
            ${vacancies.map((v) => {
              const comp = getCompanyById(v.companyId)
              return `<tr>
                <td><strong>${v.positionName}</strong></td>
                <td>${comp ? comp.companyName : '-'}</td>
                <td>${v.modality}</td>
                <td>${statusBadge(v.status)}</td>
                <td>${v.aiScore !== null ? `<span class="ai-mini-score ${v.aiScore >= 70 ? 'good' : 'bad'}">${v.aiScore}</span>` : '-'}</td>
              </tr>`
            }).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `
}

function renderEmpresas() {
  const companies = getCompanies()
  return `
    <header class="dashboard-header">
      <div><h1>Empresas Clientes</h1><p>Directorio de empresas registradas</p></div>
    </header>
    <div class="client-table-container">
      <table class="client-table">
        <thead><tr><th>Empresa</th><th>Nombre Legal</th><th>RFC</th><th>Contacto</th><th>Email</th><th>Estado</th></tr></thead>
        <tbody>
          ${companies.map((c) => `
            <tr>
              <td><strong>${c.companyName}</strong></td>
              <td>${c.legalName}</td>
              <td>${c.taxId}</td>
              <td>${c.representative}</td>
              <td>${c.email}</td>
              <td>${statusBadge(c.companyStatus)}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `
}

function adaptarPostulacion(post) {
  if (post.esModificado) return post
  const idxP = (post.id - 1) % PUESTOS_ES.length
  const idxC = (post.id - 1) % CARTAS_ES.length
  return {
    ...post,
    title: PUESTOS_ES[idxP],
    body: `${CARTAS_ES[idxC]} ${post.body ? `(Detalle: ${post.body.slice(0, 50)}...)` : ''}`,
    tags: Array.isArray(post.tags) && post.tags.length > 0 ? post.tags.slice(0, 3) : ['Selección', 'Talento']
  }
}

function getPostStatus(post) {
  if (post.estado) return post.estado
  const mod = post.id % 3
  if (mod === 0) return 'entrevista'
  if (mod === 1) return 'revision'
  return 'pendiente'
}

function renderPostBadge(status) {
  const map = {
    entrevista: '<span class="status-badge" style="background:rgba(16,185,129,.15);color:#10b981;">Entrevista</span>',
    revision: '<span class="status-badge" style="background:rgba(59,130,246,.15);color:#3b82f6;">En Revisión</span>',
    pendiente: '<span class="status-badge" style="background:rgba(245,158,11,.15);color:#f59e0b;">Pendiente</span>',
    aceptado: '<span class="status-badge" style="background:rgba(16,185,129,.15);color:#10b981;">Aceptado</span>',
    rechazado: '<span class="status-badge" style="background:rgba(239,68,68,.15);color:#ef4444;">Rechazado</span>'
  }
  return map[status] || map.pendiente
}

function escapePostHTML(str) {
  if (!str) return ''
  return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

function getFilteredPostulaciones() {
  const q = postulacionesSearch.toLowerCase()
  return postulacionesData.filter(p => {
    const matchQ = p.title?.toLowerCase().includes(q) || p.body?.toLowerCase().includes(q) || String(p.id).includes(q) || String(p.userId).includes(q) || (Array.isArray(p.tags) && p.tags.some(t => t.toLowerCase().includes(q)))
    const matchS = postulacionesFilter === 'all' || getPostStatus(p) === postulacionesFilter
    return matchQ && matchS
  })
}

function renderPostulacionesTable() {
  const filtered = getFilteredPostulaciones()
  const total = filtered.length
  const totalPages = Math.ceil(total / POST_PAGE_SIZE) || 1
  if (postulacionesPage > totalPages) postulacionesPage = totalPages
  if (postulacionesPage < 1) postulacionesPage = 1
  const start = (postulacionesPage - 1) * POST_PAGE_SIZE
  const pageItems = filtered.slice(start, start + POST_PAGE_SIZE)

  const rows = pageItems.length === 0
    ? '<tr><td colspan="8" style="text-align:center;padding:2rem;color:var(--text-muted);">No se encontraron postulaciones.</td></tr>'
    : pageItems.map(p => {
        const status = getPostStatus(p)
        const tags = (Array.isArray(p.tags) ? p.tags : []).map(t => `<span style="display:inline-block;padding:2px 8px;border-radius:9999px;border:1px solid var(--border);font-size:.7rem;color:var(--text-secondary);">${escapePostHTML(t)}</span>`).join(' ')
        const candidatoLabel = p.esLocal
          ? `<span style="font-weight:700;color:#10b981;">🟢 ${escapePostHTML(p.candidato)}</span><br><small style="color:var(--text-muted);font-size:.75rem;">${escapePostHTML(p.email)}</small>`
          : `<span style="color:var(--text-muted);">ID ${p.userId}</span>`
        const matchVal = p.esLocal ? 95 : Math.min(p.reactions?.likes || p.views || 92, 100)
        return `<tr ${p.esLocal ? 'style="background:rgba(16,185,129,.04);border-left:3px solid #10b981;"' : ''}>
          <td style="font-weight:700;color:var(--accent);">${p.esLocal ? '🆕' : '#' + p.id}</td>
          <td>${candidatoLabel}</td>
          <td style="font-weight:600;">${escapePostHTML(p.title)}</td>
          <td style="color:var(--text-secondary);max-width:220px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;" title="${escapePostHTML(p.body)}">${escapePostHTML(p.body)}</td>
          <td>${tags}</td>
          <td>${renderPostBadge(status)}</td>
          <td style="text-align:center;font-weight:600;color:var(--success);">${matchVal}%</td>
          <td style="white-space:nowrap;">
            <button class="btn btn-sm btn-outline post-edit-btn" data-id="${p.id}">Editar</button>
            <button class="btn btn-sm btn-outline post-del-btn" data-id="${p.id}" style="color:#ef4444;border-color:rgba(239,68,68,.3);">Eliminar</button>
          </td>
        </tr>`
      }).join('')

  return `
    <header class="dashboard-header">
      <div><h1>Postulaciones</h1><p>Gestiona las postulaciones de candidatos a vacantes publicadas.</p></div>
      <div style="display:flex;gap:.5rem;">
        <button class="btn btn-primary" id="postNewBtn">+ Nueva Postulación</button>
      </div>
    </header>
    <div class="dashboard-card" style="padding:1rem;margin-bottom:1rem;display:flex;gap:.75rem;flex-wrap:wrap;align-items:center;">
      <input type="text" class="form-input" id="postSearch" placeholder="Buscar por título, ID, candidato..." value="${escapePostHTML(postulacionesSearch)}" style="flex:1;min-width:200px;" />
      <select class="form-input" id="postFilter" style="width:auto;">
        <option value="all" ${postulacionesFilter === 'all' ? 'selected' : ''}>Todos</option>
        <option value="entrevista" ${postulacionesFilter === 'entrevista' ? 'selected' : ''}>Entrevista</option>
        <option value="revision" ${postulacionesFilter === 'revision' ? 'selected' : ''}>En Revisión</option>
        <option value="pendiente" ${postulacionesFilter === 'pendiente' ? 'selected' : ''}>Pendiente</option>
        <option value="aceptado" ${postulacionesFilter === 'aceptado' ? 'selected' : ''}>Aceptado</option>
        <option value="rechazado" ${postulacionesFilter === 'rechazado' ? 'selected' : ''}>Rechazado</option>
      </select>
    </div>
    <div class="dashboard-card" style="overflow-x:auto;">
      <table class="dashboard-table">
        <thead>
          <tr>
            <th>ID</th><th>Candidato</th><th>Puesto</th><th>Carta Presentación</th><th>Tags</th><th>Estado</th><th>Match</th><th>Acciones</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
      <div style="padding:.75rem 1rem;display:flex;justify-content:space-between;align-items:center;border-top:1px solid var(--border);font-size:.85rem;color:var(--text-secondary);">
        <span>Página ${postulacionesPage} de ${totalPages} — ${total} registros</span>
        <div style="display:flex;gap:.25rem;">
          <button class="btn btn-sm btn-outline" id="postFirst" ${postulacionesPage <= 1 ? 'disabled' : ''}>«</button>
          <button class="btn btn-sm btn-outline" id="postPrev" ${postulacionesPage <= 1 ? 'disabled' : ''}>‹</button>
          <button class="btn btn-sm btn-outline" id="postNext" ${postulacionesPage >= totalPages ? 'disabled' : ''}>›</button>
          <button class="btn btn-sm btn-outline" id="postLast" ${postulacionesPage >= totalPages ? 'disabled' : ''}>»</button>
        </div>
      </div>
    </div>

    <div class="modal-overlay" id="postModal" style="display:none;">
      <div class="modal" style="max-width:560px;border-radius:16px;">
        <div class="modal-header" style="padding:1.25rem 1.5rem;border-bottom:1px solid var(--border);">
          <h3 id="postModalTitle" style="font-size:1.1rem;font-weight:700;">Nueva Postulación</h3>
          <button class="modal-close" id="postModalClose">&times;</button>
        </div>
        <form id="postForm" style="padding:1.5rem;display:flex;flex-direction:column;gap:1rem;">
          <input type="hidden" id="postEditId" />
          <input type="hidden" id="postIsLocal" value="false" />

          <div class="form-group" id="postCandidatoGroup">
            <label id="postUserIdLabel">Candidato (UserID)</label>
            <input class="form-input" type="text" id="postUserId" placeholder="Nombre o ID del candidato" required />
          </div>

          <div class="form-group" id="postEmailGroup" style="display:none;">
            <label>Email del Candidato</label>
            <input class="form-input" type="email" id="postEmail" placeholder="candidato@email.com" />
          </div>

          <div class="form-group">
            <label>Puesto / Título</label>
            <input class="form-input" type="text" id="postTitle" placeholder="Ej: Desarrollador Full Stack" required />
          </div>

          <div class="form-group">
            <label>Carta de Presentación</label>
            <textarea class="form-input" rows="4" id="postBody" placeholder="Descripción del candidato, experiencia, etc." required style="resize:vertical;"></textarea>
          </div>

          <div class="form-group">
            <label>Habilidades / Tags (separados por coma)</label>
            <input class="form-input" type="text" id="postTags" placeholder="React, Node.js, Python..." />
          </div>

          <div class="form-group" id="postStatusGroup" style="display:none;">
            <label>Estado de la Postulación</label>
            <select class="form-input" id="postStatusSelect">
              <option value="revision">En Revisión</option>
              <option value="entrevista">Entrevista</option>
              <option value="pendiente">Pendiente</option>
              <option value="aceptado">Aceptado ✓</option>
              <option value="rechazado">Rechazado ✗</option>
            </select>
          </div>

          <div style="display:flex;gap:.5rem;justify-content:flex-end;padding-top:.5rem;border-top:1px solid var(--border);">
            <button type="button" class="btn btn-outline" id="postModalCancel">Cancelar</button>
            <button type="submit" class="btn btn-primary" id="postSubmitBtn">Guardar</button>
          </div>
        </form>
      </div>
    </div>

  `
}

function bindPostulacionesEvents() {
  const search = document.getElementById('postSearch')
  const filter = document.getElementById('postFilter')
  if (search) {
    search.addEventListener('input', (e) => { postulacionesSearch = e.target.value; postulacionesPage = 1; refreshPostulacionesTable() })
  }
  if (filter) {
    filter.addEventListener('change', (e) => { postulacionesFilter = e.target.value; postulacionesPage = 1; refreshPostulacionesTable() })
  }

  document.getElementById('postFirst')?.addEventListener('click', () => { postulacionesPage = 1; refreshPostulacionesTable() })
  document.getElementById('postPrev')?.addEventListener('click', () => { if (postulacionesPage > 1) { postulacionesPage--; refreshPostulacionesTable() } })
  document.getElementById('postNext')?.addEventListener('click', () => {
    const total = Math.ceil(getFilteredPostulaciones().length / POST_PAGE_SIZE) || 1
    if (postulacionesPage < total) { postulacionesPage++; refreshPostulacionesTable() }
  })
  document.getElementById('postLast')?.addEventListener('click', () => {
    postulacionesPage = Math.ceil(getFilteredPostulaciones().length / POST_PAGE_SIZE) || 1
    refreshPostulacionesTable()
  })

  document.getElementById('postNewBtn')?.addEventListener('click', () => openPostModal())
  document.getElementById('postModalClose')?.addEventListener('click', closePostModal)
  document.getElementById('postModalCancel')?.addEventListener('click', closePostModal)
  document.getElementById('postModal')?.addEventListener('click', (e) => { if (e.target.id === 'postModal') closePostModal() })

  document.getElementById('postForm')?.addEventListener('submit', handlePostSubmit)

  document.querySelectorAll('.post-edit-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const p = postulacionesData.find(x => String(x.id) === btn.dataset.id)
      if (p) openPostModal(p)
    })
  })
  document.querySelectorAll('.post-del-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      const result = await Swal.fire({
        title: '¿Eliminar postulación?',
        text: 'Esta acción no se puede deshacer.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#ef4444',
        cancelButtonColor: '#6b7280',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
      })
      if (!result.isConfirmed) return
      const id = btn.dataset.id
      const isLocal = String(id).startsWith('local-')
      try {
        if (isLocal) {
          // Eliminar del localStorage
          const locales = JSON.parse(localStorage.getItem('nextstepp_postulaciones') || '[]')
          localStorage.setItem('nextstepp_postulaciones', JSON.stringify(locales.filter(x => String(x.id) !== id)))
        } else {
          await deletePostulacion(id)
        }
        postulacionesData = postulacionesData.filter(x => String(x.id) !== id)
        refreshPostulacionesTable()
        Swal.fire({ title: 'Eliminada', text: 'Postulación eliminada correctamente.', icon: 'success', timer: 2000, showConfirmButton: false })
      } catch (e) { Swal.fire({ title: 'Error', text: e.message, icon: 'error' }) }
    })
  })
}

function openPostModal(post = null) {
  const modal = document.getElementById('postModal')
  const title = document.getElementById('postModalTitle')
  const statusGrp = document.getElementById('postStatusGroup')
  const emailGrp = document.getElementById('postEmailGroup')
  const userIdLabel = document.getElementById('postUserIdLabel')
  const isLocal = !!post?.esLocal

  document.getElementById('postEditId').value = post ? post.id : ''
  document.getElementById('postIsLocal').value = isLocal ? 'true' : 'false'
  document.getElementById('postUserId').value = post
    ? (isLocal ? (post.candidato || '') : (post.userId || ''))
    : ''
  document.getElementById('postEmail').value = post?.email || ''
  document.getElementById('postTitle').value = post?.title || ''
  document.getElementById('postBody').value = post?.body || ''
  document.getElementById('postTags').value = post && Array.isArray(post.tags) ? post.tags.join(', ') : ''
  document.getElementById('postSubmitBtn').textContent = post ? 'Actualizar' : 'Guardar'

  if (isLocal) {
    userIdLabel.textContent = 'Nombre del Candidato'
    emailGrp.style.display = 'block'
  } else {
    userIdLabel.textContent = 'Candidato (UserID)'
    emailGrp.style.display = 'none'
  }

  title.textContent = post
    ? (isLocal
        ? `✏️ Editar — ${post.candidato || post.email || 'Candidato'}`
        : `✏️ Editar Postulación #${post.id}`)
    : '+ Nueva Postulación'

  statusGrp.style.display = post ? 'block' : 'none'
  if (post) document.getElementById('postStatusSelect').value = getPostStatus(post)
  modal.style.display = 'flex'
  // Focus primer campo
  setTimeout(() => document.getElementById('postUserId').focus(), 100)
}

function closePostModal() {
  document.getElementById('postModal').style.display = 'none'
  document.getElementById('postForm').reset()
}

async function handlePostSubmit(e) {
  e.preventDefault()
  const editId = document.getElementById('postEditId').value
  const isLocal = document.getElementById('postIsLocal').value === 'true'
  const btn = document.getElementById('postSubmitBtn')
  btn.disabled = true
  btn.textContent = 'Guardando...'

  const candidatoNombre = document.getElementById('postUserId').value.trim()
  const candidatoEmail = document.getElementById('postEmail').value.trim()

  const data = {
    userId: isLocal ? candidatoNombre : (parseInt(candidatoNombre) || 1),
    candidato: candidatoNombre,
    email: candidatoEmail,
    title: document.getElementById('postTitle').value.trim(),
    body: document.getElementById('postBody').value.trim(),
    tags: document.getElementById('postTags').value.split(',').map(t => t.trim()).filter(Boolean)
  }

  try {
    if (editId) {
      const estado = document.getElementById('postStatusSelect').value
      if (isLocal) {
        // Actualizar en localStorage
        const locales = JSON.parse(localStorage.getItem('nextstepp_postulaciones') || '[]')
        const localIdx = locales.findIndex(x => String(x.id) === String(editId))
        if (localIdx !== -1) {
          locales[localIdx] = {
            ...locales[localIdx],
            candidato: data.candidato,
            email: data.email,
            title: data.title,
            body: data.body,
            tags: data.tags,
            estado,
            esLocal: true,
            esModificado: true
          }
          localStorage.setItem('nextstepp_postulaciones', JSON.stringify(locales))
        }
      } else {
        await updatePostulacion(editId, { title: data.title, body: data.body })
      }
      // Actualizar en memoria
      const idx = postulacionesData.findIndex(x => String(x.id) === String(editId))
      if (idx !== -1) {
        postulacionesData[idx] = {
          ...postulacionesData[idx],
          ...data,
          estado,
          esModificado: true
        }
      }
      Swal.fire({ title: '✅ Actualizada', text: 'Postulación actualizada correctamente.', icon: 'success', timer: 2000, showConfirmButton: false })
    } else {
      // Nueva postulación via API
      const newPost = await createPostulacion({
        userId: parseInt(candidatoNombre) || 1,
        title: data.title,
        body: data.body,
        tags: data.tags
      })
      newPost.estado = 'revision'
      newPost.esModificado = true
      postulacionesData.unshift(newPost)
      Swal.fire({ title: '✅ Creada', text: `Postulación #${newPost.id} registrada.`, icon: 'success', timer: 2000, showConfirmButton: false })
    }
    closePostModal()
    postulacionesPage = 1
    refreshPostulacionesTable()
  } catch (err) {
    Swal.fire({ title: 'Error', text: err.message, icon: 'error' })
  } finally {
    btn.disabled = false
    btn.textContent = editId ? 'Actualizar' : 'Guardar'
  }
}

function refreshPostulacionesTable() {
  const main = document.querySelector('.dashboard-main')
  if (main) {
    main.innerHTML = renderPostulacionesTable()
    bindPostulacionesEvents()
  }
}

function renderPostulaciones() {
  return renderPostulacionesTable()
}

async function loadPostulacionesData() {
  try {
    // Cargar postulaciones locales (enviadas desde Mi Perfil)
    const locales = JSON.parse(localStorage.getItem('nextstepp_postulaciones') || '[]')

    // Cargar postulaciones de la API
    const data = await getPostulaciones(30, 0)
    const apiData = (data.posts || []).map(adaptarPostulacion)

    // Combinar: locales primero (más recientes), luego los de la API
    postulacionesData = [...locales, ...apiData]
    refreshPostulacionesTable()
  } catch (e) {
    console.error('Error cargando postulaciones:', e)
    // Si falla la API, al menos mostrar las locales
    const locales = JSON.parse(localStorage.getItem('nextstepp_postulaciones') || '[]')
    postulacionesData = locales
    refreshPostulacionesTable()
  }
}

const DEFAULT_ENTREVISTAS = [
  {
    id: 1,
    candidato: 'Maria Gonzalez',
    vacante: 'Desarrollador Frontend Junior',
    empresa: 'Tech Solutions CR',
    reclutador: 'Daniel Ortega',
    fecha: '2026-08-25',
    hora: '10:00 a.m.',
    modalidad: 'Virtual',
    estado: 'Programada',
    tec: 2,
    com: 5,
    exp: 3,
    adap: 5,
    obs: 'Candidata con buen potencial tecnico y excelente adaptacion.',
    resultado: 'En espera / Por decidir',
  },
  {
    id: 2,
    candidato: 'Maria Gonzalez',
    vacante: 'Desarrollador Frontend Junior',
    empresa: 'Tech Solutions CR',
    reclutador: 'Daniel Ortega',
    fecha: '2026-08-20',
    hora: '02:00 p.m.',
    modalidad: 'Presencial',
    estado: 'Finalizada',
    tec: 4,
    com: 4,
    exp: 4,
    adap: 4,
    obs: 'Muy buena entrevista tecnica inicial.',
    resultado: 'Aprobada - Avanza de etapa',
  },
  {
    id: 3,
    candidato: 'Carlos Perez',
    vacante: 'Soporte TI',
    empresa: 'Global Tech',
    reclutador: 'Laura Vargas',
    fecha: '2026-08-15',
    hora: '11:00 a.m.',
    modalidad: 'Virtual',
    estado: 'Finalizada',
    tec: 3,
    com: 3,
    exp: 3,
    adap: 3,
    obs: 'Falto profundidad en redes.',
    resultado: 'Rechazada',
  },
]

let entrevistasData = null
let entrevistaActivaId = null
let entrevistasFiltroFecha = ''

function getEntrevistasData() {
  if (!entrevistasData) {
    const stored = localStorage.getItem('nextstepp_entrevistas_v2')
    entrevistasData = stored ? JSON.parse(stored) : [...DEFAULT_ENTREVISTAS]
  }
  if (!entrevistaActivaId && entrevistasData.length > 0) entrevistaActivaId = entrevistasData[0].id
  return entrevistasData
}

function saveEntrevistasData() {
  localStorage.setItem('nextstepp_entrevistas_v2', JSON.stringify(entrevistasData))
}

function formatInterviewDate(date) {
  if (!date) return ''
  const [year, month, day] = date.split('-')
  return day && month && year ? `${day}/${month}/${year}` : date
}

function interviewBadge(result) {
  if (result?.includes('Aprobada')) return '<span class="status-badge status-approved">Aprobada</span>'
  if (result?.includes('Rechazada') || result?.includes('Cancelada')) return '<span class="status-badge status-rejected">Rechazada</span>'
  return '<span class="status-badge status-pending">Pendiente</span>'
}

function getActiveInterview() {
  return getEntrevistasData().find(e => e.id === entrevistaActivaId) || getEntrevistasData()[0]
}

function renderEntrevistas() {
  const entrevistas = getEntrevistasData()
  const active = getActiveInterview()
  const filtered = entrevistasFiltroFecha ? entrevistas.filter(e => e.fecha === entrevistasFiltroFecha) : entrevistas

  return `
    <header class="dashboard-header">
      <div><h1>Entrevistas / Notas</h1><p>Programa entrevistas, evalua candidatos y consulta el historial.</p></div>
      <button class="btn btn-success" id="newInterviewBtn">+ Nueva Entrevista</button>
    </header>

    <div class="interview-grid">
      <section class="dashboard-card interview-detail">
        <h2>Detalle de la entrevista</h2>
        <div class="review-info-grid">
          <div><span class="label">Candidato:</span> <strong>${active?.candidato || '-'}</strong></div>
          <div><span class="label">Vacante:</span> ${active?.vacante || '-'}</div>
          <div><span class="label">Empresa:</span> ${active?.empresa || '-'}</div>
          <div><span class="label">Reclutador:</span> ${active?.reclutador || '-'}</div>
          <div><span class="label">Fecha:</span> ${formatInterviewDate(active?.fecha)}</div>
          <div><span class="label">Hora:</span> ${active?.hora || '-'}</div>
          <div><span class="label">Modalidad:</span> ${active?.modalidad || '-'}</div>
          <div><span class="label">Estado:</span> ${active?.estado || '-'}</div>
        </div>
        <div class="review-card-actions compact-actions">
          <button class="btn btn-danger" id="cancelInterviewBtn">Cancelar</button>
          <button class="btn btn-outline" id="changeInterviewDateBtn">Cambiar Fecha</button>
        </div>
      </section>

      <section class="dashboard-card">
        <h2>Evaluacion de la entrevista</h2>
        <form id="interviewEvalForm" class="admin-form">
          <div class="form-row">
            <div class="form-group"><label>Conocimientos tecnicos</label><input class="form-input" type="number" min="1" max="5" id="evalTec" value="${active?.tec || 3}" required /></div>
            <div class="form-group"><label>Comunicacion</label><input class="form-input" type="number" min="1" max="5" id="evalCom" value="${active?.com || 3}" required /></div>
          </div>
          <div class="form-row">
            <div class="form-group"><label>Experiencia</label><input class="form-input" type="number" min="1" max="5" id="evalExp" value="${active?.exp || 3}" required /></div>
            <div class="form-group"><label>Adaptabilidad</label><input class="form-input" type="number" min="1" max="5" id="evalAdap" value="${active?.adap || 3}" required /></div>
          </div>
          <div class="form-group"><label>Observaciones generales</label><textarea class="form-input form-textarea" id="evalObs">${active?.obs || ''}</textarea></div>
          <div class="form-group">
            <label>Resultado final</label>
            <select class="form-input" id="evalResultado">
              ${['En espera / Por decidir', 'Aprobada - Avanza de etapa', 'Rechazada', 'Cancelada - No realizada'].map(result => `<option value="${result}" ${active?.resultado === result ? 'selected' : ''}>${result}</option>`).join('')}
            </select>
          </div>
          <button class="btn btn-primary" type="submit">Guardar evaluacion</button>
        </form>
      </section>
    </div>

    <section class="dashboard-card">
      <div class="section-actions">
        <h2>Historial de entrevistas</h2>
        <div class="inline-filters">
          <input class="form-input" type="date" id="interviewDateFilter" value="${entrevistasFiltroFecha}" />
          <button class="btn btn-outline" id="clearInterviewFilter">Limpiar</button>
        </div>
      </div>
      <div class="client-table-container">
        <table class="client-table">
          <thead><tr><th>Candidato</th><th>Vacante / Empresa</th><th>Fecha</th><th>Modalidad</th><th>Resultado</th><th>Acciones</th></tr></thead>
          <tbody>
            ${filtered.length === 0 ? '<tr><td colspan="6" class="empty-text">No se encontraron entrevistas.</td></tr>' : filtered.map(ent => `
              <tr class="${ent.id === entrevistaActivaId ? 'active-table-row' : ''}">
                <td><strong>${ent.candidato}</strong><br><span class="muted-text">${ent.reclutador}</span></td>
                <td>${ent.vacante}<br><span class="muted-text">${ent.empresa}</span></td>
                <td>${formatInterviewDate(ent.fecha)}<br><span class="muted-text">${ent.hora}</span></td>
                <td>${ent.modalidad}</td>
                <td>${interviewBadge(ent.resultado)}</td>
                <td>
                  <button class="btn btn-sm btn-outline interview-select" data-id="${ent.id}">Ver / Editar</button>
                  <button class="btn btn-sm btn-outline interview-delete" data-id="${ent.id}">Borrar</button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </section>
  `
}

function bindEntrevistasEvents() {
  document.getElementById('interviewEvalForm')?.addEventListener('submit', (e) => {
    e.preventDefault()
    const active = getActiveInterview()
    if (!active) return
    active.tec = Number(document.getElementById('evalTec').value)
    active.com = Number(document.getElementById('evalCom').value)
    active.exp = Number(document.getElementById('evalExp').value)
    active.adap = Number(document.getElementById('evalAdap').value)
    active.obs = document.getElementById('evalObs').value.trim()
    active.resultado = document.getElementById('evalResultado').value
    active.estado = active.resultado.includes('Cancelada') ? 'Cancelada' : active.resultado.includes('Por decidir') ? 'Programada' : 'Finalizada'
    saveEntrevistasData()
    Swal.fire({ title: 'Evaluacion guardada', icon: 'success', timer: 1600, showConfirmButton: false })
    reRender()
  })

  document.querySelectorAll('.interview-select').forEach(btn => {
    btn.addEventListener('click', () => {
      entrevistaActivaId = Number(btn.dataset.id)
      reRender()
    })
  })

  document.querySelectorAll('.interview-delete').forEach(btn => {
    btn.addEventListener('click', async () => {
      const result = await Swal.fire({ title: 'Eliminar entrevista?', icon: 'warning', showCancelButton: true, confirmButtonText: 'Eliminar', cancelButtonText: 'Cancelar' })
      if (!result.isConfirmed) return
      entrevistasData = getEntrevistasData().filter(e => e.id !== Number(btn.dataset.id))
      entrevistaActivaId = entrevistasData[0]?.id || null
      saveEntrevistasData()
      reRender()
    })
  })

  document.getElementById('interviewDateFilter')?.addEventListener('input', (e) => {
    entrevistasFiltroFecha = e.target.value
    reRender()
  })

  document.getElementById('clearInterviewFilter')?.addEventListener('click', () => {
    entrevistasFiltroFecha = ''
    reRender()
  })

  document.getElementById('cancelInterviewBtn')?.addEventListener('click', () => {
    const active = getActiveInterview()
    if (!active) return
    active.estado = 'Cancelada'
    active.resultado = 'Cancelada - No realizada'
    saveEntrevistasData()
    reRender()
  })

  document.getElementById('changeInterviewDateBtn')?.addEventListener('click', async () => {
    const active = getActiveInterview()
    if (!active) return
    const result = await Swal.fire({
      title: 'Cambiar fecha',
      input: 'date',
      inputValue: active.fecha,
      showCancelButton: true,
      confirmButtonText: 'Actualizar',
      cancelButtonText: 'Cancelar',
    })
    if (result.isConfirmed && result.value) {
      active.fecha = result.value
      saveEntrevistasData()
      reRender()
    }
  })

  document.getElementById('newInterviewBtn')?.addEventListener('click', async () => {
    const result = await Swal.fire({
      title: 'Nueva entrevista',
      html: `
        <input id="swalCandidato" class="swal2-input" placeholder="Candidato">
        <input id="swalVacante" class="swal2-input" placeholder="Vacante">
        <input id="swalEmpresa" class="swal2-input" placeholder="Empresa">
        <input id="swalFecha" class="swal2-input" type="date">
      `,
      showCancelButton: true,
      confirmButtonText: 'Crear',
      cancelButtonText: 'Cancelar',
      preConfirm: () => {
        const candidato = document.getElementById('swalCandidato').value.trim()
        const vacante = document.getElementById('swalVacante').value.trim()
        const empresa = document.getElementById('swalEmpresa').value.trim()
        const fecha = document.getElementById('swalFecha').value
        if (!candidato || !vacante || !fecha) {
          Swal.showValidationMessage('Completa candidato, vacante y fecha.')
          return null
        }
        return { candidato, vacante, empresa: empresa || 'Empresa Confidencial', fecha }
      },
    })
    if (!result.isConfirmed || !result.value) return
    const nueva = {
      id: Date.now(),
      ...result.value,
      reclutador: 'Daniel Ortega',
      hora: '09:00 a.m.',
      modalidad: 'Virtual',
      estado: 'Programada',
      tec: 3,
      com: 3,
      exp: 3,
      adap: 3,
      obs: 'Entrevista recien programada.',
      resultado: 'En espera / Por decidir',
    }
    getEntrevistasData().unshift(nueva)
    entrevistaActivaId = nueva.id
    saveEntrevistasData()
    reRender()
  })
}

const REPORT_DATA = {
  kpis: [
    { id: 'vacantes', label: 'Vacantes activas', value: 24, hint: 'Vacantes actualmente disponibles' },
    { id: 'postulaciones', label: 'Postulaciones', value: 186, hint: 'Postulaciones recibidas' },
    { id: 'entrevistas', label: 'Entrevistas programadas', value: 32, hint: 'Entrevistas pendientes' },
    { id: 'cubiertas', label: 'Vacantes cubiertas', value: 18, hint: 'Vacantes completadas' },
  ],
  estados: [
    { label: 'Postuladas', value: 142 },
    { label: 'En revision', value: 98 },
    { label: 'Preseleccionados', value: 61 },
    { label: 'Entrevistados', value: 40 },
    { label: 'Contratados', value: 18 },
  ],
  ranking: [
    { nombre: 'Maria Rodriguez', postulaciones: 45 },
    { nombre: 'Carlos Mendez', postulaciones: 38 },
    { nombre: 'Laura Vargas', postulaciones: 31 },
    { nombre: 'Andres Solano', postulaciones: 27 },
    { nombre: 'Diana Chaves', postulaciones: 22 },
  ],
}

function renderReportes() {
  const max = Math.max(...REPORT_DATA.estados.map(item => item.value))
  return `
    <header class="dashboard-header">
      <div><h1>Reportes</h1><p>Consulta el rendimiento del proceso de reclutamiento.</p></div>
      <button class="btn btn-primary" id="exportReportsBtn">Exportar CSV</button>
    </header>
    <section class="dashboard-card report-filters">
      <select class="form-input"><option>Este mes</option><option>Mes pasado</option><option>Este trimestre</option></select>
      <select class="form-input"><option>Todos los reclutadores</option><option>Maria Rodriguez</option><option>Carlos Mendez</option></select>
      <select class="form-input"><option>Todas las empresas</option><option>Tech Solutions CR</option><option>Global Tech</option></select>
      <button class="btn btn-outline" id="applyReportFilters">Aplicar filtros</button>
    </section>
    <section class="dashboard-stats">
      ${REPORT_DATA.kpis.map(kpi => `
        <article class="stat-card report-stat">
          <span class="stat-card-number">${kpi.value}</span>
          <span class="stat-card-label">${kpi.label}</span>
          <small>${kpi.hint}</small>
        </article>
      `).join('')}
    </section>
    <section class="report-grid">
      <article class="dashboard-card">
        <h2>Estado de las postulaciones</h2>
        <div class="admin-bar-chart">
          ${REPORT_DATA.estados.map(item => `
            <div class="admin-bar-col">
              <span>${item.value}</span>
              <div class="admin-bar" style="height:${(item.value / max) * 100}%"></div>
              <small>${item.label}</small>
            </div>
          `).join('')}
        </div>
      </article>
      <article class="dashboard-card">
        <h2>Rendimiento de reclutadores</h2>
        <div class="ranking-list">
          ${REPORT_DATA.ranking.map((item, index) => `
            <div class="ranking-row">
              <span class="ranking-position">${index + 1}</span>
              <span>${item.nombre}</span>
              <strong>${item.postulaciones}</strong>
            </div>
          `).join('')}
        </div>
      </article>
    </section>
    <section class="admin-section">
      <h2>Reportes disponibles</h2>
      <div class="modules-grid">
        ${['Candidatos', 'Vacantes', 'Postulaciones', 'Entrevistas'].map(label => `
          <button class="module-card report-card-action" data-report="${label}">
            <h3>Reporte de ${label}</h3>
            <p>Vista consolidada y lista para exportar.</p>
          </button>
        `).join('')}
      </div>
    </section>
  `
}

function bindReportesEvents() {
  document.getElementById('applyReportFilters')?.addEventListener('click', () => {
    Swal.fire({ title: 'Filtros aplicados', icon: 'success', timer: 1400, showConfirmButton: false })
  })

  document.querySelectorAll('.report-card-action').forEach(btn => {
    btn.addEventListener('click', () => {
      Swal.fire({ title: btn.dataset.report, text: 'Reporte listo para revision y exportacion.', icon: 'info' })
    })
  })

  document.getElementById('exportReportsBtn')?.addEventListener('click', () => {
    const rows = ['Indicador,Valor', ...REPORT_DATA.kpis.map(kpi => `${kpi.label},${kpi.value}`)]
    const blob = new Blob([rows.join('\n')], { type: 'text/csv;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'nextstepp-reportes.csv'
    link.click()
    URL.revokeObjectURL(url)
  })
}

function renderTareas() {
  const item = SIDEBAR_ITEMS.find(s => s.id === 'tareas')
  return renderPlaceholder('Tareas del Reclutador', 'Organiza y da seguimiento a las tareas del equipo.', item?.icon || '')
}

function renderPlaceholder(title, description, icon) {
  return `
    <header class="dashboard-header">
      <div><h1>${title}</h1><p>${description}</p></div>
    </header>
    <div class="empty-state">
      <div class="empty-state-icon">${icon}</div>
      <h3>Próximamente</h3>
      <p>Este módulo está en desarrollo.</p>
    </div>
  `
}

function reRender() {
  const user = guard()
  if (!user) return

  const app = document.getElementById('app')
  const renderer = MODULE_RENDERERS[currentSection] || MODULE_RENDERERS.dashboard

  app.innerHTML = `
    <div class="dashboard-layout">
      ${renderSidebar(user)}
      <main class="dashboard-main">${renderer()}</main>
    </div>
  `
  bindEvents()

  if (currentSection === 'postulaciones') {
    bindPostulacionesEvents()
    if (postulacionesData.length === 0) loadPostulacionesData()
  }

  if (currentSection === 'entrevistas') {
    bindEntrevistasEvents()
  }

  if (currentSection === 'reportes') {
    bindReportesEvents()
  }
}

function bindEvents() {
  document.getElementById('logoutBtn')?.addEventListener('click', () => {
    logout()
    navigate('/login')
  })

  document.getElementById('sidebarToggle')?.addEventListener('click', () => {
    document.getElementById('sidebar').classList.toggle('open')
  })

  document.querySelectorAll('[data-nav]').forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault()
      const targetId = link.dataset.nav
      const item = SIDEBAR_ITEMS.find(s => s.id === targetId)
      if (item?.route) {
        navigate(item.route)
      } else {
        currentSection = targetId
        reRender()
      }
    })
  })

  document.querySelectorAll('[data-goto]').forEach((el) => {
    el.addEventListener('click', (e) => {
      e.preventDefault()
      const targetId = el.dataset.goto
      const item = SIDEBAR_ITEMS.find(s => s.id === targetId)
      if (item?.route) {
        navigate(item.route)
      } else {
        currentSection = targetId
        reRender()
      }
    })
  })

  document.querySelectorAll('.approve-company').forEach((btn) => {
    btn.addEventListener('click', () => {
      updateCompany(parseInt(btn.dataset.id), { companyStatus: 'approved' })
      reRender()
    })
  })

  document.querySelectorAll('.reject-company').forEach((btn) => {
    btn.addEventListener('click', () => {
      updateCompany(parseInt(btn.dataset.id), { companyStatus: 'rejected' })
      reRender()
    })
  })

  document.querySelectorAll('.approve-vacancy').forEach((btn) => {
    btn.addEventListener('click', () => {
      updateVacancy(parseInt(btn.dataset.id), { status: 'approved' })
      reRender()
    })
  })

  document.querySelectorAll('.reject-vacancy').forEach((btn) => {
    btn.addEventListener('click', () => {
      updateVacancy(parseInt(btn.dataset.id), { status: 'rejected' })
      reRender()
    })
  })
}

export function renderAdminDashboard() {
  currentSection = 'dashboard'
  reRender()
}

export function renderAdminProducts() {
  currentSection = 'vacantes'
  reRender()
}

export function renderAdminCarts() {
  currentSection = 'empresas'
  reRender()
}

export function renderAdminPosts() {
  currentSection = 'postulaciones'
  reRender()
}

export function renderAdminComments() {
  currentSection = 'entrevistas'
  reRender()
}

export function renderAdminTodos() {
  currentSection = 'tareas'
  reRender()
}

export function renderAdminReports() {
  currentSection = 'reportes'
  reRender()
}
