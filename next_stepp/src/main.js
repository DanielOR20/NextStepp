import './styles/base.css'
import './styles/dashboard.css'
import './styles/tareas.css'

import { addRoute, initRouter } from './router/router.js'
import { renderLanding } from './pages/landing/landing.js'
import { renderLogin } from './pages/auth/login.js'
import { renderRegister } from './pages/auth/register.js'
import {
  renderAdminDashboard,
  renderAdminProducts,
  renderAdminCarts,
  renderAdminPosts,
  renderAdminComments,
  renderAdminTodos,
  renderAdminReports,
} from './pages/admin/dashboard.js'
import { renderEmpresaDashboard } from './pages/client/empresas-clientes.js'

addRoute('/', renderLanding)
addRoute('/login', renderLogin)
addRoute('/register', renderRegister)

addRoute('/admin/dashboard', renderAdminDashboard)
addRoute('/admin/products', renderAdminProducts)
addRoute('/admin/carts', renderAdminCarts)
addRoute('/admin/posts', renderAdminPosts)
addRoute('/admin/comments', renderAdminComments)
addRoute('/admin/todos', renderAdminTodos)
addRoute('/admin/reportes', renderAdminReports)

addRoute('/empresas-clientes', renderEmpresaDashboard)

initRouter()
