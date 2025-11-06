import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-Libro-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './Libro-list.component.html',
  styleUrls: ['./Libro-list.component.scss']
})
export class LibroListComponent {
  // Lista inicial
  Libros = [
    { idLibro: 1, titulo: 'El Principito', genero: 'Carlos Rivera', paginas: '2h 30min'},
    { idLibro: 2, titulo: '1984', genero: 'Laura Torres', paginas: '9h 15min' },
    { idLibro: 3, titulo: 'Moby Dick', genero: 'José García', paginas: '12h 45min' }
  ];

  LibrosFiltrados = [...this.Libros];
  filtroTitulo = '';
  filtroIdLibro = '';

  showModal = false;
  isEditMode = false;
  LibroForm: any = {};

  // 🔍 Filtra los Libros
  filtrarLibros() {
    const titulo = this.filtroTitulo.toLowerCase();
    const id = this.filtroIdLibro.toString().toLowerCase();

    this.LibrosFiltrados = this.Libros.filter(a =>
      a.titulo.toLowerCase().includes(titulo) &&
      a.idLibro.toString().includes(id)
    );
  }

  // ➕ Crear nuevo Libro
  openCreateModal() {
    this.LibroForm = {};
    this.isEditMode = false;
    this.showModal = true;
  }

  // ✏️ Editar Libro existente
  openEditModal(Libro: any) {
    this.LibroForm = { ...Libro };
    this.isEditMode = true;
    this.showModal = true;
  }

  // ❌ Cerrar modal
  closeModal() {
    this.showModal = false;
  }

  // 💾 Guardar (crear o actualizar)
  saveLibro() {
    if (this.isEditMode) {
      const index = this.Libros.findIndex(a => a.idLibro === this.LibroForm.idLibro);
      if (index !== -1) this.Libros[index] = { ...this.LibroForm };
    } else {
      const nuevo = { ...this.LibroForm };
      nuevo.idLibro = this.generarNuevoId();
      this.Libros.push(nuevo);
    }
    this.closeModal();
    this.filtrarLibros();
  }

  // 🗑️ Eliminar
  deleteLibro(idLibro: number) {
    if (confirm('¿Seguro que deseas eliminar este Libro?')) {
      this.Libros = this.Libros.filter(a => a.idLibro !== idLibro);
      this.filtrarLibros();
    }
  }

  // ⚙️ Generar ID automático
  private generarNuevoId(): number {
    return this.Libros.length > 0
      ? Math.max(...this.Libros.map(a => a.idLibro)) + 1
      : 1;
  }
}
