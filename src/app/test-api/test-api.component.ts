import { Component, OnInit, OnDestroy } from '@angular/core';
import { BackendApiService } from '../backend-api.service';
import { catchError, tap, takeUntil } from 'rxjs/operators';
import { of, Subject } from 'rxjs';

@Component({
  selector: 'app-test-api',
  templateUrl: './test-api.component.html',
  styleUrls: ['./test-api.component.scss']
})
export class TestApiComponent implements OnInit, OnDestroy {

  output: any = {}

  unsubscribe$: Subject<null> = new Subject();

  constructor(private backendApiService: BackendApiService) { }

  ngOnInit() { }
  ping() {
    this.backendApiService.ping()
      .pipe(
        tap(res => console.log(res)),
        catchError(err => {
          return of(null);
        }),
        takeUntil(this.unsubscribe$)
      )
      .subscribe(_ => { })

  }
  protected() {
    this.backendApiService.protected()
      .pipe(
        tap(res => console.log(res)),
        catchError(err => {
          return of(null);
        }),
        takeUntil(this.unsubscribe$)
      )
      .subscribe(_ => { })
  }
  databasePing() {
    this.backendApiService.databasePing('test')
      .pipe(
        tap(res => console.log(res)),
        catchError(err => {
          return of(null);
        }),
        takeUntil(this.unsubscribe$)
      )
      .subscribe(_ => { })
  }
  databasePings() {
    this.backendApiService.databasePings()
      .pipe(
        tap(res => console.log(res)),
        catchError(err => {
          return of(null);
        }),
        takeUntil(this.unsubscribe$)
      )
      .subscribe(_ => { })
  }
  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

}
