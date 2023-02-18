import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import InputValidation from './InputValidation';
import Colors from '../Constants/Colors';
import Assets from '../Assets/Assets';
import { getProportionalFontSize, getActionSheetAPIDetail, formatDate, formatTime, createDateFormateFromTime, checkUrlFormat, jsCoreDateCreator, getJSObjectFromTimeString, checkFileSize, formatDateByFormat, isDocOrImage } from '../Services/CommonMethods';
import { Checkbox } from 'react-native-paper';
import CustomButton from './CustomButton';
import ActionSheet from "react-native-actions-sheet";
import Constants from "../Constants/Constants";
import Icon from 'react-native-vector-icons/MaterialIcons';
import APIService from '../Services/APIService';
import Alert from './Alert';
import DatePicker from 'react-native-date-picker';
import moment from 'moment';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
// import ActionSheet from 'react-native-actions-sheet';
import ActionSheetComp from '../Components/ActionSheetComp';

const LeavesForm = ({ markedDatesForForm, DateRange, labels, UserLogin, onRequestClose, navigation, isEditing, LeaveDetails, formValues, refreshPage }) => {
    const initialKeys = {
        "reason": "reason",
        "VacationTrip": "VacationTrip",
        "employee": "employee"

    }
    const initialValues = {
        "reason": "",
        "employee": {},
        "VacationTrip": false
    }
    const initialValidation = {
        [initialKeys.employee]: {
            invalid: false,
            title: ''
        },
        [initialKeys.reason]: {
            invalid: false,
            title: ''
        },
    }
    //Hooks
    const actionSheetRef = React.useRef();

    //hooks
    const [formFields, setFormFields] = React.useState({ ...initialValues });
    const [validationObj, setValidationObj] = React.useState({ ...initialValidation });
    const [isLoading, setIsLoading] = React.useState(false);
    const [actionSheetDecide, setActionSheetDecide] = React.useState('');
    const [employeeAS, setEmployeeAS] = React.useState(getActionSheetAPIDetail({
        url: Constants.apiEndPoints.userList, params: { user_type_id: '3', "branch_id": formValues?.employee?.branch_id, }, debugMsg: "employee-list", token: UserLogin.access_token, perPage: Constants.perPage,
        selectedData: []
    }));

    React.useEffect(() => {
        // if (isEditing) {
        //     setFormFields({
        //         ...formFields,
        //         "VacationTrip": LeaveDetails?.leave_type == "vacation" ? true : false,
        //         "reason": LeaveDetails?.reason ?? '',
        //     })
        // }
    }, [])

    const handleInputChange = (key, value) => {
        // console.log("key", key)
        setFormFields({ ...formFields, [key]: value })

    }
    const removeErrorTextForInputThatUserIsTyping = (uniqueKey) => {
        let tempValidationObj = { ...initialValidation }
        tempValidationObj[uniqueKey] = initialValidation[uniqueKey];
        setValidationObj(tempValidationObj);
    }
    const validation = () => {
        let validationObjTemp = { ...initialValidation };
        let isValid = true;
        for (const [key, value] of Object.entries(initialValidation)) {
            if (key == initialKeys.reason && !formFields?.reason && !formFields.VacationTrip) {
                // console.log(`${key}-----1`)
                value['invalid'] = true;
                value['title'] = labels[key + '_required']
                isValid = false;
                break;
            }
            if (UserLogin.user_type_id == 2) {
                if (key == initialKeys.employee && !formFields?.employee.name) {
                    // console.log(`${key}-----1`)
                    value['invalid'] = true;
                    value['title'] = labels[key + '_required']
                    isValid = false;
                    break;
                }
            }
        }
        setValidationObj({ ...validationObjTemp });
        return isValid;
    }

    const getAPIDetails = () => {
        switch (actionSheetDecide) {

            case initialKeys.employee: {
                return employeeAS;
            }

            default: {
                return null;
            }
        }
    };

    const changeAPIDetails = payload => {
        switch (actionSheetDecide) {

            case initialKeys.employee: {
                removeErrorTextForInputThatUserIsTyping(initialKeys.employee)
                setEmployeeAS(getActionSheetAPIDetail({ ...employeeAS, ...payload }));
                break;
            }
            default: {
                return null;
            }
        }
    };

    const onPressItem = item => {
        switch (actionSheetDecide) {

            case initialKeys.employee: {
                setFormFields({ ...formFields, employee: item })
                break;
            }
            default: {
                break;
            }
        }
    };


    const closeActionSheet = () => {
        setActionSheetDecide('');
        actionSheetRef?.current?.setModalVisible();
    };
    const saveAndApproveLeaveByAdmin = async () => {
        let params = {
            emp_id: formValues?.employee?.id,
            group_by: true,
            leave_type: formFields.VacationTrip ? "vacation" : "leave",
            leaves: [
                {
                    dates: markedDatesForForm,
                    assign_emp: formFields.employee.id
                }],
            reason: formFields.reason ?? "",
        }


        let url = Constants.apiEndPoints?.["company-leave"]
        // console.log("url", url);
        // console.log("params", JSON.stringify(params));
        // return
        setIsLoading(true);
        let response = await APIService.postData(url, params, UserLogin.access_token, null, "saveAndApproveLeaveByAdmin");
        if (!response.errorMsg) {
            // console.log('response-------------------+++++++++++++', JSON.stringify(response))
            setIsLoading(true);
            onRequestClose()
            navigation.navigate("LeavesList", { refresh: true })
        }
        else {
            setIsLoading(true);
            Alert.showBasicAlert(response.errorMsg);
        }
    }
    const saveLeaveEditSchedule = async () => {
        let week_days = []
        if (!isEditing) {
            formValues?.week_days.map((obj) => {
                if (obj.selected) {
                    week_days.push('' + obj.number)
                }
            })
        }
        let params = {
            reason: DateRange && !formFields.VacationTrip ? formFields.reason : null,
        }
        if (!isEditing) {
            params = {
                ...params,
                end_date: DateRange ? markedDatesForForm[markedDatesForForm.length - 1] : null,
                every_week: DateRange ? formValues.every_week : null,
                is_repeat: DateRange ? 1 : 0,
                leaves: DateRange
                    ? null
                    : [{
                        dates: markedDatesForForm ?? [],
                        reason: formFields.reason ?? "",
                    }],
                start_date: DateRange ? markedDatesForForm[0] : null,
                week_days: DateRange ? week_days : null,
                group_by: true,
                leave_type: formFields.VacationTrip ? "vacation" : "leave",

            }
            if (!DateRange) {
                params = {
                    ...params,
                    dates: markedDatesForForm ?? []
                }
            }
        }

        let url = Constants.apiEndPoints.leave
        if (isEditing) {
            url = url + "/" + LeaveDetails.id
        }
        // console.log("url", url);
        // console.log("params", JSON.stringify(params));
        // return
        setIsLoading(true);
        let response = {}
        if (isEditing) {
            response = await APIService.putData(url, params, UserLogin.access_token, null, "editLeaves");
        } else {
            response = await APIService.postData(url, params, UserLogin.access_token, null, "saveLeaves");
        }
        if (!response.errorMsg) {
            // console.log('response-----for add leave--------------+++++++++++++', JSON.stringify(response))
            setIsLoading(true);
            onRequestClose()
            if (isEditing) {
                refreshPage()
                // console.log("oh my god.....")
            } else {
                navigation.navigate("LeavesList", { refresh: true })
            }


        }
        else {
            setIsLoading(true);
            Alert.showBasicAlert(response.errorMsg);
        }
    }

    return (
        <View style={{
            marginTop: 10,
            marginHorizontal: 20,
            // width: "100%"
            // height: "100%"
        }}>
            <ActionSheet ref={actionSheetRef}>
                <ActionSheetComp
                    title={labels[actionSheetDecide]}
                    closeActionSheet={closeActionSheet}
                    keyToShowData={"name"}
                    keyToCompareData="id"
                    APIDetails={getAPIDetails()}
                    changeAPIDetails={payload => {
                        changeAPIDetails(payload);
                    }}
                    onPressItem={item => {
                        onPressItem(item);
                    }}
                />
            </ActionSheet>
            {/* close icon */}
            <View style={{ width: "100%", alignItems: "flex-end" }} >
                <Icon name='cancel' color={Colors.primary} size={30} onPress={onRequestClose ? () => onRequestClose() : () => { }} />
            </View>

            <Text style={styles.titleStyle}>{isEditing ? labels.editLeave ?? "Leave" : labels.create_Leave ?? "Leave"}</Text>
            {/* <Text numberOfLines={4} style={styles.textStyle} >({labels.selected_dates}: {markedDatesForForm.join(", ")})</Text> */}

            {
                isEditing
                    ? <View style={{ flexDirection: "row", alignItems: "center", marginTop: 5 }}>
                        <Icon name='date-range' size={15} />
                        <Text style={{ ...styles.textStyle, marginLeft: 5 }}>
                            {LeaveDetails?.shift_date ?? ""}
                        </Text>
                    </View>
                    : null
            }

            {
                UserLogin.user_type_id == 2
                    ? <InputValidation
                        uniqueKey={initialKeys.employee}
                        validationObj={validationObj}
                        iconRight="chevron-down"
                        value={formFields?.employee?.name ?? ""}
                        placeHolder={labels['assign_employee']}
                        onPressIcon={() => {
                            setActionSheetDecide(initialKeys.employee);
                            actionSheetRef.current?.setModalVisible();
                        }}
                        style={{ ...styles.InputValidationView, }}
                        inputStyle={{ ...styles.inputStyle }}
                        editable={false}
                    />
                    : null
            }
            {!isEditing
                ? <View style={styles.checkBoxView}>
                    <BouncyCheckbox
                        size={20}
                        fillColor={Colors.primary}
                        unfillColor={Colors.white}
                        iconStyle={{ borderColor: Colors.primary }}
                        isChecked={
                            isEditing
                                ? LeaveDetails?.leave_type == "vacation" ? true : false
                                : formFields.VacationTrip
                        }
                        onPress={(value) => {
                            setFormFields({
                                ...formFields,
                                [initialKeys.VacationTrip]: value,
                            });
                        }}
                    />
                    <Text style={styles.saveAsTemplate}>{labels?.["Vacation-Trip"] ?? "Vacation-Trip"}</Text>
                </View>
                : null
            }

            {/* Reason */}
            <InputValidation
                optional={formFields.VacationTrip}
                uniqueKey={initialKeys.reason}
                validationObj={validationObj}
                multiline={true}
                value={formFields?.reason}
                placeHolder={labels["reason"]}
                onChangeText={text => {
                    handleInputChange(initialKeys.reason, text);
                }}
                style={styles.InputValidationView}
                inputStyle={{ ...styles.inputStyle, height: 110 }}
            />


            {/* next button */}
            <CustomButton
                isLoading={isLoading}
                style={{
                    ...styles.nextButton,
                    backgroundColor: Colors.primary,
                    marginTop: 20
                }}
                onPress={() => {
                    if (validation()) {
                        // console.log('Validation true',);
                        if (UserLogin.user_type_id == 2) {

                            saveAndApproveLeaveByAdmin()
                        } else {
                            saveLeaveEditSchedule()
                        }
                    } else {
                        Alert.showAlert(Constants.warning, labels.message_fill_all_required_fields)
                        // console.log('Validation false');
                    }
                }}
                title={labels["save"]}
            />
        </View>
    )
}

export default LeavesForm

const styles = StyleSheet.create({
    InputValidationView: {
        backgroundColor: Colors.transparent,
        //borderColor: 'red',
        marginTop: 15,
        //borderRadius: 10,
        //color: 'red'
    },
    inputStyle: {
        fontSize: getProportionalFontSize(15),
        fontFamily: Assets.fonts.regular
    },
    checkBoxView: { flexDirection: 'row', alignItems: 'center', marginTop: 15 },
    normalText: {
        fontSize: getProportionalFontSize(15),
        fontFamily: Assets.fonts.regular,
    },
    titleStyle: {
        width: '100%',
        // textAlign: 'center',
        fontSize: getProportionalFontSize(20),
        color: Colors.primary,
        fontFamily: Assets.fonts.semiBold,
        // marginTop: 10
        // borderWidth: 1
    },
    textStyle: {
        // textAlign: "justify",
        fontSize: getProportionalFontSize(12),
        color: Colors.black,
        fontFamily: Assets.fonts.medium,
    },
    saveAsTemplate: { fontSize: getProportionalFontSize(14), fontFamily: Assets.fonts.regular }
})