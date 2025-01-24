import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlumnoService } from '../../service/alumno.service'
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private alumnoService: AlumnoService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      nombre_completo: ['', [Validators.required]],
      correo: ['', [Validators.required, Validators.email]],
      telefono: ['', [Validators.required]],
      no_control: ['', [Validators.required]],
      contrasena: ['', [Validators.required]],
      confirmarContrasena: ['', [Validators.required]],
      foto: [null, [Validators.required]]
    });
  }

  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      // Aquí se agrega el archivo al control, sin usar `patchValue` en el input de tipo `file`.
      this.registerForm.get('foto')?.setValue(file);
    }
  }

  onSubmit(): void {
    if (this.registerForm.invalid) return;

    const formData = new FormData();
    Object.keys(this.registerForm.controls).forEach(key => {
      formData.append(key, this.registerForm.get(key)?.value);
    });

    this.alumnoService.registrarAlumno(formData).subscribe({
      next: (res) => {
        alert('Alumno registrado exitosamente');
        this.router.navigate(['/auth/login']);
      },
      error: (err) => {
        // Manejo del error basado en la respuesta del servidor
        if (err.error.error) {
          alert(err.error.error);  // Mostrar mensaje de error del servidor
        } else {
          console.error('Error al registrar el alumno:', err);
          alert('Hubo un error en el servidor. Intente más tarde.');
        }
      }
    });
  }

  goToLogin(): void {
    this.router.navigate(['/auth/login']);
  }
  goToRegisterDepartamento(): void {
    this.router.navigate(['/auth/register-departamento'])
  }
}
