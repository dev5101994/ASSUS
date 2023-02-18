import React from 'react';
import { View, StyleSheet, Keyboard, Dimensions, FlatList, Text, TouchableOpacity, Linking } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Colors from '../Constants/Colors';
import { getProportionalFontSize, CurruntDate, formatDate, reverseFormatDate, formatDateForAPI } from '../Services/CommonMethods';
import CustomButton from './CustomButton';
import Constants from '../Constants/Constants'
import APIService from '../Services/APIService';
import Alert from './Alert';
import DatePicker from 'react-native-date-picker';
import { Checkbox } from 'react-native-paper';
import InputValidation from './InputValidation';
import { useSelector } from 'react-redux';


const PrintJournalModal = (props) => {

    // initialvalues
    const initialValues = {
        print_with_secret: false,
        toDate: '',
        fromDate: ""
    }

    // initialKeys
    const initialKeys = {
        print_with_secret: "print_with_secret",
        toDate: "toDate",
        fromDate: "fromDate"
    }

    // Immutable Variables
    const initialValidationObj = {
        fromDate: {
            invalid: false,
            title: props?.labels?.from_date_required
        },
        toDate: {
            invalid: false,
            title: props?.labels?.to_date_required
        },
    }

    // useState hooks
    const [validationObj, setValidationObj] = React.useState({ ...initialValidationObj });
    const [formFields, setFormFields] = React.useState({ ...initialValues });
    const [isLoading, setIsLoading] = React.useState(false);
    const [mode, setMode] = React.useState('date')
    const messages = useSelector(state => state.Labels);
    // const [openDatePicker, setOpenDatePicker]
    const [openDatePicker, setOpenDatePicker] = React.useState(false);
    const [datePickerKey, setDatePickerKey] = React.useState('');
    const UserLogin = useSelector(state => state.User.UserLogin);

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
            if (formFields[key] == '') {
                value['invalid'] = true;
                isValid = false;
                break;
            }
        }
        setValidationObj(validationObjTemp);
        return isValid;
    }

    const printJournalAPI = async () => {

        setIsLoading(true);

        let url = Constants.apiEndPoints.printJournal

        let params = {
            "patient_id": props.patient?.id ?? null,
            "print_with_secret": formFields.print_with_secret ? "yes" : "no",
            "from_date": formFields.fromDate ? formatDateForAPI(formFields.fromDate) : null,
            "end_date": formFields.toDate ? formatDateForAPI(formFields.toDate) : null,
        }

        let response = await APIService.postData(url, params, UserLogin.access_token, null, "printJournalAPI");

        if (!response.errorMsg) {

            setIsLoading(false);
            props.onRequestClose()
            let canOpenUrl = await Linking.canOpenURL(response.data.payload)
            if (canOpenUrl)
                await Linking.openURL(response.data.payload)
            else
                Alert.showAlert(Constants.warning, messages.message_url_can_not_open)
        }
        else {
            setIsLoading(false);
            Alert.showAlert(Constants.danger, response.errorMsg);
        }
    }

    return (
        <View style={styles.modalMainView}>
            <View style={styles.innerView}>
                {/* close icon */}
                <Icon name='cancel' color={Colors.primary} size={30} onPress={() => {
                    if (!isLoading)
                        props.onRequestClose()
                }} />

                {/* from date */}
                <InputValidation
                    uniqueKey={initialKeys.fromDate}
                    validationObj={validationObj}
                    iconRight='calendar'
                    iconColor={Colors.primary}
                    editable={false}
                    isIconTouchable={true}
                    onPressIcon={() => {
                        removeErrorTextForInputThatUserIsTyping(initialKeys.fromDate)
                        setOpenDatePicker(true);
                        setMode(Constants.DatePickerModes.date_mode);
                        setDatePickerKey(initialKeys.fromDate)
                    }}
                    value={formFields.fromDate ? formatDate(formFields.fromDate) : ''}
                    placeHolder={props.labels.from_date}
                    style={styles.InputValidationView}
                    inputStyle={styles.inputStyle}
                />

                {/* to date */}
                {formFields.fromDate
                    ? <InputValidation
                        uniqueKey={initialKeys.toDate}
                        validationObj={validationObj}
                        iconRight='calendar'
                        iconColor={Colors.primary}
                        editable={false}
                        isIconTouchable={true}
                        onPressIcon={() => {
                            removeErrorTextForInputThatUserIsTyping(initialKeys.toDate)
                            setOpenDatePicker(true);
                            setMode(Constants.DatePickerModes.date_mode);
                            setDatePickerKey(initialKeys.toDate)
                        }}
                        value={formFields.toDate ? formatDate(formFields.toDate) : ''}
                        placeHolder={props.labels.to_date}
                        style={styles.InputValidationView}
                        inputStyle={styles.inputStyle}
                    /> : null}

                <View style={styles.checkBoxView}>
                    <Checkbox
                        color={Colors.primary}
                        status={formFields.print_with_secret ? 'checked' : 'unchecked'}
                        onPress={() => { handleInputChange(initialKeys.print_with_secret, !formFields.print_with_secret) }}
                    />
                    <Text style={styles.normalText}>{props.labels.print_with_secret}</Text>
                </View>

                {/* print button */}
                <CustomButton onPress={() => {
                    if (validation()) {
                        printJournalAPI()
                    }
                    else {
                        Alert.showAlert(Constants.warning, messages.message_fill_all_required_fields)
                        // console.log('validation fail')
                    }
                }} isLoading={isLoading} title={props.labels.print} style={{ marginTop: Constants.formFieldTopMargin, minWidth: 290 }} />

                <DatePicker
                    modal
                    mode={mode}
                    open={openDatePicker}
                    minimumDate={mode == Constants.DatePickerModes.date_mode ? (datePickerKey == initialKeys.toDate ? formFields.fromDate : null) : null}
                    date={new Date()}
                    onConfirm={date => {
                        setOpenDatePicker(false);
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
            </View>

        </View >
    )
}

export default PrintJournalModal

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
    },
    checkBoxView: { flexDirection: 'row', alignItems: 'center', marginTop: Constants.formFieldTopMargin },
    normalText: {
        fontSize: getProportionalFontSize(15),
        fontFamily: Assets.fonts.regular,
    },
})