import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-periodico-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './periodico-list.component.html',
  styleUrls: ['./periodico-list.component.scss']
})
export class PeriodicoListComponent {
  // 📘 Lista inicial
  Periodicos = [
    { idPeriodico: 1, fechaPublicacion: '2024-05-10' },
    { idPeriodico: 2, fechaPublicacion: '2024-07-21' },
    { idPeriodico: 3, fechaPublicacion: '2024-09-15' }
  ];

  PeriodicosFiltrados = [...this.Periodicos];
  filtroIdPeriodico = '';
  filtroFechaPublicacion = '';
  showModal = false;
  isEditMode = false;
  PeriodicoForm: any = {};

  // 🔍 Filtrar por ID o fecha
  filtrarPeriodicos() {
    const id = this.filtroIdPeriodico.toString().toLowerCase();
    const fecha = this.filtroFechaPublicacion.toLowerCase();

    this.PeriodicosFiltrados = this.Periodicos.filter(p =>
      p.idPeriodico.toString().includes(id) &&
      p.fechaPublicacion.toLowerCase().includes(fecha)
    );
  }

  // ➕ Crear nuevo periódico
  openCreateModal() {
    this.PeriodicoForm = {};
    this.isEditMode = false;
    this.showModal = true;
  }

  // ✏️ Editar periódico existente
  openEditModal(Periodico: any) {
    this.PeriodicoForm = { ...Periodico };
    this.isEditMode = true;
    this.showModal = true;
  }

  // ❌ Cerrar modal
  closeModal() {
    this.showModal = false;
  }

  // 💾 Guardar (crear o actualizar)
  savePeriodico() {
    if (this.isEditMode) {
      const index = this.Periodicos.findIndex(p => p.idPeriodico === this.PeriodicoForm.idPeriodico);
      if (index !== -1) {
        this.Periodicos[index] = { ...this.PeriodicoForm };
      }
    } else {
      const nuevo = { ...this.PeriodicoForm };
      nuevo.idPeriodico = this.generarNuevoId();
      this.Periodicos.push(nuevo);
    }

    this.closeModal();
    this.filtrarPeriodicos();
  }

  // 🗑️ Eliminar
  deletePeriodico(idPeriodico: number) {
    if (confirm('¿Seguro que deseas eliminar este periódico?')) {
      this.Periodicos = this.Periodicos.filter(p => p.idPeriodico !== idPeriodico);
      this.filtrarPeriodicos();
    }
  }

  // ⚙️ Generar ID automático
  private generarNuevoId(): number {
    return this.Periodicos.length > 0
      ? Math.max(...this.Periodicos.map(p => p.idPeriodico)) + 1
      : 1;
  }
}
