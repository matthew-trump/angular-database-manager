import { ScheduleField } from './schedule-field';
export interface ScheduleConfig {
    table: string,
    entity: string,
    number?: string,
    pool?: string,
    start?: string,
    ordering?: string,
    direction?: string,
    defaultStartOffsetMinutes?: number,

    fields: ScheduleField[];
}