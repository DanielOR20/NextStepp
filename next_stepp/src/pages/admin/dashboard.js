import { getCurrentUser, logout } from '../../auth.js'
import { navigate } from '../../router.js'
import {
  getCompanies,
  getVacancies,
  updateCompany,
  updateVacancy,
  getCompanyById,
} from '../../store.js'
import { classifyCompany, classifyVacancy } from '../../ai-classifier.js'

const SIDEBAR_ITEMS = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>`,
  },
  {
    id: 'vacantes',
    label: 'Vacantes',
    icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>`,
  },
  {
    id: 'empresas',
    label: 'Empresas Clientes',
    icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`,
  },
  {
    id: 'postulaciones',
    label: 'Postulaciones',
    icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>`,
  },
  {
    id: 'entrevistas',
    label: 'Entrevistas / Notas',
    icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>`,
  },
  {
    id: 'tareas',
    label: 'Tareas del Reclutador',
    icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>`,
  },
]

let currentSection = 'dashboard'

function statusBadge(status) {
  const map = {
    pending: { label: 'En Revisión', cls: 'status-pending' },
    approved: { label: 'Aprobada', cls: 'status-approved' },
    rejected: { label: 'Rechazada', cls: 'status-rejected' },
  }
  const s = map[status] || map.pending
  return `<span class="status-badge ${s.cls}">${s.label}</span>`
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
            <span class="sidebar-user-role">Administrador</span>
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
    {
      id: 'vacantes',
      title: 'Vacantes',
      description: 'Revisa, clasifica con IA y aprueba vacantes publicadas por empresas.',
      icon: SIDEBAR_ITEMS[1].icon,
      color: '#6366f1',
      count: vacancies.length,
      badge: pendingV > 0 ? `${pendingV} pendientes` : null,
    },
    {
      id: 'empresas',
      title: 'Empresas Clientes',
      description: 'Verifica y aprueba empresas que desean publicar vacantes.',
      icon: SIDEBAR_ITEMS[2].icon,
      color: '#06b6d4',
      count: companies.length,
      badge: pendingC > 0 ? `${pendingC} pendientes` : null,
    },
    {
      id: 'postulaciones',
      title: 'Postulaciones',
      description: 'Gestiona las postulaciones de candidatos a vacantes publicadas.',
      icon: SIDEBAR_ITEMS[3].icon,
      color: '#10b981',
      count: 0,
      badge: null,
    },
    {
      id: 'entrevistas',
      title: 'Entrevistas / Notas',
      description: 'Programa entrevistas y registra notas de seguimiento de candidatos.',
      icon: SIDEBAR_ITEMS[4].icon,
      color: '#f59e0b',
      count: 0,
      badge: null,
    },
    {
      id: 'tareas',
      title: 'Tareas del Reclutador',
      description: 'Organiza y da seguimiento a las tareas del equipo de reclutamiento.',
      icon: SIDEBAR_ITEMS[5].icon,
      color: '#ec4899',
      count: 0,
      badge: null,
    },
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
        <div class="admin-alert warning" data-goto="vacantes">
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
              ${mod.icon}
            </div>
            <h3>${mod.title}</h3>
            <p>${mod.description}</p>
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

    <div class="admin-section">
      <h2>Flujo del Sistema</h2>
      <div class="flow-diagram">
        <div class="flow-step"><span class="flow-icon">🏢</span><span>Empresa se registra</span></div>
        <div class="flow-arrow">→</div>
        <div class="flow-step pending"><span class="flow-icon">⏳</span><span>En revisión</span></div>
        <div class="flow-arrow">→</div>
        <div class="flow-step"><span class="flow-icon">✅</span><span>Admin verifica</span></div>
        <div class="flow-arrow">→</div>
        <div class="flow-step approved"><span class="flow-icon">🏢</span><span>Empresa aprobada</span></div>
        <div class="flow-arrow">→</div>
        <div class="flow-step"><span class="flow-icon">📝</span><span>Publica vacante</span></div>
        <div class="flow-arrow">→</div>
        <div class="flow-step pending"><span class="flow-icon">🤖</span><span>IA clasifica</span></div>
        <div class="flow-arrow">→</div>
        <div class="flow-step"><span class="flow-icon">👤</span><span>Admin decide</span></div>
        <div class="flow-arrow">→</div>
        <div class="flow-step approved"><span class="flow-icon">📢</span><span>Publicada</span></div>
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
      <div>
        <h1>Vacantes</h1>
        <p>Revisión de empresas, vacantes y clasificación IA</p>
      </div>
    </header>

    ${pendingCompanies.length > 0 ? `
    <div class="admin-section">
      <h2>Empresas Pendientes de Verificación (${pendingCompanies.length})</h2>
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
                  <div><span class="label">Dirección:</span> ${company.address}</div>
                  <div><span class="label">Teléfono:</span> ${company.phone}</div>
                  <div><span class="label">Web:</span> ${company.website}</div>
                  <div><span class="label">Representante:</span> ${company.representative}</div>
                </div>
                <div class="ai-report">
                  <h4>Verificación IA de Empresa</h4>
                  <div class="ai-score-bar">
                    <div class="ai-score-fill ${check.approved ? 'good' : 'bad'}" style="width: ${check.score}%"></div>
                  </div>
                  <span class="ai-score-text">${check.score}% — ${check.approved ? 'Cumple requisitos' : 'No cumple requisitos mínimos'}</span>
                  <div class="check-grid compact">
                    ${check.results.map((r) => `
                      <div class="check-item ${r.passed ? 'passed' : 'failed'}">
                        <span class="check-icon">${r.passed ? '✓' : '✗'}</span>
                        <span>${r.label}</span>
                      </div>
                    `).join('')}
                  </div>
                </div>
              </div>
              <div class="review-card-actions">
                <button class="btn btn-success approve-company" data-id="${company.id}">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
                  Aprobar Empresa
                </button>
                <button class="btn btn-danger reject-company" data-id="${company.id}">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                  Rechazar
                </button>
              </div>
            </div>
          `
        }).join('')}
      </div>
    </div>
    ` : ''}

    <div class="admin-section">
      <h2>Vacantes Pendientes de Revisión (${pendingVacancies.length})</h2>
      ${pendingVacancies.length === 0 ? '<p class="empty-text">No hay vacantes pendientes de revisión.</p>' : ''}
      <div class="review-cards">
        ${pendingVacancies.map((vacancy) => {
          const company = getCompanyById(vacancy.companyId)
          const aiResult = classifyVacancy(vacancy, company)
          return `
            <div class="review-card vacancy-review" data-vacancy-id="${vacancy.id}">
              <div class="review-card-header">
                <div>
                  <h3>${vacancy.positionName}</h3>
                  <span class="vacancy-company">${company ? company.companyName : 'Desconocida'}</span>
                </div>
                <div class="ai-final-score ${aiResult.recommended ? 'recommended' : aiResult.autoReject ? 'auto-reject' : 'review'}">
                  <span class="ai-final-number">${aiResult.finalScore}</span>
                  <span class="ai-final-label">${aiResult.autoReject ? 'RECHAZO AUTO' : aiResult.recommended ? 'RECOMENDADO' : 'REVISAR'}</span>
                </div>
              </div>
              <div class="review-card-body">
                <div class="vacancy-details-grid">
                  <div><span class="label">Ubicación:</span> ${vacancy.location}</div>
                  <div><span class="label">Modalidad:</span> ${vacancy.modality}</div>
                  <div><span class="label">Contrato:</span> ${vacancy.contractType}</div>
                  <div><span class="label">Salario:</span> ${vacancy.salaryRange}</div>
                  <div><span class="label">Experiencia:</span> ${vacancy.experience}</div>
                  <div><span class="label">Fecha límite:</span> ${vacancy.deadline}</div>
                </div>
                <div class="vacancy-text-block">
                  <strong>Descripción:</strong>
                  <p>${vacancy.description}</p>
                </div>
                <div class="vacancy-text-block">
                  <strong>Requisitos:</strong>
                  <p>${vacancy.requirements}</p>
                </div>
                <div class="ai-report">
                  <h4>Clasificación IA — Reglas de Contenido</h4>
                  <div class="ai-score-bar">
                    <div class="ai-score-fill ${aiResult.ruleScore >= 70 ? 'good' : 'bad'}" style="width: ${aiResult.ruleScore}%"></div>
                  </div>
                  <div class="check-grid compact">
                    ${aiResult.ruleResults.map((r) => `
                      <div class="check-item ${r.passed ? 'passed' : 'failed'}">
                        <span class="check-icon">${r.passed ? '✓' : '✗'}</span>
                        <span>${r.label}</span>
                      </div>
                    `).join('')}
                  </div>
                </div>
                <div class="ai-report security">
                  <h4>Análisis de Seguridad</h4>
                  ${aiResult.flags.length === 0 ? '<p class="safe-text">✓ No se detectaron alertas de seguridad</p>' : `
                    <div class="security-flags">
                      ${aiResult.flags.map((f) => `
                        <div class="flag-item ${f.severity}">
                          <span class="flag-severity">${f.severity === 'critical' ? 'CRÍTICO' : 'ALTO'}</span>
                          <span>${f.label}</span>
                        </div>
                      `).join('')}
                    </div>
                  `}
                </div>
              </div>
              <div class="review-card-actions">
                ${aiResult.autoReject ? `
                  <div class="auto-reject-notice">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                    La IA recomienda rechazo automático por alertas críticas. El admin puede forzar aprobación.
                  </div>
                ` : ''}
                <button class="btn btn-success approve-vacancy" data-id="${vacancy.id}">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
                  Aprobar y Publicar
                </button>
                <button class="btn btn-danger reject-vacancy" data-id="${vacancy.id}">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                  Rechazar
                </button>
              </div>
            </div>
          `
        }).join('')}
      </div>
    </div>

    <div class="admin-section">
      <h2>Todas las Empresas (${companies.length})</h2>
      <div class="client-table-container">
        <table class="client-table">
          <thead>
            <tr><th>Empresa</th><th>Contacto</th><th>Email</th><th>Estado</th></tr>
          </thead>
          <tbody>
            ${companies.map((c) => `
              <tr>
                <td><strong>${c.companyName}</strong></td>
                <td>${c.representative}</td>
                <td>${c.email}</td>
                <td>${statusBadge(c.companyStatus)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>

    <div class="admin-section">
      <h2>Todas las Vacantes (${vacancies.length})</h2>
      <div class="client-table-container">
        <table class="client-table">
          <thead>
            <tr><th>Puesto</th><th>Empresa</th><th>Modalidad</th><th>Estado</th><th>IA</th></tr>
          </thead>
          <tbody>
            ${vacancies.map((v) => {
              const comp = getCompanyById(v.companyId)
              return `
                <tr>
                  <td><strong>${v.positionName}</strong></td>
                  <td>${comp ? comp.companyName : '-'}</td>
                  <td>${v.modality}</td>
                  <td>${statusBadge(v.status)}</td>
                  <td>${v.aiScore !== null ? `<span class="ai-mini-score ${v.aiScore >= 70 ? 'good' : 'bad'}">${v.aiScore}</span>` : '-'}</td>
                </tr>
              `
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
      <div>
        <h1>Empresas Clientes</h1>
        <p>Directorio de empresas registradas en la plataforma</p>
      </div>
    </header>
    <div class="client-table-container">
      <table class="client-table">
        <thead>
          <tr><th>Empresa</th><th>Nombre Legal</th><th>RFC</th><th>Contacto</th><th>Estado</th></tr>
        </thead>
        <tbody>
          ${companies.map((c) => `
            <tr>
              <td><strong>${c.companyName}</strong></td>
              <td>${c.legalName}</td>
              <td>${c.taxId}</td>
              <td>${c.representative}</td>
              <td>${statusBadge(c.companyStatus)}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `
}

function renderPlaceholder(title, description, icon) {
  return `
    <header class="dashboard-header">
      <div>
        <h1>${title}</h1>
        <p>${description}</p>
      </div>
    </header>
    <div class="empty-state">
      <div class="empty-state-icon">${icon}</div>
      <h3>Próximamente</h3>
      <p>Este módulo está en desarrollo y estará disponible pronto.</p>
    </div>
  `
}

function reRender() {
  const user = getCurrentUser()
  if (!user || user.role !== 'admin') { navigate('/login'); return }
  const app = document.getElementById('app')

  let content = ''
  switch (currentSection) {
    case 'dashboard':
      content = renderDashboard()
      break
    case 'vacantes':
      content = renderVacantes()
      break
    case 'empresas':
      content = renderEmpresas()
      break
    case 'postulaciones':
      content = renderPlaceholder('Postulaciones', 'Gestiona las postulaciones de candidatos a vacantes.', SIDEBAR_ITEMS[3].icon)
      break
    case 'entrevistas':
      content = renderPlaceholder('Entrevistas / Notas', 'Programa entrevistas y registra notas de seguimiento.', SIDEBAR_ITEMS[4].icon)
      break
    case 'tareas':
      content = renderPlaceholder('Tareas del Reclutador', 'Organiza y da seguimiento a las tareas del equipo.', SIDEBAR_ITEMS[5].icon)
      break
  }

  app.innerHTML = `
    <div class="dashboard-layout">
      ${renderSidebar(user)}
      <main class="dashboard-main">${content}</main>
    </div>
  `

  bindEvents()
}

function bindEvents() {
  document.getElementById('logoutBtn')?.addEventListener('click', () => { logout(); navigate('/login') })
  document.getElementById('sidebarToggle')?.addEventListener('click', () => { document.getElementById('sidebar').classList.toggle('open') })

  document.querySelectorAll('[data-nav]').forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault()
      currentSection = link.dataset.nav
      reRender()
    })
  })

  document.querySelectorAll('[data-goto]').forEach((el) => {
    el.addEventListener('click', (e) => {
      e.preventDefault()
      currentSection = el.dataset.goto
      reRender()
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
      const id = parseInt(btn.dataset.id)
      const v = getVacancies().find((x) => x.id === id)
      const company = getCompanyById(v?.companyId)
      const aiResult = v ? classifyVacancy(v, company) : null
      updateVacancy(id, { status: 'approved', aiScore: aiResult?.finalScore ?? 0 })
      reRender()
    })
  })

  document.querySelectorAll('.reject-vacancy').forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = parseInt(btn.dataset.id)
      const v = getVacancies().find((x) => x.id === id)
      const company = getCompanyById(v?.companyId)
      const aiResult = v ? classifyVacancy(v, company) : null
      updateVacancy(id, { status: 'rejected', aiScore: aiResult?.finalScore ?? 0 })
      reRender()
    })
  })
}

export function renderAdminDashboard() {
  currentSection = 'dashboard'
  reRender()
}

export function renderAdminVacantes() {
  currentSection = 'vacantes'
  reRender()
}

export function renderAdminEmpresas() {
  currentSection = 'empresas'
  reRender()
}
