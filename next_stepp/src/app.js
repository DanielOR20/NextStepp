import './styles/base.css'
import './styles/dashboard.css'

import { addRoute, initRouter } from './router/router.js'
import { renderLanding } from './pages/landing/landing.js'
import { renderLogin } from './pages/auth/login.js'
import { renderRegister } from './pages/auth/register.js'
import { renderAdminDashboard, renderAdminEmpresas, renderAdminVacantes } from './pages/admin/dashboard.js'
import { renderEmpresaDashboard } from './pages/client/empresas-clientes.js'

// Definición de Rutas de la Aplicación
addRoute('/', renderLanding)
addRoute('/login', renderLogin)
addRoute('/register', renderRegister)
addRoute('/admin/dashboard', renderAdminDashboard)
addRoute('/admin/empresas', renderAdminEmpresas)
addRoute('/admin/vacantes', renderAdminVacantes)
addRoute('/empresa/dashboard', renderEmpresaDashboard)

// Inicializar Enrutador
initRouter()
