import { Component } from '@angular/core';
import { Departamento } from '../../interfaces/departamento.intarface';
import { AuthService } from '../../service/auth.service';
import { Alumno } from '../../interfaces/alumno.interface';

@Component({
  selector: 'app-verificar',
  templateUrl: './verificar.component.html',
  styleUrl: './verificar.component.css'
})
export class VerificarComponent {
  menuOptions = [
    {
      click: 'list',
      routerLink: 'list',
      selectedClass: 'bg-primary text-white',
      iconPath: 'M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5',
      label: 'Lista Alumnos',
    },

    {
      click: 'info',
      routerLink: 'info',
      selectedClass: 'bg-primary text-white',
      iconPath: 'M0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm8.93 4.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533zM8 5.5a1 1 0 1 0 0-2 1 1 0 0 0 0 2',
      label: 'Info',
    },
  ];


  usuario: Alumno | null = null; // Variable para almacenar los datos del alumno

    constructor(private authService: AuthService) {}

    ngOnInit(): void {
      // Obtenemos los datos del alumno desde el AuthService
      this.authService.getUser().subscribe((data) => {
        this.usuario = data; // Asignamos los datos del alumno
      });
    }
}
