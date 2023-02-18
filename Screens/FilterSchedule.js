import React from 'react';
import { View, StyleSheet, Keyboard, Text, ScrollView, Dimensions, FlatList } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Colors from '../Constants/Colors';
// import CustomButton from './CustomButton';
import CustomButton from '../Components/CustomButton';
import Constants from '../Constants/Constants'
import APIService from '../Services/APIService';
// import Alert from './Alert';
import Alert from '../Components/Alert';
import ActionSheet from "react-native-actions-sheet";
// import ActionSheetComp from './ActionSheetComp';
import ActionSheetComp from '../Components/ActionSheetComp';
import DatePicker from 'react-native-date-picker';
import InputValidation from '../Components/InputValidation';
import { RadioButton } from "react-native-paper";
// import { getProportionalFontSize, getActionSheetAPIDetail, formatDate, formatTime, placeholderCreator, checkUrlFormat, jsCoreDateCreator, getJSObjectFromTimeString, checkFileSize, formatDateByFormat, isDocOrImage } from '../Services/CommonMethods';

import { getProportionalFontSize, CurruntDate, formatDateByFormat, getActionSheetAPIDetail, formatDate, formatTime, placeholderCreator, checkUrlFormat, checkFileSize, getJSObjectFromTimeString, reverseFormatDate, formatDateForAPI } from '../Services/CommonMethods';
import BouncyCheckbox from 'react-native-bouncy-checkbox';

const { width, height } = Dimensions.get('window');
const formFieldTopMargin = Constants.formFieldTopMargin;



const FilterModalComp = (props) => {

    const { labels, onRequestClose, UserLogin } = props;
    const initialValues = {
        employee: [],
        patient: {},
        "shift": {},
        // "shift_start_time": "",
        // "shift_end_time": ""
        "start_date": "",
        "end_date": "",
    }
    // const [formFieldsKeys, setFormFieldsKeyformFieldsKeys] = React.useState({ ...initialKeys });
    const initialKeys = {
        start_date: "start_date",
        end_date: "end_date",
        patient: 'patient',
        employee: 'employee',
        "shift": "shift",
    }

    //Hooks
    const actionSheetRef = React.useRef();
    // useState hooks
    const [actionSheetDecide, setActionSheetDecide] = React.useState('');
    const [workShiftAS, setWorkShiftAS] = React.useState(getActionSheetAPIDetail({
        url: Constants.apiEndPoints.workShifts, debugMsg: "workShiftAS", token: UserLogin.access_token,
        selectedData: [],
    }));
    const [openDatePicker, setOpenDatePicker] = React.useState(false);
    const [mode, setMode] = React.useState(Constants.DatePickerModes.date_mode);
    const [datePickerKey, setDatePickerKey] = React.useState(null);


    const [patientListAS, setPatientListAS] = React.useState(getActionSheetAPIDetail({
        url: Constants.apiEndPoints.userList, params: { user_type_id: '6' }, debugMsg: "patientListAS", token: UserLogin.access_token,
        selectedData: [],
    }));

    const [employeeAS, setEmployeeAS] = React.useState(getActionSheetAPIDetail({
        url: Constants.apiEndPoints.userList, params: { user_type_id: '3' }, debugMsg: "employeeAS", token: UserLogin.access_token,
        selectedData: [],
    }));

    const [formFields, setFormFields] = React.useState({ ...initialValues });
    const [isLoading, setIsLoading] = React.useState(false);

    // Immutable Variables
    const formFieldsKeys = {
        "name": "name",//
        // email: 'email',
        "title": "title",
        "patient": "patient",
        "employee": "employee",
        "status": "status",
        "shift": "shift",
        "start_date": "start_date",
        "end_date": "end_date",
    }

    const initialValidationObj = {
        [formFieldsKeys.name]: {
            invalid: false,
            title: '',
        },

        [formFieldsKeys.patient]: {
            invalid: false,
            title: '1'
        },

        [formFieldsKeys.status]: {
            invalid: false,
            title: '3'
        },
        [formFieldsKeys.start_date]: {
            invalid: false,
            title: '4'
        },
        [formFieldsKeys.end_date]: {
            invalid: false,
            title: '5'
        },
    }
    const [validationObj, setValidationObj] = React.useState({ ...initialValidationObj });

    React.useEffect(() => {
        setFormFields({ ...formFields, })
    }, [])

    const getAPIDetails = () => {

        switch (actionSheetDecide) {

            case formFieldsKeys.patient: {
                return patientListAS
            }

            case formFieldsKeys.employee: {
                return employeeAS
            }
            case initialKeys.shift: {
                return workShiftAS
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

            case formFieldsKeys.employee: {
                setEmployeeAS(getActionSheetAPIDetail({ ...employeeAS, ...payload }))
                break;
            }
            case initialKeys.shift: {
                setWorkShiftAS(getActionSheetAPIDetail({ ...workShiftAS, ...payload }))
                break;
            }

            default: {
                break;
            }
        }
    }

    const handleInputChange = (key, value) => {
        setFormFields({
            ...formFields,
            company_types: formFields?.company_types,
            // patient: formFields?.patient,
            [key]: value,
        });
    };

    const onPressItem = (item) => {
        switch (actionSheetDecide) {
            case formFieldsKeys.patient: {
                handleInputChange(formFieldsKeys.patient, item)
                removeErrorTextForInputThatUserIsTyping(formFieldsKeys.patient)
                break;
            }

            case formFieldsKeys.employee: {
                handleInputChange(formFieldsKeys.employee, item)
                removeErrorTextForInputThatUserIsTyping(formFieldsKeys.employee)
                break;
            }

            case initialKeys.shift: {
                // handleInputChange(initialKeys.shift, item)
                // console.log("hey user your start date is here------", item.shift_start_time ? getJSObjectFromTimeString(item.shift_start_time) : "oops")
                setFormFields(
                    {
                        ...formFields,
                        "shift": item,
                        "start_time": item.shift_start_time ? getJSObjectFromTimeString(item.shift_start_time) : "",
                        "end_time": item.shift_start_time ? getJSObjectFromTimeString(item.shift_start_time) : "",

                    }
                )
                removeErrorTextForInputThatUserIsTyping(initialKeys.shift)
                break;
            }
            default: {
                break;
            }
        }
    }

    const removeErrorTextForInputThatUserIsTyping = (uniqueKey) => {
        let tempValidationObj = { ...validationObj }
        tempValidationObj[uniqueKey] = initialValidationObj[uniqueKey];
        setValidationObj(tempValidationObj);
    }


    const closeActionSheet = () => {
        actionSheetRef?.current?.setModalVisible();
        setActionSheetDecide('');
    }
    return (

        <View style={styles.modalMainView}>
            <View style={styles.innerView}>
                {/* close icon */}
                <Icon name='cancel' color={Colors.primary} size={30} onPress={props.onRequestClose} />
                <ScrollView showsVerticalScrollIndicator={false} style={{ maxHeight: height * 0.7, }}>

                    {/* employee */}
                    <InputValidation
                        optional={true}
                        uniqueKey={formFieldsKeys.employee}
                        // validationObj={validationForActivityDetails}
                        placeHolder={labels["employees"]}
                        value={formFields.employee?.name ?? ""}
                        iconRight='chevron-down'
                        iconColor={Colors.primary}
                        editable={false}
                        onPressIcon={() => {
                            // removeErrorTextForInputThatUserIsTyping(task_details, formFieldsKeys.employee)
                            setActionSheetDecide(formFieldsKeys.employee)
                            actionSheetRef.current?.setModalVisible()
                        }}
                        style={{ marginTop: Constants.formFieldTopMargin, }}
                        inputMainViewStyle={styles.InputValidationView}
                        inputStyle={styles.inputStyle}
                    />


                    {/* patient */}
                    <InputValidation
                        optional={true}
                        // uniqueKey={formFieldsKeys.patient}
                        // validationObj={validationObj}
                        placeHolder={labels["patient"]}
                        value={formFields.patient?.name ?? ""}
                        iconRight='chevron-down'
                        iconColor={Colors.primary}
                        editable={false}
                        isIconTouchable={true}
                        onPress={() => {
                            // console.log("press")
                            setActionSheetDecide(formFieldsKeys.patient)
                            actionSheetRef.current?.setModalVisible()
                        }}
                        style={{ marginTop: Constants.formFieldTopMargin, }}
                        inputMainViewStyle={styles.InputValidationView}
                        inputStyle={styles.inputStyle}
                    />


                    {/* workshifts */}
                    <InputValidation
                        // uniqueKey={initialKeys.shift}
                        // validationObj={validationObj}
                        placeHolder={labels["workshifts"]}
                        // value={formFields.employee?.name ?? ""}
                        value={formFields.shift?.shift_name ?? ""}
                        optional={true}
                        iconRight='chevron-down'
                        isIconTouchable={true}
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

                    {/* start date */}
                    <InputValidation
                        // uniqueKey={initialKeys.start_date}
                        // validationObj={validationForTimeAndRepetition}
                        iconRight='calendar'
                        iconColor={Colors.primary}
                        editable={false}
                        onPressIcon={() => {
                            // removeErrorTextForInputThatUserIsTyping(time_and_repetition, initialKeys.start_date)
                            setOpenDatePicker(true);
                            setMode(Constants.DatePickerModes.date_mode);
                            setDatePickerKey(initialKeys.start_date)
                        }}
                        value={formFields.start_date ? reverseFormatDate(formFields.start_date) : ''}
                        placeHolder={props.labels.startDate}
                        style={styles.InputValidationView}
                        inputStyle={styles.inputStyle}
                    />

                    {/* end date */}

                    <InputValidation
                        // uniqueKey={initialKeys.end_date}
                        // validationObj={validationForTimeAndRepetition}
                        iconRight='calendar'
                        iconColor={Colors.primary}
                        editable={false}
                        optional={true}
                        onPressIcon={() => {
                            // removeErrorTextForInputThatUserIsTyping(time_and_repetition, initialKeys.end_date)
                            setOpenDatePicker(true);
                            setMode(Constants.DatePickerModes.date_mode);
                            setDatePickerKey(initialKeys.end_date)
                        }}
                        value={formFields.end_date ? reverseFormatDate(formFields.end_date) : ''}
                        placeHolder={props.labels.endDate}
                        style={styles.InputValidationView}
                        inputStyle={styles.inputStyle}
                    />
                </ScrollView>

                {/* save button */}
                {/* <View style={{ width: "100%", flexDirection: "row", justifyContent: "center" }}> */}
                <View style={styles.bar}>

                    <CustomButton
                        onPress={() => {
                            setFormFields({ ...initialValues })
                            // console.log("-----------op ", formFields)
                        }}
                        isLoading={isLoading}
                        title={labels.clear}
                        // style={{ marginTop: 10, minWidth: 290 }}
                        style={styles.baar}

                    />

                    <CustomButton onPress={() => {
                        // console.log("formFields", JSON.stringify(formFields.patient))
                        let paramsForFilter = {
                            patient: formFields?.patient.id ?? "",
                            employee: formFields.employee.id ?? "",
                            shift: formFields?.shift?.id ?? "",
                            start_date: formFields?.start_date ? formatDateForAPI(formFields?.start_date) : "",
                            end_date: formFields?.end_date ? formatDateForAPI(formFields?.end_date) : "",
                        }
                        props.filterAPI(paramsForFilter)
                        props.onRequestClose()
                    }} isLoading={isLoading} title={labels.apply} style={{
                        width: "45%",
                        // marginBottom: 10
                        margin: "4%",
                        marginTop: 30,
                    }} />


                </View>
                {/* </View> */}
            </View>

            <ActionSheet ref={actionSheetRef}>
                <ActionSheetComp
                    title={labels[actionSheetDecide]}
                    closeActionSheet={closeActionSheet}
                    keyToShowData={actionSheetDecide == formFieldsKeys.shift ? "shift_name" : "name"}
                    keyToCompareData="id"

                    // multiSelect
                    APIDetails={getAPIDetails()}
                    changeAPIDetails={(payload) => changeAPIDetails(payload)}
                    onPressItem={(item) => onPressItem(item)}
                />

            </ActionSheet>
            <DatePicker
                modal
                mode={"date"}
                open={openDatePicker}
                minimumDate={mode == Constants.DatePickerModes.date_mode ? new Date() : null}
                date={new Date()}
                onConfirm={(date) => {
                    setOpenDatePicker(false)
                    // console.log('date : ', date)
                    let value = '';
                    if (mode == "start_date")
                        handleInputChange(formFieldsKeys.start_date, date,)
                    else if (mode == "end_date")
                        handleInputChange(formFieldsKeys.end_date, date,)
                    else
                        handleInputChange(datePickerKey, date,)
                }}
                onCancel={() => {
                    setOpenDatePicker(false)
                }}
            />
        </View >
    )
}





export default FilterModalComp
const styles = StyleSheet.create({
    modalMainView: {
        backgroundColor: 'transparent', flex: 1, justifyContent: "center", alignItems: "center", paddingHorizontal: 16
    },
    innerView: { width: '100%', minHeight: 300, backgroundColor: Colors.backgroundColor, paddingVertical: 15, paddingHorizontal: 16, borderRadius: 20 },
    inputStyle: {
        fontSize: getProportionalFontSize(16),
        borderColor: Colors.borderColor,
        backgroundColor: Colors.white
    },
    mainInputStyle: {
        backgroundColor: Colors.transparent,
        marginTop: 15,
    }
    ,
    InputValidationView: {
        backgroundColor: Colors.backgroundColor,
        marginTop: Constants.formFieldTopMargin,
        //borderRadius: 20,
        // paddingHorizontal: 5
    },
    bar: {
        width: "100%", flexDirection: "row", justifyContent: "center",
    },
    baar: {
        width: "45%",
        // marginBottom: 10
        margin: "4%",
        marginTop: 30,
    },
    checkBoxView: { flexDirection: 'row', alignItems: 'center', marginTop: 30, minWidth: "40%" },
    saveAsTemplate: { fontSize: getProportionalFontSize(13), fontFamily: Assets.fonts.regular }
})