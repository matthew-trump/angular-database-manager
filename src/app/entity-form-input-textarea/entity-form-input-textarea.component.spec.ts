import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EntityFormInputTextareaComponent } from './entity-form-input-textarea.component';

describe('EntityFormInputTextareaComponent', () => {
  let component: EntityFormInputTextareaComponent;
  let fixture: ComponentFixture<EntityFormInputTextareaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EntityFormInputTextareaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EntityFormInputTextareaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
