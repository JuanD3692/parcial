import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Loan, Lender, CreateBorrowerRequest } from './interfaces/IBorrower';
import { BorrowerService } from './services/borrower.service';
import { MessageFlashComponent } from '../../../shared/components/message-flash/message-flash.component';
import { MessageFlashService } from '../../../shared/components/message-flash/message-flash.service';

@Component({
  selector: 'app-borrower',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, MessageFlashComponent],
  templateUrl: './borrower.component.html',
  styleUrl: './borrower.component.css',
})
export class BorrowerComponent implements OnInit {
  Math = Math; // Para usar Math.random en el template
  loans: Loan[] = [];
  filteredLoans: Loan[] = [];
  lenders: Lender[] = [];

  // Estados de UI
  loading = true;
  showCreateModal = false;
  showCancelModal = false;
  processing = false;
  searchTerm = '';
  statusFilter = 'all';
  showPayModal = false;
  selectedLoanForPayment: Loan | null = null;
  processingPayment = false;
  bankSelected = '';
  showPaymentSuccess = false;

  // Mensajes
  successMessage = '';
  errorMessage = '';

  // Préstamo seleccionado para cancelar
  selectedLoan: Loan | null = null;

  // Formulario
  createForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private borrowerService: BorrowerService,
    private messageFlashService: MessageFlashService
  ) {
    // Inicializar formulario
    this.createForm = this.fb.group({
      lender_id: [null, [Validators.required]],
      amount: [null, [Validators.required, Validators.min(1)]],
      cuotas: [null, [Validators.required, Validators.min(1)]],
      date_initial: [this.formatDate(new Date()), [Validators.required]],
      date_final: ['', [Validators.required]],
    });

    // Actualizar fecha final cuando cambian cuotas o fecha inicial
    this.createForm
      .get('cuotas')
      ?.valueChanges.subscribe(() => this.updateFinalDate());
    this.createForm
      .get('date_initial')
      ?.valueChanges.subscribe(() => this.updateFinalDate());
  }

  ngOnInit(): void {
    this.loadLoans();
    this.loadLenders();
  }

  loadLoans(): void {
    this.loading = true;
    this.borrowerService.getBorrower().subscribe({
      next: (response) => {
        this.loans = response.loans || [];
        this.filteredLoans = [...this.loans];
        this.loading = false;
      },
      error: (err) => {
        this.messageFlashService.danger('Error al cargar los préstamos', 2000);
        console.error('Error al cargar préstamos:', err);
        this.loading = false;
      },
    });
  }

  loadLenders(): void {
    this.loading = true;
    this.borrowerService.getBorrower().subscribe({
      next: (response) => {
        this.lenders = response.lenders || [];
        this.loading = false;
      },
      error: (err) => {
        this.messageFlashService.danger('Error al cargar los prestamistas', 2000);
        console.error('Error al cargar prestamistas:', err);
        this.loading = false;
      },
    });
  }

  // Métodos para filtrado
  filterLoans(): void {
    let filtered = [...this.loans];

    // Filtrar por término de búsqueda
    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase().trim();
      filtered = filtered.filter(
        (loan) =>
          loan.lender.name.toLowerCase().includes(term) ||
          loan.amount.includes(term) ||
          loan.interest_rate.includes(term) ||
          loan.status.toLowerCase().includes(term)
      );
    }

    // Filtrar por estado
    if (this.statusFilter !== 'all') {
      filtered = filtered.filter((loan) => loan.status === this.statusFilter);
    }

    this.filteredLoans = filtered;
  }

  // Métodos para modales
  openCreateModal(): void {
    this.createForm.reset({
      lender_id: null,
      amount: null,
      cuotas: null,
      date_initial: this.formatDate(new Date()),
      date_final: '',
    });
    this.showCreateModal = true;
  }

  closeCreateModal(): void {
    this.showCreateModal = false;
  }

  openCancelModal(loan: Loan): void {
    this.selectedLoan = loan;
    this.showCancelModal = true;
  }

  closeCancelModal(): void {
    this.showCancelModal = false;
    this.selectedLoan = null;
  }

  openPayModal(loan: Loan): void {
    this.selectedLoanForPayment = loan;
    this.showPayModal = true;
    this.bankSelected = '';
    this.showPaymentSuccess = false;
  }

  closePayModal(): void {
    this.showPayModal = false;
    this.selectedLoanForPayment = null;
    this.bankSelected = '';
    this.showPaymentSuccess = false;
  }

  // Métodos para CRUD
  createLoan(): void {
    if (this.createForm.invalid) {
      this.createForm.markAllAsTouched();
      return;
    }

    this.processing = true;
    this.successMessage = '';
    this.errorMessage = '';

    const loanData: CreateBorrowerRequest = {
      lender_id: this.createForm.value.lender_id,
      amount: Number.parseFloat(this.createForm.value.amount),
      cuotas: Number.parseInt(this.createForm.value.cuotas),
      date_initial: this.createForm.value.date_initial,
      date_final: this.createForm.value.date_final,
    };

    this.borrowerService.createBorrower(loanData).subscribe({
      next: (newLoan) => {
        this.loans.unshift(newLoan); // Añade el nuevo préstamo a la lista
        this.filterLoans(); // Actualiza la lista filtrada
        this.processing = false;
        this.successMessage = 'Solicitud de préstamo creada exitosamente';
        this.loadLoans();
        this.loadLenders();
        this.closeCreateModal();

        // Ocultar mensaje después de 3 segundos
        setTimeout(() => {
          this.successMessage = '';
        }, 3000);
      },
      error: (err) => {
        this.messageFlashService.danger(err, 2000);
        console.error('Error al crear el préstamo:', err);
        this.processing = false;
      },
    });
  }

  cancelLoan(): void {
    if (!this.selectedLoan) return;

    this.processing = true;
    this.successMessage = '';
    this.errorMessage = '';

    this.borrowerService
      .cancelBorrower(this.selectedLoan.id.toString())
      .subscribe({
        next: () => {
          const index = this.loans.findIndex(
            (l) => l.id === this.selectedLoan?.id
          );
          if (index !== -1) {
            this.loans[index].status = 'cancelled';
            this.loans[index].updatedAt = new Date().toISOString();
            this.filterLoans();
          }

          this.processing = false;
          this.successMessage = 'Préstamo cancelado exitosamente';
          this.loadLoans();
          this.loadLenders();
          this.closeCancelModal();

          // Ocultar mensaje después de 3 segundos
          setTimeout(() => {
            this.successMessage = '';
          }, 3000);
        },
        error: (err) => {
          console.error('Error al cancelar el préstamo:', err);
          this.errorMessage =
            'Error al cancelar el préstamo. Intente nuevamente.';
          this.processing = false;
        },
      });
  }

  processPayment(): void {
    if (!this.selectedLoanForPayment || !this.bankSelected) return;

    this.processingPayment = true;

    this.borrowerService
      .pagarCuota(this.selectedLoanForPayment.id.toString())
      .subscribe({
        next: () => {
          this.processingPayment = false;
          this.showPaymentSuccess = true;
          this.loadLoans();
        },
        error: (err) => {
          console.error('Error al procesar el pago:', err);
          this.errorMessage = 'Error al procesar el pago. Intente nuevamente.';
          this.processingPayment = false;
        },
      });
  }

  // Helpers
  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  updateFinalDate(): void {
    const cuotas = this.createForm.get('cuotas')?.value;
    const dateInitial = this.createForm.get('date_initial')?.value;

    if (cuotas && dateInitial) {
      const initialDate = new Date(dateInitial);
      const finalDate = new Date(initialDate);
      finalDate.setMonth(initialDate.getMonth() + Number.parseInt(cuotas));

      this.createForm.patchValue({
        date_final: this.formatDate(finalDate),
      });
    }
  }

  formatCurrency(amount: string): string {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'USD',
    }).format(Number.parseFloat(amount));
  }

  formatDateString(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'cancelled':
        return 'bg-gray-100 text-gray-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  getStatusText(status: string): string {
    switch (status) {
      case 'pending':
        return 'Pendiente';
      case 'approved':
        return 'Aprobado';
      case 'rejected':
        return 'Rechazado';
      case 'cancelled':
        return 'Cancelado';
      case 'completed':
        return 'Completado';
      default:
        return status;
    }
  }

  isFieldInvalid(form: FormGroup, field: string): boolean {
    const formControl = form.get(field);
    return (
      !!formControl &&
      formControl.invalid &&
      (formControl.dirty || formControl.touched)
    );
  }

  getFieldError(form: FormGroup, field: string): string {
    const formControl = form.get(field);
    if (!formControl) return '';

    if (formControl.errors?.['required']) return 'Este campo es requerido';
    if (formControl.errors?.['min'])
      return `El valor debe ser mayor a ${formControl.errors?.['min'].min}`;

    return 'Campo inválido';
  }
}
