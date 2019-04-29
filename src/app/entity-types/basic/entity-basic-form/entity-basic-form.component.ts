import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { EntityConfig } from 'src/app/entity-config';
import { EntitiesMap } from 'src/app/entities-map';
import { EntityUpdate } from 'src/app/entity-update';
import { Entity } from 'src/app/entity';
import { BackendApiService } from 'src/app/backend-api.service';

@Component({
  selector: 'entity-basic-form',
  templateUrl: './entity-basic-form.component.html',
  styleUrls: ['./entity-basic-form.component.scss']
})
export class EntityBasicFormComponent implements OnInit {

  @Input() entity?: Entity;
  @Input() formGroup: FormGroup;
  @Input() entityConfig: EntityConfig;
  @Input() foreignKeysEntitiesMap: EntitiesMap;

  @Output() done: EventEmitter<boolean> = new EventEmitter();

  constructor(public backendApiService: BackendApiService) { }

  ngOnInit() { }

  setLatestForeignKeyValueForAdd() { }







}
