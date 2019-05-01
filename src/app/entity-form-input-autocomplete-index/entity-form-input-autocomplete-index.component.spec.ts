import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EntityFormInputAutocompleteIndexComponent } from './entity-form-input-autocomplete-index.component';

describe('EntityFormInputAutocompleteIndexComponent', () => {
  let component: EntityFormInputAutocompleteIndexComponent;
  let fixture: ComponentFixture<EntityFormInputAutocompleteIndexComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EntityFormInputAutocompleteIndexComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EntityFormInputAutocompleteIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
