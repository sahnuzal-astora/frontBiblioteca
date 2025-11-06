import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-audiolibro-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './audiolibro-list.component.html',
  styleUrls: ['./audiolibro-list.component.scss']
})
export class AudiolibroListComponent {
  // Lista inicial
  audiolibros = [
    { idAudiolibro: 1, titulo: 'El Principito', narrador: 'Carlos Rivera', duracion: '2h 30min', formato: 'MP3' },
    { idAudiolibro: 2, titulo: '1984', narrador: 'Laura Torres', duracion: '9h 15min', formato: 'WAV' },
    { idAudiolibro: 3, titulo: 'Moby Dick', narrador: 'José García', duracion: '12h 45min', formato: 'AAC' }
  ];

  audiolibrosFiltrados = [...this.audiolibros];
  filtroTitulo = '';
  filtroIdAudiolibro = '';

  showModal = false;
  isEditMode = false;
  audiolibroForm: any = {};

  // 🔍 Filtra los audiolibros
  filtrarAudiolibros() {
    const titulo = this.filtroTitulo.toLowerCase();
    const id = this.filtroIdAudiolibro.toString().toLowerCase();

    this.audiolibrosFiltrados = this.audiolibros.filter(a =>
      a.titulo.toLowerCase().includes(titulo) &&
      a.idAudiolibro.toString().includes(id)
    );
  }

  // ➕ Crear nuevo audiolibro
  openCreateModal() {
    this.audiolibroForm = {};
    this.isEditMode = false;
    this.showModal = true;
  }

  // ✏️ Editar audiolibro existente
  openEditModal(audiolibro: any) {
    this.audiolibroForm = { ...audiolibro };
    this.isEditMode = true;
    this.showModal = true;
  }

  // ❌ Cerrar modal
  closeModal() {
    this.showModal = false;
  }

  // 💾 Guardar (crear o actualizar)
  saveAudiolibro() {
    if (this.isEditMode) {
      const index = this.audiolibros.findIndex(a => a.idAudiolibro === this.audiolibroForm.idAudiolibro);
      if (index !== -1) this.audiolibros[index] = { ...this.audiolibroForm };
    } else {
      const nuevo = { ...this.audiolibroForm };
      nuevo.idAudiolibro = this.generarNuevoId();
      this.audiolibros.push(nuevo);
    }
    this.closeModal();
    this.filtrarAudiolibros();
  }

  // 🗑️ Eliminar
  deleteAudiolibro(idAudiolibro: number) {
    if (confirm('¿Seguro que deseas eliminar este audiolibro?')) {
      this.audiolibros = this.audiolibros.filter(a => a.idAudiolibro !== idAudiolibro);
      this.filtrarAudiolibros();
    }
  }

  // ⚙️ Generar ID automático
  private generarNuevoId(): number {
    return this.audiolibros.length > 0
      ? Math.max(...this.audiolibros.map(a => a.idAudiolibro)) + 1
      : 1;
  }
}
