import { Component, Input, OnInit } from '@angular/core';
import { Pagination } from '../pagination';

@Component({
  selector: 'app-pagination-pages',
  templateUrl: './pagination-pages.component.html',
  styleUrls: ['./pagination-pages.component.scss']
})
export class PaginationPagesComponent implements OnInit {

  @Input() pagination: Pagination;

  constructor() { }

  ngOnInit() {
  }

}
