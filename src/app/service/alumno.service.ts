import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AlumnoService {
  private apiUrl = 'https://no-adeudo.onrender.com/alumno/register';

  constructor(private http: HttpClient) {}

  registrarAlumno(formData: FormData): Observable<any> {
    return this.http.post<any>(this.apiUrl, formData);
  }
}
