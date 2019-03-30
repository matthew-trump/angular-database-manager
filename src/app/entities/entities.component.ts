import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { tap, takeUntil, switchMap, filter } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { Subject, of } from 'rxjs';
import { ConfigSchemaService } from '../config-schema.service';
import { BackendApiService } from '../backend-api.service';
@Component({
  selector: 'app-entities',
  templateUrl: './entities.component.html',
  styleUrls: ['./entities.component.scss']
})
export class EntitiesComponent implements OnInit {
  entityConfig: any;
  target: string;
  unsubscribe$: Subject<null> = new Subject();

  constructor(private route: ActivatedRoute,
    public store: Store<any>,
    public configSchemaService: ConfigSchemaService,
    public backendApiService: BackendApiService,
  ) { }

  ngOnInit() {
    this.store
      .select("config")
      .pipe(
        filter((state: any) => {
          return state.target !== null;
        }),
        tap((state: any) => {
          //console.log("TARGET", state.target);
          this.target = state.target;
        }),
        switchMap((_: any) => {
          return this.route.params
        }),
        tap((params: any) => {
          this.entityConfig = this.configSchemaService.getEntityConfig(params.id);
          if (this.entityConfig) {
            this.backendApiService.getEntities(this.target, this.entityConfig.plural)
              .toPromise().then((entities: any) => {
                console.log("ENTITIES", this.entityConfig.plural, entities);
              });
          }
        }),
        takeUntil(this.unsubscribe$)
      ).subscribe(_ => { })

  }
  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
