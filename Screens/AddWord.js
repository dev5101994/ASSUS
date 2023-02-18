

import React, { useEffect, useState } from 'react';
import {
    StyleSheet,
    Text, View, SafeAreaView, Image, TouchableOpacity, ScrollView
} from 'react-native';
import Colors from '../Constants/Colors';
import Assets from '../Assets/Assets'
import { getProportionalFontSize, checkEmailFormat, formatDateWithTime, formatDate, formatTime } from '../Services/CommonMethods';
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


export default AddWord = (props) => {
    // console.log("(props?.route?.params?.itemId)", props?.route?.params?.itemId)

    // REDUX hooks
    const dispatch = useDispatch();
    const isInternetActive = useSelector(state => state.IsInternetActive);
    const UserLogin = useSelector(state => state.User.UserLogin);
    const labels = useSelector(state => state.Labels);
    const messages = useSelector(state => state.Labels);


    // Immutable Variables
    const formFieldsKeys = {
        name: "name",

    }

    const initialValidationObj = {
        [formFieldsKeys.name]: {
            invalid: false,
            title: labels.name_required
        },
    }

    const initialFormFields = {
        name: "",
    }

    // useState hooks
    const [itemId, setItemId] = React.useState('')
    const [isItemFound, setIsItemFound] = React.useState(false)
    // const [isEditable, setIsEditable] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(true);
    const [formFields, setFormFields] = React.useState({ ...initialFormFields });
    const [validationObj, setValidationObj] = React.useState({ ...initialValidationObj });
    const [Title, setTitle] = React.useState(labels.AddWord);

    // useEffect hooks
    React.useEffect(() => {
        if (props?.route?.params?.itemId) {
            // console.log('item Id FOund')
            setIsItemFound(true)
            setFormFields({ ...formFields, name: props?.route?.params?.itemData })
            setItemId(props?.route?.params?.itemId)
            // getwordDetails(props?.route?.params?.itemId)
            setTitle(labels.EditWord)
            setIsLoading(false)
        } else {
            setIsLoading(false);
            // setIsEditable(true);
        }
    }, [])

    // Helper Methods
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
            // console.log(`${key}: ${value['invalid']}`);
            if (formFields[key] == '') {
                value['invalid'] = true;
                value['title'] = labels[key + '_required']
                //console.log(labels[(key + '_required')]);
                isValid = false;
                break;
                //return false;
            }
        }
        setValidationObj(validationObjTemp);
        return isValid;
    }

    /**
     * 
     * @param {*} itemId 
     */
    const getwordDetails = async (itemId) => {
        setIsLoading(true);
        // let params = {
        // }
        //console.log("itemId", itemId)
        let url = Constants.apiEndPoints.word + "/" + itemId;
        // console.log("url", url);
        let response = await APIService.getData(url, UserLogin.access_token, null, "companyAPI");
        if (!response.errorMsg) {
            // console.log("payload getCompanyDetails", response.data.payload);

            setFormFields(response.data.payload)
            //console.log("data", response.data.success);
            setIsLoading(false);
        }
        else {
            setIsLoading(false);
            Alert.showAlert(Constants.danger, response.errorMsg);
        }
    }

    /**
     * 
     * @param {*} deptId 
     */
    const saveWord = async (deptId) => {
        setIsLoading(true);
        let params = formFields;
        // console.log('params=======', params)
        let url = Constants.apiEndPoints.word;
        let msg = messages.message_add_success;
        let response = {};
        if (deptId) {
            url = url + '/' + deptId;
            msg = messages.message_update_success;
            response = await APIService.putData(url, params, UserLogin.access_token, null, "editwordDetails");
        }
        else
            response = await APIService.postData(url, params, UserLogin.access_token, null, "saveWordDetails");

        if (!response.errorMsg) {
            setIsLoading(false);
            // console.log("SUCCESS............")
            Alert.showToast(msg, Constants.success)
            props.navigation.pop()
            // packageDetailsAPI()
        }
        else {
            setIsLoading(false);
            Alert.showAlert(Constants.danger, response.errorMsg)
        }
    }

    // console.log('props.navigation', props)

    // Render view
    if (isLoading)
        return <ProgressLoader />

    return (
        <BaseContainer
            onPressLeftIcon={() => { props.navigation.pop() }}
            leftIcon="arrow-back"
            leftIconSize={24}
            title={Title}
            leftIconColor={Colors.primary}
        // rightIcon={isItemFound ? (!isEditable ? "edit" : "edit-off") : null}
        // rightIconSize={25}
        // rightIconColor={Colors.primary}
        // onPressRightIcon={() => setIsEditable(!isEditable)}
        >
            <KeyboardAwareScrollView style={{ flex: 1 }}>
                <ScrollView style={{ flex: 1 }}>
                    {/* Main View */}
                    <View style={styles.mainView}>

                        {/*  word */}
                        <InputValidation
                            // showSoftInputOnFocus={false}                            
                            uniqueKey={formFieldsKeys.name}
                            validationObj={validationObj}
                            value={formFields[formFieldsKeys.name]}
                            placeHolder={labels.name}
                            onChangeText={(text) => {
                                removeErrorTextForInputThatUserIsTyping(formFieldsKeys.name);
                                handleInputChange(formFieldsKeys.name, text)
                            }}
                            style={styles.InputValidationView}
                            inputStyle={styles.inputStyle}
                        // editable={isEditable}
                        />

                        {/* save button */}
                        <CustomButton
                            title={labels.save}
                            style={{ marginTop: Constants.formFieldTopMargin }}
                            onPress={() => {
                                if (validation()) {
                                    // console.log('validation success');

                                    if (itemId) {
                                        // console.log('itemId', itemId)
                                        saveWord(itemId)
                                    } else {
                                        saveWord()
                                    }
                                }
                                else {
                                    Alert.showAlert(Constants.warning, messages.message_fill_all_required_fields)
                                    // console.log('validation fail')
                                }

                            }}
                        />

                    </View>
                </ScrollView>
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
    checkBoxTitle: { fontSize: getProportionalFontSize(15), fontFamily: Assets.fonts.regular }
});

