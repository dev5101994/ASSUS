import React, { useState } from 'react';
import { View, StyleSheet, Text, SafeAreaView, TouchableOpacity, FlatList, RefreshControl, Platform, ActivityIndicator, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Colors from '../Constants/Colors';
import { getProportionalFontSize, getActionSheetAPIDetail, getJSObjectFromTimeString, formatTime, formatTimeForAPI } from '../Services/CommonMethods';
import InputValidation from './InputValidation'
import CustomButton from './CustomButton';
import Constants from '../Constants/Constants'
import APIService from '../Services/APIService';
import Assets from '../Assets/Assets'
import Alert from './Alert'
import ProgressLoader from './ProgressLoader';
import Can from '../can/Can';
import { useSelector, useDispatch } from 'react-redux';
import ActionSheet from 'react-native-actions-sheet';
import ActionSheetComp from '../Components/ActionSheetComp';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import MSDataViewer from './MSDataViewer';


export default RequestModal = props => {

    const { width, height } = Dimensions.get('window');

    // Immutable Variables
    const validationKeys = {
        comment: "comment",
        module: "module",
        reply_on_comment: "reply_on_comment"
    }

    const initialFieldValues = {
        comment: "",
        module: [],
        reply_on_comment: ""
    }

    const actionSheetRef = React.useRef();
    const [actionSheetDecide, setActionSheetDecide] = React.useState('');

    // REDUX hooks
    const dispatch = useDispatch();
    const UserLogin = useSelector(state => state?.User?.UserLogin);
    const labels = useSelector(state => state.Labels);
    const permissions = UserLogin?.permissions ?? {};

    const initialValidationObj = {
        [validationKeys.module]: {
            invalid: false,
            title: labels.required_field
        },
        [validationKeys.comment]: {
            invalid: false,
            title: labels.required_field
        },
        [validationKeys.reply_on_comment]: {
            invalid: false,
            title: labels.required_field
        }
    }

    // useState hooks
    const [isLoading, setIsLoading] = React.useState(false);
    const [validationObj, setValidationObj] = React.useState({ ...initialValidationObj });
    const [fieldValues, setFieldValues] = React.useState({ ...initialFieldValues });
    const [moduleAS, setModuleAS] = React.useState(getActionSheetAPIDetail({
        url: Constants.apiEndPoints.moduleList, params: {}, debugMsg: "moduleList API", token: UserLogin.access_token,
        selectedData: [],
    }));

    React.useEffect(() => {

    }, [])

    const removeErrorTextForInputThatUserIsTyping = (uniqueKey) => {
        let tempValidationObj = { ...validationObj }
        tempValidationObj[uniqueKey] = initialValidationObj[uniqueKey];
        setValidationObj(tempValidationObj);
    }

    const handleInputChange = (key, value) => {
        setFieldValues({ ...fieldValues, [key]: value })
    }

    const closeActionSheet = () => {
        actionSheetRef?.current?.setModalVisible();
        setActionSheetDecide('');
    }

    const validation = () => {
        let validationObjTemp = { ...validationObj };
        let isValid = true;
        for (const [key, value] of Object.entries(validationObjTemp)) {
            // console.log(`key = `, key, ` value = `, value);
            if (props.requestObj) {
                if (fieldValues[key] == '' && key == validationKeys.reply_on_comment) {
                    value['invalid'] = true;
                    isValid = false;
                    break;
                }
            }
            else {
                if ((fieldValues[key] == '' || fieldValues[key] === []) && key != validationKeys.reply_on_comment) {
                    value['invalid'] = true;
                    isValid = false;
                    break;
                }
            }
        }
        setValidationObj(validationObjTemp);
        return isValid;
    }

    const createNewRequest = async () => {
        setIsLoading(true);
        let url = Constants.apiEndPoints.moduleRequest;
        let params = {
            "status": "0",
            "modules": fieldValues.module?.map((obj) => {
                return '' + obj.id;
            }),
            "request_comment": fieldValues.comment
        }
        let response = await APIService.postData(url, params, UserLogin.access_token, null, "createNewRequest API");
        if (!response.errorMsg) {
            setIsLoading(false);
            Alert.showAlert(Constants.success, labels.success_request_msg, () => {
                props.refreshAPI()
                props.onRequestClose()
            })
        }
        else {
            setIsLoading(false);
            Alert.showAlert(Constants.danger, response.errorMsg)
        }
    }


    const actionOnRequest = async () => {
        setIsLoading(true);
        let url = Constants.apiEndPoints.moduleRequestStatus + "/" + props.requestObj.id;
        let params = {
            "reply_comment": fieldValues.reply_on_comment,
            "status": props.requestObj.request_status_choosen
        }
        let response = await APIService.postData(url, params, UserLogin.access_token, null, "actionOnRequest API");
        if (!response.errorMsg) {
            let msg = props.requestObj.request_status_choosen == "2" ? labels.rejected_successfully : labels.approved_successfully;
            setIsLoading(false);
            Alert.showAlert(Constants.success, msg, () => {
                props.refreshAPI()
                props.onRequestClose()
            })
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

                {/* isLoading
                         ? <ProgressLoader onActivityIndicator={true} onActivityIndicatorStyle={{ position: "absolute", bottom: 0, top: 0, right: 0, left: 0 }} />
                         : */}
                <>
                    {/* close icon  */}
                    <Icon name='cancel' style={{ alignSelf: "flex-end" }} color={Colors.primary} size={30} onPress={() => {
                        if (!isLoading)
                            props.onRequestClose()
                    }} />

                    <Text style={styles.headingText}>{props.requestObj?.user?.name ? props.requestObj?.user?.name : labels.new_request}</Text>

                    <KeyboardAwareScrollView style={{ maxHeight: height * 0.6, }} keyboardShouldPersistTaps="handled">
                        {/* Module list */}
                        {!props.requestObj
                            ? <InputValidation
                                uniqueKey={validationKeys.module}
                                validationObj={validationObj}
                                placeHolder={labels.modules}
                                iconRight='chevron-down'
                                iconColor={Colors.primary}
                                editable={false}
                                onPressIcon={() => {
                                    setActionSheetDecide(validationKeys.module);
                                    //removeErrorTextForInputThatUserIsTyping(ipFormKeys.patient_id);
                                    actionSheetRef.current?.setModalVisible();
                                }}
                                style={styles.InputValidationView}
                                inputStyle={styles.inputStyle}
                            /> : null}

                        {!props.requestObj
                            ? <MSDataViewer
                                data={fieldValues.module}
                                setNewDataOnPressClose={(newArr) => {
                                    setModuleAS({ ...moduleAS, selectedData: newArr });
                                    handleInputChange(validationKeys.module, newArr)
                                }}
                            /> : null}

                        {/* comment */}
                        <InputValidation
                            uniqueKey={validationKeys.comment}
                            validationObj={validationObj}
                            value={props.requestObj?.request_comment ? (props.requestObj?.request_comment) : fieldValues.comment}
                            editable={props.requestObj ? false : true}
                            disabled={!props.requestObj ? false : true}
                            placeHolder={labels["comment"]}
                            onChangeText={(text) => {
                                removeErrorTextForInputThatUserIsTyping(validationKeys.comment);
                                handleInputChange(validationKeys.comment, text)
                            }}
                            style={styles.InputValidationView}
                            multiline={true}
                            inputStyle={{ ...styles.inputStyle, ...{} }}
                        />

                        {/* reply on comment */}
                        {props.requestObj
                            ? <InputValidation
                                uniqueKey={validationKeys.reply_on_comment}
                                validationObj={validationObj}
                                value={fieldValues.reply_on_comment}
                                placeHolder={labels["reply_on_comment"]}
                                onChangeText={(text) => {
                                    removeErrorTextForInputThatUserIsTyping(validationKeys.reply_on_comment);
                                    handleInputChange(validationKeys.reply_on_comment, text)
                                }}
                                style={styles.InputValidationView}
                                multiline={true}
                                inputStyle={{ ...styles.inputStyle, ...{ height: 100 } }}
                            /> : null}
                    </KeyboardAwareScrollView>

                    <CustomButton
                        style={styles.nextButton}
                        isLoading={isLoading}
                        onPress={() => {
                            if (validation()) {
                                // console.log('validation true')
                                if (props.requestObj) {
                                    actionOnRequest()
                                }
                                else {
                                    createNewRequest()
                                }
                            }
                            else {
                                // console.log('validation false')
                            }
                        }}
                        title={props.requestObj?.request_status_choosen == "2"
                            ? labels.reject
                            : props.requestObj?.request_status_choosen == "1"
                                ? labels['approve-this']
                                : labels.save}
                    />
                </>
            </View>

            <ActionSheet ref={actionSheetRef} containerStyle={{ backgroundColor: Colors.backgroundColor, }}>

                <ActionSheetComp
                    title={actionSheetDecide == validationKeys.module ? labels.modules : labels[actionSheetDecide]}
                    closeActionSheet={closeActionSheet}
                    keyToShowData="name"
                    keyToCompareData="id"
                    multiSelect={(actionSheetDecide == validationKeys.module) ? true : false}
                    APIDetails={actionSheetDecide == validationKeys.module ? moduleAS
                        : null}
                    changeAPIDetails={(payload) => {
                        if (actionSheetDecide == validationKeys.module) {
                            setModuleAS(getActionSheetAPIDetail({ ...moduleAS, ...payload }))
                        }
                    }}
                    onPressItem={(item) => {
                        // console.log('item', item)
                        if (actionSheetDecide == validationKeys.module) {
                            handleInputChange(validationKeys.module, item)
                            removeErrorTextForInputThatUserIsTyping(validationKeys.module)
                        }
                    }}
                />
            </ActionSheet>
        </View>
    );
};

const styles = StyleSheet.create({
    modalMainView: { backgroundColor: 'transparent', justifyContent: "center", alignItems: "center", paddingHorizontal: 16, },
    innerView: { width: '100%', minHeight: 300, backgroundColor: Colors.backgroundColor, paddingVertical: 15, paddingHorizontal: 16, borderRadius: 20 },
    InputValidationView: {
        backgroundColor: Colors.backgroundColor,
        marginTop: Constants.formFieldTopMargin,
        //borderRadius: 20,
        // paddingHorizontal: 5
    },
    nextButton: {
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        paddingHorizontal: 16,
        backgroundColor: Colors.primary,
        marginTop: Constants.formFieldTopMargin
    },
    inputStyle: {
        fontSize: getProportionalFontSize(16),
        borderColor: Colors.borderColor,
        backgroundColor: Colors.white
    },
    checkBoxView: { flexDirection: 'row', alignItems: 'center', marginTop: 30 },
    normalText: {
        fontSize: getProportionalFontSize(13),
        fontFamily: Assets.fonts.semiBold,
        color: Colors.gray
    },
    mainInputStyle: {
        backgroundColor: Colors.transparent,
        marginTop: 15,
    },
    headingText: {
        fontSize: getProportionalFontSize(18),
        fontFamily: Assets.fonts.robotoBold,
        textAlign: "center",
        // marginTop: 20,
        color: Colors.primary
    },
    barStyle: {
        width: "100%", marginTop: Constants.formFieldTopMargin,
        backgroundColor: Colors.white,
        // borderWidth: 1,
        borderColor: Colors.primary,
        padding: 10,
        borderRadius: 7,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 15,
        elevation: 15,
        shadowColor: Platform.OS == 'ios' ? Colors.shadowColorIosDefault : Colors.primary,
    },
    rowStyle: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: Constants.formFieldTopMargin },
    boldText: {
        fontSize: getProportionalFontSize(13),
        fontFamily: Assets.fonts.bold,
        color: Colors.primary
    }
});
