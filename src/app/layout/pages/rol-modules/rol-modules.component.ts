import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Module, Role } from './interfaces/Module';
import { RolModuleService } from './services/rol-module.service'; // Importar el servicio

@Component({
  selector: 'app-rol-modules',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './rol-modules.component.html',
  styleUrl: './rol-modules.component.css'
})
export class RolModulesComponent implements OnInit {
  roles: Role[] = [];
  loading = true;
  saving = false;
  successMessage = "";
  errorMessage = "";

  constructor(private rolModuleService: RolModuleService) {} // Inyectar el servicio

  ngOnInit(): void {
    this.loadRoles();
  }

  loadRoles(): void {
    this.loading = true;
    this.rolModuleService.getInfo().subscribe({
      next: (data) => {
        this.roles = data.map((rol) => ({
          ...rol,
          expanded: false,
          isEditing: false,
        }));
        this.loading = false;
      },
      error: (err) => {
        console.error("Error al cargar roles:", err);
        this.errorMessage = "Error al cargar los roles. Intente nuevamente.";
        this.loading = false;
      },
    });
  }

  saveRoleModules(role: Role): void {
  this.saving = true;
  this.successMessage = "";
  this.errorMessage = "";

  // Depurar el contenido de role.modules
  console.log("Módulos del rol antes de filtrar:", role.modules);

  // Filtrar módulos asignados y asegurarse de que el id no sea undefined
  const moduleIds = role.modules.filter((module) => module.assigned && module.id !== undefined); // Asegurar que el id es de tipo number

  // Depurar el contenido de moduleIds
  console.log("IDs de módulos seleccionados:", moduleIds);

  this.rolModuleService.updateRolXModule(role.id, moduleIds).subscribe({
    next: () => {
      this.saving = false;
      this.successMessage = `Permisos actualizados para el rol "${role.rol}"`;
      role.isEditing = false;

      // Ocultar el mensaje después de 3 segundos
      setTimeout(() => {
        this.successMessage = "";
      }, 3000);
    },
    error: (err) => {
      console.error("Error al guardar permisos:", err);
      this.errorMessage = "Error al guardar los permisos. Intente nuevamente.";
      this.saving = false;
    },
  });
}

  toggleExpand(role: Role): void {
    role.expanded = !role.expanded;
  }

  toggleEdit(role: Role): void {
    if (role.isEditing) {
      this.loadRoles(); // Recargar datos si se cancela la edición
    }
    role.isEditing = !role.isEditing;
  }

  selectAll(role: Role): void {
    role.modules.forEach((module) => (module.assigned = true));
  }

  deselectAll(role: Role): void {
    role.modules.forEach((module) => (module.assigned = false));
  }

  countAssignedModules(role: Role): number {
    return role.modules.filter((module) => module.assigned).length;
  }
}