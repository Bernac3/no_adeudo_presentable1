import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DepartamentoService } from '../../../../service/departamento.service';
import { PeticionesService } from '../../../../service/peticion.service';

@Component({
  selector: 'app-crear-admin',
  templateUrl: './crear-admin.component.html',
  styleUrls: ['./crear-admin.component.css']
})
export class CrearAdminComponent {
  departamentoForm: FormGroup;
  authModal = { usuario: '', contrasena: '' }; // Datos del modal
  mostrarContrasena: boolean = false;

  constructor(
    private fb: FormBuilder,
    private departamentoService: DepartamentoService,
    private peticionesService: PeticionesService
  ) {
    this.departamentoForm = this.fb.group(
      {
        usuario: ['', Validators.required], // Validación para campo de usuario
        contrasena: ['', [Validators.required, Validators.minLength(6)]],
        confirmarContrasena: ['', Validators.required],
      },
      { validators: this.passwordMatchValidator }
    );
  }

  // Validador personalizado para contraseñas
  passwordMatchValidator(form: FormGroup) {
    const contrasena = form.get('contrasena')?.value;
    const confirmarContrasena = form.get('confirmarContrasena')?.value;
    return contrasena === confirmarContrasena
      ? null
      : { passwordMismatch: true };
  }

  // Lógica para manejar el envío del formulario con confirmación del administrador
  confirmarCredenciales(): void {
    if (!this.authModal.usuario || !this.authModal.contrasena) {
      alert('Por favor, ingrese sus credenciales en el modal.');
      return;
    }
    if (this.departamentoForm.invalid) {
      alert('Por favor, complete correctamente el formulario.');
      return;
    }
    const nuevoAdmin = {
      usuario: this.departamentoForm.get('usuario')?.value,
      contrasena: this.departamentoForm.get('contrasena')?.value,
    };
    const authData = {
      usuario: this.authModal.usuario,
      contrasena: this.authModal.contrasena,
    };

    this.peticionesService.crearAdministrativo(nuevoAdmin, authData).subscribe(
      (res) => {
        alert('Administrador creado exitosamente.');
        this.departamentoForm.reset();
        this.authModal = { usuario: '', contrasena: '' };
      },
      (error) => {
        console.error('Error al crear el administrador:', error);

        // Mostrar un alert si el usuario ya está en uso
        if (error.status === 400 && error.error?.error?.includes('ya está en uso')) {
          alert('Usuario en uso');
        } else {
          alert('Error al crear el administrador. Verifique las credenciales.');
        }
      }
    );
  }

  // Alternar visibilidad de la contraseña
  toggleMostrarContrasena(): void {
    this.mostrarContrasena = !this.mostrarContrasena;
  }
}
