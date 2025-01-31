import { Component, OnInit } from '@angular/core';
import { DepartamentoService } from '../../../../service/departamento.service';

@Component({
  selector: 'app-gestion-departamento',
  templateUrl: './gestion-departamento.component.html',
  styleUrls: ['./gestion-departamento.component.css']
})
export class GestionDepartamentoComponent implements OnInit {
  departamentos: any[] = [];
  departamentoSeleccionado: any = null;
  mostrarContrasena: boolean = false;

  constructor(private departamentoService: DepartamentoService) {}

  ngOnInit(): void {
    this.obtenerDepartamentos();
  }

  obtenerDepartamentos(): void {
    const authData = { usuario: '', contrasena: '' };
    const sessionAuthData = sessionStorage.getItem('user');
    if (sessionAuthData) {
      const parsedData = JSON.parse(sessionAuthData);
      authData.usuario = parsedData.correo || '';
      authData.contrasena = parsedData.contrasena || '';
    }

    this.departamentoService.obtenerDepartamentos(authData).subscribe(
      (response) => {
        this.departamentos = response.departamentos;
      },
      (error) => {
        console.error('Error al obtener los departamentos:', error);
      }
    );
  }

  mostrarDetalles(departamento: any): void {
    this.departamentoSeleccionado = departamento;
  }

  guardarDepartamentoAdmin(): void {
    const usuario = (document.getElementById('departamentoNombre') as HTMLInputElement).value;
    const contrasena = (document.getElementById('alumnoContrasena') as HTMLInputElement).value;

    if (!usuario || !contrasena) {
      alert('Por favor, complete todos los campos.');
      return;
    }

    const { iddepartamentos } = this.departamentoSeleccionado;
    const nuevoDepartamento = { usuario, contrasena, iddepartamentos };

    const authData = this.obtenerAuthData();

    this.departamentoService.guardarDepartamentoAdmin(nuevoDepartamento, authData).subscribe(
      (res) => {
        alert('Departamento autorizado con éxito');
        this.obtenerDepartamentos(); // Actualizar la lista de departamentos
      },
      (error) => {
        console.error('Error al autorizar el departamento:', error);
        alert('Error al autorizar el departamento');
      }
    );
  }

  eliminarDepartamentoAdmin(): void {
    const departamentoId = (document.getElementById('departamentoid') as HTMLInputElement).value;

    if (!departamentoId) {
      alert('No se ha seleccionado un departamento válido para eliminar.');
      return;
    }

    if (window.confirm('¿Desea eliminar el departamento?')) {
      const departamentoData = { departamentoId };
      const authData = this.obtenerAuthData();

      this.departamentoService.eliminarDepartamentoAdmin(departamentoData, authData).subscribe(
        (res) => {
          alert('Departamento Eliminado');
          this.obtenerDepartamentos(); // Actualizar la lista de departamentos
        },
        (error) => {
          console.error('Error Eliminar Departamento:', error);
          alert('Error al Eliminar Departamento');
        }
      );
    } else {
    }
  }

  obtenerAuthData() {
    const authData = { tipo_usuario: '', correo: '', contrasena: '' };
    const sessionAuthData = sessionStorage.getItem('user');
    if (sessionAuthData) {
      const parsedData = JSON.parse(sessionAuthData);
      authData.tipo_usuario = parsedData.tipo_usuario ? parsedData.tipo_usuario.toLowerCase() : '';
      authData.correo = parsedData.correo || '';
      authData.contrasena = parsedData.contrasena || '';
    }
    return authData;
  }

  toggleMostrarContrasena(): void {
    this.mostrarContrasena = !this.mostrarContrasena;
  }
}
