import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { tap, takeUntil, switchMap, filter, debounceTime } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { Subject, BehaviorSubject } from 'rxjs';
import { ConfigSchemaService } from '../config-schema.service';
import { BackendApiService } from '../backend-api.service';
import { environment } from 'src/environments/environment';

const DEFAULT_LIMIT: number = 50;
const TARGETS: any = environment.targets;

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.scss']
})
export class ScheduleComponent implements OnInit {

  limit: number = DEFAULT_LIMIT;
  offset: number = 0;
  loadingList: boolean = false;
  formGroups: any = {};

  scheduleConfig: any;
  target: string;
  adding: boolean = false;

  result: any;

  items$: BehaviorSubject<any[]> = new BehaviorSubject(null);
  foreignKeyEntityConfigMap: any = {};
  foreignKeys: any[];
  foreignKeyEntities: any = {}
  foreignKeyEntitiesIdMap: any = {};
  foreignKeyValueForAdd: any = {};

  loading: any = {};

  unsubscribe$: Subject<null> = new Subject();

  constructor(public fb: FormBuilder,
    public store: Store<any>,
    public configSchemaService: ConfigSchemaService,
    public backendApiService: BackendApiService) { }

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
        tap((_: any) => {
          this.formGroups = {};
          this.scheduleConfig = this.configSchemaService.getScheduleConfig();
          if (this.scheduleConfig) {


            const foreignKeyEntityConfigs: any[] = this.scheduleConfig.selectors.filter((selector: any) => {
              return selector.type === "foreignKey";
            }).map((selector: any) => {
              return this.configSchemaService.getEntityConfig(selector.entity);
            });

            Promise.all(foreignKeyEntityConfigs.map((foreignKeyEntityConfig: any) => {
              return this.loadForeignKeyEntities(foreignKeyEntityConfig);
            })).then((_) => {
              this.foreignKeys = Object.keys(this.foreignKeyEntitiesIdMap)
            }).then((_) => {
              this.loadSchedule({});
            })
          }

        }),
        takeUntil(this.unsubscribe$)
      ).subscribe(_ => { })
  }
  nextPage() {
    this.offset = this.offset + this.limit;
    this.loadSchedule(this.getQuery());
  }
  previousPage() {
    this.offset = this.offset - this.limit;
    this.loadSchedule(this.getQuery());
  }
  edit(entity: any) {
    const fbconfig: any = this.getFormConfig(entity);
    const group: FormGroup = this.fb.group(fbconfig);
    this.formGroups[entity.id] = group;
  }
  getQuery() {
    return {};
  }
  getFormConfig(item: any) {
    const fbconfig: any = {};
    for (let i = 0, len = this.scheduleConfig.selectors.length; i < len; i++) {
      const field: any = this.scheduleConfig.selectors[i];
      fbconfig[field.name] = item[field.name] ? [item[field.name]] : [this.foreignKeyValueForAdd[field.name] ? this.foreignKeyValueForAdd[field.name] : ''];
      if (field.required) {
        fbconfig[field.name].push(Validators.required)
      }
    }
    return fbconfig;
  }
  save(item: any, index: number) {
    const update: any = this.formGroups[item.id].value;
    this.loading[item.id] = true;
    this.backendApiService.updateScheduleItem(
      this.target,
      item.id,
      update
    )
      .toPromise()
      .then((result: any) => {
        this.loading[item.id] = false;
        this.result.items[index] = Object.assign({}, { id: item.id }, update);
        this.items$.next(this.result.items);
        delete this.formGroups[item.id];
      })
      .catch(err => {
        console.log("ERROR NOT UPDATED", err);
        this.loading[item.id] = false;
        delete this.formGroups[item.id];
      });


  }

  loadSchedule(queryObj: any) {
    const query = Object.assign({}, queryObj);
    query.offset = this.offset;
    query.limit = this.limit;
    this.loadingList = true;
    this.backendApiService.getSchedule(this.target, query)
      .toPromise().then((result: any) => {
        this.loadingList = false;
        this.result = result;
        this.items$.next(this.result.items);
      }).catch((err) => {
        this.loadingList = false;
        console.log(err);
      });
  }
  async loadForeignKeyEntities(entityConfig: any): Promise<any> {
    const plural: string = entityConfig.plural;
    this.foreignKeyEntityConfigMap[plural] = entityConfig;
    const retobj: any = await this.backendApiService.getEntities(this.target, plural).toPromise();
    const entityList: any[] = retobj.entities;
    if (entityList) {
      this.foreignKeyEntities[plural] = entityList;
      this.foreignKeyEntitiesIdMap[plural] = entityList.reduce((obj: any, entry: any) => {
        obj[entry.id] = entry;
        return obj;
      }, {});
    }
    return Promise.resolve(true);
  }
  setAdding(adding: boolean) {
    this.adding = adding;
  }
  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
