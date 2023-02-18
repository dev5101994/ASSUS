import { Alert, ToastAndroid, Platform, Image } from 'react-native';
import Colors from '../Constants/Colors';
import Constants from '../Constants/Constants';
import { Popup, Toast } from 'popup-ui'
import { color } from 'react-native-reanimated';


export default {

    showBasicAlert: (msg, callBack) => {
        Alert.alert(
            Constants.labels_for_non_react_files.alert_message ? Constants.labels_for_non_react_files.alert_message : "Alert",
            msg,
            [
                { text: "Ok", onPress: () => { callBack ? callBack() : console.log("Ok Pressed") } }
            ],
            { cancelable: false }
        );
    },

    showBasicDoubleAlert: (msg, callBack) => {
        Alert.alert(
            Constants.labels_for_non_react_files.alert_message ? Constants.labels_for_non_react_files.alert_message : "Alert",
            msg,
            [
                {
                    text: "Cancel",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel"
                },
                { text: "OK", onPress: () => { callBack ? callBack() : console.log("Ok Pressed") } }
            ],
            { cancelable: false }
        );
    },

    showBasicDoubleAlertForBoth: (msg, callBackForYes, callBackForNo, headingText, textForNo, textForYes) => {
        Alert.alert(
            headingText ? headingText : Constants.labels_for_non_react_files.alert_message ? Constants.labels_for_non_react_files.alert_message : "Alert",
            msg,
            [
                {
                    text: textForNo ?? "No",
                    onPress: () => callBackForNo ? callBackForNo() : console.log("Cancel Pressed"),
                    style: "cancel"
                },
                { text: textForYes ?? "Yes", onPress: () => { callBackForYes ? callBackForYes(true) : console.log("Ok Pressed") } }
            ],
            { cancelable: false }
        );
    },

    showAlert: (type, msg, callBackFunction) => {
        // console.log('showAlert')
        Popup.show({
            type: type,
            title: Constants.labels_for_non_react_files.alert_message ? Constants.labels_for_non_react_files.alert_message : "Alert",
            //button: tue,
            textBody: msg,
            buttonText: "Ok",
            callback: () => {
                if (callBackFunction) { callBackFunction(); Popup.hide() } else Popup.hide()
            }
        })
    },

    showDoubleAlert: (type, msg, callBackFunction) => {
        Popup.show({
            type: type,
            title: Constants.labels_for_non_react_files.alert_message ? Constants.labels_for_non_react_files.alert_message : "Alert",
            cancelButtonText: "Cancel",
            textBody: msg,
            buttonText: "Ok",
            cancelButtonCallBack: () => {
                Popup.hide()
            },
            callback: () => {
                if (callBackFunction) { callBackFunction(); Popup.hide() } else Popup.hide()
            }
        })
    },

    showToast: (msg, type) => {

        if (Platform.OS === 'ios') {
            Toast.show({
                //title: 'Alert',
                text: msg,
                color: type == Constants.success ? Colors.primary : type == Constants.warning ? Colors.yellow : type == Constants.danger ? Colors.red : Colors.white,
                //type: 'Success',
                timing: 3000,
            })
        }
        else {
            ToastAndroid.show(msg, ToastAndroid.SHORT);
        }
    },


}