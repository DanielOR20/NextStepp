import seedData from '../data/db.json'

const STORAGE_KEY = 'jobconnect_db'
const VERSION_KEY = 'jobconnect_db_version'

function loadDB() {
  const stored = localStorage.getItem(STORAGE_KEY)
  const storedVersion = localStorage.getItem(VERSION_KEY)
  if (stored && storedVersion === String(seedData.version)) return JSON.parse(stored)
  const fresh = structuredClone(seedData)
  saveDB(fresh)
  localStorage.setItem(VERSION_KEY, String(seedData.version))
  return fresh
}

function saveDB(db) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(db))
}

export function getDB() {
  return loadDB()
}

export function resetDB() {
  localStorage.removeItem(STORAGE_KEY)
  localStorage.removeItem(VERSION_KEY)
  return loadDB()
}

// ─── Users ──────────────────────────────────────

export function getUsers() {
  return loadDB().users
}

export function getUserById(id) {
  return loadDB().users.find((u) => u.id === id)
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

// ─── Companies ──────────────────────────────────

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

// ─── Vacancies ──────────────────────────────────

export function getVacancies() {
  return loadDB().vacancies
}

export function getVacancyById(id) {
  return loadDB().vacancies.find((v) => v.id === id)
}

export function getVacanciesByCompany(companyId) {
  return loadDB().vacancies.filter((v) => v.companyId === companyId)
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

// ─── Landing Data ───────────────────────────────

export function getJobOffers() {
  return loadDB().jobOffers
}

export function getRatings() {
  return loadDB().ratings
}

export function getSuggestedTags() {
  return loadDB().suggestedTags
}

export function getAiResponses() {
  return loadDB().aiResponses
}

export function getHeroStats() {
  return loadDB().heroStats
}
