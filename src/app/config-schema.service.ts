import { Injectable } from '@angular/core';
import { BackendApiService } from './backend-api.service';
import { environment } from '../environments/environment';
import { Store } from '@ngrx/store';
import { ConfigStateAction } from './config-state.action';
import { BehaviorSubject } from 'rxjs';
import { SchemaConfig } from './schema-config';
import { EntityConfig } from './entity-config';
import { ScheduleConfig } from './schedule-config';
import { Entity } from './entity';
import { EntityIdMap } from './entity-id-map';
import { EntitiesMap } from './entities-map';
import { EntitiesIdMap } from './entities-id-map';
import { EntitiesResponse } from './entities-response';
import { Schema } from './schema';
import { SchemaResponse } from './schema-response';
import { SchemaField } from './schema-field';

import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class ConfigSchemaService {
  public target: string;
  public schema: Schema;
  public entities$: BehaviorSubject<EntityConfig[]> = new BehaviorSubject(null);

  constructor(private backendApiService: BackendApiService,
    private store: Store<any>
  ) { }

  getEntityConfig(plural: string): EntityConfig {
    return this.schema.entities.filter((entityConfig: EntityConfig) => {
      return entityConfig.plural === plural;
    })[0];
  }
  getScheduleConfig(): ScheduleConfig {
    return this.schema.schedule;
  }

  async loadSchema(target: string): Promise<any> {
    if (environment.targets[target].schemaPath) {
      const schemaResponse: SchemaResponse = await this.backendApiService.getSchema(target).toPromise();
      this.schema = schemaResponse as Schema;
      this.target = target;

      if (this.schema) {
        this.entities$.next(this.schema.entities)
      }

      this.store.dispatch(new ConfigStateAction({
        target: this.target,
        schema: this.schema
      }));
      console.log("RETURNING SCHEMA");
      return Promise.resolve(this.schema);

    } else {
      console.log("ERROR: RETURING PROMISE no schema", target);
      this.store.dispatch(new ConfigStateAction({
        target: this.target,
        schema: null
      }));
      return Promise.resolve(null);
    }
  }
  async loadEntities(entityConfig: EntityConfig): Promise<Entity[]> {
    const plural: string = entityConfig.plural;
    const retobj: EntitiesResponse = await this.backendApiService.getEntities(this.target, plural).toPromise();
    const entities: Entity[] = retobj.entities;
    return Promise.resolve(entities);
  }

  async loadScheduleForeignKeys(): Promise<EntitiesMap> {
    return this.loadForeignKeys(this.getScheduleConfig());
  }
  async loadEntityForeignKeys(plural: string): Promise<EntitiesMap> {
    return this.loadForeignKeys(this.getEntityConfig(plural));
  }

  private async loadForeignKeys(config: SchemaConfig): Promise<EntitiesMap> {
    if (config) {
      const entityConfigs: EntityConfig[] = this.getForeignKeyEntityConfigs(config);
      const entitiesMap: EntitiesMap = {} as EntitiesMap;
      for (let i = 0, len = entityConfigs.length; i < len; i++) {
        const entityConfig: EntityConfig = entityConfigs[i];
        const entities = await this.loadEntities(entityConfig);
        entitiesMap[entityConfig.plural] = entities;
      }
      return Promise.resolve(entitiesMap)
    }
    return Promise.resolve(null)
  }
  public getForeignKeyEntityConfigs(config: SchemaConfig): EntityConfig[] {
    const fields: SchemaField[] = config.fields;
    const entityConfigs: EntityConfig[] = fields.filter((field: SchemaField) => {
      return typeof field.foreignKey !== 'undefined';
    }).map((field: SchemaField) => {
      return this.getEntityConfig(field.foreignKey);
    });
    return entityConfigs;
  }
  getEntityIdMap(entities: Entity[]): EntityIdMap {
    const map = entities.reduce((obj: EntityIdMap, entity: Entity) => {
      obj[entity.id] = entity;
      return obj;
    }, {} as EntityIdMap);
    return map;
  }
  getEntitiesIdMap(entitiesMap: EntitiesMap): EntitiesIdMap {
    return Object.keys(entitiesMap).reduce((obj: EntitiesIdMap, plural: string) => {
      obj[plural] = this.getEntityIdMap(entitiesMap[plural]);
      return obj;
    }, {} as EntitiesIdMap);
  }

  async loadCurrentScheduledItem(): Promise<any> {
    try {
      const result: any = await this.backendApiService.getCurrentScheduleItem(this.target).toPromise();
      const current: any = Object.assign({}, result.item);
      delete current.start;
      if (result.item) {
        current.start = moment.utc(result.item.start).local();
      }
      if (result.next) {
        current.end = moment.utc(result.next.start).local();
      }
      return Promise.resolve(current);

    } catch (err) {
      return Promise.reject();
      //return Promise.resolve(null);
    }


  }
}

