/**
 * reports.js
 * Renderiza las tarjetas de "Reportes disponibles" y su acción "Ver reporte".
 * El manejador handleVerReporte es el punto donde se debe conectar la
 * navegación real (ruta, modal, generación de PDF, etc.).
 */
function renderReportsGrid() {
  const grid = document.getElementById("reportsGrid");
  if (!grid) return;

  grid.innerHTML = "";
  DASHBOARD_DATA.reportesDisponibles.forEach((r) => {
    const card = document.createElement("article");
    card.className = "report-card";
    card.innerHTML = `
      <span class="report-card__icon"><i class="icon icon-${r.icono}"></i></span>
      <span class="report-card__title">${r.titulo}</span>
      <button type="button" data-report="${r.id}">Ver reporte</button>
    `;
    grid.appendChild(card);
  });

  renderIcons(grid);
  grid.querySelectorAll("button[data-report]").forEach((btn) => {
    btn.addEventListener("click", () => handleVerReporte(btn.dataset.report));
  });
}

function handleVerReporte(reportId) {
  // TODO: reemplazar por la navegación / lógica real de cada equipo.
  console.log(`Abrir reporte: ${reportId}`);
}
