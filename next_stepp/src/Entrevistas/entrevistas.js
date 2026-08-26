// Base de datos simulada en memoria respaldada por LocalStorage
let entrevistasData = JSON.parse(localStorage.getItem('nextstepp_entrevistas')) || [
    {
        id: 1,
        candidato: "María González",
        vacante: "Desarrollador Frontend Junior",
        empresa: "Tech Solutions CR",
        reclutador: "Daniel Ortega",
        fecha: "2026-08-25",
        hora: "10:00 a.m.",
        modalidad: "Virtual",
        estado: "Programada",
        tec: 2, com: 5, exp: 3, adap: 5,
        obs: "Candidata con buen potencial técnico y excelente adaptación.",
        resultado: "En espera / Por decidir"
    },
    {
        id: 2,
        candidato: "María González",
        vacante: "Desarrollador Frontend Junior",
        empresa: "Tech Solutions CR",
        reclutador: "Daniel Ortega",
        fecha: "2026-08-20",
        hora: "02:00 p.m.",
        modalidad: "Presencial",
        estado: "Aprobada",
        tec: 4, com: 4, exp: 4, adap: 4,
        obs: "Muy buena entrevista técnica inicial.",
        resultado: "Aprobada — Avanza de etapa"
    },
    {
        id: 3,
        candidato: "María González",
        vacante: "Soporte TI",
        empresa: "Global Tech",
        reclutador: "Carlos Pérez",
        fecha: "2026-08-15",
        hora: "11:00 a.m.",
        modalidad: "Virtual",
        estado: "Finalizada",
        tec: 3, com: 3, exp: 3, adap: 3,
        obs: "Faltó profundidad en redes.",
        resultado: "Rechazada"
    }
];

let entrevistaActivaId = 1;

// Cargar y mostrar lista en formato vertical lateral hacia abajo
function cargarEntrevistas(filtroFecha = '') {
    const container = document.getElementById('lista-entrevistas-anteriores');
    container.innerHTML = '';

    let filtradas = entrevistasData;
    if (filtroFecha) {
        filtradas = entrevistasData.filter(e => e.fecha === filtroFecha);
    }

    if (filtradas.length === 0) {
        container.innerHTML = `<p style="font-size: 13px; color: var(--text-muted); text-align: center; padding: 10px;">No se encontraron entrevistas.</p>`;
        return;
    }

    filtradas.forEach(ent => {
        const card = document.createElement('div');
        card.className = 'interview-item-card';
        card.innerHTML = `
            <div class="interview-header-row">
                <span class="interview-title-sm">${ent.vacante}</span>
                <span class="interview-date-sm">${ent.fecha}</span>
            </div>
            <p class="interview-desc-sm">${ent.empresa} — ${ent.modalidad}</p>
            <span class="badge ${ent.resultado.includes('Aprobada') ? 'approved' : 'pending'}">${ent.resultado}</span>
            <div class="interview-actions">
                <button class="btn btn-secondary" style="font-size: 11px; padding: 4px 8px;" onclick="seleccionarEntrevista(${ent.id})">Ver / Editar</button>
                <button class="btn btn-danger" style="font-size: 11px; padding: 4px 8px;" onclick="borrarEntrevista(event, ${ent.id})">Borrar</button>
            </div>
        `;
        container.appendChild(card);
    });
}

// Seleccionar entrevista para ver y editar su información y evaluación
function seleccionarEntrevista(id) {
    entrevistaActivaId = id;
    const ent = entrevistasData.find(e => e.id === id);
    if (!ent) return;

    document.getElementById('info-candidato').innerText = ent.candidato;
    document.getElementById('info-vacante').innerText = ent.vacante;
    document.getElementById('info-empresa').innerText = ent.empresa;
    document.getElementById('info-reclutador').innerText = ent.reclutador;
    document.getElementById('info-fecha').innerText = ent.fecha;
    document.getElementById('info-hora').innerText = ent.hora;
    document.getElementById('info-modalidad').innerText = ent.modalidad;
    document.getElementById('info-estado').innerText = ent.estado;

    // Cargar en el formulario lateral derecho
    document.getElementById('eval-tec').value = ent.tec;
    document.getElementById('eval-com').value = ent.com;
    document.getElementById('eval-exp').value = ent.exp;
    document.getElementById('eval-adap').value = ent.adap;
    document.getElementById('eval-obs').value = ent.obs;
    document.getElementById('eval-resultado').value = ent.resultado;
}

// Guardar evaluación e información de la entrevista actual
function guardarEvaluacion(e) {
    e.preventDefault();
    const ent = entrevistasData.find(item => item.id === entrevistaActivaId);
    if (!ent) return;

    ent.tec = document.getElementById('eval-tec').value;
    ent.com = document.getElementById('eval-com').value;
    ent.exp = document.getElementById('eval-exp').value;
    ent.adap = document.getElementById('eval-adap').value;
    ent.obs = document.getElementById('eval-obs').value;
    ent.resultado = document.getElementById('eval-resultado').value;

    localStorage.setItem('nextstepp_entrevistas', JSON.stringify(entrevistasData));
    alert('¡Información de la entrevista actualizada con éxito!');
    cargarEntrevistas();
}

// Borrar entrevista
function borrarEntrevista(event, id) {
    event.stopPropagation();
    if (confirm('¿Estás seguro de que deseas eliminar esta entrevista?')) {
        entrevistasData = entrevistasData.filter(e => e.id !== id);
        localStorage.setItem('nextstepp_entrevistas', JSON.stringify(entrevistasData));
        cargarEntrevistas();
        
        // Si borramos la activa, seleccionamos otra si existe
        if (entrevistaActivaId === id && entrevistasData.length > 0) {
            seleccionarEntrevista(entrevistasData[0].id);
        }
    }
}

// Cambiar la fecha de la entrevista activa
function cambiarFechaEntrevistaActiva() {
    const nuevaFecha = prompt("Ingrese la nueva fecha (YYYY-MM-DD):", "2026-08-26");
    if (nuevaFecha) {
        const ent = entrevistasData.find(e => e.id === entrevistaActivaId);
        if (ent) {
            ent.fecha = nuevaFecha;
            localStorage.setItem('nextstepp_entrevistas', JSON.stringify(entrevistasData));
            seleccionarEntrevista(entrevistaActivaId);
            cargarEntrevistas();
            alert("Fecha de la entrevista actualizada correctamente.");
        }
    }
}

// Buscar entrevistas por fecha
function filtrarEntrevistas() {
    const fechaVal = document.getElementById('buscar-fecha').value;
    cargarEntrevistas(fechaVal);
}

// Limpiar búsqueda
function limpiarBusqueda() {
    document.getElementById('buscar-fecha').value = '';
    cargarEntrevistas();
}

// Cancelar entrevista activa
function cancelarEntrevistaActiva() {
    const ent = entrevistasData.find(e => e.id === entrevistaActivaId);
    if (ent) {
        ent.estado = 'Cancelada';
        ent.resultado = 'Cancelada';
        localStorage.setItem('nextstepp_entrevistas', JSON.stringify(entrevistasData));
        seleccionarEntrevista(entrevistaActivaId);
        cargarEntrevistas();
    }
}

// Inicializar al cargar la página
window.onload = function() {
    cargarEntrevistas();
    seleccionarEntrevista(entrevistaActivaId);
};