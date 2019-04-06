import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';

import { SchemaResponse } from './schema-response';

import { Entity } from './entity';
import { EntitiesQuery } from './entities-query';
import { EntitiesResponse } from './entities-response';

import { EntityUpdate } from './entity-update';
import { EntityUpdateResponse } from './entity-update-response';
import { EntityInsertResponse } from './entity-insert-response';

import { ScheduleItemUpdate } from './schedule-item-update';
import { ScheduleItemUpdateResponse } from './schedule-item-update-response';
import { ScheduleItemDeleteResponse } from './schedule-item-delete-response';
import { ScheduleQuery } from './schedule-query';

import { TestApiResponse } from './test-api-response';
const DEFAULT_TARGET: any = environment.defaultTarget;
const TARGETS: any = environment.targets;
const TARGET_PARAM: string = "__target__";

@Injectable({
    providedIn: 'root'
})
export class BackendApiService {
    public target: string = localStorage.getItem('target') || DEFAULT_TARGET;
    constructor(public http: HttpClient) { }
    login(target: string, username: string, password: string): Observable<any> {
        const url: string = TARGETS[target].url;
        const apiPath: string = TARGETS[target].apiPath;
        return this.http.post<any>(url + apiPath + 'login', { username, password });
    }
    getSchema(target: string): Observable<SchemaResponse> {
        const url: string = TARGETS[target].url;
        const apiPath: string = TARGETS[target].apiPath;
        return this.http.get<SchemaResponse>(url + apiPath + 'config/schema');
    }
    setTarget(target: string) {
        this.target = target;
    }
    getBaseApiPath(): string {
        const url: string = TARGETS[this.target].url;
        const apiPath: string = TARGETS[this.target].apiPath;
        return url + apiPath;
    }
    getQueryString(query: EntitiesQuery | ScheduleQuery): string {
        const full = Object.assign({}, query, { [TARGET_PARAM]: this.target });
        const queryString = Object.keys(full).map(key => key + '=' + full[key]).join('&');
        return queryString;
    }

    getEntities(plural: string, query?: EntitiesQuery): Observable<EntitiesResponse> {
        const queryString: string = "?" + this.getQueryString(query);
        return this.http.get<EntitiesResponse>(this.getBaseApiPath() + 'entities/' + plural + queryString);
    }
    updateEntity(plural: string, id: number, update: EntityUpdate): Observable<EntityUpdateResponse> {
        return this.http.put<EntityUpdateResponse>(this.getBaseApiPath() + 'entities/' + plural + "/" + id, { update: update });
    }
    addEntities(plural: string, entities: Entity[]): Observable<EntityInsertResponse> {
        return this.http.post<EntityInsertResponse>(this.getBaseApiPath() + 'entities/' + plural, { entities: entities });
    }
    getSchedule(query?: ScheduleQuery): Observable<any> {
        const queryString: string = "?" + this.getQueryString(query);
        return this.http.get<any>(this.getBaseApiPath() + 'schedule' + queryString);
    }
    updateScheduleItem(id: number, update: ScheduleItemUpdate): Observable<ScheduleItemUpdateResponse> {
        return this.http.put<ScheduleItemUpdateResponse>(this.getBaseApiPath() + 'schedule/' + id, { update: update });
    }
    addScheduleItems(items: ScheduleItemUpdate[]): Observable<ScheduleItemUpdateResponse> {
        return this.http.post<ScheduleItemUpdateResponse>(this.getBaseApiPath() + 'schedule', { items: items });
    }
    deleteScheduleItem(id: number): Observable<ScheduleItemDeleteResponse> {
        return this.http.delete<ScheduleItemDeleteResponse>(this.getBaseApiPath() + 'schedule/' + id);
    }
    getCurrentScheduleItem(): Observable<any> {
        return this.http.get<any>(this.getBaseApiPath() + 'current');
    }
    getCurrentScheduleInstance(): Observable<any> {
        return this.http.get<any>(this.getBaseApiPath() + 'instance');
    }


    ping(): Observable<TestApiResponse> {
        return this.http.get<TestApiResponse>(this.getBaseApiPath() + 'ping');
    }
    protected(): Observable<TestApiResponse> {
        return this.http.get<TestApiResponse>(this.getBaseApiPath() + 'protected');
    }
    databasePing(value: string): Observable<TestApiResponse> {
        return this.http.post<TestApiResponse>(this.getBaseApiPath() + 'database/ping',
            { key: value });
    }
    databasePings(): Observable<TestApiResponse> {
        return this.http.get<TestApiResponse>(this.getBaseApiPath() + 'database/ping');
    }


}