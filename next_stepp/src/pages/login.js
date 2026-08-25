import { login } from '../auth.js'
import { navigate } from '../router.js'

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

          <!-- Helper Box con Credenciales de Prueba -->
          <div class="auth-demo-box">
            <div class="auth-demo-title">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
              <span>Cuentas de Prueba (Clic para auto-completar):</span>
            </div>
            <div class="auth-demo-chips">
              <button type="button" class="demo-chip" data-email="admin@nextstepp.com" data-pass="123456" data-role="admin">
                <span class="chip-dot admin"></span>
                <strong>Admin:</strong> admin@nextstepp.com
              </button>
              <button type="button" class="demo-chip" data-email="empresa@nextstepp.com" data-pass="123456" data-role="empresa_cliente">
                <span class="chip-dot empresa"></span>
                <strong>Empresa:</strong> empresa@nextstepp.com
              </button>
              <button type="button" class="demo-chip" data-email="usuario@nextstepp.com" data-pass="123456" data-role="postulante">
                <span class="chip-dot usuario"></span>
                <strong>Postulante:</strong> usuario@nextstepp.com
              </button>
            </div>
            <div class="auth-demo-sub">Contraseña para todas: <code style="color:var(--accent-light); font-weight:700;">123456</code></div>
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

  // Auto-completar al presionar los chips de demo
  document.querySelectorAll('.demo-chip').forEach((chip) => {
    chip.addEventListener('click', () => {
      emailInput.value = chip.dataset.email
      passwordInput.value = chip.dataset.pass
      errorEl.classList.remove('visible')
      
      // Resaltar formulario
      emailInput.focus()
      chip.classList.add('active')
      setTimeout(() => chip.classList.remove('active'), 500)
    })
  })

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
        } else if (result.user.role === 'empresa_cliente') {
          navigate('/empresa/dashboard')
        } else {
          navigate('/postulaciones')
        }
      }, 700)
    }, 600)
  })
}
