// nav.component.ts

import { Component, Input  } from '@angular/core';
import { Router } from '@angular/router';  // Importar Router para redirección
import { AuthService } from '../../service/auth.service'

@Component({
  selector: 'shared-nav',
  templateUrl: './nav.component.html',
})
export class NavComponent {

  @Input() usuario: any;  // Recibir el objeto alumno como una propiedad de entrada


  selectedLink: string = 'capital';

  constructor(private authService: AuthService, private router: Router) {}

  selectLink(link: string) {
    this.selectedLink = link;
  }

  homeLink(link: string) {
    this.selectedLink = link;
  }

  // Cerrar sesión
  logout(): void {
    this.authService.logout();  // Llamar al método logout del servicio
    this.router.navigate(['/login']);  // Redirigir al usuario a la página de login (ajusta la ruta según tu configuración)
  }

}
