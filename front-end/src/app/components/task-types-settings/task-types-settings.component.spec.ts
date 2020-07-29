import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskTypesSettingsComponent } from './task-types-settings.component';

describe('TaskTypesSettingsComponent', () => {
  let component: TaskTypesSettingsComponent;
  let fixture: ComponentFixture<TaskTypesSettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TaskTypesSettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskTypesSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
