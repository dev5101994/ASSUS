import { UserLogin } from '../ActionTypes'
import APIService from '../../Services/APIService'
import Constants from '../../Constants/Constants'
import AsyncStorageService from '../../Services/AsyncStorageService'

const success = (payload) => {
    return (
        {
            type: UserLogin,
            payload: payload
        }
    )
}

export const UserLoginActionWithPayload = (payload) => {
    return success(payload);
}

export const UserLoginAction = (params, onSuccess, onFaliure, rememberMe) => {

    const saveUserInAsyncStorage = async user_login => {
        try {
            if (rememberMe) {
                await AsyncStorageService._storeDataAsJSON(
                    Constants.asyncStorageKeys.user_login,
                    user_login,
                );
            }
            if (onSuccess)
                onSuccess()
        } catch (error) {
            if (onFaliure)
                onFaliure()
            // console.log('saveUserInAsyncStorage....AsyncStorageService error', error);
        }
    };

    return async (dispatch) => {
        let url = Constants.apiEndPoints.login;
        let response = await APIService.postData(url, params, null, null, "loginAPI");
        if (!response.errorMsg) {
            dispatch(success(response.data.payload));
            saveUserInAsyncStorage(response.data.payload);
        }
        else {
            onFaliure(response.errorMsg)
        }
    }
}



