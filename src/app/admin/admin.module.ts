import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { ListaAdminComponent } from './administrador/components/lista-admin/lista-admin.component';
import { DepartamentosComponent } from './administrador/components/departamentos/departamentos.component';
import { RouterOutlet } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { AdminRoutingModule } from './admin-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CrearDepartamentoComponent } from './administrador/components/crear-departamento/crear-departamento.component';
import { GestionDepartamentoComponent } from './administrador/components/gestion-departamento/gestion-departamento.component';
import { CrearAdminComponent } from './administrador/components/crear-admin/crear-admin.component';



@NgModule({
  declarations: [
    ListaAdminComponent,
    DepartamentosComponent,
    CrearDepartamentoComponent,
    GestionDepartamentoComponent,
    CrearAdminComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    AdminRoutingModule,
    RouterOutlet,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule

  ],
  providers: [DatePipe],
})
export class AdminModule { }
