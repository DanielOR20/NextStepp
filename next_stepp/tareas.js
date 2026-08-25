/**
 * NEXTSTEPP - Lógica del Tablero Kanban de Tareas del Reclutador
 * Vanilla JS con Drag & Drop API y Persistencia en localStorage
 */

const STORAGE_KEY = 'nextstepp_recruiter_tasks';

// Tareas iniciales de demostración si localStorage está vacío
const INITIAL_TASKS = [
  {
    id: 'task-101',
    title: 'Entrevista técnica con candidato Frontend Senior',
    assignee: 'María García / TechNova Solutions',
    priority: 'alta',
    dueDate: '2026-09-01',
    status: 'pendiente'
  },
  {
    id: 'task-102',
    title: 'Validar referencias laborales y antecedentes',
    assignee: 'Carlos Hernández / DataMind Analytics',
    priority: 'media',
    dueDate: '2026-09-05',
    status: 'pendiente'
  },
  {
    id: 'task-103',
    title: 'Revisión de CV y portafolio UX/UI en Figma',
    assignee: 'Ana López / CreativeHub Digital',
    priority: 'alta',
    dueDate: '2026-08-30',
    status: 'en_revision'
  },
  {
    id: 'task-104',
    title: 'Confirmar oferta económica y carta de oferta',
    assignee: 'Roberto Martínez / CloudScale Inc.',
    priority: 'media',
    dueDate: '2026-08-28',
    status: 'en_revision'
  },
  {
    id: 'task-105',
    title: 'Envío de paquete de bienvenida (Onboarding)',
    assignee: 'Laura Sánchez / InnovateTech',
    priority: 'baja',
    dueDate: '2026-08-20',
    status: 'completado'
  }
];

// Estado local de tareas
let tasks = [];
let draggedTaskId = null;

/* ========================================================
   1. PERSISTENCIA EN LOCALSTORAGE
   ======================================================== */
function loadTasks() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      tasks = JSON.parse(saved);
    } catch (e) {
      console.error('Error al parsear tareas de localStorage:', e);
      tasks = [...INITIAL_TASKS];
    }
  } else {
    tasks = [...INITIAL_TASKS];
    saveTasks();
  }
}

function saveTasks() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

/* ========================================================
   2. RENDERIZADO DEL TABLERO KANBAN
   ======================================================== */
function renderKanban() {
  const columns = {
    pendiente: document.getElementById('list-pendiente'),
    en_revision: document.getElementById('list-en_revision'),
    completado: document.getElementById('list-completado')
  };

  const counters = {
    pendiente: document.getElementById('count-pendiente'),
    en_revision: document.getElementById('count-en_revision'),
    completado: document.getElementById('count-completado')
  };

  // Limpiar columnas
  Object.keys(columns).forEach(status => {
    if (columns[status]) columns[status].innerHTML = '';
  });

  // Agrupar tareas por estado
  const counts = { pendiente: 0, en_revision: 0, completado: 0 };

  tasks.forEach(task => {
    const col = columns[task.status];
    if (col) {
      counts[task.status]++;
      col.appendChild(createTaskCardElement(task));
    }
  });

  // Actualizar contadores
  Object.keys(counters).forEach(status => {
    if (counters[status]) {
      counters[status].textContent = counts[status];
    }
  });

  // Mostrar placeholder si la columna está vacía
  Object.keys(columns).forEach(status => {
    const col = columns[status];
    if (col && counts[status] === 0) {
      col.innerHTML = `
        <div class="column-empty">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="9" y1="9" x2="15" y2="15"></line>
            <line x1="15" y1="9" x2="9" y2="15"></line>
          </svg>
          <span>No hay tareas en esta etapa</span>
        </div>
      `;
    }
  });
}

function createTaskCardElement(task) {
  const card = document.createElement('article');
  card.className = 'task-card';
  card.id = `card-${task.id}`;
  card.setAttribute('draggable', 'true');
  card.dataset.id = task.id;

  const priorityLabels = {
    alta: '🔴 Alta',
    media: '🟡 Media',
    baja: '🟢 Baja'
  };

  const isOverdue = new Date(task.dueDate) < new Date() && task.status !== 'completado';

  card.innerHTML = `
    <div class="task-card-header">
      <h4 class="task-title">${escapeHTML(task.title)}</h4>
      <button class="btn-delete-task" data-id="${task.id}" title="Eliminar tarea">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="3 6 5 6 21 6"></polyline>
          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
        </svg>
      </button>
    </div>

    <div class="task-assignee">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
        <circle cx="12" cy="7" r="4"></circle>
      </svg>
      <span>${escapeHTML(task.assignee)}</span>
    </div>

    <div class="task-footer">
      <span class="priority-badge priority-${task.priority}">
        ${priorityLabels[task.priority] || '🟡 Media'}
      </span>
      <span class="task-due ${isOverdue ? 'due-soon' : ''}">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
          <line x1="16" y1="2" x2="16" y2="6"></line>
          <line x1="8" y1="2" x2="8" y2="6"></line>
          <line x1="3" y1="10" x2="21" y2="10"></line>
        </svg>
        ${formatDate(task.dueDate)}
      </span>
    </div>
  `;

  // Eventos de Drag and Drop en la tarjeta
  card.addEventListener('dragstart', handleDragStart);
  card.addEventListener('dragend', handleDragEnd);

  // Evento para eliminar tarjeta
  const btnDelete = card.querySelector('.btn-delete-task');
  btnDelete.addEventListener('click', (e) => {
    e.stopPropagation();
    deleteTask(task.id);
  });

  return card;
}

/* ========================================================
   3. NATIVE DRAG & DROP API (HTML5)
   ======================================================== */
function handleDragStart(e) {
  draggedTaskId = this.dataset.id;
  this.classList.add('dragging');
  e.dataTransfer.effectAllowed = 'move';
  e.dataTransfer.setData('text/plain', draggedTaskId);
}

function handleDragEnd() {
  this.classList.remove('dragging');
  document.querySelectorAll('.kanban-column').forEach(col => col.classList.remove('drag-over'));
  draggedTaskId = null;
}

function initColumnDropZones() {
  document.querySelectorAll('.kanban-column').forEach(column => {
    column.addEventListener('dragover', (e) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
      column.classList.add('drag-over');
    });

    column.addEventListener('dragleave', (e) => {
      // Evitar parpadeo si el puntero sigue dentro de la columna
      if (!column.contains(e.relatedTarget)) {
        column.classList.remove('drag-over');
      }
    });

    column.addEventListener('drop', (e) => {
      e.preventDefault();
      column.classList.remove('drag-over');

      const targetStatus = column.dataset.status;
      const taskId = e.dataTransfer.getData('text/plain') || draggedTaskId;

      if (taskId && targetStatus) {
        moveTask(taskId, targetStatus);
      }
    });
  });
}

function moveTask(taskId, newStatus) {
  const task = tasks.find(t => String(t.id) === String(taskId));
  if (!task) return;

  if (task.status !== newStatus) {
    task.status = newStatus;
    saveTasks();
    renderKanban();
    showToast(`Tarea movida a "${formatStatusName(newStatus)}"`);
  }
}

/* ========================================================
   4. GESTIÓN DE TAREAS (AGREGAR / ELIMINAR)
   ======================================================== */
function addTask(title, assignee, priority, dueDate) {
  const newTask = {
    id: `task-${Date.now()}`,
    title: title.trim(),
    assignee: assignee.trim(),
    priority: priority || 'media',
    dueDate: dueDate || new Date().toISOString().split('T')[0],
    status: 'pendiente'
  };

  tasks.unshift(newTask);
  saveTasks();
  renderKanban();
  showToast('¡Nueva tarea creada con éxito!');
}

function deleteTask(taskId) {
  const card = document.getElementById(`card-${taskId}`);
  if (card) {
    card.style.transform = 'scale(0.85)';
    card.style.opacity = '0';
  }

  setTimeout(() => {
    tasks = tasks.filter(t => String(t.id) !== String(taskId));
    saveTasks();
    renderKanban();
    showToast('Tarea eliminada correctamente');
  }, 200);
}

/* ========================================================
   5. CONTROL DEL MODAL
   ======================================================== */
function initModal() {
  const modalBackdrop = document.getElementById('taskModalBackdrop');
  const btnOpen = document.getElementById('btnOpenTaskModal');
  const btnClose = document.getElementById('btnCloseTaskModal');
  const btnCancel = document.getElementById('btnCancelTaskModal');
  const taskForm = document.getElementById('taskForm');
  const dueDateInput = document.getElementById('taskDueDate');

  // Asignar fecha por defecto a mañana
  if (dueDateInput) {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    dueDateInput.value = tomorrow.toISOString().split('T')[0];
  }

  function openModal() {
    modalBackdrop.classList.add('active');
    document.getElementById('taskTitle')?.focus();
  }

  function closeModal() {
    modalBackdrop.classList.remove('active');
    taskForm?.reset();
  }

  btnOpen?.addEventListener('click', openModal);
  btnClose?.addEventListener('click', closeModal);
  btnCancel?.addEventListener('click', closeModal);

  // Cerrar al clickear fuera de la tarjeta modal
  modalBackdrop?.addEventListener('click', (e) => {
    if (e.target === modalBackdrop) closeModal();
  });

  // Cerrar con Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalBackdrop.classList.contains('active')) {
      closeModal();
    }
  });

  taskForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const title = document.getElementById('taskTitle').value;
    const assignee = document.getElementById('taskAssignee').value;
    const priority = document.getElementById('taskPriority').value;
    const dueDate = document.getElementById('taskDueDate').value;

    if (!title || !assignee || !dueDate) return;

    addTask(title, assignee, priority, dueDate);
    closeModal();
  });
}

/* ========================================================
   6. HELPERS Y NOTIFICACIONES
   ======================================================== */
function formatDate(dateStr) {
  if (!dateStr) return '';
  const parts = dateStr.split('-');
  if (parts.length === 3) {
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  }
  return dateStr;
}

function formatStatusName(status) {
  switch (status) {
    case 'pendiente': return 'Pendiente';
    case 'en_revision': return 'En Revisión';
    case 'completado': return 'Completado';
    default: return status;
  }
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

function showToast(message) {
  const toast = document.getElementById('kanbanToast');
  if (!toast) return;

  toast.textContent = message;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}

/* ========================================================
   7. INICIALIZACIÓN GLOBAL
   ======================================================== */
export function initKanbanModule() {
  loadTasks();
  renderKanban();
  initColumnDropZones();
  initModal();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initKanbanModule);
} else {
  initKanbanModule();
}
