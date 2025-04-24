import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router'; // Importar Router para redirección
import { RegisterService } from './services/register.service'; // Importar el servicio de registro

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {

  registerData = {
    name: "",
    document: "",
    phone: "",
    username: "",
    password: "",
    confirmPassword: "",
  };

  errorMessage: string = ""; // Para mostrar mensajes de error

  constructor(private registerService: RegisterService, private router: Router) {} 

  onSubmit() {
    if (this.registerData.password !== this.registerData.confirmPassword) {
      this.errorMessage = "Las contraseñas no coinciden.";
      return;
    }

    this.registerService.register(this.registerData).subscribe({
      next: () => {
        console.log("Registro exitoso");
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error("Error en el registro:", err);
        this.errorMessage = "Error al registrar. Por favor, inténtelo de nuevo.";
      }
    });
  }
}
