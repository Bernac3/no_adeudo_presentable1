export interface Departamento {
  iddepartamentos: number;
  nombre_departamento: string;
  usuario: string;
  contrasena: string;
  departamento_id: string;
  rol: string;
  // 🚀 Campos de la tabla 'peticiones'
  // estatus_administracion_y_finanzas?: string;
  // estatus_centro_de_informacion?: string;
  // estatus_centro_de_computo?: string;
  // estatus_recursos_materiales?: string;
  // estatus_departamento_de_vinculacion?: string;
  // comentario_administracion_y_finanzas?: string;
  // comentario_centro_de_informacion?: string;
  // comentario_centro_de_computo?: string;
  // comentario_recursos_materiales?: string;
  // comentario_departamento_de_vinculacion?: string;
  // estatus_peticion?: string;
}
