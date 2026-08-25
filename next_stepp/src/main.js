import './style.css'
import './pages/dashboard.css'
import { addRoute, initRouter } from './router.js'
import { renderLanding } from './pages/landing.js'
import { renderLogin } from './pages/login.js'
import { renderAdminDashboard, renderAdminEmpresas, renderAdminVacantes } from './pages/admin/dashboard.js'
import { renderEmpresaDashboard } from './pages/client/empresas-clientes.js'

// ===================== RUTAS DE LA APLICACIÓN =====================
addRoute('/', renderLanding)
addRoute('/login', renderLogin)
addRoute('/admin/dashboard', renderAdminDashboard)
addRoute('/admin/empresas', renderAdminEmpresas)
addRoute('/admin/vacantes', renderAdminVacantes)
addRoute('/empresa/dashboard', renderEmpresaDashboard)

// ===================== SPLASH SCREEN CONTROLLER =====================
export function initSplashScreen() {
  const splashOverlay = document.getElementById('splash-screen')
  const app = document.getElementById('app')
  const statusText = document.getElementById('splashStatusText')
  const progressFill = document.getElementById('splashProgressFill')

  if (!splashOverlay) {
    if (app) app.classList.add('app-visible')
    return
  }

  // Secuencia dinámica de carga
  setTimeout(() => {
    if (progressFill) progressFill.style.width = '28%'
  }, 150)

  setTimeout(() => {
    if (statusText) statusText.textContent = 'Sincronizando perfil inteligente...'
    if (progressFill) progressFill.style.width = '58%'
  }, 800)

  setTimeout(() => {
    if (statusText) statusText.textContent = 'Calibrando ofertas laborales...'
    if (progressFill) progressFill.style.width = '88%'
  }, 1650)

  setTimeout(() => {
    if (statusText) {
      statusText.textContent = '¡Acceso concedido!'
      statusText.style.color = '#00ff87'
    }
    if (progressFill) progressFill.style.width = '100%'
  }, 2250)

  // Desbloqueo creativo: Zoom-out / explosión controlada y revelación de la app (~2.7s)
  setTimeout(() => {
    // Activa la animación de dispersión neón
    splashOverlay.classList.add('unlocking')

    // Revela suavemente la aplicación principal de NextStepp
    if (app) {
      app.classList.add('app-visible')
    }

    // Remueve el splash overlay del render tree tras finalizar la transición
    setTimeout(() => {
      splashOverlay.classList.add('hidden')
    }, 850)
  }, 2700)
}

// Navegación fluida por secciones
export function scrollToSection(selector) {
  const el = document.querySelector(selector)
  if (el) el.scrollIntoView({ behavior: 'smooth' })
}
export function scrollTo(selector) {
  scrollToSection(selector)
}
window.scrollToSection = scrollToSection
window.scrollTo = scrollToSection

// ===================== INICIALIZACIÓN DE LA APP =====================
function initApp() {
  initRouter()
  initSplashScreen()
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp)
} else {
  initApp()
}
