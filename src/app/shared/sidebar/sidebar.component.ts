import { Component, Input, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'shared-sidebar',
  templateUrl: './sidebar.component.html',
 
})
export class SidebarComponent implements OnInit {
  
  @Input() menuOptions: Array<{
    click: string;
    routerLink: string;
    selectedClass: string;
    iconPath: string;
    label: string;
  }> = []; // Arreglo de objetos para la lista de enlaces
  
  selectedLink: string = ''; // Para resaltar la opción seleccionada

  constructor(private router: Router) {}

  ngOnInit(): void {
    // 🚀 Detectar cambios de ruta para resaltar el enlace activo
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.selectedLink = this.getActiveRoute();
      }
    });

    // Establecer la opción activa inicial (para cuando se cargue la página)
    this.selectedLink = this.getActiveRoute();
  }

  /**
   * Método para seleccionar el enlace del menú.
   * @param click Identificador único de la opción de menú
   */
  selectLink(click: string): void {
    this.selectedLink = click;
  }

  /**
   * Método para obtener la ruta activa actual.
   * Devuelve el fragmento de la URL que coincide con una opción de `routerLink`.
   */
  private getActiveRoute(): string {
    const currentRoute = this.router.url.split('/').pop(); // Obtiene la última parte de la URL
    const activeOption = this.menuOptions.find(option => option.routerLink === currentRoute);
    return activeOption ? activeOption.click : '';
  }
}
