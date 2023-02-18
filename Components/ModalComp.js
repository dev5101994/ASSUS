import React from 'react';
import { View, StyleSheet, Keyboard, Dimensions, FlatList, Text, TouchableOpacity, } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Colors from '../Constants/Colors';
import { getProportionalFontSize, CurruntDate, formatDate, reverseFormatDate, formatDateForAPI } from '../Services/CommonMethods';
import CustomButton from './CustomButton';
import Constants from '../Constants/Constants'
import APIService from '../Services/APIService';
import Alert from './Alert';
import InputValidation from './InputValidation';
import { RadioButton } from 'react-native-paper';
import Assets from '../Assets/Assets';
import DatePicker from 'react-native-date-picker';


const ModalComp = (props) => {
    // console.log("props++++++++++++++++++++++++", props.activityId);

    const doneBy = [
        { status: "1", id: 0, labels: props.labels.completed_by_staff_on_time },
        { status: "2", id: 1, labels: props.labels.completed_by_staff_after_time },
        { status: "3", id: 2, labels: props.labels.completed_by_patient_itself },
        { status: "4", id: 3, labels: props.labels.patient_did_not_want },
        { status: "5", id: 4, labels: props.labels.not_done_by_employee },
    ];

    // initialvalues
    const initialValues = {
        comment: "",
        assignment_day: "",
        comment: "",
        option: "",
        is_social_journal: "",
        start_date: "",
        end_date: "",
    }
    // initialKeys
    const initialKeys = {
        comment: "comment",
        assignment_day: "assignment_day",
        comment: "comment",
        option: "option",
        is_social_journal: "is_social_journal",
        start_date: "start_date",
        end_date: "end_date",
    }
    // Immutable Variables
    const initialValidationObj = {
        start_date: {
            invalid: false,
            title: props?.labels?.startDate_required
        },
        end_date: {
            invalid: false,
            title: props?.labels?.endDate_required
        },
        comment: {
            invalid: false,
            title: props?.labels?.required_field
        },
        assignment_day: {
            invalid: false,
            title: props?.labels?.assignment_day_required
        },
        option: {
            invalid: false,
            title: props?.labels?.why_mark_done_required
        },
    }

    // useState hooks
    const [validationObj, setValidationObj] = React.useState({ ...initialValidationObj });
    const [formFields, setFormFields] = React.useState({ ...initialValues });
    const [isLoading, setIsLoading] = React.useState(false);
    const [mode, setMode] = React.useState('date')
    // const [openDatePicker, setOpenDatePicker]
    const [openDatePicker, setOpenDatePicker] = React.useState(false);
    const [datePickerKey, setDatePickerKey] = React.useState('');

    const removeErrorTextForInputThatUserIsTyping = (uniqueKey) => {
        let tempValidationObj = { ...validationObj }
        tempValidationObj[uniqueKey] = initialValidationObj[uniqueKey];
        setValidationObj(tempValidationObj);
    }
    const handleInputChange = (key, value) => {
        setFormFields({ ...formFields, [key]: value })
    }

    const validation = () => {
        let validationObjTemp = { ...validationObj };
        let isValid = true;
        for (const [key, value] of Object.entries(validationObjTemp)) {
            // console.log(`++++++++++++++ ${key}: ${value['invalid']}`);
            if (props.modelView == "employee") {
                if (initialKeys[key] == "assignment_day" && formFields[key] == '') {
                    value['invalid'] = true;
                    isValid = false;
                    break;
                }
            }
            if (props.modelView == "not_applicable") {
                if (initialKeys[key] == "comment" && formFields[key] == '') {
                    value['invalid'] = true;
                    isValid = false;
                    break;
                }
                if (initialKeys[key] == "start_date" && formFields[key] == '') {
                    value['invalid'] = true;
                    isValid = false;
                    break;
                }
                if (initialKeys[key] == "end_date" && formFields[key] == '') {
                    value['invalid'] = true;
                    isValid = false;
                    break;
                }
            }
            if (props.modelView == "done") {
                if (initialKeys[key] == "comment" && formFields[key] == '') {
                    value['invalid'] = true;
                    isValid = false;
                    break;
                }

                if (initialKeys[key] == initialKeys.option && formFields[key] == "") {
                    value['invalid'] = true;
                    isValid = false;
                    break;
                }
            }

        }
        setValidationObj(validationObjTemp);
        return isValid;
    }

    const makeActions = async (data) => {
        Keyboard.dismiss()
        let params = {};
        let url = "";
        let msg = "";
        if (props.modelView == "employee") {
            params = {
                "activity_id": props?.activityId,
                "user_id": data,
                "assignment_date": CurruntDate(),
                "assignment_day": formFields?.assignment_day,
            }
            url = Constants?.apiEndPoints?.activityAssignments
            msg = "addEmployeeApi"
        } else if (props.modelView == "comment") {
            params = {
                "parent_id": "",
                "source_id": props.activityId,
                "source_name": "Activity",
                "comment": formFields?.comment,
                "replied_to": ""
            }
            url = Constants.apiEndPoints.addCommentForActivity
            msg = "addCommentApi"
        } else if (props.modelView == "done") {
            params = {
                "activity_id": props?.activityId,
                "status": formFields?.option == "4" || formFields?.option == "5" ? "2" : "1",
                "option": formFields?.option,
                "comment": formFields?.comment ?? "",
            }
            url = Constants.apiEndPoints.activityAction;
            msg = "activityActionAPI";
        } else if (props.modelView == "not_applicable") {
            params = {
                "activity_id": props?.activityId,
                "from_date": formFields?.start_date ? formatDateForAPI(formFields?.start_date) : "",
                "end_date": formFields?.end_date ? formatDateForAPI(formFields?.end_date) : "",
                "action_comment": formFields?.comment ?? "",
            }
            url = Constants.apiEndPoints.activityNotApplicable;
            msg = "activityNotDoneActionAPI"
        }
        else {
            console.log('model view no match')
        }
        // console.log("url", url);
        // console.log("params", params);
        // console.log("msg", msg);
        // return
        setIsLoading(true)
        let response = await APIService.postData(url, params, props.UserLogin.access_token, null, msg);
        if (!response.errorMsg) {
            setIsLoading(false)
            Alert.showAlert(Constants.success, Constants.success, () => { props.onRequestClose; props.refreshAPI() })
            // props.onRequestClose
        } else {
            setIsLoading(false)
            Alert.showAlert(Constants.danger, response.errorMsg, props.onRequestClose)
        }
    }

    return (
        <View style={styles.modalMainView}>
            <View style={styles.innerView}>
                {/* close icon */}
                <Icon name='cancel' color={Colors.primary} size={30} onPress={props.onRequestClose} />
                {
                    props.modelView == "comment" ? (
                        // comment
                        <InputValidation
                            uniqueKey='comment'
                            validationObj={validationObj}
                            value={formFields.comment}
                            placeHolder={props.labels.add_comment}
                            iconColor={Colors.primary}

                            onChangeText={(text) => {
                                removeErrorTextForInputThatUserIsTyping('comment');
                                handleInputChange("comment", text)
                            }}
                            style={styles.mainInputStyle}
                            inputStyle={styles.inputStyle}
                        />
                    ) : null
                }

                {
                    props.modelView == "employee" ? (
                        <>
                            {/* // employee */}
                            <InputValidation
                                value={props.employee.name}
                                placeHolder={props.labels.add_employee}
                                style={styles.mainInputStyle}
                                inputStyle={styles.inputStyle}
                                editable={false}
                            />
                            {/* assignment_day */}
                            <InputValidation
                                uniqueKey='assignment_day'
                                validationObj={validationObj}
                                value={formFields.assignment_day}
                                placeHolder={props.labels.assign_days}
                                maxLength={3}
                                iconColor={Colors.primary}
                                // editable={false}
                                onChangeText={(text) => {
                                    removeErrorTextForInputThatUserIsTyping('assignment_day');
                                    handleInputChange("assignment_day", text)
                                }}
                                // style={styles.mainInputStyle}
                                // inputStyle={styles.inputStyle}
                                style={{ marginTop: Constants.formFieldTopMargin, }}
                                inputMainViewStyle={styles.InputValidationView}
                                inputStyle={styles.inputStyle}
                                keyboardType={"number-pad"}
                            />
                        </>) : null
                }
                {
                    props.modelView == "done" ? (
                        <>
                            <Text style={{
                                fontFamily: Assets.fonts.medium,
                                fontSize: getProportionalFontSize(14),
                                color: validationObj?.option?.invalid ? Colors.red : Colors.black
                            }}> {props.labels.select_action}</Text>
                            <FlatList
                                data={doneBy}
                                renderItem={({ item }) => {
                                    return (
                                        <>
                                            <View style={{ ...styles.listView, }}>
                                                <RadioButton
                                                    color={Colors.primary}
                                                    value={item.status}
                                                    status={formFields.option === item.status ? 'checked' : 'unchecked'}
                                                    onPress={() => {
                                                        if (formFields.option == item.status)
                                                            handleInputChange(initialKeys.option, "")
                                                        else
                                                            handleInputChange(initialKeys.option, item.status)
                                                        removeErrorTextForInputThatUserIsTyping(initialKeys?.option)
                                                    }}
                                                /><Text style={{
                                                    fontFamily: Assets.fonts.regular,
                                                    fontSize: getProportionalFontSize(14),
                                                    color: formFields.option === item.status ? Colors.black : null
                                                }}>{item.labels}</Text>
                                            </View>
                                            {formFields.option === item.status && formFields.option != "1"
                                                ? <Text style={{
                                                    fontFamily: Assets.fonts.regular,
                                                    fontSize: getProportionalFontSize(9),
                                                    marginLeft: "11%"
                                                }}>{formFields.option != "5" ? props.labels.journal_will_be_created : props.labels.journal_and_deviation_will_be_created}</Text> : null}
                                        </>
                                    )
                                }}
                            />
                            {/* comment */}
                            {
                                formFields.option
                                    ? <InputValidation
                                        uniqueKey='comment'
                                        validationObj={validationObj}
                                        value={formFields.comment}
                                        placeHolder={props.labels.mark_done}
                                        iconColor={Colors.primary}
                                        multiline={true}
                                        onChangeText={(text) => {
                                            removeErrorTextForInputThatUserIsTyping('comment');
                                            handleInputChange("comment", text)
                                        }}
                                        style={styles.mainInputStyle}
                                        inputStyle={styles.inputStyle}
                                    /> : null
                            }


                        </>) : null

                }
                {
                    props.modelView == "not_applicable" ? (
                        <>
                            {/* start date */}
                            <InputValidation
                                uniqueKey={initialKeys.start_date}
                                validationObj={validationObj}
                                iconRight='calendar'
                                iconColor={Colors.primary}
                                editable={false}
                                onPressIcon={() => {
                                    removeErrorTextForInputThatUserIsTyping(initialKeys.start_date)
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
                            {/* {formFields.start_date */}
                            <InputValidation
                                uniqueKey={initialKeys.end_date}
                                validationObj={validationObj}
                                iconRight='calendar'
                                iconColor={Colors.primary}
                                editable={false}
                                onPressIcon={() => {
                                    removeErrorTextForInputThatUserIsTyping(initialKeys.end_date)
                                    setOpenDatePicker(true);
                                    setMode(Constants.DatePickerModes.date_mode);
                                    setDatePickerKey(initialKeys.end_date)
                                }}
                                value={formFields.end_date ? reverseFormatDate(formFields.end_date) : ''}
                                placeHolder={props.labels.endDate}
                                style={styles.InputValidationView}
                                inputStyle={styles.inputStyle}
                            />
                            {/* : null} */}
                            {/* comment */}
                            <InputValidation
                                uniqueKey='comment'
                                validationObj={validationObj}
                                value={formFields.comment}
                                placeHolder={props.labels.mark_not_applicable}
                                iconColor={Colors.primary}
                                multiline={true}
                                onChangeText={(text) => {
                                    removeErrorTextForInputThatUserIsTyping('comment');
                                    handleInputChange("comment", text)
                                }}
                                style={{ ...styles.mainInputStyle, maxHeight: 130, }}
                                inputStyle={styles.inputStyle}
                            />
                        </>) : null
                }

                {/* save button */}
                <CustomButton onPress={() => {

                    if (validation()) {
                        // console.log('validation success')
                        if (props.modelView == "employee") {
                            makeActions(props.employee.id)
                        } else if (props.modelView == "comment") {
                            makeActions()
                        } else if (props.modelView == "done") {
                            makeActions("1")
                        } else if (props.modelView == "not_applicable") {
                            makeActions()
                        } else {
                            console.log('modelView no match')
                        }
                    }
                    else {
                        Alert.showAlert(Constants.warning, props.labels.message_fill_all_required_fields)
                        // console.log('validation fail')
                    }
                }} isLoading={isLoading} title={props.labels.save} style={{ marginTop: 30, minWidth: 290 }} />
            </View>
            <DatePicker
                modal
                mode={mode}
                open={openDatePicker}
                minimumDate={mode == Constants.DatePickerModes.date_mode ? new Date() : null}
                date={new Date()}
                onConfirm={(date) => {
                    setOpenDatePicker(false)
                    // console.log('date : ', date)
                    let value = '';
                    if (mode == Constants.DatePickerModes.date_mode)
                        handleInputChange(datePickerKey, date,)
                    else if (mode == Constants.DatePickerModes.time_mode)
                        handleInputChange(datePickerKey, date,)
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

export default ModalComp

const styles = StyleSheet.create({
    modalMainView: { backgroundColor: 'transparent', justifyContent: "center", alignItems: "center", paddingHorizontal: 16 },
    innerView: {
        width: '100%',
        // minHeight: 300, 
        backgroundColor: Colors.backgroundColor, paddingVertical: 15, paddingHorizontal: 16, borderRadius: 20
    },
    inputStyle: {
        fontSize: getProportionalFontSize(16),
        borderColor: Colors.borderColor,
        backgroundColor: Colors.white
    },
    mainInputStyle: {
        backgroundColor: Colors.transparent,
        marginTop: 15,

    },
    InputValidationView: {
        backgroundColor: Colors.backgroundColor,
        marginTop: Constants.formFieldTopMargin,
        //borderRadius: 20,
        // paddingHorizontal: 5
    },
    listView: {
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
        height: 30,
    }
})