import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity,
    SafeAreaView,
    ImageBackground,
    Keyboard
} from 'react-native';
import Assets from '../Assets/Assets';
import {
    getProportionalFontSize,
    checkEmailFormat,
} from '../Services/CommonMethods';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Colors from '../Constants/Colors';
import InputValidation from '../Components/InputValidation';
import { useSelector, useDispatch } from 'react-redux';
import APIService from '../Services/APIService'
import Constants from '../Constants/Constants'
import Alert from '../Components/Alert';
import ProgressLoader from '../Components/ProgressLoader';
import BaseContainer from '../Components/BaseContainer';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

const ForgetPassword = props => {
    // REDUX hooks
    const labels = useSelector(state => state.Labels);

    // Immutable Variables
    const initialValidationObj = {
        email: {
            invalid: false,
            title: labels.email_is_required,
        },
    };

    // useState hooks
    const [validationObj, setValidationObj] = React.useState({
        ...initialValidationObj,
    });
    const [email, setEmail] = React.useState('');
    const [isLoading, setIsLoading] = React.useState(false);

    // Helper Methods
    const removeErrorTextForInputThatUserIsTyping = uniqueKey => {
        let tempValidationObj = { ...validationObj };
        tempValidationObj[uniqueKey] = initialValidationObj[uniqueKey];
        setValidationObj(tempValidationObj);
    };

    const validation = () => {
        let validationObjTemp = { ...validationObj };
        if (!email) {
            validationObjTemp.email.invalid = true;
            setValidationObj(validationObjTemp);
            return false;
        }
        if (!checkEmailFormat(email)) {
            validationObjTemp.email.invalid = true;
            validationObjTemp.email.title = labels.invalid_email;
            setValidationObj(validationObjTemp);
            return false;
        }
        setValidationObj(validationObjTemp);
        return true;
    };

    const sendOTPAPI = async () => {
        setIsLoading(true);
        let url = Constants.apiEndPoints.forgotPassword;
        let params = {
            "email": email,
            "device": "mobile"
        }
        let response = await APIService.postData(url, params, null, null, "sendOTPAPI");
        if (!response.errorMsg) {
            setIsLoading(false);
            props.navigation.navigate('OTPconfirmation', { email: email })
        }
        else {
            setIsLoading(false);
            Alert.showAlert(Constants.danger, response.errorMsg)
        }
    }

    if (isLoading) return <ProgressLoader />;

    // renderview
    return (
        //  Main View 
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
                    <Image source={Assets.images.forgotPassWordRound} resizeMode="contain" style={{ height: 130, width: "100%", }} />
                </ImageBackground>
            </View>

            <KeyboardAwareScrollView keyboardShouldPersistTaps="handled" >
                <View style={{ paddingHorizontal: Constants.globalPaddingHorizontal }}>

                    {/* forget password text */}
                    <Text style={styles.welcomeText}>{labels["forgot-password"]}</Text>

                    {/* info text */}
                    <Text style={styles.instruction}>{labels["mobile_forget_password_messsage"]}</Text>

                    {/* email */}
                    <InputValidation
                        uniqueKey="email"
                        validationObj={validationObj}
                        value={email}
                        icon="email"
                        placeHolder="Email"
                        iconColor={Colors.primary}
                        onChangeText={text => {
                            removeErrorTextForInputThatUserIsTyping('email');
                            setEmail(text);
                        }}
                        style={{ marginTop: Constants.formFieldTopMargin }}
                        inputMainViewStyle={styles.InputValidationView}
                        headingTitleStyle={styles.forgotPassword}
                        inputStyle={styles.inputStyle}
                        errorTextStyle={{ fontFamily: Assets.fonts.semiBold }}
                        keyboardType={"email-address"}
                    />

                    {/* Next Button */}
                    <TouchableOpacity
                        onPress={() => {
                            Keyboard.dismiss()
                            if (validation()) {
                                //  props.navigation.navigate('OTPconfirmation', { email: email })
                                sendOTPAPI()
                            }
                        }}
                        style={styles.nextButton}>
                        <Text style={styles.normalText}>{labels["get-otp"]}</Text>
                    </TouchableOpacity>

                </View>
            </KeyboardAwareScrollView>
        </SafeAreaView>
    );
};

export default ForgetPassword;

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
