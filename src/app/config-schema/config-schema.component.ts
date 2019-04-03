import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { tap, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-config-schema',
  templateUrl: './config-schema.component.html',
  styleUrls: ['./config-schema.component.scss']
})
export class ConfigSchemaComponent implements OnInit {

  schema$: Observable<any>;

  constructor(
    public store: Store<any>
  ) { }
  ngOnInit() {

    this.schema$ = this.store.select("config")
      .pipe(
        tap((state: any) => { }),
        switchMap((state: any) => {
          return of(state.schema)
        })
      )
  }
  ngOnDestroy() { }
}
