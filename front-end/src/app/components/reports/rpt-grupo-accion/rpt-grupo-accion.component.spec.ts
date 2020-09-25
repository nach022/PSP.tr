import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RptGrupoAccionComponent } from './rpt-grupo-accion.component';

describe('RptGrupoAccionComponent', () => {
  let component: RptGrupoAccionComponent;
  let fixture: ComponentFixture<RptGrupoAccionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RptGrupoAccionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RptGrupoAccionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
