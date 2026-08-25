const routes = {}
let notFoundHandler = null

export function addRoute(path, handler) {
  routes[path] = handler
}

export function setNotFound(handler) {
  notFoundHandler = handler
}

export function navigate(path) {
  window.location.hash = path
}

export function getCurrentPath() {
  return window.location.hash.slice(1) || '/'
}

export function initRouter() {
  function handleRoute() {
    const path = getCurrentPath()
    const handler = routes[path]
    if (handler) {
      handler()
    } else if (notFoundHandler) {
      notFoundHandler(path)
    }
  }

  window.addEventListener('hashchange', handleRoute)
  handleRoute()
}
