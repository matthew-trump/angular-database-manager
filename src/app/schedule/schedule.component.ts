import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { tap, takeUntil } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { Subject, BehaviorSubject } from 'rxjs';
import { ConfigSchemaService } from '../config-schema.service';
import { BackendApiService } from '../backend-api.service';
import { EntitiesMap } from '../entities-map';
import { EntitiesIdMap } from '../entities-id-map';
import { ScheduleConfig } from '../schedule-config';
import { ScheduleItem } from '../schedule-item';
import { ScheduleQuery } from '../schedule-query';
import { Pagination } from '../pagination';
import { PaginationQuery } from '../pagination-query';
import { environment } from 'src/environments/environment';
import * as moment from 'moment';

const CURRENT_SCHEDULER_LOADER_INTERVAL: number = environment.currentSchedulerLoaderInterval;
const DATE_FORMAT: string = "YYYY-MM-DD HH:mm:ss";
const DEFAULT_LIMIT: number = 7;

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.scss']
})
export class ScheduleComponent implements OnInit, OnDestroy {

  public DATE_FORMAT: string = DATE_FORMAT;

  pagination: Pagination = new Pagination({
    limit: DEFAULT_LIMIT,
    offset: 0
  })

  now$: BehaviorSubject<moment.Moment>;

  current$: BehaviorSubject<any> = new BehaviorSubject(null);
  current: any;

  loadingList: boolean = false;

  zoneDisplay: string = (moment()).format('Z');

  scheduleConfig: ScheduleConfig;

  items$: BehaviorSubject<ScheduleItem[]> = new BehaviorSubject(null);

  foreignKeysEntitiesMap: EntitiesMap;
  foreignKeysEntitiesIdMap: EntitiesIdMap;

  foreignKeyValueForAdd: Map<string, number> = new Map<string, number>();

  addScheduleItem: FormGroup;
  editScheduleItem: Map<number, FormGroup>;

  schedule: any = {}
  timeFlags: any = {}

  currentScheduleLoader: any;
  unsubscribe$: Subject<null> = new Subject();

  constructor(public fb: FormBuilder,
    public store: Store<any>,
    public configSchemaService: ConfigSchemaService,
    public backendApiService: BackendApiService) { }

  ngOnInit() {


    this.store
      .select("config")
      .pipe(
        tap((state: any) => {
          if (state.target !== null) {
            this.configSchemaService.loadScheduleForeignKeys()
              .then((foreignKeysMapEntitiesMap: EntitiesMap) => {
                this.foreignKeysEntitiesMap = foreignKeysMapEntitiesMap;
                if (this.foreignKeysEntitiesMap) {
                  this.foreignKeysEntitiesIdMap = this.configSchemaService.getEntitiesIdMap(this.foreignKeysEntitiesMap);
                }
                this.scheduleConfig = this.configSchemaService.getScheduleConfig();
                this.resetFormGroups();
                this.loadSchedule(this.getQuery());
                this.loadCurrentScheduledItem();

                this.now$ = new BehaviorSubject(moment());
                this.currentScheduleLoader = setInterval(() => {
                  this.now$.next(moment());
                  this.loadCurrentScheduledItem();
                }, CURRENT_SCHEDULER_LOADER_INTERVAL);
              })
          }
        }),
        takeUntil(this.unsubscribe$)
      ).subscribe(_ => { })

    this.pagination.params$
      .pipe(
        tap((params: PaginationQuery) => {
          if (params) {
            this.loadSchedule(this.getQuery());
          }
        }),
        takeUntil(this.unsubscribe$)
      ).subscribe(_ => { });
  }

  resetFormGroups() {
    this.editScheduleItem = new Map<number, FormGroup>();
  }
  getQuery(): ScheduleQuery {
    return Object.assign({} as ScheduleQuery, this.pagination.query);
  }
  loadSchedule(query: ScheduleQuery) {
    console.log("LOADING SCHEDULE");
    this.loadingList = true;
    this.backendApiService.getSchedule(query)
      .toPromise().then((result: any) => {
        this.loadingList = false;

        const items = result.items.map(raw => {
          const item = {
            id: raw.id,
            start: moment.utc(raw.start).local(),
            number: raw['number'],
            pool: raw['pool']
          };
          this.scheduleConfig.fields.map((field: any) => {
            if (typeof field.foreignKey !== 'undefined') {
              item[field.name] = raw[field.name];
            }
          });
          return item;
        }).sort((a: any, b: any) => {
          return b.start.diff(a.start);
        })
        this.schedule = {
          items: items
        }
        this.items$.next(items);

        this.pagination.update(result.query);
        this.pagination.setTotal(result.total);
        this.pagination.setShowing(result.returned)

        this.resetTimeFlags();

      }).catch((err) => {
        this.loadingList = false;
        console.log(err);
      });
  }
  loadCurrentScheduledItem() {
    this.configSchemaService.loadCurrentScheduledItem().then((current: any) => {
      console.log("CURRENT", current);
      this.current$.next(current);
      this.current = current;
      this.resetTimeFlags();
    })
  }
  resetTimeFlags() {

    if (this.schedule.items && this.current) {
      this.timeFlags = {
        [this.current.id]: 0
      };
      if (this.schedule.items && this.current && this.current.start) {
        this.schedule.items.map((item: any) => {
          if (this.current.start.diff(item.start) < 0) {
            this.timeFlags[item.id] = -1;
          } else if (0 < this.current.start.diff(item.start)) {
            this.timeFlags[item.id] = 1
          }
        });
      }
    }
  }
  getFormConfig(item: any) {
    const fbconfig: any = {};
    for (let i = 0, len = this.scheduleConfig.fields.length; i < len; i++) {
      const field: any = this.scheduleConfig.fields[i];

      const time: any = item[this.scheduleConfig.start] ? item[this.scheduleConfig.start] : moment().add(this.scheduleConfig.defaultStartOffsetMinutes, 'minutes');

      fbconfig[field.name] = typeof item[field.name] !== 'undefined' ?
        [item[field.name]]
        : typeof this.foreignKeyValueForAdd[field.name] !== 'undefined' ?
          [this.foreignKeyValueForAdd[field.name]] : typeof time !== 'undefined' ?
            field.type === 'date' ? [time] :
              field.type === 'hour' ? [time.hour()] :
                field.type === 'minute' ? [time.minute()] :
                  [field.default] : [''];

      if (field.required) {
        fbconfig[field.name].push(Validators.required)
      }
    }
    return fbconfig;
  }
  add() {
    this.addScheduleItem = this.fb.group(this.getFormConfig({}));
  }
  edit(item: any) {
    this.resetFormGroups(); //edit only one at a time
    this.editScheduleItem[item.id] = this.fb.group(this.getFormConfig(item));
  }

  closeAddForm(reload: boolean) {
    delete this.addScheduleItem;
    if (reload) {
      this.loadSchedule(this.getQuery());
    }
  }
  closeEditForm(id: number, reload: boolean) {
    delete this.editScheduleItem[id];
    if (reload) {
      this.loadSchedule(this.getQuery());
    }
  }

  setLatestForeignKeyValueForAdd(formGroup: FormGroup, field: any) {
    this.foreignKeyValueForAdd[field.name] = formGroup.value[field.name];
  }



  ngOnDestroy() {
    clearInterval(this.currentScheduleLoader);
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
