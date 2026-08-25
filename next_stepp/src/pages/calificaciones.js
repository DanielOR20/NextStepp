import '../style.css'
import { icons } from '../icons.js'
import { renderTopPanel, setupTopPanel, renderLoginModal, setupLoginModal, renderFooter } from '../sidebar.js'

const ratings = [
  {
    name: 'María García',
    initials: 'MG',
    role: 'Frontend Developer',
    percentage: 92,
    stars: 5,
    text: 'Excelente plataforma. Encontré mi empleo ideal en menos de 2 semanas. El sistema de perfil profesional es muy completo.',
  },
  {
    name: 'Carlos Hernández',
    initials: 'CH',
    role: 'Data Analyst',
    percentage: 87,
    stars: 4,
    text: 'La IA me ayudó a mejorar mi CV significativamente. Las ofertas que recibo son muy relevantes a mi perfil.',
  },
  {
    name: 'Ana López',
    initials: 'AL',
    role: 'UX Designer',
    percentage: 95,
    stars: 5,
    text: 'Plataforma innovadora. El proceso de registro es sencillo y las recomendaciones de empleo son precisas.',
  },
  {
    name: 'Roberto Martínez',
    initials: 'RM',
    role: 'DevOps Engineer',
    percentage: 89,
    stars: 4,
    text: 'Muy buena experiencia. El buscador de empleos por palabra clave encuentra exactamente lo que busco.',
  },
  {
    name: 'Laura Sánchez',
    initials: 'LS',
    role: 'Product Manager',
    percentage: 94,
    stars: 5,
    text: 'El generador de CV con IA es increíble. Ahorré muchísimo tiempo y el resultado es profesional.',
  },
  {
    name: 'Diego Torres',
    initials: 'DT',
    role: 'Full Stack Developer',
    percentage: 91,
    stars: 5,
    text: 'Las calificaciones por porcentaje me dieron una visión clara de mis áreas de mejora. Totalmente recomendado.',
  },
]

function renderStars(count) {
  let html = '<div class="rating-stars">'
  for (let i = 0; i < 5; i++) {
    html += `<span class="star ${i < count ? '' : 'empty'}">${i < count ? icons.star : icons.starEmpty}</span>`
  }
  html += '</div>'
  return html
}

const topPanelContainer = document.getElementById('topPanelContainer')
topPanelContainer.innerHTML = renderTopPanel('calificaciones') + renderLoginModal()

const app = document.getElementById('app')
app.innerHTML = `
  <section class="section" id="calificaciones" style="padding-top: 80px;">
    <div class="section-header">
      <div class="overline">Calificaciones</div>
      <h2>Profesionales que confían en nosotros</h2>
      <p>Conoce las experiencias y calificaciones de nuestra comunidad de profesionales.</p>
    </div>
    <div class="ratings-grid" id="ratingsGrid">
      ${ratings.map(r => `
        <div class="rating-card">
          <div class="rating-header">
            <div class="rating-avatar">${r.initials}</div>
            <div class="rating-user-info">
              <h4>${r.name}</h4>
              <span>${r.role}</span>
            </div>
            <div class="rating-percentage">
              <div class="percent">${r.percentage}%</div>
              <div class="label">Match</div>
            </div>
          </div>
          ${renderStars(r.stars)}
          <div class="rating-bar">
            <div class="rating-bar-fill" data-width="${r.percentage}"></div>
          </div>
          <p class="rating-text">"${r.text}"</p>
        </div>
      `).join('')}
    </div>
  </section>

  <section class="section">
    <div class="section-header">
      <div class="overline">Por Qué NextStepp</div>
      <h2>Herramientas que impulsan tu carrera</h2>
      <p>Todo lo que necesitas para encontrar el empleo perfecto en una sola plataforma.</p>
    </div>
    <div class="features-grid">
      <div class="feature-card">
        <div class="feature-icon">${icons.ai}</div>
        <h3>IA Inteligente</h3>
        <p>Asistente potenciado por Groq que analiza tu perfil y te recomienda las mejores oportunidades laborales.</p>
      </div>
      <div class="feature-card">
        <div class="feature-icon">${icons.doc}</div>
        <h3>Generador de CV</h3>
        <p>Crea un CV profesional con nuestra herramienta de IA que destaca tus habilidades y experiencia.</p>
      </div>
      <div class="feature-card">
        <div class="feature-icon">${icons.search}</div>
        <h3>Búsqueda Avanzada</h3>
        <p>Encuentra empleos por palabra clave, ubicación, empresa o habilidades específicas.</p>
      </div>
      <div class="feature-card">
        <div class="feature-icon">${icons.star}</div>
        <h3>Calificación Profesional</h3>
        <p>Sistema de evaluación por porcentaje que muestra tu nivel de competencia y áreas de mejora.</p>
      </div>
    </div>
  </section>

  ${renderFooter()}
`

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const fill = entry.target
      fill.style.width = fill.dataset.width + '%'
      observer.unobserve(fill)
    }
  })
}, { threshold: 0.3 })

document.querySelectorAll('.rating-bar-fill').forEach(bar => observer.observe(bar))

setupTopPanel()
setupLoginModal()
