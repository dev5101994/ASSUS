import { StyleSheet, Text, View, FlatList, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { getProportionalFontSize } from '../Services/CommonMethods';
import Colors from '../Constants/Colors';
import Constants from '../Constants/Constants';
import APIService from '../Services/APIService';
import { useSelector, useDispatch } from 'react-redux';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import Assets from '../Assets/Assets';
import ProgressLoader from './ProgressLoader';
import AsyncStorageService from '../Services/AsyncStorageService';
import { LabelsAction } from '../Redux/Actions/LabelsAction';
import Alert from './Alert';
import CustomButton from './CustomButton';

const ChangeLanguage = (props) => {

    const UserLogin = useSelector(state => state?.User?.UserLogin);
    const labels = useSelector(state => state.Labels);
    const dispatch = useDispatch();

    const [isLoading, setIsLoading] = useState(props.isLoggingOut ? false : true)
    const [appLanguageObj, setAppLanguageObj] = useState(null)
    const [data, setData] = useState([])

    useEffect(() => {
        if (!props.isLoggingOut) {
            getSavedLanguageFromLocalStorage()
            getLanguagesApi()
        }
    }, [])


    const getSavedLanguageFromLocalStorage = async () => {
        try {
            let asyncLanResponse = await AsyncStorageService._retrieveDataAsJSON(
                Constants.asyncStorageKeys.app_language_obj,
            );
            // console.log('asyncLanResponse', asyncLanResponse)
            let app_language_obj = null;

            if (asyncLanResponse && Object.keys(asyncLanResponse)?.length > 0) {
                app_language_obj = asyncLanResponse;
            }

            setAppLanguageObj(app_language_obj)
        }
        catch (error) {
            console.error('ASync storage error', error)
        }
    }

    const getLabels = async (app_language_ID) => {
        setIsLoading(true)
        let url = Constants.apiEndPoints.getLabels;

        let params = {
            language_id: app_language_ID
        }

        let response = await APIService.postData(url, params, null, null, "get labels API");

        if (!response.errorMsg) {

            let labels_response = Constants.labels;

            // let labels_response = response.data.payload.labels

            let temp_label = {};

            for (const [key, value] of Object.entries(Constants.labels_for_non_react_files)) {
                temp_label[key] = labels_response[key];
            }

            Constants.labels_for_non_react_files = temp_label;

            dispatch(LabelsAction(labels_response));

            await AsyncStorageService._storeDataAsJSON(
                Constants.asyncStorageKeys.app_language_obj,
                response.data.payload.language
            );
            setAppLanguageObj(response.data.payload.language)
            setIsLoading(false);
            Alert.showToast(labels.language_changed_success_msg)
            props.onRequestClose()
            props.navigation.closeDrawer()

        }
        else {
            setIsLoading(false);
            Alert.showAlert(Constants.danger, response.errorMsg)
        }

        // props.onRequestClose()
    }

    const getLanguagesApi = async () => {

        let url = Constants.apiEndPoints.getLanguages;
        let response = await APIService.getData(url, UserLogin.access_token, null, 'getLanguagesApi',);
        if (!response.errorMsg) {
            setData(response?.data?.payload)
            //
            setIsLoading(false);
        } else {
            setIsLoading(false);
            Alert.showAlert(Constants.danger, response.errorMsg);
        }
    };

    const renderItemList = ({ item, index }) => {
        return (
            <TouchableOpacity
                onPress={() => {
                    if (appLanguageObj?.id != item.id)
                        getLabels(item.id)
                }}
                style={{ flexDirection: "row", alignItems: "center", marginTop: 5 }} >
                {appLanguageObj?.id == item.id
                    ? <MaterialIcons name='language' size={22} color={Colors.primary} />
                    : <View style={{ width: 22 }} />
                }
                <Text style={{ color: Colors.primary, fontFamily: Assets.fonts.semiBold, fontSize: getProportionalFontSize(16), marginStart: 5 }}>{item.title}</Text>
            </TouchableOpacity>
        )
    }

    const logoutAPI = async () => {
        setIsLoading(true);
        let url = Constants.apiEndPoints.logout;
        let params = {}
        let response = await APIService.postData(url, params, UserLogin.access_token, null, 'logout....Api',);
        if (!response.errorMsg) {
            props.logout ? props.logout() : null
            // props.onRequestClose ? props.onRequestClose() : null
            // setIsLoading(false);
        } else {
            setIsLoading(false);
            Alert.showAlert(Constants.danger, response.errorMsg);
        }
    }

    if (isLoading)
        return <ProgressLoader onActivityIndicator={true} onActivityIndicatorStyle={{ flex: 1 }} />

    return (
        <View style={{ flex: 1, paddingTop: 5 }}>
            <View style={{ flexDirection: "row", alignItems: "center", }}>
                <Text style={styles.titleStyle}>{props.isLoggingOut ? '' : labels.mobile_languages}</Text>
                <MaterialCommunityIcons onPress={() => { props.onRequestClose ? props.onRequestClose() : null }} name='close-circle' size={getProportionalFontSize(25)} color={Colors.primary} style={{ flex: 0.5, textAlign: "right" }} />
            </View>

            {props.isLoggingOut ?
                <Text style={styles.headingStyle}>{labels.log_out}</Text>
                : null}

            {props.isLoggingOut
                ? null
                : <FlatList
                    data={data}
                    style={{ marginTop: Constants.formFieldTopMargin }}
                    renderItem={renderItemList}
                    keyExtractor={(item, index) => item.id}
                />}

            {
                props.isLoggingOut
                    ? <View style={{ flexDirection: "row", alignItems: "center", width: "100%", justifyContent: "space-between", marginTop: 20 }}>
                        <CustomButton
                            onPress={() => { logoutAPI() }}
                            title={labels.yes}
                            style={{ width: "45%" }} />
                        <CustomButton
                            onPress={() => { props.onRequestClose ? props.onRequestClose() : null }}
                            title={labels.no}
                            style={{ width: "45%" }} />
                    </View>
                    : null
            }
        </View>
    )
}

export default ChangeLanguage

const styles = StyleSheet.create({
    titleStyle: {
        flex: 1,
        textAlign: "right",
        fontSize: getProportionalFontSize(18),
        color: Colors.primary,
        fontFamily: Assets.fonts.bold,
    },
    headingStyle: {
        fontSize: getProportionalFontSize(20),
        color: Colors.primary,
        fontFamily: Assets.fonts.robotoBold,
        textAlign: "center"
    }
})