import { icons } from './icons.js'

const navItems = [
  { id: 'inicio', label: 'Inicio', icon: icons.home, file: 'inicio.html' },
  { id: 'perfil', label: 'Mi Perfil', icon: icons.user, file: 'perfil.html' },
  { id: 'empleos', label: 'Empleos', icon: icons.briefcaseLarge, file: 'empleos.html' },
  { id: 'calificaciones', label: 'Calificaciones', icon: icons.starLarge, file: 'calificaciones.html' },
  { id: 'ia', label: 'Asistente IA', icon: icons.bot, file: 'ia.html' },
]

export function renderTopPanel(activePage) {
  return `
    <header class="top-panel" id="topPanel">
      <div class="top-panel-inner">
        <a href="inicio.html" class="top-panel-logo">
          <span class="logo-icon">NS</span>
          NextStepp
        </a>
        <nav>
          <ul class="top-panel-nav">
            ${navItems.map(item => `
              <li>
                <a href="${item.file}" class="${item.id === activePage ? 'active' : ''}">
                  <span class="nav-icon">${item.icon}</span>
                  ${item.label}
                </a>
              </li>
            `).join('')}
          </ul>
        </nav>
        <div class="top-panel-actions">
          <button class="btn btn-primary" id="loginBtn">Iniciar Sesión</button>
          <button class="top-panel-mobile-toggle" id="mobileToggle">${icons.menu}</button>
        </div>
      </div>
      <div class="top-panel-mobile-menu" id="mobileMenu">
        <ul class="sidebar-nav">
          ${navItems.map(item => `
            <li>
              <a href="${item.file}" class="${item.id === activePage ? 'active' : ''}">
                <span class="nav-icon">${item.icon}</span>
                ${item.label}
              </a>
            </li>
          `).join('')}
        </ul>
      </div>
    </header>
  `
}

export function setupTopPanel() {
  const topPanel = document.getElementById('topPanel')
  const mobileToggle = document.getElementById('mobileToggle')
  const mobileMenu = document.getElementById('mobileMenu')

  if (!topPanel) return

  window.addEventListener('scroll', () => {
    topPanel.classList.toggle('scrolled', window.scrollY > 50)
  })

  if (mobileToggle && mobileMenu) {
    mobileToggle.addEventListener('click', () => {
      mobileMenu.classList.toggle('open')
      mobileToggle.innerHTML = mobileMenu.classList.contains('open') ? icons.close : icons.menu
    })
  }
}

export function renderLoginModal() {
  return `
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
}

export function setupLoginModal() {
  const loginBtn = document.getElementById('loginBtn')
  const loginModal = document.getElementById('loginModal')
  const closeModal = document.getElementById('closeModal')
  const loginSubmit = document.getElementById('loginSubmit')
  const loginForm = document.getElementById('loginForm')

  if (!loginBtn || !loginModal) return

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

export function renderFooter() {
  return `
    <footer class="footer" id="contacto">
      <div class="footer-inner">
        <div class="footer-grid">
          <div class="footer-brand">
            <a href="inicio.html" class="navbar-logo">
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
              <li><a href="empleos.html">Buscar Empleos</a></li>
              <li><a href="perfil.html">Crear Perfil</a></li>
              <li><a href="#">Generar CV</a></li>
              <li><a href="ia.html">Asistente IA</a></li>
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
}
