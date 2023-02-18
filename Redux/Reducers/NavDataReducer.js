import { NavData } from '../ActionTypes'

// const initialState = {
//     screen: "detail",
//     module: "messages",
//     id: "1469"
// };
const initialState = null;

export function NavDataReducer(state = initialState, action) {

    switch (action.type) {
        case NavData:
            return action.payload
        default:
            return state
    }
}