import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable, BehaviorSubject, Subject, merge } from 'rxjs';
import { startWith, map, takeUntil } from 'rxjs/operators';
import { EntitiesMap } from 'src/app/entities-map';
import { EntityInputAutocomplete } from 'src/app/entity-input-autocomplete';

@Component({
  selector: 'entity-form-input-autocomplete',
  templateUrl: './entity-form-input-autocomplete.component.html',
  styleUrls: ['./entity-form-input-autocomplete.component.scss']
})
export class EntityFormInputAutocompleteComponent implements OnInit, OnDestroy {

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


  autocomplete: EntityInputAutocomplete[];

  foreignKeyEntities: any;
  foreignKeyEntities$: BehaviorSubject<any> = new BehaviorSubject('');
  filteredOptions: Observable<string[]>;
  optionNotFound: string;
  addingEntry: any;

  unsubscribe$: Subject<null> = new Subject();
  resetObservables$: Subject<null>;

  fieldConfig: any;
  current: string;
  original: string[];
  multiple: boolean;

  updated$: Observable<any>;
  addEntry$: Observable<any>;

  constructor() { }

  ngOnInit() {
    this.fieldConfig = this.entityConfig.fields.find(field => field.name === this.field);
    this.multiple = this.fieldConfig.multiple;
    this.original = this.getOriginal();
    console.log("ORIGINAL", this.original);
    this.autocomplete = this.original.map((value, index) => {
      return new EntityInputAutocomplete(this.fieldConfig, this.foreignKeysEntitiesMap, value, index)
    });
    this.resetMergeObservables();


    this.foreignKeysReloaded$
      .pipe(
        takeUntil(this.unsubscribe$)
      )
      .subscribe((result: any) => {
        if (result) {
          console.log("foreignKeysReloaded$", result);
          if (result && typeof result.index !== 'undefined') {
            this.autocomplete[result.index].updateFromResult(result);
          }
        }
      });


  }
  addAutocomplete() {
    console.log("ADD AUTOCOMPLETE");
    this.autocomplete.push(new EntityInputAutocomplete(this.fieldConfig, this.foreignKeysEntitiesMap, '', this.autocomplete.length));
    this.resetMergeObservables();
  }
  resetMergeObservables() {
    if (this.resetObservables$) {
      this.resetObservables$.next(),
        this.resetObservables$.complete();
    }
    this.resetObservables$ = new Subject();

    this.updated$ = merge(...this.autocomplete.map(autocomplete => autocomplete.update$));
    this.addEntry$ = merge(...this.autocomplete.map(autocomplete => autocomplete.addEntry$));

    this.updated$
      .pipe(
        takeUntil(this.unsubscribe$),
        takeUntil(this.resetObservables$)
      )
      .subscribe(update => {
        if (update && typeof update.value) {
          const index = update.index;
          const value = update.value.id;



          if (this.multiple) {
            const current = this.formGroup.value[this.field] ? this.formGroup.value[this.field] : [''];
            const currentValue = current[index];
            if (value !== currentValue) {
              console.log("UPDATE", index, currentValue, "->", value);
              current[index] = value;
              //if (this.formGroup.value[this.field] !== value.id) {
              this.formGroup.patchValue({ [this.field]: current });
              this.formGroup.markAsDirty();
              //}

            }
          } else {
            const current = this.formGroup.value[this.field]
            const currentValue = current;
            if (value !== currentValue) {
              console.log("UPDATE", currentValue, "->", value);
              this.formGroup.patchValue({ [this.field]: value });
              this.formGroup.markAsDirty();
            }
          }
        }
      });

    this.addEntry$
      .pipe(
        takeUntil(this.unsubscribe$),
        takeUntil(this.resetObservables$)
      )
      .subscribe(request => {
        console.log("ADD ENTRY REQUEST", request);
        this.addEntry.next(request);
      })
  }
  getOriginal() {
    if (this.entity) {
      const values: any = Array.isArray(this.entity[this.field]) ? this.entity[this.field] : [this.entity[this.field]];
      const entities = values.map(id => {
        return this.foreignKeysEntitiesMap[this.fieldConfig.foreignKey].find(entity => entity.id === id)
      });
      console.log("ENTITIES", entities);
      const ret = entities.map(entity => {
        return entity ? entity[this.fieldConfig.label] : '';
      })
      return ret;
    }
    return [''];
  }
  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

}
