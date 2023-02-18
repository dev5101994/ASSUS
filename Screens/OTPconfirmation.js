import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    SafeAreaView,
    ScrollView,
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
import AntDesign from 'react-native-vector-icons/AntDesign';

import { useSelector, useDispatch } from 'react-redux';
import ProgressLoader from '../Components/ProgressLoader';
import APIService from '../Services/APIService'
import Constants from '../Constants/Constants'
import Alert from '../Components/Alert';
import { CommonActions } from '@react-navigation/native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

const OTPconfirmation = props => {

    // REDUX hooks
    const labels = useSelector(state => state.Labels);
    const routeParams = props.route.params;

    // Immutable Variables
    const initialValidationObj = {
        OTP: {
            invalid: false,
            title: labels.invalid_otp,
        },
    };

    // useState hooks
    const [validationObj, setValidationObj] = React.useState({
        ...initialValidationObj,
    });
    const [OTP, setOTP] = React.useState('');
    const [isLoading, setIsLoading] = React.useState(false);

    // Helper Methods
    const removeErrorTextForInputThatUserIsTyping = uniqueKey => {
        let tempValidationObj = { ...validationObj };
        tempValidationObj[uniqueKey] = initialValidationObj[uniqueKey];
        setValidationObj(tempValidationObj);
    };

    const validation = () => {
        let validationObjTemp = { ...validationObj };
        if (!OTP) {
            validationObjTemp.OTP.invalid = true;
            setValidationObj(validationObjTemp);
            return false;
        }
        setValidationObj(validationObjTemp);
        return true;
    };

    const verifyOTPAPI = async () => {
        setIsLoading(true);
        let url = Constants.apiEndPoints.verifyOtp;
        let params = {
            "token": OTP,
            "email": routeParams.email
        }
        let response = await APIService.postData(url, params, null, null, "verifyOTPAPI");
        if (!response.errorMsg) {
            // setIsLoading(false);
            props.navigation.dispatch(
                CommonActions.reset({
                    index: 1,
                    routes: [
                        { name: 'Login' },
                        { name: 'CreateNewPassword', params: { email: routeParams.email }, },
                    ],
                })
            );
        }
        else {
            setIsLoading(false);
            Alert.showAlert(Constants.danger, response.errorMsg)
        }
    }

    // renderview
    if (isLoading) return <ProgressLoader />;
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
                    <Image source={Assets.images.otpImage} resizeMode="contain" style={{ height: 130, width: "100%", }} />
                </ImageBackground>
            </View>

            <KeyboardAwareScrollView keyboardShouldPersistTaps="handled" >
                <View style={{ paddingHorizontal: Constants.globalPaddingHorizontal }}>

                    {/* enter otp text */}
                    <Text style={styles.welcomeText}>{labels["enter-OTP"]}</Text>

                    {/* info text */}
                    <Text style={styles.instruction}>
                        {labels["mobile_forget_password_otp_messsage"]} {routeParams.email}
                    </Text>

                    {/* OTP inputbox */}
                    <InputValidation
                        uniqueKey="OTP"
                        validationObj={validationObj}
                        value={OTP}
                        keyboardType="number-pad"
                        // icon="email"
                        placeHolder={labels["enter-OTP"]}
                        // iconColor={Colors.primary}
                        onChangeText={text => {
                            removeErrorTextForInputThatUserIsTyping('OTP');
                            setOTP(text);
                        }}
                        style={{ marginTop: Constants.formFieldTopMargin }}
                        inputMainViewStyle={styles.InputValidationView}
                        inputStyle={styles.inputStyle}
                        headingTitleStyle={styles.forgotPassword}
                        errorTextStyle={{ fontFamily: Assets.fonts.semiBold }}
                    />

                    {/* Next Button */}
                    <TouchableOpacity
                        onPress={() => {
                            Keyboard.dismiss()
                            if (validation()) {
                                verifyOTPAPI();
                                // props.navigation.dispatch(
                                //     CommonActions.reset({
                                //         index: 1,
                                //         routes: [
                                //             { name: 'Login' },
                                //             { name: 'CreateNewPassword', params: { email: routeParams.email }, },
                                //         ],
                                //     })
                                // );
                            }
                        }}
                        style={styles.nextButton}>
                        <Text style={styles.normalText}>{labels["Next"]}</Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAwareScrollView>
        </SafeAreaView>
    );
};

export default OTPconfirmation;

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
        color: Colors.gray,
        fontSize: getProportionalFontSize(12),
        fontFamily: Assets.fonts.semiBold,
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
