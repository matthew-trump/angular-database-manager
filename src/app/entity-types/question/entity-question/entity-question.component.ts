import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'entity-question',
  templateUrl: './entity-question.component.html',
  styleUrls: ['./entity-question.component.scss']
})
export class EntityQuestionComponent implements OnInit {

  @Input() enabled: boolean;
  @Input() question: any;
  @Input() entityConfig: any;
  @Input() categoriesIdMap: any;
  @Input() multipleCategories: boolean = true;
  @Output() edit: EventEmitter<null> = new EventEmitter();

  details: boolean = false;

  constructor() { }

  ngOnInit() {
  }
  toggleDetails() {
    this.details = !this.details;
  }
  questionType(type: number) {
    const t = this.entityConfig.enums.questionType.find(qt => qt.value === type);
    return t ? t.name : null;

  }

}
