import { Injectable } from '@angular/core';
import { BackendApiService } from './backend-api.service';
import { environment } from '../environments/environment';
import { Store } from '@ngrx/store';
import { ConfigStateAction } from './config-state.action';
import { BehaviorSubject } from 'rxjs';
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
    console.log("getScheduleConfig", this.schema.schedule);
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
}
