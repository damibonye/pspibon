const os = require('os');
const pc = require('picocolors');

// Convierte bytes a GB con 2 decimales
function formatearBytes(bytes) {
  return (bytes / 1024 ** 3).toFixed(2) + ' GB';
}

// Convierte segundos a "Xh Ym"
function formatearUptime(segundos) {
  const horas = Math.floor(segundos / 3600);
  const minutos = Math.floor((segundos % 3600) / 60);
  return `${horas}h ${minutos}m`;
}

// Pinta el porcentaje según su valor
function colorearPorcentaje(porcentaje) {
  const texto = porcentaje.toFixed(1) + ' %';
  if (porcentaje < 60) return pc.green(texto);
  if (porcentaje <= 85) return pc.yellow(texto);
  return pc.red(texto);
}

// Muestra una línea "etiqueta: valor"
function mostrarLinea(etiqueta, valor) {
  console.log('  ' + pc.dim(etiqueta.padEnd(15)) + valor);
}

// Muestra un título en negrita y cian
function mostrarTitulo(texto) {
  console.log('\n' + pc.bold(pc.cyan(texto)));
}

// ---- Programa principal ----
const cpus = os.cpus();
const total = os.totalmem();
const libre = os.freemem();
const porcentajeUsado = ((total - libre) / total) * 100;

mostrarTitulo('=== INFORME DEL SISTEMA ===');

mostrarTitulo('General');
mostrarLinea('Equipo:', pc.white(os.hostname()));
mostrarLinea('Sistema:', pc.white(`${os.type()} ${os.release()} (${os.arch()})`));
mostrarLinea('Usuario:', pc.white(os.userInfo().username));

mostrarTitulo('Procesador');
mostrarLinea('Modelo:', pc.white(cpus[0].model));
mostrarLinea('Nº de CPUs:', pc.green(cpus.length));

mostrarTitulo('Memoria');
mostrarLinea('Total:', pc.white(formatearBytes(total)));
mostrarLinea('Libre:', pc.green(formatearBytes(libre)));
mostrarLinea('Usada:', colorearPorcentaje(porcentajeUsado));

mostrarTitulo('Tiempo activo');
mostrarLinea('Uptime:', pc.green(formatearUptime(os.uptime())));
console.log();
