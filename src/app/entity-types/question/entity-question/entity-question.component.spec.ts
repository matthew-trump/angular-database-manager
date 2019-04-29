import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EntityQuestionComponent } from './entity-question.component';

describe('EntityQuestionComponent', () => {
  let component: EntityQuestionComponent;
  let fixture: ComponentFixture<EntityQuestionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EntityQuestionComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EntityQuestionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
