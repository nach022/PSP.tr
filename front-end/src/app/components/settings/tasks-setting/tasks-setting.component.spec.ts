import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TasksSettingComponent } from './tasks-setting.component';

describe('TasksSettingComponent', () => {
  let component: TasksSettingComponent;
  let fixture: ComponentFixture<TasksSettingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TasksSettingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TasksSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
