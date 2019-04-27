import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { EntitiesIdMap } from '../entities-id-map';
@Component({
  selector: 'app-entity-display-basic',
  templateUrl: './entity-display-basic.component.html',
  styleUrls: ['./entity-display-basic.component.scss']
})
export class EntityDisplayBasicComponent implements OnInit {

  @Input() enabled: boolean;
  @Input() entity: any;
  @Input() entityConfig: any;
  @Input() foreignKeysEntitiesIdMap: EntitiesIdMap;
  @Output() edit: EventEmitter<null> = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

}
