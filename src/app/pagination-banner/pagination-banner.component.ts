import { Component, Input, OnInit } from '@angular/core';
import { Pagination } from '../pagination';

@Component({
  selector: 'app-pagination-banner',
  templateUrl: './pagination-banner.component.html',
  styleUrls: ['./pagination-banner.component.scss']
})
export class PaginationBannerComponent implements OnInit {

  @Input() pagination: Pagination;
  @Input() search: string;
  constructor() { }

  ngOnInit() { }

}
