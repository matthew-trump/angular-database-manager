import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'entity-form-input-textarea',
  templateUrl: './entity-form-input-textarea.component.html',
  styleUrls: ['./entity-form-input-textarea.component.scss']
})
export class EntityFormInputTextareaComponent implements OnInit {

  @Input() field: string;
  @Input() formGroup: FormGroup;
  @Input() textCols: number = 15
  @Input() textRows: number = 3;

  constructor() { }

  ngOnInit() {
  }

}
