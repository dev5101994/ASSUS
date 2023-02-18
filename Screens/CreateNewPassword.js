import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    SafeAreaView,
    Image,
    TouchableOpacity,
    ImageBackground,
    Keyboard
} from 'react-native';
import Assets from '../Assets/Assets';
import {
    getProportionalFontSize,
    checkEmailFormat,
} from '../Services/CommonMethods';
import Colors from '../Constants/Colors';
import InputValidation from '../Components/InputValidation';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useSelector, useDispatch } from 'react-redux';
import Constants from '../Constants/Constants';
import APIService from '../Services/APIService';
import ProgressLoader from '../Components/ProgressLoader';
import { CommonActions } from '@react-navigation/native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Alert from '../Components/Alert';
import ErrorComp from '../Components/ErrorComp'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

const CreateNewPassword = props => {

    const routeParams = props.route.params;

    // Helper Methods
    const removeErrorTextForInputThatUserIsTyping = uniqueKey => {
        let tempValidationObj = { ...validationObj };
        tempValidationObj[uniqueKey] = initialValidationObj[uniqueKey];
        setValidationObj({ ...tempValidationObj, notMatched: { ...tempValidationObj.notMatched, invalid: false } });
    };
    // REDUX hooks
    const dispatch = useDispatch();
    const isInternetActive = useSelector(state => state.IsInternetActive);
    const UserLogin = useSelector(state => state.UserLogin);
    const labels = useSelector(state => state.Labels);

    // Immutable Variables
    const initialValidationObj = {
        newpassword: {
            invalid: false,
            title: labels.password_is_required,
        },
        confirmNewpassword: {
            invalid: false,
            title: labels.please_re_enter_the_password,
        },
        notMatched: {
            invalid: false,
            title: labels.password_not_matched,
        }
    };

    // useState hooks
    const [validationObj, setValidationObj] = React.useState({
        ...initialValidationObj,
    });
    const [newpassword, setNewPassword] = React.useState('');
    const [confirmNewpassword, setConfirmNewPassword] = React.useState('');
    const [newpasswordVisible, setNewpasswordVisible] = React.useState(false);
    const [confirmNewpasswordVisible, setConfirmNewpasswordVisible] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(false);

    const validation = () => {
        let validationObjTemp = { ...initialValidationObj };
        let isValid = true;
        if (!newpassword) {
            validationObjTemp.newpassword.invalid = true;
            validationObjTemp.newpassword.title = labels.password_is_required;
            isValid = false;
        }
        else if (!confirmNewpassword) {
            validationObjTemp.confirmNewpassword.invalid = true;
            validationObjTemp.confirmNewpassword.title = labels.please_re_enter_the_password;
            isValid = false;
        }
        else if (confirmNewpassword != newpassword) {
            validationObjTemp.notMatched.invalid = true;
            isValid = false;
        }
        setValidationObj(validationObjTemp);
        return isValid;
    };

    const resetPassword = async () => {
        setIsLoading(true);
        let url = Constants.apiEndPoints.passwordReset;
        let params = {
            "email": routeParams.email,
            "password": newpassword,
            "password_confirmation": confirmNewpassword
        }
        let response = await APIService.postData(url, params, null, null, "resetPassword");
        if (!response.errorMsg) {
            setIsLoading(false)
            Alert.showAlert(Constants.success, labels.password_changed_successfully, () => {
                props.navigation.dispatch(
                    CommonActions.reset({
                        index: 0,
                        routes: [
                            { name: 'Login' },
                        ],
                    })
                );
            })
        }
        else {
            setIsLoading(false);
            Alert.showAlert(Constants.danger, response.errorMsg)
        }
    }
    if (isLoading) return <ProgressLoader />;
    // renderview
    return (

        <SafeAreaView style={{ flex: 1, backgroundColor: Colors.backgroundColor, }}>

            <View style={{ height: '50%', width: "100%" }}>
                <ImageBackground resizeMode="stretch" style={{ width: "100%", height: "100%", justifyContent: "center", alignItems: "center" }} source={Assets.images.curveBG}>
                    <AntDesign
                        style={{ position: "absolute", left: 15, top: 15 }}
                        onPress={() => { props.navigation.pop() }}
                        name={'arrowleft'}
                        color={Colors.white}
                        size={40}
                    />
                    <Image source={Assets.images.resetPassImage} resizeMode="contain" style={{ height: 130, width: "100%", }} />
                </ImageBackground>
            </View>

            <KeyboardAwareScrollView keyboardShouldPersistTaps="handled" >
                <View style={{ paddingHorizontal: Constants.globalPaddingHorizontal }}>

                    {/* welcome text */}
                    <Text style={styles.welcomeText}>{labels["reset-password"]}</Text>

                    {/* password */}
                    <InputValidation
                        uniqueKey="newpassword"
                        validationObj={validationObj}
                        value={newpassword}
                        iconRight={newpasswordVisible ? 'eye' : 'eye-off'}
                        onPressIcon={() => { setNewpasswordVisible(!newpasswordVisible) }}
                        secureTextEntry={!newpasswordVisible}
                        placeHolder={labels["new-password"]}
                        iconColor={Colors.primary}
                        isIconTouchable={true}
                        onChangeText={text => {
                            removeErrorTextForInputThatUserIsTyping('newpassword');
                            setNewPassword(text);
                        }}
                        style={{ marginTop: Constants.formFieldTopMargin }}
                        inputMainViewStyle={styles.InputValidationView}
                        inputStyle={styles.inputStyle}
                        headingTitleStyle={styles.forgotPassword}
                        errorTextStyle={{ fontFamily: Assets.fonts.semiBold }}
                    />

                    {/* confirm  password */}
                    <InputValidation
                        uniqueKey="confirmNewpassword"
                        validationObj={validationObj}
                        value={confirmNewpassword}
                        iconRight={confirmNewpasswordVisible ? 'eye' : 'eye-off'}
                        onPressIcon={() => { setConfirmNewpasswordVisible(!confirmNewpasswordVisible) }}
                        secureTextEntry={!confirmNewpasswordVisible}
                        placeHolder={labels["confirm-password"]}
                        iconColor={Colors.primary}
                        isIconTouchable={true}
                        onChangeText={text => {
                            removeErrorTextForInputThatUserIsTyping('confirmNewpassword');
                            setConfirmNewPassword(text);
                        }}
                        style={{ marginTop: Constants.formFieldTopMargin }}
                        inputMainViewStyle={styles.InputValidationView}
                        inputStyle={styles.inputStyle}
                        headingTitleStyle={styles.forgotPassword}
                        errorTextStyle={{ fontFamily: Assets.fonts.semiBold }}
                    />

                    {/* password not matched  */}
                    <ErrorComp
                        uniqueKey="notMatched"
                        validationObj={validationObj}
                        style={{ fontFamily: Assets.fonts.semiBold }}
                    />

                    {/* Next Button */}
                    <TouchableOpacity
                        onPress={() => {
                            Keyboard.dismiss()
                            if (validation()) {
                                resetPassword()
                            }
                        }}
                        style={{
                            ...styles.nextButton,
                            backgroundColor: Colors.primary
                                ? Colors.primary
                                : Colors.lightPrimary,
                        }}>
                        <Text style={styles.normalText}>{labels["submit"]}</Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAwareScrollView>
        </SafeAreaView>
    );
};

export default CreateNewPassword;

const styles = StyleSheet.create({
    mainView: {
        flex: 1,
        paddingHorizontal: 24,
    },
    backBtn: { position: 'absolute', top: 10, left: 10 },
    imageLogin: { width: '100%', height: 200, marginTop: 30 },
    welcomeText: {
        fontSize: getProportionalFontSize(24),
        marginTop: 5,
        color: Colors.primary,
        fontFamily: Assets.fonts.bold,
    },
    instruction: {
        marginTop: 10,
        color: Colors.black,
        fontSize: getProportionalFontSize(12),
        fontFamily: Assets.fonts.regular,
    },
    InputValidationView: {
        //backgroundColor: Colors.ultraLightPrimary,
        marginTop: 30,
        borderRadius: 20,
        // paddingHorizontal: 5
    },
    inputStyle: {
        fontSize: getProportionalFontSize(15),
    },
    nextButton: {
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: 40,
        borderRadius: 5,
        backgroundColor: Colors.primary,
        marginTop: 20,
    },
    normalText: {
        color: Colors.white,
        fontFamily: Assets.fonts.bold,
        fontSize: getProportionalFontSize(15),
    },
    forgotPassword: {
        // marginTop: 10,
        fontSize: getProportionalFontSize(14),
        fontFamily: Assets.fonts.semiBold,
        // color: Colors.primary,
        color: Colors.primary,
    },
});
