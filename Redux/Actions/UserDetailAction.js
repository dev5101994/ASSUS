import { UserDetail } from '../ActionTypes'
import APIService from '../../Services/APIService'
import Constants from '../../Constants/Constants'

const success = (payload) => {
    return (
        {
            type: UserDetail,
            payload: payload
        }
    )
}

export const UserDetailActionWithPayload = (payload) => {
    return success(payload);
}

export const UserDetailAction = (params, onSuccess, onFailure) => {

    return async (dispatch) => {
        let url = Constants.apiEndPoints.userView + '/' + params.id;
        let response = await APIService.getData(url, params.token, null, "UserDetailActionAPI");
        if (!response.errorMsg) {
            dispatch(success(response.data.payload));
            onSuccess()
        }
        else {
            onFailure(response.errorMsg)
        }
    }
}



