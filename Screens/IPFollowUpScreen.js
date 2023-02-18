import React from 'react'
import { StyleSheet, Text, View, ScrollView, FlatList, TouchableOpacity, RefreshControl, Keyboard } from 'react-native'
import Colors from '../Constants/Colors';
import { useSelector, useDispatch } from 'react-redux';
import BaseContainer from '../Components/BaseContainer';
import Constants from '../Constants/Constants';
import APIService from '../Services/APIService';
import Alert from '../Components/Alert';
import InputValidation from '../Components/InputValidation';
import DatePicker from 'react-native-date-picker';
import { formatDate, formatTime, getActionSheetAPIDetail, getJSObjectFromTimeString, getProportionalFontSize, jsCoreDateCreator, isDocOrImage, formatDateForAPI, formatTimeForAPI } from '../Services/CommonMethods';
import PersonFormComp from '../Components/PersonFormComp';
import CustomButton from '../Components/CustomButton';
import BouncyCheckbox from "react-native-bouncy-checkbox";
import Assets from '../Assets/Assets';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Checkbox, Modal, Portal, } from 'react-native-paper';
import ActionSheet from "react-native-actions-sheet";
import ActionSheetComp from '../Components/ActionSheetComp';
import FormSubHeader from '../Components/FormSubHeader';
import EmptyDataContainer from '../Components/EmptyDataContainer';
import ErrorComp from '../Components/ErrorComp';
import { NetInfoCellularGeneration } from '@react-native-community/netinfo';
import UploadedFileViewer from '../Components/UploadedFileViewer';
import ProgressLoader from '../Components/ProgressLoader';
// import Icon from 'react-native-vector-icons/Ionicons';
import CommonAPIFunctions from '../Services/CommonAPIFunctions';


const IPFollowUpScreen = (props) => {

    const routeParam = props?.route?.params ?? {}

    const week_days_data = [
        { name: 'S', number: 0, selected: false }, { name: 'M', number: 1, selected: false }, { name: 'T', number: 2, selected: false },
        { name: 'W', number: 3, selected: false }, { name: 'T', number: 4, selected: false },
        { name: 'F', number: 5, selected: false }, { name: 'S', number: 6, selected: false }
    ]

    const formKeys = {
        reason_for_editing: "reason_for_editing",
        title: "title",
        description: "description",
        implementation: "implementation",
        remark: "remark",
        start_date: "start_date",
        end_date: "end_date",
        start_time: "start_time",
        end_time: "end_time",
        repeat: "repeat",
        every: "every",
        repetition_type: "repetition_type",
        // repetition_time: "repetition_time",
        week_days: "week_days",
        day_in_month: "day_in_month",
        new_question: "new_question",
        personList: "personList",
        follow_up_dates: "follow_up_dates",
        external_comment: "external_comment",
        internal_comment: "internal_comment",
        documents: "documents",
        attachment: "attachment"
    }

    const formInitialValidationObj = {
        // [formKeys.reason_for_editing]: {
        //     invalid: false,
        //     title: ''
        // },
        [formKeys.title]: {
            invalid: false,
            title: ''
        },
        [formKeys.description]: {
            invalid: false,
            title: ''
        },
        // [formKeys.remark]: {
        //     invalid: false,
        //     title: ''
        // },
        [formKeys.implementation]: {
            invalid: false,
            title: ''
        },
        // [formKeys.start_date]: {
        //     invalid: false,
        //     title: ''
        // },
        // [formKeys.end_date]: {
        //     invalid: false,
        //     title: ''
        // },
        // [formKeys.start_time]: {
        //     invalid: false,
        //     title: ''
        // },
        // [formKeys.end_time]: {
        //     invalid: false,
        //     title: ''
        // },
        [formKeys.every]: {
            invalid: false,
            title: ''
        },
        [formKeys.repetition_type]: {
            invalid: false,
            title: ''
        },
        // [formKeys.repetition_time]: {
        //     invalid: false,
        //     title: ''
        // },
        [formKeys.week_days]: {
            invalid: false,
            title: ''
        },
        [formKeys.day_in_month]: {
            invalid: false,
            title: ''
        },
        [formKeys.follow_up_dates]: {
            invalid: false,
            title: ''
        },
    }

    // Hooks
    const actionSheetRef = React.useRef();

    // REDUX hooks
    const UserLogin = useSelector(state => state.User.UserLogin);
    const permissions = UserLogin?.permissions ?? {}
    const labels = useSelector(state => state.Labels);
    const messages = useSelector(state => state.Labels);

    const repetitionTypeData = [{ name: labels.day, api_value: "day", id: 1 }, { name: labels.week, api_value: "week", id: 2 }, { name: labels.month, api_value: "month", id: 3 }, { name: labels.year, api_value: "year", id: 4 }]

    const formInitialValues = {

        documents: [],
        reason_for_editing: "",
        title: "",
        description: "",
        implementation: "",
        remark: "",
        start_date: "",
        end_date: "",
        start_time: "",
        end_time: "",
        repeat: false,
        every: 1,
        repetition_type: repetitionTypeData[0],
        week_days: week_days_data,
        day_in_month: {},
        new_question: "",
        personList: [],
        external_comment: "",
        internal_comment: "",
        follow_up_dates: [
            {
                start_date: "",
                end_date: "",
                start_time: "",
                end_time: "",
            }
        ]
        // repetition_time: "",
    }

    const days_in_month_data_creator = () => {
        let data = []
        for (let i = 1; i <= 31; i++) {
            data.push({ name: labels.day_in_month + " " + i, api_value: "" + i, id: '' + i })
        }
        data.push({ name: labels.last_day, api_value: "" + 0, id: '' + 0 })
        return data;
    }

    //use state hooks
    const [isLoading, setIsLoading] = React.useState(false);
    const [addNewQuestionLoading, setAddNewQuestionLoading] = React.useState(false);
    const [formValidationObj, setFormValidationObj] = React.useState({ ...formInitialValidationObj });
    const [questionValidationObj, setQuestionValidationObj] = React.useState({
        [formKeys.new_question]: {
            invalid: false,
            title: labels.question_required
        },
    });
    const [formValues, setFormValues] = React.useState({ ...formInitialValues });
    const [mode, setMode] = React.useState(Constants.DatePickerModes.date_mode);
    const [datePickerKey, setDatePickerKey] = React.useState(null);
    const [openDatePicker, setOpenDatePicker] = React.useState(false);
    const [viewDecider, setViewDecider] = React.useState(1);
    const [isValid, setIsValid] = React.useState(true);
    const [actionSheetDecide, setActionSheetDecide] = React.useState('');
    const [questions, setQuestions] = React.useState([]);

    const [questionGroupIndex, setQuestionGroupIndex] = React.useState(null);
    const [iPDetail, setIPDetail] = React.useState(null);
    const [isModalVisible, setIsModalVisible] = React.useState(false);
    const [uploadingFile, setUploadingFile] = React.useState(false);
    const [repetitionTypeAS, setRepetitionTypeAS] = React.useState(getActionSheetAPIDetail({
        url: '', data: repetitionTypeData,
        selectedData: [repetitionTypeData[0]]
    }));
    const [implementationAS, setImplementationAS] = React.useState(getActionSheetAPIDetail({
        url: Constants.apiEndPoints.implementationPlanList,
        debugMsg: 'implementationList',
        token: UserLogin.access_token,
        // data: repetitionTypeData,
        selectedData: []
    }));
    const [daysInMonthAS, setDaysInMonthAS] = React.useState(getActionSheetAPIDetail({
        url: '', data: days_in_month_data_creator(),
        selectedData: []
    }));
    const [followUpDateIndexNKey, setFollowUpDateIndexNKey] = React.useState({
        index: "",
        key: ""
    });

    // BadWords & Suggetion

    const [suggestion, setSuggestion] = React.useState([]);
    const [badWords, setBadWords] = React.useState([]);
    const [descrptionSuggestion, setDescrptionSuggestion] = React.useState([]);
    const [commentSuggestion, setcomment] = React.useState([]);
    // useEffect hooks
    React.useEffect(() => {
        CommonAPIFunctions.getSuggestions(UserLogin.access_token, (data) => { setSuggestion(data) });
        CommonAPIFunctions.getBadWords(UserLogin.access_token, (data) => { setBadWords(data) });
        // userDetailAPI()

    }, [])
    const getBadWordString = () => {
        let result = '';
        for (let i = 0; i < badWords?.length; i++) {
            let currBadWord = badWords[i]?.name?.toLowerCase();

            if (formValues?.title?.toLowerCase()?.includes(currBadWord)
                || formValues?.description?.toLowerCase()?.includes(currBadWord)
                || formValues?.remark?.toLowerCase()?.includes(currBadWord)
                || formValues?.suggestion_to_prevent_event_again?.toLowerCase()?.includes(currBadWord)
                || formValues?.follow_up?.toLowerCase()?.includes(currBadWord)

            ) {
                if (!result?.toLowerCase()?.includes(currBadWord))
                    result = result + badWords[i]?.name + ", ";
            }
        }
        if (result)
            result = result?.substring(0, result?.length - 2);
        return result;
    }
    // FilterSuggetion
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



    // useEffect hooks
    React.useEffect(() => {
        if (routeParam?.implementationName !== undefined)
            setFormValues({ ...formValues, [formKeys.implementation]: routeParam?.implementationName })
    }, [])

    React.useEffect(() => {
        if (routeParam.followUPId !== undefined && routeParam.followUPId !== null)
            followUpDetailAPI(routeParam.followUPId)
        else
            getQuestions()
        if (routeParam.IPId)
            getImplementationDetail()
    }, [])

    React.useEffect(() => {
        const unsubscribe = props.navigation.addListener('focus', () => {
            // The screen is focused
            // Call any action
            // console.log('Focus___________________________________________')
        });
        // Return the function to unsubscribe from the event so it gets removed on unmount
        return unsubscribe;
    }, [props.navigation]);


    const addNewQuestionAPI = async (newQuestion) => {
        setAddNewQuestionLoading(true);
        let url = Constants.apiEndPoints.addNewQuestion;
        let params = { ...newQuestion }
        let response = await APIService.postData(url, params, UserLogin.access_token, null, "addNewQuestionAPI");
        if (!response.errorMsg) {
            await getQuestions()
            setAddNewQuestionLoading(false);
            onRequestClose()
        }
        else {
            setAddNewQuestionLoading(false);
            Alert.showBasicAlert(response.errorMsg);
        }
    }

    const followUpDetailAPI = async (id) => {
        setIsLoading(true)
        let url = Constants.apiEndPoints.followUp + "/" + id;
        let response = await APIService.getData(url, UserLogin.access_token, null, "followUpDetailAPI");
        if (!response.errorMsg) {
            // let week_days_from_api = await response.data.payload.week_days ? JSON.parse(response.data.payload.week_days) : []
            // let temp_week_days = [...week_days_data];
            // week_days_from_api?.map((num) => {
            //     temp_week_days.map((obj) => {
            //         if (obj.number == num)
            //             obj['selected'] = true;
            //     })
            // })
            // console.log('new Date(response.data.payload.start_date)', formatTime(new Date(response.data.payload.start_date)))
            // return
            let tempDocuments = []
            if (response.data.payload.documents) {
                let tempArr = await JSON.parse(response.data.payload.documents);
                tempArr?.map((obj) => {
                    let tempObj = {
                        uploaded_doc_url: obj.file_url,
                        uri: obj.file_url,
                        type: isDocOrImage(obj.file_name),
                        uploading_file_name: obj.file_name,
                        file_name: obj.file_url,
                    }
                    tempDocuments.push(tempObj)
                })
            }
            setFormValues({
                ...formValues,
                [formKeys.title]: response.data.payload.title,
                [formKeys.description]: response.data.payload.description,
                [formKeys.implementation]: response.data.payload.implementation,
                // [formKeys.start_date]: jsCoreDateCreator(response.data.payload.start_date),
                // [formKeys.start_time]: jsCoreDateCreator(response.data.payload.start_time),
                // [formKeys.repeat]: response.data.payload.is_repeat == 1 ? true : false,
                //  [formKeys.every]: response.data.payload.every ?? 1,
                // [formKeys.repetition_type]: response.data.payload.is_repeat == 1 ? repetitionTypeData[response.data.payload.repetition_type - 1] : repetitionTypeData[0],
                //[formKeys.week_days]: [...temp_week_days],
                // [formKeys.end_date]: jsCoreDateCreator(response.data.payload.end_date),
                // [formKeys.end_time]: jsCoreDateCreator(response.data.payload.end_date),
                [formKeys.remark]: response.data.payload.remarks,
                [formKeys.personList]: response.data.payload.persons,
                [formKeys.documents]: JSON.parse(response?.data?.payload?.documents) ?? [],
                [formKeys.follow_up_dates]: [{
                    start_time: response.data.payload.start_time ? getJSObjectFromTimeString(response.data.payload.start_time) : '',
                    end_time: response.data.payload.end_time ? getJSObjectFromTimeString(response.data.payload.end_time) : '',
                    start_date: response.data.payload.start_date ? new Date(response.data.payload.start_date) : '',
                    end_date: response.data.payload.end_date ? new Date(response.data.payload.end_date) : '',
                }],
                [formKeys.documents]: tempDocuments,
            })
            await getQuestions(response.data.payload.questions)
        }
        else {
            Alert.showAlert(Constants.danger, response.errorMsg);
        }
        setIsLoading(false)
    }

    const getQuestions = async (alreadySelectedQuestions) => {
        //  console.log('alreadySelectedQuestions-------------------------------', JSON.stringify(alreadySelectedQuestions))
        let url = Constants.apiEndPoints.questions;
        let params = {}
        let response = await APIService.postData(url, params, UserLogin.access_token, null, "getQuestionsAPI");
        if (!response.errorMsg) {
            if (alreadySelectedQuestions) {
                let tempQuestion = (response.data.payload && Array.isArray(response.data.payload) ? [...response.data.payload] : [])
                //console.log('tempQuestion------', JSON.stringify(tempQuestion))
                tempQuestion.map((obj) => {
                    alreadySelectedQuestions.map((obj1) => {
                        obj.questions.map((obj2) => {
                            if (obj1.question_id == obj2.id) {
                                //console.log('1')
                                obj2['is_visible'] = 1;
                            }
                            else if (obj2['is_visible']) {
                                //console.log('2')
                            }
                            else {
                                //console.log('3')
                                obj2['is_visible'] = 0;
                            }
                        })
                    })
                })
                setQuestions(tempQuestion);
            }
            else {
                setQuestions(response.data.payload && Array.isArray(response.data.payload) ? response.data.payload : []);
            }
        }
        else {
            Alert.showAlert(Constants.danger, response.errorMsg);
        }
    }

    // Helper methods
    const removeErrorTextForInputThatUserIsTyping = (key) => {
        setFormValidationObj({ ...formValidationObj, [key]: formInitialValidationObj[key] })
    }

    const handleInputChange = (key, value) => {
        if (key == formKeys.follow_up_dates) {
            let tempFollowUpDates = [...formValues.follow_up_dates];
            tempFollowUpDates[followUpDateIndexNKey.index][followUpDateIndexNKey.key] = value;
            setFormValues({ ...formValues, [key]: tempFollowUpDates })
        }
        else
            setFormValues({ ...formValues, [key]: value })
    }

    const saveFollowUp = async (ignorePersons, personsList) => {
        // console.log("persons", personsList)
        let persons = ignorePersons ? [] : (personsList ?? []);

        persons.map((obj) => {
            if (!obj.id)
                obj['id'] = ""
            obj['country_id'] = 209
        })

        let tempDocuments = null;
        if (formValues.documents?.length > 0) {
            tempDocuments = [];
            formValues.documents.map((obj) => {
                let tempObj = {
                    file_name: obj.uploading_file_name,
                    file_url: obj.uri
                }
                tempDocuments.push(tempObj);
            })
        }

        let tempFollowUpDates = [];
        formValues.follow_up_dates.map((obj) => {
            let tempObj = {
                start_date: "",
                end_date: "",
                start_time: "",
                end_time: "",
            };
            if (obj.start_date)
                tempObj.start_date = formatDateForAPI(obj.start_date);
            if (obj.end_date)
                tempObj.end_date = formatDateForAPI(obj.end_date);
            if (obj.start_time)
                tempObj.start_time = formatTimeForAPI(obj.start_time);
            if (obj.end_time)
                tempObj.end_time = formatTimeForAPI(obj.end_time);
            tempFollowUpDates.push(tempObj);
        })

        let params = {
            "ip_id": routeParam.IPId ?? null,
            "branch_id": "",
            "title": formValues[formKeys.title],
            "description": formValues[formKeys.description],
            "ip_id": iPDetail.id ?? [],
            // "start_date": formValues[formKeys.start_date],
            // "start_time": formValues[formKeys.start_time],
            // "is_repeat": formValues[formKeys.repeat] ? 1 : 0,
            // "every": formValues[formKeys.repeat] ? formValues[formKeys.every] : "",
            // "repetition_type": repetition_type,
            // "week_days": week_days,
            // "month_day": formValues[formKeys.day_in_month].api_value,
            // "end_date": formValues[formKeys.end_date],
            // "end_time": formValues[formKeys.end_time],
            "remarks": formValues[formKeys.remark],
            "internal_comment": formValues[formKeys.internal_comment],
            "external_comment": formValues[formKeys.external_comment],
            // "persons": persons,
            // "questions": [],
            "repeat_datetime": tempFollowUpDates,
            documents: tempDocuments,
        }

        // console.log('params---------', JSON.stringify(params))
        // return;
        setIsLoading(true)

        let url = Constants.apiEndPoints.followUp;
        if (routeParam.followUPId !== undefined && routeParam.followUPId !== null) {
            url = url + '/' + routeParam.followUPId;
            params['reason_for_editing'] = formValues[formKeys.reason_for_editing];
        }

        let response = {};

        if (routeParam.followUPId !== undefined && routeParam.followUPId !== null)
            response = await APIService.putData(url, params, UserLogin.access_token, null, "editFollowUpAPI");
        else
            response = await APIService.postData(url, params, UserLogin.access_token, null, "saveFollowUpAPI");

        if (!response.errorMsg) {
            Alert.showAlert(Constants.success, routeParam.followUPId ? labels.follow_edited_successfully : labels.follow_added_successfully, () => { props.navigation.pop() })
        }
        else {
            Alert.showAlert(Constants.danger, response.errorMsg)
        }
        setIsLoading(false)
    }

    const closeActionSheet = () => {
        setActionSheetDecide('');
        actionSheetRef?.current?.setModalVisible();
    }

    const uploadFile = async (attachmentArr) => {
        // if (!checkFileSize(attachmentObj))
        //     return;
        setUploadingFile(true)
        let res = await APIService.uploadFile(Constants.apiEndPoints.uploadDoc, attachmentArr, UserLogin.access_token, 'patient_attachments_', 'multiple', 'patient plan Attachment')
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
            if (Array.isArray(response) && response.length > 0) {
                let uploaded_doc_arr = await uploadFile(response);
                if (!uploaded_doc_arr)
                    return;
                uploaded_doc_arr.map((obj) => {
                    obj['uploaded_doc_url'] = obj.file_name
                    obj['uri'] = obj.file_name;
                    obj['type'] = obj.uploading_file_name;
                })
                let tempDocArr = [...formValues.documents];
                tempDocArr = tempDocArr.concat(uploaded_doc_arr)
                // handleInputChange(tempDocArr, formValues[formKeys.documents])
                handleInputChange(formKeys.documents, tempDocArr,)
            }
            else if (response?.assets) {
                let uploaded_doc_arr = await uploadFile(response?.assets);
                if (!uploaded_doc_arr)
                    return;
                uploaded_doc_arr.map((obj) => {
                    obj['uploaded_doc_url'] = obj.file_name
                    obj['uri'] = obj.file_name;
                    obj['type'] = "image";
                })

                let tempDocArr = [...formValues.documents];
                tempDocArr = tempDocArr.concat(uploaded_doc_arr)
                handleInputChange(formKeys.documents, tempDocArr,)
            }
        }
    }

    const getAPIDetails = () => {
        switch (actionSheetDecide) {
            case formKeys.repetition_type: {
                return repetitionTypeAS
            }
            case formKeys.implementation: {
                return implementationAS
            }
            case formKeys.day_in_month: {
                return daysInMonthAS
            }
            default: {
                return null
            }
        }
    }

    const changeAPIDetails = (payload) => {
        switch (actionSheetDecide) {
            case formKeys.repetition_type: {
                setRepetitionTypeAS(getActionSheetAPIDetail({ ...repetitionTypeAS, ...payload }))
                break;
            }
            case formKeys.implementation: {
                setImplementationAS(getActionSheetAPIDetail({ ...implementationAS, ...payload }))
                break;
            }
            case formKeys.day_in_month: {
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
            case formKeys.repetition_type: {
                // handleInputChange(formKeys.repetition_type, item,)
                setFormValues({
                    ...formValues, [formKeys.repetition_type]: item, [formKeys.week_days]: [...week_days_data],
                    //  [formKeys.repetition_time]: '',
                    [formKeys.day_in_month]: {}
                })
                setDaysInMonthAS({ ...daysInMonthAS, selectedData: [] })
                removeErrorTextForInputThatUserIsTyping(formKeys.repetition_type)
                break;
            }
            case formKeys.day_in_month: {
                // handleInputChange(formKeys.repetition_type, item,)
                setFormValues({ ...formValues, [formKeys.day_in_month]: item, })
                removeErrorTextForInputThatUserIsTyping(formKeys.repetition_type)
                break;
            }
            case formKeys.implementation: {
                // console.log("item----------", JSON.stringify(item))
                setIPDetail(item)
                break;
            }
            default: {
                break;
            }
        }
    }

    const isMultiSelect = () => {
        switch (actionSheetDecide) {
            default: {
                return false;
            }
        }
    }

    const getImplementationDetail = async () => {

        setIsLoading(true);
        let url = Constants.apiEndPoints.implementationPlan + "/" + routeParam.IPId;
        // console.log("url", url);
        let response = await APIService.getData(url, UserLogin.access_token, null, "getImplementationDetailAPI");
        if (!response.errorMsg) {
            //handleInputChange(formFieldsKeys.implementation_plan, response.data.payload);
            setIPDetail(response.data.payload)
            setIsLoading(false);
            // setIsPer(false);
        }
        else {
            setIsLoading(false);
            Alert.showAlert(Constants.danger, response.errorMsg);
        }
    }


    const validation = () => {
        let validationObjTemp = { ...formValidationObj };
        let isValid = true;
        for (const [key, value] of Object.entries(validationObjTemp)) {
            // console.log(`${key}: ${value['invalid']}`);
            if (key == formKeys.start_date || key == formKeys.start_time || key == formKeys.end_date || key == formKeys.end_time) {
                if (formValues[key] == '') {
                    // console.log('1')
                    value['invalid'] = true;
                    value['title'] = labels[key + '_required']
                    //console.log(labels[(key + '_required')]);
                    isValid = false;
                    break;
                }

            }

            else if (key == formKeys.implementation) {
                if (!formValues[key] && routeParam?.implementationName) {
                    // console.log('1a')
                    value['invalid'] = true;
                    value['title'] = labels[key + '_required']
                    isValid = false;
                    break;
                }
            }

            else if (key == formKeys.reason_for_editing) {
                if (!formValues[key] && routeParam.followUPId) {
                    // console.log('1')
                    value['invalid'] = true;
                    value['title'] = labels.reason_for_editing_required
                    //console.log(labels[(key + '_required')]);
                    isValid = false;
                    break;
                }
            }
            else if (key == formKeys.follow_up_dates) {
                let flag = false;
                formValues[key].map((obj) => {
                    if (!obj.start_date || !obj.start_time)
                        flag = true;
                })
                if (flag) {
                    // console.log('1')
                    value['invalid'] = true;
                    value['title'] = labels.add_at_least_starting
                    //console.log(labels[(key + '_required')]);
                    isValid = false;
                    break;
                }
            }
            else if (key == formKeys.repetition_type && !formValues[key].name) {
                if (formValues[formKeys.repeat]) {
                    // console.log('2')
                    value['invalid'] = true;
                    value['title'] = labels[key + '_required']
                    //console.log(labels[(key + '_required')]);
                    isValid = false;
                    break;
                }
            }
            else if (
                (key == formKeys.week_days)
            ) {
                if (formValues[formKeys.repeat] && formValues[formKeys.repetition_type].api_value == "week") {
                    let flag = false;
                    formValues[formKeys.week_days].map((obj) => {
                        if (obj.selected)
                            flag = true
                    })
                    if (!flag) {
                        // console.log('3')
                        value['invalid'] = true;
                        value['title'] = labels[key + '_required']
                        //console.log(labels[(key + '_required')]);
                        isValid = false;
                        break;
                    }
                }
            }
            else if (
                (key == formKeys.day_in_month)
            ) {
                if (!formValues[key].name && formValues[formKeys.repeat] && formValues[formKeys.repetition_type].api_value == "month") {
                    // console.log('4')
                    value['invalid'] = true;
                    value['title'] = labels[key + '_required']
                    //console.log(labels[(key + '_required')]);
                    isValid = false;
                    break;
                }
            }
            else if (typeof (formValues[key]) == 'object' && !formValues[key].name
                //  && key != formKeys.repetition_time
            ) {
                // console.log('5', key)
                value['invalid'] = true;
                value['title'] = labels[key + '_required']
                //console.log(labels[(key + '_required')]);
                isValid = false;
                break;

            }
            else if (formValues[key] === '') {
                // console.log('6', key)
                value['invalid'] = true;
                value['title'] = labels[key + '_required']
                //console.log(labels[(key + '_required')]);
                isValid = false;
                break;

            }
        }
        if (!isValid)
            setFormValidationObj(validationObjTemp);
        else
            setFormValidationObj({ ...formInitialValidationObj });
        return isValid;
    };


    const renderFooter = (outerIndex) => {
        return (
            // Load More button
            <CustomButton
                onPress={() => {
                    setQuestionGroupIndex(outerIndex)
                    setIsModalVisible(true)
                }}
                title={labels.add_a_question}
                titleStyle={{ fontSize: getProportionalFontSize(12) }}
                style={{ ...styles.loadMoreButton, }} />
        );
    };

    const onRequestClose = () => {
        // console.log('onRequestClose called')
        setQuestionGroupIndex(null)
        setIsModalVisible(false);
    }


    // render view
    // console.log('formValues id', routeParam?.implementationName)
    // console.log('formValues[formKeys.description]', formValues[formKeys.description])
    if (isLoading)
        return <ProgressLoader />

    return (
        <BaseContainer
            onPressLeftIcon={() => { props.navigation.pop() }}
            leftIcon="arrow-back"
            leftIconSize={24}
            title={labels["followups"]}
            leftIconColor={Colors.primary}
        >
            <KeyboardAwareScrollView style={{ flex: 1 }} keyboardShouldPersistTaps="handled" >
                {/* MODAL */}
                <Portal>
                    <Modal
                        animationType="slide"
                        transparent={true}
                        style={{ paddingHorizontal: 10 }}
                        visible={isModalVisible}
                        onRequestClose={onRequestClose}
                    >
                        <View style={styles.innerView}>

                            {/* close icon */}
                            <Icon name='cancel' color={Colors.primary} size={30} onPress={() => {
                                if (!addNewQuestionLoading)
                                    onRequestClose()
                            }} />

                            {/* question input */}
                            <InputValidation
                                uniqueKey={formKeys.new_question}
                                validationObj={questionValidationObj}
                                value={formValues[formKeys.new_question]}
                                placeHolder={labels["new-question"]}
                                iconColor={Colors.primary}
                                onChangeText={(text) => {
                                    setQuestionValidationObj({
                                        [formKeys.new_question]: {
                                            invalid: false,
                                            title: labels.question_required
                                        },
                                    })
                                    handleInputChange(formKeys.new_question, text)
                                }}
                                style={styles.InputValidationView}
                                inputStyle={styles.inputStyle}
                            />

                            {/* add button */}
                            <CustomButton
                                isLoading={addNewQuestionLoading}
                                onPress={() => {
                                    if (formValues[formKeys.new_question]) {
                                        // console.log('validation success')
                                        let newQuestion = {
                                            "group_name": questions[questionGroupIndex].group_name,
                                            "question": formValues[formKeys.new_question],
                                            "is_visible": 0,
                                        }
                                        addNewQuestionAPI(newQuestion)
                                        // let tempQuestion = [...questions];
                                        // let tempQuestionArray = tempQuestion[questionGroupIndex].questions;

                                        // tempQuestionArray.push({ ...newQuestion })

                                        // tempQuestion[questionGroupIndex]['questions'] = [...tempQuestionArray]
                                        // console.log('tempQuestion', JSON.stringify(tempQuestion))
                                        // setQuestions([...tempQuestion])
                                        // handleInputChange(formKeys.new_question, '')
                                        // Alert.showToast(labels.question_added_successfully)
                                        // onRequestClose()
                                    }
                                    else {
                                        let tempObj = { ...questionValidationObj }
                                        tempObj[formKeys.new_question]['invalid'] = true;
                                        setQuestionValidationObj(tempObj)
                                    }
                                }}
                                title={labels["add"]}
                                style={{ marginTop: 30 }} />

                        </View>
                    </Modal>
                </Portal>

                {/* main view */}
                <View style={styles.mainView}>
                    {viewDecider == 1
                        ?
                        <>
                            {iPDetail
                                ? <Text numberOfLines={2} style={styles.headingText} >{labels["followup-for"]} {iPDetail?.patient?.name}</Text>
                                : null}

                            {/* Reason for editing */}
                            {/* {routeParam.followUPId
                                ? <InputValidation
                                    uniqueKey={formKeys.reason_for_editing}
                                    validationObj={formValidationObj}
                                    value={formValues[formKeys.reason_for_editing]}
                                    placeHolder={labels["reason-for-editing"]}
                                    onChangeText={(text) => {
                                        removeErrorTextForInputThatUserIsTyping(formKeys.reason_for_editing);
                                        handleInputChange(formKeys.reason_for_editing, text)
                                    }}
                                    style={styles.InputValidationView}
                                    inputStyle={styles.inputStyle}
                                />
                                : null} */}

                            {/* Title */}
                            <InputValidation
                                uniqueKey={formKeys.title}
                                validationObj={formValidationObj}
                                value={formValues[formKeys.title]}
                                placeHolder={labels["title"]}
                                onChangeText={(text) => {
                                    removeErrorTextForInputThatUserIsTyping(formKeys.title);
                                    handleInputChange(formKeys.title, text)
                                }}
                                style={styles.InputValidationView}
                                inputStyle={styles.inputStyle}
                            />

                            {/*implementation */}
                            <InputValidation
                                uniqueKey={formKeys?.implementation}
                                validationObj={formValidationObj}
                                editable={false}
                                value={iPDetail?.title ?? ""}
                                iconRight="chevron-down"
                                iconColor={Colors.primary}
                                placeHolder={labels["implementations"]}
                                onPressIcon={(text) => {
                                    handleInputChange(formKeys.implementation, text)
                                    removeErrorTextForInputThatUserIsTyping(formKeys?.implementation)
                                    setActionSheetDecide(formKeys.implementation);
                                    actionSheetRef.current?.setModalVisible();

                                }}


                                style={styles.InputValidationView}
                                inputStyle={styles.inputStyle}
                            />

                            {/*
                            <InputValidation
                                // uniqueKey={empFormKeys.branch}
                                // validationObj={validationObj}
                                optional={true}
                                value={formValues[formKeys.implementation]}
                                placeHolder={labels["implementations"]}
                                iconRight="chevron-down"
                                iconColor={Colors.primary}
                                editable={false}
                                onPressIcon={() => {
                                    setActionSheetDecide(formKeys.implementation);
                                    actionSheetRef.current?.setModalVisible()
                                }}
                                style={styles.InputValidationView}
                                inputStyle={styles.inputStyle}
                            />*/}

                            {/* Description */}
                            <InputValidation
                                multiline={true}
                                uniqueKey={formKeys.description}
                                validationObj={formValidationObj}
                                value={formValues[formKeys.description]}
                                dropDownListData={descrptionSuggestion}
                                placeHolder={labels["description"]}
                                onChangeText={(text) => {
                                    filterSuggestion(text, (filteredData) => { setDescrptionSuggestion(filteredData) })
                                    removeErrorTextForInputThatUserIsTyping(formKeys.description)
                                    handleInputChange(formKeys.description, text)
                                }}
                                onPressDropDownListitem={(choosenSuggestion) => {
                                    handleInputChange(formKeys.description, choosenSuggestion)
                                    setDescrptionSuggestion([])
                                }}
                                style={styles.InputValidationView}
                                inputStyle={{ ...styles.inputStyle, height: 110, textAlignVertical: "top" }}
                            />
                            {/* comment */}
                            <InputValidation
                                multiline={true}
                                // uniqueKey={formKeys.remark}
                                optional={true}
                                // validationObj={formValidationObj}
                                value={formValues[formKeys.remark]}
                                dropDownListData={commentSuggestion}
                                placeHolder={labels["comment"]}
                                onChangeText={(text) => {
                                    filterSuggestion(text, (filteredData) => { setcomment(filteredData) })
                                    removeErrorTextForInputThatUserIsTyping(formKeys.remark)
                                    handleInputChange(formKeys.remark, text)
                                }}
                                onPressDropDownListitem={(choosenSuggestion) => {
                                    handleInputChange(formKeys.remark, choosenSuggestion)
                                    setcomment([])
                                }}
                                style={styles.InputValidationView}
                                inputStyle={{ ...styles.inputStyle, height: 110, textAlignVertical: "top" }}
                            />

                            <FlatList
                                show={false}
                                contentContainerStyle={{}}
                                keyExtractor={(item, index) => '' + index}
                                data={formValues.follow_up_dates}

                                ListFooterComponent={() => {
                                    if (routeParam.followUPId)
                                        return null;
                                    return (
                                        <CustomButton
                                            onPress={() => {
                                                let tempFollowUpDates = [...formValues.follow_up_dates]
                                                tempFollowUpDates.push({
                                                    start_date: "",
                                                    end_date: "",
                                                    start_time: "",
                                                    end_time: "",
                                                })
                                                // handleInputChange(formKeys.follow_up_dates, tempFollowUpDates);
                                                setFormValues({ ...formValues, [formKeys.follow_up_dates]: tempFollowUpDates })
                                            }}
                                            title={labels["add-more-follow-up-dates"]}
                                            style={{ marginTop: Constants.formFieldTopMargin, }}
                                        />
                                    )
                                }}
                                renderItem={({ item, index }) => {
                                    return (
                                        <>
                                            {index != 0
                                                ? <View style={{ borderWidth: 0.5, width: '100%', borderColor: Colors.gray, marginTop: Constants.formFieldTopMargin, }} />
                                                : null}
                                            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 10 }}>
                                                <Text style={{ fontSize: getProportionalFontSize(14), fontFamily: Assets.fonts.bold, color: Colors.primary, }}>
                                                    {`${labels["followup-date-time"]} (${index + 1})`}
                                                </Text>
                                                {index != 0
                                                    ? <Icon name='delete' color={Colors.red} size={25} onPress={() => {
                                                        let tempFollowUpDates = [...formValues.follow_up_dates]
                                                        tempFollowUpDates.splice(index, 1)
                                                        //  handleInputChange(formKeys.follow_up_dates, tempFollowUpDates);
                                                        setFormValues({ ...formValues, [formKeys.follow_up_dates]: tempFollowUpDates })
                                                    }}
                                                    /> : null}
                                            </View>

                                            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                                                {/* Start date */}
                                                <InputValidation
                                                    iconRight="calendar"
                                                    // uniqueKey={formKeys.start_date}
                                                    // validationObj={formValidationObj}
                                                    value={item.start_date ? formatDate(item.start_date) : ""}
                                                    placeHolder={labels["start-date"]}
                                                    onPressIcon={() => {
                                                        setMode(Constants.DatePickerModes.date_mode)
                                                        setDatePickerKey(formKeys.follow_up_dates)
                                                        setFollowUpDateIndexNKey({
                                                            index: index,
                                                            key: "start_date"
                                                        })
                                                        setOpenDatePicker(true)
                                                        // removeErrorTextForInputThatUserIsTyping(formKeys.start_date)
                                                    }}
                                                    style={{ ...styles.InputValidationView, width: "48%" }}
                                                    inputStyle={{ ...styles.inputStyle, }}
                                                    editable={false}
                                                />

                                                {/* end date */}
                                                <InputValidation
                                                    iconRight="calendar"
                                                    optional={true}
                                                    // uniqueKey={formKeys.end_date}
                                                    // validationObj={formValidationObj}
                                                    value={item.end_date ? formatDate(item.end_date) : ""}
                                                    placeHolder={labels["end-date"]}
                                                    onPressIcon={() => {
                                                        setMode(Constants.DatePickerModes.date_mode)
                                                        setDatePickerKey(formKeys.follow_up_dates)
                                                        setFollowUpDateIndexNKey({
                                                            index: index,
                                                            key: "end_date"
                                                        })
                                                        setOpenDatePicker(true)
                                                        // removeErrorTextForInputThatUserIsTyping(formKeys.end_date)
                                                    }}
                                                    style={{ ...styles.InputValidationView, width: "48%" }}
                                                    inputStyle={{ ...styles.inputStyle, }}
                                                    editable={false}
                                                />
                                            </View>

                                            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>

                                                {/* Start time */}
                                                <InputValidation
                                                    iconRight="time"
                                                    // uniqueKey={formKeys.start_time}
                                                    // validationObj={formValidationObj}
                                                    value={item.start_time ? formatTime(item.start_time) : ""}
                                                    placeHolder={labels["start-time"]}
                                                    onPressIcon={() => {
                                                        setMode(Constants.DatePickerModes.time_mode)
                                                        setDatePickerKey(formKeys.follow_up_dates)
                                                        setFollowUpDateIndexNKey({
                                                            index: index,
                                                            key: "start_time"
                                                        })
                                                        setOpenDatePicker(true)
                                                        // removeErrorTextForInputThatUserIsTyping(formKeys.start_time)
                                                    }}
                                                    style={{ ...styles.InputValidationView, width: "48%" }}
                                                    inputStyle={{ ...styles.inputStyle }}
                                                    editable={false}
                                                />


                                                {/* end time */}
                                                <InputValidation
                                                    iconRight="time"
                                                    optional={true}
                                                    // uniqueKey={formKeys.end_time}
                                                    // validationObj={formValidationObj}
                                                    value={item.end_time ? formatTime(item.end_time) : ""}
                                                    placeHolder={labels["end-time"]}
                                                    onPressIcon={() => {
                                                        setMode(Constants.DatePickerModes.time_mode)
                                                        setDatePickerKey(formKeys.follow_up_dates)
                                                        setFollowUpDateIndexNKey({
                                                            index: index,
                                                            key: "end_time"
                                                        })
                                                        setOpenDatePicker(true)
                                                        //removeErrorTextForInputThatUserIsTyping(formKeys.end_time)
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
                                uniqueKey={formKeys.follow_up_dates}
                                validationObj={formValidationObj}
                            />



                            {/* repeat */}
                            {/* <View style={styles.checkBoxView}>
                                <BouncyCheckbox
                                    size={20}
                                    fillColor={Colors.primary}
                                    unfillColor={Colors.white}
                                    iconStyle={{ borderColor: Colors.primary }}
                                    isChecked={formValues.repeat}
                                    onPress={(value) => {
                                        // handleInputChange(formKeys.repeat, value,);
                                        setFormValues({
                                            ...formValues, [formKeys.repeat]: value, [formKeys.repetition_type]: repetitionTypeData[0], [formKeys.week_days]: [...week_days_data],
                                            // [formKeys.repetition_time]: '',
                                            [formKeys.day_in_month]: {}, [formKeys.every]: 1
                                        })
                                        setDaysInMonthAS({ ...daysInMonthAS, selectedData: [] })
                                        setRepetitionTypeAS(getActionSheetAPIDetail({ ...repetitionTypeAS, selectedData: [repetitionTypeData[0]] }))

                                    }}
                                />
                                <Text style={styles.saveAsTemplate}>{labels.repeat}</Text>
                            </View> */}


                            {formValues.repeat
                                ?
                                <>
                                    <View style={{ ...styles.checkBoxView, justifyContent: "space-between", marginTop: 0 }}>
                                        {/* every */}
                                        <InputValidation
                                            uniqueKey={formKeys.every}
                                            validationObj={formValidationObj}
                                            value={'' + formValues[formKeys.every]}
                                            keyboardType={'number-pad'}
                                            placeHolder={labels["every"]}
                                            onChangeText={(text) => {
                                                removeErrorTextForInputThatUserIsTyping(formKeys.every);
                                                if (text == '')
                                                    handleInputChange(formKeys.every, text);
                                                else {
                                                    let tempTextToNumber = Number(text);
                                                    if (isNaN(tempTextToNumber)) {
                                                        return;
                                                    }
                                                    handleInputChange(formKeys.every, tempTextToNumber);
                                                }
                                            }}
                                            style={{ ...styles.InputValidationView, width: "48%" }}
                                            inputStyle={styles.inputStyle}
                                        />

                                        {/* Repetition type */}
                                        <InputValidation
                                            iconRight="chevron-down"
                                            uniqueKey={formKeys.repetition_type}
                                            validationObj={formValidationObj}
                                            value={formValues[formKeys.repetition_type].name ? '' + formValues[formKeys.repetition_type].name : ""}
                                            placeHolder={labels["repetition-type"]}
                                            onPressIcon={() => {
                                                removeErrorTextForInputThatUserIsTyping(formKeys.repetition_type)
                                                setActionSheetDecide(formKeys.repetition_type);
                                                actionSheetRef.current?.setModalVisible()
                                            }}
                                            style={{ ...styles.InputValidationView, width: "48%" }}
                                            inputStyle={{ ...styles.inputStyle }}
                                            editable={false}
                                        />
                                    </View>


                                    {
                                        formValues[formKeys.repetition_type].api_value == "week"
                                            ?
                                            <>
                                                <FlatList
                                                    show={false}
                                                    contentContainerStyle={{ marginTop: Constants.formFieldTopMargin }}
                                                    keyExtractor={(item, index) => item.number}
                                                    horizontal
                                                    data={formValues.week_days}
                                                    renderItem={({ item, index }) => {
                                                        return (
                                                            <TouchableOpacity
                                                                onPress={() => {
                                                                    let temp_week_days = [...formValues.week_days]
                                                                    temp_week_days.map((obj) => {
                                                                        if (item.number == obj.number)
                                                                            obj.selected = !obj.selected
                                                                    })
                                                                    handleInputChange(formKeys.week_days, [...temp_week_days])
                                                                    removeErrorTextForInputThatUserIsTyping(formKeys.week_days)
                                                                }}
                                                                style={{ ...styles.weekCircleView, backgroundColor: item.selected ? Colors.primary : Colors.white }} >
                                                                <Text style={{ ...styles.weekText, color: !item.selected ? Colors.primary : Colors.white }}>{item.name}</Text>
                                                            </TouchableOpacity>
                                                        )
                                                    }}
                                                />
                                                <ErrorComp
                                                    uniqueKey={formKeys.week_days}
                                                    validationObj={formValidationObj}
                                                />
                                            </>
                                            : formValues[formKeys.repetition_type].api_value == "month"
                                                ?
                                                < InputValidation
                                                    iconRight="chevron-down"
                                                    uniqueKey={formKeys.day_in_month}
                                                    validationObj={formValidationObj}
                                                    value={formValues[formKeys.day_in_month].name ? '' + formValues[formKeys.day_in_month].name : ""}
                                                    placeHolder={labels["day"]}
                                                    onPressIcon={() => {
                                                        removeErrorTextForInputThatUserIsTyping(formKeys.day_in_month)
                                                        setActionSheetDecide(formKeys.day_in_month);
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
                                        iconRight="clock"
                                        uniqueKey={formKeys.repetition_time}
                                        validationObj={formValidationObj}
                                        value={formValues[formKeys.repetition_time] ? formatTime(formValues[formKeys.repetition_time]) : ""}
                                        placeHolder={labels.repetition_time}
                                        onPressIcon={() => {
                                            setMode(Constants.DatePickerModes.time_mode)
                                            setDatePickerKey(formKeys.repetition_time)
                                            setOpenDatePicker(true)
                                            removeErrorTextForInputThatUserIsTyping(formKeys.repetition_time)
                                        }}
                                        style={styles.InputValidationView}
                                        inputStyle={{ ...styles.inputStyle }}
                                        editable={false}
                                    /> */}
                                </> : null}

                            {/* remark */}
                            {/* <InputValidation
                                multiline={true}
                                optional={true}
                                // uniqueKey={formKeys.remark}
                                // validationObj={formValidationObj}
                                value={formValues[formKeys.remark]}
                                placeHolder={labels["comment"]}
                                onChangeText={(text) => {
                                    handleInputChange(formKeys.remark, text)
                                }}
                                style={styles.InputValidationView}
                                inputStyle={{ ...styles.inputStyle, height: 110, textAlignVertical: "top" }}
                            /> */}

                            {/* internal comment */}
                            {/*<InputValidation
                                multiline={true}
                                optional={true}
                                // uniqueKey={formKeys.remark}
                                // validationObj={formValidationObj}
                                value={formValues[formKeys.internal_comment]}
                                placeHolder={labels.internal_comment}
                                onChangeText={(text) => {
                                    handleInputChange(formKeys.internal_comment, text)
                                }}
                                style={styles.InputValidationView}
                                inputStyle={{ ...styles.inputStyle, height: 110, textAlignVertical: "top" }}
                            />*/}

                            {/* external comment */}
                            {/* <InputValidation
                                multiline={true}
                                optional={true}
                                // uniqueKey={formKeys.remark}
                                // validationObj={formValidationObj}
                                value={formValues[formKeys.external_comment]}
                                placeHolder={labels.external_comment}
                                onChangeText={(text) => {
                                    handleInputChange(formKeys.external_comment, text)
                                }}
                                style={styles.InputValidationView}
                                inputStyle={{ ...styles.inputStyle, height: 110, textAlignVertical: "top" }}
                            />*/}

                            <UploadedFileViewer
                                isLoading={uploadingFile}
                                // data={patientFormValues.documents}
                                data={formValues.documents}
                                setNewData={(newArr) => {
                                    handleInputChange(newArr, formValues[formKeys.documents])
                                }}
                            />
                            {/* UPLOAD */}
                            <TouchableOpacity
                                onPress={() => {
                                    setActionSheetDecide(formValues[formKeys.attachment])
                                    actionSheetRef?.current?.setModalVisible();
                                }}
                                style={{
                                    ...styles.nextButton, marginVertical: 0, marginTop: 30, minHeight: 35,
                                    backgroundColor: Colors.white, flexDirection: "row", alignItems: "center", borderWidth: 1.5, borderColor: Colors.primary, borderRadius: 10
                                }}>
                                {uploadingFile
                                    ? <ProgressLoader onActivityIndicator={true} onActivityIndicatorSize='small' onActivityIndicatorColor={Colors.primary} />
                                    : <View style={{ flexDirection: "row", alignItems: "center" }}>
                                        <Icon name="upload-file" color={Colors.primary} size={30} />
                                        <Text style={{ ...styles.normalText, color: Colors.primary, marginStart: 5 }}>{labels["upload"]}</Text>
                                    </View>}
                            </TouchableOpacity>

                            {/* save button */}
                            <CustomButton
                                style={{
                                    ...styles.nextButton,
                                    backgroundColor: isValid ? Colors.primary : Colors.lightPrimary
                                }}
                                isLoading={uploadingFile}
                                onPress={(e) => {
                                    Keyboard.dismiss()
                                    if (validation()) {
                                        // console.log('Validation true')
                                        // setViewDecider(2)
                                        // console.log('output data save', saveFollowUp)
                                        saveFollowUp(true, [])
                                        // let badWordString = getBadWordString();
                                        // if (badWordString) {
                                        //     Alert.showBasicDoubleAlertForBoth(badWordString,
                                        //         () => { saveFollowUp(true, []) },
                                        //         null, messages.message_bad_word_alert)
                                        // }
                                        // else {

                                        //     saveFollowUp(true, [])
                                        // }

                                    }
                                    else {
                                        Alert.showAlert(Constants.warning, messages.message_fill_all_required_fields)
                                        // console.log('Validation false')

                                    }
                                }} title={labels["save"]} />


                            <DatePicker
                                modal
                                mode={mode}
                                open={openDatePicker}
                                minimumDate={
                                    mode == Constants.DatePickerModes.date_mode
                                        ? (formValues?.follow_up_dates?.[followUpDateIndexNKey?.index]?.start_date ? formValues?.follow_up_dates?.[followUpDateIndexNKey?.index]?.start_date : new Date())
                                        : (formValues?.follow_up_dates?.[followUpDateIndexNKey?.index]?.start_time ? formValues?.follow_up_dates?.[followUpDateIndexNKey?.index]?.start_time : null)
                                }
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
                        </>
                        : viewDecider == 2
                            ?
                            <>
                                <FormSubHeader
                                    leftIconName={"chevron-back-circle-outline"}
                                    onPressLeftIcon={() => { setViewDecider(1) }}
                                    title={labels["questions"]}
                                    rightIconName={''}
                                    onPressRightIcon={() => { }}
                                />

                                <FlatList
                                    scrollEnabled={false}
                                    ListEmptyComponent={<EmptyDataContainer />}
                                    contentContainerStyle={{}}
                                    // keyExtractor={(item, index) => item.group_name}
                                    keyExtractor={(item, index) => '' + index}
                                    data={questions}
                                    renderItem={({ item, index }) => {
                                        let outerIndex = index;
                                        return (
                                            <View style={{ marginTop: index == 0 ? Constants.formFieldTopMargin : 25 }}>
                                                <View style={{ flexDirection: "row", alignItems: "center", width: "100%", justifyContent: "space-between" }}>
                                                    <Text style={{ ...styles.welcomeText, width: "90%", fontFamily: Assets.fonts.bold }}>{item.group_name}</Text>
                                                    <Icon name='add-circle-outline' color={Colors.primary} size={28} onPress={() => {
                                                        setQuestionGroupIndex(outerIndex)
                                                        setIsModalVisible(true)
                                                    }}
                                                    />
                                                </View>
                                                <FlatList
                                                    scrollEnabled={false}
                                                    ListEmptyComponent={<EmptyDataContainer />}
                                                    contentContainerStyle={{}}
                                                    keyExtractor={(item, index) => '' + index}
                                                    // keyExtractor={(item, index) => '' + item.group_name}
                                                    data={item.questions}
                                                    // ListFooterComponent={() => { return renderFooter(outerIndex) }}
                                                    renderItem={({ item, index }) => {
                                                        let tempItem = { ...item };
                                                        return (
                                                            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 5 }}>
                                                                <Text style={{ width: "90%", fontFamily: Assets.fonts.boldItalic, fontSize: getProportionalFontSize(13) }}>{item.question}</Text>
                                                                <Checkbox
                                                                    color={Colors.primary}
                                                                    status={item.is_visible ? 'checked' : 'unchecked'}
                                                                    onPress={() => {
                                                                        let tempQuestions = [...questions]
                                                                        tempItem['is_visible'] = tempItem['is_visible'] == 1 ? 0 : 1
                                                                        tempQuestions[outerIndex]['questions'][index] = { ...tempItem }
                                                                        setQuestions([...tempQuestions])
                                                                    }}
                                                                />
                                                            </View>
                                                        )
                                                    }}
                                                />
                                            </View>
                                        )
                                    }}
                                />

                                <View style={{ ...styles.checkBoxView, justifyContent: "space-between" }}>
                                    {/* back button */}
                                    <CustomButton
                                        style={{
                                            ...styles.nextButton, width: "48%",
                                            backgroundColor: isValid ? Colors.primary : Colors.lightPrimary
                                        }}
                                        onPress={() => {
                                            setViewDecider(1)
                                            // if (validation()) {
                                            //     //loginAPI();
                                            //     console.log('Validation true')
                                            //     setViewDecider(2)
                                            // }
                                            // else {
                                            //     console.log('Validation false')
                                            // }
                                        }} title={labels["back"]} />

                                    {/* next button */}
                                    <CustomButton
                                        style={{
                                            ...styles.nextButton, width: "48%",
                                            backgroundColor: isValid ? Colors.primary : Colors.lightPrimary
                                        }}
                                        onPress={() => {
                                            setViewDecider(3)
                                            // if (validation()) {
                                            //     //loginAPI();
                                            //     console.log('Validation true')
                                            //     setViewDecider(2)
                                            // }
                                            // else {
                                            //     console.log('Validation false')
                                            // }
                                        }} title={labels["Next"]} />
                                </View>

                            </>
                            : viewDecider == 3
                                ? <PersonFormComp
                                    onPressBack={() => {
                                        setViewDecider(2)
                                    }}
                                    onPressSave={(ignorePersons, personsList) => {
                                        handleInputChange(formKeys.personList, personsList ?? [])
                                        saveFollowUp(ignorePersons, personsList ?? [])
                                    }}
                                    personList={formValues[formKeys.personList]}
                                />
                                : null}

                    <ActionSheet ref={actionSheetRef}>
                        {
                            actionSheetDecide == formValues[formKeys.attachment]
                                ? <ImagePickerActionSheetComp
                                    chooseMultiple={true}
                                    giveChoice={true}
                                    closeSheet={closeActionSheet}
                                    responseHandler={(res) => {
                                        imageOrDocumentResponseHandler(res)
                                    }}
                                />
                                : <ActionSheetComp
                                    title={labels[actionSheetDecide]}
                                    closeActionSheet={closeActionSheet}
                                    keyToShowData={actionSheetDecide == formKeys?.implementation ? "title" : "name"}
                                    keyToCompareData="id"
                                    multiSelect={isMultiSelect()}
                                    APIDetails={getAPIDetails()}
                                    changeAPIDetails={(payload) => { changeAPIDetails(payload) }}
                                    onPressItem={(item) => { onPressItem(item) }}
                                />
                        }

                    </ActionSheet>
                </View>
            </KeyboardAwareScrollView>
        </BaseContainer >
    )
}

export default IPFollowUpScreen

const styles = StyleSheet.create({
    InputValidationView: {
        backgroundColor: Colors.transparent,
        //borderColor: 'red',
        marginTop: Constants.formFieldTopMargin,
        //borderRadius: 10,
        //color: 'red'
    },
    headingText: {
        fontSize: getProportionalFontSize(17),
        color: Colors.primary,
        fontFamily: Assets.fonts.bold,
        marginTop: 25
    },
    inputStyle: {
        fontSize: getProportionalFontSize(15),
        borderColor: Colors.borderColor,
        backgroundColor: Colors.white
    },
    mainView: {
        flex: 1,
        paddingHorizontal: Constants.globalPaddingHorizontal,
        paddingBottom: 30
    },
    nextButton: {
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: 40,
        borderRadius: 10,
        paddingHorizontal: 16,
        backgroundColor: Colors.primary,
        marginVertical: 16
    },
    checkBoxView: { flexDirection: 'row', alignItems: 'center', marginTop: 30 },
    saveAsTemplate: { fontSize: getProportionalFontSize(13), fontFamily: Assets.fonts.regular },
    weekCircleView: { justifyContent: "center", alignItems: "center", backgroundColor: Colors.primary, borderRadius: 15, height: 40, width: 40, marginStart: 5, borderWidth: 1, borderColor: Colors.primary },
    weekText: {
        fontFamily: Assets.fonts.bold,
        // color: Colors.white,
        // fontSize: getProportionalFontSize(15)
    },
    welcomeText: {
        fontSize: getProportionalFontSize(15),
        color: Colors.primary,
        fontFamily: Assets.fonts.semiBold
    },
    loadMoreButton: { marginTop: Constants.formFieldTopMargin, width: "40%", alignSelf: "center", backgroundColor: Colors.primary, },
    innerView: { width: '100%', minHeight: 300, backgroundColor: Colors.backgroundColor, paddingVertical: 15, paddingHorizontal: 16, borderRadius: 20 },

})
