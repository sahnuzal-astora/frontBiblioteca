import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

import { ComicService } from '../../core/services/comic.services';
import { Comic, CreateComicRequest, UpdateComicRequest } from '../../shared/models/comic.model';

@Component({
  selector: 'app-comic-list',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './comic-list.component.html',
  styleUrls: ['./comic-list.component.scss']
})
export class ComicListComponent implements OnInit {

  comics: Comic[] = [];
  comicsFiltrados: Comic[] = [];

  filtroBusqueda: string = '';

  showModal = false;
  isEditMode = false;
  editingComic: Comic | null = null;

  comicForm: FormGroup;

  constructor(
    private comicService: ComicService,
    private fb: FormBuilder
  ) {
    this.comicForm = this.fb.group({
      ilustrador: ['', Validators.required],
      editorial: ['', Validators.required],
      volumen: ['', Validators.required],    
      producto_id: ['', Validators.required],
      id_usuario_crea: [''],
      id_usuario_edita: ['']
    });
  }

  ngOnInit(): void {
    this.cargarComics();
  }

  cargarComics(): void {
    this.comicService.getComics({ page: 1, limit: 100 }).subscribe({
      next: (res: any) => {
        this.comics = res.data || res;
        this.comicsFiltrados = [...this.comics];
      },
      error: err => console.error('Error al cargar comics:', err)
    });
  }

  onFilterChange(): void {
    const filtro = this.filtroBusqueda.trim().toLowerCase();
    if (!filtro) {
      this.comicsFiltrados = [...this.comics];
      return;
    }
    this.comicsFiltrados = this.comics.filter(c =>
      c.id_comic.toLowerCase().includes(filtro)
    );
  }

  openCreateModal(): void {
    this.isEditMode = false;
    this.editingComic = null;

    this.comicForm.reset({
      ilustrador: '',
      editorial: '',
      volumen: '',
      producto_id: '',
      id_usuario_crea: '',
      id_usuario_edita: ''
    });

    this.showModal = true;
  }

  openEditModal(comic: Comic): void {
    this.isEditMode = true;
    this.editingComic = comic;

    this.comicForm.patchValue({
      ilustrador: comic.ilustrador,
      editorial: comic.editorial,
      volumen: comic.volumen,
      producto_id: comic.producto_id,
      id_usuario_edita: ''
    });

    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.editingComic = null;
  }

  saveComic(): void {
    if (this.comicForm.invalid) {
      this.comicForm.markAllAsTouched();
      return;
    }

    const value = this.comicForm.value;

    if (this.isEditMode && this.editingComic) {

      if (!value.id_usuario_edita) {
        alert('Debe ingresar un UUID para id_usuario_edita');
        return;
      }

      const updateData: UpdateComicRequest = {
        ilustrador: value.ilustrador,
        editorial: value.editorial,
        volumen: value.volumen,
        id_usuario_edita: value.id_usuario_edita
      };

      this.comicService.updateComic(this.editingComic.id_comic, updateData)
        .subscribe({
          next: () => {
            this.cargarComics();
            this.closeModal();
            alert('Comic actualizado correctamente');
          },
          error: err => console.error('Error al actualizar:', err)
        });

    } else {

      if (!value.id_usuario_crea) {
        alert('Debe ingresar un UUID para id_usuario_crea');
        return;
      }

      const createData: CreateComicRequest = {
        ilustrador: value.ilustrador,
        editorial: value.editorial,
        volumen: value.volumen,
        producto_id: value.producto_id,
        id_usuario_crea: value.id_usuario_crea
      };

      this.comicService.createComic(createData).subscribe({
        next: () => {
          this.cargarComics();
          this.closeModal();
          alert('Comic creado correctamente');
        },
        error: err => console.error('Error al crear:', err)
      });
    }
  }

  deleteComic(id: string): void {
    if (!confirm('¿Seguro deseas eliminar este comic?')) return;

    this.comicService.deleteComic(id).subscribe({
      next: () => this.cargarComics(),
      error: err => console.error('Error al eliminar:', err)
    });
  }
}
