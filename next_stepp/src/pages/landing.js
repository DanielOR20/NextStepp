import { navigate } from '../router.js'
import { getCurrentUser } from '../auth.js'

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
    remote: true,
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
    remote: true,
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
    remote: false,
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
    remote: true,
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
    remote: false,
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
    remote: true,
  },
]

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

const suggestedTags = [
  'Desarrollador', 'React', 'Python', 'Remoto', 'Full Stack',
  'Diseñador UX', 'Data Science', 'DevOps', 'Cloud', 'Figma',
]

const icons = {
  search: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>`,
  location: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>`,
  briefcase: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>`,
  star: `<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>`,
  starEmpty: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>`,
  send: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>`,
  menu: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>`,
  close: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`,
  ai: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a4 4 0 0 1 4 4c0 1.95-1.4 3.58-3.25 3.93"/><path d="M8.56 9.8A4 4 0 1 1 15.43 12"/><circle cx="12" cy="16" r="1"/><path d="M2 16c0-2.5 4-4 10-4s10 1.5 10 4"/></svg>`,
  doc: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>`,
}

function renderStars(count) {
  let html = '<div class="rating-stars">'
  for (let i = 0; i < 5; i++) {
    html += `<span class="star ${i < count ? '' : 'empty'}">${i < count ? icons.star : icons.starEmpty}</span>`
  }
  html += '</div>'
  return html
}

export function renderLanding() {
  const user = getCurrentUser()
  const app = document.getElementById('app')

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
          <button class="mobile-toggle" id="mobileToggle">${icons.menu}</button>
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
          ${icons.briefcase} Explorar Empleos
        </button>
        <button class="btn btn-outline btn-lg" onclick="document.querySelector('#perfil')?.scrollIntoView({ behavior: 'smooth' })">
          ${icons.doc} Crear Mi CV
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
              <span class="job-location">
                ${icons.location} ${job.location}
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
            ${icons.briefcase} Crear Perfil y Recibir Ofertas
          </button>
        </form>
      </div>
    </section>

    <section class="cv-banner">
      <div class="cv-banner-inner">
        <h2>Genera tu CV Profesional con IA</h2>
        <p>Nuestra inteligencia artificial analizará tu perfil y creará un CV que destaque ante los reclutadores.</p>
        <button class="btn btn-lg" onclick="document.querySelector('#perfil')?.scrollIntoView({ behavior: 'smooth' })">
          ${icons.doc} Crear Mi CV Ahora
        </button>
      </div>
    </section>

    <section class="ai-chat-section" id="ia">
      <div class="section-header">
        <div class="overline">Asistente IA</div>
        <h2>Consulta con nuestro asistente inteligente</h2>
        <p>Pregunta sobre empleos, mejora tu CV o recibe orientación profesional. Potenciado por Groq AI.</p>
      </div>
      <div class="ai-chat-container">
        <div class="ai-chat-header">
          <div class="ai-avatar">${icons.ai}</div>
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
            <div class="ai-message-avatar">${icons.ai}</div>
            <div class="ai-message-bubble">
              ¡Hola! Soy el asistente de NextStepp. Puedo ayudarte a encontrar empleos, mejorar tu CV o responder preguntas sobre oportunidades laborales. ¿En qué puedo ayudarte hoy?
            </div>
          </div>
        </div>
        <div class="ai-chat-input">
          <input type="text" id="chatInput" placeholder="Escribe tu pregunta sobre empleos..." />
          <button id="chatSend">${icons.send} Enviar</button>
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

  setupLandingEvents()
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

function setupLandingEvents() {
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
      mobileToggle.innerHTML = navMenu.classList.contains('open') ? icons.close : icons.menu
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

  const aiResponses = [
    'Basándome en tu perfil, te recomiendo explorar las ofertas de desarrollo full stack. Hay una alta demanda en este sector.',
    'Para mejorar tu CV, asegúrate de destacar logros cuantificables en cada posición. Por ejemplo: "Incrementé la eficiencia en un 40%".',
    'Las habilidades más solicitadas actualmente son: React, Python, Cloud Computing y Machine Learning. Te sugiero enfocarte en al menos dos de ellas.',
    'El mercado laboral tech está muy activo. El tiempo promedio de contratación para perfiles senior es de 2-3 semanas.',
    'Te recomiendo crear un portafolio en línea que muestre tus proyectos. Los reclutadores valoran mucho ver ejemplos de trabajo prácticos.',
    'Las empresas buscan cada vez más perfiles híbridos. Combinar habilidades técnicas con soft skills como liderazgo y comunicación es clave.',
  ]

  let responseIndex = 0

  function addMessage(text, type) {
    const msgDiv = document.createElement('div')
    msgDiv.className = `ai-message ${type}`
    const avatar = type === 'bot' ? icons.ai : '👤'
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
