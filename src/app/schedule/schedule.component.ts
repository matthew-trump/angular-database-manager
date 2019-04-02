import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { tap, takeUntil, switchMap, filter, debounceTime } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { Subject, BehaviorSubject } from 'rxjs';
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

  limit: number = DEFAULT_LIMIT;
  offset: number = 0;
  loadingList: boolean = false;
  formGroups: any = {};

  zone: any;

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

  addScheduleItem: FormGroup;
  added: number = 0;
  addedThisSave: number = 0;

  hours: any[number];
  minutes: any[number];

  schedule: any = {}



  unsubscribe$: Subject<null> = new Subject();

  constructor(public fb: FormBuilder,
    public store: Store<any>,
    public configSchemaService: ConfigSchemaService,
    public backendApiService: BackendApiService) { }

  ngOnInit() {
    this.zone = (moment()).utcOffset();

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

    const fbconfig: any = this.getFormConfig(item);
    const group: FormGroup = this.fb.group(fbconfig);
    this.formGroups[item.id] = group;
  }
  cancel(item: any) {
    delete this.formGroups[item.id];
  }
  getQuery() {
    return {};
  }

  getScheduledItemFromFormGroup(formGroup: FormGroup) {
    const base = formGroup.value.startDate;
    base.hour(formGroup.value.startHour);
    base.minute(formGroup.value.startMinute);

    const startTime = base.utc().format(DATE_FORMAT);
    console.log("SAVING WITH START TIME", base, startTime);
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
  save(item: any) {
    const scheduledItem = this.getScheduledItemFromFormGroup(this.formGroups[item.id]);
    this.backendApiService.updateScheduleItem(this.target, item.id, scheduledItem).toPromise().then((_) => {
      console.log("UPDATED SCHEDULE ITEM", item.id, scheduledItem);
    }).catch(err => {
      console.log(err);
    })

  }
  saveNewScheduleItem() {
    const scheduledItem = this.getScheduledItemFromFormGroup(this.addScheduleItem);
    this.backendApiService.addScheduleItems(this.target, [scheduledItem]).toPromise().then((_) => {
      console.log("ADDED SCHEDULE ITEM", scheduledItem);
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
