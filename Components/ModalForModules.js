import React from 'react';
import { View, StyleSheet, Text, SafeAreaView, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Colors from '../Constants/Colors';
import { getProportionalFontSize, } from '../Services/CommonMethods';
import InputValidation from '../Components/InputValidation'
import CustomButton from './CustomButton';
import Constants from '../Constants/Constants'
import APIService from '../Services/APIService';
import { Checkbox } from 'react-native-paper';
import Assets from '../Assets/Assets'
import Alert from './Alert'
import BouncyCheckbox from 'react-native-bouncy-checkbox';

export default ModalForModules = (props) => {
    // console.log("props", props)

    // Immutable Variables
    const initialValidationObj = {
        moduleName: {
            invalid: false,
            title: props.labels.module_name_required
        },
    }

    // useState hooks
    const [validationObj, setValidationObj] = React.useState({ ...initialValidationObj });
    const [moduleName, setmoduleName] = React.useState(props.modulesItem?.name ?? '');
    const [isLoading, setIsLoading] = React.useState(false);
    const [statusCheckBox, setStatusCheckBox] = React.useState(props.modulesItem?.status ?? false);

    // helper Methods
    const removeErrorTextForInputThatUserIsTyping = (uniqueKey) => {
        let tempValidationObj = { ...validationObj }
        tempValidationObj[uniqueKey] = initialValidationObj[uniqueKey];
        setValidationObj(tempValidationObj);
    }

    const validation = (message) => {
        let validationObjTemp = { ...validationObj };
        if (!moduleName) {
            validationObjTemp.moduleName.invalid = true;
            validationObjTemp.moduleName.title = message ? message : props.labels.module_name_required
            setValidationObj(validationObjTemp);
            return false;
        }
        else {
            validationObjTemp['moduleName'] = initialValidationObj['moduleName']
        }
        setValidationObj(validationObjTemp);
        return true;
    }

    // API methods
    const addOrEditmoduleAPI = async (moduleId) => {
        setIsLoading(true);
        let params = {
            "name": moduleName,
            // "parent_id": module?.id ?? null,
            "status": statusCheckBox ? 1 : 0,

        }

        // console.log('params', params)

        let url = Constants.apiEndPoints.addmodule;

        if (moduleId) {
            url = url + '/' + moduleId;
        }

        let response = {};

        if (moduleId)
            response = await APIService.putData(url, params, props.UserLogin.access_token, null, "editmoduleAPI");
        else
            response = await APIService.postData(url, params, props.UserLogin.access_token, null, "addmoduleAPI");

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

                {/* module name input */}
                <InputValidation
                    uniqueKey='moduleName'
                    validationObj={validationObj}
                    value={moduleName}
                    placeHolder={props.labels.module_name}
                    iconColor={Colors.primary}
                    onChangeText={(text) => {
                        removeErrorTextForInputThatUserIsTyping('moduleName');
                        setmoduleName(text)
                    }}
                    style={{ marginTop: 30 }}
                    inputMainViewStyle={styles.InputValidationView}
                    inputStyle={styles.inputStyle}
                />

                {/* status checkbox  */}
                {props?.modulesItem?.id ? <View style={styles.checkBoxView}>
                    {/* <Checkbox
                        color={Colors.primary}
                        status={props?.modulesItem?.id ? statusCheckBox ? 'checked' : 'unchecked' : 'checked'}
                        onPress={() => { props?.modulesItem?.id ? setStatusCheckBox(!statusCheckBox) : null }}
                    />
                    */}
                    <BouncyCheckbox
                        size={20}
                        fillColor={Colors.primary}
                        unfillColor={Colors.white}
                        iconStyle={{ borderColor: Colors.primary }}
                        isChecked={statusCheckBox}
                        onPress={(value) => {
                            setStatusCheckBox(value);
                        }}
                    />
                    <Text style={styles.normalText}>{props.labels.make_it_active}</Text>
                </View> : null}

                {/* save button */}
                <CustomButton onPress={() => {
                    if (validation()) {
                        // console.log('validation success')
                        addOrEditmoduleAPI(props.modulesItem?.id ?? null);
                    }
                    else {
                        Alert.showAlert(Constants.warning, props.labels.message_fill_all_required_fields)
                        // console.log('validation fail')
                    }
                }} isLoading={isLoading} title={props.labels.save} style={{ marginTop: 30 }} />
            </View>
        </View >
    );
};
const styles = StyleSheet.create({
    modalMainView: { backgroundColor: 'transparent', flex: 1, justifyContent: "center", alignItems: "center", paddingHorizontal: 16 },
    innerView: { width: '100%', minHeight: 300, backgroundColor: Colors.backgroundColor, paddingVertical: 15, paddingHorizontal: 16, borderRadius: 20 },
    InputValidationView: {
        backgroundColor: Colors.backgroundColor,
        marginTop: 30,
    },
    inputStyle: {
        fontSize: getProportionalFontSize(15),
        backgroundColor: Colors.white,
        borderColor: Colors.primary,
    },
    checkBoxView: { flexDirection: 'row', alignItems: 'center', marginTop: 30 },
    normalText: {
        fontSize: getProportionalFontSize(15),
        fontFamily: Assets.fonts.regular,
    },
});

