import React from 'react';
import { View, StyleSheet, Keyboard, Dimensions, FlatList, Text, TouchableOpacity, } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Colors from '../Constants/Colors';
import { getProportionalFontSize, CurruntDate, formatDate, reverseFormatDate } from '../Services/CommonMethods';
import CustomButton from './CustomButton';
import Constants from '../Constants/Constants'
import APIService from '../Services/APIService';
import Alert from './Alert';
import InputValidation from './InputValidation';
import { useSelector } from 'react-redux';


const JournalActionModal = (props) => {
    // console.log("props++++++++++++++++++++++++", props.journal_action_index);

    // initialvalues
    const initialValues = {
        action: (props.journal?.journal_actions && props.journal?.journal_actions?.length > 0) ? props.journal?.journal_actions[props.journal_action_index]?.comment_action : "",
        result: (props.journal?.journal_actions && props.journal?.journal_actions?.length > 0) ? props.journal?.journal_actions[props.journal_action_index]?.comment_result : "",
        reason_for_editing: ''
    }

    // initialKeys
    const initialKeys = {
        action: "action",
        result: "result",
        reason_for_editing: "reason_for_editing"
    }

    // Immutable Variables
    const initialValidationObj = {
        action: {
            invalid: false,
            title: props?.labels?.action_required
        },
        result: {
            invalid: false,
            title: props?.labels?.result_required
        },
        reason_for_editing: {
            invalid: false,
            title: props?.labels?.reason_for_editing_required
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
            if (key == initialKeys.reason_for_editing) {
                if (formFields[key] == '' && props.journal?.journal_actions && props.journal?.journal_actions?.length > 0) {
                    value['invalid'] = true;
                    isValid = false;
                    break;
                }
            }
            else if (formFields[key] == '') {
                // console.log('inside 2', key)
                value['invalid'] = true;
                isValid = false;
                break;
            }
        }
        setValidationObj(validationObjTemp);
        return isValid;
    }

    const journalActions = async (is_signed) => {

        setIsLoading(true);

        let url = Constants.apiEndPoints.journalAction
        let params = {
            "journal_id": props.journal?.id,
            "comment_action": formFields.action,
            "comment_result": formFields.result,
            "is_signed": is_signed
        }

        let response = {};

        if (props.journal?.journal_actions && props.journal?.journal_actions?.length > 0) {
            params['reason_for_editing'] = formFields.reason_for_editing;
            params['journal_id'] = props.journal?.journal_actions[props.journal_action_index].id;
            url = url + "/" + props.journal?.journal_actions[props.journal_action_index].id;
            response = await APIService.putData(url, params, UserLogin.access_token, null, "Action/result journal action UPDATE API");
        }
        else
            response = await APIService.postData(url, params, UserLogin.access_token, null, "Action/result journal action API");

        if (!response.errorMsg) {
            Alert.showAlert(Constants.success, (props.journal?.journal_actions && props.journal?.journal_actions?.length > 0) ? messages.message_update_success : messages.message_add_success, () => {
                props.onRequestClose();
                props.refreshAPI();
            })
            setIsLoading(false);
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

                {/* action */}
                <InputValidation
                    uniqueKey={'action'}
                    validationObj={validationObj}
                    value={formFields.action}
                    placeHolder={props.labels.action}
                    iconColor={Colors.primary}
                    onChangeText={(text) => {
                        removeErrorTextForInputThatUserIsTyping('action');
                        handleInputChange("action", text)
                    }}
                    style={styles.mainInputStyle}
                    inputStyle={styles.inputStyle}
                />

                {/* result */}
                <InputValidation
                    uniqueKey={'result'}
                    validationObj={validationObj}
                    value={formFields.result}
                    placeHolder={props.labels.result}
                    iconColor={Colors.primary}
                    onChangeText={(text) => {
                        removeErrorTextForInputThatUserIsTyping('result');
                        handleInputChange("result", text)
                    }}
                    style={styles.mainInputStyle}
                    inputStyle={styles.inputStyle}
                />

                {/* reason for editing */}
                {(props.journal?.journal_actions && props.journal?.journal_actions?.length > 0)
                    ? <InputValidation
                        uniqueKey={'reason_for_editing'}
                        validationObj={validationObj}
                        value={formFields.reason_for_editing}
                        placeHolder={props.labels.reason_for_editing}
                        iconColor={Colors.primary}
                        onChangeText={(text) => {
                            removeErrorTextForInputThatUserIsTyping('reason_for_editing');
                            handleInputChange("reason_for_editing", text)
                        }}
                        style={styles.mainInputStyle}
                        inputStyle={styles.inputStyle}
                    /> : null}

                {/* save button */}
                {!props.journal?.is_signed
                    ? <CustomButton onPress={() => {
                        if (validation()) {
                            journalActions(0)
                        }
                        else {
                            Alert.showAlert(Constants.warning, props.labels.message_fill_all_required_fields)
                            // console.log('validation fail')
                        }
                    }}
                        titleStyle={{ color: Colors.primary }}
                        isLoading={isLoading} title={props.labels.save} style={{ marginTop: 20, minWidth: 290, backgroundColor: Colors.white, borderColor: Colors.primary, borderWidth: 1 }} />
                    : null}

                {/* sign button */}
                <CustomButton onPress={() => {
                    if (validation()) {
                        journalActions(1)
                    }
                    else {
                        Alert.showAlert(Constants.warning, props.labels.message_fill_all_required_fields)
                        // console.log('validation fail')
                    }
                }} isLoading={isLoading} title={props.labels.sign} style={{ marginTop: Constants.formFieldTopMargin, minWidth: 290 }} />
            </View>

        </View >
    )
}

export default JournalActionModal

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