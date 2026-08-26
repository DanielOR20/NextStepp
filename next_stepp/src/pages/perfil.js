import '../styles/base.css'
import { icons } from '../icons.js'
import { renderTopPanel, setupTopPanel, renderFooter } from '../sidebar.js'

const topPanelContainer = document.getElementById('topPanelContainer')
topPanelContainer.innerHTML = renderTopPanel('perfil')

const app = document.getElementById('app')
app.innerHTML = `
  <section class="profile-section" style="padding-top: 80px;">
    <div class="profile-card">
      <form class="profile-form" id="profileForm" onsubmit="return false;">
        <div class="form-row">
          <div class="form-group">
            <label>Nombre Completo *</label>
            <input class="form-input" type="text" id="pfName" placeholder="Juan Pérez" />
          </div>
          <div class="form-group">
            <label>Correo Electrónico *</label>
            <input class="form-input" type="email" id="pfEmail" placeholder="juan@email.com" />
          </div>
        </div>
        <div class="form-group">
          <label>Profesión / Cargo *</label>
          <input class="form-input" type="text" id="pfProfession" placeholder="Desarrollador Full Stack" />
        </div>
        <div class="form-row">
          <div class="form-group">
            <label>Experiencia *</label>
            <select class="form-input form-select" id="pfExperience">
              <option value="">Seleccionar...</option>
              <option>0-1 años</option>
              <option>1-3 años</option>
              <option>3-5 años</option>
              <option>5-10 años</option>
              <option>10+ años</option>
            </select>
          </div>
          <div class="form-group">
            <label>Ubicación *</label>
            <input class="form-input" type="text" id="pfLocation" placeholder="Ciudad de México" />
          </div>
        </div>
        <div class="form-group">
          <label>Habilidades Principales *</label>
          <input class="form-input" type="text" id="pfSkills" placeholder="React, Node.js, Python, SQL..." />
        </div>
        <div class="form-group">
          <label>Subir CV (PDF) *</label>
          <div class="file-upload-area" id="fileUploadArea">
            <div class="upload-icon">📄</div>
            <p>Arrastra tu CV aquí o haz clic para seleccionar</p>
            <div class="upload-hint">Formatos aceptados: PDF (Max. 5MB)</div>
            <div class="file-name" id="fileName"></div>
          </div>
          <input type="file" id="cvFile" accept=".pdf" style="display:none;" />
        </div>
        <div id="profileSuccess"></div>
        <div class="profile-buttons">
          <button class="btn btn-primary btn-lg" type="button" id="registerBtn">
            Registrar Perfil
          </button>
          <button class="btn btn-outline btn-lg" type="button" id="uploadBtn">
            Subir Perfil
          </button>
        </div>
      </form>
    </div>
  </section>

  <section class="section">
    <div class="section-header">
      <div class="overline">Generador de CV</div>
      <h2>Crea tu CV Profesional con IA</h2>
      <p>Genera un CV completo y descárgalo en PDF con un solo clic.</p>
    </div>
    <div style="text-align:center;">
      <button class="btn btn-primary btn-lg" id="openCvGenerator">
        ${icons.doc} Generar Mi CV
      </button>
    </div>
  </section>

  <!-- CV GENERATOR MODAL -->
  <div class="cv-modal-overlay" id="cvModal">
    <div class="cv-modal">
      <button class="cv-modal-close" id="closeCvModal">&times;</button>
      <h2>Generar CV Profesional</h2>
      <p class="subtitle">Completa los datos y descarga tu CV en PDF</p>

      <form id="cvForm" onsubmit="return false;">
        <div class="cv-section-title">Información Personal</div>
        <div class="form-row">
          <div class="form-group">
            <label>Nombre Completo</label>
            <input class="form-input" type="text" id="cvName" placeholder="Juan Pérez" />
          </div>
          <div class="form-group">
            <label>Correo Electrónico</label>
            <input class="form-input" type="email" id="cvEmail" placeholder="juan@email.com" />
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label>Teléfono</label>
            <input class="form-input" type="tel" id="cvPhone" placeholder="+52 55 1234 5678" />
          </div>
          <div class="form-group">
            <label>Ubicación</label>
            <input class="form-input" type="text" id="cvLocation" placeholder="Ciudad de México" />
          </div>
        </div>
        <div class="form-group">
          <label>LinkedIn / Portafolio</label>
          <input class="form-input" type="url" id="cvLinkedin" placeholder="https://linkedin.com/in/tu-perfil" />
        </div>
        <div class="form-group">
          <label>Perfil Profesional</label>
          <textarea class="form-input" id="cvSummary" rows="3" placeholder="Breve descripción de tu experiencia y objetivos profesionales..." style="resize:vertical;"></textarea>
        </div>

        <div class="cv-section-title">Experiencia Laboral</div>
        <div id="experienceList"></div>
        <button type="button" class="cv-add-btn" id="addExperience">+ Agregar Experiencia</button>

        <div class="cv-section-title">Educación</div>
        <div id="educationList"></div>
        <button type="button" class="cv-add-btn" id="addEducation">+ Agregar Educación</button>

        <div class="cv-section-title">Habilidades</div>
        <div class="form-group">
          <label>Habilidades (separadas por coma)</label>
          <input class="form-input" type="text" id="cvSkills" placeholder="JavaScript, React, Node.js, Python, SQL..." />
        </div>

        <div class="cv-section-title">Idiomas</div>
        <div class="form-group">
          <label>Idiomas (separados por coma)</label>
          <input class="form-input" type="text" id="cvLanguages" placeholder="Español (Nativo), Inglés (Avanzado)..." />
        </div>

        <div class="cv-modal-actions">
          <button class="btn btn-ghost btn-lg" type="button" id="cancelCv">Cancelar</button>
          <button class="btn btn-primary btn-lg" type="button" id="downloadCv">
            ${icons.doc} Descargar PDF
          </button>
        </div>
      </form>
    </div>
  </div>

  ${renderFooter()}
`

// ========== PROFILE FORM LOGIC ==========
const fileUploadArea = document.getElementById('fileUploadArea')
const cvFileInput = document.getElementById('cvFile')
const fileNameDisplay = document.getElementById('fileName')
const profileSuccess = document.getElementById('profileSuccess')
let uploadedFile = null

fileUploadArea.addEventListener('click', () => cvFileInput.click())

fileUploadArea.addEventListener('dragover', (e) => {
  e.preventDefault()
  fileUploadArea.classList.add('dragover')
})

fileUploadArea.addEventListener('dragleave', () => {
  fileUploadArea.classList.remove('dragover')
})

fileUploadArea.addEventListener('drop', (e) => {
  e.preventDefault()
  fileUploadArea.classList.remove('dragover')
  const file = e.dataTransfer.files[0]
  if (file && file.type === 'application/pdf') {
    handleFileUpload(file)
  }
})

cvFileInput.addEventListener('change', (e) => {
  const file = e.target.files[0]
  if (file) handleFileUpload(file)
})

function handleFileUpload(file) {
  if (file.size > 5 * 1024 * 1024) {
    alert('El archivo excede el tamaño máximo de 5MB')
    return
  }
  uploadedFile = file
  fileNameDisplay.textContent = `${file.name} (${(file.size / 1024).toFixed(1)} KB)`
  fileUploadArea.classList.add('has-file')
}

function validateProfile() {
  const name = document.getElementById('pfName').value.trim()
  const email = document.getElementById('pfEmail').value.trim()
  const profession = document.getElementById('pfProfession').value.trim()
  const experience = document.getElementById('pfExperience').value
  const location = document.getElementById('pfLocation').value.trim()
  const skills = document.getElementById('pfSkills').value.trim()

  if (!name || !email || !profession || !experience || !location || !skills) {
    return { valid: false, missing: 'Por favor completa todos los campos obligatorios (*)' }
  }
  if (!uploadedFile) {
    return { valid: false, missing: 'Por favor sube tu CV en formato PDF' }
  }
  return { valid: true }
}

function showSuccess(message) {
  profileSuccess.innerHTML = `<div class="success-message">✅ ${message}</div>`
  setTimeout(() => { profileSuccess.innerHTML = '' }, 4000)
}

document.getElementById('registerBtn').addEventListener('click', () => {
  const result = validateProfile()
  if (!result.valid) {
    profileSuccess.innerHTML = `<div class="success-message" style="background:rgba(239,68,68,0.1);border-color:rgba(239,68,68,0.3);color:#ef4444;">⚠️ ${result.missing}</div>`
    return
  }
  showSuccess('¡Perfil registrado con éxito!')
})

document.getElementById('uploadBtn').addEventListener('click', () => {
  const result = validateProfile()
  if (!result.valid) {
    profileSuccess.innerHTML = `<div class="success-message" style="background:rgba(239,68,68,0.1);border-color:rgba(239,68,68,0.3);color:#ef4444;">⚠️ ${result.missing}</div>`
    return
  }
  showSuccess('¡Perfil subido con éxito!')
})

// ========== CV GENERATOR MODAL ==========
const cvModal = document.getElementById('cvModal')
const experienceList = document.getElementById('experienceList')
const educationList = document.getElementById('educationList')
let expCount = 0
let eduCount = 0

document.getElementById('openCvGenerator').addEventListener('click', () => {
  cvModal.classList.add('open')
  document.body.style.overflow = 'hidden'
  prefillCvForm()
})

function closeCvModal() {
  cvModal.classList.remove('open')
  document.body.style.overflow = ''
}

document.getElementById('closeCvModal').addEventListener('click', closeCvModal)
document.getElementById('cancelCv').addEventListener('click', closeCvModal)
cvModal.addEventListener('click', (e) => { if (e.target === cvModal) closeCvModal() })

function prefillCvForm() {
  const name = document.getElementById('pfName').value.trim()
  const email = document.getElementById('pfEmail').value.trim()
  const profession = document.getElementById('pfProfession').value.trim()
  const location = document.getElementById('pfLocation').value.trim()
  const skills = document.getElementById('pfSkills').value.trim()

  if (name) document.getElementById('cvName').value = name
  if (email) document.getElementById('cvEmail').value = email
  if (profession) document.getElementById('cvSummary').value = profession
  if (location) document.getElementById('cvLocation').value = location
  if (skills) document.getElementById('cvSkills').value = skills
}

function addExperience() {
  expCount++
  const div = document.createElement('div')
  div.className = 'cv-experience-item'
  div.id = `exp-${expCount}`
  div.innerHTML = `
    <div class="form-row">
      <div class="form-group">
        <label>Cargo</label>
        <input class="form-input exp-title" type="text" placeholder="Desarrollador Full Stack" />
      </div>
      <div class="form-group">
        <label>Empresa</label>
        <input class="form-input exp-company" type="text" placeholder="TechCorp" />
      </div>
    </div>
    <div class="form-row">
      <div class="form-group">
        <label>Inicio</label>
        <input class="form-input exp-start" type="text" placeholder="Ene 2022" />
      </div>
      <div class="form-group">
        <label>Fin</label>
        <input class="form-input exp-end" type="text" placeholder="Presente" />
      </div>
    </div>
    <div class="form-group">
      <label>Descripción</label>
      <textarea class="form-input exp-desc" rows="2" placeholder="Logros y responsabilidades..." style="resize:vertical;"></textarea>
    </div>
    <button type="button" class="cv-remove-btn" onclick="document.getElementById('exp-${expCount}').remove()">✕</button>
  `
  experienceList.appendChild(div)
}

function addEducation() {
  eduCount++
  const div = document.createElement('div')
  div.className = 'cv-education-item'
  div.id = `edu-${eduCount}`
  div.innerHTML = `
    <div class="form-row">
      <div class="form-group">
        <label>Título</label>
        <input class="form-input edu-degree" type="text" placeholder="Ingeniería en Sistemas" />
      </div>
      <div class="form-group">
        <label>Institución</label>
        <input class="form-input edu-school" type="text" placeholder="Universidad Nacional" />
      </div>
    </div>
    <div class="form-row">
      <div class="form-group">
        <label>Año de Inicio</label>
        <input class="form-input edu-start" type="text" placeholder="2018" />
      </div>
      <div class="form-group">
        <label>Año de Fin</label>
        <input class="form-input edu-end" type="text" placeholder="2022" />
      </div>
    </div>
    <button type="button" class="cv-remove-btn" onclick="document.getElementById('edu-${eduCount}').remove()">✕</button>
  `
  educationList.appendChild(div)
}

document.getElementById('addExperience').addEventListener('click', addExperience)
document.getElementById('addEducation').addEventListener('click', addEducation)

// Add one of each by default
addExperience()
addEducation()

// ========== PDF GENERATION ==========
document.getElementById('downloadCv').addEventListener('click', () => {
  const name = document.getElementById('cvName').value.trim() || 'Sin nombre'
  const email = document.getElementById('cvEmail').value.trim()
  const phone = document.getElementById('cvPhone').value.trim()
  const location = document.getElementById('cvLocation').value.trim()
  const linkedin = document.getElementById('cvLinkedin').value.trim()
  const summary = document.getElementById('cvSummary').value.trim()
  const skills = document.getElementById('cvSkills').value.trim()
  const languages = document.getElementById('cvLanguages').value.trim()

  const experiences = []
  experienceList.querySelectorAll('.cv-experience-item').forEach(item => {
    experiences.push({
      title: item.querySelector('.exp-title')?.value || '',
      company: item.querySelector('.exp-company')?.value || '',
      start: item.querySelector('.exp-start')?.value || '',
      end: item.querySelector('.exp-end')?.value || '',
      desc: item.querySelector('.exp-desc')?.value || '',
    })
  })

  const educations = []
  educationList.querySelectorAll('.cv-education-item').forEach(item => {
    educations.push({
      degree: item.querySelector('.edu-degree')?.value || '',
      school: item.querySelector('.edu-school')?.value || '',
      start: item.querySelector('.edu-start')?.value || '',
      end: item.querySelector('.edu-end')?.value || '',
    })
  })

  generatePDF({ name, email, phone, location, linkedin, summary, skills, languages, experiences, educations })
})

function generatePDF(data) {
  const pdfContent = `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Segoe UI', Arial, sans-serif; color: #333; padding: 40px; line-height: 1.5; }
  .header { text-align: center; margin-bottom: 30px; border-bottom: 3px solid #6366f1; padding-bottom: 20px; }
  .header h1 { font-size: 28px; color: #1a1a2e; margin-bottom: 5px; }
  .header .contact { font-size: 13px; color: #555; }
  .header .contact span { margin: 0 8px; }
  .section { margin-bottom: 24px; }
  .section-title { font-size: 14px; font-weight: 700; text-transform: uppercase; letter-spacing: 2px; color: #6366f1; border-bottom: 1px solid #ddd; padding-bottom: 6px; margin-bottom: 12px; }
  .summary { font-size: 13px; color: #444; }
  .item { margin-bottom: 14px; }
  .item-header { display: flex; justify-content: space-between; align-items: baseline; }
  .item-title { font-size: 15px; font-weight: 700; color: #1a1a2e; }
  .item-date { font-size: 12px; color: #888; }
  .item-subtitle { font-size: 13px; color: #6366f1; font-weight: 500; }
  .item-desc { font-size: 12px; color: #555; margin-top: 4px; }
  .skills-list { display: flex; flex-wrap: wrap; gap: 6px; }
  .skill-tag { background: #eef2ff; color: #6366f1; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 500; }
  .lang-list { font-size: 13px; color: #444; }
</style>
</head>
<body>
  <div class="header">
    <h1>${data.name}</h1>
    <div class="contact">
      ${data.email ? `<span>📧 ${data.email}</span>` : ''}
      ${data.phone ? `<span>📱 ${data.phone}</span>` : ''}
      ${data.location ? `<span>📍 ${data.location}</span>` : ''}
    </div>
    ${data.linkedin ? `<div class="contact" style="margin-top:4px;"><span>🔗 ${data.linkedin}</span></div>` : ''}
  </div>

  ${data.summary ? `
  <div class="section">
    <div class="section-title">Perfil Profesional</div>
    <div class="summary">${data.summary}</div>
  </div>` : ''}

  ${data.experiences.some(e => e.title || e.company) ? `
  <div class="section">
    <div class="section-title">Experiencia Laboral</div>
    ${data.experiences.filter(e => e.title || e.company).map(e => `
    <div class="item">
      <div class="item-header">
        <div class="item-title">${e.title || 'Sin título'}</div>
        <div class="item-date">${e.start}${e.end ? ' - ' + e.end : ''}</div>
      </div>
      <div class="item-subtitle">${e.company || ''}</div>
      ${e.desc ? `<div class="item-desc">${e.desc}</div>` : ''}
    </div>`).join('')}
  </div>` : ''}

  ${data.educations.some(e => e.degree || e.school) ? `
  <div class="section">
    <div class="section-title">Educación</div>
    ${data.educations.filter(e => e.degree || e.school).map(e => `
    <div class="item">
      <div class="item-header">
        <div class="item-title">${e.degree || 'Sin título'}</div>
        <div class="item-date">${e.start}${e.end ? ' - ' + e.end : ''}</div>
      </div>
      <div class="item-subtitle">${e.school || ''}</div>
    </div>`).join('')}
  </div>` : ''}

  ${data.skills ? `
  <div class="section">
    <div class="section-title">Habilidades</div>
    <div class="skills-list">
      ${data.skills.split(',').map(s => `<span class="skill-tag">${s.trim()}</span>`).join('')}
    </div>
  </div>` : ''}

  ${data.languages ? `
  <div class="section">
    <div class="section-title">Idiomas</div>
    <div class="lang-list">${data.languages}</div>
  </div>` : ''}
</body>
</html>
  `.trim()

  const blob = new Blob([pdfContent], { type: 'text/html' })
  const url = URL.createObjectURL(blob)
  const printWindow = window.open(url, '_blank')
  printWindow.onload = () => {
    printWindow.print()
    printWindow.onafterprint = () => URL.revokeObjectURL(url)
  }
}

setupTopPanel()
