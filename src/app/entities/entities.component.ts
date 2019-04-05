import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { tap, takeUntil, switchMap, filter } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { Subject, BehaviorSubject } from 'rxjs';
import { ConfigSchemaService } from '../config-schema.service';
import { BackendApiService } from '../backend-api.service';
import { EntitiesMap } from '../entities-map';
import { EntitiesIdMap } from '../entities-id-map';
import { environment } from 'src/environments/environment';

const DEFAULT_LIMIT: number = 50;
const TARGETS: any = environment.targets;
@Component({
  selector: 'app-entities',
  templateUrl: './entities.component.html',
  styleUrls: ['./entities.component.scss']
})
export class EntitiesComponent implements OnInit {

  FILTER_ALL: string = "--FILTER_ALL--";
  limit: number = DEFAULT_LIMIT;
  offset: number = 0;
  adding: boolean = false;
  addEntities: FormGroup[];
  added: number = 0;
  addedThisSave: number = 0;

  foreignKeyValueForAdd: any = {};

  entityConfig: any;
  target: string;

  result: any;

  entities$: BehaviorSubject<any[]> = new BehaviorSubject(null);
  foreignKeyEntityConfigMap: any = {};
  //foreignKeys: any[];
  foreignKeysEntitiesMap: EntitiesMap;
  foreignKeysEntitiesIdMap: EntitiesIdMap;

  loading: any = {};
  loadingList: boolean = false;
  formGroups: any = {};

  filter: any = {};
  search: any = {};
  searchString: string = null;

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
          this.target = state.target;
        }),
        switchMap((_: any) => {
          return this.route.params
        }),
        tap((params: any) => {
          if (params.id) {
            this.configSchemaService.loadEntityForeignKeys(params.id)
              .then((foreignKeysEntitiesMap: EntitiesMap) => {
                this.foreignKeysEntitiesMap = foreignKeysEntitiesMap;
                if (this.foreignKeysEntitiesMap) {
                  this.foreignKeysEntitiesIdMap = this.configSchemaService.getEntitiesIdMap(this.foreignKeysEntitiesMap);
                }


                this.entityConfig = this.configSchemaService.getEntityConfig(params.id);
                this.formGroups = {};
                this.addEntities = [];
                this.loading = {};
                this.added = 0;
                this.addedThisSave = 0;
                this.limit = (TARGETS[this.target].limits && TARGETS[this.target].limits[this.entityConfig.plural]) ? TARGETS[this.target].limits[this.entityConfig.plural] : DEFAULT_LIMIT;
                this.offset = 0;
                this.foreignKeyValueForAdd = {};
                this.entities$.next(null);
                this.loadEntries({});
              }).catch(err => {
                console.log(err);
              })
          }

        }),
        takeUntil(this.unsubscribe$)
      ).subscribe(_ => { })

  }

  loadEntries(queryObj: any) {
    const query = Object.assign({}, queryObj);
    query.offset = this.offset;
    query.limit = this.limit;
    this.loadingList = true;
    this.backendApiService.getEntities(this.target, this.entityConfig.plural, query)
      .toPromise().then((result: any) => {
        this.loadingList = false;
        this.result = result;
        this.entities$.next(this.result.entities);
      }).catch((err) => {
        this.loadingList = false;
        console.log(err);
      });
  }
  setLatestForeignKeyValueForAdd(formGroup: FormGroup, field: any) {
    this.foreignKeyValueForAdd[field.name] = formGroup.value[field.name];
  }

  getQuery() {
    return Object.assign({}, this.filter, this.search);
  }

  doFilter(field?: string, value?: any) {
    const query: any = (field && value !== this.FILTER_ALL) ? { [field]: value } : null;
    this.filter = query;
    this.offset = 0;
    this.loadEntries(this.getQuery())
  }
  doSearch() {

    const searchvalue: string = this.searchString ? this.searchString.trim() : this.searchString;
    this.search = searchvalue ? { search: searchvalue } : {};
    this.offset = 0;
    this.loadEntries(this.getQuery())
  }
  nextPage() {
    this.offset = this.offset + this.limit;
    this.loadEntries(this.getQuery());
  }
  previousPage() {
    this.offset = this.offset - this.limit;
    this.loadEntries(this.getQuery());
  }

  toggle(entity: any, field: string) {
    const value: boolean = !entity[field];
    this.backendApiService.updateEntity(
      this.target,
      this.entityConfig.plural,
      entity.id,
      { [field]: value ? 1 : 0 }
    ).toPromise().then((res: any) => {
      entity[field] = value;
    });
  }
  edit(entity: any) {
    const fbconfig: any = this.getFormConfig(entity);
    const group: FormGroup = this.fb.group(fbconfig);
    this.formGroups[entity.id] = group;
  }
  getFormConfig(entity: any) {
    const fbconfig: any = {};
    for (let i = 0, len = this.entityConfig.fields.length; i < len; i++) {
      const field: any = this.entityConfig.fields[i];
      fbconfig[field.name] = entity[field.name] ? [entity[field.name]] : [this.foreignKeyValueForAdd[field.name] ? this.foreignKeyValueForAdd[field.name] : ''];
      if (field.required) {
        fbconfig[field.name].push(Validators.required)
      }
    }
    if (this.entityConfig.enablement) {
      if (typeof fbconfig[this.entityConfig.enablement] === 'undefined') {
        fbconfig[this.entityConfig.enablement] = this.entityConfig.defaultEnabled;
      }
    }
    return fbconfig;
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
        this.result.entities[index] = Object.assign({}, { id: entity.id }, update);
        this.entities$.next(this.result.entities);
        delete this.formGroups[entity.id];
      })
      .catch(err => {
        console.log("ERROR NOT UPDATED", err);
        this.loading[entity.id] = false;
        delete this.formGroups[entity.id];
      });


  }
  showAdding(adding: boolean) {
    this.adding = adding;

    if (adding) {
      this.addAddEntity();
      this.added = 0;
      this.addedThisSave = 0;
    } else {
      this.clearAddEntities();
      this.loadEntries(this.getQuery());
    }
  }
  addAddEntity() {
    this.addEntities = this.addEntities || [];
    this.addEntities.push(this.fb.group(this.getFormConfig({})));
  }
  clearAddEntities() {
    this.addEntities = [];
  }
  removeAddEntity(index: number) {
    this.addEntities.splice(index, 1);
    if (this.addEntities.length === 0) {
      this.showAdding(false)
    }
  }
  addEntitiesValid() {
    return this.addEntities.filter((fg: any) => {
      return fg.valid;
    }).length === this.addEntities.length;
  }
  saveAddEntities() {
    this.addedThisSave = 0;
    this.backendApiService
      .addEntities(
        this.target,
        this.entityConfig.plural,
        this.addEntities.map((fg: FormGroup) => { return fg.value; })).toPromise()
      .then((result: any) => {
        console.log(result);
        this.addedThisSave = this.addEntities.length;
        this.addEntities = null;
        this.addAddEntity();
        this.added = this.added + this.addedThisSave;
      })
      .catch((err: any) => {
        console.log(err);
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
