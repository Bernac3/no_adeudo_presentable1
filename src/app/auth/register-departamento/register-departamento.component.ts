import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DepartamentoService } from '../../service/departamento.service';

@Component({
  selector: 'app-register-departamento',
  templateUrl: './register-departamento.component.html',
  styleUrl: './register-departamento.component.css',
})
export class RegisterDepartamentoComponent implements OnInit {
  registerForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private departamentoService: DepartamentoService
  ) {}

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      nombre_completo: ['', [Validators.required]],
      contrasena: ['', [Validators.required]],
      confirmarContrasena: ['', [Validators.required]],
      tipo_usuario: ['', [Validators.required]], // Campo del dropdown con validación requerida
    });
  }

  onSubmit(): void {
    if (this.registerForm.invalid) return;

    const formData = new FormData();
    Object.keys(this.registerForm.controls).forEach((key) => {
      formData.append(key, this.registerForm.get(key)?.value);
    });

    // Agregar la fecha de registro actual
    const fechaRegistro = new Date().toISOString().slice(0, 19).replace('T', ' ');
    formData.append('fecha_registro', fechaRegistro);

    this.departamentoService.registrarDepartamento(formData).subscribe({
      next: (res) => {
        alert(
          'Petición exitosa, es necesario que el personal encargado del sitio autorice su cuenta para poder iniciar sesión.'
        );
        this.router.navigate(['/auth/login']);
      },
      error: (err) => {
        if (err.error?.error) {
          alert(err.error.error); // Mostrar el mensaje de error enviado desde el servidor
        } else {
          console.error('Error al registrar:', err);
        }
      },
    });
  }

  goToLogin(): void {
    this.router.navigate(['/auth/login']);
  }
}
