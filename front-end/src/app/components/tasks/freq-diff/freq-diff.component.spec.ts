import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FreqDiffComponent } from './freq-diff.component';

describe('FreqDiffComponent', () => {
  let component: FreqDiffComponent;
  let fixture: ComponentFixture<FreqDiffComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FreqDiffComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FreqDiffComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
