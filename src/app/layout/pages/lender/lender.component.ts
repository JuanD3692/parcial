import { CommonModule } from '@angular/common';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Loan } from './interfaces/ILender';
import { LenderService } from './services/lender.service';

@Component({
  selector: 'app-lender',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './lender.component.html',
  styleUrl: './lender.component.css',
})
export class LenderComponent implements OnInit {
  loans: Loan[] = [];
  filteredLoans: Loan[] = [];
  isLoading = true;
  hasPermission = false; // Nueva propiedad para almacenar el permiso global
  searchTerm = '';
  statusFilter = 'all';
  selectedLoan: Loan | null = null;
  showDetailsModal = false;
  showApproveModal = false;

  currentPage = 1;
  itemsPerPage = 10;
  totalPages = 1;

  successMessage = '';
  errorMessage = '';

  constructor(
    private lenderService: LenderService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.isLoading = true; // Aseguramos que isLoading está true al inicio
    this.fetchLoans();
  }

  fetchLoans(): void {
    this.isLoading = true;
    this.lenderService.getLenders().subscribe({
      next: (response: any) => {
        console.log('Datos recibidos:', response);
        // Guardar el permiso global
        this.hasPermission = response.presmiss || false;

        if (response && Array.isArray(response.loans)) {
          this.loans = response.loans;
          this.filteredLoans = [...this.loans];
          this.applyFilters();
        }
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al cargar préstamos:', err);
        this.errorMessage =
          'Error al cargar los préstamos. Intente nuevamente.';
        this.loans = [];
        this.filteredLoans = [];
        this.isLoading = false; // Aseguramos que se establece en false en caso de error
        this.cdr.detectChanges();
      },
      complete: () => {
        // Aseguramos que isLoading se establece en false cuando se completa la petición
        this.isLoading = false;
        this.cdr.detectChanges();
      },
    });
  }

  applyFilters(): void {
    if (!this.loans || this.loans.length === 0) {
      this.filteredLoans = [];
      return;
    }

    console.log('Aplicando filtros a:', this.loans);
    let filtered = [...this.loans];

    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(
        (loan) =>
          loan?.borrower?.name?.toLowerCase().includes(term) ||
          loan?.borrower?.email?.toLowerCase().includes(term) ||
          loan?.amount?.toString().includes(term) ||
          loan?.id?.toString().includes(term)
      );
    }

    if (this.statusFilter !== 'all') {
      filtered = filtered.filter((loan) => loan.status === this.statusFilter);
    }

    this.filteredLoans = filtered;
    this.calculateTotalPages();
    console.log('Préstamos filtrados:', this.filteredLoans);
  }

  calculateTotalPages(): void {
    this.totalPages = Math.ceil(this.filteredLoans.length / this.itemsPerPage);
    if (this.currentPage > this.totalPages) {
      this.currentPage = 1;
    }
  }

  get paginatedLoans(): Loan[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredLoans.slice(startIndex, startIndex + this.itemsPerPage);
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'aprobado':
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  getStatusText(status: string): string {
    switch (status) {
      case 'aprobado':
      case 'approved':
        return 'Aprobado';
      case 'pending':
        return 'Pendiente';
      case 'rejected':
        return 'Rechazado';
      default:
        return status;
    }
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }

  formatCurrency(amount: string): string {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'USD',
    }).format(Number.parseFloat(amount));
  }

  openDetailsModal(loan: Loan): void {
    this.selectedLoan = loan;
    this.showDetailsModal = true;
  }

  closeDetailsModal(): void {
    this.showDetailsModal = false;
    this.selectedLoan = null;
  }

  openApproveModal(loan: Loan): void {
    this.selectedLoan = loan;
    this.showApproveModal = true;
  }

  closeApproveModal(): void {
    this.showApproveModal = false;
    this.selectedLoan = null;
  }

  getMinValue(a: number, b: number): number {
    return Math.min(a, b);
  }

  approveLoan(): void {
    if (this.selectedLoan) {
      const loanId = this.selectedLoan.id;
      const payload = { status: 'approved' };

      this.lenderService.updateLender(loanId.toString(), payload).subscribe({
        next: (updatedLoan) => {
          const index = this.loans.findIndex((loan) => loan.id === loanId);
          if (index !== -1) {
            this.loans[index] = updatedLoan;
            this.applyFilters();
          }
          this.successMessage = 'Préstamo aprobado exitosamente.';
          this.closeApproveModal();
          this.fetchLoans();
          setTimeout(() => (this.successMessage = ''), 3000);
        },
        error: (err) => {
          console.error('Error al aprobar el préstamo:', err);
          this.errorMessage =
            'Error al aprobar el préstamo. Intente nuevamente.';
        },
      });
    }
  }

  rejectLoan(): void {
    if (this.selectedLoan) {
      const loanId = this.selectedLoan.id;
      const payload = { status: 'rejected' };

      this.lenderService.updateLender(loanId.toString(), payload).subscribe({
        next: (updatedLoan) => {
          const index = this.loans.findIndex((loan) => loan.id === loanId);
          if (index !== -1) {
            this.loans[index] = updatedLoan;
            this.applyFilters();
          }
          this.successMessage = 'Préstamo rechazado exitosamente.';
          this.closeApproveModal();
          this.fetchLoans();
          setTimeout(() => (this.successMessage = ''), 3000);
        },
        error: (err) => {
          console.error('Error al rechazar el préstamo:', err);
          this.errorMessage =
            'Error al rechazar el préstamo. Intente nuevamente.';
        },
      });
    }
  }
}
