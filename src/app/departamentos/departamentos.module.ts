import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { InfoComponent } from './verificar/components/info/info.component';
import { ListComponent } from './verificar/components/list/list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DepartamentosRoutingModule } from './departamentos-routing.module';
import { AlumnoDatosComponent } from './verificar/components/alumno-datos/alumno-datos.component';
import { HttpClientModule } from '@angular/common/http';


@NgModule({
  declarations: [
    InfoComponent,
    ListComponent,
    AlumnoDatosComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    DepartamentosRoutingModule,
    HttpClientModule
  ]
})
export class DepartamentosModule { }
