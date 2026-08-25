/**
 * Controlador del Sistema de Gestión de Postulaciones (JobConnect / AZDigital Style)
 */

import {
  getPostulaciones,
  createPostulacion,
  updatePostulacion,
  deletePostulacion
} from './services/postulaciones.service.js';

// Estado de la aplicación
let postulaciones = [];
let currentPage = 1;
const pageSize = 10;

// Elementos del DOM
const postsTableBody = document.getElementById('postsTableBody');
const loadingState = document.getElementById('loadingState');
const tableContainer = document.getElementById('tableContainer');
const searchInput = document.getElementById('searchInput');
const filterState = document.getElementById('filterState');
const filterPanel = document.getElementById('filterPanel');

// Paginación DOM
const lblTotalRegistros = document.getElementById('lblTotalRegistros');
const lblTotalPages = document.getElementById('lblTotalPages');
const inputCurrentPage = document.getElementById('inputCurrentPage');
const footerStatusText = document.getElementById('footerStatusText');
const btnFirstPage = document.getElementById('btnFirstPage');
const btnPrevPage = document.getElementById('btnPrevPage');
const btnNextPage = document.getElementById('btnNextPage');
const btnLastPage = document.getElementById('btnLastPage');

// Botones Barra Superior
const btnOpenNewModal = document.getElementById('btnOpenNewModal');
const btnToggleFilter = document.getElementById('btnToggleFilter');
const btnShowAll = document.getElementById('btnShowAll');
const btnApplyFilter = document.getElementById('btnApplyFilter');
const btnResetFilter = document.getElementById('btnResetFilter');
const checkAllPosts = document.getElementById('checkAllPosts');
const bulkAction = document.getElementById('bulkAction');
const btnExecAction = document.getElementById('btnExecAction');

// Modales
const createModal = document.getElementById('createModal');
const editModal = document.getElementById('editModal');
const formCreate = document.getElementById('formCreate');
const formEdit = document.getElementById('formEdit');
const btnCloseCreateModal = document.getElementById('btnCloseCreateModal');
const btnCancelCreate = document.getElementById('btnCancelCreate');
const btnCloseEditModal = document.getElementById('btnCloseEditModal');
const btnCancelEdit = document.getElementById('btnCancelEdit');

// Campos Edit
const editPostId = document.getElementById('editPostId');
const editTitle = document.getElementById('editTitle');
const editBody = document.getElementById('editBody');

// Toast Container
const toastContainer = document.getElementById('toastContainer');

/* ========================================================
   1. SISTEMA DE TOASTS
   ======================================================== */
export function showToast(title, message, type = 'success') {
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  
  let icon = type === 'success' ? '✅' : (type === 'error' ? '❌' : 'ℹ️');

  toast.innerHTML = `
    <div style="font-size: 16px;">${icon}</div>
    <div style="flex: 1;">
      <div style="font-weight: 700; font-size: 12px;">${escapeHTML(title)}</div>
      <div style="font-size: 11px; color: #555;">${escapeHTML(message)}</div>
    </div>
  `;

  toastContainer.appendChild(toast);
  setTimeout(() => toast.classList.add('show'), 10);
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
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
   2. ADAPTADOR DE DATOS DE POSTULACIONES EN ESPAÑOL
   ======================================================== */
const PUESTOS_ES = [
  "Desarrollador Frontend Senior (React / TypeScript)",
  "Ingeniero de Software Full Stack (Node.js)",
  "Especialista en QA & Testing Automatizado",
  "Diseñador UI/UX & Producto Digital",
  "DevOps Engineer & Arquitecto Cloud (AWS)",
  "Desarrollador Mobile (Flutter / Android)",
  "Analista de Ciberseguridad & Auditoría",
  "Líder Técnico de Arquitectura de Software",
  "Administrador de Bases de Datos (PostgreSQL)",
  "Scrum Master & Coordinador de Equipos Ágiles"
];

const CARTAS_ES = [
  "Más de 5 años de experiencia liderando proyectos web, optimización continua y arquitecturas limpias.",
  "Especialista en desarrollo frontend, componentes reutilizables, consumo de APIs y accesibilidad.",
  "Amplia trayectoria en diseño de producto, pruebas continuas, CI/CD y despliegues productivos.",
  "Conocimiento sólido en bases de datos relacionales, backend escalable y seguridad informática."
];

function adaptarPostulacionAEspanol(post) {
  if (post.esModificado) return post;

  const idxP = (post.id - 1) % PUESTOS_ES.length;
  const idxC = (post.id - 1) % CARTAS_ES.length;

  return {
    ...post,
    title: PUESTOS_ES[idxP],
    body: `${CARTAS_ES[idxC]} ${post.body ? `(Detalle: ${post.body.slice(0, 50)}...)` : ''}`,
    tags: Array.isArray(post.tags) && post.tags.length > 0 ? post.tags.slice(0, 3) : ['Selección', 'Talento']
  };
}

/* ========================================================
   3. CARGA Y RENDERIZADO DE LA TABLA (GET /posts)
   ======================================================== */
async function loadPostulaciones() {
  try {
    tableContainer.style.display = 'none';
    loadingState.style.display = 'flex';

    const data = await getPostulaciones(30, 0);
    postulaciones = (data.posts || []).map(adaptarPostulacionAEspanol);
    
    currentPage = 1;
    renderTable();
  } catch (error) {
    console.error('Error al consultar postulaciones:', error);
    showToast('Error de Conexión', error.message || 'No se pudieron consultar los registros', 'error');
  } finally {
    loadingState.style.display = 'none';
    tableContainer.style.display = 'block';
  }
}

function getFilteredList() {
  const query = searchInput.value.toLowerCase().trim();
  const state = filterState.value;

  return postulaciones.filter(post => {
    const matchQuery = 
      post.title?.toLowerCase().includes(query) ||
      post.body?.toLowerCase().includes(query) ||
      String(post.userId).includes(query) ||
      String(post.id).includes(query) ||
      (Array.isArray(post.tags) && post.tags.some(t => t.toLowerCase().includes(query)));

    let matchState = true;
    const statusMod = post.id % 3;
    if (state === 'entrevista') matchState = (statusMod === 0);
    if (state === 'revision') matchState = (statusMod === 1);
    if (state === 'pendiente') matchState = (statusMod === 2);

    return matchQuery && matchState;
  });
}

function renderTable() {
  const filtered = getFilteredList();
  const total = filtered.length;
  const totalPages = Math.ceil(total / pageSize) || 1;

  if (currentPage > totalPages) currentPage = totalPages;
  if (currentPage < 1) currentPage = 1;

  // Actualizar indicadores de paginación
  lblTotalRegistros.innerHTML = `No. Registros: <strong>${total}</strong>`;
  lblTotalPages.textContent = totalPages;
  inputCurrentPage.value = currentPage;

  const startIdx = (currentPage - 1) * pageSize;
  const endIdx = Math.min(startIdx + pageSize, total);
  const pageItems = filtered.slice(startIdx, endIdx);

  footerStatusText.textContent = total > 0 
    ? `Mostrando registros ${startIdx + 1} al ${endIdx} de ${total}`
    : 'No hay registros que coincidan con el filtro.';

  postsTableBody.innerHTML = '';

  if (pageItems.length === 0) {
    postsTableBody.innerHTML = `
      <tr>
        <td colspan="9" style="text-align:center; padding: 25px; color: #777;">
          No se encontraron registros de postulaciones en el sistema.
        </td>
      </tr>
    `;
    return;
  }

  pageItems.forEach(post => {
    const row = document.createElement('tr');
    row.id = `row-post-${post.id}`;

    // Estado institucional
    let badgeHtml = '';
    const statusMod = post.id % 3;
    if (statusMod === 0) {
      badgeHtml = `<span class="grid-badge badge-entrevista">Entrevista</span>`;
    } else if (statusMod === 1) {
      badgeHtml = `<span class="grid-badge badge-revision">En Revisión</span>`;
    } else {
      badgeHtml = `<span class="grid-badge badge-pendiente">Pendiente</span>`;
    }

    const tagsHtml = (post.tags && Array.isArray(post.tags))
      ? post.tags.map(t => `<span class="pill-tag">${escapeHTML(t)}</span>`).join('')
      : '<span class="pill-tag">General</span>';

    const candidateName = post.candidateName || `Candidato #${post.userId || '1'}`;

    row.innerHTML = `
      <td style="white-space: nowrap;">
        <button class="btn-grid-edit btn-edit-row" data-id="${post.id}" title="Editar postulación">
          📝 Editar
        </button>
        <button class="btn-grid-delete btn-del-row" data-id="${post.id}" title="Eliminar registro">
          ✕
        </button>
      </td>
      <td style="text-align: center;">
        <input type="checkbox" class="post-row-check" value="${post.id}">
      </td>
      <td style="font-weight: 700; color: #104e8b;">${post.id}</td>
      <td style="font-weight: 600;">${post.userId || 1}</td>
      <td style="font-weight: 700; color: #1a365d;">
        <div>${escapeHTML(post.title)}</div>
        <div style="font-size: 11px; color: #666; font-weight: 400;">👤 ${escapeHTML(candidateName)}</div>
      </td>
      <td style="color: #333; max-width: 320px;">
        <div style="display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;" title="${escapeHTML(post.body)}">
          ${escapeHTML(post.body)}
        </div>
      </td>
      <td>${tagsHtml}</td>
      <td>${badgeHtml}</td>
      <td style="text-align: center; font-weight: 600; color: #104e8b;">
        ⭐ ${post.reactions?.likes || post.views || 90}%
      </td>
    `;

    postsTableBody.appendChild(row);
  });

  attachTableEvents();
}

function attachTableEvents() {
  document.querySelectorAll('.btn-edit-row').forEach(btn => {
    btn.onclick = () => {
      const id = btn.getAttribute('data-id');
      const item = postulaciones.find(p => String(p.id) === String(id));
      if (item) openEditModal(item);
    };
  });

  document.querySelectorAll('.btn-del-row').forEach(btn => {
    btn.onclick = async () => {
      const id = btn.getAttribute('data-id');
      await handleDelete(id);
    };
  });
}

/* ========================================================
   4. EVENTOS DE PAGINACIÓN
   ======================================================== */
btnFirstPage.addEventListener('click', () => {
  currentPage = 1;
  renderTable();
});

btnPrevPage.addEventListener('click', () => {
  if (currentPage > 1) {
    currentPage--;
    renderTable();
  }
});

btnNextPage.addEventListener('click', () => {
  const filtered = getFilteredList();
  const totalPages = Math.ceil(filtered.length / pageSize) || 1;
  if (currentPage < totalPages) {
    currentPage++;
    renderTable();
  }
});

btnLastPage.addEventListener('click', () => {
  const filtered = getFilteredList();
  currentPage = Math.ceil(filtered.length / pageSize) || 1;
  renderTable();
});

/* ========================================================
   5. BÚSQUEDA Y FILTRADO
   ======================================================== */
btnToggleFilter.addEventListener('click', () => {
  filterPanel.classList.toggle('active');
});

btnApplyFilter.addEventListener('click', () => {
  currentPage = 1;
  renderTable();
});

searchInput.addEventListener('keyup', (e) => {
  if (e.key === 'Enter') {
    currentPage = 1;
    renderTable();
  }
});

filterState.addEventListener('change', () => {
  currentPage = 1;
  renderTable();
});

btnResetFilter.addEventListener('click', () => {
  searchInput.value = '';
  filterState.value = 'all';
  currentPage = 1;
  renderTable();
});

btnShowAll.addEventListener('click', () => {
  searchInput.value = '';
  filterState.value = 'all';
  currentPage = 1;
  renderTable();
});

/* ========================================================
   6. CHECKBOX Y ACCIONES MASIVAS
   ======================================================== */
checkAllPosts.addEventListener('change', () => {
  const isChecked = checkAllPosts.checked;
  document.querySelectorAll('.post-row-check').forEach(cb => {
    cb.checked = isChecked;
  });
});

btnExecAction.addEventListener('click', () => {
  const selected = Array.from(document.querySelectorAll('.post-row-check:checked')).map(cb => cb.value);
  const action = bulkAction.value;

  if (selected.length === 0) {
    showToast('Atención', 'Selecciona al menos un registro en la tabla con la casilla de verificación.', 'info');
    return;
  }

  if (!action) {
    showToast('Atención', 'Selecciona una acción a ejecutar.', 'info');
    return;
  }

  if (action === 'eliminar') {
    if (confirm(`¿Deseas retirar las ${selected.length} postulaciones seleccionadas?`)) {
      postulaciones = postulaciones.filter(p => !selected.includes(String(p.id)));
      renderTable();
      showToast('Acción Completada', `Se eliminaron ${selected.length} registros del sistema.`, 'success');
    }
  } else {
    showToast('Acción Masiva', `Se actualizó el estado de ${selected.length} postulaciones correctamente.`, 'success');
  }
});

/* ========================================================
   7. CREAR NUEVA POSTULACIÓN - POST (/posts/add)
   ======================================================== */
function openCreateModal() {
  createModal.classList.add('active');
}
function closeCreateModal() {
  createModal.classList.remove('active');
}

btnOpenNewModal.addEventListener('click', openCreateModal);
btnCloseCreateModal.addEventListener('click', closeCreateModal);
btnCancelCreate.addEventListener('click', closeCreateModal);

formCreate.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const userId = document.getElementById('createUserId').value;
  const candidateName = document.getElementById('createCandidateName').value || `Candidato #${userId}`;
  const title = document.getElementById('createTitle').value;
  const tagsStr = document.getElementById('createTags').value;
  const body = document.getElementById('createBody').value;

  const tags = tagsStr ? tagsStr.split(',').map(t => t.trim()).filter(Boolean) : ['Nuevo', 'Selección'];

  const submitBtn = document.getElementById('btnSubmitCreate');
  submitBtn.disabled = true;
  submitBtn.textContent = 'Guardando...';

  try {
    const newPost = await createPostulacion({ userId, title, body, tags });
    newPost.candidateName = candidateName;
    newPost.esModificado = true;

    postulaciones.unshift(newPost);
    currentPage = 1;
    renderTable();

    showToast('Registro Exitoso', `La postulación #${newPost.id} ha sido almacenada en el sistema.`, 'success');
    closeCreateModal();
    formCreate.reset();
  } catch (error) {
    showToast('Error al Registrar', error.message, 'error');
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = 'Guardar y Registrar (POST)';
  }
});

/* ========================================================
   8. EDITAR REGISTRO - PATCH (/posts/{id})
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

  const submitBtn = document.getElementById('btnSubmitEdit');
  submitBtn.disabled = true;
  submitBtn.textContent = 'Guardando...';

  try {
    const updated = await updatePostulacion(id, { title, body });
    const index = postulaciones.findIndex(p => String(p.id) === String(id));
    if (index !== -1) {
      postulaciones[index] = { ...postulaciones[index], ...updated, title, body, esModificado: true };
    }

    renderTable();
    showToast('Registro Modificado', `Los datos de la postulación #${id} fueron actualizados (PATCH).`, 'success');
    closeEditModal();
  } catch (error) {
    showToast('Error al Modificar', error.message, 'error');
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = 'Guardar Cambios (PATCH)';
  }
});

/* ========================================================
   9. ELIMINAR REGISTRO - DELETE (/posts/{id})
   ======================================================== */
async function handleDelete(id) {
  if (!confirm(`¿Confirmas que deseas retirar el registro de postulación #${id}?`)) return;

  try {
    await deletePostulacion(id);
    postulaciones = postulaciones.filter(p => String(p.id) !== String(id));
    renderTable();
    showToast('Registro Retirado', `La postulación #${id} fue eliminada del sistema.`, 'info');
  } catch (error) {
    showToast('Error al Eliminar', error.message, 'error');
  }
}

/* ========================================================
   10. EXPORTACIÓN SIMULADA
   ======================================================== */
document.getElementById('exportThisPage')?.addEventListener('click', (e) => {
  e.preventDefault();
  showToast('Exportación', 'Generando archivo con los registros de la página actual...', 'info');
});
document.getElementById('exportAll')?.addEventListener('click', (e) => {
  e.preventDefault();
  showToast('Exportación', `Exportando los ${postulaciones.length} registros totales...`, 'info');
});

// Cerrar modales al pulsar fuera
window.addEventListener('click', (e) => {
  if (e.target === createModal) closeCreateModal();
  if (e.target === editModal) closeEditModal();
});

document.addEventListener('DOMContentLoaded', () => {
  loadPostulaciones();
});
