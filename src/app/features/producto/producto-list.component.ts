import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProductoService } from '../../core/services/producto.service';
import { Producto, CreateProductoRequest, UpdateProductoRequest } from '../../shared/models/producto.model';

@Component({
  selector: 'app-producto-list',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './producto-list.component.html',
  styleUrls: ['./producto-list.component.scss']
})
export class ProductoListComponent implements OnInit {
  productos: Producto[] = [];
  productosFiltrados: Producto[] = [];
  loading = false;

  // 🔍 Filtro (por título o ID)
  filtroBusqueda: string = '';

  // 🪟 Control modal
  showModal = false;
  isEditMode = false;
  editingProducto: Producto | null = null;

  productoForm: FormGroup;

  constructor(
    private productoService: ProductoService,
    private fb: FormBuilder
  ) {
    this.productoForm = this.fb.group({
      titulo: ['', Validators.required],
      autor: ['', Validators.required],
      anio: [new Date().getFullYear(), [Validators.required, Validators.min(0)]],
      disponible: [true],
      id_usuario_crea: [''],
      id_usuario_edita: [''] // solo requerido al editar
    });
  }

  ngOnInit(): void {
    this.cargarProductos();
  }

  /** 🔄 Cargar productos */
  cargarProductos(): void {
    this.loading = true;
    this.productoService.getProductos({ page: 1, limit: 100 }).subscribe({
      next: (res: any) => {
        this.productos = res.data || res;
        this.productosFiltrados = [...this.productos];
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar productos:', err);
        this.loading = false;
      }
    });
  }

  /** 🔍 Filtrar por título o ID */
  onFilterChange(): void {
    const filtro = this.filtroBusqueda.trim().toLowerCase();

    if (!filtro) {
      this.productosFiltrados = [...this.productos];
      return;
    }

    this.productosFiltrados = this.productos.filter(p =>
      p.titulo.toLowerCase().includes(filtro) ||
      p.id_producto.toLowerCase().includes(filtro)
    );
  }

  /** 🆕 Crear */
  openCreateModal(): void {
    this.isEditMode = false;
    this.editingProducto = null;
    this.productoForm.reset({
      titulo: '',
      autor: '',
      anio: new Date().getFullYear(),
      disponible: true,
      id_usuario_crea: '',
      id_usuario_edita: ''
    });
    this.showModal = true;
  }

  /** ✏️ Editar */
  openEditModal(producto: Producto): void {
    this.isEditMode = true;
    this.editingProducto = producto;
    this.productoForm.patchValue({
      titulo: producto.titulo,
      autor: producto.autor,
      anio: producto.anio,
      disponible: producto.disponible,
      id_usuario_edita: '' // vacío al abrir el modal
    });
    this.showModal = true;
  }

  /** ❌ Cerrar modal */
  closeModal(): void {
    this.showModal = false;
    this.editingProducto = null;
  }

  /** 💾 Guardar producto */
  saveProducto(): void {
    if (this.productoForm.invalid) {
      this.productoForm.markAllAsTouched();
      return;
    }

    const formValue = this.productoForm.value;

    if (this.isEditMode && this.editingProducto) {
      if (!formValue.id_usuario_edita) {
        alert('⚠️ Debes ingresar el ID del usuario que edita');
        return;
      }

      const updateData: UpdateProductoRequest = {
        titulo: formValue.titulo,
        autor: formValue.autor,
        anio: formValue.anio,
        disponible: formValue.disponible,
        id_usuario_edita: formValue.id_usuario_edita
      };

      this.productoService.updateProducto(this.editingProducto.id_producto, updateData).subscribe({
        next: () => {
          this.cargarProductos();
          this.closeModal();
          alert('✅ Producto actualizado correctamente');
        },
        error: (err) => {
          console.error('Error al actualizar producto:', err);
          alert('❌ Error al actualizar producto');
        }
      });
    } else {
      const createData: CreateProductoRequest = {
        titulo: formValue.titulo,
        autor: formValue.autor,
        anio: formValue.anio,
        disponible: formValue.disponible,
        id_usuario_crea: formValue.id_usuario_crea
      };

      this.productoService.createProducto(createData).subscribe({
        next: () => {
          this.cargarProductos();
          this.closeModal();
          alert('✅ Producto creado correctamente');
        },
        error: (err) => {
          console.error('Error al crear producto:', err);
          alert('❌ Error al crear producto');
        }
      });
    }
  }

  /** 🗑️ Eliminar */
  deleteProducto(id: string): void {
    if (confirm('¿Seguro que deseas eliminar este producto?')) {
      this.productoService.deleteProducto(id).subscribe({
        next: () => this.cargarProductos(),
        error: (err) => console.error('Error al eliminar producto:', err)
      });
    }
  }
}
