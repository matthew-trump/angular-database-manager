export interface ScheduleField {

    name: string;
    type?: string;
    label?: string;
    required?: boolean;
    default?: number;
    foreignKey?: string;
}