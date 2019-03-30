//import { ConfigStateAction } from './config-state.action';
import { ACTIONS } from './actions';

const defaultState: any = {
    target: null,
    schema: null,
}
export function ConfigStateReducer(state: any = defaultState, action: any): any {
    switch (action.type) {
        case ACTIONS.CONFIG_STATE:
            return action.payload;
        default:
            return state;

    }
}
