/**
 * chart.js
 * Dibuja el gráfico de barras "Estado de las postulaciones" a partir de
 * DASHBOARD_DATA.estadoPostulaciones. Sin librerías: divs con altura en %.
 */
function renderBarChart(data = DASHBOARD_DATA.estadoPostulaciones) {
  const container = document.getElementById("barChart");
  if (!container) return;

  const max = Math.max(...data.map((d) => d.value), 1);
  container.innerHTML = "";

  data.forEach((item) => {
    const col = document.createElement("div");
    col.className = "bar-chart__col" + (item.highlight ? " bar-chart__col--highlight" : "");

    const value = document.createElement("span");
    value.className = "bar-chart__value";
    value.textContent = item.value;

    const bar = document.createElement("div");
    bar.className = "bar-chart__bar";
    bar.style.height = "0%"; // se anima después de insertarse en el DOM

    const label = document.createElement("span");
    label.className = "bar-chart__label";
    label.textContent = item.label;

    col.append(value, bar, label);
    container.appendChild(col);

    // Anima la barra hasta su altura real en el siguiente frame
    requestAnimationFrame(() => {
      const pct = (item.value / max) * 100;
      bar.style.height = `${pct}%`;
    });
  });
}
