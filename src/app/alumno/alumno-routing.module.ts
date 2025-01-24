import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AdeudoComponent } from './adeudo/adeudo.component';
import { InicioComponent } from './adeudo/components/inicio/inicio.component';
import { ArchivoComponent } from './adeudo/components/archivo/archivo.component';
import { InfoComponent } from './adeudo/components/info/info.component';

const routes: Routes = [
  {
    path: '',
    component: AdeudoComponent,
    children: [
      {
        path: '',
        redirectTo: 'home', // Redirigir a 'home' cuando se acceda a '/alumno'
        pathMatch: 'full'
      },
      {
        path: 'home',
        component: InicioComponent // 🚀 Ruta para la vista 'home'
      },
      {
        path: 'archivo',
        component: ArchivoComponent
      },
      {
        path: 'info',
        component: InfoComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AlumnoRoutingModule {}
