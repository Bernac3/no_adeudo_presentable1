import { Component, OnInit } from '@angular/core';
import { PeticionesService } from '../../../../service/peticion.service';

@Component({
  selector: 'app-departamentos',
  templateUrl: './departamentos.component.html',
  styleUrls: ['./departamentos.component.css']
})
export class DepartamentosComponent implements OnInit {
  departamentos: any[] = []; // Variable para almacenar los departamentos
  usuario: string = '';
  contrasena: string = '';
  departamento: string = '';
  departamentoId: string = '';
  fechaRegistro: string = '';

  constructor(private peticionesService: PeticionesService) {}

  ngOnInit(): void {
    this.obtenerDepartamentosNoAutorizados();
  }

  obtenerDepartamentosNoAutorizados(): void {
    // Llamamos al servicio para obtener los departamentos
    this.peticionesService.obtenerDepartamentosNoAutorizados().subscribe(
      (data) => {
        this.departamentos = data; // Guardamos los datos obtenidos
        console.log('Departamentos actualizados:', this.departamentos);
      },
      (error) => {
        console.error('Error al obtener los departamentos:', error);
      }
    );
  }

  verDetalles(usuario: string, contrasena: string, departamento: string, fechaRegistro: string, departamentoId: string): void {
    this.usuario = usuario;
    this.contrasena = contrasena;
    this.departamento = departamento;
    this.fechaRegistro = fechaRegistro;
    this.departamentoId = departamentoId;
  }

  permitirDepartamentoAutorizado(): void {
    const departamentoAutorizado = {
      usuario: this.usuario,
      contrasena: this.contrasena,
      departamento: this.departamento,
      departamentoId: this.departamentoId,
      fechaRegistro: this.fechaRegistro,
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
      authData.correo = parsedData.correo || ''; // En la DB el campo "correo" se llama "usuario"
      authData.contrasena = parsedData.contrasena || '';
    }

    console.log('Auth Data:', authData);
    console.log('Departamento autorizado:', departamentoAutorizado);

    this.peticionesService.insertarDepartamentoAutorizado(departamentoAutorizado, authData).subscribe(
      (res) => {
        console.log('Departamento autorizado con éxito:', res);
        alert('Departamento autorizado con éxito');

        // Llamar a obtenerDepartamentosNoAutorizados para actualizar la lista
        this.obtenerDepartamentosNoAutorizados();
      },
      (error) => {
        console.error('Error al autorizar el departamento:', error);
        alert('Error al autorizar el departamento');
      }
    );
  }
}

