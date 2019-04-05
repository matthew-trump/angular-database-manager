import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScheduleItemDetailsComponent } from '././schedule-item-details.component';

describe(' ScheduleItemDetailsComponent ', () => {
  let component: ScheduleItemDetailsComponent;
  let fixture: ComponentFixture<ScheduleItemDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ScheduleItemDetailsComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScheduleItemDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
