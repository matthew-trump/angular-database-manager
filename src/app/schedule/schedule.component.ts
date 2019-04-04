import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { tap, takeUntil, filter } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { Subject, BehaviorSubject } from 'rxjs';
import { ConfigSchemaService } from '../config-schema.service';
import { BackendApiService } from '../backend-api.service';
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

  public DATE_FORMAT = DATE_FORMAT;

  now$: BehaviorSubject<any>;
  current$: BehaviorSubject<any> = new BehaviorSubject(null);
  current: any;
  limit: number = 6;//DEFAULT_LIMIT;
  offset: number = 0;

  loadingList: boolean = false;
  formGroups: any = {};

  zone: any;

  config: any;
  target: string;
  adding: boolean = false;
  editing: boolean = false;
  result: any;

  items$: BehaviorSubject<any[]> = new BehaviorSubject(null);


  foreignKeyEntities: any = {}
  foreignKeyEntitiesIdMap: any = {};
  foreignKeyValueForAdd: any = {};

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
            this.configSchemaService.loadForeignKeys()
              .then(result => {
                if (result && result[0]) {
                  this.foreignKeyEntities = result[0].entities;
                  this.foreignKeyEntitiesIdMap = result[0].idMap;

                  this.formGroups = {};
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

                }
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
  edit(item: any) {
    this.formGroups = {}; //allows editing only one at a time
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
  getScheduledItemFromFormGroup(formGroup: FormGroup) {
    const base = moment(formGroup.value.startDate);
    base.hour(formGroup.value.startHour);
    base.minute(formGroup.value.startMinute);

    if ((moment()).diff(base) > 0) {
      throw new Error("The start date must be in the future.")
    }

    const startTime = base.utc().format(DATE_FORMAT);
    const scheduledItem: any = {
      start: startTime,
      number: formGroup.value.number,
      pool: formGroup.value.pool,
    }
    this.config.fields.map((field: any) => {
      if (typeof field.foreignKey !== 'undefined') {
        scheduledItem[field.name] = formGroup.value[field.name]
      }
    });
    return scheduledItem;
  }
  delete(item: any) {
    if (window.confirm("delete this item?")) {
      this.backendApiService.deleteScheduleItem(this.target, item.id).toPromise().then(_ => {
        this.loadSchedule({});
      }).catch(err => {
        console.log(err);
      })
    }
  }

  save(item: any) {
    let scheduledItem: any;
    try {
      scheduledItem = this.getScheduledItemFromFormGroup(this.formGroups[item.id]);
    } catch (err) {
      window.alert(err.message);
      return;
    }

    this.backendApiService.updateScheduleItem(this.target, item.id, scheduledItem).toPromise().then((_) => {
      this.cancel(item);
      this.loadSchedule({});
    }).catch(err => {
      console.log(err);
    })

  }
  saveNewScheduleItem() {
    let scheduledItem: any;
    try {
      scheduledItem = this.getScheduledItemFromFormGroup(this.addScheduleItem);
    } catch (err) {
      window.alert(err.message);
      return;
    }
    this.backendApiService.addScheduleItems(this.target, [scheduledItem]).toPromise().then((_) => {
      this.setAdding(false);
      this.loadSchedule({});
    }).catch(err => {
      console.log(err);
    })
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
