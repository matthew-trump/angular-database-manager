import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EntityLiteraryQuoteComponent } from './entity-literary-quote.component';

describe('EntityLiteraryQuoteComponent', () => {
  let component: EntityLiteraryQuoteComponent;
  let fixture: ComponentFixture<EntityLiteraryQuoteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EntityLiteraryQuoteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EntityLiteraryQuoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
