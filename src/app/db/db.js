const mysql = require('mysql2');

// Configuración del pool de conexiones
const pool = mysql.createPool({
  host: 'bftd73dzubltvd6c1lvb-mysql.services.clever-cloud.com',
  user: 'uwakgxle52lw2nyo',
  password: 'gdm124nqpjiYAiWo0m4l',
  database: 'bftd73dzubltvd6c1lvb',
  waitForConnections: true,  // Espera si no hay conexiones disponibles
  connectionLimit: 10,      // Número máximo de conexiones en el pool
  queueLimit: 0            // Sin límite en la cola
});

// Obtener una conexión del pool y realizar una consulta
pool.query('SELECT * FROM alumnos', (err, results) => {
  if (err) {
    console.error('Error en la consulta:', err);
    return;
  }
  console.log('Resultados:', results);
});

// Exportar el pool para usarlo en otros archivos
module.exports = pool;
