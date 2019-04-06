import { Component, OnInit, OnDestroy } from '@angular/core';
import { tap, takeUntil } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { Subject, BehaviorSubject } from 'rxjs';
import { ConfigSchemaService } from '../config-schema.service';
import { BackendApiService } from '../backend-api.service';
import { EntitiesMap } from '../entities-map';
import { EntitiesIdMap } from '../entities-id-map';
import { environment } from 'src/environments/environment';

const DATE_FORMAT: string = "YYYY-MM-DD HH:mm:ss";
const CURRENT_SCHEDULER_LOADER_INTERVAL: number = environment.currentSchedulerLoaderInterval;

@Component({
  selector: 'app-current',
  templateUrl: './current.component.html',
  styleUrls: ['./current.component.scss']
})
export class CurrentComponent implements OnInit, OnDestroy {

  public DATE_FORMAT = DATE_FORMAT;

  scheduleItem$: BehaviorSubject<any> = new BehaviorSubject(null);
  scheduleInstance$: BehaviorSubject<any> = new BehaviorSubject(null);
  unsubscribe$: Subject<null> = new Subject();

  config: any;
  target: string;
  foreignKeysEntitiesIdMap: EntitiesIdMap;

  currentScheduleLoader: number;

  constructor(public store: Store<any>,
    public configSchemaService: ConfigSchemaService,
    public backendApiService: BackendApiService) { }

  ngOnInit() {
    this.store
      .select("config")
      .pipe(
        tap((state: any) => {
          if (state.target !== null) {
            this.configSchemaService.loadScheduleForeignKeys()
              .then((foreignKeysEntitiesMap: EntitiesMap) => {
                if (foreignKeysEntitiesMap) {
                  this.foreignKeysEntitiesIdMap = this.configSchemaService.getEntitiesIdMap(foreignKeysEntitiesMap);
                  this.target = state.target;
                  this.config = this.configSchemaService.getScheduleConfig();
                  this.loadCurrentScheduledItem();
                  this.currentScheduleLoader = <any>setInterval(() => {
                    this.loadCurrentScheduledItem();
                  }, CURRENT_SCHEDULER_LOADER_INTERVAL);
                  this.loadCurrentScheduleInstance();
                }
              })
          }
        }),
        takeUntil(this.unsubscribe$)
      ).subscribe(_ => { })
  }


  loadCurrentScheduledItem() {
    this.configSchemaService.loadCurrentScheduledItem().then((current: any) => {
      this.scheduleItem$.next(current);
    })
  }
  loadCurrentScheduleInstance() {
    this.backendApiService.getCurrentScheduleInstance().toPromise().then((instance) => {
      this.scheduleInstance$.next(instance);
    })
  }
  ngOnDestroy() {
    clearInterval(this.currentScheduleLoader);
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
