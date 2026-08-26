import { addUser, getUsers } from '../../services/store.service.js'
import { navigate } from '../../router/router.js'

export function renderRegister() {
  const app = document.getElementById('app')

  app.innerHTML = `
    <div class="auth-page">
      <div class="auth-bg-ornaments">
        <div class="auth-orb auth-orb-1"></div>
        <div class="auth-orb auth-orb-2"></div>
      </div>
      <div class="auth-container">
        <div class="auth-card">
          <div class="auth-header">
            <a href="#/" class="auth-logo">
              <span class="logo-icon">NS</span>
              NextStepp
            </a>
            <h1>Registrar Empresa</h1>
            <p>Crea tu cuenta para publicar vacantes</p>
          </div>
          <form class="auth-form" id="registerForm">
            <div class="form-group">
              <label for="regName">Nombre del Contacto *</label>
              <input class="form-input" type="text" id="regName" placeholder="Tu nombre completo" required />
            </div>
            <div class="form-group">
              <label for="regEmail">Email *</label>
              <input class="form-input" type="email" id="regEmail" placeholder="tu@email.com" required />
            </div>
            <div class="form-group">
              <label for="regPassword">Contraseña *</label>
              <input class="form-input" type="password" id="regPassword" placeholder="••••••••" required />
            </div>
            <div class="form-group">
              <label for="regCompanyName">Nombre de la Empresa *</label>
              <input class="form-input" type="text" id="regCompanyName" placeholder="Ej: TechNova Solutions" required />
            </div>
            <div class="form-group">
              <label for="regLegalName">Razón Social *</label>
              <input class="form-input" type="text" id="regLegalName" placeholder="Ej: TechNova Solutions S.A. de C.V." required />
            </div>
            <div class="form-row">
              <div class="form-group">
                <label for="regTaxId">RFC *</label>
                <input class="form-input" type="text" id="regTaxId" placeholder="RFC-TN202501ABC" required />
              </div>
              <div class="form-group">
                <label for="regPhone">Teléfono *</label>
                <input class="form-input" type="text" id="regPhone" placeholder="+52 55 1234 5678" required />
              </div>
            </div>
            <div class="form-group">
              <label for="regAddress">Dirección *</label>
              <input class="form-input" type="text" id="regAddress" placeholder="Av. Insurgentes Sur 1234, CDMX" required />
            </div>
            <div class="form-group">
              <label for="regRepresentative">Representante *</label>
              <input class="form-input" type="text" id="regRepresentative" placeholder="Ing. Juan Pérez, Director General" required />
            </div>
            <div class="form-group">
              <label for="regWebsite">Sitio Web</label>
              <input class="form-input" type="url" id="regWebsite" placeholder="https://tusitio.com" />
            </div>
            <button class="btn btn-primary btn-lg auth-submit" type="submit" id="regSubmit">
              Registrar Empresa
            </button>
            <div class="auth-error" id="regError"></div>
            <p class="auth-link">¿Ya tienes cuenta? <a href="#/login">Iniciar Sesión</a></p>
          </form>
        </div>
      </div>
    </div>
  `

  const form = document.getElementById('registerForm')
  const submitBtn = document.getElementById('regSubmit')
  const errorEl = document.getElementById('regError')

  form.addEventListener('submit', (e) => {
    e.preventDefault()

    const fields = {
      name: document.getElementById('regName').value.trim(),
      email: document.getElementById('regEmail').value.trim(),
      password: document.getElementById('regPassword').value.trim(),
      companyName: document.getElementById('regCompanyName').value.trim(),
      legalName: document.getElementById('regLegalName').value.trim(),
      taxId: document.getElementById('regTaxId').value.trim(),
      phone: document.getElementById('regPhone').value.trim(),
      address: document.getElementById('regAddress').value.trim(),
      representative: document.getElementById('regRepresentative').value.trim(),
      website: document.getElementById('regWebsite').value.trim(),
    }

    if (!fields.email || !fields.password || !fields.name || !fields.companyName || !fields.legalName || !fields.taxId || !fields.phone || !fields.address || !fields.representative) {
      errorEl.textContent = 'Completa todos los campos obligatorios'
      errorEl.classList.add('visible')
      return
    }

    const existing = getUsers().find((u) => u.email === fields.email)
    if (existing) {
      errorEl.textContent = 'Este email ya está registrado'
      errorEl.classList.add('visible')
      return
    }

    submitBtn.textContent = 'Registrando...'
    submitBtn.disabled = true
    errorEl.classList.remove('visible')

    setTimeout(() => {
      addUser({
        ...fields,
        role: 'empresa_cliente',
        companyStatus: 'pending',
      })

      submitBtn.textContent = '¡Empresa registrada!'
      submitBtn.classList.add('success')

      setTimeout(() => {
        navigate('/login')
      }, 1200)
    }, 800)
  })
}
