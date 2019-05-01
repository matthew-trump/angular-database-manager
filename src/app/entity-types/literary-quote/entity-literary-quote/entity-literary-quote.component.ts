import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { EntitiesIdMap } from 'src/app/entities-id-map';
@Component({
  selector: 'entity-literary-quote',
  templateUrl: './entity-literary-quote.component.html',
  styleUrls: ['./entity-literary-quote.component.scss']
})
export class EntityLiteraryQuoteComponent implements OnInit {

  @Input() enabled: boolean;
  @Input() entity: any;
  @Input() entityConfig: any;
  @Input() foreignKeysEntitiesIdMap: EntitiesIdMap;
  @Output() edit: EventEmitter<null> = new EventEmitter();


  constructor() { }

  ngOnInit() {
    //console.log("foreignKeysEntitiesIdMap", this.foreignKeysEntitiesIdMap);
  }

}
