import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router'; // Importar Router para redirección
import { RegisterService } from './services/register.service'; // Importar el servicio de registro
import { MessageFlashComponent } from '../shared/components/message-flash/message-flash.component';
import { MessageFlashService } from '../shared/components/message-flash/message-flash.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, MessageFlashComponent],
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

  constructor(private registerService: RegisterService, private router: Router, private messageFlashService: MessageFlashService) {} 

  onSubmit() {
    console.log("Datos de registro:", this.registerData);
    if (this.registerData.password !== this.registerData.confirmPassword) {
      this.messageFlashService.danger('Las contraseñas no coinciden', 2000);
      return;
    }

    this.registerService.register(this.registerData).subscribe({
      next: () => {
        this.messageFlashService.success('Registro existo por favor inicia seción', 2000);
        console.log("Registro exitoso");
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.messageFlashService.danger(err, 2000);
        console.error("Error en el registro:", err);
      }
    });
  }
}
