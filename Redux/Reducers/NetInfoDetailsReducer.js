import { NetInfoDetails } from '../ActionTypes'

const initialStateUser = null;

export function NetInfoDetailsReducer(state = initialStateUser, action) {

    switch (action.type) {
        case NetInfoDetails:
            return action.payload
        default:
            return state
    }
}