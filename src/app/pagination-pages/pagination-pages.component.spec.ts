import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaginationPagesComponent } from './pagination-pages.component';

describe('PaginationPagesComponent', () => {
  let component: PaginationPagesComponent;
  let fixture: ComponentFixture<PaginationPagesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaginationPagesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaginationPagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
