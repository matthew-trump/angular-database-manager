import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { tap, takeUntil, switchMap, filter } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { Subject, BehaviorSubject } from 'rxjs';
import { ConfigSchemaService } from '../config-schema.service';
import { BackendApiService } from '../backend-api.service';
@Component({
  selector: 'app-entities',
  templateUrl: './entities.component.html',
  styleUrls: ['./entities.component.scss']
})
export class EntitiesComponent implements OnInit {
  entityConfig: any;
  target: string;
  entities: any[];
  entities$: BehaviorSubject<any[]> = new BehaviorSubject(null);
  //foreignKeyEntityConfigMap: any = {};
  foreignKeyEntities: any = {}
  foreignKeyEntitiesIdMap: any = {};

  loading: any = {};
  formGroups: any = {};

  unsubscribe$: Subject<null> = new Subject();

  constructor(private route: ActivatedRoute,
    public fb: FormBuilder,
    public store: Store<any>,
    public configSchemaService: ConfigSchemaService,
    public backendApiService: BackendApiService,
  ) { }

  ngOnInit() {
    this.store
      .select("config")
      .pipe(
        filter((state: any) => {
          return state.target !== null;
        }),
        tap((state: any) => {
          this.target = state.target;
        }),
        switchMap((_: any) => {
          return this.route.params
        }),
        tap((params: any) => {
          this.entityConfig = this.configSchemaService.getEntityConfig(params.id);
          this.formGroups = {};
          this.loading = {};
          this.entities$.next(null);
          if (this.entityConfig) {
            const foreignKeyEntityConfigs: any[] = this.entityConfig.fields.filter((field: any) => {
              return typeof field.foreignKey !== 'undefined';
            }).map((field: any) => {
              return this.configSchemaService.getEntityConfig(field.foreignKey);
            });

            //console.log("FOREIGN KEY ENTITY CONFIGS", foreignKeyEntityConfigs);

            //this.foreignKeyEntityConfigMap = 
            /** 
            foreignKeyEntityConfigs.reduce((obj: any, entityConfig: any) => {
              obj[entityConfig.plural] = entityConfig;
              return obj;
            }, {});
            */
            Promise.all(foreignKeyEntityConfigs.map((foreignKeyEntityConfig: any) => {
              return this.loadForeignKeyEntities(foreignKeyEntityConfig.plural);
            })).then((_) => {

              //console.log("FOREIGN KEY ENTITIES", this.foreignKeyEntitiesMap);

              this.backendApiService.getEntities(this.target, this.entityConfig.plural)
                .toPromise().then((result: any) => {
                  this.entities = result.result;
                  this.entities$.next(this.entities);
                });

            })


          }
        }),
        takeUntil(this.unsubscribe$)
      ).subscribe(_ => { })

  }
  async loadForeignKeyEntities(plural: string): Promise<any> {
    const retobj: any = await this.backendApiService.getEntities(this.target, plural).toPromise();
    const entityList: any[] = retobj.result;
    if (entityList) {
      this.foreignKeyEntities[plural] = entityList;
      this.foreignKeyEntitiesIdMap[plural] = entityList.reduce((obj: any, entry: any) => {
        obj[entry.id] = entry;
        return obj;
      }, {});
    }
    //this.foreignKeyEntitiesMap[plural] = retobj.result;
    return Promise.resolve(true);
  }
  toggle(entity: any, field: string) {
    const value: boolean = !entity[field];
    this.backendApiService.updateEntity(
      this.target,
      this.entityConfig.plural,
      entity.id,
      { [field]: value ? 1 : 0 }
    ).toPromise().then((res: any) => {
      entity[field] = value;
    });
  }
  edit(entity: any) {
    const fbconfig: any = {};
    for (let i = 0, len = this.entityConfig.fields.length; i < len; i++) {
      const field: any = this.entityConfig.fields[i];
      fbconfig[field.name] = [entity[field.name]];
    }
    const group: FormGroup = this.fb.group(fbconfig);
    this.formGroups[entity.id] = group;

  }
  save(entity: any, index: number) {
    const update: any = this.formGroups[entity.id].value;
    this.loading[entity.id] = true;
    this.backendApiService.updateEntity(
      this.target,
      this.entityConfig.plural,
      entity.id,
      update
    )
      .toPromise()
      .then((result: any) => {
        this.loading[entity.id] = false;
        this.entities[index] = Object.assign({}, { id: entity.id }, update);

        console.log(this.entities);
        this.entities$.next(this.entities);
        delete this.formGroups[entity.id];
      })
      .catch(err => {
        console.log("ERROR NOT UPDATED", err);
        this.loading[entity.id] = false;
        delete this.formGroups[entity.id];
      });


  }
  cancel(entity: any) {
    delete this.formGroups[entity.id];
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
