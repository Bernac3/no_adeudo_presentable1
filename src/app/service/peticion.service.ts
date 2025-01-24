import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PeticionesService {
  private apiUrl = 'https://no-adeudo-repositorio-1.onrender.com/departamento/insertar-peticion';  // API de inserción de peticiones

  private apiUrlAdmin = 'https://no-adeudo-repositorio-1.onrender.com/admin/actualizar-peticion-Adm';  // API de inserción de peticiones

  private apiUrlDepartamentosNoAutorizados = 'https://no-adeudo.onrender.com/admin/departamentos-no-autorizados';

  private apiUrlInsertarDepartamentosNoAutorizados = 'http://localhost:3000/api/insertar-departamentos-no-autorizados';
  private apiUrlInsertarAdmn = 'http://localhost:3000/api/insertar-admin'

  constructor(private http: HttpClient) {}

  insertarPeticion(datos: any): Observable<any> {
    console.log('Datos enviados para insertar la petición:', datos);  // Log de los datos que se envían
    return this.http.post(`${this.apiUrl}`, datos);
  }


  insertarPeticionAdmin(datosAlumno: any, authData: any): Observable<any> {

    console.log(`Insertar Peticion Admin Service:  ${this.apiUrlAdmin}`)
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': JSON.stringify(authData)  // Añadimos el encabezado Authorization
    });

    return this.http.post(`${this.apiUrlAdmin}`, datosAlumno, { headers });
  }

  obtenerDepartamentosNoAutorizados(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrlDepartamentosNoAutorizados).pipe(
      map((data) => data || []), // Si data es null/undefined, retorna un array vacío
      catchError((error) => {
        console.error('Error al obtener departamentos:', error);
        return of([]); // Retorna un array vacío en caso de error
      })
    );
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
