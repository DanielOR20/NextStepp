/**
 * main.js
 * Punto de entrada de la vista de Reportes. Orquesta la inicialización
 * de íconos, gráfico, ranking, reportes, filtros y navegación.
 */
document.addEventListener("DOMContentLoaded", () => {
  renderIcons();

  renderBarChart();
  renderRanking();
  renderReportsGrid();

  initRankingToggle();
  initFilters();
  initExportMenu();
});
