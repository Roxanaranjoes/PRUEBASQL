# PRUEBASQL

Este proyecto es una solución, que permite a uno de los clientes de ExpertSoft quien actualmente enfrenta dificultades en la gestión de información financiera proveniente de plataformas Fintech como Nequi y Daviplata, ya que los datos están desorganizados y dispersos en múltiples archivos de Excel (.xlsx).
La solución está orientada en organizar y estructurar esta información en una base de datos SQL, facilitando su carga, almacenamiento y posterior administración mediante un sistema CRUD, junto con consultas clave que respondan a las necesidades del cliente, compuesto por un **backend en Node.js + Express** y un **frontend** independiente.

La base de datos se ejecuta en un contenedor **MySQL 8.0** usando Docker.

---

##  Tecnologías utilizadas

- **Backend:** Node.js, Express, CORS, MySQL, Multer, CSV Parser
- **Frontend:** HTML, CSS, JavaScript (puro o framework según implementación existente)
- **Base de datos:** MySQL 8.0 (Docker)
- **Dependencias globales:** npm

---

##  Estructura del proyecto

```

PRUEBASQL/
│
├── backend/
│   ├── db.js
│   ├── routes.js
│   ├── server.js
│   ├── uploads/
│   ├── package.json
│   └── node_modules/
│
├── frontend/
│   ├── index.html
│   ├── style.css
│   ├── app.js
│   └── ...
│
├── Scriptdatabase.md
└── README.md
├── sistema_pagos_mysql.png
├──data.csv


```

---

##  Instalación y configuración

### 1 Clonar el repositorio

```bash

git clone <URL_DEL_REPO>
cd PRUEBASQL

```

---

### 2 Iniciar base de datos en Docker

Ejecuta el contenedor de MySQL:

```bash

sudo docker run --name mysql-crud \
-e MYSQL_ROOT_PASSWORD=admin \
-e MYSQL_DATABASE=sistema_pagos_mysql \
-p 3307:3306 \
-d mysql:8.0

```

---

### 3 Instalar dependencias del backend sino las tiene (si las tiene dejarlo tal cual)

```bash

cd backend
npm install express cors mysql multer csv-parser

```

---

### 4 Configurar la base de datos

En el archivo **`db.js`** del backend, asegúrate de que la configuración coincida con el contenedor Docker:

```jsx

const mysql = require('mysql');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'admin',
  database: 'sistema_pagos_mysql',
  port: 3307
});

connection.connect((err) => {
  if (err) throw err;
  console.log('✅ Conectado a la base de datos MySQL');
});

module.exports = connection;

```

---

### 5 Iniciar el servidor backend

```bash

cd backend
node server.js

```

Por defecto se ejecutará en:

 [**http://localhost:3000**](http://localhost:3000/)

---

### 6 Ejecutar el frontend

Abre el archivo `index.html` del frontend en tu navegador o usa un servidor local como **Live Server** en VSCode.

---

## Subida de CSV

Para importar datos mediante CSV:

```bash

curl -F "file=@ruta/archivo.csv" http://localhost:3000/upload-csv

```

---

## Dependencias necesarias (Muy importante sino las tiene, si las tiene dejarlo tal cual)

En el backend:

```bash
npm install express cors mysql multer csv-parser

```

Si quieres instalarlas de una vez:

```bash

npm install

```

*(Si `package.json` ya las tiene registradas)*

---

## Scripts útiles

```bash

# Iniciar contenedor MySQL
sudo docker start mysql-crud

# Detener contenedor MySQL
sudo docker stop mysql-crud

# Revisar contenedores activos
docker ps

```

---

## Notas

- El puerto de la base de datos es **3307** para evitar conflictos con MySQL local.
- La carpeta `uploads/` guarda temporalmente los archivos CSV cargados.


---


