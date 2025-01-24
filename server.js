const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./src/app/db/db');
const multer = require('multer');
const app = express();
const path = require('path');
const uploads = multer();

app.use(cors());
app.use(bodyParser.json());

// Sirve los archivos estáticos de la carpeta 'dist'
app.use(express.static(path.join(__dirname, 'dist/no_adeudo/browser')));

// Redirige todas las rutas a index.html para que Angular maneje las rutas
app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist/no_adeudo/browser/index.html'));
});

// Inicia el servidor en el puerto proporcionado por Render
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});


// iniciar session.
app.post('/auth/login', (req, res) => {
  const { correo, contrasena } = req.body;
  console.log('Datos recibidos en el servidor:', req.body);

  // Consulta para administradores
  const queryAdmin = `
    SELECT
      idadministrador AS id,
      usuario,
      rol
    FROM administrador
    WHERE usuario = ? AND contrasena = ?
  `;

  db.query(queryAdmin, [correo, contrasena], (err, results) => {
    if (err) {
      console.error('Error al verificar administrador:', err);
      return res.status(500).json({ error: 'Error en el servidor al verificar administrador' });
    }

    if (results.length > 0) {
      console.log('Administrador autenticado:', results[0]);
      return res.status(200).json(results[0]);
    }

    // Consulta para alumnos
    const queryAlumno = `
      SELECT
        a.idalumnos AS id,
        a.nombre_completo,
        a.correo,
        a.telefono,
        a.no_control,
        a.foto,
        a.fecha_registro,
        a.rol,
        p.estatus_administracion_y_finanzas,
        p.estatus_centro_de_informacion,
        p.estatus_centro_de_computo,
        p.estatus_recursos_materiales,
        p.estatus_departamento_de_vinculacion,
        p.comentario_administracion_y_finanzas,
        p.comentario_centro_de_informacion,
        p.comentario_centro_de_computo,
        p.comentario_recursos_materiales,
        p.comentario_departamento_de_vinculacion,
        p.estatus_peticion
      FROM
        alumnos a
      LEFT JOIN
        peticiones p ON a.no_control = p.no_control
      WHERE
        a.correo = ? AND a.contrasena = ?
    `;

    db.query(queryAlumno, [correo, contrasena], (err, results) => {
      if (err) {
        console.error('Error al verificar alumno:', err);
        return res.status(500).json({ error: 'Error en el servidor al verificar alumno' });
      }

      if (results.length > 0) {
        console.log('Alumno autenticado:', results[0]);
        return res.status(200).json(results[0]);
      }

      // Consulta para departamentos
      const queryDepartamento = `
        SELECT
          d.iddepartamentos AS id,
          d.nombre_departamento,
          d.usuario,
          d.departamento_id,
          d.rol
        FROM
          departamentos d
        WHERE
          d.usuario = ? AND d.contrasena = ?
      `;

      db.query(queryDepartamento, [correo, contrasena], (err, results) => {
        if (err) {
          console.error('Error al verificar departamento:', err);
          return res.status(500).json({ error: 'Error en el servidor al verificar departamento' });
        }

        if (results.length > 0) {
          console.log('Departamento autenticado:', results[0]);
          return res.status(200).json(results[0]);
        }

        // Credenciales incorrectas
        console.log('Credenciales incorrectas');
        return res.status(401).json({ error: 'Credenciales incorrectas' });
      });
    });
  });
});



app.get('/api/alumnos-peticiones', isAuthenticated, (req, res) => {
  // Solo usuarios autenticados pueden acceder
  const query = `
    SELECT alumnos.*, peticiones.*
    FROM alumnos
    LEFT JOIN peticiones ON alumnos.no_control = peticiones.no_control;
  `;

  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Error al obtener los datos' });
    }
    res.json(results);
  });
});

