import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-comic-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './comic-list.component.html',
  styleUrls: ['./comic-list.component.scss']
})
export class ComicListComponent {
  // 📚 Lista inicial de cómics
  comics = [
    { idComic: 1, titulo: 'Spider-Man: Homecoming', ilustrador: 'Steve Ditko', editorial: 'Marvel', volumen: 1 },
    { idComic: 2, titulo: 'Batman: Año Uno', ilustrador: 'David Mazzucchelli', editorial: 'DC Comics', volumen: 1 },
    { idComic: 3, titulo: 'One Piece', ilustrador: 'Eiichiro Oda', editorial: 'Shueisha', volumen: 108 }
  ];

  comicsFiltrados = [...this.comics];
  filtroTitulo = '';
  filtroIdComic = '';

  showModal = false;
  isEditMode = false;
  comicForm: any = {};

  // 🔍 Filtra los cómics
  filtrarComics() {
    const titulo = this.filtroTitulo.toLowerCase();
    const id = this.filtroIdComic.toString().toLowerCase();

    this.comicsFiltrados = this.comics.filter(c =>
      c.titulo.toLowerCase().includes(titulo) &&
      c.idComic.toString().includes(id)
    );
  }

  // ➕ Crear nuevo cómic
  openCreateModal() {
    this.comicForm = {};
    this.isEditMode = false;
    this.showModal = true;
  }

  // ✏️ Editar cómic existente
  openEditModal(comic: any) {
    this.comicForm = { ...comic };
    this.isEditMode = true;
    this.showModal = true;
  }

  // ❌ Cerrar modal
  closeModal() {
    this.showModal = false;
  }

  // 💾 Guardar (crear o actualizar)
  saveComic() {
    if (this.isEditMode) {
      const index = this.comics.findIndex(c => c.idComic === this.comicForm.idComic);
      if (index !== -1) this.comics[index] = { ...this.comicForm };
    } else {
      const nuevo = { ...this.comicForm };
      nuevo.idComic = this.generarNuevoId();
      this.comics.push(nuevo);
    }
    this.closeModal();
    this.filtrarComics();
  }

  // 🗑️ Eliminar cómic
  deleteComic(idComic: number) {
    if (confirm('¿Seguro que deseas eliminar este cómic?')) {
      this.comics = this.comics.filter(c => c.idComic !== idComic);
      this.filtrarComics();
    }
  }

  // ⚙️ Generar ID automático
  private generarNuevoId(): number {
    return this.comics.length > 0
      ? Math.max(...this.comics.map(c => c.idComic)) + 1
      : 1;
  }
}
