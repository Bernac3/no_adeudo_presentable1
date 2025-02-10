
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DepartamentoService {
  private apiUrl = `${window.location.origin}/departamento/register-departamento`
  private apiUrlObtenerDepartamentos = `${window.location.origin}/admin/obtener-departamento`
  private apiUrlGuardarDepartamentoAdmin = `${window.location.origin}/admin/guardar-departamento-adm`
  private apiUrlEliminarDepartamentoAdmin = `${window.location.origin}/admin/eliminar-departamento-adm`
  private apiUrlEliminarAlumnoAdmin = `${window.location.origin}/admin/eliminar-alumno-adm`
  private apiUrlCrearDepartamentoAdmin = `${window.location.origin}/admin/crear-departamento-admin`

  constructor(private http: HttpClient) {}

  registrarDepartamento(formData: FormData): Observable<any> {
    return this.http.post<any>(this.apiUrl, formData);
  }
  // En tu archivo departamento.service.ts
  crearDepartamentoAdmin(nuevoDepartamentoAdmin: any, authData: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': JSON.stringify(authData)
    });
    console.log('')

    // Enviar los datos como JSON
    return this.http.post(`${this.apiUrlCrearDepartamentoAdmin}`, nuevoDepartamentoAdmin, { headers });
  }

  obtenerDepartamentos(authData: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': JSON.stringify(authData)
    });

    return this.http.post(this.apiUrlObtenerDepartamentos, {}, { headers });
  }

  guardarDepartamentoAdmin(departamentoModal: any, authData: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': JSON.stringify(authData)
    });

    // Realizar la llamada para hacer el update en la tabla departamentos
    return this.http.post(`${this.apiUrlGuardarDepartamentoAdmin}`, departamentoModal, { headers });
  }

  eliminarDepartamentoAdmin(idDepartamento: any, authData: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': JSON.stringify(authData)
    });

    return this.http.post(`${this.apiUrlEliminarDepartamentoAdmin}`, idDepartamento, { headers });
  }
  eliminarAlumnoAdminModal(idAlumno: string, authData: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': JSON.stringify(authData), // Asegúrate de que `authData` sea un JSON válido
    });

    // El cuerpo de la solicitud debe ser un JSON válido
    const body = { alumnoId: idAlumno };

    return this.http.post(this.apiUrlEliminarAlumnoAdmin, body, { headers });
  }

}
