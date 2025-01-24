const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

// Inicialización de Express
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Rutas de la API
app.use('/auth', require('./src/app/routes/auth')); // Rutas para autenticación
app.use('/api', require('./src/app/routes/api')); // Rutas para otras consultas

// Sirve los archivos estáticos del proyecto Angular
app.use(express.static(path.join(__dirname, 'dist/no_adeudo/browser')));

// Redirige todas las rutas que no sean API al index.html de Angular
app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/no_adeudo/browser/index.html'));
});

// Inicia el servidor en el puerto proporcionado (Render o local)
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});


const express = require('express');
const router = express.Router();
const db = require('../db/db');

// Ruta para iniciar sesión
router.post('/login', (req, res) => {
  const { correo, contrasena } = req.body;

  // Consulta para administradores
  const queryAdmin = `
    SELECT idadministrador AS id, usuario, rol
    FROM administrador
    WHERE usuario = ? AND contrasena = ?
  `;

  db.query(queryAdmin, [correo, contrasena], (err, results) => {
    if (err) {
      console.error('Error al verificar administrador:', err);
      return res.status(500).json({ error: 'Error en el servidor al verificar administrador' });
    }

    if (results.length > 0) {
      return res.status(200).json(results[0]);
    }

    // Consulta para alumnos
    const queryAlumno = `
      SELECT a.idalumnos AS id, a.nombre_completo, a.rol
      FROM alumnos a
      WHERE a.correo = ? AND a.contrasena = ?
    `;

    db.query(queryAlumno, [correo, contrasena], (err, results) => {
      if (err) {
        console.error('Error al verificar alumno:', err);
        return res.status(500).json({ error: 'Error en el servidor al verificar alumno' });
      }

      if (results.length > 0) {
        return res.status(200).json(results[0]);
      }

      // Consulta para departamentos
      const queryDepartamento = `
        SELECT iddepartamentos AS id, nombre_departamento, rol
        FROM departamentos
        WHERE usuario = ? AND contrasena = ?
      `;

      db.query(queryDepartamento, [correo, contrasena], (err, results) => {
        if (err) {
          console.error('Error al verificar departamento:', err);
          return res.status(500).json({ error: 'Error en el servidor al verificar departamento' });
        }

        if (results.length > 0) {
          return res.status(200).json(results[0]);
        }

        // Credenciales incorrectas
        return res.status(401).json({ error: 'Credenciales incorrectas' });
      });
    });
  });
});

module.exports = router;
