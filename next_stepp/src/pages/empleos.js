import '../styles/base.css'
import '../styles/dashboard.css'
import { icons } from '../icons.js'
import { renderTopPanel, setupTopPanel, renderLoginModal, setupLoginModal, renderFooter } from '../sidebar.js'

const jobOffers = [
  {
    id: 1,
    title: 'Desarrollador Full Stack Senior',
    company: 'NexaTech Costa Rica',
    logo: 'NT',
    logoColor: '#6366f1',
    description: 'Buscamos un desarrollador full stack con experiencia en React, Node.js y bases de datos PostgreSQL para liderar proyectos de innovación tecnológica en nuestra sede de San José.',
    fullDescription: 'NexaTech Costa Rica busca un Desarrollador Full Stack Senior apasionado por la tecnología y la innovación. Trabajarás en proyectos de alto impacto para clientes internacionales, liderando el desarrollo de aplicaciones web escalables utilizando las últimas tecnologías.',
    requirements: [
      '5+ años de experiencia en desarrollo full stack',
      'Dominio de React, Node.js y PostgreSQL',
      'Experiencia con TypeScript y arquitectura de microservicios',
      'Conocimiento en CI/CD y despliegue en la nube',
      'Inglés intermedio-avanzado (escrito y oral)',
      'Bachillerato en Computación o afines',
    ],
    benefits: [
      'Salary bonificado + beneficios de ley',
      'Trabajo híbrido (3 días oficina, 2 remoto)',
      'Capacitación continua y presupuesto para certificaciones',
      'Gimnasio y seguro médico privado',
      'Plan de pensiones voluntarias',
    ],
    tags: ['React', 'Node.js', 'PostgreSQL', 'TypeScript'],
    salary: '₡1,800,000 - ₡2,800,000',
    salaryNumeric: { min: 1800000, max: 2800000 },
    location: 'San José, Costa Rica',
    type: 'Tiempo completo',
    modality: 'Híbrido',
    badge: 'new',
    posted: 'Hace 2 días',
  },
  {
    id: 2,
    title: 'UX/UI Designer',
    company: 'Pura Vida Digital',
    logo: 'PV',
    logoColor: '#06b6d4',
    description: 'Diseñador de experiencias de usuario con enfoque en productos digitales para el mercado centroamericano. Crearemos interfaces intuitivas y visualmente impactantes.',
    fullDescription: 'Pura Vida Digital está buscando un diseñador UX/UI creativo y detallista para diseñar productos digitales que transformen la experiencia de usuarios en Costa Rica y Centroamérica. Formarás parte de un equipo joven e innovador.',
    requirements: [
      '3+ años de experiencia en diseño UX/UI',
      'Dominio de Figma y herramientas de prototipado',
      'Portafolio demostrable de proyectos web y móviles',
      'Conocimiento en design systems y accesibilidad',
      'Capacidad de realizar investigaciones de usuarios',
      'Inglés intermedio',
    ],
    benefits: [
      'Salario competitivo en el mercado local',
      'Trabajo 100% remoto',
      'Horario flexible',
      'Equipo de trabajo MacBook Pro',
      'Retiros anuales del equipo',
    ],
    tags: ['Figma', 'UI/UX', 'Prototipado', 'Design System'],
    salary: '₡1,200,000 - ₡2,000,000',
    salaryNumeric: { min: 1200000, max: 2000000 },
    location: 'Remoto - Costa Rica',
    type: 'Tiempo completo',
    modality: 'Remoto',
    badge: 'urgent',
    posted: 'Hace 1 día',
  },
  {
    id: 3,
    title: 'Científico de Datos',
    company: 'Analytics CR',
    logo: 'AC',
    logoColor: '#8b5cf6',
    description: 'Únete a nuestro equipo de ciencia de datos para construir modelos de machine learning que transformen la toma de decisiones empresariales en Costa Rica.',
    fullDescription: 'Analytics CR necesita un Científico de Datos talentoso para desarrollar modelos predictivos y de machine learning que apoyen a empresas ticas en la transformación digital. Trabajarás con grandes volúmenes de datos y tecnologías de vanguardia.',
    requirements: [
      '4+ años de experiencia en ciencia de datos',
      'Dominio de Python, TensorFlow y scikit-learn',
      'Experiencia con SQL y bases de datos grandes',
      'Conocimiento en estadística y modelos predictivos',
      'Maestría en Ciencias de la Computación, Matemáticas o afines',
      'Inglés intermedio-avanzado',
    ],
    benefits: [
      'Salario premium para perfiles especializados',
      'Trabajo híbrido en Oficentro La Sabana',
      'Presupuesto anual para conferencias y cursos',
      'Seguro médico y dental para familia',
      'Bono de desempeño trimestral',
    ],
    tags: ['Python', 'ML', 'TensorFlow', 'SQL'],
    salary: '₡2,000,000 - ₡3,500,000',
    salaryNumeric: { min: 2000000, max: 3500000 },
    location: 'San José, Costa Rica',
    type: 'Tiempo completo',
    modality: 'Híbrido',
    badge: 'new',
    posted: 'Hace 3 días',
  },
  {
    id: 4,
    title: 'Ingeniero DevOps',
    company: 'CloudBridge CR',
    logo: 'CB',
    logoColor: '#10b981',
    description: 'Ingeniero DevOps para automatizar y optimizar nuestra infraestructura cloud. Experiencia con Kubernetes y CI/CD requerida. Sede en Heredia.',
    fullDescription: 'CloudBridge CR busca un ingeniero DevOps con experiencia comprobada para diseñar, implementar y mantener la infraestructura cloud que soporta nuestros productos SaaS. Trabajarás con herramientas de última generación en un equipo altamente colaborativo.',
    requirements: [
      '4+ años de experiencia en DevOps/SRE',
      'Experiencia sólida con AWS o GCP',
      'Dominio de Docker, Kubernetes y Terraform',
      'Conocimiento en pipelines CI/CD (Jenkins, GitLab CI)',
      'Experiencia con monitoreo (Prometheus, Grafana)',
      'Certificaciones cloud son un plus',
    ],
    benefits: [
      'Salario en dólares americanos (negociable)',
      'Trabajo remoto con posibilidad de oficina en Heredia',
      'Equipamiento de trabajo de última generación',
      'Seguro médico premium',
      '30 días de vacaciones + días feriados',
    ],
    tags: ['AWS', 'Kubernetes', 'Docker', 'Terraform'],
    salary: '₡2,200,000 - ₡3,800,000',
    salaryNumeric: { min: 2200000, max: 3800000 },
    location: 'Heredia, Costa Rica',
    type: 'Tiempo completo',
    modality: 'Remoto',
    badge: 'urgent',
    posted: 'Hace 1 día',
  },
  {
    id: 5,
    title: 'Product Manager',
    company: 'FinTech Costa Rica',
    logo: 'FT',
    logoColor: '#f59e0b',
    description: 'Lidera el ciclo de vida de productos digitales financieros desde la concepción hasta el lanzamiento. Trabaja con equipos ágiles en San Pedro.',
    fullDescription: 'FinTech Costa Rica busca un Product Manager estratega para liderar el desarrollo de nuestra plataforma de pagos digitales. Serás responsable de definir la visión del producto, priorizar el roadmap y trabajar con equipos multifuncionales.',
    requirements: [
      '5+ años de experiencia como Product Manager',
      'Experiencia en el sector fintech o pagos digitales',
      'Conocimiento en metodologías ágiles (Scrum, Kanban)',
      'Habilidades analíticas y de comunicación excepcionales',
      'Experiencia con herramientas como Jira, Confluence, Miro',
      'Licenciatura en Administración, Ingeniería o afines',
    ],
    benefits: [
      'Salario competitivo + bono por resultados',
      'Oficina en San Pedro, con estacionamiento',
      'Opciones de equity para perfiles senior',
      'Plan de desarrollo profesional personalizado',
      'Ambiente de trabajo joven y dinámico',
    ],
    tags: ['Agile', 'Scrum', 'Roadmap', 'Analytics'],
    salary: '₡1,600,000 - ₡2,600,000',
    salaryNumeric: { min: 1600000, max: 2600000 },
    location: 'San José, Costa Rica',
    type: 'Tiempo completo',
    modality: 'Presencial',
    badge: 'new',
    posted: 'Hace 5 días',
  },
  {
    id: 6,
    title: 'Desarrollador Mobile',
    company: 'AppTica Labs',
    logo: 'AT',
    logoColor: '#ec4899',
    description: 'Desarrolla aplicaciones móviles multiplataforma con React Native para clientes en Costa Rica y Latinoamérica. Experiencia en App Store y Google Play.',
    fullDescription: 'AppTica Labs necesita un desarrollador mobile talentoso para crear aplicaciones innovadoras que impacten a millones de usuarios en Costa Rica y Latinoamérica. Trabajarás en un equipo ágil con deploy continuo.',
    requirements: [
      '3+ años de experiencia en desarrollo mobile',
      'Dominio de React Native o Flutter',
      'Experiencia publicando apps en App Store y Google Play',
      'Conocimiento en Firebase y servicios backend',
      'Integración con APIs REST y GraphQL',
      'Conocimiento básico de UI/UX principles',
    ],
    benefits: [
      'Salario por encima del mercado',
      'Trabajo híbrido en Escazú',
      'Última tecnología y equipamiento',
      ' capacitación internacional pagada',
      'Frutas, café y snacks ilimitados',
    ],
    tags: ['React Native', 'iOS', 'Android', 'Firebase'],
    salary: '₡1,400,000 - ₡2,400,000',
    salaryNumeric: { min: 1400000, max: 2400000 },
    location: 'Escazú, Costa Rica',
    type: 'Tiempo completo',
    modality: 'Híbrido',
    badge: 'new',
    posted: 'Hace 4 días',
  },
]

const suggestedTags = [
  'Desarrollador', 'React', 'Python', 'Remoto', 'Full Stack',
  'Diseñador UX', 'Data Science', 'DevOps', 'Cloud', 'Figma',
]

const topPanelContainer = document.getElementById('topPanelContainer')
topPanelContainer.innerHTML = renderTopPanel('empleos') + renderLoginModal()

const app = document.getElementById('app')
app.innerHTML = `
  <section class="search-section" style="padding-top: 80px;">
    <div class="search-container">
      <div class="search-row">
        <div class="search-input-group">
          ${icons.search}
          <input type="text" id="searchKeyword" placeholder="Buscar empleo por palabra clave..." />
        </div>
        <div class="search-divider"></div>
        <div class="search-input-group">
          ${icons.location}
          <input type="text" id="searchLocation" placeholder="Ubicación" />
        </div>
        <button class="btn btn-primary btn-lg" id="searchBtn">
          ${icons.search} Buscar
        </button>
      </div>
      <div class="search-tags" id="searchTags">
        ${suggestedTags.map(tag => `<button class="search-tag" data-tag="${tag}">${tag}</button>`).join('')}
      </div>
    </div>
  </section>

  <section class="section" id="empleos">
    <div class="section-header">
      <div class="overline">Ofertas de Empleo</div>
      <h2>Encuentra tu oportunidad ideal</h2>
      <p>Explora ofertas de las mejores empresas de Costa Rica, filtradas según tu perfil y preferencias.</p>
    </div>
    <div class="search-results-bar" id="resultsBar">
      <span class="search-results-count" id="resultsCount"></span>
      <button class="search-clear-btn" id="clearSearch">
        ${icons.close} Limpiar filtros
      </button>
    </div>
    <div class="jobs-grid" id="jobsGrid">
      ${jobOffers.map(job => `
        <div class="job-card" data-id="${job.id}">
          <div class="job-card-header">
            <div class="job-company-logo" style="background: ${job.logoColor}">${job.logo}</div>
            <span class="job-badge ${job.badge}">${job.badge === 'new' ? 'Nuevo' : 'Urgente'}</span>
          </div>
          <h3>${job.title}</h3>
          <div class="company-name">${job.company}</div>
          <p class="job-description">${job.description}</p>
          <div class="job-tags">
            ${job.tags.map(tag => `<span class="job-tag">${tag}</span>`).join('')}
          </div>
          <div class="job-card-footer">
            <span class="job-salary">${job.salary}</span>
            <div style="display:flex; gap:8px; align-items:center;">
              <span class="job-location">${icons.location} ${job.location}</span>
              <a href="/src/pages/postulaciones/postulaciones.html?jobId=${job.id}&title=${encodeURIComponent(job.title)}" class="btn btn-primary btn-sm" style="text-decoration:none; padding: 4px 10px; font-size: 0.75rem;">
                Postularme ↗
              </a>
            </div>
          </div>
        </div>
      `).join('')}
    </div>
  </section>

  <div class="job-modal-overlay" id="jobModalOverlay">
    <div class="job-modal" id="jobModal">
      <button class="job-modal-close" id="jobModalClose">&times;</button>
      <div id="jobModalContent"></div>
    </div>
  </div>

  ${renderFooter()}
`

const searchBtn = document.getElementById('searchBtn')
const searchKeyword = document.getElementById('searchKeyword')
const searchLocation = document.getElementById('searchLocation')
const resultsCount = document.getElementById('resultsCount')
const clearSearch = document.getElementById('clearSearch')
const jobModalOverlay = document.getElementById('jobModalOverlay')
const jobModalContent = document.getElementById('jobModalContent')
const jobModalClose = document.getElementById('jobModalClose')

function updateResultsCount() {
  const visible = document.querySelectorAll('.job-card:not([style*="display: none"])').length
  const total = jobOffers.length
  if (visible === total) {
    resultsCount.innerHTML = `Mostrando <strong>${total}</strong> ofertas disponibles`
  } else {
    resultsCount.innerHTML = `<strong>${visible}</strong> de <strong>${total}</strong> ofertas encontradas`
  }
}

function performSearch() {
  const keyword = searchKeyword.value.toLowerCase().trim()
  const location = searchLocation.value.toLowerCase().trim()
  const hasFilters = keyword || location

  clearSearch.classList.toggle('visible', hasFilters)

  document.querySelectorAll('.job-card').forEach(card => {
    const id = parseInt(card.dataset.id)
    const job = jobOffers.find(j => j.id === id)
    const matchKeyword = !keyword ||
      job.title.toLowerCase().includes(keyword) ||
      job.tags.some(t => t.toLowerCase().includes(keyword)) ||
      job.company.toLowerCase().includes(keyword) ||
      job.description.toLowerCase().includes(keyword)
    const matchLocation = !location ||
      job.location.toLowerCase().includes(location) ||
      job.modality.toLowerCase().includes(location)
    card.style.display = matchKeyword && matchLocation ? '' : 'none'
  })

  updateResultsCount()

  const grid = document.getElementById('jobsGrid')
  const existingNoResults = grid.querySelector('.no-results')
  if (existingNoResults) existingNoResults.remove()

  const visibleCount = document.querySelectorAll('.job-card:not([style*="display: none"])').length
  if (visibleCount === 0) {
    grid.insertAdjacentHTML('beforeend', `
      <div class="no-results">
        <h3>No se encontraron empleos</h3>
        <p>Intenta con otros términos de búsqueda o limpia los filtros.</p>
      </div>
    `)
  }
}

document.querySelectorAll('.search-tag').forEach(tag => {
  tag.addEventListener('click', () => {
    searchKeyword.value = tag.dataset.tag
    searchKeyword.focus()
    performSearch()
  })
})

searchBtn.addEventListener('click', performSearch)

searchKeyword.addEventListener('input', () => {
  performSearch()
})

searchLocation.addEventListener('input', () => {
  performSearch()
})

searchKeyword.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') performSearch()
})

searchLocation.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') performSearch()
})

clearSearch.addEventListener('click', () => {
  searchKeyword.value = ''
  searchLocation.value = ''
  performSearch()
  searchKeyword.focus()
})

function openJobModal(jobId) {
  const job = jobOffers.find(j => j.id === jobId)
  if (!job) return

  jobModalContent.innerHTML = `
    <div class="job-modal-header">
      <div class="job-modal-logo" style="background: ${job.logoColor}">${job.logo}</div>
      <div class="job-modal-title-area">
        <h2>${job.title}</h2>
        <div class="company-name">${job.company}</div>
        <div class="job-modal-meta">
          <span class="job-modal-meta-item">
            ${icons.location} ${job.location}
          </span>
          <span class="job-modal-meta-item">
            ${icons.briefcase} ${job.type}
          </span>
          <span class="job-modal-meta-item">
            ${job.modality}
          </span>
        </div>
      </div>
    </div>

    <div class="job-modal-salary">
      <div>
        <div class="salary-label">Salario mensual</div>
        <div class="salary-value">${job.salary}</div>
        <div class="salary-period">Bruto, antes de deducciones de ley</div>
      </div>
    </div>

    <div class="job-modal-body">
      <h3>Descripción del puesto</h3>
      <p>${job.fullDescription}</p>

      <h3>Requisitos</h3>
      <ul>
        ${job.requirements.map(r => `<li>${r}</li>`).join('')}
      </ul>

      <h3>Beneficios</h3>
      <ul>
        ${job.benefits.map(b => `<li>${b}</li>`).join('')}
      </ul>
    </div>

    <div class="job-modal-tags">
      ${job.tags.map(tag => `<span class="job-modal-tag">${tag}</span>`).join('')}
    </div>

    <div class="job-modal-footer">
      <button class="btn btn-ghost btn-lg" id="jobModalCancel">Cerrar</button>
      <button class="btn btn-primary btn-lg" id="jobModalApply">
        ${icons.briefcase} Postularme ahora
      </button>
    </div>
  `

  jobModalOverlay.classList.add('open')
  document.body.style.overflow = 'hidden'

  document.getElementById('jobModalCancel').addEventListener('click', closeJobModal)
  document.getElementById('jobModalApply').addEventListener('click', () => {
    const applyBtn = document.getElementById('jobModalApply')
    applyBtn.innerHTML = '✓ ¡Postulación enviada!'
    applyBtn.style.background = 'var(--success)'
    applyBtn.style.boxShadow = '0 4px 15px rgba(16, 185, 129, 0.4)'
    applyBtn.disabled = true

    showToast(`Te has postulado exitosamente a ${job.title} en ${job.company}`)
  })
}

function closeJobModal() {
  jobModalOverlay.classList.remove('open')
  document.body.style.overflow = ''
}

jobModalClose.addEventListener('click', closeJobModal)
jobModalOverlay.addEventListener('click', (e) => {
  if (e.target === jobModalOverlay) closeJobModal()
})

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && jobModalOverlay.classList.contains('open')) {
    closeJobModal()
  }
})

document.querySelectorAll('.job-card').forEach(card => {
  card.addEventListener('click', () => {
    const id = parseInt(card.dataset.id)
    openJobModal(id)
  })
})

function showToast(message) {
  let toast = document.querySelector('.toast')
  if (!toast) {
    toast = document.createElement('div')
    toast.className = 'toast'
    document.body.appendChild(toast)
  }
  toast.textContent = message
  toast.classList.add('show')
  setTimeout(() => toast.classList.remove('show'), 4000)
}

updateResultsCount()
setupTopPanel()
setupLoginModal()
