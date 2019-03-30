import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subject, Observable, of } from 'rxjs';
import { tap, takeUntil, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-config-schema',
  templateUrl: './config-schema.component.html',
  styleUrls: ['./config-schema.component.scss']
})
export class ConfigSchemaComponent implements OnInit {

  schema$: Observable<any>;
  //unsubscribe$: Subject<null> = new Subject();

  constructor(
    public store: Store<any>
  ) { }
  ngOnInit() {

    this.schema$ = this.store.select("config")
      .pipe(
        tap((state: any) => {
          console.log("STATE SCHEMA", state);
        }),
        switchMap((state: any) => {
          return of(state.schema)
        })
      )
    /**  */
  }
  ngOnDestroy() {
    // this.unsubscribe$.next();
    //this.unsubscribe$.complete();
  }
}
