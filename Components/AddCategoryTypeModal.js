import React from 'react';
import { View, StyleSheet, Text, SafeAreaView, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Colors from '../Constants/Colors';
import { getProportionalFontSize } from '../Services/CommonMethods';
import InputValidation from '../Components/InputValidation'
import CustomButton from './CustomButton';
import Constants from '../Constants/Constants'
import APIService from '../Services/APIService';
import { Checkbox } from 'react-native-paper';
import Assets from '../Assets/Assets'
import Alert from './Alert';

export default AddCategoryTypeModal = props => {

    // Immutable Variables
    const initialValidationObj = {
        categoryTypeName: {
            invalid: false,
            title: 'Category type name required'
        }
    }

    // useState hooks
    const [validationObj, setValidationObj] = React.useState({ ...initialValidationObj });
    const [categoryTypeName, setCategoryTypeName] = React.useState(props.categoryTypeItem ? props.categoryTypeItem.name : '');
    const [isLoading, setIsLoading] = React.useState(false);
    const [statusCheckBox, setStatusCheckBox] = React.useState(props.categoryTypeItem?.status ?? false);

    // helper Methods
    const removeErrorTextForInputThatUserIsTyping = (uniqueKey) => {
        let tempValidationObj = { ...validationObj }
        tempValidationObj[uniqueKey] = initialValidationObj[uniqueKey];
        setValidationObj(tempValidationObj);
    }

    const validation = (message) => {
        let validationObjTemp = { ...validationObj };
        if (!categoryTypeName) {
            validationObjTemp.categoryTypeName.invalid = true;
            validationObjTemp.categoryTypeName.title = message ? message : 'Category type name required'
            setValidationObj(validationObjTemp);
            return false;
        }
        else {
            validationObjTemp['categoryTypeName'] = initialValidationObj['categoryTypeName']
        }
        setValidationObj(validationObjTemp);
        return true;
    }

    // API methods
    const addOrEditCategoryTypeAPI = async (categoryTypeId) => {
        setIsLoading(true);
        let params = {
            name: categoryTypeName,
            status: statusCheckBox ? 1 : 0
        }
        // console.log('params', params)
        let url = Constants.apiEndPoints.addCategoryType;

        if (categoryTypeId)
            url = url + "/" + categoryTypeId

        let response = {}

        if (categoryTypeId)
            response = await APIService.putData(url, params, props.UserLogin.access_token, null, "editCategoryTypeAPI");
        else
            response = await APIService.postData(url, params, props.UserLogin.access_token, null, "addCategoryTypeAPI");

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

                {/* category Type Name input */}
                <InputValidation
                    uniqueKey='categoryTypeName'
                    validationObj={validationObj}
                    value={categoryTypeName}
                    placeHolder='Category type name'
                    iconColor={Colors.primary}
                    onChangeText={(text) => {
                        removeErrorTextForInputThatUserIsTyping('categoryTypeName');
                        setCategoryTypeName(text)
                    }}
                    style={{ marginTop: 30 }}
                    inputMainViewStyle={styles.InputValidationView}
                    inputStyle={styles.inputStyle}
                />

                {/* status checkbox  */}
                <View style={styles.checkBoxView}>
                    <Checkbox
                        color={Colors.primary}
                        status={statusCheckBox ? 'checked' : 'unchecked'}
                        onPress={() => { setStatusCheckBox(!statusCheckBox) }}
                    />
                    <Text style={styles.normalText}>{props.labels.make_it_active}</Text>
                </View>

                {/* Add button */}
                <CustomButton onPress={() => {
                    if (validation()) {
                        addOrEditCategoryTypeAPI(props.categoryTypeItem?.id ?? null)
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
    innerView: { width: '100%', minHeight: 300, backgroundColor: Colors.backgroundColor, paddingVertical: 15, paddingHorizontal: 16, borderRadius: 20 },
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
    checkBoxView: { flexDirection: 'row', alignItems: 'center', marginTop: 30 },
    normalText: {
        fontSize: getProportionalFontSize(15),
        fontFamily: Assets.fonts.regular,
    },
});
