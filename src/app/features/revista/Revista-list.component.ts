import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-Revista-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './Revista-list.component.html',
  styleUrls: ['./Revista-list.component.scss']
})
export class RevistaListComponent {
  // 📘 Lista inicial
  Revistas = [
    { idRevista: 1, edicion: 'Edición Nacional' },
    { idRevista: 2, edicion: 'Edición Regional' },
    { idRevista: 3, edicion: 'Edición Internacional' }
  ];

  RevistasFiltrados = [...this.Revistas];
  filtroIdRevista = '';
  filtroEdicion = '';
  showModal = false;
  isEditMode = false;
  RevistaForm: any = {};

  // 🔍 Filtrar por ID o edición
  filtrarRevistas() {
    const id = this.filtroIdRevista.toString().toLowerCase();
    const edicion = this.filtroEdicion.toLowerCase();

    this.RevistasFiltrados = this.Revistas.filter(p =>
      p.idRevista.toString().includes(id) &&
      p.edicion.toLowerCase().includes(edicion)
    );
  }

  // ➕ Crear nuevo periódico
  openCreateModal() {
    this.RevistaForm = {};
    this.isEditMode = false;
    this.showModal = true;
  }

  // ✏️ Editar periódico existente
  openEditModal(Revista: any) {
    this.RevistaForm = { ...Revista };
    this.isEditMode = true;
    this.showModal = true;
  }

  // ❌ Cerrar modal
  closeModal() {
    this.showModal = false;
  }

  // 💾 Guardar (crear o actualizar)
  saveRevista() {
    if (this.isEditMode) {
      const index = this.Revistas.findIndex(p => p.idRevista === this.RevistaForm.idRevista);
      if (index !== -1) {
        this.Revistas[index] = { ...this.RevistaForm };
      }
    } else {
      const nuevo = { ...this.RevistaForm };
      nuevo.idRevista = this.generarNuevoId();
      this.Revistas.push(nuevo);
    }

    this.closeModal();
    this.filtrarRevistas();
  }

  // 🗑️ Eliminar periódico
  deleteRevista(idRevista: number) {
    if (confirm('¿Seguro que deseas eliminar este periódico?')) {
      this.Revistas = this.Revistas.filter(p => p.idRevista !== idRevista);
      this.filtrarRevistas();
    }
  }

  // ⚙️ Generar ID automático
  private generarNuevoId(): number {
    return this.Revistas.length > 0
      ? Math.max(...this.Revistas.map(p => p.idRevista)) + 1
      : 1;
  }
}

