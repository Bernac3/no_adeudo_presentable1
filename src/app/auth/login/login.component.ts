import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  correo: string = '';
  contrasena: string = '';
  errorMessage: string | null = null; // Variable para el mensaje de error

  constructor(private authService: AuthService, private router: Router) {}

  login(): void {
    console.log('Iniciando login...');
    console.log('Correo:', this.correo);
    console.log('Contraseña:', this.contrasena);

    this.authService.login(this.correo, this.contrasena).subscribe(
      (user) => {
        console.log('Respuesta del servidor:', user);

        this.authService.setUser(user);

        console.log('TIPO DE USUARIO DEL LOGIN: ' + user.rol)

        // Redirigir según el rol del usuario
        if (user.rol === 'alumno') {
          this.router.navigate(['/alumno/home']);
        } else if (user.rol === 'departamento') {
          this.router.navigate(['/departamentos/list']);
        } else if (user.rol === 'admin') {
          this.router.navigate(['/admin/list']);
        }

        this.errorMessage = null; // Limpiar mensaje de error si el login fue exitoso
      },
      (error) => {
        console.error('Error en el login:', error);
        this.errorMessage = 'Credenciales incorrectas'; // Mostrar mensaje de error en el HTML
      }
    );
  }

  goToRagister(): void {
    this.router.navigate(['/auth/register']);
  }
}
