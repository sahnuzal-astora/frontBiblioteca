import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { PeriodicoService } from '../../core/services/periodico.service';
import {
  Periodico,
  CreatePeriodicoRequest,
  UpdatePeriodicoRequest
} from '../../shared/models/periodico.model';

@Component({
  selector: 'app-periodico-list',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './periodico-list.component.html',
  styleUrls: ['./periodico-list.component.scss']
})
export class PeriodicoListComponent implements OnInit {
  periodicos: Periodico[] = [];
  periodicosFiltrados: Periodico[] = [];

  filtroBusqueda: string = '';

  
  showModal = false;
  isEditMode = false;
  editingPeriodico: Periodico | null = null;

  
  periodicoForm: FormGroup;

  constructor(
    private periodicoService: PeriodicoService,
    private fb: FormBuilder
  ) {
    this.periodicoForm = this.fb.group({
      fecha_publicacion: ['', Validators.required],
      producto_id: ['', Validators.required],
      id_usuario_crea: [''],
      id_usuario_edita: ['']
    });
  }

  ngOnInit(): void {
    this.cargarPeriodicos();
  }

  
  cargarPeriodicos(): void {
    this.periodicoService.getPeriodicos({ page: 1, limit: 100 }).subscribe({
      next: (res: any) => {
        this.periodicos = res.data || res;
        this.periodicosFiltrados = [...this.periodicos];
      },
      error: err => console.error('Error al cargar periódicos:', err)
    });
  }

  
  onFilterChange(): void {
    const filtro = this.filtroBusqueda.trim().toLowerCase();
    if (!filtro) {
      this.periodicosFiltrados = [...this.periodicos];
      return;
    }
    this.periodicosFiltrados = this.periodicos.filter(p =>
      p.id_periodico.toLowerCase().includes(filtro)
    );
  }

  
  openCreateModal(): void {
    this.isEditMode = false;
    this.editingPeriodico = null;
    this.periodicoForm.reset({
      fecha_publicacion: '',
      producto_id: '',
      id_usuario_crea: '',
      id_usuario_edita: ''
    });
    this.showModal = true;
  }

  
  openEditModal(periodico: Periodico): void {
    this.isEditMode = true;
    this.editingPeriodico = periodico;
    this.periodicoForm.patchValue({
      fecha_publicacion: periodico.fecha_publicacion,
      producto_id: periodico.producto_id,
      id_usuario_edita: ''
    });
    this.showModal = true;
  }

  
  closeModal(): void {
    this.showModal = false;
    this.editingPeriodico = null;
  }

  
  savePeriodico(): void {
    if (this.periodicoForm.invalid) {
      this.periodicoForm.markAllAsTouched();
      return;
    }

    const formValue = this.periodicoForm.value;

    if (this.isEditMode && this.editingPeriodico) {
      
      if (!formValue.id_usuario_edita) {
        alert('Debe ingresar un UUID para "id_usuario_edita"');
        return;
      }

      const updateData: UpdatePeriodicoRequest = {
        fecha_publicacion: formValue.fecha_publicacion,
        id_usuario_edita: formValue.id_usuario_edita
      };

      this.periodicoService
        .updatePeriodico(this.editingPeriodico.id_periodico, updateData)
        .subscribe({
          next: () => {
            this.cargarPeriodicos();
            this.closeModal();
            alert('Periódico actualizado correctamente ✅');
          },
          error: err => console.error('Error al actualizar periódico:', err)
        });
    } else {
      // 🟩 Crear periódico
      if (!formValue.id_usuario_crea) {
        alert('Debe ingresar un UUID para "id_usuario_crea"');
        return;
      }

      const createData: CreatePeriodicoRequest = {
        fecha_publicacion: formValue.fecha_publicacion,
        producto_id: formValue.producto_id,
        id_usuario_crea: formValue.id_usuario_crea
      };

      this.periodicoService.createPeriodico(createData).subscribe({
        next: () => {
          this.cargarPeriodicos();
          this.closeModal();
          alert('Periódico creado correctamente ✅');
        },
        error: err => console.error('Error al crear periódico:', err)
      });
    }
  }

  
  deletePeriodico(id: string): void {
    if (!confirm('¿Seguro deseas eliminar este periódico?')) return;

    this.periodicoService.deletePeriodico(id).subscribe({
      next: () => {
        this.cargarPeriodicos();
        alert('Periódico eliminado correctamente 🗑️');
      },
      error: err => console.error('Error al eliminar periódico:', err)
    });
  }
}
