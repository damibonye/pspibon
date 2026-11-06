const os = require('os');
const fs = require('fs');
const pc = require('picocolors');

function formatearBytes(bytes) {
  return (bytes / 1024 / 1024 / 1024).toFixed(2) + ' GB';
}

function formatearUptime(segundos) {
  const horas = Math.floor(segundos / 3600);
  const minutos = Math.floor((segundos % 3600) / 60);
  return horas + 'h ' + minutos + 'm';
}

const total = os.totalmem();
const libre = os.freemem();
const usado = Math.round(((total - libre) / total) * 100);

// 1. Texto plano (sin colores) para guardar en el archivo
const informe =
  'Equipo: ' + os.hostname() + '\n' +
  'Sistema: ' + os.type() + ' ' + os.release() + ' ' + os.arch() + '\n' +
  'Usuario: ' + os.userInfo().username + '\n' +
  'Procesador: ' + os.cpus()[0].model + ' (' + os.cpus().length + ' CPUs)\n' +
  'Memoria total: ' + formatearBytes(total) + '\n' +
  'Memoria libre: ' + formatearBytes(libre) + '\n' +
  'Memoria usada: ' + usado + '%\n' +
  'Tiempo activo: ' + formatearUptime(os.uptime()) + '\n';

// 2. Mostrar por consola con colores
console.log(pc.bold(pc.cyan('=== INFORME DEL SISTEMA ===')));
console.log(pc.white(informe));

// 3. Guardar en archivos
fs.writeFileSync('informe.txt', informe);

const fecha = new Date().toLocaleString('sv-SE'); // formato 2026-11-01 10:32:15
fs.appendFileSync('historial.log', fecha + ' | RAM usada: ' + usado + '%\n');

console.log(pc.green('✔ Informe guardado en informe.txt'));
