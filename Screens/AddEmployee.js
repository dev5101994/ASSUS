import React, { useState, useRef, useEffect } from 'react';
import {
    StyleSheet,
    Text,
    View,
    SafeAreaView,
    Image,
    TouchableOpacity,
    ScrollView,
    Keyboard
} from 'react-native';
import Colors from '../Constants/Colors';
import Assets from '../Assets/Assets';
import {
    getProportionalFontSize,
    formatDate,
    formatTime,
    formatDateWithTime,
    getActionSheetAPIDetail,
    checkEmailFormat,
    ReplaceAll,
    checkMobileNumberFormat,
    formatDateForAPI,
    isDocOrImage,
} from '../Services/CommonMethods';
import InputValidation from '../Components/InputValidation';
import { Checkbox } from 'react-native-paper';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import { CommonActions } from '@react-navigation/native';
import APIService from '../Services/APIService';
import Constants from '../Constants/Constants';
import ProgressLoader from '../Components/ProgressLoader';
import { useSelector, useDispatch } from 'react-redux';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import DatePicker from 'react-native-date-picker';
import ActionSheet from 'react-native-actions-sheet';
import ActionSheetComp from '../Components/ActionSheetComp';
import { Modal, Portal, RadioButton } from 'react-native-paper';
import ColorPicker from 'react-native-wheel-color-picker';
import CustomButton from '../Components/CustomButton';
import ErrorComp from '../Components/ErrorComp';
import Alert from '../Components/Alert';
import AddressInputComp from '../Components/AddressInputComp';
import FormSubHeader from '../Components/FormSubHeader';

import Icon from 'react-native-vector-icons/Ionicons';
import UploadedFileViewer from '../Components/UploadedFileViewer';
import CommonAPIFunctions from '../Services/CommonAPIFunctions';

//const labels = Constants.labels.app.implementationPlanForm;
let picker = null;

export default AddEmployee = props => {
    const routeParams = props.route.params ?? {};

    // Constants
    const employeeForm = 'employeeForm';
    const personalDetail = 'personalDetails';
    const address = 'address';


    //initialValues
    const empInitialValues = {
        category: {},
        branch: {},
        department: {},
        roles: {},
        companyType: {},
        name: '',
        email: '',
        contact_number: '',
        personal_number: '',
        gender: {},
        full_address: '',
        employee_type: {},
        joining_date: '',
        color: '',
        country: {},
        // password: { name: "", visible: false },
        // confirmPassword: { name: "", visible: false },
        zipCode: '',
        regular: true,
        seasonal: false,
        substitute: false,
        is_extra: false,
        verification_file_required: false,
        postal_area: '',
        city: '',
        municipalName: '',
        hourPerWeek: '',
        workPercentage: '',
        salary: '',
        contractType: {},
        // verification_file: "",
        // company: "",
        documents: [],

        calculate_hours: {
            day: "", week: "", month: ""
        }
    };

    //uniqueKeys
    const empFormKeys = {
        category: 'category',
        companyType: 'companyType',
        branch: 'branch',
        department: 'department',
        roles: 'roles',
        name: 'name',
        email: 'email',
        contact_number: 'contact_number',
        personal_number: 'personal_number',
        gender: 'gender',
        full_address: 'full_address',
        // employee_type: "employee_type",
        joining_date: 'joining_date',
        color: 'color',
        country: 'country',
        // password: "password",
        // confirmPassword: "confirmPassword",
        zipCode: 'zipCode',
        regular: 'regular',
        seasonal: 'seasonal',
        substitute: 'substitute',
        verification_file_required: 'verification_file_required',
        postal_area: 'postal_area',
        city: 'city',
        // company: "company",
        // verification_file: "verification_file",
        documents: "documents",
        attachment: "attachment",
        municipalName: "municipalName",
        hourPerWeek: "hourPerWeek",
        workPercentage: "workPercentage",
        salary: "salary",
        contractType: "contractType",
        is_extra: "is_extra"
    };

    // Immutable Variables
    const initialValidationObj = {
        // [empFormKeys.category]: {
        //     invalid: false,
        //     title: '',
        // },
        // [empFormKeys.companyType]: {
        //     invalid: false,
        //     title: '',
        // },
        // [empFormKeys.branch]: {
        //     invalid: false,
        //     title: ''
        // },
        // [empFormKeys.department]: {
        //     invalid: false,
        //     title: '',
        // },


        [empFormKeys.joining_date]: {
            invalid: false,
            title: '',
        },

        // [empFormKeys.color]: {
        //     invalid: false,
        //     title: '',
        // },
        // [empFormKeys.company]: {
        //     invalid: false,
        //     title: ''
        // },
    };
    const initialPersonalDetailValidationObj = {
        [empFormKeys.name]: {
            invalid: false,
            title: '',
        },
        [empFormKeys.personal_number]: {
            invalid: false,
            title: '',
        },
        [empFormKeys.email]: {
            invalid: false,
            title: '',
        },
        [empFormKeys.contact_number]: {
            invalid: false,
            title: '',
        },
        [empFormKeys.gender]: {
            invalid: false,
            title: '',
        },

        [empFormKeys.postal_area]: {
            invalid: false,
            title: '',
        },
        [empFormKeys.zipCode]: {
            invalid: false,
            title: '',
        },

        // [empFormKeys.roles]: {
        //     invalid: false,
        //     title: '',
        // },
    };
    const initialAddressValidationObj = {
        // [empFormKeys.country]: {
        //     invalid: false,
        //     title: '',
        // },
        [empFormKeys.full_address]: {
            invalid: false,
            title: '',
        },

        [empFormKeys.postal_area]: {
            invalid: false,
            title: '',
        },
        [empFormKeys.zipCode]: {
            invalid: false,
            title: '',
        },
        [empFormKeys.city]: {
            invalid: false,
            title: '',
        },
    };

    // Hooks
    const actionSheetRef = useRef();

    // REDUX hooks
    const labels = useSelector(state => state.Labels);
    const UserLogin = useSelector(state => state.User.UserLogin);
    const messages = useSelector(state => state.Labels);
    // console.log("UserLogin22", JSON.stringify(UserLogin))
    const genderDataArr = [
        { name: labels.male, id: 1 },
        { name: labels.female, id: 2 },
        { name: labels.other, id: 3 },
    ];
    const genderObjWhileAdding = {
        [labels.male]: 'male',
        [labels.female]: 'female',
        [labels.other]: 'other',
    };
    const genderObjWhileGetting = {
        male: { name: labels.male, id: 1 },
        female: { name: labels.female, id: 2 },
        other: { name: labels.other, id: 3 },
    };

    const contractTypeDataArr = [
        { name: labels.contractHourly, id: 1 },
        { name: labels.contractFixed, id: 2 },
    ];
    const contractTypeObjWhileAdding = {
        [labels.contractHourly]: "1",
        [labels.contractFixed]: "2",
    };
    const contractTypeObjWhileGetting = {
        "1": { name: labels.contractHourly, id: 1 },
        "2": { name: labels.contractFixed, id: 2 },
    };

    // useState hooks
    const [validationObj, setValidationObj] = useState({
        ...initialValidationObj,
    });
    const [personalValidationObj, setPersonalValidationObj] = useState({
        ...initialPersonalDetailValidationObj,
    });
    const [addressValidationObj, setAddressValidationObj] = useState({
        ...initialAddressValidationObj,
    });
    const [empFormValues, setEmpFormValues] = useState({
        ...empInitialValues,
    });
    const [isLoading, setIsLoading] = useState(false);
    const [openDatePicker, setOpenDatePicker] = useState(false);
    const [mode, setMode] = useState(Constants.DatePickerModes.date_mode);
    const [datePickerKey, setDatePickerKey] = useState(null);
    const [actionSheetDecide, setActionSheetDecide] = useState('');
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [viewDecider, setViewDecider] = useState(1);
    const [isValid, setIsValid] = useState(true);
    const [uploadingFile, setUploadingFile] = React.useState(false);
    const [departmentAS, setDepartmentAS] = useState(
        getActionSheetAPIDetail({
            url: Constants.apiEndPoints.departmentList,
            debugMsg: 'departmentList',
            token: UserLogin.access_token,
            selectedData: [],
        }),
    );
    const [rolesAS, setRolesAS] = useState(
        getActionSheetAPIDetail({
            url: Constants.apiEndPoints.roles,
            debugMsg: 'roles',
            token: UserLogin.access_token,
            selectedData: [],
        }),
    );
    const [branchAS, setBranchAS] = useState(
        getActionSheetAPIDetail({
            url: Constants.apiEndPoints.userList,
            debugMsg: 'branchList',
            token: UserLogin.access_token,
            selectedData: [],
            params: { user_type_id: '11' },
        }),
    );
    const [categoryAS, setCategoryAS] = useState(
        getActionSheetAPIDetail({
            url: Constants.apiEndPoints.categoryList,
            debugMsg: 'categoryList',
            token: UserLogin.access_token,
            selectedData: [],
            params: { "category_type_id": "2", },
        }),
    );
    const [companyTypeAS, setCompanyTypeAS] = useState(
        getActionSheetAPIDetail({
            url: Constants.apiEndPoints.companyTypeList,
            debugMsg: 'companyTypeList',
            token: UserLogin.access_token,
            selectedData: [],
        }),
    );
    const [countryAS, setCountryAS] = useState(
        getActionSheetAPIDetail({
            url: Constants.apiEndPoints.countryList,
            debugMsg: 'countryList',
            token: UserLogin.access_token,
            selectedData: [],
            perPage: 100,
        }),
    );
    const [genderAS, setGenderAS] = useState(
        getActionSheetAPIDetail({
            url: '',
            debugMsg: '',
            token: '',
            selectedData: [],
            data: genderDataArr,
        }),
    );

    const [contractTypeAS, setContractTypeAS] = useState(
        getActionSheetAPIDetail({
            url: '',
            debugMsg: '',
            token: '',
            selectedData: [],
            data: contractTypeDataArr,
        }),
    );

    const [companyAS, setCompanyAS] = useState(
        getActionSheetAPIDetail({
            url: Constants.apiEndPoints.administrationCompanies,
            debugMsg: 'companyList',
            token: UserLogin.access_token,
            selectedData: [],
        }),
    );


    // BadWords & Suggetion

    const [suggestion, setSuggestion] = React.useState([]);
    const [badWords, setBadWords] = React.useState([]);
    const [full_address, setFull_address] = React.useState([]);

    React.useEffect(() => {
        CommonAPIFunctions.getSuggestions(UserLogin.access_token, (data) => { setSuggestion(data) });
        CommonAPIFunctions.getBadWords(UserLogin.access_token, (data) => { setBadWords(data) });
        // userDetailAPI()

    }, [])


    // useEffect hooks
    useEffect(() => {
        if (routeParams.employeeId) userDetailAPI();
    }, []);
    useEffect(() => {
        if (empFormValues?.hourPerWeek && empFormValues?.workPercentage) {
            calculateHours()
        }
    }, [empFormValues?.hourPerWeek, empFormValues?.workPercentage])
    const handleInputChange = (value, key) => {
        setEmpFormValues({
            ...empFormValues,
            [key]: value,
        });
    };


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

            if (empFormValues?.name?.toLowerCase()?.includes(currBadWord)
                || empFormValues?.full_address?.toLowerCase()?.includes(currBadWord)
                || empFormValues?.city?.toLowerCase()?.includes(currBadWord)
                || empFormValues?.postal_area?.toLowerCase()?.includes(currBadWord)

            ) {
                if (!result?.toLowerCase()?.includes(currBadWord))
                    result = result + badWords[i]?.name + ", ";
            }
        }
        if (result)
            result = result?.substring(0, result?.length - 2);
        return result;
    }


    const closeActionSheet = () => {
        setActionSheetDecide('');
        actionSheetRef?.current?.setModalVisible();
    };

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
                let tempDocArr = [...empFormValues.documents];
                tempDocArr = tempDocArr.concat(uploaded_doc_arr)
                handleInputChange(tempDocArr, empFormKeys.documents)
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

                let tempDocArr = [...empFormValues.documents];
                tempDocArr = tempDocArr.concat(uploaded_doc_arr)
                handleInputChange(tempDocArr, empFormKeys.documents)
            }
        }
    }

    const removeErrorTextForInputThatUserIsTyping = (form, uniqueKey) => {
        if (form == employeeForm) {
            let tempValidationObj = { ...validationObj };
            tempValidationObj[uniqueKey] = initialValidationObj[uniqueKey];
            setValidationObj(tempValidationObj);
        } else if (form == personalDetail) {
            let tempValidationObj = { ...personalValidationObj };
            tempValidationObj[uniqueKey] =
                initialPersonalDetailValidationObj[uniqueKey];
            setPersonalValidationObj(tempValidationObj);
        } else if (form == address) {
            let tempValidationObj = { ...addressValidationObj };
            tempValidationObj[uniqueKey] = initialAddressValidationObj[uniqueKey];
            setAddressValidationObj(tempValidationObj);
        }
    };

    //   const removeErrorTextForInputThatUserIsTyping = uniqueKey => {
    //     let tempValidationObj = {...validationObj};
    //     tempValidationObj[uniqueKey] = initialValidationObj[uniqueKey];
    //     setValidationObj(tempValidationObj);
    //   };

    const userDetailAPI = async () => {
        setIsLoading(true);
        let url = Constants.apiEndPoints.userView + '/' + routeParams.employeeId;

        let response = {};

        response = await APIService.getData(
            url,
            UserLogin.access_token,
            null,
            'userDetailAPI',
        );
        // console.log("responssssssse", JSON.stringify(response))
        if (!response.errorMsg) {
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
            setEmpFormValues({
                ...empFormValues,
                branch: response?.data?.payload?.branch ?? {},
                department: response?.data?.payload?.department,
                roles: response?.data?.payload?.role,
                // companyType: response?.data?.payload?.company_type,
                name: response?.data?.payload?.name,
                email: response?.data?.payload?.email,
                contact_number: response?.data?.payload?.contact_number,
                personal_number: response?.data?.payload?.personal_number,
                gender: genderObjWhileGetting[response?.data?.payload?.gender?.toLowerCase()],
                full_address: response?.data?.payload?.full_address,
                joining_date: response?.data?.payload?.joining_date,
                color: response?.data?.payload?.user_color,
                country: response?.data?.payload?.country,
                // password: { name: "", visible: false },
                // confirmPassword: { name: "", visible: false },
                zipCode: response?.data?.payload?.zipcode,
                regular: response?.data?.payload?.employee_type == 1 ? true : false,
                seasonal: response?.data?.payload?.employee_type == 3 ? true : false,
                substitute: response?.data?.payload?.employee_type == 2 ? true : false,
                is_extra: response?.data?.payload?.employee_type == 4 ? true : false,
                verification_file_required: response?.data?.payload?.is_file_required,
                category: response?.data?.payload?.category_master,
                city: response?.data?.payload?.city,
                postal_area: response?.data?.payload?.postal_area,
                // municipalName: response?.data?.payload?.assigned_work?.municipal_name,
                hourPerWeek: response?.data?.payload?.assigned_work?.assigned_working_hour_per_week ?? " ",
                workPercentage: response?.data?.payload?.assigned_work?.working_percent ?? " ",
                salary: response?.data?.payload?.contract_value,
                contractType: contractTypeObjWhileGetting[response?.data?.payload?.contract_type],
                documents: tempDocuments
            });
            setDepartmentAS({
                ...departmentAS,
                selectedData: [response?.data?.payload?.department],
            });
            setRolesAS({
                ...rolesAS,
                selectedData: response?.data?.payload?.role ? [response?.data?.payload?.role] : [],
            });
            setBranchAS({
                ...branchAS,
                selectedData: [response?.data?.payload?.branch] ?? [],
            });
            setCompanyTypeAS({
                ...companyTypeAS,
                selectedData: [response?.data?.payload?.company_type],
            });
            setCountryAS({
                ...countryAS,
                selectedData: [response?.data?.payload?.country],
            });
            setGenderAS({
                ...genderAS,
                selectedData: [
                    genderObjWhileGetting[response?.data?.payload?.gender.toLowerCase()],
                ],
            });
            setContractTypeAS({
                ...contractTypeAS,
                selectedData: [
                    contractTypeObjWhileGetting[response?.data?.payload?.contract_type],
                ],
            });
            setCategoryAS({
                ...categoryAS,
                selectedData: [response?.data?.payload?.category_master],
            });
            // company..
            setCompanyAS({
                ...companyAS,
                selectedData: [response?.data?.payload?.company],
            });
            //
            setIsLoading(false);
        } else {
            setIsLoading(false);
            Alert.showAlert(Constants.danger, response?.errorMsg);
        }
    };

    const validation = form => {
        if (form == employeeForm) {
            let validationObjTemp = { ...initialValidationObj };
            let isValid = true;
            for (const [key, value] of Object.entries(validationObjTemp)) {
                if (
                    (typeof empFormValues[key] == 'object' &&
                        !empFormValues[key]?.name) ||
                    (typeof empFormValues[key] == 'string' && !empFormValues[key])
                ) {
                    // console.log("obj", key)
                    // console.log("str", empFormValues[key])
                    // console.log("++", empFormKeys.company)
                    if (UserLogin?.user_type_id == 1) {
                        if (
                            key == empFormKeys.companyType ||
                            key == empFormKeys.branch ||
                            key == empFormKeys.department
                        ) {
                            isValid = true;
                        } else {
                            value['invalid'] = true;
                            value['title'] = labels[key + '_required'];
                            isValid = false;
                        }
                    }
                    else if (key == empFormKeys.joining_date) {
                        if (!empFormValues[key]) {
                            value['invalid'] = true;
                            value['title'] = labels[key + '_required'];
                            isValid = false;
                            break;
                        }
                    }
                    else {
                        value['invalid'] = true;
                        value['title'] = labels[key + '_required'];
                        isValid = false;
                    }
                    break;
                }
            }
            setValidationObj({ ...validationObjTemp });
            return isValid;
        } else if (form == personalDetail) {
            let validationObjTemp = { ...initialPersonalDetailValidationObj };
            let isValid = true;
            for (const [key, value] of Object.entries(validationObjTemp)) {

                if (key == empFormKeys.name) {
                    if (!empFormValues[key]) {
                        value['invalid'] = true;
                        value['title'] = labels[key + '_required'];
                        isValid = false;
                        break;
                    }
                } else if (key == empFormKeys.email) {
                    if (!empFormValues[key] || !checkEmailFormat(empFormValues[key])) {
                        value['invalid'] = true;
                        value['title'] = labels[key + '_required'];
                        isValid = false;
                        break;
                    }
                } else if (key == empFormKeys.contact_number) {
                    if (!empFormValues[key]) {
                        value['invalid'] = true;
                        value['title'] = labels[key + '_required'];
                        isValid = false;
                        break;
                    }
                    else if (!checkMobileNumberFormat(ReplaceAll(empFormValues[key], ' ', ''))) {
                        value['invalid'] = true;
                        value['title'] = labels['enter_valid_contact_number'];
                        isValid = false;
                        break;
                    }
                }
                else if (key == empFormKeys.personal_number) {
                    if (!empFormValues[key]) {
                        value['invalid'] = true;
                        value['title'] = labels[key + '_required'];
                        isValid = false;
                        break;
                    }
                }
                else if (key == empFormKeys.zipCode) {
                    // console.log(empFormValues[key], empFormValues[key].length)
                    if (empFormValues[key] && empFormValues[key].length < 5) {
                        value['invalid'] = true;
                        value['title'] = "invailid zip code"
                        isValid = false;
                        break;
                    }

                }
                else if (key == empFormKeys.postal_area) {
                    if (empFormValues[key] && empFormValues[key].length < 5) {
                        value['invalid'] = true;
                        value['title'] = "invailid postal Area"
                        isValid = false;
                        break;
                    }
                }

                // else if (key == empFormKeys.zipCode) {
                //     if (empFormKeys[key] && empFormKeys[key].length < 5) {


                //         console.log('4', key)
                //         value['invalid'] = true;
                //         value['title'] = labels[key + '_required']
                //         isValid = false;
                //         break;
                //     }
                // }





                else if (key == empFormKeys.gender) {
                    if (!empFormValues[key].name) {
                        value['invalid'] = true;
                        value['title'] = labels[key + '_required'];
                        isValid = false;
                        break;
                    }
                }
            }
            setPersonalValidationObj({ ...validationObjTemp });
            return isValid;
        } else if (form == address) {
            let validationObjTemp = { ...initialAddressValidationObj };
            let isValid = true;
            for (const [key, value] of Object.entries(validationObjTemp)) {

                alert("hello")

                if (key == empFormKeys.country) {
                    if (!empFormValues[key].name) {
                        value['invalid'] = true;
                        value['title'] = labels[key + '_required'];
                        isValid = false;
                        break;
                    }
                } else if (key == empFormKeys.city) {
                    if (!empFormValues[key]) {
                        value['invalid'] = true;
                        value['title'] = labels[key + '_required'];
                        isValid = false;
                        break;
                    }
                }

                else if (
                    (typeof empFormValues[key] == 'object' &&
                        !empFormValues[key]?.name) ||
                    (typeof empFormValues[key] == 'string' && !empFormValues[key])
                ) {
                    // console.log('3', key);
                    value['invalid'] = true;
                    value['title'] = labels[key + '_required'];
                    isValid = false;
                    break;
                }
            }
            setAddressValidationObj({ ...validationObjTemp });
            return isValid;
        }
    };

    const getAPIDetails = () => {
        switch (actionSheetDecide) {
            case empFormKeys.companyType: {
                return companyTypeAS;
            }
            case empFormKeys.department: {
                return departmentAS;
            }
            case empFormKeys.roles: {
                return rolesAS;
            }
            case empFormKeys.branch: {
                return branchAS;
            }
            // case empFormKeys.employee_type: {
            //     return employeeTypeAS
            // }
            case empFormKeys.country: {
                return countryAS;
            }
            case empFormKeys.gender: {
                return genderAS;
            }
            case empFormKeys.contractType: {
                return contractTypeAS;
            }
            case empFormKeys.category: {
                return categoryAS;
            }
            case empFormKeys.company: {
                return companyAS;
            }
            default: {
                return null;
            }
        }
    };

    const changeAPIDetails = payload => {
        switch (actionSheetDecide) {
            case empFormKeys.companyType: {
                setCompanyTypeAS(
                    getActionSheetAPIDetail({ ...companyTypeAS, ...payload }),
                );
                break;
            }
            case empFormKeys.department: {
                setDepartmentAS(getActionSheetAPIDetail({ ...departmentAS, ...payload }));
                break;
            }
            case empFormKeys.roles: {
                setRolesAS(getActionSheetAPIDetail({ ...rolesAS, ...payload }));
                break;
            }
            case empFormKeys.branch: {
                setBranchAS(getActionSheetAPIDetail({ ...branchAS, ...payload }));
                break;
            }
            // case empFormKeys.employee_type: {
            //     setEmployeeTypeAS(getActionSheetAPIDetail({ ...employeeTypeAS, ...payload }))
            //     break;
            // }
            case empFormKeys.country: {
                setCountryAS(getActionSheetAPIDetail({ ...countryAS, ...payload }));
                break;
            }
            case empFormKeys.gender: {
                setGenderAS(getActionSheetAPIDetail({ ...genderAS, ...payload }));
                break;
            }
            case empFormKeys.contractType: {
                setContractTypeAS(getActionSheetAPIDetail({ ...contractTypeAS, ...payload }));
                break;
            }
            case empFormKeys.category: {
                setCategoryAS(getActionSheetAPIDetail({ ...categoryAS, ...payload }));
                break;
            }
            case empFormKeys.company: {
                setCompanyAS(getActionSheetAPIDetail({ ...companyAS, ...payload }));
                break;
            }
            default: {
                break;
            }
        }
    };

    const onPressItem = item => {
        switch (actionSheetDecide) {
            case empFormKeys.companyType: {
                handleInputChange(item, empFormKeys.companyType);
                removeErrorTextForInputThatUserIsTyping(empFormKeys.companyType);
                break;
            }
            case empFormKeys.department: {
                handleInputChange(item, empFormKeys.department);
                removeErrorTextForInputThatUserIsTyping(empFormKeys.department);
                break;
            }
            case empFormKeys.roles: {
                handleInputChange(item, empFormKeys.roles);
                removeErrorTextForInputThatUserIsTyping(empFormKeys.roles);
                break;
            }
            case empFormKeys.branch: {
                handleInputChange(item, empFormKeys.branch);
                removeErrorTextForInputThatUserIsTyping(empFormKeys.branch);
                break;
            }
            case empFormKeys.employee_type: {
                handleInputChange(item, empFormKeys.employee_type);
                removeErrorTextForInputThatUserIsTyping(empFormKeys.employee_type);
                break;
            }
            case empFormKeys.country: {
                handleInputChange(item, empFormKeys.country);
                removeErrorTextForInputThatUserIsTyping(empFormKeys.country);
                break;
            }
            case empFormKeys.gender: {
                handleInputChange(item, empFormKeys.gender);
                removeErrorTextForInputThatUserIsTyping(empFormKeys.gender);
                break;
            }
            case empFormKeys.contractType: {
                handleInputChange(item, empFormKeys.contractType);
                // removeErrorTextForInputThatUserIsTyping(empFormKeys.gender);
                break;
            }
            case empFormKeys.category: {
                handleInputChange(item, empFormKeys.category);
                removeErrorTextForInputThatUserIsTyping(empFormKeys.category);
                break;
            }
            case empFormKeys.company: {
                handleInputChange(item, empFormKeys.company);
                removeErrorTextForInputThatUserIsTyping(empFormKeys.company);
                break;
            }
            default: {
                break;
            }
        }
    };

    const addOrEditEmployeeAPI = async () => {
        // return
        let tempDocuments = null;
        if (empFormValues.documents?.length > 0) {
            tempDocuments = [];
            empFormValues.documents.map((obj) => {
                let tempObj = {
                    file_name: obj.uploading_file_name,
                    file_url: obj.uri
                }
                tempDocuments.push(tempObj);
            })
        }

        let params = {
            // "category_type_id": "8",
            role_id: empFormValues?.roles?.id ?? UserLogin?.top_most_parent_id,
            roles: empFormValues?.roles ?? {},
            user_type_id: '3',
            category_id: empFormValues?.category?.id ?? "",
            //company_type_id: ['' + empFormValues.companyType.id],
            country_id: 209,
            branch_id: empFormValues?.branch?.id,
            dept_id: empFormValues?.department?.id,
            name: empFormValues?.name,
            email: empFormValues?.email,
            password: '12345678',
            'confirm-password': '12345678',
            contact_number: ReplaceAll(empFormValues?.contact_number, ' ', ''),
            gender: genderObjWhileAdding[empFormValues?.gender?.name],
            personal_number: ReplaceAll(empFormValues?.personal_number, '-', ''),
            zipcode: empFormValues?.zipCode,
            full_address: empFormValues?.full_address,
            city: empFormValues?.city,
            postal_area: empFormValues?.postal_area,
            // is_substitute: empFormValues?.substitute ? 1 : 0,
            // is_regular: empFormValues?.regular ? 1 : 0,
            // is_seasonal: empFormValues?.seasonal ? 1 : 0,
            joining_date: empFormValues?.joining_date ? formatDateForAPI(empFormValues?.joining_date) : '',
            user_color: empFormValues?.color,
            is_file_required: empFormValues?.verification_file_required ? 1 : 0,
            // "status": "",
            weekly_hours_alloted_by_govt: '0',
            documents: tempDocuments,
            // temp codes
            assigned_working_hour_per_week: empFormValues?.hourPerWeek,
            working_percent: empFormValues?.workPercentage,
            // municipal_name : empFormValues?.municipalName,
            contract_value: empFormValues?.salary,
            contract_type: contractTypeObjWhileAdding[empFormValues?.contractType?.name],
            employee_type: empFormValues.regular ? 1 : empFormValues.substitute ? 2 : empFormValues.seasonal ? 3 : empFormValues.is_extra ? 4 : null
        };

        let url = Constants.apiEndPoints.userView;
        if (routeParams.employeeId) url = url + '/' + routeParams.employeeId;
        let response = {};
        // console.log("params-------------------", params)
        // return;
        setIsLoading(true);


        if (routeParams.employeeId)
            response = await APIService.putData(
                url,
                params,
                UserLogin.access_token,
                null,
                'editEmployeeAPI',
            );
        else
            response = await APIService.postData(
                url,
                params,
                UserLogin.access_token,
                null,
                'addEmployeeAPI',
            );

        if (!response.errorMsg) {
            setIsLoading(false);
            Alert.showAlert(
                Constants.success,
                routeParams.employeeId
                    ? labels.employee_edited_successfully
                    : labels.employee_added_successfully,
                () => {
                    props.navigation.pop();
                },
            );
        } else {
            setIsLoading(false);
            Alert.showAlert(Constants.danger, response.errorMsg);
        }
    };
    const calculateHours = () => {
        let tempData = empFormValues.calculate_hours;
        let actual_hours = 0
        if (empFormValues?.hourPerWeek && empFormValues?.workPercentage) {
            let hour_per_week = Number(empFormValues?.hourPerWeek)
            // get
            let work_percentage = Number(empFormValues?.workPercentage)
            actual_hours = hour_per_week * (work_percentage / 100)

        }
        // console.log(actual_hours)

    }
    // Render view
    // console.log('empFormValues.personal_number', empFormValues.personal_number)
    // console.log('data reaching ',  getAPIDetails())
    if (isLoading) return <ProgressLoader />;

    return (
        <BaseContainer
            title={labels["employees"]}
            onPressLeftIcon={() => {
                props.navigation.pop();
            }}
            titleStyle={styles.headingText}
            leftIcon="arrow-back"
            leftIconSize={24}
            leftIconColor={Colors.primary}>
            <FormSubHeader
                leftIconName={
                    viewDecider == 1 ? "" : "chevron-back-circle-outline"}
                onPressLeftIcon={viewDecider == 2 ? () => { setViewDecider(1) } : viewDecider == 3 ? () => { setViewDecider(2) } : () => { }}
                title={
                    viewDecider == 1 ? labels["Details"] : viewDecider == 2 ? labels["personal-details"] : viewDecider == 3 ? labels["document"] : ""
                }
            />

            <KeyboardAwareScrollView style={{ flex: 1 }} keyboardShouldPersistTaps="handled">
                {/* Main View */}
                {viewDecider == 1 ? (
                    <View style={styles.mainView}>
                        {/* Category */}
                        {/* <InputValidation
                            uniqueKey={empFormKeys.category}
                            validationObj={validationObj}
                            value={empFormValues.category?.name ?? ''}
                            placeHolder={labels.category}
                            iconRight="chevron-down"
                            iconColor={Colors.primary}
                            editable={false}
                            onPressIcon={() => {
                                removeErrorTextForInputThatUserIsTyping(
                                    employeeForm,
                                    empFormKeys.category,
                                );
                                setActionSheetDecide(empFormKeys.category);
                                actionSheetRef.current?.setModalVisible();
                            }}
                            style={styles.InputValidationView}
                            inputStyle={styles.inputStyle}
                        /> */}
                        {/* company name */}
                        {/* {
                        UserLogin?.user_type_id == 1 ? (
                            <InputValidation
                                uniqueKey={empFormKeys.company}
                                validationObj={validationObj}
                                value={empFormValues.company?.name ?? ''}
                                placeHolder={labels.company}
                                iconRight='chevron-down'
                                iconColor={Colors.primary}
                                editable={false}
                                onPressIcon={() => {
                                    removeErrorTextForInputThatUserIsTyping(empFormKeys.company);
                                    setActionSheetDecide(empFormKeys.company);
                                    actionSheetRef.current?.setModalVisible()
                                }}
                                style={styles.InputValidationView}
                                inputStyle={styles.inputStyle}
                            />
                        ) : null
                    } */}
                        {/* company type */}
                        {/* {UserLogin?.user_type_id != 1 ? (
                            <InputValidation
                                uniqueKey={empFormKeys.companyType}
                                validationObj={validationObj}
                                value={empFormValues.companyType?.name ?? ''}
                                placeHolder={labels.companyType}
                                iconRight="chevron-down"
                                iconColor={Colors.primary}
                                editable={false}
                                onPressIcon={() => {
                                    removeErrorTextForInputThatUserIsTyping(
                                        employeeForm,
                                        empFormKeys.companyType,
                                    );
                                    setActionSheetDecide(empFormKeys.companyType);
                                    actionSheetRef.current?.setModalVisible();
                                }}
                                style={styles.InputValidationView}
                                inputStyle={styles.inputStyle}
                            />
                        ) : null} */}

                        {/* branch */}
                        {UserLogin?.user_type_id != 1 ? (
                            <InputValidation
                                // uniqueKey={empFormKeys.branch}
                                // validationObj={validationObj}
                                optional={true}
                                value={empFormValues.branch?.name ?? ''}
                                placeHolder={labels["branch"]}
                                iconRight="chevron-down"
                                iconColor={Colors.primary}
                                editable={false}
                                onPressIcon={() => {
                                    removeErrorTextForInputThatUserIsTyping(
                                        employeeForm,
                                        empFormKeys.branch,
                                    );
                                    setActionSheetDecide(empFormKeys.branch);
                                    actionSheetRef.current?.setModalVisible();
                                }}
                                style={styles.InputValidationView}
                                inputStyle={styles.inputStyle}
                            />
                        ) : null}
                        {/* department */}
                        {/* {UserLogin?.user_type_id != 1 ? (
                            <InputValidation

                                uniqueKey={empFormKeys.department}
                                validationObj={validationObj}
                                value={empFormValues.department?.name ?? ''}
                                placeHolder={labels["department"]}
                                iconRight="chevron-down"
                                iconColor={Colors.primary}
                                editable={false}
                                onPressIcon={() => {
                                    removeErrorTextForInputThatUserIsTyping(
                                        employeeForm,
                                        empFormKeys.department,
                                    );
                                    setActionSheetDecide(empFormKeys.department);
                                    actionSheetRef.current?.setModalVisible();
                                }}
                                style={styles.InputValidationView}
                                inputStyle={styles.inputStyle}
                            />
                        ) : null} */}
                        {/* joining date */}
                        <InputValidation
                            uniqueKey={empFormKeys.joining_date}
                            validationObj={validationObj}
                            iconRight="calendar"
                            iconColor={Colors.primary}
                            editable={false}
                            onPressIcon={() => {
                                removeErrorTextForInputThatUserIsTyping(employeeForm, empFormKeys.joining_date)
                                setOpenDatePicker(true);
                                setMode(Constants.DatePickerModes.date_mode);
                                setDatePickerKey(empFormKeys.joining_date);
                            }}
                            value={
                                empFormValues.joining_date
                                    ? formatDate(empFormValues.joining_date)
                                    : ''
                            }
                            placeHolder={labels["joining_date"]}
                            style={styles.InputValidationView}
                            inputStyle={styles.inputStyle}
                        />
                        {/* checkbox for seasonal */}
                        {/* <View style={styles.checkBoxView}>
                            <BouncyCheckbox
                                size={20}
                                fillColor={Colors.primary}
                                unfillColor={Colors.white}
                                iconStyle={{ borderColor: Colors.primary }}
                                isChecked={empFormValues.seasonal}
                                onPress={value => {
                                    if (!value)
                                        return;
                                    setEmpFormValues({
                                        ...empFormValues,
                                        [empFormKeys.substitute]: false,
                                        [empFormKeys.is_extra]: false,
                                        [empFormKeys.regular]: false,
                                        [empFormKeys.seasonal]: value,
                                    });
                                }}
                            />
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={styles.saveAsTemplate}>{labels["seasonal"]}</Text>
                            </View>
                        </View> */}

                        <View style={styles.checkBoxView}>
                            <Checkbox
                                color={Colors.primary}
                                status={empFormValues.seasonal ? 'checked' : 'unchecked'}
                                onPress={() => {
                                    if (empFormValues.seasonal)
                                        return;
                                    setEmpFormValues({
                                        ...empFormValues,
                                        [empFormKeys.substitute]: false,
                                        [empFormKeys.is_extra]: false,
                                        [empFormKeys.regular]: false,
                                        [empFormKeys.seasonal]: true,
                                    });
                                }}
                            />
                            <Text style={styles.normalText}>{labels["seasonal"]}</Text>
                        </View>

                        {/* checkbox for regular */}
                        {/* <View style={styles.checkBoxView}>
                            <BouncyCheckbox
                                size={20}
                                fillColor={Colors.primary}
                                unfillColor={Colors.white}
                                iconStyle={{ borderColor: Colors.primary }}
                                isChecked={empFormValues.regular}
                                onPress={value => {
                                    if (!value)
                                        return;
                                    setEmpFormValues({
                                        ...empFormValues,
                                        [empFormKeys.substitute]: false,
                                        [empFormKeys.is_extra]: false,
                                        [empFormKeys.regular]: value,
                                        [empFormKeys.seasonal]: false,
                                    });
                                }}
                            />
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={styles.saveAsTemplate}>{labels["regular"]}</Text>
                            </View>
                        </View> */}

                        <View style={styles.checkBoxView}>
                            <Checkbox
                                color={Colors.primary}
                                status={empFormValues.regular ? 'checked' : 'unchecked'}
                                onPress={() => {
                                    if (empFormValues.regular)
                                        return;
                                    setEmpFormValues({
                                        ...empFormValues,
                                        [empFormKeys.substitute]: false,
                                        [empFormKeys.is_extra]: false,
                                        [empFormKeys.regular]: true,
                                        [empFormKeys.seasonal]: false,
                                    });
                                }}
                            />
                            <Text style={styles.normalText}>{labels["regular"]}</Text>
                        </View>

                        {/* checkbox for substitute */}
                        {/* <View style={styles.checkBoxView}>
                            <BouncyCheckbox
                                size={20}
                                fillColor={Colors.primary}
                                unfillColor={Colors.white}
                                iconStyle={{ borderColor: Colors.primary }}
                                isChecked={empFormValues.substitute}
                                onPress={value => {
                                    if (!value)
                                        return;
                                    setEmpFormValues({
                                        ...empFormValues,
                                        [empFormKeys.substitute]: value,
                                        [empFormKeys.is_extra]: false,
                                        [empFormKeys.regular]: false,
                                        [empFormKeys.seasonal]: false,
                                    });
                                }}
                            />
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={styles.saveAsTemplate}>{labels.substitute}</Text>
                            </View>
                        </View> */}

                        <View style={styles.checkBoxView}>
                            <Checkbox
                                color={Colors.primary}
                                status={empFormValues.substitute ? 'checked' : 'unchecked'}
                                onPress={() => {
                                    if (empFormValues.substitute)
                                        return;
                                    setEmpFormValues({
                                        ...empFormValues,
                                        [empFormKeys.substitute]: true,
                                        [empFormKeys.is_extra]: false,
                                        [empFormKeys.regular]: false,
                                        [empFormKeys.seasonal]: false,
                                    });
                                }}
                            />
                            <Text style={styles.normalText}>{labels["substitute"]}</Text>
                        </View>

                        {/* checkbox for extra */}
                        {/* <View style={styles.checkBoxView}>
                            <BouncyCheckbox
                                size={20}
                                fillColor={Colors.primary}
                                unfillColor={Colors.white}
                                iconStyle={{ borderColor: Colors.primary }}
                                isChecked={empFormValues.substitute}
                                onPress={value => {
                                    //handleInputChange(value, empFormKeys.substitute);
                                    if (!value)
                                        return;
                                    setEmpFormValues({
                                        ...empFormValues,
                                        [empFormKeys.substitute]: false,
                                        [empFormKeys.is_extra]: value,
                                        [empFormKeys.regular]: false,
                                        [empFormKeys.seasonal]: false,
                                    });
                                }}
                            />
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={styles.saveAsTemplate}>{labels.extra}</Text>
                            </View>
                        </View> */}

                        <View style={styles.checkBoxView}>
                            <Checkbox
                                color={Colors.primary}
                                status={empFormValues.is_extra ? 'checked' : 'unchecked'}
                                onPress={() => {
                                    if (empFormValues.is_extra)
                                        return;
                                    setEmpFormValues({
                                        ...empFormValues,
                                        [empFormKeys.substitute]: false,
                                        [empFormKeys.is_extra]: true,
                                        [empFormKeys.regular]: false,
                                        [empFormKeys.seasonal]: false,
                                    });
                                }}
                            />
                            <Text style={styles.normalText}>{labels["extra"]}</Text>
                        </View>

                        {/* checkbox for verification file requirement */}
                        {/* 
                        <View style={styles.checkBoxView}>
                            <BouncyCheckbox
                                size={20}
                                fillColor={Colors.primary}
                                unfillColor={Colors.white}
                                iconStyle={{ borderColor: Colors.primary }}
                                isChecked={empFormValues.verification_file_required}
                                onPress={value => {
                                    handleInputChange(
                                        value,
                                        empFormKeys.verification_file_required,
                                    );
                                }}
                            />
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={styles.saveAsTemplate}>
                                    {labels.verification_file_required}
                                </Text>
                            </View>
                        </View>
                         */}
                        {/* verification file  */}
                        {/* {empFormValues.verification_file_required ?
                        <InputValidation
                            uniqueKey={empFormKeys.verification_file}
                            //validationObj={validationObj}
                            value={empFormValues.verification_file}
                            placeHolder={labels.verification_file}
                            onChangeText={(text) => {
                                removeErrorTextForInputThatUserIsTyping(empFormKeys.verification_file);
                                handleInputChange(text, empFormKeys.verification_file)
                            }}
                            style={styles.InputValidationView}
                            inputStyle={styles.inputStyle}
                        />
                        : null} */}


                        <View
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                width: '100%',
                                marginTop: Constants.formFieldTopMargin,
                                justifyContent: 'space-between',
                            }}>
                            {/* choose color */}
                            {/*
                            <CustomButton
                                style={{ width: empFormValues.color ? '80%' : '100%' }}
                                onPress={() => {
                                    removeErrorTextForInputThatUserIsTyping(
                                        employeeForm,
                                        empFormKeys.color,
                                    );
                                    setIsModalVisible(true);
                                }}
                                title={labels.choose_color}
                            />
                                */}
                            {/* Choosen Color */}

                            {empFormValues.color ? (
                                <CustomButton
                                    style={{
                                        backgroundColor: empFormValues.color,
                                        width: '15%',
                                        borderWidth: 1,
                                    }}
                                />
                            ) : null}
                        </View>
                        {/* Color validation  */}
                        {/* <ErrorComp
                            uniqueKey={empFormKeys.color}
                            validationObj={validationObj}
                        />  */}
                        {/* next button */}
                        <CustomButton
                            style={{
                                ...styles.nextButton,
                                backgroundColor: isValid ? Colors.primary : Colors.lightPrimary,
                            }}
                            onPress={() => {
                                if (validation(employeeForm)) {
                                    //   //loginAPI();
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
                ) : null}
                {viewDecider == 2 ? (
                    <View style={styles.mainView}>
                        {/* name */}
                        <InputValidation
                            uniqueKey={empFormKeys.name}
                            validationObj={personalValidationObj}
                            value={empFormValues.name}
                            placeHolder={labels["name"]}
                            onChangeText={text => {
                                removeErrorTextForInputThatUserIsTyping(
                                    personalDetail,
                                    empFormKeys.name,
                                );
                                handleInputChange(text, empFormKeys.name);
                            }}
                            style={styles.InputValidationView}
                            inputStyle={styles.inputStyle}
                        />

                        {/* Roles */}
                        <InputValidation

                            // uniqueKey={empFormKeys.roles}
                            // validationObj={validationObj}
                            value={empFormValues.roles?.se_name ?? ''}
                            placeHolder={labels["Roles"]}
                            optional={true}
                            iconRight="chevron-down"
                            iconColor={Colors.primary}
                            editable={false}
                            onPressIcon={() => {
                                removeErrorTextForInputThatUserIsTyping(
                                    employeeForm,
                                    empFormKeys.roles,
                                );
                                setActionSheetDecide(empFormKeys.roles);
                                actionSheetRef.current?.setModalVisible();
                            }}
                            style={styles.InputValidationView}
                            inputStyle={styles.inputStyle}
                        />

                        {/* personal number */}
                        <InputValidation
                            maskedInput={true}
                            mask={Constants.personal_number_format}
                            uniqueKey={empFormKeys.personal_number}
                            validationObj={personalValidationObj}
                            keyboardType={'number-pad'}
                            value={empFormValues.personal_number}
                            placeHolder={labels["personal-number"]}
                            onChangeText={text => {
                                removeErrorTextForInputThatUserIsTyping(
                                    personalDetail,
                                    empFormKeys.personal_number,
                                );
                                handleInputChange(text, empFormKeys.personal_number);
                            }}
                            style={styles.InputValidationView}
                            inputStyle={styles.inputStyle}
                        />

                        {/* email */}
                        <InputValidation
                            uniqueKey={empFormKeys.email}
                            validationObj={personalValidationObj}
                            value={empFormValues.email}
                            placeHolder={labels["Email"]}
                            onChangeText={text => {
                                removeErrorTextForInputThatUserIsTyping(
                                    personalDetail,
                                    empFormKeys.email,
                                );
                                handleInputChange(text, empFormKeys.email);
                            }}
                            style={styles.InputValidationView}
                            inputStyle={styles.inputStyle}
                            keyboardType={"email-address"}
                        />

                        {/* contact number */}
                        <InputValidation
                            maskedInput={true}
                            mask={Constants.phone_number_format}
                            uniqueKey={empFormKeys.contact_number}
                            validationObj={personalValidationObj}
                            keyboardType={'number-pad'}
                            value={empFormValues.contact_number}
                            placeHolder={labels["contact-number"]}
                            onChangeText={text => {
                                removeErrorTextForInputThatUserIsTyping(
                                    personalDetail,
                                    empFormKeys.contact_number,
                                );
                                handleInputChange(text, empFormKeys.contact_number);
                            }}
                            style={styles.InputValidationView}
                            inputStyle={styles.inputStyle}
                        />


                        {/* full Address */}
                        <InputValidation
                            // uniqueKey={empFormKeys.full_address}
                            // validationObj={personalValidationObj}
                            multiline={true}
                            dropDownListData={full_address}
                            value={empFormValues?.full_address}
                            optional={true}
                            placeHolder={labels["full-address"]}
                            onChangeText={(text) => {
                                removeErrorTextForInputThatUserIsTyping(empFormKeys.full_address);
                                filterSuggestion(text, (filteredData) => { setFull_address(filteredData) })
                                handleInputChange(text, empFormKeys.full_address)
                            }}
                            onPressDropDownListitem={(choosenSuggestion) => {
                                handleInputChange(choosenSuggestion, empFormKeys.full_address)
                                setFull_address([])
                            }}
                            style={styles.InputValidationView}
                            inputStyle={{ ...styles.inputStyle, maxHeight: 110 }}
                        />

                        {/*city Address */}
                        <InputValidation
                            // uniqueKey={empFormKeys.city}
                            // validationObj={personalValidationObj}
                            value={empFormValues?.city}
                            optional={true}
                            placeHolder={labels["city"]}
                            onChangeText={(text) => {
                                handleInputChange(text, empFormKeys.city)
                            }}
                            style={styles.InputValidationView}
                            inputStyle={{ ...styles.inputStyle, maxHeight: 110 }}
                        />

                        {/*Postal area */}
                        <InputValidation
                            uniqueKey={empFormKeys.postal_area}
                            validationObj={personalValidationObj}
                            maxLength={5}
                            keyboardType={'number-pad'}
                            value={empFormValues?.postal_area}
                            optional={true}
                            placeHolder={labels["postal-area"]}
                            onChangeText={(text) => {
                                handleInputChange(text, empFormKeys.postal_area)
                            }}
                            style={styles.InputValidationView}
                            inputStyle={{ ...styles.inputStyle, maxHeight: 110 }}
                        />

                        {/*zip code */}
                        <InputValidation
                            uniqueKey={empFormKeys.zipCode}
                            validationObj={personalValidationObj}
                            maxLength={5}
                            value={empFormValues?.zipCode}
                            optional={true}
                            keyboardType={'number-pad'}
                            placeHolder={labels["zipcode"]}
                            onChangeText={(text) => {
                                handleInputChange(text, empFormKeys.zipCode)
                            }}
                            style={styles.InputValidationView}
                            inputStyle={{ ...styles.inputStyle, maxHeight: 110 }}
                        />

                        {/*municipalName */}
                        {/*
                        <InputValidation
                            // uniqueKey={empFormKeys.postal_area}
                            // validationObj={personalValidationObj}
                            multiline={true}
                            value={empFormValues?.municipalName}
                            optional={true}
                            placeHolder={labels["municipalName"]}
                            onChangeText={(text) => {
                                handleInputChange(text, empFormKeys.municipalName)
                            }}
                            style={styles.InputValidationView}
                            inputStyle={{ ...styles.inputStyle, maxHeight: 110 }}
                        />*/}

                        {/*hourPerWeek */}
                        {
                            routeParams?.employeeId
                                ? null :
                                <InputValidation
                                    // uniqueKey={empFormKeys.zipcode}
                                    // validationObj={personalValidationObj}
                                    value={"" + empFormValues?.hourPerWeek}
                                    optional={true}
                                    keyboardType={'number-pad'}
                                    placeHolder={labels["hourPerWeek"]}
                                    onChangeText={
                                        (text) => {
                                            if (Number(text) < Number(Constants.maximum_assign_hours_per_week)) {
                                                handleInputChange(text, empFormKeys.hourPerWeek)
                                            } else {
                                                let temp = Constants.maximum_assign_hours_per_week
                                                handleInputChange(temp, empFormKeys.hourPerWeek)
                                                Alert.showToast(labels.max_limit_reached)
                                            }

                                        }}
                                    style={styles.InputValidationView}
                                    inputStyle={{ ...styles.inputStyle, maxHeight: 110 }}
                                />
                        }
                        {/*workPercentage */}
                        {
                            routeParams?.employeeId
                                ? null :
                                <InputValidation
                                    value={empFormValues?.workPercentage}
                                    optional={true}
                                    keyboardType={'number-pad'}
                                    placeHolder={labels["workPercentage"]}
                                    onChangeText={(text) => {
                                        if (Number(text) < 100) {
                                            handleInputChange(text, empFormKeys.workPercentage)
                                        } else {
                                            handleInputChange('99', empFormKeys.workPercentage)
                                            Alert.showToast(labels.max_limit_reached)
                                        }
                                        // if (empFormValues?.hourPerWeek && empFormValues?.workPercentage) {
                                        //     calculateHours()
                                        // }

                                    }}
                                    style={styles.InputValidationView}
                                    inputStyle={{ ...styles.inputStyle, maxHeight: 110 }}
                                />}

                        {/* {
                        routeParams?.employeeId
                            ? null
                            : item?.assigned_hours_per_day
                                ? <View style={styles.countView}>
                                    <View style={styles.badgeContainer}>
                                        <Text style={styles.badgeText}>{item?.assigned_hours_per_day ?? 0}{labels["hours-per-day"] ?? "h/day"} </Text>
                                    </View>
                                    <View style={styles.badgeContainer}>
                                        <Text style={styles.badgeText}>{item?.assigned_hours_per_week ?? 0}{labels["hours-per-week"] ?? "h/week"}</Text>
                                    </View>
                                    <View style={styles.badgeContainer}>
                                        <Text style={styles.badgeText}>{item?.assigned_hours_per_month ?? 0}{labels["hours-per-month"] ?? "h/month"}</Text>
                                    </View>
                                </View>
                                : null

                        } */}


                        {/* contractType */}
                        <InputValidation
                            value={empFormValues.contractType?.name ?? ''}
                            placeHolder={labels["contractType"]}
                            iconRight="chevron-down"
                            iconColor={Colors.primary}
                            optional={true}
                            editable={false}
                            onPressIcon={() => {
                                setActionSheetDecide(empFormKeys.contractType);
                                actionSheetRef.current?.setModalVisible();
                            }}
                            style={styles.InputValidationView}
                            inputStyle={styles.inputStyle}
                        />

                        {/*salary */}
                        <InputValidation
                            // uniqueKey={empFormKeys.zipcode}
                            // validationObj={personalValidationObj}
                            value={empFormValues?.salary}
                            optional={true}
                            keyboardType={'number-pad'}
                            placeHolder={labels["salary"]}
                            onChangeText={(text) => {
                                handleInputChange(text, empFormKeys.salary)
                            }}
                            style={styles.InputValidationView}
                            inputStyle={{ ...styles.inputStyle, maxHeight: 110 }}
                        />

                        {/* gender */}
                        <InputValidation
                            uniqueKey={empFormKeys.gender}
                            validationObj={personalValidationObj}
                            value={empFormValues.gender?.name ?? ''}
                            placeHolder={labels["gender"]}
                            iconRight="chevron-down"
                            iconColor={Colors.primary}
                            editable={false}
                            onPressIcon={() => {
                                removeErrorTextForInputThatUserIsTyping(
                                    personalDetail,
                                    empFormKeys.gender,
                                );
                                setActionSheetDecide(empFormKeys.gender);
                                actionSheetRef.current?.setModalVisible();
                            }}
                            style={styles.InputValidationView}
                            inputStyle={styles.inputStyle}
                        />
                        {/* next button */}
                        <CustomButton
                            style={{
                                ...styles.nextButton,
                                backgroundColor: isValid ? Colors.primary : Colors.lightPrimary,
                            }}
                            onPress={() => {
                                if (validation(personalDetail)) {
                                    // console.log('Validation true');
                                    setViewDecider(3);
                                    // addOrEditEmployeeAPI();
                                } else {
                                    Alert.showAlert(Constants.warning, messages.message_fill_all_required_fields)
                                    // console.log('Validation false');
                                }
                            }}
                            title={labels["Next"]}
                        />
                    </View>
                ) : null}
                {viewDecider == 3 ? (
                    <View style={{
                        flex: 1,
                        paddingHorizontal: Constants.globalPaddingHorizontal
                    }}>
                        <UploadedFileViewer
                            isLoading={uploadingFile}
                            data={empFormValues.documents}
                            setNewData={(newArr) => {
                                handleInputChange(newArr, empFormKeys.documents)
                            }}
                        />
                        {/* UPLOAD */}
                        <TouchableOpacity
                            onPress={() => {
                                setActionSheetDecide(empFormKeys.attachment)
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
                                Keyboard.dismiss()
                                // console.log("empFormValues *******************", JSON.stringify(empFormValues))
                                let badWordString = getBadWordString();
                                //console.log('validation success')
                                if (badWordString) {
                                    Alert.showBasicDoubleAlertForBoth(badWordString, () => {
                                        addOrEditEmployeeAPI()
                                        // addOrEditPatientAPI(IgnorePersons, personList);
                                    }, null, messages.message_bad_word_alert)
                                }
                                else
                                    addOrEditEmployeeAPI()

                                // addOrEditEmployeeAPI()
                            }} title={labels["save"]} />
                    </View>
                    //    {/* <View style={styles.mainView}> */}
                    //         {/* <FormSubHeader
                    //             leftIconName={'chevron-back-circle-outline'}
                    //             onPressLeftIcon={() => {
                    //                 setViewDecider(2);
                    //             }}
                    //             title={labels.address}
                    //         /> */}
                    //         {/* Address Fields */}
                    //         {/* <AddressInputComp
                    //             validationObj={addressValidationObj}
                    //             formValues={empFormValues}
                    //             onPressIcon={key => {
                    //                 removeErrorTextForInputThatUserIsTyping(address, key);
                    //                 setActionSheetDecide(key);
                    //                 actionSheetRef.current?.setModalVisible();
                    //             }}
                    //             onChangeText={(text, key) => {
                    //                 removeErrorTextForInputThatUserIsTyping(address, key);
                    //                 handleInputChange(text, key);
                    //             }}
                    //             uniqueKeys={{
                    //                 country: empFormKeys.country,
                    //                 city: empFormKeys.city,
                    //                 zipCode: empFormKeys.zipCode,
                    //                 postalArea: empFormKeys.postalArea,
                    //                 full_address: empFormKeys.full_address,
                    //             }}
                    //         /> */}


                    //         {/* checkbox for seasonal */}
                    //         {/* save button */}
                    //         {/* <CustomButton
                    //             title={labels.save}
                    //             style={{
                    //                 marginTop: 15,
                    //             }}
                    //             onPress={() => {
                    //                 if (validation(address)) {
                    //                     console.log('validation success');
                    //                     addOrEditEmployeeAPI();
                    //                 } else console.log('validation fail');
                    //             }}
                    //         />

                    //     </View> */}
                ) : null}


                <DatePicker
                    modal
                    mode={mode}
                    open={openDatePicker}
                    minimumDate={new Date()}
                    date={new Date()}
                    onConfirm={date => {
                        setOpenDatePicker(false);
                        removeErrorTextForInputThatUserIsTyping(datePickerKey);
                        if (mode == Constants.DatePickerModes.date_mode)
                            handleInputChange(date, datePickerKey);
                        else if (mode == Constants.DatePickerModes.time_mode)
                            handleInputChange(date, datePickerKey);
                        else handleInputChange(date, datePickerKey);
                    }}
                    onCancel={() => {
                        setOpenDatePicker(false);
                    }}
                />

                <Portal>
                    <Modal
                        animationType="slide"
                        transparent={true}
                        style={{ justifyContent: 'center', alignItems: 'center' }}
                        visible={isModalVisible}
                        onRequestClose={() => {
                            setIsModalVisible(false);
                        }}>
                        <View style={{ padding: 20 }}>
                            <ColorPicker
                                ref={r => {
                                    picker = r;
                                }}
                                onColorChangeComplete={color => {
                                    handleInputChange(color, empFormKeys.color);
                                }}
                                color={empFormValues.color ?? Colors.primary}
                                thumbSize={40}
                                sliderSize={40}
                                noSnap={true}
                                row={false}
                            />
                            <CustomButton
                                onPress={() => {
                                    setIsModalVisible(false);
                                }}
                                title={labels["done"]}
                                style={{ marginTop: 20 }}
                            />
                        </View>
                    </Modal>
                </Portal>
            </KeyboardAwareScrollView>


            <ActionSheet ref={actionSheetRef}>
                {
                    actionSheetDecide == empFormKeys.attachment
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
                            // keyToShowData="name"
                            // keyToShowData={empFormKeys.roles ?  "se_name"  :"name"}
                            keyToShowData={actionSheetDecide == empFormKeys.roles ? "se_name" : "name"}
                            keyToCompareData="id"

                            // multiSelect
                            APIDetails={getAPIDetails()}
                            changeAPIDetails={payload => {
                                changeAPIDetails(payload);
                            }}

                            onPressItem={item => {
                                onPressItem(item);
                            }}
                        />
                }
            </ActionSheet>
        </BaseContainer>
    );
};

const styles = StyleSheet.create({
    buttonView: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-evenly',
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
        paddingHorizontal: Constants.globalPaddingHorizontal,
        paddingBottom: 15,
    },
    imageLogin: { width: '100%', height: 200, marginTop: 30 },
    welcomeText: {
        fontSize: getProportionalFontSize(24),
        marginTop: 30,
        color: Colors.primary,
        fontFamily: Assets.fonts.bold,
    },
    InputValidationView: {
        backgroundColor: Colors.transparent,
        //borderColor: 'red',
        marginTop: 15,
        //borderRadius: 10,
        //color: 'red'
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
    normalText: {
        color: Colors.primary,
        fontFamily: Assets.fonts.bold,
        fontSize: getProportionalFontSize(15),
    },
    inputStyle: {
        fontSize: getProportionalFontSize(16),
        borderColor: Colors.borderColor,
        backgroundColor: Colors.white,
    },
    checkBoxView: { flexDirection: 'row', alignItems: 'center', marginTop: Constants.formFieldTopMargin },
    saveAsTemplate: {
        fontSize: getProportionalFontSize(13),
        fontFamily: Assets.fonts.regular,
    },
    radioButtons: {
        // color: Colors.placeholderTextColor,
        // fontFamily: Assets.fonts.regular,
    },
    radioButtonView: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 15,
    },
    radioButtonLabel: {
        fontFamily: Assets.fonts.regular,
        fontSize: getProportionalFontSize(15),
    },
    badgeText: {
        fontFamily: Assets.fonts.semiBold,
        fontSize: getProportionalFontSize(12),
        color: Colors.gray,
        // marginLeft: 3, textAlign: "center",
        // width: "auto"
    },
    countView: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 5,

        marginTop: 15
    },
    badgeContainer: {
        backgroundColor: Colors.transparent,
        height: 24,
        borderRadius: 25,
        padding: 0,
        flexDirection: "row",
        alignItems: "center",
        // maxWidth: "33%",
        // width: "20%",
        borderWidth: 1,
        borderColor: Colors.gray,
        paddingHorizontal: 10,

    },
});
