import { icons } from './icons.js'

const navItems = [
  { label: 'Inicio', href: 'inicio.html', id: 'inicio' },
  { label: 'Empleos', href: 'empleos.html', id: 'empleos' },
  { label: 'Calificaciones', href: 'calificaciones.html', id: 'calificaciones' },
  { label: 'Asistente IA', href: 'ia.html', id: 'ia' },
  { label: 'Mi Perfil', href: 'perfil.html', id: 'perfil' },
  { label: 'Postulaciones', href: 'src/pages/postulaciones/postulaciones.html', id: 'postulaciones', highlight: true },
]

export function renderTopPanel(activePage) {
  return `
    <nav class="navbar" id="navbar">
      <div class="navbar-inner">
        <a href="inicio.html" class="navbar-logo">
          <span class="logo-icon">NS</span>
          NextStepp
        </a>
        <ul class="navbar-nav" id="navMenu">
          ${navItems.map(item => `
            <li>
              <a href="${item.href}" ${item.id === activePage ? 'class="active"' : ''} ${item.highlight ? 'style="color: var(--accent-light); font-weight: 600;"' : ''}>
                ${item.label}
              </a>
            </li>
          `).join('')}
        </ul>
        <div class="navbar-actions">
          <button class="btn btn-outline" id="loginPanelBtn" style="display:none;">Iniciar Sesión</button>
          <button class="mobile-toggle" id="mobileToggle">${icons.menu}</button>
        </div>
      </div>
    </nav>
  `
}

export function setupTopPanel() {
  const navbar = document.getElementById('navbar')
  const mobileToggle = document.getElementById('mobileToggle')
  const navMenu = document.getElementById('navMenu')

  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 50)
    })
  }

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      navMenu.classList.toggle('open')
      mobileToggle.innerHTML = navMenu.classList.contains('open') ? icons.close : icons.menu
    })
  }
}

export function renderLoginModal() {
  return `
    <div class="modal-overlay" id="loginModal">
      <div class="modal-window" style="max-width:420px;">
        <div class="modal-win-header">
          <div class="win-title">Iniciar Sesión</div>
          <button class="win-close" id="closeLoginModal">✕</button>
        </div>
        <div class="modal-win-body">
          <form id="inlineLoginForm">
            <div class="win-form-group">
              <label for="inlineEmail">Usuario / Email</label>
              <input type="text" id="inlineEmail" class="sys-input" placeholder="tu@email.com" required />
            </div>
            <div class="win-form-group">
              <label for="inlinePassword">Contraseña</label>
              <input type="password" id="inlinePassword" class="sys-input" placeholder="••••••••" required />
            </div>
            <div class="modal-win-footer">
              <button type="button" class="btn-tool" id="cancelLoginModal">Cancelar</button>
              <button type="submit" class="btn-tool btn-tool-blue">Entrar</button>
            </div>
            <p style="text-align:center;margin-top:12px;font-size:0.85rem;color:var(--text-muted);">
              ¿No tienes cuenta? <a href="src/pages/postulaciones/postulaciones.html" style="color:var(--accent-light);">Ver demo</a>
            </p>
          </form>
        </div>
      </div>
    </div>
  `
}

export function setupLoginModal() {
  const loginBtn = document.getElementById('loginPanelBtn')
  const modal = document.getElementById('loginModal')
  const closeBtn = document.getElementById('closeLoginModal')
  const cancelBtn = document.getElementById('cancelLoginModal')
  const form = document.getElementById('inlineLoginForm')

  if (loginBtn) {
    loginBtn.addEventListener('click', () => {
      modal.classList.add('active')
    })
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', () => modal.classList.remove('active'))
  }

  if (cancelBtn) {
    cancelBtn.addEventListener('click', () => modal.classList.remove('active'))
  }

  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.classList.remove('active')
    })
  }

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault()
      window.location.href = '/index.html#/login'
    })
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
