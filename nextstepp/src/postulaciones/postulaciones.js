/**
 * Lógica del Módulo de Registro de Postulaciones (JobConnect)
 */

import {
  getPostulaciones,
  createPostulacion,
  updatePostulacion,
  deletePostulacion
} from './services/postulaciones.service.js';

// Estado local
let postulaciones = [];

// Elementos DOM
const postsGrid = document.getElementById('postsGrid');
const loadingState = document.getElementById('loadingState');
const searchInput = document.getElementById('searchInput');
const btnRefresh = document.getElementById('btnRefresh');

// Formulario de Registro
const formCreate = document.getElementById('formCreate');
const createUserId = document.getElementById('createUserId');
const createCandidateName = document.getElementById('createCandidateName');
const createTitle = document.getElementById('createTitle');
const createTags = document.getElementById('createTags');
const createBody = document.getElementById('createBody');
const btnSubmitCreate = document.getElementById('btnSubmitCreate');

// Modal de Edición
const editModal = document.getElementById('editModal');
const formEdit = document.getElementById('formEdit');
const editPostId = document.getElementById('editPostId');
const editTitle = document.getElementById('editTitle');
const editBody = document.getElementById('editBody');
const btnCloseEditModal = document.getElementById('btnCloseEditModal');
const btnCancelEdit = document.getElementById('btnCancelEdit');

// Toast Container
const toastContainer = document.getElementById('toastContainer');

/* ========================================================
   1. VALIDACIÓN DE AUTENTICACIÓN
   ======================================================== */
function checkAuth() {
  const token = localStorage.getItem('authToken');
  if (!token) {
    console.warn('Sesión no detectada, operando en modo formulario público.');
  }
}

/* ========================================================
   2. SISTEMA DE TOASTS
   ======================================================== */
export function showToast(title, message, type = 'success') {
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  
  let iconSvg = '';
  if (type === 'success') {
    iconSvg = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
  } else if (type === 'error') {
    iconSvg = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>`;
  } else {
    iconSvg = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0ea5e9" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>`;
  }

  toast.innerHTML = `
    <div>${iconSvg}</div>
    <div style="flex: 1;">
      <div style="font-weight: 700; font-size: 0.85rem;">${escapeHTML(title)}</div>
      <div style="font-size: 0.75rem; color: var(--text-muted);">${escapeHTML(message)}</div>
    </div>
  `;

  toastContainer.appendChild(toast);
  setTimeout(() => toast.classList.add('show'), 10);
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
   ADAPTADOR DE DATOS EN ESPAÑOL
   ======================================================== */
const PUESTOS_ES = [
  "Desarrollador Frontend Senior (React / Vue)",
  "Desarrollador Full Stack (Node.js & JavaScript)",
  "Ingeniero de Software Backend (Python / Django)",
  "Diseñador UI/UX & Diseñador de Producto",
  "Especialista en QA & Testing Automatizado",
  "DevOps Engineer & Cloud Architect (AWS/GCP)",
  "Líder Técnico de Desarrollo Web",
  "Desarrollador Mobile (Flutter / React Native)"
];

const CARTAS_ES = [
  "Cuento con más de 5 años de experiencia liderando proyectos web de alto impacto y optimización de rendimiento.",
  "Especialista en interfaces modernas, accesibilidad web y consumo de APIs RESTful.",
  "Apasionado por clean code, pruebas automatizadas y trabajo colaborativo multidisciplinario.",
  "Amplia trayectoria en diseño de experiencia de usuario y prototipado de alta fidelidad.",
  "Experiencia comprobable en despliegue continuo, pipelines CI/CD y contenedorización con Docker."
];

function adaptarPostulacionAEspanol(post) {
  if (post.esModificado) return post;

  const idxPuesto = (post.id - 1) % PUESTOS_ES.length;
  const idxCarta = (post.id - 1) % CARTAS_ES.length;

  return {
    ...post,
    title: PUESTOS_ES[idxPuesto],
    body: `${CARTAS_ES[idxCarta]} ${post.body ? `(Nota: ${post.body.slice(0, 60)}...)` : ''}`,
    tags: Array.isArray(post.tags) && post.tags.length > 0 ? post.tags.slice(0, 3) : ['JavaScript', 'Frontend']
  };
}

/* ========================================================
   3. CARGA Y RENDERIZADO (GET /posts)
   ======================================================== */
async function loadPostulaciones() {
  try {
    postsGrid.style.display = 'none';
    loadingState.style.display = 'flex';

    const data = await getPostulaciones(20, 0);
    postulaciones = (data.posts || []).map(adaptarPostulacionAEspanol);
    renderCards(postulaciones);
  } catch (error) {
    console.error('Error al cargar postulaciones:', error);
    showToast('Error de Conexión', error.message || 'No se pudieron cargar los registros', 'error');
  } finally {
    loadingState.style.display = 'none';
  }
}

function renderCards(list) {
  postsGrid.innerHTML = '';

  if (!list || list.length === 0) {
    postsGrid.innerHTML = `
      <div style="text-align: center; padding: 2rem; color: var(--text-muted);">
        <p>No se encontraron postulaciones registradas.</p>
      </div>
    `;
    postsGrid.style.display = 'flex';
    return;
  }

  list.forEach(post => {
    const card = document.createElement('article');
    card.className = 'job-card';
    card.id = `post-card-${post.id}`;

    let badgeHtml = '';
    const statusMod = post.id % 3;
    if (statusMod === 0) {
      badgeHtml = `<span class="badge badge-interview">● Entrevista</span>`;
    } else if (statusMod === 1) {
      badgeHtml = `<span class="badge badge-review">● En Revisión</span>`;
    } else {
      badgeHtml = `<span class="badge badge-pending">● Pendiente</span>`;
    }

    const tagsHtml = (post.tags && Array.isArray(post.tags))
      ? post.tags.map(t => `<span class="tag">#${escapeHTML(t)}</span>`).join('')
      : '<span class="tag">#Empleo</span>';

    card.innerHTML = `
      <div class="card-header-top">
        <div class="candidate-profile">
          <div class="avatar">C${post.userId || '1'}</div>
          <div>
            <div class="candidate-name">${escapeHTML(post.candidateName || `Candidato #${post.userId || '1'}`)}</div>
            <div class="candidate-id">Postulación #${post.id}</div>
          </div>
        </div>
        <div class="card-actions">
          <button class="btn-icon btn-edit" data-id="${post.id}" title="Editar (PATCH)">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
          </button>
          <button class="btn-icon btn-delete" data-id="${post.id}" title="Retirar (DELETE)" style="color: #f87171;">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
          </button>
        </div>
      </div>

      <h3 class="job-title">${escapeHTML(post.title)}</h3>
      <p class="job-body">${escapeHTML(post.body)}</p>
      <div class="tag-list">${tagsHtml}</div>

      <div class="card-footer-status">
        ${badgeHtml}
        <span style="font-size: 0.7rem; color: var(--text-dim);">ID Vacante: ${post.id}</span>
      </div>
    `;

    postsGrid.appendChild(card);
  });

  postsGrid.style.display = 'flex';
  attachCardEvents();
}

function attachCardEvents() {
  document.querySelectorAll('.btn-edit').forEach(btn => {
    btn.onclick = () => {
      const id = btn.getAttribute('data-id');
      const item = postulaciones.find(p => String(p.id) === String(id));
      if (item) openEditModal(item);
    };
  });

  document.querySelectorAll('.btn-delete').forEach(btn => {
    btn.onclick = async () => {
      const id = btn.getAttribute('data-id');
      await handleDelete(id);
    };
  });
}

/* ========================================================
   4. ENVIAR REGISTRO DE POSTULACIÓN - POST (/posts/add)
   ======================================================== */
formCreate.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const userId = createUserId.value;
  const candidateName = createCandidateName.value || `Candidato #${userId}`;
  const title = createTitle.value;
  const body = createBody.value;
  const tagsStr = createTags.value;

  const tags = tagsStr
    ? tagsStr.split(',').map(t => t.trim()).filter(Boolean)
    : ['General', 'Empleo'];

  btnSubmitCreate.disabled = true;
  btnSubmitCreate.innerHTML = `<span>Registrando postulación...</span>`;

  try {
    const newPost = await createPostulacion({ userId, title, body, tags });
    newPost.candidateName = candidateName;
    newPost.esModificado = true;

    postulaciones.unshift(newPost);
    renderCards(filterPosts());

    showToast('¡Registro Exitoso!', `Tu postulación para "${title}" ha sido registrada con el ID #${newPost.id}.`, 'success');
    
    // Limpiar campos formulario
    createTitle.value = '';
    createTags.value = '';
    createBody.value = '';
  } catch (error) {
    console.error('Error al registrar postulación:', error);
    showToast('Error al Registrar', error.message, 'error');
  } finally {
    btnSubmitCreate.disabled = false;
    btnSubmitCreate.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
      <span>Enviar Registro de Postulación</span>
    `;
  }
});

/* ========================================================
   5. EDITAR REGISTRO (PATCH)
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

btnCloseEditModal.addEventListener('click', closeEditModal);
btnCancelEdit.addEventListener('click', closeEditModal);

formEdit.addEventListener('submit', async (e) => {
  e.preventDefault();
  const id = editPostId.value;
  const title = editTitle.value;
  const body = editBody.value;

  try {
    const updated = await updatePostulacion(id, { title, body });
    const index = postulaciones.findIndex(p => String(p.id) === String(id));
    if (index !== -1) {
      postulaciones[index] = { ...postulaciones[index], ...updated, title, body, esModificado: true };
    }

    renderCards(filterPosts());
    showToast('Registro Actualizado', `La postulación #${id} fue modificada correctamente.`, 'success');
    closeEditModal();
  } catch (error) {
    showToast('Error al Actualizar', error.message, 'error');
  }
});

/* ========================================================
   6. CANCELAR / ELIMINAR (DELETE)
   ======================================================== */
async function handleDelete(id) {
  if (!confirm(`¿Deseas retirar tu postulación #${id}?`)) return;

  try {
    await deletePostulacion(id);
    postulaciones = postulaciones.filter(p => String(p.id) !== String(id));
    renderCards(filterPosts());
    showToast('Postulación Retirada', `El registro #${id} ha sido eliminado del sistema.`, 'info');
  } catch (error) {
    showToast('Error al Retirar', error.message, 'error');
  }
}

/* ========================================================
   7. BÚSQUEDA Y FILTRADO
   ======================================================== */
function filterPosts() {
  const query = searchInput.value.toLowerCase().trim();
  return postulaciones.filter(p => 
    p.title?.toLowerCase().includes(query) ||
    p.body?.toLowerCase().includes(query) ||
    p.candidateName?.toLowerCase().includes(query) ||
    String(p.userId).includes(query)
  );
}

searchInput.addEventListener('input', () => renderCards(filterPosts()));
btnRefresh.addEventListener('click', loadPostulaciones);

// Cerrar modal al hacer click fuera
window.addEventListener('click', (e) => {
  if (e.target === editModal) closeEditModal();
});

document.addEventListener('DOMContentLoaded', () => {
  checkAuth();
  loadPostulaciones();
});
