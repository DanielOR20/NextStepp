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
import { SIDEBAR_ITEMS } from '../../config/constants.js'
import { statusBadge } from '../../utils/helpers.js'

let currentSection = 'dashboard'

const MODULE_RENDERERS = {
  dashboard: renderDashboard,
  vacantes: renderVacantes,
  empresas: renderEmpresas,
  postulaciones: renderPostulaciones,
  entrevistas: renderEntrevistas,
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

function renderPostulaciones() {
  const item = SIDEBAR_ITEMS.find(s => s.id === 'postulaciones')
  return renderPlaceholder('Postulaciones', 'Gestiona las postulaciones de candidatos a vacantes publicadas.', item?.icon || '')
}

function renderEntrevistas() {
  const item = SIDEBAR_ITEMS.find(s => s.id === 'entrevistas')
  return renderPlaceholder('Entrevistas / Notas', 'Programa entrevistas y registra notas de seguimiento.', item?.icon || '')
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
