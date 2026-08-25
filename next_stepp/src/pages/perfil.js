import '../style.css'
import { icons } from '../icons.js'
import { renderTopPanel, setupTopPanel, renderLoginModal, setupLoginModal, renderFooter } from '../sidebar.js'

const topPanelContainer = document.getElementById('topPanelContainer')
topPanelContainer.innerHTML = renderTopPanel('perfil') + renderLoginModal()

const app = document.getElementById('app')
app.innerHTML = `
  <section class="profile-section" style="padding-top: 80px;">
    <div class="profile-card">
      <div class="profile-info">
        <div class="overline" style="font-size:0.8rem;font-weight:700;text-transform:uppercase;letter-spacing:2px;color:var(--accent-light);margin-bottom:0.75rem;">Tu Perfil Profesional</div>
        <h2>Crea tu perfil y recibe ofertas personalizadas</h2>
        <p>Regístrate con tu información profesional y nuestra inteligencia artificial encontrará las mejores oportunidades laborales adaptadas a tu experiencia, habilidades y preferencias.</p>
        <div style="display:flex;gap:1rem;flex-wrap:wrap;">
          <div style="background:var(--glass);border:1px solid var(--glass-border);border-radius:var(--radius-sm);padding:12px 16px;text-align:center;">
            <div style="font-size:1.5rem;font-weight:800;color:var(--accent-light);">92%</div>
            <div style="font-size:0.75rem;color:var(--text-muted);">Match Promedio</div>
          </div>
          <div style="background:var(--glass);border:1px solid var(--glass-border);border-radius:var(--radius-sm);padding:12px 16px;text-align:center;">
            <div style="font-size:1.5rem;font-weight:800;color:var(--success);">3.2x</div>
            <div style="font-size:0.75rem;color:var(--text-muted);">Más Ofertas</div>
          </div>
          <div style="background:var(--glass);border:1px solid var(--glass-border);border-radius:var(--radius-sm);padding:12px 16px;text-align:center;">
            <div style="font-size:1.5rem;font-weight:800;color:var(--warning);">48h</div>
            <div style="font-size:0.75rem;color:var(--text-muted);">Tiempo Promedio</div>
          </div>
        </div>
      </div>
      <form class="profile-form" id="profileForm" onsubmit="return false;">
        <div class="form-row">
          <div class="form-group">
            <label>Nombre Completo</label>
            <input class="form-input" type="text" placeholder="Juan Pérez" />
          </div>
          <div class="form-group">
            <label>Correo Electrónico</label>
            <input class="form-input" type="email" placeholder="juan@email.com" />
          </div>
        </div>
        <div class="form-group">
          <label>Profesión / Cargo</label>
          <input class="form-input" type="text" placeholder="Desarrollador Full Stack" />
        </div>
        <div class="form-row">
          <div class="form-group">
            <label>Experiencia</label>
            <select class="form-input form-select">
              <option value="">Seleccionar...</option>
              <option>0-1 años</option>
              <option>1-3 años</option>
              <option>3-5 años</option>
              <option>5-10 años</option>
              <option>10+ años</option>
            </select>
          </div>
          <div class="form-group">
            <label>Ubicación</label>
            <input class="form-input" type="text" placeholder="Ciudad de México" />
          </div>
        </div>
        <div class="form-group">
          <label>Habilidades Principales</label>
          <input class="form-input" type="text" placeholder="React, Node.js, Python, SQL..." />
        </div>
        <button class="btn btn-primary btn-lg" type="submit" style="width:100%;" id="profileSubmit">
          ${icons.briefcase} Crear Perfil y Recibir Ofertas
        </button>
      </form>
    </div>
  </section>

  <section class="cv-banner">
    <div class="cv-banner-inner">
      <h2>Genera tu CV Profesional con IA</h2>
      <p>Nuestra inteligencia artificial analizará tu perfil y creará un CV que destaque ante los reclutadores.</p>
      <a href="empleos.html" class="btn btn-lg">
        ${icons.briefcase} Explorar Empleos
      </a>
    </div>
  </section>

  ${renderFooter()}
`

const profileSubmit = document.getElementById('profileSubmit')
profileSubmit.addEventListener('click', () => {
  profileSubmit.textContent = 'Perfil creado exitosamente!'
  profileSubmit.style.background = 'linear-gradient(135deg, #10b981, #06b6d4)'
  setTimeout(() => {
    profileSubmit.textContent = `${icons.briefcase} Crear Perfil y Recibir Ofertas`
    profileSubmit.style.background = ''
  }, 2000)
})

setupTopPanel()
setupLoginModal()
