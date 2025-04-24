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

  // Menú de navegación
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

  constructor(private router: Router) {}

  ngOnInit() {
    this.checkScreenSize();
    window.addEventListener('resize', this.checkScreenSize.bind(this));
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

      // Respuesta simulada
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

    if (question.includes('préstamo') || question.includes('prestamo')) {
      return 'Para solicitar un préstamo, necesitas completar el formulario en la sección de Préstamos. ¿Necesitas ayuda con algo específico?';
    } else if (
      question.includes('tasa') ||
      question.includes('interés') ||
      question.includes('interes')
    ) {
      return 'Nuestra tasa de interés actual es del 10% anual para préstamos personales. Las tasas pueden variar según el tipo de préstamo y tu historial crediticio.';
    } else if (question.includes('pago') || question.includes('cuota')) {
      return 'Puedes realizar tus pagos a través de la sección de Pagos en la plataforma, o mediante transferencia bancaria. ¿Necesitas los detalles de la cuenta?';
    } else if (
      question.includes('hola') ||
      question.includes('buenos días') ||
      question.includes('buenas tardes')
    ) {
      return '¡Hola! ¿En qué puedo ayudarte hoy con tus consultas financieras?';
    } else {
      return 'Gracias por tu mensaje. Un asesor revisará tu consulta y te responderá a la brevedad. Si es urgente, puedes llamarnos al 555-123-4567.';
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
