import { Round } from './round';
import { ScheduleInstanceItem } from './schedule-instance-item';
export interface ScheduleInstance {

    schedule: number;
    round: Round;
    items: ScheduleInstanceItem[];

}