import '../style.css'
import { icons } from '../icons.js'
import { renderTopPanel, setupTopPanel, renderLoginModal, setupLoginModal, renderFooter } from '../sidebar.js'

const topPanelContainer = document.getElementById('topPanelContainer')
topPanelContainer.innerHTML = renderTopPanel('inicio') + renderLoginModal()

const app = document.getElementById('app')
app.innerHTML = `
  <section class="hero-section">
    <div class="hero-badge">
      <span class="dot"></span>
      Plataforma de empleabilidad inteligente
    </div>
    <h1 class="hero-title">
      Da tu <span class="gradient-text">próximo paso</span> hacia la carrera de tus sueños
    </h1>
    <p class="hero-subtitle">
      Conectamos talento con las mejores oportunidades laborales. IA potenciada para encontrar el empleo perfecto según tu perfil profesional.
    </p>
    <div class="hero-actions">
      <a href="empleos.html" class="btn btn-primary btn-lg">
        ${icons.briefcase} Explorar Empleos
      </a>
    </div>
    <div class="hero-stats">
      <div class="stat-item">
        <div class="stat-number">2,500+</div>
        <div class="stat-label">Ofertas Activas</div>
      </div>
      <div class="stat-item">
        <div class="stat-number">18,000+</div>
        <div class="stat-label">Profesionales</div>
      </div>
      <div class="stat-item">
        <div class="stat-number">850+</div>
        <div class="stat-label">Empresas</div>
      </div>
      <div class="stat-item">
        <div class="stat-number">94%</div>
        <div class="stat-label">Satisfacción</div>
      </div>
    </div>
  </section>

  ${renderFooter()}
`

setupTopPanel()
setupLoginModal()
