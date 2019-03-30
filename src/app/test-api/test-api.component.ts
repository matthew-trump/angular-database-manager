import { Component, OnInit, OnDestroy } from '@angular/core';
import { BackendApiService } from '../backend-api.service';
import { AuthService } from '../auth.service';
import { catchError, tap, takeUntil } from 'rxjs/operators';
import { of, Subject } from 'rxjs';

@Component({
  selector: 'app-test-api',
  templateUrl: './test-api.component.html',
  styleUrls: ['./test-api.component.scss']
})
export class TestApiComponent implements OnInit, OnDestroy {

  output: any[] = []


  unsubscribe$: Subject<null> = new Subject();

  constructor(private backendApiService: BackendApiService, private authService: AuthService) { }

  ngOnInit() { }
  ping() {
    this.backendApiService.ping(this.authService.getCurrentTarget())
      .pipe(
        tap(res => {
          this.output.unshift({ text: res['message'], error: 0 })
          console.log(res)
        }),
        catchError(err => {
          this.output.unshift({ text: err.message, error: 1 })
          return of(null);
        }),
        takeUntil(this.unsubscribe$)
      )
      .subscribe(_ => { })

  }
  protected() {
    this.backendApiService.protected(this.authService.getCurrentTarget())
      .pipe(
        tap(res => {
          this.output.unshift({ text: res['message'], error: 0 })
          console.log(res)
        }),
        catchError(err => {
          this.output.unshift({ text: err.message, error: 1 })
          return of(null);
        }),
        takeUntil(this.unsubscribe$)
      )
      .subscribe(_ => { })
  }
  databasePing() {
    this.backendApiService.databasePing(this.authService.getCurrentTarget(), 'test')
      .pipe(
        tap(res => {
          this.output.unshift({ text: res['message'], error: 0 })
          console.log(res)
        }),
        catchError(err => {
          this.output.unshift({ text: err.message, error: 1 })
          return of(null);
        }),
        takeUntil(this.unsubscribe$)
      )
      .subscribe(_ => { })
  }
  databasePings() {
    this.backendApiService.databasePings(this.authService.getCurrentTarget())
      .pipe(
        tap(res => {
          this.output.unshift({ text: res['result'].length + " pings returned", error: 0 })
          console.log(res)
        }),
        catchError(err => {
          this.output.unshift({ text: err.message, error: 1 })
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
