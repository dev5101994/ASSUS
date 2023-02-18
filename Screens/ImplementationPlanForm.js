import React from 'react';
import {
    StyleSheet,
    Text, View, SafeAreaView, Image, TouchableOpacity, ScrollView, FlatList, Linking, Platform, Keyboard
} from 'react-native';
import Colors from '../Constants/Colors';
import { RadioButton, FAB, Provider, Checkbox, Portal, Modal } from 'react-native-paper';
import Assets from '../Assets/Assets'
import { getProportionalFontSize, formatDate, formatTime, formatDateWithTime, formatDateByFormat, getActionSheetAPIDetail, checkEmailFormat, ReplaceAll, checkMobileNumberFormat, firstLetterFromString, placeholderCreator, checkFileSize, isDocOrImage, } from '../Services/CommonMethods';
import InputValidation from '../Components/InputValidation';
import BouncyCheckbox from "react-native-bouncy-checkbox";
// import { Checkbox } from 'react-native-paper';
import { CommonActions } from '@react-navigation/native';
import APIService from '../Services/APIService'
import Constants from '../Constants/Constants'
// import { FAB, Provider } from 'react-native-paper';
import ProgressLoader from '../Components/ProgressLoader'
import { useSelector, useDispatch } from 'react-redux'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import DatePicker from 'react-native-date-picker';
import ActionSheet from 'react-native-actions-sheet';
import ActionSheetComp from '../Components/ActionSheetComp';
import Icon from 'react-native-vector-icons/Ionicons';
import FormSubHeader from '../Components/FormSubHeader';
import EmptyList from '../Components/EmptyList';
import CommonCRUDCard from '../Components/CommonCRUDCard';
import Alert from '../Components/Alert';
import IPFormComp from '../Components/IPFormComp'
import CustomButton from '../Components/CustomButton'
import MSDataViewer from '../Components/MSDataViewer';
import PersonFormComp from '../Components/PersonFormComp';
// import { Portal, Modal } from 'react-native-paper';
import OverallGoalsComp from '../Components/OverallGoalsComp';
import RelatedFactorsComp from '../Components/RelatedFactorsComp';
import TreatmentAndWorkingComp from '../Components/TreatmentAndWorkingComp';
import ImagePickerActionSheetComp from '../Components/ImagePickerActionSheetComp';
//const labels = Constants.labels.app.implementationPlanForm;
import ImageViewer from 'react-native-image-zoom-viewer';
import { color } from 'react-native-reanimated';
import BaseContainer from '../Components/BaseContainer'
import UploadedFileViewer from '../Components/UploadedFileViewer';
import { useScrollToTop } from '@react-navigation/native';
import LottieView from 'lottie-react-native';
import Can from '../can/Can';
import CommonAPIFunctions from '../Services/CommonAPIFunctions';


const week_days_data = [
    { name: 'S', number: 0, selected: false }, { name: 'M', number: 1, selected: false }, { name: 'T', number: 2, selected: false },
    { name: 'W', number: 3, selected: false }, { name: 'T', number: 4, selected: false },
    { name: 'F', number: 5, selected: false }, { name: 'S', number: 6, selected: false }
]
export default ImplementationPlanForm = (props) => {
    let routeParams = props?.route?.params ?? {};
    const ref = React.useRef(null);
    useScrollToTop(ref);

    // REDUX hooks
    const dispatch = useDispatch();
    const isInternetActive = useSelector(state => state.IsInternetActive);
    const labels = useSelector(state => state.Labels);
    const messages = useSelector(state => state.Labels);
    const UserLogin = useSelector(state => state.User.UserLogin);
    const permissions = UserLogin?.permissions ?? {}

    //Constants
    const ipForm = "ipForm";
    const personForm = "personForm";
    const catSubCat = "catSubCat";
    const formFieldTopMargin = Constants.formFieldTopMargin;

    // Immutable Variables
    let initialValidationObj = {
        patient: {
            invalid: false,
            title: ''
        }
    }

    let catSubCatInitialValidationObj = {
        category: {
            invalid: false,
            title: ''
        },
        subcategory: {
            invalid: false,
            title: ''
        },
    }

    const initialPersonFormValidationObj = {
        name: {
            invalid: false,
            title: ''
        },
        email: {
            invalid: false,
            title: ''
        },
        contact_number: {
            invalid: false,
            title: ''
        },
        // country: {
        //     invalid: false,
        //     title: ''
        // },
        city: {
            invalid: false,
            title: ''
        },
        postal_area: {
            invalid: false,
            title: ''
        },
        zipcode: {
            invalid: false,
            title: ''
        },
        full_address: {
            invalid: false,
            title: ''
        }
    }

    //initialValues
    let ipInitialValues = {
        patient: "",
        category: "",
        subcategory: [],
        attachment: {},
        documents: [],
        signing_method: "manually"
        // what_happened: "",
        // how_it_happened: "",
        // when_it_started: "",
        // what_to_do: "",
        // goal: "",
        // sub_goal: "",
        // plan_start_date: "",
        // plan_start_time: "",
        // remark: "",
        // activity_message: "",
        // save_as_template: false,
        // title: "",
        // assign_employee: false,
        // employee: ""
    };


    const ipFormCompInitialValues = {
        what_happened: "",
        how_it_happened: "",
        when_it_started: "",
        what_to_do: "",
        goal: "",
        sub_goal: "",
        plan_start_date: "",
        plan_start_time: "",
        remark: "",
        activity_message: "",
        save_as_template: false,
        title: "",
        assign_employee: false,
        employee: "",
        end_date: "",
        end_time: "",

        // goal specific fields
        // goal: "",
        no_restriction: '',
        slight_restriction: "",
        large_limit: "",
        moderate_restriction: "",
        total_restriction: "",
        non_specific: "",

        // new data
        how_many_times_a_day: "",
        limitations: "",
        week_days: week_days_data,
        subGoalSelect: "",
        who_should_give_the_support: []

    }

    const personFormInitialValues = {
        name: "",
        email: "",
        contact_number: "",
        // country: "",
        city: "",
        zipcode: "",
        full_address: "",
        is_contact_person: false,
        is_family_member: false,
        is_caretaker: false,
        postal_area: ""
    };
    // const overallGoalFormValues = {
    //     overall_goals: {},
    //     overall_goal_details: ""
    // };

    //uniqueKeys
    let ipFormKeys = {
        patient: "patient",
        category: "category",
        subcategory: "subcategory",
        attachment: "attachment",
        documents: "documents",
        signing_method: "signing_method"
        // what_happened: "what_happened",
        // how_it_happened: "how_it_happened",
        // when_it_started: "when_it_started",
        // what_to_do: "what_to_do",
        // goal: "goal",
        // sub_goal: "sub_goal",
        // plan_start_date: "plan_start_date",
        // plan_start_time: "plan_start_time",
        // remark: "remark",
        // activity_message: "activity_message",
        // save_as_template: "save_as_template",
        // title: "title",
        // assign_employee: "assign_employee",
        // employee: "employee"
    };


    if (routeParams.itemId) {
        ipInitialValues['reason_for_editing'] = "";
        ipFormKeys['reason_for_editing'] = "reason_for_editing";
        initialValidationObj['reason_for_editing'] = {
            invalid: false,
            title: ''
        }
    }

    const personFormKeys = {
        name: "name",
        email: "email",
        contact_number: "contact_number",
        // country: "country",
        city: "city",
        zipcode: "zipcode",
        full_address: "full_address",
        is_contact_person: "is_contact_person",
        is_family_member: "is_family_member",
        is_caretaker: "is_caretaker",
        postal_area: "postal_area"
    };

    const fabActions = [
        {
            icon: 'thumb-up',
            label: labels["approved-by"],
            onPress: () => {
                // setViewDecider(9)
                // return;
                if (validation(ipForm)) {
                    if (validation(catSubCat)) {
                        if (isAllIPFilledUp)
                            setViewDecider(9)
                        else
                            Alert.showAlert(Constants.warning, labels.first_fill_ip, () => { setViewDecider(4) })
                    }
                    else
                        Alert.showAlert(Constants.warning, labels.first_choose_cat, () => { setViewDecider(3) })
                }
                else
                    Alert.showAlert(Constants.warning, labels.first_choose_or_add_patient, () => { setViewDecider(1) })
            },
            small: true,
        },
        {
            icon: 'upload-multiple',
            label: labels["attachments"],
            onPress: () => {
                // setViewDecider(8)
                // return;
                if (validation(ipForm)) {
                    if (validation(catSubCat)) {
                        if (isAllIPFilledUp)
                            setViewDecider(8)
                        else
                            Alert.showAlert(Constants.warning, labels.first_fill_ip, () => { setViewDecider(4) })
                    }
                    else
                        Alert.showAlert(Constants.warning, labels.first_choose_cat, () => { setViewDecider(3) })
                }
                else
                    Alert.showAlert(Constants.warning, labels.first_choose_or_add_patient, () => { setViewDecider(1) })
            },
            small: true,
        },
        {
            icon: 'hospital-box-outline',
            label: labels.treatment_and_working,
            onPress: () => {
                if (validation(ipForm)) {
                    if (validation(catSubCat)) {
                        if (isAllIPFilledUp)
                            setViewDecider(7)
                        else
                            Alert.showAlert(Constants.warning, labels.first_fill_ip, () => { setViewDecider(4) })
                    }
                    else
                        Alert.showAlert(Constants.warning, labels.first_choose_cat, () => { setViewDecider(3) })
                }
                else
                    Alert.showAlert(Constants.warning, labels.first_choose_or_add_patient, () => { setViewDecider(1) })
            },
            small: true,
        },
        {
            icon: 'relation-many-to-many',
            label: labels["related-factor"],
            onPress: () => {
                if (validation(ipForm)) {
                    if (validation(catSubCat)) {
                        if (isAllIPFilledUp)
                            setViewDecider(6)
                        else
                            Alert.showAlert(Constants.warning, labels.first_fill_ip, () => { setViewDecider(4) })
                    }
                    else
                        Alert.showAlert(Constants.warning, labels.first_choose_cat, () => { setViewDecider(3) })
                }
                else
                    Alert.showAlert(Constants.warning, labels.first_choose_or_add_patient, () => { setViewDecider(1) })
            },
            small: true,
        },
        {
            icon: 'basketball',
            label: labels["ip-overall-goal"],
            onPress: () => {
                if (validation(ipForm)) {
                    if (validation(catSubCat)) {
                        if (isAllIPFilledUp)
                            setViewDecider(5)
                        else
                            Alert.showAlert(Constants.warning, labels.first_fill_ip, () => { setViewDecider(4) })
                    }
                    else
                        Alert.showAlert(Constants.warning, labels.first_choose_cat, () => { setViewDecider(3) })
                }
                else
                    Alert.showAlert(Constants.warning, labels.first_choose_or_add_patient, () => { setViewDecider(1) })
            },
            small: true,
        },
        {
            icon: 'newspaper',
            label: labels["ip-modal"],
            onPress: () => {
                if (validation(ipForm)) {
                    if (validation(catSubCat))
                        setViewDecider(4)
                    else
                        Alert.showAlert(Constants.warning, labels.first_choose_cat, () => { setViewDecider(3) })
                }
                else
                    Alert.showAlert(Constants.warning, labels.first_choose_or_add_patient, () => { setViewDecider(1) })
            },
            small: true,
        },
        {
            icon: 'vector-difference',
            label: labels["habitats"],
            onPress: () => {
                if (validation(ipForm))
                    setViewDecider(3)
                else
                    Alert.showAlert(Constants.warning, labels.first_choose_or_add_patient, () => { setViewDecider(1) })
            },
            small: true,
        },
        {
            icon: 'account-multiple-plus',
            label: labels["add-persons"],
            onPress: () => {
                if (validation(ipForm))
                    setViewDecider(2)
                else
                    Alert.showAlert(Constants.warning, labels.first_choose_or_add_patient, () => { setViewDecider(1) })
            },
            small: true,
        },
        {
            icon: 'account-plus',
            label: labels["choose-patient"],
            onPress: () => { setViewDecider(1) },
            small: true,
        },

    ]

    // useState hooks
    const [ipValidationObj, setIPValidationObj] = React.useState({ ...initialValidationObj });
    const [ipFormValues, setIPFormValues] = React.useState({ ...ipInitialValues });
    const [KeyboardScrollViewRef, setKeyboardScrollViewRef] = React.useState(null);



    const [personValidationObj, setPersonValidationObj] = React.useState({ ...initialPersonFormValidationObj });
    const [catSubCatValidationObj, setCatSubCatValidationObj] = React.useState({ ...catSubCatInitialValidationObj });

    const [personFormValues, setPersonFormValues] = React.useState(personFormInitialValues);

    const [overallGoalValues, setOverallGoalValues] = React.useState();

    const [relatedFactorsValues, setRelatedFactorsValues] = React.useState();

    const [treatmentAndWorkingValues, setTreatmentAndWorkingValues] = React.useState();

    const [itemId, setItemId] = React.useState('')
    const [isItemFound, setIsItemFound] = React.useState(false)
    const [isEditable, setIsEditable] = React.useState(true);

    const [isLoading, setIsLoading] = React.useState(false);
    const [IPFullDetail, seIPFullDetail] = React.useState(null);
    const [isValid, setIsValid] = React.useState(true);
    const [actionSheetDecide, setActionSheetDecide] = React.useState('');
    const [openDatePicker, setOpenDatePicker] = React.useState(false);
    const [viewDecider, setViewDecider] = React.useState(1);
    const [mode, setMode] = React.useState(Constants.DatePickerModes.date_mode);
    const [datePickerKey, setDatePickerKey] = React.useState(null);
    const [patientAS, setPatientAS] = React.useState(getActionSheetAPIDetail({
        url: Constants.apiEndPoints.userList, params: { user_type_id: '6' }, debugMsg: "patient-list", token: UserLogin.access_token, perPage: Constants.perPage,
        selectedData: ipFormValues.patient ? [ipFormValues[ipFormKeys.patient]] : []
    }));
    const [categoryAS, setCategoryAS] = React.useState(getActionSheetAPIDetail({
        url: Constants.apiEndPoints.categoryParentList, params: { category_type_id: '2' }, debugMsg: "category", token: UserLogin.access_token, perPage: Constants.perPage,
        selectedData: ipFormValues.category ? [ipFormValues[ipFormKeys.category]] : []
    }));
    const [countryAS, setCountryAS] = React.useState(getActionSheetAPIDetail({
        url: Constants.apiEndPoints.countryList, method: 'post', debugMsg: "countryList", token: UserLogin.access_token, page: null, perPage: null,
        selectedData: personFormValues[personForm.country] ? [personFormValues[personFormKeys.country]] : []
    }));
    const [subCategoryAS, setSubCategoryAS] = React.useState(getActionSheetAPIDetail({}));
    const [personList, setPersonList] = React.useState([
    ]);
    const [isPersonFormVisible, setIsPersonFormVisible] = React.useState(false);
    const [personFormToInitialValue, setPersonFormToInitialValue] = React.useState(false);
    const [IPFormComp_Index, setIPFormComp_Index] = React.useState(0);
    const [refresh, setRefresh] = React.useState(true);
    const [isModalVisible, setIsModalVisible] = React.useState(false);
    const [ipAdded, setIPAdded] = React.useState(false);
    const [uploadingFile, setUploadingFile] = React.useState(false);
    const [ipResponseAfterAdding, setIpResponseAfterAdding] = React.useState(null);
    const [formHeaderFunctionAndTitleForIP, setFormHeaderFunctionAndTitleForIP] = React.useState({ func: () => { }, title: "" });
    const [ignorePerson, setIgnorePerson] = React.useState(true)
    const [openFAB, setOpenFAB] = React.useState(false)
    const [isAllIPFilledUp, seIsAllIPFilledUp] = React.useState(props?.route?.params?.itemId ? true : false)

    const [suggestion, setSuggestion] = React.useState([]);
    const [badWords, setBadWords] = React.useState([]);

    // useEffect hooks
    React.useEffect(() => {
        CommonAPIFunctions.getSuggestions(UserLogin.access_token, (data) => { setSuggestion(data) });
        CommonAPIFunctions.getBadWords(UserLogin.access_token, (data) => { setBadWords(data) });
        // console.log('inside useeffect props,', props?.route?.params)
        if (props?.route?.params?.patientId) {
            getPatientDetail()
        }
        else if (props?.route?.params?.itemId) {
            // console.log('item Id FOund')
            setIsItemFound(true)
            setItemId(props?.route?.params?.itemId)
            getIPDetails(props?.route?.params?.itemId)
        } else {
            setIsLoading(false);
            //setIsEditable(true);
        }
    }, [props?.route?.params])




    //hooks
    const actionSheetRef = React.useRef();

    const handleInputChange = (form, value, key) => {

        if (form == ipForm) {
            if (key == ipFormKeys.subcategory) {
                if (ipFormValues.subcategory?.length > 0) {
                    value.map((obj) => {
                        for (let i = 0; i < ipFormValues.subcategory.length; i++) {
                            if (obj.id == ipFormValues.subcategory[i].id) {
                                if (ipFormValues.subcategory[i].ipForm) {
                                    obj['ipForm'] = ipFormValues.subcategory[i].ipForm;
                                    break;
                                }
                            }
                        }
                    })
                }
                else {
                    value.map((obj) => {
                        if (!obj.ipForm) {
                            obj['ipForm'] = { ...ipFormCompInitialValues }
                        }
                    })
                }
            }
            // console.log('value', value)
            setIPFormValues({
                ...ipFormValues,
                [key]: value,
            });
        }
        else if (form == personForm) {
            setPersonFormValues({
                ...personFormValues,
                [key]: value,
            });
        }

    };

    const validation = (form) => {
        // return true
        if (form == ipForm) {
            let validationObjTemp = { ...ipValidationObj };
            let isValid = true;
            // console.log('validationObjTemp===', JSON.stringify(validationObjTemp))
            for (const [key, value] of Object.entries(validationObjTemp)) {
                // console.log(`${key}: ${value['invalid']}`);
                // console.log(`key`, key);
                // console.log(`value`, value);
                if (ipFormValues[key] == '' || ipFormValues[key] === []) {
                    value['invalid'] = true;
                    value['title'] = labels[key + '_required']
                    //console.log(labels[(key + '_required')]);
                    isValid = false;
                    break;
                    //return false;
                }
            }
            setIPValidationObj(validationObjTemp);
            return isValid;
        }
        else if (form == catSubCat) {
            let catSubCatValidationObjTemp = { ...catSubCatValidationObj };
            let isValid = true;
            // console.log('validationObjTemp===', JSON.stringify(validationObjTemp))
            for (const [key, value] of Object.entries(catSubCatValidationObjTemp)) {
                // console.log(`${key}: ${value['invalid']}`);
                if (ipFormValues[key] == '' || ipFormValues[key] === []) {
                    value['invalid'] = true;
                    value['title'] = labels[key + '_required']
                    //console.log(labels[(key + '_required')]);
                    isValid = false;
                    break;
                    //return false;
                }
            }
            setCatSubCatValidationObj(catSubCatValidationObjTemp);
            return isValid;
        }
        else if (form == personForm) {
            let validationObjTemp = { ...personValidationObj };
            let isValid = true;
            for (const [key, value] of Object.entries(validationObjTemp)) {
                // console.log(`${key}: ${value['invalid']}`);
                if (personFormValues[key] == '') {
                    value['invalid'] = true;
                    value['title'] = labels[key + '_required']
                    //console.log(labels[(key + '_required')]);
                    isValid = false;
                    break;
                    //return false;
                }
                else if (key == personFormKeys.email && !checkEmailFormat(ReplaceAll(personFormValues[key], ' ', ''))) {
                    value['invalid'] = true;
                    value['title'] = labels[key + '_invalid']
                    //console.log(labels[(key + '_required')]);
                    isValid = false;
                    break;
                    //return false;
                }
                else if (key == personFormKeys.contact_number && !checkMobileNumberFormat(ReplaceAll(personFormValues[key], ' ', ''))) {
                    value['invalid'] = true;
                    value['title'] = labels[key + '_invalid']
                    //console.log(labels[(key + '_required')]);
                    isValid = false;
                    break;
                    //return false;
                }
            }
            setPersonValidationObj(validationObjTemp);
            return isValid;
        }
    };

    const removeErrorTextForInputThatUserIsTyping = (form, uniqueKey) => {
        if (form == ipForm) {
            let tempValidationObj = { ...ipValidationObj }
            tempValidationObj[uniqueKey] = initialValidationObj[uniqueKey];
            setIPValidationObj(tempValidationObj);
        }
        else if (form == personForm) {
            let tempValidationObj = { ...personValidationObj }
            tempValidationObj[uniqueKey] = initialPersonFormValidationObj[uniqueKey];
            setPersonValidationObj(tempValidationObj);
        }
        else if (form == catSubCat) {
            let tempCatSubCatValidationObj = { ...catSubCatValidationObj }
            tempCatSubCatValidationObj[uniqueKey] = catSubCatInitialValidationObj[uniqueKey];
            setCatSubCatValidationObj(tempCatSubCatValidationObj);
        }
    }

    const closeActionSheet = () => {
        actionSheetRef?.current?.setModalVisible();
        setActionSheetDecide('');
    }

    const requestForApprovalValidation = () => {
        let isPersonSelectedFlag = false;
        for (let i = 0; i < personList.length; i++) {
            if (ipFormValues.signing_method == "bank_id") {
                if (personList[i].selected_for_approval && personList[i].personal_number !== null && personList[i].personal_number !== undefined) {
                    isPersonSelectedFlag = true
                    break;
                }
            }
            else if (personList[i].selected_for_approval) {
                isPersonSelectedFlag = true
                break;
            }
        }
        if (!isPersonSelectedFlag)
            Alert.showAlert(Constants.warning, messages.message_select_persons_to_request);
        return isPersonSelectedFlag
    }

    const getPatientDetail = async () => {
        setIsLoading(true);
        let url = Constants.apiEndPoints.userView + "/" + routeParams.patientId;
        // console.log("url", url);
        let response = await APIService.getData(url, UserLogin.access_token, null, "getPatientDetailAPI");
        if (!response.errorMsg) {
            handleInputChange(ipForm, response.data.payload, ipFormKeys.patient);
            setPatientAS({ ...patientAS, selectedData: [response.data.payload] })
            setIsLoading(false);
            // setIsPer(false);
        }
        else {
            setIsLoading(false);
            Alert.showAlert(Constants.danger, response.errorMsg);
        }
    }

    const requestForApprovalAPI = async (ip_res_arr, ipId, message_success) => {
        setUploadingFile(true);
        let url = Constants.apiEndPoints.requestForApproval;
        let params = []
        let approval_type = ipFormValues.signing_method == "bank_id" ? 3 : ipFormValues.signing_method == "manually" ? 1 : 2;
        ip_res_arr.map((ip_obj) => {
            personList.map((item) => {
                if (item.selected_for_approval && item.is_presented) {
                    if (ipFormValues.signing_method == "bank_id") {
                        if (item.personal_number) {
                            params.push({
                                "approval_type": approval_type,
                                "request_type": "2",// 2 is request type of IP
                                "request_type_id": ip_obj.id,//ipId
                                "requested_to": item.id,//person id
                                "reason_for_requesting": "Ip Approval"
                            })
                        }
                    }
                    else {
                        params.push({
                            "approval_type": approval_type,
                            "request_type": "2",// 2 is request type of IP
                            "request_type_id": ip_obj.id,//ipId
                            "requested_to": item.id,//person id
                            "reason_for_requesting": "Ip Approval"
                        })
                    }
                }
            })
        })
        let response = await APIService.postData(url, params, UserLogin.access_token, null, "requestForApprovalAPI");
        if (!response.errorMsg) {
            setUploadingFile(false);
            setIsLoading(false);
            if (message_success) {
                Alert.showAlert(Constants.success, labels.successfully_sent_request)
                return;
            }
            if (ipId) {
                Alert.showAlert(Constants.success, labels.ip_edited_successfully, () => {
                    // setViewDecider(1)
                    props.navigation.pop()
                })
            }
            else {
                setIpResponseAfterAdding(ip_res_arr)
                setIPAdded(true)
                Alert.showAlert(Constants.success, labels.ip_added_successfully, () => { setViewDecider(1) })
            }
        }
        else {
            setUploadingFile(false);
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
            if (Array.isArray(response) && response.length > 0) {
                let uploaded_doc_arr = await uploadFile(response);
                if (!uploaded_doc_arr)
                    return;
                uploaded_doc_arr.map((obj) => {
                    obj['uploaded_doc_url'] = obj.file_name
                    obj['uri'] = obj.file_name;
                    obj['type'] = obj.uploading_file_name;
                })
                let tempDocArr = [...ipFormValues.documents];
                tempDocArr = tempDocArr.concat(uploaded_doc_arr)
                handleInputChange(ipForm, tempDocArr, ipFormKeys.documents)
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

                let tempDocArr = [...ipFormValues.documents];
                tempDocArr = tempDocArr.concat(uploaded_doc_arr)
                handleInputChange(ipForm, tempDocArr, ipFormKeys.documents)
            }
        }
    }

    const getIPDetails = async (ipId) => {
        setIsLoading(true);
        // let params = {
        // }
        //console.log("ipId", ipId)
        let url = Constants.apiEndPoints.implementationPlan + "/" + ipId;
        // console.log("url", url);
        let response = await APIService.getData(url, UserLogin.access_token, null, "IPDetailAPI");
        if (!response.errorMsg) {
            seIPFullDetail([response.data.payload]);
            let tempSubCategory = response.data.payload.subcategory
            let temp_who_give_support = response.data.payload.who_give_support ? await JSON.parse(response.data.payload.who_give_support) : []
            let temp_who_give_support_Arr = []
            temp_who_give_support?.map((item, index) => {
                let tempObj = {
                    name: item,
                    id: index
                }
                temp_who_give_support_Arr.push(tempObj);
            })
            tempSubCategory['ipForm'] = {
                "id": response.data.payload.id,
                //"what_happened": response.data.payload.what_happened,
                "how_it_happened": response.data.payload.how_it_happened,
                // "when_it_started": response.data.payload.when_it_started,
                "what_to_do": response.data.payload.what_to_do,
                "goal": response.data.payload.goal,
                "sub_goal": response.data.payload.sub_goal,
                "plan_start_date": new Date(response.data.payload.start_date),
                // "plan_start_time": response.data.payload.plan_start_time,
                "remark": response.data.payload.remark,
                "activity_message": response.data.payload.activity_message,
                "save_as_template": response.data.payload.save_as_template == 1 ? true : false,
                "assign_employee": response.data.payload.assign_employee ? true : false,
                "employee": response.data.payload?.assign_employee?.employee ?? {},
                "end_date": new Date(response.data.payload.end_date),
                title: response.data.payload.title,
                limitations: response.data.payload.limitations,
                limitation_details: response.data.payload.limitation_details,
                subGoalSelect: response.data.payload.sub_goal_selected,
                sub_goal_details: response.data.payload.sub_goal_details,
                who_should_give_the_support: temp_who_give_support_Arr,
                how_support_should_be_given: response.data.payload.how_support_should_be_given
            }
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
            setOverallGoalValues({
                ...overallGoalValues,
                overall_goals: response.data.payload.overall_goal,
                overall_goal_details: response.data.payload.overall_goal_details
            })
            setRelatedFactorsValues({
                ...relatedFactorsValues,
                body_function: response.data.payload.body_functions,
                personal_factors: response.data.payload.personal_factors,
                health_condition: response.data.payload.health_conditions,
                factors: response.data.payload.other_factors
            })
            setTreatmentAndWorkingValues({
                ...treatmentAndWorkingValues,
                treatment: response.data.payload.treatment,
                working_method: response.data.payload.working_method,
            })
            setPersonList(response.data.payload.persons)
            setIPFormValues({
                ...ipFormValues,
                [ipFormKeys.category]: response.data.payload.category,
                [ipFormKeys.subcategory]: [tempSubCategory],
                [ipFormKeys.patient]: response.data.payload.patient,
                [ipFormKeys.documents]: tempDocuments,
                [ipFormKeys.reason_for_editing]: response.data.payload.reason_for_editing ?? ""
            })
            setSubCategoryAS(getActionSheetAPIDetail({
                url: Constants.apiEndPoints.categoryChildList, params: { parent_id: response.data.payload.category?.id }, debugMsg: "sub-category", token: UserLogin.access_token,
                selectedData: [response.data.payload.subcategory]
            }))
            // console.log("payload getIPDetails", response.data.payload);
            // setIPFormValues(response.data.payload)
            // setIPFormValues(response.data.payload)
            // setPersonList(response.data.payload.persons ?? [])
            // console.log("data", response.data.success);
            setIsLoading(false);
            // setIsPer(false);
        }
        else {
            setIsLoading(false);
            Alert.showAlert(Constants.danger, response.errorMsg);
        }
    }

    const getPatientsPersons = async (patientID) => {
        setUploadingFile(true)
        let url = Constants.apiEndPoints.patientPersonList;
        let response = await APIService.postData(url, { patient_id: patientID }, UserLogin.access_token, null, "getPatientsPersonsAPI");
        if (!response.errorMsg) {
            setPersonList(response.data.payload)
            setUploadingFile(false)
        }
        else {
            Alert.showToast(response.errorMsg);
            setUploadingFile(false)
        }
    }

    const personListRenderItem = ({ item, index }) => {
        const labelText = firstLetterFromString(item[personFormKeys.name])
        return (
            <CommonCRUDCard
                labelText={labelText}
                title={item[personFormKeys.name]}
                showDeleteIcon={
                    Can(Constants.permissionsKey.ipDelete, permissions) && isEditable
                }
                showEditIcon={
                    Can(Constants.permissionsKey.ipedit, permissions) && isEditable
                }
                second_title_value={item[personFormKeys.email]}
                onPressEdit={() => {
                    setIsPersonFormVisible(true);
                    setPersonFormValues({ ...item, index: index });
                }}
                onPressDelete={() => {
                    Alert.showDoubleAlert(Constants.warning, messages.message_delete_confirmation, () => {
                        personList.splice(index, 1)
                        Alert.showToast(messages.message_delete_success, Constants.success);
                    })
                }}
            />
        )
    }

    const uploadFile = async (attachmentArr) => {
        // if (!checkFileSize(attachmentObj))
        //     return;
        setUploadingFile(true)
        let res = await APIService.uploadFile(Constants.apiEndPoints.uploadDoc, attachmentArr, UserLogin.access_token, 'implementation_plan_attachments_', 'multiple', 'implementation plan Attachment')
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

    /**
     * 
     * @param {*} ipId 
     */
    const saveImplementationPlan = async (request_for_approval) => {
        // console.log("personList near api call", personList)
        if (ipAdded && ipResponseAfterAdding) {
            Alert.showAlert(Constants.warning, labels.already_saved_message)
            return;
        }
        let persons = [];
        // console.log('personList', personList)
        personList.map(person => {
            let obj = { ...person, country: '', id: (person.id !== undefined && person.id !== null) ? person.id : "", country_id: 209 }
            persons.push(obj)
        })

        let tempDocuments = null;
        if (ipFormValues.documents?.length > 0) {
            tempDocuments = [];
            ipFormValues.documents.map((obj) => {
                let tempObj = {
                    file_name: obj.uploading_file_name,
                    file_url: obj.file_name
                }
                tempDocuments.push(tempObj);
            })
        }

        let initialParamObj = {
            "category_id": ipFormValues[ipFormKeys.category]['id'] ?? "",
            "user_id": ipFormValues[ipFormKeys.patient]['id'] ?? "",
            "persons": persons,

            // OVERALL GOALS FIELDS
            overall_goal: overallGoalValues?.overall_goals ?? "",
            overall_goal_details: overallGoalValues?.overall_goal_details ?? "",


            // RELATED FACTORS FIELDS                
            "body_functions": relatedFactorsValues?.body_function ?? '',
            personal_factors: relatedFactorsValues?.personal_factors ?? "",
            health_conditions: relatedFactorsValues?.health_condition ?? "",
            other_factors: relatedFactorsValues?.factors ?? "",

            // TREATMENT AND WORKING
            treatment: treatmentAndWorkingValues?.treatment ?? "",
            working_method: treatmentAndWorkingValues?.working_method ?? "",

            documents: tempDocuments,
        }

        // const weekDays = (data) => {
        //     let val = []
        //     if (data.length > 0) {
        //         data.map((v) => {
        //             if (v.selected) {
        //                 let p = v.number
        //                 val.push(p)
        //             }
        //         })
        //         console.log(`days : ${val}`)
        //         return val
        //     }
        // }

        const whoGiveSupport = (data) => {
            if (!data)
                return;
            let val = []
            if (data.length > 0) {
                data.map((v) => {
                    let p = v.name
                    val.push(p)
                })
                // console.log(`who : ${val}`)
                return val
            }
        }


        let params = [];

        ipFormValues.subcategory.map((subCatObj) => {
            // console.log('subCatObj.ipForm.who_should_give_the_support', subCatObj.ipForm.who_should_give_the_support)
            // console.log('whoGiveSupport(subCatObj.ipForm.who_should_give_the_support)', whoGiveSupport(subCatObj.ipForm.who_should_give_the_support))
            let tempParam = {
                ...initialParamObj,
                // "activity_message": subCatObj.ipForm.activity_message ?? "",
                // "assign_employee": subCatObj.ipForm.assign_employee ?? false,
                "emp_id": subCatObj?.ipForm?.employee['id'] ?? "",
                "goal": subCatObj?.ipForm?.goal ?? "",
                // "how_it_happened": subCatObj?.ipForm?.how_it_happened ?? "",
                // "plan_start_date": subCatObj?.ipForm?.plan_start_date ? subCatObj?.ipForm?.plan_start_date?.toString() : "",
                // "plan_start_time": subCatObj?.ipForm?.plan_start_time ? subCatObj?.ipForm?.plan_start_time?.toString() : "",
                // "remark": subCatObj?.ipForm?.remark ?? "",
                "save_as_template": subCatObj?.ipForm?.save_as_template ? "1" : "0",
                "sub_goal": subCatObj?.ipForm?.sub_goal ?? "",
                "sub_goal_details": subCatObj?.ipForm?.sub_goal_details,
                "sub_goal_selected": subCatObj?.ipForm?.subGoalSelect,
                "subcategory_id": subCatObj['id'] ?? "",
                "title": subCatObj?.ipForm?.title ?? "",
                // "what_happened": subCatObj?.ipForm?.what_happened ?? "",
                // "what_to_do": subCatObj?.ipForm?.what_to_do ?? "",
                // "when_it_started": subCatObj?.ipForm?.when_it_started ?? "",
                // "branch_id": "",
                // "end_date": subCatObj?.ipForm?.end_date ?? "",
                "limitations": subCatObj?.ipForm?.limitations ?? '',
                limitation_details: subCatObj?.ipForm?.limitation_details ?? "",
                how_support_should_be_given: subCatObj?.ipForm?.how_support_should_be_given ?? "",
                // week_days: weekDays(subCatObj?.ipForm?.week_days),
                // how_many_time: subCatObj?.ipForm?.how_many_times_a_day,
                // when_during_the_day: subCatObj?.ipForm?.when_support_is_to_be_given,
                who_give_support: whoGiveSupport(subCatObj?.ipForm?.who_should_give_the_support) ?? null,
                // "start_date_and_time": subCatObj?.ipForm?.plan_start_date ? subCatObj?.ipForm?.plan_start_date?.toString() : "",
                // "end_date_and_time": subCatObj?.ipForm?.end_date ? subCatObj?.ipForm?.end_date?.toString() : "", 
                "start_date": subCatObj?.ipForm?.plan_start_date,
                "end_date": subCatObj?.ipForm?.end_date,
            }

            if (routeParams?.itemId) {
                tempParam['reason_for_editing'] = ipFormValues[ipFormKeys?.reason_for_editing]
            }

            params?.push({ ...tempParam });
        })

        // console.log('params==================================================', JSON.stringify(params));

        // return

        setIsLoading(true);
        let url = Constants.apiEndPoints.implementationPlan;
        let msg = messages.message_add_success;
        let response = {};
        let ipId = routeParams.itemId;
        if (ipId) {
            url = url + '/' + ipId;
            msg = messages.message_update_success;
            response = await APIService.putData(url, params, UserLogin.access_token, null, "editIPDetails");
        }
        else
            response = await APIService.postData(url, params, UserLogin.access_token, null, "saveIPDetails");

        if (!response.errorMsg) {
            if (request_for_approval) {
                requestForApprovalAPI(response.data.payload, ipId)
            }
            else {
                setIsLoading(false);
                if (ipId) {
                    Alert.showAlert(Constants.success, labels.ip_edited_successfully, () => {
                        // setViewDecider(1)
                        props.navigation.pop()
                    })
                }
                else {
                    // console.log("********response.data.payload", JSON.stringify(response.data.payload))
                    setIpResponseAfterAdding(response.data.payload)
                    setIPAdded(true)
                    if (routeParams.fromActivity) {
                        setIsModalVisible(true)
                    } else {
                        Alert.showAlert(Constants.success, labels.ip_added_successfully, () => { setViewDecider(1) })
                    }

                }
            }
        }
        else {
            setIsLoading(false);
            Alert.showAlert(Constants.danger, response.errorMsg)
        }
    }

    const getBadWordString = (array) => {
        if (!array)
            return '';
        let result = '';
        for (let i = 0; i < badWords?.length; i++) {
            let currBadWord = badWords[i]?.name?.toLowerCase();
            array.map((str) => {
                if (str?.toLowerCase()?.includes(currBadWord)) {
                    if (!result?.toLowerCase()?.includes(currBadWord))
                        result = result + badWords[i]?.name + ", ";
                }
            })
        }
        if (result)
            result = result?.substring(0, result?.length - 2);
        return result;
    }



    const onRequestClose = () => {
        setIsModalVisible(false);
    }

    // Render view
    // console.log('ipFormValues.subcategory', ipFormValues.subcategory)
    if (isLoading)
        return <ProgressLoader />

    return (

        <BaseContainer
            title={labels["ip-modal"]}
            onPressLeftIcon={() => { props.navigation.pop() }}
            titleStyle={styles.headingText}
            leftIcon="arrow-back"
            leftIconSize={24}
            leftIconColor={Colors.primary}
            rightIconSize={25}
            rightIconColor={Colors.primary}
        >
            <View style={{ flex: 1 }}>
                {
                    viewDecider == 4 ? (
                        <FormSubHeader
                            leftIconName={"chevron-back-circle-outline"}
                            onPressLeftIcon={() => {
                                formHeaderFunctionAndTitleForIP.func()
                            }}
                            title={formHeaderFunctionAndTitleForIP.title}
                        />
                    ) : viewDecider != 4 ? (
                        <FormSubHeader
                            leftIconName={
                                viewDecider == 1 ? "" : "chevron-back-circle-outline"}
                            onPressLeftIcon={
                                viewDecider == 2
                                    ? isPersonFormVisible
                                        ? () => {
                                            setPersonFormToInitialValue(true)
                                            setIsPersonFormVisible(false)
                                        } : () => { setViewDecider(1) }
                                    : viewDecider == 5
                                        ? () => { setViewDecider(4) }
                                        :
                                        viewDecider == 3
                                            ? () => { setViewDecider(2) }
                                            : viewDecider == 6
                                                ? () => { setViewDecider(5) }
                                                : viewDecider == 7
                                                    ? () => { setViewDecider(6) }
                                                    : (viewDecider == 8 && !uploadingFile)
                                                        ? () => { setViewDecider(7) }
                                                        : (viewDecider == 9 && !uploadingFile)
                                                            ? () => { setViewDecider(8) }
                                                            : () => { }
                            }
                            title={
                                viewDecider == 1
                                    ? labels["patient"]
                                    : viewDecider == 2
                                        ? labels["Details"]
                                        : viewDecider == 3
                                            ? labels["habitats"]
                                            : viewDecider == 5
                                                ? labels["overall-goal"]
                                                : viewDecider == 6
                                                    ? labels["related-factor"]
                                                    : viewDecider == 7
                                                        ? labels["ip-treatment-working"]
                                                        : viewDecider == 8
                                                            ? labels["attachments"]
                                                            : viewDecider == 9
                                                                ? labels["approved-by"]
                                                                : ""
                            }
                            rightIconName={viewDecider == 2
                                ? Can(Constants.permissionsKey.personsAdd, permissions)
                                    ? "person-add-outline"
                                    : null
                                : null
                            }
                            onPressRightIcon={
                                Can(Constants.permissionsKey.personsAdd, permissions)
                                    ? () => {
                                        setPersonFormToInitialValue(true);
                                        setIsPersonFormVisible(true);
                                    } : () => Alert.showToast(labels.permission_required_for_this_action)
                            }
                        />
                    )
                        : null
                }

                <KeyboardAwareScrollView innerRef={ref => {
                    //  console.log('ref-------------------------------------------------------------', ref)
                    setKeyboardScrollViewRef(ref)
                }} style={{ flex: 1 }} keyboardShouldPersistTaps="handled" >

                    {/* <Portal>
                    <Modal
                        animationType="slide"
                        transparent={true}
                        style={{}}
                        visible={isModalVisible}
                        onRequestClose={onRequestClose}
                    >
                        <ImageViewer imageUrls={[{ url: ipFormValues.attachment?.uri }]} />
                    </Modal>
                        </Portal> */}

                    {/* Image viewer modal */}
                    {/* <Modal onRequestClose={() => { setIsModalVisible(false) }} visible={isModalVisible} transparent={true}>
                    <ImageViewer
                        renderHeader={() => {
                            return <Icon onPress={() => { setIsModalVisible(false) }}
                                name='close' size={27} color={Colors.white} style={{ alignSelf: "flex-end", padding: 5 }} />
                        }} imageUrls={[{ url: ipFormValues.attachment?.uri }]} />
                        </Modal> */}

                    {/* Main View */}
                    {(viewDecider == 1) ?
                        <ScrollView style={{ flex: 1 }}>
                            <KeyboardAwareScrollView keyboardShouldPersistTaps="handled" >
                                <View style={styles.mainView}>

                                    {/* patient */}
                                    <InputValidation
                                        uniqueKey={ipFormKeys.patient}
                                        validationObj={ipValidationObj}
                                        value={ipFormValues.patient?.name}
                                        placeHolder={labels["patient"]}
                                        iconRight='chevron-down'
                                        iconColor={Colors.primary}
                                        editable={false}
                                        onPressIcon={
                                            !routeParams.fromActivity
                                                ? () => {
                                                    if (isEditable) {
                                                        setActionSheetDecide(ipFormKeys.patient);
                                                        //removeErrorTextForInputThatUserIsTyping(ipFormKeys.patient_id);
                                                        actionSheetRef.current?.setModalVisible();
                                                    }
                                                } : () => { }
                                        }
                                        style={{
                                            ...styles.InputValidationView,
                                            //  width: "80%"
                                        }}
                                        // inputStyle={styles.inputStyle}
                                        inputStyle={{ ...styles.inputStyle, ...{ width: 100 } }}
                                    />

                                    {
                                        !routeParams.fromActivity
                                            ? <>
                                                <View style={{
                                                    width: "100%",
                                                    justifyContent: "center",
                                                    alignItems: "center",
                                                    marginTop: 10
                                                }}>
                                                    <Text style={{
                                                        backgroundColor: Colors.primary,
                                                        borderRadius: 40,
                                                        paddingHorizontal: 10,
                                                        paddingVertical: 12,
                                                        color: Colors.white,
                                                        fontFamily: Assets.fonts.semiBold
                                                    }}>{labels["or"]}</Text></View>

                                                {/* add new patient */}
                                                {
                                                    Can(Constants.permissionsKey.patientsAdd, permissions)
                                                        ? <CustomButton
                                                            style={{
                                                                ...styles.nextButton,
                                                                backgroundColor: Colors.primary,
                                                                marginBottom: 0
                                                            }}
                                                            isLoading={uploadingFile}
                                                            onPress={() => { props.navigation.navigate('AddPatient', { fromIP: true }) }}
                                                            title={labels["add-patient"]}
                                                        /> : null}

                                            </> : null
                                    }

                                    {/* reason for editing */}
                                    {routeParams.itemId ?
                                        < InputValidation
                                            uniqueKey={ipFormKeys.reason_for_editing}
                                            validationObj={ipValidationObj}
                                            value={ipFormValues[ipFormKeys.reason_for_editing]}
                                            placeHolder={labels["reason-for-editing"]}
                                            onChangeText={(text) => {
                                                removeErrorTextForInputThatUserIsTyping(ipForm, ipFormKeys.reason_for_editing);
                                                handleInputChange(ipForm, text, ipFormKeys.reason_for_editing)
                                            }}
                                            style={styles.InputValidationView}
                                            // inputStyle={styles.inputStyle}
                                            editable={isEditable}
                                            multiline={true}
                                            inputStyle={{ ...styles.inputStyle, ...{ height: 100 } }}
                                        /> : null}

                                    {/* next button */}
                                    <CustomButton
                                        style={{
                                            ...styles.nextButton,
                                            backgroundColor: isValid ? Colors.primary : Colors.lightPrimary
                                        }}
                                        isLoading={uploadingFile}
                                        onPress={() => {
                                            if (validation(ipForm)) {
                                                //loginAPI();
                                                // console.log('Validation true')
                                                let badWordString = getBadWordString([ipFormValues[ipFormKeys.reason_for_editing]]);
                                                if (badWordString) {
                                                    Alert.showBasicDoubleAlertForBoth(badWordString, () => {
                                                        setViewDecider(2)
                                                    }, null, messages.message_bad_word_alert)
                                                }
                                                else
                                                    setViewDecider(2)
                                            }
                                            else {
                                                Alert.showAlert(Constants.warning, messages.message_fill_all_required_fields)
                                                // console.log('Validation false')
                                            }
                                        }} title={labels["Next"]}
                                    />

                                    {
                                        // routeParams.itemId || 
                                        (ipAdded && ipResponseAfterAdding)
                                            ? <View style={{ width: "100%", height: 0, borderWidth: 1, marginTop: Constants.formFieldTopMargin, borderColor: Colors.gray }} />
                                            : null
                                    }

                                    {
                                        // routeParams.itemId ||
                                        (ipAdded && ipResponseAfterAdding)
                                            ?
                                            <>
                                                <Text numberOfLines={2} style={{ ...styles.headingText, fontSize: getProportionalFontSize(16), marginTop: Constants.formFieldTopMargin, }} >{labels["create-followups"]}</Text>
                                                <FlatList
                                                    data={(ipAdded && ipResponseAfterAdding) ? ipResponseAfterAdding : ipFormValues.subcategory}
                                                    contentContainerStyle={{}}
                                                    // keyExtractor={(item) => item.id}
                                                    keyExtractor={(item, index) => '' + index}
                                                    renderItem={({ item, index }) => {
                                                        // console.log('item', item)
                                                        return (
                                                            <>
                                                                {/* add follow up */}
                                                                {
                                                                    Can(Constants.permissionsKey.followupAdd, permissions)
                                                                        ? <CustomButton
                                                                            numberOfLines={2}
                                                                            style={{
                                                                                ...styles.nextButton, marginTop: index == 0 ? 10 : 5, marginVertical: 0,
                                                                                backgroundColor: Colors.primary,
                                                                            }}
                                                                            onPress={() => {
                                                                                props.navigation.navigate('IPFollowUpScreen', {
                                                                                    IPId: (ipAdded && ipResponseAfterAdding) ? item.id : item.ipForm.id,
                                                                                    implementationName: item?.title
                                                                                })
                                                                            }
                                                                            } title={labels["create-followups"] + ' ' + ((ipAdded && ipResponseAfterAdding) ? item.title : item.ipForm.title)}
                                                                        /> : null}
                                                            </>
                                                        )
                                                    }}
                                                />
                                            </>
                                            : null}

                                    {
                                        // routeParams.itemId || 
                                        (ipAdded && ipResponseAfterAdding)
                                            ?
                                            <>
                                                <Text numberOfLines={2} style={{ ...styles.headingText, fontSize: getProportionalFontSize(16), marginTop: Constants.formFieldTopMargin, }} >{labels["add-activity"]}</Text>
                                                <FlatList
                                                    data={(ipAdded && ipResponseAfterAdding) ? ipResponseAfterAdding : ipFormValues.subcategory}
                                                    contentContainerStyle={{}}
                                                    // keyExtractor={(item) => item.id}
                                                    keyExtractor={(item, index) => '' + index}
                                                    renderItem={({ item, index }) => {
                                                        return (
                                                            <>
                                                                {/* add activity */}
                                                                {
                                                                    Can(Constants.permissionsKey.activityAdd, permissions)
                                                                        ? <CustomButton
                                                                            numberOfLines={2}
                                                                            style={{
                                                                                ...styles.nextButton, marginTop: index == 0 ? 10 : 5, marginVertical: 0,
                                                                                backgroundColor: Colors.primary,
                                                                            }}
                                                                            onPress={
                                                                                () => {
                                                                                    // props.navigation.pop()
                                                                                    props.navigation.navigate('ActivityStack', {
                                                                                        screen: "AddActivity",
                                                                                        params: {
                                                                                            IPId: (ipAdded && ipResponseAfterAdding) ? item.id : item.ipForm.id,
                                                                                            patientID: ipFormValues[ipFormKeys.patient]['id'] ?? ""
                                                                                        }
                                                                                    })
                                                                                }} title={labels["add-activity"] + ' ' + ((ipAdded && ipResponseAfterAdding) ? item.title : item.ipForm.title)}
                                                                        /> : null
                                                                }
                                                            </>
                                                        )
                                                    }}
                                                />
                                            </>
                                            : null}

                                </View>
                            </KeyboardAwareScrollView>
                        </ScrollView>
                        : (viewDecider == 2) ?
                            <>
                                <PersonFormComp
                                    badWords={badWords}
                                    suggestion={suggestion}
                                    setIsLoading={(val) => { setIsLoading(val) }}
                                    patient_id={ipFormValues.patient?.id}
                                    crudByAPI={true}
                                    onPressNext={(peronList) => {
                                        setPersonList(peronList ?? [])
                                        setViewDecider(viewDecider + 1)
                                        // console.log("----------- PersonList", personList)
                                    }}
                                    onPressBack={(peronList) => {
                                        setPersonList(peronList ?? [])
                                        setViewDecider(viewDecider - 1)
                                    }}
                                    showIPSpecificFields={true}
                                    personFormToInitialValue={personFormToInitialValue}
                                    setPersonFormToInitialValue={setPersonFormToInitialValue}
                                    // onPressSave={(ignorePersons, personsList) => {
                                    //     if (ipAdded && ipResponseAfterAdding) {
                                    //         Alert.showAlert(Constants.warning, labels.already_saved_message)
                                    //     }
                                    //     else
                                    //     {
                                    //         saveImplementationPlan(ignorePersons, personsList)
                                    //     }
                                    // }}
                                    // onPressSave={(ignorePersons, personsList) => { saveImplementationPlan(ignorePersons, personsList) }}
                                    personList={personList}
                                    isPersonFormVisible={isPersonFormVisible}
                                    setIsPersonFormVisible={setIsPersonFormVisible}
                                    labelOne={labels["back"]}
                                    labelTwo={labels["Next"]}
                                />

                            </>
                            : (viewDecider == 3) ?
                                <View style={{ paddingHorizontal: Constants.globalPaddingHorizontal }}>
                                    {/* category */}
                                    <InputValidation
                                        uniqueKey={ipFormKeys.category}
                                        validationObj={catSubCatValidationObj}
                                        value={ipFormValues[ipFormKeys.category]['name'] ?? ''}
                                        placeHolder={labels["category"]}
                                        iconRight='chevron-down'
                                        iconColor={Colors.primary}
                                        editable={false}
                                        onPressIcon={() => {
                                            if (ipFormValues.subcategory?.length > 0) {
                                                Alert.showDoubleAlert(Constants.warning, messages.message_lose_data_alert_category, () => {
                                                    // handleInputChange(ipForm, [], ipFormKeys.subcategory)
                                                    setIPFormValues({
                                                        ...ipFormValues,
                                                        [ipFormKeys.subcategory]: [],
                                                        [ipFormKeys.category]: ""
                                                    });
                                                    setSubCategoryAS({ ...subCategoryAS, selectedData: [] })
                                                    setCategoryAS({ ...categoryAS, selectedData: [] })
                                                    setActionSheetDecide(ipFormKeys.category);
                                                    removeErrorTextForInputThatUserIsTyping(catSubCat, ipFormKeys.category);
                                                    actionSheetRef.current?.setModalVisible();
                                                })
                                            }
                                            else {
                                                setActionSheetDecide(ipFormKeys.category);
                                                removeErrorTextForInputThatUserIsTyping(catSubCat, ipFormKeys.category);
                                                actionSheetRef.current?.setModalVisible();
                                            }
                                        }}

                                        style={styles.InputValidationView}
                                        inputStyle={styles.inputStyle}
                                    />

                                    {/* subcategory */}
                                    <InputValidation
                                        uniqueKey={ipFormKeys.subcategory}
                                        validationObj={catSubCatValidationObj}
                                        value={ipFormValues.subcategory?.name}
                                        placeHolder={labels["subcategory"]}
                                        iconRight='chevron-down'
                                        iconColor={Colors.primary}
                                        editable={false}
                                        onPressIcon={() => {
                                            setActionSheetDecide(ipFormKeys.subcategory);
                                            removeErrorTextForInputThatUserIsTyping(catSubCat, ipFormKeys.subcategory);
                                            actionSheetRef.current?.setModalVisible();
                                        }}
                                        style={styles.InputValidationView}
                                        inputStyle={styles.inputStyle}
                                    />

                                    <MSDataViewer
                                        data={ipFormValues[ipFormKeys.subcategory]}
                                        setNewDataOnPressClose={(newArr) => {
                                            setSubCategoryAS({ ...subCategoryAS, selectedData: newArr });
                                            handleInputChange(ipForm, newArr, ipFormKeys.subcategory)
                                        }}
                                    />

                                    <View style={{ flexDirection: "row", alignItems: "center", width: "100%", justifyContent: "space-between" }}>
                                        <CustomButton
                                            style={{
                                                ...styles.nextButton,
                                                backgroundColor: Colors.primary,
                                                width: "49%"
                                            }}
                                            onPress={() => {
                                                setViewDecider(viewDecider - 1)
                                            }} title={labels["back"]}
                                        />
                                        <CustomButton
                                            style={{
                                                ...styles.nextButton,
                                                backgroundColor: Colors.primary,
                                                width: "49%"
                                            }}
                                            onPress={() => {
                                                if (validation(catSubCat)) {
                                                    //loginAPI();
                                                    // console.log('Validation true')
                                                    setViewDecider(viewDecider + 1)
                                                }
                                                else {
                                                    Alert.showAlert(Constants.warning, messages.message_fill_all_required_fields)
                                                    // console.log('Validation false')
                                                }
                                            }} title={labels["Next"]}
                                        />
                                    </View>

                                    {routeParams.itemId
                                        ? <Text style={styles.impMessageText}>{labels["can_not_add_multiple_ip_message"]}</Text>
                                        : null}
                                </View>
                                :
                                viewDecider == 4
                                    ?
                                    <FlatList
                                        data={ipFormValues.subcategory}
                                        keyExtractor={(item, index) => '' + index}
                                        //ref={(ref) => {  }}
                                        // keyExtractor={(item) => item.id}
                                        renderItem={({ item, index }) => {
                                            if (index == IPFormComp_Index) {
                                                return (
                                                    <IPFormComp
                                                        badWords={badWords}
                                                        suggestion={suggestion}
                                                        keyboardScrollViewRef={KeyboardScrollViewRef}
                                                        seIsAllIPFilledUp={(val) => seIsAllIPFilledUp(val)}
                                                        patientDetail={{ name: ipFormValues[ipFormKeys.patient]?.name }}
                                                        item={item}
                                                        category={ipFormValues.category}
                                                        length={ipFormValues.subcategory.length}
                                                        index={index}
                                                        setTitleAndFunctionForIP={(payload) => {
                                                            setFormHeaderFunctionAndTitleForIP({ ...formHeaderFunctionAndTitleForIP, ...payload })
                                                        }}
                                                        setViewDecider={(value) => { setViewDecider(value) }}
                                                        setIPFormCompIndex={(value) => { setIPFormComp_Index(value) }}
                                                        setIpForm={(obj) => {
                                                            // console.log('obj==================', JSON.stringify(ipFormValues.subcategory))
                                                            let tempValue = { ...ipFormValues[ipFormKeys.subcategory][index] }
                                                            tempValue['ipForm'] = { ...obj }
                                                            let tempSubCategory = ipFormValues[ipFormKeys.subcategory]
                                                            tempSubCategory[index] = tempValue
                                                            setIPFormValues({
                                                                ...ipFormValues,
                                                                [ipFormKeys.subcategory]: [...tempSubCategory],
                                                            });
                                                        }}
                                                        viewDecider={viewDecider}
                                                        isEditable={isEditable} />
                                                )
                                            }
                                            else {
                                                return null;
                                            }
                                        }}
                                    />
                                    : viewDecider == 5
                                        ?
                                        <OverallGoalsComp
                                            badWords={badWords}
                                            suggestion={suggestion}
                                            overallGoalValues={overallGoalValues}
                                            setOverallGoalValues={setOverallGoalValues}
                                            viewDecider={viewDecider}
                                            setViewDecider={(value) => { setViewDecider(value) }}
                                            onSave={() => {
                                                saveImplementationPlan()
                                            }}
                                        />
                                        : viewDecider == 6
                                            ?
                                            <RelatedFactorsComp
                                                badWords={badWords}
                                                suggestion={suggestion}
                                                relatedFactorsValues={relatedFactorsValues}
                                                setRelatedFactorsValues={setRelatedFactorsValues}
                                                viewDecider={viewDecider}
                                                setViewDecider={(value) => { setViewDecider(value) }}
                                                onSave={() => {
                                                    saveImplementationPlan()
                                                }}
                                            />
                                            : viewDecider == 7
                                                ?
                                                <TreatmentAndWorkingComp
                                                    badWords={badWords}
                                                    suggestion={suggestion}
                                                    treatmentAndWorkingValues={treatmentAndWorkingValues}
                                                    setTreatmentAndWorkingValues={setTreatmentAndWorkingValues}
                                                    viewDecider={viewDecider}
                                                    setViewDecider={(value) => { setViewDecider(value) }}
                                                    onSave={() => {
                                                        saveImplementationPlan()
                                                    }}
                                                />
                                                : viewDecider == 8
                                                    ? <View style={{
                                                        flex: 1,
                                                        paddingHorizontal: Constants.globalPaddingHorizontal
                                                    }}>

                                                        <UploadedFileViewer
                                                            isLoading={uploadingFile}
                                                            data={ipFormValues.documents}
                                                            setNewData={(newArr) => {
                                                                handleInputChange(ipForm, newArr, ipFormKeys.documents)
                                                            }}
                                                        />

                                                        {/* UPLOAD */}
                                                        <TouchableOpacity
                                                            onPress={() => {
                                                                setActionSheetDecide(ipFormKeys.attachment)
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

                                                        {/* view */}
                                                        {/* <CustomButton
                                                        numberOfLines={2}
                                                        style={{
                                                            ...styles.nextButton, marginVertical: 0, marginTop: Constants.formFieldTopMargin,
                                                            backgroundColor: Colors.primary,
                                                        }}
                                                        isLoading={uploadingFile}
                                                        onPress={async () => {
                                                            if (ipFormValues.attachment?.uploaded_doc_url) {
                                                                if (ipFormValues.attachment?.type?.includes('image')) {
                                                                    setIsModalVisible(true)
                                                                }
                                                                else {
                                                                    let canOpenURL = await Linking.canOpenURL(ipFormValues.attachment?.uploaded_doc_url)
                                                                    // console.log('canOpenURL', canOpenURL)
                                                                    if (canOpenURL)
                                                                        Linking.openURL(ipFormValues.attachment?.uploaded_doc_url);
                                                                    else {
                                                                        Alert.showToast(messages.message_url_can_not_open)
                                                                    }
                                                                }
                                                            }
                                                            else {
                                                                Alert.showToast(messages.message_choose_document_first)
                                                            }
                                                        }} title={labels["view"]}
                                                        /> */}

                                                        <CustomButton
                                                            style={{
                                                                ...styles.nextButton, marginVertical: 0, marginTop: Constants.formFieldTopMargin,
                                                                backgroundColor: Colors.primary,
                                                            }}
                                                            isLoading={uploadingFile}
                                                            onPress={() => {
                                                                // console.log("ipFormValues==========", JSON.stringify(ipFormValues))
                                                                saveImplementationPlan()
                                                            }} title={labels["save"]} />

                                                        <CustomButton
                                                            style={{
                                                                ...styles.nextButton, marginVertical: 0, marginTop: Constants.formFieldTopMargin,
                                                                backgroundColor: Colors.primary,
                                                            }}
                                                            isLoading={uploadingFile}
                                                            onPress={() => {
                                                                setViewDecider(9)
                                                            }} title={labels["next"]} />
                                                    </View>
                                                    :
                                                    viewDecider == 9
                                                        ?
                                                        <View style={{ paddingHorizontal: Constants.globalPaddingHorizontal }}>
                                                            <View style={{ marginTop: Constants.formFieldTopMargin, flexDirection: "row", alignItems: "center", justifyContent: "space-between", }}>
                                                                <Text style={{ fontFamily: Assets.fonts.semiBold, fontSize: getProportionalFontSize(14), color: Colors.primary }}>{labels["by-manual"]}</Text>
                                                                <RadioButton
                                                                    // disabled={ipFormValues.is_manually || uploadingFile ? true : false}
                                                                    value="manually"
                                                                    color={Colors.primary}
                                                                    status={ipFormValues.signing_method == "manually" ? 'checked' : 'unchecked'}
                                                                    onPress={() => {
                                                                        handleInputChange(ipForm, 'manually', ipFormKeys.signing_method);
                                                                    }}
                                                                />
                                                            </View>
                                                            <View style={{ marginTop: Constants.formFieldTopMargin, flexDirection: "row", alignItems: "center", justifyContent: "space-between", }}>
                                                                <Text style={{ fontFamily: Assets.fonts.semiBold, fontSize: getProportionalFontSize(14), color: Colors.primary }}>{labels["by-bank-id"]}</Text>
                                                                <RadioButton
                                                                    // disabled={ipFormValues.is_manually || uploadingFile ? true : false}
                                                                    value="bank_id"
                                                                    color={Colors.primary}
                                                                    status={ipFormValues.signing_method == "bank_id" ? 'checked' : 'unchecked'}
                                                                    onPress={() => {
                                                                        if (ipFormValues.signing_method != "bank_id") {
                                                                            Alert.showAlert(Constants.warning, labels.bank_id_personal_number_msg)
                                                                        }
                                                                        handleInputChange(ipForm, "bank_id", ipFormKeys.signing_method);
                                                                    }}
                                                                />
                                                            </View>
                                                            <View style={{ marginTop: Constants.formFieldTopMargin, flexDirection: "row", alignItems: "center", justifyContent: "space-between", }}>
                                                                <Text style={{ fontFamily: Assets.fonts.semiBold, fontSize: getProportionalFontSize(14), color: Colors.primary }}>{labels["by-digital-signature"]}</Text>
                                                                <RadioButton
                                                                    // disabled={ipFormValues.is_manually || uploadingFile ? true : false}
                                                                    value="digi_signature"
                                                                    color={Colors.primary}
                                                                    status={ipFormValues.signing_method == "digi_signature" ? 'checked' : 'unchecked'}
                                                                    onPress={() => {
                                                                        handleInputChange(ipForm, 'digi_signature', ipFormKeys.signing_method);

                                                                    }}
                                                                />
                                                            </View>

                                                            <Text style={styles.impMessageText}>{labels["visible-creating-IP-msg"]}</Text>

                                                            <FlatList
                                                                data={personList}
                                                                keyExtractor={(item, index) => '' + index}
                                                                //ListEmptyComponent={<Text style={{ textAlign: "center", fontSize: getProportionalFontSize(16), fontFamily: Assets.fonts.boldItalic }}>{labels.no_persons_found}</Text>}
                                                                // keyExtractor={(item) => item.id}
                                                                ListFooterComponent={() => {
                                                                    return (
                                                                        <CustomButton
                                                                            style={{
                                                                                ...styles.nextButton,
                                                                                backgroundColor: Colors.primary,
                                                                                marginVertical: 0,
                                                                                backgroundColor: Colors.white,
                                                                                borderWidth: 1,
                                                                                borderColor: Colors.primary
                                                                            }}
                                                                            isLoading={uploadingFile}
                                                                            titleStyle={{ color: Colors.primary }}
                                                                            onPress={() => {
                                                                                setViewDecider(2)
                                                                            }} title={labels["add-persons"]}
                                                                        />
                                                                    )
                                                                }}
                                                                contentContainerStyle={{ marginTop: Constants.formFieldTopMargin }}
                                                                renderItem={({ item, index }) => {
                                                                    if (!item.is_presented)
                                                                        return null;
                                                                    if (ipFormValues.signing_method == "bank_id" && !item.personal_number)
                                                                        return null;
                                                                    return (
                                                                        <View style={styles.personCard}>
                                                                            <View style={{ width: "80%" }}>
                                                                                <Text numberOfLines={1} style={{ fontFamily: Assets.fonts.bold, fontSize: getProportionalFontSize(14) }}>{item.name}</Text>
                                                                                <View style={{ flexDirection: "row", alignItems: "center", width: "100%" }}>
                                                                                    <Icon name="mail" color={Colors.primary} size={25} />
                                                                                    <Text numberOfLines={1} style={{ marginStart: 5, fontFamily: Assets.fonts.boldItalic, fontSize: getProportionalFontSize(13) }}>{item.email}</Text>
                                                                                </View>
                                                                            </View>
                                                                            <Checkbox
                                                                                color={Colors.primary}
                                                                                status={item.selected_for_approval ? 'checked' : "unchecked"}
                                                                                onPress={() => {
                                                                                    item.selected_for_approval = !item.selected_for_approval;
                                                                                    let tempPersonList = [...personList]
                                                                                    tempPersonList[index] = item
                                                                                    setPersonList(tempPersonList)
                                                                                }}
                                                                            />
                                                                        </View>
                                                                    )
                                                                }}
                                                            />

                                                            <CustomButton
                                                                style={{
                                                                    ...styles.nextButton, marginVertical: 0, marginTop: Constants.formFieldTopMargin,
                                                                    backgroundColor: Colors.primary,
                                                                }}
                                                                isLoading={uploadingFile}
                                                                onPress={() => {
                                                                    Keyboard.dismiss()
                                                                    if (requestForApprovalValidation())
                                                                        saveImplementationPlan(true)
                                                                }} title={labels["send"]} />

                                                            {
                                                                props?.route?.params?.itemId
                                                                    ? <CustomButton
                                                                        style={{
                                                                            ...styles.nextButton, marginVertical: 0, marginTop: Constants.formFieldTopMargin,
                                                                            backgroundColor: Colors.primary,
                                                                        }}
                                                                        isLoading={uploadingFile}
                                                                        onPress={() => {
                                                                            if (requestForApprovalValidation())
                                                                                requestForApprovalAPI(IPFullDetail, null, labels.successfully_sent_request)
                                                                        }} title={labels["send-request"]} />
                                                                    : null
                                                            }

                                                            <CustomButton
                                                                style={{
                                                                    ...styles.nextButton, marginVertical: 0, marginTop: Constants.formFieldTopMargin,
                                                                    backgroundColor: Colors.primary,
                                                                }}
                                                                isLoading={uploadingFile}
                                                                onPress={() => {
                                                                    Keyboard.dismiss()
                                                                    // console.log("ipFormValues==========", JSON.stringify(ipFormValues))
                                                                    // let badWordString = getBadWordString();
                                                                    // //console.log('validation success')
                                                                    // if (badWordString) {
                                                                    //     Alert.showBasicDoubleAlertForBoth(badWordString, () => {

                                                                    //         // addOrEditPatientAPI(IgnorePersons, personList);
                                                                    //     }, null, messages.message_bad_word_alert)
                                                                    // }
                                                                    // else
                                                                    //     alert("badWordfound")
                                                                    saveImplementationPlan()
                                                                }} title={labels["save-and-skip"]} />
                                                        </View>
                                                        : null
                    }
                    <ActionSheet ref={actionSheetRef} containerStyle={{ backgroundColor: Colors.backgroundColor, }}>
                        {
                            actionSheetDecide == ipFormKeys.attachment
                                ? <ImagePickerActionSheetComp
                                    chooseMultiple={true}
                                    giveChoice={true}
                                    closeSheet={closeActionSheet}
                                    responseHandler={(res) => {
                                        imageOrDocumentResponseHandler(res)
                                    }}
                                />
                                : <ActionSheetComp
                                    title={actionSheetDecide == ipFormKeys.patient ? labels["please-select-patient"] : labels[actionSheetDecide]}
                                    closeActionSheet={closeActionSheet}
                                    keyToShowData="name"
                                    keyToCompareData="id"

                                    multiSelect={(actionSheetDecide == ipFormKeys.subcategory && !routeParams?.itemId) ? true : false}
                                    APIDetails={actionSheetDecide == ipFormKeys.patient ? patientAS
                                        : actionSheetDecide == ipFormKeys.category ? categoryAS
                                            : actionSheetDecide == ipFormKeys.subcategory ? subCategoryAS
                                                : actionSheetDecide == personFormKeys.country ? countryAS
                                                    : null}
                                    changeAPIDetails={(payload) => {
                                        if (actionSheetDecide == ipFormKeys.patient) {
                                            setPatientAS(getActionSheetAPIDetail({ ...patientAS, ...payload }))
                                        }
                                        else if (actionSheetDecide == ipFormKeys.category) {
                                            setCategoryAS(getActionSheetAPIDetail({ ...categoryAS, ...payload }))
                                        }
                                        else if (actionSheetDecide == ipFormKeys.subcategory) {
                                            setSubCategoryAS(getActionSheetAPIDetail({ ...subCategoryAS, ...payload }))
                                        }
                                        else if (actionSheetDecide == ipFormKeys.subcategory) {
                                            setSubCategoryAS(getActionSheetAPIDetail({ ...subCategoryAS, ...payload }))
                                        }

                                        else if (actionSheetDecide == personForm.country) {
                                            setSubCategoryAS(getActionSheetAPIDetail({ ...countryAS, ...payload }))
                                        }
                                    }}
                                    onPressItem={(item) => {
                                        // console.log('item', item)
                                        if (actionSheetDecide == ipFormKeys.patient) {
                                            handleInputChange(ipForm, item, ipFormKeys.patient)
                                            //setCategoryType(item)
                                            removeErrorTextForInputThatUserIsTyping(ipForm, ipFormKeys.patient)
                                            getPatientsPersons(item.id);
                                        }
                                        else if (actionSheetDecide == ipFormKeys.category) {
                                            handleInputChange(ipForm, item, ipFormKeys.category)
                                            removeErrorTextForInputThatUserIsTyping(ipForm, ipFormKeys.category)
                                            setSubCategoryAS(getActionSheetAPIDetail({
                                                url: Constants.apiEndPoints.categoryChildList, params: { parent_id: item?.id }, debugMsg: "sub-category", token: UserLogin.access_token,
                                                selectedData: ipFormValues.subcategory ? ipFormValues[ipFormKeys.subcategory] : []
                                            }))
                                        }
                                        else if (actionSheetDecide == ipFormKeys.subcategory) {
                                            handleInputChange(ipForm, Array.isArray(item) ? item : [item], ipFormKeys.subcategory)
                                            removeErrorTextForInputThatUserIsTyping(ipForm, ipFormKeys.subcategory)
                                        }
                                        else if (actionSheetDecide == personFormKeys.country) {
                                            handleInputChange(item, personFormKeys.country)
                                            removeErrorTextForInputThatUserIsTyping(personFormKeys.country)
                                        }
                                    }}
                                />}
                    </ActionSheet>
                    <Portal>
                        <Modal
                            animationType="slide"
                            transparent={true}
                            style={{}}
                            visible={isModalVisible}
                            onRequestClose={onRequestClose}
                            onDismiss={onRequestClose}
                        >
                            <View style={styles.modalMainView}>
                                <View style={styles.innerViewforModel}>
                                    <View style={{
                                        width: "100%",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        // marginTop: -10
                                    }}>
                                        <LottieView
                                            source={require('../Assets/images/doneBlue.json')}
                                            autoPlay
                                            loop={false}
                                            style={{
                                                width: "20%",
                                            }}
                                        />
                                        <Text style={{ fontFamily: Assets.fonts.semiBold, fontSize: getProportionalFontSize(16), color: Colors.primary }}>{labels["ip-created"]}</Text>
                                        <Text style={{ fontFamily: Assets.fonts.regular, fontSize: getProportionalFontSize(11), color: Colors.primary }}>{labels["select-ip"]}</Text>
                                    </View>

                                    <FlatList
                                        data={ipResponseAfterAdding}
                                        contentContainerStyle={{ marginTop: 15 }}
                                        renderItem={({ item, index }) => {
                                            return (
                                                <TouchableOpacity
                                                    onPress={() => {
                                                        props.navigation.navigate('ActivityStack',
                                                            { screen: 'AddActivity', params: { ipID: item.id, } })
                                                    }}
                                                    style={{
                                                        width: "100%",
                                                        paddingVertical: 5
                                                    }}>
                                                    <Text style={{ fontFamily: Assets.fonts.medium, fontSize: getProportionalFontSize(14), color: Colors.black, }}>{index + 1}) &nbsp;{item.title}</Text>
                                                </TouchableOpacity>
                                            )
                                        }}

                                    />


                                </View>
                            </View>
                        </Modal>
                    </Portal>
                </KeyboardAwareScrollView>
                {/* FAB Button */}
                {/* <Provider>
                    <Portal> */}
                <FAB.Group
                    style={{}}
                    fabStyle={{ backgroundColor: Colors.primary, }}
                    open={openFAB}
                    icon={openFAB ? 'close' : 'debug-step-over'}
                    color={Colors.white}
                    actions={fabActions}
                    onStateChange={(open) => {
                        if (openFAB)
                            setOpenFAB(false)
                        else
                            setOpenFAB(true)
                    }}
                    onPress={() => {
                        // if (open) {
                        //     console.log("close btn group")
                        // }
                    }}
                />
                {/* </Portal>
                </Provider> */}
            </View>
        </BaseContainer >
    )
}

const styles = StyleSheet.create({
    modalMainView: { backgroundColor: 'transparent', justifyContent: "center", alignItems: "center", paddingHorizontal: 16 },
    innerViewforModel: {
        width: '100%', minHeight: 150, backgroundColor: Colors.backgroundColor, paddingBottom: Constants.globalPaddingHorizontal * 2, paddingHorizontal: 16, borderRadius: 20,
    },
    innerView: { width: '100%', minHeight: 300, backgroundColor: Colors.backgroundColor, paddingVertical: 15, paddingHorizontal: 16, borderRadius: 20, alignItems: "center" },
    impMessageText: {
        fontSize: getProportionalFontSize(10),
        marginTop: 5,
        color: Colors.gray,
        fontFamily: Assets.fonts.bold,
    },
    buttonView: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-evenly'
    },
    headingText: {
        fontSize: getProportionalFontSize(24),
        // marginTop: 10,
        color: Colors.primary,
        fontFamily: Assets.fonts.bold,
        // marginLeft: 16,
        // width: '80%',
        borderWidth: 0,
        //justifyContent: 'center'
    },
    mainView: {
        flex: 1,
        paddingHorizontal: Constants.globalPaddingHorizontal
    },
    imageLogin: { width: '100%', height: 200, marginTop: 30 },
    formHeaderContainer: {
        flexDirection: 'row',
        width: "100%",
        borderWidth: 0,
        alignItems: 'center',
        justifyContent: 'space-between',
        alignContent: 'center',
        height: 40,
        paddingHorizontal: Constants.globalPaddingHorizontal
    },

    leftView: {
        width: '12%',
        height: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        alignContent: 'center',
        borderWidth: 0,
    },
    rightView: {
        width: '12%',
        height: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        alignContent: 'center',
        borderWidth: 0,
    },
    centerView: {
        width: '75%',
        height: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        alignContent: 'center',
        borderWidth: 0,
    },

    welcomeText: {
        fontSize: getProportionalFontSize(13),
        color: Colors.black,
        fontFamily: Assets.fonts.bold
    },
    InputValidationView: {
        backgroundColor: Colors.transparent,
        //borderColor: 'red',
        marginTop: Constants.formFieldTopMargin,
        //borderRadius: 10,
        //color: 'red'
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
    normalText: {
        color: Colors.white,
        fontFamily: Assets.fonts.bold,
        fontSize: getProportionalFontSize(15)
    },
    inputStyle: {
        fontSize: getProportionalFontSize(15),
        borderColor: Colors.borderColor,
        backgroundColor: Colors.white
    },
    checkBoxView: { flexDirection: 'row', alignItems: 'center', marginTop: 30 },
    saveAsTemplate: { fontSize: getProportionalFontSize(13), fontFamily: Assets.fonts.regular },
    personCard: {
        width: "100%",
        minHeight: 80,
        paddingHorizontal: Constants.globalPaddingHorizontal,
        paddingVertical: Constants.globalPaddingVetical,
        // flexDirection: 'row',
        // alignItems: 'center',
        // justifyContent: 'space-between',
        shadowOffset: { width: 3, height: 3, },
        shadowOpacity: 10,
        elevation: 15,
        shadowColor: Platform.OS == "ios" ? Colors.shadowColorIosDefault : Colors.shadowColorAndroidDefault,
        shadowRadius: 10,
        marginBottom: Constants.listItemBottomMargin,
        backgroundColor: 'white',
        borderRadius: 15,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between"
    }
});
