import { Component, OnInit } from '@angular/core';
import { PeticionesService } from '../../../../service/peticion.service';

@Component({
  selector: 'app-departamentos',
  templateUrl: './departamentos.component.html',
  styleUrls: ['./departamentos.component.css']
})
export class DepartamentosComponent implements OnInit {
  // Datos por defecto para evitar errores mientras se cargan los datos
  departamentos: any[] = [];
  usuario: string = '';
  contrasena: string = '';
  departamento: string = '';
  departamentoId: string = '';
  fechaRegistro: string = '';

  // Objeto inicial vacío para asegurar que no se generen errores
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

  obtenerDepartamentosNoAutorizados(): void {
    this.peticionesService.obtenerDepartamentosNoAutorizados().subscribe(
      (data) => {
        this.departamentos = data || []; // Aseguramos que siempre sea un array
        console.log('Departamentos actualizados:', this.departamentos);
      },
      (error) => {
        console.error('Error al obtener los departamentos:', error);
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
      fechaRegistro: this.fechaRegistro
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

    console.log('Auth Data:', authData);
    console.log('Departamento autorizado:', departamentoAutorizado);

    this.peticionesService.insertarDepartamentoAutorizado(departamentoAutorizado, authData).subscribe(
      (res) => {
        console.log('Departamento autorizado con éxito:', res);
        alert('Departamento autorizado con éxito');

        // Actualizamos la lista
        this.obtenerDepartamentosNoAutorizados();
      },
      (error) => {
        console.error('Error al autorizar el departamento:', error);
        alert('Error al autorizar el departamento');
      }
    );
  }
}
