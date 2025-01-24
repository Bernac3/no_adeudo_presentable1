import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterDepartamentoComponent } from './register-departamento.component';

describe('RegisterDepartamentoComponent', () => {
  let component: RegisterDepartamentoComponent;
  let fixture: ComponentFixture<RegisterDepartamentoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RegisterDepartamentoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RegisterDepartamentoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
