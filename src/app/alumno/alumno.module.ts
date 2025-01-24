import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArchivoComponent } from './adeudo/components/archivo/archivo.component';
import { InfoComponent } from './adeudo/components/info/info.component';
import { InicioComponent } from './adeudo/components/inicio/inicio.component';
import { SharedModule } from '../shared/shared.module';
import { AlumnoRoutingModule } from './alumno-routing.module';
import { RouterOutlet } from '@angular/router';



@NgModule({
  declarations: [
    ArchivoComponent,
    InfoComponent,
    InicioComponent,
    
  ],
  imports: [
    CommonModule,
    SharedModule,
    AlumnoRoutingModule,
    RouterOutlet
  ]
})
export class AlumnoModule { }
