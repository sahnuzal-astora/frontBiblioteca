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

  filtroIdProducto: string = '';
  showModal = false;
  isEditMode = false;
  productoForm: FormGroup;
  editingProducto: Producto | null = null;

  loading: boolean = false;

  constructor(
    private productoService: ProductoService,
    private fb: FormBuilder
  ) {
    this.productoForm = this.fb.group({
      titulo: ['', [Validators.required]],
      autor: ['', [Validators.required]],
      anio: [new Date().getFullYear(), [Validators.required, Validators.min(0)]],
      disponible: [true],
      id_usuario_crea: ['', [this.uuidValidator]],
      id_usuario_edita: ['', [this.uuidValidator]]
    });
  }

  ngOnInit(): void {
    this.cargarProductos();
  }

  /** 🔄 Cargar productos desde el backend */
  /** 🔄 Cargar productos desde el backend */
cargarProductos(): void {
  this.loading = true;

  this.productoService.getProductos({ page: 1, limit: 100 }).subscribe({
    next: (res: any) => {
      // 🧩 Manejo flexible según la estructura que devuelva el backend
      if (Array.isArray(res)) {
        // Si el backend devuelve directamente una lista
        this.productos = res;
      } else if (res && Array.isArray(res.data)) {
        // Si devuelve { data: [...] }
        this.productos = res.data;
      } else if (res && Array.isArray(res.results)) {
        // Si devuelve { results: [...] }
        this.productos = res.results;
      } else {
        console.warn('⚠️ Estructura de respuesta desconocida:', res);
        this.productos = [];
      }

      this.productosFiltrados = [...this.productos];
      this.loading = false;
      console.log('✅ Productos cargados:', this.productos);
    },
    error: (err) => {
      console.error('❌ Error al cargar productos:', err);
      this.loading = false;
    }
  });
  }


  /** 🔍 Filtro */
  filtrarProductos(): void {
    const filtro = this.filtroIdProducto.trim().toLowerCase();
    if (!filtro) {
      this.productosFiltrados = [...this.productos];
      return;
    }
    this.productosFiltrados = this.productos.filter(
      (p) =>
        p.id_producto.toLowerCase().includes(filtro) ||
        p.titulo.toLowerCase().includes(filtro)
    );
  }

  /** 🆕 Abrir modal de creación */
  openCreateModal(): void {
    this.isEditMode = false;
    this.editingProducto = null;
    this.productoForm.reset({
      titulo: '',
      autor: '',
      anio: new Date().getFullYear(),
      disponible: true,
      id_usuario_crea: this.obtenerUUIDValido(),
      id_usuario_edita: ''
    });
    this.showModal = true;
  }

  /** ✏️ Abrir modal de edición */
  openEditModal(producto: Producto): void {
    this.isEditMode = true;
    this.editingProducto = producto;
    this.productoForm.reset({
      titulo: producto.titulo,
      autor: producto.autor,
      anio: typeof producto.anio === 'number' ? producto.anio : new Date(producto.anio).getFullYear(),
      disponible: producto.disponible,
      id_usuario_crea: '',
      id_usuario_edita: this.obtenerUUIDValido()
    });
    this.showModal = true;
  }

  /** ❌ Cerrar modal */
  closeModal(): void {
    this.showModal = false;
    this.editingProducto = null;
  }

  /** 💾 Guardar o actualizar producto */
  saveProducto(): void {
    if (this.productoForm.invalid) {
      this.productoForm.markAllAsTouched();
      return;
    }

    const formValue = this.productoForm.value;
    const anioNumero = Number(formValue.anio);

    if (isNaN(anioNumero)) {
      alert('El año debe ser un número válido.');
      return;
    }

    this.loading = true;

    if (this.isEditMode && this.editingProducto) {
      // 🔄 Actualizar
      const updateData: UpdateProductoRequest = {
        titulo: formValue.titulo,
        autor: formValue.autor,
        anio: anioNumero,
        disponible: formValue.disponible,
        id_usuario_edita: formValue.id_usuario_edita || this.obtenerUUIDValido()
      };

      this.productoService.updateProducto(this.editingProducto.id_producto, updateData).subscribe({
        next: () => {
          this.cargarProductos();
          this.closeModal();
          this.loading = false;
          alert('✅ Producto actualizado correctamente');
        },
        error: (err) => {
          console.error('Error al actualizar producto:', err);
          this.loading = false;
          alert('❌ Error al actualizar producto');
        }
      });
    } else {
      // 🆕 Crear nuevo producto
      const createData: CreateProductoRequest = {
        titulo: formValue.titulo,
        autor: formValue.autor,
        anio: anioNumero,
        disponible: formValue.disponible,
        id_usuario_crea: formValue.id_usuario_crea || this.obtenerUUIDValido()
      };

      this.productoService.createProducto(createData).subscribe({
        next: () => {
          this.cargarProductos();
          this.closeModal();
          this.loading = false;
          alert('✅ Producto creado correctamente');
        },
        error: (err) => {
          console.error('Error al crear producto:', err);
          this.loading = false;
          alert('❌ Error al crear producto');
        }
      });
    }
  }

  /** 🗑️ Eliminar producto */
  deleteProducto(id: string): void {
    if (confirm('¿Seguro que deseas eliminar este producto?')) {
      this.loading = true;
      this.productoService.deleteProducto(id).subscribe({
        next: () => {
          this.cargarProductos();
          this.loading = false;
          alert('🗑️ Producto eliminado correctamente');
        },
        error: (err) => {
          console.error('Error al eliminar producto:', err);
          this.loading = false;
          alert('❌ Error al eliminar producto');
        }
      });
    }
  }

  /** 🧠 Obtener UUID desde localStorage o valor por defecto */
  private obtenerUUIDValido(): string {
    const uuid = localStorage.getItem('id_usuario');
    const regexUUID =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

    if (uuid && regexUUID.test(uuid)) {
      return uuid;
    }

    // UUID de prueba
    return '3fa85f64-5717-4562-b3fc-2c963f66afa6';
  }

  /** ✅ Validador personalizado para UUID */
  private uuidValidator(control: any): { [key: string]: boolean } | null {
    if (!control.value) return null;
    const regexUUID =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return regexUUID.test(control.value) ? null : { invalidUUID: true };
  }
}
