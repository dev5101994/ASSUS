import { NavData } from '../ActionTypes'

export function NavDataAction(value) {
    return (
        {
            type: NavData,
            payload: value
        }
    )
}


