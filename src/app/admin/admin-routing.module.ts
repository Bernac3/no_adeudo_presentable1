import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AdministradorComponent } from './administrador/administrador.component';
import { ListaAdminComponent } from './administrador/components/lista-admin/lista-admin.component';
import { DepartamentosComponent } from './administrador/components/departamentos/departamentos.component';
import { CrearDepartamentoComponent } from './administrador/components/crear-departamento/crear-departamento.component';
import { GestionDepartamentoComponent } from './administrador/components/gestion-departamento/gestion-departamento.component';
import { CrearAdminComponent } from './administrador/components/crear-admin/crear-admin.component';

const routes: Routes = [
  {
    path: '',
    component: AdministradorComponent,
    children: [
      {
        path: '',
        redirectTo: 'list',
        pathMatch: 'full'
      },
      {
        path: 'list',
        component: ListaAdminComponent
      },
      {
        path: 'departamentos',
        component: DepartamentosComponent
      },
      {
        path: 'crear-departamento',
        component: CrearDepartamentoComponent
      },
      {
        path: 'gestion-departamento',
        component: GestionDepartamentoComponent
      },
      {
        path: 'crear-admin',
        component: CrearAdminComponent
      },

    ]
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule {}

