const os = require('os');
const pc = require('picocolors');

function formatearBytes(bytes) {
  return (bytes / 1024 / 1024 / 1024).toFixed(2) + ' GB';
}

function formatearUptime(segundos) {
  const horas = Math.floor(segundos / 3600);
  const minutos = Math.floor((segundos % 3600) / 60);
  return horas + 'h ' + minutos + 'm';
}

function colorearPorcentaje(porcentaje) {
  if (porcentaje < 60) return pc.green(porcentaje + '%');
  if (porcentaje <= 85) return pc.yellow(porcentaje + '%');
  return pc.red(porcentaje + '%');
}

const total = os.totalmem();
const libre = os.freemem();
const usado = Math.round(((total - libre) / total) * 100);

console.log(pc.bold(pc.cyan('=== INFORME DEL SISTEMA ===')));
console.log(pc.dim('Equipo: ') + pc.white(os.hostname()));
console.log(pc.dim('Sistema: ') + pc.white(os.type() + ' ' + os.release() + ' ' + os.arch()));
console.log(pc.dim('Usuario: ') + pc.white(os.userInfo().username));
console.log(pc.dim('Procesador: ') + pc.white(os.cpus()[0].model + ' (' + os.cpus().length + ' CPUs)'));
console.log(pc.dim('Memoria total: ') + pc.white(formatearBytes(total)));
console.log(pc.dim('Memoria libre: ') + pc.green(formatearBytes(libre)));
console.log(pc.dim('Memoria usada: ') + colorearPorcentaje(usado));
console.log(pc.dim('Tiempo activo: ') + pc.green(formatearUptime(os.uptime())));
