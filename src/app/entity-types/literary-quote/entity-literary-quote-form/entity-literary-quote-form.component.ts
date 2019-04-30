import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'entity-literary-quote-form',
  templateUrl: './entity-literary-quote-form.component.html',
  styleUrls: ['./entity-literary-quote-form.component.scss']
})
export class EntityLiteraryQuoteFormComponent implements OnInit {


  @Input() formGroup: FormGroup;
  @Input() inProgress: boolean;
  @Input() adding: boolean;
  @Input() textCols: number = 15
  @Input() textRows: number = 3;

  constructor() { }

  ngOnInit() {
  }

}
