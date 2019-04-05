import * as moment from 'moment';

export interface ScheduleItem {

    id: number;
    start: moment.Moment;
    end?: moment.Moment;



}