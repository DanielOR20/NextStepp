import { login } from '../../services/auth.service.js'
import { navigate } from '../../router/router.js'

export function renderLogin() {
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
            <h1>Iniciar Sesión</h1>
            <p>Accede a tu cuenta para gestionar oportunidades laborales</p>
          </div>
          <form class="auth-form" id="authForm">
            <div class="form-group">
              <label for="authEmail">Usuario / Email</label>
              <input
                class="form-input"
                type="text"
                id="authEmail"
                placeholder="tu@email.com"
                required
                autocomplete="username"
              />
            </div>
            <div class="form-group">
              <label for="authPassword">Contraseña</label>
              <input
                class="form-input"
                type="password"
                id="authPassword"
                placeholder="••••••••"
                required
                autocomplete="current-password"
              />
            </div>
            <div class="auth-options">
              <label class="modal-checkbox">
                <input type="checkbox" checked /> Recordarme
              </label>
              <a href="#" class="modal-link">¿Olvidaste tu contraseña?</a>
            </div>
            <button class="btn btn-primary btn-lg auth-submit" type="submit" id="authSubmit">
              Iniciar Sesión
            </button>
            <div class="auth-error" id="authError"></div>
            <p class="auth-link">¿No tienes cuenta? <a href="#/register">Registrar Empresa</a></p>
          </form>
        </div>
      </div>
    </div>
  `

  const form = document.getElementById('authForm')
  const emailInput = document.getElementById('authEmail')
  const passwordInput = document.getElementById('authPassword')
  const submitBtn = document.getElementById('authSubmit')
  const errorEl = document.getElementById('authError')

  form.addEventListener('submit', (e) => {
    e.preventDefault()
    const email = emailInput.value.trim()
    const password = passwordInput.value.trim()

    if (!email || !password) {
      errorEl.textContent = 'Completa todos los campos'
      errorEl.classList.add('visible')
      return
    }

    submitBtn.textContent = 'Verificando...'
    submitBtn.disabled = true
    errorEl.classList.remove('visible')

    setTimeout(() => {
      const result = login(email, password)

      if (!result.success) {
        errorEl.textContent = result.error
        errorEl.classList.add('visible')
        submitBtn.textContent = 'Iniciar Sesión'
        submitBtn.disabled = false
        return
      }

      submitBtn.textContent = '¡Bienvenido!'
      submitBtn.classList.add('success')

      setTimeout(() => {
        if (result.user.role === 'admin') {
          navigate('/admin/dashboard')
        } else {
          navigate('/empresa/dashboard')
        }
      }, 800)
    }, 800)
  })
}
