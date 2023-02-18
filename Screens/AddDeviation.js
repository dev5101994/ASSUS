import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, SafeAreaView, Image, TouchableOpacity, ScrollView, Linking, Keyboard } from 'react-native';
import Colors from '../Constants/Colors';
import Assets from '../Assets/Assets'
import { getProportionalFontSize, checkEmailFormat, formatDateWithTime, formatDate, formatTime, getActionSheetAPIDetail, reverseFormatDate, formatDateForAPI, jsCoreDateCreator, formatTimeForAPI } from '../Services/CommonMethods';
import InputValidation from '../Components/InputValidation';
import BouncyCheckbox from "react-native-bouncy-checkbox";
import { CommonActions } from '@react-navigation/native';
import APIService from '../Services/APIService'
import Constants from '../Constants/Constants'
import ProgressLoader from '../Components/ProgressLoader'
import { useSelector, useDispatch } from 'react-redux'
import { UserLoginAction } from '../Redux/Actions/UserLoginAction'
import AsyncStorageService from '../Services/AsyncStorageService';
import { ActivityIndicator, TextInput } from 'react-native-paper';
import BaseContainer from '../Components/BaseContainer'
import CustomButton from '../Components/CustomButton'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import DatePicker from 'react-native-date-picker';
import Alert from '../Components/Alert';
import FormSubHeader from '../Components/FormSubHeader';
import Icon from 'react-native-vector-icons/Ionicons';
import ActionSheet from 'react-native-actions-sheet';
import ActionSheetComp from '../Components/ActionSheetComp';
import Can from '../can/Can';
import MSDataViewer from '../Components/MSDataViewer';
import { Labels } from '../Redux/ActionTypes';
import CommonAPIFunctions from '../Services/CommonAPIFunctions';

const branch_and_patient = "branch_and_patient";
const category_and_subCategory = "category_and_subCategory";
const deviation_details = "deviation_details";
const investigation = "investigation";

const AddDeviation = (props) => {

    // console.log("(props?.route?.params?.itemId)", props?.route?.params?.itemId)

    // REDUX hooks
    const dispatch = useDispatch();
    const isInternetActive = useSelector(state => state.IsInternetActive);
    const UserLogin = useSelector(state => state.User.UserLogin);
    const labels = useSelector(state => state.Labels);
    const messages = useSelector(state => state.Labels);
    const permissions = UserLogin?.permissions ?? {}



    const severity_data = [
        { "id": "1", "name": labels["1"] },
        { "id": "2", "name": labels["2"] },
        { "id": "3", "name": labels["3"] },
        { "id": "4", "name": labels["4"] },
        { "id": "5", "name": labels["5"] },
    ];
    const further_investigation_data = [
        { "id": "1", "name": labels.i_want_to_report_a_value_damage, value: labels.i_want_to_report_a_value_damage },
        { "id": "2", "name": labels.jag_vill_rapportera_en_virdiskada, value: labels.jag_vill_rapportera_en_virdiskada_value },
    ]

    // Immutable Variables
    const formFieldsKeys = {
        reason_for_editing: "reason_for_editing",
        "patient": "patient",
        "category": "category",
        "subcategory": "subcategory",
        "branch": "branch",
        "date_time": "date_time",
        "time": "time",
        "description": "description",
        "immediate_action": "immediate_action",
        "probable_cause_of_the_incident": "probable_cause_of_the_incident",
        "suggestion_to_prevent_event_again": "suggestion_to_prevent_event_again",
        "related_factor": "related_factor",
        "critical_range": "critical_range",
        "follow_up": "follow_up",
        "further_investigation": "further_investigation",
        "copy_sent_to": "copy_sent_to",
        "is_secret": "is_secret",
        "is_signed": "is_signed",
        "is_completed": "is_completed",
        "severity": "severity",
    }

    const initialValidationObjForBranchAndPatient = {
        [formFieldsKeys.reason_for_editing]: {
            invalid: false,
            title: labels?.reason_for_editing_required ?? ""
        },
        // [formFieldsKeys.branch]: {
        //     invalid: false,
        //     title: labels?.branch_required ?? ""
        // },
        [formFieldsKeys.patient]: {
            invalid: false,
            title: labels?.patient_required ?? "patient required"
        },
        [formFieldsKeys.date_time]: {
            invalid: false,
            title: labels?.required_field ?? ""
        },
        [formFieldsKeys.time]: {
            invalid: false,
            title: labels?.required_field ?? ""
        },
        [formFieldsKeys.category]: {
            invalid: false,
            title: labels?.category_required ?? ""
        },
        [formFieldsKeys.subcategory]: {
            invalid: false,
            title: labels?.subcategory_required ?? ""
        },
    }
    const initialValidationObjForCategoryAndSubCategory = {

    }
    const initialValidationObjForDeviationDetails = {
        [formFieldsKeys.description]: {
            invalid: false,
            title: labels?.description_required ?? ""
        },
        [formFieldsKeys.immediate_action]: {
            invalid: false,
            title: labels?.immediate_action_required ?? ""
        },
        [formFieldsKeys.severity]: {
            invalid: false,
            title: labels?.action_required ?? ""
        },
    }
    const initialValidationObjForInvestigation = {

    }

    const initialFormFields = {
        reason_for_editing: "",
        "patient": {},
        "category": {},
        "subcategory": {},
        "branch": {},
        "date_time": "",
        "time": "",
        "description": "",
        "immediate_action": "",
        "probable_cause_of_the_incident": "",
        "suggestion_to_prevent_event_again": "",
        "related_factor": "",
        "critical_range": "",
        "follow_up": "",
        "further_investigation": [],
        "copy_sent_to": [],
        "is_secret": false,
        "is_signed": false,
        "is_completed": false,
        "severity": "",

    }
    // Hooks
    const actionSheetRef = React.useRef();
    // useState hooks
    const [active_loader, set_active_loader] = React.useState(true);
    const [deviationId, setDeviationId] = React.useState();
    const [isItemFound, setIsItemFound] = React.useState(false);
    const [isEditable, setIsEditable] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(true);
    const [formFields, setFormFields] = React.useState({ ...initialFormFields });
    // console.log("formFields---------", formFields)
    const [validationObjForBranchAndPatient, setValidationObjForBranchAndPatient] = React.useState({ ...initialValidationObjForBranchAndPatient });
    const [validationObjForCategoryAndSubCategory, setValidationObjForCategoryAndSubCategory] = React.useState({ ...initialValidationObjForCategoryAndSubCategory });
    const [validationObjForDeviationDetails, setValidationObjForDeviationDetails] = React.useState({ ...initialValidationObjForDeviationDetails });
    const [validationObjForInvestigation, setValidationObjForInvestigation] = React.useState({ ...initialValidationObjForInvestigation });
    const [viewDecider, setViewDecider] = React.useState(1)
    const [openDatePicker, setOpenDatePicker] = React.useState(false);
    const [mode, setMode] = React.useState('');
    const [datePickerKey, setDatePickerKey] = React.useState(null);
    const [actionSheetDecide, setActionSheetDecide] = useState('');
    const [branchAS, setBranchAS] = useState(getActionSheetAPIDetail({
        url: Constants.apiEndPoints.userList, debugMsg: 'branchList', token: UserLogin.access_token, selectedData: [], params: { user_type_id: '11' },
    }));
    const [categoryAS, setCategoryAS] = React.useState(getActionSheetAPIDetail({
        url: Constants.apiEndPoints.categoryParentList, debugMsg: "categoryAS", token: UserLogin.access_token,
        selectedData: [], params: { category_type_id: '4' }
    }));
    const [subCategoryAS, setSubCategoryAS] = React.useState(getActionSheetAPIDetail({}));

    const [patientListAS, setPatientListAS] = React.useState(getActionSheetAPIDetail({
        url: Constants.apiEndPoints.userList, params: { user_type_id: '6' }, debugMsg: "patientListAS", token: UserLogin.access_token,
        selectedData: [],
    }));
    const [severitytAS, setSeveritytAS] = React.useState(getActionSheetAPIDetail({
        url: '', debugMsg: "", token: '', data: severity_data,
        selectedData: [],
    }));
    const [furtherInvestigationAS, setFurtherInvestigationAS] = React.useState(getActionSheetAPIDetail({
        url: '', debugMsg: "", token: '', data: further_investigation_data,
        selectedData: [],
    }));


    // BadWords & Suggetion

    const [suggestion, setSuggestion] = React.useState([]);
    const [badWords, setBadWords] = React.useState([]);
    const [descrptionSuggestion, setDescrptionSuggestion] = React.useState([]);
    const [immediate_action, setImmediate_action] = React.useState([]);
    const [probable_cause_of_the_incident, setProbable_cause_of_the_incident] = React.useState([]);
    const [suggestion_to_prevent_event_again, setSuggestion_to_prevent_event_again] = React.useState([]);
    // follow_up
    const [follow_up, setFollow_up] = React.useState([]);

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

            if (formFields?.description?.toLowerCase()?.includes(currBadWord)
                || formFields?.immediate_action?.toLowerCase()?.includes(currBadWord)
                || formFields?.probable_cause_of_the_incident?.toLowerCase()?.includes(currBadWord)
                || formFields?.suggestion_to_prevent_event_again?.toLowerCase()?.includes(currBadWord)
                || formFields?.follow_up?.toLowerCase()?.includes(currBadWord)

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


    React.useEffect(() => {
        setIsLoading(true)
        if (props?.route?.params?.itemId) {
            // console.log('item Id FOund')
            // setIsItemFound(true)
            setDeviationId(props?.route?.params?.itemId)
            deviationDetails(props?.route?.params?.itemId)

        } else {
            setIsLoading(false);
            // setIsEditable(true);
        }
    }, [])
    React.useEffect(() => {
        const unsubscribe = props.navigation.addListener('focus', () => {
            // console.log('Focus___________________________________________')
            // console.log("patientID ---", props.route.params)
            getPatientDetail()

        });
        return unsubscribe;
    }, [props?.route?.params]);

    const getPatientDetail = async () => {
        if (!props?.route?.params?.patientID) {
            return;
        }
        setIsLoading(true);
        let url = Constants.apiEndPoints.userView + "/" + props?.route?.params?.patientID;
        let response = await APIService.getData(url, UserLogin.access_token, null, "getPatientDetailAPI");
        // console.log("patient response---------", JSON.stringify(response.data.payload))
        if (!response.errorMsg) {
            setFormFields({ ...formFields, [formFields.patient]: response.data.payload });
            // setPatientListAS({ ...patientListAS, selectedData: [response.data.payload] })
            setIsLoading(false);
        }
        else {
            setIsLoading(false);
            Alert.showAlert(Constants.danger, response.errorMsg);
        }
    }
    // Helper Methods
    const removeErrorTextForInputThatUserIsTyping = (uniqueKey, form) => {
        if (form = branch_and_patient) {
            let tempValidationObj = { ...validationObjForBranchAndPatient }
            tempValidationObj[uniqueKey] = initialValidationObjForBranchAndPatient[uniqueKey];
            setValidationObjForBranchAndPatient(tempValidationObj);
        }
        if (form = category_and_subCategory) {
            let tempValidationObj = { ...validationObjForCategoryAndSubCategory }
            tempValidationObj[uniqueKey] = initialValidationObjForCategoryAndSubCategory[uniqueKey];
            setValidationObjForCategoryAndSubCategory(tempValidationObj);
        }
        if (form = deviation_details) {
            let tempValidationObj = { ...validationObjForDeviationDetails }
            tempValidationObj[uniqueKey] = initialValidationObjForDeviationDetails[uniqueKey];
            setValidationObjForDeviationDetails(tempValidationObj);
        }
        if (form = investigation) {
            let tempValidationObj = { ...validationObjForInvestigation }
            tempValidationObj[uniqueKey] = initialValidationObjForInvestigation[uniqueKey];
            setValidationObjForInvestigation(tempValidationObj);
        }

    }

    const validation = form => {
        // console.log(" ------here we go for vailidation ------")
        if (form == branch_and_patient) {
            let validationObjTemp = { ...initialValidationObjForBranchAndPatient };
            // console.log('validationObjTemp', validationObjTemp);
            let isValid = true;
            for (const [key, value] of Object.entries(validationObjTemp)) {
                // console.log('we r cheking for .........', key, value);

                if (key == formFieldsKeys.reason_for_editing) {
                    if (deviationId && formFields.is_signed == 0) {
                        if (!formFields[key] || formFields[key] == "") {
                            // console.log('1-name', formFields?.[key]);
                            // console.log('1', key);
                            value['invalid'] = true;
                            isValid = false;
                            break;
                        }
                    }
                }

                // if (key == formFieldsKeys.patient) {
                //     if (!formFields[key].name || formFields[key].name == "") {
                //         console.log('1', formFields?.[key]);
                //         console.log('1', key);
                //         value['invalid'] = true;
                //         isValid = false;
                //         break;
                //     }

                // }
                if (key == formFieldsKeys.branch) {
                    if (!formFields.branch?.name || formFields.branch?.name == "") {
                        // console.log('1-name', formFields.branch?.name);
                        // console.log('1', key);
                        value['invalid'] = true;
                        isValid = false;
                        break;
                    }
                }
                if (key == formFieldsKeys.date_time) {
                    if (!formFields.date_time || formFields.date_time == "") {
                        // console.log('1-name', formFields.date_time);
                        // console.log('1', key);
                        value['invalid'] = true;
                        isValid = false;
                        break;
                    }
                }
                if (key == formFieldsKeys.time) {
                    if (!formFields.time || formFields.time == "") {
                        // console.log('1-name', formFields.time);
                        // console.log('1', key);
                        value['invalid'] = true;
                        isValid = false;
                        break;
                    }
                }
                if (key == formFieldsKeys.patient || key == formFieldsKeys.category || key == formFieldsKeys.subcategory) {
                    if (!formFields?.[key]?.name || formFields?.[key]?.name == "") {
                        // console.log('2-name', formFields?.[key]?.name);
                        // console.log('2', key);
                        value['invalid'] = true;
                        isValid = false;
                        break;
                    }
                }
            }
            setValidationObjForBranchAndPatient({ ...validationObjTemp });
            return isValid;
        }
        if (form == category_and_subCategory) {
            let validationObjTemp = { ...initialValidationObjForCategoryAndSubCategory };
            // console.log('validationObjTemp', validationObjTemp);
            let isValid = true;
            for (const [key, value] of Object.entries(validationObjTemp)) {

                if (!formFields?.[key]?.name || formFields?.[key]?.name == "") {
                    // console.log('2-name', formFields?.[key]?.name);
                    // console.log('2', key);
                    value['invalid'] = true;
                    isValid = false;
                    break;
                }
            }
            setValidationObjForCategoryAndSubCategory({ ...validationObjTemp });
            return isValid;
        }
        if (form == deviation_details) {
            let validationObjTemp = { ...initialValidationObjForDeviationDetails };
            // console.log('validationObjTemp', validationObjTemp);
            let isValid = true;
            for (const [key, value] of Object.entries(validationObjTemp)) {
                if (!formFields?.[key] || formFields?.[key] == "") {
                    // console.log('3-name', formFields?.[key]?.name);
                    // console.log('3', key);
                    value['invalid'] = true;
                    isValid = false;
                    break;
                }
                if (key == formFieldsKeys.severity && !formFields?.[key].name) {
                    // console.log('3-name', formFields?.[key]?.name);
                    // console.log('3', key);
                    value['invalid'] = true;
                    isValid = false;
                    break;
                }
            }
            // console.log('validationObjTemp check', validationObjTemp);
            setValidationObjForDeviationDetails({ ...validationObjTemp });
            return isValid;
        }
    }

    const handleInputChange = (key, value) => {
        setFormFields({ ...formFields, [key]: value })
    }
    /**
     * 
     * @param {*} itemId 
     */
    const deviationDetails = async (itemId) => {
        setIsLoading(true);
        // let params = {
        // }
        //console.log("itemId", itemId)
        let url = Constants.apiEndPoints.deviation + "/" + itemId;
        // console.log("url", url);
        let response = await APIService.getData(url, UserLogin.access_token, null, "deviationDetailsAPI");
        if (!response.errorMsg) {

            let criticalRange = {};
            if (response.data.payload.critical_range) {
                severity_data.map((obj) => {
                    if ((obj.name) == response.data.payload.critical_range) {
                        criticalRange = { ...obj }
                    }
                })
            }
            let FurtherInvestigation = [];
            if (response.data.payload.further_investigation) {
                let temp = JSON.parse(response.data.payload.further_investigation)
                // console.log("------temp", temp)
                temp.map((val) => {
                    // console.log("------val", val)
                    further_investigation_data.map((obj) => {
                        // console.log("------obj", obj)
                        if (val == obj.value) {
                            FurtherInvestigation.push(obj)
                            // console.log("------done")
                        }
                    })
                })
            }

            setFormFields({
                reason_for_editing: response?.data?.payload?.reason_for_editing ?? "",
                "patient": response?.data?.payload?.patient ?? {},
                "category": response?.data?.payload?.category ?? {},
                "subcategory": response?.data?.payload?.subcategory ?? {},
                "branch": response?.data?.payload?.branch ?? {},
                "date_time": response?.data?.payload?.date_time ? jsCoreDateCreator(response?.data?.payload?.date_time) : "",
                "time": response?.data?.payload?.date_time ? jsCoreDateCreator(response?.data?.payload?.date_time) : "",
                "description": response?.data?.payload?.description ?? "",
                "immediate_action": response?.data?.payload?.immediate_action ?? "",
                "probable_cause_of_the_incident": response?.data?.payload?.probable_cause_of_the_incident ?? "",
                "suggestion_to_prevent_event_again": response?.data?.payload?.suggestion_to_prevent_event_again ?? "",
                "related_factor": response?.data?.payload?.related_factor ?? "",
                // "critical_range": criticalRange,
                "follow_up": response?.data?.payload?.follow_up ?? "",
                "further_investigation": FurtherInvestigation,
                // "copy_sent_to": [],
                "is_secret": response?.data?.payload?.is_secret == 1 ? true : false,
                "is_signed": response?.data?.payload?.is_signed == 1 ? true : false,
                "is_completed": response?.data?.payload?.is_completed == 1 ? true : false,
                "severity": criticalRange,
            })

            // setPatientTypeAS({
            //     ...patientTypeAS,
            //     selectedData: [response.data.payload.patient_types],
            // });
            setBranchAS({
                ...branchAS,
                selectedData: [response?.data?.payload?.branch],
            });
            setCategoryAS({
                ...categoryAS,
                selectedData: [response?.data?.payload?.category],
            });
            setSubCategoryAS({
                ...subCategoryAS,
                selectedData: [response?.data?.payload?.subcategory],
            });
            setPatientListAS({
                ...patientListAS,
                selectedData: [response?.data?.payload?.patient],
            });
            setSeveritytAS({
                ...severitytAS,
                selectedData: [criticalRange],
            });
            setFurtherInvestigationAS({
                ...furtherInvestigationAS,
                selectedData: FurtherInvestigation,
            });
            setIsLoading(false);
        }
        else {
            setIsLoading(false);
            Alert.showAlert(Constants.danger, response.errorMsg);
        }
    }

    /**
     * 
     * @param {*} id 
     */
    const saveOrEditDeviation = async (id = deviationId) => {
        let copySentTo = [];
        if (formFields.further_investigation.length > 0) {
            formFields.further_investigation.map((obj) => {
                copySentTo.push(obj.value)
            })
        }
        // further_investigation

        // let temp_date_time = formFields.date_time;
        // temp_date_time.setTime(formFields.time.getTime());
        // temp_date_time = formatDateForAPI(temp_date_time);

        let params = {
            "patient_id": formFields?.patient?.id ?? '',
            "category_id": formFields?.category?.id ?? '',
            "subcategory_id": formFields?.subcategory?.id ?? "",
            "branch_id": formFields?.branch?.id ?? '',
            // "date_time": `${reverseFormatDate(formFields.date_time)} ${formatTime(formFields.date_time)}`,
            "date_time": '' + formatDateForAPI(formFields.date_time) + ' ' + formatTime(formFields.time),
            "description": formFields?.description ?? "",
            "immediate_action": formFields?.immediate_action ?? "",
            "probable_cause_of_the_incident": formFields?.probable_cause_of_the_incident ?? '',
            "suggestion_to_prevent_event_again": formFields?.suggestion_to_prevent_event_again ?? '',
            "related_factor": formFields?.related_factor ?? '',
            "critical_range": formFields?.severity?.name ?? '',
            "follow_up": formFields?.follow_up ?? '',
            "further_investigation": copySentTo,
            // "copy_sent_to": ,
            "is_secret": formFields?.is_secret ?? "",
            "is_signed": formFields?.is_signed ?? "",
            "is_completed": formFields?.is_completed ?? "",
            // "reason_for_editing": "Testing reason",
        };
        if (id) {
            params = { ...params, "reason_for_editing": formFields?.reason_for_editing ?? "" }
            // console.log('new..................params=======', params);
        }
        // console.log('params=======', params);
        let url = Constants.apiEndPoints.deviation;
        let msg = messages.message_add_success;
        // return
        setIsLoading(true);
        let response = {};
        if (id) {
            url = url + '/' + id;
            msg = messages.message_update_success;
            response = await APIService.putData(url, params, UserLogin.access_token, null, "editDeviationDetails");
        }
        else
            response = await APIService.postData(url, params, UserLogin.access_token, null, "saveDeviationDetails");

        if (!response.errorMsg) {
            setIsLoading(false);
            // console.log("SUCCESS............");
            Alert.showToast(msg, Constants.success);
            props.navigation.pop()
            // packageDetailsAPI()
        }
        else {
            setIsLoading(false);
            Alert.showAlert(Constants.danger, response.errorMsg);
            // console.log("ERROR............", response);
        }
    }

    const closeActionSheet = () => {
        setActionSheetDecide('');
        actionSheetRef?.current?.setModalVisible();
    };


    const getAPIDetails = () => {
        // console.log("---get api details---")
        switch (actionSheetDecide) {

            case formFieldsKeys.branch: {
                return branchAS;
            }
            case formFieldsKeys.patient: {
                return patientListAS
            }
            case formFieldsKeys.category: {
                return categoryAS;
            }
            case formFieldsKeys.subcategory: {
                return subCategoryAS;
            }
            case formFieldsKeys.severity: {
                return severitytAS;
            }
            case formFieldsKeys.further_investigation: {
                return furtherInvestigationAS;
            }
            default: {
                return null;
            }
        }
    };

    const changeAPIDetails = payload => {
        // console.log("---payload---", payload)
        switch (actionSheetDecide) {
            case formFieldsKeys.branch: {
                setBranchAS(getActionSheetAPIDetail({ ...branchAS, ...payload }));
                break;
            }
            case formFieldsKeys.patient: {
                setPatientListAS(getActionSheetAPIDetail({ ...patientListAS, ...payload }));
                break;
            }

            case formFieldsKeys.category: {
                setCategoryAS(getActionSheetAPIDetail({ ...categoryAS, ...payload }));
                break;
            }
            case formFieldsKeys.subcategory: {
                setSubCategoryAS(getActionSheetAPIDetail({ ...subCategoryAS, ...payload }));
                break;
            }
            case formFieldsKeys.severity: {
                setSeveritytAS(getActionSheetAPIDetail({ ...severitytAS, ...payload }));
                break;
            }
            case formFieldsKeys.further_investigation: {
                setFurtherInvestigationAS(getActionSheetAPIDetail({ ...furtherInvestigationAS, ...payload }));
                break;
            }
            default: {
                break;
            }
        }
    };

    const onPressItem = item => {
        // console.log("---item---", item)
        // console.log("actionSheetDecide```````````````````", actionSheetDecide)
        switch (actionSheetDecide) {
            case formFieldsKeys.branch: {
                handleInputChange(formFieldsKeys.branch, item);
                // removeErrorTextForInputThatUserIsTyping(formFieldsKeys.branch);
                break;
            }
            case formFieldsKeys.patient: {
                handleInputChange(formFieldsKeys.patient, item)
                break;

            }
            case formFieldsKeys.category: {
                setFormFields({ ...formFields, [formFieldsKeys.category]: item, [formFieldsKeys.subcategory]: {} })
                // handleInputChange(formFieldsKeys.category, item);
                // removeErrorTextForInputThatUserIsTyping(formFieldsKeys.category);
                setSubCategoryAS(getActionSheetAPIDetail({
                    url: Constants.apiEndPoints.categoryChildList, params: { parent_id: item?.id }, debugMsg: "sub-category", token: UserLogin.access_token,
                    selectedData: []
                }))
                break;
            }
            case formFieldsKeys.subcategory: {
                // setFormFields({ ...formFields, [formFieldsKeys.subcategory]: item })
                handleInputChange(formFieldsKeys.subcategory, item)
                // removeErrorTextForInputThatUserIsTyping(ipForm, formFieldsKeys.subcategory)
                break;
            }

            case formFieldsKeys.severity: {
                handleInputChange(formFieldsKeys.severity, item)
                // removeErrorTextForInputThatUserIsTyping(ipForm, formFieldsKeys.subcategory)
                break;
            }
            case formFieldsKeys.further_investigation: {
                handleInputChange(formFieldsKeys.further_investigation, item)
                // removeErrorTextForInputThatUserIsTyping(ipForm, formFieldsKeys.subcategory)
                break;
            }
            default: {
                break;
            }
        }
    };

    const printDeviation = async () => {
        let url = Constants.apiEndPoints.printDeviation + "/" + deviationId;
        let response = await APIService.getData(url, UserLogin.access_token, null, "saveDeviationDetails");
        if (!response.errorMsg) {
            setIsLoading(false);
            // console.log("SUCCESS............", response.data.payload);
            Linking.openURL(response.data.payload)
        }
        else {
            setIsLoading(false);
            Alert.showAlert(Constants.danger, response.errorMsg);
            // console.log("ERROR............", response);
        }

    }

    const ShowImage = ({ imgUrl }) => {

        setTimeout(() => {
            set_active_loader(false)
        }, 1000);
        // if (active_loader) {
        //     return (
        //         <View style={{ width: "100%", minHeight: 300, marginTop: 10 }}>
        //             <ActivityIndicator />
        //         </View>
        //     )
        // }

        return (
            <View style={{ width: "100%", minHeight: 300, marginTop: 10, }}>
                <Text style={{ ...styles.title, marginBottom: 10 }} > {Labels?.['ip-related-factors'] ?? "Related Factors"}</Text>
                {
                    active_loader
                        ? <ActivityIndicator size={'large'} />
                        : <View style={{ width: "100%", justifyContent: "center", alignItems: "center" }}>
                            <Image source={{ uri: imgUrl }} style={{ width: 300, height: 300 }} />
                        </View>
                }

            </View>
        )
    }

    // Render view
    if (isLoading)
        return <ProgressLoader />

    return (
        <BaseContainer
            onPressLeftIcon={() => { props.navigation.pop() }}
            leftIcon="arrow-back"
            // leftIconSize={24}
            title={labels["add-deviation"] ?? ""}
        // leftIconColor={Colors.primary}       
        >
            <FormSubHeader
                leftIconName={viewDecider == 1 ? null : 'chevron-back-circle-outline'}
                onPressLeftIcon={
                    viewDecider == 2
                        ? () => {
                            setViewDecider(1);
                        }
                        : viewDecider == 3
                            ? () => {
                                setViewDecider(2);
                            }
                            : viewDecider == 4
                                ? () => {
                                    setViewDecider(3);
                                }
                                : () => { }
                }
                title={
                    viewDecider == 1
                        ? labels["branch-patient"]
                        : viewDecider == 2
                            ? labels["select-category-and-subcategory"]
                            : viewDecider == 3
                                ? labels["deviation-details"]
                                : viewDecider == 4
                                    ? labels["investigation"]
                                    : ''
                }
            />
            <KeyboardAwareScrollView style={{ flex: 1 }} keyboardShouldPersistTaps="handled" >

                <ScrollView style={{ flex: 1 }}>
                    {/* Main View */}
                    <View style={styles.mainView}>


                        {
                            viewDecider == 1
                                ? <View>
                                    {/* reason_for_editing */}
                                    {
                                        deviationId && formFields.is_signed == 0
                                            ? <InputValidation
                                                uniqueKey={formFieldsKeys.reason_for_editing}
                                                validationObj={validationObjForBranchAndPatient}
                                                multiline={true}
                                                value={formFields.reason_for_editing ?? ''}
                                                placeHolder={labels["reason-for-editing"]}
                                                onChangeText={(text) => {
                                                    removeErrorTextForInputThatUserIsTyping(formFieldsKeys.reason_for_editing, branch_and_patient);
                                                    handleInputChange(formFieldsKeys.reason_for_editing, text)
                                                }}
                                                style={styles.InputValidationView}
                                                inputStyle={{ ...styles.inputStyle, ...{ height: 100 } }}
                                            />
                                            : null
                                    }


                                    {/* branch */}
                                    {/* <InputValidation
                                        uniqueKey={formFieldsKeys.branch}
                                        validationObj={validationObjForBranchAndPatient}
                                        // optional={true}
                                        value={formFields.branch?.name ?? ''}
                                        placeHolder={labels["branch"]}
                                        iconRight="chevron-down"
                                        iconColor={Colors.primary}
                                        editable={false}
                                        onPressIcon={() => {
                                            removeErrorTextForInputThatUserIsTyping(formFieldsKeys.branch, branch_and_patient);
                                            setActionSheetDecide(formFieldsKeys.branch);
                                            actionSheetRef.current?.setModalVisible();
                                        }}
                                        style={styles.InputValidationView}
                                        inputStyle={styles.inputStyle}
                                    /> */}

                                    {/* patient */}
                                    <View style={styles.inputAndAddBtnContainer}>
                                        <InputValidation

                                            uniqueKey={formFieldsKeys.patient}
                                            validationObj={validationObjForBranchAndPatient}
                                            placeHolder={labels["patient"]}

                                            value={formFields.patient?.name ?? ""}
                                            iconRight='chevron-down'
                                            // optional={true}
                                            iconColor={Colors.primary}
                                            editable={false}
                                            onPressIcon={() => {
                                                removeErrorTextForInputThatUserIsTyping(formFieldsKeys.patient, branch_and_patient)
                                                setActionSheetDecide(formFieldsKeys.patient)
                                                actionSheetRef.current?.setModalVisible()
                                            }}
                                            style={{ marginTop: Constants.formFieldTopMargin, width: "80%", }}
                                            inputMainViewStyle={styles.InputValidationView}
                                            inputStyle={styles.inputStyle}
                                        />
                                        <TouchableOpacity
                                            onPress={
                                                Can(Constants.permissionsKey.patientsAdd, permissions)
                                                    ? () => { props.navigation.navigate('AddPatient', { fromDeviation: true }) }
                                                    : Alert.showToast(labels.permission_required_for_this_action)
                                            }
                                            style={{
                                                ...styles.addBtn,
                                                marginBottom: validationObjForBranchAndPatient[formFieldsKeys.patient].invalid ? getProportionalFontSize(25) : 0
                                            }}>
                                            <Icon name='add' color={Colors.white} size={24} />
                                        </TouchableOpacity>
                                    </View>

                                    {/* date */}
                                    <InputValidation
                                        uniqueKey={formFieldsKeys.date_time}
                                        validationObj={validationObjForBranchAndPatient}
                                        iconRight="calendar"
                                        iconColor={Colors.primary}
                                        editable={false}
                                        onPressIcon={() => {
                                            removeErrorTextForInputThatUserIsTyping(formFieldsKeys.date_time, branch_and_patient);
                                            setOpenDatePicker(true);
                                            setMode(Constants.DatePickerModes.date_mode);
                                            setDatePickerKey(formFieldsKeys.date_time);
                                        }}
                                        value={
                                            formFields.date_time
                                                ? formatDate(formFields.date_time)
                                                : ''
                                        }
                                        // optional={true}
                                        placeHolder={labels["date"]}
                                        style={styles.InputValidationView}
                                        inputStyle={styles.inputStyle}
                                    />

                                    {/* time */}
                                    <InputValidation
                                        uniqueKey={formFieldsKeys.time}
                                        validationObj={validationObjForBranchAndPatient}
                                        iconRight="time"
                                        iconColor={Colors.primary}
                                        editable={false}
                                        onPressIcon={() => {
                                            removeErrorTextForInputThatUserIsTyping(formFieldsKeys.time, branch_and_patient);
                                            setOpenDatePicker(true);
                                            setMode(Constants.DatePickerModes.time_mode);
                                            setDatePickerKey(formFieldsKeys.time);
                                        }}
                                        value={
                                            formFields.time
                                                ? formatTime(formFields.time)
                                                : ''
                                        }
                                        // optional={true}
                                        placeHolder={labels["time"]}
                                        style={styles.InputValidationView}
                                        inputStyle={styles.inputStyle}
                                    />

                                    {/* category */}
                                    <InputValidation
                                        uniqueKey={formFieldsKeys.category}
                                        validationObj={validationObjForBranchAndPatient}
                                        value={formFields?.[formFieldsKeys.category]?.['name'] ?? ''}
                                        placeHolder={labels.category}
                                        iconRight='chevron-down'
                                        iconColor={Colors.primary}
                                        editable={false}
                                        onPressIcon={() => {
                                            setActionSheetDecide(formFieldsKeys.category);
                                            removeErrorTextForInputThatUserIsTyping(formFieldsKeys.category, branch_and_patient);
                                            actionSheetRef.current?.setModalVisible();
                                        }}
                                        style={styles.InputValidationView}
                                        inputStyle={styles.inputStyle}
                                    />

                                    {/* subcategory */}
                                    <InputValidation
                                        uniqueKey={formFieldsKeys.subcategory}
                                        validationObj={validationObjForBranchAndPatient}
                                        value={formFields.subcategory?.name ?? ""}
                                        placeHolder={labels.subcategory}
                                        iconRight='chevron-down'
                                        iconColor={Colors.primary}
                                        editable={false}
                                        onPressIcon={() => {
                                            setActionSheetDecide(formFieldsKeys.subcategory);
                                            actionSheetRef.current?.setModalVisible();
                                        }}
                                        style={styles.InputValidationView}
                                        inputStyle={styles.inputStyle}
                                    />


                                    {
                                        formFields?.[formFieldsKeys?.subcategory]?.['follow_up_image'] ? <ShowImage imgUrl={formFields.subcategory.follow_up_image} /> : formFields?.[formFieldsKeys.category]?.['follow_up_image'] ? <ShowImage imgUrl={formFields.category.follow_up_image} /> : null
                                    }

                                    {/* next button */}
                                    <CustomButton
                                        style={{ ...styles.nextButton, backgroundColor: Colors.primary }}
                                        onPress={() => {
                                            // setViewDecider(2)
                                            if (validation(branch_and_patient)) {
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
                                </View> : null
                        }

                        {/* {
                            viewDecider == 2
                                ? <View>
                                    <CustomButton
                                        style={{ ...styles.nextButton, backgroundColor: Colors.primary }}
                                        onPress={() => {                                           
                                            if (validation(category_and_subCategory)) {                                              
                                                console.log('Validation true')
                                                setViewDecider(3)
                                            }
                                            else { console.log('Validation false') }
                                        }} title={labels["Next"]}
                                    />
                                </View>
                                : null
                        } */}
                        {
                            viewDecider == 2
                                ? <View>
                                    {/* Event-Description */}
                                    <InputValidation
                                        uniqueKey={formFieldsKeys.description}
                                        validationObj={validationObjForDeviationDetails}
                                        multiline={true}

                                        dropDownListData={descrptionSuggestion}
                                        value={formFields.description}
                                        placeHolder={labels["description"]}
                                        onChangeText={(text) => {
                                            // removeErrorTextForInputThatUserIsTyping(formFieldsKeys.description);
                                            filterSuggestion(text, (filteredData) => { setDescrptionSuggestion(filteredData) })

                                            removeErrorTextForInputThatUserIsTyping(formFieldsKeys.description, deviation_details);
                                            handleInputChange(formFieldsKeys.description, text)
                                        }}
                                        onPressDropDownListitem={(choosenSuggestion) => {
                                            handleInputChange(formFieldsKeys.description, choosenSuggestion)
                                            setDescrptionSuggestion([])
                                        }}
                                        style={styles.InputValidationView}
                                        inputStyle={{ ...styles.inputStyle, ...{ height: 100 } }}
                                    />

                                    {/* immediate_action */}
                                    <InputValidation
                                        uniqueKey={formFieldsKeys.immediate_action}
                                        validationObj={validationObjForDeviationDetails}
                                        multiline={true}
                                        dropDownListData={immediate_action}
                                        value={formFields.immediate_action}
                                        placeHolder={labels["immediate-action"]}
                                        onChangeText={(text) => {
                                            // removeErrorTextForInputThatUserIsTyping(formFieldsKeys.description);
                                            filterSuggestion(text, (filteredData) => { setImmediate_action(filteredData) })
                                            removeErrorTextForInputThatUserIsTyping(formFieldsKeys.immediate_action, deviation_details);
                                            handleInputChange(formFieldsKeys.immediate_action, text)
                                        }}
                                        onPressDropDownListitem={(choosenSuggestion) => {
                                            handleInputChange(formFieldsKeys.immediate_action, choosenSuggestion)

                                            setImmediate_action([])
                                        }}
                                        style={styles.InputValidationView}
                                        inputStyle={{ ...styles.inputStyle, ...{ height: 100 } }}
                                    />

                                    {/* probable_cause_of_the_incident */}
                                    <InputValidation
                                        // uniqueKey={formFieldsKeys.probable_cause_of_the_incident}
                                        // validationObj={ipValidationObj}
                                        multiline={true}
                                        dropDownListData={probable_cause_of_the_incident}
                                        value={formFields.probable_cause_of_the_incident}
                                        placeHolder={labels["probable-cause-of-the-incident"]}
                                        optional={true}
                                        onChangeText={(text) => {
                                            // removeErrorTextForInputThatUserIsTyping(formFieldsKeys.probable_cause_of_the_incident);
                                            filterSuggestion(text, (filteredData) => { setProbable_cause_of_the_incident(filteredData) })
                                            handleInputChange(formFieldsKeys.probable_cause_of_the_incident, text)
                                        }}
                                        onPressDropDownListitem={(choosenSuggestion) => {
                                            handleInputChange(formFieldsKeys.probable_cause_of_the_incident, choosenSuggestion)

                                            setProbable_cause_of_the_incident([])
                                        }}
                                        style={styles.InputValidationView}
                                        inputStyle={{ ...styles.inputStyle, ...{ height: 100 } }}
                                    />



                                    {/* suggestion  suggestion_to_prevent_event_again */}
                                    <InputValidation
                                        // uniqueKey={formFieldsKeys.suggestion_to_prevent_event_again}
                                        // validationObj={ipValidationObj}
                                        multiline={true}
                                        dropDownListData={suggestion_to_prevent_event_again}
                                        value={formFields.suggestion_to_prevent_event_again}
                                        placeHolder={labels["suggestion"]}
                                        optional={true}
                                        onChangeText={(text) => {
                                            // removeErrorTextForInputThatUserIsTyping(formFieldsKeys.suggestion_to_prevent_event_again);
                                            filterSuggestion(text, (filteredData) => { setSuggestion_to_prevent_event_again(filteredData) })
                                            handleInputChange(formFieldsKeys.suggestion_to_prevent_event_again, text)
                                        }}
                                        onPressDropDownListitem={(choosenSuggestion) => {
                                            handleInputChange(formFieldsKeys.suggestion_to_prevent_event_again, choosenSuggestion)

                                            setSuggestion_to_prevent_event_again([])
                                        }}
                                        style={styles.InputValidationView}
                                        inputStyle={{ ...styles.inputStyle, ...{ height: 100 } }}
                                    />

                                    {/* severity */}
                                    <InputValidation
                                        uniqueKey={formFieldsKeys.severity}
                                        validationObj={validationObjForDeviationDetails}
                                        // optional={true}
                                        value={formFields.severity?.name ?? ''}
                                        placeHolder={labels["severity"]}

                                        iconRight="chevron-down"
                                        iconColor={Colors.primary}
                                        editable={false}
                                        onPressIcon={() => {
                                            removeErrorTextForInputThatUserIsTyping(formFieldsKeys.severity);
                                            setActionSheetDecide(formFieldsKeys.severity);
                                            actionSheetRef.current?.setModalVisible();
                                        }}
                                        style={styles.InputValidationView}
                                        inputStyle={styles.inputStyle}
                                    />

                                    {/* is Secret */}
                                    <View style={styles.checkBoxView}>
                                        <BouncyCheckbox
                                            size={20}
                                            fillColor={Colors.primary}
                                            unfillColor={Colors.white}
                                            iconStyle={{ borderColor: Colors.primary }}
                                            isChecked={formFields.is_secret}
                                            onPress={(value) => {
                                                setFormFields({ ...formFields, is_secret: value })
                                            }}
                                        />
                                        <Text style={styles.saveAsTemplate}>{labels["is-secret"]}</Text>
                                    </View>

                                    {/* next button */}
                                    <CustomButton
                                        style={{ ...styles.nextButton, backgroundColor: Colors.primary }}
                                        onPress={() => {
                                            // setViewDecider(4)
                                            if (validation(deviation_details)) {
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
                                </View>
                                : null
                        }
                        {
                            viewDecider == 3
                                ? <View>

                                    {/* follow up */}
                                    <InputValidation
                                        // uniqueKey={formFieldsKeys.follow_up}
                                        // validationObj={ipValidationObj}
                                        optional={true}
                                        multiline={true}
                                        dropDownListData={follow_up}
                                        value={formFields.follow_up}
                                        placeHolder={labels["followups"]}
                                        onChangeText={(text) => {
                                            // removeErrorTextForInputThatUserIsTyping(formFieldsKeys.follow_up);
                                            filterSuggestion(text, (filteredData) => { setFollow_up(filteredData) })
                                            handleInputChange(formFieldsKeys.follow_up, text)
                                        }}
                                        onPressDropDownListitem={(choosenSuggestion) => {
                                            handleInputChange(formFieldsKeys.follow_up, choosenSuggestion)

                                            setFollow_up([])
                                        }}
                                        style={styles.InputValidationView}
                                        inputStyle={{ ...styles.inputStyle, ...{ height: 100 } }}
                                    />

                                    {/* Further-Investigation */}
                                    <InputValidation
                                        // uniqueKey={formFieldsKeys.further_investigation}
                                        // validationObj={validationObj}
                                        optional={true}
                                        value={formFields.further_investigation?.name ?? ''}
                                        placeHolder={labels["further-investigation"]}
                                        iconRight="chevron-down"
                                        iconColor={Colors.primary}
                                        editable={false}
                                        onPressIcon={() => {
                                            // removeErrorTextForInputThatUserIsTyping( formFieldsKeys.further_investigation);
                                            setActionSheetDecide(formFieldsKeys.further_investigation);
                                            actionSheetRef.current?.setModalVisible();
                                        }}
                                        style={styles.InputValidationView}
                                        inputStyle={styles.inputStyle}
                                    />
                                    <MSDataViewer
                                        data={formFields?.[formFieldsKeys.further_investigation] ?? []}
                                        setNewDataOnPressClose={(newArr) => {
                                            setFurtherInvestigationAS({ ...furtherInvestigationAS, selectedData: newArr });
                                            handleInputChange(formFieldsKeys.further_investigation, newArr)
                                        }}
                                    />

                                    {/* next button */}
                                    <CustomButton
                                        style={{ ...styles.nextButton, backgroundColor: Colors.primary }}
                                        onPress={() => {
                                            Keyboard.dismiss()
                                            if (validation(branch_and_patient)) {
                                                // console.log('Validation true')
                                                let badWordString = getBadWordString();
                                                if (badWordString) {
                                                    Alert.showBasicDoubleAlertForBoth(badWordString,
                                                        () => { saveOrEditDeviation() },
                                                        null, messages.message_bad_word_alert)
                                                }
                                                else
                                                    saveOrEditDeviation()
                                            }
                                            else {
                                                Alert.showAlert(Constants.warning, messages.message_fill_all_required_fields)
                                                // console.log('Validation false')
                                            }

                                        }} title={labels["save"]}
                                    />

                                    {/* print button */}
                                    {
                                        deviationId
                                            ? <CustomButton
                                                style={{ ...styles.nextButton, backgroundColor: Colors.primary }}
                                                onPress={() => {
                                                    Keyboard.dismiss()
                                                    printDeviation()
                                                }} title={labels.print_deviation ?? "Print Deviation"}
                                            /> : null}


                                </View>
                                : null
                        }

                    </View>
                    <DatePicker
                        modal
                        mode={mode}
                        open={openDatePicker}
                        minimumDate={
                            mode == Constants.DatePickerModes.date_mode ? new Date() : null
                        }
                        date={new Date()}
                        onConfirm={date => {
                            setOpenDatePicker(false);
                            // console.log('date : ', date);
                            let value = '';
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

                    <ActionSheet ref={actionSheetRef}>
                        <ActionSheetComp
                            title={labels[actionSheetDecide]}
                            closeActionSheet={closeActionSheet}
                            keyToShowData="name"
                            keyToCompareData="id"

                            multiSelect={actionSheetDecide == formFieldsKeys.further_investigation ? true : false}
                            APIDetails={getAPIDetails()}
                            changeAPIDetails={payload => {
                                changeAPIDetails(payload);
                            }}
                            onPressItem={item => {
                                onPressItem(item);
                            }}
                        />
                    </ActionSheet>
                </ScrollView>

            </KeyboardAwareScrollView>
        </BaseContainer >


    )
}

export default AddDeviation

const styles = StyleSheet.create({
    mainView: {
        flex: 1,
        paddingHorizontal: Constants.globalPaddingHorizontal,
        // backgroundColor: Colors.backgroundColor,
        paddingBottom: 30
    },
    InputValidationView: {

        //  backgroundColor: Colors.backgroundColor,
        paddingTop: 10,
        //borderRadius: 20,

    },
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
    checkBoxView: { flexDirection: 'row', alignItems: 'center', marginTop: 30 },
    saveAsTemplate: {
        fontSize: getProportionalFontSize(13),
        fontFamily: Assets.fonts.regular,
    },
    inputAndAddBtnContainer: { flexDirection: "row", alignItems: "flex-end", justifyContent: "space-between" },
    addBtn: { backgroundColor: Colors.primary, height: 57, width: 57, justifyContent: "center", alignItems: "center", borderRadius: 10, },
    title: {
        fontFamily: Assets.fonts.regular,
        fontSize: getProportionalFontSize(15),
    }
})