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
const TARGETS: any = environment.targets;
const TARGET_PARAM: string = "__target__";

@Injectable({
    providedIn: 'root'
})
export class BackendApiService {
    constructor(public http: HttpClient) { }
    getBaseApiPath(target: string): string {
        const url: string = TARGETS[target].url;
        const apiPath: string = TARGETS[target].apiPath;
        return url + apiPath;
    }
    getQueryString(target: string, query: EntitiesQuery | ScheduleQuery): string {
        const full = Object.assign({}, query, { [TARGET_PARAM]: target });
        const queryString = Object.keys(full).map(key => key + '=' + full[key]).join('&');
        return queryString;
    }
    login(target: string, username: string, password: string): Observable<any> {
        return this.http.post<any>(this.getBaseApiPath(target) + 'login', { username, password });
    }
    getSchema(target: string): Observable<SchemaResponse> {
        return this.http.get<SchemaResponse>(this.getBaseApiPath(target) + 'config/schema');
    }

    getEntities(target: string, plural: string, query?: EntitiesQuery): Observable<EntitiesResponse> {
        const queryString: string = "?" + this.getQueryString(target, query);
        return this.http.get<EntitiesResponse>(this.getBaseApiPath(target) + 'entities/' + plural + queryString);
    }
    updateEntity(target: string, plural: string, id: number, update: EntityUpdate): Observable<EntityUpdateResponse> {
        return this.http.put<EntityUpdateResponse>(this.getBaseApiPath(target) + 'entities/' + plural + "/" + id, { update: update });
    }
    addEntities(target: string, plural: string, entities: Entity[]): Observable<EntityInsertResponse> {
        return this.http.post<EntityInsertResponse>(this.getBaseApiPath(target) + 'entities/' + plural, { entities: entities });
    }
    getSchedule(target: string, query?: ScheduleQuery): Observable<any> {
        const queryString: string = "?" + this.getQueryString(target, query);
        return this.http.get<any>(this.getBaseApiPath(target) + 'schedule' + queryString);
    }
    updateScheduleItem(target: string, id: number, update: ScheduleItemUpdate): Observable<ScheduleItemUpdateResponse> {
        return this.http.put<ScheduleItemUpdateResponse>(this.getBaseApiPath(target) + 'schedule/' + id, { update: update });
    }
    addScheduleItems(target: string, items: ScheduleItemUpdate[]): Observable<ScheduleItemUpdateResponse> {
        return this.http.post<ScheduleItemUpdateResponse>(this.getBaseApiPath(target) + 'schedule', { items: items });
    }
    deleteScheduleItem(target: string, id: number): Observable<ScheduleItemDeleteResponse> {
        return this.http.delete<ScheduleItemDeleteResponse>(this.getBaseApiPath(target) + 'schedule/' + id);
    }
    getCurrentScheduleItem(target: string): Observable<any> {
        return this.http.get<any>(this.getBaseApiPath(target) + 'current');
    }
    getCurrentScheduleInstance(target: string): Observable<any> {
        return this.http.get<any>(this.getBaseApiPath(target) + '/round');
    }


    ping(target: string): Observable<TestApiResponse> {
        return this.http.get<TestApiResponse>(this.getBaseApiPath(target) + 'ping');
    }
    databasePing(target: string, value: string): Observable<TestApiResponse> {
        return this.http.post<TestApiResponse>(this.getBaseApiPath(target) + 'database/ping',
            { key: value });
    }
    databasePings(target: string): Observable<TestApiResponse> {
        return this.http.get<TestApiResponse>(this.getBaseApiPath(target) + 'database/ping');
    }
    protected(target: string): Observable<TestApiResponse> {
        return this.http.get<TestApiResponse>(this.getBaseApiPath(target) + 'protected');
    }

}