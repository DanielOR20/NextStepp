const routes = {}
let notFoundHandler = null

export function addRoute(path, handler) {
  routes[path] = handler
}

export function setNotFound(handler) {
  notFoundHandler = handler
}

export function navigate(path) {
  window.location.hash = path.startsWith('/') ? path : '/' + path
}

export function getCurrentPath() {
  const hash = window.location.hash.slice(1)
  if (!hash || hash === '') return '/'
  return hash.startsWith('/') ? hash : '/' + hash
}

export function initRouter() {
  function handleRoute() {
    const rawHash = window.location.hash.slice(1)

    // Si es un ancla interna de la landing (ej: #inicio, #empleos, #calificaciones, #ia)
    if (rawHash && !rawHash.startsWith('/')) {
      const targetEl = document.getElementById(rawHash)
      if (targetEl) {
        targetEl.scrollIntoView({ behavior: 'smooth' })
        return
      }
    }

    const path = getCurrentPath()
    const handler = routes[path]
    if (handler) {
      handler()
    } else if (notFoundHandler) {
      notFoundHandler(path)
    } else if (routes['/']) {
      routes['/']()
    }
  }

  window.addEventListener('hashchange', handleRoute)
  handleRoute()
}
