import { getUsers } from './store.service.js'

let currentUser = null

export function login(email, password) {
  const cleanEmail = (email || '').trim().toLowerCase()
  const cleanPass = (password || '').trim()

  const users = getUsers()
  const user = users.find(
    (u) => u.email === email && u.password === password,
  )

  if (!user) {
    return {
      success: false,
      error: 'Credenciales incorrectas. Selecciona una cuenta de prueba para ingresar.'
    }
  }

  const { password: _, ...safe } = user
  currentUser = safe
  sessionStorage.setItem('jobconnect_user', JSON.stringify(currentUser))
  localStorage.setItem('authToken', `auth-token-${user.id}-${Date.now()}`)
  return { success: true, user: currentUser }
}

export function logout() {
  currentUser = null
  sessionStorage.removeItem('jobconnect_user')
  localStorage.removeItem('authToken')
}

export function getCurrentUser() {
  if (!currentUser) {
    const stored = sessionStorage.getItem('jobconnect_user')
    if (stored) {
      try {
        currentUser = JSON.parse(stored)
      } catch (e) {
        currentUser = null
      }
    }
  }
  return currentUser
}

export function isAuthenticated() {
  return getCurrentUser() !== null
}
