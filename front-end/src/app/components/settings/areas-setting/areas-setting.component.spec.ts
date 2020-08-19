import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AreasSettingComponent } from './areas-setting.component';

describe('AreasSettingComponent', () => {
  let component: AreasSettingComponent;
  let fixture: ComponentFixture<AreasSettingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AreasSettingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AreasSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
