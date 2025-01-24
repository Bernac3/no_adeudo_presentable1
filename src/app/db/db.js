const mysql = require('mysql2');

// Configuración de la conexión a la base de datos 'no_adeudo'
const db = mysql.createConnection({
  host: 'bftd73dzubltvd6c1lvb-mysql.services.clever-cloud.com',
  user: 'uwakgxle52lw2nyo', // Tu usuario de MySQL
  password: 'gdm124nqpjiYAiWo0m4l', // Tu contraseña de MySQL
  database: 'bftd73dzubltvd6c1lvb', // Nombre de la base de datos
});

// Conexión
db.connect((err) => {
  if (err) {
    console.error('Error de conexión a la base de datos: ' + err.stack);
    return;
  }
  console.log('Conexión exitosa a la base de datos');
});

module.exports = db;

