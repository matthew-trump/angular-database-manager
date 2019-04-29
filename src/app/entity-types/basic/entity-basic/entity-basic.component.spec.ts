import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EntityBasicComponent } from './entity-basic.component';

describe('EntityBasicComponent', () => {
  let component: EntityBasicComponent;
  let fixture: ComponentFixture<EntityBasicComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EntityBasicComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EntityBasicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
