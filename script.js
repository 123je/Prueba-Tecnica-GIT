const apiUrl = 'http://localhost:3000/notas';

// Obtener notas
async function obtenerNotas() {
    const res = await fetch(apiUrl);
    const notas = await res.json();
    document.getElementById('listaNotas').innerHTML = notas.map(nota => `
        <li>
            <strong>${nota.titulo}</strong> - ${nota.descripcion} 
            <br> Vence: ${nota.fechaVencimiento} 
            <br> Completada: ${nota.completada ? '✅' : '❌'}
            <br>
            <button onclick="editarNota(${nota.id}, '${nota.titulo}', '${nota.descripcion}', '${nota.fechaVencimiento}', ${nota.completada})">✏️</button>
            <button onclick="eliminarNota(${nota.id})">🗑️</button>
        </li>
    `).join('');
}

// Crear o actualizar nota
document.getElementById('notaForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('notaId').value;
    const titulo = document.getElementById('titulo').value;
    const descripcion = document.getElementById('descripcion').value;
    const fechaVencimiento = document.getElementById('fechaVencimiento').value;
    const completada = document.getElementById('completada').checked;

    const metodo = id ? 'PUT' : 'POST';
    const url = id ? `${apiUrl}/${id}` : apiUrl;

    await fetch(url, {
        method: metodo,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ titulo, descripcion, fechaVencimiento, completada })
    });

    document.getElementById('notaForm').reset();
    document.getElementById('notaId').value = '';
    obtenerNotas();
});

// Editar nota
function editarNota(id, titulo, descripcion, fechaVencimiento, completada) {
    document.getElementById('notaId').value = id;
    document.getElementById('titulo').value = titulo;
    document.getElementById('descripcion').value = descripcion;
    document.getElementById('fechaVencimiento').value = fechaVencimiento;
    document.getElementById('completada').checked = completada;
}

// Eliminar nota
async function eliminarNota(id) {
    await fetch(`${apiUrl}/${id}`, { method: 'DELETE' });
    obtenerNotas();
}

// Cargar notas al inicio
obtenerNotas();
