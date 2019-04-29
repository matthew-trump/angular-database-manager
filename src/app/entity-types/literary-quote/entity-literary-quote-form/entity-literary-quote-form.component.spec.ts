import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EntityLiteraryQuoteFormComponent } from './entity-literary-quote-form.component';

describe('EntityLiteraryQuoteFormComponent', () => {
  let component: EntityLiteraryQuoteFormComponent;
  let fixture: ComponentFixture<EntityLiteraryQuoteFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EntityLiteraryQuoteFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EntityLiteraryQuoteFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
