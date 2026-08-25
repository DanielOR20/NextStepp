import './style.css'
import './pages/dashboard.css'
import { addRoute, initRouter } from './router.js'
import { renderLanding } from './pages/landing.js'
import { renderLogin } from './pages/login.js'
import { renderAdminDashboard, renderAdminEmpresas, renderAdminVacantes } from './pages/admin/dashboard.js'
import { renderEmpresaDashboard } from './pages/client/empresas-clientes.js'

addRoute('/', renderLanding)
addRoute('/login', renderLogin)
addRoute('/admin/dashboard', renderAdminDashboard)
addRoute('/admin/empresas', renderAdminEmpresas)
addRoute('/admin/vacantes', renderAdminVacantes)
addRoute('/empresa/dashboard', renderEmpresaDashboard)

initRouter()
