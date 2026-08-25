import './style.css'

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

function createSVGIcons() {
  return {
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
}

const icons = createSVGIcons()

function renderStars(count) {
  let html = '<div class="rating-stars">'
  for (let i = 0; i < 5; i++) {
    html += `<span class="star ${i < count ? '' : 'empty'}">${i < count ? icons.star : icons.starEmpty}</span>`
  }
  html += '</div>'
  return html
}

function render() {
  const app = document.querySelector('#app')

  app.innerHTML = `
    <!-- NAVBAR -->
    <nav class="navbar" id="navbar">
      <div class="navbar-inner">
        <a href="#" class="navbar-logo">
          <span class="logo-icon">NS</span>
          NextStepp
        </a>
        <ul class="navbar-nav" id="navMenu">
          <li><a href="#inicio" class="active">Inicio</a></li>
          <li><a href="#empleos">Empleos</a></li>
          <li><a href="#calificaciones">Calificaciones</a></li>
          <li><a href="#ia">Asistente IA</a></li>
          <li><a href="#perfil">Mi Perfil</a></li>
        </ul>
        <div class="navbar-actions">
          <button class="btn btn-primary" id="loginBtn">Iniciar Sesión</button>
          <button class="mobile-toggle" id="mobileToggle">${icons.menu}</button>
        </div>
      </div>
    </nav>

    <!-- HERO -->
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
        <button class="btn btn-primary btn-lg" onclick="scrollTo('#empleos')">
          ${icons.briefcase} Explorar Empleos
        </button>
        <button class="btn btn-outline btn-lg" onclick="scrollTo('#perfil')">
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

    <!-- SEARCH -->
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

    <!-- JOB OFFERS -->
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

    <!-- FEATURES -->
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

    <!-- RATINGS -->
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

    <!-- PROFILE -->
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

    <!-- CV BANNER -->
    <section class="cv-banner">
      <div class="cv-banner-inner">
        <h2>Genera tu CV Profesional con IA</h2>
        <p>Nuestra inteligencia artificial analizará tu perfil y creará un CV que destaque ante los reclutadores.</p>
        <button class="btn btn-lg" onclick="scrollTo('#perfil')">
          ${icons.doc} Crear Mi CV Ahora
        </button>
      </div>
    </section>

    <!-- AI CHAT -->
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

    <!-- FOOTER -->
    <footer class="footer" id="contacto">
      <div class="footer-inner">
        <div class="footer-grid">
          <div class="footer-brand">
            <a href="#" class="navbar-logo">
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

    <!-- LOGIN MODAL -->
    <div class="modal-overlay" id="loginModal">
      <div class="modal">
        <button class="modal-close" id="closeModal">&times;</button>
        <div class="modal-header">
          <span class="logo-icon" style="width:48px;height:48px;font-size:1.2rem;">NS</span>
          <h2>Iniciar Sesión</h2>
          <p>Accede a tu cuenta para encontrar las mejores oportunidades</p>
        </div>
        <form class="modal-form" id="loginForm" onsubmit="return false;">
          <div class="form-group">
            <label>Correo Electrónico</label>
            <input class="form-input" type="email" id="loginEmail" placeholder="tu@email.com" required />
          </div>
          <div class="form-group">
            <label>Contraseña</label>
            <input class="form-input" type="password" id="loginPassword" placeholder="••••••••" required />
          </div>
          <div class="modal-options">
            <label class="modal-checkbox">
              <input type="checkbox" checked /> Recordarme
            </label>
            <a href="#" class="modal-link">¿Olvidaste tu contraseña?</a>
          </div>
          <button class="btn btn-primary btn-lg" type="submit" style="width:100%;" id="loginSubmit">
            Iniciar Sesión
          </button>
          <div class="modal-divider">
            <span>o continúa con</span>
          </div>
          <div class="modal-socials">
            <button class="btn btn-ghost modal-social-btn" type="button">
              <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
              Google
            </button>
            <button class="btn btn-ghost modal-social-btn" type="button">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
              GitHub
            </button>
          </div>
        </form>
      </div>
    </div>
  `

  setupEventListeners()
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

function scrollTo(selector) {
  const el = document.querySelector(selector)
  if (el) el.scrollIntoView({ behavior: 'smooth' })
}

function setupEventListeners() {
  const navbar = document.getElementById('navbar')
  const mobileToggle = document.getElementById('mobileToggle')
  const navMenu = document.getElementById('navMenu')
  const searchBtn = document.getElementById('searchBtn')
  const searchKeyword = document.getElementById('searchKeyword')
  const searchLocation = document.getElementById('searchLocation')
  const chatInput = document.getElementById('chatInput')
  const chatSend = document.getElementById('chatSend')
  const chatBody = document.getElementById('chatBody')

  // Navbar scroll effect
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50)
  })

  // Active nav link
  const sections = document.querySelectorAll('section[id]')
  window.addEventListener('scroll', () => {
    let current = ''
    sections.forEach(section => {
      const top = section.offsetTop - 100
      if (window.scrollY >= top) current = section.getAttribute('id')
    })
    document.querySelectorAll('.navbar-nav a').forEach(a => {
      a.classList.remove('active')
      if (a.getAttribute('href') === '#' + current) a.classList.add('active')
    })
  })

  // Mobile toggle
  if (mobileToggle) {
    mobileToggle.addEventListener('click', () => {
      navMenu.classList.toggle('open')
      mobileToggle.innerHTML = navMenu.classList.contains('open') ? icons.close : icons.menu
    })
  }

  // Search tags
  document.querySelectorAll('.search-tag').forEach(tag => {
    tag.addEventListener('click', () => {
      searchKeyword.value = tag.dataset.tag
      searchKeyword.focus()
    })
  })

  // Search
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

  // AI Chat
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

  // Login Modal
  const loginBtn = document.getElementById('loginBtn')
  const loginModal = document.getElementById('loginModal')
  const closeModal = document.getElementById('closeModal')
  const loginForm = document.getElementById('loginForm')
  const loginSubmit = document.getElementById('loginSubmit')

  function openLoginModal() {
    loginModal.classList.add('open')
    document.body.style.overflow = 'hidden'
  }

  function closeLoginModal() {
    loginModal.classList.remove('open')
    document.body.style.overflow = ''
  }

  loginBtn.addEventListener('click', openLoginModal)

  closeModal.addEventListener('click', closeLoginModal)

  loginModal.addEventListener('click', (e) => {
    if (e.target === loginModal) closeLoginModal()
  })

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && loginModal.classList.contains('open')) {
      closeLoginModal()
    }
  })

  loginSubmit.addEventListener('click', () => {
    const email = document.getElementById('loginEmail').value.trim()
    const password = document.getElementById('loginPassword').value.trim()

    if (!email || !password) {
      loginSubmit.textContent = 'Completa todos los campos'
      loginSubmit.style.background = 'linear-gradient(135deg, #ef4444, #f97316)'
      setTimeout(() => {
        loginSubmit.textContent = 'Iniciar Sesión'
        loginSubmit.style.background = ''
      }, 2000)
      return
    }

    loginSubmit.textContent = 'Ingresando...'
    loginSubmit.style.opacity = '0.7'
    loginSubmit.disabled = true

    setTimeout(() => {
      loginSubmit.textContent = '¡Bienvenido!'
      loginSubmit.style.background = 'linear-gradient(135deg, #10b981, #06b6d4)'
      loginSubmit.style.opacity = '1'

      setTimeout(() => {
        closeLoginModal()
        loginSubmit.textContent = 'Iniciar Sesión'
        loginSubmit.style.background = ''
        loginSubmit.disabled = false
        loginForm.reset()

        // Show welcome toast
        showToast('¡Sesión iniciada! Bienvenido a NextStepp')
      }, 1200)
    }, 1500)
  })

  function showToast(message) {
    const toast = document.createElement('div')
    toast.className = 'toast'
    toast.textContent = message
    document.body.appendChild(toast)
    requestAnimationFrame(() => toast.classList.add('show'))
    setTimeout(() => {
      toast.classList.remove('show')
      setTimeout(() => toast.remove(), 400)
    }, 3000)
  }
}

// Initialize
document.addEventListener('DOMContentLoaded', render)
render()
