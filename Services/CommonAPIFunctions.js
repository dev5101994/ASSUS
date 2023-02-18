import Alert from "../Components/Alert";
import Constants from "../Constants/Constants";
import APIService from "./APIService"

export default {
    getSuggestions: async (token, callBack) => {
        let res = await APIService.postData(Constants.apiEndPoints.paragraphs, {}, token, null, "getSuggestionsAPI");
        if (!res.errorMsg) {
            if (callBack)
                callBack(res.data.payload);
        }
        else
            Alert.showToast(res.errorMsg);
    },
    getBadWords: async (token, callBack) => {
        let res = await APIService.postData(Constants.apiEndPoints.words, {}, token, null, "getBadWordsPI");
        if (!res.errorMsg) {
            if (callBack)
                callBack(res.data.payload);
        }
        else
            Alert.showToast(res.errorMsg);
    },
}