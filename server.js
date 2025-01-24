const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./src/app/db/db'); // Asegúrate de que este archivo apunta correctamente a tu conexión con la base de datos
const path = require('path');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());


//------------------------------------------------------------Nueva Ruta------------------------------------------------------------//
// Ruta para el login
app.post('/auth/login', (req, res) => {
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

//------------------------------------------------------------Nueva Ruta------------------------------------------------------------//
// Ruta para obtener alumnos y peticiones
app.get('/common/alumnos-peticiones', (req, res) => {
  const query = `
    SELECT alumnos.*, peticiones.*
    FROM alumnos
    LEFT JOIN peticiones ON alumnos.no_control = peticiones.no_control;
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error al obtener los datos:', err);
      return res.status(500).json({ error: 'Error al obtener los datos' });
    }

    res.json(results); // Retorna los resultados como un arreglo de objetos
  });
});

//------------------------------------------------------------Nueva Ruta------------------------------------------------------------//



// 📁 Configuración de multer para subir imágenes
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads/'); // Carpeta donde se guardarán las imágenes
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname)); // Nombre único para evitar colisiones
  }
});

//------------------------------------------------------------Nueva Ruta------------------------------------------------------------//

app.post('/admin/obtener-departamento', (req, res) => {
  const authData = req.headers.authorization ? JSON.parse(req.headers.authorization) : {};

  const { usuario, contrasena } = authData;

  // Validar credenciales del administrador
  const queryAdmin = `
    SELECT *
    FROM administrador
    WHERE usuario = ? AND contrasena = ?`;

  db.query(queryAdmin, [usuario, contrasena], (error, results) => {
    if (error) {
      return res.status(500).json({ error: 'Error al verificar las credenciales del administrador' });
    }
    if (results.length === 0) {
      return res.status(403).json({ error: 'Credenciales inválidas' });
    }

    // Si las credenciales son válidas, obtener los datos de los departamentos
    const queryDepartamentos = `
      SELECT
        iddepartamentos,
        nombre_departamento,
        usuario,
        contrasena,
        departamento_id,
        fecha_registro
      FROM departamentos`;

    db.query(queryDepartamentos, (error, departamentos) => {
      if (error) {
        return res.status(500).json({ error: 'Error al obtener los departamentos' });
      }
      return res.status(200).json({ departamentos });
    });
  });
});


//------------------------------------------------------------Archivos Estaticos------------------------------------------------------------//

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
