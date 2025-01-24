import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavComponent } from './nav/nav.component';
import { SidebarComponent } from './sidebar/sidebar.component';




@NgModule({
  declarations: [
    NavComponent,
    SidebarComponent,
    
  ],
  imports: [
    CommonModule,
    RouterModule, 
  ],
  exports: [
    NavComponent,
    SidebarComponent,
    
  ]
}) 
export class SharedModule { }  
