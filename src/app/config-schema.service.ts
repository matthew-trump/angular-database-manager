import { Injectable } from '@angular/core';
import { BackendApiService } from './backend-api.service';
import { environment } from '../environments/environment';
import { Store } from '@ngrx/store';
import { ConfigStateAction } from './config-state.action';
@Injectable({
  providedIn: 'root'
})
export class ConfigSchemaService {

  public schema: any;

  constructor(private backendApiService: BackendApiService,
    private store: Store<any>
  ) { }

  loadSchema(target: string): Promise<any> {
    if (environment.targets[target].schemaPath) {
      this.backendApiService.configSchema(target).toPromise().then((schema: any) => {
        this.schema = schema;
        //console.log("DISPATCHING SCHEMA", schema);
        this.store.dispatch(new ConfigStateAction({
          target: target,
          schema: schema
        }));
        /** */
        //console.log("RETURING PROMISE with schema", schema);
        return Promise.resolve(schema);
      })
    } else {
      //console.log("RETURING PROMISE no schema");
      return Promise.resolve(null);
    }

  }
}
