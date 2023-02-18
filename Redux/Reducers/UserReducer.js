import { UserLogin } from '../ActionTypes'
import { UserDetail } from '../ActionTypes'

const initialStateUser = {
    UserLogin: {},
    UserDetail: {},
};

export function UserReducer(state = initialStateUser, action) {

    switch (action.type) {
        case UserLogin:
            return { ...state, UserLogin: { ...action.payload } }
        case UserDetail:
            return { ...state, UserDetail: { ...action.payload } }
        default:
            return state
    }
}

