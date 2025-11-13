import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

import { MapaService } from '../../core/services/mapa.service';
import { Mapa, CreateMapaRequest, UpdateMapaRequest } from '../../shared/models/mapa.model';

@Component({
  selector: 'app-mapa-list',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './mapa-list.component.html',
  styleUrls: ['./mapa-list.component.scss']
})
export class MapaListComponent implements OnInit {

  mapas: Mapa[] = [];
  mapasFiltrados: Mapa[] = [];

  filtroBusqueda: string = '';

  showModal = false;
  isEditMode = false;
  editingMapa: Mapa | null = null;

  mapaForm: FormGroup;

  constructor(
    private mapaService: MapaService,
    private fb: FormBuilder
  ) {
    this.mapaForm = this.fb.group({
      region: ['', Validators.required],
      escala: ['', Validators.required],
      tipo: ['', Validators.required],
      producto_id: [''],
      id_usuario_crea: [''],
      id_usuario_edita: ['']
    });
  }

  ngOnInit(): void {
    this.cargarMapas();
  }

  cargarMapas(): void {
    this.mapaService.getMapas({ page: 1, limit: 100 }).subscribe({
      next: (res: any) => {
        this.mapas = res.data || res;
        this.mapasFiltrados = [...this.mapas];
      },
      error: err => console.error('Error al cargar mapas:', err)
    });
  }

  onFilterChange(): void {
    const filtro = this.filtroBusqueda.trim().toLowerCase();
    if (!filtro) {
      this.mapasFiltrados = [...this.mapas];
      return;
    }
    this.mapasFiltrados = this.mapas.filter(m =>
      m.id_mapa.toLowerCase().includes(filtro)
    );
  }

  openCreateModal(): void {
    this.isEditMode = false;
    this.editingMapa = null;

    this.mapaForm.reset({
      region: '',
      escala: '',
      tipo: '',
      producto_id: '',
      id_usuario_crea: '',
      id_usuario_edita: ''
    });

    this.showModal = true;
  }

  openEditModal(mapa: Mapa): void {
    this.isEditMode = true;
    this.editingMapa = mapa;

    this.mapaForm.patchValue({
      region: mapa.region,
      escala: mapa.escala,
      tipo: mapa.tipo,
      id_usuario_edita: ''
    });

    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.editingMapa = null;
  }

  saveMapa(): void {
    if (this.mapaForm.invalid) {
      this.mapaForm.markAllAsTouched();
      return;
    }

    const value = this.mapaForm.value;

    
    if (this.isEditMode && this.editingMapa) {

      if (!value.id_usuario_edita) {
        alert('Debe ingresar un UUID para id_usuario_edita');
        return;
      }

      const updateData: UpdateMapaRequest = {
        region: value.region,
        escala: value.escala,
        tipo: value.tipo,
        id_usuario_edita: value.id_usuario_edita
      };

      this.mapaService.updateMapa(this.editingMapa.id_mapa, updateData)
        .subscribe({
          next: () => {
            this.cargarMapas();
            this.closeModal();
            alert('Mapa actualizado correctamente');
          },
          error: err => console.error('Error al actualizar:', err)
        });

    } else {
      

      if (!value.id_usuario_crea) {
        alert('Debe ingresar un UUID para id_usuario_crea');
        return;
      }

      const createData: CreateMapaRequest = {
        region: value.region,
        escala: value.escala,
        tipo: value.tipo,
        producto_id: value.producto_id,
        id_usuario_crea: value.id_usuario_crea
      };

      this.mapaService.createMapa(createData).subscribe({
        next: () => {
          this.cargarMapas();
          this.closeModal();
          alert('Mapa creado correctamente');
        },
        error: err => console.error('Error al crear:', err)
      });
    }
  }

  deleteMapa(id: string): void {
    if (!confirm('¿Seguro deseas eliminar este mapa?')) return;

    this.mapaService.deleteMapa(id).subscribe({
      next: () => this.cargarMapas(),
      error: err => console.error('Error al eliminar:', err)
    });
  }
}
