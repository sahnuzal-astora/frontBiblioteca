import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-producto-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="producto-list p-4">
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h2>Gestión de Productos</h2>
        <button class="btn btn-success" (click)="openCreateModal()">
          ➕ Nuevo Producto
        </button>
      </div>

      <!-- Filtros -->
      <div class="row mb-3">
        <div class="col-md-6">
          <input
            type="text"
            [(ngModel)]="filtroTitulo"
            (input)="filtrarProductos()"
            placeholder="Buscar por título..."
            class="form-control"
          />
        </div>
        <div class="col-md-6">
          <input
            type="text"
            [(ngModel)]="filtroIdProducto"
            (input)="filtrarProductos()"
            placeholder="Buscar por ID..."
            class="form-control"
          />
        </div>
      </div>

      <!-- Tabla -->
      <table class="table table-striped table-bordered align-middle">
        <thead class="table-dark">
          <tr>
            <th>ID Producto</th>
            <th>Título</th>
            <th>Autor</th>
            <th>Año</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let producto of productosFiltrados">
            <td>{{ producto.idProducto }}</td>
            <td>{{ producto.titulo }}</td>
            <td>{{ producto.autor }}</td>
            <td>{{ producto.anio }}</td>
            <td>
              <span
                [class.text-success]="producto.estado === 'Disponible'"
                [class.text-danger]="producto.estado === 'No disponible'"
              >
                {{ producto.estado }}
              </span>
            </td>
            <td>
              <button
                class="btn btn-primary btn-sm me-2"
                (click)="openEditModal(producto)"
              >
                ✏️ Editar
              </button>
              <button
                class="btn btn-danger btn-sm"
                (click)="deleteProducto(producto.idProducto)"
              >
                🗑️ Eliminar
              </button>
            </td>
          </tr>

          <tr *ngIf="productosFiltrados.length === 0">
            <td colspan="6" class="text-center text-muted">
              No se encontraron productos
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Modal Crear/Editar -->
      <div class="modal-backdrop" *ngIf="showModal">
        <div class="modal-content">
          <h4>{{ isEditMode ? 'Editar Producto' : 'Nuevo Producto' }}</h4>

          <form (ngSubmit)="saveProducto()" #form="ngForm">
            <div class="form-group mb-2">
              <label>ID Producto</label>
              <input
                type="number"
                [(ngModel)]="productoForm.idProducto"
                name="idProducto"
                class="form-control"
                [readonly]="isEditMode"
                required
              />
            </div>

            <div class="form-group mb-2">
              <label>Título</label>
              <input
                type="text"
                [(ngModel)]="productoForm.titulo"
                name="titulo"
                class="form-control"
                required
              />
            </div>

            <div class="form-group mb-2">
              <label>Autor</label>
              <input
                type="text"
                [(ngModel)]="productoForm.autor"
                name="autor"
                class="form-control"
                required
              />
            </div>

            <div class="form-group mb-2">
              <label>Año</label>
              <input
                type="number"
                [(ngModel)]="productoForm.anio"
                name="anio"
                class="form-control"
                required
              />
            </div>

            <div class="form-group mb-3">
              <label>Estado</label>
              <select
                [(ngModel)]="productoForm.estado"
                name="estado"
                class="form-select"
                required
              >
                <option value="Disponible">Disponible</option>
                <option value="No disponible">No disponible</option>
              </select>
            </div>

            <div class="d-flex justify-content-end gap-2">
              <button type="submit" class="btn btn-primary">Guardar</button>
              <button type="button" class="btn btn-secondary" (click)="closeModal()">
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .producto-list {
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
export class ProductoListComponent {
  productos = [
    { idProducto: 1, titulo: 'Cien años de soledad', autor: 'Gabriel García Márquez', anio: 1967, estado: 'Disponible' },
    { idProducto: 2, titulo: 'El Quijote', autor: 'Miguel de Cervantes', anio: 1605, estado: 'No disponible' },
    { idProducto: 3, titulo: 'La Odisea', autor: 'Homero', anio: -700, estado: 'Disponible' }
  ];

  productosFiltrados = [...this.productos];
  filtroTitulo = '';
  filtroIdProducto = '';

  showModal = false;
  isEditMode = false;
  productoForm: any = {};

  // Filtrar productos dinámicamente
  filtrarProductos() {
    const titulo = this.filtroTitulo.toLowerCase();
    const id = this.filtroIdProducto.toString().toLowerCase();

    this.productosFiltrados = this.productos.filter(p =>
      p.titulo.toLowerCase().includes(titulo) &&
      p.idProducto.toString().includes(id)
    );
  }

  // Modal crear
  openCreateModal() {
    this.productoForm = { estado: 'Disponible' };
    this.isEditMode = false;
    this.showModal = true;
  }

  // Modal editar
  openEditModal(producto: any) {
    this.productoForm = { ...producto };
    this.isEditMode = true;
    this.showModal = true;
  }

  // Cerrar modal
  closeModal() {
    this.showModal = false;
  }

  // Guardar producto
  saveProducto() {
    if (this.isEditMode) {
      const index = this.productos.findIndex(p => p.idProducto === this.productoForm.idProducto);
      if (index !== -1) this.productos[index] = { ...this.productoForm };
    } else {
      const nuevo = { ...this.productoForm };
      this.productos.push(nuevo);
    }
    this.closeModal();
    this.filtrarProductos();
  }

  // Eliminar producto
  deleteProducto(idProducto: number) {
    if (confirm('¿Seguro que deseas eliminar este producto?')) {
      this.productos = this.productos.filter(p => p.idProducto !== idProducto);
      this.filtrarProductos();
    }
  }
}
