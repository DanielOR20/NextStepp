// Datos iniciales enfocados a procesos internos de NextStepp
const initialTasks = [
  {
    id: "TSK-101",
    title: "Entrevista Final - Sr. Backend Eng",
    desc: "Candidato: Alex Mercer. Requiere revisión del challenge técnico antes de la sesión.",
    priority: "high",
    category: "INTERVIEW",
    assignee: "ME",
    deadline: "HOY 14:00",
    isMine: true
  },
  {
    id: "TSK-102",
    title: "Búsqueda de Perfiles UX/UI",
    desc: "Revisar 20 perfiles en LinkedIn para la vacante de Fintech. Foco en design systems.",
    priority: "low",
    category: "SOURCING",
    assignee: "ME",
    deadline: "MAÑANA 18:00",
    isMine: true
  },
  {
    id: "TSK-103",
    title: "Enviar oferta a candidato QA Auto",
    desc: "Aprobación de salario confirmada por el cliente Tech Corp.",
    priority: "medium",
    category: "FOLLOW_UP",
    assignee: "RD",
    deadline: "HOY 17:00",
    isMine: false
  },
  {
    id: "TSK-104",
    title: "Subir contratos firmados",
    desc: "Cargar contratos del nuevo desarrollador Frontend a la plataforma de NextStepp.",
    priority: "low",
    category: "DOCS",
    assignee: "ML",
    deadline: "LUN 10:00",
    isMine: false
  }
];

let tasks = [...initialTasks];

export function initTareasModule() {
  renderTasks('all');
  setupEventListeners();
}

function renderTasks(filter = 'all') {
  const listMisTareas = document.getElementById('list-mis-tareas');
  const listTeamQueue = document.getElementById('list-team-queue');

  if (!listMisTareas || !listTeamQueue) return;

  listMisTareas.innerHTML = '';
  listTeamQueue.innerHTML = '';

  const filtered = tasks.filter(task => {
    if (filter === 'high') return task.priority === 'high';
    if (filter === 'overdue') return task.deadline.includes('HOY');
    return true;
  });

  let misTareasCount = 0;
  let teamQueueCount = 0;

  filtered.forEach(task => {
    const cardHtml = `
      <div class="task-card">
        <div class="card-top">
          <span class="badge-priority ${task.priority}">${task.priority.toUpperCase()}</span>
          <span class="badge-tag">[ ${task.category} ]</span>
        </div>
        <h3 class="card-title">${task.title}</h3>
        <p class="card-desc">${task.desc}</p>
        <div class="card-footer">
          <span class="user-avatar">${task.assignee}</span>
          <span class="deadline">🕒 ${task.deadline}</span>
        </div>
      </div>
    `;

    if (task.isMine) {
      listMisTareas.innerHTML += cardHtml;
      misTareasCount++;
    } else {
      listTeamQueue.innerHTML += cardHtml;
      teamQueueCount++;
    }
  });

  document.getElementById('count-mis-tareas').textContent = misTareasCount;
  document.getElementById('count-team-queue').textContent = teamQueueCount;
}

function setupEventListeners() {
  const filterButtons = document.querySelectorAll('.btn-filter');
  filterButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      filterButtons.forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');
      renderTasks(e.target.dataset.filter);
    });
  });

  const btnNueva = document.getElementById('btn-nueva-tarea');
  if (btnNueva) {
    btnNueva.addEventListener('click', () => {
      const nueva = {
        id: `TSK-${Math.floor(Math.random() * 900 + 100)}`,
        title: "Nueva Tarea de Reclutamiento",
        desc: "Descripción rápida agregada desde el panel.",
        priority: "medium",
        category: "GENERAL",
        assignee: "ME",
        deadline: "HOY 18:00",
        isMine: true
      };
      tasks.unshift(nueva);
      renderTasks('all');
    });
  }
}