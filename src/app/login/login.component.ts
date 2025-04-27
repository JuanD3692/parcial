import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { LoginService } from './services/login.service';
import { ILogin } from './interfaces/ILogin';
import { IResponse } from './interfaces/IResponse';
import { MessageFlashComponent } from '../shared/components/message-flash/message-flash.component';
import { MessageFlashService } from '../shared/components/message-flash/message-flash.service';

declare const google: any;

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, MessageFlashComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  username = '';
  password = '';
  mobileMenuOpen = false;
  showPassword: boolean = false;

  constructor(
    private loginService: LoginService,
    private router: Router,
    private messageFlashService: MessageFlashService
  ) {}

  ngOnInit(): void {
    this.initializeGoogleSignIn();
  }

  toggleMobileMenu() {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  onSubmit() {
    const loginData: ILogin = {
      username: this.username,
      password: this.password,
    };

    this.loginService.login(loginData).subscribe(
      (response: IResponse) => {
        this.messageFlashService.success('Inicio de sesión exitoso', 1000);
        this.loginService.handleLoginResponse(response);
        this.router.navigate(['/layout']);
      },
      (error) => {
        console.error('Error al iniciar sesión', error);
        this.messageFlashService.danger(
          'Usuario o contraseña incorrectos',
          3000
        );
      }
    );
  }

  initializeGoogleSignIn(): void {
    google.accounts.id.initialize({
      client_id:
        '728490474666-b9jb7ft7l9nr7dcho2etp0mk0nfa6qig.apps.googleusercontent.com',
      callback: (response: any) => this.handleGoogleLogin(response),
    });

    google.accounts.id.renderButton(
      document.getElementById('googleSignInButton')!,
      { theme: 'outline', size: 'large' }
    );
  }

  handleGoogleLogin(response: any): void {
    const token = response.credential;

    this.loginService.loginWithGoogle(token).subscribe(
      (res) => {
        this.loginService.handleLoginResponse(res);
        this.router.navigate(['/layout']);
      },
      (error) => {
        this.messageFlashService.danger(
          'El correo con el que desear ingresar no se encuentra en el sistema',
          3000
        );
        console.error('Error al iniciar sesión con Google', error);
      }
    );
  }
}
