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
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.scss']
})
export class ScheduleComponent implements OnInit {

  public DATE_FORMAT = DATE_FORMAT;

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

  constructor(public fb: FormBuilder,
    public store: Store<any>,
    public configSchemaService: ConfigSchemaService,
    public backendApiService: BackendApiService) { }

  ngOnInit() {
    this.now$ = new BehaviorSubject(moment());
    this.zone = (moment()).utcOffset();
    setInterval(() => {
      this.now$.next(moment());
      this.resetTimeFlags();
    }, 60000);

    this.hours = Array(24).fill(1).map((value, index) => {
      return index;
    });

    this.minutes = Array(60).fill(1).map((value, index) => {
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
            console.log("foreignKeyEntityConfigs", foreignKeyEntityConfigs);
            Promise.all(foreignKeyEntityConfigs.map((foreignKeyEntityConfig: any) => {
              return this.loadForeignKeyEntities(foreignKeyEntityConfig);
            })).then((_) => {

              this.foreignKeys = Object.keys(this.foreignKeyEntitiesIdMap);
              console.log("FOREIGN KEYS", this.foreignKeys);
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
    let foundCurrent = false;
    let now = moment();
    this.timeFlags = {};
    this.schedule.items.map((item: any) => {
      if (now.diff(item.start) < 0) {
        this.timeFlags[item.id] = -1;
      } else if (!foundCurrent) {
        this.timeFlags[item.id] = 0;
        foundCurrent = true;
      } else {
        this.timeFlags[item.id] = 1
      }
    });

  }
  getScheduledItemFromFormGroup(formGroup: FormGroup) {
    //console.log("GETTING SCHEDULED ITEM", formGroup.value);
    const base = moment(formGroup.value.startDate);
    base.hour(formGroup.value.startHour);
    base.minute(formGroup.value.startMinute);

    if ((moment()).diff(base) > 0) {
      throw new Error("The start date must be in the future.")
    }

    const startTime = base.utc().format(DATE_FORMAT);
    //console.log("SAVING WITH START TIME", base, startTime);
    const scheduledItem: any = {
      start: startTime,
      number: formGroup.value.number,
      pool: formGroup.value.pool,
    }
    this.scheduleConfig.selectors.map((selector: any) => {
      if (selector.type === 'foreignKey') {
        scheduledItem[selector.name] = formGroup.value[selector.name]
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

      console.log("UPDATED SCHEDULE ITEM", item.id, scheduledItem);
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
      console.log("ADDED SCHEDULE ITEM", scheduledItem);
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
          console.log("PARSED", item.start);
          this.scheduleConfig.selectors.map((selector: any) => {
            if (selector.type === 'foreignKey') {
              item[selector.name] = raw[selector.name];
            }
          });
          return item;
        }).sort((a: any, b: any) => {
          return b.start.diff(a.start);
        })
        this.schedule = {
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
    for (let i = 0, len = this.scheduleConfig.selectors.length; i < len; i++) {
      const selector: any = this.scheduleConfig.selectors[i];

      const time: any = item[this.scheduleConfig.start] ? item[this.scheduleConfig.start] : moment().add(this.scheduleConfig.defaultStartOffsetMinutes, 'minutes');
      console.log("MOMENT", time, time.hour(), time.minute());
      console.log("DEFAULT", selector.name, selector.default);

      fbconfig[selector.name] = typeof item[selector.name] !== 'undefined' ?
        [item[selector.name]]
        : typeof this.foreignKeyValueForAdd[selector.name] !== 'undefined' ?
          [this.foreignKeyValueForAdd[selector.name]] : typeof time !== 'undefined' ?
            selector.type === 'date' ? [time] :
              selector.type === 'hour' ? [time.hour()] :
                selector.type === 'minute' ? [time.minute()] :
                  [selector.default] : [''];



      if (selector.required) {
        fbconfig[selector.name].push(Validators.required)
      }
    }

    return fbconfig;
  }
  setLatestForeignKeyValueForAdd(formGroup: FormGroup, field: any) {
    this.foreignKeyValueForAdd[field.name] = formGroup.value[field.name];
  }



  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
