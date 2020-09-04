import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicionesJuntasComponent } from './mediciones-juntas.component';

describe('MedicionesJuntasComponent', () => {
  let component: MedicionesJuntasComponent;
  let fixture: ComponentFixture<MedicionesJuntasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MedicionesJuntasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MedicionesJuntasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
