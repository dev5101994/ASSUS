import React from 'react';
import {
    StyleSheet,
    Text, View, SafeAreaView, Image, TouchableOpacity, ScrollView, FlatList
} from 'react-native';
import Colors from '../Constants/Colors';
import Assets from '../Assets/Assets'
import { getProportionalFontSize, formatDate, formatTime, getActionSheetAPIDetail, jsCoreDateCreator, getJSObjectFromTimeString, } from '../Services/CommonMethods';
import InputValidation from '../Components/InputValidation';
import BouncyCheckbox from "react-native-bouncy-checkbox";
import Constants from '../Constants/Constants'
import ProgressLoader from '../Components/ProgressLoader'
import { useSelector, useDispatch } from 'react-redux'
import { FAB, Portal, Provider } from 'react-native-paper';
import DatePicker from 'react-native-date-picker';
import ActionSheet from 'react-native-actions-sheet';
import ActionSheetComp from '../Components/ActionSheetComp';
import Alert from '../Components/Alert';
import CustomButton from '../Components/CustomButton'
import FormSubHeader from '../Components/FormSubHeader'
import APIService from '../Services/APIService';
import Icon from 'react-native-vector-icons/MaterialIcons';
import MSDataViewer from '../Components/MSDataViewer';
import { RadioButton } from 'react-native-paper';

const limitations = [{ name: "limitations1", id: 1 }, { name: "limitations2", id: 2 }, { name: "limitations3", id: 3 }];
const relation = [
    // { name: "Contact Person", id: 1 }, 
    { name: "caretaker", id: 2 },
    { name: "staff", id: 3 }];


const week_days_data = [
    { name: 'S', number: 0, selected: false }, { name: 'M', number: 1, selected: false }, { name: 'T', number: 2, selected: false },
    { name: 'W', number: 3, selected: false }, { name: 'T', number: 4, selected: false },
    { name: 'F', number: 5, selected: false }, { name: 'S', number: 6, selected: false }
]
export default IPFormComp = (props) => {

    // REDUX hooks
    const dispatch = useDispatch();
    const labels = useSelector(state => state.Labels);
    const labelsImplentationPlanDetail = useSelector(state => state.Labels);
    const messages = useSelector(state => state.Labels);
    const UserLogin = useSelector(state => state.User.UserLogin);

    const goal = [
        { name: "no_restriction", id: 1, label: labels.no_restriction },
        { name: "slight-restriction", id: 2, label: labels.slight_restriction },
        { name: "moderate-restriction", id: 3, label: labels.moderate_restriction },
        { name: "large-limitation", id: 4, label: labels.large_limitation },
        { name: "total-limitation", id: 5, label: labels.total_limitation },
        { name: "non-specific", id: 6, label: labels.non_specific },
        // { name: "other", id: 7, label: labels.other },
    ];

    const subGoal = [
        { name: "maintain-ability", id: 1, label: labels.maintain_ability },
        { name: "improve-ability", id: 2, label: labels.improve_ability },
        { name: "develop-ability", id: 3, label: labels.develop_ability },
        { name: "improve-participation", id: 4, label: labels.improve_participation },
        { name: "manage-independently", id: 5, label: labels.manage_independently },
        { name: "non-specific", id: 6, label: labels.non_specific },
        // { name: "other", id: 7, label: labels.other },
    ];

    //Constants
    const formFieldTopMargin = Constants.formFieldTopMargin;

    // Immutable Variables
    const initialValidationObj = {
        title: {
            invalid: false,
            title: ''
        },
        // what_happened: {
        //     invalid: false,
        //     title: ''
        // },
        // how_it_happened: {
        //     invalid: false,
        //     title: ''
        // },
        // when_it_started: {
        //     invalid: false,
        //     title: ''
        // },
        // what_to_do: {
        //     invalid: false,
        //     title: ''
        // },
        plan_start_date: {
            invalid: false,
            title: ''
        },
        // plan_start_time: {
        //     invalid: false,
        //     title: ''
        // },
        end_date: {
            invalid: false,
            title: ''
        },
        goal: {
            invalid: false,
            title: ''
        },
        // who_should_give_the_support: {
        //     invalid: false,
        //     title: ''
        // }

    }

    //initialValues
    const ipInitialValues = {
        what_happened: "",
        how_it_happened: "",
        when_it_started: "",
        what_to_do: "",
        sub_goal: "",
        plan_start_date: "",
        plan_start_time: "",
        end_date: '',
        end_time: "",
        remark: "",
        activity_message: "",
        save_as_template: false,
        title: "",
        assign_employee: false,
        employee: "",
        choose_from_template: {},

        // goal specific fields
        goal: "",
        no_restriction: '',
        slight_restriction: "",
        large_limit: "",
        moderate_restriction: "",
        total_restriction: "",
        non_specific: ""
    };

    //uniqueKeys
    const ipFormKeys = {
        patient: "patient",
        category: "category",
        subcategory: "subcategory",
        what_happened: "what_happened",
        how_it_happened: "how_it_happened",
        when_it_started: "when_it_started",
        what_to_do: "what_to_do",
        sub_goal: "sub_goal",
        plan_start_date: "plan_start_date",
        plan_start_time: "plan_start_time",
        remark: "remark",
        activity_message: "activity_message",
        save_as_template: "save_as_template",
        title: "title",
        assign_employee: "assign_employee",
        employee: "employee",
        end_date: "end_date",
        end_time: "end_time",
        choose_from_template: "choose_from_template",

        // goal specific keys
        goal: "goal",
        no_restriction: 'no_restriction',
        slight_restriction: "slight_restriction",
        large_limit: "large_limit",
        moderate_restriction: "moderate_restriction",
        total_restriction: "total_restriction",
        non_specific: "non_specific",

        // new change
        how_many_times_a_day: "how_many_times_a_day",
        limitations: "limitations",
        who_should_give_the_support: "who_should_give_the_support",
        goal_details: 'goal_details',
        sub_goal_details: "sub_goal_details",
        week_days: "week_days",
        when_support_is_to_be_given: "when_support_is_to_be_given",
        describe_limitation: "describe_limitation",
        how_support_should_be_given: 'how_support_should_be_given',
        when_support_is_to_be_given: "when_support_is_to_be_given",
        subGoalSelect: "subGoalSelect",
        limitation_details: "limitation_details"

    };



    // useState hooks
    const [checked, setChecked] = React.useState('first');
    const [day, setDay] = React.useState(week_days_data)
    const [ipValidationObj, setIPValidationObj] = React.useState({ ...initialValidationObj });
    const [ipFormValues, setIPFormValues] = React.useState({ ...props.item.ipForm });
    const [isItemFound, setIsItemFound] = React.useState(false)

    const [goalSuggestion, setGoalSuggestion] = React.useState([]);
    const [subgoalSuggestion, setSubgoalSuggestion] = React.useState([]);
    const [limitationsSuggestion, setLimitationsSuggestion] = React.useState([]);
    const [remarkSuggestion, setRemarkSuggestion] = React.useState([]);

    const [isLoading, setIsLoading] = React.useState(false);
    const [isValid, setIsValid] = React.useState(true);
    const [actionSheetDecide, setActionSheetDecide] = React.useState('');
    const [openDatePicker, setOpenDatePicker] = React.useState(false);
    const [mode, setMode] = React.useState(Constants.DatePickerModes.date_mode);
    const [datePickerKey, setDatePickerKey] = React.useState(null);
    const [showGoalSubHeadings, setShowGoalSubHeadings] = React.useState(false);
    const [openFAB, setOpenFAB] = React.useState(false)

    const [employeeAS, setEmployeeAS] = React.useState(getActionSheetAPIDetail({
        url: Constants.apiEndPoints.userList, params: { user_type_id: '3' }, debugMsg: "employee-list", token: UserLogin.access_token, perPage: Constants.perPage,
        selectedData: ipFormValues.employee ? [ipFormValues[ipFormKeys.employee]] : []
    }));
    const [chooseFromTemplateAS, setChooseFromTemplateAS] = React.useState(getActionSheetAPIDetail({
        url: Constants.apiEndPoints.ipTemplateList, debugMsg: "chooseFromTemplate-list", token: UserLogin.access_token,
        selectedData: []
    }));

    const [limitationAS, setLimitationAS] = React.useState(getActionSheetAPIDetail({
        url: '', debugMsg: "", token: '',
        selectedData: [], data: limitations
    }));
    const [relationAS, setRelationAS] = React.useState(getActionSheetAPIDetail({
        url: '', debugMsg: "", token: '',
        selectedData: [], data: relation
    }));
    const [goalAS, setGoalAS] = React.useState(getActionSheetAPIDetail({
        url: '', debugMsg: "", token: '',
        selectedData: [], data: goal
    }));
    const [subGoalAS, setSubGoalAS] = React.useState(getActionSheetAPIDetail({
        url: '', debugMsg: "", token: '',
        selectedData: [], data: subGoal
    }));


    // // BadWords & Suggetion

    // const [suggestion, setSuggestion] = React.useState([]);
    // const [badWords, setBadWords] = React.useState([]);


    //   // useEffect hooks
    //   React.useEffect(() => {
    //     CommonAPIFunctions.getSuggestions(UserLogin.access_token, (data) => { setSuggestion(data) });
    //     CommonAPIFunctions.getBadWords(UserLogin.access_token, (data) => { setBadWords(data) });
    //     // userDetailAPI()

    // }, [])

    // const getBadWordString = () => {
    //     let result = '';
    //     for (let i = 0; i < badWords?.length; i++) {
    //         let currBadWord = badWords[i]?.name?.toLowerCase();

    //         if (ipFormValues?.title?.toLowerCase()?.includes(currBadWord)
    //             || ipFormValues?.who_should_give_the_support?.toLowerCase()?.includes(currBadWord)
    //             || ipFormValues?.how_support_should_be_given?.toLowerCase()?.includes(currBadWord)
    //             || ipFormValues?.goal?.toLowerCase()?.includes(currBadWord)
    //             || ipFormValues?.sub_goal?.toLowerCase()?.includes(currBadWord)
    //             // || ipFormValues?.another_activity_name?.toLowerCase()?.includes(currBadWord)
    //             // || ipFormValues?.activitys_full_address?.toLowerCase()?.includes(currBadWord)
    //             // || ipFormValues?.issuer_name?.toLowerCase()?.includes(currBadWord)
    //             // || ipFormValues?.special_information?.toLowerCase()?.includes(currBadWord)
    //         ) {
    //             result = result + badWords[i]?.name + ", ";
    //         }
    //     }
    //     if (result)
    //         result = result?.substring(0, result?.length - 2);
    //     return result;
    // }

    // useEffect hooks
    React.useEffect(() => {
        props.setTitleAndFunctionForIP({
            title: `( ${props.index + 1} / ${props.length} )`,
            func: () => {
                // console.log('func called------------', ipFormValues)
                props.setIpForm(ipFormValues)
                if (props.index - 1 < 0) {
                    props.setViewDecider(props.viewDecider - 1)
                }
                else {
                    props.setIPFormCompIndex(props.index - 1)
                }
                props.keyboardScrollViewRef?.scrollTo({ animated: true, offset: 0 });
            }
        })
    }, [ipFormValues])


    //hooks
    const actionSheetRef = React.useRef();

    const handleInputChange = (value, key) => {
        props.seIsAllIPFilledUp(false)
        setIPFormValues({
            ...ipFormValues,
            [key]: value,
        });
    };

    const getBadWordString = () => {
        let array = [
            ipFormValues.title, ipFormValues.how_support_should_be_given,
            ipFormValues.goal,
            ipFormValues.sub_goal, ipFormValues.remark, ipFormValues.activity_message,
            ipFormValues.no_restriction, ipFormValues.slight_restriction,
            ipFormValues.large_limit, ipFormValues.moderate_restriction,
            ipFormValues.total_restriction, ipFormValues.non_specific,
            ipFormValues.how_many_times_a_day, ipFormValues.limitations,
            ipFormValues.subGoalSelect
        ]
        let result = '';
        for (let i = 0; i < props?.badWords?.length; i++) {
            let currBadWord = props?.badWords[i]?.name?.toLowerCase();
            array.map((str) => {
                if (str?.toLowerCase()?.includes(currBadWord)) {
                    if (!result?.toLowerCase()?.includes(currBadWord))
                        result = result + props?.badWords[i]?.name + ", ";
                }
            })
        }
        if (result)
            result = result?.substring(0, result?.length - 2);
        return result;
    }

    const validation = () => {
        // return true;

        let validationObjTemp = { ...ipValidationObj };
        let isValid = true;
        //  console.log('validationObjTemp===', JSON.stringify(validationObjTemp))
        for (const [key, value] of Object.entries(validationObjTemp)) {
            // console.log(`${key}: ${ipFormValues[key]}`);
            if (ipFormValues[key] == '') {
                // console.log('key', key)
                value['invalid'] = true;
                value['title'] = labels[key + '_required']
                isValid = false;
                break;
            }
        }
        if (ipFormValues[ipFormKeys.save_as_template] && ipFormValues[ipFormKeys.title] == '') {
            // console.log(labels[ipFormKeys.title + '_required'])
            Alert.showToast(labels[ipFormKeys.title + '_required'], Constants.warning)
            isValid = false;

        }
        if (ipFormValues[ipFormKeys.assign_employee] && ipFormValues[ipFormKeys.employee] == '') {
            Alert.showToast(labels[ipFormKeys.employee + '_required'], Constants.warning)
            isValid = false;

        }
        setIPValidationObj({ ...validationObjTemp });
        // console.log('isValid', isValid)
        return isValid;
    };

    const removeErrorTextForInputThatUserIsTyping = (uniqueKey) => {
        let tempValidationObj = { ...ipValidationObj }
        tempValidationObj[uniqueKey] = initialValidationObj[uniqueKey];
        setIPValidationObj(tempValidationObj);
    }

    const closeActionSheet = () => {
        setActionSheetDecide('');
        actionSheetRef?.current?.setModalVisible();
    }


    const getWeekDays = (daysArr) => {
        let week_day = week_days_data;
        for (let i = 0; i < daysArr.length; i++) {
            week_day.map((v, index) => {
                // console.log("v.number", v.number)
                // console.log("daysArr[i]", daysArr[i])
                if (v.number == daysArr[i]) {
                    v.selected = true
                }
            })
        }
        return week_day
    }


    const getIPDetails = async (item) => {
        if (!item || (Object.keys(item).length <= 0)) {
            setIPFormValues({
                ...ipFormValues,
                [ipFormKeys.choose_from_template]: {},
            })
            return;
        }
        setIsLoading(true);
        // let params = {
        // }
        // console.log("item", item)
        let url = Constants.apiEndPoints.implementationPlan + "/" + item.ip_id;
        // console.log("response?.data?.payload?.assign_employee", response?.data?.payload?.assign_employee);
        let response = await APIService.getData(url, UserLogin.access_token, null, "IPDetailAPI");
        if (!response.errorMsg) {
            // console.log(' getJSObjectFromTimeString(response.data.payload.plan_start_time)=========================', getJSObjectFromTimeString(response.data.payload.plan_start_time))
            setIPFormValues({
                ...ipFormValues,
                [ipFormKeys.choose_from_template]: item,
                // [ipFormKeys.what_happened]: response.data.payload.what_happened,
                // [ipFormKeys.how_it_happened]: response.data.payload.how_it_happened,
                // [ipFormKeys.goal]: response.data.payload.goal,
                // [ipFormKeys.sub_goal]: response.data.payload.sub_goal,
                // [ipFormKeys.remark]: response.data.payload.remark,
                [ipFormKeys.plan_start_date]: response.data.payload.start_date ? jsCoreDateCreator(response.data.payload.start_date) : "",
                // [ipFormKeys.plan_start_time]: getJSObjectFromTimeString(response.data.payload.plan_start_time),
                //[ipFormKeys.plan_start_time]: jsCoreDateCreator(response.data.payload.plan_start_time),
                [ipFormKeys.end_date]: response.data.payload.end_date ? jsCoreDateCreator(response.data.payload.end_date) : '',
                // [ipFormKeys.end_time]: getJSObjectFromTimeString(response.data.payload.end_date),
                // [ipFormKeys.activity_message]: response.data.payload.activity_message,


                [ipFormKeys.title]: item.template_title,
                // [ipFormKeys.plan_start_date]: response.data.payload.plan_start_date,
                // [ipFormKeys.plan_start_time]: response.data.payload.plan_start_time,
                // [ipFormKeys.end_date]: response.data.payload.end_date,
                // [ipFormKeys.end_time]: response.data.payload.end_time,
                [ipFormKeys.goal]: response?.data?.payload?.goal ?? "",
                [ipFormKeys.limitations]: response?.data?.payload?.limitations ?? "",
                [ipFormKeys.limitation_details]: response?.data?.payload?.limitation_details ?? "",
                [ipFormKeys.how_support_should_be_given]: response?.data?.payload?.how_support_should_be_given ?? "",
                [ipFormKeys.week_days]: response?.data?.payload?.week_days ? getWeekDays(response?.data?.payload?.week_days) : [],
                [ipFormKeys.how_many_times_a_day]: response?.data?.payload?.how_many_time ?? "",
                [ipFormKeys.when_support_is_to_be_given]: response?.data?.payload?.when_during_the_day ?? "",
                [ipFormKeys.no_restriction]: response?.data?.payload?.no_restriction ?? "",
                [ipFormKeys.sub_goal]: response?.data?.payload?.sub_goal ?? "",
                [ipFormKeys.subGoalSelect]: response?.data?.payload?.sub_goal_selected ?? "",
                [ipFormKeys.sub_goal_details]: response?.data?.payload?.sub_goal_details ?? "",

                [ipFormKeys.assign_employee]: response?.data?.payload?.assign_employee ? true : false,
                [ipFormKeys.employee]: response?.data?.payload?.assign_employee?.employee ?? {},
            })
            if (props.index + 1 >= props.length) {
                props.seIsAllIPFilledUp(true)
            }
            setIsLoading(false);
            // setIsPer(false);
        }
        else {
            setIsLoading(false);
            Alert.showAlert(Constants.danger, response.errorMsg);
        }
    }


    const filterSuggestion = (query, setFilteredData) => {
        if (query) {
            // Making a case insensitive regular expression
            const regex = new RegExp(`${query.trim()}`, 'i');
            // Setting the filtered film array according the query
            if (setFilteredData)
                setFilteredData(props?.suggestion.filter((suggestion) => suggestion?.paragraph?.search(regex) >= 0))
        } else {
            // If the query is null then return blank
            if (setFilteredData)
                setFilteredData([])
        }
    }

    // Render view
    //console.log('ipFormValues==========', ipFormValues)
    return (
        //Main View 

        <View style={styles.mainView}>

            {
                isLoading
                    ? <ProgressLoader />
                    : null
            }

            {/* <FormSubHeader
                leftIconName={"chevron-back-circle-outline"}
                onPressLeftIcon={() => {
                    props.setIpForm({ ...ipFormValues })
                    if (props.index - 1 < 0) {
                        props.setViewDecider(1)
                    }
                    else {
                        props.setIPFormCompIndex(props.index - 1)
                    }
                }}
                title={`( ${props.index + 1} / ${props.length} )`}
            /> */}

            {/* Patient name */}
            <View style={{ padding: 10, marginTop: Constants.formFieldTopMargin, justifyContent: "center", alignItems: "center", backgroundColor: props.item?.category_color ?? Colors.primary, alignSelf: "center", borderRadius: 15, width: "80%" }}>
                <Text style={[styles.countIndicatorText, { color: "white" }]}>{`${props.patientDetail?.name}`}</Text>
            </View>

            {/* category and sub category heading tag */}
            <View style={{ padding: 10, marginTop: Constants.formFieldTopMargin, justifyContent: "center", alignItems: "center", backgroundColor: props.item?.category_color ?? Colors.primary, alignSelf: "center", borderRadius: 15, width: "80%" }}>
                <Text style={[styles.countIndicatorText, { color: "white" }]}>{`${props.category?.name} - ${props.item?.name}`}</Text>
            </View>

            {/* choose from template  */}
            <InputValidation
                // uniqueKey={ipFormKeys.employee}
                //validationObj={ipValidationObj}
                optional={true}
                value={ipFormValues[ipFormKeys.choose_from_template]?.template_title ?? ''}
                placeHolder={labels.choose_from_template}
                iconRight='chevron-down'
                iconColor={Colors.primary}
                editable={false}
                onPressIcon={() => {
                    setActionSheetDecide(ipFormKeys.choose_from_template);
                    //removeErrorTextForInputThatUserIsTyping(ipFormKeys.category);
                    actionSheetRef.current?.setModalVisible();
                }}

                style={styles.InputValidationView}
                inputStyle={styles.inputStyle}
            />

            {/* title */}
            <InputValidation
                uniqueKey={ipFormKeys.title}
                validationObj={ipValidationObj}
                value={ipFormValues[ipFormKeys.title]}
                placeHolder={labels.title}
                onChangeText={(text) => {
                    removeErrorTextForInputThatUserIsTyping(ipFormKeys.title);
                    handleInputChange(text, ipFormKeys.title)
                }}
                style={styles.InputValidationView}
                inputStyle={styles.inputStyle}
            />

            {/* what_happened */}
            {/* <InputValidation
                uniqueKey={ipFormKeys.what_happened}
                validationObj={ipValidationObj}
                multiline={true}
                value={ipFormValues.what_happened}
                placeHolder={labels.what_happened}
                onChangeText={(text) => {
                    removeErrorTextForInputThatUserIsTyping(ipFormKeys.what_happened);
                    handleInputChange(text, ipFormKeys.what_happened)
                }}
                style={styles.InputValidationView}
                inputStyle={{ ...styles.inputStyle, ...{ height: 110 } }}
            /> */}

            {/* how_it_happened */}
            {/* <InputValidation
                uniqueKey={ipFormKeys.how_it_happened}
                validationObj={ipValidationObj}
                multiline={true}
                value={ipFormValues.how_it_happened}
                placeHolder={labels.how_it_happened}
                onChangeText={(text) => {
                    removeErrorTextForInputThatUserIsTyping(ipFormKeys.how_it_happened);
                    handleInputChange(text, ipFormKeys.how_it_happened)
                }}
                style={styles.InputValidationView}
                inputStyle={{ ...styles.inputStyle, ...{ height: 110 } }}
            /> */}

            {/* when_it_started */}
            {/* <InputValidation
                uniqueKey={ipFormKeys.when_it_started}
                validationObj={ipValidationObj}
                multiline={true}
                value={ipFormValues.when_it_started}
                placeHolder={labels.when_it_started}
                onChangeText={(text) => {
                    removeErrorTextForInputThatUserIsTyping(ipFormKeys.when_it_started);
                    handleInputChange(text, ipFormKeys.when_it_started)
                }}
                style={styles.InputValidationView}
                inputStyle={{ ...styles.inputStyle, ...{ height: 110 } }}
            /> */}

            {/* what_to_do */}
            {/* <InputValidation
                uniqueKey={ipFormKeys.what_to_do}
                validationObj={ipValidationObj}
                multiline={true}
                value={ipFormValues.what_to_do}
                placeHolder={labels.what_to_do}
                onChangeText={(text) => {
                    removeErrorTextForInputThatUserIsTyping(ipFormKeys.what_to_do);
                    handleInputChange(text, ipFormKeys.what_to_do)
                }}
                style={styles.InputValidationView}
                inputStyle={{ ...styles.inputStyle, ...{ height: 110 } }}
            /> */}

            {/* start date */}
            <InputValidation
                uniqueKey={ipFormKeys.plan_start_date}
                validationObj={ipValidationObj}
                iconRight='calendar'
                iconColor={Colors.primary}
                editable={false}
                onPressIcon={() => {
                    if (props.isEditable) {
                        removeErrorTextForInputThatUserIsTyping(ipFormKeys.plan_start_date)
                        setOpenDatePicker(true);
                        setMode(Constants.DatePickerModes.date_mode);
                        setDatePickerKey(ipFormKeys.plan_start_date)
                    }
                }}
                value={ipFormValues[ipFormKeys.plan_start_date] ? formatDate(ipFormValues[ipFormKeys.plan_start_date]) : ''}
                placeHolder={labels.plan_start_date}
                style={styles.InputValidationView}
                inputStyle={styles.inputStyle}
            />

            {/* plan start time */}
            {/* <InputValidation
                // uniqueKey={ipFormKeys.plan_start_time}
                // validationObj={ipValidationObj}
                value={ipFormValues[ipFormKeys.plan_start_time] ? formatTime(ipFormValues[ipFormKeys.plan_start_time]) : ''}
                iconRight='time'
                iconColor={Colors.primary}
                editable={false}
                onPressIcon={() => {
                    if (props.isEditable) {
                        // removeErrorTextForInputThatUserIsTyping(ipFormKeys.plan_start_time)
                        setOpenDatePicker(true);
                        setMode(Constants.DatePickerModes.time_mode);
                        setDatePickerKey(ipFormKeys.plan_start_time)
                    }
                }}
                placeHolder={labels.plan_start_time}
                style={styles.InputValidationView}
                inputStyle={styles.inputStyle}
            /> */}

            {/* plan end date */}
            <InputValidation
                uniqueKey={ipFormKeys.end_date}
                validationObj={ipValidationObj}
                value={ipFormValues[ipFormKeys.end_date] ? formatDate(ipFormValues[ipFormKeys.end_date]) : ''}
                iconRight='calendar'
                iconColor={Colors.primary}
                editable={false}
                onPressIcon={() => {
                    if (props.isEditable) {
                        removeErrorTextForInputThatUserIsTyping(ipFormKeys.end_date)
                        setOpenDatePicker(true);
                        setMode(Constants.DatePickerModes.date_mode);
                        setDatePickerKey(ipFormKeys.end_date)
                    }
                }}
                placeHolder={labels.end_date}
                style={styles.InputValidationView}
                inputStyle={styles.inputStyle}
            />
            {/* plan_end_time */}
            {/* <InputValidation
                // uniqueKey={ipFormKeys.end_time}
                // validationObj={ipValidationObj}
                value={ipFormValues[ipFormKeys.end_time] ? formatTime(ipFormValues[ipFormKeys.end_time]) : ''}
                iconRight='time'
                iconColor={Colors.primary}
                editable={false}
                onPressIcon={() => {
                    if (props.isEditable) {
                        // removeErrorTextForInputThatUserIsTyping(ipFormKeys.end_time)
                        setOpenDatePicker(true);
                        setMode(Constants.DatePickerModes.time_mode);
                        setDatePickerKey(ipFormKeys.end_time)
                    }
                }}
                placeHolder={labels.end_time}
                style={styles.InputValidationView}
                inputStyle={styles.inputStyle}
            /> */}
            {/* how the supportshould be given (input) */}
            <InputValidation
                // uniqueKey={ipFormKeys.how_support_should_be_given}
                // validationObj={ipValidationObj}
                optional={true}
                value={ipFormValues.how_support_should_be_given}
                placeHolder={labels.how_the_support_to_be_given}
                onChangeText={(text) => {
                    // removeErrorTextForInputThatUserIsTyping(ipFormKeys.how_support_should_be_given);
                    handleInputChange(text, ipFormKeys.how_support_should_be_given)
                }}
                style={styles.InputValidationView}
                inputStyle={{ ...styles.inputStyle, }}
            />

            {/* who_should_give_the_support */}
            <InputValidation
                // uniqueKey={ipFormKeys.who_should_give_the_support}
                // validationObj={ipValidationObj}
                optional={true}
                // value={ipFormValues?.who_should_give_the_support?.name ?? ''}
                placeHolder={labels.who_should_give_the_support}
                iconRight='chevron-down'
                iconColor={Colors.primary}
                editable={false}
                onPressIcon={() => {
                    setActionSheetDecide(ipFormKeys.who_should_give_the_support);
                    // removeErrorTextForInputThatUserIsTyping(ipFormKeys.who_should_give_the_support);
                    actionSheetRef.current?.setModalVisible();
                }}
                style={styles.InputValidationView}
                inputStyle={styles.inputStyle}
            />
            <MSDataViewer
                data={ipFormValues?.who_should_give_the_support ?? []}
                // keyName={"designation"}
                setNewDataOnPressClose={(newArr) => {
                    setRelationAS({ ...relationAS, selectedData: newArr });
                    handleInputChange(newArr, ipFormKeys.who_should_give_the_support)
                }}
            />


            {/* goal  */}
            <InputValidation
                uniqueKey={ipFormKeys.goal}
                validationObj={ipValidationObj}
                // dropDownListData={goalSuggestion}
                // onPressDropDownListitem={(choosenSuggestion) => {
                //     handleInputChange(choosenSuggestion, ipFormKeys.goal)
                //     setGoalSuggestion([])
                // }}
                multiline={true}
                value={ipFormValues.goal}
                placeHolder={labels.goal}
                onChangeText={(text) => {
                    removeErrorTextForInputThatUserIsTyping(ipFormKeys.goal);
                    // filterSuggestion(text, (filteredData) => { setGoalSuggestion(filteredData) })
                    handleInputChange(text, ipFormKeys.goal)
                }}
                style={styles.InputValidationView}
                inputStyle={{ ...styles.inputStyle, ...{ height: 100 } }}
            />


            {/* <InputValidation
                // uniqueKey={ipFormKeys.employee}
                //validationObj={ipValidationObj}
                optional={true}
                value={ipFormValues.goal?.name ?? ''}
                placeHolder={labels.goal}
                iconRight='chevron-down'
                iconColor={Colors.primary}
                editable={false}
                onPressIcon={() => {
                    setActionSheetDecide(ipFormKeys.goal);
                    removeErrorTextForInputThatUserIsTyping(ipFormKeys.goal);
                    actionSheetRef.current?.setModalVisible();
                }}
                style={styles.InputValidationView}
                inputStyle={styles.inputStyle}
            /> */}
            {/* goal_details */}
            {/* {
                ipFormValues.goal?.name
                    ? <InputValidation
                        // uniqueKey={ipFormKeys.goal_details}
                        // validationObj={ipValidationObj}
                        multiline={true}
                        value={ipFormValues.goal_details}
                        placeHolder={labels.goal_details}
                        onChangeText={(text) => {
                            removeErrorTextForInputThatUserIsTyping(ipFormKeys.goal_details);
                            handleInputChange(text, ipFormKeys.goal_details)
                        }}
                        style={styles.InputValidationView}
                        inputStyle={{ ...styles.inputStyle, ...{ height: 100 } }}
                    /> : null
            } */}
            {/* limitations  (dropdown)*/}
            {/* <InputValidation
                // uniqueKey={ipFormKeys.employee}
                //validationObj={ipValidationObj}
                optional={true}
                value={ipFormValues.limitations?.name ?? ''}
                placeHolder={labels.limitations}
                iconRight='chevron-down'
                iconColor={Colors.primary}
                editable={false}
                onPressIcon={() => {
                    setActionSheetDecide(ipFormKeys.limitations);
                    removeErrorTextForInputThatUserIsTyping(ipFormKeys.limitations);
                    actionSheetRef.current?.setModalVisible();
                }}

                style={styles.InputValidationView}
                inputStyle={styles.inputStyle}
            /> */}

            <View style={{ width: "100%", marginTop: 10 }}>
                <Text style={{
                    fontFamily: Assets.fonts.regular,
                    fontSize: getProportionalFontSize(15),
                }}>{labels.limitation}</Text>

                <FlatList
                    data={goal}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => {
                        return (
                            <View style={styles.redioListItems}>
                                <RadioButton
                                    color={Colors.primary}
                                    value={item.name}
                                    status={ipFormValues.limitations === item.name ? 'checked' : 'unchecked'}
                                    onPress={() => {

                                        if (ipFormValues.limitations == item.name)
                                            handleInputChange("", ipFormKeys.limitations)
                                        else
                                            // console.log("item.name--------------------------", item.name)
                                            handleInputChange(item.name, ipFormKeys.limitations)

                                    }}
                                /><Text style={styles.RadioBtnsText}>{item.label}</Text>
                            </View>
                        )
                    }}
                />
            </View>
            {
                ipFormValues.limitations
                    ? <InputValidation
                        // uniqueKey={ipFormKeys.how_support_should_be_given}
                        // validationObj={ipValidationObj}
                        // dropDownListData={limitationsSuggestion}
                        // onPressDropDownListitem={(choosenSuggestion) => {
                        //     handleInputChange(choosenSuggestion, ipFormKeys.limitation_details)
                        //     setLimitationsSuggestion([])
                        // }}
                        optional={true}
                        multiline={true}
                        value={ipFormValues.limitation_details}
                        placeHolder={ipFormValues.limitations ? `${labels.describe} ${labelsImplentationPlanDetail[ipFormValues.limitations]}` : labels.describe_limitation}
                        onChangeText={(text) => {
                            // removeErrorTextForInputThatUserIsTyping(ipFormKeys.describe_limitation);
                            //  filterSuggestion(text, (filteredData) => { setLimitationsSuggestion(filteredData) })
                            handleInputChange(text, ipFormKeys.limitation_details)
                        }}
                        style={styles.InputValidationView}
                        inputStyle={{ ...styles.inputStyle, ...{ height: 100 } }}
                    /> : null
            }

            {/* when the support should be given  */}

            {/* days */}
            {/* <Text style={{
                fontFamily: Assets.fonts.regular,
                fontSize: getProportionalFontSize(15),
                marginTop: 10
            }}>{labels.days}</Text>
            <FlatList
                show={false}
                contentContainerStyle={{ marginTop: Constants.formFieldTopMargin }}
                keyExtractor={(item, index) => item.number}
                horizontal
                data={ipFormValues.week_days}
                renderItem={({ item, index }) => {
                    // console.log("item", item)
                    return (
                        <TouchableOpacity
                            onPress={() => {
                                let temp_week_days = [...ipFormValues.week_days]
                                temp_week_days.map((obj) => {
                                    if (item.number == obj.number)
                                        obj.selected = !obj.selected
                                })
                                // setDay([...temp_week_days])
                                handleInputChange([...temp_week_days], ipFormKeys.week_days)
                            }}
                            style={{ ...styles.weekCircleView, backgroundColor: item.selected ? Colors.primary : Colors.white }} >
                            <Text style={{ ...styles.weekText, color: !item.selected ? Colors.primary : Colors.white }}>{item.name}</Text>
                        </TouchableOpacity>
                    )
                }}
            /> */}


            {/* how many times a day(input) */}
            {/* <InputValidation
                // uniqueKey={ipFormKeys.no_restriction}
                // validationObj={ipValidationObj}
                optional={true}
                value={ipFormValues.how_many_times_a_day}
                placeHolder={labels.how_many_times_a_day}
                keyboardType={"number-pad"}
                maxLength={2}
                onChangeText={(text) => {
                    // removeErrorTextForInputThatUserIsTyping(ipFormKeys.how_many_times_a_day);
                    handleInputChange(text, ipFormKeys.how_many_times_a_day)
                }}
                style={styles.InputValidationView}
                inputStyle={{ ...styles.inputStyle, }}
            /> */}

            {/* when(input) */}
            {/* <InputValidation
                // uniqueKey={ipFormKeys.when_support_is_to_be_given}
                // validationObj={ipValidationObj}
                optional={true}
                value={ipFormValues.when_support_is_to_be_given}
                placeHolder={labels.when_support_is_to_be_given}

                onChangeText={(text) => {
                    removeErrorTextForInputThatUserIsTyping(ipFormKeys.when_support_is_to_be_given);
                    handleInputChange(text, ipFormKeys.when_support_is_to_be_given)
                }}
                style={styles.InputValidationView}
                inputStyle={{ ...styles.inputStyle, }}
            /> */}

            {/* <TouchableOpacity
                style={styles.header}
                onPress={() => setShowGoalSubHeadings(!showGoalSubHeadings)} >
                <Text style={styles.headerText}>{labels.more_goals_fields}</Text>
                <Icon name={!showGoalSubHeadings ? 'expand-more' : 'expand-less'} color={Colors.black} size={25} />
            </TouchableOpacity> */}

            {showGoalSubHeadings
                ? <View style={{ paddingHorizontal: 10 }}>
                    {/* no restriction */}
                    <InputValidation
                        // uniqueKey={ipFormKeys.no_restriction}
                        // validationObj={ipValidationObj}
                        optional={true}
                        multiline={true}
                        value={ipFormValues.no_restriction}
                        placeHolder={labels.no_restriction}
                        onChangeText={(text) => {
                            // removeErrorTextForInputThatUserIsTyping(ipFormKeys.no_restriction);
                            handleInputChange(text, ipFormKeys.no_restriction)
                        }}
                        style={styles.InputValidationView}
                        inputStyle={{ ...styles.inputStyle, ...{ height: 110 } }}
                    />

                    {/* slight restriction */}
                    <InputValidation
                        // uniqueKey={ipFormKeys.goal}
                        // validationObj={ipValidationObj}
                        optional={true}
                        multiline={true}
                        value={ipFormValues.slight_restriction}
                        placeHolder={labels.slight_restriction}
                        onChangeText={(text) => {
                            // removeErrorTextForInputThatUserIsTyping(ipFormKeys.slight_restriction);
                            handleInputChange(text, ipFormKeys.slight_restriction)
                        }}
                        style={styles.InputValidationView}
                        inputStyle={{ ...styles.inputStyle, ...{ height: 110 } }}
                    />

                    {/* moderate restriction */}
                    <InputValidation
                        // uniqueKey={ipFormKeys.goal}
                        // validationObj={ipValidationObj}
                        optional={true}
                        multiline={true}
                        value={ipFormValues.moderate_restriction}
                        placeHolder={labels.moderate_restriction}
                        onChangeText={(text) => {
                            // removeErrorTextForInputThatUserIsTyping(ipFormKeys.moderate_restriction);
                            handleInputChange(text, ipFormKeys.moderate_restriction)
                        }}
                        style={styles.InputValidationView}
                        inputStyle={{ ...styles.inputStyle, ...{ height: 110 } }}
                    />

                    {/* large limit */}
                    <InputValidation
                        // uniqueKey={ipFormKeys.goal}
                        // validationObj={ipValidationObj}
                        optional={true}
                        multiline={true}
                        value={ipFormValues.large_limit}
                        placeHolder={labels.large_limit}
                        onChangeText={(text) => {
                            // removeErrorTextForInputThatUserIsTyping(ipFormKeys.large_limit);
                            handleInputChange(text, ipFormKeys.large_limit)
                        }}
                        style={styles.InputValidationView}
                        inputStyle={{ ...styles.inputStyle, ...{ height: 110 } }}
                    />

                    {/* total restriction */}
                    <InputValidation
                        // uniqueKey={ipFormKeys.goal}
                        // validationObj={ipValidationObj}
                        optional={true}
                        multiline={true}
                        value={ipFormValues.total_restriction}
                        placeHolder={labels.total_restriction}
                        onChangeText={(text) => {
                            // removeErrorTextForInputThatUserIsTyping(ipFormKeys.total_restriction);
                            handleInputChange(text, ipFormKeys.total_restriction)
                        }}
                        style={styles.InputValidationView}
                        inputStyle={{ ...styles.inputStyle, ...{ height: 110 } }}
                    />

                    {/* non specific */}
                    <InputValidation
                        // uniqueKey={ipFormKeys.goal}
                        // validationObj={ipValidationObj}
                        optional={true}
                        multiline={true}
                        value={ipFormValues.non_specific}
                        placeHolder={labels.non_specific}
                        onChangeText={(text) => {
                            // removeErrorTextForInputThatUserIsTyping(ipFormKeys.non_specific);
                            handleInputChange(text, ipFormKeys.non_specific)
                        }}
                        style={styles.InputValidationView}
                        inputStyle={{ ...styles.inputStyle, ...{ height: 110 } }}
                    />
                </View>
                : null}

            {/* sub goal */}
            <InputValidation
                optional={true}
                // uniqueKey={ipFormKeys.sub_goal}
                //validationObj={ipValidationObj}
                // dropDownListData={subgoalSuggestion}
                // onPressDropDownListitem={(choosenSuggestion) => {
                //     handleInputChange(choosenSuggestion, ipFormKeys.sub_goal)
                //     setSubgoalSuggestion([])
                // }}
                multiline={true}
                value={ipFormValues.sub_goal}
                placeHolder={labels.sub_goal}
                onChangeText={(text) => {
                    //removeErrorTextForInputThatUserIsTyping( ipFormKeys.sub_goal);
                    // filterSuggestion(text, (filteredData) => { setSubgoalSuggestion(filteredData) })
                    handleInputChange(text, ipFormKeys.sub_goal)
                }}
                style={styles.InputValidationView}
                inputStyle={{ ...styles.inputStyle, ...{ height: 110 } }}
            />

            {/* <InputValidation
                // uniqueKey={ipFormKeys.employee}
                //validationObj={ipValidationObj}
                optional={true}
                value={ipFormValues.subGoalSelect?.name ?? ''}
                placeHolder={labels.subGoalSelect}
                iconRight='chevron-down'
                iconColor={Colors.primary}
                editable={false}
                onPressIcon={() => {
                    setActionSheetDecide(ipFormKeys.sub_goal);
                    // removeErrorTextForInputThatUserIsTyping(ipFormKeys.subGoalSelect);
                    actionSheetRef.current?.setModalVisible();
                }}

                style={styles.InputValidationView}
                inputStyle={styles.inputStyle}
            /> */}

            <View style={{ width: "100%", marginTop: 10 }}>
                <FlatList
                    data={subGoal}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => {
                        return (
                            <View style={styles.redioListItems}>
                                <RadioButton
                                    color={Colors.primary}
                                    value={item.name}
                                    status={ipFormValues.subGoalSelect === item.name ? 'checked' : 'unchecked'}
                                    onPress={() => {

                                        if (ipFormValues.subGoalSelect == item.name)
                                            handleInputChange("", ipFormKeys.subGoalSelect)
                                        else
                                            handleInputChange(item.name, ipFormKeys.subGoalSelect)
                                    }}
                                /><Text style={styles.RadioBtnsText}>{item.label}</Text>
                            </View>
                        )
                    }}
                />
            </View>

            {/* sub_goal_details */}
            {
                ipFormValues.subGoalSelect
                    ? <InputValidation
                        // uniqueKey={ipFormKeys.sub_goal_details}
                        // validationObj={ipValidationObj}
                        // dropDownListData={remarkSuggestion}
                        // onPressDropDownListitem={(choosenSuggestion) => {
                        //     handleInputChange(choosenSuggestion, ipFormKeys.sub_goal_details)
                        //     setRemarkSuggestion([])
                        // }}
                        multiline={true}
                        optional={true}
                        value={ipFormValues.sub_goal_details}
                        placeHolder={`${labels.describe}  ${labels[ipFormValues.subGoalSelect]}`}
                        onChangeText={(text) => {
                            // removeErrorTextForInputThatUserIsTyping(ipFormKeys.sub_goal_details);
                            //  filterSuggestion(text, (filteredData) => { setRemarkSuggestion(filteredData) })
                            handleInputChange(text, ipFormKeys.sub_goal_details)
                        }}
                        style={styles.InputValidationView}
                        inputStyle={{ ...styles.inputStyle, ...{ height: 100 } }}
                    /> : null
            }

            {/* <InputValidation
                // uniqueKey={ipFormKeys.employee}
                //validationObj={ipValidationObj}
                optional={true}
                value={ipFormValues.sub_goal?.name ?? ''}
                placeHolder={labels.sub_goal}
                iconRight='chevron-down'
                iconColor={Colors.primary}
                editable={false}
                onPressIcon={() => {
                    setActionSheetDecide(ipFormKeys.sub_goal);
                    removeErrorTextForInputThatUserIsTyping(ipFormKeys.sub_goal);
                    actionSheetRef.current?.setModalVisible();
                }}

                style={styles.InputValidationView}
                inputStyle={styles.inputStyle}
            /> */}

            {/* sub_goal_details */}
            {/* {
                ipFormValues.sub_goal?.name
                    ? : null
            } */}

            {/* remark */}
            {/* <InputValidation
                uniqueKey={ipFormKeys.remark}
                //validationObj={ipValidationObj}
                multiline={true}
                value={ipFormValues.remark}
                placeHolder={labels.remark}
                onChangeText={(text) => {
                    //removeErrorTextForInputThatUserIsTyping( ipFormKeys.remark);
                    handleInputChange(text, ipFormKeys.remark)
                }}
                style={styles.InputValidationView}
                inputStyle={{ ...styles.inputStyle, ...{ height: 110 } }}
            /> */}

            {/* activity message */}
            {/* <InputValidation
                uniqueKey={ipFormKeys.activity_message}
                //validationObj={ipValidationObj}
                multiline={true}
                value={ipFormValues.activity_message}
                placeHolder={labels.activity_message}
                onChangeText={(text) => {
                    //removeErrorTextForInputThatUserIsTyping( ipFormKeys.activity_message);
                    handleInputChange(text, ipFormKeys.activity_message)
                }}
                style={styles.InputValidationView}
                inputStyle={{ ...styles.inputStyle, ...{ height: 110 } }}
            /> */}

            {/* checkbox to save as template */}
            <View style={styles.checkBoxView}>
                <BouncyCheckbox
                    size={20}
                    fillColor={Colors.primary}
                    unfillColor={Colors.white}
                    iconStyle={{ borderColor: Colors.primary }}
                    isChecked={ipFormValues.save_as_template}
                    onPress={(value) => {
                        // console.log('value----', value)
                        // ipFormValues.title = '';
                        handleInputChange(value, ipFormKeys.save_as_template);
                    }}
                />
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={styles.saveAsTemplate}>{labels.save_as_template}</Text>
                </View>
            </View>

            {/* Template title*/}
            {/* {ipFormValues.save_as_template ?
                <InputValidation
                    uniqueKey={ipFormKeys.title}
                    //validationObj={ipValidationObj}
                    value={ipFormValues[ipFormKeys.title]}
                    placeHolder={labels.title}
                    onChangeText={(text) => {
                        removeErrorTextForInputThatUserIsTyping(ipFormKeys.title);
                        handleInputChange(text, ipFormKeys.title)
                    }}
                    style={styles.InputValidationView}
                    inputStyle={styles.inputStyle}
                />
                : null} */}

            {/* checkbox to assign Employee */}
            <View style={styles.checkBoxView}>
                <BouncyCheckbox
                    size={20}
                    fillColor={Colors.primary}
                    unfillColor={Colors.white}
                    iconStyle={{ borderColor: Colors.primary }}
                    isChecked={ipFormValues[ipFormKeys.assign_employee]}
                    onPress={(value) => {
                        ipFormValues[ipFormKeys.employee] = '';
                        handleInputChange(value, ipFormKeys.assign_employee);
                    }}
                />
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={styles.saveAsTemplate}>{labels.assign_employee}</Text>
                </View>
            </View>

            {/* Employee name*/}
            {ipFormValues.assign_employee ?
                <InputValidation
                    // uniqueKey={ipFormKeys.employee}
                    //validationObj={ipValidationObj}
                    value={ipFormValues[ipFormKeys.employee]['name'] ?? ''}
                    placeHolder={labels.employee}
                    iconRight='chevron-down'
                    iconColor={Colors.primary}
                    editable={false}
                    onPressIcon={() => {
                        if (props.isEditable) {
                            setActionSheetDecide(ipFormKeys.employee);
                            //removeErrorTextForInputThatUserIsTyping(ipFormKeys.category);
                            actionSheetRef.current?.setModalVisible();
                        }

                    }}

                    style={styles.InputValidationView}
                    inputStyle={styles.inputStyle}
                />
                : null}

            {/* Button View */}
            <View style={styles.buttonView}>

                {/* back button */}
                <CustomButton
                    activeOpacity={isValid ? 0 : 1}
                    style={{
                        ...styles.nextButton,
                        backgroundColor: isValid ? Colors.primary : Colors.lightPrimary
                    }}
                    onPress={() => {
                        props.setIpForm({ ...ipFormValues })
                        if (props.index - 1 < 0) {
                            props.setViewDecider(props.viewDecider - 1)
                        }
                        else {
                            props.setIPFormCompIndex(props.index - 1)
                        }
                        props.keyboardScrollViewRef?.scrollTo({ animated: true, offset: 0 });
                    }} title={labels.back} />

                {/* next button */}
                <CustomButton
                    activeOpacity={isValid ? 0 : 1}
                    style={{
                        ...styles.nextButton,
                        backgroundColor: isValid ? Colors.primary : Colors.lightPrimary
                    }}
                    onPress={() => {
                        // console.log("ipFormValues", ipFormValues)
                        if (validation()) {
                            let badWordString = getBadWordString();
                            if (badWordString) {
                                Alert.showBasicDoubleAlertForBoth(badWordString, () => {
                                    props.setIpForm({ ...ipFormValues })
                                    if (props.index + 1 >= props.length) {
                                        props.seIsAllIPFilledUp(true)
                                        props.setViewDecider(props.viewDecider + 1)
                                    }
                                    else {
                                        props.setIPFormCompIndex(props.index + 1)
                                    }
                                    props.keyboardScrollViewRef?.scrollTo({ animated: true, offset: 0 });
                                }, null, messages.message_bad_word_alert)
                            }
                            else {
                                props.setIpForm({ ...ipFormValues })
                                if (props.index + 1 >= props.length) {
                                    props.seIsAllIPFilledUp(true)
                                    props.setViewDecider(props.viewDecider + 1)
                                }
                                else {
                                    props.setIPFormCompIndex(props.index + 1)
                                }
                                props.keyboardScrollViewRef?.scrollTo({ animated: true, offset: 0 });
                            }
                        }
                        else {
                            Alert.showAlert(Constants.warning, labels.message_fill_all_required_fields)
                            // console.log('Validation false')
                        }
                    }} title={labels.Next} />

            </View>

            <DatePicker
                modal
                mode={mode}
                open={openDatePicker}
                // minimumDate={new Date()}
                date={new Date()}
                // is24hourSource={false}
                onConfirm={(date) => {
                    setOpenDatePicker(false)
                    // console.log('date : ', date)
                    let value = '';
                    if (mode == Constants.DatePickerModes.date_mode) {
                        handleInputChange(date, datePickerKey)
                    }
                    else if (mode == Constants.DatePickerModes.time_mode)
                        handleInputChange(date, datePickerKey)
                    else
                        handleInputChange(date, datePickerKey)
                }}
                onCancel={() => {
                    setOpenDatePicker(false)
                }}
            />

            <ActionSheet ref={actionSheetRef} containerStyle={{ backgroundColor: Colors.backgroundColor }}>
                <ActionSheetComp
                    title={labels[actionSheetDecide]}
                    closeActionSheet={closeActionSheet}
                    keyToShowData={actionSheetDecide == ipFormKeys.choose_from_template ? "template_title" : "name"}
                    keyToCompareData="id"

                    multiSelect={(actionSheetDecide == ipFormKeys.who_should_give_the_support) ? true : false}
                    APIDetails={actionSheetDecide == ipFormKeys.employee ? employeeAS
                        : actionSheetDecide == ipFormKeys.choose_from_template ? chooseFromTemplateAS
                            : actionSheetDecide == ipFormKeys.limitations ? limitationAS
                                : actionSheetDecide == ipFormKeys.who_should_give_the_support ? relationAS
                                    : actionSheetDecide == ipFormKeys.goal ? goalAS
                                        : actionSheetDecide == ipFormKeys.sub_goal ? subGoalAS : null}
                    changeAPIDetails={(payload) => {
                        if (actionSheetDecide == ipFormKeys.employee) {
                            setEmployeeAS(getActionSheetAPIDetail({ ...employeeAS, ...payload }))
                        }
                        else if (actionSheetDecide == ipFormKeys.choose_from_template) {
                            setChooseFromTemplateAS(getActionSheetAPIDetail({ ...chooseFromTemplateAS, ...payload }))
                        }
                        else if (actionSheetDecide == ipFormKeys.limitations) {
                            setLimitationAS(getActionSheetAPIDetail({ ...limitationAS, ...payload }))
                        }
                        else if (actionSheetDecide == ipFormKeys.who_should_give_the_support) {
                            setRelationAS(getActionSheetAPIDetail({ ...relationAS, ...payload }))
                        }
                        else if (actionSheetDecide == ipFormKeys.goal) {
                            setGoalAS(getActionSheetAPIDetail({ ...goalAS, ...payload }))
                        }
                        else if (actionSheetDecide == ipFormKeys.sub_goal) {
                            setSubGoalAS(getActionSheetAPIDetail({ ...subGoalAS, ...payload }))
                        }
                    }}
                    onPressItem={(item) => {
                        // console.log('item', item)
                        if (actionSheetDecide == ipFormKeys.employee) {
                            handleInputChange(item, ipFormKeys.employee)
                            removeErrorTextForInputThatUserIsTyping(ipFormKeys.employee)
                        }
                        else if (actionSheetDecide == ipFormKeys.choose_from_template) {
                            // removeErrorTextForInputThatUserIsTyping(ipFormKeys.choose_from_template)
                            setIPValidationObj(initialValidationObj);
                            getIPDetails(item)
                        }
                        else if (actionSheetDecide == ipFormKeys.limitations) {
                            handleInputChange(item, ipFormKeys.limitations)
                            removeErrorTextForInputThatUserIsTyping(ipFormKeys.limitations)
                        }
                        else if (actionSheetDecide == ipFormKeys.who_should_give_the_support) {
                            handleInputChange(item, ipFormKeys.who_should_give_the_support)
                            removeErrorTextForInputThatUserIsTyping(ipFormKeys.who_should_give_the_support)
                        }
                        else if (actionSheetDecide == ipFormKeys.goal) {
                            handleInputChange(item, ipFormKeys.goal)
                            removeErrorTextForInputThatUserIsTyping(ipFormKeys.goal)
                        }
                        else if (actionSheetDecide == ipFormKeys.sub_goal) {
                            handleInputChange(item, ipFormKeys.subGoalSelect)
                            // removeErrorTextForInputThatUserIsTyping(ipFormKeys.sub_goal)
                        }
                    }}
                />
            </ActionSheet>
        </View>
    )
}

const styles = StyleSheet.create({
    countIndicatorText: { fontFamily: Assets.fonts.bold, fontSize: getProportionalFontSize(15), },
    buttonView: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: "space-between"
    },
    headerText: {
        fontFamily: Assets.fonts.semiBold,
        fontSize: getProportionalFontSize(15),
        color: Colors.black
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
        // flex: 1,
        paddingHorizontal: Constants.globalPaddingHorizontal,
        // borderWidth: 1
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
        // backgroundColor: Colors.transparent,
        //borderColor: 'red',
        marginTop: Constants.formFieldTopMargin,
        //borderRadius: 10,
        //color: 'red'
    },
    nextButton: {
        justifyContent: 'center',
        alignItems: 'center',
        width: '48%',
        height: 40,
        borderRadius: 5,
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
    header: {
        flexDirection: "row",
        width: "100%",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: Constants.formFieldTopMargin,
    },
    weekCircleView: { justifyContent: "center", alignItems: "center", backgroundColor: Colors.primary, borderRadius: 15, height: 40, width: 40, marginStart: 5, borderWidth: 1, borderColor: Colors.primary },
    weekText: {
        fontFamily: Assets.fonts.bold,
        // color: Colors.white,
        // fontSize: getProportionalFontSize(15)
    },
    redioListItems: {
        width: "100%",
        flexDirection: "row",
        alignItems: "center"
    },
    RadioBtnsText: {
        fontSize: getProportionalFontSize(14), fontFamily: Assets.fonts.regular
    }


});



