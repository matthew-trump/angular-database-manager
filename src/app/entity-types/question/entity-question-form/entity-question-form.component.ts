import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'entity-question-form',
  templateUrl: './entity-question-form.component.html',
  styleUrls: ['./entity-question-form.component.scss']
})
export class EntityQuestionFormComponent implements OnInit {

  @Input() formGroup: FormGroup;
  @Input() enabled: boolean;
  @Input() question: any;
  @Input() entityConfig: any;
  @Input() categories: any;
  @Input() multipleCategories: boolean = true;
  @Input() adding: boolean;
  @Input() inProgress: boolean;

  @Output() done: EventEmitter<boolean> = new EventEmitter();

  spinnerDiameter: number = 20;
  text = "text";

  @Input() textCols: number = 15
  @Input() textRows: number = 5;
  constructor() { }

  ngOnInit() {

  }


}
