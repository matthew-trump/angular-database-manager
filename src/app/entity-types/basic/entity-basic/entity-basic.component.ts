import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { EntitiesIdMap } from 'src/app/entities-id-map';
@Component({
  selector: 'entity-basic',
  templateUrl: './entity-basic.component.html',
  styleUrls: ['./entity-basic.component.scss']
})
export class EntityBasicComponent implements OnInit {

  @Input() enabled: boolean;
  @Input() entity: any;
  @Input() entityConfig: any;
  @Input() foreignKeysEntitiesIdMap: EntitiesIdMap;
  @Output() edit: EventEmitter<null> = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

}
