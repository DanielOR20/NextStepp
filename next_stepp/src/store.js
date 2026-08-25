import seedData from './db.json'

const STORAGE_KEY = 'jobconnect_db'

function loadDB() {
  const stored = localStorage.getItem(STORAGE_KEY)
  let db
  try {
    db = stored ? JSON.parse(stored) : structuredClone(seedData)
  } catch (e) {
    db = structuredClone(seedData)
  }

  // Sincronizar usuarios de prueba por defecto de seedData
  if (seedData && Array.isArray(seedData.users)) {
    if (!Array.isArray(db.users)) db.users = []
    seedData.users.forEach((seedUser) => {
      const existing = db.users.find((u) => u.email.toLowerCase() === seedUser.email.toLowerCase())
      if (!existing) {
        db.users.push(seedUser)
      } else {
        existing.password = seedUser.password
        existing.role = seedUser.role
      }
    })
  }

  if (!Array.isArray(db.vacancies)) db.vacancies = seedData.vacancies || []

  saveDB(db)
  return db
}

function saveDB(db) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(db))
}

export function getDB() {
  return loadDB()
}

export function getUsers() {
  return loadDB().users
}

export function getUserById(id) {
  return loadDB().users.find((u) => u.id === id)
}

export function getVacancies() {
  return loadDB().vacancies
}

export function getVacanciesByCompany(companyId) {
  return loadDB().vacancies.filter((v) => v.companyId === companyId)
}

export function getVacancyById(id) {
  return loadDB().vacancies.find((v) => v.id === id)
}

export function addUser(user) {
  const db = loadDB()
  user.id = Math.max(0, ...db.users.map((u) => u.id)) + 1
  db.users.push(user)
  saveDB(db)
  return user
}

export function updateUser(id, updates) {
  const db = loadDB()
  const idx = db.users.findIndex((u) => u.id === id)
  if (idx === -1) return null
  db.users[idx] = { ...db.users[idx], ...updates }
  saveDB(db)
  return db.users[idx]
}

export function addVacancy(vacancy) {
  const db = loadDB()
  vacancy.id = Math.max(0, ...db.vacancies.map((v) => v.id)) + 1
  vacancy.status = 'pending'
  vacancy.aiScore = null
  vacancy.aiFlags = []
  vacancy.publishedAt = new Date().toISOString().split('T')[0]
  db.vacancies.push(vacancy)
  saveDB(db)
  return vacancy
}

export function updateVacancy(id, updates) {
  const db = loadDB()
  const idx = db.vacancies.findIndex((v) => v.id === id)
  if (idx === -1) return null
  db.vacancies[idx] = { ...db.vacancies[idx], ...updates }
  saveDB(db)
  return db.vacancies[idx]
}

export function deleteVacancy(id) {
  const db = loadDB()
  db.vacancies = db.vacancies.filter((v) => v.id !== id)
  saveDB(db)
}

export function getCompanies() {
  return loadDB().users.filter((u) => u.role === 'empresa_cliente')
}

export function getCompanyById(id) {
  return loadDB().users.find((u) => u.id === id && u.role === 'empresa_cliente')
}

export function updateCompany(id, updates) {
  const db = loadDB()
  const idx = db.users.findIndex((u) => u.id === id && u.role === 'empresa_cliente')
  if (idx === -1) return null
  db.users[idx] = { ...db.users[idx], ...updates }
  saveDB(db)
  return db.users[idx]
}

export function resetDB() {
  localStorage.removeItem(STORAGE_KEY)
  return loadDB()
}
