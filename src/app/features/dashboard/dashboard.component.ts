import { CommonModule, DecimalPipe } from '@angular/common';
import { Component, OnInit, OnDestroy, signal, computed } from '@angular/core'; 
import { RouterModule } from '@angular/router';

// --- Importaciones de Firebase ---
import { initializeApp, FirebaseOptions } from 'firebase/app'; // Importamos FirebaseOptions
import { getAuth, signInAnonymously, signInWithCustomToken, Auth } from 'firebase/auth';
import { getFirestore, Firestore, collection, DocumentData, query, QueryDocumentSnapshot, onSnapshot } from 'firebase/firestore'; 
import { setLogLevel } from '@firebase/logger';

// --- MODELOS ---

/**
 * Modelo de Usuario (debe coincidir con la estructura de Firestore)
 */
interface Usuario extends DocumentData {
    id_usuario: string; 
    nombre: string;
    email: string;
    telefono: string; 
    activo: boolean; // Propiedad clave para la estadística
    es_admin: boolean;
}

interface UserStats {
    activos: number;
    inactivos: number;
    total: number;
    porcentajeActivos: number;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule, DecimalPipe], 
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

      <!-- Mensaje de Modo de Demostración (Nuevo) -->
      @if (isDemoMode()) {
        <div class="alert-banner slide-in-down">
          ⚠️ **MODO DEMOSTRACIÓN ACTIVO:** La configuración de Firebase está vacía o incompleta. Se muestran datos simulados. **¡Pega tu configuración de Firebase en el código para conectar la base de datos!**
        </div>
      }

      <!-- Sección de Estadísticas -->
      <div class="stats-section">
        <h2 class="section-title">📊 Resumen Estadístico</h2>
        <div class="stats-grid">
          <!-- Tarjeta de Activos / Inactivos -->
          <div class="stat-card stat-users slide-in-up" style="animation-delay: 0.1s">
            <div class="card-body">
              <h4 class="stat-title">Estado de Usuarios</h4>
              
              <!-- *** LÓGICA DE VISUALIZACIÓN DE ESTADOS *** -->

              <!-- Estado de Carga -->
              @if (isLoading()) {
                <div class="stat-value text-xl">Cargando...</div>
                <div class="loader-placeholder">Conectando a Firebase y obteniendo datos...</div>
              }

              <!-- Estado de Éxito o Demo -->
              @if (!isLoading() && (isAuthReady() || isDemoMode())) {
                
                <!-- Gráfico Circular SVG -->
                <div class="pie-chart-container">
                    <svg viewBox="0 0 100 100" class="pie-svg">
                        <!-- Fondo (Inactivos) - Círculo completo con grosor grueso -->
                        <circle 
                            class="inactive-bg" 
                            cx="50" cy="50" 
                            [attr.r]="pieChartData().radius" 
                            stroke-width="30" 
                            fill="transparent">
                        </circle>
                        
                        <!-- Segmento Activo (Frente) - Utiliza stroke-dashoffset para mostrar el porcentaje -->
                        <circle 
                            class="active-segment" 
                            cx="50" cy="50" 
                            [attr.r]="pieChartData().radius" 
                            stroke-width="30" 
                            fill="transparent" 
                            [attr.stroke-dasharray]="pieChartData().circumference"
                            [attr.stroke-dashoffset]="pieChartData().activeOffset">
                        </circle>
                    </svg>
                    <div class="pie-center-text">
                        {{ userStats().porcentajeActivos | number:'1.0-1' }}%
                        <span class="text-xs block text-medium">Activos</span>
                    </div>
                </div>

                <div class="stat-value text-center">
                  {{ userStats().total + ' Usuarios Totales' }}
                </div>

                <div class="stat-details">
                  <p class="detail-item active-text">
                    <span class="dot active"></span> Activos: <strong>{{ userStats().activos }}</strong> 
                    <small>({{ userStats().porcentajeActivos | number:'1.0-1' }}%)</small>
                  </p>
                  <p class="detail-item inactive-text">
                    <span class="dot inactive"></span> Inactivos: <strong>{{ userStats().inactivos }}</strong>
                    <small>({{ 100 - userStats().porcentajeActivos | number:'1.0-1' }}%)</small>
                  </p>
                </div>
              }

              <!-- Estado de Fallo (NO Autenticado y NO Demo) -->
              @if (!isLoading() && !isAuthReady() && !isDemoMode()) {
                <div class="stat-value text-error">
                  ❌ Fallo de Conexión
                </div>
                <div class="error-message">
                  ⚠️ Error: La configuración de Firebase está vacía o incompleta. Revisa el log de la consola.
                </div>
              }

              <!-- *** FIN DE LA LÓGICA DE VISUALIZACIÓN DE ESTADOS *** -->

            </div>
          </div>

          <!-- Placeholder para otras estadísticas -->
          <div class="stat-card stat-placeholder slide-in-up" style="animation-delay: 0.2s">
            <div class="card-body text-center">
              <div class="module-icon">📖</div>
              <h4 class="stat-title">Préstamos Pendientes</h4>
              <div class="stat-value placeholder-value">0</div>
              <p class="module-description">Registros de préstamos aún no devueltos.</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Sección de Módulos (Cuerpo principal del dashboard) -->
      <div class="modules-grid">
        <!-- USUARIOS -->
        <div class="module-card slide-in-up" style="animation-delay: 0.3s">
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
        <div class="module-card slide-in-up" style="animation-delay: 0.4s">
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
        <div class="module-card slide-in-up" style="animation-delay: 0.5s">
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
          <div class="module-card slide-in-up" [style.animation-delay]="(0.6 + i * 0.1) + 's'">
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
    /* SCSS Structure - Inline Styles */
    :host {
      /* Colores y Variables (Asegurando compatibilidad con Tailwind) */
      --primary-color: #3b82f6; /* Blue 500 */
      --secondary-color: #10b981; /* Emerald 500 */
      --background-dark: #0f172a; /* Slate 900 */
      --card-bg-light: rgba(255, 255, 255, 0.95);
      --card-bg-dark: rgba(30, 41, 59, 0.85);
      --text-contrast: #e2e8f0;
      --active-color: #22c55e; /* Green 500 */
      --inactive-color: #ef4444; /* Red 500 */
      --text-light: #f8fafc;
      --text-medium: #a1a1aa;
      --text-dark: #1e293b;
      --warning-bg: #f59e0b;
      --warning-text: #1f2937;

      font-family: 'Inter', sans-serif;
    }

    .dashboard { 
      padding: 2rem 1rem; 
      min-height: 100vh;
      background: linear-gradient(135deg, var(--background-dark), #1e293b);
      color: var(--text-contrast);
    }

    .alert-banner {
      background-color: var(--warning-bg);
      color: var(--warning-text);
      padding: 0.75rem 1.5rem;
      border-radius: 8px;
      margin-bottom: 2rem;
      font-weight: 600;
      text-align: center;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    }
    
    .card {
      background-color: var(--card-bg-light);
      border-radius: 12px;
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
      padding: 1.5rem;
      border: none;
      transition: all 0.3s ease;
      color: var(--text-dark);

      .card-body { padding: 0.5rem; }
    }

    .glass {
      background-color: var(--card-bg-dark);
      backdrop-filter: blur(10px);
      box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.3);
      border: 1px solid rgba(255, 255, 255, 0.18);
      color: var(--text-contrast);
    }

    /* Utilitarios */
    .text-title-contrast { color: var(--text-light); }
    .text-high-contrast { color: var(--text-medium); }
    .btn {
      padding: 0.75rem 1.5rem;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border: none;
      transition: background-color 0.2s ease;

      &-primary { 
        background-color: var(--primary-color); 
        color: white; 
        &:hover { background-color: #2563eb; }
      }
      &-icon { margin-right: 0.4rem; }
      &-lg { font-size: 1.125rem; } /* Asegurar que el tamaño grande se aplique */
    }

    /* Secciones de Contenido */
    .welcome-section { 
      margin-bottom: 3rem; 
      .welcome-icon { 
        font-size: 4rem; 
        margin-bottom: 1rem; 
        animation: bounce 2s infinite; 
      }
      .welcome-title { 
        font-size: clamp(1.8rem, 5vw, 2.5rem); 
        font-weight: 800; 
        margin-bottom: 0.5rem; 
      }
      .welcome-subtitle { 
        font-size: clamp(1rem, 3vw, 1.125rem); 
        font-weight: 500; 
      }
    }
    
    .section-title { 
      font-size: 1.8rem; 
      font-weight: 700; 
      margin-bottom: 1.5rem; 
      color: var(--text-light);
      text-align: center;
    }

    /* Módulos de Enlaces */
    .modules-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 1.5rem;
    }
    .module-card { 
      transition: transform 0.3s ease, box-shadow 0.3s ease; 
      &:hover { 
        transform: translateY(-8px); 
        box-shadow: 0 15px 25px rgba(0, 0, 0, 0.2); 
      }
      .card {
        /* Asegurar que el color del texto de los módulos sea oscuro para contraste en fondo claro */
        color: var(--text-dark); 
      }
      .module-icon { font-size: 2.5rem; margin-bottom: 1rem; }
      .module-title { font-size: 1.4rem; font-weight: 700; margin-bottom: 0.75rem; color: var(--text-dark); }
      .module-description { color: #475569; margin-bottom: 1.25rem; font-weight: 500; min-height: 40px;}
      .module-features { 
        display: flex; 
        justify-content: center; 
        gap: 0.4rem; 
        flex-wrap: wrap; 
        margin-bottom: 1rem; 
        min-height: 30px;
        .feature-tag { 
          background-color: var(--secondary-color); 
          color: white; 
          padding: 0.25rem 0.6rem; 
          border-radius: 6px; 
          font-size: 0.75rem; 
          font-weight: 500;
        }
      }
    }

    /* --- Estilos de la Nueva Sección de Estadísticas (Ajustado para SVG) --- */
    .stats-section { 
      margin-bottom: 2rem; 
      .stats-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 1.5rem;
      }
      .stat-card {
        background-color: var(--card-bg-dark);
        backdrop-filter: blur(10px);
        border-radius: 12px;
        padding: 1.5rem;
        border: 1px solid rgba(255, 255, 255, 0.1);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
        color: var(--text-contrast);

        .stat-title { font-size: 1.25rem; font-weight: 600; margin-bottom: 0.5rem; color: var(--text-light); }
        .stat-value { font-size: 2.5rem; font-weight: 900; color: var(--primary-color); margin-bottom: 1rem; }
        
        .text-error { color: var(--inactive-color); font-size: 2rem; font-weight: 900;}
        .error-message { color: var(--inactive-color); font-weight: 600; text-align: center; margin-top: 0.5rem; font-size: 0.95rem; }

        /* Estilos del Gráfico Circular SVG */
        .pie-chart-container {
            position: relative;
            width: 150px; /* Tamaño del gráfico */
            height: 150px;
            margin: 1.5rem auto;
            color: var(--text-light); 
        }

        .pie-svg {
            transform: rotate(-90deg); /* Iniciar desde la parte superior */
            width: 100%;
            height: 100%;
            overflow: visible; 
        }

        .inactive-bg {
            stroke: var(--inactive-color);
            opacity: 0.4;
        }

        .active-segment {
            stroke: var(--active-color);
            transition: stroke-dashoffset 0.8s ease-out;
            stroke-linecap: round; 
        }

        .pie-center-text {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            font-size: 1.5rem;
            font-weight: 800;
            line-height: 1.2;
            text-align: center;
        }
        /* Fin de Estilos del Gráfico Circular SVG */
        
        .stat-details {
          display: flex;
          justify-content: space-between;
          font-size: 0.95rem;
          margin-top: 1rem;

          .dot {
            display: inline-block;
            width: 8px;
            height: 8px;
            border-radius: 50%;
            margin-right: 5px;
            &.active { background-color: var(--active-color); }
            &.inactive { background-color: var(--inactive-color); }
          }
          .active-text { color: var(--active-color); font-weight: 600; }
          .inactive-text { color: var(--inactive-color); font-weight: 600; }
        }
      }

      .loader-placeholder {
          text-align: center;
          padding: 1rem 0;
          color: var(--text-medium);
          font-style: italic;
      }
    }

    /* Animaciones SCSS */
    @keyframes bounce {
      0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
      40% { transform: translateY(-10px); }
      60% { transform: translateY(-5px); }
    }
    @keyframes slideInUp {
      from { opacity: 0; transform: translateY(50px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .slide-in-up { 
      animation: slideInUp 0.6s ease-out forwards; 
      opacity: 0; 
    }
    @keyframes slideInDown {
        from { opacity: 0; transform: translateY(-20px); }
        to { opacity: 1; transform: translateY(0); }
    }
    .slide-in-down {
        animation: slideInDown 0.4s ease-out forwards;
        opacity: 0;
    }
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    .fade-in { 
      animation: fadeIn 0.8s ease-in forwards; 
      opacity: 0; 
    }
    
    /* Media Queries */
    @media (max-width: 768px) {
      .dashboard { padding: 1rem; }
      .welcome-title { font-size: 2rem; }
      .modules-grid, .stats-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class DashboardComponent implements OnInit, OnDestroy {
  
  // Usamos signal para el estado reactivo de las estadísticas
  userStats = signal<UserStats>({
    activos: 0,
    inactivos: 0,
    total: 0,
    porcentajeActivos: 0
  });
  
  // Variables de Firebase
  private db!: Firestore;
  private auth!: Auth;
  appId: string = '';
  isAuthReady = signal(false);
  isLoading = signal(true); 
  isDemoMode = signal(false); // Bandera para el modo de demostración

  // Listener cleanup for Firestore
  private unsubscribeUserStats: (() => void) | undefined;

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

  ngOnDestroy(): void {
    // Limpia el listener de Firestore al destruir el componente
    if (this.unsubscribeUserStats) {
        this.unsubscribeUserStats();
        console.log("Listener de Firestore de usuarios detenido.");
    }
  }

  async ngOnInit(): Promise<void> {
    setLogLevel('debug'); // Mostrar logs de Firebase para debug
    console.log("Iniciando ngOnInit: Intento de inicialización de Firebase.");
    await this.initializeFirebase();
    
    // Si la autenticación tuvo éxito, cargamos los datos reales
    if (this.isAuthReady()) {
        console.log("Autenticación exitosa. Cargando estadísticas de usuarios...");
        this.loadUserStats(); 
    } else {
        // Si falló la inicialización (debido a config vacía), activamos el modo Demo
        console.error("Firebase no está listo. Activando modo de demostración (Mock Data).");
        this.loadMockStats();
    }
  }

  /**
   * Señal computada para calcular los parámetros necesarios para dibujar el gráfico circular SVG.
   * Utiliza la propiedad stroke-dashoffset de SVG para representar el porcentaje.
   */
  pieChartData = computed(() => {
    const percentage = this.userStats().porcentajeActivos;
    const radius = 35; // Radio del círculo
    // Circunferencia = 2 * pi * r
    const circumference = 2 * Math.PI * radius; 
    
    // Calcula el offset necesario para que solo se muestre el segmento activo.
    const activeOffset = circumference * (1 - (percentage / 100));

    return {
        radius: radius,
        circumference: circumference,
        activeOffset: activeOffset,
    };
  });


  // Inicialización y autenticación de Firebase
  async initializeFirebase(): Promise<void> {
    try {
        // ----------------------------------------------------------------------
        // --- PASO 1: CONFIGURACIÓN REAL DE FIREBASE (¡EXITOSO!) ---
        // Estos son los datos que copiaste de la Consola de Firebase.
        const manualFirebaseConfig: FirebaseOptions = {
          apiKey: "AIzaSyC-xlQyHgkufrdj-CEJXkEL5ilAF0YExJM",
          authDomain: "biblioteca-2bff0.firebaseapp.com",
          projectId: "biblioteca-2bff0",
          storageBucket: "biblioteca-2bff0.firebasestorage.app",
          messagingSenderId: "27275560321",
          appId: "1:27275560321:web:29c74dd44987c171571480",
          // measurementId: "G-JYGBGDM8NN" // No es necesario para la conexión, pero lo dejamos si lo copiaste
        };
        // ----------------------------------------------------------------------


        // Acceso a las variables globales de configuración y autenticación
        this.appId = typeof (window as any).__app_id !== 'undefined' ? (window as any).__app_id : 'default-app-id';
        
        const rawFirebaseConfig = typeof (window as any).__firebase_config !== 'undefined' ? (window as any).__firebase_config : '{}';
        
        console.log("Raw Firebase Config String:", rawFirebaseConfig);
        
        let firebaseConfig: FirebaseOptions = JSON.parse(rawFirebaseConfig);

        // Lógica de Validación: Si la configuración inyectada falla, usamos la manual.
        const isConfigInjectedEmpty = Object.keys(firebaseConfig).length === 0 || !firebaseConfig.apiKey;
        
        if (isConfigInjectedEmpty) {
            console.warn("ADVERTENCIA: Configuración inyectada vacía. Usando configuración manual de fallback (Tus datos).");
            firebaseConfig = manualFirebaseConfig;
        }

        // Validación final (solo para asegurar que no se use el placeholder inicial)
        if (!firebaseConfig.apiKey || firebaseConfig.apiKey.startsWith("AIzaSy...")) {
            console.error("ERROR: La configuración de Firebase es el placeholder. Debe reemplazar los valores en el código para conectar la BD.");
            this.isAuthReady.set(false);
            this.isDemoMode.set(true); // Activa el modo demo
            return;
        }


        const app = initializeApp(firebaseConfig);
        this.db = getFirestore(app);
        this.auth = getAuth(app);
        console.log("Firebase App y Firestore inicializados con tu configuración.");

        // Autenticación usando el token o de forma anónima
        const initialAuthToken = typeof (window as any).__initial_auth_token !== 'undefined' ? (window as any).__initial_auth_token : null;
        if (initialAuthToken) {
            await signInWithCustomToken(this.auth, initialAuthToken);
            console.log("Firebase Auth: Autenticado con token personalizado.");
        } else {
            await signInAnonymously(this.auth);
            console.log("Firebase Auth: Autenticado anónimamente.");
        }
        
        this.isAuthReady.set(true);
        this.isDemoMode.set(false); // Asegura que el modo demo esté apagado si la inicialización tuvo éxito
        
    } catch (error) {
        console.error("Fallo la inicialización o autenticación de Firebase:", error);
        this.isAuthReady.set(false);
        this.isDemoMode.set(true); // Activa el modo demo por si el error es de conexión
    } finally {
        // Aseguramos que isLoading se apague independientemente del resultado
        if (!this.isAuthReady()) {
             // Si la inicialización falló (y no es solo por el placeholder), activa el modo demo si no lo está.
            if (!this.isDemoMode()) { 
                this.loadMockStats();
            }
        }
    }
  }

  // Carga datos simulados para el modo de demostración
  loadMockStats(): void {
    const mockActivos = 185;
    const mockInactivos = 45;
    const mockTotal = mockActivos + mockInactivos;
    const mockPorcentaje = (mockActivos / mockTotal) * 100;
    
    this.userStats.set({
        activos: mockActivos,
        inactivos: mockInactivos,
        total: mockTotal,
        porcentajeActivos: mockPorcentaje
    });
    this.isLoading.set(false);
    this.isDemoMode.set(true); // Aseguramos que la bandera esté en true
    console.log("Estadísticas de demostración cargadas.");
  }


  // Lógica para obtener y procesar las estadísticas de usuarios usando onSnapshot
  loadUserStats(): void {
    if (!this.isAuthReady() || !this.db) {
        this.isLoading.set(false);
        return;
    }
    
    // Limpiamos el listener anterior si existe para evitar duplicados
    if (this.unsubscribeUserStats) {
        this.unsubscribeUserStats();
    }

    this.isLoading.set(true);
    console.log("Cargando datos de Firestore con onSnapshot...");

    try {
        // Ruta de colección pública requerida: /artifacts/{appId}/public/data/users
        const collectionPath = `artifacts/${this.appId}/public/data/users`;
        console.log(`Escuchando colección: ${collectionPath}`);
        
        const usersCollectionRef = collection(this.db, collectionPath);
        
        // Usamos onSnapshot para escuchar cambios en tiempo real
        this.unsubscribeUserStats = onSnapshot(query(usersCollectionRef), (snapshot) => {
            let activos = 0;
            let inactivos = 0;
            const total = snapshot.docs.length;
            console.log(`Documentos recibidos por onSnapshot: ${total}`);

            snapshot.forEach((doc: QueryDocumentSnapshot<DocumentData>) => { 
                const userData = doc.data() as Usuario;
                // Verificación basada en la propiedad 'activo'
                if (userData && typeof userData.activo === 'boolean' && userData.activo === true) {
                    activos++;
                } else {
                    inactivos++;
                }
            });
            
            const porcentajeActivos = total > 0 ? (activos / total) * 100 : 0;

            this.userStats.set({ activos, inactivos, total, porcentajeActivos });
            this.isLoading.set(false);
            console.log("Estadísticas de usuarios actualizadas con éxito:", this.userStats());

        }, (error) => {
            // Manejo de errores de Firestore (a menudo por reglas de seguridad o conexión fallida después de la inicialización)
            console.error('Error en onSnapshot de usuarios:', error);
            // En caso de error, volvemos al modo demo
            this.loadMockStats();
            this.isDemoMode.set(true);
        });

    } catch (error) {
        console.error('Error al configurar el listener de Firestore:', error);
        // En caso de error, volvemos al modo demo
        this.loadMockStats();
        this.isDemoMode.set(true);
    }
  }
}