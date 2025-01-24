export interface Alumno {
  id: number;  // Común para todos los usuarios, usaremos un solo campo para el id
  usuario: string;  // Nombre de usuario, puede ser para todos
  contrasena: string;  // Contraseña, común a todos
  rol: string;  // Común para todos los usuarios
  // Común para todos los usuarios
  nombre_completo?: string;  // Solo para Alumno (o Administrador si deseas mostrarlo)
  correo?: string;  // Solo para Alumno y Administrador
  telefono?: string;  // Solo para Alumno
  no_control?: string;  // Solo para Alumno
  foto?: string;  // Solo para Alumno
  fecha_registro?: string;  // Solo para Alumno

  // Campos específicos de Departamento
  departamento_id?: string;  // Solo para Departamento
  nombre_departamento?: string;  // Solo para Departamento

  // Campos específicos de Peticiones (para Alumno y Admin)
  estatus_administracion_y_finanzas?: string;
  estatus_centro_de_informacion?: string;
  estatus_centro_de_computo?: string;
  estatus_recursos_materiales?: string;
  estatus_departamento_de_vinculacion?: string;

  comentario_administracion_y_finanzas?: string;
  comentario_centro_de_informacion?: string;
  comentario_centro_de_computo?: string;
  comentario_recursos_materiales?: string;
  comentario_departamento_de_vinculacion?: string;
  
  comentario_alumno?: string;
  estatus_peticion?: string;

  // Campos específicos para Administrador
  departamento_creado?: boolean;
}
