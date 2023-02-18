import React, { useEffect } from 'react';
import {
    StyleSheet,
    Text,
    View,
    SafeAreaView,
    Image,
    TouchableOpacity,
    ScrollView,
    ImageBackground,
    Keyboard,
} from 'react-native';
import Colors from '../Constants/Colors';
import Assets from '../Assets/Assets';
import {
    getProportionalFontSize,
    checkEmailFormat,
} from '../Services/CommonMethods';
import InputValidation from '../Components/InputValidation';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import { CommonActions } from '@react-navigation/native';
import APIService from '../Services/APIService';
import Constants from '../Constants/Constants';
import ProgressLoader from '../Components/ProgressLoader';
import { useSelector, useDispatch } from 'react-redux';
import {
    UserLoginAction,
    UserLoginActionWithPayload,
} from '../Redux/Actions/UserLoginAction';
import AsyncStorageService from '../Services/AsyncStorageService';
import Alert from '../Components/Alert';
//import messaging from '@react-native-firebase/messaging';
import { NavDataAction } from '../Redux/Actions/NavDataAction';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import LicenseExpireAlert from '../Components/LicenseExpireAlert';
import CustomButton from '../Components/CustomButton';
import PickerAndLocationServices from '../Services/PickerAndLocationServices';

const licence_status = 0

export default Login = props => {
    // Immutable Variables
    const initialValidationObj = {
        email: {
            invalid: false,
            title: 'Invalid Email',
        },
        password: {
            invalid: false,
            title: 'Invalid Password',
        },
    };

    // useState hooks
    const [validationObj, setValidationObj] = React.useState({
        ...initialValidationObj,
    });
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [termConditionCheckBox, setTermConditionCheckBox] = React.useState(false);
    const [rememberMe, setRememberMe] = React.useState(true);
    const [isPasswordVisible, setIsPasswordVisible] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(true);

    // REDUX hooks
    const dispatch = useDispatch();
    const isInternetActive = useSelector(state => state.IsInternetActive);
    const UserLogin = useSelector(state => state.User.UserLogin);
    // console.log(" get user details ---------", JSON.stringify(UserLogin))
    const labels = useSelector(state => state.Labels);
    // console.error(labels)

    // useEffect hooks
    React.useEffect(() => {
        isUserAlreadyLoggedIn();
    }, []);

    // Helper Methods
    const isUserAlreadyLoggedIn = async () => {
        try {
            let response = await AsyncStorageService._retrieveDataAsJSON(
                Constants.asyncStorageKeys.user_login,
            );
            if (response && Object.keys(response).length > 0) {
                // console.log('user found');
                dispatch(UserLoginActionWithPayload(response));
            } else {
                dispatch(NavDataAction(null))
                setIsLoading(false);
                // console.log('user not found');
            }
        } catch (error) {
            setIsLoading(false);
            // console.log('isUserAlreadyLoggedIn....AsyncStorageService error', error);
        }
    };

    useEffect(() => {
        // props.navigation.navigate("ExtendLicense")
        if (UserLogin?.access_token) {
            if (UserLogin?.licence_status == 1) {
                navigateToAuthUserStack();
            } else {
                setIsLoading(false)
                Alert.showDoubleAlert(Constants.warning, labels.license_expired_renew_now, () => props.navigation.navigate("ExtendLicense"))
                // props.navigation.navigate("ExtendLicense")
            }
        } else {
            // setIsLoading(false)
        }
    }, [UserLogin])

    const validation = () => {
        let validationObjTemp = { ...validationObj };
        if (!email) {
            validationObjTemp.email.invalid = true;
            validationObjTemp.email.title = 'Email is required';
            setValidationObj(validationObjTemp);
            return false;
        } else {
            validationObjTemp['email'] = initialValidationObj['email'];
        }
        if (!checkEmailFormat(email)) {
            validationObjTemp.email.invalid = true;
            validationObjTemp.email.title = 'Email is invalid';
            setValidationObj(validationObjTemp);
            return false;
        } else {
            validationObjTemp['email'] = initialValidationObj['email'];
        }
        if (!password) {
            validationObjTemp.password.invalid = true;
            validationObjTemp.password.title = 'Password is required';
            setValidationObj(validationObjTemp);
            return false;
        } else {
            validationObjTemp['password'] = initialValidationObj['password'];
        }
        setValidationObj(validationObjTemp);
        return true;
    };

    const navigateToAuthUserStack = () => {
        props.navigation.dispatch(
            CommonActions.reset({
                index: 0,
                routes: [{ name: 'AuthUserStack' }],
            }),
        );
    };

    const removeErrorTextForInputThatUserIsTyping = uniqueKey => {
        let tempValidationObj = { ...validationObj };
        tempValidationObj[uniqueKey] = initialValidationObj[uniqueKey];
        setValidationObj(tempValidationObj);
    };

    // API methods
    const loginAPI = async () => {
        setIsLoading(true);
        let params = {
            email: email,
            password: password,
            device_token: null,
            // device_token: await messaging().getToken()
        };
        dispatch(
            UserLoginAction(params, onSuccessLogin, onFailureLogin, rememberMe),
        );
    };

    const onSuccessLogin = () => {
        // console.log("----hey mukesh", UserLogin.licence_status)
        setIsLoading(false);
        // props.navigation.navigate("ExtendLicense")
        // if (UserLogin.licence_status == 1) {
        //     navigateToAuthUserStack();
        // } else {
        //     props.navigation.navigate("ExtendLicense")
        // }
    };

    const onFailureLogin = errorMsg => {
        setIsLoading(false);
        Alert.showAlert(Constants.danger, errorMsg);
    };

    // Render view
    //console.log('INSIDE LOGIN')
    if (isLoading) return <ProgressLoader />;

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: Colors.backgroundColor, }}>

            <View style={{ height: '50%', width: "100%" }}>
                <ImageBackground resizeMode="stretch" style={{ width: "100%", height: "100%", justifyContent: "center", alignItems: "center" }} source={Assets.images.curveBG}>
                    <Image source={Assets.images.logo} resizeMode="contain" style={{ height: 150, width: "100%", }} />
                </ImageBackground>
            </View>

            <KeyboardAwareScrollView keyboardShouldPersistTaps="handled">
                <View style={{ paddingHorizontal: Constants.globalPaddingHorizontal }}>
                    {/* email */}
                    <InputValidation
                        uniqueKey="email"
                        validationObj={validationObj}
                        value={email}
                        placeHolder={labels.Email}
                        onChangeText={text => {
                            removeErrorTextForInputThatUserIsTyping('email');
                            setEmail(text);
                        }}
                        style={{ marginTop: 5 }}
                        inputMainViewStyle={styles.InputValidationView}
                        inputStyle={styles.inputStyle}
                        keyboardType={"email-address"}
                        headingTitleStyle={styles.forgotPassword}
                        errorTextStyle={{ fontFamily: Assets.fonts.semiBold }}
                    />

                    {/* password */}
                    <InputValidation
                        uniqueKey="password"
                        secureTextEntry={!isPasswordVisible}
                        validationObj={validationObj}
                        value={password}
                        iconRight={isPasswordVisible ? "eye" : "eye-off"}
                        size={getProportionalFontSize(24)}
                        isIconTouchable={true}
                        onPressIcon={() => { setIsPasswordVisible(!isPasswordVisible) }}
                        placeHolder={labels.password}
                        //   iconColor={Colors.primary}
                        iconColor={Constants.primary}
                        onChangeText={text => {
                            removeErrorTextForInputThatUserIsTyping('password');
                            setPassword(text);
                        }}
                        style={{ marginTop: Constants.formFieldTopMargin }}
                        inputMainViewStyle={styles.InputValidationView}
                        inputStyle={styles.inputStyle}
                        headingTitleStyle={styles.forgotPassword}
                        errorTextStyle={{ fontFamily: Assets.fonts.semiBold }}
                    />

                    {/* remember me and forgot password view*/}
                    <View
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            // justifyContent: 'space-between',
                            marginTop: Constants.formFieldTopMargin,
                            justifyContent: 'center',
                        }}>


                        {/* remember me view */}
                        {/* <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <BouncyCheckbox
                                    size={20}
                                    fillColor={Colors.primary}
                                    unfillColor={Colors.white}
                                    iconStyle={{ borderColor: Colors.primary }}
                                    isChecked={rememberMe}
                                    onPress={value => {
                                        setRememberMe(value);
                                    }}
                                />
                                <Text style={styles.forgotPassword}>{labels.remember_me}</Text>
                            </View> */}

                        {/* forgot password text */}
                        {/* <TouchableOpacity
                            onPress={() => props.navigation.navigate('ForgetPassword')}
                            style={{}}> */}
                        <View style={{ width: "100%", flexDirection: "row", justifyContent: "flex-end" }}>
                            <Text onPress={() => props.navigation.navigate('ForgetPassword')}
                                style={styles.forgotPassword}>
                                {labels.forgot_password}
                            </Text>
                        </View>
                        {/* </TouchableOpacity> */}
                    </View>

                    {/* checkbox and agree to term and condition text */}
                    {/* <View style={styles.checkBoxView}>
                            <BouncyCheckbox
                                size={20}
                                fillColor={Colors.primary}
                                unfillColor={Colors.white}
                                iconStyle={{ borderColor: Colors.primary }}
                                isChecked={termConditionCheckBox}
                                onPress={() => {
                                    setTermConditionCheckBox(!termConditionCheckBox);
                                }}
                            />
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={styles.agreeText}>{labels.agree_to_all} </Text>
                                <TouchableOpacity>
                                    <Text style={[styles.termsText, { color: Colors.primary }]}>
                                        {labels.Terms_and_Privacy}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View> */}

                    {/* Login Button */}
                    <CustomButton
                        //    activeOpacity={termConditionCheckBox ? 0 : 1}
                        style={styles.nextButton}
                        onPress={() => {
                            Keyboard.dismiss();
                            if (validation()) {
                                loginAPI();
                            }
                        }}
                        title={labels.login}
                        titleStyle={styles.normalText}
                    />

                    {/* <CustomButton
                        //    activeOpacity={termConditionCheckBox ? 0 : 1}
                        style={styles.nextButton}
                        onPress={async () => {
                            PickerAndLocationServices.getCurrentLocation((location) => { console.log('location', location) });
                        }}
                        title={'IOS Location Testing'}
                        titleStyle={styles.normalText}
                    /> */}

                </View>
            </KeyboardAwareScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    mainView: {
        flex: 1,
        paddingHorizontal: 24,
        paddingTop: 30,
        // backgroundColor: Colors.backgroundColor
    },
    imageLogin: {
        // width: '100%',
        height: 150,
        width: "100%",
        marginTop: 20,
        alignSelf: 'center',
        // borderRadius: 20,
        // tintColor: Colors.white,
    },
    welcomeText: {
        fontSize: getProportionalFontSize(24),
        marginTop: 30,
        // color: Colors.primary,
        color: '#fff',
        fontFamily: Assets.fonts.bold,
        textAlign: 'center',
    },
    InputValidationView: {
        //backgroundColor: Colors.ultraLightPrimary,
        //marginTop: Constants.formFieldTopMargin,
        borderRadius: 20,

        // paddingHorizontal: 5

    },
    nextButton: {
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        width: '100%',
        height: 40,
        borderRadius: 5,
        marginTop: 20,
        backgroundColor: Colors.primary,
    },
    normalText: {
        color: Colors.white,
        fontFamily: Assets.fonts.bold,
        fontSize: getProportionalFontSize(15),
    },
    inputStyle: {
        fontSize: getProportionalFontSize(15),
        backgroundColor: Colors.white,
        borderColor: Colors.borderColor,
    },
    checkBoxView: { flexDirection: 'row', alignItems: 'center', marginTop: 30 },
    agreeText: {
        fontSize: getProportionalFontSize(13),
        fontFamily: Assets.fonts.regular,
    },
    termsText: {
        fontSize: getProportionalFontSize(13),
        fontFamily: Assets.fonts.semiBold,
    },
    forgotPassword: {
        // marginTop: 10,
        fontSize: getProportionalFontSize(14),
        fontFamily: Assets.fonts.semiBold,
        // color: Colors.primary,
        color: Colors.primary,
    },
});
