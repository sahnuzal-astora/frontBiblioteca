
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-producto-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './producto-list.component.html',
  styleUrls: ['./producto-list.component.scss']
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

  // 🔍 Filtrar productos
  filtrarProductos() {
    const titulo = this.filtroTitulo.toLowerCase();
    const id = this.filtroIdProducto.toString().toLowerCase();

    this.productosFiltrados = this.productos.filter(p =>
      p.titulo.toLowerCase().includes(titulo) &&
      p.idProducto.toString().includes(id)
    );
  }

  // ➕ Crear producto
  openCreateModal() {
    this.productoForm = { estado: 'Disponible' };
    this.isEditMode = false;
    this.showModal = true;
  }

  // ✏️ Editar producto
  openEditModal(producto: any) {
    this.productoForm = { ...producto };
    this.isEditMode = true;
    this.showModal = true;
  }

  // ❌ Cerrar modal
  closeModal() {
    this.showModal = false;
  }

  // 💾 Guardar producto
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

  // 🗑️ Eliminar producto
  deleteProducto(idProducto: number) {
    if (confirm('¿Seguro que deseas eliminar este producto?')) {
      this.productos = this.productos.filter(p => p.idProducto !== idProducto);
      this.filtrarProductos();
    }
  }
}
