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
          <a href="index.html#/login" class="btn btn-primary" id="loginBtn">Iniciar Sesión</a>
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
