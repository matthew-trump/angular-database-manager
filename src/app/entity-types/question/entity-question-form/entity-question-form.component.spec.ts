import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EntityQuestionFormComponent } from './entity-question-form.component';

describe('EntityQuestionFormComponent', () => {
  let component: EntityQuestionFormComponent;
  let fixture: ComponentFixture<EntityQuestionFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EntityQuestionFormComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EntityQuestionFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
