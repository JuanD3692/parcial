import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

  loanFeatures = [
    {
      icon: "credit-card",
      title: "Tasa de Interés Competitiva",
      description: "Solo 10% de interés anual en todos nuestros préstamos personales.",
    },
    {
      icon: "clock",
      title: "Proceso Rápido",
      description: "Aprobación en menos de 24 horas para clientes calificados.",
    },
    {
      icon: "shield",
      title: "Sin Comisiones Ocultas",
      description: "Transparencia total en todos nuestros servicios financieros.",
    },
    {
      icon: "calendar",
      title: "Plazos Flexibles",
      description: "Opciones de pago desde 6 hasta 60 meses según tus necesidades.",
    },
  ]

  eligibilityRequirements = [
    "Ser mayor de 18 años",
    "Tener ingresos comprobables",
    "Historial crediticio favorable",
    "Identificación oficial vigente",
    "Comprobante de domicilio reciente",
  ]

  testimonials = [
    {
      name: "María González",
      position: "Emprendedora",
      quote: "Gracias al préstamo pude expandir mi negocio. El proceso fue rápido y sin complicaciones.",
      avatar: "/placeholder.svg?height=80&width=80",
    },
    {
      name: "Carlos Rodríguez",
      position: "Profesional",
      quote: "La tasa de interés es realmente competitiva. Logré consolidar mis deudas y ahora pago menos cada mes.",
      avatar: "/placeholder.svg?height=80&width=80",
    },
    {
      name: "Laura Martínez",
      position: "Propietaria",
      quote: "Conseguí el préstamo para remodelar mi casa en tiempo récord. El servicio al cliente es excepcional.",
      avatar: "/placeholder.svg?height=80&width=80",
    },
  ]

}
