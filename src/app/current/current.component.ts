import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { tap, takeUntil, switchMap, filter, debounceTime } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { Subject, Observable, BehaviorSubject } from 'rxjs';
import { ConfigSchemaService } from '../config-schema.service';
import { BackendApiService } from '../backend-api.service';
import { environment } from 'src/environments/environment';
import * as moment from 'moment';

const DEFAULT_LIMIT: number = 50;
const TARGETS: any = environment.targets;
const DATE_FORMAT: string = "YYYY-MM-DD HH:mm:ss";

@Component({
  selector: 'app-current',
  templateUrl: './current.component.html',
  styleUrls: ['./current.component.scss']
})
export class CurrentComponent implements OnInit {

  public DATE_FORMAT = DATE_FORMAT;

  current$: BehaviorSubject<any> = new BehaviorSubject(null)
  now$: BehaviorSubject<any>;
  limit: number = DEFAULT_LIMIT;
  offset: number = 0;
  loadingList: boolean = false;
  formGroups: any = {};

  zone: any;

  scheduleConfig: any;
  target: string;
  adding: boolean = false;
  editing: boolean = false;
  result: any;

  items$: BehaviorSubject<any[]> = new BehaviorSubject(null);
  foreignKeyEntityConfigMap: any = {};
  foreignKeys: any[];
  foreignKeyEntities: any = {}
  foreignKeyEntitiesIdMap: any = {};
  foreignKeyValueForAdd: any = {};

  loading: any = {};

  addScheduleItem: FormGroup;
  added: number = 0;
  addedThisSave: number = 0;

  hours: any[number];
  minutes: any[number];

  schedule: any = {}
  timeFlags: any = {}

  unsubscribe$: Subject<null> = new Subject();

  constructor(public store: Store<any>,
    public configSchemaService: ConfigSchemaService,
    public backendApiService: BackendApiService) { }

  ngOnInit() {
    this.now$ = new BehaviorSubject(moment());
    this.zone = (moment()).utcOffset();
    setInterval(() => {
      this.now$.next(moment());
      this.loadCurrentScheduledItem();
    }, 60000);

    this.hours = Array(24).fill(1).map((_, index) => {
      return index;
    });

    this.minutes = Array(60).fill(1).map((_, index) => {
      return index;
    });

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
              this.foreignKeys = Object.keys(this.foreignKeyEntitiesIdMap);
            }).then((_) => {
              this.loadCurrentScheduledItem();
            })
          }
        }),
        takeUntil(this.unsubscribe$)
      ).subscribe(_ => { })
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
  loadCurrentScheduledItem() {
    this.backendApiService.getCurrentScheduleItem(this.target).toPromise().then((result: any) => {
      const current: any = Object.assign({}, result.current);
      delete current.start;
      if (result.current) {
        current.start = moment.utc(result.current.start).local();
      }
      if (result.next) {
        current.end = moment.utc(result.next.start).local();
      }
      this.current$.next(current);
    }).catch((err) => {
      console.log(err);
    });
  }
}
