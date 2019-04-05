import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InstanceDisplayBasicComponent } from './instance-display-basic.component';

describe('InstanceDisplayBasicComponent', () => {
  let component: InstanceDisplayBasicComponent;
  let fixture: ComponentFixture<InstanceDisplayBasicComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InstanceDisplayBasicComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InstanceDisplayBasicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
