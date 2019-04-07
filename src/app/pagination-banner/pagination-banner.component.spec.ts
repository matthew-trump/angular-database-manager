import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaginationBannerComponent } from './pagination-banner.component';

describe('PaginationBannerComponent', () => {
  let component: PaginationBannerComponent;
  let fixture: ComponentFixture<PaginationBannerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaginationBannerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaginationBannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
