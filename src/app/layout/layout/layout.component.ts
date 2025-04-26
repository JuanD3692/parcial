import { CommonModule } from '@angular/common';
import {
  AfterViewChecked,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { LayoutService } from '../layout/servicies/layout.service';
import { ILayout } from '../layout/interfaces/ILayout';

interface ChatMessage {
  text: string;
  isUser: boolean;
  time: string;
}

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css',
})
export class LayoutComponent implements OnInit, AfterViewChecked {
  @ViewChild('chatMessages') private chatMessagesContainer!: ElementRef;

  isSidebarOpen = true;
  isMobile = false;
  isChatOpen = false;
  messageText = '';
  isTyping = false;

  chatMessages: ChatMessage[] = [];

  currentUser = {
    name: 'Carlos Rodríguez',
    role: 'Administrador',
    avatar: '/placeholder.svg?height=40&width=40',
  };

  // Menú de navegación original
  navigationItems = [
    {
      title: 'Dashboard',
      icon: 'dashboard',
      route: '/layout/dashboard',
      allowed: true,
    },
    {
      title: 'Rol x Modulos',
      icon: 'rol-modules',
      route: '/layout/rol-modules',
      allowed: true,
    },
    {
      title: 'Usuarios',
      icon: 'clients',
      route: '/layout/users',
      allowed: true,
    },
    {
      title: 'Préstamos',
      icon: 'loans',
      route: '/layout/borrower',
      allowed: true,
    },
    {
      title: 'Gestion de prestamos',
      icon: 'payments',
      route: '/layout/lender',
      allowed: true,
    },
  ];

  constructor(private router: Router, private layoutService: LayoutService) {} // Inyectar el servicio

  ngOnInit() {
    this.checkScreenSize();
    window.addEventListener('resize', this.checkScreenSize.bind(this));

    // Filtrar los paths permitidos al inicializar el componente
    this.layoutService.getUserInfo().subscribe((data: ILayout) => {
      const allowedPaths: string[] = data.paths; // Obtener los paths permitidos
      this.navigationItems = this.navigationItems.filter((item) =>
        allowedPaths.includes(item.route)
      );

      // Redirigir al primer path permitido
      const defaultRoute = this.navigationItems.find((item) =>
        allowedPaths.includes(item.route)
      )?.route;
      if (defaultRoute) {
        this.router.navigate([defaultRoute]);
      }
    });
  }

  filterNavigationItems() {
    this.layoutService.getUserInfo().subscribe((data: ILayout) => {
      const allowedPaths: string[] = data.paths; // Obtener los paths permitidos
      this.navigationItems = this.navigationItems.filter((item) =>
        allowedPaths.includes(item.route)
      );
    });
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  scrollToBottom(): void {
    try {
      if (this.chatMessagesContainer) {
        this.chatMessagesContainer.nativeElement.scrollTop =
          this.chatMessagesContainer.nativeElement.scrollHeight;
      }
    } catch (err) {}
  }

  checkScreenSize() {
    this.isMobile = window.innerWidth < 1024;
    if (this.isMobile) {
      this.isSidebarOpen = false;
    } else {
      this.isSidebarOpen = true;
    }
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  toggleChat() {
    this.isChatOpen = !this.isChatOpen;
  }

  sendMessage() {
    if (!this.messageText.trim()) return;

    // Obtener la hora actual
    const now = new Date();
    const timeString =
      now.getHours() +
      ':' +
      (now.getMinutes() < 10 ? '0' : '') +
      now.getMinutes();

    // Añadir mensaje del usuario
    this.chatMessages.push({
      text: this.messageText,
      isUser: true,
      time: timeString,
    });

    const userQuestion = this.messageText;
    this.messageText = '';

    // Mostrar indicador de escritura
    this.isTyping = true;

    // Simular llamada a la API
    setTimeout(() => {
      this.isTyping = false;

      // Aquí iría la llamada real a la API
      // fetch('https://tu-api-chatbot.com/api/chat', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({ message: userQuestion }),
      // })
      // .then(response => response.json())
      // .then(data => {
      //   this.chatMessages.push({
      //     text: data.response,
      //     isUser: false,
      //     time: timeString
      //   });
      // });

      this.chatMessages.push({
        text: this.getBotResponse(userQuestion),
        isUser: false,
        time: timeString,
      });
    }, 1500);
  }

  getBotResponse(question: string): string {
    // Respuestas simuladas basadas en palabras clave
    question = question.toLowerCase();

    if (question.includes('asesor') || question.includes('asesoria')) {
      return 'Para solicitar un préstamo, necesitas completar el formulario en la sección de Préstamos. ¿Necesitas ayuda con algo específico?';
    }
    if (question.includes('ver mis prestamos') || question.includes('deudas')) {
      return 'Puedes realizar tus pagos a través de la sección de Pagos en la plataforma, o mediante transferencia bancaria. ¿Necesitas los detalles de la cuenta?';
    } else {
      return '';
    }
  }

  isPathAllowed(path: string): boolean {
    // Aquí iría la lógica de permisos real
    return true;
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('tokenExpiration');
    this.router.navigate(['/login']);
  }
}
