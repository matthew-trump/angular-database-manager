import { EntityField } from './entity-field';
import { EntitySearch } from './entity-search';
import { EntityFilter } from './entity-filter';

export interface EntityConfig {

    name: string;
    plural: string;
    table: string;
    add?: boolean;
    enablement?: string;
    defaultEnabled?: number;
    fields: EntityField[];
    search: EntitySearch;
    filter: EntityFilter;

}