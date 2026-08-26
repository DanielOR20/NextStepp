export function getEntrevistas() {
  return JSON.parse(localStorage.getItem('entrevistas')) || [];
}

export function saveEntrevista(entrevista) {
  const entrevistas = getEntrevistas();
  entrevistas.push(entrevista);
  localStorage.setItem('entrevistas', JSON.stringify(entrevistas));
}

export function deleteEntrevista(index) {
  const entrevistas = getEntrevistas();
  entrevistas.splice(index, 1);
  localStorage.setItem('entrevistas', JSON.stringify(entrevistas));
}