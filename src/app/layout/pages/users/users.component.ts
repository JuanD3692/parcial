import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Role, User } from './interfaces/IUsers';
import { UsersService } from './services/users.service';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css',
})
export class UsersComponent {
  users: User[] = [];
  roles: Role[] = [];
  filteredUsers: User[] = [];
  loading = true;
  showCreateModal = false;
  showEditModal = false;
  showDeleteModal = false;
  processing = false;
  searchTerm = '';
  successMessage = '';
  errorMessage = '';
  selectedUser: User | null = null;
  createForm: FormGroup;
  editForm: FormGroup;

  constructor(private fb: FormBuilder, private usersService: UsersService) {
    this.createForm = this.initForm();
    this.editForm = this.initForm();
  }

  ngOnInit(): void {
    this.loadUsers();
  }

  private initForm(): FormGroup {
    return this.fb.group({
      name: ['', [Validators.required]],
      document: ['', [Validators.required]],
      phone: ['', [Validators.required]],
      username: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.minLength(6)]],
      role: [null, [Validators.required]],
    });
  }

  private showMessage(type: 'success' | 'error', message: string): void {
    if (type === 'success') {
      this.successMessage = message;
      setTimeout(() => (this.successMessage = ''), 3000);
    } else {
      this.errorMessage = message;
    }
  }

  private isFormInvalid(form: FormGroup): boolean {
    if (form.invalid) {
      form.markAllAsTouched();
      return true;
    }
    return false;
  }

  private getUserData(form: FormGroup, isEdit: boolean = false): User {
    return {
      id: isEdit ? this.selectedUser?.id || 0 : 0,
      name: form.value.name,
      document: form.value.document,
      phone: form.value.phone,
      username: form.value.username || form.value.email,
      email: form.value.email,
      password: form.value.password,
      status: isEdit ? this.selectedUser?.status || true : true,
      role: form.value.role,
      Rol: {
        id: form.value.role,
        rol: isEdit ? this.selectedUser?.Rol.rol || '' : '',
      },
    };
  }

  loadUsers(): void {
    this.loading = true;
    this.usersService.getUsers().subscribe({
      next: (response: { users: User[]; roles: Role[] }) => {
        this.users = response.users || [];
        this.filteredUsers = [...this.users];
        this.roles = response.roles || [];
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar usuarios:', err);
        this.showMessage(
          'error',
          'Error al cargar los usuarios. Intente nuevamente.'
        );
        this.loading = false;
      },
    });
  }

  filterUsers(): void {
    const term = this.searchTerm.toLowerCase().trim();
    if (!term) {
      this.filteredUsers = [...this.users];
      return;
    }

    this.filteredUsers = this.users.filter((user) =>
      ['name', 'username', 'document', 'phone', 'Rol.rol'].some((key) => {
        const value =
          key === 'Rol.rol' ? user.Rol?.rol : user[key as keyof User];
        return value?.toString().toLowerCase().includes(term);
      })
    );
  }

  openCreateModal(): void {
    this.createForm.reset();
    this.showCreateModal = true;
  }

  closeCreateModal(): void {
    this.showCreateModal = false;
  }

  openEditModal(user: User): void {
    this.selectedUser = user;
    this.editForm.patchValue({
      name: user.name,
      document: user.document,
      phone: user.phone,
      username: user.username,
      email: user.email || '',
      role: user.Rol.id,
    });
    this.showEditModal = true;
  }

  closeEditModal(): void {
    this.showEditModal = false;
    this.selectedUser = null;
  }

  openDeleteModal(user: User): void {
    this.selectedUser = user;
    this.showDeleteModal = true;
  }

  closeDeleteModal(): void {
    this.showDeleteModal = false;
    this.selectedUser = null;
  }

  createUser(): void {
    if (this.isFormInvalid(this.createForm)) return;

    this.processing = true;
    const userData = this.getUserData(this.createForm);

    this.usersService.createUsers(userData).subscribe({
      next: (newUser: User) => {
        if (newUser) {
          this.users.unshift(newUser);
          this.filteredUsers = [...this.users];
        }
        this.processing = false;
        this.showMessage('success', 'Usuario creado exitosamente');
        this.closeCreateModal();
        this.loadUsers();
      },
      error: (err) => {
        console.error('Error al crear usuario:', err);
        this.showMessage(
          'error',
          'Error al crear el usuario. Intente nuevamente.'
        );
        this.processing = false;
      },
    });
  }

  updateUser(): void {
    if (this.isFormInvalid(this.editForm) || !this.selectedUser) return;

    this.processing = true;
    const userData = this.getUserData(this.editForm, true);

    this.usersService
      .updateUsers(this.selectedUser.id.toString(), userData)
      .subscribe({
        next: (updatedUser: User) => {
          this.users = this.users.map((u) =>
            u.id === this.selectedUser?.id ? { ...updatedUser } : u
          );
          this.filteredUsers = [...this.users];
          this.processing = false;
          this.showMessage('success', 'Usuario actualizado exitosamente');
          this.closeEditModal();
          this.loadUsers();
        },
        error: (err) => {
          console.error('Error al actualizar usuario:', err);
          this.showMessage(
            'error',
            'Error al actualizar el usuario. Intente nuevamente.'
          );
          this.processing = false;
        },
      });
  }

  deleteUser(): void {
    if (!this.selectedUser) return;

    this.processing = true;

    this.usersService.deleteUsers(this.selectedUser.id.toString()).subscribe({
      next: () => {
        this.users = this.users.filter((u) => u.id !== this.selectedUser?.id);
        this.filteredUsers = [...this.users];
        this.processing = false;
        this.showMessage('success', 'Usuario eliminado exitosamente');
        this.closeDeleteModal();
      },
      error: (err) => {
        console.error('Error al eliminar usuario:', err);
        this.showMessage(
          'error',
          'Error al eliminar el usuario. Intente nuevamente.'
        );
        this.processing = false;
      },
    });
  }

  toggleUserStatus(user: User): void {
    const newStatus = !user.status;

    this.usersService
      .updateUsers(user.id.toString(), { ...user, status: newStatus })
      .subscribe({
        next: () => {
          const index = this.users.findIndex((u) => u.id === user.id);
          if (index !== -1) {
            this.users[index].status = newStatus;
            this.filteredUsers = [...this.users];
          }
        },
        error: (err) => {
          console.error('Error al cambiar el estado del usuario:', err);
          this.showMessage(
            'error',
            'Error al cambiar el estado del usuario. Intente nuevamente.'
          );
        },
      });
  }

  numberOnly(event: KeyboardEvent): boolean {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode < 49 || charCode > 57) {
      return false;
    }
    return true;
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
    if (formControl.errors?.['minlength'])
      return `Mínimo ${formControl.errors?.['minlength'].requiredLength} caracteres`;

    return 'Campo inválido';
  }
}
