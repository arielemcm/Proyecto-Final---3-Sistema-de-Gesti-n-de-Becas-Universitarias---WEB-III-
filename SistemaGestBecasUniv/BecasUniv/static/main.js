// ============================================
// SISTEMA DE GESTIÓN DE BECAS UMSA - MAIN.JS
// ============================================

// URL base de la API
const API_URL = '/api';

// ============================================
// DATOS LOCALES
// ============================================
let programas = [];
let postulaciones = [];

// ============================================
// FUNCIONES DE API
// ============================================
async function cargarProgramas() {
    try {
        const res = await fetch(`${API_URL}/programas/`);
        programas = await res.json();
        renderProgramas();
        llenarSelectBecas();
    } catch (e) {
        console.error('Error cargando programas:', e);
    }
}

async function cargarPostulaciones() {
    try {
        const res = await fetch(`${API_URL}/postulaciones/`);
        postulaciones = await res.json();
        renderPostulaciones();
        renderAprobaciones();
        actualizarKPIs();
    } catch (e) {
        console.error('Error cargando postulaciones:', e);
    }
}

// ============================================
// RENDERIZADO
// ============================================
function renderProgramas() {
    const cont = document.getElementById('listaProgramas');
    if (!cont) return;
    cont.innerHTML = programas.map(p => `
        <div class="flex justify-between items-center p-3 bg-white border rounded-xl shadow-sm">
            <div>
                <span class="font-semibold">${p.tipo_display || p.nombre || 'Sin nombre'}</span>
                <p class="text-xs text-gray-500">${p.monto || 'Sin monto'} • ${p.requisito || 'Sin requisito'}</p>
            </div>
        </div>
    `).join('');
}

function renderPostulaciones() {
    const cont = document.getElementById('listaPostulaciones');
    if (!cont) return;
    if (postulaciones.length === 0) {
        cont.innerHTML = '<div class="p-6 text-center text-slate-400">No hay postulaciones registradas</div>';
        return;
    }
    cont.innerHTML = postulaciones.map(p => `
        <div class="p-3 bg-white rounded-xl border-l-4 ${p.estado==='APROBADA'?'border-emerald-500':p.estado==='RECHAZADA'?'border-rose-500':'border-amber-400'} shadow-sm">
            <div class="flex justify-between">
                <div>
                    <p class="font-medium">${p.estudiante_nombre || 'Sin nombre'}</p>
                    <p class="text-xs text-slate-500">CI: ${p.estudiante_ci || 'N/A'} · RU: ${p.estudiante_registro || 'N/A'}</p>
                    <p class="text-xs text-slate-500">${p.programa_nombre || 'Sin programa'} · ${p.fecha_postulacion || ''}</p>
                </div>
                <span class="text-xs font-bold px-2 py-1 rounded-full ${p.estado==='APROBADA'?'bg-emerald-100 text-emerald-700':p.estado==='RECHAZADA'?'bg-rose-100 text-rose-700':'bg-amber-100 text-amber-700'}">${p.estado || '???'}</span>
            </div>
        </div>
    `).join('');
}

function renderAprobaciones() {
    const cont = document.getElementById('tablaAprobaciones');
    if (!cont) return;
    const pendientes = postulaciones.filter(p => p.estado === 'PENDIENTE');
    if (pendientes.length === 0) {
        cont.innerHTML = '<div class="p-10 text-center text-slate-400"><i class="fas fa-check-circle text-2xl mb-2 block"></i>No hay postulaciones pendientes</div>';
        return;
    }
    cont.innerHTML = pendientes.map(p => `
        <div class="flex justify-between items-center p-4 border-b hover:bg-slate-50">
            <div>
                <p class="font-semibold">${p.estudiante_nombre || 'Sin nombre'}</p>
                <p class="text-xs text-slate-500">CI: ${p.estudiante_ci || 'N/A'} · RU: ${p.estudiante_registro || 'N/A'}</p>
                <p class="text-xs text-slate-500">${p.programa_nombre || 'Sin programa'}</p>
            </div>
            <div class="space-x-2">
                <button onclick="cambiarEstado(${p.id}, 'APROBADA')" class="bg-emerald-600 text-white px-3 py-1 rounded-lg text-xs hover:bg-emerald-700 transition">
                    <i class="fas fa-check mr-1"></i> Aprobar
                </button>
                <button onclick="cambiarEstado(${p.id}, 'RECHAZADA')" class="bg-rose-600 text-white px-3 py-1 rounded-lg text-xs hover:bg-rose-700 transition">
                    <i class="fas fa-times mr-1"></i> Rechazar
                </button>
            </div>
        </div>
    `).join('');
}

function actualizarKPIs() {
    const elProgramas = document.getElementById('kpi-programas');
    const elPostulaciones = document.getElementById('kpi-postulaciones');
    const elAprobadas = document.getElementById('kpi-aprobadas');
    
    if (elProgramas) elProgramas.innerText = programas.length;
    if (elPostulaciones) elPostulaciones.innerText = postulaciones.length;
    if (elAprobadas) elAprobadas.innerText = postulaciones.filter(p => p.estado === 'APROBADA').length;
}

function llenarSelectBecas() {
    const select = document.getElementById('becaSeleccionada');
    if (!select) return;
    select.innerHTML = '<option value="">Seleccionar beca...</option>' +
        programas.map(p => `<option value="${p.id}">${p.tipo_display || p.nombre || 'Sin nombre'}</option>`).join('');
}

// ============================================
// ACCIONES
// ============================================
async function agregarPrograma() {
    const nombre = document.getElementById('nombrePrograma').value.trim();
    const tipo = document.getElementById('tipoPrograma').value;
    const monto = document.getElementById('montoPrograma').value.trim();
    const requisito = document.getElementById('requisitoPrograma').value.trim();
    
    if (!nombre) return alert('⚠️ Ingrese nombre del programa');
    if (!tipo) return alert('⚠️ Seleccione tipo de beca');
    
    await fetch(`${API_URL}/programas/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            nombre, 
            tipo: tipo,
            monto, 
            requisito, 
            activo: true 
        })
    });
    
    // Limpiar campos
    document.getElementById('nombrePrograma').value = '';
    document.getElementById('tipoPrograma').value = '';
    document.getElementById('montoPrograma').value = '';
    document.getElementById('requisitoPrograma').value = '';
    
    cargarProgramas();
    alert('✅ Programa registrado correctamente');
}

async function registrarPostulacion() {
    const ci = document.getElementById('ciEstudiante').value.trim();
    const registro = document.getElementById('registroEstudiante').value.trim();
    const nombre = document.getElementById('nombreEstudiante').value.trim();
    const becaId = document.getElementById('becaSeleccionada').value;
    
    if (!ci || !registro || !nombre || !becaId) {
        return alert('⚠️ Complete todos los campos (CI, Registro, Nombre, Beca)');
    }
    
    // Crear estudiante con CI y Registro Universitario
    const estRes = await fetch(`${API_URL}/estudiantes/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            ci: ci,
            registro_universitario: registro,
            nombre_completo: nombre 
        })
    });
    
    if (!estRes.ok) {
        const error = await estRes.json();
        return alert('⚠️ Error: ' + JSON.stringify(error));
    }
    
    const estudiante = await estRes.json();
    
    // Crear postulación
    await fetch(`${API_URL}/postulaciones/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            estudiante: estudiante.id, 
            programa: parseInt(becaId), 
            estado: 'PENDIENTE' 
        })
    });
    
    // Limpiar campos
    document.getElementById('ciEstudiante').value = '';
    document.getElementById('registroEstudiante').value = '';
    document.getElementById('nombreEstudiante').value = '';
    document.getElementById('becaSeleccionada').value = '';
    
    cargarPostulaciones();
    alert('✅ Postulación registrada correctamente');
}

async function cambiarEstado(id, nuevoEstado) {
    await fetch(`${API_URL}/postulaciones/${id}/cambiar_estado/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ estado: nuevoEstado })
    });
    cargarPostulaciones();
}

async function consultarEstado() {
    const id = document.getElementById('buscarEstadoId').value.trim();
    if (!id) return alert('⚠️ Ingrese CI o Registro Universitario');
    
    const res = await fetch(`${API_URL}/consulta/estado/${id}/`);
    const data = await res.json();
    const div = document.getElementById('resultadoEstado');
    div.classList.remove('hidden');
    
    if (Array.isArray(data)) {
        div.innerHTML = `
            <h4 class="font-bold text-slate-700 mb-3">📌 Resultados para: ${id}</h4>
            ${data.map(p => `
                <div class="flex justify-between border-b py-2">
                    <span>${p.programa_nombre || 'Sin programa'}</span>
                    <span class="font-bold ${p.estado==='APROBADA'?'text-emerald-600':p.estado==='RECHAZADA'?'text-rose-600':'text-amber-600'}">${p.estado}</span>
                </div>
            `).join('')}
        `;
    } else {
        div.innerHTML = `<p class="text-slate-500"><i class="fas fa-info-circle mr-1"></i> ${data.mensaje || 'Sin resultados'}</p>`;
    }
}

async function generarReporte() {
    const res = await fetch(`${API_URL}/consulta/estadisticas/`);
    const data = await res.json();
    document.getElementById('resumenEstadistico').innerHTML = `
        <div class="grid grid-cols-3 gap-4 text-center">
            <div class="bg-emerald-50 rounded-xl p-3">
                <p class="text-2xl font-bold text-emerald-600">${data.aprobadas || 0}</p>
                <p class="text-xs text-emerald-700">✅ Aprobadas</p>
            </div>
            <div class="bg-rose-50 rounded-xl p-3">
                <p class="text-2xl font-bold text-rose-600">${data.rechazadas || 0}</p>
                <p class="text-xs text-rose-700">❌ Rechazadas</p>
            </div>
            <div class="bg-amber-50 rounded-xl p-3">
                <p class="text-2xl font-bold text-amber-600">${data.pendientes || 0}</p>
                <p class="text-xs text-amber-700">⏳ Pendientes</p>
            </div>
        </div>
    `;
}

// ============================================
// NAVEGACIÓN
// ============================================
function mostrarModulo(id) {
    document.querySelectorAll('.modulo-contenido').forEach(m => {
        m.classList.add('hidden');
        m.classList.remove('block');
    });
    const target = document.getElementById(id);
    if (target) {
        target.classList.remove('hidden');
        target.classList.add('block');
    }
}

// ============================================
// INICIALIZACIÓN
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    cargarProgramas();
    cargarPostulaciones();
    mostrarModulo('mod-inicio');
});