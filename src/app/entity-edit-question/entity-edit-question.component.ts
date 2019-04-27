import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-entity-edit-question',
  templateUrl: './entity-edit-question.component.html',
  styleUrls: ['./entity-edit-question.component.scss']
})
export class EntityEditQuestionComponent implements OnInit {

  @Input() formGroup: FormGroup;
  @Input() enabled: boolean;
  @Input() question: any;
  @Input() entityConfig: any;
  @Input() categories: any;
  @Input() multipleCategories: boolean = true;
  @Input() adding: boolean;

  @Output() cancel: EventEmitter<null> = new EventEmitter();

  text = "text";

  @Input() textCols: number = 15
  @Input() textRows: number = 5;
  constructor() { }

  ngOnInit() {
    console.log(this.categories);
  }

}
