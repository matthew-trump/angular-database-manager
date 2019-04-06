import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ScheduleConfig } from '../schedule-config';
import { EntitiesMap } from '../entities-map';
import { Observable } from 'rxjs';
import { BackendApiService } from '../backend-api.service';
import { ScheduleItem } from '../schedule-item';
import { ScheduleField } from '../schedule-field';
import { ScheduleItemUpdate } from '../schedule-item-update';
import * as moment from 'moment';

@Component({
  selector: 'app-schedule-item-form',
  templateUrl: './schedule-item-form.component.html',
  styleUrls: ['./schedule-item-form.component.scss']
})
export class ScheduleItemFormComponent implements OnInit {

  @Input() item?: ScheduleItem;
  @Input() dateFormat: string;
  @Input() now$: Observable<moment.Moment>;
  @Input() scheduleConfig: ScheduleConfig;
  @Input() foreignKeysEntitiesMap: EntitiesMap;
  @Input() formGroup: FormGroup;

  @Output() done: EventEmitter<boolean> = new EventEmitter();

  loading: boolean = false;

  utcOffset = (moment()).utcOffset();
  hours: any = Array(24).fill(1).map((_, i) => i);
  minutes: any = Array(60).fill(1).map((_, i) => i);

  constructor(public backendApiService: BackendApiService) { }

  ngOnInit() {
  }
  setLatestForeignKeyValueForAdd() {

  }

  saveNewScheduleItem() {
    try {
      const scheduleItemUpdate: ScheduleItemUpdate = this.getScheduleItemUpdate();
      this.backendApiService.addScheduleItems([scheduleItemUpdate]).toPromise().then((_) => {
        this.done.emit(true);
      }).catch(err => {
        console.log(err);
      })
    } catch (err) {
      window.alert(err.message);
    }
  }

  delete() {
    if (window.confirm("Delete this schedule item?")) {
      this.backendApiService.deleteScheduleItem(this.item.id).toPromise().then(_ => {
        this.done.emit(true);
      }).catch(err => {
        console.log(err);
      })
    }
  }

  save() {
    try {
      const scheduleItemUpdate: ScheduleItemUpdate = this.getScheduleItemUpdate();
      this.backendApiService.updateScheduleItem(this.item.id, scheduleItemUpdate).toPromise().then((_) => {
        this.done.emit(true)
      }).catch(err => {
        console.log(err);
      })
    } catch (err) {
      window.alert(err.message);
    }
  }

  getScheduleItemUpdate(): ScheduleItemUpdate {

    const start: moment.Moment = this.getStart();
    if ((moment()).diff(start) > 0) {
      throw new Error("The start date must be in the future.")
    }
    const scheduleItemUpdate: ScheduleItemUpdate = Object.assign({}, this.scheduleConfig.fields.reduce((obj: ScheduleItemUpdate, field: ScheduleField) => {
      if (typeof field.foreignKey !== 'undefined') {
        obj[field.name] = this.formGroup.value[field.name]
      }
      return obj;
    }, {} as ScheduleItemUpdate), {
      start: start.utc().format(this.dateFormat),
      number: this.formGroup.value.number,
      pool: this.formGroup.value.pool,
    } as ScheduleItemUpdate);

    return scheduleItemUpdate;
  }

  getStart(): moment.Moment {
    const base: moment.Moment = moment(this.formGroup.value.startDate);
    base.hour(this.formGroup.value.startHour);
    base.minute(this.formGroup.value.startMinute);
    return base;
  }
}
