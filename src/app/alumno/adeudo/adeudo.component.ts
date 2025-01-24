import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../service/auth.service'; // Importa el servicio AuthService
import { Alumno } from '../../interfaces/alumno.interface'; // Importa la interfaz Alumno

@Component({
  selector: 'app-adeudo',
  templateUrl: './adeudo.component.html',
  styleUrls: ['./adeudo.component.css']
})
export class AdeudoComponent implements OnInit {
  menuOptions = [
    {
      click: 'home',
      routerLink: 'home',
      selectedClass: 'bg-primary text-white',
      iconPath: 'M8.354 1.146a.5.5 0 0 0-.708 0l-6 6A.5.5 0 0 0 1.5 7.5v7a.5.5 0 0 0 .5.5h4.5a.5.5 0 0 0 .5-.5v-4h2v4a.5.5 0 0 0 .5.5H14a.5.5 0 0 0 .5-.5v-7a.5.5 0 0 0-.146-.354L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293zM2.5 14V7.707l5.5-5.5 5.5 5.5V14H10v-4a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5v4z',
      label: 'Home',
    },
    {
      click: 'archivo',
      routerLink: 'archivo',
      selectedClass: 'bg-primary text-white',
      iconPath: 'M0 2a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1v7.5a2.5 2.5 0 0 1-2.5 2.5h-9A2.5 2.5 0 0 1 1 12.5V5a1 1 0 0 1-1-1zm2 3v7.5A1.5 1.5 0 0 0 3.5 14h9a1.5 1.5 0 0 0 1.5-1.5V5zm13-3H1v2h14zM5 7.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5',
      label: 'Archivo',
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
