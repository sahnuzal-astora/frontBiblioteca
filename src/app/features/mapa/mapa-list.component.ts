import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-mapa-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './mapa-list.component.html',
  styleUrls: ['./mapa-list.component.scss']
})
export class MapaListComponent {
  // 🗺️ Lista inicial de mapas
  mapas = [
    { idMapa: 1, region: 'Sudamérica', escala: '1:50000', tipo: 'Político' },
    { idMapa: 2, region: 'Europa Occidental', escala: '1:100000', tipo: 'Físico' },
    { idMapa: 3, region: 'Asia Oriental', escala: '1:75000', tipo: 'Climático' }
  ];

  mapasFiltrados = [...this.mapas];
  filtroRegion = '';
  filtroIdMapa = '';

  showModal = false;
  isEditMode = false;
  mapaForm: any = {};

  // 🔍 Filtrar mapas
  filtrarMapas() {
    const region = this.filtroRegion.toLowerCase();
    const id = this.filtroIdMapa.toString().toLowerCase();

    this.mapasFiltrados = this.mapas.filter(m =>
      m.region.toLowerCase().includes(region) &&
      m.idMapa.toString().includes(id)
    );
  }

  // ➕ Crear nuevo mapa
  openCreateModal() {
    this.mapaForm = {};
    this.isEditMode = false;
    this.showModal = true;
  }

  // ✏️ Editar mapa existente
  openEditModal(mapa: any) {
    this.mapaForm = { ...mapa };
    this.isEditMode = true;
    this.showModal = true;
  }

  // ❌ Cerrar modal
  closeModal() {
    this.showModal = false;
  }

  // 💾 Guardar (crear o actualizar)
  saveMapa() {
    if (this.isEditMode) {
      const index = this.mapas.findIndex(m => m.idMapa === this.mapaForm.idMapa);
      if (index !== -1) this.mapas[index] = { ...this.mapaForm };
    } else {
      const nuevo = { ...this.mapaForm };
      nuevo.idMapa = this.generarNuevoId();
      this.mapas.push(nuevo);
    }
    this.closeModal();
    this.filtrarMapas();
  }

  // 🗑️ Eliminar mapa
  deleteMapa(idMapa: number) {
    if (confirm('¿Seguro que deseas eliminar este mapa?')) {
      this.mapas = this.mapas.filter(m => m.idMapa !== idMapa);
      this.filtrarMapas();
    }
  }

  // ⚙️ Generar ID automático
  private generarNuevoId(): number {
    return this.mapas.length > 0
      ? Math.max(...this.mapas.map(m => m.idMapa)) + 1
      : 1;
  }
}
