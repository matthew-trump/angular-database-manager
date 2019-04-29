import { Component, Input, OnInit, OnDestroy, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable, BehaviorSubject, Subject } from 'rxjs';
import { startWith, map, takeUntil } from 'rxjs/operators';
import { EntitiesMap } from 'src/app/entities-map';

@Component({
  selector: 'entity-literary-quote-form',
  templateUrl: './entity-literary-quote-form.component.html',
  styleUrls: ['./entity-literary-quote-form.component.scss']
})
export class EntityLiteraryQuoteFormComponent implements OnInit {


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

  @Input() textCols: number = 15
  @Input() textRows: number = 3;

  foreignKeyEntities: Map<string, any> = new Map();
  foreignKeyEntities$: Map<string, Observable<string[]>> = new Map();
  filteredOptions: Map<string, Observable<string[]>> = new Map();
  optionNotFound: Map<string, string> = new Map();
  addingEntry: Map<string, any> = new Map();

  unsubscribe$: Subject<null> = new Subject();

  @ViewChild('autoComplInputWork') autoComplInputWork: ElementRef;

  constructor() { }

  ngOnInit() {

    this.entityConfig.fields.filter(field => field.foreignKey)
      .map(field => {
        this.foreignKeyEntities$[field.name] = new BehaviorSubject('');

        const _filter = this.getFilterFunction(field);

        this.filteredOptions[field.name] = this.foreignKeyEntities$[field.name]
          .pipe(
            startWith(''),
            map(value => _filter(value))
          );
      });

    this.foreignKeysReloaded$
      .pipe(
        takeUntil(this.unsubscribe$)
      )
      .subscribe((result: any) => {
        if (result) {
          const plural = result.plural;
          const fieldConfig: any = this.entityConfig.fields.find(field => field.foreignKey === plural);
          if (result.status === 1) {
            this.selectionChange(fieldConfig.name, result.entity);
            this.addingEntry[fieldConfig.name] = null;
            this.optionNotFound[fieldConfig.name] = null;
          } else if (result.status === 0) {
            this.addingEntry[fieldConfig.name] = null;
          }
        }
      })

  }
  getForeignKeyValue(field: string, index?: number) {
    if (this.entity) {
      const fieldConfig = this.getForeignKeyFieldConfig(field);
      const entity = this.getForeignKeyEntity(fieldConfig, this.entity[field]);
      return entity ? entity[fieldConfig.label] : '';
    }
    return '';
  }
  getForeignKeyFieldConfig(fieldName: string) {
    return this.entityConfig.fields.find(field => field.name === fieldName);
  }
  getForeignKeyEntity(fieldConfig: any, id: number) {
    return this.foreignKeysEntitiesMap[fieldConfig.foreignKey].find(entity => entity.id === id);
  }

  getDisplayWith(fieldName: string): Function {
    const fieldConfig = this.getForeignKeyFieldConfig(fieldName);
    return (value?: any): string | undefined => {
      return value ? value[fieldConfig.label] : undefined;
    }
  }
  onChange(fieldName: string, value: string) {
    this.optionNotFound[fieldName] = null;
    this.foreignKeyEntities$[fieldName].next(value);
  }
  private getFilterFunction(field: any): Function {
    return (value: string): any[] => {
      const filterValue = value.toLowerCase();
      return this.foreignKeysEntitiesMap[field.foreignKey]
        .filter(option => option[field.label].toLowerCase().indexOf(filterValue) === 0);
    }
  }
  selectionChange(fieldName: string, value: any) {
    this.optionNotFound[fieldName] = null;
    if (value) {
      if (this.formGroup.value[fieldName] !== value.id) {
        this.formGroup.patchValue({ [fieldName]: value.id });
        this.formGroup.markAsDirty();
      }
    }
  }
  checkOptionAfterBlur(fieldName: string, value: string) {
    const fieldConfig = this.getForeignKeyFieldConfig(fieldName);
    const found = this.foreignKeysEntitiesMap[fieldConfig.foreignKey].find(item => item[fieldConfig.label] === value);
    if (!found) {
      this.optionNotFound[fieldName] = value;
    }
  }
  cancelAddNew(fieldName: string) {
    if (this.addingEntry[fieldName]) {
      return;
    }
    this.optionNotFound[fieldName] = null;
    this.autoComplInputWork.nativeElement.value = this.getForeignKeyValue(fieldName);
  }
  addNewEntry(fieldName: string) {
    const fieldConfig = this.getForeignKeyFieldConfig(fieldName);
    this.addingEntry[fieldName] = this.optionNotFound[fieldName];
    this.addEntry.next({
      plural: fieldConfig.foreignKey,
      entity: { [fieldConfig.label]: this.addingEntry[fieldName] }
    });
  }
  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }


}
