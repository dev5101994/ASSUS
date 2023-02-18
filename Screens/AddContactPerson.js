import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    SafeAreaView,
    TouchableOpacity,
    ScrollView,
    Keyboard
} from 'react-native';
import Colors from '../Constants/Colors';
import Assets from '../Assets/Assets';
import {
    getProportionalFontSize,
    checkEmailFormat,
    ReplaceAll,
    checkMobileNumberFormat,
    firstLetterFromString,
    getActionSheetAPIDetail,
} from '../Services/CommonMethods';
import InputValidation from '../Components/InputValidation';
import APIService from '../Services/APIService';
import Constants from '../Constants/Constants';
import { useSelector, useDispatch } from 'react-redux';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import ErrorComp from '../Components/ErrorComp';
import Alert from '../Components/Alert';
import FormSubHeader from '../Components/FormSubHeader';
import ProgressLoader from '../Components/ProgressLoader';
import CustomButton from '../Components/CustomButton';
import ActionSheet from 'react-native-actions-sheet';
import { Modal, Portal, RadioButton } from 'react-native-paper';
import ColorPicker from 'react-native-wheel-color-picker';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import ActionSheetComp from '../Components/ActionSheetComp';
import CommonAPIFunctions from '../Services/CommonAPIFunctions';
const personFormInitialValues = {
    gender: {},
    patient_type: [],
};






const closeActionSheet = () => {
    setActionSheetDecide('');
    actionSheetRef?.current?.setModalVisible();
};



const AddContactPerson = props => {
    const routeParams = props.route.params ?? {};
    // Immutable Variables
    //   const personalDetail = 'personalDetails';
    const [actionSheetDecide, setActionSheetDecide] = React.useState('');
    const [isModalVisible, setIsModalVisible] = React.useState(false);
    const [isValid, setIsValid] = React.useState(true);

    const personFormInitialValues = {
        name: '',
        email: '',
        contact_number: '',
        personal_number: '',
        full_address: '',
        gender: {},
        // patient_type: [],
        branch: {},
    };

    const personFormKeys = {
        name: 'name',
        email: 'email',
        contact_number: 'contact_number',
        gender: 'gender',
        patient_type: 'patient_type',
        branch: 'branch',
        full_address: 'full_address',
        personal_number: 'personal_number',
    };
    //console.log('personFormKeys', personFormKeys);

    const initialValidationObj = {
        [personFormKeys.name]: {
            invalid: false,
            title: '',
        },
        [personFormKeys.personal_number]: {
            invalid: false,
            title: '',
        },
        [personFormKeys.email]: {
            invalid: false,
            title: '',
        },
        [personFormKeys.contact_number]: {
            invalid: false,
            title: '',
        },
        // [personFormKeys.full_address]: {
        //     invalid: false,
        //     title: '',
        // },
        [personFormKeys.gender]: {
            invalid: false,
            title: '',
        },
    };

    const initialPersonalValidationObj = {
        [personFormKeys.gender]: {
            invalid: false,
            title: '',
        },
    };


    // Hooks
    const actionSheetRef = React.useRef();

    // REDUX hooks
    const labels = useSelector(state => state.Labels);
    // const patient_labels = useSelector(state => state.Labels);
    const UserLogin = useSelector(state => state.User.UserLogin);
    const messages = useSelector(state => state.Labels);



    const genderDataArr = [
        { name: labels.male, id: 1 },
        { name: labels.female, id: 2 },
        { name: labels.other, id: 3 },
    ];
    const genderObjWhileAdding = {
        [labels.male]: 'male',
        [labels.female]: 'female',
        [labels.other]: 'other',
    };
    const genderObjWhileGetting = {
        male: { name: labels.male, id: 1 },
        female: { name: labels.female, id: 2 },
        other: { name: labels.other, id: 3 },
    };


    const getAPIDetails = () => {
        switch (actionSheetDecide) {
            case personFormKeys.gender: {
                return genderAS;
            }
            case personFormKeys.branch: {
                return branchAS;
            }
            default: {
                return null;
            }
        }
    };

    const changeAPIDetails = payload => {
        switch (actionSheetDecide) {
            case personFormKeys.gender: {
                setGenderAS(getActionSheetAPIDetail({ ...genderAS, ...payload }));
                break;
            }
            case personFormKeys.branch: {
                setBranchAS(getActionSheetAPIDetail({ ...branchAS, ...payload }));
                break;
            }
            default: {
                break;
            }
        }
    };
    //console.log('hello', actionSheetDecide);

    const onPressItem = item => {
        switch (actionSheetDecide) {
            case personFormKeys.branch: {
                handleInputChange(item, personFormKeys.branch);
                // removeErrorTextForInputThatUserIsTyping(empFormKeys.branch);
                break;
            }

            case personFormKeys.gender: {
                handleInputChange(item, personFormKeys.gender);
                // removeErrorTextForInputThatUserIsTyping(empFormKeys.gender);
                break;
            }

            default: {
                break;
            }
        }
    };

    const [genderAS, setGenderAS] = React.useState(
        getActionSheetAPIDetail({
            url: '',
            debugMsg: '',
            token: '',
            selectedData: [],
            data: genderDataArr,
        }),
    );
    const [branchAS, setBranchAS] = React.useState(
        getActionSheetAPIDetail({
            url: Constants.apiEndPoints.userList,
            debugMsg: 'branchList',
            token: UserLogin.access_token,
            selectedData: [],
            params: { user_type_id: '11' },
        }),
    );

    // useState hooks
    const [validationObj, setValidationObj] = React.useState({
        ...initialValidationObj,
    });
    const [personFormValues, setPersonFormValues] = React.useState(
        personFormInitialValues,
    );
    const [isLoading, setIsLoading] = React.useState(false);
    const [mode, setMode] = React.useState('');
    const [viewDecider, setViewDecider] = React.useState(1);
    //  const [personFormValues, setPersonFormValues] =
    //        React.useState(patientInitialValues);

    // BadWords & Suggetion

    const [suggestion, setSuggestion] = React.useState([]);
    const [badWords, setBadWords] = React.useState([]);
    const [full_address, setFull_address] = React.useState([]);






    // useEffect hooks
    React.useEffect(() => {
        CommonAPIFunctions.getSuggestions(UserLogin.access_token, (data) => { setSuggestion(data) });
        CommonAPIFunctions.getBadWords(UserLogin.access_token, (data) => { setBadWords(data) });
        // userDetailAPI()

    }, [])



    const getBadWordString = () => {
        let result = '';
        for (let i = 0; i < badWords?.length; i++) {
            let currBadWord = badWords[i]?.name?.toLowerCase();

            if (personFormValues?.name?.toLowerCase()?.includes(currBadWord)
                || personFormValues?.full_address?.toLowerCase()?.includes(currBadWord)
                // || patientFormValues?.disease_description?.toLowerCase()?.includes(currBadWord)

            ) {
                if (!result?.toLowerCase()?.includes(currBadWord))
                    result = result + badWords[i]?.name + ", ";
            }
        }
        if (result)
            result = result?.substring(0, result?.length - 2);
        return result;
    }

    const filterSuggestion = (query, setFilteredData) => {
        if (query) {
            // Making a case insensitive regular expression
            const regex = new RegExp(`${query.trim()}`, 'i');
            // Setting the filtered film array according the query
            if (setFilteredData)
                setFilteredData(suggestion.filter((suggestion) => suggestion?.paragraph?.search(regex) >= 0))
        } else {
            // If the query is null then return blank
            if (setFilteredData)
                setFilteredData([])
        }
    }














    // useEffect hooks
    React.useEffect(() => {
        if (routeParams.personId) userDetailAPI();
    }, []);
    const closeActionSheet = () => {
        setActionSheetDecide('');
        actionSheetRef?.current?.setModalVisible();
    };

    const userDetailAPI = async () => {
        setIsLoading(true);
        let url = Constants.apiEndPoints.userView + '/' + routeParams.personId;

        let response = {};

        response = await APIService.getData(
            url,
            UserLogin.access_token,
            null,
            'userDetailAPI',
        );
        // console.log('----------------------ok', JSON.stringify(response));
        if (!response.errorMsg) {
            setPersonFormValues({
                ...response.data.payload,
                gender:
                    genderObjWhileGetting[response?.data?.payload?.gender?.toLowerCase()],
            });
            setIsLoading(false);
        } else {
            setIsLoading(false);
            Alert.showAlert(Constants.danger, response.errorMsg);
        }
    };

    //   const isMultiSelect = () => {
    //     switch (actionSheetDecide) {
    //       case personFormKeys.gov_agency: {
    //         return true;
    //       }
    //       case personFormKeys.patient_type: {
    //         return true;
    //       }
    //       default: {
    //         return false;
    //       }
    //     }
    //   };
    //   console.log('personFormValues---------0', personFormValues?.branch?.id);
    // console.log('personFormValues---------0', personFormValues?.category_id);
    //   const isMultiSelect = () => {
    //     console.log('hello');
    //   };

    const addOrEditPersonAPI = async () => {
        let params = {
            user_type_id: personFormValues?.user_type_id ?? '9',
            role_id: personFormValues?.role_id ?? '12',
            company_type_id: personFormValues?.company_type_id ?? '',
            category_id: personFormValues?.category_id ?? '',
            country_id: 209,
            //   branch_id: personFormValues?.branch?.branch_id ?? '',
            branch_id: personFormValues?.branch?.id ?? '',
            //   dept_id: personFormValues?.dept_id ?? '',
            //   govt_id: personFormValues?.govt_id ?? '',
            //   weekly_hours_alloted_by_govt: personFormValues?.weekly_hours ?? [], //type arr
            name: personFormValues?.name ?? '',
            email: personFormValues?.email ?? '',
            contact_number:
                ReplaceAll(personFormValues?.contact_number, ' ', '') ?? '',
            password: '12345678',
            'confirm-password': '12345678',
            gender: personFormValues?.gender ?? '',
            gender: genderObjWhileAdding[personFormValues.gender.name],
            personal_number: personFormValues?.personal_number
                ? ReplaceAll(personFormValues?.personal_number, '-', '')
                : '',
            //   organization_number: personFormValues?.organization_number ?? '',
            //   city: personFormValues?.city ?? '',
            //   postal_code: personFormValues?.postal_code ?? '',
            //   zipcode: personFormValues?.zipcode ?? '',
            full_address: personFormValues?.full_address ?? '',
            licence_key: personFormValues?.licence_key ?? '',
            licence_end_date: personFormValues?.licence_end_date ?? '',
            is_substitute: personFormValues?.is_substitute ?? '',
            is_regular: personFormValues?.is_regular ?? '',
            is_seasonal: personFormValues?.is_seasonal ?? '',
            //   joining_date: personFormValues?.joining_date ?? '',
            //   establishment_date: personFormValues?.establishment_date ?? '',
            //   user_color: personFormValues?.user_color ?? '',
            //   is_file_required: personFormValues?.is_file_required ?? '',
        };

        let url = Constants.apiEndPoints.userView;

        if (routeParams.personId) url = url + '/' + routeParams.personId;

        let response = {};
        // console.log('params************', params);
        // console.log('url************', url);
        // return;
        setIsLoading(true);
        if (routeParams.personId)
            response = await APIService.putData(
                url,
                params,
                UserLogin.access_token,
                null,
                'editPersonAPI',
            );
        else
            response = await APIService.postData(
                url,
                params,
                UserLogin.access_token,
                null,
                'addPersonAPI',
            );

        if (!response.errorMsg) {
            // console.log('response', response);
            setIsLoading(false);
            Alert.showAlert(
                Constants.success,
                routeParams.personId
                    ? labels.person_edited_successfully
                    : labels.person_added_successfully,
                () => {
                    props.navigation.pop();
                },
            );
        } else {
            // console.log('response.errorMsg', response.errorMsg);
            setIsLoading(false);
            Alert.showAlert(Constants.danger, response.errorMsg);
        }
    };

    const handleInputChange = (value, key) => {
        // console.log('---------------------------------,', key, ':', value);
        setPersonFormValues({ ...personFormValues, [key]: value });
    };

    //   const removeErrorTextForInputThatUserIsTyping = uniqueKey => {
    //     let tempValidationObj = {...validationObj};
    //     tempValidationObj[uniqueKey] = initialValidationObj[uniqueKey];
    //     setValidationObj(tempValidationObj);
    //   };

    const validation = () => {
        let validationObjTemp = { ...initialValidationObj };
        if (!personFormValues.name) {
            validationObjTemp[personFormKeys.name].invalid = true;
            validationObjTemp[personFormKeys.name].title = labels.name_invalid;
            setValidationObj({ ...validationObjTemp });
            return false;
        } else {
            validationObjTemp[personFormKeys.name] =
                initialValidationObj[personFormKeys.name];
        }
        if (
            !personFormValues.personal_number
        ) {
            validationObjTemp[personFormKeys.personal_number].invalid = true;
            validationObjTemp[personFormKeys.personal_number].title = labels.personal_number_required;
            setValidationObj({ ...validationObjTemp });
            return false;
        } else {
            validationObjTemp[personFormKeys.email] =
                initialValidationObj[personFormKeys.email];
        }
        if (
            !personFormValues.email ||
            !checkEmailFormat(ReplaceAll(personFormValues.email, ' ', ''))
        ) {
            validationObjTemp[personFormKeys.email].invalid = true;
            validationObjTemp[personFormKeys.email].title = labels.email_invalid;
            setValidationObj({ ...validationObjTemp });
            return false;
        } else {
            validationObjTemp[personFormKeys.email] =
                initialValidationObj[personFormKeys.email];
        }
        if (
            !personFormValues.contact_number &&
            !checkMobileNumberFormat(
                ReplaceAll(personFormValues.contact_number, ' ', ''),
            )
        ) {
            validationObjTemp[personFormKeys.contact_number].invalid = true;
            validationObjTemp[personFormKeys.contact_number].title =
                labels.contact_invalid;
            setValidationObj({ ...validationObjTemp });
            return false;
        } else {
            validationObjTemp[personFormKeys.contact_number] =
                initialValidationObj[personFormKeys.contact_number];
        }
        if (
            !personFormValues.gender?.name
        ) {
            validationObjTemp[personFormKeys.gender].invalid = true;
            validationObjTemp[personFormKeys.gender].title =
                labels.gender_required;
            setValidationObj({ ...validationObjTemp });
            return false;
        } else {
            validationObjTemp[personFormKeys.contact_number] =
                initialValidationObj[personFormKeys.contact_number];
        }

        setValidationObj(validationObjTemp);
        return true;
    };

    const removeErrorTextForInputThatUserIsTyping = (uniqueKey,) => {
        let tempValidationObj = { ...validationObj }
        tempValidationObj[uniqueKey] = initialValidationObj[uniqueKey];
        setValidationObj(tempValidationObj);
    }

    // Render view
    // console.log('personFormValues.gender', personFormValues.gender)
    if (isLoading) return <ProgressLoader />;

    return (
        <BaseContainer
            title={labels["add-contact-person"]}
            onPressLeftIcon={() => {
                props.navigation.pop();
            }}
            titleStyle={styles.headingText}
            leftIcon="arrow-back"
            // leftIconSize={24}
            leftIconColor={Colors.primary}>
            <KeyboardAwareScrollView style={{ flex: 1 }} keyboardShouldPersistTaps="handled" >
                <ActionSheet ref={actionSheetRef}>
                    {actionSheetDecide == personFormKeys.attachment ? (
                        <ImagePickerActionSheetComp
                            chooseMultiple={true}
                            giveChoice={true}
                            closeSheet={closeActionSheet}
                            responseHandler={res => {
                                imageOrDocumentResponseHandler(res);
                            }}
                        />
                    ) : (
                        <ActionSheetComp
                            title={labels[actionSheetDecide]}
                            closeActionSheet={closeActionSheet}
                            keyToShowData={'name'}
                            keyToCompareData="id"

                            // multiSelect={isMultiSelect()}
                            APIDetails={getAPIDetails()}
                            changeAPIDetails={payload => {
                                changeAPIDetails(payload);
                            }}
                            onPressItem={item => {
                                onPressItem(item);
                            }}
                        />
                    )}
                </ActionSheet>
                <View style={styles.mainView}>
                    {/* name */}
                    <InputValidation
                        uniqueKey={personFormKeys.name}
                        validationObj={validationObj}
                        value={personFormValues.name}
                        placeHolder={labels["name"]}
                        onChangeText={text => {
                            removeErrorTextForInputThatUserIsTyping(personFormKeys.name);
                            handleInputChange(text, personFormKeys.name);
                        }}
                        style={styles.InputValidationView}
                        inputStyle={styles.inputStyle}
                    />
                    {/* personal number */}
                    <InputValidation
                        maskedInput={true}
                        mask={Constants.personal_number_format}
                        uniqueKey={personFormKeys.personal_number}
                        validationObj={validationObj}
                        keyboardType={'number-pad'}
                        value={'' + personFormValues.personal_number}
                        // value={'' + personFormValues.contact_number}
                        placeHolder={labels["personal-number"]}
                        onChangeText={text => {
                            removeErrorTextForInputThatUserIsTyping(personFormKeys.personal_number);
                            handleInputChange(text, personFormKeys.personal_number);
                        }}
                        style={styles.InputValidationView}
                        inputStyle={styles.inputStyle}
                    />
                    {/* email */}
                    <InputValidation
                        uniqueKey={personFormKeys.email}
                        validationObj={validationObj}
                        value={personFormValues.email}
                        placeHolder={labels["Email"]}
                        onChangeText={text => {
                            removeErrorTextForInputThatUserIsTyping(personFormKeys.email);
                            handleInputChange(text, personFormKeys.email);
                        }}
                        style={styles.InputValidationView}
                        inputStyle={styles.inputStyle}
                    />
                    {/* contact number */}
                    <InputValidation
                        maskedInput={true}
                        mask={Constants.phone_number_format}
                        uniqueKey={personFormKeys.contact_number}
                        validationObj={validationObj}
                        keyboardType={'number-pad'}
                        value={'' + personFormValues.contact_number}
                        placeHolder={labels["contact-number"]}
                        onChangeText={text => {
                            removeErrorTextForInputThatUserIsTyping(
                                personFormKeys.contact_number,
                            );
                            handleInputChange(text, personFormKeys.contact_number);
                        }}
                        style={styles.InputValidationView}
                        inputStyle={styles.inputStyle}
                    />

                    {/* full_address */}
                    <InputValidation
                        // uniqueKey={patientFormKeys.full_address}
                        // validationObj={validationObj}
                        multiline={true}
                        dropDownListData={full_address}
                        value={personFormValues?.full_address}
                        optional={true}
                        placeHolder={labels["full-address"]}
                        onChangeText={text => {
                            filterSuggestion(text, (filteredData) => { setFull_address(filteredData) })
                            handleInputChange(
                                // personFormKeys,
                                text,
                                personFormKeys.full_address,
                            );
                        }}
                        onPressDropDownListitem={(choosenSuggestion) => {
                            handleInputChange(choosenSuggestion, personFormKeys.full_address)

                            setFull_address([])
                        }}

                        style={styles.InputValidationView}
                        inputStyle={{ ...styles.inputStyle, height: 110 }}
                    />
                    {/* gender */}
                    <InputValidation
                        uniqueKey={personFormKeys.gender}
                        validationObj={validationObj}
                        // optional={true}
                        value={personFormValues.gender?.name ?? ''}
                        placeHolder={labels["gender"]}
                        iconRight="chevron-down"
                        iconColor={Colors.primary}
                        editable={false}
                        onPressIcon={() => {
                            // removeErrorTextForInputThatUserIsTyping(
                            //     // personalDetail,
                            //     personFormKeys.gender,
                            // );
                            setActionSheetDecide(personFormKeys.gender);
                            //   setActionSheetDecide(personFormKeys.branch);
                            actionSheetRef.current?.setModalVisible();
                            //   console.log('.................hhhhhhhhh');
                        }}
                        style={styles.InputValidationView}
                        inputStyle={styles.inputStyle}
                    />

                    {/* branch */}
                    <InputValidation
                        // uniqueKey={patientFormKeys.branch}
                        // validationObj={validationObj}
                        optional={true}
                        value={personFormValues.branch?.name ?? ''}
                        placeHolder={labels['branch']}
                        iconRight="chevron-down"
                        iconColor={Colors.primary}
                        editable={false}
                        onPressIcon={() => {
                            // removeErrorTextForInputThatUserIsTyping(patientForm, patientFormKeys.branch);
                            setActionSheetDecide(personFormKeys.branch);
                            actionSheetRef.current?.setModalVisible();

                        }}
                        style={styles.InputValidationView}
                        inputStyle={styles.inputStyle}
                    />

                    {/* save button */}
                    <CustomButton
                        title={labels["Add"]}
                        style={{ marginTop: 30 }}
                        onPress={() => {
                            Keyboard.dismiss()
                            // let badWordString = getBadWordString();
                            if (validation()) {
                                // console.log('Validation true');
                                // addOrEditPersonAPI();
                                let badWordString = getBadWordString();
                                if (badWordString) {
                                    Alert.showBasicDoubleAlertForBoth(badWordString, () => {
                                        addOrEditPersonAPI()

                                    }, null, messages.message_bad_word_alert)
                                }
                                else {
                                    addOrEditPersonAPI()
                                }
                            }
                            else {
                                Alert.showAlert(Constants.warning, messages.message_fill_all_required_fields)
                                // console.log('validation fail');
                            }
                            // let badWordString = getBadWordString();
                            // if (badWordString) {
                            //     Alert.showBasicDoubleAlertForBoth(badWordString, () => {
                            //         addOrEditPersonAPI()

                            //     }, null, messages.message_bad_word_alert)
                            // }
                            // else

                            //     addOrEditPersonAPI()
                            // alert("badWordfound")

                            // }
                        }}
                    />
                </View>
            </KeyboardAwareScrollView>
        </BaseContainer>
    );
};
// console.log('abc123', personFormKeys);

export default AddContactPerson;

const styles = StyleSheet.create({
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
    InputValidationView: {
        backgroundColor: Colors.transparent,
        //borderColor: 'red',
        marginTop: 15,
        //borderRadius: 10,
        //color: 'red'
    },
    inputStyle: {
        fontSize: getProportionalFontSize(16),
        borderColor: Colors.borderColor,
        backgroundColor: Colors.white,
    },

    nextButton: {
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: 40,
        borderRadius: 5,
        backgroundColor: Colors.secondary,
        marginTop: 30,
        paddingHorizontal: 16,
    },
});
