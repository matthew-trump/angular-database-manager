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
import { ScheduleItemUpdate } from '../schedule-item-update';
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

  foreignKeysMapEntitiesMap: EntitiesMap;
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
                this.foreignKeysMapEntitiesMap = foreignKeysMapEntitiesMap;
                if (this.foreignKeysMapEntitiesMap) {
                  this.foreignKeysEntitiesIdMap = this.configSchemaService.getEntitiesIdMap(this.foreignKeysMapEntitiesMap);
                }
                this.resetFormGroups();
                this.target = state.target;
                this.config = this.configSchemaService.getScheduleConfig();
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
  nextPage() {
    this.offset = this.offset + this.limit;
    this.loadSchedule(this.getQuery());
  }
  previousPage() {
    this.offset = this.offset - this.limit;
    this.loadSchedule(this.getQuery());
  }
  edit(item: any) {
    this.resetFormGroups();
    this.editing = true;
    const fbconfig: any = this.getFormConfig(item);
    const group: FormGroup = this.fb.group(fbconfig);
    this.formGroups[item.id] = group;
  }
  cancel(item: any) {
    this.editing = false;
    delete this.formGroups[item.id];
  }
  getQuery() {
    return {};
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
  getStartFromFormGroup(formGroup: FormGroup): moment.Moment {
    const base: moment.Moment = moment(formGroup.value.startDate);
    base.hour(formGroup.value.startHour);
    base.minute(formGroup.value.startMinute);
    return base;
  }

  getScheduleItemUpdateFromFormGroup(formGroup: FormGroup) {

    const start: moment.Moment = this.getStartFromFormGroup(formGroup);
    if ((moment()).diff(start) > 0) {
      throw new Error("The start date must be in the future.")
    }
    const scheduleItemUpdate: ScheduleItemUpdate = Object.assign(this.config.fields.map((field: any) => {
      if (typeof field.foreignKey !== 'undefined') {
        scheduleItemUpdate[field.name] = formGroup.value[field.name]
      }
    }), {
      start: start.utc().format(DATE_FORMAT),
      number: formGroup.value.number,
      pool: formGroup.value.pool,
    } as ScheduleItemUpdate);

    return scheduleItemUpdate;
  }
  delete(item: ScheduleItem) {
    if (window.confirm("Delete this schedule item?")) {
      this.backendApiService.deleteScheduleItem(this.target, item.id).toPromise().then(_ => {
        this.loadSchedule({});
      }).catch(err => {
        console.log(err);
      })
    }
  }

  save(item: ScheduleItem) {
    try {
      const scheduleItemUpdate: ScheduleItemUpdate = this.getScheduleItemUpdateFromFormGroup(this.formGroups[item.id]);
      this.backendApiService.updateScheduleItem(this.target, item.id, scheduleItemUpdate).toPromise().then((_) => {
        this.cancel(item);
        this.loadSchedule({});
      }).catch(err => {
        console.log(err);
      })
    } catch (err) {
      window.alert(err.message);
    }
  }
  saveNewScheduleItem() {
    try {
      const scheduleItemUpdate: ScheduleItemUpdate = this.getScheduleItemUpdateFromFormGroup(this.addScheduleItem);
      this.backendApiService.addScheduleItems(this.target, [scheduleItemUpdate]).toPromise().then((_) => {
        this.setAdding(false);
        this.loadSchedule({});
      }).catch(err => {
        console.log(err);
      })
    } catch (err) {
      window.alert(err.message);
    }
  }

  loadSchedule(queryObj: any) {
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

  setAdding(adding: boolean) {
    this.adding = adding;
    if (adding) {
      this.addScheduleItem = this.fb.group(this.getFormConfig({}));
      this.added = 0;
      this.addedThisSave = 0;
    } else {
      delete this.addScheduleItem;
      this.loadSchedule({});
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
  setLatestForeignKeyValueForAdd(formGroup: FormGroup, field: any) {
    this.foreignKeyValueForAdd[field.name] = formGroup.value[field.name];
  }
  loadCurrentScheduledItem() {
    this.configSchemaService.loadCurrentScheduledItem().then((current: any) => {
      console.log("CURRENT", current);
      this.current$.next(current);
      this.current = current;
      this.resetTimeFlags();
    })
  }


  ngOnDestroy() {
    clearInterval(this.currentScheduleLoader);
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
