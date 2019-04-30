import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EntityFormInputAutocompleteComponent } from './entity-form-input-autocomplete.component';

describe('EntityFormInputAutocompleteComponent', () => {
  let component: EntityFormInputAutocompleteComponent;
  let fixture: ComponentFixture<EntityFormInputAutocompleteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EntityFormInputAutocompleteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EntityFormInputAutocompleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
