import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EntityDisplayEnablementToggleComponent } from './entity-display-enablement-toggle.component';

describe('EntityDisplayEnablementToggleComponent', () => {
  let component: EntityDisplayEnablementToggleComponent;
  let fixture: ComponentFixture<EntityDisplayEnablementToggleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EntityDisplayEnablementToggleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EntityDisplayEnablementToggleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
