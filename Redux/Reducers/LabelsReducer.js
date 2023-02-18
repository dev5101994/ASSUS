import { Labels } from '../ActionTypes'

const initialState = {};

export function LabelsReducer(state = initialState, action) {

    switch (action.type) {
        case Labels:
            return action.payload
        default:
            return state
    }
}