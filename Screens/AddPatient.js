import React from 'react';
import {
    StyleSheet,
    TextInput,
    Text,
    View,
    TouchableOpacity,
    FlatList,
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
    firstLetterFromString,
    differenceInDays,
    getJSObjectFromTimeString,
    isDocOrImage,
    formatTimeForAPI,
    formatDateForAPI,
} from '../Services/CommonMethods';
import InputValidation from '../Components/InputValidation';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
// import { CommonActions } from '@react-navigation/native';
import APIService from '../Services/APIService';
import Constants from '../Constants/Constants';
import ProgressLoader from '../Components/ProgressLoader';
import { useSelector, useDispatch } from 'react-redux';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import DatePicker from 'react-native-date-picker';
import ActionSheet from 'react-native-actions-sheet';
import ActionSheetComp from '../Components/ActionSheetComp';
import { Modal, Portal, RadioButton, } from 'react-native-paper';
import ColorPicker from 'react-native-wheel-color-picker';
import CustomButton from '../Components/CustomButton';
import ErrorComp from '../Components/ErrorComp';
import Alert from '../Components/Alert';
import FormSubHeader from '../Components/FormSubHeader';
// import EmptyList from '../Components/EmptyList'
// import CommonCRUDCard from '../Components/CommonCRUDCard';
import AddressInputComp from '../Components/AddressInputComp';
import MSDataViewer from '../Components/MSDataViewer';
import PersonFormComp from '../Components/PersonFormComp';
import UploadedFileViewer from '../Components/UploadedFileViewer';
import Icon from 'react-native-vector-icons/Ionicons';
import Can from '../can/Can';
import CommonAPIFunctions from '../Services/CommonAPIFunctions';

//const labels = Constants.labels.app.implementationPlanForm;
let picker = null;

export default AddPatient = props => {
    const routeParams = props.route.params ?? {};

    // Constants
    const patientForm = 'patientForm';
    const personalDetail = 'personalDetails';
    const address = 'address';
    const decision = 'decision';
    const formFieldTopMargin = Constants.formFieldTopMargin;

    const week_days_data = [
        { name: 'S', number: 0, selected: false },
        { name: 'M', number: 1, selected: false },
        { name: 'T', number: 2, selected: false },
        { name: 'W', number: 3, selected: false },
        { name: 'T', number: 4, selected: false },
        { name: 'F', number: 5, selected: false },
        { name: 'S', number: 6, selected: false },
    ];
    const week_days_data1 = [
        { name: 'S', number: 0, selected: false },
        { name: 'M', number: 1, selected: false },
        { name: 'T', number: 2, selected: false },
        { name: 'W', number: 3, selected: false },
        { name: 'T', number: 4, selected: false },
        { name: 'F', number: 5, selected: false },
        { name: 'S', number: 6, selected: false },
    ];
    const week_days_data2 = [
        { name: 'S', number: 0, selected: false },
        { name: 'M', number: 1, selected: false },
        { name: 'T', number: 2, selected: false },
        { name: 'W', number: 3, selected: false },
        { name: 'T', number: 4, selected: false },
        { name: 'F', number: 5, selected: false },
        { name: 'S', number: 6, selected: false },
    ];

    //initialValues
    const patientInitialValues = {
        documents: [],
        // category: {},
        branch: {},
        department: {},
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
        regular: false,
        seasonal: false,
        substitute: false,
        verification_file_required: false,
        gov_id: '',
        disease_description: '',
        // weekly_hours_alloted_by_govt: "",
        postalArea: '',
        city: '',
        gov_agency: [],
        company_type: {},
        patient_type: [],
        from_timing: '',
        to_timing: '',
        institute_name: '',
        from_timing: '',
        company_name: '',
        assign_employee: false,
        employee: {},
        custom_unique_id: '',
        is_secret: false,
        // verification_file: "",
        social_security_number: '',
        aids: '',
        special_information: '',
        institute_contact_number: '',
        company_contact_number: '',
        institute_full_address: '',
        company_full_address: '',
        another_activity_name: '',
        activitys_contact_number: '',
        activitys_full_address: '',
        number_of_hours: '',
        issuer_name: '',
        period: '',
        week_days: "",//week_days_data,
        another_activity: {},
        classes_from: '',
        classes_to: '',
        agency_hours: [
            {
                assigned_hours: '',
                name: '',
                start_date: '',
                end_date: '',
                "assigned_hours_per_day": "",
                "assigned_hours_per_month": "",
                "assigned_hours_per_week": ""
            },
        ],
        institute_contact_person: '',
        institute_week_days: "",// week_days_data1,
        company_contact_person: '',
        company_week_days: "",//week_days_data2,
        another_activity_contact_person: '',
    };

    const initialDecisionValues = {
        assigned_hours: '',
        name: '',
        start_date: '',
        end_date: '',
    };
    // const initialDecisionKeys = {
    //     assigned_hours: 'assigned_hours',
    //     name: 'name',
    //     start_date: 'start_date',
    //     end_date: 'end_date',
    // };

    //uniqueKeys
    const patientFormKeys = {
        documents: 'documents',
        attachment: 'attachment',
        // category: "category",
        branch: 'branch',
        department: 'department',
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
        gov_id: 'gov_id',
        disease_description: 'disease_description',
        // weekly_hours_alloted_by_govt: "weekly_hours_alloted_by_govt",
        postalArea: 'postalArea',
        city: 'city',
        gov_agency: 'gov_agency',
        company_type: 'company_type',
        patient_type: 'patient_type',
        from_timing: 'from_timing',
        to_timing: 'to_timing',
        institute_name: 'institute_name',
        // from_timing: "from_timing",
        company_name: 'company_name',
        assign_employee: 'assign_employee',
        employee: 'employee',
        custom_unique_id: 'custom_unique_id',
        is_secret: 'is_secret',
        // verification_file: "verification_file",
        social_security_number: 'social_security_number',
        aids: 'aids',
        special_information: 'special_information',
        institute_contact_number: 'institute_contact_number',
        company_contact_number: 'company_contact_number',
        institute_full_address: 'institute_full_address',
        company_full_address: 'company_full_address',
        another_activity_name: 'another_activity_name',
        activitys_contact_number: 'activitys_contact_number',
        activitys_full_address: 'activitys_full_address',
        number_of_hours: 'number_of_hours',
        issuer_name: 'issuer_name',
        period: 'period',
        week_days: 'week_days',
        another_activity: 'another_activity',
        classes_from: 'classes_from',
        classes_to: 'classes_to',
        agency_hours: 'agency_hours',
        institute_contact_person: 'institute_contact_person',
        institute_week_days: 'institute_week_days',
        company_contact_person: 'company_contact_person',
        company_week_days: 'company_week_days',
        another_activity_contact_person: 'another_activity_contact_person',
        start_date: "start_date",
        end_date: 'end_date',

    };

    // Immutable Variables
    const initialValidationObj = {
        // [patientFormKeys.category]: {
        //     invalid: false,
        //     title: ''
        // },
        [patientFormKeys.patient_type]: {
            invalid: false,
            title: '',
        },

        // [patientFormKeys.institute_name]: {
        //     invalid: false,
        //     title: ''
        // },
        // [patientFormKeys.company_name]: {
        //     invalid: false,
        //     title: ''
        // },
        // [patientFormKeys.to_timing]: {
        //     invalid: false,
        //     title: ''
        // },
        // [patientFormKeys.from_timing]: {
        //     invalid: false,
        //     title: ''
        // },

        // [patientFormKeys.institute_contact_number]: {
        //     invalid: false,
        //     title: ''
        // },

        // [patientFormKeys.institute_full_address]: {
        //     invalid: false,
        //     title: ''
        // },

        // [patientFormKeys.company_contact_number]: {
        //     invalid: false,
        //     title: ''
        // },
        // [patientFormKeys.company_full_address]: {
        //     invalid: false,
        //     title: ''
        // },

        // [patientFormKeys.branch]: {
        //     invalid: false,
        //     title: ''
        // },
        // [patientFormKeys.department]: {
        //     invalid: false,
        //     title: ''
        // },
        // [patientFormKeys.company_type]: {
        //     invalid: false,
        //     title: ''
        // },

        // [patientFormKeys.gov_id]: {
        //     invalid: false,
        //     title: ''
        // },
        // [patientFormKeys.weekly_hours_alloted_by_govt]: {
        //     invalid: false,
        //     title: ''
        // },

        // [patientFormKeys.custom_unique_id]: {
        //     invalid: false,
        //     title: ''
        // },

        // [patientFormKeys.assign_employee]: {
        //     invalid: false,
        //     title: ''
        // },
        // [patientFormKeys.employee]: {
        //     invalid: false,
        //     title: ''
        // },
    };

    // const initialDecisionvalidationObj ={
    //     [patientFormKeys.agency_hours]: {
    //         invalid: false,
    //         title: '',
    //     },
    // }

    const initialPersonalValidationObj = {
        [patientFormKeys.name]: {
            invalid: false,
            title: '',
        },
        [patientFormKeys.personal_number]: {
            invalid: false,
            title: '',
        },
        [patientFormKeys.custom_unique_id]: {
            invalid: false,
            title: '',
        },
        // [patientFormKeys.social_security_number]: {
        //     invalid: false,
        //     title: ''
        // },
        [patientFormKeys.email]: {
            invalid: false,
            title: '',
        },
        [patientFormKeys.contact_number]: {
            invalid: false,
            title: '',
        },
        [patientFormKeys.gender]: {
            invalid: false,
            title: '',
        },
        // [patientFormKeys.disease_description]: {
        //     invalid: false,
        //     title: ''
        // },

        // [patientFormKeys.joining_date]: {
        //     invalid: false,
        //     title: ''
        // },
        // [patientFormKeys.gov_agency]: {
        //     invalid: false,
        //     title: ''
        // },
        [patientFormKeys.color]: {
            invalid: false,
            title: '',
        },
    };

    const initialDecisionvalidationObj = {
        [patientFormKeys.issuer_name]: {
            invalid: false,
            title: '',
        },
        [patientFormKeys.number_of_hours]: {
            invalid: false,
            title: '',
        },
        [patientFormKeys.start_date]: {
            invalid: false,
            title: '',
        },
        [patientFormKeys.end_date]: {
            invalid: false,
            title: '',
        },
    };

    const initialAddressValidationObj = {
        // [patientFormKeys.country]: {
        //     invalid: false,
        //     title: ''
        // },
        [patientFormKeys.full_address]: {
            invalid: false,
            title: '',
        },
        [patientFormKeys.postalArea]: {
            invalid: false,
            title: '',
        },
        [patientFormKeys.zipCode]: {
            invalid: false,
            title: '',
        },
        [patientFormKeys.city]: {
            invalid: false,
            title: '',
        },
    };

    // Hooks
    const actionSheetRef = React.useRef();

    // console.log('actionSheetRef------------------', actionSheetRef)

    // REDUX hooks
    const labels = useSelector(state => state.Labels);
    const UserLogin = useSelector(state => state.User.UserLogin);
    const messages = useSelector(state => state.Labels);
    const patient_type_labels = useSelector(state => state.Labels.patient_type);
    const permissions = UserLogin?.permissions ?? {};
    // console.log("UserLogin-------------", JSON.stringify(UserLogin))

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
    const otherActivityArr = [
        { name: labels.Short_term_stay, id: 1 },
        { name: labels.daily_activity, id: 2 },
        { name: labels.other, id: 3 },
    ];
    // useState hooks
    const [userRole, setUserRole] = React.useState({})
    const [week_days, setweek_days] = React.useState(week_days_data)
    const [institute_week_days, setinstitute_week_days] = React.useState(week_days_data1)
    const [company_week_days, setcompany_week_days] = React.useState(week_days_data2)
    // console.log(" initial institute_week_days", institute_week_days)
    const [validationObj, setValidationObj] = React.useState({
        ...initialValidationObj,
    });
    const [personalvalidationObj, setPersonalValidationObj] = React.useState({
        ...initialPersonalValidationObj,
    });

    const [decisionvalidationObj, setDecisionvalidationObj] = React.useState({
        ...initialDecisionvalidationObj,
    });

    const [addressvalidationObj, setAddressValidationObj] = React.useState({
        ...initialAddressValidationObj,
    });
    const [patientFormValues, setPatientFormValues] =
        React.useState(patientInitialValues);
    const [uploadingFile, setUploadingFile] = React.useState(false);
    // console.log("patientFormValues", patientFormValues)
    const [personList, setPersonList] = React.useState([]);
    const [isLoading, setIsLoading] = React.useState(false);
    const [openDatePicker, setOpenDatePicker] = React.useState(false);
    const [mode, setMode] = React.useState('');
    const [datePickerKey, setDatePickerKey] = React.useState(null);
    const [actionSheetDecide, setActionSheetDecide] = React.useState('');
    const [viewDecider, setViewDecider] = React.useState(1);
    const [isModalVisible, setIsModalVisible] = React.useState(false);
    const [isEditable, setIsEditable] = React.useState(true);
    const [isValid, setIsValid] = React.useState(true);
    const [isPersonFormVisible, setIsPersonFormVisible] = React.useState(false);
    const [personFormToInitialValue, setPersonFormToInitialValue] =
        React.useState(false);
    const [IgnorePersons, setIgnorePersons] = React.useState(false);
    // const [PersonsList, setPersonsList] = React.useState([]);
    const [decisionValues, setDecisionValues] = React.useState([
        initialDecisionValues,
    ]);
    const [howManyTimesArrIndexNKey, setHowManyTimesArrIndexNKey] =
        React.useState({
            index: '',
            key: '',
        });

    const [decisionIndex, setDecisionIndex] = React.useState();
    const [departmentAS, setDepartmentAS] = React.useState(
        getActionSheetAPIDetail({
            url: Constants.apiEndPoints.departmentList,
            debugMsg: 'departmentList',
            token: UserLogin.access_token,
            selectedData: [],
        }),
    );
    const [branchAS, setBranchAS] = React.useState(
        getActionSheetAPIDetail({
            url: Constants.apiEndPoints.userList,
            debugMsg: 'branchList',
            token: UserLogin.access_token,
            selectedData: [],
            params: { user_type_id: '11' },
        }),
    );
    const [categoryAS, setCategoryAS] = React.useState(
        getActionSheetAPIDetail({
            url: Constants.apiEndPoints.categoryList,
            debugMsg: 'categoryList',
            token: UserLogin.access_token,
            selectedData: [],
            params: { "category_type_id": "2", },
        }),
    );
    const [countryAS, setCountryAS] = React.useState(
        getActionSheetAPIDetail({
            url: Constants.apiEndPoints.countryList,
            debugMsg: 'countryList',
            token: UserLogin.access_token,
            selectedData: [],
            perPage: 100,
        }),
    );
    const [countryPersonAS, setCountryPersonAS] = React.useState(
        getActionSheetAPIDetail({
            url: Constants.apiEndPoints.countryList,
            debugMsg: 'countryPersonList',
            token: UserLogin.access_token,
            selectedData: [],
            perPage: 100,
        }),
    );
    const [genderAS, setGenderAS] = React.useState(
        getActionSheetAPIDetail({
            url: '',
            debugMsg: '',
            token: '',
            selectedData: [],
            data: genderDataArr,
        }),
    );
    const [agencyAS, setAgencyAS] = React.useState(
        getActionSheetAPIDetail({
            url: Constants.apiEndPoints.agencyList,
            debugMsg: 'agencyLISTING',
            token: UserLogin.access_token,
            selectedData: [],
        }),
    );
    const [companyTypeListAS, setCompanyTypeListAS] = React.useState(
        getActionSheetAPIDetail({
            url: Constants.apiEndPoints.companyTypeList,
            debugMsg: 'companyTypeList',
            token: UserLogin.access_token,
            selectedData: [],
        }),
    );
    const [patientTypeAS, setPatientTypeAS] = React.useState(
        getActionSheetAPIDetail({
            url: Constants.apiEndPoints.patientTypes,
            debugMsg: 'patientType',
            token: UserLogin.access_token,
            selectedData: [],
        }),
    );
    const [employeeAS, setEmployeeAS] = React.useState(
        getActionSheetAPIDetail({
            url: Constants.apiEndPoints.userList,
            params: { user_type_id: '3' },
            debugMsg: 'employee-list',
            token: UserLogin.access_token,
            perPage: Constants.perPage,
            selectedData: patientFormValues.employee
                ? [patientFormValues[patientFormKeys.employee]]
                : [],
        }),
    );
    const [otherActivityAS, setOtherActivityAS] = React.useState(
        getActionSheetAPIDetail({
            url: '',
            debugMsg: '',
            token: '',
            selectedData: [],
            data: otherActivityArr,
        }),
    );

    // BadWords & Suggetion

    const [suggestion, setSuggestion] = React.useState([]);
    const [badWords, setBadWords] = React.useState([]);
    const [descrptionSuggestion, setDescrptionSuggestion] = React.useState([]);
    const [full_address, setFull_address] = React.useState([]);
    const [activitys_full_address, setActivitys_full_address] = React.useState([]);
    const [institute_full_address, setInstitute_full_address] = React.useState([]);

    const [disease_description, setDisease_description] = React.useState([]);
    const [aids, setAids] = React.useState([]);
    const [special_information, setSpecial_information] = React.useState([]);


    // useEffect hooks
    React.useEffect(() => {
        CommonAPIFunctions.getSuggestions(UserLogin.access_token, (data) => { setSuggestion(data) });
        CommonAPIFunctions.getBadWords(UserLogin.access_token, (data) => { setBadWords(data) });
        // userDetailAPI()

    }, [])

    // useEffect hooks
    React.useEffect(() => {
        if (routeParams.patientId) userDetailAPI();
        getRole()
    }, []);
    const getRole = async () => {
        setIsLoading(true);
        let url = Constants.apiEndPoints.roles;
        let response = await APIService.postData(url, {}, UserLogin.access_token, null, "UserRolesAPI");
        if (!response.errorMsg) {
            let newData = []
            if (response?.data?.payload) { newData = response?.data?.payload.filter(obj => obj.user_type_id == 6) }
            setUserRole(newData[0])
            setIsLoading(false);
        }
        else {
            setIsLoading(false);
            // Alert.showAlert(Constants.danger, response.errorMsg);
        }
    }

    const calculateHours = (index = howManyTimesArrIndexNKey.index) => {
        let tempData = [...patientFormValues.agency_hours];
        let { start_date, end_date, assigned_hours_per_day } = tempData?.[index]
        let totalDays = differenceInDays(start_date, end_date)
        let perDayHours = 0
        if (Number(totalDays) > 0) {
            perDayHours = (Number(tempData[index]["assigned_hours"]) / Number(totalDays))
        } else {
            perDayHours = Number(tempData[index]["assigned_hours"])
        }
        tempData[index]["assigned_hours_per_day"] = perDayHours.toFixed(2)
        tempData[index]["assigned_hours_per_week"] = (perDayHours * 7).toFixed(2)
        tempData[index]["assigned_hours_per_month"] = (perDayHours * 30).toFixed(2)
        setPatientFormValues({ ...patientFormValues, [patientFormKeys.agency_hours]: tempData });
    }
    const handleInputChange = (form, value, key) => {
        // console.log('key', key, 'value', value);
        if (key == patientFormKeys.agency_hours) {
            let tempData = [...patientFormValues.agency_hours];

            tempData[howManyTimesArrIndexNKey.index][howManyTimesArrIndexNKey.key] = value;
            setPatientFormValues({ ...patientFormValues, [key]: tempData });
            let { assigned_hours, start_date, end_date } = tempData[howManyTimesArrIndexNKey.index]
            if (assigned_hours && start_date && end_date) {
                calculateHours()
            }

        } else setPatientFormValues({ ...patientFormValues, [key]: value });
    };
    const closeActionSheet = () => {
        setActionSheetDecide('');
        actionSheetRef?.current?.setModalVisible();
    };

    const removeErrorTextForInputThatUserIsTyping = (form, uniqueKey) => {
        if (form == patientForm) {
            let tempValidationObj = { ...validationObj };
            tempValidationObj[uniqueKey] = initialValidationObj[uniqueKey];
            setValidationObj(tempValidationObj);
        } else if (form == personalDetail) {
            let tempValidationObj = { ...personalvalidationObj };
            tempValidationObj[uniqueKey] = initialPersonalValidationObj[uniqueKey];
            setPersonalValidationObj(tempValidationObj);
        } else if (form == address) {
            let tempValidationObj = { ...addressvalidationObj };
            tempValidationObj[uniqueKey] = initialAddressValidationObj[uniqueKey];
            setAddressValidationObj(tempValidationObj);
        }
        else if (form == decision) {
            setDecisionvalidationObj({ ...initialDecisionvalidationObj })
        }
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

            if (patientFormValues?.name?.toLowerCase()?.includes(currBadWord)
                || patientFormValues?.full_address?.toLowerCase()?.includes(currBadWord)
                || patientFormValues?.disease_description?.toLowerCase()?.includes(currBadWord)
                || patientFormValues?.aids?.toLowerCase()?.includes(currBadWord)
                || patientFormValues?.another_activity_contact_person?.toLowerCase()?.includes(currBadWord)
                || patientFormValues?.another_activity_name?.toLowerCase()?.includes(currBadWord)
                || patientFormValues?.activitys_full_address?.toLowerCase()?.includes(currBadWord)
                || patientFormValues?.issuer_name?.toLowerCase()?.includes(currBadWord)
                || patientFormValues?.special_information?.toLowerCase()?.includes(currBadWord)
                || patientFormValues?.institute_name?.toLowerCase()?.includes(currBadWord)
                || patientFormValues?.institute_full_address?.toLowerCase()?.includes(currBadWord)
                || patientFormValues?.disease_description?.toLowerCase()?.includes(currBadWord)
                || patientFormValues?.aids?.toLowerCase()?.includes(currBadWord)
                || patientFormValues?.special_information?.toLowerCase()?.includes(currBadWord)
            ) {
                if (!result?.toLowerCase()?.includes(currBadWord))
                    result = result + badWords[i]?.name + ", ";
            }
        }
        if (result)
            result = result?.substring(0, result?.length - 2);
        return result;
    }


    const userDetailAPI = async () => {
        setIsLoading(true);
        let url = Constants.apiEndPoints.userView + '/' + routeParams.patientId;
        let response = {};
        response = await APIService.getData(url, UserLogin.access_token, null, 'userDetailAPI',);

        let week_days_from_api = [];
        if (response.data.payload?.patient_information?.week_days) {
            week_days_from_api = await JSON.parse(response.data.payload.patient_information.week_days)
        }


        let temp_week_days = [...week_days_data];
        week_days_from_api?.map(num => {
            temp_week_days.map(obj => {
                if (obj.number == num) obj['selected'] = true;
            });
        });

        function getWeekDaysFormate(days_from_api) {
            let temp_week_days = [...week_days_data1];
            if (days_from_api) {
                if (days_from_api.length > 0) {
                    days_from_api?.map(num => {
                        temp_week_days.map(obj => {
                            if (obj.number == num) obj['selected'] = true;
                        });
                    });
                }
            }
            return temp_week_days;
        }
        function getWeekDaysFormate1(days_from_api) {
            // console.log("testing data here ---", days_from_api)
            let temp_week_days = [...week_days_data2];
            if (days_from_api) {
                if (days_from_api.length > 0) {
                    days_from_api?.map(num => {
                        temp_week_days.map(obj => {
                            if (obj.number == num) obj['selected'] = true;
                        });
                    });
                }
            }
            // console.log("testing data here ---", temp_week_days)
            return temp_week_days;
        }

        let selectedOtherActivityAS = [];
        if (response?.data?.payload?.patient_information?.another_activity) {
            let allOtherActivityArr = otherActivityArr;
            allOtherActivityArr.map(obj => {
                if (
                    response?.data?.payload?.patient_information?.another_activity == obj.name
                ) {
                    selectedOtherActivityAS.push(obj);
                }
            });
        }

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

            setPatientFormValues({
                branch: response.data.payload.branch ?? {},
                // department: response.data.payload.department,
                name: response.data.payload.name,
                email: response.data.payload.email,
                contact_number: response.data.payload.contact_number,
                personal_number: response.data.payload.personal_number,
                gender:
                    genderObjWhileGetting[response.data.payload.gender.toLowerCase()],
                full_address: response.data.payload.full_address,
                // joining_date: response.data.payload.joining_date,
                color: response.data.payload.user_color,
                country: response.data.payload.country,
                // password: { name: "", visible: false },
                // confirmPassword: { name: "", visible: false },
                zipCode: response.data.payload.zipcode,
                category: response.data.payload.category_master,
                weekly_hours_alloted_by_govt:
                    response.data.payload.weekly_hours_alloted_by_govt,
                disease_description: response.data.payload.disease_description,
                // gov_id: response.data.payload.govt_id,
                gov_agency: response.data.payload.agency_hours,
                patient_type: response?.data?.payload?.patient_types,
                //company_type: response.data.payload?.company_types.length > 0 ? response.data.payload?.company_types[0] : {},
                institute_name: response.data.payload?.patient_information?.institute_name,
                company_name: response.data.payload?.patient_information.company_name,
                from_timing: response.data.payload?.patient_information.from_timing ? getJSObjectFromTimeString(response.data.payload?.patient_information.from_timing) : "",
                to_timing: response.data.payload?.patient_information.to_timing ? getJSObjectFromTimeString(response.data.payload?.patient_information.to_timing) : "",
                city: response.data.payload.city,
                postalArea: response.data.payload.postal_area,
                custom_unique_id: response.data.payload.custom_unique_id,
                is_secret: response.data.payload.is_secret == 1 ? true : false,
                institute_contact_number: response?.data?.payload?.patient_information?.institute_contact_number ?? '',
                // response?.data?.payload?.institute_contact_number,
                institute_full_address: response?.data?.payload?.patient_information?.institute_full_address,
                classes_from: response?.data?.payload?.patient_information?.classes_from ? getJSObjectFromTimeString(response?.data?.payload?.patient_information?.classes_from) : "",
                classes_to: response?.data?.payload?.patient_information?.classes_to ? getJSObjectFromTimeString(response?.data?.payload?.patient_information?.classes_to) : "",
                company_contact_number: response?.data?.payload?.patient_information?.company_contact_number,
                company_full_address: response?.data?.payload?.patient_information?.company_full_address,
                documents: tempDocuments,
                // assign_employee: false,
                // employee: "",
                aids: response?.data?.payload?.patient_information?.aids ?? '',
                special_information:
                    response?.data?.payload?.patient_information.special_information ??
                    '',
                another_activity_name:
                    response?.data?.payload?.patient_information?.another_activity_name ??
                    '',
                activitys_contact_number:
                    response?.data?.payload?.patient_information
                        ?.activitys_contact_number ?? '',
                activitys_full_address:
                    response?.data?.payload?.patient_information
                        ?.activitys_full_address ?? '',
                number_of_hours:
                    response?.data?.payload?.patient_information?.number_of_hours ?? '',
                issuer_name:
                    response?.data?.payload?.patient_information?.issuer_name ?? '',
                period: response?.data?.payload?.patient_information?.period ?? '',
                week_days: [...temp_week_days],
                another_activity: selectedOtherActivityAS[0] ?? {},
                disease_description: response.data.payload.disease_description,
                agency_hours: response.data.payload.agency_hours,
                institute_contact_person: response?.data?.payload?.patient_information?.institute_contact_person ?? '',
                institute_week_days: getWeekDaysFormate(JSON.parse(response?.data?.payload?.patient_information?.institute_week_days)),
                company_contact_person:
                    response?.data?.payload?.patient_information
                        ?.company_contact_person ?? '',
                company_week_days: getWeekDaysFormate1(JSON.parse(response?.data?.payload?.patient_information?.company_week_days)),
                another_activity_contact_person:
                    response?.data?.payload?.patient_information
                        ?.another_activity_contact_person ?? '',
            });
            setweek_days(temp_week_days);
            let institute_week_days_temp = getWeekDaysFormate(JSON.parse(response?.data?.payload?.patient_information?.institute_week_days))
            setinstitute_week_days(institute_week_days_temp)
            let company_week_days_temp = getWeekDaysFormate1(JSON.parse(response?.data?.payload?.patient_information?.company_week_days))
            setcompany_week_days(company_week_days_temp)
            setPersonList(response.data.payload.persons);
            // console.log("=======================response.data.payload.patient_types===================", response.data.payload.patient_types)
            setPatientTypeAS({
                ...patientTypeAS,
                selectedData: response.data.payload.patient_types,
            });
            setAgencyAS({
                ...agencyAS,
                selectedData: response.data.payload.agency_hours,
            });
            //setDepartmentAS({ ...departmentAS, selectedData: [response.data.payload.department] })
            setBranchAS({
                ...branchAS,
                selectedData: response.data.payload.branch
                    ? [response.data.payload.branch]
                    : [],
            });
            setCountryAS({
                ...countryAS,
                selectedData: [response.data.payload.country],
            });
            setGenderAS({
                ...genderAS,
                selectedData: [
                    genderObjWhileGetting[response.data.payload.gender.toLowerCase()],
                ],
            });
            setCategoryAS({
                ...categoryAS,
                selectedData: [response.data.payload.category_master],
            });
            // setEmployeeAS({ ...employeeAS, selectedData: [response.data.payload.employee] })
            setOtherActivityAS({
                ...otherActivityAS,
                selectedData: [...selectedOtherActivityAS],
            });
            // setDecisionValues(response.data.payload.agency_hours)
            setIsLoading(false);
        } else {
            setIsLoading(false);
            Alert.showAlert(Constants.danger, response.errorMsg);
        }
    };

    const validation = form => {
        // return true;
        if (form == patientForm) {
            let validationObjTemp = { ...initialValidationObj };
            // console.log('validationObjTemp', validationObjTemp);
            let isValid = true;
            for (const [key, value] of Object.entries(validationObjTemp)) {
                /////
                if (key == patientFormKeys.patient_type) {
                    if (patientFormValues?.patient_type?.length == 0) {
                        // console.log('a1', key);
                        // value['invalid'] = true;
                        // value['title'] = labels[key + '_required'];
                        // isValid = false;
                        // break;
                    }

                    // else if (key == patientFormKeys.patient_type) {
                    //     if (patientFormValues.patient_type?.length == 0) {

                    //         console.log('9', key)
                    //         value['invalid'] = true;
                    //         value['title'] = labels.gov_agency_valid_message
                    //         isValid = false;
                    //         break;

                    //     }
                    // }
                    patientFormValues?.patient_type?.map(val => {
                        if (val.designation == patient_type_labels.student) {
                            // if (!patientFormValues?.institute_name) {
                            //     console.log('a2', key)
                            //     validationObjTemp[patientFormKeys?.institute_name]['invalid'] = true;
                            //     validationObjTemp[patientFormKeys?.institute_name]['title'] = labels.institute_name_required
                            //     setValidationObj({ ...validationObjTemp });
                            //     return;
                            // }
                            // if (!patientFormValues?.institute_contact_number) {
                            //     console.log('a4', key)
                            //     validationObjTemp[patientFormKeys?.institute_contact_number]['invalid'] = true;
                            //     validationObjTemp[patientFormKeys?.institute_contact_number]['title'] = labels.contact_number_required
                            //     setValidationObj({ ...validationObjTemp });
                            //     return;
                            // // }
                            // if (!checkMobileNumberFormat(ReplaceAll(patientFormValues?.institute_contact_number, ' ', ''))) {
                            //     console.log('a5', key)
                            //     validationObjTemp[patientFormKeys?.institute_contact_number]['invalid'] = true;
                            //     validationObjTemp[patientFormKeys?.institute_contact_number]['title'] = labels.contact_number_invalid
                            //     setValidationObj({ ...validationObjTemp });
                            //     return;
                            // }
                            // if (!patientFormValues?.institute_full_address) {
                            //     console.log('a5.1', key)
                            //     validationObjTemp[patientFormKeys?.institute_full_address]['invalid'] = true;
                            //     validationObjTemp[patientFormKeys?.institute_full_address]['title'] = labels.full_address_required
                            //     setValidationObj({ ...validationObjTemp });
                            //     return;
                            // }
                            // if (!patientFormValues?.from_timing) {
                            //     console.log('a6', key)
                            //     validationObjTemp[patientFormKeys?.from_timing]['invalid'] = true;
                            //     validationObjTemp[patientFormKeys?.from_timing]['title'] = labels.classes_from_required
                            //     setValidationObj({ ...validationObjTemp });
                            //     return;
                            // }
                            // if (!patientFormValues?.to_timing) {
                            //     console.log('a7', key)
                            //     validationObjTemp[patientFormKeys?.to_timing]['invalid'] = true;
                            //     validationObjTemp[patientFormKeys?.to_timing]['title'] = labels.classes_to_required
                            //     setValidationObj({ ...validationObjTemp });
                            //     return;
                            // }
                        } else if (val.designation == patient_type_labels.working) {
                            // if (!patientFormValues.company_name) {
                            //     console.log('a8', key)
                            //     validationObjTemp[patientFormKeys?.company_name]['invalid'] = true;
                            //     validationObjTemp[patientFormKeys?.company_name]['title'] = labels.company_name_required
                            //     setValidationObj({ ...validationObjTemp });
                            //     return;
                            // }
                            // if (!patientFormValues?.company_contact_number) {
                            //     console.log('a4', key)
                            //     validationObjTemp[patientFormKeys?.company_contact_number]['invalid'] = true;
                            //     validationObjTemp[patientFormKeys?.company_contact_number]['title'] = labels.contact_number_required
                            //     setValidationObj({ ...validationObjTemp });
                            //     return;
                            // }
                            // if (!checkMobileNumberFormat(ReplaceAll(patientFormValues?.company_contact_number, ' ', ''))) {
                            //     console.log('a5', key)
                            //     validationObjTemp[patientFormKeys?.company_contact_number]['invalid'] = true;
                            //     validationObjTemp[patientFormKeys?.company_contact_number]['title'] = labels.contact_number_invalid
                            //     setValidationObj({ ...validationObjTemp });
                            //     return;
                            // }
                            // if (!patientFormValues?.company_full_address) {
                            //     console.log('a5.1', key)
                            //     validationObjTemp[patientFormKeys?.company_full_address]['invalid'] = true;
                            //     validationObjTemp[patientFormKeys?.company_full_address]['title'] = labels.full_address_required
                            //     setValidationObj({ ...validationObjTemp });
                            //     return;
                            // }
                            // if (!patientFormValues?.from_timing) {
                            //     console.log('a9', key)
                            //     validationObjTemp[patientFormKeys?.from_timing]['invalid'] = true;
                            //     validationObjTemp[patientFormKeys?.from_timing]['title'] = labels.shift_timing_from_required
                            //     setValidationObj({ ...validationObjTemp });
                            //     return;
                            // }
                            // if (!patientFormValues?.to_timing) {
                            //     console.log('a10', key)
                            //     validationObjTemp[patientFormKeys?.to_timing]['invalid'] = true;
                            //     validationObjTemp[patientFormKeys?.to_timing]['title'] = labels.shift_timing_to_required
                            //     setValidationObj({ ...validationObjTemp });
                            //     return;
                            // }
                        }
                    });
                }
                // else if (key == patientFormKeys.to_timing) {
                //     console.log("")
                //     if (patientFormValues[key] && patientFormValues[patientFormKeys.from_timing]) {
                //         if (patientFormValues[key]?.getHours() <= patientFormValues[patientFormKeys.from_timing]?.getHours()) {
                //             if (patientFormValues[key]?.getHours() == patientFormValues[patientFormKeys.from_timing]?.getHours()) {
                //                 if (patientFormValues[key]?.getMinutes() == patientFormValues[patientFormKeys.from_timing]?.getMinutes()) {
                //                     value['invalid'] = true;
                //                     value['title'] = labels['from_time_invalid_msg'];
                //                     isValid = false;
                //                     break;
                //                 }
                //             }
                //             else {
                //                 value['invalid'] = true;
                //                 value['title'] = labels['from_time_invalid_msg'];
                //                 isValid = false;
                //                 break;
                //             }
                //         }
                //     }
                // }
                else if (key == patientFormKeys.classes_to) {
                    if (patientFormValues[key] && patientFormValues[patientFormKeys.classes_from]) {
                        if (patientFormValues[key]?.getTime && patientFormValues[patientFormKeys.classes_from]?.getTime && patientFormValues[key]?.getTime() <= patientFormValues[patientFormKeys.classes_from]?.getTime()) {
                            value['invalid'] = true;
                            value['title'] = labels['classess_time_invalid_msg'];
                            isValid = false;
                            break;
                        }
                    }
                }
                // else if(patientFormKeys.to_timing==key)
                // {
                //     if(patientFormValues.to_timing && patientFormValues.from_timing)
                //     {
                //         if( formatTime(patientFormValues.to_timing) == formatTime)
                //     }

                //     value['invalid'] = true;
                //     value['title'] = labels[key + '_required'];
                //     isValid = false;
                //     break;
                // }

                // else if (key == patientFormKeys?.custom_unique_id) {
                // console.log('ddddddddddddddddddddddddddddddddd---------------------------' + patientFormKeys.custom_unique_id)
                //     if (!patientFormValues[key]) {
                //         value['invalid'] = true;
                //         value['title'] = labels[key + '_required']
                //         isValid = false;
                //         break;
                //     }
                // }

                // else if (key == patientFormKeys.gov_agency) {
                //     if (patientFormValues.gov_agency?.length <= 0) {
                //         console.log('8', key)
                //         // value['invalid'] = true;
                //         // value['title'] = labels[key + '_required']
                //         // isValid = false;
                //         break;
                //     }
                //     else {
                //         let flag = false;
                //         patientFormValues.gov_agency.map((obj) => {
                //             if (!obj.assigned_hours || obj.assigned_hours <= 0)
                //                 flag = true;
                //         })
                //         if (flag) {
                //             console.log('9', key)
                //             value['invalid'] = true;
                //             value['title'] = labels.gov_agency_valid_message
                //             isValid = false;
                //             break;
                //         }
                //     }
                // }
                else if (
                    key == patientFormKeys?.assign_employee &&
                    patientFormValues?.assign_employee == true
                ) {
                    if (
                        !patientFormValues?.employee ||
                        patientFormValues?.employee == ''
                    ) {
                        // console.log('9.5', key);
                        validationObjTemp[patientFormKeys?.employee]['invalid'] = true;
                        validationObjTemp[patientFormKeys?.employee]['title'] =
                            labels.employee_name_required;
                        setValidationObj({ ...validationObjTemp });
                        return;
                    }
                } else if (
                    key == patientFormKeys?.from_timing ||
                    key == patientFormKeys?.to_timing ||
                    key == patientFormKeys?.institute_name ||
                    key == patientFormKeys?.company_name ||
                    key == patientFormKeys?.employee ||
                    key == patientFormKeys?.institute_contact_number ||
                    key == patientFormKeys?.institute_full_address ||
                    key == patientFormKeys?.company_contact_number ||
                    key == patientFormKeys?.company_full_address
                ) {
                } else if (
                    (typeof patientFormValues[key] == 'object' &&
                        !patientFormValues[key]?.name) ||
                    (typeof patientFormValues[key] == 'string' && !patientFormValues[key])
                ) {
                    // console.log('10', key);
                    value['invalid'] = true;
                    value['title'] = labels[key + '_required'];
                    isValid = false;
                    break;
                }
            }
            //

            setValidationObj({ ...validationObjTemp });
            return isValid;
        } else if (form == personalDetail) {
            let validationObjTemp = { ...initialPersonalValidationObj };
            let isValid = true;
            for (const [key, value] of Object.entries(validationObjTemp)) {
                if (key == patientFormKeys.email) {
                    if (
                        !patientFormValues[key] ||
                        !checkEmailFormat(patientFormValues[key])
                    ) {
                        // console.log('1', key);
                        value['invalid'] = true;
                        value['title'] = labels[key + '_required'];
                        isValid = false;
                        break;
                    }
                } else if (
                    key == patientFormKeys.personal_number &&
                    patientFormValues.key != ''
                ) {
                    let temp = ReplaceAll(patientFormValues[key], '-', '');
                    if (temp.length < 12) {
                        // console.log('2', key);
                        value['invalid'] = true;
                        value['title'] = labels['enter_valid_personal_number'];
                        isValid = false;
                        break;
                    }
                } else if (key == patientFormKeys.contact_number) {
                    if (!patientFormValues[key]) {
                        // console.log('3', key);
                        value['invalid'] = true;
                        value['title'] = labels[key + '_required'];
                        isValid = false;
                        break;
                    } else if (
                        !checkMobileNumberFormat(
                            ReplaceAll(patientFormValues[key], ' ', ''),
                        )
                    ) {
                        // console.log('4', key);
                        value['invalid'] = true;
                        value['title'] = labels['enter_valid_contact_number'];
                        isValid = false;
                        break;
                    }
                } else if (key == patientFormKeys?.gov_agency) {
                    if (patientFormValues?.gov_agency?.length > 0) {
                        let flag = false;
                        patientFormValues?.gov_agency.map(obj => {
                            if (
                                !obj.assigned_hours ||
                                obj.assigned_hours <= 0
                            )
                                flag = true;
                        });
                        if (flag) {
                            // console.log('9', key);
                            value['invalid'] = true;
                            value['title'] = labels.gov_agency_valid_message;
                            isValid = false;
                            break;
                        }
                    }
                } else if (key == patientFormKeys.joining_date) {
                    if (!patientFormValues[key]) {
                        // console.log('5', key);
                        // value['invalid'] = true;
                        // value['title'] = labels[key + '_required']
                        // isValid = false;
                        break;
                    }
                } else if (
                    (typeof patientFormValues[key] == 'object' &&
                        !patientFormValues[key]?.name) ||
                    (typeof patientFormValues[key] == 'string' && !patientFormValues[key])
                ) {
                    // console.log('6', key);
                    value['invalid'] = true;
                    value['title'] = labels[key + '_required'];
                    isValid = false;
                    break;
                }
            }
            setPersonalValidationObj({ ...validationObjTemp });
            return isValid;
        } else if (form == address) {
            let validationObjTemp = { ...initialAddressValidationObj };
            let isValid = true;
            for (const [key, value] of Object.entries(validationObjTemp)) {
                if (
                    key == patientFormKeys.zipCode &&
                    patientFormValues[key] != '' &&
                    patientFormValues[key].length < 5
                ) {
                    // console.log('222', key);
                    value['invalid'] = true;
                    value['title'] = labels[key + '_is_not_vailid'];
                    isValid = false;
                    break;
                }
                if (
                    (typeof patientFormValues[key] == 'object' &&
                        !patientFormValues[key]?.name) ||
                    (typeof patientFormValues[key] == 'string' && !patientFormValues[key])
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
        } else if (form == decision) {
            let validationObjTemp = { ...initialDecisionvalidationObj };
            let isValid = true;
            for (const [key, value] of Object.entries(validationObjTemp)) {
                let flag = false
                patientFormValues.agency_hours.map((obj) => {
                    if (obj.assigned_hours == "" || obj.name == "" || obj.start_date == "" || obj.end_date == "") {
                        flag = true
                    }
                })
                if (flag) {
                    // console.log('1A')
                    value['invalid'] = true;
                    value['title'] = "field Required"
                    //console.log(labels[(key + '_required')]);
                    isValid = false;
                    break;
                }
            }
            setDecisionvalidationObj({ ...validationObjTemp });
            return isValid;
        }
    };

    const getAPIDetails = () => {
        switch (actionSheetDecide) {
            case patientFormKeys.department: {
                return departmentAS;
            }
            case patientFormKeys.branch: {
                return branchAS;
            }
            // case patientFormKeys.employee_type: {
            //     return employeeTypeAS
            // }
            case patientFormKeys.country: {
                return countryAS;
            }
            case patientFormKeys.gender: {
                return genderAS;
            }
            case patientFormKeys.category: {
                return categoryAS;
            }
            case patientFormKeys.company_type: {
                return companyTypeListAS;
            }
            case patientFormKeys.gov_agency: {
                return agencyAS;
            }
            case patientFormKeys.patient_type: {
                return patientTypeAS;
            }
            case patientFormKeys.employee: {
                return employeeAS;
            }
            case 'countryPerson': {
                return countryPersonAS;
            }
            case patientFormKeys.another_activity: {
                return otherActivityAS;
            }
            default: {
                return null;
            }
        }
    };

    const changeAPIDetails = payload => {
        switch (actionSheetDecide) {
            case patientFormKeys.department: {
                setDepartmentAS(getActionSheetAPIDetail({ ...departmentAS, ...payload }));
                break;
            }
            case patientFormKeys.branch: {
                setBranchAS(getActionSheetAPIDetail({ ...branchAS, ...payload }));
                break;
            }
            // case patientFormKeys.employee_type: {
            //     setEmployeeTypeAS(getActionSheetAPIDetail({ ...employeeTypeAS, ...payload }))
            //     break;
            // }
            case patientFormKeys.country: {
                setCountryAS(getActionSheetAPIDetail({ ...countryAS, ...payload }));
                break;
            }
            case patientFormKeys.gender: {
                setGenderAS(getActionSheetAPIDetail({ ...genderAS, ...payload }));
                break;
            }
            case patientFormKeys.category: {
                setCategoryAS(getActionSheetAPIDetail({ ...categoryAS, ...payload }));
                break;
            }
            case patientFormKeys.gov_agency: {
                setAgencyAS(getActionSheetAPIDetail({ ...agencyAS, ...payload }));
                break;
            }
            case patientFormKeys.company_type: {
                setCompanyTypeListAS(
                    getActionSheetAPIDetail({ ...companyTypeListAS, ...payload }),
                );
                break;
            }
            case patientFormKeys.patient_type: {
                setPatientTypeAS(
                    getActionSheetAPIDetail({ ...patientTypeAS, ...payload }),
                );
                break;
            }
            case patientFormKeys.employee: {
                setEmployeeAS(getActionSheetAPIDetail({ ...employeeAS, ...payload }));
                break;
            }
            case 'countryPerson': {
                setCountryPersonAS(
                    getActionSheetAPIDetail({ ...countryPersonAS, ...payload }),
                );
                break;
            }
            case patientFormKeys.another_activity: {
                setOtherActivityAS(
                    getActionSheetAPIDetail({ ...otherActivityAS, ...payload }),
                );
                break;
            }
            default: {
                break;
            }
        }
    };

    const onPressItem = item => {
        switch (actionSheetDecide) {
            case patientFormKeys.department: {
                handleInputChange(patientForm, item, patientFormKeys.department);
                removeErrorTextForInputThatUserIsTyping(
                    patientForm,
                    patientFormKeys.department,
                );
                break;
            }
            case patientFormKeys.branch: {
                // console.log('---------', item);
                handleInputChange(patientForm, item, patientFormKeys.branch);
                removeErrorTextForInputThatUserIsTyping(
                    patientForm,
                    patientFormKeys.branch,
                );
                break;
            }
            case patientFormKeys.employee_type: {
                handleInputChange(patientForm, item, patientFormKeys.employee_type);
                removeErrorTextForInputThatUserIsTyping(
                    patientForm,
                    patientFormKeys.employee_type,
                );
                break;
            }
            case patientFormKeys.country: {
                handleInputChange(patientForm, item, patientFormKeys.country);
                removeErrorTextForInputThatUserIsTyping(
                    patientForm,
                    patientFormKeys.country,
                );
                break;
            }
            case patientFormKeys.gender: {
                handleInputChange(patientForm, item, patientFormKeys.gender);
                removeErrorTextForInputThatUserIsTyping(
                    patientForm,
                    patientFormKeys.gender,
                );
                break;
            }
            case patientFormKeys.category: {
                handleInputChange(patientForm, item, patientFormKeys.category);
                removeErrorTextForInputThatUserIsTyping(
                    patientForm,
                    patientFormKeys.category,
                );
                break;
            }
            case patientFormKeys.gov_agency: {
                handleInputChange(patientForm, item, patientFormKeys.gov_agency);
                removeErrorTextForInputThatUserIsTyping(
                    patientForm,
                    patientFormKeys.gov_agency,
                );
                break;
            }
            case patientFormKeys.company_type: {
                handleInputChange(patientForm, item, patientFormKeys.company_type);
                removeErrorTextForInputThatUserIsTyping(
                    patientForm,
                    patientFormKeys.company_type,
                );
                break;
            }
            case patientFormKeys.patient_type: {
                setPatientFormValues({
                    ...patientFormValues,
                    [patientFormKeys.patient_type]: item,
                    [patientFormKeys.company_name]: '',
                    [patientFormKeys.institute_name]: '',
                    [patientFormKeys.from_timing]: '',
                    [patientFormKeys.to_timing]: '',
                });
                //handleInputChange(patientForm, item, patientFormKeys.patient_type)
                removeErrorTextForInputThatUserIsTyping(
                    patientForm,
                    patientFormKeys.patient_type,
                );
                break;
            }
            case patientFormKeys.employee: {
                handleInputChange(patientForm, item, patientFormKeys.employee);
                removeErrorTextForInputThatUserIsTyping(
                    patientForm,
                    patientFormKeys.employee,
                );
                break;
            }
            case 'countryPerson': {
                handleInputChange(personForm, item, personFormKeys.country);
                removeErrorTextForInputThatUserIsTyping(
                    personForm,
                    personFormKeys.country,
                );
                break;
            }
            case patientFormKeys.another_activity: {
                handleInputChange(patientForm, item, patientFormKeys.another_activity);
                // removeErrorTextForInputThatUserIsTyping(patientForm, patientFormKeys.another_activity)
                break;
            }
            default: {
                break;
            }
        }
    };

    const isMultiSelect = () => {
        switch (actionSheetDecide) {
            case patientFormKeys.gov_agency: {
                return true;
            }
            case patientFormKeys.patient_type: {
                return true;
            }
            default: {
                return false;
            }
        }
    };
    const uploadFile = async attachmentArr => {
        // if (!checkFileSize(attachmentObj))
        //     return;
        setUploadingFile(true);
        let res = await APIService.uploadFile(
            Constants.apiEndPoints.uploadDoc,
            attachmentArr,
            UserLogin.access_token,
            'patient_attachments_',
            'multiple',
            'patient plan Attachment',
        );
        setUploadingFile(false);
        if (res.errorMsg) {
            Alert.showAlert(Constants.danger, res.errorMsg);
            return null;
        } else {
            Alert.showAlert(
                Constants.success,
                messages.message_uploaded_successfully,
            );
            return res.data.payload;
        }
    };

    const imageOrDocumentResponseHandler = async response => {
        if (response.didCancel) {
            //console.log('User cancelled image picker');
        } else if (response.error) {
            //console.log('ImagePicker Error: ', response.error);
            Alert.showAlert(Constants.danger, messages.message_something_went_wrong);
        } else if (response.customButton) {
            //console.log('User tapped custom button: ', response.customButton);
        } else {
            //  this.setState({ avatarSource: response, imagePathText: response.type });
            if (Array.isArray(response) && response.length > 0) {
                let uploaded_doc_arr = await uploadFile(response);
                if (!uploaded_doc_arr) return;
                uploaded_doc_arr.map(obj => {
                    obj['uploaded_doc_url'] = obj.file_name;
                    obj['uri'] = obj.file_name;
                    obj['type'] = obj.uploading_file_name;
                });
                let tempDocArr = [...patientFormValues.documents];
                tempDocArr = tempDocArr.concat(uploaded_doc_arr);
                handleInputChange(patientForm, tempDocArr, patientFormKeys.documents);
            } else if (response?.assets) {
                let uploaded_doc_arr = await uploadFile(response?.assets);
                if (!uploaded_doc_arr) return;
                uploaded_doc_arr.map(obj => {
                    obj['uploaded_doc_url'] = obj.file_name;
                    obj['uri'] = obj.file_name;
                    obj['type'] = 'image';
                });

                let tempDocArr = [...patientFormValues.documents];
                tempDocArr = tempDocArr.concat(uploaded_doc_arr);
                handleInputChange(patientForm, tempDocArr, patientFormKeys.documents);
            }
        }
    };

    const addOrEditPatientAPI = async (ignorePerson, personList) => {
        let persons = [];
        if (!ignorePerson) {
            // console.log('personList', personList);
            personList.map(person => {
                let obj = {
                    ...person,
                    zipcode: person.zipcode,
                    postal_area: person.postal_area,
                    country_id: 209,
                };
                if (!obj.id) obj['id'] = '';
                persons.push(obj);
            });
        }
        let tempCompanyType = [];
        // patientFormValues?.company_type?.map((obj) => {
        //     tempCompanyType.push('' + obj.id)
        // })
        let patientTypeId = [];
        patientFormValues?.patient_type?.map(obj => {
            patientTypeId.push('' + obj.id);
        });
        let tempDocuments = null;
        if (patientFormValues.documents?.length > 0) {
            tempDocuments = [];
            patientFormValues.documents.map(obj => {
                let tempObj = {
                    file_name: obj.uploading_file_name,
                    file_url: obj.file_name,
                };
                tempDocuments.push(tempObj);
            });
        }
        function getWeekDaysArr(weekData) {
            let week_days = [];
            weekData.map(obj => {
                if (obj.selected) {
                    week_days.push('' + obj.number);
                }
            });
            return week_days;
        }

        let tempAgencyHours = [];
        patientFormValues.agency_hours.map((obj) => {
            let tempObj = { ...obj };
            if (tempObj.start_date)
                tempObj.start_date = formatDateForAPI(tempObj.start_date)
            if (tempObj.end_date)
                tempObj.end_date = formatDateForAPI(tempObj.end_date)
            tempAgencyHours.push(tempObj);
        })

        let params = {
            // "category_type_id": "8",
            user_type_id: '6',
            role_id: userRole.id ?? '6',
            // "govt_id": patientFormValues.gov_id,
            // "category_id": patientFormValues.category.id,
            country_id: 209,
            branch_id: patientFormValues?.branch?.id ?? '',
            // "dept_id": patientFormValues.department?.id,
            dept_id: '1',
            name: patientFormValues.name,
            email: patientFormValues.email,
            // password: '12345678',
            // 'confirm-password': '12345678',
            contact_number: ReplaceAll(patientFormValues.contact_number, ' ', ''),
            gender: genderObjWhileAdding[patientFormValues.gender.name],
            personal_number: ReplaceAll(patientFormValues.personal_number, '-', ''),
            zipcode: patientFormValues.zipCode,
            full_address: patientFormValues.full_address,
            joining_date: patientFormValues.joining_date ? formatDateForAPI(patientFormValues.joining_date) : '',
            user_color: patientFormValues.color,
            // 'weekly_hours_alloted_by_govt': patientFormValues.weekly_hours_alloted_by_govt,
            disease_description: patientFormValues.disease_description,
            persons: persons,
            city: patientFormValues.city,
            // "postal_code": patientFormValues.postalArea + "__code",
            postal_area: patientFormValues.postalArea,
            "patient_type_id": patientTypeId,
            "from_timing": patientFormValues.from_timing ? formatTimeForAPI(patientFormValues.from_timing) : " ",
            // "from_timing": patientFormValues.from_timing,
            "to_timing": patientFormValues.to_timing ? formatTimeForAPI(patientFormValues.to_timing) : " ",
            // "to_timing": patientFormValues.to_timing,
            "agency_hours": tempAgencyHours,
            "company_type_id": tempCompanyType,
            "custom_unique_id": patientFormValues[patientFormKeys.custom_unique_id],
            "is_secret": patientFormValues[patientFormKeys.is_secret] ? 1 : 0,
            institute_name: patientFormValues.institute_name,
            institute_contact_number: patientFormValues.institute_contact_number,
            institute_full_address: patientFormValues.institute_full_address,
            classes_from: patientFormValues.classes_from ? formatTimeForAPI(patientFormValues.classes_from) : " ",
            classes_to: patientFormValues.classes_to ? formatTimeForAPI(patientFormValues.classes_to) : " ",
            company_name: patientFormValues.company_name,
            company_contact_number: patientFormValues.company_contact_number,
            company_full_address: patientFormValues.company_full_address,
            documents: tempDocuments,
            assign_employee: patientFormValues[patientFormKeys.employee]?.['name']
                ? true
                : false,
            employee: patientFormValues[patientFormKeys.employee]?.['name'] ?? '',
            aids: patientFormValues?.aids ?? '',
            special_information: patientFormValues?.special_information ?? '',
            another_activity_name: patientFormValues?.another_activity_name ?? '',
            activitys_contact_number:
                patientFormValues?.activitys_contact_number ?? '',
            activitys_full_address: patientFormValues?.activitys_full_address ?? '',
            number_of_hours: patientFormValues?.number_of_hours ?? '',
            issuer_name: patientFormValues?.issuer_name ?? '',
            period: patientFormValues?.period ?? '',
            week_days: getWeekDaysArr(week_days),
            another_activity: patientFormValues?.another_activity?.name ?? '',

            institute_contact_person:
                patientFormValues?.institute_contact_person ?? '',
            institute_week_days: getWeekDaysArr(
                institute_week_days,
            ),
            company_contact_person: patientFormValues?.company_contact_person ?? '',
            company_week_days: getWeekDaysArr(company_week_days),
            another_activity_contact_person:
                patientFormValues?.another_activity_contact_person ?? '',

            // "organization_number" :"8770274740",
            // "licence_key" :"5test56666",
            // "licence_end_date" :"2020-12-12",
            // "is_fake" :"1",
            // "is_substitute" :"1",
            // "is_regular" :"1",
            // "is_seasonal" :"1",
            // "establishment_date" :"2021-11-12",
            // "is_file_required" :"1",
        };
        // console.log('params==============================', JSON.stringify(params));

        let url = Constants.apiEndPoints.userView;

        if (routeParams.patientId) url = url + '/' + routeParams.patientId;

        let response = {};
        // return;
        setIsLoading(true);
        if (routeParams.patientId)
            response = await APIService.putData(
                url,
                params,
                UserLogin.access_token,
                null,
                'editPatientAPI',
            );
        else
            response = await APIService.postData(
                url,
                params,
                UserLogin.access_token,
                null,
                'addPatientAPI',
            );

        // console.log(
        //     'add patient response_________',
        //     JSON.stringify(response.data.payload),
        // );
        if (!response.errorMsg) {
            setIsLoading(false);
            Alert.showAlert(
                Constants.success,
                routeParams.patientId
                    ? labels.patient_edited_successfully
                    : labels.patient_added_successfully,
                () => {
                    if (routeParams.fromIP) {
                        // props.navigation.pop()
                        props.navigation.navigate('ImplementationPlanStack', {
                            screen: 'ImplementationPlan',
                            params: { patientId: response.data.payload.id },
                        });
                    } else if (routeParams.fromActivity) {
                        props.navigation.navigate('ActivityStack', {
                            screen: 'AddActivity',
                            params: { patientID: response.data.payload.id },
                        });
                    } else if (routeParams.fromDeviation) {
                        props.navigation.navigate('DeviationStack', {
                            screen: 'AddDeviation',
                            params: { patientID: response.data.payload.id },
                        });
                    } else props.navigation.pop();
                },
            );
        } else {
            // console.log('response', response);
            setIsLoading(false);
            Alert.showAlert(Constants.danger, response.errorMsg);
        }
    };
    // console.log(  'patientFormValues=====================+++++++',   patientFormValues, );
    // Render view

    const shouldItBeSelected = (item, index, selectedData) => {
        let selected = {
            minor: false,
            student: false,
            working: false,
            oldAge: false,
        }
        // console.log('item.value', item.value)
        selectedData?.map((item) => {
            if (item?.value == 'minor_child')
                selected.minor = true;
            else if (item?.value == 'student')
                selected.student = true;
            else if (item?.value == 'working')
                selected.working = true;
            else if (item?.value == 'old_age')
                selected.oldAge = true;
        })
        if (item?.value == 'minor_child' || selected.minor) {
            if (selected.working && selected.oldAge) {
                Alert.showToast(labels.working_or_old_age_can_not_be_minor_child);
                return false;
            }
            if (selected.working || item?.value == 'working') {
                Alert.showToast(labels.minor_child_can_not_be_a_worker);
                return false;
            }
            if (selected.oldAge || item?.value == 'old_age') {
                Alert.showToast(labels.minor_child_can_not_be_a_old_age);
                return false;
            }
        }
        return true;
    }

    if (isLoading) return <ProgressLoader />;

    return (
        <BaseContainer
            title={labels.addPatient}
            onPressLeftIcon={() => {
                props.navigation.pop();
            }}
            titleStyle={styles.headingText}
            leftIcon="arrow-back"
            leftIconSize={24}
            leftIconColor={Colors.primary}>
            <FormSubHeader
                leftIconName={viewDecider == 1 ? null : 'chevron-back-circle-outline'}
                onPressLeftIcon={
                    viewDecider == 2
                        ? isPersonFormVisible
                            ? () => { setPersonFormToInitialValue(true); setIsPersonFormVisible(false) }
                            : () => {
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
                                : viewDecider == 5
                                    ? () => {
                                        setViewDecider(4);
                                    }
                                    : viewDecider == 6
                                        ? () => {
                                            setViewDecider(5);
                                        }
                                        : viewDecider == 7 && !uploadingFile
                                            ? patientFormValues.agency_hours.length > 0
                                                ? () => {
                                                    setViewDecider(6);
                                                }
                                                : () => {
                                                    setViewDecider(5);
                                                }
                                            : () => { }
                }
                title={
                    viewDecider == 1
                        ? labels.personalDetails
                        : viewDecider == 2
                            ? labels.relatives_and_caretakers
                            : viewDecider == 3
                                ? labels.disability_details
                                : viewDecider == 4
                                    ? labels.studies_and_work
                                    : viewDecider == 5
                                        ? labels.another_activity_page
                                        : viewDecider == 6
                                            ? labels.decision
                                            : viewDecider == 7
                                                ? labels.attachment
                                                : ''
                }
                rightIconName={
                    viewDecider == 2 ? (!isPersonFormVisible ? 'person-add-outline' : null) : null
                }
                onPressRightIcon={
                    // permissions[Constants.permissionsKey.persons]?.[Constants.permissionType.add]
                    Can(
                        Constants.permissionsKey.personsAdd,
                        permissions,
                    )
                        ? () => {
                            setIsPersonFormVisible(true);
                        }
                        : () =>
                            Alert.showToast(
                                labels.permission_required_for_this_action,
                            )
                }
            />

            <KeyboardAwareScrollView style={{ flex: 1 }} keyboardShouldPersistTaps="handled" >
                <ActionSheet ref={actionSheetRef}>
                    {actionSheetDecide == patientFormKeys.attachment ? (
                        <ImagePickerActionSheetComp
                            chooseMultiple={true}
                            giveChoice={true}
                            closeSheet={closeActionSheet}
                            responseHandler={res => {
                                imageOrDocumentResponseHandler(res);
                            }}
                        />
                    ) : (
                        <ActionSheetComp
                            title={labels[actionSheetDecide]}
                            closeActionSheet={closeActionSheet}
                            keyToShowData={
                                actionSheetDecide == patientFormKeys.patient_type
                                    ? 'designation'
                                    : 'name'
                            }
                            shouldItBeSelected={actionSheetDecide == patientFormKeys.patient_type
                                ? (item, index, selectedData) => { return shouldItBeSelected(item, index, selectedData) } : null}
                            keyToCompareData="id"
                            multiSelect={isMultiSelect()}
                            APIDetails={getAPIDetails()}
                            changeAPIDetails={payload => {
                                changeAPIDetails(payload);
                            }}
                            onPressItem={item => {
                                onPressItem(item);
                            }}
                        />
                    )}
                </ActionSheet>

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
                                    handleInputChange(patientForm, color, patientFormKeys.color);
                                }}
                                color={patientFormValues.color ?? Colors.primary}
                                thumbSize={40}
                                sliderSize={40}
                                noSnap={true}
                                row={false}
                            />
                            <CustomButton
                                onPress={() => {
                                    setIsModalVisible(false);
                                }}
                                title={labels.done}
                                style={{ marginTop: 20 }}
                            />
                        </View>
                    </Modal>
                </Portal>

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
                            handleInputChange(patientForm, date, datePickerKey);
                        else if (mode == Constants.DatePickerModes.time_mode)
                            handleInputChange(patientForm, date, datePickerKey);
                        else handleInputChange(patientForm, date, datePickerKey);
                    }}
                    onCancel={() => {
                        setOpenDatePicker(false);
                    }}
                />

                {/* Main View */}
                {viewDecider == 1 ? (
                    <View style={styles.mainView}>
                        {/* name */}
                        <InputValidation
                            uniqueKey={patientFormKeys.name}
                            validationObj={personalvalidationObj}
                            value={patientFormValues.name}
                            placeHolder={labels["name"]}
                            onChangeText={text => {
                                removeErrorTextForInputThatUserIsTyping(
                                    personalDetail,
                                    patientFormKeys.name,
                                );
                                handleInputChange(patientForm, text, patientFormKeys.name);
                            }}
                            style={styles.InputValidationView}
                            inputStyle={styles.inputStyle}
                        />

                        {/* personal number */}
                        <InputValidation
                            maskedInput={true}
                            mask={Constants.personal_number_format}
                            uniqueKey={patientFormKeys.personal_number}
                            validationObj={personalvalidationObj}
                            keyboardType={'number-pad'}
                            value={'' + patientFormValues.personal_number}
                            placeHolder={labels["personal-number"]}
                            onChangeText={text => {
                                removeErrorTextForInputThatUserIsTyping(
                                    personalDetail,
                                    patientFormKeys.personal_number,
                                );
                                handleInputChange(
                                    patientForm,
                                    text,
                                    patientFormKeys.personal_number,
                                );
                            }}
                            style={styles.InputValidationView}
                            inputStyle={styles.inputStyle}
                        />

                        {/* custom unique id */}
                        <InputValidation
                            uniqueKey={patientFormKeys.custom_unique_id}
                            validationObj={personalvalidationObj}
                            value={patientFormValues.custom_unique_id}
                            // optional={true}
                            placeHolder={labels["custom-unique-id"]}
                            onChangeText={text => {
                                // removeErrorTextForInputThatUserIsTyping(personalDetail, patientFormKeys.custom_unique_id);
                                removeErrorTextForInputThatUserIsTyping(
                                    personalDetail,
                                    patientFormKeys.custom_unique_id,
                                );
                                handleInputChange(
                                    patientForm,
                                    text,
                                    patientFormKeys.custom_unique_id,
                                );
                            }}
                            style={styles.InputValidationView}
                            inputStyle={styles.inputStyle}
                        />

                        {/* Social security number */}
                        {/* <InputValidation
                            // maskedInput={true}
                            // mask={Constants.social_security_number_format}
                            uniqueKey={patientFormKeys.social_security_number}
                            validationObj={personalvalidationObj}
                            keyboardType={'number-pad'}
                            value={'' + patientFormValues.social_security_number}
                            placeHolder={labels.social_security_number}
                            onChangeText={(text) => {
                                removeErrorTextForInputThatUserIsTyping(personalDetail, patientFormKeys.social_security_number);
                                handleInputChange(patientForm, text, patientFormKeys.social_security_number)
                            }}
                            style={styles.InputValidationView}
                            inputStyle={styles.inputStyle}
                        /> */}

                        {/* email */}
                        <InputValidation
                            uniqueKey={patientFormKeys.email}
                            validationObj={personalvalidationObj}
                            value={patientFormValues.email}
                            placeHolder={labels["Email"]}
                            onChangeText={text => {
                                removeErrorTextForInputThatUserIsTyping(
                                    personalDetail,
                                    patientFormKeys.email,
                                );
                                handleInputChange(patientForm, text, patientFormKeys.email);
                            }}
                            style={styles.InputValidationView}
                            inputStyle={styles.inputStyle}
                            keyboardType={'email-address'}
                        />

                        {/* contact number */}
                        <InputValidation
                            maskedInput={true}
                            mask={Constants.phone_number_format}
                            uniqueKey={patientFormKeys.contact_number}
                            validationObj={personalvalidationObj}
                            keyboardType={'number-pad'}
                            value={'' + patientFormValues.contact_number}
                            placeHolder={labels["contact-number"]}
                            onChangeText={text => {
                                removeErrorTextForInputThatUserIsTyping(
                                    personalDetail,
                                    patientFormKeys.contact_number,
                                );
                                handleInputChange(
                                    patientForm,
                                    text,
                                    patientFormKeys.contact_number,
                                );
                            }}
                            style={styles.InputValidationView}
                            inputStyle={styles.inputStyle}
                        />



                        {/* full Address */}
                        <InputValidation
                            // uniqueKey={patientFormKeys.full_address}
                            // validationObj={validationObj}
                            multiline={true}
                            dropDownListData={full_address}
                            value={patientFormValues?.full_address}
                            optional={true}
                            placeHolder={labels["full-address"]}
                            onChangeText={text => {
                                removeErrorTextForInputThatUserIsTyping(patientFormKeys.full_address);
                                filterSuggestion(text, (filteredData) => { setFull_address(filteredData) })
                                // console.log('--descrptionSuggestion--------------', descrptionSuggestion);
                                handleInputChange(
                                    patientForm,
                                    text,
                                    patientFormKeys.full_address,
                                );
                            }}
                            onPressDropDownListitem={(choosenSuggestion) => {
                                handleInputChange(patientForm, choosenSuggestion, patientFormKeys.full_address)
                                setFull_address([])
                            }}

                            style={styles.InputValidationView}
                            inputStyle={{ ...styles.inputStyle, height: 110 }}
                        />
                        {/* gender */}
                        <InputValidation
                            uniqueKey={patientFormKeys.gender}
                            validationObj={personalvalidationObj}
                            value={patientFormValues.gender?.name ?? ''}
                            placeHolder={labels["gender"]}
                            iconRight="chevron-down"
                            iconColor={Colors.primary}
                            editable={false}
                            onPressIcon={() => {
                                removeErrorTextForInputThatUserIsTyping(
                                    personalDetail,
                                    patientFormKeys.gender,
                                );
                                setActionSheetDecide(patientFormKeys.gender);
                                actionSheetRef.current?.setModalVisible();
                            }}
                            style={styles.InputValidationView}
                            inputStyle={styles.inputStyle}
                        />
                        {/* branch */}
                        <InputValidation
                            // uniqueKey={patientFormKeys.branch}
                            // validationObj={validationObj}
                            optional={true}
                            value={patientFormValues.branch?.name ?? ''}
                            placeHolder={labels["branch"]}
                            iconRight="chevron-down"
                            iconColor={Colors.primary}
                            editable={false}
                            onPressIcon={() => {
                                // removeErrorTextForInputThatUserIsTyping(patientForm, patientFormKeys.branch);
                                setActionSheetDecide(patientFormKeys.branch);
                                actionSheetRef.current?.setModalVisible();
                            }}
                            style={styles.InputValidationView}
                            inputStyle={styles.inputStyle}
                        />

                        {/* Government agency */}
                        {/* <InputValidation
                            uniqueKey={patientFormKeys.gov_agency}
                            validationObj={personalvalidationObj}
                            value={patientFormValues.category?.name ?? ''}
                            placeHolder={labels.gov_agency}
                            iconRight='chevron-down'
                            iconColor={Colors.primary}
                            editable={false}
                            onPressIcon={() => {
                                removeErrorTextForInputThatUserIsTyping(personalDetail, patientFormKeys.gov_agency);
                                setActionSheetDecide(patientFormKeys.gov_agency);
                                actionSheetRef.current?.setModalVisible()
                            }}
                            style={styles.InputValidationView}
                            inputStyle={styles.inputStyle}
                        />

                        <MSDataViewer
                            data={patientFormValues.gov_agency}
                            setNewDataOnPressClose={(newArr) => {
                                setAgencyAS({ ...agencyAS, selectedData: newArr });
                                handleInputChange(patientForm, newArr, patientFormKeys.gov_agency)
                            }}
                        />

                        {patientFormValues.gov_agency?.length > 0
                            ? <FlatList
                                contentContainerStyle={{ marginTop: 10 }}
                                data={patientFormValues.gov_agency}
                                keyExtractor={(item, index) => index}
                                renderItem={({ item, index }) => {
                                    return (
                                        <View style={styles.agencyInputMainView}>
                                            <Text style={{ width: "45%", fontSize: getProportionalFontSize(15), fontFamily: Assets.fonts.regular }}>{item.name}</Text>
                                            <Text style={{ width: "10%", color: Colors.primary, fontSize: getProportionalFontSize(29) }}>-</Text>
                                            <TextInput
                                                keyboardType='number-pad'
                                                textAlignVertical="center"
                                                style={styles.agencyInput}
                                                placeholder={labels.assigned_hours}
                                                value={item.assigned_hours ? ('' + item.assigned_hours) : ''}
                                                onChangeText={(text) => {
                                                    let tempText = Number(text);
                                                    if (isNaN(tempText))
                                                        return;
                                                    item['assigned_hours'] = text;
                                                    let tempArr = [...patientFormValues.gov_agency]
                                                    tempArr[index] = item;
                                                    handleInputChange(patientForm, [...tempArr], patientFormKeys.gov_agency)
                                                }}
                                            />
                                        </View>
                                    )
                                }}
                            /> : null} */}

                        {/* checkbox to is secret */}
                        <View style={styles.checkBoxView}>
                            <BouncyCheckbox
                                size={20}
                                fillColor={Colors.primary}
                                unfillColor={Colors.white}
                                iconStyle={{ borderColor: Colors.primary }}
                                isChecked={patientFormValues[patientFormKeys.is_secret]}
                                onPress={value => {
                                    handleInputChange(
                                        patientForm,
                                        value,
                                        patientFormKeys.is_secret,
                                    );
                                }}
                            />
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={styles.saveAsTemplate}>{labels["is-secret"]}</Text>
                            </View>
                        </View>

                        <View
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                width: '100%',
                                marginTop: Constants.formFieldTopMargin,
                                justifyContent: 'space-between',
                            }}>
                            {/* choose color */}
                            <CustomButton
                                style={{ width: patientFormValues.color ? '80%' : '100%' }}
                                onPress={() => {
                                    removeErrorTextForInputThatUserIsTyping(
                                        patientForm,
                                        patientFormKeys.color,
                                    );
                                    setIsModalVisible(true);
                                }}
                                title={labels["choose-color"]}
                            />

                            {/* Choosen Color */}
                            {patientFormValues.color ? (
                                <CustomButton
                                    style={{
                                        backgroundColor: patientFormValues.color,
                                        width: '15%',
                                        borderWidth: 1,
                                    }}
                                />
                            ) : null}
                        </View>

                        {/* Color validation  */}
                        <ErrorComp
                            uniqueKey={patientFormKeys.color}
                            validationObj={personalvalidationObj}
                        />

                        {/* next button */}
                        <CustomButton
                            style={{
                                ...styles.nextButton,
                                backgroundColor: isValid ? Colors.primary : Colors.lightPrimary,
                            }}
                            onPress={() => {
                                // setViewDecider(2)
                                if (validation(personalDetail)) {
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

                        {/* add Implementation plan */}
                        {routeParams.patientId && !routeParams.fromIP ? (
                            <CustomButton
                                style={{
                                    ...styles.nextButton,
                                    marginTop: 10,
                                    backgroundColor: isValid
                                        ? Colors.primary
                                        : Colors.lightPrimary,
                                }}
                                onPress={() => {
                                    props.navigation.navigate('ImplementationPlanStack', {
                                        screen: 'ImplementationPlan',
                                        params: { patientId: routeParams.patientId },
                                    });
                                }}
                                title={labels["create_ips"]}
                            />
                        ) : null}
                    </View>
                ) : null}

                {viewDecider == 2 ? (
                    <PersonFormComp
                        badWords={badWords}
                        suggestion={suggestion}
                        setIsLoading={(val) => { setIsLoading(val) }}
                        patient_id={routeParams.patientId}
                        crudByAPI={routeParams.patientId ? true : false}
                        labelOne={labels["back"]}
                        labelTwo={labels["Next"]}
                        shouldGuardianCheckBoxVisible={
                            patientFormValues?.patient_type?.designation ==
                                patient_type_labels?.minor_child
                                ? true
                                : false
                        }
                        onPressBack={() => {
                            setViewDecider(1);
                        }}
                        validationBeforeAdding={(personFormValues) => {
                            if (personFormValues?.email == patientFormValues.email) {
                                Alert.showAlert(Constants.warning, labels.relative_patient_same_email)
                                return false;
                            }
                            if (personFormValues?.contact_number == patientFormValues.contact_number) {
                                Alert.showAlert(Constants.warning, labels.relative_patient_same_number)
                                return false;
                            }
                            if (personFormValues?.personal_number == patientFormValues.personal_number) {
                                Alert.showAlert(Constants.warning, labels.relative_patient_same_personal_number)
                                return false;
                            }
                            // for (let i = 0; i < personList?.length; i++) {
                            //     if (personList[i]?.contact_number == personFormValues?.contact_number) {
                            //         Alert.showAlert(Constants.warning, labels.relative_same_number)
                            //         return false;
                            //     }
                            //     if (personList[i]?.personal_number == personFormValues?.personal_number) {
                            //         Alert.showAlert(Constants.warning, labels.relative_same_personal_number)
                            //         return false;
                            //     }
                            //     if (personList[i]?.email == personFormValues?.email) {
                            //         Alert.showAlert(Constants.warning, labels.relative_same_email)
                            //         return false;
                            //     }
                            // }
                            return true;
                        }}
                        onPressSave={(ignorePersons, personsList) => {
                            setViewDecider(3);
                            if (ignorePersons) {
                                setIgnorePersons(true);
                            } else {
                                setIgnorePersons(false);
                            }
                            if (personsList) {
                                // console.log('personList old', personList);
                                // console.log('personsList new', personsList);
                                setPersonList([...personsList]);
                            }

                            // addOrEditPatientAPI(ignorePersons, personsList)
                        }}
                        personList={personList}
                        changePersonList={(personListArr) => {
                            if (personListArr && Array.isArray(personListArr))
                                setPersonList(personListArr)
                        }}
                        isPersonFormVisible={isPersonFormVisible}
                        setIsPersonFormVisible={setIsPersonFormVisible}
                        setPersonFormToInitialValue={setPersonFormToInitialValue}
                        personFormToInitialValue={personFormToInitialValue}
                    />
                ) : null}
                {/* ---------------------------------------------------------------------------------------------- */}

                {viewDecider == 3 ? (
                    <View style={styles.mainView}>
                        {/* Disease Description */}
                        <InputValidation
                            // uniqueKey={patientFormKeys.disease_description}
                            // validationObj={personalvalidationObj}
                            multiline={true}
                            dropDownListData={disease_description}
                            value={patientFormValues.disease_description}

                            optional={true}

                            placeHolder={labels["disease-description"]}

                            onChangeText={text => {
                                // removeErrorTextForInputThatUserIsTyping(personalDetail, patientFormKeys.disease_description);
                                filterSuggestion(text, (filteredData) => { setDisease_description(filteredData) })
                                handleInputChange(
                                    patientForm,
                                    text,
                                    patientFormKeys.disease_description,
                                );
                            }}
                            onPressDropDownListitem={(choosenSuggestion) => {
                                handleInputChange(patientForm, choosenSuggestion, patientFormKeys.disease_description)
                                setDisease_description([])
                            }}
                            style={styles.InputValidationView}
                            inputStyle={{ ...styles.inputStyle, ...{ height: 110 } }}
                        />
                        {/* aids Description */}
                        <InputValidation
                            // uniqueKey={patientFormKeys.disease_description}
                            // validationObj={personalvalidationObj}
                            multiline={true}
                            dropDownListData={aids}
                            optional={true}
                            value={patientFormValues.aids}
                            placeHolder={labels["aids"]}
                            onChangeText={text => {
                                removeErrorTextForInputThatUserIsTyping(
                                    personalDetail,
                                    patientFormKeys.aids,
                                );
                                filterSuggestion(text, (filteredData) => { setAids(filteredData) })
                                handleInputChange(patientForm, text, patientFormKeys.aids);
                            }}
                            onPressDropDownListitem={(choosenSuggestion) => {
                                handleInputChange(patientForm, choosenSuggestion, patientFormKeys.aids)
                                setAids([])
                            }}
                            style={styles.InputValidationView}
                            inputStyle={{ ...styles.inputStyle, ...{ height: 110 } }}
                        />

                        {/* Special information  */}
                        <InputValidation
                            // uniqueKey={patientFormKeys.disease_description}
                            // validationObj={personalvalidationObj}
                            multiline={true}
                            dropDownListData={special_information}
                            optional={true}
                            value={patientFormValues.special_information}
                            placeHolder={labels["special-information"]}
                            onChangeText={text => {
                                // removeErrorTextForInputThatUserIsTyping(personalDetail, patientFormKeys.special_information);
                                filterSuggestion(text, (filteredData) => { setSpecial_information(filteredData) })
                                handleInputChange(
                                    patientForm,
                                    text,
                                    patientFormKeys.special_information,
                                );
                            }}
                            onPressDropDownListitem={(choosenSuggestion) => {
                                handleInputChange(patientForm, choosenSuggestion, patientFormKeys.special_information)
                                setSpecial_information([])
                            }}
                            style={styles.InputValidationView}
                            inputStyle={{ ...styles.inputStyle, ...{ height: 110 } }}
                        />

                        {/* joining date */}
                        {/* <InputValidation
                            uniqueKey={patientFormKeys.joining_date}
                            validationObj={personalvalidationObj}
                            iconRight='calendar'
                            iconColor={Colors.primary}
                            editable={false}
                            onPressIcon={() => {
                                removeErrorTextForInputThatUserIsTyping(personalDetail, patientFormKeys.joining_date);
                                setOpenDatePicker(true);
                                setMode(Constants.DatePickerModes.date_mode);
                                setDatePickerKey(patientFormKeys.joining_date)
                            }}
                            value={patientFormValues.joining_date ? formatDate(patientFormValues.joining_date) : ''}
                            placeHolder={labels.joining_date}
                            style={styles.InputValidationView}
                            inputStyle={styles.inputStyle}
                        /> */}

                        {/* next button */}
                        <CustomButton
                            style={{
                                ...styles.nextButton,
                                backgroundColor: isValid ? Colors.primary : Colors.lightPrimary,
                            }}
                            onPress={() => {
                                setViewDecider(4);
                                // if (validation(address)) {
                                //     console.log('Validation true')
                                //     setViewDecider(4)
                                // }
                                // else {
                                //     console.log('Validation false')
                                // }
                            }}
                            title={labels["Next"]}
                        />
                    </View>
                ) : null}
                {/* --------------------------------------------------------- */}
                {viewDecider == 4 ? (
                    <View style={styles.mainView}>
                        {/* patient type */}
                        <InputValidation
                            // uniqueKey={patientFormKeys.patient_type}
                            // validationObj={validationObj}
                            value={patientFormValues?.patient_type?.designation ?? ''}
                            iconRight="chevron-down"
                            iconColor={Colors.primary}
                            optional={true}
                            editable={false}
                            onPressIcon={() => {
                                removeErrorTextForInputThatUserIsTyping(
                                    patientForm,
                                    patientFormKeys.patient_type,
                                );
                                setActionSheetDecide(patientFormKeys.patient_type);
                                actionSheetRef.current?.setModalVisible();
                            }}
                            placeHolder={labels["patient-type"]}
                            style={{ marginTop: formFieldTopMargin }}
                            inputMainViewStyle={styles.InputValidationView}
                            inputStyle={styles.inputStyle}
                        />
                        <MSDataViewer
                            data={patientFormValues?.patient_type}
                            keyName={'designation'}
                            setNewDataOnPressClose={newArr => {
                                setPatientTypeAS({ ...patientTypeAS, selectedData: newArr });
                                handleInputChange(
                                    patientForm,
                                    newArr,
                                    patientFormKeys.patient_type,
                                );
                            }}
                        />
                        {patientFormValues?.patient_type?.map((item, index) => {
                            return (
                                <>
                                    {item?.designation == labels["student"] ? (
                                        <>
                                            <InputValidation
                                                // uniqueKey={patientFormKeys.institute_name}
                                                // validationObj={validationObj}
                                                value={patientFormValues.institute_name}
                                                placeHolder={labels["institute-name"]}
                                                optional={true}
                                                onChangeText={text => {
                                                    // removeErrorTextForInputThatUserIsTyping(patientForm, patientFormKeys.institute_name);
                                                    handleInputChange(
                                                        patientForm,
                                                        text,
                                                        patientFormKeys.institute_name,
                                                    );
                                                }}
                                                style={styles.InputValidationView}
                                                inputStyle={styles.inputStyle}
                                            />

                                            {/* name */}
                                            <InputValidation
                                                // uniqueKey={patientFormKeys.institute_contact_person}
                                                // validationObj={personalvalidationObj}
                                                value={patientFormValues.institute_contact_person}
                                                optional={true}
                                                placeHolder={labels["contact-person"]}
                                                onChangeText={text => {
                                                    // removeErrorTextForInputThatUserIsTyping(personalDetail, patientFormKeys.institute_contact_person);
                                                    handleInputChange(
                                                        patientForm,
                                                        text,
                                                        patientFormKeys.institute_contact_person,
                                                    );
                                                }}
                                                style={styles.InputValidationView}
                                                inputStyle={styles.inputStyle}
                                            />

                                            {/* school's contact number */}
                                            <InputValidation
                                                maskedInput={true}
                                                mask={Constants.phone_number_format}
                                                // uniqueKey={patientFormKeys.institute_contact_number}
                                                // validationObj={validationObj}
                                                keyboardType={'number-pad'}
                                                value={'' + patientFormValues.institute_contact_number}
                                                optional={true}
                                                placeHolder={labels["institute-phone"]}
                                                onChangeText={text => {
                                                    // removeErrorTextForInputThatUserIsTyping(patientForm, patientFormKeys.institute_contact_number);
                                                    handleInputChange(
                                                        patientForm,
                                                        text,
                                                        patientFormKeys.institute_contact_number,
                                                    );
                                                }}
                                                style={styles.InputValidationView}
                                                inputStyle={styles.inputStyle}
                                            />

                                            {/* school's full address */}
                                            <InputValidation
                                                // uniqueKey={patientFormKeys.institute_full_address}
                                                // validationObj={validationObj}
                                                multiline={true}
                                                dropDownListData={institute_full_address}
                                                value={patientFormValues.institute_full_address}
                                                optional={true}
                                                placeHolder={labels["institute-address"]}
                                                onChangeText={text => {
                                                    // removeErrorTextForInputThatUserIsTyping(patientForm, patientFormKeys.institute_full_address);
                                                    filterSuggestion(text, (filteredData) => { setInstitute_full_address(filteredData) })
                                                    handleInputChange(
                                                        patientForm,
                                                        text,
                                                        patientFormKeys.institute_full_address,
                                                    );
                                                }}
                                                onPressDropDownListitem={(choosenSuggestion) => {
                                                    handleInputChange(patientForm, choosenSuggestion, patientFormKeys.institute_full_address)
                                                    setInstitute_full_address([])
                                                }}
                                                style={styles.InputValidationView}
                                                inputStyle={{ ...styles.inputStyle, ...{ height: 110 } }}
                                            />

                                            <InputValidation
                                                // uniqueKey={patientFormKeys.classes_from}
                                                // validationObj={validationObj}
                                                iconRight="time"
                                                iconColor={Colors.primary}
                                                editable={false}
                                                onPressIcon={() => {
                                                    // removeErrorTextForInputThatUserIsTyping(patientForm, patientFormKeys.classes_from);
                                                    setOpenDatePicker(true);
                                                    setMode(Constants.DatePickerModes.time_mode);
                                                    setDatePickerKey(patientFormKeys.classes_from);
                                                }}
                                                value={
                                                    patientFormValues.classes_from
                                                        ? formatTime(patientFormValues.classes_from)
                                                        : ''
                                                }
                                                optional={true}
                                                placeHolder={labels["time-from"]}
                                                style={styles.InputValidationView}
                                                inputStyle={styles.inputStyle}
                                            />

                                            <InputValidation
                                                // uniqueKey={patientFormKeys.classes_to}
                                                // validationObj={validationObj}
                                                iconRight="time"
                                                iconColor={Colors.primary}
                                                editable={false}
                                                onPressIcon={() => {
                                                    // removeErrorTextForInputThatUserIsTyping(patientForm, patientFormKeys.classes_to);
                                                    setOpenDatePicker(true);
                                                    setMode(Constants.DatePickerModes.time_mode);
                                                    setDatePickerKey(patientFormKeys.classes_to);
                                                }}
                                                value={
                                                    patientFormValues.classes_to
                                                        ? formatTime(patientFormValues.classes_to)
                                                        : ''
                                                }
                                                optional={true}
                                                placeHolder={labels["time-to"]}
                                                style={styles.InputValidationView}
                                                inputStyle={styles.inputStyle}
                                            />

                                            <Text
                                                style={{
                                                    fontFamily: Assets.fonts.robotoMedium,
                                                    fontSize: getProportionalFontSize(15),
                                                    marginTop: 10,
                                                    color: Colors.darkPrimary
                                                }}>
                                                {labels["weekdays"]}{' '}
                                            </Text>

                                            <FlatList
                                                show={false}
                                                contentContainerStyle={{
                                                    marginTop: Constants.formFieldTopMargin,
                                                }}
                                                keyExtractor={(item, index) => item.number}
                                                horizontal
                                                data={institute_week_days}
                                                renderItem={({ item, index }) => {
                                                    // console.log("item", item)
                                                    return (
                                                        <TouchableOpacity
                                                            onPress={() => {
                                                                let temp_week_days = [
                                                                    ...institute_week_days,
                                                                ];
                                                                // console.log("temp_week_days", temp_week_days)
                                                                temp_week_days.map(obj => {
                                                                    if (item.number == obj.number)
                                                                        obj.selected = !obj.selected;
                                                                });
                                                                // setPatientFormValues({
                                                                //     ...patientFormValues,
                                                                //     institute_week_days: [...temp_week_days],
                                                                // });
                                                                setinstitute_week_days(temp_week_days)

                                                                // handleInputChange(patientForm, [...temp_week_days], patientFormKeys.institute_week_days)
                                                            }}
                                                            style={{
                                                                ...styles.weekCircleView,
                                                                backgroundColor: item.selected
                                                                    ? Colors.primary
                                                                    : Colors.white,
                                                            }}>
                                                            <Text
                                                                style={{
                                                                    ...styles.weekText,
                                                                    color: !item.selected
                                                                        ? Colors.primary
                                                                        : Colors.white,
                                                                }}>
                                                                {item.name}
                                                            </Text>
                                                        </TouchableOpacity>
                                                    );
                                                }}
                                            />
                                        </>
                                    ) : null}
                                    {item.designation == labels["working"] ? (
                                        <>
                                            <InputValidation
                                                // uniqueKey={patientFormKeys.company_name}
                                                // validationObj={validationObj}
                                                value={patientFormValues.company_name}
                                                optional={true}
                                                placeHolder={labels["company-name"]}
                                                onChangeText={text => {
                                                    // removeErrorTextForInputThatUserIsTyping(patientForm, patientFormKeys.company_name);
                                                    handleInputChange(
                                                        patientForm,
                                                        text,
                                                        patientFormKeys.company_name,
                                                    );
                                                }}
                                                style={styles.InputValidationView}
                                                inputStyle={styles.inputStyle}
                                            />

                                            {/* company_contact_person */}
                                            <InputValidation
                                                // uniqueKey={patientFormKeys.company_contact_person}
                                                // validationObj={personalvalidationObj}
                                                value={patientFormValues.company_contact_person}
                                                optional={true}
                                                placeHolder={labels["contact-person"]}
                                                onChangeText={text => {
                                                    // removeErrorTextForInputThatUserIsTyping(personalDetail, patientFormKeys.company_contact_person);
                                                    handleInputChange(
                                                        patientForm,
                                                        text,
                                                        patientFormKeys.company_contact_person,
                                                    );
                                                }}
                                                style={styles.InputValidationView}
                                                inputStyle={styles.inputStyle}
                                            />

                                            {/* company's contact number */}
                                            <InputValidation
                                                maskedInput={true}
                                                mask={Constants.phone_number_format}
                                                // uniqueKey={patientFormKeys.company_contact_number}
                                                // validationObj={validationObj}
                                                keyboardType={'number-pad'}
                                                value={'' + patientFormValues.company_contact_number}
                                                optional={true}
                                                placeHolder={labels["company-phone"]}
                                                onChangeText={text => {
                                                    // removeErrorTextForInputThatUserIsTyping(patientForm, patientFormKeys.company_contact_number);
                                                    handleInputChange(
                                                        patientForm,
                                                        text,
                                                        patientFormKeys.company_contact_number,
                                                    );
                                                }}
                                                style={styles.InputValidationView}
                                                inputStyle={styles.inputStyle}
                                            />

                                            {/* company's full address */}
                                            <InputValidation
                                                // uniqueKey={patientFormKeys.company_full_address}
                                                // validationObj={validationObj}
                                                multiline={true}
                                                value={patientFormValues.company_full_address}
                                                optional={true}
                                                placeHolder={labels["company-address"]}
                                                onChangeText={text => {
                                                    // removeErrorTextForInputThatUserIsTyping(patientForm, patientFormKeys.company_full_address);
                                                    handleInputChange(
                                                        patientForm,
                                                        text,
                                                        patientFormKeys.company_full_address,
                                                    );
                                                }}
                                                style={styles.InputValidationView}
                                                inputStyle={{ ...styles.inputStyle, ...{ height: 110 } }}
                                            />

                                            <InputValidation
                                                // uniqueKey={patientFormKeys.from_timing}
                                                // validationObj={validationObj}
                                                iconRight="time"
                                                iconColor={Colors.primary}
                                                editable={false}
                                                onPressIcon={() => {
                                                    // removeErrorTextForInputThatUserIsTyping(patientForm, patientFormKeys.from_timing);
                                                    setOpenDatePicker(true);
                                                    setMode(Constants.DatePickerModes.time_mode);
                                                    setDatePickerKey(patientFormKeys.from_timing);
                                                }}
                                                value={
                                                    patientFormValues.from_timing
                                                        ? formatTime(patientFormValues.from_timing)
                                                        : ''
                                                }
                                                optional={true}
                                                placeHolder={labels["working-from"]}
                                                style={styles.InputValidationView}
                                                inputStyle={styles.inputStyle}
                                            />

                                            <InputValidation
                                                // uniqueKey={patientFormKeys.to_timing}
                                                // validationObj={validationObj}
                                                iconRight="time"
                                                iconColor={Colors.primary}
                                                editable={false}
                                                onPressIcon={() => {
                                                    // removeErrorTextForInputThatUserIsTyping(patientForm, patientFormKeys.to_timing);
                                                    setOpenDatePicker(true);
                                                    setMode(Constants.DatePickerModes.time_mode);
                                                    setDatePickerKey(patientFormKeys.to_timing);
                                                }}
                                                value={
                                                    patientFormValues.to_timing
                                                        ? formatTime(patientFormValues.to_timing)
                                                        : ''
                                                }
                                                optional={true}
                                                placeHolder={labels["work-to"]}
                                                style={styles.InputValidationView}
                                                inputStyle={styles.inputStyle}
                                            />

                                            <Text
                                                style={{
                                                    fontFamily: Assets.fonts.robotoMedium,
                                                    fontSize: getProportionalFontSize(15),
                                                    marginTop: 10,
                                                    color: Colors.darkPrimary
                                                }}>
                                                {labels["weekdays"]}{' '}
                                            </Text>

                                            <FlatList
                                                show={false}
                                                contentContainerStyle={{
                                                    marginTop: Constants.formFieldTopMargin,
                                                }}
                                                keyExtractor={(item, index) => item.number}
                                                horizontal
                                                data={company_week_days}
                                                renderItem={({ item, index }) => {
                                                    // console.log("item", item)
                                                    return (
                                                        <TouchableOpacity
                                                            onPress={() => {
                                                                let temp_week_days = [
                                                                    ...company_week_days,
                                                                ];
                                                                // console.log("temp_week_days", temp_week_days)
                                                                temp_week_days.map(obj => {
                                                                    if (item.number == obj.number)
                                                                        obj.selected = !obj.selected;
                                                                });
                                                                // setPatientFormValues({
                                                                //     ...patientFormValues,
                                                                //     company_week_days: [...temp_week_days],
                                                                // });
                                                                setcompany_week_days(temp_week_days)
                                                                // handleInputChange(patientForm, [...temp_week_days], patientFormKeys.company_week_days)
                                                            }}
                                                            style={{
                                                                ...styles.weekCircleView,
                                                                backgroundColor: item.selected
                                                                    ? Colors.primary
                                                                    : Colors.white,
                                                            }}>
                                                            <Text
                                                                style={{
                                                                    ...styles.weekText,
                                                                    color: !item.selected
                                                                        ? Colors.primary
                                                                        : Colors.white,
                                                                }}>
                                                                {item.name}
                                                            </Text>
                                                        </TouchableOpacity>
                                                    );
                                                }}
                                            />
                                        </>
                                    ) : null}
                                </>
                            );
                        })}

                        {/* department */}
                        {/* <InputValidation
                            uniqueKey={patientFormKeys.department}
                            validationObj={validationObj}
                            value={patientFormValues.department?.name ?? ''}
                            optional={true}
                            placeHolder={labels.department}
                            iconRight='chevron-down'
                            iconColor={Colors.primary}
                            editable={false}
                            onPressIcon={() => {
                                removeErrorTextForInputThatUserIsTyping(patientForm, patientFormKeys.department);
                                setActionSheetDecide(patientFormKeys.department)
                                actionSheetRef.current?.setModalVisible()
                            }}
                            style={styles.InputValidationView}
                            inputStyle={styles.inputStyle}
                        /> */}

                        {/* company type */}
                        {/* <InputValidation
                            uniqueKey={patientFormKeys.company_type}
                            validationObj={validationObj}
                            value={patientFormValues.company_type['name'] ?? ''}
                            iconRight='chevron-down'
                            iconColor={Colors.primary}
                            editable={false}
                            onPressIcon={() => {
                                setActionSheetDecide(patientFormKeys.company_type);
                                //removeErrorTextForInputThatUserIsTyping(patientFormKeys.category);
                                actionSheetRef.current?.setModalVisible();
                            }}
                            placeHolder={labels.select_company_type}
                            style={{ marginTop: formFieldTopMargin }}
                            inputMainViewStyle={styles.InputValidationView}
                            inputStyle={styles.inputStyle}
                        /> */}

                        {/* Government ID */}
                        {/* <InputValidation
                            uniqueKey={patientFormKeys.gov_id}
                            validationObj={validationObj}
                            keyboardType={'number-pad'}
                            value={patientFormValues.gov_id}
                            placeHolder={labels.gov_id}
                            onChangeText={(text) => {
                                removeErrorTextForInputThatUserIsTyping(patientForm, patientFormKeys.gov_id);
                                handleInputChange(patientForm, text, patientFormKeys.gov_id)
                            }}
                            style={styles.InputValidationView}
                            inputStyle={styles.inputStyle}
                        /> */}

                        {/* weekly hours alloted by govt */}
                        {/* <InputValidation
                            uniqueKey={patientFormKeys.weekly_hours_alloted_by_govt}
                            validationObj={validationObj}
                            keyboardType={'number-pad'}
                            value={'' + patientFormValues.weekly_hours_alloted_by_govt}
                            placeHolder={labels.weekly_hours_alloted_by_govt}
                            onChangeText={(text) => {
                                removeErrorTextForInputThatUserIsTyping(patientForm, patientFormKeys.weekly_hours_alloted_by_govt);
                                handleInputChange(patientForm, text, patientFormKeys.weekly_hours_alloted_by_govt)
                            }}
                            style={styles.InputValidationView}
                            inputStyle={styles.inputStyle}
                        /> */}

                        {/* checkbox to assign Employee */}
                        {/* <View style={styles.checkBoxView}>
                            <BouncyCheckbox
                                size={20}
                                fillColor={Colors.primary}
                                unfillColor={Colors.white}
                                iconStyle={{ borderColor: Colors.primary }}
                                isChecked={patientFormValues[patientFormKeys.assign_employee]}
                                onPress={(value) => {
                                    patientFormValues[patientFormKeys.employee] = '';
                                    handleInputChange(patientForm, value, patientFormKeys.assign_employee);
                                }}
                            />
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={styles.saveAsTemplate}>{labels.assign_employee}</Text>
                            </View>
                        </View> */}

                        {/* Employee name*/}
                        {patientFormValues.assign_employee ? (
                            <InputValidation
                                uniqueKey={patientFormKeys.employee}
                                validationObj={validationObj}
                                value={
                                    patientFormValues[patientFormKeys.employee]['name'] ?? ''
                                }
                                placeHolder={labels["employees"]}
                                iconRight="chevron-down"
                                iconColor={Colors.primary}
                                editable={false}
                                onPressIcon={() => {
                                    setActionSheetDecide(patientFormKeys.employee);
                                    //removeErrorTextForInputThatUserIsTyping(patientForm, patientFormKeys.employee);
                                    actionSheetRef.current?.setModalVisible();
                                }}
                                style={styles.InputValidationView}
                                inputStyle={styles.inputStyle}
                            />
                        ) : null}

                        {/* next button */}
                        <CustomButton
                            style={{
                                ...styles.nextButton,
                                backgroundColor: isValid ? Colors.primary : Colors.lightPrimary,
                            }}
                            onPress={() => {
                                if (validation(patientForm)) {
                                    //loginAPI();
                                    // console.log('Validation true');
                                    setViewDecider(5);
                                    // addOrEditPatientAPI(IgnorePersons, personList)
                                } else {
                                    Alert.showAlert(Constants.warning, messages.message_fill_all_required_fields)
                                    // console.log('Validation false');
                                }
                            }}
                            title={labels["Next"]}
                        />


                    </View>
                ) : null}

                {viewDecider == 5 ? (
                    <View style={styles.mainView}>
                        <InputValidation
                            // uniqueKey={patientFormKeys.another_activity}
                            // validationObj={validationObj}
                            value={patientFormValues.another_activity?.name ?? ''}
                            placeHolder={labels["another-activity"]}
                            iconRight="chevron-down"
                            iconColor={Colors.primary}
                            optional={true}
                            editable={false}
                            onPressIcon={() => {
                                // removeErrorTextForInputThatUserIsTyping(patientForm, patientFormKeys.another_activity);
                                setActionSheetDecide(patientFormKeys.another_activity);
                                actionSheetRef.current?.setModalVisible();
                            }}
                            style={styles.InputValidationView}
                            inputStyle={styles.inputStyle}
                        />
                        {/* another_activity_contact_person */}
                        <InputValidation
                            // uniqueKey={patientFormKeys.another_activity_contact_person}
                            // validationObj={personalvalidationObj}
                            value={patientFormValues.another_activity_contact_person}
                            placeHolder={labels["another-activity-contact-person"]}
                            optional={true}
                            onChangeText={text => {
                                // removeErrorTextForInputThatUserIsTyping(personalDetail, patientFormKeys.another_activity_contact_person);
                                handleInputChange(
                                    patientForm,
                                    text,
                                    patientFormKeys.another_activity_contact_person,
                                );
                            }}
                            style={styles.InputValidationView}
                            inputStyle={styles.inputStyle}
                        />
                        {/* another activity name */}
                        <InputValidation
                            // uniqueKey={patientFormKeys.another_activity_name}
                            // validationObj={personalvalidationObj}
                            value={patientFormValues.another_activity_name}
                            placeHolder={labels["name"]}
                            optional={true}
                            onChangeText={text => {
                                // removeErrorTextForInputThatUserIsTyping(personalDetail, patientFormKeys.another_activity_name);
                                handleInputChange(
                                    patientForm,
                                    text,
                                    patientFormKeys.another_activity_name,
                                );
                            }}
                            style={styles.InputValidationView}
                            inputStyle={styles.inputStyle}
                        />

                        {/* another activity's contact number */}
                        <InputValidation
                            maskedInput={true}
                            mask={Constants.phone_number_format}
                            optional={true}
                            keyboardType={'number-pad'}
                            value={'' + patientFormValues.activitys_contact_number}
                            placeHolder={labels["contact-number"]}
                            onChangeText={text => {
                                removeErrorTextForInputThatUserIsTyping(
                                    personalDetail,
                                    patientFormKeys.activitys_contact_number,
                                );
                                handleInputChange(
                                    patientForm,
                                    text,
                                    patientFormKeys.activitys_contact_number,
                                );
                            }}
                            style={styles.InputValidationView}
                            inputStyle={styles.inputStyle}
                        />


                        {/* another activity's full address */}

                        <InputValidation
                            multiline={true}
                            dropDownListData={activitys_full_address}
                            value={patientFormValues.activitys_full_address}
                            placeHolder={labels["full-address"]}
                            optional={true}
                            onChangeText={text => {
                                // removeErrorTextForInputThatUserIsTyping(patientFormKeys.description);
                                filterSuggestion(text, (filteredData) => { setActivitys_full_address(filteredData) })
                                removeErrorTextForInputThatUserIsTyping(
                                    personalDetail,
                                    patientFormKeys.activitys_full_address,
                                );

                                handleInputChange(patientForm, text, patientFormKeys.activitys_full_address,
                                );
                            }}

                            onPressDropDownListitem={(choosenSuggestion) => {
                                handleInputChange(patientForm, choosenSuggestion, patientFormKeys.activitys_full_address,)
                                // handleInputChange(patientForm, choosenSuggestion, patientFormKeys.full_address)

                                setActivitys_full_address([])
                            }}
                            style={styles.InputValidationView}
                            inputStyle={{ ...styles.inputStyle, ...{ height: 110 } }}
                        />

                        {/* Repetition type */}
                        {/* <InputValidation
                            // iconRight="chevron-down"
                            // uniqueKey={patientFormKeys.repetition_type}
                            // validationObj={validationObj}
                            // value={patientFormKeys.week_days}
                            placeHolder={labels.select_days}
                            // onPressIcon={() => {
                            //     removeErrorTextForInputThatUserIsTyping(patientFormKeys.repetition_type)
                            //     setActionSheetDecide(patientFormKeys.repetition_type);
                            //     actionSheetRef.current?.setModalVisible()
                            // }}
                            style={{ ...styles.InputValidationView, width: "48%" }}
                            inputStyle={{ ...styles.inputStyle }}
                            editable={false}
                        /> */}

                        <Text
                            style={{
                                fontFamily: Assets.fonts.robotoMedium,
                                fontSize: getProportionalFontSize(15),
                                marginTop: 10,
                                color: Colors.darkPrimary
                            }}>
                            {labels["weekdays"]}{' '}
                        </Text>

                        <FlatList
                            show={false}
                            contentContainerStyle={{ marginTop: Constants.formFieldTopMargin }}
                            keyExtractor={(item, index) => item.number}
                            horizontal
                            data={week_days}
                            renderItem={({ item, index }) => {
                                // console.log("item", item)
                                return (
                                    <TouchableOpacity
                                        onPress={() => {
                                            let temp_week_days2 = [...week_days];
                                            temp_week_days2.map(obj => {
                                                if (item.number == obj.number)
                                                    obj.selected = !obj.selected;
                                            });

                                            // setPatientFormValues({
                                            //     ...patientFormValues,
                                            //     week_days: [...temp_week_days2],
                                            // });
                                            setweek_days(temp_week_days2)
                                            // handleInputChange(patientForm, [...temp_week_days], patientFormKeys.week_days)
                                        }}
                                        style={{
                                            ...styles.weekCircleView,
                                            backgroundColor: item.selected
                                                ? Colors.primary
                                                : Colors.white,
                                        }}>
                                        <Text
                                            style={{
                                                ...styles.weekText,
                                                color: !item.selected ? Colors.primary : Colors.white,
                                            }}>
                                            {item.name}
                                        </Text>
                                    </TouchableOpacity>
                                );
                            }}
                        />
                        {/* <ErrorComp
                            uniqueKey={patientFormKeys.week_days}
                            validationObj={validationObj} /> */}

                        {/* next button */}
                        <CustomButton
                            style={{
                                ...styles.nextButton,
                                backgroundColor: isValid ? Colors.primary : Colors.lightPrimary,
                            }}
                            onPress={() => {
                                // if (validation(patientForm)) {
                                //     console.log('Validation true')
                                setViewDecider(6);
                                // }
                                // else {
                                //     console.log('Validation false')
                                // }
                            }}
                            title={labels["Next"]}
                        />
                    </View>
                ) : null}

                {viewDecider == 6 ? patientFormValues.agency_hours.length > 0 ? (
                    <View style={styles.mainView}>
                        <FlatList
                            show={false}
                            contentContainerStyle={{}}
                            keyExtractor={(item, index) => '' + index}
                            data={patientFormValues.agency_hours}
                            ListFooterComponent={() => {
                                if (routeParams.patientId) return null;
                                return (
                                    <>
                                        {decisionvalidationObj.issuer_name.invalid || decisionvalidationObj.number_of_hours.invalid || decisionvalidationObj.start_date.invalid || decisionvalidationObj.end_date.invalid
                                            ? <Text style={{
                                                color: Colors.red,
                                                fontFamily: Assets.fonts.regular,
                                                fontSize: getProportionalFontSize(12),
                                                marginTop: 7
                                            }}>{"All fields are required"}</Text>
                                            : null}
                                        <CustomButton
                                            onPress={() => {
                                                let tempDate = [...patientFormValues.agency_hours];
                                                tempDate.push({
                                                    assigned_hours: '',
                                                    name: '',
                                                    start_date: '',
                                                    end_date: '',
                                                });
                                                setPatientFormValues({
                                                    ...patientFormValues,
                                                    [patientFormKeys.agency_hours]: tempDate,
                                                });
                                            }}
                                            title={labels["add-more-decision"]}
                                            style={{ marginTop: Constants.formFieldTopMargin }}
                                        />
                                    </>
                                );
                            }}
                            renderItem={({ item, index }) => {
                                return (
                                    <>
                                        {index != 0 ? (
                                            <View
                                                style={{
                                                    borderWidth: 0.5,
                                                    width: '100%',
                                                    borderColor: Colors.gray,
                                                    marginTop: Constants.formFieldTopMargin,
                                                }}
                                            />
                                        ) : null}
                                        <View
                                            style={{
                                                flexDirection: 'row',
                                                alignItems: 'center',
                                                justifyContent: 'space-between',
                                                marginTop: 10,
                                            }}>
                                            <Text
                                                style={{
                                                    fontSize: getProportionalFontSize(14),
                                                    fontFamily: Assets.fonts.bold,
                                                    color: Colors.primary,
                                                }}>
                                                {`${labels["decision-date"]} (${index + 1})`}
                                            </Text>
                                            {index != 0 ? (
                                                <Icon
                                                    name="trash"
                                                    color={Colors.red}
                                                    size={25}
                                                    onPress={() => {
                                                        let tempDate = [...patientFormValues.agency_hours];
                                                        tempDate.splice(index, 1);
                                                        setPatientFormValues({
                                                            ...patientFormValues,
                                                            [patientFormKeys.agency_hours]: tempDate,
                                                        });
                                                    }}
                                                />
                                            ) : null}
                                        </View>
                                        <InputValidation
                                            // uniqueKey={patientFormKeys.agency_hours}
                                            // validationObj={validationObj}
                                            placeHolder={labels["issuer"]}
                                            // optional={true}
                                            onChangeText={text => {
                                                let tempData = [...patientFormValues.agency_hours];
                                                tempData[index]['name'] = text;
                                                removeErrorTextForInputThatUserIsTyping(
                                                    decision,
                                                    patientFormKeys.agency_hours,
                                                );
                                                setPatientFormValues({
                                                    ...patientFormValues,
                                                    [patientFormKeys.agency_hours]: tempData,
                                                });
                                            }}
                                            style={styles.InputValidationView}
                                            inputStyle={styles.inputStyle}
                                            value={item.name}
                                        />

                                        <InputValidation
                                            // uniqueKey={patientFormKeys.agency_hours}
                                            // validationObj={decisionvalidationObj}
                                            keyboardType={'number-pad'}
                                            value={'' + item.assigned_hours}
                                            placeHolder={labels["no-of-hours"]}
                                            // optional={true}
                                            maxLength={4}
                                            onChangeText={
                                                // item.assigned_hours.length == 3
                                                //     ? () => Alert.showToast(messages.maximum_limit_reached, Constants.success)
                                                //     : 
                                                (text) => {
                                                    let tempData = [...patientFormValues.agency_hours];
                                                    if (Number(text) < Number(Constants.maximum_assign_hours_per_week)) {
                                                        tempData[index]['assigned_hours'] = text;
                                                    } else {
                                                        tempData[index]['assigned_hours'] = Constants.maximum_assign_hours_per_week;
                                                        Alert.showToast(labels.max_limit_reached)
                                                    }
                                                    setPatientFormValues({
                                                        ...patientFormValues,
                                                        [patientFormKeys.agency_hours]: tempData,
                                                    });
                                                    removeErrorTextForInputThatUserIsTyping(decision, patientFormKeys.agency_hours,);
                                                    if (item.start_date && item.end_date)
                                                        calculateHours(index)
                                                }

                                            }
                                            style={styles.InputValidationView}
                                            inputStyle={styles.inputStyle}
                                        />

                                        <InputValidation
                                            iconRight="calendar"
                                            iconColor={Colors.primary}
                                            editable={false}
                                            isIconTouchable={true}
                                            onPressIcon={() => {
                                                setMode(Constants.DatePickerModes.date_mode);
                                                setDatePickerKey(patientFormKeys.agency_hours);
                                                setHowManyTimesArrIndexNKey({
                                                    index: index,
                                                    key: 'start_date',
                                                });
                                                setOpenDatePicker(true);
                                            }}
                                            value={item.start_date ? formatDate(item.start_date) : ''}
                                            placeHolder={labels["start-date"]}
                                            style={styles.InputValidationView}
                                            inputStyle={styles.inputStyle}
                                        />

                                        {item.start_date ? (
                                            <InputValidation
                                                iconRight="calendar"
                                                iconColor={Colors.primary}
                                                editable={false}
                                                isIconTouchable={true}
                                                onPressIcon={() => {
                                                    setMode(Constants.DatePickerModes.date_mode);
                                                    setDatePickerKey(patientFormKeys.agency_hours);
                                                    setHowManyTimesArrIndexNKey({
                                                        index: index,
                                                        key: 'end_date',
                                                    });
                                                    setOpenDatePicker(true);
                                                }}
                                                value={item.end_date ? formatDate(item.end_date) : ''}
                                                placeHolder={labels["end-date"]}
                                                style={styles.InputValidationView}
                                                inputStyle={styles.inputStyle}
                                            />
                                        ) : null}
                                        {
                                            item?.assigned_hours_per_day
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
                                        }

                                    </>
                                );
                            }}
                        />

                        {/* next button */}
                        <CustomButton
                            style={{
                                ...styles.nextButton,
                                backgroundColor: isValid ? Colors.primary : Colors.lightPrimary,
                            }}
                            onPress={() => {
                                // setViewDecider(7);
                                // console.log("patientFormValues *******************", patientFormValues)
                                // console.log(" PersonsList *******************", personList)

                                if (validation(decision)) {
                                    //loginAPI();
                                    // console.log('Validation true');
                                    setViewDecider(7);
                                } else {
                                    Alert.showAlert(Constants.warning, messages.message_fill_all_required_fields)
                                    // console.log('Validation false');
                                }

                                // if (validation(patientForm)) {
                                //     console.log('Validation true')
                                //     // addOrEditPatientAPI(IgnorePersons, personList)

                                // }
                                // else {
                                //     console.log('Validation false')
                                // }
                            }}
                            title={labels["Next"]}
                        />
                    </View>
                ) : setViewDecider(7) : null}
                {viewDecider == 7 ? (
                    <View
                        style={{
                            flex: 1,
                            paddingHorizontal: Constants.globalPaddingHorizontal,
                        }}>
                        <UploadedFileViewer
                            isLoading={uploadingFile}
                            data={patientFormValues.documents}
                            setNewData={newArr => {
                                handleInputChange(
                                    patientForm,
                                    newArr,
                                    patientFormKeys.documents,
                                );
                            }}
                        />
                        {/* UPLOAD */}
                        <TouchableOpacity
                            onPress={() => {
                                setActionSheetDecide(patientFormKeys.attachment);
                                actionSheetRef?.current?.setModalVisible();
                            }}
                            style={{
                                ...styles.nextButton,
                                marginVertical: 0,
                                marginTop: 30,
                                minHeight: 35,
                                backgroundColor: Colors.white,
                                flexDirection: 'row',
                                alignItems: 'center',
                                borderWidth: 1.5,
                                borderColor: Colors.primary,
                                borderRadius: 10,
                            }}>
                            {uploadingFile ? (
                                <ProgressLoader
                                    onActivityIndicator={true}
                                    onActivityIndicatorSize="small"
                                    onActivityIndicatorColor={Colors.primary}
                                />
                            ) : (
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Icon
                                        name="cloud-upload-sharp"
                                        color={Colors.primary}
                                        size={30}
                                    />
                                    <Text
                                        style={{
                                            ...styles.normalText,
                                            color: Colors.primary,
                                            marginStart: 5,
                                        }}>
                                        {labels["upload"]}
                                    </Text>
                                </View>
                            )}
                        </TouchableOpacity>
                        <CustomButton
                            style={{
                                ...styles.nextButton,
                                marginVertical: 0,
                                marginTop: Constants.formFieldTopMargin,
                                backgroundColor: Colors.primary,
                            }}
                            isLoading={uploadingFile}
                            onPress={() => {
                                Keyboard.dismiss()
                                let badWordString = getBadWordString();
                                //console.log('validation success')
                                if (badWordString) {
                                    Alert.showBasicDoubleAlertForBoth(badWordString, () => { addOrEditPatientAPI(IgnorePersons, personList); }, null, messages.message_bad_word_alert)
                                }
                                else
                                    addOrEditPatientAPI(IgnorePersons, personList);

                                // addOrEditPatientAPI(IgnorePersons, personList);
                            }}
                            title={labels["save"]}
                        />
                    </View>
                ) : null}
            </KeyboardAwareScrollView>
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
        // backgroundColor: Colors.transparent,
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
        paddingHorizontal: 16,
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
    checkBoxView: { flexDirection: 'row', alignItems: 'center', marginTop: 30 },
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
    agencyInputMainView: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 5,
    },
    agencyInput: {
        width: '45%',
        height: 40,
        borderWidth: 1,
        borderRadius: 15,
        borderColor: Colors.primary,
        paddingHorizontal: 10,
    },
    weekCircleView: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.primary,
        borderRadius: 20,
        height: 40,
        width: 40,
        marginStart: 5,
        borderWidth: 1,
        borderColor: Colors.primary,
    },
    weekText: {
        fontFamily: Assets.fonts.bold,
        // color: Colors.white,
        // fontSize: getProportionalFontSize(15)
    },
    decisionCard: {
        width: '100%',
        shadowOffset: { width: 3, height: 3 },
        shadowOpacity: 10,
        elevation: 15,
        shadowColor:
            Platform.OS == 'ios'
                ? Colors.shadowColorIosDefault
                : Colors.shadowColorAndroidDefault,
        shadowRadius: 10,
        backgroundColor: Colors.white,
        // padding: Constants.globalPaddingHorizontal,
        marginVertical: 10,
        borderRadius: 10,
        // marginHorizontal: Constants.globalPaddingHorizontal
    },
    //
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
});
