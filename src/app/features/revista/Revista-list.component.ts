import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RevistaService } from '../../core/services/revista.service';
import { CreateRevistaRequest, Revista, UpdateRevistaRequest } from '../../shared/models/revista.model';

@Component({
  selector: 'app-revista-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './revista-list.component.html',
  styleUrls: ['./revista-list.component.scss']
})
export class RevistaListComponent implements OnInit {

  revistas: Revista[] = [];
  revistasFiltradas: Revista[] = [];

  filtroIdRevista = '';
  filtroEdicion = '';

  showModal = false;
  isEditMode = false;
  editingRevista: Revista | null = null;

  revistaForm: any = {};

  constructor(private revistaService: RevistaService) {}

  ngOnInit(): void {
    this.cargarRevistas();
  }

  
  cargarRevistas(): void {
    this.revistaService.getRevistas({ page: 1, limit: 50 }).subscribe({
      next: res => {
        this.revistas = res.data || [];
        this.revistasFiltradas = [...this.revistas];
      },
      error: err => console.error('Error cargando revistas', err)
    });
  }

  
  filtrarRevistas(): void {
    const id = this.filtroIdRevista.trim().toLowerCase();
    const edicion = this.filtroEdicion.trim().toLowerCase();

    this.revistasFiltradas = this.revistas.filter(r =>
      r.id_revista.toLowerCase().includes(id) &&
      r.edicion.toLowerCase().includes(edicion)
    );
  }

  
  openCreateModal(): void {
    this.revistaForm = {};
    this.isEditMode = false;
    this.editingRevista = null;
    this.showModal = true;
  }

  
  openEditModal(revista: Revista): void {
    this.revistaForm = { ...revista };
    this.isEditMode = true;
    this.editingRevista = revista;
    this.showModal = true;
  }

  
  closeModal(): void {
    this.showModal = false;
    this.editingRevista = null;
  }

  
  saveRevista(): void {
    if (this.isEditMode && this.editingRevista) {
      if (!this.revistaForm.id_usuario_edita) {
        alert('Debe ingresar un UUID para id_usuario_edita');
        return;
      }

      const updateData: UpdateRevistaRequest = {
        edicion: this.revistaForm.edicion,
        id_usuario_edita: this.revistaForm.id_usuario_edita
      };

      this.revistaService.updateRevista(this.editingRevista.id_revista, updateData)
        .subscribe({
          next: () => {
            this.cargarRevistas();
            this.closeModal();
            alert('Revista actualizada correctamente');
          },
          error: err => console.error('Error actualizando revista', err)
        });

    } else {
      if (!this.revistaForm.id_usuario_crea || !this.revistaForm.producto_id) {
        alert('Debe ingresar UUID para id_usuario_crea y producto_id');
        return;
      }

      const createData: CreateRevistaRequest = {
        edicion: this.revistaForm.edicion,
        producto_id: this.revistaForm.producto_id,
        id_usuario_crea: this.revistaForm.id_usuario_crea
      };

      this.revistaService.createRevista(createData).subscribe({
        next: () => {
          this.cargarRevistas();
          this.closeModal();
          alert('Revista creada correctamente');
        },
        error: err => console.error('Error creando revista', err)
      });
    }
  }

  
  deleteRevista(idRevista: string): void {
    if (!confirm('¿Seguro que deseas eliminar esta revista?')) return;

    this.revistaService.deleteRevista(idRevista).subscribe({
      next: () => this.cargarRevistas(),
      error: err => console.error('Error eliminando revista', err)
    });
  }
}
