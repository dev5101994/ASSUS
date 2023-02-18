import React, { useState } from 'react';
import { View, StyleSheet, Text, SafeAreaView, TouchableOpacity, FlatList, RefreshControl, Platform, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Colors from '../Constants/Colors';
import { getProportionalFontSize, getActionSheetAPIDetail, getJSObjectFromTimeString, formatTime, formatTimeForAPI } from '../Services/CommonMethods';
import InputValidation from './InputValidation'
import CustomButton from './CustomButton';
import Constants from '../Constants/Constants'
import APIService from '../Services/APIService';
import Assets from '../Assets/Assets'
import Alert from './Alert'
import EmptyList from './EmptyList';
import ProgressLoader from './ProgressLoader';
import Can from '../can/Can';
import DatePicker from 'react-native-date-picker';
import { useSelector, useDispatch } from 'react-redux';
import { Checkbox } from 'react-native-paper';
import PickerAndLocationServices from '../Services/PickerAndLocationServices';


export default ScheduleListModal = props => {

    // Immutable Variables
    const validationKeys = {
        reason: "reason",
        expectedTimeOut: "expectedTimeOut"
    }

    const initialFieldValues = {
        reason: "",
        expectedTimeOut: ""
    }

    // REDUX hooks
    const dispatch = useDispatch();
    const UserLogin = useSelector(state => state?.User?.UserLogin);
    const UserDetail = useSelector(state => state?.User?.UserDetail);
    const labels = useSelector(state => state.Labels);
    const netInfoDetails = useSelector(state => state.NetInfoDetails);

    const permissions = UserLogin?.permissions ?? {};

    const initialValidationObj = {
        [validationKeys.reason]: {
            invalid: false,
            title: labels.required_field
        },
        [validationKeys.expectedTimeOut]: {
            invalid: false,
            title: labels.required_field
        },
    }

    // useState hooks
    const [isLoading, setIsLoading] = React.useState(true);
    const [isRefreshing, setIsRefreshing] = React.useState(false);
    const [paginationLoading, setPaginationLoading] = React.useState(false);
    const [page, setPage] = React.useState(0);
    const [ScheduleList, setScheduleList] = React.useState([]);
    const [viewDecider, setViewDecider] = React.useState(props.scheduleObj ? 2 : 1);
    const [validationObj, setValidationObj] = React.useState({ ...initialValidationObj });
    const [fieldValues, setFieldValues] = React.useState({ ...initialFieldValues });
    const [reasonPlaceHolder, setReasonPlaceHolder] = React.useState(props.reasonPlaceHolder ?? labels.reason);
    const [scheduleOBJECT, setScheduleOBJECT] = React.useState(null);
    const [isLoginAtRegTime, setIsLoginAtRegTime] = React.useState(false);
    const [openDatePicker, setOpenDatePicker] = useState(false);
    const [mode, setMode] = useState(Constants.DatePickerModes.date_mode);
    const [datePickerKey, setDatePickerKey] = useState(null);

    React.useEffect(() => {
        if (!props.scheduleObj)
            scheduleListingAPI()
        else
            setIsLoading(false)
    }, [])

    const removeErrorTextForInputThatUserIsTyping = (uniqueKey) => {
        let tempValidationObj = { ...validationObj }
        tempValidationObj[uniqueKey] = initialValidationObj[uniqueKey];
        setValidationObj(tempValidationObj);
    }

    const handleInputChange = (key, value) => {
        setFieldValues({ ...fieldValues, [key]: value })
    }

    const scheduleListingAPI = async (page, refresh) => {
        if (refresh)
            setIsRefreshing(true)
        else if (!page)
            setIsLoading(true);
        else
            setPaginationLoading(true)
        let url = Constants.apiEndPoints.userSchedules + "/" + UserLogin.id;
        let response = await APIService.getData(url, UserLogin.access_token, null, "getUserScheduleList..insdie modal");
        // console.log("data", response.data) 
        if (!response.errorMsg) {
            // console.log('response-------------------+++++++++++++', JSON.stringify(response))
            if (!page) {
                setPage(1);
                setScheduleList(response.data.payload);
                if (response.data.payload?.length == 0) {
                    setIsLoading(false);
                    setViewDecider(3);
                    //PickerAndLocationServices.getCurrentLocation((position) => { createStamp('IN', position, null) }, () => { setIsLoading(false); props.onRequestClose() })
                }
                else if (response.data.payload?.length == 1) {
                    PickerAndLocationServices.getCurrentLocation((position) => { createStamp('IN', position, response.data.payload[0]) }, () => { setIsLoading(false); props.onRequestClose() })
                }
                else
                    setIsLoading(false);
                if (refresh)
                    setIsRefreshing(false);
            }
            else {
                let tempList = [...ScheduleList];
                tempList = tempList.concat(response.data.payload);
                setPage(page);
                setScheduleList([...tempList]);
                setPaginationLoading(false);
            }
        }
        else {
            if (!page)
                setIsLoading(false);
            else
                setPaginationLoading(false)
            if (refresh)
                setIsRefreshing(false);
            Alert.showAlert(Constants.danger, response.errorMsg)
        }
    }

    const lateOrEarlyReasonDecider_login = (scheduleOBJ) => {
        // return labels.mobile_reason_for_late_login;
        if (scheduleOBJ?.shift_start_time) {
            let shift_start_time = getJSObjectFromTimeString(scheduleOBJ?.shift_start_time)
            if (!isNaN(shift_start_time)) {
                let currTime = new Date();
                if (currTime.getTime() > shift_start_time.getTime()) {
                    if (currTime.getHours() == shift_start_time.getHours()) {
                        if (currTime.getMinutes() - shift_start_time.getMinutes() > Constants.employee_relaxation_time_in_minutes)
                            return labels.mobile_reason_for_late_login;
                        else
                            return '';
                    }
                    else {
                        return labels.mobile_reason_for_late_login;
                    }
                }
                else if (currTime.getTime() < shift_start_time.getTime()) {
                    if (shift_start_time.getHours() - currTime.getHours() == 1) {
                        if (shift_start_time.getMinutes() - currTime.getMinutes() > Constants.employee_relaxation_time_in_minutes) {
                            return labels.mobile_reason_for_early_login;
                        }
                        else if (currTime.getMinutes() - shift_start_time.getMinutes() > Constants.employee_relaxation_time_in_minutes) {
                            return labels.mobile_reason_for_early_login;
                        }
                        else return '';
                    }
                    else {
                        return labels.mobile_reason_for_early_login;
                    }
                }
                else
                    return '';
            }
            return '';
        }
        return '';
    }

    const createStamp = async (type, locationOBJ, scheduleOBJ) => {
        //setLoginButtonLoading(true);
        // console.log('INSIDE CREATE STAMP', netInfoDetails?.ipAddress)
        let reason = '';
        if (!props.reasonPlaceHolder)
            reason = lateOrEarlyReasonDecider_login(scheduleOBJ);
        if (reason && scheduleOBJ) {
            setScheduleOBJECT(scheduleOBJ)
            setReasonPlaceHolder(reason)
            setIsLoading(false)
            setViewDecider(2)
            return;
        }
        let params = {
            "type": type,
            "schedule_id": scheduleOBJ?.id ? scheduleOBJ?.id : scheduleOBJECT?.id ? scheduleOBJECT?.id : null,
            "location": {
                "lat": locationOBJ.coords.latitude,
                "lng": locationOBJ.coords.longitude,
                "ip_address": netInfoDetails?.ipAddress ?? "",
            },
            'expected_out_time': fieldValues.expectedTimeOut ? formatTimeForAPI(fieldValues.expectedTimeOut) : null,
        }
        if (props?.scheduleObj?.punchin_id) {
            params['punchin_id'] = props?.scheduleObj?.punchin_id;
        }
        if (fieldValues.reason && reasonPlaceHolder) {
            if (reasonPlaceHolder == labels.mobile_reason_for_early_login) {
                params['reason_for_early_in'] = isLoginAtRegTime ? "" : fieldValues.reason;
                params['punch_at_scheduled'] = isLoginAtRegTime;
            }
            else if (reasonPlaceHolder == labels.mobile_reason_for_late_login) {
                params['reason_for_late_in'] = fieldValues.reason
            }
            else if (reasonPlaceHolder == labels.mobile_reason_for_late_logout) {
                params['reason_for_late_out'] = fieldValues.reason
            }
            else if (reasonPlaceHolder == labels.mobile_reason_for_early_logout) {
                params['reason_for_early_out'] = fieldValues.reason
            }
        }
        let url = Constants.apiEndPoints.stampling;
        let response = await APIService.postData(url, params, UserLogin.access_token, null, "createStamp API");
        if (!response.errorMsg) {
            props.refreshAPI()
            props.onRequestClose()
            if (type == 'OUT')
                Alert.showToast(labels.stamp_out_success_msg)
            else if (type == 'IN')
                Alert.showToast(labels.stamp_in_success_msg)
        }
        else {
            setIsLoading(false);
            Alert.showAlert(Constants.danger, response.errorMsg)
            props.onRequestClose()
        }
    }

    const validation = () => {
        let validationObjTemp = { ...validationObj };
        let isValid = true;
        for (const [key, value] of Object.entries(validationObjTemp)) {
            if (key == validationKeys.expectedTimeOut) {
                if (viewDecider == 3) {
                    if (!fieldValues[key]) {
                        value['invalid'] = true;
                        isValid = false;
                        break;
                    }
                    else if (new Date().getTime() >= fieldValues[key]?.getTime()) {
                        value['invalid'] = true;
                        value['title'] = labels.expected_out_time_msg;
                        isValid = false;
                        break;
                    }
                }
            }
            else if (!fieldValues[key] && viewDecider != 3) {
                value['invalid'] = true;
                isValid = false;
                break;
            }
        }
        if (!isValid)
            setValidationObj(validationObjTemp);
        return isValid;
    }

    // Render view

    return (
        <View style={styles.modalMainView}>

            <View style={styles.innerView}>
                {
                    isLoading
                        ? <ProgressLoader onActivityIndicator={true} onActivityIndicatorStyle={{ position: "absolute", bottom: 0, top: 0, right: 0, left: 0 }} />
                        : viewDecider == 1
                            ? <>
                                {/* close icon  */}
                                <Icon name='cancel' style={{ alignSelf: "flex-end" }} color={Colors.primary} size={30} onPress={isLoading ? () => { } : props.onRequestClose} />

                                <Text style={styles.headingText}>{labels.choose_schedule}</Text>

                                <FlatList
                                    showsVerticalScrollIndicator={false}
                                    style={{}}
                                    contentContainerStyle={{ paddingHorizontal: Constants.globalPaddingHorizontal, paddingBottom: 20 }}
                                    // ListEmptyComponent={<EmptyList shouldAddDataMessageVisible={false} />}
                                    data={ScheduleList}
                                    renderItem={({ item, index }) => {
                                        return (
                                            <TouchableOpacity onPress={() => {
                                                setIsLoading(true);
                                                PickerAndLocationServices.getCurrentLocation((position) => { createStamp('IN', position, item) }, () => { setIsLoading(false); })
                                            }} style={styles.barStyle}>
                                                <View style={[styles.rowStyle, { justifyContent: "flex-start", marginTop: 0 }]}>
                                                    <Text numberOfLines={1} style={[styles.normalText, { flex: 1, }]}>{labels.date} : </Text>
                                                    <Text numberOfLines={1} style={{ ...styles.boldText, flex: 4, }}>{item.shift_date}</Text>
                                                </View>

                                                <View style={[styles.rowStyle, { justifyContent: "flex-start", marginTop: 0 }]}>
                                                    <Text numberOfLines={1} style={[styles.normalText, { flex: 1, }]}>{labels.time} : </Text>
                                                    <Text numberOfLines={1} style={{ ...styles.boldText, flex: 4, }}>{item.shift_start_time} - {item.shift_end_time}</Text>
                                                </View>
                                            </TouchableOpacity>
                                        )
                                    }}
                                    keyExtractor={(item, index) => '' + item.id}
                                    // onEndReached={() => { followUpListingAPI(page + 1) }}
                                    onEndReachedThreshold={0.1}
                                    refreshControl={
                                        <RefreshControl
                                            refreshing={isRefreshing}
                                            onRefresh={() => {
                                                scheduleListingAPI(null, true)
                                            }}
                                        />
                                    }
                                />
                            </>
                            : viewDecider == 2
                                ?
                                <View style={{}}>
                                    {/* close icon  */}
                                    <Icon name='cancel' style={{ alignSelf: "flex-end" }} color={Colors.primary} size={30} onPress={isLoading ? () => { } : props.onRequestClose} />

                                    {
                                        (reasonPlaceHolder == labels.mobile_reason_for_early_login && isLoginAtRegTime)
                                            ? null
                                            : <InputValidation
                                                uniqueKey={validationKeys.reason}
                                                validationObj={validationObj}
                                                value={fieldValues?.reason ?? ""}
                                                placeHolder={reasonPlaceHolder}
                                                iconColor={Colors.primary}
                                                onChangeText={(text) => {
                                                    if (validationObj[validationKeys.reason].invalid)
                                                        removeErrorTextForInputThatUserIsTyping(validationKeys.reason)
                                                    handleInputChange(validationKeys.reason, text)
                                                }}
                                                // editable={false}
                                                style={styles.mainInputStyle}
                                                inputStyle={styles.inputStyle}
                                            />
                                    }

                                    {
                                        reasonPlaceHolder == labels.mobile_reason_for_early_login
                                            ? <View style={styles.checkBoxView}>
                                                <Checkbox
                                                    color={Colors.primary}
                                                    status={isLoginAtRegTime ? 'checked' : 'unchecked'}
                                                    onPress={() => {
                                                        setIsLoginAtRegTime(!isLoginAtRegTime)
                                                    }}
                                                />
                                                <Text style={styles.normalText}>{labels.login_at_regular_time}</Text>
                                            </View>
                                            : null
                                    }

                                    {/* save button */}
                                    <CustomButton onPress={() => {
                                        if (validation()) {
                                            // console.log('validation success')
                                            setIsLoading(true)
                                            // return
                                            PickerAndLocationServices.getCurrentLocation((position) => { createStamp(props.reasonPlaceHolder ? "OUT" : 'IN', position) }, () => { setIsLoading(false); props.onRequestClose() })
                                        }
                                        else {
                                            Alert.showAlert(Constants.warning, labels.message_fill_all_required_fields)
                                            // console.log('validation fail')
                                        }
                                    }} title={labels.save} style={{ marginTop: 30 }} />
                                </View>
                                : viewDecider == 3
                                    ? <View >
                                        <Icon name='cancel' style={{ alignSelf: "flex-end" }} color={Colors.primary} size={30} onPress={isLoading ? () => { } : props.onRequestClose} />

                                        {/* Time */}
                                        <InputValidation
                                            uniqueKey={validationKeys.expectedTimeOut}
                                            validationObj={validationObj}
                                            iconRight="time"
                                            iconColor={Colors.primary}
                                            editable={false}
                                            onPress={() => {
                                                removeErrorTextForInputThatUserIsTyping(validationKeys.expectedTimeOut)
                                                setOpenDatePicker(true);
                                                setMode(Constants.DatePickerModes.time_mode);
                                                setDatePickerKey(validationKeys.expectedTimeOut);
                                            }}
                                            value={fieldValues.expectedTimeOut ? formatTime(fieldValues.expectedTimeOut) : ''}
                                            placeHolder={labels["expected_out_time"]}
                                            style={{ ...styles.InputValidationView, }}
                                            inputStyle={styles.inputStyle}
                                        />

                                        {/* save button */}
                                        <CustomButton
                                            onPress={() => {
                                                if (validation()) {
                                                    setIsLoading(true)
                                                    PickerAndLocationServices.getCurrentLocation((position) => {
                                                        createStamp('IN', position, null)
                                                    }, () => { setIsLoading(false); props.onRequestClose() })
                                                }
                                                else {
                                                    // console.log('validation fail')
                                                }
                                            }} title={labels.save} style={{ marginTop: 30 }} />
                                    </View>
                                    : null
                }
            </View>
            <DatePicker
                modal
                mode={mode}
                open={openDatePicker}
                minimumDate={mode == Constants.DatePickerModes.date_mode ? new Date() : null}
                date={new Date()}
                onConfirm={date => {
                    setOpenDatePicker(false);
                    if (mode == Constants.DatePickerModes.date_mode)
                        handleInputChange(datePickerKey, date);
                    else if (mode == Constants.DatePickerModes.time_mode)
                        handleInputChange(datePickerKey, date);
                    else handleInputChange(datePickerKey, date);
                }}
                onCancel={() => {
                    setOpenDatePicker(false);
                }}
            />
        </View >
    );
};

const styles = StyleSheet.create({
    modalMainView: { backgroundColor: 'transparent', justifyContent: "center", alignItems: "center", paddingHorizontal: 16 },
    innerView: { width: '100%', minHeight: 300, backgroundColor: Colors.backgroundColor, paddingVertical: 15, paddingHorizontal: 16, borderRadius: 20 },
    InputValidationView: {
        backgroundColor: Colors.backgroundColor,
        marginTop: 30,
        //borderRadius: 20,
        // paddingHorizontal: 5
    },
    inputStyle: {
        fontSize: getProportionalFontSize(16),
        borderColor: Colors.borderColor,
        backgroundColor: Colors.white
    },
    checkBoxView: { flexDirection: 'row', alignItems: 'center', marginTop: 30 },
    normalText: {
        fontSize: getProportionalFontSize(13),
        fontFamily: Assets.fonts.semiBold,
        color: Colors.gray
    },
    mainInputStyle: {
        backgroundColor: Colors.transparent,
        marginTop: 15,
    },
    headingText: {
        fontSize: getProportionalFontSize(18),
        fontFamily: Assets.fonts.bold,
        textAlign: "center",
        // marginTop: 20,
        color: Colors.primary
    },
    barStyle: {
        width: "100%", marginTop: Constants.formFieldTopMargin,
        backgroundColor: Colors.white,
        // borderWidth: 1,
        borderColor: Colors.primary,
        padding: 10,
        borderRadius: 7,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 15,
        elevation: 15,
        shadowColor: Platform.OS == 'ios' ? Colors.shadowColorIosDefault : Colors.primary,
    },
    rowStyle: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: Constants.formFieldTopMargin },
    boldText: {
        fontSize: getProportionalFontSize(13),
        fontFamily: Assets.fonts.bold,
        color: Colors.primary
    }
});
