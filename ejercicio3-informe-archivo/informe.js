const os = require('os');
const fs = require('fs');
const path = require('path');
const pc = require('picocolors');

// Los archivos se guardan en la misma carpeta que este script
const RUTA_INFORME = path.join(__dirname, 'informe.txt');
const RUTA_HISTORIAL = path.join(__dirname, 'historial.log');

function formatearBytes(bytes) {
  return (bytes / 1024 ** 3).toFixed(2) + ' GB';
}

function formatearUptime(segundos) {
  const horas = Math.floor(segundos / 3600);
  const minutos = Math.floor((segundos % 3600) / 60);
  return `${horas}h ${minutos}m`;
}

function colorearPorcentaje(porcentaje) {
  const texto = porcentaje.toFixed(1) + ' %';
  if (porcentaje < 60) return pc.green(texto);
  if (porcentaje <= 85) return pc.yellow(texto);
  return pc.red(texto);
}

// Devuelve la fecha con formato 2026-11-01 10:32:15
function fechaActual() {
  const d = new Date();
  const dos = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${dos(d.getMonth() + 1)}-${dos(d.getDate())} ` +
         `${dos(d.getHours())}:${dos(d.getMinutes())}:${dos(d.getSeconds())}`;
}

// 1. Recoger los datos en un objeto (sin colores)
function obtenerDatos() {
  const cpus = os.cpus();
  const total = os.totalmem();
  const libre = os.freemem();
  return {
    equipo: os.hostname(),
    sistema: `${os.type()} ${os.release()} (${os.arch()})`,
    usuario: os.userInfo().username,
    procesador: `${cpus[0].model} x ${cpus.length}`,
    memTotal: formatearBytes(total),
    memLibre: formatearBytes(libre),
    porcentaje: ((total - libre) / total) * 100,
    uptime: formatearUptime(os.uptime()),
  };
}

// 2. Construir el informe en TEXTO PLANO (para guardarlo en el archivo)
function informeTextoPlano(d) {
  return [
    '=== INFORME DEL SISTEMA ===',
    `Fecha:         ${fechaActual()}`,
    `Equipo:        ${d.equipo}`,
    `Sistema:       ${d.sistema}`,
    `Usuario:       ${d.usuario}`,
    `Procesador:    ${d.procesador}`,
    `Memoria total: ${d.memTotal}`,
    `Memoria libre: ${d.memLibre}`,
    `Memoria usada: ${d.porcentaje.toFixed(1)} %`,
    `Tiempo activo: ${d.uptime}`,
  ].join('\n') + '\n';
}

// 3. Mostrar el informe CON COLORES (solo en consola)
function mostrarEnConsola(d) {
  const linea = (etiqueta, valor) => console.log('  ' + pc.dim(etiqueta.padEnd(15)) + valor);
  console.log('\n' + pc.bold(pc.cyan('=== INFORME DEL SISTEMA ===')));
  linea('Equipo:', pc.white(d.equipo));
  linea('Sistema:', pc.white(d.sistema));
  linea('Usuario:', pc.white(d.usuario));
  linea('Procesador:', pc.white(d.procesador));
  linea('Memoria total:', pc.white(d.memTotal));
  linea('Memoria libre:', pc.green(d.memLibre));
  linea('Memoria usada:', colorearPorcentaje(d.porcentaje));
  linea('Tiempo activo:', pc.green(d.uptime));
  console.log();
}

// ---- Programa principal ----
const datos = obtenerDatos();

mostrarEnConsola(datos);

// informe.txt -> se SOBRESCRIBE en cada ejecución
fs.writeFileSync(RUTA_INFORME, informeTextoPlano(datos));

// historial.log -> se AÑADE una línea en cada ejecución
const lineaHistorial = `${fechaActual()} | RAM usada: ${Math.round(datos.porcentaje)}%\n`;
fs.appendFileSync(RUTA_HISTORIAL, lineaHistorial);

console.log(pc.green('✔ Informe guardado en informe.txt'));
