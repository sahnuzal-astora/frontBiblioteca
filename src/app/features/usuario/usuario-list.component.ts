import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { UsuarioService } from '../../core/services/usuario.service';
import { CreateUsuarioRequest, UpdateUsuarioRequest, Usuario } from '../../shared/models/usuario.model';

@Component({
  selector: 'app-usuario-list',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './usuario-list.component.html',
  styleUrl: './usuario-list.component.scss'
})
export class UsuarioListComponent implements OnInit {
  usuarios: Usuario[] = [];
  usuariosFiltrados: Usuario[] = [];
  loading = false;

  // 🔹 Filtro por ID
  filtroId: string = '';

  // 🔹 Control de modal
  showModal = false;
  isEditMode = false;
  editingUsuario: Usuario | null = null;

  // 🔹 Formulario reactivo
  usuarioForm: FormGroup;

  constructor(
    private usuarioService: UsuarioService,
    private fb: FormBuilder
  ) {
    this.usuarioForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      telefono: [''],
      contrasena_hash: [''], // solo se usa al crear
      activo: [true],
      es_admin: [false]
    });
  }

  ngOnInit(): void {
    this.cargarUsuarios();
  }

  /** 🔄 Cargar usuarios del backend */
  cargarUsuarios(): void {
    this.loading = true;
    this.usuarioService.getUsuarios({ page: 1, limit: 100 }).subscribe({
      next: (res: any) => {
        this.usuarios = res.data || res;
        this.usuariosFiltrados = [...this.usuarios];
        this.loading = false;
      },
      error: (err: any) => {
        console.error('Error al cargar usuarios:', err);
        this.loading = false;
      }
    });
  }

  /** 🔍 Filtrar por ID */
  aplicarFiltros(): void {
    const idFiltro = this.filtroId.trim();

    if (idFiltro === '') {
      this.usuariosFiltrados = [...this.usuarios];
      return;
    }

    this.usuariosFiltrados = this.usuarios.filter(usuario =>
      usuario.idusuario.toString().includes(idFiltro)
    );
  }

  onFilterChange(): void {
    this.aplicarFiltros();
  }

  limpiarFiltros(): void {
    this.filtroId = '';
    this.usuariosFiltrados = [...this.usuarios];
  }

  /** 🆕 Abrir modal para crear un nuevo usuario */
  openCreateModal(): void {
    this.isEditMode = false;
    this.editingUsuario = null;
    this.usuarioForm.reset({
      nombre: '',
      email: '',
      telefono: '',
      contrasena_hash: '',
      activo: true,
      es_admin: false
    });
    this.showModal = true;
  }

  /** ✏️ Abrir modal para editar un usuario existente */
  openEditModal(usuario: Usuario): void {
    this.isEditMode = true;
    this.editingUsuario = usuario;
    this.usuarioForm.patchValue({
      nombre: usuario.nombre,
      email: usuario.email,
      telefono: usuario.telefono,
      activo: usuario.activo,
      es_admin: usuario.es_admin
    });
    this.showModal = true;
  }

  /** ❌ Cerrar modal */
  closeModal(): void {
    this.showModal = false;
    this.editingUsuario = null;
  }

  /** 💾 Guardar o actualizar usuario */
  saveUsuario(): void {
    if (this.usuarioForm.invalid) {
      this.usuarioForm.markAllAsTouched();
      return;
    }

    const formValue = this.usuarioForm.value;

    if (this.isEditMode && this.editingUsuario) {
      // 🔄 Actualizar usuario
      const updateData: UpdateUsuarioRequest = {
        nombre: formValue.nombre,
        email: formValue.email,
        telefono: formValue.telefono,
        activo: formValue.activo,
        es_admin: formValue.es_admin
      };

      this.usuarioService.updateUsuario(this.editingUsuario.idusuario, updateData).subscribe({
        next: () => {
          this.cargarUsuarios();
          this.closeModal();
          alert('✅ Usuario actualizado correctamente');
        },
        error: (err: any) => {
          console.error('Error al actualizar usuario:', err);
          alert('❌ Error al actualizar usuario');
        }
      });
    } else {
      // 🆕 Crear nuevo usuario
      const createData: CreateUsuarioRequest = {
        nombre: formValue.nombre,
        email: formValue.email,
        telefono: formValue.telefono,
        esadmin: formValue.es_admin,
        password: formValue.contrasena_hash || 'default123',
        contrasena_hash: formValue.contrasena_hash
      };

      this.usuarioService.createUsuario(createData).subscribe({
        next: () => {
          this.cargarUsuarios();
          this.closeModal();
          alert('✅ Usuario creado correctamente');
        },
        error: (err: any) => {
          console.error('Error al crear usuario:', err);
          alert('❌ Error al crear usuario');
        }
      });
    }
  }

  /** 🗑️ Eliminar usuario */
  deleteUsuario(id: number): void {
    if (confirm('¿Seguro que deseas eliminar este usuario?')) {
      this.usuarioService.deleteUsuario(id).subscribe({
        next: () => {
          this.cargarUsuarios();
          alert('🗑️ Usuario eliminado correctamente');
        },
        error: (err: any) => {
          console.error('Error al eliminar usuario:', err);
          alert('❌ Error al eliminar usuario');
        }
      });
    }
  }
}
