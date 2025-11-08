import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent)
  },
  {
  path: 'productos',
  loadComponent: () => import('./features/producto/producto-list.component')
    .then(m => m.ProductoListComponent)
  },
  {
  path: 'prestamo',
  loadComponent: () => import('./features/prestamo/prestamo-list.component')
    .then(m => m.PrestamoListComponent)
  },
  {
  path: 'usuario',  
  loadComponent: () =>
    import('./features/usuario/usuario-list.component')
      .then(m => m.UsuarioListComponent)
  },
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.routes').then(m => m.authRoutes)
  },
  {
    path: 'audiolibro',
    loadComponent: () =>
      import('./features/audiolibro/audiolibro-list.component').then(
        (m) => m.AudiolibroListComponent
      ),
  },
  {
    path: 'comic',
    loadComponent: () =>
      import('./features/comic/comic-list.component').then(
        (m) => m.ComicListComponent
      ),
  },
  {
    path: 'libro',
    loadComponent: () =>
      import('./features/libro/libro-list.component').then(
        (m) => m.LibroListComponent
      ),
  },
  {
    path: 'mapa',
    loadComponent: () =>
      import('./features/mapa/mapa-list.component').then(
        (m) => m.MapaListComponent
      ),
  },
  {
    path: 'periodico',
    loadComponent: () =>
      import('./features/Periodico/Periodico-list.component').then(
        (m) => m.PeriodicoListComponent
      ),
  },
  {
    path: 'revista',
    loadComponent: () =>
      import('./features/revista/Revista-list.component').then(
        (m) => m.RevistaListComponent
      ),
  },
  {
    path: 'tesis',
    loadComponent: () =>
      import('./features/Tesis/Tesis-list.component').then(
        (m) => m.TesisListComponent
      ),
  },
  {
    path: '**',
    redirectTo: '/dashboard'
  }
];

