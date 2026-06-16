// =========================
// SISTEMA UMSA - MAIN.JS
// =========================

// Mostrar módulo seleccionado
function mostrarModulo(moduloId) {
    // Ocultar todos los módulos
    document.querySelectorAll('.modulo-contenido').forEach(el => {
        el.classList.add('hidden');
    });
    
    // Mostrar el módulo seleccionado
    const modulo = document.getElementById(moduloId);
    if (modulo) {
        modulo.classList.remove('hidden');
    }
    
    // Actualizar título
    const titulos = {
        'mod-inicio': 'Panel de Control',
        'mod-programas': 'Programas de Becas',
        'mod-postulaciones': 'Gestionar Postulaciones',
        'mod-estado': 'Consultar Estados',
        'mod-aprobaciones': 'Dictamen - Aprobar/Rechazar',
        'mod-consultas': 'Consultas y Reportes'
    };
    
    const tituloElement = document.getElementById('titulo-modulo');
    if (tituloElement && titulos[moduloId]) {
        tituloElement.innerHTML = `<i class="fas fa-chalkboard-user" style="color: var(--azul-umsa);"></i>${titulos[moduloId]}`;
    }
    
    // Actualizar botón activo
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Buscar el botón que corresponde al módulo
    const botones = document.querySelectorAll('.nav-btn');
    const index = Object.keys(titulos).indexOf(moduloId);
    if (botones[index]) {
        botones[index].classList.add('active');
    }
}

// Función para agregar programa
async function agregarPrograma() {
    const nombre = document.getElementById('nombrePrograma').value;
    const tipo = document.getElementById('tipoPrograma').value;
    const monto = document.getElementById('montoPrograma').value;
    const requisito = document.getElementById('requisitoPrograma').value;
    
    if (!nombre || !tipo) {
        alert('Por favor completa los campos obligatorios');
        return;
    }
    
    try {
        const res = await fetch('/api/programas/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCSRFToken()
            },
            body: JSON.stringify({
                nombre: nombre,
                tipo: tipo,
                monto: monto,
                requisito: requisito
            })
        });
        
        if (res.ok) {
            alert('Programa registrado exitosamente');
            location.reload();
        } else {
            alert('Error al registrar el programa');
        }
    } catch (e) {
        console.error('Error:', e);
        alert('Error de conexión');
    }
}

// Obtener CSRF Token
function getCSRFToken() {
    const cookieValue = document.cookie
        .split('; ')
        .find(row => row.startsWith('csrftoken='));
    return cookieValue ? cookieValue.split('=')[1] : '';
}

// Inicializar dashboard
document.addEventListener('DOMContentLoaded', function() {
    // Mostrar módulo de inicio por defecto
    mostrarModulo('mod-inicio');
    
    // Cargar datos del dashboard
    cargarDashboard();
});

// Función para cargar dashboard
async function cargarDashboard() {
    try {
        const res = await fetch('/api/dashboard/');
        const data = await res.json();
        
        document.getElementById('kpi-programas').textContent = data.programas || 0;
        document.getElementById('kpi-postulaciones').textContent = data.postulaciones || 0;
        document.getElementById('kpi-aprobadas').textContent = data.aprobadas || 0;
        document.getElementById('kpi-inversion').textContent = 'Bs ' + (data.inversion || 0);
    } catch (e) {
        console.error('Error cargando dashboard:', e);
    }
}