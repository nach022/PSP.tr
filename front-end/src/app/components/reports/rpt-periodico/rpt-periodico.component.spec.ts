import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RptPeriodicoComponent } from './rpt-periodico.component';

describe('RptGrupoAccionComponent', () => {
  let component: RptPeriodicoComponent;
  let fixture: ComponentFixture<RptPeriodicoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RptPeriodicoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RptPeriodicoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
