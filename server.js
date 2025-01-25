const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./src/app/db/db'); // Asegúrate de que este archivo apunta correctamente a tu conexión con la base de datos
const path = require('path');
const multer = require('multer');

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
      return res.status(200).json(results[0]); // Enviar los datos del administrador
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
      FROM alumnos a
      LEFT JOIN peticiones p ON a.no_control = p.no_control
      WHERE a.correo = ? AND a.contrasena = ?
    `;

    db.query(queryAlumno, [correo, contrasena], (err, results) => {
      if (err) {
        console.error('Error al verificar alumno:', err);
        return res.status(500).json({ error: 'Error en el servidor al verificar alumno' });
      }

      if (results.length > 0) {
        console.log('Alumno autenticado:', results[0]);
        return res.status(200).json(results[0]); // Enviar los datos del alumno
      }

      // Consulta para departamentos
      const queryDepartamento = `
        SELECT
          d.iddepartamentos AS id,
          d.nombre_departamento,
          d.usuario,
          d.departamento_id,
          d.rol
        FROM departamentos d
        WHERE d.usuario = ? AND d.contrasena = ?
      `;

      db.query(queryDepartamento, [correo, contrasena], (err, results) => {
        if (err) {
          console.error('Error al verificar departamento:', err);
          return res.status(500).json({ error: 'Error en el servidor al verificar departamento' });
        }

        if (results.length > 0) {
          console.log('Departamento autenticado:', results[0]);
          return res.status(200).json(results[0]); // Enviar los datos del departamento
        }

        // Credenciales incorrectas
        console.log('Credenciales incorrectas');
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
// obtener los departamentos
app.post('/admin/obtener-departamento', (req, res) => {
  // Obtener los datos de autenticación desde los headers
  const authData = req.headers.authorization ? JSON.parse(req.headers.authorization) : {};
  const { usuario, contrasena } = authData;

  // Consulta para validar las credenciales del administrador
  const queryAdmin = `
    SELECT *
    FROM administrador
    WHERE usuario = ? AND contrasena = ?
  `;

  db.query(queryAdmin, [usuario, contrasena], (error, results) => {
    if (error) {
      console.error('Error al verificar las credenciales del administrador:', error);
      return res.status(500).json({ error: 'Error al verificar las credenciales del administrador' });
    }
    if (results.length === 0) {
      console.warn('Credenciales inválidas para administrador');
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
      FROM departamentos
    `;

    db.query(queryDepartamentos, (error, departamentos) => {
      if (error) {
        console.error('Error al obtener los departamentos:', error);
        return res.status(500).json({ error: 'Error al obtener los departamentos' });
      }
      // Retornar los departamentos en formato JSON
      return res.status(200).json({ departamentos });
    });
  });
});

//------------------------------------------------------------Nueva Ruta------------------------------------------------------------//
// Obtener departamentos no autorizados
app.get('/admin/departamentos-no-autorizados', (req, res) => {
  const query = `
    SELECT nombre_departamento, usuario, contrasena, departamento_id, fecha_registro
    FROM departamentos_no_autorizados
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error al obtener los departamentos no autorizados:', err);
      return res.status(500).json({ error: 'Error al obtener los datos de la base de datos' });
    }

    // Si no hay resultados, enviar un mensaje claro
    if (results.length === 0) {
      return res.status(404).json({ message: 'No se encontraron departamentos no autorizados' });
    }

    // Respuesta exitosa con los datos
    return res.status(200).json({ departamentosNoAutorizados: results });
  });
});



//------------------------------------------------------------Nueva Ruta------------------------------------------------------------//
// configuracion de multer para subir imagenes
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads/'); // Carpeta donde se guardarán las imágenes
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname)); // Nombre único para evitar colisiones
  }
});
const upload = multer({ storage: storage });

// Registrar alumnos
app.post('/alumno/register', upload.single('foto'), (req, res) => {
  const { nombre_completo, correo, telefono, no_control, contrasena } = req.body;
  const foto = req.file ? req.file.filename : null; // Nombre de la imagen subida

  // Verificar si el correo ya existe en la tabla `alumnos`
  const checkAlumnoQuery = 'SELECT * FROM alumnos WHERE correo = ? OR no_control = ?';
  db.query(checkAlumnoQuery, [correo, no_control], (err, result) => {
    if (err) {
      console.error('Error al verificar alumno:', err);
      return res.status(500).json({ error: 'Error en el servidor al verificar el alumno' });
    }

    // Si se encuentra un alumno con el mismo correo o número de control
    if (result.length > 0) {
      return res.status(400).json({ error: 'El correo o número de control ya están registrados como alumno' });
    }

    // Verificar si el correo ya existe en la tabla `departamentos`
    const checkDepartamentoQuery = 'SELECT * FROM departamentos WHERE usuario = ?';
    db.query(checkDepartamentoQuery, [correo], (err, result) => {
      if (err) {
        console.error('Error al verificar departamento:', err);
        return res.status(500).json({ error: 'Error en el servidor al verificar el departamento' });
      }

      // Si se encuentra un departamento con el mismo correo
      if (result.length > 0) {
        return res.status(400).json({ error: 'El correo ya está registrado como usuario de departamento' });
      }

      // Verificar si el correo ya existe en la tabla `administrador`
      const checkAdminQuery = 'SELECT * FROM administrador WHERE usuario = ?';
      db.query(checkAdminQuery, [correo], (err, result) => {
        if (err) {
          console.error('Error al verificar administrador:', err);
          return res.status(500).json({ error: 'Error en el servidor al verificar el administrador' });
        }

        // Si se encuentra un administrador con el mismo correo
        if (result.length > 0) {
          return res.status(400).json({ error: 'El correo ya está registrado como usuario administrador' });
        }

        // Si no existen coincidencias, insertar el nuevo alumno
        const insertAlumnoQuery = `
          INSERT INTO alumnos (nombre_completo, correo, telefono, no_control, foto, contrasena, fecha_registro)
          VALUES (?, ?, ?, ?, ?, ?, NOW())
        `;

        // Insertar también el no_control en la tabla peticiones
        const insertAlumnoQueryPeticion = `
          INSERT INTO peticiones (no_control) VALUES (?)
        `;

        db.query(insertAlumnoQuery, [nombre_completo, correo, telefono, no_control, foto, contrasena], (err, result) => {
          if (err) {
            console.error('Error al registrar alumno:', err);
            return res.status(500).json({ error: 'Error en el servidor al registrar el alumno' });
          }

          // Insertar en la tabla peticiones después de registrar al alumno
          db.query(insertAlumnoQueryPeticion, [no_control], (err) => {
            if (err) {
              console.error('Error al insertar no_control en la tabla peticiones:', err);
              return res.status(500).json({ error: 'Error en el servidor al registrar la petición del alumno' });
            }

            // Registro exitoso
            res.status(201).json({
              message: 'Alumno registrado exitosamente y petición creada',
              alumnoId: result.insertId
            });
          });
        });
      });
    });
  });
});

//------------------------------------------------------------Nueva Ruta------------------------------------------------------------//
// Ruta para insertar peticion (desde departamento)
app.post('/departamento/insertar-peticion', (req, res) => {
  const {
    alumnoNoControl,
    peticionEstatus,
    adeudoEstado,
    usuarioDepartamento,
    usuarioDepartamentoId,
    alumnoComentario // Comentario del alumno
  } = req.body;

  // Verificar si el alumno existe
  const queryAlumno = `SELECT * FROM alumnos WHERE no_control = ?`;
  db.query(queryAlumno, [alumnoNoControl], (err, alumnoResults) => {
    if (err) {
      console.error('Error al verificar el alumno:', err);
      return res.status(500).json({ error: 'Error al verificar el alumno' });
    }

    if (alumnoResults.length === 0) {
      return res.status(404).json({ error: 'Alumno no encontrado' });
    }

    // Verificar si el usuario del departamento existe y tiene el rol adecuado
    const queryDepartamento = `SELECT * FROM departamentos WHERE usuario = ? AND departamento_id = ?`;
    db.query(queryDepartamento, [usuarioDepartamento, usuarioDepartamentoId], (err, departamentoResults) => {
      if (err) {
        console.error('Error al verificar el departamento:', err);
        return res.status(500).json({ error: 'Error al verificar el departamento' });
      }

      if (departamentoResults.length === 0) {
        return res.status(404).json({ error: 'Departamento no encontrado o no tiene los permisos adecuados' });
      }

      // Determinar la columna de comentario basada en el departamento
      let columnaComentario = '';
      switch (usuarioDepartamentoId) {
        case 'administracion_finanzas':
          columnaComentario = 'comentario_administracion_y_finanzas';
          break;
        case 'centro_informacion':
          columnaComentario = 'comentario_centro_de_informacion';
          break;
        case 'centro_computo':
          columnaComentario = 'comentario_centro_de_computo';
          break;
        case 'recursos_materiales':
          columnaComentario = 'comentario_recursos_materiales';
          break;
        case 'departamento_vinculacion':
          columnaComentario = 'comentario_departamento_de_vinculacion';
          break;
        default:
          return res.status(400).json({ error: 'Departamento no válido' });
      }

      // Si todo es correcto, proceder a actualizar la tabla `peticiones`
      const queryUpdatePeticion = `
        UPDATE peticiones
        SET ${peticionEstatus} = ?, ${columnaComentario} = ?, estatus_peticion = 'Actualizado'
        WHERE no_control = ?
      `;

      // Ejecutar la consulta para actualizar el estado y el comentario
      db.query(queryUpdatePeticion, [adeudoEstado, alumnoComentario, alumnoNoControl], (err, result) => {
        if (err) {
          console.error('Error al actualizar la petición:', err);
          return res.status(500).json({ error: 'Error al actualizar la petición' });
        }

        if (result.affectedRows === 0) {
          return res.status(404).json({ error: 'No se encontró la petición para actualizar' });
        }

        res.status(200).json({ message: 'Petición actualizada correctamente' });
      });
    });
  });
});

//------------------------------------------------------------Nueva Ruta------------------------------------------------------------//
// Petición para actualizar datos de un alumno (solo administradores)

app.post('/admin/actualizar-peticion-Adm', (req, res) => {
  // Recuperamos los datos del cuerpo de la solicitud
  const datosAlumnoModalAdmin = req.body;
  console.log('Datos del cuerpo de la solicitud:', datosAlumnoModalAdmin);

  let user;
  try {
    // Verificar y parsear el encabezado de autorización
    user = JSON.parse(req.headers.authorization);
    console.log('Datos del usuario autenticado:', user);
  } catch (err) {
    console.error('Error al parsear el encabezado de autorización:', err);
    return res.status(400).json({
      mensaje: 'El encabezado de autorización no es válido',
      error: err.message,
    });
  }

  // Verificamos si el tipo de usuario es "Admin"
  if (user.tipo_usuario !== 'admin') {
    console.log('Acceso denegado: El tipo de usuario no es Admin');
    return res.status(403).json({ mensaje: 'No autorizado, se requiere ser administrador' });
  }

  // Validar si el administrador existe en la base de datos
  const queryAdmin = 'SELECT * FROM administrador WHERE usuario = ? AND contrasena = ?';
  console.log('Verificando administrador:', queryAdmin, [user.correo, user.contrasena]);

  db.query(queryAdmin, [user.correo, user.contrasena], (err, result) => {
    if (err) {
      console.error('Error al verificar el administrador:', err);
      return res.status(500).json({
        mensaje: 'Error al verificar el administrador',
        error: err.message,
      });
    }

    if (result.length === 0) {
      console.log('Administrador no encontrado o contraseña incorrecta');
      return res.status(401).json({ mensaje: 'Usuario o contraseña incorrectos' });
    }

    console.log('Administrador autenticado correctamente');

    // Actualizar datos del alumno en la tabla `alumnos`
    const updateAlumnoQuery = `
      UPDATE alumnos
      SET nombre_completo = ?, correo = ?, telefono = ?, contrasena = ?, fecha_registro = ?
      WHERE no_control = ?
    `;
    console.log('Actualizando datos del alumno:', updateAlumnoQuery);

    db.query(updateAlumnoQuery, [
      datosAlumnoModalAdmin.alumnoNombre,
      datosAlumnoModalAdmin.alumnoCorreo,
      datosAlumnoModalAdmin.alumnoTelefono,
      datosAlumnoModalAdmin.alumnoContrasena,
      datosAlumnoModalAdmin.alumnoFechaRegistro,
      datosAlumnoModalAdmin.alumnoNoControl,
    ], (err, resultAlumno) => {
      if (err) {
        console.error('Error al actualizar datos del alumno:', err);
        return res.status(500).json({
          mensaje: 'Error al actualizar datos del alumno',
          error: err.message,
        });
      }

      console.log('Datos del alumno actualizados correctamente:', resultAlumno);

      // Actualizar datos en la tabla `peticiones`
      const updatePeticionQuery = `
        UPDATE peticiones
        SET estatus_administracion_y_finanzas = ?, estatus_centro_de_informacion = ?,
            estatus_centro_de_computo = ?, estatus_recursos_materiales = ?,
            estatus_departamento_de_vinculacion = ?, comentario_administracion_y_finanzas = ?,
            comentario_centro_de_informacion = ?, comentario_centro_de_computo = ?,
            comentario_recursos_materiales = ?, comentario_departamento_de_vinculacion = ?,
            estatus_peticion = ?
        WHERE no_control = ?
      `;
      console.log('Actualizando datos de la petición:', updatePeticionQuery);

      db.query(updatePeticionQuery, [
        datosAlumnoModalAdmin.alumnoEstatusAFModal,
        datosAlumnoModalAdmin.alumnoEstatusCIModal,
        datosAlumnoModalAdmin.alumnoEstatusCCModal,
        datosAlumnoModalAdmin.alumnoEstatusRMModal,
        datosAlumnoModalAdmin.alumnoEstatusDVModal,
        datosAlumnoModalAdmin.alumnoComentarioAdministracionFinanzasModal,
        datosAlumnoModalAdmin.alumnoComentarioCentroInformacionModal,
        datosAlumnoModalAdmin.alumnoComentarioCentroComputo,
        datosAlumnoModalAdmin.alumnoComentarioRecursosMateriales,
        datosAlumnoModalAdmin.alumnoComentarioDepartamentoVinculacion,
        'Pendiente',
        datosAlumnoModalAdmin.alumnoNoControl,
      ], (err, resultPeticion) => {
        if (err) {
          console.error('Error al actualizar datos de la petición:', err);
          return res.status(500).json({
            mensaje: 'Error al actualizar datos de la petición',
            error: err.message,
          });
        }

        console.log('Datos de la petición actualizados correctamente:', resultPeticion);
        return res.status(200).json({ mensaje: 'Datos actualizados correctamente' });
      });
    });
  });
});



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
