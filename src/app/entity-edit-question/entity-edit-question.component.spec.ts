import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EntityEditQuestionComponent } from './entity-edit-question.component';

describe('EntityEditQuestionComponent', () => {
  let component: EntityEditQuestionComponent;
  let fixture: ComponentFixture<EntityEditQuestionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EntityEditQuestionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EntityEditQuestionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
