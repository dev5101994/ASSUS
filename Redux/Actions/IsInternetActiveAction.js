import { IsInternetActive, NetInfoDetails } from '../ActionTypes'

export function IsInternetActiveAction(value) {
    return (
        {
            type: IsInternetActive,
            payload: value
        }
    )
}

export function NetInfoDetailsAction(value) {
    return (
        {
            type: NetInfoDetails,
            payload: value
        }
    )
}


