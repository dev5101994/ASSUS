import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import InputValidation from './InputValidation';
import Colors from '../Constants/Colors';
import Assets from '../Assets/Assets';
import { getProportionalFontSize, getActionSheetAPIDetail, formatDate, formatTime, placeholderCreator, checkUrlFormat, jsCoreDateCreator, getJSObjectFromTimeString, checkFileSize, formatDateByFormat, isDocOrImage } from '../Services/CommonMethods';
import { Checkbox } from 'react-native-paper';
import CustomButton from './CustomButton';
import ActionSheet from "react-native-actions-sheet";
import Constants from "../Constants/Constants";
import Icon from 'react-native-vector-icons/MaterialIcons';
import APIService from '../Services/APIService';
import Alert from './Alert';
import DatePicker from 'react-native-date-picker';
import moment from 'moment';

const ScheduleForm = ({ markedDatesForForm, labels, UserLogin, onRequestClose, navigation, isEditing, scheduleDetails, formValues, DateRange, every_week }) => {

    const initialKeys = {
        "employee": "employee",
        "shift": "shift",
        "shift_dates": "shift_dates",
        "start_time": "start_time",
        "end_time": "end_time",
        "company_type": "company_type",
        "patient": "patient",
    }
    const initialValues = {
        "employee": [],
        "shift": {},
        "start_time": "",
        "end_time": "",
        "company_type": {},
        "patient": {}
        // "shift_dates" : ["03-06-2022","04-06-2022","05-06-2022","06-06-2022","07-06-2022"],
    }
    const initialValidation = {
        [initialKeys.employee]: {
            invalid: false,
            title: ''
        },
        // [initialKeys.shift]: {
        //     invalid: false,
        //     title: ''
        // },
        [initialKeys.start_time]: {
            invalid: false,
            title: ''
        },
        [initialKeys.end_time]: {
            invalid: false,
            title: ''
        },
        [initialKeys.patient]: {
            invalid: false,
            title: ''
        },
    }
    //Hooks
    const actionSheetRef = React.useRef();

    //hooks
    const [formFields, setFormFields] = React.useState({ ...initialValues });
    // console.log("formFields-----", formFields)
    const [actionSheetDecide, setActionSheetDecide] = React.useState('');
    const [validationObj, setValidationObj] = React.useState({ ...initialValidation });
    const [isLoading, setIsLoading] = React.useState(false);
    const [mode, setMode] = React.useState(Constants.DatePickerModes.time_mode);
    const [datePickerKey, setDatePickerKey] = React.useState(null);
    const [openDatePicker, setOpenDatePicker] = React.useState(false);
    const [employeeAS, setEmployeeAS] = React.useState(getActionSheetAPIDetail({
        url: Constants.apiEndPoints.userList, params: { user_type_id: '3' }, debugMsg: "employeeAS", token: UserLogin.access_token,
        selectedData: [],
    }));
    const [workShiftAS, setWorkShiftAS] = React.useState(getActionSheetAPIDetail({
        url: Constants.apiEndPoints.workShifts, debugMsg: "workShiftAS", token: UserLogin.access_token,
        selectedData: [],
    }));
    const [companyTypeListAS, setCompanyTypeListAS] = React.useState(getActionSheetAPIDetail({
        url: Constants.apiEndPoints.companyTypeList, debugMsg: "companyTypeList", token: UserLogin.access_token,
        selectedData: []
    }));
    const [patientListAS, setPatientListAS] = React.useState(getActionSheetAPIDetail({
        url: Constants.apiEndPoints.userList, params: { user_type_id: '6' }, debugMsg: "patientListAS", token: UserLogin.access_token,
        selectedData: [],
    }));

    React.useEffect(() => {
        if (isEditing) {
            // console.log("scheduleDetails.user", scheduleDetails.user)
            let temp = { "shift_name": scheduleDetails?.shift_name, id: scheduleDetails?.shift_id }
            setFormFields({
                ...formFields,
                "employee": scheduleDetails.user,
                "shift": temp,
                "start_time": scheduleDetails?.shift_start_time ? getJSObjectFromTimeString(scheduleDetails?.shift_start_time) : "",
                "end_time": scheduleDetails?.shift_end_time ? getJSObjectFromTimeString(scheduleDetails?.shift_end_time) : "",
            })
            setEmployeeAS({ ...employeeAS, selectedData: [scheduleDetails.user], })
            setWorkShiftAS({ ...workShiftAS, selectedData: [temp] })
        }
    }, [])

    const closeActionSheet = () => {
        actionSheetRef?.current?.setModalVisible();
        setActionSheetDecide('');
    }

    const getAPIDetails = () => {
        switch (actionSheetDecide) {
            case initialKeys.employee: {
                return employeeAS
            }
            case initialKeys.shift: {
                return workShiftAS
            }
            case initialKeys.company_type: {
                return companyTypeListAS
            }
            case initialKeys.patient: {
                return patientListAS
            }
            default: {
                return null
            }
        }
    }

    const changeAPIDetails = (payload) => {
        switch (actionSheetDecide) {
            case initialKeys.employee: {
                setEmployeeAS(getActionSheetAPIDetail({ ...employeeAS, ...payload }))
                break;
            }
            case initialKeys.shift: {
                setWorkShiftAS(getActionSheetAPIDetail({ ...workShiftAS, ...payload }))
                break;
            }
            case initialKeys.company_type: {
                setCompanyTypeListAS(getActionSheetAPIDetail({ ...companyTypeListAS, ...payload }))
                break;
            }
            case initialKeys.patient: {
                setPatientListAS(getActionSheetAPIDetail({ ...patientListAS, ...payload }))
                break;
            }
            default: {
                break;
            }
        }
    }

    const onPressItem = (item) => {
        // console.log('item---------------', item)
        switch (actionSheetDecide) {
            case initialKeys.employee: {
                handleInputChange(initialKeys.employee, item)
                removeErrorTextForInputThatUserIsTyping(initialKeys.employee)
                break;
            }
            case initialKeys.shift: {
                // handleInputChange(initialKeys.shift, item)
                // console.log("hey user your start date is here------", item.shift_start_time ? getJSObjectFromTimeString(item.shift_start_time) : "oops")
                setFormFields(
                    {
                        ...formFields,
                        "shift": item,
                        "start_time": item.shift_start_time ? getJSObjectFromTimeString(item.shift_start_time) : "",
                        "end_time": item.shift_start_time ? getJSObjectFromTimeString(item.shift_start_time) : "",
                    }
                )
                removeErrorTextForInputThatUserIsTyping(initialKeys.shift)
                break;
            }
            case initialKeys.company_type: {
                if (item.id == 1) {
                    setFormFields({ ...formFields, [initialKeys.company_type]: item, [initialKeys.patient]: {} });
                    setPatientListAS(getActionSheetAPIDetail({
                        url: Constants.apiEndPoints.userList, params: { user_type_id: '6' }, debugMsg: "patientListAS", token: UserLogin.access_token,
                        selectedData: [],
                    }))
                } else {
                    handleInputChange(initialKeys.company_type, item);
                }
                removeErrorTextForInputThatUserIsTyping(initialKeys.company_type)

                break;
            }
            case initialKeys.patient: {
                handleInputChange(initialKeys.patient, item)
                removeErrorTextForInputThatUserIsTyping(initialKeys.patient)
                break;
            }
            default: {
                break;
            }
        }
    }

    const handleInputChange = (key, value) => {
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
            // console.log(
            //     "key", key, "formFields?.employee?.length", formFields?.employee?.length
            // )
            if (key == initialKeys.employee && formFields?.employee?.length == 0) {
                // console.log(`${key}-----1`)
                value['invalid'] = true;
                value['title'] = labels[key + '_required']
                isValid = false;
                break;
            }
            // if (key == initialKeys.shift && !formFields?.shift?.shift_name) {
            //     console.log(`${key}-----1`)
            //     value['invalid'] = true;
            //     value['title'] = labels[key + '_required']
            //     isValid = false;
            //     break;
            // }
            if (key == initialKeys.start_time && !formFields?.start_time) {
                // console.log(`${key}-----1`, formFields?.key,)
                value['invalid'] = true;
                value['title'] = labels[key + '_required']
                isValid = false;
                break;
            }
            if (key == initialKeys.end_time && !formFields?.end_time) {
                // console.log(`${key}-----1`, key)
                value['invalid'] = true;
                value['title'] = labels[key + '_required']
                isValid = false;
                break;
            }
            if (key == initialKeys.patient && !formFields?.patient?.id) {
                if (formFields?.company_type?.id != "1") {
                    // console.log(`${key}-----1`, key)
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

    const saveOrEditSchedule = async () => {
        let tempDates = []
        if (DateRange) {
            tempDates = [markedDatesForForm[0], markedDatesForForm[markedDatesForForm.length - 1]]
        }
        let week_days = []
        formValues?.week_days.map((obj) => {
            if (obj.selected) {
                week_days.push("" + obj.number)
            }
        })

        let emp_id = [];
        if (formFields?.employee?.length > 0) {
            formFields?.employee?.map((obj) => {
                emp_id.push(obj.id)
            })
        }
        let params = {
            "is_range": DateRange ? 1 : 0,
            "shift_end_time": formFields?.end_time ? moment(formFields?.end_time).format('hh:mm:ss') : "",
            "shift_start_time": formFields?.start_time ? moment(formFields?.start_time).format('hh:mm:ss') : "",
            "user_id": emp_id,
            "shift_id": formFields?.shift?.id ?? "",
            "week_days": week_days,

            //             company_types: 2
            // entry_mode: "web-0.0.1"
            // is_range: 0
            // is_repeat: 0
            // patient_id: 21
            // shift_dates: ["2022-06-23"]
            // shift_end_time: "22:00"
            // shift_id: 34
            // shift_start_time: "13:00"
            // user_id: [70]
            // week_days: []
        }
        if (!isEditing) {
            params = {
                ...params,
                "shift_dates": DateRange ? tempDates : markedDatesForForm,
                "is_repeat": DateRange ? 1 : 0,
                "every_week": every_week ?? "",
                "company_types": formFields?.company_type?.id ?? "",
                "patient_id": formFields?.patient?.id ?? "",
            }
        } else {
            params = {
                ...params,
                shift_date: markedDatesForForm ?? ""
            }
        }


        let url = Constants.apiEndPoints.addSchedule
        if (isEditing) {
            url = url + "/" + scheduleDetails.id
        }
        // console.log("url", url);
        // console.log("params", params);
        // return
        setIsLoading(true);
        let response = {}
        if (isEditing) {
            response = await APIService.putData(url, params, UserLogin.access_token, null, "editSchedule");
        } else {
            response = await APIService.postData(url, params, UserLogin.access_token, null, "saveSchedule");
        }
        // console.log("data", response.data)
        if (!response.errorMsg) {
            // console.log('response-------------------+++++++++++++', JSON.stringify(response))
            setIsLoading(true);
            onRequestClose()
            navigation.navigate("ScheduleListing", { refresh: true })

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
            // height: "100%"
        }}>
            {/* close icon */}
            <View style={{ width: "100%", alignItems: "flex-end" }} >
                <Icon name='cancel' color={Colors.primary} size={30} onPress={onRequestClose ? () => onRequestClose() : () => { }} />
            </View>


            <Text style={styles.titleStyle}>{labels.create_schedule}</Text>
            {/* <Text numberOfLines={4} style={styles.textStyle} >({labels.selected_dates}: {markedDatesForForm.join(", ")})</Text> */}
            {
                !isEditing
                    ? <><InputValidation
                        uniqueKey={initialKeys.employee}
                        validationObj={validationObj}
                        placeHolder={labels["employees"]}
                        value={formFields.employee?.name ?? ""}
                        iconRight='chevron-down'
                        iconColor={Colors.primary}
                        editable={false}
                        onPressIcon={() => {
                            // removeErrorTextForInputThatUserIsTyping(task_details, initialKeys.employee)
                            setActionSheetDecide(initialKeys.employee)
                            actionSheetRef.current?.setModalVisible()
                        }}
                        style={{ marginTop: Constants.formFieldTopMargin, }}
                        inputMainViewStyle={styles.InputValidationView}
                        inputStyle={styles.inputStyle}
                    />
                        <MSDataViewer
                            data={formFields.employee}
                            setNewDataOnPressClose={(newArr) => {
                                setEmployeeAS({ ...employeeAS, selectedData: newArr });
                                handleInputChange("employee", newArr)
                            }}
                        />
                    </> : null
            }

            <InputValidation
                // uniqueKey={initialKeys.shift}
                // validationObj={validationObj}
                placeHolder={labels["workshifts"]}
                value={formFields.shift?.shift_name ?? ""}
                optional={true}
                iconRight='chevron-down'
                iconColor={Colors.primary}
                editable={false}
                onPressIcon={() => {
                    // removeErrorTextForInputThatUserIsTyping(task_details, initialKeys.employee)
                    setActionSheetDecide(initialKeys.shift)
                    actionSheetRef.current?.setModalVisible()
                }}
                style={{ marginTop: Constants.formFieldTopMargin, }}
                inputMainViewStyle={styles.InputValidationView}
                inputStyle={styles.inputStyle}
            />

            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                {/* Start time */}
                <InputValidation
                    uniqueKey={initialKeys.start_time}
                    validationObj={validationObj}
                    iconRight="time"
                    value={formFields?.start_time ? formatTime(formFields.start_time) : ""}
                    placeHolder={labels['start-time']}
                    onPressIcon={() => {
                        setDatePickerKey("start_time")
                        setOpenDatePicker(true)
                    }}
                    style={{ ...styles.InputValidationView, width: "48%" }}
                    inputStyle={{ ...styles.inputStyle }}
                    editable={false}
                />
                {/* end time */}
                <InputValidation
                    uniqueKey={initialKeys.end_time}
                    validationObj={validationObj}
                    iconRight="time"
                    // optional={true}
                    value={formFields.end_time ? formatTime(formFields.end_time) : ""}
                    placeHolder={labels['end-time']}
                    onPressIcon={() => {
                        setDatePickerKey("end_time")
                        setOpenDatePicker(true)
                    }}
                    style={{ ...styles.InputValidationView, width: "48%" }}
                    inputStyle={{ ...styles.inputStyle }}
                    editable={false}
                />
            </View>
            {
                !isEditing
                    ? <>
                        {/* company types */}
                        <InputValidation
                            value={formFields[initialKeys.company_type]['name'] ?? ''}
                            iconRight='chevron-down'
                            iconColor={Colors.primary}
                            editable={false}
                            optional={true}
                            onPressIcon={() => {
                                setActionSheetDecide(initialKeys.company_type);
                                // removeErrorTextForInputThatUserIsTyping(ipFormKeys.category);
                                actionSheetRef.current?.setModalVisible();
                            }}
                            placeHolder={labels["company-types"]}
                            style={{ marginTop: Constants.formFieldTopMargin, }}
                            size={30}
                            inputMainViewStyle={styles.InputValidationView}
                            inputStyle={styles.inputStyle}
                        />
                        {
                            formFields.company_type.id != 1
                                ? <InputValidation
                                    uniqueKey={initialKeys.patient}
                                    validationObj={validationObj}
                                    placeHolder={labels['patient']}
                                    value={formFields.patient?.name ?? ""}
                                    iconRight='chevron-down'
                                    iconColor={Colors.primary}
                                    editable={false}
                                    onPressIcon={() => {
                                        setActionSheetDecide(initialKeys.patient)
                                        actionSheetRef.current?.setModalVisible()
                                    }}
                                    style={{ marginTop: Constants.formFieldTopMargin, }}
                                    inputMainViewStyle={styles.InputValidationView}
                                    inputStyle={styles.inputStyle}
                                />
                                : null
                        }
                    </>
                    : null
            }



            {/* save button */}
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
                        saveOrEditSchedule()
                    } else {
                        Alert.showAlert(Constants.warning, labels.message_fill_all_required_fields)
                        // console.log('Validation false');
                    }
                }}
                title={labels["add_schedule"]}
            />

            <DatePicker
                modal
                mode={mode}
                open={openDatePicker}
                minimumDate={formFields.start_time ? formFields.start_time : null}
                date={new Date()}
                onConfirm={(date) => {
                    setOpenDatePicker(false)
                    // console.log('date : ', date)
                    let value = '';
                    if (mode == Constants.DatePickerModes.date_mode) {
                        handleInputChange(datePickerKey, date)
                    }
                    else if (mode == Constants.DatePickerModes.time_mode) {
                        setFormFields({ ...formFields, [datePickerKey]: date, "shift": {}, })
                        removeErrorTextForInputThatUserIsTyping(datePickerKey)
                    }
                    else
                        handleInputChange(datePickerKey, date)
                }}
                onCancel={() => {
                    setOpenDatePicker(false)
                }}
            />

            <ActionSheet ref={actionSheetRef}>
                <ActionSheetComp
                    title={labels[actionSheetDecide]}
                    closeActionSheet={closeActionSheet}
                    keyToShowData={actionSheetDecide == initialKeys.shift ? "shift_name" : "name"}
                    keyToCompareData="id"

                    multiSelect={actionSheetDecide == initialKeys.employee ? true : false}
                    APIDetails={getAPIDetails()}
                    changeAPIDetails={(payload) => changeAPIDetails(payload)}
                    onPressItem={(item) => onPressItem(item)}
                />
            </ActionSheet>

        </View>
    )
}

export default ScheduleForm

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
    checkBoxView: { flexDirection: 'row', alignItems: 'center', marginTop: 30 },
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
    }
})