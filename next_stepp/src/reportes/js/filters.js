/**
 * filters.js
 * Maneja el botón "Aplicar filtros" y el menú desplegable "Exportar reporte".
 */
function getActiveFilters() {
  return {
    periodo: document.getElementById("fPeriodo")?.value ?? "",
    reclutador: document.getElementById("fReclutador")?.value ?? "",
    empresa: document.getElementById("fEmpresa")?.value ?? "",
    estado: document.getElementById("fEstado")?.value ?? "",
  };
}

function initFilters() {
  const btnAplicar = document.getElementById("btnAplicarFiltros");
  btnAplicar?.addEventListener("click", () => {
    const filtros = getActiveFilters();
    // TODO: sustituir por la llamada real al backend / recarga de DASHBOARD_DATA.
    console.log("Aplicando filtros:", filtros);
    renderBarChart();
    renderRanking();
  });
}

function initExportMenu() {
  const btnExportar = document.getElementById("btnExportar");
  const dropdown = document.getElementById("exportDropdown");
  if (!btnExportar || !dropdown) return;

  const closeDropdown = () => {
    dropdown.hidden = true;
  };

  btnExportar.addEventListener("click", (e) => {
    e.stopPropagation();
    dropdown.hidden = !dropdown.hidden;
  });

  dropdown.querySelectorAll("button[data-format]").forEach((btn) => {
    btn.addEventListener("click", () => {
      // TODO: sustituir por la generación/descarga real del archivo.
      console.log(`Exportando reporte como: ${btn.dataset.format}`);
      closeDropdown();
    });
  });

  document.addEventListener("click", (e) => {
    if (!dropdown.hidden && !dropdown.contains(e.target) && e.target !== btnExportar) {
      closeDropdown();
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeDropdown();
  });
}
