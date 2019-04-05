import { ScheduleConfig } from "./schedule-config";
import { EntityConfig } from "./entity-config";

export interface Schema {

    schedule: ScheduleConfig;
    entities: EntityConfig[];
}