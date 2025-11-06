import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-biblioteca-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="dashboard fade-in">
      <!-- Encabezado -->
      <div class="welcome-section">
        <div class="card glass">
          <div class="card-body text-center">
            <div class="welcome-icon">📚</div>
            <h1 class="welcome-title text-title-contrast">Sistema de Biblioteca</h1>
            <p class="welcome-subtitle text-high-contrast">
              Gestión integral de usuarios, préstamos y materiales digitales o físicos
            </p>
          </div>
        </div>
      </div>

      <!-- Sección de módulos -->
      <div class="modules-grid">
        <!-- USUARIOS -->
        <div class="module-card slide-in-up" style="animation-delay: 0.1s">
          <div class="card">
            <div class="card-body text-center">
              <div class="module-icon">👥</div>
              <h3 class="module-title">Usuarios</h3>
              <p class="module-description">Administra los miembros registrados de la biblioteca</p>
              <div class="module-features">
                <span class="feature-tag">CRUD</span>
                <span class="feature-tag">Roles</span>
                <span class="feature-tag">Autenticación</span>
              </div>
              <a routerLink="/usuario" class="btn btn-primary btn-lg">
                <span class="btn-icon">👤</span> Ver Usuarios
              </a>
            </div>
          </div>
        </div>

        <!-- PRÉSTAMOS -->
        <div class="module-card slide-in-up" style="animation-delay: 0.2s">
          <div class="card">
            <div class="card-body text-center">
              <div class="module-icon">🔄</div>
              <h3 class="module-title">Préstamos</h3>
              <p class="module-description">Registra y gestiona los préstamos activos o devueltos</p>
              <div class="module-features">
                <span class="feature-tag">Fechas</span>
                <span class="feature-tag">Historial</span>
                <span class="feature-tag">Control</span>
              </div>
              <a routerLink="/prestamo" class="btn btn-primary btn-lg">
                <span class="btn-icon">📅</span> Gestionar Préstamos
              </a>
            </div>
          </div>
        </div>

        <!-- PRODUCTOS -->
        <div class="module-card slide-in-up" style="animation-delay: 0.3s">
          <div class="card">
            <div class="card-body text-center">
              <div class="module-icon">📦</div>
              <h3 class="module-title">Productos</h3>
              <p class="module-description">Consulta y administra todo el inventario de materiales</p>
              <div class="module-features">
                <span class="feature-tag">Inventario</span>
                <span class="feature-tag">Control</span>
                <span class="feature-tag">Filtro</span>
              </div>
              <a routerLink="/productos" class="btn btn-primary btn-lg">
                <span class="btn-icon">📋</span> Ver Productos
              </a>
            </div>
          </div>
        </div>

        <!-- SECCIONES DE MATERIALES -->
        <ng-container *ngFor="let modulo of modulosMateriales; let i = index">
          <div class="module-card slide-in-up" [style.animation-delay]="(0.4 + i * 0.1) + 's'">
            <div class="card">
              <div class="card-body text-center">
                <div class="module-icon">{{ modulo.icono }}</div>
                <h3 class="module-title">{{ modulo.nombre }}</h3>
                <p class="module-description">{{ modulo.descripcion }}</p>
                <div class="module-features">
                  <span class="feature-tag" *ngFor="let f of modulo.funciones">{{ f }}</span>
                </div>
                <a [routerLink]="modulo.ruta" class="btn btn-primary btn-lg">
                  <span class="btn-icon">{{ modulo.icono }}</span> Ver {{ modulo.nombre }}
                </a>
              </div>
            </div>
          </div>
        </ng-container>
      </div>
    </div>
  `,
  styles: [`
    .dashboard { padding: 2rem 0; }
    .welcome-section { margin-bottom: 3rem; }
    .welcome-icon { font-size: 4rem; margin-bottom: 1rem; animation: bounce 2s infinite; }
    .welcome-title { font-size: 2.5rem; font-weight: 800; margin-bottom: 0.5rem; }
    .welcome-subtitle { font-size: 1.125rem; color: rgba(255, 255, 255, 0.9); font-weight: 500; }

    .modules-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 1.5rem;
    }

    .module-card { transition: transform 0.3s ease; }
    .module-card:hover { transform: translateY(-5px); }

    .module-icon { font-size: 2.5rem; margin-bottom: 1rem; }
    .module-title { font-size: 1.4rem; font-weight: 700; margin-bottom: 0.75rem; color: var(--dark-color); }
    .module-description { color: #475569; margin-bottom: 1.25rem; font-weight: 500; }
    .module-features { display: flex; justify-content: center; gap: 0.4rem; flex-wrap: wrap; margin-bottom: 1rem; }
    .feature-tag { background: var(--primary-color); color: #fff; padding: 0.25rem 0.6rem; border-radius: 6px; font-size: 0.75rem; }

    .btn-icon { margin-right: 0.4rem; }

    @keyframes bounce {
      0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
      40% { transform: translateY(-10px); }
      60% { transform: translateY(-5px); }
    }
  `]
})
export class DashboardComponent implements OnInit {
  modulosMateriales = [
    { nombre: 'Libros', icono: '📘', ruta: '/libro', descripcion: 'Catálogo general de libros físicos o digitales', funciones: ['CRUD', 'Autores', 'Géneros'] },
    { nombre: 'Audiolibros', icono: '🎧', ruta: '/audiolibros', descripcion: 'Colección de audiolibros disponibles para escucha', funciones: ['Streaming', 'Duración', 'Narrador'] },
    { nombre: 'Cómics', icono: '🦸', ruta: '/comic', descripcion: 'Visualiza cómics e historietas disponibles', funciones: ['Volúmenes', 'Editorial', 'Autores'] },
    { nombre: 'Tesis', icono: '🎓', ruta: '/tesis', descripcion: 'Repositorio de tesis académicas', funciones: ['Universidad', 'Carrera', 'Grado'] },
    { nombre: 'Periódicos', icono: '🗞️', ruta: '/periodico', descripcion: 'Consulta las ediciones disponibles de periódicos', funciones: ['Fecha', 'Edición', 'Editorial'] },
    { nombre: 'Revistas', icono: '📖', ruta: '/revistas', descripcion: 'Revistas académicas o culturales', funciones: ['Volumen', 'Número', 'Categoría'] },
    { nombre: 'Mapas', icono: '🗺️', ruta: '/mapa', descripcion: 'Colección de mapas físicos o digitales', funciones: ['Región', 'Escala', 'Formato'] }
  ];

  constructor() {}

  ngOnInit(): void {
    // Aquí se podrían cargar métricas, estadísticas o datos desde un servicio
  }
}
