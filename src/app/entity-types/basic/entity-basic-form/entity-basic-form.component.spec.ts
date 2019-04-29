import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EntityBasicFormComponent } from './entity-basic-form.component';

describe('EntityBasicFormComponent', () => {
  let component: EntityBasicFormComponent;
  let fixture: ComponentFixture<EntityBasicFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EntityBasicFormComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EntityBasicFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
