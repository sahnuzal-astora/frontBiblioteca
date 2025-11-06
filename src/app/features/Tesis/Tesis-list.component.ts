import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-tesis-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './tesis-list.component.html',
  styleUrls: ['./tesis-list.component.scss']
})
export class TesisListComponent {
  // 📘 Lista inicial de tesis
  Tesis = [
    { idTesis: 1, universidad: 'Universidad Nacional', director: 'Dr. Pérez', gradoAcademico: 'Maestría' },
    { idTesis: 2, universidad: 'Universidad de los Andes', director: 'Dra. Gómez', gradoAcademico: 'Doctorado' },
    { idTesis: 3, universidad: 'Pontificia Universidad Javeriana', director: 'Dr. López', gradoAcademico: 'Pregrado' }
  ];

  // 🔍 Variables para filtros
  TesisFiltradas = [...this.Tesis];
  filtroIdTesis = '';
  filtroUniversidad = '';
  filtroDirector = ''; // ✅ Agregado para evitar error

  // ⚙️ Control de modal y formulario
  showModal = false;
  isEditMode = false;
  TesisForm: any = {}; // ✅ Se usa con la misma mayúscula que en HTML

  // 🔍 Filtrar por ID, universidad o director
  filtrarTesis() {
    const id = this.filtroIdTesis.toString().toLowerCase();
    const universidad = this.filtroUniversidad.toLowerCase();
    const director = this.filtroDirector.toLowerCase();

    this.TesisFiltradas = this.Tesis.filter(t =>
      t.idTesis.toString().includes(id) &&
      t.universidad.toLowerCase().includes(universidad) &&
      t.director.toLowerCase().includes(director)
    );
  }

  // ➕ Crear nueva tesis
  openCreateModal() {
    this.TesisForm = {};
    this.isEditMode = false;
    this.showModal = true;
  }

  // ✏️ Editar tesis existente
  openEditModal(tesis: any) {
    this.TesisForm = { ...tesis };
    this.isEditMode = true;
    this.showModal = true;
  }

  // ❌ Cerrar modal
  closeModal() {
    this.showModal = false;
  }

  // 💾 Guardar (crear o actualizar)
  saveTesis() {
    if (this.isEditMode) {
      const index = this.Tesis.findIndex(t => t.idTesis === this.TesisForm.idTesis);
      if (index !== -1) {
        this.Tesis[index] = { ...this.TesisForm };
      }
    } else {
      const nueva = { ...this.TesisForm };
      nueva.idTesis = this.generarNuevoId();
      this.Tesis.push(nueva);
    }

    this.closeModal();
    this.filtrarTesis();
  }

  // 🗑️ Eliminar tesis
  deleteTesis(idTesis: number) {
    if (confirm('¿Seguro que deseas eliminar esta tesis?')) {
      this.Tesis = this.Tesis.filter(t => t.idTesis !== idTesis);
      this.filtrarTesis();
    }
  }

  // ⚙️ Generar ID automático
  private generarNuevoId(): number {
    return this.Tesis.length > 0
      ? Math.max(...this.Tesis.map(t => t.idTesis)) + 1
      : 1;
  }
}

