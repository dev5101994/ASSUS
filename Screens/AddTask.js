import React, { useState } from 'react'
import { StyleSheet, Text, View, ScrollView, FlatList, TouchableOpacity, Keyboard } from 'react-native';
import EmptyList from '../Components/EmptyList';
import Colors from '../Constants/Colors';
import { getProportionalFontSize, getActionSheetAPIDetail, formatDate, formatTime, placeholderCreator, checkUrlFormat, jsCoreDateCreator, getJSObjectFromTimeString, checkFileSize, formatDateByFormat, isDocOrImage, formatTimeForAPI, formatDateForAPI } from '../Services/CommonMethods';
import { useSelector, useDispatch } from 'react-redux';
import InputValidation from '../Components/InputValidation';
import CustomButton from '../Components/CustomButton';
import ActionSheet from "react-native-actions-sheet";
import ActionSheetComp from '../Components/ActionSheetComp';
import Constants from '../Constants/Constants';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import ProgressLoader from '../Components/ProgressLoader';
import { Checkbox } from 'react-native-paper';
import BouncyCheckbox from "react-native-bouncy-checkbox";
import Assets from '../Assets/Assets';
import DatePicker from 'react-native-date-picker';
import APIService from '../Services/APIService';
import Alert from '../Components/Alert';
import MSDataViewer from '../Components/MSDataViewer';
import ImagePickerActionSheetComp from '../Components/ImagePickerActionSheetComp';
import Icon from 'react-native-vector-icons/Ionicons';
import FormSubHeader from '../Components/FormSubHeader';
import UploadedFileViewer from '../Components/UploadedFileViewer';
import CommonAPIFunctions from '../Services/CommonAPIFunctions';

const task_details = "task_details";
const time_and_repetition = "time_and_repetition";
const reminders = "reminders";
const attachment = "attachment";

const AddTask = (props) => {
    const routeParams = props.route.params ?? {};
    // REDUX hooks
    const UserLogin = useSelector(state => state.User.UserLogin);
    const labels = useSelector(state => state.Labels);
    const messages = useSelector(state => state.Labels);

    const repetitionTypeData = [{ name: labels.day, api_value: "day", id: 1 },
    { name: labels.week, api_value: "week", id: 2 },
        //  { name: labels.month, api_value: "month", id: 3 }, { name: labels.year, api_value: "year", id: 4 }
    ]
    const week_days_data = [
        { name: 'S', number: 0, selected: false }, { name: 'M', number: 1, selected: false }, { name: 'T', number: 2, selected: false },
        { name: 'W', number: 3, selected: false }, { name: 'T', number: 4, selected: false },
        { name: 'F', number: 5, selected: false }, { name: 'S', number: 6, selected: false },
    ]
    // Immutable Variables
    const formFieldsKeys = {
        documents: "documents",
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
        how_many_time: "how_many_time",
        how_many_time_array: "how_many_time_array",
        repetition_week_days_array: "repetition_week_days_array",
        repetition_time: "repetition_time",
        activity: "activity"
    }

    const initialValidationForTaskDetails = {
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
        // [formFieldsKeys.patient]: {
        //     invalid: false,
        //     title: ''
        // },
        // [formFieldsKeys.category]: {
        //     invalid: false,
        //     title: ''
        // },
        // [formFieldsKeys.subcategory]: {
        //     invalid: false,
        //     title: ''
        // },
        // [formFieldsKeys.employee]: {
        //     invalid: false,
        //     title: ''
        // },
        // [formFieldsKeys.assignEmployee]: {
        //     invalid: false,
        //     title: ''
        // },
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
        [formFieldsKeys.repetition_week_days_array]: {
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
        documents: [],
        title: '',
        description: "",
        // patient: {},
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
        how_many_time: "1",
        how_many_time_array: [
            {
                "start": "",
                "end": "",
            }
        ],
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
        repetition_week_days_array: [],
        activity: []
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
    // console.log("------------------formFields", formFields)
    // const [validationObj, setValidationObj] = React.useState({ ...initialValidationObj });
    const [validationForActivityDetails, setValidationForTaskDetails] = React.useState({ ...initialValidationForTaskDetails });
    const [validationForTimeAndRepetition, setValidationForTimeAndRepetition] = React.useState({ ...initialValidationForTimeAndRepetition });
    const [validationForReminders, setValidationForReminders] = React.useState({ ...initialValidationForReminders });
    const [validationForAttachment, setValidationForAttachment] = React.useState({ ...initialValidationForAttachment });
    const [isValid, setIsValid] = React.useState(true);
    const [actionSheetDecide, setActionSheetDecide] = React.useState('');
    const [uploadingFile, setUploadingFile] = React.useState(false);
    const [openDatePicker, setOpenDatePicker] = React.useState(false);
    const [mode, setMode] = React.useState(Constants.DatePickerModes.date_mode);
    const [datePickerKey, setDatePickerKey] = React.useState(null);
    const [howManyTimesArrIndexNKey, setHowManyTimesArrIndexNKey] = React.useState({
        index: "",
        key: ""
    });
    const [viewDecider, setViewDecider] = React.useState(1);
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
    const [ActivityAS, setActivityAS] = React.useState(getActionSheetAPIDetail({
        url: Constants.apiEndPoints.activitiesList, debugMsg: "ActivityAS", token: UserLogin.access_token,
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


    // BadWords & Suggetion

    const [suggestion, setSuggestion] = React.useState([]);
    const [badWords, setBadWords] = React.useState([]);
    const [descrptionSuggestion, setDescrptionSuggestion] = React.useState([]);

    // useEffect hooks
    React.useEffect(() => {
        CommonAPIFunctions.getSuggestions(UserLogin.access_token, (data) => { setSuggestion(data) });
        CommonAPIFunctions.getBadWords(UserLogin.access_token, (data) => { setBadWords(data) });
        // userDetailAPI()

    }, [])

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

            ) {
                if (!result?.toLowerCase()?.includes(currBadWord))
                    result = result + badWords[i]?.name + ", ";
            }
        }
        if (result)
            result = result?.substring(0, result?.length - 2);
        return result;
    }


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
        // console.log("TaskDetailAPI  response   ", JSON.stringify(response))
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
                if (obj.employee)
                    employee.push(obj.employee)
            })
            // return;
            setFormFields({
                ...formFields,
                title: response.data.payload.title,
                description: response.data.payload.description,
                // patient: response.data.payload.patient,
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
                "how_many_time": response.data.payload[formFieldsKeys.how_many_time],
                "how_many_time_array": await JSON.parse(response.data.payload.how_many_time_array),
                "repeat_dates": await JSON.parse(response.data.payload.repeat_dates),
                repetition_week_days_array: await JSON.parse(response.data.payload.repeat_dates),
                repeat: response.data.payload.is_repeat == 1 ? true : false,
                repetition_type: response.data.payload.is_repeat == 1 ? repetitionTypeData[response.data.payload.repetition_type - 1] : repetitionTypeData[0],
                type_id: response.data.payload.type_id ?? null,
                // highPriority: false,
                // shift: {},

                // repeat: response.data.payload.is_repeat == 1 ? true : false,
                // repetition_type: response.data.payload.is_repeat == 1 ? repetitionTypeData[response.data.payload.repetition_type - 1] : repetitionTypeData[0],
                // week_days: [...temp_week_days],

                // repetition_time: "",
                // day_in_month: {},
                // every: response.data.payload.every ?? 1,
                // implementation_plan: response.data.payload.implementation_plan ?? {},
                documents: response.data.payload.file ? [{
                    name: response.data.payload.file,
                    fileName: response.data.payload.file,
                    uri: response.data.payload.file,
                    type: isDocOrImage(response.data.payload.file),
                    editedSameFile: true
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
            // setPatientListAS({ ...patientListAS, selectedData: [{ ...response.data.payload.patient }] })
            //  setActivityAS({ ...ActivityAS, selectedData: response.data.payload.implementation_plan ? [{ ...response.data.payload.implementation_plan }] : [] })
            setCategoryAS({ ...categoryAS, selectedData: [{ ...response.data.payload.category }] })
            setSubCategoryAS(getActionSheetAPIDetail({
                url: Constants.apiEndPoints.categoryChildList, params: { parent_id: response.data.payload.category_id }, debugMsg: "sub-category", token: UserLogin.access_token,
                selectedData: [{ ...response.data.payload.subcategory }]
            }))
            setEmployeeAS({ ...employeeAS, selectedData: employee })
            setIsLoading(false);
        }
        else {
            setIsLoading(false);
            Alert.showAlert(Constants.danger, response.errorMsg);
        }
    }

    const removeErrorTextForInputThatUserIsTyping = (formType, uniqueKey) => {
        if (formType == task_details) {
            let tempValidationObj = { ...initialValidationForTaskDetails }
            tempValidationObj[uniqueKey] = initialValidationForTaskDetails[uniqueKey];
            setValidationForTaskDetails(tempValidationObj);
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
        else if (key == formFieldsKeys.repetition_week_days_array) {
            setFormFields({ ...formFields, [key]: [...formFields.repetition_week_days_array, formatDateByFormat(value, 'yyyy-MM-DD')] })
        }
        else {
            //     setFormValues({ ...formValues, [key]: value })
            setFormFields({ ...formFields, [key]: value })
        }

    }

    const closeActionSheet = () => {
        actionSheetRef?.current?.setModalVisible();
        setActionSheetDecide('');
    }

    const validation = (formType) => {
        // return true;
        if (formType == task_details) {
            let validationObjTemp = { ...initialValidationForTaskDetails };
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

                    } else {
                        // console.log(`${key}-----5`)
                        // console.log(`${formFields.employee.length}-----4a`)
                        value['invalid'] = true;
                        value['title'] = labels[key + '_required']
                        isValid = false;
                        break;
                    }


                }
            }
            setValidationForTaskDetails({ ...validationObjTemp });
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
                    formFields[key].map((obj) => {
                        if (!obj?.start)
                            flag = true;
                    })
                    if (flag) {
                        // console.log('1', key)
                        value['invalid'] = true;
                        value['title'] = labels?.["add-start-time-and-end-time"]
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

                // else if (
                //     (key == formFieldsKeys.week_days)
                // ) {
                //     if (formFields[formFieldsKeys.repeat] && formFields[formFieldsKeys.end_date] && formFields[formFieldsKeys.repetition_type].api_value == "week") {
                //         let flag = false;
                //         formFields[formFieldsKeys.week_days].map((obj) => {
                //             if (obj.selected)
                //                 flag = true
                //         })
                //         if (!flag) {
                //             console.log(`${key}-----8`)
                //             value['invalid'] = true;
                //             value['title'] = labels[key + '_required']
                //             ////console.log(labels[(key + '_required')]);
                //             isValid = false;
                //             break;
                //         }
                //     }
                // }
                else if (
                    (key == formFieldsKeys.repetition_week_days_array)
                ) {
                    if (formFields[formFieldsKeys.repeat] && formFields[formFieldsKeys.end_date] && formFields[formFieldsKeys.repetition_type].api_value == "week") {
                        if (formFields.repetition_week_days_array?.length <= 0) {
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
        if (routeParams.resourceID && formFieldsKeys.category_type) {
            return true;
        }
        if (key == formFieldsKeys.reason_for_editing && !routeParams.taskID)
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
            case formFieldsKeys.activity: {
                return ActivityAS
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
            case formFieldsKeys.activity: {
                setActivityAS(getActionSheetAPIDetail({ ...ActivityAS, ...payload }))
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
                setActivityAS(getActionSheetAPIDetail({
                    ...ActivityAS, params: { patient_id: item?.id }, debugMsg: "sub-category", token: UserLogin.access_token,
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
            case formFieldsKeys.activity: {
                handleInputChange(formFieldsKeys.activity, item)
                removeErrorTextForInputThatUserIsTyping(formFieldsKeys.activity)
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

    const uploadFile = async () => {
        if (formFields.documents?.length > 0 && !checkFileSize(formFields.documents[0]))
            return;
        setIsLoading(true)
        let res = await APIService.uploadFile(Constants.apiEndPoints.uploadDoc, formFields.documents[0], UserLogin.access_token, 'task_attachment_' + formFields.documents[0].fileName ?? formFields.documents[0].name, 'single', 'Task Attachment')
        setIsLoading(false)
        if (res.errorMsg) {
            Alert.showAlert(Constants.danger, res.errorMsg)
            return null;
        }
        else {
            return res.data.payload.file_name;
        }
    }

    //console.log("routeParams?.categoryTypeID ####", routeParams?.categoryTypeID)
    const saveOrEditTask = async (fileName) => {

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

        let employees = []
        if (Array.isArray(formFields[formFieldsKeys.employee]) && formFields[formFieldsKeys.employee]?.length > 0)
            formFields[formFieldsKeys.employee].map((obj) => {
                // console.log('obj...employees', obj);
                employees.push('' + obj.id)
            })

        let params = {
            // type_id:formFields?.formFields??"",
            // "branch_id": formFields?.branch_id?? "",
            "category_id": formFields[formFieldsKeys.category]?.id,
            "subcategory_id": formFields[formFieldsKeys.subcategory]?.id,
            // "type_id": routeParams?.categoryTypeID ?? formFields[formFieldsKeys.category_type]?.id,
            "type_id": routeParams?.categoryTypeID ?? null,
            // "type_id": 3,
            "resource_id": routeParams.resourceID ?? null,
            "parent_id": null,
            "title": formFields[formFieldsKeys.title],
            "description": formFields[formFieldsKeys.description],
            "start_date": formFields[formFieldsKeys.start_date] ? formatDateForAPI(formFields[formFieldsKeys.start_date]) : '',
            "start_time": formFields[formFieldsKeys.start_time] ? formatTimeForAPI(formFields[formFieldsKeys.start_time]) : "",

            "is_repeat": formFields[formFieldsKeys.repeat] ? 1 : 0,
            "every": formFields[formFieldsKeys.repeat] ? formFields[formFieldsKeys.every] : "",
            "repetition_type": repetition_type,
            "week_days": week_days,
            "month_day": formFields[formFieldsKeys.day_in_month].api_value,

            "end_date": formFields[formFieldsKeys.end_date] ? formatDateForAPI(formFields[formFieldsKeys.end_date]) : '',
            "end_time": formFields[formFieldsKeys.end_time] ? formatTimeForAPI(formFields[formFieldsKeys.end_time]) : "",

            "employees": employees,
            // "address_url": formFields[formFieldsKeys.addressUrl],
            // "video_url": formFields[formFieldsKeys.videoUrl],
            // "information_url": formFields[formFieldsKeys.informationUrl],
            "file": fileName ?? '',

            "remind_before_start": formFields.notify_users_before_start_obj.isTrue ? 1 : 0,
            "before_minutes": formFields.notify_users_before_start_obj.isTrue ? formFields.notify_users_before_start_obj.time : "",
            "before_is_text_notify": formFields.notify_users_before_start_obj.send_text ? 1 : 0,
            "before_is_push_notify": formFields.notify_users_before_start_obj.send_notification ? 1 : 0,

            // "remind_after_end": formFields.notify_users_after_start_obj.isTrue ? 1 : 0,
            // "after_minutes": formFields.notify_users_after_start_obj.isTrue ? formFields.notify_users_after_start_obj.time : "",
            // "after_is_text_notify": formFields.notify_users_after_start_obj.send_text ? 1 : 0,
            // "after_is_push_notify": formFields.notify_users_after_start_obj.send_notification ? 1 : 0,

            // "is_emergency": formFields.notify_emergency_contact.isTrue ? 1 : 0,
            // "emergency_minutes": formFields.notify_emergency_contact.isTrue ? formFields.notify_emergency_contact.time : "",
            // "emergency_is_text_notify": formFields.notify_emergency_contact.send_text ? 1 : 0,
            // "emergency_is_push_notify": formFields.notify_emergency_contact.send_notification ? 1 : 0,

            // "in_time": formFields.notify_users_in_time_obj.isTrue ? 1 : 0,
            // "in_time_is_text_notify": formFields.notify_users_in_time_obj.send_text ? 1 : 0,
            // "in_time_is_push_notify": formFields.notify_users_in_time_obj.send_notification ? 1 : 0,

            "how_many_time": formFields[formFieldsKeys.how_many_time],
            "how_many_time_array": formFields[formFieldsKeys.how_many_time_array],
            "repeat_dates": formFields.repetition_week_days_array ?? null,
        }

        return;

        let url = Constants.apiEndPoints.addTask;

        if (routeParams.taskID) {
            url = url + '/' + routeParams.taskID;
            params['reason_for_editing'] = formFields.reason_for_editing;

            delete params.is_repeat;
            delete params.every;
            // delete params.repetition_type;
            delete params.week_days;
            delete params.month_day;
            delete params.category_id;
            delete params.subcategory_id;
            params.repetition_type = null;
        }
        // console.log("routeParams.taskID", routeParams.taskID, "params************", JSON.stringify(params))
        // console.log("url************", url)

        let response = {};
        // return
        setIsLoading(true);
        if (routeParams.taskID)
            response = await APIService.putData(url, params, UserLogin.access_token, null, "editTaskAPI");
        else
            response = await APIService.postData(url, params, UserLogin.access_token, null, "addTaskAPI");

        //  console.log("response************", JSON.stringify(response))
        // return;
        if (!response.errorMsg) {
            setIsLoading(false);
            Alert.showAlert(Constants.success, routeParams.taskID ? labels.task_edited_successfully : labels.task_added_successfully, () => { props.navigation.pop() })
        }
        else {
            setIsLoading(false);
            Alert.showAlert(Constants.danger, response.errorMsg)
        }
    }

    // const uploadFile = async (attachmentArr) => {
    //     // if (!checkFileSize(attachmentObj))
    //     //     return;
    //     setUploadingFile(true)
    //     let res = await APIService.uploadFile(Constants.apiEndPoints.uploadDoc, attachmentArr, UserLogin.access_token, 'patient_attachments_', 'multiple', 'patient plan Attachment')
    //     setUploadingFile(false)
    //     if (res.errorMsg) {
    //         Alert.showAlert(Constants.danger, res.errorMsg)
    //         return null;
    //     }
    //     else {
    //         Alert.showAlert(Constants.success, messages.message_uploaded_successfully)
    //         return res.data.payload;
    //     }
    // }

    // const imageOrDocumentResponseHandler = async (response) => {
    //     if (response.didCancel) {
    //         //console.log('User cancelled image picker');
    //     } else if (response.error) {
    //         //console.log('ImagePicker Error: ', response.error);
    //         Alert.showAlert(Constants.danger, messages.message_something_went_wrong)
    //     } else if (response.customButton) {
    //         //console.log('User tapped custom button: ', response.customButton);
    //     } else {
    //         //  this.setState({ avatarSource: response, imagePathText: response.type });
    //         if (Array.isArray(response) && response.length > 0) {
    //             let uploaded_doc_arr = await uploadFile(response);
    //             if (!uploaded_doc_arr)
    //                 return;
    //             uploaded_doc_arr.map((obj) => {
    //                 obj['uploaded_doc_url'] = obj.file_name
    //                 obj['uri'] = obj.file_name;
    //                 obj['type'] = obj.uploading_file_name;
    //             })
    //             let tempDocArr = [...patientFormValues.documents];
    //             tempDocArr = tempDocArr.concat(uploaded_doc_arr)
    //             handleInputChange(patientForm, tempDocArr, patientFormKeys.documents)
    //         }
    //         else if (response?.assets) {
    //             let uploaded_doc_arr = await uploadFile(response?.assets);
    //             if (!uploaded_doc_arr)
    //                 return;
    //             uploaded_doc_arr.map((obj) => {
    //                 obj['uploaded_doc_url'] = obj.file_name
    //                 obj['uri'] = obj.file_name;
    //                 obj['type'] = "image";
    //             })

    //             let tempDocArr = [...patientFormValues.documents];
    //             tempDocArr = tempDocArr.concat(uploaded_doc_arr)
    //             handleInputChange(patientForm, tempDocArr, patientFormKeys.documents)
    //         }
    //     }
    // }

    const imageOrDocumentResponseHandler = (response) => {
        // console.log("===lab test", response)
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
                handleInputChange(formFieldsKeys.documents, response)
            else
                handleInputChange(formFieldsKeys.documents, response?.assets)
        }
    }




    // render view
    // console.log(' formFields[formFieldsKeys.employee]?.length', formFields[formFieldsKeys.employee]?.length)
    if (isLoading)
        return <ProgressLoader />

    return (
        <BaseContainer
            onPressLeftIcon={() => { props.navigation.pop() }}
            leftIcon="arrow-back"
            // leftIconSize={24}
            title={labels["add-task"]}
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
                            viewDecider == 4
                                ? () => { setViewDecider(3) }
                                : () => { }
                }
                title={
                    viewDecider == 1
                        ? labels["task-details"]
                        : viewDecider == 2
                            ? labels["time-and-repetition"]
                            : viewDecider == 3
                                ? labels["repeat-reminder"]
                                : viewDecider == 4
                                    ? labels["attachments"]
                                    : ""
                }
            />

            {/* Main View */}
            <KeyboardAwareScrollView
                style={styles.mainView} keyboardShouldPersistTaps="handled" >
                {(viewDecider == 1) ? <>

                    {/* reason for editing */}
                    {/* {routeParams.activityId
                        ? <InputValidation
                            uniqueKey={formFieldsKeys.reason_for_editing}
                            validationObj={validationForActivityDetails}
                            value={formFields.reason_for_editing}
                            placeHolder={labels["reason-for-editing"]}
                            iconColor={Colors.primary}
                            onChangeText={(text) => {
                                removeErrorTextForInputThatUserIsTyping(task_details, formFieldsKeys.reason_for_editing);
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
                        placeHolder={labels["title"]}
                        iconColor={Colors.primary}
                        onChangeText={(text) => {
                            removeErrorTextForInputThatUserIsTyping(task_details, formFieldsKeys.title);
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
                        placeHolder={labels["discription"]}
                        iconColor={Colors.primary}
                        onChangeText={(text) => {
                            removeErrorTextForInputThatUserIsTyping(task_details, formFieldsKeys.description);
                            filterSuggestion(text, (filteredData) => { setDescrptionSuggestion(filteredData) })
                            handleInputChange(formFieldsKeys.description, text)
                        }}
                        style={{ marginTop: Constants.formFieldTopMargin }}
                        inputMainViewStyle={{ ...styles.InputValidationView, }}
                        inputStyle={{ ...styles.inputStyle, height: 120, textAlignVertical: "top" }}
                    />



                    {/* {
                        formFields.patient?.name
                            ?
                            //    implementation plan 
                            < InputValidation
                                // uniqueKey={formFieldsKeys.patient}
                                // validationObj={validationForActivityDetails}
                                placeHolder={labels.implementation_plan}
                                optional={true}
                                value={formFields.implementation_plan?.title ?? ""}
                                iconRight='chevron-down'
                                iconColor={Colors.primary}
                                editable={false}
                                onPressIcon={() => {
                                    removeErrorTextForInputThatUserIsTyping(task_details, formFieldsKeys.implementation_plan)
                                    setActionSheetDecide(formFieldsKeys.implementation_plan)
                                    actionSheetRef.current?.setModalVisible()
                                }}
                                style={{ marginTop: Constants.formFieldTopMargin, }}
                                inputMainViewStyle={styles.InputValidationView}
                                inputStyle={styles.inputStyle}
                            />
                            : null
                    } */}


                    {/* employee */}
                    <InputValidation
                        // uniqueKey={formFieldsKeys.employee}
                        // validationObj={validationForActivityDetails}
                        placeHolder={labels["employees"]}
                        value={formFields.employee?.name ?? ""}
                        iconRight='chevron-down'
                        iconColor={Colors.primary}
                        optional={true}
                        editable={false}
                        onPress={() => {
                            removeErrorTextForInputThatUserIsTyping(task_details, formFieldsKeys.employee)
                            setActionSheetDecide(formFieldsKeys.employee)
                            actionSheetRef.current?.setModalVisible()
                        }}
                        style={{ marginTop: Constants.formFieldTopMargin, }}
                        inputMainViewStyle={styles.InputValidationView}
                        inputStyle={styles.inputStyle}
                    />
                    <MSDataViewer
                        data={formFields[formFieldsKeys.employee]}
                        setNewDataOnPressClose={(newArr) => {
                            setEmployeeAS({ ...employeeAS, selectedData: newArr });
                            handleInputChange(formFieldsKeys.employee, newArr)
                        }}
                    />

                    {/* patient */}
                    <InputValidation
                        // uniqueKey={formFieldsKeys.patient}
                        // validationObj={validationForActivityDetails}
                        placeHolder={labels.patient}
                        value={formFields.patient?.name ?? ""}
                        iconRight='chevron-down'
                        iconColor={Colors.primary}
                        optional={true}
                        editable={false}
                        onPressIcon={() => {
                            // removeErrorTextForInputThatUserIsTyping(task_details, formFieldsKeys.patient)
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
                            //    activity
                            < InputValidation
                                placeHolder={labels.activity}
                                optional={true}
                                value={formFields.activity?.title ?? ""}
                                iconRight='chevron-down'
                                iconColor={Colors.primary}
                                editable={false}
                                onPressIcon={() => {
                                    removeErrorTextForInputThatUserIsTyping(task_details, formFieldsKeys.activity)
                                    setActionSheetDecide(formFieldsKeys.activity)
                                    actionSheetRef.current?.setModalVisible()
                                }}
                                style={{ marginTop: Constants.formFieldTopMargin, }}
                                inputMainViewStyle={styles.InputValidationView}
                                inputStyle={styles.inputStyle}
                            />
                            : null
                    }

                    {/* external_comment */}
                    {/* <InputValidation
                        // uniqueKey={formFieldsKeys.external_comment}
                        multiline={true}
                        // validationObj={validationForActivityDetails}
                        value={formFields.external_comment}
                        placeHolder={labels.external_comment}
                        iconColor={Colors.primary}
                        onChangeText={(text) => {
                            // removeErrorTextForInputThatUserIsTyping(task_details, formFieldsKeys.external_comment);
                            handleInputChange(formFieldsKeys.external_comment, text)
                        }}
                        style={{ marginTop: Constants.formFieldTopMargin }}
                        inputMainViewStyle={{ ...styles.InputValidationView, }}
                        inputStyle={{ ...styles.inputStyle, maxHeight: 130, textAlignVertical: "top" }}
                    /> */}

                    {/* internal_comment */}
                    {/* <InputValidation
                        // uniqueKey={formFieldsKeys.internal_comment}
                        multiline={true}
                        // validationObj={validationForActivityDetails}
                        value={formFields.internal_comment}
                        placeHolder={labels.internal_comment}
                        iconColor={Colors.primary}
                        onChangeText={(text) => {
                            // removeErrorTextForInputThatUserIsTyping(task_details, formFieldsKeys.internal_comment);
                            handleInputChange(formFieldsKeys.internal_comment, text)
                        }}
                        style={{ marginTop: Constants.formFieldTopMargin }}
                        inputMainViewStyle={{ ...styles.InputValidationView, }}
                        inputStyle={{ ...styles.inputStyle, maxHeight: 130, textAlignVertical: "top" }}
                    /> */}

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

                    {/* is r */}
                    {/* <View style={styles.checkBoxView}>
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
                            <Text style={styles.saveAsTemplate}>{labels.is_risk}</Text>
                        </View>
                    </View> */}

                    {
                        formFields.is_risk
                            ?
                            < InputValidation
                                // uniqueKey={formFieldsKeys.risk_description}                               
                                // validationObj={validationForActivityDetails}
                                value={formFields.risk_description}
                                placeHolder={labels["risk-description"]}
                                iconColor={Colors.primary}
                                onChangeText={(text) => {
                                    // removeErrorTextForInputThatUserIsTyping(task_details, formFieldsKeys.risk_description);
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
                            Keyboard.dismiss()
                            if (validation(task_details)) {
                                //loginAPI();
                                // console.log('Validation true')
                                setViewDecider(2)
                            }
                            else {
                                Alert.showAlert(Constants.warning, messages.message_fill_all_required_fields)
                                // console.log('Validation false')
                            }
                        }} title={labels["Next"]}
                    />
                </> : null}

                {
                    (viewDecider == 2) ? <>
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
                            placeHolder={labels["start-date"]}
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
                                optional={true}
                                editable={false}
                                onPressIcon={() => {
                                    removeErrorTextForInputThatUserIsTyping(time_and_repetition, formFieldsKeys.end_date)
                                    setOpenDatePicker(true);
                                    setMode(Constants.DatePickerModes.date_mode);
                                    setDatePickerKey(formFieldsKeys.end_date)
                                }}
                                value={formFields.end_date ? formatDate(formFields.end_date) : ''}
                                placeHolder={labels["end-date"]}
                                style={styles.InputValidationView}
                                inputStyle={styles.inputStyle}
                            /> : null}

                        <View style={{ ...styles.InputValidationView, }}>
                            <Text style={{ ...styles.headingTitleStyle }}>{labels["how-many-times-a-day"]}</Text>
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
                                                iconRight="time"
                                                value={item.start ? formatTime(item.start) : ""}
                                                placeHolder={labels["start-time"]}
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
                                                placeHolder={labels["end-time"]}
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
                            ? <View style={{ ...styles.checkBoxView, marginTop: Constants.formFieldTopMargin }}>
                                <BouncyCheckbox
                                    size={20}
                                    fillColor={Colors.primary}
                                    unfillColor={Colors.white}
                                    iconStyle={{ borderColor: Colors.primary }}
                                    isChecked={formFields.repeat}
                                    onPress={(value) => {
                                        // handleInputChange(formFieldsKeys.repeat, value,);
                                        setFormFields({
                                            ...formFields, [formFieldsKeys.repeat]: value, [formFieldsKeys.repetition_type]: repetitionTypeData[0], [formFieldsKeys.week_days]: [...week_days_data],
                                            //  [formFieldsKeys.repetition_time]: ''
                                            [formFieldsKeys.repetition_week_days_array]: []
                                            , [formFieldsKeys.day_in_month]: {}, [formFieldsKeys.every]: 1
                                        })
                                        setDaysInMonthAS({ ...daysInMonthAS, selectedData: [] })
                                        setRepetitionTypeAS(getActionSheetAPIDetail({ ...repetitionTypeAS, selectedData: [repetitionTypeData[0]] }))

                                    }}
                                />
                                <Text style={styles.saveAsTemplate}>{labels["repeat"]}</Text>
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
                                        placeHolder={labels["every"]}
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
                                        placeHolder={labels["repetition-type"]}
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
                                            <InputValidation
                                                iconRight="calendar"
                                                uniqueKey={formFieldsKeys.repetition_week_days_array}
                                                validationObj={validationForTimeAndRepetition}
                                                // value={formFields[formFieldsKeys.repetition_type].name ? '' + formFields[formFieldsKeys.repetition_type].name : ""}
                                                placeHolder={labels["select-day"]}
                                                onPressIcon={() => {
                                                    removeErrorTextForInputThatUserIsTyping(time_and_repetition, formFieldsKeys.repetition_week_days_array)
                                                    setOpenDatePicker(true);
                                                    setMode(Constants.DatePickerModes.date_mode);
                                                    setDatePickerKey(formFieldsKeys.repetition_week_days_array)
                                                }}
                                                style={{ ...styles.InputValidationView, }}
                                                inputStyle={{ ...styles.inputStyle }}
                                                editable={false}
                                            />

                                            <MSDataViewer
                                                data={formFields[formFieldsKeys.repetition_week_days_array]}
                                                setNewDataOnPressClose={(newArr) => {
                                                    handleInputChange(formFieldsKeys.repetition_week_days_array, newArr)
                                                }}
                                            />
                                            {/* <FlatList
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
                                                validationObj={validationForTimeAndRepetition} /> */}
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
                                Keyboard.dismiss()
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
                                <Text style={styles.saveAsTemplate}>{labels["you-will-be-reminded-before"]}</Text>
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
                                                // removeErrorTextForInputThatUserIsTyping(task_details,formFieldsKeys.title);
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
                                        // removeErrorTextForInputThatUserIsTyping(task_details,formFieldsKeys.title);
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
                        {/* <View style={styles.checkBoxView}>
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
                                        placeHolder={labels["time-in-minute"]}
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
                                                // removeErrorTextForInputThatUserIsTyping(task_details,formFieldsKeys.title);
                                                handleInputChange(formFieldsKeys.notify_emergency_contact, { ...formFields[formFieldsKeys.notify_emergency_contact], time: textToNum })
                                            }
                                        }}
                                        style={{ marginTop: Constants.formFieldTopMargin, width: "50%", marginStart: 7, marginTop: 5 }}
                                        inputMainViewStyle={styles.InputValidationView}
                                        inputStyle={styles.inputStyle}
                                    />
                                </>
                                : null
                        } */}
                        {/* next button */}
                        <CustomButton
                            style={{
                                ...styles.nextButton,
                                backgroundColor: isValid ? Colors.primary : Colors.lightPrimary
                            }}
                            onPress={() => {
                                Keyboard.dismiss()
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
                            <View style={{
                                flex: 1,
                                paddingHorizontal: Constants.globalPaddingHorizontal
                            }}>
                                <UploadedFileViewer
                                    isLoading={uploadingFile}
                                    data={formFields.documents}
                                    setNewData={(newArr) => {
                                        handleInputChange(newArr, formFieldsKeys.documents)
                                    }}
                                />
                                {/* UPLOAD */}
                                {formFields.documents?.length <= 0
                                    ? <TouchableOpacity
                                        onPress={() => {
                                            setActionSheetDecide(formFieldsKeys.attachment)
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
                                    </TouchableOpacity> : null}

                                {/* save button */}
                                <CustomButton
                                    title={labels["save"]}
                                    style={{ marginTop: Constants.formFieldTopMargin }}
                                    onPress={async () => {
                                        Keyboard.dismiss()
                                        if (validation(attachment)) {
                                            //console.log('validation success')
                                            // return;
                                            // saveOrEditActivity()
                                            let badWordString = getBadWordString();
                                            if (formFields.documents?.length > 0) {
                                                if (formFields.documents[0]?.editedSameFile) {
                                                    saveOrEditTask(formFields.documents[0]?.fileName ?? formFields.documents[0]?.name)
                                                }
                                                else {
                                                    let fileName = await uploadFile();
                                                    if (fileName)
                                                        saveOrEditTask(fileName)
                                                }
                                            }
                                            // else {
                                            //     saveOrEditTask()
                                            // }
                                            if (badWordString) {
                                                Alert.showBasicDoubleAlertForBoth(badWordString, () => {
                                                    saveOrEditTask()
                                                }, null, messages.message_bad_word_alert)
                                            }
                                            else
                                                saveOrEditTask()
                                        }
                                        else {
                                            Alert.showAlert(Constants.warning, messages.message_fill_all_required_fields)
                                            // console.log('validation fail')
                                        }
                                    }}
                                />
                            </View></> : null
                }

                <ActionSheet ref={actionSheetRef}>
                    {
                        actionSheetDecide == ''
                            ? null
                            : actionSheetDecide == formFieldsKeys.attachment
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
                    minimumDate={mode == Constants.DatePickerModes.date_mode ? new Date() : null}
                    date={new Date()}
                    onConfirm={(date) => {
                        setOpenDatePicker(false)
                        // console.log('date : ', date)
                        let value = '';
                        if (mode == Constants.DatePickerModes.date_mode)
                            handleInputChange(datePickerKey, date)
                        else if (mode == Constants.DatePickerModes.time_mode)
                            handleInputChange(datePickerKey, date)
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

export default AddTask

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
    }
})



