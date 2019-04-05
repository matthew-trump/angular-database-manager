import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScheduleItemFormComponent } from './schedule-item-form.component';

describe('ScheduleItemFormComponent', () => {
  let component: ScheduleItemFormComponent;
  let fixture: ComponentFixture<ScheduleItemFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScheduleItemFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScheduleItemFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
