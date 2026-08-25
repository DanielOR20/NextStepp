import { getCurrentUser, logout } from '../../auth.js'
import { navigate } from '../../router.js'
import { getVacanciesByCompany, addVacancy, getCompanyById } from '../../store.js'
import { classifyCompany } from '../../ai-classifier.js'

function statusBadge(status) {
  const map = {
    pending: { label: 'En Revisión', cls: 'status-pending' },
    approved: { label: 'Aprobada', cls: 'status-approved' },
    rejected: { label: 'Rechazada', cls: 'status-rejected' },
  }
  const s = map[status] || map.pending
  return `<span class="status-badge ${s.cls}">${s.label}</span>`
}

function modalityLabel(m) {
  return { presencial: 'Presencial', remoto: 'Remoto', híbrido: 'Híbrido' }[m] || m
}

export function renderEmpresaDashboard() {
  const user = getCurrentUser()
  if (!user || user.role !== 'empresa_cliente') {
    navigate('/login')
    return
  }

  const company = getCompanyById(user.id) || user
  const companyCheck = classifyCompany(company)
  const vacancies = getVacanciesByCompany(user.id)

  const app = document.getElementById('app')
  app.innerHTML = `
    <div class="client-layout">
      <header class="client-header">
        <div class="client-header-left">
          <a href="#/" class="auth-logo">
            <span class="logo-icon">NS</span>
            NextStepp
          </a>
        </div>
        <div class="client-header-right">
          <div class="client-user-info">
            <div class="client-user-avatar">${user.name.charAt(0)}</div>
            <span>${user.name}</span>
          </div>
          <button class="btn btn-ghost" id="empresaLogoutBtn">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
            Salir
          </button>
        </div>
      </header>
      <main class="client-main">
        <div class="client-welcome">
          <h1>Panel de Empresa</h1>
          <p>Gestiona las vacantes de ${company.companyName}</p>
        </div>

        <div class="company-status-banner ${company.companyStatus}">
          <div class="company-status-icon">
            ${company.companyStatus === 'approved'
              ? '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>'
              : company.companyStatus === 'pending'
              ? '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>'
              : '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>'
            }
          </div>
          <div>
            <h3>${company.companyStatus === 'approved' ? 'Empresa Verificada' : company.companyStatus === 'pending' ? 'Empresa en Revisión' : 'Empresa Rechazada'}</h3>
            <p>${company.companyStatus === 'approved'
              ? 'Tu empresa está verificada. Puedes publicar vacantes.'
              : company.companyStatus === 'pending'
              ? 'Tu empresa está siendo revisada por nuestro equipo. Podrás publicar vacantes una vez aprobada.'
              : 'Tu empresa no pasó la verificación. Contacta soporte para más información.'
            }</p>
          </div>
        </div>

        <div class="company-check-details">
          <h3>Estado de Verificación</h3>
          <div class="check-grid">
            ${companyCheck.results.map((r) => `
              <div class="check-item ${r.passed ? 'passed' : 'failed'}">
                <span class="check-icon">${r.passed ? '✓' : '✗'}</span>
                <span>${r.label}</span>
              </div>
            `).join('')}
          </div>
          <div class="check-score">
            <span class="check-score-label">Puntuación:</span>
            <span class="check-score-value ${companyCheck.approved ? 'good' : 'bad'}">${companyCheck.score}%</span>
          </div>
        </div>

        <div class="client-stats-row">
          <div class="stat-card">
            <span class="stat-card-number">${vacancies.length}</span>
            <span class="stat-card-label">Total Vacantes</span>
          </div>
          <div class="stat-card">
            <span class="stat-card-number">${vacancies.filter((v) => v.status === 'approved').length}</span>
            <span class="stat-card-label">Publicadas</span>
          </div>
          <div class="stat-card">
            <span class="stat-card-number">${vacancies.filter((v) => v.status === 'pending').length}</span>
            <span class="stat-card-label">En Revisión</span>
          </div>
          <div class="stat-card">
            <span class="stat-card-number">${vacancies.filter((v) => v.status === 'rejected').length}</span>
            <span class="stat-card-label">Rechazadas</span>
          </div>
        </div>

        ${company.companyStatus === 'approved' ? `
          <div class="section-actions">
            <h2>Mis Vacantes</h2>
            <button class="btn btn-primary" id="showVacancyForm">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              Nueva Vacante
            </button>
          </div>

          <div class="vacancy-form-wrapper hidden" id="vacancyFormWrapper">
            <form class="vacancy-form" id="vacancyForm">
              <h3>Publicar Nueva Vacante</h3>
              <div class="form-row">
                <div class="form-group">
                  <label>Nombre del Puesto *</label>
                  <input class="form-input" type="text" id="vf-positionName" placeholder="Ej: Desarrollador Full Stack" required />
                </div>
                <div class="form-group">
                  <label>Ubicación *</label>
                  <input class="form-input" type="text" id="vf-location" placeholder="Ej: Ciudad de México" required />
                </div>
              </div>
              <div class="form-group">
                <label>Descripción y Funciones *</label>
                <textarea class="form-input form-textarea" id="vf-description" rows="4" placeholder="Describe las responsabilidades principales del puesto..." required></textarea>
              </div>
              <div class="form-group">
                <label>Requisitos *</label>
                <textarea class="form-input form-textarea" id="vf-requirements" rows="3" placeholder="Habilidades, conocimientos y certifications requeridos..." required></textarea>
              </div>
              <div class="form-row">
                <div class="form-group">
                  <label>Experiencia *</label>
                  <input class="form-input" type="text" id="vf-experience" placeholder="Ej: 3+ años" required />
                </div>
                <div class="form-group">
                  <label>Educación</label>
                  <input class="form-input" type="text" id="vf-education" placeholder="Ej: Ingeniería en Sistemas" />
                </div>
              </div>
              <div class="form-row">
                <div class="form-group">
                  <label>Modalidad *</label>
                  <select class="form-input form-select" id="vf-modality" required>
                    <option value="">Seleccionar...</option>
                    <option value="presencial">Presencial</option>
                    <option value="remoto">Remoto</option>
                    <option value="híbrido">Híbrido</option>
                  </select>
                </div>
                <div class="form-group">
                  <label>Tipo de Contrato *</label>
                  <select class="form-input form-select" id="vf-contractType" required>
                    <option value="">Seleccionar...</option>
                    <option value="Tiempo completo">Tiempo completo</option>
                    <option value="Medio tiempo">Medio tiempo</option>
                    <option value="Por proyecto">Por proyecto</option>
                    <option value="Prácticas">Prácticas</option>
                    <option value="Freelance">Freelance</option>
                  </select>
                </div>
              </div>
              <div class="form-group">
                <label>Jornada Laboral</label>
                <input class="form-input" type="text" id="vf-workSchedule" placeholder="Ej: Lunes a Viernes 9:00 - 18:00" />
              </div>
              <div class="form-row">
                <div class="form-group">
                  <label>Rango Salarial *</label>
                  <input class="form-input" type="text" id="vf-salaryRange" placeholder="Ej: $30,000 - $45,000 MXN" required />
                </div>
                <div class="form-group">
                  <label>Fecha Límite *</label>
                  <input class="form-input" type="date" id="vf-deadline" required />
                </div>
              </div>
              <div class="form-actions">
                <button type="button" class="btn btn-ghost" id="cancelVacancyForm">Cancelar</button>
                <button type="submit" class="btn btn-primary">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 2L11 13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
                  Enviar para Revisión
                </button>
              </div>
            </form>
          </div>

          <div class="client-table-container">
            ${vacancies.length === 0 ? `
              <div class="empty-state">
                <p>No tienes vacantes publicadas aún.</p>
              </div>
            ` : `
              <table class="client-table">
                <thead>
                  <tr>
                    <th>Puesto</th>
                    <th>Modalidad</th>
                    <th>Salario</th>
                    <th>Estado</th>
                    <th>Enviada</th>
                  </tr>
                </thead>
                <tbody>
                  ${vacancies.map((v) => `
                    <tr>
                      <td><strong>${v.positionName}</strong></td>
                      <td>${modalityLabel(v.modality)}</td>
                      <td>${v.salaryRange}</td>
                      <td>${statusBadge(v.status)}</td>
                      <td>${v.publishedAt}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            `}
          </div>
        ` : ''}
      </main>
    </div>
  `

  document.getElementById('empresaLogoutBtn').addEventListener('click', () => {
    logout()
    navigate('/login')
  })

  if (company.companyStatus === 'approved') {
    const formWrapper = document.getElementById('vacancyFormWrapper')
    const showBtn = document.getElementById('showVacancyForm')
    const cancelBtn = document.getElementById('cancelVacancyForm')
    const form = document.getElementById('vacancyForm')

    showBtn.addEventListener('click', () => {
      formWrapper.classList.toggle('hidden')
      showBtn.textContent = formWrapper.classList.contains('hidden') ? '+ Nueva Vacante' : 'Cancelar'
    })

    cancelBtn.addEventListener('click', () => {
      formWrapper.classList.add('hidden')
      showBtn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg> Nueva Vacante'
    })

    form.addEventListener('submit', (e) => {
      e.preventDefault()

      const vacancy = {
        companyId: user.id,
        positionName: document.getElementById('vf-positionName').value.trim(),
        description: document.getElementById('vf-description').value.trim(),
        requirements: document.getElementById('vf-requirements').value.trim(),
        experience: document.getElementById('vf-experience').value.trim(),
        education: document.getElementById('vf-education').value.trim(),
        location: document.getElementById('vf-location').value.trim(),
        modality: document.getElementById('vf-modality').value,
        contractType: document.getElementById('vf-contractType').value,
        workSchedule: document.getElementById('vf-workSchedule').value.trim(),
        salaryRange: document.getElementById('vf-salaryRange').value.trim(),
        deadline: document.getElementById('vf-deadline').value,
      }

      addVacancy(vacancy)
      navigate('/empresa/dashboard')
    })
  }
}
