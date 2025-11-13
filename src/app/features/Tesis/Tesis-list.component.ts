import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { TesisService } from '../../core/services/tesis.service';
import { Tesis, CreateTesisRequest, UpdateTesisRequest } from '../../shared/models/tesis.model';

@Component({
  selector: 'app-tesis-list',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './tesis-list.component.html',
  styleUrls: ['./tesis-list.component.scss']
})
export class TesisListComponent implements OnInit {

  tesis: (Tesis & { director?: string })[] = [];
  tesisFiltradas: (Tesis & { director?: string })[] = [];

  filtroBusqueda: string = '';

  showModal = false;
  isEditMode = false;
  editingTesis: (Tesis & { director?: string }) | null = null;

  tesisForm: FormGroup;

  constructor(
    private tesisService: TesisService,
    private fb: FormBuilder
  ) {
    this.tesisForm = this.fb.group({
      universidad: ['', Validators.required],
      director: ['', Validators.required],
      grado_academico: ['', Validators.required],
      producto_id: ['', Validators.required],
      id_usuario_crea: [''],
      id_usuario_edita: ['']
    });
  }

  ngOnInit(): void {
    this.cargarTesis();
  }

  // 🔄 Obtener lista de tesis
  cargarTesis(): void {
    this.tesisService.getTesis().subscribe({
      next: (res: any) => {
        this.tesis = res.data || res;
        this.tesisFiltradas = [...this.tesis];
      },
      error: err => console.error('Error al cargar tesis:', err)
    });
  }

  // 🔍 Filtrar por id_tesis o universidad
  onFilterChange(): void {
    const filtro = this.filtroBusqueda.trim().toLowerCase();

    if (!filtro) {
      this.tesisFiltradas = [...this.tesis];
      return;
    }

    this.tesisFiltradas = this.tesis.filter(t =>
      (t.id_tesis?.toLowerCase().includes(filtro) || '') ||
      (t.universidad?.toLowerCase().includes(filtro) || '')
    );
  }

  // ➕ Abrir modal de creación
  openCreateModal(): void {
    this.isEditMode = false;
    this.editingTesis = null;
    this.tesisForm.reset({
      universidad: '',
      director: '',
      grado_academico: '',
      producto_id: '',
      id_usuario_crea: '',
      id_usuario_edita: ''
    });

    this.showModal = true;
    document.body.classList.add('modal-open');
  }

  // ✏️ Abrir modal de edición
  openEditModal(tesis: Tesis & { director?: string }): void {
    this.isEditMode = true;
    this.editingTesis = tesis;

    this.tesisForm.patchValue({
      universidad: tesis.universidad,
      director: tesis.director || '',
      grado_academico: tesis.grado_academico,
      producto_id: tesis.producto_id,
      id_usuario_crea: '',
      id_usuario_edita: ''
    });

    this.showModal = true;
    document.body.classList.add('modal-open');
  }

  // ❌ Cerrar modal
  closeModal(): void {
    this.showModal = false;
    this.editingTesis = null;
    this.tesisForm.reset();
    document.body.classList.remove('modal-open');
  }

  // 💾 Guardar o actualizar
  saveTesis(): void {
    if (this.tesisForm.invalid) {
      this.tesisForm.markAllAsTouched();
      return;
    }

    const value = this.tesisForm.value;

    if (this.isEditMode && this.editingTesis) {
      // 🟣 Actualizar
      if (!value.id_usuario_edita) {
        alert('Debe ingresar un UUID para id_usuario_edita');
        return;
      }

      const updateData: UpdateTesisRequest = {
        universidad: value.universidad,
        director: value.director,
        grado_academico: value.grado_academico,
        id_usuario_edita: value.id_usuario_edita
      };

      this.tesisService.updateTesis(this.editingTesis.id_tesis, updateData).subscribe({
        next: () => {
          alert('Tesis actualizada correctamente');
          this.cargarTesis();
          this.closeModal();
        },
        error: err => console.error('Error al actualizar tesis:', err)
      });

    } else {
      // 🟢 Crear nueva
      if (!value.id_usuario_crea) {
        alert('Debe ingresar un UUID para id_usuario_crea');
        return;
      }

      const createData: CreateTesisRequest = {
        universidad: value.universidad,
        director: value.director,
        grado_academico: value.grado_academico,
        producto_id: value.producto_id,
        id_usuario_crea: value.id_usuario_crea
      };

      this.tesisService.createTesis(createData).subscribe({
        next: () => {
          alert('Tesis creada correctamente');
          this.cargarTesis();
          this.closeModal();
        },
        error: err => console.error('Error al crear tesis:', err)
      });
    }
  }

  // 🗑️ Eliminar tesis
  deleteTesis(id: string): void {
    if (!confirm('¿Seguro deseas eliminar esta tesis?')) return;

    this.tesisService.deleteTesis(id).subscribe({
      next: () => {
        alert('Tesis eliminada correctamente');
        this.cargarTesis();
      },
      error: err => console.error('Error al eliminar tesis:', err)
    });
  }
}
