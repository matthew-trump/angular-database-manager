import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EntityDisplayBasicComponent } from './entity-display-basic.component';

describe('EntityDisplayBasicComponent', () => {
  let component: EntityDisplayBasicComponent;
  let fixture: ComponentFixture<EntityDisplayBasicComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EntityDisplayBasicComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EntityDisplayBasicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
