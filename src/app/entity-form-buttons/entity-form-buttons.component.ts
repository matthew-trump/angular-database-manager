import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'entity-form-buttons',
  templateUrl: './entity-form-buttons.component.html',
  styleUrls: ['./entity-form-buttons.component.scss']
})
export class EntityFormButtonsComponent implements OnInit {

  @Input() formGroup: FormGroup;
  @Input() adding: boolean;
  @Input() spinnerDiameter: number = 10;
  @Output() done: EventEmitter<boolean> = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

}
