import { Component, Input, OnInit, OnDestroy, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable, BehaviorSubject, Subject } from 'rxjs';
import { startWith, map, takeUntil } from 'rxjs/operators';
@Component({
  selector: 'entity-literary-work-form',
  templateUrl: './entity-literary-work-form.component.html',
  styleUrls: ['./entity-literary-work-form.component.scss']
})
export class EntityLiteraryWorkFormComponent implements OnInit, OnDestroy {

  @Input() formGroup: FormGroup;
  @Input() enabled: boolean;
  @Input() work: any;
  @Input() entityConfig: any;
  @Input() authorsIdMap: any;
  @Input() adding: boolean;
  @Input() inProgress: boolean;

  @Output() done: EventEmitter<boolean> = new EventEmitter();
  @Output() addAuthor: EventEmitter<any> = new EventEmitter();

  @Input() foreignKeysReloaded$: Observable<any>;

  spinnerDiameter: number = 20;

  authorNotFound: string = null;
  addingAuthor: string = null;

  @Input() textCols: number = 15
  @Input() textRows: number = 3;

  filteredOptions: Observable<string[]>;

  author$: BehaviorSubject<string> = new BehaviorSubject('');
  author: any;

  unsubscribe$: Subject<null> = new Subject();

  @ViewChild('autoComplInput') autoComplInput: ElementRef;

  constructor() { }

  ngOnInit() {
    console.log("AUTHORS ID MAP", this.authorsIdMap);

    this.filteredOptions = this.author$
      .pipe(
        startWith(''),
        map(value => this._filter(value))
      );

    this.foreignKeysReloaded$
      .pipe(
        takeUntil(this.unsubscribe$)
      )
      .subscribe((result: any) => {
        if (result) {
          //console.log("foreignKeysReloaded$", result)
          if (result.status === 1) {
            if (result.plural === 'authors') {
              //console.log("NEW AUTHORS ID MAP", this.authorsIdMap);

              setTimeout(() => {
                console.log("NEW AUTHORS ID MAP 2", this.authorsIdMap);
                this.selectionChange(this.authorsIdMap.find(author => author.name === result.entity.name))
              });
              this.addingAuthor = null;
              this.authorNotFound = null;
            }
          } else if (result.status === 0) {
            if (result.plural === 'authors') {
              this.addingAuthor = null;
            }
          }
        }
      })

  }
  ngAfterViewInit() {
    if (this.work) {
      this.author = this.getAuthorById(this.work.author);
      console.log("ngAfterViewInit", this.author);
    }

  }

  getAuthorName(index: number) {
    if (this.work) {
      return this.getAuthorById(this.work.author).name
    }
    return '';
  }
  getAuthorById(id: number) {
    const author = this.authorsIdMap.find(author => author.id === id);
    if (!author) return { name: '' }
    return author;
  }

  displayFn(author?: any): string | undefined {
    return author ? author.name : undefined;
  }
  private _filter(name: string): any[] {
    const filterValue = name.toLowerCase();
    return this.authorsIdMap.filter(option => option.name.toLowerCase().indexOf(filterValue) === 0);
  }
  onChange(value: string) {
    this.authorNotFound = null;
    console.log("VALUE", value);
    this.author$.next(value);
  }
  selectionChange(author: any) {
    this.authorNotFound = null;



    this.author = author;
    if (author) {
      if (this.formGroup.value.author !== this.author.id) {
        this.formGroup.patchValue({ author: this.author.id });
        this.formGroup.markAsDirty();
      }
    }


    console.log("SELECTION CHANGE", author);
    console.log("CURRENT VALUE", this.formGroup.value.author);
    console.log("PRISTINE", this.formGroup.value, this.formGroup.pristine);
  }

  cancelAddNewAuthor() {
    if (this.addingAuthor) {
      return;
    }
    this.authorNotFound = null;

    this.autoComplInput.nativeElement.value = this.author ? this.author.name : '';


  }
  addNewAuthor() {
    this.addingAuthor = this.authorNotFound;
    this.addAuthor.next({ name: this.addingAuthor });
  }
  checkOptionAfterBlur(value: string) {
    console.log("BLUR", value);
    const found = this.authorsIdMap.find(author => author.name === value);
    console.log("FOUND", found);
    if (!found) {
      this.authorNotFound = value;
    }

  }
  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }


}
