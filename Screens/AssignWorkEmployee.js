import React, { useState, useRef, useEffect } from 'react';
import {
    StyleSheet,
    Text,
    View,
    SafeAreaView,
    Image,
    TouchableOpacity,
    ScrollView,
    Keyboard
} from 'react-native';
import Colors from '../Constants/Colors';
import Assets from '../Assets/Assets';
import {
    getProportionalFontSize,
    formatDate,
    formatTime,
    formatDateWithTime,
    getActionSheetAPIDetail,
    checkEmailFormat,
    ReplaceAll,
    checkMobileNumberFormat,
} from '../Services/CommonMethods';
import InputValidation from '../Components/InputValidation';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import { CommonActions } from '@react-navigation/native';
import APIService from '../Services/APIService';
import Constants from '../Constants/Constants';
import ProgressLoader from '../Components/ProgressLoader';
import { useSelector, useDispatch } from 'react-redux';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import CustomButton from '../Components/CustomButton';
import ErrorComp from '../Components/ErrorComp';
import Alert from '../Components/Alert';

//const labels = Constants.labels.app.implementationPlanForm;
let picker = null;

export default AssignWorkEmployee = props => {
    const routeParams = props.route.params ?? {};

    // const employeeForm = 'employeeForm';
    //initialValues
    const empInitialValues = {
        hourPerWeek: "",
        workPercentage: '',
    };

    //uniqueKeys
    const empFormKeys = {

        hourPerWeek: "hourPerWeek",
        workPercentage: "workPercentage",
    };

    // Immutable Variables
    const initialValidation = {
        [empFormKeys.hourPerWeek]: {
            invalid: false,
            title: '',
        },

    };


    // Hooks
    const actionSheetRef = useRef();

    // REDUX hooks
    const labels = useSelector(state => state.Labels);
    const UserLogin = useSelector(state => state.User.UserLogin);
    const messages = useSelector(state => state.Labels);

    // useState hooks
    const [validationObj, setValidationObj] = React.useState({ ...initialValidation });
    const [empFormValues, setEmpFormValues] = useState({
        ...empInitialValues,
    });
    const [isLoading, setIsLoading] = useState(false);

    // useEffect hooks
    useEffect(() => {
        if (routeParams.employeeId) userDetailAPI();
    }, []);

    const handleInputChange = (value, key) => {
        setEmpFormValues({
            ...empFormValues,
            [key]: value,
        });
    };

    const closeActionSheet = () => {
        setActionSheetDecide('');
        actionSheetRef?.current?.setModalVisible();
    };

    // const removeErrorTextForInputThatUserIsTyping = (uniqueKey) => {
    //     let tempValidationObj = { ...validationObj }
    //     tempValidationObj[uniqueKey] = initialValidationObj[uniqueKey];
    //     setValidationObj(tempValidationObj);
    // }

    const removeErrorTextForInputThatUserIsTyping = (uniqueKey) => {
        // if (form == employeeForm) {
        let tempValidationObj = { ...validationObj };
        tempValidationObj[uniqueKey] = initialValidation[uniqueKey];
        setValidationObj(tempValidationObj);
        // }
    };


    // const validation = () => {
    //     let validationObjTemp = { ...initialValidation };
    //     let isValid = true;
    //     for (const [key, value] of Object.entries(initialValidation)) {

    //         if (key == empFormKeys.hourPerWeek && !empInitialValues?.hourPerWeek) {
    //             console.log(`${key}-----1`, key)
    //             value['invalid'] = true;
    //             value['title'] = labels["required"]
    //             isValid = false;
    //             break;
    //         }
    //     }
    //     setValidationObj({ ...validationObjTemp });
    //     return isValid;
    // }

    const validation = form => {
        // if (form == employeeForm) {
        let validationObjTemp = { ...initialValidation };
        let isValid = true;
        for (const [key, value] of Object.entries(validationObjTemp)) {
            if (key == empFormKeys.hourPerWeek) {
                if (!empFormValues[key]) {
                    value['invalid'] = true;
                    value['title'] = labels["required"];
                    isValid = false;
                    break;
                }
            }
        }

        // setPersonalValidationObj({ ...validationObjTemp });
        setValidationObj({ ...validationObjTemp });
        return isValid;
        //  }
    }

    const userDetailAPI = async () => {
        setIsLoading(true);
        let url = Constants.apiEndPoints.userView + '/' + routeParams.employeeId;

        let response = {};

        response = await APIService.getData(
            url,
            UserLogin.access_token,
            null,
            'userDetailAPI',
        );
        // console.log("responssssssse", JSON.stringify(response) )
        // console.log("responssssssse", JSON.stringify(url))
        if (!response.errorMsg) {
            setEmpFormValues({
                ...empFormValues,
                hourPerWeek: response.data.payload?.assigned_work?.assigned_working_hour_per_week ?? "",
                workPercentage: response.data.payload?.assigned_work?.working_percent ?? "",
            });
            //
            setIsLoading(false);
        } else {
            setIsLoading(false);
            Alert.showAlert(Constants.danger, response.errorMsg);
        }
    };


    const addOrEditEmployeeAPI = async () => {

        let params = {

            password: '12345678',
            'confirm-password': '12345678',

            emp_id: routeParams?.employeeId,
            assigned_working_hour_per_week: empFormValues?.hourPerWeek,
            working_percent: empFormValues?.workPercentage,

        };

        let url = Constants.apiEndPoints.employeeAssignWork;

        if (routeParams.employeeWorkId) url = url + '/' + routeParams.employeeWorkId;

        let response = {};

        // console.log("params-------------------", params)

        //  return;
        setIsLoading(true);


        if (routeParams.employeeWorkId)
            response = await APIService.putData(
                url,
                params,
                UserLogin.access_token,
                null,
                'editEmployeeAPI',
            );
        else
            response = await APIService.postData(
                url,
                params,
                UserLogin.access_token,
                null,
                'addEmployeeAPI',
            );

        if (!response.errorMsg) {
            setIsLoading(false);
            Alert.showAlert(
                Constants.success,
                routeParams.employeeId
                    ? labels.employee_edited_successfully
                    : labels.employee_added_successfully,
                () => {
                    props.navigation.pop();
                },
            );
        } else {
            setIsLoading(false);
            Alert.showAlert(Constants.danger, response.errorMsg);
        }
    };
    // Render view
    // console.log('empFormValues.personal_number', empFormValues.personal_number)
    // console.log('data reaching ',  getAPIDetails())
    if (isLoading) return <ProgressLoader />;

    return (
        <BaseContainer
            title={labels["assignWork"]}
            onPressLeftIcon={() => {
                props.navigation.pop();
            }}
            titleStyle={styles.headingText}
            leftIcon="arrow-back"
            leftIconSize={24}
            leftIconColor={Colors.primary}>
            {/* <KeyboardAvoidingView>
   <ScrollView></ScrollView> */}
            <KeyboardAwareScrollView style={{ flex: 1 }} keyboardShouldPersistTaps={'handled'} >
                {/* Main View */}

                <View style={styles.mainView}>

                    {/*hourPerWeek */}
                    <InputValidation
                        uniqueKey={empFormKeys.hourPerWeek}
                        validationObj={validationObj}
                        multiline={true}
                        value={empFormValues?.hourPerWeek}
                        // optional={true}
                        keyboardType={'number-pad'}
                        placeHolder={labels["hourPerWeek"]}
                        onChangeText={(text) => {
                            removeErrorTextForInputThatUserIsTyping(
                                // employeeForm,
                                empFormKeys.hourPerWeek,
                            );
                            handleInputChange(text, empFormKeys.hourPerWeek)
                        }}
                        style={styles.InputValidationView}
                        inputStyle={{ ...styles.inputStyle, maxHeight: 110 }}
                    />

                    {/*workPercentage */}
                    <InputValidation
                        // uniqueKey={empFormKeys.zipcode}
                        // validationObj={personalValidationObj}
                        multiline={true}
                        value={empFormValues?.workPercentage}
                        optional={true}
                        keyboardType={'number-pad'}
                        placeHolder={labels["workPercentage"]}
                        onChangeText={(text) => {
                            handleInputChange(text, empFormKeys.workPercentage)
                        }}
                        style={styles.InputValidationView}
                        inputStyle={{ ...styles.inputStyle, maxHeight: 110 }}
                    />

                    <CustomButton
                        style={{
                            ...styles.nextButton, marginVertical: 0, marginTop: Constants.formFieldTopMargin,
                            backgroundColor: Colors.primary,
                        }}
                        onPress={() => {
                            // console.log("empFormValues *******************", JSON.stringify(empFormValues))
                            if (validation()) {
                                // console.log('Validation true');
                                // alert("ok");
                                Keyboard.dismiss()
                                addOrEditEmployeeAPI()
                            } else {
                                Alert.showAlert(Constants.warning, messages.message_fill_all_required_fields)
                                // console.log('Validation false');
                            }
                            // if (validation()) {
                            // addOrEditEmployeeAPI()}
                        }} title={labels["save"]} />
                </View>


            </KeyboardAwareScrollView>

        </BaseContainer>
    );
};

const styles = StyleSheet.create({
    buttonView: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-evenly',
    },
    headingText: {
        fontSize: getProportionalFontSize(24),
        // marginTop: 10,
        color: Colors.primary,
        fontFamily: Assets.fonts.bold,
        // marginLeft: 16,
        // width: '80%',
        borderWidth: 0,
        //justifyContent: 'center'
    },
    mainView: {
        flex: 1,
        paddingHorizontal: Constants.globalPaddingHorizontal,
        paddingBottom: 15,
    },
    imageLogin: { width: '100%', height: 200, marginTop: 30 },
    welcomeText: {
        fontSize: getProportionalFontSize(24),
        marginTop: 30,
        color: Colors.primary,
        fontFamily: Assets.fonts.bold,
    },
    InputValidationView: {
        backgroundColor: Colors.transparent,
        //borderColor: 'red',
        marginTop: 15,
        //borderRadius: 10,
        //color: 'red'
    },
    nextButton: {
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: 40,
        borderRadius: 5,
        backgroundColor: Colors.secondary,
        marginTop: Constants.formFieldTopMargin,
    },
    normalText: {
        color: Colors.primary,
        fontFamily: Assets.fonts.bold,
        fontSize: getProportionalFontSize(15),
    },
    inputStyle: {
        fontSize: getProportionalFontSize(16),
        borderColor: Colors.borderColor,
        backgroundColor: Colors.white,
    },
    checkBoxView: { flexDirection: 'row', alignItems: 'center', marginTop: 30 },
    saveAsTemplate: {
        fontSize: getProportionalFontSize(13),
        fontFamily: Assets.fonts.regular,
    },
    radioButtons: {
        // color: Colors.placeholderTextColor,
        // fontFamily: Assets.fonts.regular,
    },
    radioButtonView: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 15,
    },
    radioButtonLabel: {
        fontFamily: Assets.fonts.regular,
        fontSize: getProportionalFontSize(15),
    },
});
