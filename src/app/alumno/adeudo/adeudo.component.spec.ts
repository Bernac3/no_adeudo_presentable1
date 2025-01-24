import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdeudoComponent } from './adeudo.component';

describe('AdeudoComponent', () => {
  let component: AdeudoComponent;
  let fixture: ComponentFixture<AdeudoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdeudoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdeudoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
