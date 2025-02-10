import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DepartamentosResponse } from '../interfaces/departamentos-no-autorizados-interfade';

@Injectable({
  providedIn: 'root'
})
export class PeticionesService {
  private apiUrl = `${window.location.origin}/departamento/insertar-peticion`
  private apiUrlAdmin = `${window.location.origin}/admin/actualizar-peticion-Adm`
  private apiUrlDepartamentosNoAutorizados = `${window.location.origin}/admin/departamentos-no-autorizados`
  private apiUrlInsertarDepartamentosNoAutorizados = `${window.location.origin}/admin/insertar-departamentos-no-autorizados`
  private apiUrlInsertarAdmn = `${window.location.origin}/admin/insertar-admin`

  constructor(private http: HttpClient) {}

  insertarPeticion(datos: any): Observable<any> {
    return this.http.post(`${this.apiUrl}`, datos);
  }

  insertarPeticionAdmin(datosAlumno: any, authData: any): Observable<any> {

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': JSON.stringify(authData)  // Añadimos el encabezado Authorization
    });

    return this.http.post(`${this.apiUrlAdmin}`, datosAlumno, { headers });
  }

  obtenerDepartamentosNoAutorizados(): Observable<DepartamentosResponse> {
    return this.http.get<DepartamentosResponse>(this.apiUrlDepartamentosNoAutorizados);
  }

  insertarDepartamentoAutorizado(datosDepartamento: any, authData: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': JSON.stringify(authData)
    });

    return this.http.post(`${this.apiUrlInsertarDepartamentosNoAutorizados}`, datosDepartamento, { headers });
  }

  crearAdministrativo(datosAdmin: any, authData: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': JSON.stringify(authData)
    });

    return this.http.post(`${this.apiUrlInsertarAdmn}`, datosAdmin, { headers });
  }
}
