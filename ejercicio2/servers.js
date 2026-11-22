const express = require('express');
const fs = require('fs');
const path = require('path');
const pc = require('picocolors');

const app = express();
const PUERTO = 5082;

const RUTA_INCIDENCIAS = path.join(__dirname, 'DATOS_API', 'incidencias.json');
const RUTA_CLIENTES = path.join(__dirname, 'DATOS_API', 'clientes.json');

function leerJSON(ruta) {
  const texto = fs.readFileSync(ruta, 'utf-8');
  return JSON.parse(texto);
}

function guardarJSON(ruta, datos) {
  fs.writeFileSync(ruta, JSON.stringify(datos, null, 2), 'utf-8');
}

let incidencias = leerJSON(RUTA_INCIDENCIAS);
let clientes = leerJSON(RUTA_CLIENTES);

app.use(express.json());

app.use((req, res, next) => {
  res.on('finish', () => {
    const estado = res.statusCode;
    let estadoColor;
    if (estado >= 200 && estado < 300) {
      estadoColor = pc.green(estado);
    } else if (estado >= 400 && estado < 500) {
      estadoColor = pc.red(estado);
    } else {
      estadoColor = pc.yellow(estado);
    }
    console.log(`${pc.cyan(req.method)} ${req.originalUrl} -> ${estadoColor}`);
  });
  next();
});


app.get('/api/incidencias', (req, res) => {
  res.status(200).json(incidencias);
});

app.get('/api/incidencias/:codigo', (req, res) => {
  const codigo = req.params.codigo;
  const incidencia = incidencias.find(i => i.codigo === codigo);

  if (!incidencia) {
    return res.status(404).json({ mensaje: 'Incidencia no encontrada' });
  }
  res.status(200).json(incidencia);
});

app.post('/api/incidencias', (req, res) => {
  const { titulo, prioridad, fecha, descripcion } = req.body;

  let maximo = 0;
  for (const i of incidencias) {
    const numero = parseInt(i.codigo.substring(1));
    if (numero > maximo) {
      maximo = numero;
    }
  }
  const nuevoCodigo = 'H' + String(maximo + 1).padStart(3, '0');

  const nuevaIncidencia = {
    codigo: nuevoCodigo,
    titulo: titulo,
    prioridad: prioridad,
    fecha: fecha,
    descripcion: descripcion,
    estado: 'Pendiente'
  };

  incidencias.push(nuevaIncidencia);
  guardarJSON(RUTA_INCIDENCIAS, incidencias);

  res.status(201).json(nuevaIncidencia);
});

app.get('/api/clientes', (req, res) => {
  res.status(200).json(clientes);
});

app.get('/api/clientes/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const cliente = clientes.find(c => c.id === id);

  if (!cliente) {
    return res.status(404).json({ mensaje: 'Cliente no encontrado' });
  }
  res.status(200).json(cliente);
});

app.post('/api/clientes', (req, res) => {
  const { nombre, email, telefono } = req.body;

  let maximo = 0;
  for (const c of clientes) {
    if (c.id > maximo) {
      maximo = c.id;
    }
  }

  const nuevoCliente = {
    id: maximo + 1,
    nombre: nombre,
    email: email,
    telefono: telefono
  };

  clientes.push(nuevoCliente);
  guardarJSON(RUTA_CLIENTES, clientes);

  res.status(201).json(nuevoCliente);
});

app.put('/api/clientes/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const cliente = clientes.find(c => c.id === id);

  if (!cliente) {
    return res.status(404).json({ mensaje: 'Cliente no encontrado' });
  }

  const { nombre, email, telefono } = req.body;
  if (nombre !== undefined) cliente.nombre = nombre;
  if (email !== undefined) cliente.email = email;
  if (telefono !== undefined) cliente.telefono = telefono;

  guardarJSON(RUTA_CLIENTES, clientes);
  res.status(200).json(cliente);
});

app.delete('/api/clientes/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const posicion = clientes.findIndex(c => c.id === id);

  if (posicion === -1) {
    return res.status(404).json({ mensaje: 'Cliente no encontrado' });
  }

  const eliminado = clientes.splice(posicion, 1)[0];
  guardarJSON(RUTA_CLIENTES, clientes);

  res.status(200).json(eliminado);
});

app.listen(PUERTO, () => {
  console.log(pc.bold(`Servidor escuchando en http://127.0.0.1:${PUERTO}/`));
});