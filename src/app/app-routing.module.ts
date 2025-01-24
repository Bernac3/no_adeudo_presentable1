import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/auth/login',
    pathMatch: 'full'
  },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)
  },
  {
    path: 'admin',
    loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule)
  },
  {
    path: 'alumno',
    loadChildren: () => import('./alumno/alumno.module').then(m => m.AlumnoModule)
  },
  {
    path: 'departamentos',
    loadChildren: () => import('./departamentos/departamentos.module').then(m => m.DepartamentosModule)
  },
  {
    path: '**',
    redirectTo: '/auth/login' // Wildcard para rutas no reconocidas
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
