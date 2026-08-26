/**
 * ranking.js
 * Renderiza "Rendimiento de reclutadores" y controla el botón
 * "Ver lista completa" (expande/colapsa entre top 3 y lista completa).
 */
const RANKING_PREVIEW_COUNT = 3;
let rankingExpanded = false;

function getInitials(nombre) {
  return nombre
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0].toUpperCase())
    .join("");
}

function renderRanking() {
  const list = document.getElementById("rankingList");
  const btn = document.getElementById("btnVerLista");
  if (!list) return;

  const data = DASHBOARD_DATA.ranking;
  const visible = rankingExpanded ? data : data.slice(0, RANKING_PREVIEW_COUNT);

  list.innerHTML = "";
  visible.forEach((r) => {
    const li = document.createElement("li");
    li.className = "ranking-item";
    li.innerHTML = `
      <span class="ranking-item__avatar">${getInitials(r.nombre)}</span>
      <span class="ranking-item__info">
        <span class="ranking-item__name">${r.nombre}</span>
        <span class="ranking-item__sub">Postulaciones gestionadas</span>
      </span>
      <span class="ranking-item__count">${r.postulaciones}</span>
    `;
    list.appendChild(li);
  });

  if (btn) {
    btn.innerHTML = rankingExpanded
      ? 'Ver menos <i class="icon icon-arrow-right"></i>'
      : 'Ver lista completa <i class="icon icon-arrow-right"></i>';
    renderIcons(btn);
  }
}

function initRankingToggle() {
  const btn = document.getElementById("btnVerLista");
  if (!btn) return;
  btn.addEventListener("click", () => {
    rankingExpanded = !rankingExpanded;
    renderRanking();
  });
}
