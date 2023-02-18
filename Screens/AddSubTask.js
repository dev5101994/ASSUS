
import React, { useState } from 'react'
import { StyleSheet, Text, View, ScrollView, FlatList, TouchableOpacity } from 'react-native';
import EmptyList from '../Components/EmptyList';
import Colors from '../Constants/Colors';
import { getProportionalFontSize, getActionSheetAPIDetail, formatDate, formatTime, placeholderCreator, checkUrlFormat, jsCoreDateCreator, formatDateForAPI, formatTimeForAPI } from '../Services/CommonMethods';
import { useSelector, useDispatch } from 'react-redux';
import InputValidation from '../Components/InputValidation';
import CustomButton from '../Components/CustomButton';
import ActionSheet from "react-native-actions-sheet";
import ActionSheetComp from '../Components/ActionSheetComp';
import Constants from '../Constants/Constants';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import ProgressLoader from '../Components/ProgressLoader'
import { Checkbox } from 'react-native-paper';
import BouncyCheckbox from "react-native-bouncy-checkbox";
import Assets from '../Assets/Assets'
import DatePicker from 'react-native-date-picker';
import APIService from '../Services/APIService';
import Alert from '../Components/Alert';
import MSDataViewer from '../Components/MSDataViewer';
import PickerAndLocationServices from '../Services/PickerAndLocationServices'
import ImagePickerActionSheetComp from '../Components/ImagePickerActionSheetComp';

const AddSubTask = (props) => {
    const routeParams = props.route.params ?? {};
    // REDUX hooks
    const UserLogin = useSelector(state => state.User.UserLogin);
    const labels = useSelector(state => state.Labels);
    const messages = useSelector(state => state.Labels);

    const repetitionTypeData = [{ name: labels.day, api_value: "day", id: 1 }, { name: labels.week, api_value: "week", id: 2 }, { name: labels.month, api_value: "month", id: 3 }, { name: labels.year, api_value: "year", id: 4 }]
    const week_days_data = [
        { name: 'S', number: 0, selected: false }, { name: 'M', number: 1, selected: false }, { name: 'T', number: 2, selected: false },
        { name: 'W', number: 3, selected: false }, { name: 'T', number: 4, selected: false },
        { name: 'F', number: 5, selected: false }, { name: 'S', number: 6, selected: false }
    ]
    // Immutable Variables
    const formFieldsKeys = {
        title: 'title',
        description: "description",
        patient: 'patient',
        category: 'category',
        subcategory: 'subcategory',
        employee: 'employee',
        assignEmployee: "assignEmployee",
        start_date: "start_date",
        end_date: "end_date",
        start_time: 'start_time',
        end_time: 'end_time',
        notity_to_users: "notity_to_users",
        remind_after_end: "remind_after_end",
        videoUrl: "videoUrl",
        addressUrl: "addressUrl",
        informationUrl: "informationUrl",
        highPriority: "highPriority",
        shift: "shift",
        repeat: "repeat",
        repetition_type: "repetition_type",
        week_days: "week_days",
        // repetition_time: "repetition_time",
        day_in_month: "day_in_month",
        every: "every",
        implementation_plan: "implementation_plan",
        attachment: "attachment",
        notify_users_before_start_obj: "notify_users_before_start_obj",
        notify_users_after_start_obj: "notify_users_after_start_obj",
        notify_users_in_time_obj: "notify_users_in_time_obj",
        notify_emergency_contact: "notify_emergency_contact",
        reason_for_editing: "reason_for_editing"
    }

    const initialValidationObj = {

        // [formFieldsKeys.reason_for_editing]: {
        //     invalid: false,
        //     title: ''
        // },
        [formFieldsKeys.title]: {
            invalid: false,
            title: ''
        },
        [formFieldsKeys.description]: {
            invalid: false,
            title: ''
        },
        [formFieldsKeys.patient]: {
            invalid: false,
            title: ''
        },
        [formFieldsKeys.category]: {
            invalid: false,
            title: ''
        },
        [formFieldsKeys.subcategory]: {
            invalid: false,
            title: ''
        },
        [formFieldsKeys.employee]: {
            invalid: false,
            title: ''
        },
        [formFieldsKeys.assignEmployee]: {
            invalid: false,
            title: ''
        },
        [formFieldsKeys.start_date]: {
            invalid: false,
            title: ''
        },
        // [formFieldsKeys.end_date]: {
        //     invalid: false,
        //     title: ''
        // },
        [formFieldsKeys.start_time]: {
            invalid: false,
            title: ''
        },
        // [formFieldsKeys.end_time]: {
        //     invalid: false,
        //     title: ''
        // },
        [formFieldsKeys.videoUrl]: {
            invalid: false,
            title: ''
        },
        [formFieldsKeys.addressUrl]: {
            invalid: false,
            title: ''
        },
        [formFieldsKeys.informationUrl]: {
            invalid: false,
            title: ''
        },
        [formFieldsKeys.notify_users_before_start_obj]: {
            invalid: false,
            title: ''
        },
        [formFieldsKeys.notify_users_after_start_obj]: {
            invalid: false,
            title: ''
        },
        [formFieldsKeys.notify_emergency_contact]: {
            invalid: false,
            title: ''
        },
        [formFieldsKeys.week_days]: {
            invalid: false,
            title: ''
        },
        // [formFieldsKeys.repetition_time]: {
        //     invalid: false,
        //     title: ''
        // },
        [formFieldsKeys.every]: {
            invalid: false,
            title: ''
        },
        [formFieldsKeys.repetition_type]: {
            invalid: false,
            title: ''
        },
        [formFieldsKeys.day_in_month]: {
            invalid: false,
            title: ''
        },

    }

    const initialFormFields = {
        reason_for_editing: '',
        title: '',
        description: "",
        patient: {},
        category: {},
        subcategory: {},
        employee: [],
        assignEmployee: false,
        start_date: '',
        end_date: "",
        start_time: '',
        end_time: "",
        notity_to_users: [],
        remind_after_end: [],
        videoUrl: "",
        addressUrl: "",
        informationUrl: "",
        highPriority: false,
        shift: {},
        repeat: false,
        repetition_type: repetitionTypeData[0],
        week_days: week_days_data,
        // repetition_time: "",
        day_in_month: {},
        every: 1,
        implementation_plan: {},
        attachment: "",
        notify_users_before_start_obj: {
            isTrue: false,
            send_notification: true,
            send_text: false,
            time: 10
        },
        notify_users_after_start_obj: {
            isTrue: false,
            send_notification: true,
            send_text: false,
            time: 10
        },
        notify_users_in_time_obj: {
            isTrue: false,
            send_notification: true,
            send_text: false,
            time: 10
        },
        notify_emergency_contact: {
            isTrue: false,
            send_notification: true,
            send_text: false,
            time: 10
        }
    }

    // "type_id" :"1",
    // "title" :"Brush",
    // "parent_id" :"",
    // "description" :"Test",
    // "start_date" :"2021-12-14",
    // "start_time" :"10:00",
    // "is_repeat" :"1",
    // "every" :"3",
    // "repetition_type" :"2",
    // "week_days" :["1","2"],
    // "month_day" :"",
    // "end_date" :"2022-06-15",
    // "end_time" :"2022-06-16 12:00:00",
    // "employees" :["4","33"]

    const testDataCreator = (label) => {

        return [
            { name: label + " 1", id: 1 }, { name: label + " 2", id: 2 }, { name: label + " 3", id: 3 },
            { name: label + " 4", id: 4 }, { name: label + " 5", id: 5 }, { name: label + " 6", id: 6 }
        ]
    }

    const days_in_month_data_creator = () => {
        let data = []
        for (let i = 1; i <= 31; i++) {
            data.push({ name: labels.day_in_month + " " + i, api_value: "" + i, id: '' + i })
        }
        data.push({ name: labels.last_day, api_value: "" + 0, id: '' + 0 })
        return data;
    }

    //Hooks
    const actionSheetRef = React.useRef();

    // useState hooks
    const [isLoading, setIsLoading] = React.useState(false);
    const [formFields, setFormFields] = React.useState({ ...initialFormFields });
    const [validationObj, setValidationObj] = React.useState({ ...initialValidationObj });
    const [actionSheetDecide, setActionSheetDecide] = React.useState('');
    const [openDatePicker, setOpenDatePicker] = React.useState(false);
    const [mode, setMode] = React.useState(Constants.DatePickerModes.date_mode);
    const [datePickerKey, setDatePickerKey] = React.useState(null);
    const [patientListAS, setPatientListAS] = React.useState(getActionSheetAPIDetail({
        url: Constants.apiEndPoints.userList, params: { user_type_id: '6' }, debugMsg: "patientListAS", token: UserLogin.access_token,
        selectedData: [],
    }));
    const [categoryAS, setCategoryAS] = React.useState(getActionSheetAPIDetail({
        url: Constants.apiEndPoints.categoryParentList, params: { "category_type_id": "2", }, debugMsg: "categoryAS", token: UserLogin.access_token,
        selectedData: [],
    }));
    const [subCategoryAS, setSubCategoryAS] = React.useState(getActionSheetAPIDetail({
        // url: '', debugMsg: "subCategoryAS", token: UserLogin.access_token,
        // selectedData: [], data: testDataCreator("subcategory")
    }));
    const [ImplementationPlanAS, setImplementationPlanAS] = React.useState(getActionSheetAPIDetail({
        url: Constants.apiEndPoints.implementationPlanList, debugMsg: "ImplementationPlanAS", token: UserLogin.access_token,
        selectedData: [],
    }));
    const [employeeAS, setEmployeeAS] = React.useState(getActionSheetAPIDetail({
        url: Constants.apiEndPoints.userList, params: { user_type_id: '3' }, debugMsg: "employeeAS", token: UserLogin.access_token,
        selectedData: [],
    }));
    const [notifyBeforeStartAS, setNotifyBeforeStartAS] = React.useState(getActionSheetAPIDetail({
        url: Constants.apiEndPoints.userList, params: { user_type_id: '3' }, debugMsg: "notifyBeforeStartAS", token: UserLogin.access_token,
        selectedData: [],
    }));
    const [notifyAfterEndAS, setNotifyAfterEndAS] = React.useState(getActionSheetAPIDetail({
        url: Constants.apiEndPoints.userList, params: { user_type_id: '3' }, debugMsg: "notifyAfterEndAS", token: UserLogin.access_token,
        selectedData: [],
    }));
    const [shiftAS, setShiftAS] = React.useState(getActionSheetAPIDetail({
        url: Constants.apiEndPoints.workshifts, debugMsg: "shiftAS", token: UserLogin.access_token,
        selectedData: [],
    }));
    const [repetitionTypeAS, setRepetitionTypeAS] = React.useState(getActionSheetAPIDetail({
        url: '', data: repetitionTypeData,
        selectedData: [repetitionTypeData[0]]
    }));
    const [daysInMonthAS, setDaysInMonthAS] = React.useState(getActionSheetAPIDetail({
        url: '', data: days_in_month_data_creator(),
        selectedData: []
    }));
    const [categoryTypeAS, setCategoryTypeAS] = React.useState(getActionSheetAPIDetail({
        url: Constants.apiEndPoints.categoryTypeList, debugMsg: "categoryType", token: UserLogin.access_token,
        selectedData: []
    }));


    // useEffect hooks
    React.useEffect(() => {
        if (routeParams.taskID !== undefined && routeParams.taskID !== null)
            getDetails()
    }, [])

    // Helper Methods

    const getDetails = async () => {
        setIsLoading(true);
        let url = Constants.apiEndPoints.addTask + "/" + routeParams.taskID;
        let response = await APIService.getData(url, UserLogin.access_token, null, "TaskDetailAPI");
        if (!response.errorMsg) {
            // setFollowUpsValues(response.data.payload)
            let week_days_from_api = await response.data.payload.week_days ? JSON.parse(response.data.payload.week_days) : []
            let temp_week_days = [...week_days_data]
            week_days_from_api?.map((num) => {
                temp_week_days.map((obj) => {
                    if (obj.number == num)
                        obj['selected'] = true;
                })
            })

            let employee = []
            response.data.payload.assign_employee?.map((obj) => {
                employee.push(obj.employee)
            })

            setFormFields({
                ...formFields,
                [formFieldsKeys.title]: response.data.payload.title,
                [formFieldsKeys.description]: response.data.payload.description,
                [formFieldsKeys.start_date]: jsCoreDateCreator(response.data.payload.start_date),
                [formFieldsKeys.start_time]: jsCoreDateCreator(response.data.payload.start_time),
                [formFieldsKeys.repeat]: response.data.payload.is_repeat == 1 ? true : false,
                [formFieldsKeys.every]: response.data.payload.every ?? 1,
                [formFieldsKeys.repetition_type]: response.data.payload.is_repeat == 1 ? repetitionTypeData[response.data.payload.repetition_type - 1] : repetitionTypeData[0],
                [formFieldsKeys.week_days]: [...temp_week_days],
                [formFieldsKeys.end_date]: new Date(response.data.payload.end_date),
                [formFieldsKeys.end_time]: new Date(response.data.payload.end_date),
                [formFieldsKeys.employee]: employee,
                [formFieldsKeys.category_type]: response.data.payload.category_type,
            })
            setEmployeeAS({ ...employeeAS, selectedData: employee })
            setCategoryTypeAS({ ...categoryTypeAS, selectedData: [response.data.payload.category_type] })
            setIsLoading(false);
        }
        else {
            setIsLoading(false);
            Alert.showAlert(Constants.danger, response.errorMsg);
        }
    }

    const removeErrorTextForInputThatUserIsTyping = (uniqueKey) => {
        let tempValidationObj = { ...validationObj }
        tempValidationObj[uniqueKey] = initialValidationObj[uniqueKey];
        setValidationObj(tempValidationObj);
    }

    const handleInputChange = (key, value) => {
        setFormFields({ ...formFields, [key]: value })
    }

    const closeActionSheet = () => {
        actionSheetRef?.current?.setModalVisible();
        setActionSheetDecide('');
    }

    const validation = () => {
        // return true;
        let validationObjTemp = { ...initialValidationObj };
        let isValid = true;
        for (const [key, value] of Object.entries(validationObjTemp)) {
            let tempstart_time = new Date(formFields[formFieldsKeys.start_time])
            let tempend_time = new Date(formFields[formFieldsKeys.end_time])
            if (!isNaN(tempstart_time)) {
                tempstart_time.setHours(tempstart_time.getHours(), tempstart_time.getMinutes(), 0, 0)
            }
            if (!isNaN(tempend_time)) {
                tempend_time.setHours(tempend_time.getHours(), tempend_time.getMinutes(), 0, 0)
            }
            if (isThisFieldOptional(key)) {

            }
            else if ((key == formFieldsKeys.start_time && formFields[formFieldsKeys.start_time] && formFields[formFieldsKeys.end_time])
                && (tempend_time <= tempstart_time)) {
                console.log("1", key)
                value['invalid'] = true;
                value['title'] = labels.start_time_greater_message
                isValid = false;
                break;
            }
            //.........................................
            // else if (
            //     (key == formFieldsKeys.every || key == formFieldsKeys.repetition_time) &&
            //     (formFields[key] == '')) {
            //     if (formFields[formFieldsKeys.repeat]) {
            //         console.log('2', key)
            //         value['invalid'] = true;
            //         value['title'] = labels[key + '_required']
            //         //console.log(labels[(key + '_required')]);
            //         isValid = false;
            //         break;
            //     }
            // }
            else if (key == formFieldsKeys.notify_users_before_start_obj || key == formFieldsKeys.notify_users_after_start_obj || key == formFieldsKeys.notify_emergency_contact) {
                if (formFields[key].isTrue && !formFields[key].time) {
                    // console.log('3', key)
                    value['invalid'] = true;
                    value['title'] = labels['minutes_required'];
                    //console.log(labels[(key + '_required')]);
                    isValid = false;
                    break;
                }
            }
            else if (key == formFieldsKeys.repetition_type && !formFields[key].name) {
                if (formFields[formFieldsKeys.repeat]) {
                    // console.log('3', key)
                    value['invalid'] = true;
                    value['title'] = labels[key + '_required']
                    //console.log(labels[(key + '_required')]);
                    isValid = false;
                    break;
                }
            }

            else if (
                (key == formFieldsKeys.week_days)
            ) {
                if (formFields[formFieldsKeys.repeat] && formFields[formFieldsKeys.repetition_type].api_value == "week") {
                    let flag = false;
                    formFields[formFieldsKeys.week_days].map((obj) => {
                        if (obj.selected)
                            flag = true
                    })
                    if (!flag) {
                        // console.log('4', key)
                        value['invalid'] = true;
                        value['title'] = labels[key + '_required']
                        //console.log(labels[(key + '_required')]);
                        isValid = false;
                        break;
                    }
                }
            }
            else if (
                (key == formFieldsKeys.day_in_month)
            ) {
                if (!formFields[key].name && formFields[formFieldsKeys.repeat] && formFields[formFieldsKeys.repetition_type].api_value == "month") {
                    console.log('5', key)
                    value['invalid'] = true;
                    value['title'] = labels[key + '_required']
                    //console.log(labels[(key + '_required')]);
                    isValid = false;
                    break;
                }
            }
            else if (key == formFieldsKeys.description && !formFields[key]) {
                // console.log('6', key)
                value['invalid'] = true;
                value['title'] = labels[key + '_required']
                //console.log(labels[(key + '_required')]);
                isValid = false;
                break;
            }
            // else if (typeof (formFields[key]) == 'object' && !formFields[key].name && key != formFieldsKeys.repetition_time) {
            //     console.log('6', key)
            //     value['invalid'] = true;
            //     value['title'] = labels[key + '_required']
            //     //console.log(labels[(key + '_required')]);
            //     isValid = false;
            //     break;
            //     //return false;
            // }
            //........................................................
            else if (key == formFieldsKeys.employee) {
                if (formFields[key]?.length <= 0
                    // && formFields[formFieldsKeys.assignEmployee]
                ) {
                    // console.log("7", key)
                    value['invalid'] = true;
                    value['title'] = labels[key + '_required']
                    isValid = false;
                    break;
                }
            }
            else if ((key == formFieldsKeys.start_date || key == formFieldsKeys.end_date || key == formFieldsKeys.start_time || key == formFieldsKeys.end_time)
                && !formFields[key]) {
                // console.log("8", key)
                value['invalid'] = true;
                value['title'] = labels[key + '_required']
                isValid = false;
                break;
            }
            else if (key == formFieldsKeys.addressUrl || key == formFieldsKeys.informationUrl || key == formFieldsKeys.videoUrl) {
                if (!formFields[key] || !checkUrlFormat(formFields[key])) {
                    // console.log("9", key)
                    value['invalid'] = true;
                    value['title'] = labels.invalid_url
                    isValid = false;
                    break;
                }
            }
            else if (keysToPreventToNotEnterHere(key) && ((typeof (formFields[key]) == 'object' && !formFields[key].name)
                || (typeof (formFields[key]) == 'string' && !formFields[key]))) {
                // console.log("10", key)
                value['invalid'] = true;
                value['title'] = labels[key + '_required']
                isValid = false;
                break;
            }
        }
        setValidationObj({ ...validationObjTemp });
        return isValid;
    };

    const isThisFieldOptional = (key) => {
        if (key == formFieldsKeys.assignEmployee) {
            return true;
        }
        if (routeParams.resourceID && formFieldsKeys.category_type) {
            return true;
        }
        return false;
    }

    const keysToPreventToNotEnterHere = (key) => {
        if (key == formFieldsKeys.start_date || key == formFieldsKeys.end_date || key == formFieldsKeys.start_time || key == formFieldsKeys.end_time) {
            return false;
        }
        return true;
    }


    const getAPIDetails = () => {
        switch (actionSheetDecide) {
            case formFieldsKeys.patient: {
                return patientListAS
            }
            case formFieldsKeys.category: {
                return categoryAS
            }
            case formFieldsKeys.subcategory: {
                return subCategoryAS
            }
            case formFieldsKeys.employee: {
                return employeeAS
            }
            case formFieldsKeys.remind_after_end: {
                return notifyAfterEndAS
            }
            case formFieldsKeys.implementation_plan: {
                return ImplementationPlanAS
            }
            case formFieldsKeys.notifyBeforeStart: {
                return notifyBeforeStartAS
            }
            case formFieldsKeys.shift: {
                return shiftAS
            }
            case formFieldsKeys.repetition_type: {
                return repetitionTypeAS
            }
            case formFieldsKeys.day_in_month: {
                return daysInMonthAS
            }
            case formFieldsKeys.category_type: {
                return categoryTypeAS
            }
            default: {
                return null
            }
        }
    }

    const changeAPIDetails = (payload) => {
        switch (actionSheetDecide) {
            case formFieldsKeys.patient: {
                setPatientListAS(getActionSheetAPIDetail({ ...patientListAS, ...payload }))
                break;
            }
            case formFieldsKeys.category: {
                setCategoryAS(getActionSheetAPIDetail({ ...categoryAS, ...payload }))
                break;
            }
            case formFieldsKeys.subcategory: {
                setSubCategoryAS(getActionSheetAPIDetail({ ...subCategoryAS, ...payload }))
                break;
            }
            case formFieldsKeys.implementation_plan: {
                setImplementationPlanAS(getActionSheetAPIDetail({ ...ImplementationPlanAS, ...payload }))
                break;
            }
            case formFieldsKeys.employee: {
                setEmployeeAS(getActionSheetAPIDetail({ ...employeeAS, ...payload }))
                break;
            }
            case formFieldsKeys.remind_after_end: {
                setNotifyAfterEndAS(getActionSheetAPIDetail({ ...notifyAfterEndAS, ...payload }))
                break;
            }
            case formFieldsKeys.notifyBeforeStart: {
                setNotifyBeforeStartAS(getActionSheetAPIDetail({ ...notifyBeforeStartAS, ...payload }))
                break;
            }
            case formFieldsKeys.shift: {
                setShiftAS(getActionSheetAPIDetail({ ...shiftAS, ...payload }))
                break;
            }
            case formFieldsKeys.repetition_type: {
                setRepetitionTypeAS(getActionSheetAPIDetail({ ...repetitionTypeAS, ...payload }))
                break;
            }
            case formFieldsKeys.day_in_month: {
                setDaysInMonthAS(getActionSheetAPIDetail({ ...daysInMonthAS, ...payload }))
                break;
            }
            default: {
                break;
            }
        }
    }

    const onPressItem = (item) => {
        switch (actionSheetDecide) {
            case formFieldsKeys.patient: {
                // console.log('item---------------', item)
                handleInputChange(formFieldsKeys.patient, item)
                removeErrorTextForInputThatUserIsTyping(formFieldsKeys.patient)
                setImplementationPlanAS(getActionSheetAPIDetail({
                    ...ImplementationPlanAS, params: { patient_id: item?.id }, debugMsg: "sub-category", token: UserLogin.access_token,
                    selectedData: []
                }))
                break;
            }
            case formFieldsKeys.category: {
                handleInputChange(formFieldsKeys.category, item)
                removeErrorTextForInputThatUserIsTyping(formFieldsKeys.category)
                setSubCategoryAS(getActionSheetAPIDetail({
                    url: Constants.apiEndPoints.categoryChildList, params: { parent_id: item?.id }, debugMsg: "sub-category", token: UserLogin.access_token,
                    selectedData: []
                }))
                break;
            }
            case formFieldsKeys.implementation_plan: {
                handleInputChange(formFieldsKeys.implementation_plan, item)
                removeErrorTextForInputThatUserIsTyping(formFieldsKeys.implementation_plan)
                break;
            }
            case formFieldsKeys.subcategory: {
                handleInputChange(formFieldsKeys.subcategory, item)
                removeErrorTextForInputThatUserIsTyping(formFieldsKeys.subcategory)
                break;
            }
            case formFieldsKeys.category_type: {
                handleInputChange(formFieldsKeys.category_type, item)
                removeErrorTextForInputThatUserIsTyping(formFieldsKeys.category_type)
                break;
            }
            case formFieldsKeys.employee: {
                handleInputChange(formFieldsKeys.employee, item)
                removeErrorTextForInputThatUserIsTyping(formFieldsKeys.employee)
                break;
            }
            case formFieldsKeys.remind_after_end: {
                handleInputChange(formFieldsKeys.remind_after_end, item)
                // removeErrorTextForInputThatUserIsTyping(formFieldsKeys.employee)
                break;
            }
            case formFieldsKeys.notifyBeforeStart: {
                handleInputChange(formFieldsKeys.notifyBeforeStart, item)
                //removeErrorTextForInputThatUserIsTyping(formFieldsKeys.employee)
                break;
            }
            case formFieldsKeys.shift: {
                handleInputChange(formFieldsKeys.shift, item)
                // removeErrorTextForInputThatUserIsTyping(formFieldsKeys.shift)
                break;
            }
            case formFieldsKeys.repetition_type: {
                // handleInputChange(formFieldsKeys.repetition_type, item,)
                setFormFields({
                    ...formFields, [formFieldsKeys.repetition_type]: item, [formFieldsKeys.week_days]: [...week_days_data], [formFieldsKeys.repetition_time]: ''
                    , [formFieldsKeys.day_in_month]: {}
                })
                setDaysInMonthAS({ ...daysInMonthAS, selectedData: [] })
                removeErrorTextForInputThatUserIsTyping(formFieldsKeys.repetition_type)
                break;
            }
            case formFieldsKeys.day_in_month: {
                // handleInputChange(formFieldsKeys.repetition_type, item,)
                setFormFields({ ...formFields, [formFieldsKeys.day_in_month]: item, })
                removeErrorTextForInputThatUserIsTyping(formFieldsKeys.repetition_type)
                break;
            }
            default: {
                break;
            }
        }
    }

    const onConfirmDate = (date) => {
        setOpenDatePicker(false)
        // console.log('date : ', date)
        if (mode == Constants.DatePickerModes.date_mode)
            handleInputChange(datePickerKey, date)
        else if (mode == Constants.DatePickerModes.time_mode)
            handleInputChange(datePickerKey, date)
        else
            handleInputChange(datePickerKey, date)
    }


    const isActionSheetMultiple = () => {
        switch (actionSheetDecide) {
            case formFieldsKeys.remind_after_end: {
                return true;
            }
            case formFieldsKeys.notifyBeforeStart: {
                return true;
            }
            case formFieldsKeys.employee: {
                return true;
            }
            default: {
                return false;
            }
        }
    }

    const saveOrEditTask = async () => {

        let repetition_type = formFields[formFieldsKeys.repeat]
            ? (formFields[formFieldsKeys.repetition_type].api_value == "day"
                ? 1
                : formFields[formFieldsKeys.repetition_type].api_value == "week"
                    ? 2
                    : formFields[formFieldsKeys.repetition_type].api_value == "month"
                        ? 3
                        : formFields[formFieldsKeys.repetition_type].api_value == "year"
                            ? 4
                            : "")
            : "";

        let week_days = []

        formFields[formFieldsKeys.week_days].map((obj) => {
            if (obj.selected) {
                week_days.push('' + obj.number)
            }
        })

        let notify_after_users = []

        // formFields[formFieldsKeys.remind_after_end].map((obj) => {
        //     console.log('obj....after', obj);
        //     notify_after_users.push('' + obj.id)
        // })

        let notify_before_users = []

        // formFields[formFieldsKeys.notity_to_users].map((obj) => {
        //     console.log('obj...before', obj);
        //     notify_before_users.push('' + obj.id)
        // })

        let employees = []

        formFields[formFieldsKeys.employee].map((obj) => {
            // console.log('obj...employees', obj);
            employees.push('' + obj.id)
        })

        let params = {
            // "activity_class_id": "1",
            // "ip_id": formFields[formFieldsKeys.implementation_plan]?.id ?? '',
            // "patient_id": formFields[formFieldsKeys.patient]?.id ?? "",
            // "emp_id": "5",
            // "shift_id": formFields[formFieldsKeys.shift]?.id ?? "",
            // "category_id": formFields[formFieldsKeys.category]?.id,
            // "subcategory_id": formFields[formFieldsKeys.subcategory]?.id,
            "type_id": routeParams?.categoryTypeID ?? formFields[formFieldsKeys.category_type]?.id,
            "resource_id": routeParams.resourceID ?? "",
            "parent_id": "",
            "title": formFields[formFieldsKeys.title],
            "description": formFields[formFieldsKeys.description],
            "is_repeat": formFields[formFieldsKeys.repeat] ? 1 : 0,
            "every": formFields[formFieldsKeys.repeat] ? formFields[formFieldsKeys.every] : "",
            "repetition_type": repetition_type,
            "week_days": week_days,
            "month_day": formFields[formFieldsKeys.day_in_month].api_value,

            "start_date": formFields[formFieldsKeys.start_date] ? formatDateForAPI(formFields[formFieldsKeys.start_date]) : '',
            "start_time": formFields[formFieldsKeys.start_time] ? formatTimeForAPI(formFields[formFieldsKeys.start_time]) : "",

            "end_date": formFields[formFieldsKeys.end_date] ? formatDateForAPI(formFields[formFieldsKeys.end_date]) : '',
            "end_time": formFields[formFieldsKeys.end_time] ? formatTimeForAPI(formFields[formFieldsKeys.end_time]) : "",
            // "external_link": "tser",
            // "notity_to_users": "tser",
            // "remind_before_start": "1",
            // "remind_after_end": "1",
            // "done_by": "siyaa",
            // "not_done_reason": "",
            // "not_applicable_reason": "",
            // "address_url": formFields[formFieldsKeys.addressUrl],
            // "video_url": formFields[formFieldsKeys.videoUrl],
            // "information_url": formFields[formFieldsKeys.informationUrl],
            // "notify_after_users": notify_after_users,
            // "notify_before_users": notify_before_users,
            "employees": employees,
        }

        // console.log("params************", JSON.stringify(params))
        // return;
        setIsLoading(true);
        let url = Constants.apiEndPoints.addTask;

        if (routeParams.taskID)
            url = url + '/' + routeParams.taskID;

        let response = {};

        if (routeParams.taskID)
            response = await APIService.putData(url, params, UserLogin.access_token, null, "editTaskAPI");
        else
            response = await APIService.postData(url, params, UserLogin.access_token, null, "addTaskAPI");

        if (!response.errorMsg) {
            setIsLoading(false);
            Alert.showAlert(Constants.success, routeParams.taskID ? labels.task_edited_successfully : labels.task_added_successfully, () => { props.navigation.pop() })
        }
        else {
            setIsLoading(false);
            Alert.showAlert(Constants.danger, response.errorMsg)
        }
    }

    const imageOrDocumentResponseHandler = (response) => {
        if (response.didCancel) {
            // console.log('User cancelled image picker');
        } else if (response.error) {
            // console.log('ImagePicker Error: ', response.error);
            Alert.showAlert(Constants.error, messages.message_something_went_wrong)
        } else if (response.customButton) {
            // console.log('User tapped custom button: ', response.customButton);
        } else {
            //  this.setState({ avatarSource: response, imagePathText: response.type });
            if (Array.isArray(response) && response.length > 0)
                handleInputChange(formFieldsKeys.attachment, response[0])
            else
                handleInputChange(formFieldsKeys.attachment, response?.assets[0])
        }
    }


    // render view
    // console.log('rou', routeParams)
    if (isLoading)
        return <ProgressLoader />

    return (
        <BaseContainer
            onPressLeftIcon={() => { props.navigation.pop() }}
            leftIcon="arrow-back"
            leftIconSize={24}
            title={labels["add-task"]}
            leftIconColor={Colors.white}
        >

            {/* Main View */}
            <KeyboardAwareScrollView
                style={styles.mainView}>

                {/* reason for editing */}
                {/* {
                routeParams.activityId
                    ? <InputValidation
                        uniqueKey={formFieldsKeys.reason_for_editing}
                        validationObj={validationObj}
                        value={formFields.reason_for_editing}
                        placeHolder={labels["reason-for-editing"]}
                        iconColor={Colors.primary}
                        onChangeText={(text) => {
                            removeErrorTextForInputThatUserIsTyping(formFieldsKeys.reason_for_editing);
                            handleInputChange(formFieldsKeys.reason_for_editing, text)
                        }}
                        style={{ marginTop: Constants.formFieldTopMargin }}
                        inputMainViewStyle={styles.InputValidationView}
                        inputStyle={styles.inputStyle}
                    />
                    : null
                } */}

                {/* title */}
                <InputValidation
                    uniqueKey={formFieldsKeys.title}
                    validationObj={validationObj}
                    value={formFields.title}
                    placeHolder={labels["title"]}
                    iconColor={Colors.primary}
                    onChangeText={(text) => {
                        removeErrorTextForInputThatUserIsTyping(formFieldsKeys.title);
                        handleInputChange(formFieldsKeys.title, text)
                    }}
                    style={{ marginTop: Constants.formFieldTopMargin }}
                    inputMainViewStyle={styles.InputValidationView}
                    inputStyle={styles.inputStyle}
                />

                {/* description */}
                <InputValidation
                    uniqueKey={formFieldsKeys.description}
                    multiline={true}
                    validationObj={validationObj}
                    value={formFields.description}
                    placeHolder={labels["discription"]}
                    iconColor={Colors.primary}
                    onChangeText={(text) => {
                        removeErrorTextForInputThatUserIsTyping(formFieldsKeys.description);
                        handleInputChange(formFieldsKeys.description, text)
                    }}
                    style={{ marginTop: Constants.formFieldTopMargin }}
                    inputMainViewStyle={{ ...styles.InputValidationView, }}
                    inputStyle={{ ...styles.inputStyle, height: 130, textAlignVertical: "top" }}
                />

                {/* patient */}
                <InputValidation
                    uniqueKey={formFieldsKeys.patient}
                    validationObj={validationObj}
                    placeHolder={labels["patient"]}
                    value={formFields.patient?.name ?? ""}
                    iconRight='chevron-down'
                    iconColor={Colors.primary}
                    editable={false}
                    onPressIcon={() => {
                        removeErrorTextForInputThatUserIsTyping(formFieldsKeys.patient)
                        setActionSheetDecide(formFieldsKeys.patient)
                        actionSheetRef.current?.setModalVisible()
                    }}
                    style={{ marginTop: Constants.formFieldTopMargin, }}
                    inputMainViewStyle={styles.InputValidationView}
                    inputStyle={styles.inputStyle}
                />

                {
                    formFields.patient?.name
                        ?
                        //    implementation plan 
                        < InputValidation
                            // uniqueKey={formFieldsKeys.patient}
                            // validationObj={validationObj}
                            placeHolder={labels["ip-modal"]}
                            optional={true}
                            value={formFields.implementation_plan?.what_happened ?? ""}
                            iconRight='chevron-down'
                            iconColor={Colors.primary}
                            editable={false}
                            onPressIcon={() => {
                                removeErrorTextForInputThatUserIsTyping(formFieldsKeys.implementation_plan)
                                setActionSheetDecide(formFieldsKeys.implementation_plan)
                                actionSheetRef.current?.setModalVisible()
                            }}
                            style={{ marginTop: Constants.formFieldTopMargin, }}
                            inputMainViewStyle={styles.InputValidationView}
                            inputStyle={styles.inputStyle}
                        />
                        : null
                }

                {/* category */}
                <InputValidation
                    uniqueKey={formFieldsKeys.category}
                    validationObj={validationObj}
                    placeHolder={labels["category"]}
                    value={formFields.category?.name ?? ""}
                    iconRight='chevron-down'
                    iconColor={Colors.primary}
                    editable={false}
                    onPressIcon={() => {
                        removeErrorTextForInputThatUserIsTyping(formFieldsKeys.category)
                        setActionSheetDecide(formFieldsKeys.category)
                        actionSheetRef.current?.setModalVisible()
                    }}
                    style={{ marginTop: Constants.formFieldTopMargin, }}
                    inputMainViewStyle={styles.InputValidationView}
                    inputStyle={styles.inputStyle}
                />

                {/* subcategory */}
                <InputValidation
                    uniqueKey={formFieldsKeys.subcategory}
                    validationObj={validationObj}
                    placeHolder={labels["subcategory"]}
                    value={formFields.subcategory?.name ?? ""}
                    iconRight='chevron-down'
                    iconColor={Colors.primary}
                    editable={false}
                    onPressIcon={() => {
                        removeErrorTextForInputThatUserIsTyping(formFieldsKeys.subcategory)
                        setActionSheetDecide(formFieldsKeys.subcategory)
                        actionSheetRef.current?.setModalVisible()
                    }}
                    style={{ marginTop: Constants.formFieldTopMargin, }}
                    inputMainViewStyle={styles.InputValidationView}
                    inputStyle={styles.inputStyle}
                />

                {/* shift */}
                {/* <InputValidation
                        optional={true}
                        // uniqueKey={formFieldsKeys.shift}
                        // validationObj={validationObj}
                        placeHolder={labels.shift}
                        value={formFields.shift?.shift_name ?? ""}
                        iconRight='chevron-down'
                        iconColor={Colors.primary}
                        editable={false}
                        onPressIcon={() => {
                            setActionSheetDecide(formFieldsKeys.shift)
                            actionSheetRef.current?.setModalVisible()
                        }}
                        style={{ marginTop: Constants.formFieldTopMargin, }}
                        inputMainViewStyle={styles.InputValidationView}
                        inputStyle={styles.inputStyle}
                    /> */}

                {/* start date */}
                <InputValidation
                    uniqueKey={formFieldsKeys.start_date}
                    validationObj={validationObj}
                    iconRight='calendar'
                    iconColor={Colors.primary}
                    editable={false}
                    onPressIcon={() => {
                        removeErrorTextForInputThatUserIsTyping(formFieldsKeys.start_date)
                        setOpenDatePicker(true);
                        setMode(Constants.DatePickerModes.date_mode);
                        setDatePickerKey(formFieldsKeys.start_date)
                    }}
                    value={formFields.start_date ? formatDate(formFields.start_date) : ''}
                    placeHolder={labels["start-date"]}
                    style={styles.InputValidationView}
                    inputStyle={styles.inputStyle}
                />

                {/* end date */}
                {formFields.start_date
                    ? <InputValidation
                        // uniqueKey={formFieldsKeys.end_date}
                        // validationObj={validationObj}
                        iconRight='calendar'
                        iconColor={Colors.primary}
                        editable={false}
                        onPressIcon={() => {
                            removeErrorTextForInputThatUserIsTyping(formFieldsKeys.end_date)
                            setOpenDatePicker(true);
                            setMode(Constants.DatePickerModes.date_mode);
                            setDatePickerKey(formFieldsKeys.end_date)
                        }}
                        value={formFields.end_date ? formatDate(formFields.end_date) : ''}
                        placeHolder={labels["end-date"]}
                        style={styles.InputValidationView}
                        inputStyle={styles.inputStyle}
                    /> : null}

                {/* start time */}
                <InputValidation
                    uniqueKey={formFieldsKeys.start_time}
                    validationObj={validationObj}

                    iconRight='time'

                    // iconRight='time-sharp'

                    iconColor={Colors.primary}
                    editable={false}
                    onPressIcon={() => {
                        removeErrorTextForInputThatUserIsTyping(formFieldsKeys.start_time)
                        setOpenDatePicker(true);
                        setMode(Constants.DatePickerModes.time_mode);
                        setDatePickerKey(formFieldsKeys.start_time)
                    }}
                    value={formFields.start_time ? formatTime(formFields.start_time) : ''}
                    placeHolder={labels["start-time"]}
                    style={styles.InputValidationView}
                    inputStyle={styles.inputStyle}
                />

                {/* end time */}
                {formFields.start_time
                    ? <InputValidation
                        // uniqueKey={formFieldsKeys.end_time}
                        // validationObj={validationObj}
                        iconRight='time'
                        iconColor={Colors.primary}
                        editable={false}
                        onPressIcon={() => {
                            removeErrorTextForInputThatUserIsTyping(formFieldsKeys.end_time)
                            setOpenDatePicker(true);
                            setMode(Constants.DatePickerModes.time_mode);
                            setDatePickerKey(formFieldsKeys.end_time)
                        }}
                        value={formFields.end_time ? formatTime(formFields.end_time) : ''}
                        placeHolder={labels["end-time"]}
                        style={styles.InputValidationView}
                        inputStyle={styles.inputStyle}
                    /> : null}

                {/* repeat */}
                <View style={styles.checkBoxView}>
                    <BouncyCheckbox
                        size={20}
                        fillColor={Colors.primary}
                        unfillColor={Colors.white}
                        iconStyle={{ borderColor: Colors.primary }}
                        isChecked={formFields.repeat}
                        onPress={(value) => {
                            // handleInputChange(formFieldsKeys.repeat, value,);
                            setFormFields({
                                ...formFields, [formFieldsKeys.repeat]: value, [formFieldsKeys.repetition_type]: repetitionTypeData[0], [formFieldsKeys.week_days]: [...week_days_data], [formFieldsKeys.repetition_time]: ''
                                , [formFieldsKeys.day_in_month]: {}, [formFieldsKeys.every]: 1
                            })
                            setDaysInMonthAS({ ...daysInMonthAS, selectedData: [] })
                            setRepetitionTypeAS(getActionSheetAPIDetail({ ...repetitionTypeAS, selectedData: [repetitionTypeData[0]] }))

                        }}
                    />
                    <Text style={styles.saveAsTemplate}>{labels['repeat']}</Text>
                </View>

                {formFields.repeat
                    ?
                    <>
                        <View style={{ ...styles.checkBoxView, justifyContent: "space-between", marginTop: 0 }}>
                            {/* every */}
                            <InputValidation
                                uniqueKey={formFieldsKeys.every}
                                validationObj={validationObj}
                                value={'' + formFields[formFieldsKeys.every]}
                                keyboardType={'number-pad'}
                                placeHolder={labels["every"]}
                                onChangeText={(text) => {
                                    removeErrorTextForInputThatUserIsTyping(formFieldsKeys.every);
                                    if (text == '')
                                        handleInputChange(formFieldsKeys.every, text);
                                    else {
                                        let tempTextToNumber = Number(text);
                                        if (isNaN(tempTextToNumber)) {
                                            return;
                                        }
                                        handleInputChange(formFieldsKeys.every, tempTextToNumber);
                                    }
                                }}
                                style={{ ...styles.InputValidationView, width: "48%" }}
                                inputStyle={styles.inputStyle}
                            />

                            {/* Repetition type */}
                            <InputValidation
                                iconRight="chevron-down"
                                uniqueKey={formFieldsKeys.repetition_type}
                                validationObj={validationObj}
                                value={formFields[formFieldsKeys.repetition_type].name ? '' + formFields[formFieldsKeys.repetition_type].name : ""}
                                placeHolder={labels["repetition-type"]}
                                onPressIcon={() => {
                                    removeErrorTextForInputThatUserIsTyping(formFieldsKeys.repetition_type)
                                    setActionSheetDecide(formFieldsKeys.repetition_type);
                                    actionSheetRef.current?.setModalVisible()
                                }}
                                style={{ ...styles.InputValidationView, width: "48%" }}
                                inputStyle={{ ...styles.inputStyle }}
                                editable={false}
                            />
                        </View>


                        {
                            formFields[formFieldsKeys.repetition_type].api_value == "week"
                                ? <FlatList
                                    show={false}
                                    contentContainerStyle={{ marginTop: Constants.formFieldTopMargin }}
                                    keyExtractor={(item, index) => item.number}
                                    horizontal
                                    data={formFields.week_days}
                                    renderItem={({ item, index }) => {
                                        return (
                                            <TouchableOpacity
                                                onPress={() => {
                                                    let temp_week_days = [...formFields.week_days]
                                                    temp_week_days.map((obj) => {
                                                        if (item.number == obj.number)
                                                            obj.selected = !obj.selected
                                                    })
                                                    handleInputChange(formFieldsKeys.week_days, [...temp_week_days])
                                                }}
                                                style={{ ...styles.weekCircleView, backgroundColor: item.selected ? Colors.primary : Colors.white }} >
                                                <Text style={{ ...styles.weekText, color: !item.selected ? Colors.primary : Colors.white }}>{item.name}</Text>
                                            </TouchableOpacity>
                                        )
                                    }}
                                />
                                : formFields[formFieldsKeys.repetition_type].api_value == "month"
                                    ?
                                    < InputValidation
                                        iconRight="chevron-down"
                                        uniqueKey={formFieldsKeys.day_in_month}
                                        validationObj={validationObj}
                                        value={formFields[formFieldsKeys.day_in_month].name ? '' + formFields[formFieldsKeys.day_in_month].name : ""}
                                        placeHolder={labels['day']}
                                        onPressIcon={() => {
                                            removeErrorTextForInputThatUserIsTyping(formFieldsKeys.day_in_month)
                                            setActionSheetDecide(formFieldsKeys.day_in_month);
                                            actionSheetRef.current?.setModalVisible()
                                        }}
                                        style={{ ...styles.InputValidationView, }}
                                        inputStyle={{ ...styles.inputStyle }}
                                        editable={false}
                                    />
                                    : null
                        }

                        {/*  time */}
                        {/* <InputValidation
                                iconRight="time-sharp"
                                uniqueKey={formFieldsKeys.repetition_time}
                                validationObj={validationObj}
                                value={formFields[formFieldsKeys.repetition_time] ? formatTime(formFields[formFieldsKeys.repetition_time]) : ""}
                                placeHolder={labels["repetition-days"]}
                                onPressIcon={() => {
                                    setMode(Constants.DatePickerModes.time_mode)
                                    setDatePickerKey(formFieldsKeys.repetition_time)
                                    setOpenDatePicker(true)
                                    removeErrorTextForInputThatUserIsTyping(formFieldsKeys.repetition_time)
                                }}
                                style={styles.InputValidationView}
                                inputStyle={{ ...styles.inputStyle }}
                                editable={false}
                            /> */}
                    </> : null}

                {/* video url */}
                <InputValidation
                    uniqueKey={formFieldsKeys.videoUrl}
                    validationObj={validationObj}
                    placeHolder={labels["video-link"]}
                    value={formFields.videoUrl}
                    iconColor={Colors.primary}
                    onChangeText={(text) => {
                        removeErrorTextForInputThatUserIsTyping(formFieldsKeys.videoUrl)
                        handleInputChange(formFieldsKeys.videoUrl, text)
                    }}
                    style={{ marginTop: Constants.formFieldTopMargin, }}
                    inputMainViewStyle={styles.InputValidationView}
                    inputStyle={styles.inputStyle}
                />

                {/* address url */}
                <InputValidation
                    uniqueKey={formFieldsKeys.addressUrl}
                    validationObj={validationObj}
                    placeHolder={labels["address-link"]}
                    value={formFields.addressUrl}
                    iconColor={Colors.primary}
                    onChangeText={(text) => {
                        removeErrorTextForInputThatUserIsTyping(formFieldsKeys.addressUrl)
                        handleInputChange(formFieldsKeys.addressUrl, text)
                    }}
                    style={{ marginTop: Constants.formFieldTopMargin, }}
                    inputMainViewStyle={styles.InputValidationView}
                    inputStyle={styles.inputStyle}
                />

                {/* information url */}
                <InputValidation
                    uniqueKey={formFieldsKeys.informationUrl}
                    validationObj={validationObj}
                    placeHolder={labels["information-link"]}
                    value={formFields.informationUrl}
                    iconColor={Colors.primary}
                    onChangeText={(text) => {
                        removeErrorTextForInputThatUserIsTyping(formFieldsKeys.informationUrl)
                        handleInputChange(formFieldsKeys.informationUrl, text)
                    }}
                    style={{ marginTop: Constants.formFieldTopMargin, }}
                    inputMainViewStyle={styles.InputValidationView}
                    inputStyle={styles.inputStyle}
                />


                {/* checkbox for notify users before start*/}
                <View style={styles.checkBoxView}>
                    <BouncyCheckbox
                        size={20}
                        fillColor={Colors.primary}
                        unfillColor={Colors.white}
                        iconStyle={{ borderColor: Colors.primary }}
                        isChecked={formFields.notify_users_before_start_obj?.isTrue}
                        onPress={(value) => {
                            handleInputChange(formFieldsKeys.notify_users_before_start_obj, {
                                ... {
                                    isTrue: false,
                                    send_notification: true,
                                    send_text: false,
                                    time: 10
                                }, isTrue: value
                            })
                        }}
                    />
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={styles.saveAsTemplate}>{labels["notify-to-users"]}</Text>
                    </View>
                </View>


                {
                    formFields.notify_users_before_start_obj?.isTrue
                        ?
                        <>
                            <View style={{ ...styles.checkBoxView, marginTop: 5 }}>
                                {/* <BouncyCheckbox
                                        size={20}
                                        fillColor={Colors.primary}
                                        unfillColor={Colors.white}
                                        iconStyle={{ borderColor: Colors.primary }}
                                        isChecked={formFields.notify_users_before_start_obj?.send_notification}
                                        onPress={(value) => {
                                            handleInputChange(formFieldsKeys.notify_users_before_start_obj, {
                                                ...formFields[formFieldsKeys.notify_users_before_start_obj], send_notification: value
                                            })
                                        }}
                                    /> */}
                                <Checkbox
                                    color={Colors.primary}
                                    status={formFields.notify_users_before_start_obj?.send_notification ? 'checked' : 'unchecked'}
                                    onPress={() => {
                                        handleInputChange(formFieldsKeys.notify_users_before_start_obj, {
                                            ...formFields[formFieldsKeys.notify_users_before_start_obj], send_notification: !formFields.notify_users_before_start_obj?.send_notification
                                        })
                                    }}
                                />
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Text style={styles.saveAsTemplate}>{labels["on-device"]}</Text>
                                </View>
                            </View>

                            <View style={{ ...styles.checkBoxView, marginTop: 5 }}>
                                {/* <BouncyCheckbox
                                        size={20}
                                        fillColor={Colors.primary}
                                        unfillColor={Colors.white}
                                        iconStyle={{ borderColor: Colors.primary }}
                                        isChecked={formFields.notify_users_before_start_obj?.send_text}
                                        onPress={(value) => {
                                            handleInputChange(formFieldsKeys.notify_users_before_start_obj, { ...formFields[formFieldsKeys.notify_users_before_start_obj], send_text: value })
                                        }}
                                    /> */}
                                <Checkbox
                                    color={Colors.primary}
                                    status={formFields.notify_users_before_start_obj?.send_text ? 'checked' : 'unchecked'}
                                    onPress={() => {
                                        handleInputChange(formFieldsKeys.notify_users_before_start_obj, {
                                            ...formFields[formFieldsKeys.notify_users_before_start_obj], send_text: !formFields.notify_users_before_start_obj?.send_text
                                        })
                                    }}
                                />
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Text style={styles.saveAsTemplate}>{labels["on-text"]}</Text>
                                </View>
                            </View>

                            <InputValidation
                                uniqueKey={formFieldsKeys.notify_users_before_start_obj}
                                validationObj={validationObj}
                                value={'' + formFields.notify_users_before_start_obj?.time ?? ''}
                                placeHolder={labels["time-in-minute"]}
                                iconColor={Colors.primary}
                                onChangeText={(text) => {
                                    if (text == '') {
                                        removeErrorTextForInputThatUserIsTyping(formFieldsKeys.notify_users_before_start_obj)
                                        handleInputChange(formFieldsKeys.notify_users_before_start_obj, { ...formFields[formFieldsKeys.notify_users_before_start_obj], time: "" })
                                        return;
                                    }
                                    let textToNum = Number(text)
                                    if (!isNaN(textToNum) && !text.includes('.') && textToNum <= 240 && textToNum >= 1) {
                                        removeErrorTextForInputThatUserIsTyping(formFieldsKeys.notify_users_before_start_obj)
                                        // removeErrorTextForInputThatUserIsTyping(formFieldsKeys.title);
                                        handleInputChange(formFieldsKeys.notify_users_before_start_obj, { ...formFields[formFieldsKeys.notify_users_before_start_obj], time: textToNum })
                                    }
                                }}
                                style={{ marginTop: Constants.formFieldTopMargin, width: "50%", marginStart: 7, marginTop: 5 }}
                                inputMainViewStyle={styles.InputValidationView}
                                inputStyle={styles.inputStyle}
                            />

                        </>
                        : null
                }

                {/* checkbox for notify users in time */}
                <View style={styles.checkBoxView}>
                    <BouncyCheckbox
                        size={20}
                        fillColor={Colors.primary}
                        unfillColor={Colors.white}
                        iconStyle={{ borderColor: Colors.primary }}
                        isChecked={formFields.notify_users_in_time_obj?.isTrue}
                        onPress={(value) => {
                            handleInputChange(formFieldsKeys.notify_users_in_time_obj, {
                                ... {
                                    isTrue: false,
                                    send_notification: true,
                                    send_text: false,
                                    time: 10
                                }, isTrue: value
                            })
                        }}
                    />
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={styles.saveAsTemplate}>{labels["you-will-be-reminded-in"]}</Text>
                    </View>
                </View>


                {
                    formFields.notify_users_in_time_obj?.isTrue
                        ?
                        <>
                            <View style={{ ...styles.checkBoxView, marginTop: 5 }}>
                                {/* <BouncyCheckbox
                                        size={20}
                                        fillColor={Colors.primary}
                                        unfillColor={Colors.white}
                                        iconStyle={{ borderColor: Colors.primary }}
                                        isChecked={formFields.notify_users_in_time_obj?.send_notification}
                                        onPress={(value) => {
                                            handleInputChange(formFieldsKeys.notify_users_in_time_obj, {
                                                ...formFields[formFieldsKeys.notify_users_in_time_obj], send_notification: value
                                            })
                                        }}
                                    /> */}
                                <Checkbox
                                    color={Colors.primary}
                                    status={formFields.notify_users_in_time_obj?.send_notification ? 'checked' : 'unchecked'}
                                    onPress={() => {
                                        handleInputChange(formFieldsKeys.notify_users_in_time_obj, {
                                            ...formFields[formFieldsKeys.notify_users_in_time_obj], send_notification: !formFields.notify_users_in_time_obj?.send_notification
                                        })
                                    }}
                                />
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Text style={styles.saveAsTemplate}>{labels["on-device"]}</Text>
                                </View>
                            </View>

                            <View style={{ ...styles.checkBoxView, marginTop: 5 }}>
                                {/* <BouncyCheckbox
                                        size={20}
                                        fillColor={Colors.primary}
                                        unfillColor={Colors.white}
                                        iconStyle={{ borderColor: Colors.primary }}
                                        isChecked={formFields.notify_users_in_time_obj?.send_text}
                                        onPress={(value) => {
                                            handleInputChange(formFieldsKeys.notify_users_in_time_obj, { ...formFields[formFieldsKeys.notify_users_in_time_obj], send_text: value })
                                        }}
                                    /> */}
                                <Checkbox
                                    color={Colors.primary}
                                    status={formFields.notify_users_in_time_obj?.send_text ? 'checked' : 'unchecked'}
                                    onPress={() => {
                                        handleInputChange(formFieldsKeys.notify_users_in_time_obj, {
                                            ...formFields[formFieldsKeys.notify_users_in_time_obj], send_text: !formFields.notify_users_in_time_obj?.send_text
                                        })
                                    }}
                                />
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Text style={styles.saveAsTemplate}>{labels["on-text"]}</Text>
                                </View>
                            </View>

                            {/* <InputValidation
                                    // uniqueKey={formFieldsKeys.title}
                                    // validationObj={validationObj}
                                    value={'' + formFields.notify_users_in_time_obj?.time ?? ''}
                                    placeHolder={labels.minutes}
                                    iconColor={Colors.primary}
                                    onChangeText={(text) => {
                                        if (text == '') {
                                            handleInputChange(formFieldsKeys.notify_users_in_time_obj, { ...formFields[formFieldsKeys.notify_users_in_time_obj], time: text })
                                            return;
                                        }
                                        let textToNum = Number(text)
                                        if (!isNaN(textToNum) && !text.includes('.') && textToNum <= 240) {
                                            // removeErrorTextForInputThatUserIsTyping(formFieldsKeys.title);
                                            handleInputChange(formFieldsKeys.notify_users_in_time_obj, { ...formFields[formFieldsKeys.notify_users_in_time_obj], time: textToNum })
                                        }
                                    }}
                                    style={{ marginTop: Constants.formFieldTopMargin, width: "50%", marginStart: 7 }}
                                    inputMainViewStyle={styles.InputValidationView}
                                    inputStyle={styles.inputStyle}
                                /> */}

                        </>
                        : null
                }


                {/* checkbox for notify users after start*/}
                <View style={styles.checkBoxView}>
                    <BouncyCheckbox
                        size={20}
                        fillColor={Colors.primary}
                        unfillColor={Colors.white}
                        iconStyle={{ borderColor: Colors.primary }}
                        isChecked={formFields.notify_users_after_start_obj?.isTrue}
                        onPress={(value) => {
                            handleInputChange(formFieldsKeys.notify_users_after_start_obj, {
                                ... {
                                    isTrue: false,
                                    send_notification: true,
                                    send_text: false,
                                    time: 10
                                }, isTrue: value
                            })
                        }}
                    />
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={styles.saveAsTemplate}>{labels["you-will-be-reminded-after"]}</Text>
                    </View>
                </View>


                {
                    formFields.notify_users_after_start_obj?.isTrue
                        ?
                        <>
                            <View style={{ ...styles.checkBoxView, marginTop: 5 }}>
                                {/* <BouncyCheckbox
                                        size={20}
                                        fillColor={Colors.primary}
                                        unfillColor={Colors.white}
                                        iconStyle={{ borderColor: Colors.primary }}
                                        isChecked={formFields.notify_users_after_start_obj?.send_notification}
                                        onPress={(value) => {
                                            handleInputChange(formFieldsKeys.notify_users_after_start_obj, {
                                                ...formFields[formFieldsKeys.notify_users_after_start_obj], send_notification: value
                                            })
                                        }}
                                    /> */}
                                <Checkbox
                                    color={Colors.primary}
                                    status={formFields.notify_users_after_start_obj?.send_notification ? 'checked' : 'unchecked'}
                                    onPress={() => {
                                        handleInputChange(formFieldsKeys.notify_users_after_start_obj, {
                                            ...formFields[formFieldsKeys.notify_users_after_start_obj], send_notification: !formFields.notify_users_after_start_obj?.send_notification
                                        })
                                    }}
                                />
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Text style={styles.saveAsTemplate}>{labels["on-device"]}</Text>
                                </View>
                            </View>

                            <View style={{ ...styles.checkBoxView, marginTop: 5 }}>
                                {/* <BouncyCheckbox
                                        size={20}
                                        fillColor={Colors.primary}
                                        unfillColor={Colors.white}
                                        iconStyle={{ borderColor: Colors.primary }}
                                        isChecked={formFields.notify_users_after_start_obj?.send_text}
                                        onPress={(value) => {
                                            handleInputChange(formFieldsKeys.notify_users_after_start_obj, { ...formFields[formFieldsKeys.notify_users_after_start_obj], send_text: value })
                                        }}
                                    /> */}
                                <Checkbox
                                    color={Colors.primary}
                                    status={formFields.notify_users_after_start_obj?.send_text ? 'checked' : 'unchecked'}
                                    onPress={() => {
                                        handleInputChange(formFieldsKeys.notify_users_after_start_obj, {
                                            ...formFields[formFieldsKeys.notify_users_after_start_obj], send_text: !formFields.notify_users_after_start_obj?.send_text
                                        })
                                    }}
                                />
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Text style={styles.saveAsTemplate}>{labels["on-text"]}</Text>
                                </View>
                            </View>

                            <InputValidation
                                uniqueKey={formFieldsKeys.notify_users_after_start_obj}
                                validationObj={validationObj}
                                value={formFields.notify_users_after_start_obj?.time ? '' + formFields.notify_users_after_start_obj?.time : ''}
                                placeHolder={labels["time-in-minute"]}
                                iconColor={Colors.primary}
                                onChangeText={(text) => {
                                    if (text == '') {
                                        removeErrorTextForInputThatUserIsTyping(formFieldsKeys.notify_users_after_start_obj)
                                        handleInputChange(formFieldsKeys.notify_users_after_start_obj, { ...formFields[formFieldsKeys.notify_users_after_start_obj], time: "" })
                                        return;
                                    }
                                    let textToNum = Number(text)
                                    if (!isNaN(textToNum) && !text.includes('.') && textToNum <= 240 && textToNum >= 1) {
                                        removeErrorTextForInputThatUserIsTyping(formFieldsKeys.notify_users_after_start_obj)
                                        // removeErrorTextForInputThatUserIsTyping(formFieldsKeys.title);
                                        handleInputChange(formFieldsKeys.notify_users_after_start_obj, { ...formFields[formFieldsKeys.notify_users_after_start_obj], time: textToNum })
                                    }
                                }}
                                style={{ marginTop: Constants.formFieldTopMargin, width: "50%", marginStart: 7, marginTop: 5 }}
                                inputMainViewStyle={styles.InputValidationView}
                                inputStyle={styles.inputStyle}
                            />

                        </>
                        : null
                }



                {/* checkbox for emergency contact*/}
                <View style={styles.checkBoxView}>
                    <BouncyCheckbox
                        size={20}
                        fillColor={Colors.primary}
                        unfillColor={Colors.white}
                        iconStyle={{ borderColor: Colors.primary }}
                        isChecked={formFields.notify_emergency_contact?.isTrue}
                        onPress={(value) => {
                            handleInputChange(formFieldsKeys.notify_emergency_contact, {
                                ... {
                                    isTrue: false,
                                    send_notification: true,
                                    send_text: false,
                                    time: 10
                                }, isTrue: value
                            })
                        }}
                    />
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={styles.saveAsTemplate}>{labels["remind-on-emergency"]}</Text>
                    </View>
                </View>


                {
                    formFields.notify_emergency_contact?.isTrue
                        ?
                        <>
                            <View style={{ ...styles.checkBoxView, marginTop: 5 }}>
                                {/* <BouncyCheckbox
                                        size={20}
                                        fillColor={Colors.primary}
                                        unfillColor={Colors.white}
                                        iconStyle={{ borderColor: Colors.primary }}
                                        isChecked={formFields.notify_emergency_contact?.send_notification}
                                        onPress={(value) => {
                                            handleInputChange(formFieldsKeys.notify_emergency_contact, {
                                                ...formFields[formFieldsKeys.notify_emergency_contact], send_notification: value
                                            })
                                        }}
                                    /> */}
                                <Checkbox
                                    color={Colors.primary}
                                    status={formFields.notify_emergency_contact?.send_notification ? 'checked' : 'unchecked'}
                                    onPress={() => {
                                        handleInputChange(formFieldsKeys.notify_emergency_contact, {
                                            ...formFields[formFieldsKeys.notify_emergency_contact], send_notification: !formFields.notify_emergency_contact?.send_notification
                                        })
                                    }}
                                />
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Text style={styles.saveAsTemplate}>{labels["on-device"]}</Text>
                                </View>
                            </View>

                            <View style={{ ...styles.checkBoxView, marginTop: 5 }}>
                                {/* <BouncyCheckbox
                                        size={20}
                                        fillColor={Colors.primary}
                                        unfillColor={Colors.white}
                                        iconStyle={{ borderColor: Colors.primary }}
                                        isChecked={formFields.notify_emergency_contact?.send_text}
                                        onPress={(value) => {
                                            handleInputChange(formFieldsKeys.notify_emergency_contact, { ...formFields[formFieldsKeys.notify_emergency_contact], send_text: value })
                                        }}
                                    /> */}
                                <Checkbox
                                    color={Colors.primary}
                                    status={formFields.notify_emergency_contact?.send_text ? 'checked' : 'unchecked'}
                                    onPress={() => {
                                        handleInputChange(formFieldsKeys.notify_emergency_contact, {
                                            ...formFields[formFieldsKeys.notify_emergency_contact], send_text: !formFields.notify_emergency_contact?.send_text
                                        })
                                    }}
                                />
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Text style={styles.saveAsTemplate}>{labels["on-text"]}</Text>
                                </View>
                            </View>

                            <InputValidation
                                uniqueKey={formFieldsKeys.notify_emergency_contact}
                                validationObj={validationObj}
                                value={formFields.notify_emergency_contact?.time ? '' + formFields.notify_emergency_contact?.time : ''}
                                placeHolder={labels["time-in-minute"]}
                                iconColor={Colors.primary}
                                onChangeText={(text) => {
                                    if (text == '') {
                                        removeErrorTextForInputThatUserIsTyping(formFieldsKeys.notify_emergency_contact)
                                        handleInputChange(formFieldsKeys.notify_emergency_contact, { ...formFields[formFieldsKeys.notify_emergency_contact], time: "" })
                                        return;
                                    }
                                    let textToNum = Number(text)
                                    if (!isNaN(textToNum) && !text.includes('.') && textToNum <= 240 && textToNum >= 1) {
                                        removeErrorTextForInputThatUserIsTyping(formFieldsKeys.notify_emergency_contact)
                                        // removeErrorTextForInputThatUserIsTyping(formFieldsKeys.title);
                                        handleInputChange(formFieldsKeys.notify_emergency_contact, { ...formFields[formFieldsKeys.notify_emergency_contact], time: textToNum })
                                    }
                                }}
                                style={{ marginTop: Constants.formFieldTopMargin, width: "50%", marginStart: 7, marginTop: 5 }}
                                inputMainViewStyle={styles.InputValidationView}
                                inputStyle={styles.inputStyle}
                            />

                        </>
                        : null
                }
                {/* notify users before start */}
                {/* <InputValidation
                        optional={true}
                        // uniqueKey={formFieldsKeys.patient}
                        // validationObj={validationObj}
                        placeHolder={labels.notify_users_before_start}
                        value={formFields.notity_to_users}
                        iconRight='chevron-down'
                        iconColor={Colors.primary}
                        editable={false}
                        onPressIcon={() => {
                            setActionSheetDecide(formFieldsKeys.notity_to_users)
                            actionSheetRef.current?.setModalVisible()
                        }}
                        style={{ marginTop: Constants.formFieldTopMargin, }}
                        inputMainViewStyle={styles.InputValidationView}
                        inputStyle={styles.inputStyle}
                    /> */}

                {/* <MSDataViewer
                    data={formFields[formFieldsKeys.notity_to_users]}
                    setNewDataOnPressClose={(newArr) => {
                        setNotifyBeforeStartAS({ ...notifyBeforeStartAS, selectedData: newArr });
                        handleInputChange(formFieldsKeys.notity_to_users, newArr,)
                    }}
                /> */}

                {/* notify users after end */}
                {/* <InputValidation
                        optional={true}
                        // uniqueKey={formFieldsKeys.patient}
                        // validationObj={validationObj}
                        placeHolder={labels.notify_users_after_end}
                        value={formFields.remind_after_end}
                        iconRight='chevron-down'
                        iconColor={Colors.primary}
                        editable={false}
                        onPressIcon={() => {
                            setActionSheetDecide(formFieldsKeys.remind_after_end)
                            actionSheetRef.current?.setModalVisible()
                        }}
                        style={{ marginTop: Constants.formFieldTopMargin, }}
                        inputMainViewStyle={styles.InputValidationView}
                        inputStyle={styles.inputStyle}
                    /> */}

                {/* <MSDataViewer
                    data={formFields[formFieldsKeys.remind_after_end]}
                    setNewDataOnPressClose={(newArr) => {
                        setNotifyAfterEndAS({ ...notifyAfterEndAS, selectedData: newArr });
                        handleInputChange(formFieldsKeys.remind_after_end, newArr,)
                    }}
                /> */}

                {/* checkbox to assign Employee */}
                {/* <View style={styles.checkBoxView}>
                        <BouncyCheckbox
                            size={20}
                            fillColor={Colors.primary}
                            unfillColor={Colors.white}
                            iconStyle={{ borderColor: Colors.primary }}
                            isChecked={formFields.assignEmployee}
                            onPress={(value) => {
                                removeErrorTextForInputThatUserIsTyping(formFieldsKeys.employee)
                                setFormFields({
                                    ...formFields,
                                    [formFieldsKeys.assignEmployee]: value,
                                    [formFieldsKeys.employee]: {},
                                })
                                setEmployeeAS({ ...employeeAS, selectedData: [] })
                            }}
                        />
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={styles.saveAsTemplate}>{labels.assign_employee}</Text>
                        </View>
                    </View> */}

                {/* employee */}
                {/* {formFields.assignEmployee
                        ?  */}
                <InputValidation
                    uniqueKey={formFieldsKeys.employee}
                    validationObj={validationObj}
                    placeHolder={labels["employees"]}
                    value={formFields.employee?.name ?? ""}
                    iconRight='chevron-down'
                    iconColor={Colors.primary}
                    editable={false}
                    onPressIcon={() => {
                        removeErrorTextForInputThatUserIsTyping(formFieldsKeys.employee)
                        setActionSheetDecide(formFieldsKeys.employee)
                        actionSheetRef.current?.setModalVisible()
                    }}
                    style={{ marginTop: Constants.formFieldTopMargin, }}
                    inputMainViewStyle={styles.InputValidationView}
                    inputStyle={styles.inputStyle}
                />
                {/* : null} */}

                <MSDataViewer
                    data={formFields[formFieldsKeys.employee]}
                    setNewDataOnPressClose={(newArr) => {
                        setEmployeeAS({ ...employeeAS, selectedData: newArr });
                        handleInputChange(formFieldsKeys.employee, newArr,)
                    }}
                />

                {/* high priority */}
                {/* <View style={styles.checkBoxView}>
                        <BouncyCheckbox
                            size={20}
                            fillColor={Colors.primary}
                            unfillColor={Colors.white}
                            iconStyle={{ borderColor: Colors.primary }}
                            isChecked={formFields.highPriority}
                            onPress={(value) => {
                                handleInputChange(formFieldsKeys.highPriority, value)
                            }}
                        />
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={styles.saveAsTemplate}>{labels.highPriority}</Text>
                        </View>
                    </View> */}

                {/* attachment  */}
                <View style={{ flexDirection: "row", alignItems: "center", marginTop: Constants.formFieldTopMargin }}>
                    <Text numberOfLines={1} onPress={() => {
                        setActionSheetDecide(formFieldsKeys.attachment)
                        actionSheetRef.current?.setModalVisible()
                    }} style={{ ...styles.attachmentText, flex: 1 }}>{labels["attachments"]}</Text>
                    <Text numberOfLines={1} style={{ ...styles.normalText, flex: 2.5 }}>{formFields[formFieldsKeys.attachment]?.uri ? ` (${formFields[formFieldsKeys.attachment]?.fileName ?? formFields[formFieldsKeys.attachment]?.name})` : ''}</Text>
                </View>

                {/* save button */}
                <CustomButton
                    title={labels["save"]}
                    style={{ marginTop: Constants.formFieldTopMargin }}
                    onPress={async () => {
                        if (validation()) {
                            // console.log('validation success')
                            // return;
                            // saveOrEditActivity()
                            if (formFields.attachment?.uri) {
                                if (formFields.attachment?.editedSameFile) {
                                    saveOrEditTask(formFields.attachment?.fileName ?? formFields.attachment?.name)
                                }
                                else {
                                    let fileName = await uploadFile();
                                    if (fileName)
                                        saveOrEditTask(fileName)
                                }
                            }
                            else {
                                saveOrEditTask()
                            }
                        }
                        else {
                            Alert.showAlert(Constants.warning, messages.message_fill_all_required_fields)
                            // console.log('validation fail')
                        }
                    }}
                />

                <ActionSheet ref={actionSheetRef}>
                    {
                        actionSheetDecide == ''
                            ? null
                            : actionSheetDecide == formFieldsKeys.attachment
                                ? <ImagePickerActionSheetComp
                                    giveChoice={true}
                                    closeSheet={closeActionSheet}
                                    responseHandler={(res) => {
                                        // console.log('responseHandler....res----------------', res)
                                        imageOrDocumentResponseHandler(res)
                                    }}
                                />
                                : <ActionSheetComp
                                    title={labels[actionSheetDecide]}
                                    closeActionSheet={closeActionSheet}
                                    keyToShowData={actionSheetDecide == formFieldsKeys.shift ? "shift_name" : actionSheetDecide == formFieldsKeys.implementation_plan ? "title" : "name"}
                                    keyToCompareData="id"

                                    multiSelect={isActionSheetMultiple()}
                                    APIDetails={getAPIDetails()}
                                    changeAPIDetails={(payload) => changeAPIDetails(payload)}
                                    onPressItem={(item) => onPressItem(item)}
                                />
                    }
                </ActionSheet>

                <DatePicker
                    modal
                    mode={mode}
                    open={openDatePicker}
                    minimumDate={mode == Constants.DatePickerModes.date_mode ? new Date() : null}
                    date={new Date()}
                    onConfirm={(date) => {
                        onConfirmDate(date)
                    }}
                    onCancel={() => {
                        setOpenDatePicker(false)
                    }}
                />
            </KeyboardAwareScrollView>
        </BaseContainer>
    )
}

export default AddSubTask

const styles = StyleSheet.create({
    mainView: {
        flex: 1,
        paddingHorizontal: Constants.globalPaddingHorizontal,
    },

    InputValidationView: {
        backgroundColor: Colors.backgroundColor,
        marginTop: Constants.formFieldTopMargin,
        //borderRadius: 20,
        // paddingHorizontal: 5
    },
    inputStyle: {
        fontSize: getProportionalFontSize(15),
        backgroundColor: Colors.white,
        borderColor: Colors.borderColor,
    },
    checkBoxView: { flexDirection: 'row', alignItems: 'center', marginTop: 30 },
    saveAsTemplate: { fontSize: getProportionalFontSize(13), fontFamily: Assets.fonts.regular },
    weekCircleView: { justifyContent: "center", alignItems: "center", backgroundColor: Colors.primary, borderRadius: 15, height: 40, width: 40, marginStart: 5, borderWidth: 1, borderColor: Colors.primary },
    weekText: {
        fontFamily: Assets.fonts.bold,
        // color: Colors.white,
        // fontSize: getProportionalFontSize(15)
    },
    attachmentText: { fontSize: getProportionalFontSize(15), textDecorationLine: "underline", textDecorationColor: Colors.blue, fontFamily: Assets.fonts.semiBold },
    normalText: { fontSize: getProportionalFontSize(12), color: Colors.gray, fontFamily: Assets.fonts.semiBold }
})

