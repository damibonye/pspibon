const fs = require('fs');
const path = require('path');
const pc = require('picocolors');

const ruta = process.argv[2] || '.';

if (!fs.existsSync(ruta)) {
  console.log(pc.bgRed('ERROR: la ruta no existe'));
  process.exit(1);
}

const elementos = fs.readdirSync(ruta, { withFileTypes: true });

let carpetas = 0;
let archivos = 0;
let total = 0;

for (const elemento of elementos) {
  const nombre = elemento.name;

  if (elemento.isDirectory()) {
    carpetas++;
    if (nombre.startsWith('.')) {
      console.log(pc.dim(nombre + '/'));
    } else {
      console.log(pc.blue(nombre + '/'));
    }
  } else {
    archivos++;
    const tamano = fs.statSync(path.join(ruta, nombre)).size;
    total += tamano;

    if (nombre.startsWith('.')) {
      console.log(pc.dim(nombre + ' ' + tamano + ' bytes'));
    } else {
      console.log(pc.green(nombre) + ' ' + pc.dim(tamano + ' bytes'));
    }
  }
}

console.log(carpetas + ' carpetas, ' + archivos + ' archivos, ' + (total / 1024).toFixed(1) + ' KB en total');
