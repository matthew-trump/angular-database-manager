import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'entity-literary-work-form',
  templateUrl: './entity-literary-work-form.component.html',
  styleUrls: ['./entity-literary-work-form.component.scss']
})
export class EntityLiteraryWorkFormComponent implements OnInit {

  @Input() formGroup: FormGroup;
  @Input() inProgress: boolean;
  @Input() adding: boolean;

  constructor() { }

  ngOnInit() {

  }

}
