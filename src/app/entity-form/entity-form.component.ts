import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { EntityConfig } from '../entity-config';
import { EntitiesMap } from '../entities-map';
import { EntityUpdate } from '../entity-update';
import { Entity } from '../entity';
import { BackendApiService } from '../backend-api.service';

@Component({
  selector: 'app-entity-form',
  templateUrl: './entity-form.component.html',
  styleUrls: ['./entity-form.component.scss']
})
export class EntityFormComponent implements OnInit {

  @Input() entity?: Entity;
  @Input() formGroup: FormGroup;
  @Input() entityConfig: EntityConfig;
  @Input() foreignKeysEntitiesMap: EntitiesMap;

  @Output() done: EventEmitter<boolean> = new EventEmitter();
  @Output() another: EventEmitter<boolean> = new EventEmitter();
  @Output() remove: EventEmitter<boolean> = new EventEmitter();

  constructor(public backendApiService: BackendApiService) { }

  ngOnInit() { }

  setLatestForeignKeyValueForAdd() { }

  removeNew() {
    this.remove.emit(true);
  }
  anotherNew() {
    this.another.emit(true);
  }
  cancel() {
    this.done.emit(false);
  }
  save() {
    try {
      const entityUpdate: EntityUpdate = this.formGroup.value;
      this.backendApiService.updateEntity(this.entityConfig.plural, this.entity.id, entityUpdate).toPromise().then((_) => {
        this.done.emit(true)
      }).catch(err => {
        console.log(err);
      })
    } catch (err) {
      window.alert(err.message);
    }
  }


}
