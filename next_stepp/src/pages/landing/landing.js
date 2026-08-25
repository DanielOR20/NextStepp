import { navigate } from '../../router/router.js'
import { getCurrentUser } from '../../services/auth.service.js'
import { getJobOffers, getRatings, getSuggestedTags, getAiResponses } from '../../services/store.service.js'
import { ICONS } from '../../config/constants.js'
import { renderStars } from '../../utils/helpers.js'

export function renderLanding() {
  const user = getCurrentUser()
  const app = document.getElementById('app')

  const jobOffers = getJobOffers()
  const ratings = getRatings()
  const suggestedTags = getSuggestedTags()

  const navLinks = user
    ? `<li><a href="#${user.role === 'admin' ? '/admin/dashboard' : '/empresa/dashboard'}">Mi Panel</a></li>`
    : ''

  const authBtn = user
    ? `<button class="btn btn-outline" id="landingProfileBtn">Mi Panel</button>`
    : `<button class="btn btn-primary" id="landingLoginBtn">Iniciar Sesión</button>`

  app.innerHTML = `
    <nav class="navbar" id="navbar">
      <div class="navbar-inner">
        <a href="#/" class="navbar-logo">
          <span class="logo-icon">NS</span>
          NextStepp
        </a>
        <ul class="navbar-nav" id="navMenu">
          <li><a href="#inicio" class="active">Inicio</a></li>
          <li><a href="#empleos">Empleos</a></li>
          <li><a href="#calificaciones">Calificaciones</a></li>
          <li><a href="#ia">Asistente IA</a></li>
          ${navLinks}
        </ul>
        <div class="navbar-actions">
          ${authBtn}
          <button class="mobile-toggle" id="mobileToggle">${ICONS.menu}</button>
        </div>
      </div>
    </nav>

    <section class="hero-section" id="inicio">
      <div class="hero-badge">
        <span class="dot"></span>
        Plataforma de empleabilidad inteligente
      </div>
      <h1 class="hero-title">
        Da tu <span class="gradient-text">próximo paso</span> hacia la carrera de tus sueños
      </h1>
      <p class="hero-subtitle">
        Conectamos talento con las mejores oportunidades laborales. IA potenciada para encontrar el empleo perfecto según tu perfil profesional.
      </p>
      <div class="hero-actions">
        <button class="btn btn-primary btn-lg" onclick="document.querySelector('#empleos')?.scrollIntoView({ behavior: 'smooth' })">
          ${ICONS.briefcase} Explorar Empleos
        </button>
        <button class="btn btn-outline btn-lg" onclick="document.querySelector('#perfil')?.scrollIntoView({ behavior: 'smooth' })">
          ${ICONS.doc} Crear Mi CV
        </button>
      </div>
      <div class="hero-stats">
        <div class="stat-item">
          <div class="stat-number">2,500+</div>
          <div class="stat-label">Ofertas Activas</div>
        </div>
        <div class="stat-item">
          <div class="stat-number">18,000+</div>
          <div class="stat-label">Profesionales</div>
        </div>
        <div class="stat-item">
          <div class="stat-number">850+</div>
          <div class="stat-label">Empresas</div>
        </div>
        <div class="stat-item">
          <div class="stat-number">94%</div>
          <div class="stat-label">Satisfacción</div>
        </div>
      </div>
    </section>

    <section class="search-section" id="buscar">
      <div class="search-container">
        <div class="search-row">
          <div class="search-input-group">
            ${ICONS.search}
            <input type="text" id="searchKeyword" placeholder="Buscar empleo por palabra clave..." />
          </div>
          <div class="search-divider"></div>
          <div class="search-input-group">
            ${ICONS.location}
            <input type="text" id="searchLocation" placeholder="Ubicación" />
          </div>
          <button class="btn btn-primary btn-lg" id="searchBtn">
            ${ICONS.search} Buscar
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
              <span class="job-location">
                ${ICONS.location} ${job.location}
              </span>
            </div>
          </div>
        `).join('')}
      </div>
    </section>

    <section class="section" id="features">
      <div class="section-header">
        <div class="overline">Por Qué NextStepp</div>
        <h2>Herramientas que impulsan tu carrera</h2>
        <p>Todo lo que necesitas para encontrar el empleo perfecto en una sola plataforma.</p>
      </div>
      <div class="features-grid">
        <div class="feature-card">
          <div class="feature-icon">${ICONS.ai}</div>
          <h3>IA Inteligente</h3>
          <p>Asistente potenciado por IA que analiza tu perfil y te recomienda las mejores oportunidades laborales.</p>
        </div>
        <div class="feature-card">
          <div class="feature-icon">${ICONS.doc}</div>
          <h3>Generador de CV</h3>
          <p>Crea un CV profesional con nuestra herramienta de IA que destaca tus habilidades y experiencia.</p>
        </div>
        <div class="feature-card">
          <div class="feature-icon">${ICONS.search}</div>
          <h3>Búsqueda Avanzada</h3>
          <p>Encuentra empleos por palabra clave, ubicación, empresa o habilidades específicas.</p>
        </div>
        <div class="feature-card">
          <div class="feature-icon">${ICONS.star}</div>
          <h3>Calificación Profesional</h3>
          <p>Sistema de evaluación por porcentaje que muestra tu nivel de competencia y áreas de mejora.</p>
        </div>
      </div>
    </section>

    <section class="section" id="calificaciones">
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

    <section class="profile-section" id="perfil">
      <div class="profile-card">
        <div class="profile-info">
          <div class="overline" style="font-size:0.8rem;font-weight:700;text-transform:uppercase;letter-spacing:2px;color:var(--accent-light);margin-bottom:0.75rem;">Tu Perfil Profesional</div>
          <h2>Crea tu perfil y recibe ofertas personalizadas</h2>
          <p>Regístrate con tu información profesional y nuestra inteligencia artificial encontrará las mejores oportunidades laborales adaptadas a tu experiencia, habilidades y preferencias.</p>
          <div style="display:flex;gap:1rem;flex-wrap:wrap;">
            <div style="background:var(--glass);border:1px solid var(--glass-border);border-radius:var(--radius-sm);padding:12px 16px;text-align:center;">
              <div style="font-size:1.5rem;font-weight:800;color:var(--accent-light);">92%</div>
              <div style="font-size:0.75rem;color:var(--text-muted);">Match Promedio</div>
            </div>
            <div style="background:var(--glass);border:1px solid var(--glass-border);border-radius:var(--radius-sm);padding:12px 16px;text-align:center;">
              <div style="font-size:1.5rem;font-weight:800;color:var(--success);">3.2x</div>
              <div style="font-size:0.75rem;color:var(--text-muted);">Más Ofertas</div>
            </div>
            <div style="background:var(--glass);border:1px solid var(--glass-border);border-radius:var(--radius-sm);padding:12px 16px;text-align:center;">
              <div style="font-size:1.5rem;font-weight:800;color:var(--warning);">48h</div>
              <div style="font-size:0.75rem;color:var(--text-muted);">Tiempo Promedio</div>
            </div>
          </div>
        </div>
        <form class="profile-form" id="profileForm" onsubmit="return false;">
          <div class="form-row">
            <div class="form-group">
              <label>Nombre Completo</label>
              <input class="form-input" type="text" placeholder="Juan Pérez" />
            </div>
            <div class="form-group">
              <label>Correo Electrónico</label>
              <input class="form-input" type="email" placeholder="juan@email.com" />
            </div>
          </div>
          <div class="form-group">
            <label>Profesión / Cargo</label>
            <input class="form-input" type="text" placeholder="Desarrollador Full Stack" />
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>Experiencia</label>
              <select class="form-input form-select">
                <option value="">Seleccionar...</option>
                <option>0-1 años</option>
                <option>1-3 años</option>
                <option>3-5 años</option>
                <option>5-10 años</option>
                <option>10+ años</option>
              </select>
            </div>
            <div class="form-group">
              <label>Ubicación</label>
              <input class="form-input" type="text" placeholder="Ciudad de México" />
            </div>
          </div>
          <div class="form-group">
            <label>Habilidades Principales</label>
            <input class="form-input" type="text" placeholder="React, Node.js, Python, SQL..." />
          </div>
          <button class="btn btn-primary btn-lg" type="submit" style="width:100%;">
            ${ICONS.briefcase} Crear Perfil y Recibir Ofertas
          </button>
        </form>
      </div>
    </section>

    <section class="cv-banner">
      <div class="cv-banner-inner">
        <h2>Genera tu CV Profesional con IA</h2>
        <p>Nuestra inteligencia artificial analizará tu perfil y creará un CV que destaque ante los reclutadores.</p>
        <button class="btn btn-lg" onclick="document.querySelector('#perfil')?.scrollIntoView({ behavior: 'smooth' })">
          ${ICONS.doc} Crear Mi CV Ahora
        </button>
      </div>
    </section>

    <section class="ai-chat-section" id="ia">
      <div class="section-header">
        <div class="overline">Asistente IA</div>
        <h2>Consulta con nuestro asistente inteligente</h2>
        <p>Pregunta sobre empleos, mejora tu CV o recibe orientación profesional.</p>
      </div>
      <div class="ai-chat-container">
        <div class="ai-chat-header">
          <div class="ai-avatar">${ICONS.ai}</div>
          <div>
            <h3>NextStepp AI</h3>
            <p>Asistente de empleabilidad</p>
          </div>
          <div class="ai-status">
            <span class="dot"></span>
            En línea
          </div>
        </div>
        <div class="ai-chat-body" id="chatBody">
          <div class="ai-message bot">
            <div class="ai-message-avatar">${ICONS.ai}</div>
            <div class="ai-message-bubble">
              ¡Hola! Soy el asistente de NextStepp. Puedo ayudarte a encontrar empleos, mejorar tu CV o responder preguntas sobre oportunidades laborales. ¿En qué puedo ayudarte hoy?
            </div>
          </div>
        </div>
        <div class="ai-chat-input">
          <input type="text" id="chatInput" placeholder="Escribe tu pregunta sobre empleos..." />
          <button id="chatSend">${ICONS.send} Enviar</button>
        </div>
      </div>
    </section>

    <footer class="footer" id="contacto">
      <div class="footer-inner">
        <div class="footer-grid">
          <div class="footer-brand">
            <a href="#/" class="navbar-logo">
              <span class="logo-icon">NS</span>
              NextStepp
            </a>
            <p>Plataforma de empleabilidad inteligente que conecta profesionales con las mejores oportunidades laborales usando inteligencia artificial.</p>
            <div class="footer-social">
              <a href="#" aria-label="Facebook">FB</a>
              <a href="#" aria-label="Twitter">X</a>
              <a href="#" aria-label="LinkedIn">IN</a>
              <a href="#" aria-label="Instagram">IG</a>
            </div>
          </div>
          <div class="footer-col">
            <h4>Plataforma</h4>
            <ul>
              <li><a href="#empleos">Buscar Empleos</a></li>
              <li><a href="#perfil">Crear Perfil</a></li>
              <li><a href="#">Generar CV</a></li>
              <li><a href="#ia">Asistente IA</a></li>
            </ul>
          </div>
          <div class="footer-col">
            <h4>Empresa</h4>
            <ul>
              <li><a href="#">Sobre Nosotros</a></li>
              <li><a href="#">Publicar Empleo</a></li>
              <li><a href="#">Blog</a></li>
              <li><a href="#">Carreras</a></li>
            </ul>
          </div>
          <div class="footer-col">
            <h4>Contacto</h4>
            <ul>
              <li><a href="mailto:info@nextstepp.com">info@nextstepp.com</a></li>
              <li><a href="tel:+525555555555">+52 55 5555 5555</a></li>
              <li><a href="#">Ciudad de México, MX</a></li>
              <li><a href="#">Soporte 24/7</a></li>
            </ul>
          </div>
        </div>
        <div class="footer-bottom">
          <span>&copy; 2026 NextStepp. Todos los derechos reservados.</span>
          <span>
            <a href="#" style="color:var(--text-muted);text-decoration:none;">Privacidad</a> &middot;
            <a href="#" style="color:var(--text-muted);text-decoration:none;">Términos</a> &middot;
            <a href="#" style="color:var(--text-muted);text-decoration:none;">Cookies</a>
          </span>
        </div>
      </div>
    </footer>
  `

  setupLandingEvents(jobOffers)
  animateRatingBars()
}

function animateRatingBars() {
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

function setupLandingEvents(jobOffers) {
  const navbar = document.getElementById('navbar')
  const mobileToggle = document.getElementById('mobileToggle')
  const navMenu = document.getElementById('navMenu')
  const searchBtn = document.getElementById('searchBtn')
  const searchKeyword = document.getElementById('searchKeyword')
  const searchLocation = document.getElementById('searchLocation')
  const chatInput = document.getElementById('chatInput')
  const chatSend = document.getElementById('chatSend')
  const chatBody = document.getElementById('chatBody')

  const loginBtn = document.getElementById('landingLoginBtn')
  const profileBtn = document.getElementById('landingProfileBtn')

  if (loginBtn) {
    loginBtn.addEventListener('click', () => navigate('/login'))
  }
  if (profileBtn) {
    profileBtn.addEventListener('click', () => {
      const user = getCurrentUser()
      navigate(user.role === 'admin' ? '/admin/dashboard' : '/empresa/dashboard')
    })
  }

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50)
  })

  if (mobileToggle) {
    mobileToggle.addEventListener('click', () => {
      navMenu.classList.toggle('open')
      mobileToggle.innerHTML = navMenu.classList.contains('open') ? ICONS.close : ICONS.menu
    })
  }

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
    document.querySelector('#empleos')?.scrollIntoView({ behavior: 'smooth' })
  })

  searchKeyword.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') searchBtn.click()
  })

  searchLocation.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') searchBtn.click()
  })

  const aiResponses = getAiResponses()
  let responseIndex = 0

  function addMessage(text, type) {
    const msgDiv = document.createElement('div')
    msgDiv.className = `ai-message ${type}`
    const avatar = type === 'bot' ? ICONS.ai : '👤'
    msgDiv.innerHTML = `
      <div class="ai-message-avatar">${avatar}</div>
      <div class="ai-message-bubble">${text}</div>
    `
    chatBody.appendChild(msgDiv)
    chatBody.scrollTop = chatBody.scrollHeight
  }

  function sendMessage() {
    const text = chatInput.value.trim()
    if (!text) return
    addMessage(text, 'user')
    chatInput.value = ''

    setTimeout(() => {
      addMessage(aiResponses[responseIndex % aiResponses.length], 'bot')
      responseIndex++
    }, 800)
  }

  chatSend.addEventListener('click', sendMessage)
  chatInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') sendMessage()
  })
}
