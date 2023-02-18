import { Labels } from '../ActionTypes'

export function LabelsAction(value) {
    return (
        {
            type: Labels,
            payload: value
        }
    )
}


