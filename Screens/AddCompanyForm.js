import React from 'react';
import {
    StyleSheet,
    Text, View, SafeAreaView, Image, TouchableOpacity, ScrollView, Keyboard
} from 'react-native';
import Colors from '../Constants/Colors';
import Assets from '../Assets/Assets'
import { getProportionalFontSize, checkEmailFormat, formatDateWithTime, formatDate, formatTime, checkMobileNumberFormat, ReplaceAll, getActionSheetAPIDetail, formatDateByFormat, CreateLicenseKey } from '../Services/CommonMethods';
import InputValidation from '../Components/InputValidation';
import BouncyCheckbox from "react-native-bouncy-checkbox";
import { CommonActions } from '@react-navigation/native';
import APIService from '../Services/APIService'
import Constants from '../Constants/Constants'
import ProgressLoader from '../Components/ProgressLoader'
import { useSelector, useDispatch } from 'react-redux'
import { UserLoginAction } from '../Redux/Actions/UserLoginAction'
import AsyncStorageService from '../Services/AsyncStorageService';
import { TextInput } from 'react-native-paper';
import BaseContainer from '../Components/BaseContainer'
import CustomButton from '../Components/CustomButton'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import DatePicker from 'react-native-date-picker';
import Alert from '../Components/Alert';
import ActionSheet from 'react-native-actions-sheet';
import ActionSheetComp from '../Components/ActionSheetComp';
import MSDataViewer from '../Components/MSDataViewer';
import FormSubHeader from '../Components/FormSubHeader';
import AddressInputComp from '../Components/AddressInputComp';
import moment from 'moment';
import UploadedFileViewer from '../Components/UploadedFileViewer';
import Icon from 'react-native-vector-icons/Ionicons';
import LottieView from 'lottie-react-native';
import { RadioButton, FAB, Provider, Checkbox, Portal, Modal } from 'react-native-paper';

const basic = "basic";
const Address = "address";
const package_info = "package_info";
export default AddCompanyForm = (props) => {
    const formFieldTopMargin = Constants.formFieldTopMargin;

    // Hooks
    const actionSheetRef = React.useRef();

    // REDUX hooks
    const dispatch = useDispatch();
    const isInternetActive = useSelector(state => state.IsInternetActive);
    const UserLogin = useSelector(state => state.User.UserLogin);
    const labels = useSelector(state => state.Labels);
    const messages = useSelector(state => state.Labels);

    // form keys
    const formFieldsKeys = {
        id: "id",
        email: 'email',
        name: 'name',
        // category: 'category',
        // sub_category: 'sub_category',
        contact_number: 'contact_number',
        // password: 'password',
        company_type: 'company_type',
        organization_number: 'organization_number',
        establishment_date: 'establishment_date',
        country: 'country',
        city: 'city',
        zipcode: 'zipcode',
        full_address: 'full_address',
        is_file_required: 'is_file_required',
        file_array: 'file_array',
        package: 'package',
        modules: 'modules',
        subscription: 'subscription',
        postal_area: "postal_area",
        licenseKey: "licenseKey",
        documents: "documents",
        // attachmentL: "attachment",
        attachment: "attachment",
        contact_person_name: "contact_person_name",
        licence_end_date: "licence_end_date"

    }

    //form initial validation
    const initialValidationObj = {

        [formFieldsKeys.name]: {
            invalid: false,
            title: labels.name_required
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
            title: labels.establishment_date_required
        },
        [formFieldsKeys.organization_number]: {
            invalid: false,
            title: labels.organization_number_required
        },
        // [formFieldsKeys.establishment_date]: {
        //     invalid: false,
        //     title: labels.establishment_date_required
        // },

    }
    const initialAddressValidationObj = {
        [formFieldsKeys.full_address]: {
            invalid: false,
            title: '',
        },
        [formFieldsKeys.postal_area]: {
            invalid: false,
            title: '',
        },
        [formFieldsKeys.zipcode]: {
            invalid: false,
            title: labels.zipcode_required
        },
        [formFieldsKeys.city]: {
            invalid: false,
            title: '',
        },
    };

    const initialPackageValidationObj = {
        [formFieldsKeys.company_type]: {
            invalid: false,
            title: labels.company_type_required
        },
        [formFieldsKeys.modules]: {
            invalid: false,
            title: labels.modules_required
        },
        [formFieldsKeys.package]: {
            invalid: false,
            title: labels.package_required
        },

    };

    //form initial values
    const initialFormFields = {
        id: "",
        name: '',
        email: '',
        // category: '',
        // sub_category: '',
        contact_number: '',
        company_type: [],
        organization_number: '',
        establishment_date: '',
        file_required: false,
        registration_file: '',
        country: '',
        city: '',
        zipcode: '',
        full_address: '',
        file_array: [],
        package: '',
        modules: [],
        subscription: '',
        postal_area: "",
        licenseKey: "",
        documents: [],
        contact_person_name: "",
        licence_end_date: ""
    }

    // useState hooks
    const [itemId, setItemId] = React.useState('')
    const [isItemFound, setIsItemFound] = React.useState(false);
    const [formFields, setFormFields] = React.useState(initialFormFields);
    const [isEditable, setIsEditable] = React.useState(true);
    const [isLoading, setIsLoading] = React.useState(false);
    const [viewDecider, setViewDecider] = React.useState(1);
    const [uploadingFile, setUploadingFile] = React.useState(false);
    const [isModalVisible, setIsModalVisible] = React.useState(false);
    const [validationObj, setValidationObj] = React.useState({ ...initialValidationObj });
    const [addressvalidationObj, setAddressValidationObj] = React.useState({
        ...initialAddressValidationObj,
    });
    const [packagevalidationObj, setPackageValidationObj] = React.useState({
        ...initialPackageValidationObj,
    });
    const [dateObject, setDateObject] = React.useState({ isVisible: false, pickerKey: null, mode: Constants.DatePickerModes.date_mode });
    const [actionSheetDecide, setActionSheetDecide] = React.useState('');
    const [companyTypeListAS, setCompanyTypeListAS] = React.useState(getActionSheetAPIDetail({
        url: Constants.apiEndPoints.companyTypeList, debugMsg: "companyTypeList", token: UserLogin.access_token, perPage: Constants.perPage,
        selectedData: formFields[formFieldsKeys.company_type] ? formFields[formFieldsKeys.company_type] : []
    }));
    const [countryAS, setCountryAS] = React.useState(getActionSheetAPIDetail({
        url: Constants.apiEndPoints.countryList, method: 'post', debugMsg: "countryList", token: UserLogin.access_token, page: null, perPage: null,
        selectedData: formFields[formFieldsKeys.country] ? [formFields[formFieldsKeys.country]] : []
    }));
    const [packageAS, setPackageAS] = React.useState(getActionSheetAPIDetail({
        url: Constants.apiEndPoints.administrationPackageList, method: 'post', debugMsg: "packageList", token: UserLogin.access_token, page: null, perPage: null,
        selectedData: formFields[formFieldsKeys.package] ? [formFields[formFieldsKeys.package]] : []
    }));
    const [modulesAS, setModulesAS] = React.useState(getActionSheetAPIDetail({
        url: Constants.apiEndPoints.moduleList, method: 'post', params: { status: '1' }, debugMsg: "modulesList", token: UserLogin.access_token, page: null, perPage: null,
        selectedData: formFields[formFieldsKeys.modules] ? formFields[formFieldsKeys.modules] : []
    }));

    const autoCloseModal = () => {
        // console.log("set time out............")
        setIsModalVisible(false)
        // alert("done")
    }
    // useEffect hooks
    React.useEffect(() => {
        if (props?.route?.params?.itemId) {
            //console.log('item Id FOund')
            setIsItemFound(true)
            setItemId(props?.route?.params?.itemId)
            getCompanyDetails(props?.route?.params?.itemId)
        } else {
            setIsLoading(false);
            setIsEditable(true);
        }
    }, [])

    /**
     * getCompanyDetails
     * @param {*} itemId 
     */
    const getCompanyDetails = async (itemId) => {
        setIsLoading(true);
        // let params = {
        // }
        ////console.log("itemId", itemId)
        let url = Constants.apiEndPoints.administrationCompanyDetails + "/" + itemId;
        //console.log("url", url);
        let response = await APIService.getData(url, UserLogin.access_token, null, "companyAPI");
        if (!response.errorMsg) {
            //console.log("payload getCompanyDetails", response.data.payload);

            let getModule = [];
            if (response.data?.payload?.assigned_module) {
                response.data?.payload?.assigned_module.map((obj, index) => {
                    getModule.push(obj.module)
                })
            }
            // console.log("======getModule=======", getModule)

            setFormFields({
                ...response.data.payload,
                package: response.data?.payload?.subscription?.package_details ?? "",
                establishment_date: response.data?.payload?.establishment_year ?? "",
                licenseKey: response.data?.payload?.licence_key ?? "",
                company_type: response.data?.payload?.company_types ?? "",
                modules: getModule,
                documents: JSON.parse(response.data.payload.documents) ?? null,
            })

            setCompanyTypeListAS({
                ...companyTypeListAS,
                selectedData: [...response.data?.payload?.company_types]
            })
            setPackageAS({
                ...packageAS,
                selectedData: [response.data?.payload?.subscription?.package_details]
            })
            // setModulesAS({
            //     ...modulesAS,
            //     selectedData: [...response.data?.payload?.assigned_module]
            // })
            setIsLoading(false);
        }
        else {
            setIsLoading(false);
            Alert.showAlert(Constants.danger, response.errorMsg);
        }

    }
    // console.log("response.data?.payload?.assigned_module", modulesAS)
    /**
     * saveCompanyDetails
     * @param {*} companyID 
     */
    const saveCompanyDetails = async (companyID) => {
        setIsModalVisible(true)
        //console.log("companyID-----", companyID)

        let modules = [];

        formFields[formFieldsKeys.modules].map(m_obj => {
            if (m_obj?.id)
                modules.push('' + m_obj.id)
        })
        let tempCompanyType = []
        formFields.company_type.map((obj) => {
            if (obj?.id)
                tempCompanyType.push('' + obj.id)
        })
        let params = {
            // "user_type_id": formFields?.user_type_id ?? "2", //required..
            "role_id": formFields?.role_id ?? "2",
            city: formFields[formFieldsKeys.city],
            company_type_id: tempCompanyType,
            ['confirm-password']: "12345678",
            contact_number: ReplaceAll(formFields[formFieldsKeys.contact_number], ' ', ''),
            "contact_person_name": formFields?.contact_person_name ?? "",
            "country_id": 209,
            email: formFields[formFieldsKeys.email],
            establishment_year: formFields[formFieldsKeys.establishment_date],
            full_address: formFields[formFieldsKeys.full_address],
            licence_end_date: "2022-09-02",
            licence_key: formFields?.licenseKey,
            modules: modules ?? [],
            name: formFields[formFieldsKeys.name],
            organization_number: formFields[formFieldsKeys.organization_number],
            package_id: formFields[formFieldsKeys.package]['id'] ?? "",
            password: "12345678",
            postal_area: formFields[formFieldsKeys.zipcode], user_type_id: formFields?.user_type_id ?? "2",
            zipcode: formFields[formFieldsKeys.zipcode],


        }

        console.log('params----- ', params)
        // return;

        let url = Constants.apiEndPoints.administrationCompanyDetails;

        if (companyID)
            url = url + '/' + companyID;

        let response = {};

        // setIsLoading(true);
        if (companyID)
            response = await APIService.putData(url, params, UserLogin.access_token, null, "editCompanyDetails");
        else
            response = await APIService.postData(url, params, UserLogin.access_token, null, "saveCompanyDetails");

        if (!response.errorMsg) {
            // setIsLoading(false);
            autoCloseModal()
            //console.log("SUCCESS............")
            Alert.showAlert(Constants.success, companyID ? labels.company_edited_successfully : labels.company_added_successfully, () => { props.navigation.pop() });
            // packageDetailsAPI()
        }
        else {
            // setIsLoading(false);
            autoCloseModal()
            Alert.showAlert(Constants.danger, response.errorMsg)
        }
    }

    const deleteCompanyAPI = async () => {
        setIsLoading(true);
        // let params = {
        // }
        // //console.log("itemId", itemId)
        let url = Constants.apiEndPoints.administrationCompanyDetails + "/" + itemId;
        //console.log("url", url);
        let response = await APIService.deleteData(url, UserLogin.access_token, null, "companyAPI");
        if (!response.errorMsg) {
            //console.log("payload", response.data.payload);
            // setFormFields(response.data.payload)
            ////console.log("data", response.data.success);
            Alert.showToast(messages.message_delete_success, Constants.success)
            setIsLoading(false);
            props.navigation.pop();
        }
        else {
            setIsLoading(false);
            Alert.showAlert(Constants.danger, response.errorMsg);
        }
    }

    // Helper Methods 
    const removeErrorTextForInputThatUserIsTyping = (uniqueKey, form) => {
        if (form == basic) {
            let tempValidationObj = { ...validationObj }
            tempValidationObj[uniqueKey] = initialValidationObj[uniqueKey];
            setValidationObj(tempValidationObj);
        }
        if (form == Address) {
            let tempValidationObj = { ...addressvalidationObj }
            tempValidationObj[uniqueKey] = initialAddressValidationObj[uniqueKey];
            setAddressValidationObj(tempValidationObj);
        }
        if (form == package_info) {
            let tempValidationObj = { ...packagevalidationObj }
            tempValidationObj[uniqueKey] = initialPackageValidationObj[uniqueKey];
            setPackageValidationObj(tempValidationObj);
        }
    }

    const handleInputChange = (key, value) => {
        //console.log('key', key)
        //console.log('value', value)
        setFormFields({ ...formFields, [key]: value })
    }

    const onConfirmDatePicker = (date) => {
        setDateObject({ ...dateObject, isVisible: false })
        removeErrorTextForInputThatUserIsTyping(dateObject.pickerKey);
        //console.log('date : ', date)
        let value = '';
        if (dateObject.mode == Constants.DatePickerModes.date_mode)
            handleInputChange(dateObject.pickerKey, formatDate(date))
        else if (dateObject.mode == Constants.DatePickerModes.time_mode)
            handleInputChange(dateObject.pickerKey, formatTime(date))
        else
            handleInputChange(dateObject.pickerKey, formatDateWithTime(date))
    }

    const onCancelDatePicker = () => {
        setDateObject({ ...dateObject, isVisible: false })
    }

    const closeActionSheet = () => {
        setActionSheetDecide('');
        actionSheetRef?.current?.setModalVisible();
    }

    const validation = (form) => {
        if (form == basic) {
            let validationObjTemp = { ...validationObj };
            let isValid = true;
            for (const [key, value] of Object.entries(validationObjTemp)) {
                console.log(`${key}: ${value['invalid']}`);
                if (formFields[key] == '') {
                    value['invalid'] = true;
                    value['title'] = labels[key + '_required']
                    ////console.log(labels[(key + '_required')]);
                    isValid = false;
                    break;
                    //return false;
                }
                else if (key == formFieldsKeys.email && !checkEmailFormat(ReplaceAll(formFields[key], ' ', ''))) {
                    value['invalid'] = true;
                    value['title'] = labels[key + '_invalid']
                    ////console.log(labels[(key + '_required')]);
                    isValid = false;
                    break;
                    //return false;
                }
                else if (key == formFieldsKeys.contact_number && !checkMobileNumberFormat(ReplaceAll(formFields[key], ' ', ''))) {
                    value['invalid'] = true;
                    value['title'] = labels[key + '_invalid']
                    ////console.log(labels[(key + '_required')]);
                    isValid = false;
                    break;
                    //return false;
                }


                else if (key == formFieldsKeys.organization_number) {
                    if (!formFields[key] || formFields[key]?.length < 10) {
                        value['invalid'] = true;
                        value['title'] = labels[key + '_invalid']
                        //console.log('formFields[key].length', formFields[key].length);
                        isValid = false;
                        break;
                        //return false;
                    }

                }
            }
            setValidationObj(validationObjTemp);
            return isValid;
        }
        if (form == Address) {
            let validationObjTemp = { ...addressvalidationObj };
            let isValid = true;
            for (const [key, value] of Object.entries(validationObjTemp)) {
                // console.log(`---checking for----${key}: ${value['invalid']}`);
                if (formFields[key] == '') {
                    value['invalid'] = true;
                    value['title'] = labels[key + '_required']
                    ////console.log(labels[(key + '_required')]);
                    isValid = false;
                    break;
                    //return false;
                }


                else if (key == formFieldsKeys.zipcode) {
                    // console.log(formFields[key], formFields[key].length)
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
            setAddressValidationObj(validationObjTemp);
            return isValid;


        }


        if (form == package_info) {
            let validationObjTemp = { ...packagevalidationObj };
            let isValid = true;
            for (const [key, value] of Object.entries(validationObjTemp)) {
                // console.log(`${key}: ${value['invalid']}`);
                if (key == formFieldsKeys.company_type) {
                    if (formFields[key]?.length <= 0) {
                        value['invalid'] = true;
                        value['title'] = labels[key + '_required']
                        ////console.log(labels[(key + '_required')]);
                        isValid = false;
                        break;
                    }


                    else if (key == formFieldsKeys.zipcode) {
                        // console.log(formFields[key], formFields[key].length)
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

                    //return false;
                }
                if (key == formFieldsKeys.modules) {
                    if (formFields[key]?.length <= 0) {
                        value['invalid'] = true;
                        value['title'] = labels[key + '_required']
                        // console.log("op mukesah");
                        isValid = false;
                        break;
                    }
                }
                // console.log("------------------------", formFields.package.name);
                if (key == formFieldsKeys.package) {
                    if (!formFields.package.name) {
                        value['invalid'] = true;
                        value['title'] = labels[key + '_required']
                        // console.log("------------------------", formFields.package.name);
                        isValid = false;
                        break;
                    }
                }
            }
            setPackageValidationObj(validationObjTemp);
            return isValid;
        }
    };

    const isActionSheetMultiple = () => {
        switch (actionSheetDecide) {
            case formFieldsKeys.modules: {
                return true;
            }
            case formFieldsKeys.company_type: {
                return true;
            }
            default: {
                return false;
            }
        }
    }
    const generateLicenseKey = async () => {
        let key = await CreateLicenseKey()
        handleInputChange(formFieldsKeys.licenseKey, key)
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
            // console.log('User cancelled image picker');
        } else if (response.error) {
            // console.log('ImagePicker Error: ', response.error);
            Alert.showAlert(Constants.danger, messages.message_something_went_wrong)
        } else if (response.customButton) {
            // console.log('User tapped custom button: ', response.customButton);
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
    const getDateFromDays = (days = 10) => {
        const addDay = (d, day) => {
            const someDate = new Date(d)
            const numberOfDaysToAdd = day
            const result = someDate.setDate(someDate.getDate() + numberOfDaysToAdd)
            return result
        }
        let dateStr = formatDateByFormat(new Date(addDay(new Date(), days)), "YYYY-MM-DD")
        // handleInputChange(formFieldsKeys.licence_end_date, dateStr)
        return dateStr
    }
    const onRequestClose = () => {
        setIsModalVisible(false);
    }

    // Render view
    if (isLoading)
        return <ProgressLoader />

    return (
        <BaseContainer
            onPressLeftIcon={() => { props.navigation.pop() }}
            leftIcon="arrow-back"
            // leftIconSize={24}
            title={isItemFound ? (isEditable ? labels["company-details"] : labels["company-details"]) : labels["create-company"]}
            leftIconColor={Colors.primary}
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
                            : () => { }
                }
                title={
                    viewDecider == 1
                        ? labels.Basic
                        : viewDecider == 2
                            ? labels.address
                            : viewDecider == 3
                                ? labels.package_id
                                : ''
                }
            />

            <KeyboardAwareScrollView style={{ flex: 1 }} keyboardShouldPersistTaps="handled">

                <ActionSheet
                    containerStyle={{ backgroundColor: Colors.backgroundColor, }}
                    ref={actionSheetRef}>
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
                                multiSelect={isActionSheetMultiple()}

                                // multiSelect
                                APIDetails={actionSheetDecide == formFieldsKeys.company_type ? companyTypeListAS
                                    : actionSheetDecide == formFieldsKeys.country ? countryAS
                                        : actionSheetDecide == formFieldsKeys.package ? packageAS
                                            : actionSheetDecide == formFieldsKeys.modules ? modulesAS
                                                : null}
                                changeAPIDetails={(payload) => {
                                    // console.log('changeAPIDetails CALLED-------------------------------------')
                                    if (actionSheetDecide == formFieldsKeys.company_type) {
                                        setCompanyTypeListAS(getActionSheetAPIDetail({ ...companyTypeListAS, ...payload }))
                                    }
                                    else if (actionSheetDecide == formFieldsKeys.country) {
                                        setCountryAS(getActionSheetAPIDetail({ ...countryAS, ...payload }))
                                    }
                                    else if (actionSheetDecide == formFieldsKeys.package) {
                                        setPackageAS(getActionSheetAPIDetail({ ...packageAS, ...payload }))
                                    }
                                    else if (actionSheetDecide == formFieldsKeys.modules) {
                                        setModulesAS(getActionSheetAPIDetail({ ...modulesAS, ...payload }))
                                    }
                                }}
                                onPressItem={(item) => {
                                    //console.log('item', item)
                                    if (actionSheetDecide == formFieldsKeys.company_type) {
                                        handleInputChange(formFieldsKeys.company_type, item)
                                        //setCategoryType(item)
                                        removeErrorTextForInputThatUserIsTyping(formFieldsKeys.company_type, package_info)
                                    }
                                    else if (actionSheetDecide == formFieldsKeys.country) {
                                        handleInputChange(formFieldsKeys.country, item)
                                        removeErrorTextForInputThatUserIsTyping(formFieldsKeys.country)
                                    }
                                    else if (actionSheetDecide == formFieldsKeys.package) {
                                        setFormFields({ ...formFields, [formFieldsKeys.package]: item, licenseKey: CreateLicenseKey(), licence_end_date: getDateFromDays(item.validity_in_days) })
                                        removeErrorTextForInputThatUserIsTyping(formFieldsKeys.package, package_info);
                                    }
                                    else if (actionSheetDecide == formFieldsKeys.modules) {
                                        // console.log("item", item)
                                        handleInputChange(formFieldsKeys.modules, item)
                                        removeErrorTextForInputThatUserIsTyping(formFieldsKeys.modules, package_info)
                                    }
                                }}
                            />
                    }
                </ActionSheet>

                {
                    viewDecider == 1
                        ? <View style={styles.mainView}>
                            {/* company Name */}
                            <InputValidation
                                uniqueKey={formFieldsKeys.name}
                                validationObj={validationObj}
                                value={formFields[formFieldsKeys.name]}
                                placeHolder={labels["name"]}
                                onChangeText={(text) => {
                                    removeErrorTextForInputThatUserIsTyping(formFieldsKeys.name, basic);
                                    handleInputChange(formFieldsKeys.name, text)
                                }}
                                style={styles.InputValidationView}
                                inputStyle={styles.inputStyle}
                                editable={isEditable}

                            />

                            {/* Email */}
                            <InputValidation
                                uniqueKey={formFieldsKeys.email}
                                validationObj={validationObj}
                                value={formFields[formFieldsKeys.email]}
                                placeHolder={labels["Email"]}
                                onChangeText={(text) => {
                                    removeErrorTextForInputThatUserIsTyping(formFieldsKeys.email, basic);
                                    handleInputChange(formFieldsKeys.email, text)
                                }}
                                style={{ marginTop: formFieldTopMargin }}
                                inputMainViewStyle={styles.InputValidationView}
                                inputStyle={styles.inputStyle}
                                editable={isEditable}
                                keyboardType={"email-address"}
                            />

                            {/* Contact Number */}
                            <InputValidation
                                maskedInput={true}
                                mask={Constants.phone_number_format}
                                keyboardType={'number-pad'}
                                uniqueKey={formFieldsKeys.contact_number}
                                validationObj={validationObj}
                                value={formFields[formFieldsKeys.contact_number]}
                                placeHolder={labels["contact-number"]}
                                onChangeText={(text) => {
                                    removeErrorTextForInputThatUserIsTyping(formFieldsKeys.contact_number, basic);
                                    handleInputChange(formFieldsKeys.contact_number, text)
                                }}
                                style={{ marginTop: formFieldTopMargin }}
                                inputMainViewStyle={styles.InputValidationView}
                                inputStyle={styles.inputStyle}
                                editable={isEditable}
                            />
                            {/* contact person Name */}
                            <InputValidation
                                uniqueKey={formFieldsKeys.contact_person_name}
                                validationObj={validationObj}
                                value={formFields[formFieldsKeys.contact_person_name]}
                                placeHolder={labels["contact-person-name"]}
                                onChangeText={(text) => {
                                    removeErrorTextForInputThatUserIsTyping(formFieldsKeys.contact_person_name, basic);
                                    handleInputChange(formFieldsKeys.contact_person_name, text)
                                }}
                                style={styles.InputValidationView}
                                inputStyle={styles.inputStyle}
                                editable={isEditable}

                            />

                            {/* organization number */}
                            <InputValidation
                                maskedInput={true}
                                mask={Constants.organization_number_format}
                                keyboardType={'number-pad'}
                                uniqueKey={formFieldsKeys.organization_number}
                                validationObj={validationObj}
                                value={formFields[formFieldsKeys.organization_number]}
                                placeHolder={labels["organization_number"]}
                                onChangeText={(text) => {
                                    removeErrorTextForInputThatUserIsTyping(formFieldsKeys.organization_number, basic);
                                    handleInputChange(formFieldsKeys.organization_number, text)
                                }}
                                style={{ marginTop: formFieldTopMargin }}
                                inputMainViewStyle={styles.InputValidationView}
                                inputStyle={styles.inputStyle}
                                editable={isEditable}
                            />

                            {/* establishment date */}
                            {/* <InputValidation
                                uniqueKey={formFieldsKeys.establishment_date}
                                validationObj={validationObj}
                                value={formFields[formFieldsKeys.establishment_date]}
                                iconRight='calendar'
                                iconColor={Colors.primary}
                                editable={false}
                                onPressIcon={() => {
                                    setDateObject({ isVisible: isEditable ? true : false, mode: Constants.DatePickerModes.date_mode, pickerKey: formFieldsKeys.establishment_date })
                                }}
                                placeHolder={labels["establishment_date"]}
                                style={{ marginTop: formFieldTopMargin }}
                                inputMainViewStyle={styles.InputValidationView}
                                inputStyle={styles.inputStyle}
                            /> */}

                            {/* establishment-year */}
                            <InputValidation
                                // maskedInput={true}
                                // mask={Constants.phone_number_format}
                                keyboardType={'number-pad'}
                                // uniqueKey={formFieldsKeys.establishment_date}
                                // validationObj={validationObj}
                                optional={true}
                                value={"" + formFields?.establishment_date ?? "no data"}
                                placeHolder={labels["establishment-year"]}
                                onChangeText={(text) => {
                                    removeErrorTextForInputThatUserIsTyping(formFieldsKeys.establishment_date, basic);
                                    handleInputChange(formFieldsKeys.establishment_date, text)
                                }}
                                style={{ marginTop: formFieldTopMargin }}
                                inputMainViewStyle={styles.InputValidationView}
                                inputStyle={styles.inputStyle}
                                maxLength={4}
                            // editable={isEditable}
                            />

                            {/* next button */}

                            <CustomButton
                                style={{
                                    ...styles.nextButton,
                                    backgroundColor: Colors.primary,
                                    marginTop: 15
                                }}
                                onPress={() => {
                                    Keyboard.dismiss()
                                    // setViewDecider(2)
                                    if (validation(basic)) {
                                        //loginAPI();
                                        // console.log('Validation true');
                                        setViewDecider(2);

                                    } else {
                                        Alert.showAlert(Constants.warning, messages.message_fill_all_required_fields)
                                        // console.log('Validation false');
                                    }
                                }}
                                title={labels["Next"]}
                            />
                        </View>
                        : null
                }
                {
                    viewDecider == 2
                        ? <View style={styles.mainView}>
                            {/* Address Fields */}
                            <AddressInputComp
                                validationObj={addressvalidationObj}
                                formValues={formFields}
                                onChangeText={(text, key) => {
                                    removeErrorTextForInputThatUserIsTyping(key, Address);
                                    handleInputChange(key, text)
                                }}
                                uniqueKeys={{
                                    city: formFieldsKeys.city,
                                    zipCode: formFieldsKeys.zipcode,
                                    postalArea: formFieldsKeys.postal_area,
                                    full_address: formFieldsKeys.full_address,
                                }}
                            />
                            {/* next button */}
                            <CustomButton
                                style={{
                                    ...styles.nextButton,
                                    backgroundColor: Colors.primary, marginTop: 15
                                }}
                                onPress={() => {
                                    Keyboard.dismiss()
                                    // setViewDecider(2)
                                    if (validation(Address)) {
                                        //loginAPI();
                                        // console.log('Validation true');
                                        setViewDecider(3);
                                    } else {
                                        Alert.showAlert(Constants.warning, messages.message_fill_all_required_fields)
                                        // console.log('Validation false');
                                    }
                                }}
                                title={labels["Next"]}
                            />
                        </View>
                        : null
                }

                {
                    viewDecider == 3
                        ?
                        <View style={styles.mainView}>
                            {/* company type */}
                            <InputValidation
                                uniqueKey={formFieldsKeys.company_type}
                                validationObj={packagevalidationObj}
                                //value={formFields[formFieldsKeys.company_type]['name'] ?? ''}
                                iconRight='chevron-down'
                                iconColor={Colors.primary}
                                editable={false}
                                onPressIcon={() => {
                                    if (isEditable) {
                                        setActionSheetDecide(formFieldsKeys.company_type);
                                        // removeErrorTextForInputThatUserIsTyping(ipFormKeys.category);
                                        actionSheetRef.current?.setModalVisible();
                                    }
                                }}
                                placeHolder={labels["company-types"]}
                                style={{ marginTop: formFieldTopMargin }}
                                size={30}
                                inputMainViewStyle={styles.InputValidationView}
                                inputStyle={styles.inputStyle}
                            />

                            <MSDataViewer
                                data={formFields.company_type}
                                setNewDataOnPressClose={(newArr) => {
                                    setCompanyTypeListAS({ ...companyTypeListAS, selectedData: newArr });
                                    handleInputChange(formFieldsKeys.company_type, newArr)
                                }}
                            />

                            {/* module */}
                            <InputValidation
                                uniqueKey={formFieldsKeys.modules}
                                validationObj={packagevalidationObj}
                                value={''}
                                iconRight='chevron-down'
                                iconColor={Colors.primary}
                                onPressIcon={() => {
                                    if (isEditable) {
                                        setActionSheetDecide(formFieldsKeys.modules);
                                        //removeErrorTextForInputThatUserIsTyping(ipFormKeys.category);
                                        actionSheetRef.current?.setModalVisible();
                                    }
                                }}
                                placeHolder={labels["Modules"]}
                                style={{ marginTop: formFieldTopMargin }}
                                size={30}
                                inputMainViewStyle={styles.InputValidationView}
                                inputStyle={styles.inputStyle}
                                editable={false}
                            />
                            <MSDataViewer
                                data={formFields[formFieldsKeys.modules]}
                                setNewDataOnPressClose={(newArr) => {
                                    setModulesAS({ ...modulesAS, selectedData: newArr });
                                    handleInputChange(formFieldsKeys.modules, newArr)
                                }}
                            />

                            {/* package */}
                            <InputValidation
                                uniqueKey={formFieldsKeys.package}
                                validationObj={packagevalidationObj}
                                value={formFields[formFieldsKeys.package]['name'] ?? ''}
                                iconRight='chevron-down'
                                iconColor={Colors.primary}
                                onPressIcon={() => {
                                    setActionSheetDecide(formFieldsKeys.package);
                                    actionSheetRef.current?.setModalVisible();
                                }}
                                placeHolder={labels["package"]}
                                style={{ marginTop: formFieldTopMargin }}
                                size={30}
                                inputMainViewStyle={styles.InputValidationView}
                                inputStyle={styles.inputStyle}
                                editable={false}
                            />

                            {/* license key*/}
                            {
                                formFields[formFieldsKeys.package]['name']
                                    ? <InputValidation
                                        value={formFields[formFieldsKeys.licenseKey]}
                                        placeHolder={labels["licence_key"]}
                                        onChangeText={(text) => {
                                            handleInputChange(formFieldsKeys.name, text)
                                        }}
                                        style={styles.InputValidationView}
                                        inputStyle={styles.inputStyle}
                                        editable={false}
                                        iconRight="refresh-circle"
                                        size={30}
                                        onPressIcon={() => {
                                            generateLicenseKey()
                                        }}
                                    />
                                    : null
                            }
                            {formFields[formFieldsKeys.package]['name'] && formFields[formFieldsKeys.licenseKey]
                                ? <View
                                    style={styles.priceWithDiscount}>
                                    <Text style={styles.discountTagLine}>{labels.licence_end_date}:</Text>
                                    <Text style={{ ...styles.discountTagLine, marginLeft: 10 }}>
                                        {formFields.licence_end_date}
                                    </Text>
                                </View>
                                : null
                            }
                            <View style={{
                                // flex: 1,
                                // paddingHorizontal: Constants.globalPaddingHorizontal
                            }}>
                                <UploadedFileViewer
                                    isLoading={uploadingFile}
                                    data={formFields.documents}
                                    setNewData={(newArr) => {
                                        handleInputChange(newArr, formFieldsKeys.documents)
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
                            </View>

                            {/* save button */}
                            <CustomButton
                                title={labels["save"]}
                                style={{ marginTop: formFieldTopMargin }}
                                onPress={() => {
                                    Keyboard.dismiss()
                                    if (validation(package_info)) {
                                        // console.log('validation success')
                                        if (itemId) {
                                            // console.log('valid=++++++++++++')
                                            saveCompanyDetails(itemId)
                                        } else {
                                            saveCompanyDetails()
                                        }
                                    } else {
                                        Alert.showAlert(Constants.warning, messages.message_fill_all_required_fields)
                                        // console.log('validation fail')
                                    }
                                }}
                            />

                        </View>
                        : null
                }
                <DatePicker
                    modal={true}
                    mode={dateObject.mode}
                    open={dateObject.isVisible}
                    date={new Date()}
                    onConfirm={onConfirmDatePicker}
                    onCancel={onCancelDatePicker}
                />

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
                            <View style={styles.innerViewForModel}>
                                <View style={{
                                    width: "100%",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    // marginTop: -10
                                }}>
                                    <Text style={{ fontFamily: Assets.fonts.semiBold, fontSize: getProportionalFontSize(16), color: Colors.primary, marginBottom: 20 }}>{labels["creating-company"]}</Text>
                                    <LottieView
                                        source={require('../Assets/images/wait.json')}
                                        autoPlay
                                        loop={true}
                                        style={{
                                            width: "20%",
                                        }}
                                    />

                                    <Text style={{ fontFamily: Assets.fonts.regular, fontSize: getProportionalFontSize(11), color: Colors.black, width: "100%" }}>{labels["please-wait-setting-company"]}</Text>
                                    <Text style={{ fontFamily: Assets.fonts.regular, fontSize: getProportionalFontSize(11), color: Colors.gray, width: "100%" }}>{labels["do-not-press-back-button"]}</Text>
                                </View>

                            </View>
                        </View>
                    </Modal>
                </Portal>

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
    priceWithDiscount: {
        flexDirection: 'row',
        // justifyContent: 'space-between',
        // borderWidth: 1,
        // borderColor: Colors.borderColor,
        borderRadius: 10,
        paddingHorizontal: 10,
        paddingVertical: 5,
        // marginTop: 10,
    },
    discountTagLine: {
        fontSize: getProportionalFontSize(15),
        fontFamily: Assets.fonts.boldItalic
    },
    nextButton: {
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: 40,
        borderRadius: 5,
        backgroundColor: Colors.secondary,
        marginTop: Constants.formFieldTopMargin,
    },
    modalMainView: { backgroundColor: 'transparent', justifyContent: "center", alignItems: "center", paddingHorizontal: 16 },
    innerViewForModel: {
        width: '100%', minHeight: 150, backgroundColor: Colors.backgroundColor, padding: Constants.globalPaddingHorizontal * 2, paddingHorizontal: 16, borderRadius: 20,
    },
});