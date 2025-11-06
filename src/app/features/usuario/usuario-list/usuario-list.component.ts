import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-usuario-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="usuario-list p-4">
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h2>Gestión de Usuarios</h2>
        <button class="btn btn-success" (click)="openCreateModal()">
          ➕ Nuevo Usuario
        </button>
      </div>

      <!-- Buscadores -->
      <div class="row mb-3">
        <div class="col-md-6">
          <input
            type="text"
            [(ngModel)]="filtroNombre"
            (input)="filtrarUsuarios()"
            placeholder="Buscar por nombre..."
            class="form-control"
          />
        </div>
        <div class="col-md-6">
          <input
            type="text"
            [(ngModel)]="filtroId"
            (input)="filtrarUsuarios()"
            placeholder="Buscar por ID..."
            class="form-control"
          />
        </div>
      </div>

      <!-- Tabla -->
      <table class="table table-striped table-bordered align-middle">
        <thead class="table-dark">
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Email</th>
            <th>Teléfono</th>
            <th>Activo</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let usuario of usuariosFiltrados">
            <td>{{ usuario.id }}</td>
            <td>{{ usuario.nombre }}</td>
            <td>{{ usuario.email }}</td>
            <td>{{ usuario.telefono || '—' }}</td>
            <td>
              <span [class.text-success]="usuario.activo" [class.text-danger]="!usuario.activo">
                {{ usuario.activo ? 'Sí' : 'No' }}
              </span>
            </td>
            <td>
              <button class="btn btn-primary btn-sm me-2" (click)="openEditModal(usuario)">✏️ Editar</button>
              <button class="btn btn-danger btn-sm" (click)="deleteUsuario(usuario.id)">🗑️ Eliminar</button>
            </td>
          </tr>

          <tr *ngIf="usuariosFiltrados.length === 0">
            <td colspan="6" class="text-center text-muted">No se encontraron usuarios</td>
          </tr>
        </tbody>
      </table>

      <!-- Modal Crear/Editar -->
      <div class="modal-backdrop" *ngIf="showModal">
        <div class="modal-content">
          <h4>{{ isEditMode ? 'Editar Usuario' : 'Nuevo Usuario' }}</h4>

          <form (ngSubmit)="saveUsuario()" #form="ngForm">
            <div class="form-group mb-2">
              <label>ID</label>
              <input
                type="number"
                [(ngModel)]="usuarioForm.id"
                name="id"
                class="form-control"
                [readonly]="isEditMode"
                required
              />
            </div>

            <div class="form-group mb-2">
              <label>Nombre</label>
              <input
                type="text"
                [(ngModel)]="usuarioForm.nombre"
                name="nombre"
                class="form-control"
                required
              />
            </div>

            <div class="form-group mb-2">
              <label>Email</label>
              <input
                type="email"
                [(ngModel)]="usuarioForm.email"
                name="email"
                class="form-control"
                required
              />
            </div>

            <div class="form-group mb-2">
              <label>Teléfono</label>
              <input
                type="text"
                [(ngModel)]="usuarioForm.telefono"
                name="telefono"
                class="form-control"
              />
            </div>

            <div class="form-check mb-3">
              <input
                type="checkbox"
                class="form-check-input"
                [(ngModel)]="usuarioForm.activo"
                name="activo"
                id="activo"
              />
              <label for="activo" class="form-check-label">Activo</label>
            </div>

            <div class="d-flex justify-content-end gap-2">
              <button type="submit" class="btn btn-primary">Guardar</button>
              <button type="button" class="btn btn-secondary" (click)="closeModal()">Cancelar</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .usuario-list {
      background: #fff;
      border-radius: 10px;
      padding: 1.5rem;
      box-shadow: 0 4px 10px rgba(0,0,0,0.1);
    }
    .text-success { color: green; }
    .text-danger { color: red; }

    /* Modal */
    .modal-backdrop {
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.6);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }
    .modal-content {
      background: #fff;
      padding: 1.5rem;
      border-radius: 10px;
      width: 400px;
      box-shadow: 0 0 10px rgba(0,0,0,0.2);
      animation: fadeIn 0.3s ease;
    }
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(-10px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `]
})
export class UsuarioListComponent {
  usuarios = [
    { id: 1, nombre: 'Juan Pérez', email: 'juan@example.com', telefono: '3101234567', activo: true },
    { id: 2, nombre: 'María Gómez', email: 'maria@example.com', telefono: '3117654321', activo: false },
    { id: 3, nombre: 'Carlos Ruiz', email: 'carlos@example.com', telefono: '3009998888', activo: true }
  ];

  usuariosFiltrados = [...this.usuarios];
  filtroNombre = '';
  filtroId = '';

  showModal = false;
  isEditMode = false;
  usuarioForm: any = {};

  // Filtro dinámico
  filtrarUsuarios() {
    const nombre = this.filtroNombre.toLowerCase();
    const id = this.filtroId.toString().toLowerCase();

    this.usuariosFiltrados = this.usuarios.filter(u =>
      u.nombre.toLowerCase().includes(nombre) &&
      u.id.toString().includes(id)
    );
  }

  // Modal
  openCreateModal() {
    this.usuarioForm = { activo: true };
    this.isEditMode = false;
    this.showModal = true;
  }

  openEditModal(usuario: any) {
    this.usuarioForm = { ...usuario };
    this.isEditMode = true;
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  saveUsuario() {
    if (this.isEditMode) {
      const index = this.usuarios.findIndex(u => u.id === this.usuarioForm.id);
      if (index !== -1) this.usuarios[index] = { ...this.usuarioForm };
    } else {
      const nuevo = { ...this.usuarioForm };
      this.usuarios.push(nuevo);
    }
    this.closeModal();
    this.filtrarUsuarios();
  }

  deleteUsuario(id: number) {
    if (confirm('¿Seguro que deseas eliminar este usuario?')) {
      this.usuarios = this.usuarios.filter(u => u.id !== id);
      this.filtrarUsuarios();
    }
  }
}

