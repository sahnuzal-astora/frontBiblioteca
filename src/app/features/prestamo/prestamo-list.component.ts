import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PrestamoService } from '../../core/services/prestamo.service';
import { Prestamo, PrestamoFilters } from '../../shared/models/prestamo.models';

@Component({
  selector: 'app-prestamo-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './prestamo-list.component.html',
  styleUrls: ['./prestamo-list.component.scss']
})
export class PrestamoListComponent implements OnInit {
  prestamos: Prestamo[] = [];
  prestamosFiltrados: Prestamo[] = [];
  loading = false;

  // 🔍 Filtros
  filtroUsuarioId: string = '';
  filtroProductoId: string = '';
  filtroDevuelto: string = ''; // "", "true", "false"

  constructor(private prestamoService: PrestamoService) {}

  ngOnInit(): void {
    this.cargarPrestamos();
  }

  /** 🔄 Cargar préstamos desde el servicio */
  cargarPrestamos(): void {
  this.loading = true;
  const filters: PrestamoFilters = {};
  if (this.filtroUsuarioId) filters.usuario_id = this.filtroUsuarioId;
  if (this.filtroProductoId) filters.producto_id = this.filtroProductoId;
  if (this.filtroDevuelto === 'true') filters.devuelto = true;
  if (this.filtroDevuelto === 'false') filters.devuelto = false;

  this.prestamoService.getPrestamos({ page: 1, limit: 100 }, filters).subscribe({
    next: (res) => {
      // si res tiene data
      if ('data' in res) {
        this.prestamos = res.data;
      } else {
        this.prestamos = res as Prestamo[];
      }
      this.prestamosFiltrados = [...this.prestamos];
      this.loading = false;
    },
    error: (err) => {
      console.error('Error al cargar préstamos:', err);
      this.loading = false;
    }
  });
  }


  /** 🔍 Filtrar en memoria */
  onFilterChange(): void {
    this.prestamosFiltrados = this.prestamos.filter(p => {
      const matchUsuario = this.filtroUsuarioId ? p.usuario_id.includes(this.filtroUsuarioId) : true;
      const matchProducto = this.filtroProductoId ? p.producto_id.includes(this.filtroProductoId) : true;
      const matchDevuelto = this.filtroDevuelto === '' ? true :
        p.devuelto === (this.filtroDevuelto === 'true');
      return matchUsuario && matchProducto && matchDevuelto;
    });
  }
}
