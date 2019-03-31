import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { tap, takeUntil, switchMap, filter } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { Subject, of, BehaviorSubject } from 'rxjs';
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
  entities: any[];
  entities$: BehaviorSubject<any[]> = new BehaviorSubject(null);

  loading: any = {};
  formGroups: any = {};

  unsubscribe$: Subject<null> = new Subject();

  constructor(private route: ActivatedRoute,
    public fb: FormBuilder,
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
          this.formGroups = {};
          this.loading = {};
          this.entities$.next(null);
          if (this.entityConfig) {
            this.backendApiService.getEntities(this.target, this.entityConfig.plural)
              .toPromise().then((result: any) => {
                this.entities = result.result;
                this.entities$.next(this.entities);
              });
          }
        }),
        takeUntil(this.unsubscribe$)
      ).subscribe(_ => { })

  }
  edit(entity: any) {
    console.log("EDIT", entity);

    const group: FormGroup = this.fb.group({
      name: [entity.name]
    });
    this.formGroups[entity.id] = group;

  }
  save(entity: any, index: number) {
    const update: any = this.formGroups[entity.id].value;
    this.loading[entity.id] = true;
    this.backendApiService.updateEntity(
      this.target,
      this.entityConfig.plural,
      entity.id,
      update
    )
      .toPromise()
      .then((result: any) => {
        this.loading[entity.id] = false;
        this.entities[index] = Object.assign({}, { id: entity.id }, update);

        console.log(this.entities);
        this.entities$.next(this.entities);
        delete this.formGroups[entity.id];
      })
      .catch(err => {
        console.log("ERROR NOT UPDATED", err);
        this.loading[entity.id] = false;
        delete this.formGroups[entity.id];
      });


  }
  cancel(entity: any) {
    delete this.formGroups[entity.id];
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
