import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EntityLiteraryWorkComponent } from './entity-literary-work.component';

describe('EntityLiteraryWorkComponent', () => {
  let component: EntityLiteraryWorkComponent;
  let fixture: ComponentFixture<EntityLiteraryWorkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EntityLiteraryWorkComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EntityLiteraryWorkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
