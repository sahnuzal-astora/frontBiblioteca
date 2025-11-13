import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';

declare interface RouteInfo {
    path: string;
    title: string;
    icon: string;
    class: string;
}

export const ROUTES: RouteInfo[] = [
    { path: '/dashboard', title: 'Dashboard',  icon: 'design_app', class: '' },
    { path: '/usuario', title: 'Usuario',  icon:'shopping_basket', class: '' },
    { path: '/prestamo', title: 'Prestamos',  icon:'users_single-02', class: '' },
    { path: '/productos', title: 'Productos',  icon:'shopping_box', class: '' },
    { path: '/audiolibro', title: 'Audiolibros',  icon:'tech_headphones', class: '' },
    { path: '/comic', title: 'Comics',  icon:'ui-1_bell-53', class: '' },
    { path: '/libro', title: 'libros',  icon:'ui-1_bell-53', class: '' },
    { path: '/mapa', title: 'Mapas',  icon:'ui-1_bell-53', class: '' },
    { path: '/periodico', title: 'Periodicos',  icon:'ui-1_bell-53', class: '' },
    { path: '/revista', title: 'Revistas',  icon:'ui-1_bell-53', class: '' },
    { path: '/tesis', title: 'Tesis',  icon:'ui-1_bell-53', class: '' },
    { path: '/upgrade', title: 'Configuración',  icon:'objects_spaceship', class: 'active active-pro' }
];

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  menuItems: any[] = [];

  constructor() { }

  ngOnInit() {
    this.menuItems = ROUTES.filter(menuItem => menuItem);
  }
  
  isMobileMenu() {
      if ( window.innerWidth > 991) {
          return false;
      }
      return true;
  };
}
