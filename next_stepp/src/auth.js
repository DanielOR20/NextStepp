import { getUsers } from './store.js'

let currentUser = null

export function login(email, password) {
  const users = getUsers()
  const user = users.find(
    (u) => u.email === email && u.password === password
  )
  if (!user) return { success: false, error: 'Credenciales incorrectas' }
  const { password: _, ...safe } = user
  currentUser = safe
  sessionStorage.setItem('jobconnect_user', JSON.stringify(currentUser))
  return { success: true, user: currentUser }
}

export function logout() {
  currentUser = null
  sessionStorage.removeItem('jobconnect_user')
}

export function getCurrentUser() {
  if (!currentUser) {
    const stored = sessionStorage.getItem('jobconnect_user')
    if (stored) currentUser = JSON.parse(stored)
  }
  return currentUser
}

export function isAuthenticated() {
  return getCurrentUser() !== null
}
