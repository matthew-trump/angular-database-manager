import { Component, Input, OnInit, NgZone } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { EntityConfig } from '../entity-config';
import { EntitiesMap } from '../entities-map';

@Component({
  selector: 'app-entity-form',
  templateUrl: './entity-form.component.html',
  styleUrls: ['./entity-form.component.scss']
})
export class EntityFormComponent implements OnInit {

  @Input() formGroup: FormGroup;
  @Input() config: EntityConfig;
  @Input() foreignKeysEntitiesMap: EntitiesMap;
  @Input() zone;

  now;

  constructor() { }

  ngOnInit() {
  }
  setLatestForeignKeyValueForAdd() {

  }

}
