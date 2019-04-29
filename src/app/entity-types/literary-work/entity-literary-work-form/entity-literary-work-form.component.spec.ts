import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EntityEditLiteraryWorkComponent } from './entity-edit-literary-work.component';

describe('EntityEditLiteraryWorkComponent', () => {
  let component: EntityEditLiteraryWorkComponent;
  let fixture: ComponentFixture<EntityEditLiteraryWorkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EntityEditLiteraryWorkComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EntityEditLiteraryWorkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
