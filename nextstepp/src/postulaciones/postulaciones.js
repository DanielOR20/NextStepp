/**
 * Lógica e Interacción del Módulo de Postulaciones (JobConnect)
 */

import {
  getPostulaciones,
  createPostulacion,
  updatePostulacion,
  deletePostulacion
} from './services/postulaciones.service.js';

// Estado local en memoria
let postulaciones = [];

// Elementos del DOM
const postsGrid = document.getElementById('postsGrid');
const loadingState = document.getElementById('loadingState');
const searchInput = document.getElementById('searchInput');
const filterTag = document.getElementById('filterTag');
const btnRefresh = document.getElementById('btnRefresh');

// Stats DOM
const statTotal = document.getElementById('statTotal');
const statInterviewed = document.getElementById('statInterviewed');
const statReview = document.getElementById('statReview');

// Modales DOM
const createModal = document.getElementById('createModal');
const editModal = document.getElementById('editModal');
const btnOpenCreateModal = document.getElementById('btnOpenCreateModal');
const btnCloseCreateModal = document.getElementById('btnCloseCreateModal');
const btnCancelCreate = document.getElementById('btnCancelCreate');
const btnCloseEditModal = document.getElementById('btnCloseEditModal');
const btnCancelEdit = document.getElementById('btnCancelEdit');

// Formularios
const formCreate = document.getElementById('formCreate');
const formEdit = document.getElementById('formEdit');
const editPostId = document.getElementById('editPostId');
const editTitle = document.getElementById('editTitle');
const editBody = document.getElementById('editBody');

// Toast Container
const toastContainer = document.getElementById('toastContainer');

/* ========================================================
   1. VALIDACIÓN DE AUTENTICACIÓN (RF-02 / RF-03)
   ======================================================== */
function checkAuth() {
  const token = localStorage.getItem('authToken');
  if (!token) {
    // Si no hay token de autenticación, redirige al login según RF-02 / RF-03
    // Para facilitar pruebas en desarrollo si no hay token, podemos setear uno simulado o redirigir
    console.warn('No se detectó authToken en localStorage.');
    // Descomentar para redirección estricta:
    // window.location.href = '../login.html';
  }
}

/* ========================================================
   2. SISTEMA DE NOTIFICACIONES (TOASTS) (RF-09 / RNF-05)
   ======================================================== */
export function showToast(title, message, type = 'success') {
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  
  let iconSvg = '';
  if (type === 'success') {
    iconSvg = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
  } else if (type === 'error') {
    iconSvg = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>`;
  } else {
    iconSvg = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0ea5e9" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>`;
  }

  toast.innerHTML = `
    <div>${iconSvg}</div>
    <div class="toast-body">
      <div class="toast-title">${escapeHTML(title)}</div>
      <div class="toast-message">${escapeHTML(message)}</div>
    </div>
  `;

  toastContainer.appendChild(toast);

  // Animación de entrada
  setTimeout(() => toast.classList.add('show'), 10);

  // Auto-eliminar
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 350);
  }, 4000);
}

function escapeHTML(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/* ========================================================
   ADAPTADOR DE DATOS: ESPAÑOL Y DOMINIO DE EMPLEABILIDAD
   ======================================================== */
const PUESTOS_ES = [
  "Desarrollador Frontend Senior (React / Vue)",
  "Desarrollador Full Stack (Node.js & JavaScript)",
  "Ingeniero de Software Backend (Python / Django)",
  "Diseñador UI/UX & Diseñador de Producto",
  "Especialista en QA & Testing Automatizado",
  "DevOps Engineer & Cloud Architect (AWS/GCP)",
  "Líder Técnico de Desarrollo Web",
  "Desarrollador Mobile (Flutter / React Native)",
  "Analista de Datos & Business Intelligence",
  "Scrum Master & Coordinador Ágil de Proyectos"
];

const CARTAS_ES = [
  "Cuento con más de 5 años de experiencia liderando proyectos web de alto impacto, optimización de rendimiento y arquitecturas escalables.",
  "Especialista en el desarrollo de interfaces modernas, sistemas de diseño, accesibilidad web y consumo eficiente de APIs RESTful.",
  "Apasionado por las buenas prácticas de ingeniería, clean code, pruebas automatizadas y trabajo colaborativo en equipos multidisciplinarios.",
  "Amplia trayectoria en diseño de experiencia de usuario, flujos de interacción centrados en el usuario y prototipado de alta fidelidad.",
  "Experiencia comprobable en despliegue continuo, pipelines CI/CD, contenedorización con Docker y monitoreo en entornos de producción.",
  "Conocimientos avanzados en análisis de requerimientos, liderazgo técnico de squads ágiles y resolución de incidentes críticos."
];

const TAGS_MAP = {
  'history': ['Liderazgo', 'Gestión'],
  'american': ['Internacional', 'Inglés C1'],
  'crime': ['Ciberseguridad', 'Auditoría'],
  'french': ['Bilingüe', 'Remoto'],
  'fiction': ['Innovación', 'Creatividad'],
  'english': ['Inglés Avanzado', 'Global'],
  'magical': ['UI/UX', 'Figma'],
  'mystery': ['Resolución Problemas', 'Debug'],
  'love': ['Cultura', 'Teamwork'],
  'classic': ['Arquitectura', 'Patrones'],
  'general': ['JavaScript', 'HTML5', 'CSS3']
};

function adaptarPostulacionAEspanol(post) {
  // Si ya fue editado/creado en español, respetarlo
  const esOriginal = post.esModificado || false;
  if (esOriginal) return post;

  const idxPuesto = (post.id - 1) % PUESTOS_ES.length;
  const idxCarta = (post.id - 1) % CARTAS_ES.length;

  const tagsTraducidos = Array.isArray(post.tags) && post.tags.length > 0
    ? post.tags.flatMap(t => TAGS_MAP[t.toLowerCase()] || [t.charAt(0).toUpperCase() + t.slice(1)])
    : ['JavaScript', 'Frontend', 'Remoto'];

  return {
    ...post,
    title: PUESTOS_ES[idxPuesto],
    body: `${CARTAS_ES[idxCarta]} ${post.body ? `Nota adicional: ${post.body.slice(0, 80)}...` : ''}`,
    tags: tagsTraducidos.slice(0, 4)
  };
}

/* ========================================================
   3. CARGA Y RENDERIZADO DE POSTULACIONES (GET /posts)
   ======================================================== */
async function loadPostulaciones() {
  try {
    postsGrid.style.display = 'none';
    loadingState.style.display = 'flex';

    const data = await getPostulaciones(30, 0);
    // Adaptar posts al contexto de postulaciones en español
    postulaciones = (data.posts || []).map(adaptarPostulacionAEspanol);
    
    populateTagsFilter();
    updateDashboardStats();
    renderCards(postulaciones);
  } catch (error) {
    console.error('Error al cargar postulaciones:', error);
    showToast('Error de Conexión', error.message || 'No se pudieron cargar las postulaciones', 'error');
    postsGrid.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">⚠️</div>
        <h3>Ocurrió un error al consultar la API</h3>
        <p style="color: var(--text-muted); margin-top: 0.5rem;">${escapeHTML(error.message)}</p>
      </div>
    `;
    postsGrid.style.display = 'grid';
  } finally {
    loadingState.style.display = 'none';
  }
}

function updateDashboardStats() {
  statTotal.textContent = postulaciones.length;
  // Calculamos estados basados en IDs para visualización
  const interviewed = postulaciones.filter(p => p.id % 3 === 0).length;
  const inReview = postulaciones.filter(p => p.id % 3 === 1).length;
  
  statInterviewed.textContent = interviewed;
  statReview.textContent = inReview;
}

function populateTagsFilter() {
  const allTags = new Set();
  postulaciones.forEach(p => {
    if (Array.isArray(p.tags)) {
      p.tags.forEach(t => allTags.add(t));
    }
  });

  filterTag.innerHTML = `<option value="all">Todas las etiquetas</option>`;
  allTags.forEach(tag => {
    const opt = document.createElement('option');
    opt.value = tag;
    opt.textContent = tag.toUpperCase();
    filterTag.appendChild(opt);
  });
}

function renderCards(list) {
  postsGrid.innerHTML = '';

  if (!list || list.length === 0) {
    postsGrid.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">💼</div>
        <h3>No se encontraron postulaciones</h3>
        <p style="color: var(--text-muted); margin-top: 0.5rem;">Intenta con otro término de búsqueda o crea una nueva postulación.</p>
      </div>
    `;
    postsGrid.style.display = 'grid';
    return;
  }

  list.forEach(post => {
    const card = document.createElement('article');
    card.className = 'job-card';
    card.id = `post-card-${post.id}`;

    // Determinar badge de estado visual según ID para simular proceso de selección
    let badgeHtml = '';
    const statusMod = post.id % 3;
    if (statusMod === 0) {
      badgeHtml = `<span class="badge badge-interview">● Entrevista Agendada</span>`;
    } else if (statusMod === 1) {
      badgeHtml = `<span class="badge badge-review">● En Revisión</span>`;
    } else {
      badgeHtml = `<span class="badge badge-pending">● Pendiente</span>`;
    }

    // Tags
    const tagsHtml = (post.tags && Array.isArray(post.tags))
      ? post.tags.map(t => `<span class="tag">#${escapeHTML(t)}</span>`).join('')
      : '<span class="tag">#General</span>';

    // Iniciales Candidato
    const userInitials = `C${post.userId || '1'}`;

    card.innerHTML = `
      <div>
        <div class="card-header-top">
          <div class="candidate-profile">
            <div class="avatar">${userInitials}</div>
            <div>
              <div class="candidate-name">Candidato #${post.userId || '1'}</div>
              <div class="candidate-id">Postulación #${post.id}</div>
            </div>
          </div>
          <div class="card-actions">
            <button class="btn-icon btn-edit" data-id="${post.id}" title="Editar postulación (PATCH)">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
            </button>
            <button class="btn-icon btn-delete" data-id="${post.id}" title="Retirar postulación (DELETE)" style="color: #f87171;">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
            </button>
          </div>
        </div>

        <h3 class="job-title" title="${escapeHTML(post.title)}">${escapeHTML(post.title)}</h3>
        <p class="job-body">${escapeHTML(post.body)}</p>
        <div class="tag-list">${tagsHtml}</div>
      </div>

      <div class="card-footer-status">
        ${badgeHtml}
        <span style="font-size: 0.75rem; color: var(--text-dim);">Reacciones: ${post.reactions?.likes || post.views || 0}</span>
      </div>
    `;

    postsGrid.appendChild(card);
  });

  postsGrid.style.display = 'grid';

  // Vincular eventos de botones en cada tarjeta
  attachCardEvents();
}

/* ========================================================
   4. EVENTOS DE ACCIONES (EDITAR Y ELIMINAR)
   ======================================================== */
function attachCardEvents() {
  // Editar (PATCH)
  document.querySelectorAll('.btn-edit').forEach(btn => {
    btn.onclick = () => {
      const id = btn.getAttribute('data-id');
      const item = postulaciones.find(p => String(p.id) === String(id));
      if (item) {
        openEditModal(item);
      }
    };
  });

  // Eliminar (DELETE)
  document.querySelectorAll('.btn-delete').forEach(btn => {
    btn.onclick = async () => {
      const id = btn.getAttribute('data-id');
      await handleDelete(id);
    };
  });
}

/* ========================================================
   5. CREAR POSTULACIÓN - POST (/posts/add)
   ======================================================== */
formCreate.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const userId = document.getElementById('createUserId').value;
  const title = document.getElementById('createTitle').value;
  const body = document.getElementById('createBody').value;
  const tagsStr = document.getElementById('createTags').value;

  const tags = tagsStr
    ? tagsStr.split(',').map(t => t.trim()).filter(Boolean)
    : ['General', 'Empleo'];

  const submitBtn = document.getElementById('btnSubmitCreate');
  submitBtn.disabled = true;
  submitBtn.textContent = 'Enviando...';

  try {
    const newPost = await createPostulacion({ userId, title, body, tags });
    newPost.esModificado = true;
    
    // Agregamos a nuestro estado local y al DOM
    postulaciones.unshift(newPost);
    updateDashboardStats();
    renderCards(filterPosts());

    showToast('Postulación Exitosa', `Se registró la candidatura #${newPost.id} correctamente.`, 'success');
    closeCreateModal();
    formCreate.reset();
  } catch (error) {
    console.error('Error al registrar postulación:', error);
    showToast('Error al Postular', error.message, 'error');
  } finally {
    submitBtn.disabled = false;
    submitBtn.innerHTML = '<span>Enviar Postulación</span>';
  }
});

/* ========================================================
   6. EDITAR POSTULACIÓN - PATCH (/posts/{id})
   ======================================================== */
function openEditModal(post) {
  editPostId.value = post.id;
  editTitle.value = post.title;
  editBody.value = post.body;
  editModal.classList.add('active');
}

function closeEditModal() {
  editModal.classList.remove('active');
}

formEdit.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const id = editPostId.value;
  const title = editTitle.value;
  const body = editBody.value;

  const submitBtn = document.getElementById('btnSubmitEdit');
  submitBtn.disabled = true;
  submitBtn.textContent = 'Guardando cambios...';

  try {
    const updated = await updatePostulacion(id, { title, body });
    
    // Actualizar estado local
    const index = postulaciones.findIndex(p => String(p.id) === String(id));
    if (index !== -1) {
      postulaciones[index] = { ...postulaciones[index], ...updated, title, body, esModificado: true };
    }

    renderCards(filterPosts());
    showToast('Actualizado', `La postulación #${id} fue modificada exitosamente.`, 'success');
    closeEditModal();
  } catch (error) {
    console.error('Error al actualizar postulación:', error);
    showToast('Error en Actualización', error.message, 'error');
  } finally {
    submitBtn.disabled = false;
    submitBtn.innerHTML = '<span>Guardar Cambios (PATCH)</span>';
  }
});

/* ========================================================
   7. ELIMINAR POSTULACIÓN - DELETE (/posts/{id})
   ======================================================== */
async function handleDelete(id) {
  const confirmDelete = window.confirm(`¿Estás seguro de que deseas retirar la postulación #${id}?`);
  if (!confirmDelete) return;

  try {
    await deletePostulacion(id);
    
    // Remover del estado local
    postulaciones = postulaciones.filter(p => String(p.id) !== String(id));
    updateDashboardStats();
    
    // Remover tarjeta del DOM con animación
    const card = document.getElementById(`post-card-${id}`);
    if (card) {
      card.style.opacity = '0';
      card.style.transform = 'scale(0.9)';
      setTimeout(() => {
        card.remove();
        if (postulaciones.length === 0) {
          renderCards([]);
        }
      }, 250);
    }

    showToast('Postulación Retirada', `La postulación #${id} fue cancelada y eliminada.`, 'info');
  } catch (error) {
    console.error('Error al eliminar postulación:', error);
    showToast('Error al Eliminar', error.message, 'error');
  }
}

/* ========================================================
   8. BÚSQUEDA Y FILTRADO
   ======================================================== */
function filterPosts() {
  const query = searchInput.value.toLowerCase().trim();
  const tag = filterTag.value;

  return postulaciones.filter(post => {
    const matchQuery = 
      post.title?.toLowerCase().includes(query) ||
      post.body?.toLowerCase().includes(query) ||
      String(post.userId).includes(query) ||
      String(post.id).includes(query);

    const matchTag = (tag === 'all') || (Array.isArray(post.tags) && post.tags.includes(tag));

    return matchQuery && matchTag;
  });
}

searchInput.addEventListener('input', () => {
  renderCards(filterPosts());
});

filterTag.addEventListener('change', () => {
  renderCards(filterPosts());
});

btnRefresh.addEventListener('click', () => {
  loadPostulaciones();
});

/* ========================================================
   9. GESTIÓN DE MODALES
   ======================================================== */
function openCreateModal() {
  createModal.classList.add('active');
}
function closeCreateModal() {
  createModal.classList.remove('active');
}

btnOpenCreateModal.addEventListener('click', openCreateModal);
btnCloseCreateModal.addEventListener('click', closeCreateModal);
btnCancelCreate.addEventListener('click', closeCreateModal);

btnCloseEditModal.addEventListener('click', closeEditModal);
btnCancelEdit.addEventListener('click', closeEditModal);

// Cerrar al clickear fuera del contenido
window.addEventListener('click', (e) => {
  if (e.target === createModal) closeCreateModal();
  if (e.target === editModal) closeEditModal();
});

/* ========================================================
   INICIALIZACIÓN
   ======================================================== */
document.addEventListener('DOMContentLoaded', () => {
  checkAuth();
  loadPostulaciones();
});
