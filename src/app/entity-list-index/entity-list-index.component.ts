import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-entity-list-index',
  templateUrl: './entity-list-index.component.html',
  styleUrls: ['./entity-list-index.component.scss']
})
export class EntityListIndexComponent implements OnInit {

  @Input() index: number
  constructor() { }

  ngOnInit() {
  }

}
