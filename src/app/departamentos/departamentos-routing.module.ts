import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListComponent } from './verificar/components/list/list.component';
import { InfoComponent } from './verificar/components/info/info.component';
import { VerificarComponent } from './verificar/verificar.component';


const routes: Routes = [
  {
    path: '',
    component: VerificarComponent,
    children: [
      {
        path: '',
        redirectTo: 'list', // Redirigir a 'home' cuando se acceda a '/alumno'
        pathMatch: 'full'
      },
      {
        path: 'list',
        component:  ListComponent// 🚀 Ruta para la vista 'home'
      },
      {
        path: 'info',
        component: InfoComponent,
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DepartamentosRoutingModule { }
