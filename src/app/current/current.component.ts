import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { tap, takeUntil } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { Subject, BehaviorSubject } from 'rxjs';
import { ConfigSchemaService } from '../config-schema.service';
import { BackendApiService } from '../backend-api.service';
import { environment } from 'src/environments/environment';
import * as moment from 'moment';

const DEFAULT_LIMIT: number = 50;
const DATE_FORMAT: string = "YYYY-MM-DD HH:mm:ss";
const CURRENT_SCHEDULER_LOADER_INTERVAL: number = environment.currentSchedulerLoaderInterval;

@Component({
  selector: 'app-current',
  templateUrl: './current.component.html',
  styleUrls: ['./current.component.scss']
})
export class CurrentComponent implements OnInit, OnDestroy {

  public DATE_FORMAT = DATE_FORMAT;

  current$: BehaviorSubject<any> = new BehaviorSubject(null)
  now$: BehaviorSubject<any>;
  limit: number = DEFAULT_LIMIT;
  offset: number = 0;
  loadingList: boolean = false;
  formGroups: any = {};

  zone: any;

  config: any;
  target: string;
  adding: boolean = false;
  editing: boolean = false;
  result: any;

  foreignKeyEntities: any = {}
  foreignKeyEntitiesIdMap: any = {};
  foreignKeyValueForAdd: any = {};

  loading: any = {};

  addScheduleItem: FormGroup;
  added: number = 0;
  addedThisSave: number = 0;

  schedule: any = {}
  timeFlags: any = {}

  unsubscribe$: Subject<null> = new Subject();
  currentScheduleLoader: any;

  constructor(public store: Store<any>,
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
                  this.now$ = new BehaviorSubject(moment());
                  this.zone = (moment()).utcOffset();
                  this.formGroups = {};
                  this.config = this.configSchemaService.getScheduleConfig();
                  this.target = state.target;
                  this.foreignKeyEntities = result[0].entities;
                  this.foreignKeyEntitiesIdMap = result[0].idMap;
                  this.loadCurrentScheduledItem();
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

  loadCurrentScheduledItem() {
    this.configSchemaService.loadCurrentScheduledItem().then((current: any) => {
      this.current$.next(current);
    })
  }
  loadCurrentScheduleInstance(){
    this.backendApiService.getCurrentScheduleInstance(this.target).toPromise().then((instance)=>{
      console.log(instance);
    })
  }
  ngOnDestroy() {
    clearInterval(this.currentScheduleLoader);
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
