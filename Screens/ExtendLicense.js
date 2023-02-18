import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    SafeAreaView,
    Image,
    TouchableOpacity,
    ScrollView,
    ImageBackground,
    Dimensions
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
import { LabelsAction } from '../Redux/Actions/LabelsAction';
import Alert from '../Components/Alert';
//import messaging from '@react-native-firebase/messaging';

const ExtendLicense = ({ navigation }) => {
    const initialValidationObj = {
        licence_key: {
            invalid: false,
            title: 'Invalid Key',
        }
    }
    // REDUX hooks
    const dispatch = useDispatch();
    const isInternetActive = useSelector(state => state.IsInternetActive);
    const UserLogin = useSelector(state => state.User.UserLogin);
    const labels = useSelector(state => state.Labels);
    const messages = useSelector(state => state.Labels);
    // console.log("========UserLogin======0", JSON.stringify(UserLogin))

    //hooks
    const [licence_key, setlicence_key] = React.useState("");
    const [validationObj, setValidationObj] = React.useState(initialValidationObj);
    const [isLoading, setIsLoading] = React.useState(false);

    const validation = () => {
        let validationObjTemp = { ...validationObj };
        if (!licence_key || licence_key.length != 20) {
            // console.log("lenght --", licence_key.length)
            validationObjTemp.licence_key.invalid = true;
            setValidationObj(validationObjTemp);
            return false;
        }
        setValidationObj(validationObjTemp);
        return true;
    }
    const navigateToLogin = () => {
        navigation.dispatch(
            CommonActions.reset({
                index: 0,
                routes: [{ name: 'Login' }],
            }),
        );
    };
    const logout = async () => {
        try {
            await AsyncStorageService._removeData(
                Constants.asyncStorageKeys.user_login,
            );
            dispatch(UserLoginActionWithPayload({}));
            navigateToLogin();
        } catch (error) {
            // console.log('AsyncStorageService Logout Error', error);
        }
    };

    const subscriptionExtend = async () => {
        setIsLoading(true);
        let params = {
            licence_key: licence_key,
            user_id: UserLogin?.top_most_parent_id,
            token: UserLogin.access_token,
        };
        // console.log('params=======', params);
        let url = Constants.apiEndPoints.subscriptionExtend;
        let msg = messages.license_validity_restored_Log_in_again;
        let response = await APIService.postData(url, params, UserLogin.access_token, null, "subscriptionExtend");

        if (!response.errorMsg) {
            setIsLoading(false);
            // console.log("SUCCESS............");
            Alert.showAlert(Constants.success, msg, () => logout());
        }
        else {
            setIsLoading(false);
            Alert.showAlert(Constants.danger, response.errorMsg)
        }
    }
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: Colors.backgroundColor }}>
            <ImageBackground source={Assets.images.loginBG} style={{ flex: 1 }}>
                <ScrollView style={{ flex: 1, }}>
                    <View style={styles.mainView}>

                        <Text style={styles.welcomeText}>ReNew license</Text>
                        <Image style={styles.imageLogin} source={Assets.images.licenseKeyPageImg} />

                        {/* license key */}
                        <InputValidation
                            // maskedInput={true}
                            // mask={Constants.licence_key_format}
                            uniqueKey="licence_key"
                            validationObj={validationObj}
                            value={licence_key}
                            // iconLeft="email"
                            placeHolder={labels["License_Key"]}
                            //   iconColor={Colors.primary}
                            // iconColor={'#5058B8'}
                            onChangeText={text => {
                                setValidationObj(initialValidationObj);
                                setlicence_key(text);
                            }}
                            style={{ marginTop: 16 }}
                            inputMainViewStyle={styles.InputValidationView}
                            inputStyle={styles.inputStyle}
                            keyboardType={"email-address"}
                        />
                        <TouchableOpacity
                            onPress={() => {
                                // if (validation()) {
                                // console.log("validation true")
                                subscriptionExtend()
                                // } else {
                                //     console.log("validation false")
                                // }
                            }}
                            style={{
                                ...styles.nextButton,
                            }}>
                            <Text style={styles.normalText}>
                                {labels["ReNew"]}
                            </Text>
                        </TouchableOpacity>

                        {/* return to login */}
                        <TouchableOpacity
                            onPress={() => navigation.navigate('Login')}
                            style={{ width: "100%", alignItems: "center", marginTop: 20 }}>
                            <Text style={styles.returnText}>
                                {labels["return-to-login-page"]}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </ImageBackground>
        </SafeAreaView>
    )
}

export default ExtendLicense

const styles = StyleSheet.create({
    mainView: {
        flex: 1,
        paddingHorizontal: 24,
        paddingTop: 30,
        // backgroundColor: Colors.backgroundColor
        height: Dimensions.get("window").height,
        // borderWidth: 3,
        // borderColor: "red",
        // justifyContent: "center"
    },
    InputValidationView: {
        //backgroundColor: Colors.ultraLightPrimary,
        //marginTop: 16,
        borderRadius: 20,
        // paddingHorizontal: 5
    },
    inputStyle: {
        fontSize: getProportionalFontSize(15),
        backgroundColor: Colors.white,
        borderColor: Colors.borderColor,
    },
    welcomeText: {
        fontSize: getProportionalFontSize(20),
        marginTop: 30,
        // color: Colors.primary,
        color: '#fff',
        fontFamily: Assets.fonts.semiBold,
        textAlign: 'center',
    },
    nextButton: {
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        width: '100%',
        height: 40,
        borderRadius: 5,
        // backgroundColor: Colors.primary,
        // marginTop: 30,
        marginTop: 50,
        backgroundColor: '#5058B8',
    },
    normalText: {
        color: Colors.white,
        fontFamily: Assets.fonts.bold,
        fontSize: getProportionalFontSize(15),
    },
    imageLogin: {
        // width: '100%',
        height: 180,
        width: 180,
        marginTop: 20,
        alignSelf: 'center',
    },
    returnText: {
        // marginTop: 10,
        fontSize: getProportionalFontSize(14),
        fontFamily: Assets.fonts.boldItalic,
        // color: Colors.primary,
        color: Colors.black,

    },
})