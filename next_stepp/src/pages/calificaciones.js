import '../styles/base.css'
import { icons } from '../icons.js'
import { renderTopPanel, setupTopPanel, renderFooter } from '../sidebar.js'

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

function getInitials(name) {
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
}

function renderRatingCard(r) {
  return `
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
  `
}

function renderRatingsGrid() {
  const grid = document.getElementById('ratingsGrid')
  grid.innerHTML = ratings.map(renderRatingCard).join('')
  setupRatingBars()
  setupHighlightClicks()
}

function setupRatingBars() {
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
}

function setupHighlightClicks() {
  document.querySelectorAll('.rating-text').forEach(el => {
    el.addEventListener('click', () => {
      el.classList.toggle('highlighted')
    })
  })
}

const topPanelContainer = document.getElementById('topPanelContainer')
topPanelContainer.innerHTML = renderTopPanel('calificaciones')

const app = document.getElementById('app')
app.innerHTML = `
  <section class="section" id="calificaciones" style="padding-top: 80px;">
    <div class="section-header">
      <div class="overline">Calificaciones</div>
      <h2>Profesionales que confían en nosotros</h2>
      <p>Conoce las experiencias y calificaciones de nuestra comunidad de profesionales.</p>
    </div>
    <div class="ratings-grid" id="ratingsGrid">
      ${ratings.map(renderRatingCard).join('')}
    </div>
    <div class="add-rating-section">
      <button class="add-rating-btn" id="addRatingBtn">
        <span>${icons.star}</span> Agregar Calificación
      </button>
      <div class="add-rating-form" id="addRatingForm">
        <h3>Nueva Calificación</h3>
        <div class="form-row">
          <div class="form-group">
            <label for="ratingName">Nombre</label>
            <input type="text" id="ratingName" placeholder="Tu nombre completo" />
          </div>
          <div class="form-group">
            <label for="ratingRole">Rol / Cargo</label>
            <input type="text" id="ratingRole" placeholder="Ej: Frontend Developer" />
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label for="ratingPercentage">Porcentaje de Match</label>
            <input type="number" id="ratingPercentage" min="0" max="100" placeholder="Ej: 90" />
          </div>
          <div class="form-group">
            <label>Estrellas</label>
            <div class="stars-input" id="starsInput">
              <button type="button" class="star-btn" data-value="1">&#9733;</button>
              <button type="button" class="star-btn" data-value="2">&#9733;</button>
              <button type="button" class="star-btn" data-value="3">&#9733;</button>
              <button type="button" class="star-btn" data-value="4">&#9733;</button>
              <button type="button" class="star-btn" data-value="5">&#9733;</button>
            </div>
          </div>
        </div>
        <div class="form-row">
          <div class="form-group full-width">
            <label for="ratingText">Comentario</label>
            <textarea id="ratingText" placeholder="Describe tu experiencia con NextStepp..."></textarea>
          </div>
        </div>
        <div class="form-actions">
          <button class="btn-cancel" id="cancelRatingBtn">Cancelar</button>
          <button class="btn-submit" id="submitRatingBtn">Enviar Calificación</button>
        </div>
      </div>
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

let selectedStars = 0

document.getElementById('addRatingBtn').addEventListener('click', () => {
  document.getElementById('addRatingForm').classList.toggle('open')
})

document.getElementById('cancelRatingBtn').addEventListener('click', () => {
  document.getElementById('addRatingForm').classList.remove('open')
  document.getElementById('ratingName').value = ''
  document.getElementById('ratingRole').value = ''
  document.getElementById('ratingPercentage').value = ''
  document.getElementById('ratingText').value = ''
  selectedStars = 0
  document.querySelectorAll('#starsInput .star-btn').forEach(b => b.classList.remove('active'))
})

document.querySelectorAll('#starsInput .star-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    selectedStars = parseInt(btn.dataset.value)
    document.querySelectorAll('#starsInput .star-btn').forEach(b => {
      b.classList.toggle('active', parseInt(b.dataset.value) <= selectedStars)
    })
  })
})

document.getElementById('submitRatingBtn').addEventListener('click', () => {
  const name = document.getElementById('ratingName').value.trim()
  const role = document.getElementById('ratingRole').value.trim()
  const percentage = parseInt(document.getElementById('ratingPercentage').value)
  const text = document.getElementById('ratingText').value.trim()

  if (!name || !role || !percentage || !text || !selectedStars) {
    return
  }

  ratings.push({
    name,
    initials: getInitials(name),
    role,
    percentage: Math.min(100, Math.max(0, percentage)),
    stars: selectedStars,
    text,
  })

  renderRatingsGrid()

  document.getElementById('addRatingForm').classList.remove('open')
  document.getElementById('ratingName').value = ''
  document.getElementById('ratingRole').value = ''
  document.getElementById('ratingPercentage').value = ''
  document.getElementById('ratingText').value = ''
  selectedStars = 0
  document.querySelectorAll('#starsInput .star-btn').forEach(b => b.classList.remove('active'))

  const grid = document.getElementById('ratingsGrid')
  grid.lastElementChild.scrollIntoView({ behavior: 'smooth', block: 'center' })
})

setupRatingBars()
setupHighlightClicks()

setupTopPanel()
