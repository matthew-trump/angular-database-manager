import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EntityFormButtonsComponent } from './entity-form-buttons.component';

describe('EntityFormButtonsComponent', () => {
  let component: EntityFormButtonsComponent;
  let fixture: ComponentFixture<EntityFormButtonsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EntityFormButtonsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EntityFormButtonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
