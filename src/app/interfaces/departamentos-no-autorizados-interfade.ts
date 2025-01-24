export interface DepartamentosResponse {
  departamentosNoAutorizados: {
    usuario: string;
    contrasena: string;
    nombre_departamento: string;
    departamento_id: string;
    fecha_registro: string;
  }[];
}
