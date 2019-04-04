import { Injectable } from '@angular/core';
import { BackendApiService } from './backend-api.service';
import { environment } from '../environments/environment';
import { Store } from '@ngrx/store';
import { ConfigStateAction } from './config-state.action';
import { BehaviorSubject, Observable } from 'rxjs';
import * as moment from 'moment';
@Injectable({
  providedIn: 'root'
})
export class ConfigSchemaService {
  public target: string;
  public schema: any;
  public entities$: BehaviorSubject<any> = new BehaviorSubject(null);

  constructor(private backendApiService: BackendApiService,
    private store: Store<any>
  ) { }

  getEntityConfig(plural: string) {
    return this.schema.entities.filter((entity: any) => {
      return entity.plural === plural;
    })[0];
  }
  getScheduleConfig() {
    return this.schema.schedule;
  }

  loadSchema(target: string): Promise<any> {
    if (environment.targets[target].schemaPath) {
      this.backendApiService.configSchema(target).toPromise().then((schema: any) => {
        this.schema = schema;
        this.target = target;
        if (schema) {
          this.entities$.next(schema.entities)
        }

        this.store.dispatch(new ConfigStateAction({
          target: target,
          schema: schema
        }));

        return Promise.resolve(schema);
      }).catch((err: any) => {
        console.log(err);
      });
    } else {
      console.log("ERROR: RETURING PROMISE no schema", target);
      this.store.dispatch(new ConfigStateAction({
        target: target,
        schema: null
      }));
      return Promise.resolve(null);
    }

  }
  /**
  async loadForeignKeysEntity(id: string): Promise<any> {
    const config = this.getEntityConfig(id);
    if (config) {
      const foreignKeyEntityConfigs: any[] = config.fields.filter((field: any) => {
        return typeof field.foreignKey !== 'undefined';
      }).map((field: any) => {
        return this.getEntityConfig(field.foreignKey);
      });
      return Promise.all(foreignKeyEntityConfigs.map((foreignKeyEntityConfig: any) => {
        return this.loadForeignKeyEntities(foreignKeyEntityConfig);
      }))
    }
    return Promise.resolve(null)
  }
   */
  async loadForeignKeys(id?: string): Promise<any> {
    const config = typeof id !== 'undefined' ? this.getEntityConfig(id) : this.getScheduleConfig();
    if (config) {
      const foreignKeyEntityConfigs: any[] = config.fields.filter((field: any) => {
        return typeof field.foreignKey !== 'undefined';
      }).map((field: any) => {
        return this.getEntityConfig(field.foreignKey);
      });
      return Promise.all(foreignKeyEntityConfigs.map((foreignKeyEntityConfig: any) => {
        return this.loadForeignKeyEntities(foreignKeyEntityConfig);
      }))
    }
    return Promise.resolve(null)
  }
  async loadForeignKeyEntities(entityConfig: any): Promise<any> {
    const foreignKeyEntities: any = {};
    const foreignKeyEntitiesIdMap: any = {};
    const plural: string = entityConfig.plural;
    const retobj: any = await this.backendApiService.getEntities(this.target, plural).toPromise();
    const entityList: any[] = retobj.entities;
    if (entityList) {
      foreignKeyEntities[plural] = entityList;
      foreignKeyEntitiesIdMap[plural] = entityList.reduce((obj: any, entry: any) => {
        obj[entry.id] = entry;
        return obj;
      }, {});
    }
    return Promise.resolve({
      entities: foreignKeyEntities, idMap: foreignKeyEntitiesIdMap
    });
  }
  async loadCurrentScheduledItem(): Promise<any> {
    try{
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

    }catch(err){
        console.log(err);
        return Promise.resolve(null);
    }
   
    
  }
}

