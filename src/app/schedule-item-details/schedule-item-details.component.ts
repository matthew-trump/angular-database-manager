import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ScheduleItem } from '../schedule-item';
import { ScheduleConfig } from '../schedule-config';
import { EntitiesIdMap } from '../entities-id-map';
@Component({
  selector: 'app-schedule-item-details',
  templateUrl: './schedule-item-details.component.html',
  styleUrls: ['./schedule-item-details.component.scss']
})
export class ScheduleItemDetailsComponent implements OnInit {

  @Input() scheduleItem$: Observable<ScheduleItem>;
  @Input() scheduleConfig: ScheduleConfig;
  @Input() foreignKeysEntitiesIdMap: EntitiesIdMap;
  @Input() dateFormat: string = 'M/DD/YYYY HH:mm';

  constructor() { }

  ngOnInit() {
  }

}
