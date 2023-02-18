import React from 'react';
import {
    ImageBackground,
    View,
    Image,
    StyleSheet,
    TouchableOpacity,
    Text,
    FlatList,
    Dimensions,
    BackHandler,
    Animated
} from 'react-native';
import Assets from '../Assets/Assets';
import Colors from '../Constants/Colors';
import Constants from '../Constants/Constants';
import {
    checkPermission,
    getProportionalFontSize,
} from '../Services/CommonMethods';
import Feather from 'react-native-vector-icons/Feather';
import LottieView from 'lottie-react-native';
import { ProgressBar } from 'react-native-paper'
import { useSelector, useDispatch } from 'react-redux';
import { CommonActions } from '@react-navigation/native';
import APIService from '../Services/APIService';
import Alert from '../Components/Alert';
import { LabelsAction } from '../Redux/Actions/LabelsAction';
import AsyncStorageService from '../Services/AsyncStorageService';
import RNRestart from 'react-native-restart';

const { width, height } = Dimensions.get('window').height;

const SplashScreen = props => {

    const isInternetActive = useSelector(state => state.IsInternetActive);
    // console.log(" get user details ---------", JSON.stringify(UserLogin))

    const labels = useSelector(state => state.Labels);
    // Redux Hooks
    const UserLogin = useSelector(state => state.User.UserLogin);
    const dispatch = useDispatch();

    let temp = Dimensions.get("window").height * 0.38
    const translateAnimation = React.useRef(new Animated.Value(temp)).current
    const opacityAnimation = React.useRef(new Animated.Value(0)).current
    const opacityAnimationForLoader = React.useRef(new Animated.Value(0)).current
    const progressCount = React.useRef(new Animated.Value(0)).current
    const [progressStatus, setProgressStatus] = React.useState(0)


    React.useEffect(() => {
        getLabels()
    }, [])


    React.useEffect(() => {
        progressCount.addListener(({ value }) => {
            setProgressStatus(parseInt(value, 10));
        });
        Animated.timing(
            translateAnimation,
            {
                toValue: 0,
                duration: 2000,
                // useNativeDriver: true
            }
        ).start();

        Animated.timing(
            opacityAnimation,
            {
                toValue: 1,
                delay: 500,
                duration: 2000,
                useNativeDriver: true
            }
        ).start();

        Animated.timing(
            opacityAnimationForLoader,
            {
                toValue: 1,
                delay: 1000,
                duration: 800,
                useNativeDriver: true
            }
        ).start();

        Animated.timing(
            progressCount,
            {
                toValue: isInternetActive ? 98 : 0,
                delay: 1800,
                duration: 2000,
                useNativeDriver: true
            }
        ).start();
        // console.log("progressStatus", progressStatus)
    }, [translateAnimation, opacityAnimation, opacityAnimationForLoader, progressCount])

    const getSavedLanguageFromLocalStorage = async () => {
        try {
            let asyncLanResponse = await AsyncStorageService._retrieveDataAsJSON(
                Constants.asyncStorageKeys.app_language_obj,
            );

            // console.log('asyncLanResponse', asyncLanResponse)

            let app_language_obj = null;

            if (asyncLanResponse && Object.keys(asyncLanResponse)?.length > 0) {
                app_language_obj = asyncLanResponse;
            }

            return app_language_obj;
        }
        catch (error) {
            console.error('Async storage error', error)
            return null;
        }
    }

    const getLabels = async () => {

        let app_language_obj = await getSavedLanguageFromLocalStorage()

        let url = Constants.apiEndPoints.getLabels;

        let params = {
            language_id: app_language_obj?.id ?? null
        }

        let response = await APIService.postData(url, params, null, null, "get labels API");

        if (!response.errorMsg) {

            await AsyncStorageService._storeDataAsJSON(
                Constants.asyncStorageKeys.app_language_obj,
                response.data.payload.language
            );

            let labels_response = Constants.labels;

            // let labels_response = { ...response.data.payload.labels }

            let temp_label = {};

            for (const [key, value] of Object.entries(Constants.labels_for_non_react_files)) {
                temp_label[key] = labels_response[key];
            }

            Constants.labels_for_non_react_files = temp_label;

            dispatch(LabelsAction(labels_response));

            props.navigation.dispatch(
                CommonActions.reset({
                    index: 0,
                    routes: [
                        { name: "Login" },
                    ],
                })
            );

        }
        else {
            Alert.showAlert(Constants.danger, response.errorMsg, () => { BackHandler.exitApp() })
        }
    }


    return (
        <View style={{
            flex: 1,
            backgroundColor: Colors.extraDarkPrimary
        }}>
            <Animated.Image source={Assets.images.newSplashBG} resizeMode={'cover'} style={{
                width: Dimensions.get("window").width,
                height: Dimensions.get("window").height,
                position: "absolute", top: translateAnimation,
                left: 0, right: 0,
            }}
            />
            <View style={{ flex: .7, alignItems: 'center', justifyContent: 'center' }}>
                <Animated.Image source={Assets.images.logo} resizeMode="contain" style={{ width: 350, height: 170, opacity: opacityAnimation }} />
                <ProgressBar progress={0.7} color={Colors.red} />
            </View>

            <Animated.View style={{
                flex: .3, paddingHorizontal: 24,
                justifyContent: 'flex-end',
                opacity: opacityAnimationForLoader,
            }}>
                {/* <ProgressBar style={{ marginTop: 20, width: 300 }} progress={0.5} color="#00BCD4" /> */}
                <View style={{ width: "100%", flexDirection: "row", justifyContent: 'space-between', paddingHorizontal: 5, height: 25, }}>

                    <View style={{ flexDirection: "row", }}>
                        <Text style={{ ...styles.normalText, fontFamily: Assets.fonts.boldItalic, }}>
                            {labels["Please-Wait"] ?? "Please-Wait"}
                        </Text>
                        <LottieView
                            source={require('../Assets/images/loader_dots.json')}
                            autoPlay
                            loop={true}
                            style={{ width: "30%", marginLeft: -4, marginTop: -getProportionalFontSize(8), }}
                        />
                    </View>
                    <Animated.Text style={styles.normalText}>
                        {progressStatus}%
                    </Animated.Text>
                </View>
                <View style={styles.container}>
                    <Animated.View style={[styles.inner, { width: progressStatus + "%" },]} />
                </View>
            </Animated.View>


        </View >
    );
};

const styles = StyleSheet.create({
    nextButton: {
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        width: '55%',
        height: 50,
        borderRadius: 5,
        backgroundColor: Colors.primary,
        // shadow
        shadowOffset: { width: 1.5, height: 5 },
        shadowOpacity: 3.5,
        elevation: 8,
        shadowColor: Platform.OS == 'ios' ? Colors.primary : Colors.primary,
        shadowRadius: 8,
        borderRadius: 12, marginBottom: 20
    },
    normalText: {
        color: Colors.primary,
        fontFamily: Assets.fonts.bold,
        fontSize: getProportionalFontSize(15),
    },
    registerText: {
        color: Colors.black,
        fontFamily: Assets.fonts.bold,
        fontSize: getProportionalFontSize(15),
    },
    cardContainer: {
        borderWidth: 0,
        flex: 1
    },
    card: {
        width: '45%',
        borderWidth: 0,
        minHeight: 120,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.white,
        marginVertical: 10,
        // shadow
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 15,
        elevation: 8,
        shadowColor:
            Platform.OS == 'ios'
                ? Colors.shadowColorIosDefault
                : Colors.shadowColorAndroidDefault,
        shadowRadius: 8,
        borderRadius: 12,
    },
    textContainer: {
        width: '100%',
        borderWidth: 0,
        marginLeft: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },




    container: {
        width: "100%",
        height: 6,
        // padding: 2,
        borderColor: Colors.primary,
        borderWidth: 2,
        borderRadius: 30,
        // marginTop: 200,
        justifyContent: "center",
        marginBottom: "15%"
    },
    inner: {
        width: "100%",
        height: 4,
        borderRadius: 15,
        backgroundColor: Colors.primary,
    },

});

export default SplashScreen;
