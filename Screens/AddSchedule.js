import { StyleSheet, Text, View, Dimensions, ImageBackground, TouchableOpacity, FlatList, ScrollView } from 'react-native'
import React, { useState } from 'react'
import EmptyList from '../Components/EmptyList';
import Colors from '../Constants/Colors';
// import { getProportionalFontSize, CurruntDate, differenceInWeek } from '../Services/CommonMethods';
import { useSelector, useDispatch } from 'react-redux';
import BaseContainer from '../Components/BaseContainer';
import { Calendar } from 'react-native-calendars';
import Assets from '../Assets/Assets';
import Icon from 'react-native-vector-icons/Ionicons';
import moment from 'moment';
import ScheduleForm from '../Components/ScheduleForm';
import { FAB, Button, Card, Title, Paragraph, Checkbox, Portal, Modal, RadioButton } from 'react-native-paper';
import Constants from '../Constants/Constants';
import APIService from '../Services/APIService';
import ProgressLoader from '../Components/ProgressLoader';
import Alert from '../Components/Alert';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import Can from '../can/Can';
import AddScheduleTemplate from './AddScheduleTemplate';
import InputValidation from '../Components/InputValidation';
import { getProportionalFontSize, getActionSheetAPIDetail, formatDate, formatTime, reverseFormatDate, diffInTime, jsCoreDateCreator, getJSObjectFromTimeString, checkFileSize, formatDateByFormat, isDocOrImage, CurruntDate, differenceInWeek } from '../Services/CommonMethods';
import CustomButton from '../Components/CustomButton';
import ActionSheet from "react-native-actions-sheet";
import DatePicker from 'react-native-date-picker';
import HoursData from '../Components/HoursData';


const week_days_data = [
    { name: 'S', number: 7, selected: false }, { name: 'M', number: 1, selected: false }, { name: 'T', number: 2, selected: false },
    { name: 'W', number: 3, selected: false }, { name: 'T', number: 4, selected: false },
    { name: 'F', number: 5, selected: false }, { name: 'S', number: 6, selected: false }
]

const AddSchedule = (props) => {


    const initialKeys = {
        "employee": "employee",
        "shift": "shift",
        "shift_dates": "shift_dates",
        "start_time": "start_time",
        "end_time": "end_time",
        "company_type": "company_type",
        "patient": "patient",
        "schedule_type": "schedule_type",
        "is_emergency": "is_emergency",
        "marked_dates": "marked_dates",
        "branch": "branch",
        "schedule_template": "schedule_template",
        "employee_type": "employee_type",
    }

    const initialValidation = {
        // [initialKeys.schedule_type]: {
        //     invalid: false,
        //     title: ''
        // },
        [initialKeys.employee]: {
            invalid: false,
            title: ''
        },
        // [initialKeys.shift]: {
        //     invalid: false,
        //     title: ''
        // },
        [initialKeys.start_time]: {
            invalid: false,
            title: ''
        },
        [initialKeys.end_time]: {
            invalid: false,
            title: ''
        },
        [initialKeys.patient]: {
            invalid: false,
            title: ''
        },
        [initialKeys.marked_dates]: {
            invalid: false,
            title: ''
        }
    }

    let initialFormFields = {
        "every_week": "",
        "week_days": week_days_data,
        "employee": [],
        "shift": {},
        "start_time": "",
        "end_time": "",
        "company_type": {},
        "patient": {},
        "schedule_type": "",
        "is_emergency": false,
        "branch": {},
        "schedule_template": {},
        "employee_type": {},
    }
    // REDUX hooks
    const dispatch = useDispatch();
    const isInternetActive = useSelector(state => state.IsInternetActive);
    const UserLogin = useSelector(state => state.User.UserLogin);
    const permissions = UserLogin?.permissions ?? {}
    const labels = useSelector(state => state.Labels);
    //hooks
    const [formFields, setFormFields] = React.useState(initialFormFields);
    // console.log("------------------ formFields", formFields)
    const [startDay, setStartDay] = useState(null);
    const [endDay, setEndDay] = useState(null);
    const [markedDatesForForm, setMarkedDatesForForm] = useState([]);
    const [markedDates, setMarkedDates] = useState({});
    const [DateRange, setDateRange] = React.useState(false);
    const [headerData, setHeaderData] = React.useState({});
    const [calendarDate, setCalendarDate] = React.useState(moment().format('YYYY-MM-DD'));
    const [isModalVisible, setIsModalVisible] = React.useState(false);
    const [scheduleDetails, setScheduleDetails] = React.useState({});
    const [isLoading, setIsLoading] = React.useState(true);
    const [weekLabels, setweekLabels] = React.useState(labels?.every_week ?? "");
    const [allDates, setAllDates] = React.useState([]);
    const [LastDate, setLastDate] = React.useState();
    const [schedule, setSchedule] = React.useState([{
        date: "2022-07-13", "shifts": [
            {
                "shift_id": 82,
                "shift_start_time": "2022-07-04 08:00",
                "shift_end_time": "2022-07-04 17:00",
                "schedule_type": "basic"
            },
            {
                "shift_id": null,
                "shift_start_time": "2022-07-04 20:00",
                "shift_end_time": "2022-07-04 22:00",
                "schedule_type": "extra"
            }
        ]
    }]);
    const empTypeDataArr = [
        { name: labels["seasonal"], id: 1 },
        { name: labels["regular"], id: 2 },
        { name: labels["substitute"], id: 3 },
        { name: labels["other"], id: 4 },
    ];

    //Hooks
    const actionSheetRef = React.useRef();
    //hooks
    // const [formFields, setFormFields] = React.useState({ ...initialValues });
    // console.log("formFields", formFields)
    const [actionSheetDecide, setActionSheetDecide] = React.useState('');
    const [validationObj, setValidationObj] = React.useState({ ...initialValidation });
    // const [isLoading, setIsLoading] = React.useState(false);
    const [mode, setMode] = React.useState(Constants.DatePickerModes.time_mode);
    const [datePickerKey, setDatePickerKey] = React.useState(null);
    const [statusCheckBox, setStatusCheckBox] = React.useState(props.modulesItem?.status ?? false);
    const [openDatePicker, setOpenDatePicker] = React.useState(false);
    const [employeeAS, setEmployeeAS] = React.useState(getActionSheetAPIDetail({
        url: Constants.apiEndPoints.userList, params: { user_type_id: '3', }, debugMsg: "employeeAS", token: UserLogin.access_token,
        selectedData: [],
    }));
    const [workShiftAS, setWorkShiftAS] = React.useState(getActionSheetAPIDetail({
        url: Constants.apiEndPoints.workShifts, debugMsg: "workShiftAS", token: UserLogin.access_token,
        selectedData: [],
    }));
    const [companyTypeListAS, setCompanyTypeListAS] = React.useState(getActionSheetAPIDetail({
        url: Constants.apiEndPoints.companyTypeList, debugMsg: "companyTypeList", token: UserLogin.access_token,
        selectedData: []
    }));
    const [patientListAS, setPatientListAS] = React.useState(getActionSheetAPIDetail({
        url: Constants.apiEndPoints.userList, params: { user_type_id: '6' }, debugMsg: "patientListAS", token: UserLogin.access_token,
        selectedData: [],
    }));
    const [empTypeAS, setempTypeAS] = React.useState(getActionSheetAPIDetail({
        url: '', debugMsg: '', token: '', selectedData: [], data: empTypeDataArr,
    }));
    const [branchAS, setBranchAS] = useState(
        getActionSheetAPIDetail({
            url: Constants.apiEndPoints.userList,
            debugMsg: 'branchList',
            token: UserLogin.access_token,
            selectedData: [],
            params: { user_type_id: '11' },
        }),
    );
    const [scheduleTemplateAS, setScheduleTemplateAS] = useState(
        getActionSheetAPIDetail({
            url: Constants.apiEndPoints?.["schedule-templates"],
            debugMsg: 'schedule-template',
            token: UserLogin.access_token,
            selectedData: [],
        }),
    );

    const onRequestClose = () => {
        setIsModalVisible(false);
    }

    React.useEffect(() => {
        setMarkedDates({})
        setMarkedDatesForForm([])
    }, [DateRange])
    React.useEffect(() => {
        if (props?.route?.params?.scheduleId) {
            getScheduleDetails()
        } else {
            setIsLoading(false);
        }
    }, [])

    React.useEffect(() => {
        if (props?.route?.params?.scheduleId) {
            // console.log("scheduleDetails.user", scheduleDetails.user)
            let temp = { "shift_name": scheduleDetails.shift_name, id: scheduleDetails.shift_id }
            setFormFields({
                ...formFields,
                "employee": scheduleDetails.user,
                "shift": temp,
            })
            setEmployeeAS({ ...employeeAS, selectedData: [scheduleDetails.user], })
            setWorkShiftAS({ ...workShiftAS, selectedData: [temp] })
        }
    }, [])

    const closeActionSheet = () => {
        actionSheetRef?.current?.setModalVisible();
        setActionSheetDecide('');
    }

    const getAPIDetails = () => {
        switch (actionSheetDecide) {
            case initialKeys.employee: {
                return employeeAS
            }
            case initialKeys.shift: {
                return workShiftAS
            }
            case initialKeys.company_type: {
                return companyTypeListAS
            }
            case initialKeys.patient: {
                return patientListAS
            }
            case initialKeys.branch: {
                return branchAS;
            }
            case initialKeys.schedule_template: {
                return scheduleTemplateAS;
            }
            case initialKeys.employee_type: {
                return empTypeAS;
            }
            default: {
                return null
            }
        }
    }

    const changeAPIDetails = (payload) => {
        switch (actionSheetDecide) {
            case initialKeys.employee: {
                setEmployeeAS(getActionSheetAPIDetail({ ...employeeAS, ...payload }))
                break;
            }
            case initialKeys.shift: {
                setWorkShiftAS(getActionSheetAPIDetail({ ...workShiftAS, ...payload }))
                break;
            }
            case initialKeys.company_type: {
                setCompanyTypeListAS(getActionSheetAPIDetail({ ...companyTypeListAS, ...payload }))
                break;
            }
            case initialKeys.patient: {
                setPatientListAS(getActionSheetAPIDetail({ ...patientListAS, ...payload }))
                break;
            }
            case initialKeys.branch: {
                setBranchAS(getActionSheetAPIDetail({ ...branchAS, ...payload }));
                break;
            }
            case initialKeys.schedule_template: {
                setScheduleTemplateAS(getActionSheetAPIDetail({ ...scheduleTemplateAS, ...payload }));
                break;
            }
            case initialKeys.employee_type: {
                setempTypeAS(getActionSheetAPIDetail({ ...empTypeAS, ...payload }));
                break;
            }
            default: {
                break;
            }
        }
    }

    const onPressItem = (item) => {
        // console.log('item---------------', item)
        switch (actionSheetDecide) {
            case initialKeys.employee: {
                handleInputChange(initialKeys.employee, item)
                removeErrorTextForInputThatUserIsTyping(initialKeys.employee)
                break;
            }
            case initialKeys.shift: {
                // console.log("hey user your start date is here------", item)
                setFormFields(
                    {
                        ...formFields,
                        "shift": item,
                        "start_time": item.shift_start_time ? getJSObjectFromTimeString(item.shift_start_time) : "",
                        "end_time": item.shift_end_time ? getJSObjectFromTimeString(item.shift_end_time) : "",
                    }
                )
                // removeErrorTextForInputThatUserIsTyping(initialKeys.shift)
                break;
            }
            case initialKeys.company_type: {
                if (item.id == 1) {
                    setFormFields({ ...formFields, [initialKeys.company_type]: item, [initialKeys.patient]: {} });
                    setPatientListAS(getActionSheetAPIDetail({
                        url: Constants.apiEndPoints.userList, params: { user_type_id: '6' }, debugMsg: "patientListAS", token: UserLogin.access_token,
                        selectedData: [],
                    }))
                } else {
                    handleInputChange(initialKeys.company_type, item);
                }
                removeErrorTextForInputThatUserIsTyping(initialKeys.company_type)
                break;
            }
            case initialKeys.patient: {
                handleInputChange(initialKeys.patient, item)
                removeErrorTextForInputThatUserIsTyping(initialKeys.patient)
                break;
            }
            case initialKeys.branch: {
                setFormFields({ ...formFields, [initialKeys.branch]: item, [initialKeys.patient]: {}, [initialKeys.employee]: {} });
                setPatientListAS(getActionSheetAPIDetail({
                    url: Constants.apiEndPoints.userList, params: { user_type_id: '6', branch_id: item.id }, debugMsg: "patientListAS", token: UserLogin.access_token,
                    selectedData: [],
                }))
                setEmployeeAS(getActionSheetAPIDetail({
                    url: Constants.apiEndPoints.userList, params: { user_type_id: '3', branch_id: item.id, employee_type: formFields.employee_type.id ?? "" }, debugMsg: "employeeAS", token: UserLogin.access_token,
                    selectedData: [],
                }))
                break;
            }
            case initialKeys.schedule_template: {
                handleInputChange(initialKeys.schedule_template, item);
                break;
            }
            case initialKeys.employee_type: {
                setFormFields({ ...formFields, [initialKeys.employee_type]: item, [initialKeys.employee]: {} });
                setEmployeeAS(getActionSheetAPIDetail({
                    url: Constants.apiEndPoints.userList, params: { user_type_id: '3', branch_id: formFields.branch.id ?? "", employee_type: item.id }, debugMsg: "employeeAS", token: UserLogin.access_token,
                    selectedData: [],
                }))
                break;
            }
            default: {
                break;
            }
        }
    }
    const handleInputChange = (key, value) => {
        // console.log("key", key, value)
        setFormFields({ ...formFields, [key]: value })

    }
    const removeErrorTextForInputThatUserIsTyping = (uniqueKey) => {
        let tempValidationObj = { ...initialValidation }
        tempValidationObj[uniqueKey] = initialValidation[uniqueKey];
        setValidationObj(tempValidationObj);
    }
    const validation = () => {
        let validationObjTemp = { ...initialValidation };
        let isValid = true;
        for (const [key, value] of Object.entries(initialValidation)) {
            // console.log("key", key, "formFields?.employee?.length", markedDates)
            if (key == initialKeys.schedule_type && !formFields[key]) {
                // console.log(`${key}-----0`)
                value['invalid'] = true;
                value['title'] = labels["schadule_type_required"]
                isValid = false;
                // break;
            }
            if (key == initialKeys.employee && formFields?.employee?.length == 0) {
                // console.log(`${key}-----1`)
                value['invalid'] = true;
                value['title'] = labels[key + '_required']
                isValid = false;
                // break;
            }
            // if (key == initialKeys.shift && !formFields?.shift?.shift_name) {
            //     console.log(`${key}-----1`)
            //     value['invalid'] = true;
            //     value['title'] = labels[key + '_required']
            //     isValid = false;
            //     break;
            // }
            if (key == initialKeys.start_time && !formFields?.start_time) {
                // console.log(`${key}-----1`, formFields?.key,)
                value['invalid'] = true;
                value['title'] = labels[key + '_required']
                isValid = false;
                // break;
            }
            if (key == initialKeys.end_time && !formFields?.end_time) {
                // console.log(`${key}-----1`, key)
                value['invalid'] = true;
                value['title'] = labels[key + '_required']
                isValid = false;
                // break;
            }
            if (key == initialKeys.patient && !formFields?.patient?.id) {
                if (formFields?.company_type?.id == "2" || formFields?.company_type?.id == "3") {
                    // console.log(`${key}-----1`, key)
                    value['invalid'] = true;
                    value['title'] = labels[key + '_required']
                    isValid = false;
                    // break;
                }

                // 

            }
            if (key == initialKeys.marked_dates && Object.keys(markedDates).length < 1) {
                // console.log(`${key}-----1`, key)
                value['invalid'] = true;
                value['title'] = labels[key + '_required']
                isValid = false;
                break;
            }
        }
        setValidationObj({ ...validationObjTemp });
        return isValid;
    }

    const saveOrEditSchedule = async () => {
        let tempDates = []
        if (DateRange) {
            tempDates = [markedDatesForForm[0], markedDatesForForm[markedDatesForForm.length - 1]]
        }
        let week_days = []
        formFields?.week_days.map((obj) => {
            if (obj.selected) {
                week_days.push("" + obj.number)
            }
        })

        // let emp_id = [];
        // if (formFields?.employee?.length > 0) {
        //     formFields?.employee?.map((obj) => {
        //         emp_id.push(obj.id)
        //     })
        // }
        let params = {
            "is_range": DateRange ? 1 : 0,
            "shift_end_time": formFields?.end_time ? moment(formFields?.end_time).format('hh:mm:ss') : "",
            "shift_start_time": formFields?.start_time ? moment(formFields?.start_time).format('hh:mm:ss') : "",
            "user_id": formFields?.employee?.id,
            "shift_id": formFields?.shift?.id ?? "",
            "week_days": week_days,

            // "shift_id" : "",
            // "user_id" : "3",
            // "patient_id" : "",
            // "is_range": 0,
            // "shift_dates" :["2022-06-03","2022-06-07","2022-06-05"],
            // "shift_start_time" : "10:00",
            // "shift_end_time" : "19:00",
            // "is_repeat":0,
            // "every_week": "",
            // "week_days": []
        }
        if (!props?.route?.params?.scheduleId) {
            params = {
                ...params,
                "shift_dates": DateRange ? tempDates : markedDatesForForm,
                "is_repeat": DateRange ? 1 : 0,
                "every_week": formFields?.every_week ?? "",
                "company_types": formFields?.company_type?.id ?? "",
                "patient_id": formFields?.patient?.id ?? "",
            }
        } else {
            params = {
                ...params,
                shift_date: markedDatesForForm ?? "",
            }
        }


        let url = Constants.apiEndPoints.addSchedule
        if (props?.route?.params?.scheduleId) {
            url = url + "/" + scheduleDetails.id
        }
        // console.log("url", url);
        // console.log("params", params);
        // return
        setIsLoading(true);
        let response = {}
        if (props?.route?.params?.scheduleId) {
            response = await APIService.putData(url, params, UserLogin.access_token, null, "editSchedule");
        } else {
            response = await APIService.postData(url, params, UserLogin.access_token, null, "saveSchedule");
        }
        // console.log("data", response.data)
        if (!response.errorMsg) {
            // console.log('response-------------------+++++++++++++', JSON.stringify(response))
            setIsLoading(true);
            onRequestClose()
            props.navigation.navigate("ScheduleListing", { refresh: true })

        }
        else {
            setIsLoading(false);
            Alert.showBasicAlert(response.errorMsg);
        }
    }

    const getScheduleDetails = async () => {
        setIsLoading(true);
        let url = Constants.apiEndPoints.addSchedule + '/' + props?.route?.params?.scheduleId;
        let response = {};
        response = await APIService.getData(url, UserLogin.access_token, null, 'scheduleDetailAPI',);
        // console.log('----------------------ok', JSON.stringify(response));
        if (!response.errorMsg) {
            setScheduleDetails(response.data.payload);
            // setBranchAS({
            //     ...branchAS,
            //     selectedData: [response?.data?.payload?.branch] ?? [],
            // });

            let temp = { [response.data.payload.shift_date]: { selected: true, } }

            setMarkedDatesForForm([Object.keys(temp)])
            setMarkedDates(temp);
            setCalendarDate(response.data.payload.shift_date);
            setIsLoading(false);
        } else {
            setIsLoading(false);
            Alert.showAlert(Constants.danger, response.errorMsg);
        }
    }

    const get4WeeksSet = (startDay) => {
        const date = []
        let new_data = []
        let chunk = []
        let counter = 1
        let lastDate = moment(startDay).add(27, 'days')
        for (const d = moment(startDay); d.isSameOrBefore(lastDate); d.add(1, 'days')) {

            let temp = { "date": d.format('YYYY-MM-DD'), "shifts": [] }
            date.push(temp);
            if (d.format('YYYY-MM-DD') == lastDate.format('YYYY-MM-DD')) {
                setLastDate(lastDate.format('YYYY-MM-DD'))
                break;
            }
            chunk.push(d.format('YYYY-MM-DD'))
            if (counter == 7) {
                new_data.push(chunk);
                chunk = [];
                counter = 0
            }
            counter++
        }
        // console.log("new_data------------------------", new_data)
        setAllDates(new_data)
        return date;

    }

    const selectedDate = (day) => {
        // day = { "dateString": "2022-06-15", "day": 15, "month": 6, "timestamp": 1655251200000, "year": 2022 }
        removeErrorTextForInputThatUserIsTyping(initialKeys.marked_dates)
        if (props?.route?.params?.scheduleId) {
            let temp = { [day?.dateString]: { selected: true, } }
            setMarkedDatesForForm([day?.dateString])
            setMarkedDates({ ...temp });
        }
        else if (!DateRange) {
            if (markedDatesForForm.length > 0) {
                let index = 0
                let check = markedDatesForForm.find((item) => { return item == day?.dateString })
                if (check) {
                    let newArr = markedDatesForForm.filter((item) => { return check != item })
                    delete markedDates[check]
                    setMarkedDatesForForm([...newArr])
                    setMarkedDates({ ...markedDates });
                    if (markedDatesForForm.length == 0) {
                        setAllDates([])
                        setLastDate()
                    }
                } else {
                    let temp = { [day?.dateString]: { selected: true, } }
                    setMarkedDatesForForm([...markedDatesForForm, day?.dateString])
                    setMarkedDates({ ...markedDates, ...temp });
                    let checkIndex = allDates.map((item, i) => { if (item.date == day?.dateString) index = i; else return false })
                    if (index > 0) {
                        // updateAllDates(index, allDates)
                    }
                    console.log(index)
                }
            }
            else {
                let temp = { [day?.dateString]: { selected: true, } }
                setMarkedDatesForForm([...markedDatesForForm, day?.dateString])
                setMarkedDates({ ...markedDates, ...temp });
                let data = get4WeeksSet(day.dateString)
                // updateAllDates(0, data)

            }
            // console.log('selected days--------------------------allDates ! ', allDates);
        }
        else {
            if (startDay && !endDay) {
                const date = {}
                for (const d = moment(startDay); d.isSameOrBefore(day.dateString); d.add(1, 'days')) {
                    date[d.format('YYYY-MM-DD')] = {
                        // marked: true,
                        color: Colors.primary,
                        textColor: Colors.white
                    };
                    if (d.format('YYYY-MM-DD') === startDay) {
                        date[d.format('YYYY-MM-DD')].startingDay = true
                        // date[d.format('YYYY-MM-DD')].endingDay = false
                        date[d.format('YYYY-MM-DD')].color = Colors.primary
                    };
                    if (d.format('YYYY-MM-DD') === day.dateString) {
                        date[d.format('YYYY-MM-DD')].endingDay = true
                        date[d.format('YYYY-MM-DD')].color = Colors.primary
                    };
                }
                setMarkedDatesForForm(Object.keys(date))
                setMarkedDates(date);
                setEndDay(day.dateString);
                let startDate = startDay + ''
                let endDate = day.dateString + ''
                let week = differenceInWeek(startDate, endDate)
                // console.log("---------week---", week)
                setweekLabels(week)
            } else {
                setStartDay(day.dateString)
                setEndDay(null)
                setMarkedDatesForForm([day.dateString]);
                setMarkedDates({
                    [day.dateString]: {
                        color: Colors.primary,
                        textColor: Colors.white,
                        startingDay: true,
                        endingDay: true
                    }
                })
            }
        }
    }
    function updateAllDates(index = 0, arr = allDates) {
        let allDates_copy = arr;
        allDates_copy[index].shifts.shift_start_time = formatTime(formFields.start_time)
        allDates_copy[index].shifts.shift_end_time = formatTime(formFields.end_time)
        allDates_copy[index].shifts.shift_hours = diffInTime(formFields.start_time, formFields.end_time)
        setAllDates(allDates_copy)
        // alert(index)
        // let allDates_copy = allDates;
        // allDates_copy[index].shifts.shift_start_time = formatTime(formFields.start_time)
        // allDates_copy[index].shifts.shift_end_time = formatTime(formFields.end_time)
        // setAllDates(allDates_copy)
    }
    const calendarTheme = {
        // backgroundColor: '#0ff',
        // textSectionTitleDisabledColor: '#0f5f5f',
        // arrowColor: 'orange',
        // disabledArrowColor: '#afaf1f',
        // indicatorColor: 'blue',
        textDayFontSize: getProportionalFontSize(14),
        textMonthFontSize: getProportionalFontSize(14),
        // textDayHeaderFontSize: getProportionalFontSize(14),

        //
        calendarBackground: Colors.white,
        textMonthFontFamily: Assets.fonts.semiBold,
        monthTextColor: Colors.black,
        todayButtonFontFamily: Assets.fonts.medium,
        textDayHeaderFontFamily: Assets.fonts.semiBold,
        textSectionTitleColor: Colors.white,
        textDayFontFamily: Assets.fonts.semiBold,
        selectedDayBackgroundColor: Colors.primary,
        selectedDayTextColor: Colors.white,
        todayTextColor: Colors.green,
        dayTextColor: Colors.primary,
        textDisabledColor: Colors.darkPlaceHoldColor,

        // dotColor: '#ffadf5',
        // selectedDotColor: '#ff0',


        'stylesheet.calendar.header': {
            week: {
                borderColor: Colors.lightGray,
                borderWidth: 1,
                flexDirection: 'row',
                justifyContent: 'space-between',
                paddingHorizontal: 15,
                backgroundColor: Colors.primary,
                borderRadius: 30,
                paddingTop: 5,
                marginBottom: 10
            },
            // dayTextAtIndex0: {
            //     color: Colors.lightGray
            // },            
        },

    }
    const Arrow = ({ direction }) => {
        if (direction == 'left') { return <Icon name="chevron-back-sharp" size={25} color={Colors.primary} /> }
        else if (direction == 'right') { return <Icon name="chevron-forward-sharp" size={25} color={Colors.primary} style={{}} /> }
        else { return true }
    }

    const getMilliSecondsFromTimeStr = (time = '0') => {
        // console.log("time parameter value ", time)
        let timeArr = time.split(":");
        // console.log("time parameter value in array ", timeArr)
        let millisecond = 0
        if (timeArr[1]) {
            millisecond = ((Number(timeArr[0]) * 60 * 60) + (Number(timeArr[1]) * 60)) * 1000;
        } else {
            millisecond = (Number(timeArr[0]) * 60 * 60) * 1000;
        }

        // console.log("-------timeArr-------------------------------------", millisecond);
        return millisecond
    }
    const timeStrFromMillisecond = (millisecond) => {
        let hours = Math.floor(millisecond / 1000 / 60 / 60);
        millisecond -= hours * 1000 * 60 * 60;
        var minutes = Math.floor(millisecond / 1000 / 60);
        let timeStr = hours.toString() + ":" + minutes.toString()
        // console.log("timeStr--------------", timeStr)
        return timeStr
    }
    const showTableData = () => {
        // let tableCount = 0;
        // let week = 1;
        // let calc_time = "";
        // if (formFields?.start_time && formFields?.end_time) {
        //     calc_time = diffInTime(formFields.start_time, formFields.end_time)
        // }
        // let hours_per_day = "--";
        // if (formFields?.employee?.assigned_work?.assigned_working_hour_per_week) {
        //     hours_per_day = timeStrFromMillisecond((getMilliSecondsFromTimeStr(formFields?.employee?.assigned_work?.assigned_working_hour_per_week) / 7))
        // }
        // console.log("-------hours_per_day-------------------------------------", hours_per_day);
        // let remain_hours = formFields?.employee?.assigned_work?.actual_working_hour_per_week;
        return (
            allDates?.length > 0
                ? <View  >
                    {
                        allDates.map((chunks, i) => {
                            return (
                                chunks.map((date, index) => {
                                    let check = schedule.find((item) => { return item.date == date })
                                    if (check) {
                                        let shift = check.shifts
                                    }
                                    return (
                                        <View key={index}>
                                            {
                                                index == 0
                                                    ? <View>
                                                        <Text style={{ fontFamily: Assets.fonts.semiBold, fontSize: getProportionalFontSize(14), color: Colors.primary }} >Week : - Schedule</Text>
                                                        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                                                            <Text style={{ ...styles.labelsText, width: "10%", }} >#</Text>
                                                            <Text style={{ ...styles.labelsText, width: "35%", }} >{labels.date}</Text>
                                                            <Text style={{ ...styles.labelsText, width: "30%", }} >{labels.shift_time}</Text>
                                                            <Text style={{ ...styles.labelsText, width: "25%", }} >{labels.shift_hours}</Text>
                                                        </View>
                                                    </View>
                                                    : null
                                            }
                                            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                                                {/* <Text style={{ ...styles.secondaryText, marginVertical: 2, width: "10%" }} >#{tableCount}</Text> */}
                                                <Icon name='add-circle-outline' onPress={() => { alert("under construction"); return; updateAllDates(index) }} style={{ width: "10%" }} />
                                                <Text style={{ ...styles.secondaryText, width: "35%" }} >{date}</Text>
                                                <View style={{ ...styles.secondaryText, width: "30%" }} >
                                                    <Text>--</Text>
                                                </View>
                                                <Text style={{ ...styles.secondaryText, width: "25%" }} >{"--"}</Text>
                                                {/* <Text style={{ ...styles.secondaryText, width: "30%", }} >{remain_hours ?? "--"}</Text> */}
                                            </View>
                                            {index == 6 ? <Text style={{ ...styles.labelsText, width: "30%", width: "100%", borderTopWidth: 1, marginBottom: 10 }} >sub_total#</Text> : null}

                                        </View>
                                    )
                                })
                            )
                        })
                    }

                </View>
                : null
        )
    }
    if (isLoading)
        return <ProgressLoader />

    return (
        <BaseContainer
            onPressLeftIcon={() => { props.navigation.pop() }}
            leftIcon="arrow-back"
            leftIconSize={24}
            title={labels["schedule"]}
            leftIconColor={Colors.primary}
        >
            <ScrollView>
                <View style={styles.mainView}>
                    <View style={styles.inputAndAddBtnContainer}>
                        <InputValidation
                            // uniqueKey={initialKeys.branch}
                            // validationObj={validationObj}
                            optional={true}
                            value={formFields.schedule_template?.title ?? ''}
                            placeHolder={labels["ScheduleTemplate"]}
                            iconRight="chevron-down"
                            iconColor={Colors.primary}
                            editable={false}
                            onPressIcon={() => {
                                setActionSheetDecide(initialKeys.schedule_template);
                                actionSheetRef.current?.setModalVisible();
                            }}
                            style={{ marginTop: Constants.formFieldTopMargin, width: "80%", }}
                            inputMainViewStyle={styles.InputValidationView}
                            inputStyle={styles.inputStyle}
                        />
                        <TouchableOpacity
                            onPress={
                                Can(Constants.permissionsKey.scheduleTemplateAdd, permissions)
                                    ? () => { setIsModalVisible(true) }
                                    : Alert.showToast(labels.permission_required_for_this_action)
                            }
                            style={{
                                ...styles.addBtn,
                            }}>
                            <Icon name='add' color={Colors.white} size={24} />
                        </TouchableOpacity>
                    </View>
                    <InputValidation
                        // uniqueKey={initialKeys.branch}
                        // validationObj={validationObj}
                        optional={true}
                        value={formFields.branch?.name ?? ''}
                        placeHolder={labels["branch"]}
                        iconRight="chevron-down"
                        iconColor={Colors.primary}
                        editable={false}
                        onPressIcon={() => {
                            setActionSheetDecide(initialKeys.branch);
                            actionSheetRef.current?.setModalVisible();
                        }}
                        style={styles.InputValidationView}
                        inputStyle={styles.inputStyle}
                    />
                    <InputValidation
                        uniqueKey={initialKeys.patient}
                        validationObj={validationObj}
                        placeHolder={labels['patient']}
                        value={formFields.patient?.name ?? ""}
                        iconRight='chevron-down'
                        iconColor={Colors.primary}
                        editable={false}
                        onPressIcon={() => {
                            setActionSheetDecide(initialKeys.patient)
                            actionSheetRef.current?.setModalVisible()
                        }}
                        style={{ marginTop: Constants.formFieldTopMargin, }}
                        inputMainViewStyle={styles.InputValidationView}
                        inputStyle={styles.inputStyle}
                    />

                    <InputValidation
                        optional={true}
                        value={formFields.employee_type?.name ?? ''}
                        placeHolder={labels["employee-type"] ?? "emp type"}
                        iconRight="chevron-down"
                        iconColor={Colors.primary}
                        editable={false}
                        onPressIcon={() => {
                            setActionSheetDecide(initialKeys.employee_type);
                            actionSheetRef.current?.setModalVisible();
                        }}
                        style={styles.InputValidationView}
                        inputStyle={styles.inputStyle}
                    />

                    <InputValidation
                        uniqueKey={initialKeys.employee}
                        validationObj={validationObj}
                        placeHolder={labels["employees"]}
                        value={formFields.employee?.name ?? ""}
                        iconRight='chevron-down'
                        iconColor={Colors.primary}
                        editable={false}
                        onPressIcon={() => {
                            setActionSheetDecide(initialKeys.employee)
                            actionSheetRef.current?.setModalVisible()
                        }}
                        style={{ marginTop: Constants.formFieldTopMargin, }}
                        inputMainViewStyle={styles.InputValidationView}
                        inputStyle={styles.inputStyle}
                    />


                    {/* emergency checkbox */}
                    <View style={styles.checkBoxView}>
                        <BouncyCheckbox
                            size={20}
                            fillColor={Colors.primary}
                            unfillColor={Colors.white}
                            iconStyle={{ borderColor: Colors.primary }}
                            isChecked={statusCheckBox}
                            onPress={(value) => {
                                // setStatusCheckBox(value);
                                // handleInputChange(initialKeys.is_emergency, value);
                                setFormFields({ ...formFields, [initialKeys.is_emergency]: value, [initialKeys.shift]: {}, [initialKeys.start_time]: "", [initialKeys.end_time]: "", })
                                setWorkShiftAS(getActionSheetAPIDetail({
                                    url: Constants.apiEndPoints.workShifts, params: { "shift_type": value ? 'emergency' : "" }, debugMsg: "workShiftAS", token: UserLogin.access_token,
                                    selectedData: []
                                }));
                            }}
                        />
                        <Text style={styles.RadioBtnsText}>{labels["emergency_shift"] ?? "emergency_shift"}</Text>
                    </View>
                    <InputValidation
                        // uniqueKey={initialKeys.shift}
                        // validationObj={validationObj}
                        placeHolder={labels["workshifts"]}
                        value={formFields.shift?.shift_name ?? ""}
                        optional={true}
                        iconRight='chevron-down'
                        iconColor={Colors.primary}
                        editable={false}
                        onPressIcon={() => {
                            // removeErrorTextForInputThatUserIsTyping(task_details, initialKeys.employee)
                            setActionSheetDecide(initialKeys.shift)
                            actionSheetRef.current?.setModalVisible()
                        }}
                        style={{ marginTop: Constants.formFieldTopMargin, }}
                        inputMainViewStyle={styles.InputValidationView}
                        inputStyle={styles.inputStyle}
                    />
                    <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                        {/* Start time */}
                        <InputValidation
                            uniqueKey={initialKeys.start_time}
                            validationObj={validationObj}
                            iconRight="time"
                            value={formFields?.start_time ? formatTime(formFields.start_time) : ""}
                            placeHolder={labels['start-time']}
                            onPressIcon={() => {
                                setDatePickerKey("start_time")
                                setOpenDatePicker(true)
                            }}
                            style={{ ...styles.InputValidationView, width: "48%", marginBottom: validationObj[initialKeys.end_time]["invalid"] ? getProportionalFontSize(23) : 0 }}
                            inputStyle={{ ...styles.inputStyle }}
                            editable={false}
                        />
                        {/* end time */}
                        <InputValidation
                            uniqueKey={initialKeys.end_time}
                            validationObj={validationObj}
                            iconRight="time"
                            value={formFields.end_time ? formatTime(formFields.end_time) : ""}
                            placeHolder={labels['end-time']}
                            onPressIcon={() => {
                                setDatePickerKey("end_time")
                                setOpenDatePicker(true)
                            }}
                            style={{ ...styles.InputValidationView, width: "48%", marginBottom: validationObj[initialKeys.start_time]["invalid"] ? getProportionalFontSize(23) : 0 }}
                            inputStyle={{ ...styles.inputStyle }}
                            editable={false}
                        />
                    </View>
                    {/* company types */}
                    {/* <InputValidation
                        value={formFields[initialKeys.company_type]['name'] ?? ''}
                        iconRight='chevron-down'
                        iconColor={Colors.primary}
                        editable={false}
                        optional={true}
                        onPressIcon={() => {
                            setActionSheetDecide(initialKeys.company_type);
                            // removeErrorTextForInputThatUserIsTyping(ipFormKeys.category);
                            actionSheetRef.current?.setModalVisible();
                        }}
                        placeHolder={labels["company-types"]}
                        style={{ marginTop: Constants.formFieldTopMargin, }}
                        size={30}
                        inputMainViewStyle={styles.InputValidationView}
                        inputStyle={styles.inputStyle}
                    /> */}

                    {
                        formFields?.employee?.assigned_work
                            ? <HoursData
                                titleName={formFields.employee.name + "'" + labels["s"] + " " + labels["assigned-work-hours"]}
                                label_1={labels["assigned-working-hours-per-week"]}
                                label_2={labels["working-percentage"]}
                                label_3={labels["actual-working-hours-per-week"]}
                                value_for_label_1={`${formFields?.employee?.assigned_work?.assigned_working_hour_per_week ?? "0"}${" " + labels["no-of-hours"]}`}
                                value_for_label_2={`${formFields?.employee?.assigned_work?.working_percent ?? "0"}${"%"}`}
                                value_for_label_3={`${formFields?.employee?.assigned_work?.actual_working_hour_per_week ?? "0"}${" " + labels["no-of-hours"]}`}
                            />
                            : null
                    }
                    {
                        formFields?.patient?.agency_hours
                            ? <HoursData
                                titleName={formFields?.patient?.name + "'" + labels["s"] + " " + labels["assigned-work-hours"]}
                                label_1={labels["assigned-working-hours-per-week"]}
                                label_2={labels["working-percentage"]}
                                label_3={labels["actual-working-hours-per-week"]}
                                value_for_label_1={`${formFields?.patient?.agency_hours[0]?.assigned_hours_per_day ?? "0"}${" " + labels["no-of-hours"]}`}
                                value_for_label_2={`${formFields?.patient?.agency_hours[0]?.assigned_hours_per_week ?? "0"}${" " + labels["no-of-hours"]}`}
                                value_for_label_3={`${formFields?.patient?.agency_hours[0]?.assigned_hours_per_month ?? "0"}${" " + labels["no-of-hours"]}`}
                            />
                            : null
                    }
                    {/*  */}
                    <DatePicker
                        modal
                        mode={mode}
                        open={openDatePicker}
                        minimumDate={formFields?.start_time ? formFields.start_time : null}

                        date={new Date()}
                        onConfirm={(date) => {
                            setOpenDatePicker(false)
                            // console.log('date : ', date)
                            let value = '';
                            if (mode == Constants.DatePickerModes.date_mode) {
                                handleInputChange(datePickerKey, date)
                            }
                            else if (mode == Constants.DatePickerModes.time_mode) {
                                setFormFields({ ...formFields, [datePickerKey]: date, "shift": {}, })
                                removeErrorTextForInputThatUserIsTyping(datePickerKey)
                            }
                            else
                                handleInputChange(datePickerKey, date)
                        }}
                        onCancel={() => {
                            setOpenDatePicker(false)
                        }}
                    />

                    <ActionSheet ref={actionSheetRef}>
                        <ActionSheetComp
                            title={labels[actionSheetDecide]}
                            closeActionSheet={closeActionSheet}
                            keyToShowData={actionSheetDecide == initialKeys.shift ? "shift_name" : actionSheetDecide == initialKeys.schedule_template ? "title" : "name"}
                            keyToCompareData="id"

                            // multiSelect={actionSheetDecide == initialKeys.employee ? true : false}
                            APIDetails={getAPIDetails()}
                            changeAPIDetails={(payload) => changeAPIDetails(payload)}
                            onPressItem={(item) => onPressItem(item)}
                        />
                    </ActionSheet>

                    <View style={{ ...styles.cardStyle, borderWidth: 1, borderColor: validationObj?.[initialKeys.marked_dates]?.["invalid"] ? Colors.red : Colors.transparent }} >

                        <Calendar
                            current={calendarDate}
                            // monthFormat={'yyyy MM'}
                            minDate={allDates?.[0]?.['date'] ?? CurruntDate()}
                            maxDate={LastDate ? reverseFormatDate(LastDate) : null}
                            markingType={DateRange ? 'period' : 'custom'}
                            renderArrow={direction => <Arrow direction={direction} />}
                            onDayPress={(day) => {
                                selectedDate(day)
                            }}
                            firstDay={1}
                            markedDates={markedDates}
                            theme={calendarTheme}
                            enableSwipeMonths={true}
                            onMonthChange={month => {
                                // console.log('month changed', month);
                                setHeaderData(month)
                            }}
                        />

                    </View>
                    <View style={{ marginTop: -20, marginTop: 20 }} >
                        <ErrorComp
                            uniqueKey={initialKeys.marked_dates}
                            validationObj={validationObj} />
                    </View>
                    {
                        showTableData()
                    }
                    {
                        DateRange && markedDatesForForm.length > 1
                            ? <View style={{ ...styles.cardStyle, paddingLeft: 20, }}>
                                {/* repeatetion type */}
                                <InputValidation
                                    // showSoftInputOnFocus={false}                            
                                    // uniqueKey={formFieldsKeys.name}
                                    // validationObj={validationObj}
                                    value={formFields.every_week}
                                    placeHolder={labels["week"]}
                                    onChangeText={(text) => {
                                        // removeErrorTextForInputThatUserIsTyping(formFieldsKeys.name);
                                        setFormFields({ ...formFields, every_week: text })
                                    }}

                                    keyboardType={"number-pad"}
                                    maxLength={2}
                                    style={styles.InputValidationView}
                                    inputStyle={styles.inputStyle}
                                // editable={isEditable}
                                />
                                <Text style={{ fontFamily: Assets.fonts.medium, fontSize: getProportionalFontSize(12), }}>{`${labels.max_week_count} ${weekLabels}`}</Text>

                                <Text style={styles.headingTitleStyle}>{labels["select-days"]}</Text>
                                {/* week_days */}
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
                                                    setFormFields({ ...formFields, week_days: [...temp_week_days] })
                                                }}
                                                style={{ ...styles.weekCircleView, backgroundColor: item.selected ? Colors.primary : Colors.white }} >
                                                <Text style={{ ...styles.weekText, color: !item.selected ? Colors.primary : Colors.white }}>{item.name}</Text>
                                            </TouchableOpacity>
                                        )
                                    }}
                                />
                                {/* <ErrorComp
                        uniqueKey={formFieldsKeys.week_days}
                        validationObj={validationForTimeAndRepetition} /> */}
                            </View>
                            : null
                    }
                    {/* next button */}
                    <CustomButton
                        isLoading={isLoading}
                        style={{
                            ...styles.nextButton,
                            backgroundColor: Colors.primary,
                            marginTop: 20
                        }}
                        onPress={() => {
                            if (validation()) {
                                // console.log('Validation true',);
                                saveOrEditSchedule()
                            } else {
                                Alert.showAlert(Constants.warning, labels.message_fill_all_required_fields)
                                // console.log('Validation false');
                            }
                        }}
                        title={labels["add_schedule"]}
                    />
                </View>
            </ScrollView>
            <Portal>
                <Modal
                    animationType="slide"
                    transparent={true}
                    style={{}}
                    visible={isModalVisible}
                    onRequestClose={onRequestClose}
                    onDismiss={onRequestClose}
                >
                    <AddScheduleTemplate
                        onRequestClose={onRequestClose}
                        route={"from_schedule_form"}
                        setFormFields={setFormFields}
                        formFields={formFields}
                        schedule_template={initialKeys.schedule_template}
                        modalActionMode={"add_template"}
                    />
                </Modal>
            </Portal>


            {/* <View style={{
                    marginTop: 20,
                    width: "100%",
                    height: Dimensions.get("window").width,
                    backgroundColor: Colors.white,
                    borderTopLeftRadius: 50,
                    borderTopRightRadius: 50
                }}>
                    <ScheduleForm DateRange={DateRange} setDateRange={setDateRange} />

                </View> */}

        </BaseContainer>
    )
}
export default AddSchedule

const styles = StyleSheet.create({
    fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        backgroundColor: Colors.primary,
        bottom: 0,
        zIndex: 1000
    },
    checkBoxView: { flexDirection: 'row', alignItems: 'center', marginTop: 30 },
    normalText: {
        fontSize: getProportionalFontSize(16),
        fontFamily: Assets.fonts.semiBold,
        color: Colors.primary,
        marginLeft: 5
    },
    modalMainView: { backgroundColor: 'transparent', justifyContent: "center", alignItems: "center", paddingHorizontal: 16 },
    innerViewforModel: {
        width: '100%', minHeight: 150, backgroundColor: Colors.backgroundColor, paddingBottom: Constants.globalPaddingHorizontal * 2, paddingHorizontal: 16, borderRadius: 20,
    },
    cardStyle: {
        shadowOffset: { width: 3, height: 3, },
        shadowOpacity: 10,
        elevation: 15,
        shadowColor: Platform.OS == "ios" ? Colors.shadowColorIosDefault : Colors.shadowColorAndroidDefault,
        shadowRadius: 20,
        backgroundColor: Colors.white,
        // marginVertical: 10,
        borderRadius: 20,
        padding: 10,
        marginBottom: 30,
        zIndex: -1000,
        // marginHorizontal: Constants.globalPaddingHorizontal,
    },
    weekCircleView: { justifyContent: "center", alignItems: "center", backgroundColor: Colors.primary, borderRadius: 20, height: 40, width: 40, marginStart: 5, borderWidth: 1, borderColor: Colors.primary },
    weekText: {
        fontFamily: Assets.fonts.bold,
        // color: Colors.white,
        // fontSize: getProportionalFontSize(15)
    },

    InputValidationView: {
        backgroundColor: Colors.transparent,
        //borderColor: 'red',
        marginTop: 15,
        //borderRadius: 10,
        //color: 'red'
    },
    inputStyle: {
        fontSize: getProportionalFontSize(15),
        fontFamily: Assets.fonts.regular
    },
    mainView: {
        flex: 1,
        paddingHorizontal: Constants.globalPaddingHorizontal,
        paddingBottom: 15,
    },
    redioListItems: {
        width: "40%",
        flexDirection: "row",
        alignItems: "center"
    },
    RadioBtnsText: {
        fontSize: getProportionalFontSize(14), fontFamily: Assets.fonts.regular,
        width: 160
    },
    headingTitleStyle: {
        fontFamily: Assets.fonts.regular,
        fontSize: getProportionalFontSize(15),
    },
    labelsText: {
        fontFamily: Assets.fonts.semiBold,
        fontSize: getProportionalFontSize(12),
        width: "70%",
        borderBottomWidth: 1
    },
    forRow: {
        flexDirection: "row",
        alignItems: "center"
    },
    secondaryText: {
        fontFamily: Assets.fonts.regular,
        fontSize: getProportionalFontSize(11),
        width: "30%",
        marginVertical: 2,
    },
    inputAndAddBtnContainer: { flexDirection: "row", alignItems: "flex-end", justifyContent: "space-between", },
    addBtn: { backgroundColor: Colors.primary, height: 57, width: 57, justifyContent: "center", alignItems: "center", borderRadius: 10, },
})