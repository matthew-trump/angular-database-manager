import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { ActivatedRoute } from '@angular/router';
import { tap, takeUntil, switchMap, filter } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { Subject, BehaviorSubject } from 'rxjs';
import { ConfigSchemaService } from '../config-schema.service';
import { BackendApiService } from '../backend-api.service';
import { EntitiesMap } from '../entities-map';
import { EntityUpdate } from '../entity-update';
import { EntitiesIdMap } from '../entities-id-map';
import { Pagination } from '../pagination';
import { PaginationQuery } from '../pagination-query';
import { environment } from 'src/environments/environment';
import { EntitiesQuery } from '../entities-query';

const DEFAULT_LIMIT: number = 50;
const TARGETS: any = environment.targets;
enum ENTITY_TYPES {
  BASIC = "basic",
  QUESTION = "question",
  LITERARY_WORK = "literary-work",
  LITERARY_QUOTE = "literary-quote"
}
@Component({
  selector: 'app-entities',
  templateUrl: './entities.component.html',
  styleUrls: ['./entities.component.scss'],
  animations: [
    trigger('edittrigger', [
      transition(':enter', [
        style({ height: '0px', opacity: 0 }),
        animate('200ms', style({ height: '*', opacity: 1 })),
      ])
    ]),
  ]
})
export class EntitiesComponent implements OnInit {
  public ENTITY_TYPES = ENTITY_TYPES;

  FILTER_ALL: string = "--FILTER_ALL--";

  id: string;
  targetConfig: any;

  adding: boolean = false;
  addEntities: FormGroup[];
  added: number = 0;
  addedThisSave: number = 0;

  foreignKeyValueForAdd: any = {};

  entityConfig: any;

  result: any;

  pagination: Pagination = new Pagination({
    limit: DEFAULT_LIMIT,
    offset: 0
  })


  filters: any = {}

  entities$: BehaviorSubject<any[]> = new BehaviorSubject(null);
  foreignKeyEntityConfigMap: any = {};
  foreignKeysEntitiesMap: EntitiesMap;
  foreignKeysEntitiesIdMap: EntitiesIdMap;
  foreignKeysReloaded$: Subject<any> = new Subject();

  loading: any = {};
  loadingList: boolean = false;
  editEntity: any = {};

  filter: any = {};
  search: any = {};
  searchString: string = null;

  updating: any = {};

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
          if (state) {
            this.targetConfig = TARGETS[state.target];
          }
          return state.target !== null;
        }),
        switchMap((_: any) => {
          return this.route.params

        }),
        tap((params: any) => {
          if (params.id) {
            this.id = params.id;
            this.loadForeignKeys().then(_ => {
              this.loadEntity(this.id);
            });
          }
        }),
        takeUntil(this.unsubscribe$)
      ).subscribe(_ => { })

    this.pagination.params$
      .pipe(
        tap((params: PaginationQuery) => {
          if (params) {
            this.loadEntries(this.getQuery());
          }
        }),
        takeUntil(this.unsubscribe$)
      ).subscribe(_ => { });
  }
  loadForeignKeys() {
    return this.configSchemaService.loadEntityForeignKeys(this.id)
      .then((foreignKeysEntitiesMap: EntitiesMap) => {
        this.foreignKeysEntitiesMap = foreignKeysEntitiesMap;
        if (this.foreignKeysEntitiesMap) {
          this.foreignKeysEntitiesIdMap = this.configSchemaService.getEntitiesIdMap(this.foreignKeysEntitiesMap);
        }
      }).catch(err => {
        console.log(err);
      })
  }

  loadEntity(id: string) {
    this.entityConfig = this.configSchemaService.getEntityConfig(id);

    const paginationLimit: number = (this.targetConfig.limits && this.targetConfig.limits[this.entityConfig.plural]) ?
      this.targetConfig.limits[this.entityConfig.plural] : DEFAULT_LIMIT;

    this.pagination.params.limit = paginationLimit;

    this.editEntity = {};
    this.addEntities = [];
    this.loading = {};
    this.added = 0;
    this.addedThisSave = 0;
    this.foreignKeyValueForAdd = {};
    this.entities$.next(null);
    this.showAdding(false)
    this.loadEntries(this.getQuery());
  }
  loadEntries(query: EntitiesQuery) {
    this.loadingList = true;
    this.backendApiService.getEntities(this.entityConfig.plural, query)
      .toPromise().then((result: any) => {
        this.loadingList = false;
        this.result = result;

        this.pagination.update({
          offset: result.query.offset,
          limit: result.query.limit
        });
        this.pagination.setTotal(result.total);
        this.pagination.setShowing(result.returned)
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
    const queryObj = Object.assign({}, this.pagination.query, this.filter, this.search);
    console.log(queryObj);
    return queryObj;
  }

  doFilter(field?: string, value?: any) {
    if (field && value !== this.FILTER_ALL) {
      this.filter = Object.assign({}, this.filter, { [field]: value });
    } else {
      delete this.filter[field];
    }
    this.pagination.reset();
    this.loadEntries(this.getQuery())
  }
  doSearch() {
    const searchvalue: string = this.searchString ? this.searchString.trim() : this.searchString;
    this.search = searchvalue ? { search: searchvalue } : {};
    this.pagination.reset();
    this.loadEntries(this.getQuery())
  }
  doEnablementFilter(checked: boolean) {
    if (!checked) {
      delete this.filter[this.entityConfig.enablement];
    } else {
      this.filter[this.entityConfig.enablement] = 1;
    }
    this.pagination.reset();
    this.loadEntries(this.getQuery());
  }

  toggle(entity: any, field: string) {
    const value: boolean = !entity[field];
    this.backendApiService.updateEntity(
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
    this.editEntity[entity.id] = group;
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

  showAdding(adding: boolean) {
    this.adding = adding;
    if (adding) {
      this.editEntity = [];
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
  addEntityDone(index: number, save: boolean) {
    if (!save) {
      this.removeAddEntity(index);
    } else {
      this.saveAddEntities([this.addEntities[index]], index);
    }
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
  saveAllEntities() {
    this.saveAddEntities(this.addEntities, 0)
  }
  saveAddEntities(entitiesToAdd, clearIndex) {
    this.addedThisSave = 0;
    this.backendApiService
      .addEntities(
        this.entityConfig.plural,
        entitiesToAdd.map((fg: FormGroup) => { return fg.value; })).toPromise()
      .then((result: any) => {
        this.addedThisSave = entitiesToAdd.length;
        if (clearIndex) {
          this.removeAddEntity(clearIndex);
          if (this.addEntities.length === 0) {
            this.addAddEntity();
          }
        } else {
          this.addEntities = null;
          this.addAddEntity();
        }
        this.added = this.added + this.addedThisSave;
      })
      .catch((err: any) => {
        console.log(err);
      });
  }
  addForeignKey(request: any) {
    const plural = request.plural;
    const entity = Object.assign({}, request.entity);
    this.backendApiService
      .addEntities(plural, [entity]).toPromise()
      .then((result: any) => {
        if (result.result) {

          entity.id = result.result[0];
        }
        this.loadForeignKeys().then(_ => {
          this.foreignKeysReloaded$.next({
            status: 1,
            plural: plural,
            entity: entity
          });
        }).catch((err: any) => {
          console.log(err);
          this.foreignKeysReloaded$.next({
            status: 1,
            plural: plural,
            entity: entity
          });
        });
      })
      .catch((err: any) => {
        console.log(err);
        this.foreignKeysReloaded$.next({
          status: 0,
          plural: plural,
          entity: entity
        });
      });
  }


  closeEditForm(id: number, save: boolean) {
    if (!save) {
      delete this.editEntity[id];
    } else {
      const entityUpdate: EntityUpdate = this.editEntity[id].value;
      this.updating[id] = true;
      this.backendApiService.updateEntity(this.entityConfig.plural, id, entityUpdate).toPromise().then((_) => {
        delete this.editEntity[id];
        delete this.updating[id];
        this.loadEntries(this.getQuery())
      }).catch(err => {
        delete this.updating[id];
        delete this.editEntity[id];
        console.log(err);
      })
    }


  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
