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
import { environment } from 'src/environments/environment';
import * as moment from 'moment';

const CURRENT_SCHEDULER_LOADER_INTERVAL: number = environment.currentSchedulerLoaderInterval;
const DATE_FORMAT: string = "YYYY-MM-DD HH:mm:ss";

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.scss']
})
export class ScheduleComponent implements OnInit, OnDestroy {

  public DATE_FORMAT: string = DATE_FORMAT;

  now$: BehaviorSubject<moment.Moment>;
  current$: BehaviorSubject<any> = new BehaviorSubject(null);
  current: any;
  limit: number = 6;//DEFAULT_LIMIT;
  offset: number = 0;

  loadingList: boolean = false;
  formGroups: Map<number, FormGroup>;

  zone: any;
  zoneDisplay: string = (moment()).format('Z');

  config: ScheduleConfig;
  target: string;
  adding: boolean = false;
  editing: boolean = false;
  result: any;

  items$: BehaviorSubject<ScheduleItem[]> = new BehaviorSubject(null);

  foreignKeysEntitiesMap: EntitiesMap;
  foreignKeysEntitiesIdMap: EntitiesIdMap;
  foreignKeyValueForAdd: Map<string, number> = new Map<string, number>();

  loading: any = {};

  addScheduleItem: FormGroup;
  added: number = 0;
  addedThisSave: number = 0;

  hours: any = Array(24).fill(1).map((_, index) => {
    return index;
  });

  minutes: any = Array(60).fill(1).map((_, index) => {
    return index;
  });


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

                this.target = state.target;
                this.config = this.configSchemaService.getScheduleConfig();
                this.resetFormGroups();
                this.loadSchedule({});
                this.loadCurrentScheduledItem();

                this.zone = (moment()).utcOffset();
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
  }

  resetFormGroups() {
    this.formGroups = new Map<number, FormGroup>();
  }
  getQuery() {
    return {};
  }
  loadSchedule(queryObj: any) {
    console.log("LOADING SCHEDULE");
    const query: ScheduleQuery = Object.assign({}, queryObj, {
      offset: this.offset,
      limit: this.limit
    });
    this.loadingList = true;
    this.backendApiService.getSchedule(this.target, query)
      .toPromise().then((result: any) => {
        this.loadingList = false;
        this.result = result;
        const items = this.result.items.map(raw => {
          const item = {
            id: raw.id,
            start: moment.utc(raw.start).local(),
            number: raw['number'],
            pool: raw['pool']
          };
          this.config.fields.map((field: any) => {
            if (typeof field.foreignKey !== 'undefined') {
              item[field.name] = raw[field.name];
            }
          });
          return item;
        }).sort((a: any, b: any) => {
          return b.start.diff(a.start);
        })

        this.schedule = {
          total: this.result.total,
          returned: this.result.returned,
          query: this.result.query,
          items: items
        }
        this.items$.next(items);
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
    for (let i = 0, len = this.config.fields.length; i < len; i++) {
      const field: any = this.config.fields[i];

      const time: any = item[this.config.start] ? item[this.config.start] : moment().add(this.config.defaultStartOffsetMinutes, 'minutes');

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
    this.adding = true;
    this.addScheduleItem = this.fb.group(this.getFormConfig({}));
  }
  edit(item: any) {
    this.resetFormGroups(); //edit only one at a time
    this.editing = true;
    this.formGroups[item.id] = this.fb.group(this.getFormConfig(item));
  }


  closeAddForm(reload: boolean) {
    this.adding = false;
    delete this.addScheduleItem;
    if (reload) {
      this.loadSchedule({});
    }
  }
  closeEditForm(id: number, reload: boolean) {
    this.editing = false;
    delete this.formGroups[id];
    if (reload) {
      this.loadSchedule({});
    }
  }

  setLatestForeignKeyValueForAdd(formGroup: FormGroup, field: any) {
    this.foreignKeyValueForAdd[field.name] = formGroup.value[field.name];
  }

  nextPage() {
    this.offset = this.offset + this.limit;
    this.loadSchedule(this.getQuery());
  }
  previousPage() {
    this.offset = this.offset - this.limit;
    this.loadSchedule(this.getQuery());
  }

  ngOnDestroy() {
    clearInterval(this.currentScheduleLoader);
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
