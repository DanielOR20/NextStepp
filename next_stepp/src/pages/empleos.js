import '../style.css'
import { icons } from '../icons.js'
import { renderTopPanel, setupTopPanel, renderLoginModal, setupLoginModal, renderFooter } from '../sidebar.js'

const jobOffers = [
  {
    id: 1,
    title: 'Desarrollador Full Stack Senior',
    company: 'TechNova Solutions',
    logo: 'TN',
    logoColor: '#6366f1',
    description: 'Buscamos un desarrollador full stack con experiencia en React, Node.js y bases de datos PostgreSQL para liderar proyectos de innovación tecnológica.',
    tags: ['React', 'Node.js', 'PostgreSQL', 'TypeScript'],
    salary: '$3,200 - $4,800',
    location: 'Ciudad de México, MX',
    badge: 'new',
  },
  {
    id: 2,
    title: 'UX/UI Designer',
    company: 'CreativeHub Digital',
    logo: 'CH',
    logoColor: '#06b6d4',
    description: 'Diseñador de experiencias de usuario con enfoque en productos digitales. Crearemos interfaces intuitivas y visualmente impactantes.',
    tags: ['Figma', 'UI/UX', 'Prototipado', 'Design System'],
    salary: '$2,400 - $3,600',
    location: 'Remoto',
    badge: 'urgent',
  },
  {
    id: 3,
    title: 'Data Scientist',
    company: 'DataMind Analytics',
    logo: 'DM',
    logoColor: '#8b5cf6',
    description: 'Únete a nuestro equipo de ciencia de datos para construir modelos de machine learning que transformen la toma de decisiones empresariales.',
    tags: ['Python', 'ML', 'TensorFlow', 'SQL'],
    salary: '$3,800 - $5,500',
    location: 'Guadalajara, MX',
    badge: 'new',
  },
  {
    id: 4,
    title: 'DevOps Engineer',
    company: 'CloudScale Inc.',
    logo: 'CS',
    logoColor: '#10b981',
    description: 'Ingeniero DevOps para automatizar y optimizar nuestra infraestructura cloud. Experiencia con Kubernetes y CI/CD requerida.',
    tags: ['AWS', 'Kubernetes', 'Docker', 'Terraform'],
    salary: '$3,500 - $5,000',
    location: 'Monterrey, MX',
    badge: 'urgent',
  },
  {
    id: 5,
    title: 'Product Manager',
    company: 'InnovateTech',
    logo: 'IT',
    logoColor: '#f59e0b',
    description: 'Lidera el ciclo de vida de productos digitales desde la concepción hasta el lanzamiento. Trabaja con equipos ágiles.',
    tags: ['Agile', 'Scrum', 'Roadmap', 'Analytics'],
    salary: '$3,000 - $4,500',
    location: 'Ciudad de México, MX',
    badge: 'new',
  },
  {
    id: 6,
    title: 'Mobile Developer',
    company: 'AppForge Labs',
    logo: 'AF',
    logoColor: '#ec4899',
    description: 'Desarrolla aplicaciones móviles multiplataforma con React Native. Experiencia en publicación en App Store y Google Play.',
    tags: ['React Native', 'iOS', 'Android', 'Firebase'],
    salary: '$2,800 - $4,200',
    location: 'Remoto',
    badge: 'new',
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
      <p>Explora ofertas de las mejores empresas, filtradas según tu perfil y preferencias.</p>
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

  ${renderFooter()}
`

const searchBtn = document.getElementById('searchBtn')
const searchKeyword = document.getElementById('searchKeyword')
const searchLocation = document.getElementById('searchLocation')

document.querySelectorAll('.search-tag').forEach(tag => {
  tag.addEventListener('click', () => {
    searchKeyword.value = tag.dataset.tag
    searchKeyword.focus()
  })
})

searchBtn.addEventListener('click', () => {
  const keyword = searchKeyword.value.toLowerCase()
  const location = searchLocation.value.toLowerCase()
  document.querySelectorAll('.job-card').forEach(card => {
    const id = parseInt(card.dataset.id)
    const job = jobOffers.find(j => j.id === id)
    const matchKeyword = !keyword || job.title.toLowerCase().includes(keyword) ||
      job.tags.some(t => t.toLowerCase().includes(keyword)) ||
      job.company.toLowerCase().includes(keyword)
    const matchLocation = !location || job.location.toLowerCase().includes(location)
    card.style.display = matchKeyword && matchLocation ? '' : 'none'
  })
  document.querySelector('#empleos').scrollIntoView({ behavior: 'smooth' })
})

searchKeyword.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') searchBtn.click()
})

searchLocation.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') searchBtn.click()
})

setupTopPanel()
setupLoginModal()
