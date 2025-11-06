import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-prestamo-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './prestamo-list.component.html',
  styleUrls: ['./prestamo-list.component.scss']
})
export class PrestamoListComponent {
  prestamos = [
    {
      idprestamo: 1,
      uuidUsuario: 'U001',
      nombreUsuario: 'Juan Pérez',
      material: 'Taladro',
      fechaPrestamo: new Date('2025-10-01'),
      fechaDevolucion: new Date('2025-10-10'),
      estado: 'Pendiente'
    },
    {
      idprestamo: 2,
      uuidUsuario: 'U002',
      nombreUsuario: 'María Gómez',
      material: 'Martillo',
      fechaPrestamo: new Date('2025-10-05'),
      fechaDevolucion: new Date('2025-10-12'),
      estado: 'Devuelto'
    }
  ];

  prestamosFiltrados = [...this.prestamos];
  filtroIdprestamo = '';
  filtroUUIDUsuario = '';

  showModal = false;
  isEditMode = false;
  prestamoForm: any = {};

  // 🔍 Filtro dinámico
  filtrarPrestamos() {
    const id = this.filtroIdprestamo.toString().toLowerCase();
    const uuid = this.filtroUUIDUsuario.toLowerCase();

    this.prestamosFiltrados = this.prestamos.filter(p =>
      p.idprestamo.toString().includes(id) &&
      p.uuidUsuario.toLowerCase().includes(uuid)
    );
  }

  // 🧾 Modal
  openCreateModal() {
    this.prestamoForm = { estado: 'Pendiente' };
    this.isEditMode = false;
    this.showModal = true;
  }

  openEditModal(prestamo: any) {
    this.prestamoForm = { ...prestamo };
    this.isEditMode = true;
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  savePrestamo() {
    if (this.isEditMode) {
      const index = this.prestamos.findIndex(p => p.idprestamo === this.prestamoForm.idprestamo);
      if (index !== -1) this.prestamos[index] = { ...this.prestamoForm };
    } else {
      const nuevo = { ...this.prestamoForm, idprestamo: Date.now() };
      this.prestamos.push(nuevo);
    }
    this.closeModal();
    this.filtrarPrestamos();
  }

  deletePrestamo(id: number) {
    if (confirm('¿Seguro que deseas eliminar este préstamo?')) {
      this.prestamos = this.prestamos.filter(p => p.idprestamo !== id);
      this.filtrarPrestamos();
    }
  }
}

