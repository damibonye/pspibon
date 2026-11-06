const fs = require('fs');
const path = require('path');
const pc = require('picocolors');

// Convierte bytes a B, KB o MB
function formatearTamano(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 ** 2) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / 1024 ** 2).toFixed(1) + ' MB';
}

// 1. Leer la ruta del argumento (o usar la carpeta actual)
const ruta = process.argv[2] || '.';

// 2. Comprobar que existe
if (!fs.existsSync(ruta)) {
  console.log(pc.bgRed(pc.white(` ERROR: la ruta "${ruta}" no existe `)));
  process.exit(1);
}

// 3. Leer el contenido
const elementos = fs.readdirSync(ruta, { withFileTypes: true });

let numCarpetas = 0;
let numArchivos = 0;
let tamanoTotal = 0;

console.log(pc.bold(pc.cyan(`\nContenido de ${path.resolve(ruta)}\n`)));

for (const elemento of elementos) {
  const nombre = elemento.name;
  const rutaCompleta = path.join(ruta, nombre);
  const oculto = nombre.startsWith('.');

  if (elemento.isDirectory()) {
    numCarpetas++;
    const texto = nombre + '/';
    console.log('  ' + (oculto ? pc.dim(texto) : pc.blue(texto)));
  } else {
    numArchivos++;
    const tamano = fs.statSync(rutaCompleta).size;
    tamanoTotal += tamano;
    const textoNombre = oculto ? pc.dim(nombre) : pc.green(nombre);
    console.log('  ' + textoNombre + ' ' + pc.dim(`(${formatearTamano(tamano)})`));
  }
}

// 4. Resumen final
console.log(
  '\n' + pc.bold(`${numCarpetas} carpetas, ${numArchivos} archivos, ${formatearTamano(tamanoTotal)} en total\n`)
);
