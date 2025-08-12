// ========================
// Helper para LocalStorage
// ========================
function guardarEnLocalStorage(key, data) {
localStorage.setItem(key, JSON.stringify(data));
}

function leerDeLocalStorage(key) {
const data = localStorage.getItem(key);
return data ? JSON.parse(data) : [];
}

// ========================
// Mostrar tablas
// ========================
function mostrarTabla(idTabla, datos) {
const tabla = document.getElementById(idTabla);
if (!datos.length) {
tabla.innerHTML = "<tr><td colspan='10'>No hay datos</td></tr>";
return;
}

// Encabezados dinámicos
const headers = Object.keys(datos[0]);
let html = "<tr>" + headers.map(h => `<th>${h}</th>`).join("") + "</tr>";

// Filas
datos.forEach(item => {
html += "<tr>" + headers.map(h => `<td>${item[h]}</td>`).join("") + "</tr>";
});

tabla.innerHTML = html;
}

// ========================
// Cargar CSV
// ========================
function parseCSV(content) {
const lines = content.split("\n").filter(line => line.trim() !== "");
const headers = lines[0].split(",");
return lines.slice(1).map(line => {
const values = line.split(",");
let obj = {};
headers.forEach((h, i) => obj[h.trim()] = values[i]?.trim() || "");
return obj;
});
}

document.getElementById("btnCargarCSV").addEventListener("click", () => {
const csvClientes = document.getElementById("csvClientes").files[0];
const csvFacturas = document.getElementById("csvFacturas").files[0];
const csvTransacciones = document.getElementById("csvTransacciones").files[0];

if (csvClientes) {
leerArchivoCSV(csvClientes, "clientes");
}
if (csvFacturas) {
leerArchivoCSV(csvFacturas, "facturas");
}
if (csvTransacciones) {
leerArchivoCSV(csvTransacciones, "transacciones");
}
});

function leerArchivoCSV(file, key) {
const reader = new FileReader();
reader.onload = (e) => {
const data = parseCSV(e.target.result);
guardarEnLocalStorage(key, data);
actualizarTablas();
};
reader.readAsText(file);
}

// ========================
// Formularios manuales
// ========================

// Clientes
document.getElementById("formCliente").addEventListener("submit", (e) => {
e.preventDefault();
const clientes = leerDeLocalStorage("clientes");
clientes.push({
id_cliente: clientes.length + 1,
nombre_cliente: document.getElementById("nombreCliente").value,
identificacion: document.getElementById("identificacionCliente").value,
direccion: document.getElementById("direccionCliente").value,
telefono: document.getElementById("telefonoCliente").value,
correo: document.getElementById("correoCliente").value
});
guardarEnLocalStorage("clientes", clientes);
e.target.reset();
actualizarTablas();
});

// Facturas
document.getElementById("formFactura").addEventListener("submit", (e) => {
e.preventDefault();
const facturas = leerDeLocalStorage("facturas");
facturas.push({
id_factura: facturas.length + 1,
numero_factura: document.getElementById("numeroFactura").value,
periodo_facturacion: document.getElementById("periodoFacturacion").value,
monto_facturado: document.getElementById("montoFacturado").value,
monto_pagado: document.getElementById("montoPagado").value,
id_cliente: document.getElementById("idClienteFactura").value
});
guardarEnLocalStorage("facturas", facturas);
e.target.reset();
actualizarTablas();
});

// Transacciones
document.getElementById("formTransaccion").addEventListener("submit", (e) => {
e.preventDefault();
const transacciones = leerDeLocalStorage("transacciones");
transacciones.push({
id_transaccion: transacciones.length + 1,
codigo_transaccion: document.getElementById("codigoTransaccion").value,
fecha_hora: document.getElementById("fechaHora").value,
monto_transaccion: document.getElementById("montoTransaccion").value,
estado: document.getElementById("estado").value,
tipo_transaccion: document.getElementById("tipoTransaccion").value,
plataforma: document.getElementById("plataforma").value,
id_factura: document.getElementById("idFacturaTransaccion").value
});
guardarEnLocalStorage("transacciones", transacciones);
e.target.reset();
actualizarTablas();
});

// ========================
// Actualizar todas las tablas
// ========================
function actualizarTablas() {
mostrarTabla("tablaClientes", leerDeLocalStorage("clientes"));
mostrarTabla("tablaFacturas", leerDeLocalStorage("facturas"));
mostrarTabla("tablaTransacciones", leerDeLocalStorage("transacciones"));
}

// ========================
// Cargar datos al iniciar
// ========================
document.addEventListener("DOMContentLoaded", actualizarTablas);


const API = location.hostname === 'localhost' ? 'http://localhost:3000' : `${location.protocol}//${location.host}`;

/* ---------- UTIL ---------- */
async function apiFetch(url, options = {}) {
try {
const res = await fetch(API + url, options);
if (!res.ok) {
const txt = await res.text();
throw new Error(txt || 'Error en la petición');
}
return res.json().catch(()=> null);
} catch (err) {
alert(err.message || err);
console.error(err);
throw err;
}
}

/* ---------- CLIENTES ---------- */
async function loadClientes() {
const clientes = await apiFetch('/clientes');
const container = document.getElementById('listClientes');
container.innerHTML = '';
clientes.forEach(c => {
const div = document.createElement('div');
div.className = 'item';
div.innerHTML = `
<div class="meta">
<strong>${c.nombre_cliente}</strong> — ${c.identificacion}<br>
${c.direccion || ''} ${c.telefono ? ' • ' + c.telefono : ''} ${c.correo ? ' • ' + c.correo : ''}
</div>
<div>
<button class="smallbtn secondary" onclick="editCliente(${c.id_cliente})">Editar</button>
<button class="smallbtn" onclick="delCliente(${c.id_cliente})">Eliminar</button>
</div>
`;
container.appendChild(div);
});
}

document.getElementById('formCliente').addEventListener('submit', async (e) => {
e.preventDefault();
const id = document.getElementById('clienteId').value;
const payload = {
nombre_cliente: document.getElementById('nombre_cliente').value,
identificacion: document.getElementById('identificacion').value,
direccion: document.getElementById('direccion').value,
telefono: document.getElementById('telefono').value,
correo: document.getElementById('correo').value
};
if (id) {
await apiFetch(`/clientes/${id}`, { method: 'PUT', headers:{'Content-Type':'application/json'}, body: JSON.stringify(payload) });
} else {
await apiFetch('/clientes', { method: 'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(payload) });
}
document.getElementById('formCliente').reset();
document.getElementById('clienteId').value = '';
loadClientes();
});

function editCliente(id) {
apiFetch(`/clientes/${id}`).then(c => {
if (!c) return alert('Cliente no encontrado');
document.getElementById('clienteId').value = c.id_cliente;
document.getElementById('nombre_cliente').value = c.nombre_cliente || '';
document.getElementById('identificacion').value = c.identificacion || '';
document.getElementById('direccion').value = c.direccion || '';
document.getElementById('telefono').value = c.telefono || '';
document.getElementById('correo').value = c.correo || '';
});
}
async function delCliente(id) {
if (!confirm('Eliminar cliente?')) return;
await apiFetch(`/clientes/${id}`, { method: 'DELETE' });
loadClientes();
}
document.getElementById('clienteReset').addEventListener('click', () => {
document.getElementById('formCliente').reset();
document.getElementById('clienteId').value = '';
});
document.getElementById('upload_clientes').addEventListener('click', async () => {
const f = document.getElementById('csv_clientes').files[0];
if (!f) return alert('Selecciona CSV');
const fd = new FormData(); fd.append('file', f);
await apiFetch('/upload-csv/clientes', { method: 'POST', body: fd });
loadClientes();
});

/* ---------- FACTURAS ---------- */
async function loadFacturas() {
const items = await apiFetch('/facturas');
const container = document.getElementById('listFacturas');
container.innerHTML = '';
items.forEach(f => {
const div = document.createElement('div');
div.className = 'item';
div.innerHTML = `
<div class="meta">
<strong>${f.numero_factura}</strong> • ${f.periodo_facturacion} <br>
Facturado: ${f.monto_facturado} • Pagado: ${f.monto_pagado} • Cliente: ${f.id_cliente} ${f.nombre_cliente ? ' - ' + f.nombre_cliente : ''}
</div>
<div>
<button class="smallbtn secondary" onclick="editFactura(${f.id_factura})">Editar</button>
<button class="smallbtn" onclick="delFactura(${f.id_factura})">Eliminar</button>
</div>
`;
container.appendChild(div);
});
}

document.getElementById('formFactura').addEventListener('submit', async (e) => {
e.preventDefault();
const id = document.getElementById('facturaId').value;
const payload = {
numero_factura: document.getElementById('numero_factura').value,
periodo_facturacion: document.getElementById('periodo_facturacion').value,
monto_facturado: document.getElementById('monto_facturado').value,
monto_pagado: document.getElementById('monto_pagado').value,
id_cliente: document.getElementById('id_cliente_factura').value
};
if (id) {
await apiFetch(`/facturas/${id}`, { method: 'PUT', headers:{'Content-Type':'application/json'}, body: JSON.stringify(payload) });
} else {
await apiFetch('/facturas', { method: 'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(payload) });
}
document.getElementById('formFactura').reset();
document.getElementById('facturaId').value = '';
loadFacturas();
});

function editFactura(id) {
apiFetch(`/facturas/${id}`).then(f => {
if (!f) return alert('Factura no encontrada');
document.getElementById('facturaId').value = f.id_factura;
document.getElementById('numero_factura').value = f.numero_factura || '';
document.getElementById('periodo_facturacion').value = f.periodo_facturacion ? f.periodo_facturacion.split('T')[0] : '';
document.getElementById('monto_facturado').value = f.monto_facturado || '';
document.getElementById('monto_pagado').value = f.monto_pagado || '';
document.getElementById('id_cliente_factura').value = f.id_cliente || '';
});
}
async function delFactura(id) {
if (!confirm('Eliminar factura?')) return;
await apiFetch(`/facturas/${id}`, { method: 'DELETE' });
loadFacturas();
}
document.getElementById('facturaReset').addEventListener('click', () => {
document.getElementById('formFactura').reset();
document.getElementById('facturaId').value = '';
});
document.getElementById('upload_facturas').addEventListener('click', async () => {
const f = document.getElementById('csv_facturas').files[0];
if (!f) return alert('Selecciona CSV');
const fd = new FormData(); fd.append('file', f);
await apiFetch('/upload-csv/facturas', { method: 'POST', body: fd });
loadFacturas();
});

/* ---------- TRANSACCIONES ---------- */
async function loadTransacciones() {
const items = await apiFetch('/transacciones');
const container = document.getElementById('listTransacciones');
container.innerHTML = '';
items.forEach(t => {
const div = document.createElement('div');
div.className = 'item';
div.innerHTML = `
<div class="meta">
<strong>${t.codigo_transaccion}</strong> • ${t.fecha_hora} <br>
Monto: ${t.monto_transaccion} • Estado: ${t.estado} • Factura: ${t.id_factura} ${t.numero_factura ? ' - ' + t.numero_factura : ''}
</div>
<div>
<button class="smallbtn secondary" onclick="editTransaccion(${t.id_transaccion})">Editar</button>
<button class="smallbtn" onclick="delTransaccion(${t.id_transaccion})">Eliminar</button>
</div>
`;
container.appendChild(div);
});
}

document.getElementById('formTransaccion').addEventListener('submit', async (e) => {
e.preventDefault();
const id = document.getElementById('transaccionId').value;
const payload = {
codigo_transaccion: document.getElementById('codigo_transaccion').value,
fecha_hora: document.getElementById('fecha_hora').value,
monto_transaccion: document.getElementById('monto_transaccion').value,
estado: document.getElementById('estado').value,
tipo_transaccion: document.getElementById('tipo_transaccion').value,
plataforma: document.getElementById('plataforma').value,
id_factura: document.getElementById('id_factura_transaccion').value
};
if (id) {
await apiFetch(`/transacciones/${id}`, { method: 'PUT', headers:{'Content-Type':'application/json'}, body: JSON.stringify(payload) });
} else {
await apiFetch('/transacciones', { method: 'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(payload) });
}
document.getElementById('formTransaccion').reset();
document.getElementById('transaccionId').value = '';
loadTransacciones();
});

function editTransaccion(id) {
apiFetch(`/transacciones/${id}`).then(t => {
if (!t) return alert('Transacción no encontrada');
document.getElementById('transaccionId').value = t.id_transaccion;
document.getElementById('codigo_transaccion').value = t.codigo_transaccion || '';
document.getElementById('fecha_hora').value = t.fecha_hora ? t.fecha_hora.replace(' ', 'T') : '';
document.getElementById('monto_transaccion').value = t.monto_transaccion || '';
document.getElementById('estado').value = t.estado || '';
document.getElementById('tipo_transaccion').value = t.tipo_transaccion || '';
document.getElementById('plataforma').value = t.plataforma || '';
document.getElementById('id_factura_transaccion').value = t.id_factura || '';
});
}
async function delTransaccion(id) {
if (!confirm('Eliminar transacción?')) return;
await apiFetch(`/transacciones/${id}`, { method: 'DELETE' });
loadTransacciones();
}
document.getElementById('transaccionReset').addEventListener('click', () => {
document.getElementById('formTransaccion').reset();
document.getElementById('transaccionId').value = '';
});
document.getElementById('upload_transacciones').addEventListener('click', async () => {
const f = document.getElementById('csv_transacciones').files[0];
if (!f) return alert('Selecciona CSV');
const fd = new FormData(); fd.append('file', f);
await apiFetch('/upload-csv/transacciones', { method: 'POST', body: fd });
loadTransacciones();
});

/* ---------- INIT ---------- */
document.addEventListener('DOMContentLoaded', () => {
loadClientes();
loadFacturas();
loadTransacciones();
});
