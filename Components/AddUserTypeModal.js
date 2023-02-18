import React from 'react';
import { View, StyleSheet, Text, SafeAreaView, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Colors from '../Constants/Colors';
import { getProportionalFontSize } from '../Services/CommonMethods';
import InputValidation from '../Components/InputValidation'
import CustomButton from './CustomButton';
import Constants from '../Constants/Constants'
import APIService from '../Services/APIService';
import Alert from './Alert'

export default AddUserTypeModal = props => {

    // Immutable Variables
    const initialValidationObj = {
        userTypeName: {
            invalid: false,
            title: 'User type name required'
        }
    }

    // useState hooks
    const [validationObj, setValidationObj] = React.useState({ ...initialValidationObj });
    const [userTypeName, setUserTypeName] = React.useState(props.userTypeItem ? props.userTypeItem.name : '');
    const [isLoading, setIsLoading] = React.useState(false);

    // helper Methods
    const removeErrorTextForInputThatUserIsTyping = (uniqueKey) => {
        let tempValidationObj = { ...validationObj }
        tempValidationObj[uniqueKey] = initialValidationObj[uniqueKey];
        setValidationObj(tempValidationObj);
    }

    const validation = (message) => {
        let validationObjTemp = { ...validationObj };
        if (!userTypeName) {
            validationObjTemp.userTypeName.invalid = true;
            validationObjTemp.userTypeName.title = message ? message : 'User type name required'
            setValidationObj(validationObjTemp);
            return false;
        }
        else {
            validationObjTemp['userTypeName'] = initialValidationObj['userTypeName']
        }
        setValidationObj(validationObjTemp);
        return true;
    }

    // API methods
    const addUserTypeAPI = async () => {
        setIsLoading(true);
        let params = {
            name: userTypeName
        }
        // console.log('params', params)
        let url = Constants.apiEndPoints.addUserType;
        let response = await APIService.postData(url, params, props.UserLogin.access_token, null, "addUserTypeAPI");
        if (!response.errorMsg) {
            setIsLoading(false);
            props.onRequestClose();
            props.refreshAPI()
        }
        else {
            setIsLoading(false);
            Alert.showAlert(Constants.danger, response.errorMsg)
        }
    }

    const editUserTypeAPI = async () => {
        setIsLoading(true);
        let params = {
            id: props.userTypeItem.id,
            name: userTypeName
        }
        // console.log('params', params)
        let url = Constants.apiEndPoints.editUserType;
        let response = await APIService.postData(url, params, props.UserLogin.access_token, null, "editUserTypeAPI");
        if (!response.errorMsg) {
            setIsLoading(false);
            props.onRequestClose();
            props.refreshAPI()
        }
        else {
            setIsLoading(false);
            Alert.showAlert(Constants.danger, response.errorMsg)
        }
    }

    // Render view
    return (
        <View style={styles.modalMainView}>
            <View style={styles.innerView}>
                {/* close icon */}
                <Icon name='cancel' color={Colors.primary} size={30} onPress={props.onRequestClose} />
                {/* user Type Name input */}
                <InputValidation
                    uniqueKey='userTypeName'
                    validationObj={validationObj}
                    value={userTypeName}
                    placeHolder='User type name'
                    iconColor={Colors.primary}
                    onChangeText={(text) => {
                        removeErrorTextForInputThatUserIsTyping('userTypeName');
                        setUserTypeName(text)
                    }}
                    style={{ marginTop: 30 }}
                    inputMainViewStyle={styles.InputValidationView}
                    inputStyle={styles.inputStyle}
                />
                {/* Add button */}
                <CustomButton onPress={() => {
                    if (validation()) {
                        if (props.userTypeItem)
                            editUserTypeAPI();
                        else
                            addUserTypeAPI();
                    }
                    else {
                        Alert.showAlert(Constants.warning, props.labels.message_fill_all_required_fields)
                    }
                }} isLoading={isLoading} title={props.labels.save} style={{ marginTop: 30 }} />
            </View>
        </View >
    );
};

const styles = StyleSheet.create({
    modalMainView: { backgroundColor: 'transparent', flex: 1, justifyContent: "center", alignItems: "center", paddingHorizontal: 16 },
    innerView: { width: '100%', height: 300, backgroundColor: Colors.backgroundColor, paddingVertical: 15, paddingHorizontal: 16, borderRadius: 20 },
    InputValidationView: {
        backgroundColor: Colors.backgroundColor,
        marginTop: 30,
        //borderRadius: 20,
        // paddingHorizontal: 5
    },
    inputStyle: {
        fontSize: getProportionalFontSize(15),
        backgroundColor: Colors.white,
        borderColor: Colors.borderColor,
    },
});
