import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../../app/config';

@Injectable({
  providedIn: 'root'
})
export class AlumnoService {
  private apiUrl = `${API_BASE_URL}/alumno/register`;

  constructor(private http: HttpClient) {}

  registrarAlumno(formData: FormData): Observable<any> {
    return this.http.post<any>(this.apiUrl, formData);
  }
}
