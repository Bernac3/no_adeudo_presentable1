import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';

import { AdministradorComponent } from './admin/administrador/administrador.component';
import { VerificarComponent } from './departamentos/verificar/verificar.component';
import { SharedModule } from './shared/shared.module';
import { AdeudoComponent } from './alumno/adeudo/adeudo.component';

@NgModule({
  declarations: [
    AppComponent,
    AdministradorComponent,
    VerificarComponent,
    AdeudoComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    SharedModule
    
],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
