/**
 * data.js
 * Fuente de datos del dashboard. Hoy son datos de ejemplo (mock);
 * el objetivo es reemplazar DASHBOARD_DATA por la respuesta real de la API
 * sin tener que tocar chart.js / ranking.js / reports.js.
 */
const DASHBOARD_DATA = {
  kpis: {
    vacantes: 24,
    postulaciones: 186,
    entrevistas: 32,
    cubiertas: 18,
  },

  estadoPostulaciones: [
    { label: "Postuladas", value: 142 },
    { label: "En revisión", value: 98 },
    { label: "Preseleccionados", value: 61 },
    { label: "Entrevistados", value: 40 },
    { label: "Contratados", value: 18, highlight: true },
  ],

  ranking: [
    { nombre: "María Rodríguez", postulaciones: 45 },
    { nombre: "Carlos Méndez", postulaciones: 38 },
    { nombre: "Laura Vargas", postulaciones: 31 },
    { nombre: "Andrés Solano", postulaciones: 27 },
    { nombre: "Diana Chaves", postulaciones: 22 },
  ],

  reportesDisponibles: [
    { id: "candidatos", titulo: "Reporte de candidatos", icono: "user" },
    { id: "vacantes", titulo: "Reporte de vacantes", icono: "briefcase" },
    { id: "postulaciones", titulo: "Reporte de postulaciones", icono: "file" },
    { id: "entrevistas", titulo: "Reporte de entrevistas", icono: "calendar" },
  ],
};
