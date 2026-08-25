import '../style.css'
import { icons } from '../icons.js'
import { renderTopPanel, setupTopPanel, renderLoginModal, setupLoginModal, renderFooter } from '../sidebar.js'

const topPanelContainer = document.getElementById('topPanelContainer')
topPanelContainer.innerHTML = renderTopPanel('ia') + renderLoginModal()

const app = document.getElementById('app')
app.innerHTML = `
  <section class="ai-chat-section" id="ia" style="padding-top: 80px;">
    <div class="section-header">
      <div class="overline">Asistente IA</div>
      <h2>Consulta con nuestro asistente inteligente</h2>
      <p>Pregunta sobre empleos, mejora tu CV o recibe orientación profesional. Potenciado por Groq AI.</p>
    </div>
    <div class="ai-chat-container">
      <div class="ai-chat-header">
        <div class="ai-avatar">${icons.ai}</div>
        <div>
          <h3>NextStepp AI</h3>
          <p>Asistente de empleabilidad</p>
        </div>
        <div class="ai-status">
          <span class="dot"></span>
          En línea
        </div>
      </div>
      <div class="ai-chat-body" id="chatBody">
        <div class="ai-message bot">
          <div class="ai-message-avatar">${icons.ai}</div>
          <div class="ai-message-bubble">
            ¡Hola! Soy el asistente de NextStepp. Puedo ayudarte a encontrar empleos, mejorar tu CV o responder preguntas sobre oportunidades laborales. ¿En qué puedo ayudarte hoy?
          </div>
        </div>
      </div>
      <div class="ai-chat-input">
        <input type="text" id="chatInput" placeholder="Escribe tu pregunta sobre empleos..." />
        <button id="chatSend">${icons.send} Enviar</button>
      </div>
    </div>
  </section>

  ${renderFooter()}
`

const chatInput = document.getElementById('chatInput')
const chatSend = document.getElementById('chatSend')
const chatBody = document.getElementById('chatBody')

const aiResponses = [
  'Basándome en tu perfil, te recomiendo explorar las ofertas de desarrollo full stack. Hay una alta demanda en este sector.',
  'Para mejorar tu CV, asegúrate de destacar logros cuantificables en cada posición. Por ejemplo: "Incrementé la eficiencia en un 40%".',
  'Las habilidades más solicitadas actualmente son: React, Python, Cloud Computing y Machine Learning. Te sugiero enfocarte en al menos dos de ellas.',
  'El mercado laboral tech está muy activo. El tiempo promedio de contratación para perfiles senior es de 2-3 semanas.',
  'Te recomiendo crear un portafolio en línea que muestre tus proyectos. Los reclutadores valoran mucho ver ejemplos de trabajo prácticos.',
  'Las empresas buscan cada vez más perfiles híbridos. Combinar habilidades técnicas con soft skills como liderazgo y comunicación es clave.',
]

let responseIndex = 0

function addMessage(text, type) {
  const msgDiv = document.createElement('div')
  msgDiv.className = `ai-message ${type}`
  const avatar = type === 'bot' ? icons.ai : '👤'
  msgDiv.innerHTML = `
    <div class="ai-message-avatar">${avatar}</div>
    <div class="ai-message-bubble">${text}</div>
  `
  chatBody.appendChild(msgDiv)
  chatBody.scrollTop = chatBody.scrollHeight
}

function sendMessage() {
  const text = chatInput.value.trim()
  if (!text) return
  addMessage(text, 'user')
  chatInput.value = ''

  setTimeout(() => {
    addMessage(aiResponses[responseIndex % aiResponses.length], 'bot')
    responseIndex++
  }, 800)
}

chatSend.addEventListener('click', sendMessage)
chatInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') sendMessage()
})

setupTopPanel()
setupLoginModal()
