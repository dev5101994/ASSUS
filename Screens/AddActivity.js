
import React, { useState } from 'react'
import { StyleSheet, Text, View, ScrollView, FlatList, TouchableOpacity, Keyboard } from 'react-native';
import EmptyList from '../Components/EmptyList';
import Colors from '../Constants/Colors';
import { getProportionalFontSize, getActionSheetAPIDetail, formatDate, formatTime, placeholderCreator, checkUrlFormat, checkFileSize, getJSObjectFromTimeString, isDocOrImage, formatDateForAPI, formatTimeForAPI } from '../Services/CommonMethods';
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
import Icon from 'react-native-vector-icons/Ionicons';
import FormSubHeader from '../Components/FormSubHeader';
import BaseContainer from '../Components/BaseContainer'
import CommonAPIFunctions from '../Services/CommonAPIFunctions';
import Can from '../can/Can';
import UploadedFileViewer from '../Components/UploadedFileViewer';

const activity_details = "activity_details";
const time_and_repetition = "time_and_repetition";
const reminders = "reminders";
const attachment = "attachment";

const AddActivity = (props) => {
    const routeParams = props.route.params ?? {};
    // console.log("routeParams---------", routeParams)
    // REDUX hooks
    const UserLogin = useSelector(state => state.User.UserLogin);
    const labels = useSelector(state => state.Labels);
    const messages = useSelector(state => state.Labels);
    const permissions = UserLogin?.permissions ?? {}

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
        reason_for_editing: "reason_for_editing",
        is_risk: "is_risk",
        external_comment: "external_comment",
        internal_comment: "internal_comment",
        risk_description: "risk_description",
        how_many_time: "how_many_time",
        how_many_time_array: "how_many_time_array",
        documents: "documents"

    }

    const initialValidationForActivityDetails = {
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
        // [formFieldsKeys.employee]: {
        //     invalid: false,
        //     title: ''
        // },
        // [formFieldsKeys.assignEmployee]: {
        //     invalid: false,
        //     title: ''
        // },
        [formFieldsKeys.risk_description]: {
            invalid: false,
            title: ''
        },
    }
    const initialValidationForTimeAndRepetition = {
        [formFieldsKeys.start_date]: {
            invalid: false,
            title: ''
        },
        // [formFieldsKeys.end_date]: {
        //     invalid: false,
        //     title: ''
        // },
        // [formFieldsKeys.start_time]: {
        //     invalid: false,
        //     title: ''
        // },
        // [formFieldsKeys.end_time]: {
        //     invalid: false,
        //     title: ''
        // },

        [formFieldsKeys.how_many_time_array]: {
            invalid: false,
            title: ''
        },
        [formFieldsKeys.week_days]: {
            invalid: false,
            title: ''
        },
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
    const initialValidationForReminders = {
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
    }
    const initialValidationForAttachment = {

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
        documents: [],
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
        },
        is_risk: false,
        external_comment: "",
        internal_comment: "",
        risk_description: "",
        how_many_time: "1",
        how_many_time_array: [
            {
                "start": "",
                "end": "",
            }
        ]
    }
    const init_howManyTimeArrayValue = {
        "start": "",
        "end": "",
    }
    const init_howManyTimeArrayKey = {
        "start": "start",
        "end": "end"
    }

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
    // console.log("formFields.patient", formFields.implementation_plan)
    const [validationForActivityDetails, setValidationForActivityDetails] = React.useState({ ...initialValidationForActivityDetails });
    const [validationForTimeAndRepetition, setValidationForTimeAndRepetition] = React.useState({ ...initialValidationForTimeAndRepetition });
    const [validationForReminders, setValidationForReminders] = React.useState({ ...initialValidationForReminders });
    const [validationForAttachment, setValidationForAttachment] = React.useState({ ...initialValidationForAttachment });
    const [openDatePickerForRepetition, setOpenDatePickerForRepetition] = React.useState(false);
    const [actionSheetDecide, setActionSheetDecide] = React.useState('');
    const [openDatePicker, setOpenDatePicker] = React.useState(false);
    const [mode, setMode] = React.useState(Constants.DatePickerModes.date_mode);
    const [datePickerKey, setDatePickerKey] = React.useState(null);
    const [viewDecider, setViewDecider] = React.useState(1);
    const [isValid, setIsValid] = React.useState(true);
    const [howManyTimeArray, setHowManyTimeArray] = React.useState([init_howManyTimeArrayValue]);
    const [howManyTimesArrIndexNKey, setHowManyTimesArrIndexNKey] = React.useState({
        index: "",
        key: ""
    });
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
    const [suggestion, setSuggestion] = React.useState([]);
    const [badWords, setBadWords] = React.useState([]);

    const [descrptionSuggestion, setDescrptionSuggestion] = React.useState([]);
    const [externalCommentSuggestion, setExternalCommentSuggestion] = React.useState([]);
    const [internalCommentSuggestion, setInternalCommentSuggestion] = React.useState([]);
    const [patientId, setPatientId] = React.useState();
    const [uploadingFile, setUploadingFile] = React.useState(false);

    // useEffect hooks
    React.useEffect(() => {
        CommonAPIFunctions.getSuggestions(UserLogin.access_token, (data) => { setSuggestion(data) });
        CommonAPIFunctions.getBadWords(UserLogin.access_token, (data) => { setBadWords(data) });
        getActivityDetail()
        getPatientDetail()

    }, [])
    React.useEffect(() => {
        const unsubscribe = props.navigation.addListener('focus', () => {
            // console.log('Focus___________________________________________')
            // console.log("patientID ---", props.route.params)
            getPatientDetail()
            getIPdetails()
        });
        return unsubscribe;
    }, [props?.route?.params]);

    React.useEffect(() => {
        // console.log("--------------------------------2")
        if (formFields?.implementation_plan?.category && formFields?.implementation_plan?.subcategory)
            setFormFields({ ...formFields, [formFieldsKeys.category]: formFields?.implementation_plan?.category, [formFieldsKeys.subcategory]: formFields?.implementation_plan?.subcategory })
    }, [formFields.implementation_plan])

    // Helper Methods
    const removeErrorTextForInputThatUserIsTyping = (formType, uniqueKey) => {
        if (formType == activity_details) {
            let tempValidationObj = { ...initialValidationForActivityDetails }
            tempValidationObj[uniqueKey] = initialValidationForActivityDetails[uniqueKey];
            setValidationForActivityDetails(tempValidationObj);
        }
        else if (formType == time_and_repetition) {
            let tempValidationObj = { ...initialValidationForTimeAndRepetition }
            tempValidationObj[uniqueKey] = initialValidationForTimeAndRepetition[uniqueKey];
            setValidationForTimeAndRepetition(tempValidationObj);
        }
        else if (formType == reminders) {
            let tempValidationObj = { ...initialValidationForReminders }
            tempValidationObj[uniqueKey] = initialValidationForReminders[uniqueKey];
            setValidationForReminders(tempValidationObj);
        }
        else if (formType == attachment) {
            let tempValidationObj = { ...initialValidationForAttachment }
            tempValidationObj[uniqueKey] = initialValidationForAttachment[uniqueKey];
            setValidationForAttachment(tempValidationObj);
        }
    }

    const handleInputChange = (key, value) => {
        if (key == formFieldsKeys.how_many_time_array) {
            let tempData = [...formFields.how_many_time_array];
            tempData[howManyTimesArrIndexNKey.index][howManyTimesArrIndexNKey.key] = value;
            // setFormValues({ ...formValues, [key]: tempData })
            setFormFields({ ...formFields, [key]: tempData })
        }

        else
            //     setFormValues({ ...formValues, [key]: value })
            setFormFields({ ...formFields, [key]: value })

    }

    const closeActionSheet = () => {
        actionSheetRef?.current?.setModalVisible();
        setActionSheetDecide('');
    }

    const filterSuggestion = (query, setFilteredData) => {
        if (query) {
            // Making a case insensitive regular expression
            const regex = new RegExp(`${query.trim()}`, 'i');
            // Setting the filtered film array according the query
            if (setFilteredData)
                setFilteredData(suggestion.filter((suggestion) => suggestion?.paragraph?.search(regex) >= 0))
        } else {
            // If the query is null then return blank
            if (setFilteredData)
                setFilteredData([])
        }
    }

    const getBadWordString = () => {
        let result = '';
        for (let i = 0; i < badWords?.length; i++) {
            let currBadWord = badWords[i]?.name?.toLowerCase();

            if (formFields?.title?.toLowerCase()?.includes(currBadWord)
                || formFields?.description?.toLowerCase()?.includes(currBadWord)
                || formFields?.external_comment?.toLowerCase()?.includes(currBadWord)
                || formFields?.internal_comment?.toLowerCase()?.includes(currBadWord)
                || formFields?.videoUrl?.toLowerCase()?.includes(currBadWord)
                || formFields?.addressUrl?.toLowerCase()?.includes(currBadWord)
                || formFields?.informationUrl?.toLowerCase()?.includes(currBadWord)
            ) {
                if (!result?.toLowerCase()?.includes(currBadWord))
                    result = result + badWords[i]?.name + ", ";
            }
        }
        if (result)
            result = result?.substring(0, result?.length - 2);
        return result;
    }

    const validation = (formType) => {
        if (formType == activity_details) {
            let validationObjTemp = { ...initialValidationForActivityDetails };
            let isValid = true;
            for (const [key, value] of Object.entries(validationObjTemp)) {
                // console.log("============valid", key, ":", value)
                if (key == formFieldsKeys.reason_for_editing && routeParams.activityId && !formFields[key]) {
                    // console.log(`${key}-----1`)
                    value['invalid'] = true;
                    value['title'] = labels[key + '_required']
                    isValid = false;
                    break;
                }
                if (key == formFieldsKeys.title && formFields[key] == "") {
                    // console.log(`${key}-----2`)
                    value['invalid'] = true;
                    value['title'] = labels[key + '_required']
                    isValid = false;
                    break;
                }

                if (key == "risk_description") {
                    if (formFields.is_risk && !formFields.risk_description) {
                        // console.log(`${key}-----3d`)
                        value['invalid'] = true;
                        value['title'] = labels[key + '_required']
                        isValid = false;
                        break;
                    } else {
                        continue
                    }
                }
                if ((typeof (formFields[key]) == 'object' && !formFields[key].name)
                    || (typeof (formFields[key]) == 'string' && !formFields[key])) {
                    if (key == formFieldsKeys.reason_for_editing) {
                        if (routeParams.activityId) {
                            // console.log(`${key}-----3`)
                            value['invalid'] = true;
                            value['title'] = labels[key + '_required']
                            isValid = false;
                            break;
                        }

                    }
                    else if (key == formFieldsKeys.employee) {
                        if (formFields.employee.length == 0) {
                            // console.log(`${key}-----4`)
                            // console.log(`${formFields.employee.length}-----4e`)
                            value['invalid'] = true;
                            value['title'] = labels[key + '_required']
                            isValid = false;
                            break;
                        }

                    }
                    else {
                        // console.log(`${key}-----5`)
                        // console.log(`${formFields[key]}-----4a`)
                        value['invalid'] = true;
                        value['title'] = labels[key + '_required']
                        isValid = false;
                        break;
                    }


                }
            }
            setValidationForActivityDetails({ ...validationObjTemp });
            // return false
            return isValid;
        }
        if (formType == time_and_repetition) {
            let validationObjTemp = { ...initialValidationForTimeAndRepetition };
            let isValid = true;
            for (const [key, value] of Object.entries(validationObjTemp)) {
                // console.log("============valid", key, ":", value)
                let tempstart_time = new Date(formFields[formFieldsKeys.start_time])
                let tempend_time = new Date(formFields[formFieldsKeys.end_time])
                if (key == formFieldsKeys?.how_many_time_array) {
                    let flag = false;
                    let isEndTimeGreaterThanStartTime = false;
                    formFields[key].map((obj) => {
                        if (!obj?.start)
                            flag = true;
                        else if (obj?.start && obj?.end && obj?.end?.getTime() <= obj?.start?.getTime())
                            isEndTimeGreaterThanStartTime = true;
                    })
                    if (flag) {
                        // console.log('1', key)
                        value['invalid'] = true;
                        value['title'] = labels?.["plan_start_time_required"]
                        //console.log(labels[(key + '_required')]);
                        isValid = false;
                        break;
                    }
                    else if (isEndTimeGreaterThanStartTime) {
                        // console.log('1', key)
                        value['invalid'] = true;
                        value['title'] = labels?.["start_time_invalid_msg"]
                        //console.log(labels[(key + '_required')]);
                        isValid = false;
                        break;
                    }
                }

                if (!isNaN(tempstart_time)) {
                    tempstart_time.setHours(tempstart_time.getHours(), tempstart_time.getMinutes(), 0, 0)
                }
                if (!isNaN(tempend_time)) {
                    tempend_time.setHours(tempend_time.getHours(), tempend_time.getMinutes(), 0, 0)
                }
                if ((key == formFieldsKeys.start_time && formFields[formFieldsKeys.start_time] && formFields[formFieldsKeys.end_time])
                    && (tempend_time <= tempstart_time)) {
                    // console.log(`${key}-----6`)
                    value['invalid'] = true;
                    value['title'] = labels.start_time_greater_message
                    isValid = false;
                    break;
                }
                else if (key == formFieldsKeys.repetition_type && !formFields[key].name) {
                    if (formFields[formFieldsKeys.repeat] && formFields[formFieldsKeys.end_date]) {
                        // console.log(`${key}-----7`)
                        value['invalid'] = true;
                        value['title'] = labels[key + '_required']
                        ////console.log(labels[(key + '_required')]);
                        isValid = false;
                        break;
                    }
                }
                if (key == formFieldsKeys.every && !formFields[formFieldsKeys.every]) {
                    if (formFields[formFieldsKeys.repeat]) {
                        // console.log(`${key}-----7`)
                        value['invalid'] = true;
                        value['title'] = labels[key + '_required']
                        ////console.log(labels[(key + '_required')]);
                        isValid = false;
                        break;
                    }
                }

                else if (
                    (key == formFieldsKeys.week_days)
                ) {
                    if (formFields[formFieldsKeys.repeat] && formFields[formFieldsKeys.end_date] && formFields[formFieldsKeys.repetition_type].api_value == "week") {
                        let flag = false;
                        formFields[formFieldsKeys.week_days].map((obj) => {
                            if (obj.selected)
                                flag = true
                        })
                        if (!flag) {
                            // console.log(`${key}-----8`)
                            value['invalid'] = true;
                            value['title'] = labels[key + '_required']
                            ////console.log(labels[(key + '_required')]);
                            isValid = false;
                            break;
                        }
                    }
                }
                else if (
                    (key == formFieldsKeys.day_in_month)
                ) {
                    if (!formFields[key].name && formFields[formFieldsKeys.repeat] && formFields[formFieldsKeys.end_date] && formFields[formFieldsKeys.repetition_type].api_value == "month") {
                        // console.log(`${key}-----9`)
                        value['invalid'] = true;
                        value['title'] = labels[key + '_required']
                        ////console.log(labels[(key + '_required')]);
                        isValid = false;
                        break;
                    }
                }
                else if ((key == formFieldsKeys.start_date || key == formFieldsKeys.end_date || key == formFieldsKeys.start_time || key == formFieldsKeys.end_time)
                    && !formFields[key]) {
                    // console.log(`${key}-----10`)
                    value['invalid'] = true;
                    value['title'] = labels[key + '_required']
                    isValid = false;
                    break;
                }
            }
            setValidationForTimeAndRepetition({ ...validationObjTemp });
            return isValid;
        }
        if (formType == reminders) {
            let validationObjTemp = { ...initialValidationForReminders };
            let isValid = true;
            for (const [key, value] of Object.entries(validationObjTemp)) {
                // console.log("============valid", key, ":", value)
                if (key == formFieldsKeys.notify_users_before_start_obj || key == formFieldsKeys.notify_users_after_start_obj || key == formFieldsKeys.notify_emergency_contact) {
                    if (formFields[key].isTrue && !formFields[key].time) {
                        // //console.log('3', key)
                        value['invalid'] = true;
                        value['title'] = labels['minutes_required'];
                        ////console.log(labels[(key + '_required')]);
                        isValid = false;
                        break;
                    }
                }
            }
            setValidationForReminders({ ...validationObjTemp });
            return isValid;
        }

        if (formType == attachment) {
            let validationObjTemp = { ...initialValidationForAttachment };
            let isValid = true;
            for (const [key, value] of Object.entries(validationObjTemp)) {
                // console.log("============valid", key, ":", value)
                if (key == formFieldsKeys.addressUrl || key == formFieldsKeys.informationUrl || key == formFieldsKeys.videoUrl) {
                    if (formFields[key] && !checkUrlFormat(formFields[key])) {
                        //console.log("9", key)
                        value['invalid'] = true;
                        value['title'] = labels.invalid_url
                        isValid = false;
                        break;
                    }
                }
            }
            setValidationForAttachment({ ...validationObjTemp });
            return isValid;
        }
    };

    const isThisFieldOptional = (key) => {
        if (key == formFieldsKeys.assignEmployee) {
            return true;
        }
        if (key == formFieldsKeys.reason_for_editing && !routeParams.activityId)
            return true;
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
                // handleInputChange(formFieldsKeys.patient, item)
                setFormFields({ ...formFields, [formFieldsKeys.patient]: item, [formFieldsKeys.implementation_plan]: "", })
                removeErrorTextForInputThatUserIsTyping(activity_details, formFieldsKeys.patient)
                // setImplementationPlanAS(getActionSheetAPIDetail({
                //     ...ImplementationPlanAS, params: { user_id: item?.id }, debugMsg: "Ip", token: UserLogin.access_token,
                //     selectedData: []
                // }))
                setImplementationPlanAS(getActionSheetAPIDetail({
                    url: Constants.apiEndPoints.implementationPlanList, params: { user_id: item?.id }, debugMsg: "ImplementationPlanAS", token: UserLogin.access_token,
                    selectedData: [],
                }))
                break;

            }
            case formFieldsKeys.category: {
                handleInputChange(formFieldsKeys.category, item)
                removeErrorTextForInputThatUserIsTyping(activity_details, formFieldsKeys.category)
                setSubCategoryAS(getActionSheetAPIDetail({
                    url: Constants.apiEndPoints.categoryChildList, params: { parent_id: item?.id }, debugMsg: "sub-category", token: UserLogin.access_token,
                    selectedData: []
                }))
                break;
            }
            case formFieldsKeys.implementation_plan: {
                // handleInputChange(formFieldsKeys.implementation_plan, item)
                setFormFields({ ...formFields, [formFieldsKeys.implementation_plan]: item, [formFieldsKeys.category]: "", [formFieldsKeys.subcategory]: "" })
                removeErrorTextForInputThatUserIsTyping(activity_details, formFieldsKeys.implementation_plan)
                break;
            }
            case formFieldsKeys.subcategory: {
                handleInputChange(formFieldsKeys.subcategory, item)
                removeErrorTextForInputThatUserIsTyping(activity_details, formFieldsKeys.subcategory)
                break;
            }
            case formFieldsKeys.employee: {
                handleInputChange(formFieldsKeys.employee, item)
                removeErrorTextForInputThatUserIsTyping(activity_details, formFieldsKeys.employee)
                break;
            }
            case formFieldsKeys.remind_after_end: {
                handleInputChange(formFieldsKeys.remind_after_end, item)
                // removeErrorTextForInputThatUserIsTyping(activity_details,formFieldsKeys.employee)
                break;
            }
            case formFieldsKeys.notifyBeforeStart: {
                handleInputChange(formFieldsKeys.notifyBeforeStart, item)
                //removeErrorTextForInputThatUserIsTyping(activity_details,formFieldsKeys.employee)
                break;
            }
            case formFieldsKeys.shift: {
                handleInputChange(formFieldsKeys.shift, item)
                // removeErrorTextForInputThatUserIsTyping(activity_details,formFieldsKeys.shift)
                break;
            }
            case formFieldsKeys.repetition_type: {
                // handleInputChange(formFieldsKeys.repetition_type, item,)
                setFormFields({
                    ...formFields, [formFieldsKeys.repetition_type]: item, [formFieldsKeys.week_days]: [...week_days_data], [formFieldsKeys.repetition_time]: ''
                    , [formFieldsKeys.day_in_month]: {}
                })
                setDaysInMonthAS({ ...daysInMonthAS, selectedData: [] })
                removeErrorTextForInputThatUserIsTyping(time_and_repetition, formFieldsKeys.repetition_type)
                break;
            }
            case formFieldsKeys.day_in_month: {
                // handleInputChange(formFieldsKeys.repetition_type, item,)
                setFormFields({ ...formFields, [formFieldsKeys.day_in_month]: item, })
                removeErrorTextForInputThatUserIsTyping(time_and_repetition, formFieldsKeys.repetition_type)
                break;
            }
            default: {
                break;
            }
        }
    }

    const onConfirmDate = (date) => {
        setOpenDatePicker(false)
        //console.log('date : ', date)
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

    const uploadFile = async (attachmentObj) => {
        // if (!checkFileSize(attachmentObj))
        //     return;
        setUploadingFile(true)
        let res = await APIService.uploadFile(Constants.apiEndPoints.uploadDoc, attachmentObj, UserLogin.access_token, 'activity_attachment_', 'single', 'activity attachment')
        setUploadingFile(false)
        if (res.errorMsg) {
            Alert.showAlert(Constants.danger, res.errorMsg)
            return null;
        }
        else {
            Alert.showAlert(Constants.success, messages.message_uploaded_successfully)
            return res.data.payload;
        }
    }


    const saveOrEditActivity = async () => {

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

        formFields[formFieldsKeys.remind_after_end].map((obj) => {
            //console.log('obj....after', obj);
            notify_after_users.push('' + obj.id)
        })

        let notify_before_users = []

        formFields[formFieldsKeys.notity_to_users].map((obj) => {
            //console.log('obj...before', obj);
            notify_before_users.push('' + obj.id)
        })

        let employees = []

        formFields[formFieldsKeys.employee].map((obj) => {
            //console.log('obj...employees', obj);
            employees.push('' + obj.id)
        })

        let how_many_time_array_for_api = []

        formFields[formFieldsKeys.how_many_time_array].map((obj) => {
            let tempObj = {};
            tempObj['start'] = obj.start ? formatTimeForAPI(obj.start) : null
            tempObj['end'] = obj.end ? formatTimeForAPI(obj.end) : null
            how_many_time_array_for_api.push(tempObj);
        })

        let params = {
            "ip_id": formFields[formFieldsKeys.implementation_plan]?.id ?? '',
            "patient_id": formFields[formFieldsKeys.patient]?.id ?? "",
            "category_id": formFields[formFieldsKeys.category]?.id,
            "subcategory_id": formFields[formFieldsKeys.subcategory]?.id,
            "title": formFields[formFieldsKeys.title],
            "description": formFields[formFieldsKeys.description],
            "start_date": formFields[formFieldsKeys.start_date] ? formatDateForAPI(formFields[formFieldsKeys.start_date]) : null,
            "how_many_time": formFields[formFieldsKeys.how_many_time],
            "how_many_time_array": how_many_time_array_for_api,
            "is_repeat": formFields[formFieldsKeys.end_date] ? (formFields[formFieldsKeys.repeat] ? 1 : 0) : 0,
            "repetition_type": formFields[formFieldsKeys.end_date] ? repetition_type : "",
            "every": formFields[formFieldsKeys.repeat] && formFields[formFieldsKeys.end_date] ? formFields[formFieldsKeys.every] : "",
            "repeat_dates": [],// ["2022-04-12", "2022-05-12", "2022-08-12", "2022-09-09"],//
            "end_date": formFields[formFieldsKeys.end_date] ? formatDateForAPI(formFields[formFieldsKeys.end_date]) : null,
            "address_url": formFields[formFieldsKeys.addressUrl],
            "video_url": formFields[formFieldsKeys.videoUrl],
            "information_url": formFields[formFieldsKeys.informationUrl],
            "file": formFields.documents?.length > 0 ? formFields.documents[0].uploaded_doc_url : '',
            "remind_before_start": formFields.notify_users_before_start_obj.isTrue ? 1 : 0,
            "before_minutes": formFields.notify_users_before_start_obj.isTrue ? formFields.notify_users_before_start_obj.time : "",
            "before_is_text_notify": formFields.notify_users_before_start_obj.send_text ? 1 : 0,
            "before_is_push_notify": formFields.notify_users_before_start_obj.send_notification ? 1 : 0,
            "remind_after_end": formFields.notify_users_after_start_obj.isTrue ? 1 : 0,
            "after_minutes": formFields.notify_users_after_start_obj.isTrue ? formFields.notify_users_after_start_obj.time : "",
            "after_is_text_notify": formFields.notify_users_after_start_obj.send_text ? 1 : 0,
            "after_is_push_notify": formFields.notify_users_after_start_obj.send_notification ? 1 : 0,
            "is_emergency": formFields.notify_emergency_contact.isTrue ? 1 : 0,
            "emergency_minutes": formFields.notify_emergency_contact.isTrue ? formFields.notify_emergency_contact.time : "",
            "emergency_is_text_notify": formFields.notify_emergency_contact.send_text ? 1 : 0,
            "emergency_is_push_notify": formFields.notify_emergency_contact.send_notification ? 1 : 0,
            "in_time": formFields.notify_users_in_time_obj.isTrue ? 1 : 0,
            "in_time_is_text_notify": formFields.notify_users_in_time_obj.send_text ? 1 : 0,
            "in_time_is_push_notify": formFields.notify_users_in_time_obj.send_notification ? 1 : 0,
            "is_risk": formFields.is_risk,
            "is_compulsory": formFields?.highPriority ?? "",
            "employees": employees,
            "external_comment": formFields.external_comment,
            "internal_comment": formFields.internal_comment,
            // "activity_class_id": "1",
            // "emp_id": "5",
            // "shift_id": formFields[formFieldsKeys.shift]?.id ?? "",
            // "start_time": formFields[formFieldsKeys.start_time],
            // "week_days": formFields[formFieldsKeys.end_date] ? week_days : [],
            // "month_day": formFields[formFieldsKeys.end_date] ? formFields[formFieldsKeys.day_in_month].api_value : "",
            // "end_time": formFields[formFieldsKeys.end_time],
            // "notify_after_users": notify_after_users,
            // "notify_before_users": notify_before_users,           
            // "task": null,
        }

        // console.log("params************", JSON.stringify(params))
        // return;
        setIsLoading(true);
        let url = Constants.apiEndPoints.addActivity;

        if (routeParams.activityId) {
            url = url + '/' + routeParams.activityId;
            params['reason_for_editing'] = formFields.reason_for_editing;
        }

        let response = {};


        if (routeParams.activityId)
            response = await APIService.putData(url, params, UserLogin.access_token, null, "editActivityAPI");
        else
            response = await APIService.postData(url, params, UserLogin.access_token, null, "addActivityAPI");

        if (!response.errorMsg) {
            setIsLoading(false);
            Alert.showAlert(Constants.success, routeParams.activityId ? labels.activity_edited_successfully : labels.activity_added_successfully, () => { props.navigation.pop() })
        }
        else {
            setIsLoading(false);
            Alert.showAlert(Constants.danger, response.errorMsg)
        }
    }

    const getIPdetails = async () => {
        if (!routeParams.ipID) {
            return;
        }
        setIsLoading(true);
        let url = Constants.apiEndPoints.implementationPlan + "/" + routeParams.ipID;
        let response = await APIService.getData(url, UserLogin.access_token, null, "getIpDetailAPI");
        // console.log(" IP response---------", JSON.stringify(response.data.payload))
        if (!response.errorMsg) {
            handleInputChange(formFieldsKeys.implementation_plan, response.data.payload);
            setPatientListAS({ ...patientListAS, selectedData: [response.data.payload] })
            setIsLoading(false);
        }
        else {
            setIsLoading(false);
            Alert.showAlert(Constants.danger, response.errorMsg);
        }
    }

    const getPatientDetail = async () => {
        if (!routeParams?.patientID) {
            return;
        }

        setIsLoading(true);

        let url = Constants.apiEndPoints.userView + "/" + routeParams?.patientID;

        let response = await APIService.getData(url, UserLogin.access_token, null, "getPatientDetailAPI");
        // console.log("patient response---------", JSON.stringify(response.data.payload))
        if (!response.errorMsg) {
            handleInputChange(formFieldsKeys.patient, response.data.payload);
            setPatientListAS({ ...patientListAS, selectedData: [response.data.payload] })
            setImplementationPlanAS(getActionSheetAPIDetail({
                url: Constants.apiEndPoints.implementationPlanList, params: { user_id: response.data.payload?.id }, debugMsg: "ImplementationPlanAS", token: UserLogin.access_token,
                selectedData: [],
            }))
            setIsLoading(false);
            // getImplementationDetail(response.data.payload)
            // setIsPer(false);
        }
        else {
            setIsLoading(false);
            Alert.showAlert(Constants.danger, response.errorMsg);
        }
    }

    const getActivityDetail = async () => {

        if (!routeParams.activityId)
            return;

        setIsLoading(true);

        let url = Constants.apiEndPoints.addActivity + "/" + routeParams.activityId;
        let response = await APIService.getData(url, UserLogin.access_token, null, "getActivityDetailAPI");
        // console.log("response>>>>>>>>>>>>>>>>>>>>>>>", JSON.stringify(response));
        // console.log("-------response.data.payload.category-------", response.data.payload.category)
        if (!response.errorMsg) {
            let employee = []
            response.data.payload.assign_employee.map((obj) => {
                employee.push(obj.employee)
            })
            let week_days_from_api = await response.data.payload.week_days ? JSON.parse(response.data.payload.week_days) : []
            let temp_week_days = [...week_days_data]
            week_days_from_api?.map((num) => {
                temp_week_days.map((obj) => {
                    if (obj.number == num)
                        obj['selected'] = true;
                })
            })
            setFormFields({
                ...formFields,
                title: response.data.payload.title,
                description: response.data.payload.description,
                patient: response.data.payload.patient ?? {},
                category: response.data.payload.category,
                subcategory: response.data.payload.subcategory,
                employee: employee,
                assignEmployee: employee?.length > 0 ? true : false,
                start_date: new Date(response.data.payload.start_date),
                end_date: response.data.payload.end_date ? new Date(response.data.payload.end_date) : "",
                start_time: getJSObjectFromTimeString(response.data.payload.start_time),
                end_time: response.data.payload.end_time ? getJSObjectFromTimeString(response.data.payload.end_time) : "",
                // notity_to_users: [],
                // remind_after_end: [],
                videoUrl: response.data.payload.video_url,
                addressUrl: response.data.payload.address_url,
                informationUrl: response.data.payload.information_url,
                highPriority: response.data.payload.is_compulsory == "1" ? true : false,
                // shift: {},
                repeat: response.data.payload.is_repeat == 1 ? true : false,
                repetition_type: response.data.payload.is_repeat == 1 ? repetitionTypeData[response.data.payload.repetition_type - 1] : repetitionTypeData[0],
                week_days: [...temp_week_days],
                how_many_time_array: JSON.parse(response.data.payload.how_many_time_array),
                // repetition_time: "",
                // day_in_month: {},
                every: response.data.payload.every ?? 1,
                implementation_plan: response.data.payload.implementation_plan ?? {},
                external_comment: response.data.payload.external_comment,
                internal_comment: response.data.payload.internal_comment,
                documents: response.data.payload.file ? [{
                    'uploaded_doc_url': response.data.payload.file,
                    'uri': response.data.payload.file,
                    'type': isDocOrImage(response.data.payload.file)
                }] : [],
                notify_users_before_start_obj: {
                    isTrue: response.data.payload.remind_before_start == 1 ? true : false,
                    send_notification: response.data.payload.before_is_push_notify == 1 ? true : false,
                    send_text: response.data.payload.before_is_text_notify == 1 ? true : false,
                    time: response.data.payload.before_minutes
                },
                notify_users_after_start_obj: {
                    isTrue: response.data.payload.remind_after_end == 1 ? true : false,
                    send_notification: response.data.payload.after_is_push_notify == 1 ? true : false,
                    send_text: response.data.payload.after_is_text_notify == 1 ? true : false,
                    time: response.data.payload.after_minutes
                },
                notify_users_in_time_obj: {
                    isTrue: response.data.payload.in_time == 1 ? true : false,
                    send_notification: response.data.payload.in_time_is_push_notify == 1 ? true : false,
                    send_text: response.data.payload.in_time_is_text_notify == 1 ? true : false,
                    time: 10
                },
                notify_emergency_contact: {
                    isTrue: response.data.payload.is_emergency == 1 ? true : false,
                    send_notification: response.data.payload.emergency_is_push_notify == 1 ? true : false,
                    send_text: response.data.payload.emergency_is_text_notify == 1 ? true : false,
                    time: response.data.payload.emergency_minutes
                }
            })
            setPatientListAS({ ...patientListAS, selectedData: [{ ...response.data.payload.patient }] })
            setImplementationPlanAS({ ...ImplementationPlanAS, selectedData: response.data.payload.implementation_plan ? [{ ...response.data.payload.implementation_plan }] : [] })
            // setCategoryAS({ ...categoryAS, selectedData: [{ ...response.data.payload.category }] })
            setSubCategoryAS(getActionSheetAPIDetail({
                url: Constants.apiEndPoints.categoryChildList, params: { parent_id: response.data.payload.category_id }, debugMsg: "sub-category", token: UserLogin.access_token,
                selectedData: [{ ...response.data.payload.subcategory }]
            }))
            setEmployeeAS({ ...employeeAS, selectedData: employee })
            setIsLoading(false);
            // console.log("formFields.cate................", formFields.category);
        }
        else {
            setIsLoading(false);
            Alert.showAlert(Constants.danger, response.errorMsg);
        }
    }

    const getImplementationDetail = async (patient_detail) => {
        setIsLoading(true);
        let url = Constants.apiEndPoints.implementationPlan + "/" + routeParams.IPId;
        let response = await APIService.getData(url, UserLogin.access_token, null, "getImplementationDetailAPI");
        if (!response.errorMsg) {
            setFormFields({ ...formFields, [formFieldsKeys.patient]: patient_detail, [formFieldsKeys.implementation_plan]: response.data.payload })
            setImplementationPlanAS({ ...ImplementationPlanAS, selectedData: [response.data.payload] })
            setIsLoading(false);
        }
        else {
            setIsLoading(false);
            Alert.showAlert(Constants.danger, response.errorMsg);
        }
    }

    const imageOrDocumentResponseHandler = async (response) => {
        if (response.didCancel) {
            //console.log('User cancelled image picker');
        } else if (response.error) {
            //console.log('ImagePicker Error: ', response.error);
            Alert.showAlert(Constants.danger, messages.message_something_went_wrong)
        } else if (response.customButton) {
            //console.log('User tapped custom button: ', response.customButton);
        } else {
            //  this.setState({ avatarSource: response, imagePathText: response.type });
            // if (Array.isArray(response) && response.length > 0)
            //     handleInputChange(formFieldsKeys.documents, response)
            // else
            //     handleInputChange(formFieldsKeys.documents, response?.assets)

            if (Array.isArray(response) && response.length > 0) {
                // console.log('first')
                let uploaded_doc_arr = await uploadFile(response[0]);
                if (!uploaded_doc_arr)
                    return;
                let tempArr = [{
                    'uploaded_doc_url': uploaded_doc_arr.file_name,
                    'uri': uploaded_doc_arr.file_name,
                    'type': uploaded_doc_arr.uploading_file_name
                }]
                handleInputChange(formFieldsKeys.documents, tempArr)
            }
            else if (response?.assets) {
                // console.log('second', response?.assets)
                let uploaded_doc_arr = await uploadFile(response?.assets[0]);
                // console.log('uploaded_doc_arr', uploaded_doc_arr)
                if (!uploaded_doc_arr)
                    return;
                let tempArr = [{
                    'uploaded_doc_url': uploaded_doc_arr.file_name,
                    'uri': uploaded_doc_arr.file_name,
                    'type': uploaded_doc_arr.uploading_file_name
                }]
                handleInputChange(formFieldsKeys.documents, tempArr)
            }
        }
    }


    // render view
    // console.log("formFields.patient", JSON.stringify(formFields.patient));
    if (isLoading)
        return <ProgressLoader />

    return (
        <BaseContainer
            onPressLeftIcon={() => { props.navigation.pop() }}
            leftIcon="arrow-back"
            // leftIconSize={24}
            title={labels['add-activity']}
            leftIconColor={Colors.white}
        >
            <FormSubHeader
                leftIconName={
                    viewDecider == 1 ? null : "chevron-back-circle-outline"}
                onPressLeftIcon={
                    viewDecider == 2
                        ? () => { setViewDecider(1) }
                        : viewDecider == 3
                            ? () => { setViewDecider(2) }
                            :
                            (viewDecider == 4 && !uploadingFile)
                                ? () => { setViewDecider(3) }
                                : () => { }
                }
                title={
                    viewDecider == 1
                        ? labels.activity_details
                        : viewDecider == 2
                            ? labels.time_and_repetition
                            : viewDecider == 3
                                ? labels.reminders
                                : viewDecider == 4
                                    ? labels.attachment
                                    : ""
                }
            />

            {/* Main View */}
            <KeyboardAwareScrollView keyboardShouldPersistTaps="handled"
                style={styles.mainView}>
                {(viewDecider == 1) ? <>

                    {/* reason for editing */}
                    {/* {routeParams.activityId
                        ? <InputValidation
                            uniqueKey={formFieldsKeys.reason_for_editing}
                            validationObj={validationForActivityDetails}
                            value={formFields.reason_for_editing}
                            placeHolder={labels['reason-for-editing']}
                            iconColor={Colors.primary}
                            onChangeText={(text) => {
                                removeErrorTextForInputThatUserIsTyping(activity_details, formFieldsKeys.reason_for_editing);
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
                        validationObj={validationForActivityDetails}
                        value={formFields.title}
                        placeHolder={labels['title']}
                        iconColor={Colors.primary}
                        onChangeText={(text) => {
                            removeErrorTextForInputThatUserIsTyping(activity_details, formFieldsKeys.title);
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
                        dropDownListData={descrptionSuggestion}
                        onPressDropDownListitem={(choosenSuggestion) => {
                            handleInputChange(formFieldsKeys.description, choosenSuggestion)
                            setDescrptionSuggestion([])
                        }}
                        validationObj={validationForActivityDetails}
                        value={formFields.description}
                        placeHolder={labels['discription']}
                        iconColor={Colors.primary}
                        onChangeText={(text) => {
                            removeErrorTextForInputThatUserIsTyping(activity_details, formFieldsKeys.description);
                            filterSuggestion(text, (filteredData) => { setDescrptionSuggestion(filteredData) })
                            handleInputChange(formFieldsKeys.description, text)
                        }}
                        style={{ marginTop: Constants.formFieldTopMargin }}
                        inputMainViewStyle={{ ...styles.InputValidationView, }}
                        inputStyle={{ ...styles.inputStyle, height: 130, textAlignVertical: "top" }}
                    />

                    {/* patient */}
                    <View style={styles.inputAndAddBtnContainer}>
                        <InputValidation
                            uniqueKey={formFieldsKeys.patient}
                            validationObj={validationForActivityDetails}
                            placeHolder={labels['patient']}
                            value={formFields.patient?.name ?? ""}
                            iconRight='chevron-down'
                            iconColor={Colors.primary}
                            editable={false}
                            onPressIcon={() => {
                                removeErrorTextForInputThatUserIsTyping(activity_details, formFieldsKeys.patient)
                                setActionSheetDecide(formFieldsKeys.patient)
                                actionSheetRef.current?.setModalVisible()
                            }}
                            style={{ marginTop: Constants.formFieldTopMargin, width: "80%", }}
                            inputMainViewStyle={styles.InputValidationView}
                            inputStyle={styles.inputStyle}
                        />

                        <TouchableOpacity
                            onPress={
                                // permissions[Constants.permissionsKey.patients]?.[Constants.permissionType.add]
                                Can(Constants.permissionsKey.patientsAdd, permissions)
                                    ? () => { props.navigation.navigate('AddPatient', { fromActivity: true }) }
                                    : Alert.showToast(labels.permission_required_for_this_action)
                            }
                            style={{
                                ...styles.addBtn,
                                marginBottom: validationForActivityDetails[formFieldsKeys.patient].invalid ? getProportionalFontSize(25) : 0
                            }}>
                            <Icon name='add' color={Colors.white} size={24} />
                        </TouchableOpacity>
                    </View>
                    {
                        formFields.patient?.name
                            ?
                            //    implementation plan 
                            <View style={styles.inputAndAddBtnContainer}>
                                < InputValidation
                                    // uniqueKey={formFieldsKeys.patient}
                                    // validationObj={validationForActivityDetails}
                                    placeHolder={labels['implementation-plan']}
                                    optional={true}
                                    value={formFields.implementation_plan?.title ?? ""}
                                    iconRight='chevron-down'
                                    iconColor={Colors.primary}
                                    editable={false}
                                    onPressIcon={() => {
                                        removeErrorTextForInputThatUserIsTyping(activity_details, formFieldsKeys.implementation_plan)
                                        setActionSheetDecide(formFieldsKeys.implementation_plan)
                                        actionSheetRef.current?.setModalVisible()
                                    }}
                                    style={{ marginTop: Constants.formFieldTopMargin, width: "80%" }}
                                    inputMainViewStyle={styles.InputValidationView}
                                    inputStyle={styles.inputStyle}
                                />
                                <TouchableOpacity
                                    onPress={
                                        // permissions[Constants.permissionsKey.ip]?.[Constants.permissionType.add]
                                        Can(Constants.permissionsKey.ipAdd, permissions)
                                            ? () => { props.navigation.navigate('ImplementationPlanStack', { screen: 'ImplementationPlan', params: { patientId: formFields.patient.id, fromActivity: true } }) }
                                            : Alert.showToast(labels.permission_required_for_this_action)
                                    }
                                    style={styles.addBtn}>
                                    <Icon name='add' color={Colors.white} size={24} />
                                </TouchableOpacity>
                            </View>
                            : null
                    }

                    {/* category */}
                    <InputValidation
                        uniqueKey={formFieldsKeys.category}
                        validationObj={validationForActivityDetails}
                        placeHolder={labels['category']}
                        value={formFields.category?.name ?? ""}
                        iconRight='chevron-down'
                        iconColor={Colors.primary}
                        editable={false}
                        // optional={true}
                        onPressIcon={
                            formFields.implementation_plan?.title ? (
                                () => { Alert.showToast(labels.category_imported_from_ip, Constants.success) }
                            ) : (
                                () => {
                                    removeErrorTextForInputThatUserIsTyping(activity_details, formFieldsKeys.category)
                                    setActionSheetDecide(formFieldsKeys.category)
                                    actionSheetRef.current?.setModalVisible()
                                }
                            )
                        }
                        style={{ marginTop: Constants.formFieldTopMargin, }}
                        inputMainViewStyle={styles.InputValidationView}
                        inputStyle={styles.inputStyle}
                    />

                    {/* subcategory */}
                    <InputValidation
                        uniqueKey={formFieldsKeys.subcategory}
                        validationObj={validationForActivityDetails}
                        placeHolder={labels['sub-category']}
                        value={formFields.subcategory?.name ?? ""}
                        iconRight='chevron-down'
                        iconColor={Colors.primary}
                        // optional={true}
                        editable={false}
                        onPressIcon={
                            formFields.implementation_plan?.title ? (
                                () => { Alert.showToast(labels.sub_category_imported_from_ip, Constants.success) }
                            ) : (() => {
                                // removeErrorTextForInputThatUserIsTyping(activity_details, formFieldsKeys.subcategory)
                                setActionSheetDecide(formFieldsKeys.subcategory)
                                actionSheetRef.current?.setModalVisible()
                            })
                        }
                        style={{ marginTop: Constants.formFieldTopMargin, }}
                        inputMainViewStyle={styles.InputValidationView}
                        inputStyle={styles.inputStyle}
                    />

                    {/* employee */}
                    {/* {formFields.assignEmployee
                    ?  */}
                    <InputValidation
                        // uniqueKey={formFieldsKeys.employee}
                        // validationObj={validationForActivityDetails}
                        placeHolder={labels['employees']}
                        value={formFields.employee?.name ?? ""}
                        iconRight='chevron-down'
                        iconColor={Colors.primary}
                        optional={true}
                        editable={false}
                        onPressIcon={() => {
                            // removeErrorTextForInputThatUserIsTyping(activity_details, formFieldsKeys.employee)
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
                            handleInputChange(formFieldsKeys.employee, newArr)
                        }}
                    />
                    {/* external comment */}
                    <InputValidation
                        // uniqueKey={formFieldsKeys.external_comment}
                        multiline={true}
                        dropDownListData={externalCommentSuggestion}
                        onPressDropDownListitem={(choosenSuggestion) => {
                            handleInputChange(formFieldsKeys.external_comment, choosenSuggestion)
                            setExternalCommentSuggestion([])
                        }}
                        // validationObj={validationForActivityDetails}
                        value={formFields.external_comment}
                        placeHolder={labels['external-comment']}
                        iconColor={Colors.primary}
                        optional={true}
                        onChangeText={(text) => {
                            // removeErrorTextForInputThatUserIsTyping(activity_details, formFieldsKeys.external_comment);
                            filterSuggestion(text, (filteredData) => { setExternalCommentSuggestion(filteredData) })
                            handleInputChange(formFieldsKeys.external_comment, text)
                        }}
                        style={{ marginTop: Constants.formFieldTopMargin }}
                        inputMainViewStyle={{ ...styles.InputValidationView, }}
                        inputStyle={{ ...styles.inputStyle, height: 100, textAlignVertical: "top" }}
                    />

                    {/* internal comment */}
                    <InputValidation
                        // uniqueKey={formFieldsKeys.internal_comment}
                        multiline={true}
                        dropDownListData={internalCommentSuggestion}
                        onPressDropDownListitem={(choosenSuggestion) => {
                            handleInputChange(formFieldsKeys.internal_comment, choosenSuggestion)
                            setInternalCommentSuggestion([])
                        }}
                        // validationObj={validationForActivityDetails}
                        value={formFields.internal_comment}
                        placeHolder={labels['internal_comment']}
                        optional={true}
                        iconColor={Colors.primary}
                        onChangeText={(text) => {
                            // removeErrorTextForInputThatUserIsTyping(activity_details, formFieldsKeys.internal_comment);
                            filterSuggestion(text, (filteredData) => { setInternalCommentSuggestion(filteredData) })
                            handleInputChange(formFieldsKeys.internal_comment, text)
                        }}
                        style={{ marginTop: Constants.formFieldTopMargin }}
                        inputMainViewStyle={{ ...styles.InputValidationView, }}
                        inputStyle={{ ...styles.inputStyle, height: 100, textAlignVertical: "top" }}
                    />

                    {/* high priority */}
                    <View style={styles.checkBoxView}>
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
                            <Text style={styles.saveAsTemplate}>{labels['priority']}</Text>
                        </View>
                    </View>

                    {/* is r */}
                    <View style={styles.checkBoxView}>
                        <BouncyCheckbox
                            size={20}
                            fillColor={Colors.primary}
                            unfillColor={Colors.white}
                            iconStyle={{ borderColor: Colors.primary }}
                            isChecked={formFields.is_risk}
                            onPress={(value) => {
                                handleInputChange(formFieldsKeys.is_risk, value)
                            }}
                        />
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={styles.saveAsTemplate}>{labels['is-risk']}</Text>
                        </View>
                    </View>

                    {
                        formFields.is_risk
                            ?
                            < InputValidation
                                uniqueKey={formFieldsKeys.risk_description}
                                validationObj={validationForActivityDetails}
                                value={formFields.risk_description}
                                placeHolder={labels['risk_description']}
                                iconColor={Colors.primary}
                                onChangeText={(text) => {
                                    removeErrorTextForInputThatUserIsTyping(activity_details, formFieldsKeys.risk_description);
                                    handleInputChange(formFieldsKeys.risk_description, text)
                                }}
                                style={{ marginTop: Constants.formFieldTopMargin }
                                }
                                inputMainViewStyle={{ ...styles.InputValidationView, }}
                                inputStyle={{ ...styles.inputStyle, }}
                            /> : null
                    }

                    {/* next button */}
                    <CustomButton
                        style={{
                            ...styles.nextButton,
                            backgroundColor: isValid ? Colors.primary : Colors.lightPrimary
                        }}
                        onPress={() => {
                            // setViewDecider(2)
                            if (validation(activity_details)) {
                                //loginAPI();
                                // console.log('Validation true')
                                setViewDecider(2)
                            }
                            else {
                                Alert.showAlert(Constants.warning, messages.message_fill_all_required_fields)
                                // console.log('Validation false')
                            }
                        }} title={labels['Next']}
                    />
                </> : null}

                {
                    (viewDecider == 2) ? <>
                        {
                            formFields.implementation_plan
                                ? <View>
                                    <Text style={{
                                        fontSize: getProportionalFontSize(12),
                                        fontFamily: Assets.fonts.boldItalic
                                    }}>
                                        {labels["valid_date_range_for_selected_IP_is"]} {formFields.implementation_plan.start_date}{formFields.implementation_plan.end_date ? `-${formFields.implementation_plan.end_date}` : null}
                                    </Text>
                                </View>
                                : null
                        }

                        {/* start date */}
                        <InputValidation
                            uniqueKey={formFieldsKeys.start_date}
                            validationObj={validationForTimeAndRepetition}
                            iconRight='calendar'
                            iconColor={Colors.primary}
                            editable={false}
                            onPressIcon={() => {
                                removeErrorTextForInputThatUserIsTyping(time_and_repetition, formFieldsKeys.start_date)
                                setOpenDatePicker(true);
                                setMode(Constants.DatePickerModes.date_mode);
                                setDatePickerKey(formFieldsKeys.start_date)
                            }}
                            value={formFields.start_date ? formatDate(formFields.start_date) : ''}
                            placeHolder={labels['start-date']}
                            style={styles.InputValidationView}
                            inputStyle={styles.inputStyle}
                        />

                        {/* end date */}
                        {formFields.start_date
                            ? <InputValidation
                                // uniqueKey={formFieldsKeys.end_date}
                                // validationObj={validationForTimeAndRepetition}
                                iconRight='calendar'
                                iconColor={Colors.primary}
                                editable={false}
                                optional={true}
                                onPressIcon={() => {
                                    removeErrorTextForInputThatUserIsTyping(time_and_repetition, formFieldsKeys.end_date)
                                    setOpenDatePicker(true);
                                    setMode(Constants.DatePickerModes.date_mode);
                                    setDatePickerKey(formFieldsKeys.end_date)
                                }}
                                value={formFields.end_date ? formatDate(formFields.end_date) : ''}
                                placeHolder={labels['end-date']}
                                style={styles.InputValidationView}
                                inputStyle={styles.inputStyle}
                            /> : null}

                        <View style={{ ...styles.InputValidationView, }}>
                            <Text style={{ ...styles.headingTitleStyle }}>{labels['how-many-times-a-day']}</Text>
                            <View
                                style={{
                                    ...styles.nonEditableView,
                                    borderColor: Colors.darkPlaceHoldColor,
                                    flexDirection: "row"
                                }}
                            >
                                <TouchableOpacity
                                    onPress={
                                        () => {
                                            if (Number(formFields.how_many_time) > 0) {
                                                let temp = Number(formFields.how_many_time) - 1;
                                                let tempArr = [...formFields.how_many_time_array]
                                                tempArr.pop()
                                                setFormFields({ ...formFields, [formFieldsKeys.how_many_time]: temp, [formFieldsKeys.how_many_time_array]: tempArr })
                                            } else {
                                                Alert.showToast(labels.minimum_value_exist, Constants.success)
                                            }
                                        }
                                    }
                                    style={{
                                        height: "100%",
                                        width: "20%",
                                        justifyContent: "center",
                                        alignItems: "flex-start"
                                    }}
                                >
                                    <Icon
                                        name={"remove-circle"}
                                        color={Colors.primary}
                                        size={getProportionalFontSize(25)}
                                    />
                                </TouchableOpacity>
                                <View>
                                    <Text style={{ fontFamily: Assets.fonts.regular, color: Colors.darkPlaceHoldColor, fontSize: getProportionalFontSize(17) }}>{Number(formFields.how_many_time)}</Text>
                                </View>
                                <TouchableOpacity
                                    onPress={
                                        () => {
                                            let temp = Number(formFields.how_many_time) + 1;
                                            let tempArr = [...formFields.how_many_time_array]
                                            tempArr.push({
                                                "start": "",
                                                "end": "",
                                            })
                                            setFormFields({ ...formFields, [formFieldsKeys.how_many_time]: temp, [formFieldsKeys.how_many_time_array]: tempArr })
                                        }
                                    }
                                    style={{
                                        height: "100%",
                                        width: "20%",
                                        justifyContent: "center",
                                        alignItems: "flex-end"
                                    }}
                                >
                                    <Icon
                                        name={"add-circle"}
                                        color={Colors.primary}
                                        size={getProportionalFontSize(25)}
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* how_many_time_array */}
                        <FlatList
                            show={false}
                            contentContainerStyle={{}}
                            keyExtractor={(item, index) => '' + index}
                            data={formFields.how_many_time_array}

                            renderItem={({ item, index }) => {
                                return (
                                    <>
                                        {index != 0
                                            ? <View style={{ borderWidth: 0.5, width: '100%', borderColor: Colors.gray, marginTop: Constants.formFieldTopMargin, }} />
                                            : null}
                                        {/* {labels?.activity_time ? <Text style={{ ...styles.headingTitleStyle, marginBottom: -5 }}>{labels?.activity_time}  {index + 1} </Text> : null} */}
                                        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                                            {/* Start time */}
                                            <InputValidation
                                                // uniqueKey={formFieldsKeys.start_time}
                                                // validationObj={validationForTimeAndRepetition}
                                                iconRight="time"
                                                value={item?.start ? formatTime(item?.start) : ""}
                                                placeHolder={labels['start-time']}
                                                onPressIcon={() => {
                                                    setMode(Constants.DatePickerModes.time_mode)
                                                    setDatePickerKey(formFieldsKeys.how_many_time_array)
                                                    setHowManyTimesArrIndexNKey({
                                                        index: index,
                                                        key: "start"
                                                    })
                                                    setOpenDatePicker(true)
                                                }}
                                                style={{ ...styles.InputValidationView, width: "48%" }}
                                                inputStyle={{ ...styles.inputStyle }}
                                                editable={false}
                                            />
                                            {/* end time */}
                                            <InputValidation
                                                iconRight="time"
                                                optional={true}
                                                value={item.end ? formatTime(item.end) : ""}
                                                placeHolder={labels['end-time']}
                                                onPressIcon={() => {
                                                    setMode(Constants.DatePickerModes.time_mode)
                                                    setDatePickerKey(formFieldsKeys.how_many_time_array)
                                                    setHowManyTimesArrIndexNKey({
                                                        index: index,
                                                        key: "end"
                                                    })
                                                    setOpenDatePicker(true)
                                                }}
                                                style={{ ...styles.InputValidationView, width: "48%" }}
                                                inputStyle={{ ...styles.inputStyle }}
                                                editable={false}
                                            />
                                        </View>
                                    </>
                                )
                            }}
                        />
                        <ErrorComp
                            uniqueKey={formFieldsKeys.how_many_time_array}
                            validationObj={validationForTimeAndRepetition}
                        />

                        {/* repeat */}
                        {formFields[formFieldsKeys.end_date]
                            ? <View style={styles.checkBoxView}>
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
                            : null}

                        {formFields.repeat
                            ?
                            <>
                                {/* shift */}
                                {/* <InputValidation
                                    optional={true}
                                    // uniqueKey={formFieldsKeys.shift}
                                    // validationObj={validationForTimeAndRepetition}
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

                                <View style={{ ...styles.checkBoxView, justifyContent: "space-between", marginTop: 0 }}>
                                    {/* every */}
                                    <InputValidation
                                        uniqueKey={formFieldsKeys.every}
                                        validationObj={validationForTimeAndRepetition}
                                        value={'' + formFields[formFieldsKeys.every]}
                                        keyboardType={'number-pad'}
                                        placeHolder={labels['every']}
                                        onChangeText={(text) => {
                                            removeErrorTextForInputThatUserIsTyping(time_and_repetition, formFieldsKeys.every);
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
                                        validationObj={validationForTimeAndRepetition}
                                        value={formFields[formFieldsKeys.repetition_type].name ? '' + formFields[formFieldsKeys.repetition_type].name : ""}
                                        placeHolder={labels['repetition-type']}
                                        onPressIcon={() => {
                                            removeErrorTextForInputThatUserIsTyping(time_and_repetition, formFieldsKeys.repetition_type)
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
                                        ?
                                        <>
                                            <FlatList
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
                                            <ErrorComp
                                                uniqueKey={formFieldsKeys.week_days}
                                                validationObj={validationForTimeAndRepetition} />
                                        </>
                                        : formFields[formFieldsKeys.repetition_type].api_value == "month"
                                            ?
                                            < InputValidation
                                                iconRight="chevron-down"
                                                uniqueKey={formFieldsKeys.day_in_month}
                                                validationObj={validationForTimeAndRepetition}
                                                value={formFields[formFieldsKeys.day_in_month].name ? '' + formFields[formFieldsKeys.day_in_month].name : ""}
                                                placeHolder={labels["day"]}
                                                onPressIcon={() => {
                                                    removeErrorTextForInputThatUserIsTyping(time_and_repetition, formFieldsKeys.day_in_month)
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
                            validationObj={validationForTimeAndRepetition}
                            value={formFields[formFieldsKeys.repetition_time] ? formatTime(formFields[formFieldsKeys.repetition_time]) : ""}
                            placeHolder={labels.repetition_time}
                            onPressIcon={() => {
                                setMode(Constants.DatePickerModes.time_mode)
                                setDatePickerKey(formFieldsKeys.repetition_time)
                                setOpenDatePicker(true)
                                removeErrorTextForInputThatUserIsTyping(time_and_repetition,formFieldsKeys.repetition_time)
                            }}
                            style={styles.InputValidationView}
                            inputStyle={{ ...styles.inputStyle }}
                            editable={false}
                        /> */}
                            </> : null}
                        {/* next button */}
                        <CustomButton
                            style={{
                                ...styles.nextButton,
                                backgroundColor: isValid ? Colors.primary : Colors.lightPrimary
                            }}
                            onPress={() => {
                                // setViewDecider(3)
                                if (validation(time_and_repetition)) {
                                    //loginAPI();
                                    // console.log('Validation true')
                                    setViewDecider(3)
                                }
                                else {
                                    Alert.showAlert(Constants.warning, messages.message_fill_all_required_fields)
                                    // console.log('Validation false')
                                }
                            }} title={labels["Next"]}
                        />
                    </> : null
                }
                {
                    (viewDecider == 3) ? <>
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
                                <Text style={styles.saveAsTemplate}>{labels["remind-before-start"]}</Text>
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
                                        validationObj={validationForReminders}
                                        value={'' + formFields.notify_users_before_start_obj?.time ?? ''}
                                        placeHolder={labels["time-in-minute"]}
                                        iconColor={Colors.primary}
                                        onChangeText={(text) => {
                                            if (text == '') {
                                                removeErrorTextForInputThatUserIsTyping(reminders, formFieldsKeys.notify_users_before_start_obj)
                                                handleInputChange(formFieldsKeys.notify_users_before_start_obj, { ...formFields[formFieldsKeys.notify_users_before_start_obj], time: "" })
                                                return;
                                            }
                                            let textToNum = Number(text)
                                            if (!isNaN(textToNum) && !text.includes('.') && textToNum <= 240 && textToNum >= 1) {
                                                removeErrorTextForInputThatUserIsTyping(reminders, formFieldsKeys.notify_users_before_start_obj)
                                                // removeErrorTextForInputThatUserIsTyping(activity_details,formFieldsKeys.title);
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
                                // validationObj={validationForReminders}
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
                                        // removeErrorTextForInputThatUserIsTyping(activity_details,formFieldsKeys.title);
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
                                        validationObj={validationForReminders}
                                        value={formFields.notify_users_after_start_obj?.time ? '' + formFields.notify_users_after_start_obj?.time : ''}
                                        placeHolder={labels["time-in-minute"]}
                                        iconColor={Colors.primary}
                                        onChangeText={(text) => {
                                            if (text == '') {
                                                removeErrorTextForInputThatUserIsTyping(reminders, formFieldsKeys.notify_users_after_start_obj)
                                                handleInputChange(formFieldsKeys.notify_users_after_start_obj, { ...formFields[formFieldsKeys.notify_users_after_start_obj], time: "" })
                                                return;
                                            }
                                            let textToNum = Number(text)
                                            if (!isNaN(textToNum) && !text.includes('.') && textToNum <= 240 && textToNum >= 1) {
                                                removeErrorTextForInputThatUserIsTyping(reminders, formFieldsKeys.notify_users_after_start_obj)
                                                // removeErrorTextForInputThatUserIsTyping(activity_details,formFieldsKeys.title);
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
                                <Text style={styles.saveAsTemplate}>{labels["add-reminder-to-emergency"]}</Text>
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
                                        validationObj={validationForReminders}
                                        value={formFields.notify_emergency_contact?.time ? '' + formFields.notify_emergency_contact?.time : ''}
                                        placeHolder={labels["minute"]}
                                        iconColor={Colors.primary}
                                        onChangeText={(text) => {
                                            if (text == '') {
                                                removeErrorTextForInputThatUserIsTyping(reminders, formFieldsKeys.notify_emergency_contact)
                                                handleInputChange(formFieldsKeys.notify_emergency_contact, { ...formFields[formFieldsKeys.notify_emergency_contact], time: "" })
                                                return;
                                            }
                                            let textToNum = Number(text)
                                            if (!isNaN(textToNum) && !text.includes('.') && textToNum <= 240 && textToNum >= 1) {
                                                removeErrorTextForInputThatUserIsTyping(reminders, formFieldsKeys.notify_emergency_contact)
                                                // removeErrorTextForInputThatUserIsTyping(activity_details,formFieldsKeys.title);
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
                        {/* next button */}
                        <CustomButton
                            style={{
                                ...styles.nextButton,
                                backgroundColor: isValid ? Colors.primary : Colors.lightPrimary
                            }}
                            onPress={() => {

                                if (validation(reminders)) {
                                    //loginAPI();
                                    // console.log('Validation true')
                                    setViewDecider(4)
                                }
                                else {
                                    Alert.showAlert(Constants.warning, messages.message_fill_all_required_fields)
                                    // console.log('Validation false')
                                }
                            }} title={labels["Next"]}
                        />
                    </> : null
                }
                {
                    (viewDecider == 4)
                        ? <>
                            {/* video url */}
                            <InputValidation
                                uniqueKey={formFieldsKeys.videoUrl}
                                validationObj={validationForAttachment}
                                optional={true}
                                placeHolder={labels["video-link"]}
                                value={formFields.videoUrl}
                                iconColor={Colors.primary}
                                onChangeText={(text) => {
                                    removeErrorTextForInputThatUserIsTyping(attachment, formFieldsKeys.videoUrl)
                                    handleInputChange(formFieldsKeys.videoUrl, text)
                                }}
                                style={{ marginTop: Constants.formFieldTopMargin, }}
                                inputMainViewStyle={styles.InputValidationView}
                                inputStyle={styles.inputStyle}
                            />

                            {/* address url */}
                            <InputValidation
                                uniqueKey={formFieldsKeys.addressUrl}
                                validationObj={validationForAttachment}
                                placeHolder={labels["address-link"]}
                                optional={true}
                                value={formFields.addressUrl}
                                iconColor={Colors.primary}
                                onChangeText={(text) => {
                                    removeErrorTextForInputThatUserIsTyping(attachment, formFieldsKeys.addressUrl)
                                    handleInputChange(formFieldsKeys.addressUrl, text)
                                }}
                                style={{ marginTop: Constants.formFieldTopMargin, }}
                                inputMainViewStyle={styles.InputValidationView}
                                inputStyle={styles.inputStyle}
                            />

                            {/* information url */}
                            <InputValidation
                                uniqueKey={formFieldsKeys.informationUrl}
                                validationObj={validationForAttachment}
                                placeHolder={labels["information-link"]}
                                value={formFields.informationUrl}
                                optional={true}
                                iconColor={Colors.primary}
                                onChangeText={(text) => {
                                    removeErrorTextForInputThatUserIsTyping(attachment, formFieldsKeys.informationUrl)
                                    handleInputChange(formFieldsKeys.informationUrl, text)
                                }}
                                style={{ marginTop: Constants.formFieldTopMargin, }}
                                inputMainViewStyle={styles.InputValidationView}
                                inputStyle={styles.inputStyle}
                            />

                            {/* attachment  */}
                            {/* <View style={{ flexDirection: "row", alignItems: "center", marginTop: Constants.formFieldTopMargin }}>
                            <Text numberOfLines={1} onPress={() => {
                                setActionSheetDecide(formFieldsKeys.attachment)
                                actionSheetRef.current?.setModalVisible()
                            }} style={{ ...styles.attachmentText, flex: 1 }}>{labels["add-attachment"]}</Text>
                            <Text numberOfLines={1} style={{ ...styles.normalText, flex: 2.5 }}>{formFields[formFieldsKeys.attachment]?.uri ? ` (${formFields[formFieldsKeys.attachment]?.fileName ?? formFields[formFieldsKeys.attachment]?.name})` : ''}</Text>
                            </View> */}

                            <View style={{ flex: 1, }}>
                                <UploadedFileViewer
                                    isLoading={uploadingFile}
                                    data={formFields.documents}
                                    setNewData={(newArr) => {
                                        handleInputChange(formFieldsKeys.documents, newArr)
                                    }}
                                />

                                {/* UPLOAD */}
                                {(formFields.documents && formFields.documents?.length <= 0)
                                    ? <TouchableOpacity
                                        onPress={() => {
                                            setActionSheetDecide(formFieldsKeys.documents)
                                            actionSheetRef?.current?.setModalVisible();
                                        }}
                                        style={{
                                            ...styles.nextButton, marginVertical: 0, marginTop: 30, minHeight: 35,
                                            backgroundColor: Colors.white, flexDirection: "row", alignItems: "center", borderWidth: 1.5, borderColor: Colors.primary, borderRadius: 10
                                        }}>
                                        {uploadingFile
                                            ? <ProgressLoader onActivityIndicator={true} onActivityIndicatorSize='small' onActivityIndicatorColor={Colors.primary} />
                                            : <View style={{ flexDirection: "row", alignItems: "center" }}>
                                                <Icon name="cloud-upload-sharp" color={Colors.primary} size={30} />
                                                <Text style={{ ...styles.normalText, color: Colors.primary, marginStart: 5 }}>{labels["upload"]}</Text>
                                            </View>}
                                    </TouchableOpacity>
                                    : null}

                            </View>

                            {/* save button */}
                            <CustomButton
                                title={labels["save"]}
                                isLoading={uploadingFile}
                                style={{ marginTop: Constants.formFieldTopMargin }}
                                onPress={async () => {
                                    Keyboard.dismiss()
                                    if (validation(attachment)) {
                                        let badWordString = getBadWordString();
                                        //console.log('validation success')
                                        if (badWordString) {
                                            Alert.showBasicDoubleAlertForBoth(badWordString, () => {
                                                saveOrEditActivity()
                                            }, null, messages.message_bad_word_alert)
                                        }
                                        else
                                            saveOrEditActivity()
                                    }
                                    else {
                                        Alert.showAlert(Constants.warning, messages.message_fill_all_required_fields)
                                        // console.log('validation fail')
                                    }
                                }}
                            />
                        </> : null
                }

                <ActionSheet ref={actionSheetRef}>
                    {
                        actionSheetDecide == ''
                            ? null
                            : actionSheetDecide == formFieldsKeys.documents
                                ? <ImagePickerActionSheetComp
                                    giveChoice={true}
                                    closeSheet={closeActionSheet}
                                    responseHandler={(res) => {
                                        //console.log('responseHandler....res----------------', res)
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
                    minimumDate={
                        mode == Constants.DatePickerModes.date_mode
                            ? formFields.implementation_plan.start_date
                                ? new Date(formFields.implementation_plan.start_date)
                                : new Date()
                            : null
                    }
                    maximumDate={
                        formFields.implementation_plan.end_date
                            ? new Date(formFields.implementation_plan.end_date)
                            : null
                    }
                    date={formFields.implementation_plan.start_date
                        ? new Date(formFields.implementation_plan.start_date)
                        : new Date()}
                    onConfirm={(date) => {
                        setOpenDatePicker(false)
                        // console.log('date : ', date)
                        let value = '';
                        if (mode == Constants.DatePickerModes.date_mode) {
                            handleInputChange(datePickerKey, date)
                        }
                        else if (mode == Constants.DatePickerModes.time_mode) {
                            handleInputChange(datePickerKey, date)
                            removeErrorTextForInputThatUserIsTyping(time_and_repetition, formFieldsKeys.how_many_time_array)
                        }
                        else
                            handleInputChange(datePickerKey, date)
                    }}
                    onCancel={() => {
                        setOpenDatePicker(false)
                    }}
                />
            </KeyboardAwareScrollView>
        </BaseContainer>
    )
}

export default AddActivity

const styles = StyleSheet.create({
    mainView: {
        flex: 1,
        paddingHorizontal: Constants.globalPaddingHorizontal,
    },

    InputValidationView: {
        // backgroundColor: Colors.backgroundColor,
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
    normalText: { fontSize: getProportionalFontSize(12), color: Colors.gray, fontFamily: Assets.fonts.semiBold },
    nextButton: {
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        // height: 40,
        // borderRadius: 5,
        paddingHorizontal: 16,
        backgroundColor: Colors.primary,
        marginVertical: 16
    },
    headingTitleStyle: {
        fontFamily: Assets.fonts.regular,
        fontSize: getProportionalFontSize(15),
    },
    nonEditableView: {
        width: '100%',
        height: 57,
        borderWidth: 1,
        flexDirection: 'row',
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: Colors.white,
        paddingHorizontal: 10,
        marginTop: 5,
        borderRadius: 10,
    },
    decisionCard: {
        width: "100%",
        shadowOffset: { width: 3, height: 3, },
        shadowOpacity: 10,
        elevation: 15,
        shadowColor: Platform.OS == "ios" ? Colors.shadowColorIosDefault : Colors.shadowColorAndroidDefault,
        shadowRadius: 10,
        backgroundColor: Colors.white,
        // padding: Constants.globalPaddingHorizontal,
        marginVertical: 10,
        borderRadius: 10,
        // marginHorizontal: Constants.globalPaddingHorizontal
    },
    inputAndAddBtnContainer: { flexDirection: "row", alignItems: "flex-end", justifyContent: "space-between" },
    addBtn: { backgroundColor: Colors.primary, height: 57, width: 57, justifyContent: "center", alignItems: "center", borderRadius: 10, },
})

