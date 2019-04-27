import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EntityListIndexComponent } from './entity-list-index.component';

describe('EntityListIndexComponent', () => {
  let component: EntityListIndexComponent;
  let fixture: ComponentFixture<EntityListIndexComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EntityListIndexComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EntityListIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
