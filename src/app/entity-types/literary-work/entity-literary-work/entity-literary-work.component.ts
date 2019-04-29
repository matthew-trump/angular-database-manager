import { Component, Input, OnInit, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'entity-literary-work',
  templateUrl: './entity-literary-work.component.html',
  styleUrls: ['./entity-literary-work.component.scss']
})
export class EntityLiteraryWorkComponent implements OnInit {

  @Input() enabled: boolean;
  @Input() work: any;
  @Input() entityConfig: any;
  @Input() authorsIdMap: any;
  @Output() edit: EventEmitter<null> = new EventEmitter();

  constructor() { }

  ngOnInit() {

  }

}
