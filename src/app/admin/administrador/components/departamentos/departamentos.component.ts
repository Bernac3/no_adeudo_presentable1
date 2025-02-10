import { Component, OnInit, AfterViewInit } from '@angular/core';
import { PeticionesService } from '../../../../service/peticion.service';
import { DepartamentosResponse } from '../../../../interfaces/departamentos-no-autorizados-interfade';

declare var bootstrap: any; // Importación de Bootstrap

@Component({
  selector: 'app-departamentos',
  templateUrl: './departamentos.component.html',
  styleUrls: ['./departamentos.component.css']
})
export class DepartamentosComponent implements OnInit, AfterViewInit {
  departamentos: any[] = [];

  departamentoSeleccionado: any = {
    usuario: '',
    contrasena: '',
    nombre_departamento: '',
    departamento_id: '',
    fecha_registro: ''
  };

  constructor(private peticionesService: PeticionesService) {}

  ngOnInit(): void {
    this.obtenerDepartamentosNoAutorizados();
  }

  ngAfterViewInit(): void {
    const modalElement = document.getElementById('alumnoModal');

    if (modalElement) {
      modalElement.addEventListener('hidden.bs.modal', () => {
        // Quitamos el foco de los botones o elementos internos al cerrar el modal
        (document.activeElement as HTMLElement)?.blur();
      });
    }
  }

  obtenerDepartamentosNoAutorizados(): void {
    this.peticionesService.obtenerDepartamentosNoAutorizados().subscribe(
      (response: DepartamentosResponse) => {
        this.departamentos = response.departamentosNoAutorizados || [];
      }
    );
  }

  verDetalles(usuario: string, contrasena: string, departamento: string, fechaRegistro: string, departamentoId: string): void {
    this.departamentoSeleccionado = {
      usuario,
      contrasena,
      nombre_departamento: departamento,
      departamento_id: departamentoId,
      fecha_registro: fechaRegistro
    };
  }

  permitirDepartamentoAutorizado(): void {
    const departamentoAutorizado = {
      usuario: this.departamentoSeleccionado.usuario,
      contrasena: this.departamentoSeleccionado.contrasena,
      departamento: this.departamentoSeleccionado.nombre_departamento,
      departamentoId: this.departamentoSeleccionado.departamento_id,
      fechaRegistro: this.departamentoSeleccionado.fecha_registro
    };

    const authData = {
      tipo_usuario: '',
      correo: '',
      contrasena: ''
    };

    const sessionAuthData = sessionStorage.getItem('user');
    if (sessionAuthData) {
      const parsedData = JSON.parse(sessionAuthData);
      authData.tipo_usuario = parsedData.tipo_usuario ? parsedData.tipo_usuario.toLowerCase() : '';
      authData.correo = parsedData.correo || '';
      authData.contrasena = parsedData.contrasena || '';
    }

    this.peticionesService.insertarDepartamentoAutorizado(departamentoAutorizado, authData).subscribe(
      (res) => {
        alert('Departamento autorizado con éxito');
        this.obtenerDepartamentosNoAutorizados();

        // Cerrar el modal manualmente después de autorizar
        const modalElement = document.getElementById('alumnoModal');
        if (modalElement) {
          const modalInstance = bootstrap.Modal.getInstance(modalElement);
          modalInstance?.hide();
        }
      },
      (error) => {
        console.error('Error al autorizar el departamento:', error);
        alert('Error al autorizar el departamento');
      }
    );
  }
}
