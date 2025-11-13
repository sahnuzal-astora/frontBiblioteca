import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

import { AudiolibroService } from '../../core/services/audiolibro.service';
import { Audiolibro, CreateAudiolibroRequest, UpdateAudiolibroRequest } from '../../shared/models/audiolibro.model';

@Component({
  selector: 'app-audiolibro-list',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './audiolibro-list.component.html',
  styleUrls: ['./audiolibro-list.component.scss']
})
export class AudiolibroListComponent implements OnInit {

  audiolibros: Audiolibro[] = [];
  audiolibrosFiltrados: Audiolibro[] = [];

  
  filtroBusqueda: string = '';

  showModal = false;
  isEditMode = false;
  editingAudiolibro: Audiolibro | null = null;

  audiolibroForm: FormGroup;

  constructor(
    private audiolibroService: AudiolibroService,
    private fb: FormBuilder
  ) {
    this.audiolibroForm = this.fb.group({
      narrador: ['', Validators.required],
      duracion: [0, [Validators.required, Validators.min(1)]],
      formato: ['', Validators.required],
      producto_id: ['', Validators.required],
      id_usuario_crea: [''], 
      id_usuario_edita: ['']
    });
  }

  ngOnInit(): void {
    this.cargarAudiolibros();
  }

  cargarAudiolibros(): void {
    this.audiolibroService.getAudiolibros({ page: 1, limit: 100 }).subscribe({
      next: (res: any) => {
        this.audiolibros = res.data || res;
        this.audiolibrosFiltrados = [...this.audiolibros];
      },
      error: err => console.error('Error al cargar audiolibros:', err)
    });
  }

  onFilterChange(): void {
    const filtro = this.filtroBusqueda.trim().toLowerCase();
    if (!filtro) {
      this.audiolibrosFiltrados = [...this.audiolibros];
      return;
    }
    this.audiolibrosFiltrados = this.audiolibros.filter(a =>
      a.id_audiolibro.toLowerCase().includes(filtro)
    );
  }

  openCreateModal(): void {
    this.isEditMode = false;
    this.editingAudiolibro = null;

    this.audiolibroForm.reset({
      narrador: '',
      duracion: 0,
      formato: '',
      producto_id: '',
      id_usuario_crea: '',
      id_usuario_edita: ''
    });

    this.showModal = true;
  }

  openEditModal(audiolibro: Audiolibro): void {
    this.isEditMode = true;
    this.editingAudiolibro = audiolibro;

    this.audiolibroForm.patchValue({
      narrador: audiolibro.narrador,
      duracion: audiolibro.duracion,
      formato: audiolibro.formato,
      producto_id: audiolibro.producto_id,
      id_usuario_edita: ''
    });

    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.editingAudiolibro = null;
  }

  saveAudiolibro(): void {
    if (this.audiolibroForm.invalid) {
      this.audiolibroForm.markAllAsTouched();
      return;
    }

    const value = this.audiolibroForm.value;

    if (this.isEditMode && this.editingAudiolibro) {
      if (!value.id_usuario_edita) {
        alert('Debe ingresar un UUID para id_usuario_edita');
        return;
      }

      const updateData: UpdateAudiolibroRequest = {
        narrador: value.narrador,
        duracion: value.duracion,
        formato: value.formato,
        id_usuario_edita: value.id_usuario_edita
      };

      this.audiolibroService.updateAudiolibro(this.editingAudiolibro.id_audiolibro, updateData)
        .subscribe({
          next: () => {
            this.cargarAudiolibros();
            this.closeModal();
            alert('Audiolibro actualizado correctamente');
          },
          error: err => console.error('Error al actualizar:', err)
        });

    } else {

      if (!value.id_usuario_crea) {
        alert('Debe ingresar un UUID para id_usuario_crea');
        return;
      }

      const createData: CreateAudiolibroRequest = {
        narrador: value.narrador,
        duracion: value.duracion,
        formato: value.formato,
        producto_id: value.producto_id,
        id_usuario_crea: value.id_usuario_crea
      };

      this.audiolibroService.createAudiolibro(createData).subscribe({
        next: () => {
          this.cargarAudiolibros();
          this.closeModal();
          alert('Audiolibro creado correctamente');
        },
        error: err => console.error('Error al crear:', err)
      });
    }
  }

  deleteAudiolibro(id: string): void {
    if (!confirm('¿Seguro deseas eliminar este audiolibro?')) return;

    this.audiolibroService.deleteAudiolibro(id).subscribe({
      next: () => this.cargarAudiolibros(),
      error: err => console.error('Error al eliminar:', err)
    });
  }
}
