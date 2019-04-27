import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EntityDisplayQuestionComponent } from './entity-display-question.component';

describe('EntityDisplayQuestionComponent', () => {
  let component: EntityDisplayQuestionComponent;
  let fixture: ComponentFixture<EntityDisplayQuestionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EntityDisplayQuestionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EntityDisplayQuestionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
