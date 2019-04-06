import { Component, Input, OnInit } from '@angular/core';
import { Pagination } from '../pagination';

@Component({
  selector: 'app-pagination-controls',
  templateUrl: './pagination-controls.component.html',
  styleUrls: ['./pagination-controls.component.scss']
})
export class PaginationControlsComponent implements OnInit {

  @Input() pagination: Pagination;

  constructor() { }

  ngOnInit() {
  }

}
