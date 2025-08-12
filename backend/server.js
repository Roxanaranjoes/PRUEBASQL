// server.js 

const express = require('express');
const cors = require('cors');
const db = require('./db');
const path = require('path');

const app = express();

app.use(cors());
app.use(express.json());

// Verificar conexión con la base de datos
db.query('SELECT 1', (err) => {
if (err) {
console.error('❌ No se pudo conectar a la base de datos', err);
} else {
console.log('✅ Conexión a la base de datos exitosa');
}
});

// Servir archivos del frontend
app.use(express.static(path.join(__dirname, '../frontend')));

/* ============================
CRUD CLIENTES
============================ */

// Obtener todos los clientes
app.get('/clientes', (req, res) => {
db.query('SELECT * FROM clientes', (err, results) => {
if (err) return res.status(500).json({ error: 'Error al obtener clientes' });
res.json(results);
});
});

// Obtener cliente por ID
app.get('/clientes/:id', (req, res) => {
const { id } = req.params;
db.query('SELECT * FROM clientes WHERE id_cliente = ?', [id], (err, results) => {
if (err) return res.status(500).json({ error: 'Error al obtener cliente' });
res.json(results[0]);
});
});

// Crear nuevo cliente
app.post('/clientes', (req, res) => {
const { nombre_cliente, identificacion, direccion, telefono, correo } = req.body;
db.query(
'INSERT INTO clientes (nombre_cliente, identificacion, direccion, telefono, correo) VALUES (?, ?, ?, ?, ?)',
[nombre_cliente, identificacion, direccion, telefono, correo],
(err, result) => {
if (err) return res.status(500).json({ error: 'Error creando cliente' });
res.json({ id_cliente: result.insertId, ...req.body });
}
);
});

// Actualizar cliente
app.put('/clientes/:id', (req, res) => {
const { id } = req.params;
const { nombre_cliente, identificacion, direccion, telefono, correo } = req.body;
db.query(
'UPDATE clientes SET nombre_cliente = ?, identificacion = ?, direccion = ?, telefono = ?, correo = ? WHERE id_cliente = ?',
[nombre_cliente, identificacion, direccion, telefono, correo, id],
(err) => {
if (err) return res.status(500).json({ error: 'Error actualizando cliente' });
res.json({ id_cliente: id, ...req.body });
}
);
});

// Eliminar cliente
app.delete('/clientes/:id', (req, res) => {
const { id } = req.params;
db.query('DELETE FROM clientes WHERE id_cliente = ?', [id], (err) => {
if (err) return res.status(500).json({ error: 'Error eliminando cliente' });
res.status(204).send();
});
});

/* ============================
CRUD FACTURAS
============================ */

// Obtener todas las facturas
app.get('/facturas', (req, res) => {
db.query(
`SELECT f.*, c.nombre_cliente
FROM facturas f
INNER JOIN clientes c ON f.id_cliente = c.id_cliente`,
(err, results) => {
if (err) return res.status(500).json({ error: 'Error al obtener facturas' });
res.json(results);
}
);
});

// Obtener factura por ID
app.get('/facturas/:id', (req, res) => {
const { id } = req.params;
db.query('SELECT * FROM facturas WHERE id_factura = ?', [id], (err, results) => {
if (err) return res.status(500).json({ error: 'Error al obtener factura' });
res.json(results[0]);
});
});

// Crear nueva factura
app.post('/facturas', (req, res) => {
const { numero_factura, periodo_facturacion, monto_facturado, monto_pagado, id_cliente } = req.body;
db.query(
'INSERT INTO facturas (numero_factura, periodo_facturacion, monto_facturado, monto_pagado, id_cliente) VALUES (?, ?, ?, ?, ?)',
[numero_factura, periodo_facturacion, monto_facturado, monto_pagado || 0, id_cliente],
(err, result) => {
if (err) return res.status(500).json({ error: 'Error creando factura' });
res.json({ id_factura: result.insertId, ...req.body });
}
);
});

// Actualizar factura
app.put('/facturas/:id', (req, res) => {
const { id } = req.params;
const { numero_factura, periodo_facturacion, monto_facturado, monto_pagado, id_cliente } = req.body;
db.query(
'UPDATE facturas SET numero_factura = ?, periodo_facturacion = ?, monto_facturado = ?, monto_pagado = ?, id_cliente = ? WHERE id_factura = ?',
[numero_factura, periodo_facturacion, monto_facturado, monto_pagado, id_cliente, id],
(err) => {
if (err) return res.status(500).json({ error: 'Error actualizando factura' });
res.json({ id_factura: id, ...req.body });
}
);
});

// Eliminar factura
app.delete('/facturas/:id', (req, res) => {
const { id } = req.params;
db.query('DELETE FROM facturas WHERE id_factura = ?', [id], (err) => {
if (err) return res.status(500).json({ error: 'Error eliminando factura' });
res.status(204).send();
});
});

/* ============================
FRONTEND
============================ */
app.get('/', (req, res) => {
res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

/* ============================
START SERVER
============================ */
const PORT = 3000;
app.listen(PORT, () => {
console.log(`✅ Servidor backend corriendo en http://localhost:${PORT}`);
});
