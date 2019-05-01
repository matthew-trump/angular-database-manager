import { Component, OnInit, Input } from '@angular/core';
import { EntityInputAutocomplete } from '../entity-input-autocomplete';

@Component({
  selector: 'entity-form-input-autocomplete-index',
  templateUrl: './entity-form-input-autocomplete-index.component.html',
  styleUrls: ['./entity-form-input-autocomplete-index.component.scss']
})
export class EntityFormInputAutocompleteIndexComponent implements OnInit {

  @Input() autocomplete: EntityInputAutocomplete;

  constructor() { }

  ngOnInit() {
  }

}
