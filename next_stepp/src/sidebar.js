import { icons } from './icons.js'
import { login, getCurrentUser } from './services/auth.service.js'

const navItems = [
  { label: 'Inicio', href: 'inicio.html', id: 'inicio' },
  { label: 'Empleos', href: 'empleos.html', id: 'empleos' },
  { label: 'Calificaciones', href: 'calificaciones.html', id: 'calificaciones' },
  { label: 'Asistente IA', href: 'ia.html', id: 'ia' },
  { label: 'Mi Perfil', href: 'perfil.html', id: 'perfil' },
]

export function renderTopPanel(activePage) {
  const user = getCurrentUser()
  const panelHref = user?.role === 'admin'
    ? 'index.html#/admin/dashboard'
    : 'index.html#/empresas-clientes'

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
              <a href="${item.href}" ${item.id === activePage ? 'class="active"' : ''}>
                ${item.label}
              </a>
            </li>
          `).join('')}
        </ul>
        <div class="navbar-actions">
          ${user
            ? `<a class="btn btn-outline" href="${panelHref}">Mi Panel</a>`
            : '<button class="btn btn-outline" id="loginPanelBtn" type="button">Iniciar Sesion</button>'}
          <button class="mobile-toggle" id="mobileToggle" type="button">${icons.menu}</button>
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
    <div class="modal-overlay" id="loginModal" aria-hidden="true">
      <div class="modal-window" role="dialog" aria-modal="true" aria-labelledby="loginModalTitle">
        <div class="modal-win-header">
          <div class="win-title" id="loginModalTitle">Iniciar Sesion</div>
          <button class="win-close" id="closeLoginModal" type="button" aria-label="Cerrar">x</button>
        </div>
        <div class="modal-win-body">
          <form id="inlineLoginForm">
            <div class="win-form-group">
              <label for="inlineEmail">Usuario / Email</label>
              <input type="text" id="inlineEmail" class="sys-input" placeholder="tu@email.com" autocomplete="username" required />
            </div>
            <div class="win-form-group">
              <label for="inlinePassword">Contrasena</label>
              <input type="password" id="inlinePassword" class="sys-input" placeholder="********" autocomplete="current-password" required />
            </div>
            <div class="modal-win-footer">
              <button type="button" class="btn-tool" id="cancelLoginModal">Cancelar</button>
              <button type="submit" class="btn-tool btn-tool-blue">Entrar</button>
            </div>
            <p class="auth-error" id="inlineLoginError" aria-live="polite"></p>
            <p class="modal-register-text">
              No tienes cuenta? <a href="index.html#/register" class="modal-link">Registrate</a>
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
  const errorEl = document.getElementById('inlineLoginError')

  const closeModal = () => {
    modal?.classList.remove('active')
    modal?.setAttribute('aria-hidden', 'true')
    document.body.style.overflow = ''
    if (errorEl) {
      errorEl.textContent = ''
      errorEl.classList.remove('visible')
    }
  }

  if (loginBtn && modal) {
    loginBtn.addEventListener('click', () => {
      modal.classList.add('active')
      modal.setAttribute('aria-hidden', 'false')
      document.body.style.overflow = 'hidden'
      document.getElementById('inlineEmail')?.focus()
    })
  }

  closeBtn?.addEventListener('click', closeModal)
  cancelBtn?.addEventListener('click', closeModal)

  modal?.addEventListener('click', (e) => {
    if (e.target === modal) closeModal()
  })

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal?.classList.contains('active')) closeModal()
  })

  form?.addEventListener('submit', (e) => {
    e.preventDefault()
    const email = document.getElementById('inlineEmail').value.trim()
    const password = document.getElementById('inlinePassword').value.trim()
    const result = login(email, password)

    if (!result.success) {
      errorEl.textContent = result.error
      errorEl.classList.add('visible')
      return
    }

    const target = result.user.role === 'admin' ? '/admin/dashboard' : '/empresas-clientes'
    window.location.href = `index.html#${target}`
  })
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
              <li><a href="perfil.html">Generar CV</a></li>
              <li><a href="ia.html">Asistente IA</a></li>
            </ul>
          </div>
          <div class="footer-col">
            <h4>Empresa</h4>
            <ul>
              <li><a href="inicio.html">Sobre Nosotros</a></li>
              <li><a href="index.html#/login">Publicar Empleo</a></li>
              <li><a href="inicio.html">Blog</a></li>
              <li><a href="empleos.html">Carreras</a></li>
            </ul>
          </div>
          <div class="footer-col">
            <h4>Contacto</h4>
            <ul>
              <li><a href="mailto:info@nextstepp.com">info@nextstepp.com</a></li>
              <li><a href="tel:+50655555555">+506 5555 5555</a></li>
              <li><a href="https://www.google.com/maps/search/San+Jose+Costa+Rica" target="_blank" rel="noreferrer">San Jose, Costa Rica</a></li>
              <li><a href="mailto:soporte@nextstepp.com">Soporte</a></li>
            </ul>
          </div>
        </div>
        <div class="footer-bottom">
          <span>&copy; 2026 NextStepp. Todos los derechos reservados.</span>
          <span>
            <a href="inicio.html" style="color:var(--text-muted);text-decoration:none;">Privacidad</a> &middot;
            <a href="inicio.html" style="color:var(--text-muted);text-decoration:none;">Terminos</a> &middot;
            <a href="inicio.html" style="color:var(--text-muted);text-decoration:none;">Cookies</a>
          </span>
        </div>
      </div>
    </footer>
  `
}
