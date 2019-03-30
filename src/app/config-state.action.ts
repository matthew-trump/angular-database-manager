import { Action } from '@ngrx/store';
import { ACTIONS } from './actions';

export class ConfigStateAction implements Action {
    public readonly type: string = ACTIONS.CONFIG_STATE;
    public payload: any;

    constructor(obj: any) {
        this.payload = {
            target: obj.target,
            schema: obj.schema
        }
    }
}
