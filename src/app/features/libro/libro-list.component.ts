import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

import { LibroService } from '../../core/services/libro.services';
import { Libro, CreateLibroRequest, UpdateLibroRequest } from '../../shared/models/libro.model';

@Component({
  selector: 'app-libro-list',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './libro-list.component.html',
  styleUrls: ['./libro-list.component.scss']
})
export class LibroListComponent implements OnInit {

  libros: Libro[] = [];
  librosFiltrados: Libro[] = [];

  filtroIdLibro: string = '';

  showModal = false;
  isEditMode = false;
  editingLibro: Libro | null = null;

  libroForm: FormGroup;

  constructor(
    private libroService: LibroService,
    private fb: FormBuilder
  ) {
    this.libroForm = this.fb.group({
      genero: ['', Validators.required],
      paginas: [0, [Validators.required, Validators.min(1)]],
      producto_id: ['', Validators.required],
      id_usuario_crea: [''],
      id_usuario_edita: ['']
    });
  }

  ngOnInit(): void {
    this.cargarLibros();
  }

  cargarLibros(): void {
    this.libroService.getLibros({ page: 1, limit: 100 }).subscribe({
      next: (res: any) => {
        this.libros = res.data || res;
        this.librosFiltrados = [...this.libros];
      },
      error: (err) => console.error('Error al cargar libros:', err)
    });
  }

  // ✅ Filtrar solo por ID
  filtrarLibros(): void {
    const filtro = this.filtroIdLibro.trim().toLowerCase();

    if (!filtro) {
      this.librosFiltrados = [...this.libros];
      return;
    }

    this.librosFiltrados = this.libros.filter(l =>
      l.id_libro.toLowerCase().includes(filtro)
    );
  }

  // ➕ Crear nuevo
  openCreateModal(): void {
    this.isEditMode = false;
    this.editingLibro = null;

    this.libroForm.reset({
      genero: '',
      paginas: 0,
      producto_id: '',
      id_usuario_crea: '',
      id_usuario_edita: ''
    });

    this.showModal = true;
  }

  // ✏️ Editar existente
  openEditModal(libro: Libro): void {
    this.isEditMode = true;
    this.editingLibro = libro;

    this.libroForm.patchValue({
      genero: libro.genero,
      paginas: libro.paginas,
      producto_id: libro.producto_id,
      id_usuario_edita: ''
    });

    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.editingLibro = null;
  }

  saveLibro(): void {
    if (this.libroForm.invalid) {
      this.libroForm.markAllAsTouched();
      return;
    }

    const value = this.libroForm.value;

    // ✅ Modo edición
    if (this.isEditMode && this.editingLibro) {

      if (!value.id_usuario_edita) {
        alert('Debe ingresar un UUID para id_usuario_edita');
        return;
      }

      const updateData: UpdateLibroRequest = {
        genero: value.genero,
        paginas: value.paginas,
        id_usuario_edita: value.id_usuario_edita
      };

      this.libroService.updateLibro(this.editingLibro.id_libro, updateData)
        .subscribe({
          next: () => {
            this.cargarLibros();
            this.closeModal();
            alert('Libro actualizado correctamente');
          },
          error: err => console.error('Error al actualizar:', err)
        });

    } else {
      // ✅ Modo crear

      if (!value.id_usuario_crea) {
        alert('Debe ingresar un UUID para id_usuario_crea');
        return;
      }

      const createData: CreateLibroRequest = {
        genero: value.genero,
        paginas: value.paginas,
        producto_id: value.producto_id,
        id_usuario_crea: value.id_usuario_crea
      };

      this.libroService.createLibro(createData)
        .subscribe({
          next: () => {
            this.cargarLibros();
            this.closeModal();
            alert('Libro creado correctamente');
          },
          error: err => console.error('Error al crear:', err)
        });
    }
  }

  deleteLibro(id: string): void {
    if (!confirm('¿Seguro deseas eliminar este libro?')) return;

    this.libroService.deleteLibro(id).subscribe({
      next: () => this.cargarLibros(),
      error: err => console.error('Error al eliminar:', err)
    });
  }
}

