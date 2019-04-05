import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ScheduleInstance } from '../schedule-instance';
import { EntityConfig } from '../entity-config';

@Component({
  selector: 'app-instance-display-basic',
  templateUrl: './instance-display-basic.component.html',
  styleUrls: ['./instance-display-basic.component.scss']
})
export class InstanceDisplayBasicComponent implements OnInit {

  @Input() scheduleInstance$: Observable<ScheduleInstance>;
  @Input() entityConfig: EntityConfig;

  constructor() { }

  ngOnInit() { }

}
