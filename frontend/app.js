const contenedor = document.getElementById('clientes');
const form = document.getElementById('formCliente');
const inputId = document.getElementById('clienteId');
const inputNombre = document.getElementById('nombre_cliente');
const inputIdentificacion = document.getElementById('identificacion');
const inputDireccion = document.getElementById('direccion');
const inputTelefono = document.getElementById('telefono');
const inputCorreo = document.getElementById('correo');
const btnCancelar = document.getElementById('btnCancelar');

// Función para cargar clientes
function cargarClientes() {
fetch('/clientes')
.then(res => res.json())
.then(data => {
if (!Array.isArray(data)) {
console.error('❌ Respuesta inesperada:', data);
contenedor.innerHTML = '<p style="color:red;">❌ Error al cargar clientes.</p>';
return;
}

contenedor.innerHTML = '';
data.forEach(cliente => {
const div = document.createElement('div');
div.className = 'cliente';
div.innerHTML = `
<h3>${cliente.nombre_cliente}</h3>
<p><b>ID:</b> ${cliente.id_cliente}</p>
<p><b>Identificación:</b> ${cliente.identificacion}</p>
<p><b>Teléfono:</b> ${cliente.telefono || 'N/A'}</p>
<p><b>Correo:</b> ${cliente.correo || 'N/A'}</p>
<button onclick="editarCliente(${cliente.id_cliente})">Editar</button>
<button onclick="eliminarCliente(${cliente.id_cliente})">Eliminar</button>
`;
contenedor.appendChild(div);
});
})
.catch(err => {
console.error('❌ Error al obtener clientes:', err);
contenedor.innerHTML = '<p style="color:red;">❌ Error al obtener clientes.</p>';
});
}

// Manejo del formulario de clientes (Agregar o Editar)
form.addEventListener('submit', e => {
e.preventDefault();
const id = inputId.value;
const cliente = {
nombre_cliente: inputNombre.value,
identificacion: inputIdentificacion.value,
direccion: inputDireccion.value,
telefono: inputTelefono.value,
correo: inputCorreo.value
};

const url = id ? `/clientes/${id}` : '/clientes';
const method = id ? 'PUT' : 'POST';

fetch(url, {
method,
headers: { 'Content-Type': 'application/json' },
body: JSON.stringify(cliente)
})
.then(res => {
if (!res.ok) throw new Error('❌ Error en la operación');
return res.json();
})
.then(() => {
limpiarFormulario();
cargarClientes();
})
.catch(err => alert(err.message));
});

// Función para cancelar y limpiar el formulario
btnCancelar.addEventListener('click', limpiarFormulario);

function editarCliente(id) {
fetch(`/clientes/${id}`)
.then(res => res.json())
.then(cliente => {
inputId.value = cliente.id_cliente;
inputNombre.value = cliente.nombre_cliente;
inputIdentificacion.value = cliente.identificacion;
inputDireccion.value = cliente.direccion || '';
inputTelefono.value = cliente.telefono || '';
inputCorreo.value = cliente.correo || '';
btnCancelar.style.display = 'inline';
})
.catch(err => {
console.error('❌ Error al obtener cliente:', err);
alert('❌ Error al cargar el cliente.');
});
}

function eliminarCliente(id) {
if (confirm('¿Seguro que quieres eliminar este cliente?')) {
fetch(`/clientes/${id}`, { method: 'DELETE' })
.then(res => {
if (!res.ok) throw new Error('❌ Error eliminando cliente');
cargarClientes();
})
.catch(err => alert(err.message));
}
}

function limpiarFormulario() {
inputId.value = '';
inputNombre.value = '';
inputIdentificacion.value = '';
inputDireccion.value = '';
inputTelefono.value = '';
inputCorreo.value = '';
btnCancelar.style.display = 'none';
}

// Cargar clientes al inicio
cargarClientes();