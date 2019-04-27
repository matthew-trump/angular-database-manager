import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-entity-display-enablement-toggle',
  templateUrl: './entity-display-enablement-toggle.component.html',
  styleUrls: ['./entity-display-enablement-toggle.component.scss']
})
export class EntityDisplayEnablementToggleComponent implements OnInit {
  @Input() entity: any;
  @Input() entityConfig: any;
  @Output() toggle: EventEmitter<null> = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

}
