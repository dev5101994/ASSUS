import React, { useEffect, useState } from 'react';
import {
    StyleSheet,
    Text, View, SafeAreaView, Image, TouchableOpacity, ScrollView, Keyboard
} from 'react-native';
import Colors from '../Constants/Colors';
import Assets from '../Assets/Assets'
import { getProportionalFontSize, checkEmailFormat, formatDateWithTime, formatDate, formatDateByFormat, formatTime, checkMobileNumberFormat, getActionSheetAPIDetail, ReplaceAll, formatDateForAPI, isDocOrImage } from '../Services/CommonMethods';
import InputValidation from '../Components/InputValidation';
// import BouncyCheckbox from "react-native-bouncy-checkbox";
// import { CommonActions } from '@react-navigation/native';
import APIService from '../Services/APIService'
import Constants from '../Constants/Constants'
import ProgressLoader from '../Components/ProgressLoader'
import { useSelector, useDispatch } from 'react-redux'
// import { UserLoginAction } from '../Redux/Actions/UserLoginAction'
// import AsyncStorageService from '../Services/AsyncStorageService';
import { TextInput } from 'react-native-paper';
import BaseContainer from '../Components/BaseContainer'
import CustomButton from '../Components/CustomButton'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import DatePicker from 'react-native-date-picker';
import ActionSheet from 'react-native-actions-sheet';
import ActionSheetComp from '../Components/ActionSheetComp';
import Alert from '../Components/Alert';
import MSDataViewer from '../Components/MSDataViewer'
import AddressInputComp from '../Components/AddressInputComp';
import FormSubHeader from '../Components/FormSubHeader';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import { Modal, Portal, RadioButton, } from 'react-native-paper';
import ColorPicker from 'react-native-wheel-color-picker'
import UploadedFileViewer from '../Components/UploadedFileViewer';
import Icon from 'react-native-vector-icons/Ionicons';
import CommonAPIFunctions from '../Services/CommonAPIFunctions';

const attachment = "attachment";

const basicDetails = "basicDetails";
const address = "address";
const zipcode = "zipcode"
let picker = null;

export default AddBranch = (props) => {

    const formFieldTopMargin = Constants.formFieldTopMargin;

    // REDUX hooks
    const dispatch = useDispatch();
    const isInternetActive = useSelector(state => state.IsInternetActive);
    const UserLogin = useSelector(state => state.User.UserLogin);
    const labels = useSelector(state => state.Labels);
    const messages = useSelector(state => state.Labels);
    //hooks
    const actionSheetRef = React.useRef();

    // Immutable Variables
    const formFieldsKeys = {
        "company_types": "company_types",
        "name": "name",
        "email": "email",
        "password": "password",
        "confirm-password": "confirm-password",
        "contact_number": "contact_number",
        "organization_number": "organization_number",
        "country_id": "country_id",
        "city": "city",
        "postal_area": "postal_area",
        "zipcode": "zipcode",
        "full_address": "full_address",
        "licence_key": "licence_key",
        "licence_end_date": "licence_end_date",
        "is_substitute": "is_substitute",
        "is_regular": "is_regular",
        "is_seasonal": "is_seasonal",
        "joining_date": "joining_date",
        "establishment_date": "establishment_date",
        "user_color": "user_color",
        "is_file_required": "is_file_required",
        "documents": "documents",
        "attachment": "attachment",
        "establishment_year": "establishment_year",
        "contact_person_name": "contact_person_name",
        "contact_person_number": "contact_person_number"
    }

    const initialValidationObj = {
        [formFieldsKeys.name]: {
            invalid: false,
            title: labels.branch_name_required
        },
        [formFieldsKeys.company_types]: {
            invalid: false,
            title: labels.company_types_required
        },
        [formFieldsKeys.email]: {
            invalid: false,
            title: labels.invalid_email
        },
        [formFieldsKeys.contact_number]: {
            invalid: false,
            title: labels.contact_number_required
        },
        [formFieldsKeys.contact_person_name]: {
            invalid: false,
            title: labels.contact_person_name_required
        },
        [formFieldsKeys.contact_person_number]: {
            invalid: false,
            title: labels.contact_person_number_required
        },
        // [formFieldsKeys.postal_area]: {
        //     invalid: false,
        //     title: labels.zipcode
        // },

        // [formFieldsKeys.establishment_date]: {
        //     invalid: false,
        //     title: labels.establishment_date_required
        // },


    }
    const initialAddressValidationObj = {
        [formFieldsKeys.full_address]: {
            invalid: false,
            title: labels.full_address_required
        },
        [formFieldsKeys.city]: {
            invalid: false,
            title: labels.branch_name_required
        },

        [formFieldsKeys.zipcode]: {
            invalid: false,
            title: labels.branch_name_required
        },

        [formFieldsKeys.postal_area]: {
            invalid: false,
            title: labels.branch_name_required
        },
    }

    const initialFormFields = {
        "company_types": [],
        "name": "",
        "email": "",
        "password": "12345678",
        "confirm-password": "12345678",
        "contact_number": "",
        "organization_number": "",
        "country_id": "209",
        "city": "",
        "postal_area": "",
        "zipcode": "",
        "full_address": "",
        "licence_key": "",
        "licence_end_date": "",
        "is_substitute": false,
        "is_regular": false,
        "is_seasonal": false,
        "joining_date": "",
        "establishment_date": "",
        "establishment_year": "",
        "user_color": "",
        "is_file_required": false,
        "documents": [],
        "contact_person_name": "",
        "contact_person_number": ""
    }

    // useState hooks
    const [itemId, setItemId] = React.useState('')
    const [isItemFound, setIsItemFound] = React.useState(false)
    const [isLoading, setIsLoading] = React.useState(false);
    const [formFields, setFormFields] = React.useState({ ...initialFormFields });
    const [validationObj, setValidationObj] = React.useState({ ...initialValidationObj });
    const [addressValidationObj, setAddressValidationObj] = React.useState({ ...initialAddressValidationObj });
    const [dateObject, setDateObject] = React.useState({ isVisible: false, pickerKey: null, mode: Constants.DatePickerModes.date_mode });
    const [actionSheetDecide, setActionSheetDecide] = React.useState('');
    const [viewDecider, setViewDecider] = React.useState(1);
    const [isModalVisible, setIsModalVisible] = React.useState(false);
    const [uploadingFile, setUploadingFile] = React.useState(false);
    const [companyTypeAS, setCompanyTypeAS] = React.useState(getActionSheetAPIDetail({
        url: Constants.apiEndPoints.companyTypeList, debugMsg: "companyTypeList", token: UserLogin.access_token, perPage: Constants.perPage,
        selectedData: formFields[formFieldsKeys.company_types] ? formFields[formFieldsKeys.company_types] : []
    }));


    // BadWords & Suggetion

    // const [suggestion, setSuggestion] = React.useState([]);
    const [badWords, setBadWords] = React.useState([]);

    const [full_addressSuggestion, setFull_addressSuggestion] = React.useState([]);

    // useEffect hooks
    React.useEffect(() => {
        // CommonAPIFunctions.getSuggestions(UserLogin.access_token, (data) => { setSuggestion(data) });
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

            if (formFields?.name?.toLowerCase()?.includes(currBadWord)
                || formFields?.full_address?.toLowerCase()?.includes(currBadWord)
                || formFields?.postal_area?.toLowerCase()?.includes(currBadWord)
                || formFields?.city?.toLowerCase()?.includes(currBadWord)

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

    // Helper Methods
    const removeErrorTextForInputThatUserIsTyping = (uniqueKey) => {
        let tempValidationObj = { ...validationObj }
        tempValidationObj[uniqueKey] = initialValidationObj[uniqueKey];
        setValidationObj(tempValidationObj);
    }

    const handleInputChange = (key, value) => {
        setFormFields({ ...formFields, [key]: value })
    }

    const onConfirmDatePicker = (date) => {
        setDateObject({ ...dateObject, isVisible: false })
        removeErrorTextForInputThatUserIsTyping(dateObject.pickerKey);
        // console.log('date : ', date)
        let value = '';
        if (dateObject.mode == Constants.DatePickerModes.date_mode)
            handleInputChange(dateObject.pickerKey, formatDateByFormat(date, "yyyy-MM-DD"))
        else if (dateObject.mode == Constants.DatePickerModes.time_mode)
            handleInputChange(dateObject.pickerKey, formatTime(date))
        else
            handleInputChange(dateObject.pickerKey, formatDateWithTime(date))
    }

    const onCancelDatePicker = () => {
        setDateObject({ ...dateObject, isVisible: false })
    }

    const validation = (formtype) => {
        if (formtype == basicDetails) {
            let validationObjTemp = { ...initialValidationObj };
            let isValid = true;
            for (const [key, value] of Object.entries(validationObjTemp)) {
                if (key == formFieldsKeys.email) {
                    if (!formFields[key]) {
                        // console.log('1', key)
                        value['invalid'] = true;
                        value['title'] = labels[key + '_required']
                        isValid = false;
                        break;
                    }
                    if (!checkEmailFormat(formFields[key])) {
                        // console.log('1', key)
                        value['invalid'] = true;
                        value['title'] = labels["invalid_email"]
                        isValid = false;
                        break;
                    }
                }
                else if (key == formFieldsKeys.contact_number) {
                    if (!formFields[key]) {
                        // console.log('2', key)
                        value['invalid'] = true;
                        value['title'] = labels[key + '_required']
                        isValid = false;
                        break;
                    }
                    else if (!checkMobileNumberFormat(ReplaceAll(formFields[key], ' ', ''))) {
                        // console.log('3', key)
                        value['invalid'] = true;
                        value['title'] = labels["enter_valid_contact_number"]
                        isValid = false;
                        break;
                    }
                }
                else if (key == formFieldsKeys.joining_date) {
                    if (!formFields[key]) {
                        // console.log('4', key)
                        value['invalid'] = true;
                        value['title'] = labels[key + '_required']
                        isValid = false;
                        break;
                    }
                }
                else if (key == formFieldsKeys.company_types) {
                    if (!formFields[key] || formFields[key].length <= 0) {
                        // console.log('5', key)
                        value['invalid'] = true;
                        value['title'] = labels[key + '_required']
                        isValid = false;
                        break;
                    }
                }

                else if (((typeof (formFields[key]) == 'object' && !formFields[key]?.name)
                    || (typeof (formFields[key]) == 'string' && !formFields[key]))) {
                    // console.log('6', key)
                    value['invalid'] = true;
                    value['title'] = labels[key + '_required']
                    isValid = false;
                    break;
                }
            }
            setValidationObj({ ...validationObjTemp });
            return isValid;
        }
        else if (formtype == address) {
            let validationObjTemp = { ...initialAddressValidationObj };
            let isValid = true;
            for (const [key, value] of Object.entries(validationObjTemp)) {
                // console.log("hey-user", key)
                if (((typeof (formFields[key]) == 'object' && !formFields[key]?.name)
                    || (typeof (formFields[key]) == 'string' && !formFields[key]))) {
                    // console.log('3', key)
                    value['invalid'] = true;
                    value['title'] = labels[key + '_required']
                    isValid = false;
                    break;
                }

                else if (key == formFieldsKeys.zipcode) {
                    if (formFields[key] && formFields[key].length < 5) {
                        value['invalid'] = true;
                        value['title'] = "invailid zip code"
                        isValid = false;
                        break;
                    }
                }
                else if (key == formFieldsKeys.postal_area) {
                    if (formFields[key] && formFields[key].length < 5) {
                        value['invalid'] = true;
                        value['title'] = "invailid postal Area"
                        isValid = false;
                        break;
                    }
                }
            }
            setAddressValidationObj({ ...validationObjTemp });
            return isValid;
        }


    }


    // useEffect hooks
    React.useEffect(() => {
        if (props?.route?.params?.itemId) {
            // console.log('item Id FOund')
            setIsItemFound(true)
            setItemId(props?.route?.params?.itemId)
            getBranchDetails(props?.route?.params?.itemId)
        } else {
            setIsLoading(false);
        }

    }, [])

    /**
     * getBranchDetails
     * @param {*} itemId 
     */
    const getBranchDetails = async (itemId) => {
        setIsLoading(true);
        // let params = {
        // }
        //console.log("itemId", itemId)
        let url = Constants.apiEndPoints.userView + "/" + itemId;
        // console.log("url", url);
        let response = await APIService.getData(url, UserLogin.access_token, null, "BranchAPI");
        if (!response.errorMsg) {
            // console.log("payload getBranchDetails", response.data.payload);
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
            setFormFields({
                ...response.data.payload,
                "is_substitute": response.data.payload.is_substitute == "0" ? false : true,
                "is_regular": response.data.payload.is_regular == "0" ? false : true,
                "is_seasonal": response.data.payload.is_seasonal == "0" ? false : true,
                "is_file_required": response.data.payload.is_file_required == "0" ? false : true,
                "documents": tempDocuments
            })
            setCompanyTypeAS({ ...companyTypeAS, selectedData: response.data.payload.company_types })
            //console.log("data", response.data.success);
            setIsLoading(false);
        }
        else {
            setIsLoading(false);
            Alert.showAlert(Constants.danger, response.errorMsg);
        }
    }


    const addBranch = async () => {
        // let params = { ...formFields, company_type_id: formFields.company_type?.id }

        addOrEditAPI(itemId ?? null)

    }
    // API methods
    const addOrEditAPI = async (branchId) => {
        let tempCompanyType = []
        formFields.company_types.map((obj) => {
            tempCompanyType.push('' + obj.id)
        })
        let tempDocuments = null;
        if (formFields.documents?.length > 0) {
            tempDocuments = [];
            formFields.documents.map((obj) => {
                let tempObj = {
                    file_name: obj.uploading_file_name,
                    file_url: obj.file_name
                }
                tempDocuments.push(tempObj);
            })
        }
        let params = {
            // "user_type_id": "11",
            // "role_id": "11",
            "company_type_id": tempCompanyType,  //
            "name": formFields[formFieldsKeys.name],  //
            "email": formFields[formFieldsKeys.email],//
            "password": formFields[formFieldsKeys.password] ? formFields[formFieldsKeys.password] : "12345678",//
            "confirm-password": formFields[formFieldsKeys.password] ? formFields[formFieldsKeys.password] : "12345678",  //
            "contact_number": ReplaceAll(formFields[formFieldsKeys.contact_number], ' ', ''),
            "organization_number": formFields[formFieldsKeys.organization_number],//
            "country_id": 209,
            "full_address": formFields[formFieldsKeys.full_address],//
            "establishment_date": formFields?.[formFieldsKeys?.establishment_date] ?? null,//
            "is_file_required": formFields[formFieldsKeys.file_required] ? "1" : "0",//
            "city": formFields[formFieldsKeys.city],//
            "postal_area": formFields[formFieldsKeys.postal_area],
            // "postal_code" :"",
            "zipcode": formFields[formFieldsKeys.zipcode],//
            "license_key": formFields[formFieldsKeys.licence_key],
            "license_end_date": formFields[formFieldsKeys.licence_end_date] ? formatDateForAPI(formFields[formFieldsKeys.licence_end_date]) : null,
            "is_substitute": formFields[formFieldsKeys.is_substitute] ? "1" : "0",//
            "is_regular": formFields[formFieldsKeys.is_regular] ? "1" : "0",//
            "is_seasonal": formFields[formFieldsKeys.is_seasonal] ? "1" : "0",//
            "joining_date": formFields[formFieldsKeys.joining_date] ? formatDateForAPI(formFields[formFieldsKeys.joining_date]) : null,
            "user_color": formFields[formFieldsKeys.user_color],//
            "documents": tempDocuments,
            "establishment_year": formFields[formFieldsKeys.establishment_year],
            // "license_key" :"5test56666",
            // "license_end_date" :"2020-12-12",
            "contact_person_name": formFields[formFieldsKeys.contact_person_name],
            "contact_person_number": formFields[formFieldsKeys.contact_person_number]
        }

        let url = Constants.apiEndPoints.addOrEditbranch;

        if (branchId) {
            url = url + '/' + branchId;
        }

        let response = {};
        // console.log('params=======>>>>>', JSON.stringify(params))
        // console.log('url=======>>>>>', url)
        // console.log('tempCompanyType', tempCompanyType)
        // return
        setIsLoading(true);
        if (branchId)
            response = await APIService.putData(url, params, UserLogin.access_token, null, "editbranchAPI");
        else
            response = await APIService.postData(url, params, UserLogin.access_token, null, "addbranchAPI");

        // console.log("branch api response", JSON.stringify(response))
        if (!response.errorMsg) {
            setIsLoading(false);
            // onRequestClose();
            // refreshAPI()
            Alert.showAlert(Constants.success, branchId ? labels.branch_edited_successfully : labels.branch_added_successfully, () => props.navigation.pop())

        }
        else {
            setIsLoading(false);
            Alert.showAlert(Constants.danger, response.errorMsg)
        }
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
                    obj['uploaded_doc_url'] = obj.file_name;
                    obj['uri'] = obj.file_name;
                    obj['type'] = obj.uploading_file_name;
                })
                let tempDocArr = [...formFields.documents];
                tempDocArr = tempDocArr.concat(uploaded_doc_arr)
                handleInputChange(formFieldsKeys.documents, tempDocArr)
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

                let tempDocArr = [...formFields.documents];
                tempDocArr = tempDocArr.concat(uploaded_doc_arr)
                handleInputChange(formFieldsKeys.documents, tempDocArr)
            }
        }
    }

    const closeActionSheet = () => {
        setActionSheetDecide('');
        actionSheetRef?.current?.setModalVisible();
    }

    // console.log('company_type---------', formFields.company_types)

    // Render view
    if (isLoading)
        return <ProgressLoader />

    return (
        <BaseContainer
            onPressLeftIcon={() => { props.navigation.pop() }}
            leftIcon="arrow-back"
            // leftIconSize={24}
            title={labels["branch"]}
            leftIconColor={Colors.primary}
        >
            <KeyboardAwareScrollView style={{ flex: 1 }} keyboardShouldPersistTaps="handled" >
                <FormSubHeader
                    leftIconName={
                        viewDecider == 1 ? null : "chevron-back-circle-outline"}
                    onPressLeftIcon={viewDecider == 2 ? () => { setViewDecider(1) } : viewDecider == 3 ? () => { setViewDecider(2) } : () => { }}
                    title={
                        viewDecider == 1 ? labels.basicDetails : viewDecider == 2 ? labels.addressDetails : viewDecider == 3 ? labels.documents : ""
                    }
                />

                <ActionSheet ref={actionSheetRef}>
                    {
                        actionSheetDecide == formFieldsKeys.attachment
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
                                keyToShowData="name"
                                keyToCompareData="id"

                                multiSelect={formFieldsKeys.company_types ? true : false}
                                APIDetails={actionSheetDecide == formFieldsKeys.company_types ? companyTypeAS : null}
                                changeAPIDetails={(payload) => {
                                    if (actionSheetDecide == formFieldsKeys.company_types) {
                                        setCompanyTypeAS(getActionSheetAPIDetail({ ...companyTypeAS, ...payload }))
                                    }
                                }}
                                onPressItem={(item) => {
                                    // console.log('item', item)
                                    if (actionSheetDecide == formFieldsKeys.company_types) {
                                        handleInputChange(formFieldsKeys.company_types, item)
                                        removeErrorTextForInputThatUserIsTyping(formFieldsKeys.company_types)
                                    }
                                }}
                            />
                    }
                </ActionSheet>
                <Portal>
                    <Modal
                        animationType="slide"
                        transparent={true}
                        style={{ justifyContent: "center", alignItems: 'center' }}
                        visible={isModalVisible}
                        onRequestClose={() => { setIsModalVisible(false); }}
                    >
                        <View style={{ padding: 20 }}>
                            <ColorPicker
                                ref={r => { picker = r }}
                                onColorChangeComplete={(user_color) => { handleInputChange(formFieldsKeys.user_color, user_color) }}
                                color={formFields.user_color ?? Colors.primary}
                                thumbSize={40}
                                sliderSize={40}
                                noSnap={true}
                                row={false}
                            />
                            <CustomButton
                                onPress={() => { setIsModalVisible(false); }}
                                title={labels["done"]}
                                style={{ marginTop: 20 }} />
                        </View>
                    </Modal>
                </Portal>

                {/* Main View */}
                {viewDecider == 1
                    ? <View style={styles.mainView}>

                        {/* branch Name */}
                        <InputValidation
                            uniqueKey={formFieldsKeys.name}
                            validationObj={validationObj}
                            value={formFields[formFieldsKeys.name]}
                            placeHolder={labels["branch-name"]}
                            onChangeText={(text) => {
                                removeErrorTextForInputThatUserIsTyping(formFieldsKeys.name);
                                handleInputChange(formFieldsKeys.name, text)
                            }}
                            style={{ marginTop: formFieldTopMargin }}
                            inputMainViewStyle={styles.InputValidationView}
                            inputStyle={styles.inputStyle}
                        />

                        {/* company type bar */}
                        <InputValidation
                            uniqueKey={formFieldsKeys.company_types}
                            validationObj={validationObj}
                            // value={formFields.company_types?.name}
                            iconRight='chevron-down'
                            iconColor={Colors.primary}
                            editable={false}
                            onPressIcon={() => {
                                setActionSheetDecide(formFieldsKeys.company_types);
                                //removeErrorTextForInputThatUserIsTyping(ipFormKeys.category);
                                actionSheetRef.current?.setModalVisible();
                            }}
                            placeHolder={labels["company-types"]}
                            style={{ marginTop: formFieldTopMargin }}
                            size={30}
                            inputMainViewStyle={styles.InputValidationView}
                            inputStyle={styles.inputStyle}
                        />

                        <MSDataViewer
                            data={formFields?.company_types ?? []}
                            setNewDataOnPressClose={(newArr) => {
                                setCompanyTypeAS({ ...companyTypeAS, selectedData: newArr });
                                handleInputChange(formFieldsKeys.company_types, newArr)
                            }}
                        />

                        {/* Email */}
                        <InputValidation
                            disabled={props?.route?.params?.itemId ? true : false}
                            editable={props?.route?.params?.itemId ? false : true}
                            uniqueKey={formFieldsKeys.email}
                            validationObj={validationObj}
                            value={formFields[formFieldsKeys.email]}
                            placeHolder={labels["Email"]}
                            onChangeText={(text) => {
                                setActionSheetDecide(formFieldsKeys.email);
                                removeErrorTextForInputThatUserIsTyping(formFieldsKeys.email);
                                handleInputChange(formFieldsKeys.email, text)
                            }}
                            style={{ marginTop: formFieldTopMargin }}
                            inputMainViewStyle={styles.InputValidationView}
                            inputStyle={styles.inputStyle}
                            keyboardType={"email-address"}
                        />

                        {/* Contact Number */}
                        <InputValidation
                            maskedInput={true}
                            mask={Constants.phone_number_format}
                            // maxLength={10}
                            uniqueKey={formFieldsKeys.contact_number}
                            validationObj={validationObj}
                            value={formFields[formFieldsKeys.contact_number]}
                            keyboardType={"number-pad"}
                            placeHolder={labels["contact-number"]}
                            onChangeText={(text) => {
                                removeErrorTextForInputThatUserIsTyping(formFieldsKeys.contact_number);
                                handleInputChange(formFieldsKeys.contact_number, text)
                            }}
                            style={{ marginTop: formFieldTopMargin }}
                            inputMainViewStyle={styles.InputValidationView}
                            inputStyle={styles.inputStyle}
                        />

                        {/* contact person Name */}
                        <InputValidation
                            uniqueKey={formFieldsKeys.contact_person_name}
                            validationObj={validationObj}
                            value={formFields[formFieldsKeys.contact_person_name]}
                            placeHolder={labels["contact-person-name"]}
                            onChangeText={(text) => {
                                removeErrorTextForInputThatUserIsTyping(formFieldsKeys.contact_person_name,);
                                handleInputChange(formFieldsKeys.contact_person_name, text)
                            }}
                            style={styles.InputValidationView}
                            inputStyle={styles.inputStyle}
                        />

                        {/* Contact person Number */}
                        <InputValidation
                            maskedInput={true}
                            mask={Constants.phone_number_format}
                            // maxLength={10}
                            uniqueKey={formFieldsKeys.contact_person_number}
                            validationObj={validationObj}
                            value={formFields[formFieldsKeys.contact_person_number]}
                            keyboardType={"number-pad"}
                            placeHolder={labels["contact-person-number"] ?? "contact-person-number"}
                            onChangeText={(text) => {
                                removeErrorTextForInputThatUserIsTyping(formFieldsKeys.contact_person_number);
                                handleInputChange(formFieldsKeys.contact_person_number, text)
                            }}
                            style={{ marginTop: formFieldTopMargin }}
                            inputMainViewStyle={styles.InputValidationView}
                            inputStyle={styles.inputStyle}
                        />

                        {/* organization number */}
                        {/* <InputValidation
                            uniqueKey={formFieldsKeys.organization_number}
                            validationObj={validationObj}
                            value={formFields[formFieldsKeys.organization_number]}
                            placeHolder={labels.organization_number}
                            onChangeText={(text) => {
                                removeErrorTextForInputThatUserIsTyping(formFieldsKeys.organization_number);
                                handleInputChange(formFieldsKeys.organization_number, text)
                            }}
                            style={{ marginTop: formFieldTopMargin }}
                            inputMainViewStyle={styles.InputValidationView}
                            inputStyle={styles.inputStyle}
                        /> */}

                        {/* license key */}
                        {/* <InputValidation
                            uniqueKey={formFieldsKeys.licence_key}
                            validationObj={validationObj}
                            value={formFields[formFieldsKeys.licence_key]}
                            placeHolder={labels.licence_key}
                            onChangeText={(text) => {
                                removeErrorTextForInputThatUserIsTyping(formFieldsKeys.licence_key);
                                handleInputChange(formFieldsKeys.licence_key, text)
                            }}
                            style={{ marginTop: formFieldTopMargin }}
                            inputMainViewStyle={styles.InputValidationView}
                            inputStyle={styles.inputStyle}
                        /> */}

                        {/* establishment date */}
                        {/* <InputValidation
                            uniqueKey={formFieldsKeys.establishment_date}
                            validationObj={validationObj}
                            value={formFields.establishment_date}
                            iconRight='calendar'
                            iconColor={Colors.primary}
                            editable={false}
                            onPressIcon={() => {
                                setDateObject({ isVisible: true, mode: Constants.DatePickerModes.date_mode, pickerKey: formFieldsKeys.establishment_date })
                            }}
                            placeHolder={labels.establishment_date}
                            style={{ marginTop: formFieldTopMargin }}
                            inputMainViewStyle={styles.InputValidationView}
                            inputStyle={styles.inputStyle}
                        /> */}

                        {/* {!props?.route?.params?.itemId
                            ? <InputValidation
                                maskedInput={true}
                                mask={Constants.year}
                                // uniqueKey={formFieldsKeys.establishment_year}
                                // validationObj={validationObj}
                                value={'' + formFields.establishment_year}
                                placeHolder={labels["establishment_year"]}
                                optional={true}
                                editable={props?.route?.params?.itemId ? false : true}
                                keyboardType={"number-pad"}
                                onChangeText={(text) => {
                                    // removeErrorTextForInputThatUserIsTyping(formFieldsKeys.contact_number);
                                    handleInputChange(formFieldsKeys.establishment_year, text)
                                }}
                                style={{ marginTop: formFieldTopMargin }}
                                inputMainViewStyle={styles.InputValidationView}
                                inputStyle={styles.inputStyle}
                            />
                            : null} */}

                        {/* checkbox file required */}
                        {/* <View style={styles.checkBoxView}>
                            <BouncyCheckbox
                                size={20}
                                fillColor={Colors.primary}
                                unfillColor={Colors.white}
                                iconStyle={{ borderColor: Colors.primary }}
                                isChecked={formFields.is_file_required}
                                onPress={(value) => {
                                    handleInputChange(formFieldsKeys.is_file_required, value);
                                }}
                            />
                            <Text style={styles.checkBoxTitle}>{labels.file_required}</Text>
                        </View> */}

                        <View style={{ marginTop: 10, flexDirection: "row", alignItems: "center", width: "100%", marginTop: Constants.formFieldTopMargin, justifyContent: "space-between" }}>
                            {/* choose color */}
                            <CustomButton
                                style={{ width: formFields.user_color ? "80%" : "100%", borderRadius: 5, }}
                                onPress={() => {
                                    removeErrorTextForInputThatUserIsTyping(formFieldsKeys.user_color)
                                    setIsModalVisible(true)
                                }} title={labels["choose-color"]} />

                            {/* Choosen Color */}
                            {formFields.user_color
                                ? <CustomButton style={{ backgroundColor: formFields.user_color, width: "15%", borderWidth: 1 }} />
                                : null}
                        </View>

                        {/* Color validation  */}
                        <ErrorComp
                            uniqueKey={formFieldsKeys.color}
                            validationObj={validationObj}
                        />

                        {/* next button */}
                        <CustomButton
                            style={{
                                ...styles.nextButton,
                                marginTop: 20,
                            }}
                            onPress={() => {

                                if (validation(basicDetails)) {
                                    // console.log('Validation true')
                                    setViewDecider(2)
                                    // console.log('formFields', formFields)
                                }
                                else {
                                    Alert.showAlert(Constants.warning, messages.message_fill_all_required_fields)
                                    // console.log('Validation false')
                                    // console.log('formFields', formFields)
                                }
                            }} title={labels["Next"]} />
                    </View> : null}

                {viewDecider == 2
                    ? <View style={styles.mainView}>
                        {/* Address Fields */}
                        <AddressInputComp
                            validationObj={addressValidationObj}
                            formValues={formFields}
                            onPressIcon={(key) => {
                                removeErrorTextForInputThatUserIsTyping(key);
                                setActionSheetDecide(key)
                                actionSheetRef.current?.setModalVisible()
                            }}
                            onChangeText={(text, key) => {
                                removeErrorTextForInputThatUserIsTyping(key);
                                handleInputChange(key, text)
                            }}
                            uniqueKeys={{
                                country: formFieldsKeys.country,
                                city: formFieldsKeys.city,
                                zipCode: formFieldsKeys.zipcode,
                                postalArea: formFieldsKeys.postal_area,
                                full_address: formFieldsKeys.full_address,
                            }}
                        />

                        {/* save button */}
                        <CustomButton
                            title={labels["Next"]}
                            style={{ marginTop: 30 }}
                            onPress={async () => {
                                // setViewDecider(3)
                                if (validation(address)) {
                                    // console.log('validation success')
                                    setViewDecider(3)
                                    // console.log('formFields', formFields)
                                }
                                else {
                                    Alert.showAlert(Constants.warning, messages.message_fill_all_required_fields)
                                }
                            }}
                        />
                    </View> : null}
                {
                    viewDecider == 3
                        ? <View style={{
                            flex: 1,
                            paddingHorizontal: Constants.globalPaddingHorizontal
                        }}>
                            <UploadedFileViewer
                                isLoading={uploadingFile}
                                data={formFields.documents}
                                setNewData={(newArr) => {
                                    handleInputChange(formFieldsKeys.documents, newArr)
                                }}
                            />
                            {/* UPLOAD */}
                            <TouchableOpacity
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
                            </TouchableOpacity>
                            <CustomButton
                                style={{
                                    ...styles.nextButton, marginVertical: 0, marginTop: Constants.formFieldTopMargin,
                                    backgroundColor: Colors.primary,
                                }}
                                isLoading={uploadingFile}
                                onPress={() => {
                                    let badWordString = getBadWordString();
                                    //console.log('validation success')
                                    if (badWordString) {
                                        Alert.showBasicDoubleAlertForBoth(badWordString, () => {
                                            addBranch();

                                        }, null, messages.message_bad_word_alert)
                                    }
                                    else

                                        addBranch();

                                }} title={labels["save"]} />
                        </View> : null
                }
                <DatePicker
                    modal={true}
                    mode={dateObject.mode}
                    open={dateObject.isVisible}
                    date={new Date()}
                    maximumDate={new Date()}
                    onConfirm={onConfirmDatePicker}
                    onCancel={onCancelDatePicker}
                />

            </KeyboardAwareScrollView>
        </BaseContainer>
    )
}

const styles = StyleSheet.create({
    mainView: {
        flex: 1,
        paddingHorizontal: Constants.globalPaddingHorizontal,
        backgroundColor: Colors.backgroundColor,
        paddingBottom: 30
    },
    scrollView: {
        flex: 1,
        backgroundColor: Colors.backgroundColor
    },
    welcomeText: {
        fontSize: getProportionalFontSize(24),
        marginTop: 30,
        color: Colors.primary,
        fontFamily: Assets.fonts.bold
    },
    InputValidationView: {
        backgroundColor: Colors.transparent,
        //borderColor: 'red',
        marginTop: 15,
        //borderRadius: 10,
        //color: 'red'
    },
    normalText: {
        color: Colors.white,
        fontFamily: Assets.fonts.bold,
        fontSize: getProportionalFontSize(15)
    },
    inputStyle: {
        fontSize: getProportionalFontSize(16),
        borderColor: Colors.borderColor,
        backgroundColor: Colors.white
    },
    checkBoxView: { flexDirection: 'row', alignItems: 'center', marginTop: 30 },
    checkBoxTitle: { fontSize: getProportionalFontSize(15), fontFamily: Assets.fonts.regular },
    nextButton: {
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: 40,
        borderRadius: 5,
        backgroundColor: Colors.primary,
        marginTop: Constants.formFieldTopMargin,
        paddingHorizontal: 16,
    },
});