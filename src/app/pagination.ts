import { PaginationQuery } from './pagination-query';
import { BehaviorSubject } from 'rxjs';
export class Pagination {
    params$: BehaviorSubject<PaginationQuery> = new BehaviorSubject(null);

    total: number;
    showing: number;
    constructor(
        public params: PaginationQuery
    ) { }
    nextPage() {
        this.params.offset = this.params.offset + this.params.limit;
        this.params$.next(this.params);
    }
    previousPage() {
        this.params.offset = this.params.offset - this.params.limit;
        this.params$.next(this.params);
    }
    get query(): PaginationQuery {
        return this.params;
    }
    get numPages(): number {
        return this.params.limit ? Math.floor(this.total / this.params.limit) + 1 : 0;
    }
    update(query: PaginationQuery) {
        this.params = Object.assign({}, query);
    }
    setTotal(total: number) { this.total = total }
    setShowing(showing: number) { this.showing = showing }

    atStart(): boolean {
        return this.params.offset < 1;
    }
    hasMore(): boolean {
        return (this.params.offset + this.showing) < this.total
    }

}