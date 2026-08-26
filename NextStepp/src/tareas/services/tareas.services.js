export function getTareas() {
  return JSON.parse(localStorage.getItem('tareas_reclutador')) || [];
}

export function saveTarea(tarea) {
  const tareas = getTareas();
  tareas.push(tarea);
  localStorage.setItem('tareas_reclutador', JSON.stringify(tareas));
}

export function deleteTarea(index) {
  const tareas = getTareas();
  tareas.splice(index, 1);
  localStorage.setItem('tareas_reclutador', JSON.stringify(tareas));
}