import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';  // Importar el operador debounceTime
import { AuthService } from '../../../../service/auth.service';
import { Alumno as Usuario } from '../../../../interfaces/alumno.interface';
import { PeticionesService } from '../../../../service/peticion.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {

  usuario: Usuario | null = null; // estos son los datos del usuario que inicio sesion

  alumnosConPeticiones: any[] = [];
  alumnosOriginales: any[] = [];

  searchTermControl: FormControl = new FormControl(''); // Crear un FormControl para el input de búsqueda

  adeudoEstado: string | null = null; // Puede ser 'Sin Adeudo', 'Con Adeudo' o null.

  // datos peticion
  alumnoComentario: string = ''

  constructor(private authService: AuthService, private peticionesService: PeticionesService) {}

  ngOnInit(): void {
    this.authService.getAlumnosYPeticiones().subscribe(
      (data) => {
        this.alumnosConPeticiones = data;
        this.alumnosOriginales = [...data];  // Guardamos una copia de los datos completos
        console.log('Datos de alumnos con peticiones:', this.alumnosConPeticiones);
      },
      (error) => {
        console.error('Error al obtener los datos de los alumnos:', error);
      }
    );

    // Aplicar debounceTime al control de búsqueda
    this.searchTermControl.valueChanges.pipe(
      debounceTime(1000)  // Esperar 1 segundo después de la última escritura
    ).subscribe((searchTerm) => {
      this.buscarAlumnos(searchTerm);  // Ejecutar la búsqueda automáticamente
    });

    // Obtener los datos del Usuaro Departamento
    this.authService.getUser().subscribe((data) => {
      this.usuario = data; // Asignamos los datos del alumno
      console.log(`Datos List.component: User: ${this.usuario?.usuario} Departamento: ${this.usuario?.departamento_id}`)
    });
  }

  cargarDatosModal(alumno: any): void {
    const alumnoNombre = document.getElementById('alumnoNombre');
    const alumnoCorreo = document.getElementById('alumnoCorreo');
    const alumnoTelefono = document.getElementById('alumnoTelefono');
    const alumnoNoControl = document.getElementById('alumnoNoControl');
    const alumnoFechaRegistro = document.getElementById('alumnoFechaRegistro');
    const alumnoFoto = document.getElementById('alumnoFoto') as HTMLImageElement;

    if (alumnoNombre) alumnoNombre.textContent = alumno.nombre_completo;
    if (alumnoCorreo) alumnoCorreo.textContent = alumno.correo;
    if (alumnoTelefono) alumnoTelefono.textContent = alumno.telefono;
    if (alumnoNoControl) alumnoNoControl.textContent = alumno.no_control;
    if (alumnoFechaRegistro) {
      const fecha = new Date(alumno.fecha_registro);
      alumnoFechaRegistro.textContent = `${fecha.getDate().toString().padStart(2, '0')}/${(fecha.getMonth() + 1)
        .toString()
        .padStart(2, '0')}/${fecha.getFullYear()}`;
    }

    if (alumnoFoto) {
      alumnoFoto.src = `http://localhost:3000/uploads/${alumno.foto}`;
    }

    // switch aqui
    switch (this.usuario?.departamento_id) {
      case 'administracion_finanzas':
        this.alumnoComentario = alumno.comentario_administracion_y_finanzas;
        break;
      case 'centro_informacion':
        this.alumnoComentario = alumno.centro_informacion;
      break;
      case 'centro_computo':
        this.alumnoComentario = alumno.centro_computo;
      break;
      case 'recursos_materiales':
        this.alumnoComentario = alumno.recursos_materiales;
      break;
      case 'departamento_vinculacion':
        this.alumnoComentario = alumno.departamento_vinculacion;
      break;
    }


  }

  clearComment(): void {
    this.alumnoComentario = ''; // Limpia el comentario cuando el textarea recibe enfoque.
  }


  ordenarAlumnos(opcion: string, event: Event): void {
    event.preventDefault();
    switch(opcion) {
      case 'nombre-asc':
        this.alumnosConPeticiones.sort((a, b) => a.nombre_completo.localeCompare(b.nombre_completo));
        break;
      case 'nombre-desc':
        this.alumnosConPeticiones.sort((a, b) => b.nombre_completo.localeCompare(a.nombre_completo));
        break;
      case 'nuevos':
        this.alumnosConPeticiones.sort((a, b) => new Date(b.fecha_registro).getTime() - new Date(a.fecha_registro).getTime());
        break;
      case 'viejos':
        this.alumnosConPeticiones.sort((a, b) => new Date(a.fecha_registro).getTime() - new Date(b.fecha_registro).getTime());
        break;
    }
  }

  // Función para realizar la búsqueda automática
  buscarAlumnos(searchTerm: string): void {
    if (searchTerm) {
      this.alumnosConPeticiones = this.alumnosOriginales.filter(alumno => {
        const nombreValido = alumno.nombre_completo ? alumno.nombre_completo.toLowerCase() : '';
        const noControlValido = alumno.no_control ? alumno.no_control.toLowerCase() : '';
        const correoValido = alumno.correo ? alumno.correo.toLowerCase() : '';

        return nombreValido.includes(searchTerm.toLowerCase()) ||
               noControlValido.includes(searchTerm.toLowerCase()) ||
               correoValido.includes(searchTerm.toLowerCase());
      });
    } else {
      this.alumnosConPeticiones = [...this.alumnosOriginales];
    }
  }

  // Funcion para Establecer Campo Adeudo a Alumno
  setEstadoAdeudoAlumno(): void {
    const alumnoNoControl = document.getElementById('alumnoNoControl')?.textContent;

    console.log('comentario: ' + this.alumnoComentario);
    const usuarioDepartamento = this.usuario?.usuario;
    const usuarioDepartamentoId = this.usuario?.departamento_id;

    let peticionEstatus;

    switch (this.usuario?.departamento_id) {
      case 'administracion_finanzas':
        peticionEstatus = 'estatus_administracion_y_finanzas';
        break;
      case 'centro_informacion':
        peticionEstatus = 'estatus_centro_de_informacion';
        break;
      case 'centro_computo':
        peticionEstatus = 'estatus_centro_de_computo';
        break;
      case 'recursos_materiales':
        peticionEstatus = 'estatus_recursos_materiales';
        break;
      case 'departamento_vinculacion':
        peticionEstatus = 'estatus_departamento_de_vinculacion';
        break;
    }

    const alumnoComentario = this.alumnoComentario;
    const datos = {
      alumnoNoControl,
      peticionEstatus,
      adeudoEstado: this.adeudoEstado,
      usuarioDepartamento,
      usuarioDepartamentoId,
      alumnoComentario
    };

    console.log(datos);

    this.peticionesService.insertarPeticion(datos).subscribe(
      response => {
        // Mostrar alerta de éxito
        alert("Datos guardados con éxito");

        // Llamar nuevamente al servicio para actualizar los datos
        this.authService.getAlumnosYPeticiones().subscribe(
          (data) => {
            this.alumnosConPeticiones = data;
            this.alumnosOriginales = [...data];
            console.log('Datos actualizados de alumnos con peticiones:', this.alumnosConPeticiones);
          },
          (error) => {
            console.error('Error al actualizar los datos de los alumnos:', error);
          }
        );
      },
      error => {
        console.log('Error al insertar petición');
      }
    );

    this.adeudoEstado = '';
  }


guardarDatosEstado(): void {
  const etiquetaEstado = document.getElementById('etiquetaEstado'); // <p> completo
  const etiquetaEstadoSpan = document.getElementById('etiquetaEstadoSpan'); // <span> específico


  console.log(this.adeudoEstado)
  if (etiquetaEstado && etiquetaEstadoSpan && this.adeudoEstado) {
    // Configurar texto del span
    etiquetaEstadoSpan.textContent = this.adeudoEstado;

    // Remover clases previas
    etiquetaEstadoSpan.classList.remove('text-success', 'text-danger');

    // Agregar clase según el estado
    if (this.adeudoEstado === 'Con Adeudo') {
      etiquetaEstadoSpan.classList.add('text-danger');
    } else {
      etiquetaEstadoSpan.classList.add('text-success');
    }

    // Mostrar la etiqueta principal
    etiquetaEstado.classList.remove('d-none'); // Mostrar
    etiquetaEstado.classList.add('d-block');

    // Ocultar después de 3 segundos
    setTimeout(() => {
      etiquetaEstado.classList.remove('d-block'); // Ocultar
      etiquetaEstado.classList.add('d-none');
    }, 3000);
  }
   // default para los botones
}

setConAdeudoAlumno(): void {
  this.adeudoEstado = 'Con Adeudo';
  console.log('Con adeudo seleccionado');
}

setSinAdeudoAlumno(): void {
  this.adeudoEstado = 'Sin Adeudo';
  console.log('Sin adeudo seleccionado');
}

}
