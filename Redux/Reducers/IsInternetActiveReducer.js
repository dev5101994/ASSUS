import { IsInternetActive } from '../ActionTypes'

const initialStateUser = false;

export function IsInternetActiveReducer(state = initialStateUser, action) {

    switch (action.type) {
        case IsInternetActive:
            return action.payload
        default:
            return state
    }
}