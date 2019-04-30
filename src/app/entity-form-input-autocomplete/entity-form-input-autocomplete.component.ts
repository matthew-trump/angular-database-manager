import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable, BehaviorSubject, Subject } from 'rxjs';
import { startWith, map, takeUntil } from 'rxjs/operators';
import { EntitiesMap } from 'src/app/entities-map';

@Component({
  selector: 'entity-form-input-autocomplete',
  templateUrl: './entity-form-input-autocomplete.component.html',
  styleUrls: ['./entity-form-input-autocomplete.component.scss']
})
export class EntityFormInputAutocompleteComponent implements OnInit {

  @Input() field: string;
  @Input() formGroup: FormGroup;
  @Input() enabled: boolean;
  @Input() entity: any;
  @Input() entityConfig: any;
  @Input() foreignKeysEntitiesMap: EntitiesMap;
  @Input() adding: boolean;
  @Input() inProgress: boolean;


  @Output() done: EventEmitter<boolean> = new EventEmitter();
  @Output() addEntry: EventEmitter<any> = new EventEmitter();

  @Input() foreignKeysReloaded$: Observable<any>;

  /** 
  foreignKeyEntities: Map<string, any> = new Map();
  foreignKeyEntities$: Map<string, Observable<string[]>> = new Map();
  filteredOptions: Map<string, Observable<string[]>> = new Map();
  optionNotFound: Map<string, string> = new Map();
  addingEntry: Map<string, any> = new Map();
*/

  foreignKeyEntities: any;
  foreignKeyEntities$: BehaviorSubject<any> = new BehaviorSubject('');
  filteredOptions: Observable<string[]>;
  optionNotFound: string;
  addingEntry: any;

  unsubscribe$: Subject<null> = new Subject();

  fieldConfig: any;
  current: string;
  original: string;



  constructor() { }

  ngOnInit() {
    this.fieldConfig = this.entityConfig.fields.find(field => field.name === this.field);
    this.original = this.getForeignKeyValue();
    this.current = this.original;
    const _filter = this.getFilterFunction();

    this.filteredOptions = this.foreignKeyEntities$
      .pipe(
        startWith(''),
        map(value => _filter(value))
      );

    this.foreignKeysReloaded$
      .pipe(
        takeUntil(this.unsubscribe$)
      )
      .subscribe((result: any) => {
        if (result) {
          if (result.status === 1) {
            this.selectionChange(result.entity);
            this.addingEntry = null;
            this.optionNotFound = null;
          } else if (result.status === 0) {
            this.addingEntry = null;
          }
        }
      })
  }
  getForeignKeyValue(index?: number) {
    if (this.entity) {
      const entity = this.getForeignKeyEntity(this.entity[this.field]);
      const ret = entity ? entity[this.fieldConfig.label] : '';
      return ret;
    }
    return '';
  }

  getForeignKeyEntity(id: number) {
    return this.foreignKeysEntitiesMap[this.fieldConfig.foreignKey].find(entity => entity.id === id);
  }
  getOptionValue(option: any): string {
    return option[this.fieldConfig.label];
  }
  getDisplayWith(): Function {
    const fieldConfig = this.fieldConfig;
    return (value?: any): string | undefined => {
      return value ? value[fieldConfig.label] : undefined;
    }
  }
  onChange(value: string) {
    this.current = value;
    this.optionNotFound = null;
    this.foreignKeyEntities$.next(value);
  }
  private getFilterFunction(): Function {
    return (value: string): any[] => {
      const filterValue = value.toLowerCase();
      return this.foreignKeysEntitiesMap[this.fieldConfig.foreignKey]
        .filter(option => {
          return option[this.fieldConfig.label].toLowerCase().indexOf(filterValue) !== -1
        });
    }
  }
  selectionChange(value: any) {
    this.optionNotFound = null;
    if (value) {
      if (this.formGroup.value[this.field] !== value.id) {
        this.formGroup.patchValue({ [this.field]: value.id });
        this.formGroup.markAsDirty();
      }
    }
  }
  checkOptionAfterBlur(value: string) {
    const found = this.foreignKeysEntitiesMap[this.fieldConfig.foreignKey].find(item => item[this.fieldConfig.label] === value);
    if (!found) {
      this.optionNotFound = value;
    }
  }
  cancelAddNew() {
    if (this.addingEntry) {
      return;
    }
    this.optionNotFound = null;
    this.current = this.original;
  }
  addNewEntry() {
    this.addingEntry = this.optionNotFound;
    this.addEntry.next({
      plural: this.fieldConfig.foreignKey,
      entity: { [this.fieldConfig.label]: this.addingEntry }
    });
  }

}
