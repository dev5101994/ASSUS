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
    getJSObjectFromTimeString,
    formatDateForAPI,
    formatTimeForAPI,
} from '../Services/CommonMethods';
import InputValidation from '../Components/InputValidation';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import { CommonActions } from '@react-navigation/native';
import APIService from '../Services/APIService';
import Constants from '../Constants/Constants';
import ProgressLoader from '../Components/ProgressLoader';
import { useSelector, useDispatch } from 'react-redux';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import DatePicker from 'react-native-date-picker';
import ActionSheet from 'react-native-actions-sheet';
import ActionSheetComp from '../Components/ActionSheetComp';
import { Modal, Portal, RadioButton } from 'react-native-paper';
import ColorPicker from 'react-native-wheel-color-picker';
import CustomButton from '../Components/CustomButton';
import ErrorComp from '../Components/ErrorComp';
import Alert from '../Components/Alert';
import FormSubHeader from '../Components/FormSubHeader';
import CommonAPIFunctions from '../Services/CommonAPIFunctions';

export default AddJournal = props => {
    // const routeParams = props.route.params ?? {};

    // Constants
    const firstViewForm = 'firstViewForm';
    const secondViewForm = 'secondViewForm';

    //initialValues
    const formInitialValues = {
        category: {},
        subCategory: {},
        patient: {},
        changeEventDate: false,
        date: "",
        time: "",
        description: '',
        secretJournal: false,
        reason_for_editing: '',
        is_signed: false,
        status: false,
        old_description: ""
    }

    //uniqueKeys
    const formKeys = {
        category: 'category',
        subCategory: 'subCategory',
        patient: "patient",
        changeEventDate: 'changeEventDate',
        date: "date",
        time: "time",
        description: 'description',
        secretJournal: 'secretJournal',
        reason_for_editing: "reason_for_editing",
        is_signed: 'is_signed',
        status: "status",
        old_description: "old_description"
    }

    // Immutable Variables
    const initialFirstViewValidationObj = {
        [formKeys.patient]: {
            invalid: false,
            title: '',
        },
        [formKeys.category]: {
            invalid: false,
            title: '',
        },
        [formKeys.subCategory]: {
            invalid: false,
            title: '',
        },
    };

    const initialSecondViewValidationObj = {
        [formKeys.description]: {
            invalid: false,
            title: '',
        },
        [formKeys.reason_for_editing]: {
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
    const [firstViewValidationObj, setFirstViewValidationObj] = useState({
        ...initialFirstViewValidationObj,
    });
    const [secondViewValidationObj, setSecondViewValidationObj] = useState({
        ...initialSecondViewValidationObj,
    });
    const [formValues, setFormValues] = useState({
        ...formInitialValues,
    });
    const [isLoading, setIsLoading] = useState(false);
    const [openDatePicker, setOpenDatePicker] = useState(false);
    const [mode, setMode] = useState(Constants.DatePickerModes.date_mode);
    const [datePickerKey, setDatePickerKey] = useState(null);
    const [actionSheetDecide, setActionSheetDecide] = useState('');
    const [viewDecider, setViewDecider] = useState(1);

    const [patientAS, setPatientAS] = React.useState(getActionSheetAPIDetail({
        url: Constants.apiEndPoints.userList, params: { user_type_id: '6' }, debugMsg: "patient-list", token: UserLogin.access_token, perPage: Constants.perPage,
        selectedData: []
    }));
    const [categoryAS, setCategoryAS] = React.useState(getActionSheetAPIDetail({
        url: Constants.apiEndPoints.categoryParentList, params: { category_type_id: '2' }, debugMsg: "category", token: UserLogin.access_token, perPage: Constants.perPage,
        selectedData: []
    }));
    const [subCategoryAS, setSubCategoryAS] = React.useState(getActionSheetAPIDetail({}));


    // BadWords & Suggetion

    const [suggestion, setSuggestion] = React.useState([]);
    const [badWords, setBadWords] = React.useState([]);
    const [description, setDescription] = React.useState([]);


    // useEffect hooks
    React.useEffect(() => {
        CommonAPIFunctions.getSuggestions(UserLogin.access_token, (data) => { setSuggestion(data) });
        CommonAPIFunctions.getBadWords(UserLogin.access_token, (data) => { setBadWords(data) });
        // userDetailAPI()

    }, [])




    // useEffect hooks
    useEffect(() => {
        getJournalDetail();
    }, []);


    const getBadWordString = () => {
        let result = '';
        for (let i = 0; i < badWords?.length; i++) {
            let currBadWord = badWords[i]?.name?.toLowerCase();

            if (formValues?.description?.toLowerCase()?.includes(currBadWord)
                || formValues?.old_description?.toLowerCase()?.includes(currBadWord)

            ) {
                if (!result?.toLowerCase()?.includes(currBadWord))
                    result = result + badWords[i]?.name + ", ";
            }
        }
        if (result)
            result = result?.substring(0, result?.length - 2);
        return result;
    }

    //filterSuggetion

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


    const handleInputChange = (value, key) => {
        setFormValues({
            ...formValues,
            [key]: value,
        });
    };

    const closeActionSheet = () => {
        setActionSheetDecide('');
        actionSheetRef?.current?.setModalVisible();
    };

    const removeErrorTextForInputThatUserIsTyping = (form, uniqueKey) => {
        if (form == firstViewForm) {
            let tempValidationObj = { ...firstViewValidationObj };
            tempValidationObj[uniqueKey] = initialFirstViewValidationObj[uniqueKey];
            setFirstViewValidationObj(tempValidationObj);
        } else if (form == secondViewForm) {
            let tempValidationObj = { ...secondViewValidationObj };
            tempValidationObj[uniqueKey] =
                initialSecondViewValidationObj[uniqueKey];
            setSecondViewValidationObj(tempValidationObj);
        }
    };

    const validation = form => {
        if (form == firstViewForm) {
            let validationObjTemp = { ...firstViewValidationObj };
            let isValid = true;
            //  console.log('validationObjTemp===', JSON.stringify(validationObjTemp))
            for (const [key, value] of Object.entries(validationObjTemp)) {
                // console.log(`${key}: ${ipFormValues[key]}`);
                if (!formValues[key]?.name) {
                    // console.log('key', key)
                    value['invalid'] = true;
                    value['title'] = labels[key + '_required']
                    isValid = false;
                    break;
                }
            }
            setFirstViewValidationObj({ ...validationObjTemp });
            return isValid;
        }
        else if (form == secondViewForm) {
            let validationObjTemp = { ...secondViewValidationObj };
            let isValid = true;
            //  console.log('validationObjTemp===', JSON.stringify(validationObjTemp))
            for (const [key, value] of Object.entries(validationObjTemp)) {
                // console.log(`${key}: ${ipFormValues[key]}`);
                if (key == formKeys.reason_for_editing) {
                    if (!formValues[key] && props?.route?.params?.itemID) {
                        // console.log('key', key)
                        value['invalid'] = true;
                        value['title'] = labels[key + '_required']
                        isValid = false;
                        break;
                    }
                }
                else if (!formValues[key]) {
                    // console.log('key', key)
                    value['invalid'] = true;
                    value['title'] = labels[key + '_required']
                    isValid = false;
                    break;
                }
            }
            setSecondViewValidationObj({ ...validationObjTemp });
            return isValid;
        }
    };

    const getAPIDetails = () => {
        switch (actionSheetDecide) {
            case formKeys.category: {
                return categoryAS;
            }
            case formKeys.subCategory: {
                return subCategoryAS;
            }
            case formKeys.patient: {
                return patientAS;
            }
            default: {
                return null;
            }
        }
    };

    const changeAPIDetails = payload => {
        switch (actionSheetDecide) {
            case formKeys.category: {
                setCategoryAS(
                    getActionSheetAPIDetail({ ...categoryAS, ...payload }),
                );
                break;
            }
            case formKeys.subCategory: {
                setSubCategoryAS(
                    getActionSheetAPIDetail({ ...subCategoryAS, ...payload }),
                );
                break;
            }
            case formKeys.patient: {
                setPatientAS(
                    getActionSheetAPIDetail({ ...patientAS, ...payload }),
                );
                break;
            }
            default: {
                break;
            }
        }
    };

    const onPressItem = item => {
        switch (actionSheetDecide) {
            case formKeys.category: {
                handleInputChange(item, formKeys.category);
                removeErrorTextForInputThatUserIsTyping(firstViewForm, formKeys.category);
                setSubCategoryAS(getActionSheetAPIDetail({
                    url: Constants.apiEndPoints.categoryChildList, params: { parent_id: item?.id }, debugMsg: "sub-category", token: UserLogin.access_token,
                    // selectedData: formValues.subCategory ? formValues[formKeys.subCategory] : []
                    selectedData: []
                }))
                break;
            }
            case formKeys.subCategory: {
                handleInputChange(item, formKeys.subCategory)
                removeErrorTextForInputThatUserIsTyping(firstViewForm, formKeys.subCategory)
                break;
            }
            case formKeys.patient: {
                handleInputChange(item, formKeys.patient);
                removeErrorTextForInputThatUserIsTyping(firstViewForm, formKeys.patient);
                break;
            }
            default: {
                break;
            }
        }
    };

    const saveOrEditJournal = async (is_signed) => {
        // console.log("HOLA loolo")
        // return
        setIsLoading(true);
        let url = Constants.apiEndPoints.journal;
        if (props?.route?.params?.itemID)
            url = url + "/" + props?.route?.params?.itemID
        let params = {
            "patient_id": formValues.patient.id,
            "category_id": formValues.category.id,
            "subcategory_id": formValues.subCategory.id,
            "date": formValues.date ? formatDateForAPI(formValues.date) : '',
            "time": formValues.time ? formatTimeForAPI(formValues.time) : '',
            "is_signed": is_signed ? 1 : 0,
            "type": "",
            "description": formValues.description,
            // "reason_for_editing": "",
            "activity_id": "",
            "branch_id": "",
            "is_secret": formValues.secretJournal ? 1 : 0,
            "is_active": formValues.status ? 1 : 0
        }
        let response = {}
        if (props?.route?.params?.itemID) {
            params['reason_for_editing'] = formValues.reason_for_editing;
            response = await APIService.putData(url, params, UserLogin.access_token, null, "editJournal");
        }
        else
            response = await APIService.postData(url, params, UserLogin.access_token, null, "saveJournal");

        if (!response.errorMsg) {
            setIsLoading(false);
            Alert.showAlert(Constants.success, props?.route?.params?.itemID ? labels.journal_updated_msg : labels.journal_saved_msg, () => { props.navigation.pop() })
        }
        else {
            setIsLoading(false);
            Alert.showAlert(Constants.danger, response.errorMsg);
        }
    }

    const getJournalDetail = async () => {
        if (!props?.route?.params?.itemID)
            return;
        setIsLoading(true);
        let url = Constants.apiEndPoints.journal + "/" + props?.route?.params?.itemID;
        let response = await APIService.getData(url, UserLogin.access_token, null, "getJournalDetail");
        if (!response.errorMsg) {
            setFormValues({
                ...formValues,
                patient: response.data.payload.patient,
                category: response.data.payload.category,
                subCategory: response.data.payload.subcategory,
                changeEventDate: response.data.payload.date || response.data.payload.time ? true : false,
                date: new Date(response.data.payload.date),
                time: getJSObjectFromTimeString(response.data.payload.time),
                description: response.data.payload.is_signed == 1 ? "" : response.data.payload.description,
                old_description: response.data.payload.description,
                secretJournal: response.data.payload.is_secret ? true : false,
                is_signed: response.data.payload.is_signed == 1 ? true : false,
                status: response.data.payload.is_active == 1 ? true : false,
            })
            setPatientAS({ ...patientAS, selectedData: [response.data.payload.patient] })
            setCategoryAS({ ...categoryAS, selectedData: [response.data.payload.category] })
            setSubCategoryAS(getActionSheetAPIDetail({
                url: Constants.apiEndPoints.categoryChildList, params: { parent_id: response.data.payload.category?.id }, debugMsg: "sub-category", token: UserLogin.access_token,
                selectedData: [response.data.payload.subcategory]
            }))
            setIsLoading(false);
        }
        else {
            setIsLoading(false);
            Alert.showAlert(Constants.danger, response.errorMsg);
        }
    }

    const shouldDisable = () => {
        return (props?.route?.params?.itemID && formValues.is_signed)
    }

    // console.log('props?.route?.params?.itemID', props?.route?.params)
    // render view
    if (isLoading)
        return <ProgressLoader />;

    return (
        <BaseContainer
            title={labels["add-journal"]}
            onPressLeftIcon={() => {
                props.navigation.pop();
            }}
            titleStyle={styles.headingText}
            leftIcon="arrow-back"
            leftIconSize={24}
            leftIconColor={Colors.primary}>

            <FormSubHeader
                leftIconName={
                    viewDecider == 1 ? "" : "chevron-back-circle-outline"}
                onPressLeftIcon={viewDecider == 2 ? () => { setViewDecider(1) } : () => { }}
                title={
                    viewDecider == 1 ? labels["patient"] : viewDecider == 2 ? labels["others"] : ""
                }
            />

            <KeyboardAwareScrollView style={{ flex: 1 }} keyboardShouldPersistTaps="handled" >
                {/* Main View */}

                <View style={styles.mainView}>
                    {viewDecider == 1 ?
                        <>
                            {/* Patient */}
                            <InputValidation
                                disabled={shouldDisable()}
                                uniqueKey={formKeys.patient}
                                validationObj={firstViewValidationObj}
                                value={formValues.patient?.name ?? ''}
                                placeHolder={labels["patient"]}
                                iconRight="chevron-down"
                                iconColor={Colors.primary}
                                editable={false}
                                onPress={() => {
                                    removeErrorTextForInputThatUserIsTyping(firstViewForm, formKeys.patient,);
                                    setActionSheetDecide(formKeys.patient);
                                    actionSheetRef.current?.setModalVisible();
                                }}
                                style={styles.InputValidationView}
                                inputStyle={styles.inputStyle}
                            />

                            {/* category */}
                            <InputValidation
                                disabled={shouldDisable()}
                                uniqueKey={formKeys.category}
                                validationObj={firstViewValidationObj}
                                value={formValues.category?.name ?? ''}
                                placeHolder={labels["category"]}
                                iconRight="chevron-down"
                                iconColor={Colors.primary}
                                editable={false}
                                onPress={() => {
                                    removeErrorTextForInputThatUserIsTyping(firstViewForm, formKeys.category,);
                                    setActionSheetDecide(formKeys.category);
                                    actionSheetRef.current?.setModalVisible();
                                }}
                                style={styles.InputValidationView}
                                inputStyle={styles.inputStyle}
                            />

                            {/* subcategory */}
                            <InputValidation
                                disabled={shouldDisable()}
                                uniqueKey={formKeys.subCategory}
                                validationObj={firstViewValidationObj}
                                value={formValues.subCategory?.name ?? ''}
                                placeHolder={labels["subcategory"]}
                                iconRight="chevron-down"
                                iconColor={Colors.primary}
                                editable={false}
                                onPress={() => {
                                    removeErrorTextForInputThatUserIsTyping(firstViewForm, formKeys.subCategory,);
                                    setActionSheetDecide(formKeys.subCategory);
                                    actionSheetRef.current?.setModalVisible();
                                }}
                                style={styles.InputValidationView}
                                inputStyle={styles.inputStyle}
                            />

                            {/* next button */}
                            <CustomButton
                                style={{
                                    ...styles.nextButton,
                                    backgroundColor: Colors.primary
                                }}
                                onPress={() => {
                                    if (validation(firstViewForm))
                                        setViewDecider(2)
                                    else
                                        Alert.showAlert(Constants.warning, messages.message_fill_all_required_fields)
                                }}
                                title={labels["Next"]}
                            />
                        </>
                        :
                        viewDecider == 2 ?
                            <>

                                {/* Previous description */}
                                {shouldDisable()
                                    ? < InputValidation
                                        disabled={true}
                                        multiline={true}
                                        value={formValues.old_description}
                                        placeHolder={labels["old-description"]}
                                        editable={false}
                                        style={styles.InputValidationView}
                                        inputMainViewStyle={{ ...styles.InputValidationView, }}
                                        nonEditableTextStyle={{ textDecorationLine: "line-through" }}
                                        inputStyle={{ ...styles.inputStyle, textAlignVertical: "top", }}
                                    /> : null}


                                {/* description */}
                                <InputValidation
                                    uniqueKey={formKeys.description}
                                    validationObj={secondViewValidationObj}
                                    multiline={true}
                                    value={formValues.description}
                                    dropDownListData={description}
                                    placeHolder={labels["description"]}
                                    onChangeText={(text) => {
                                        removeErrorTextForInputThatUserIsTyping(secondViewForm, formKeys.description);
                                        filterSuggestion(text, (filteredData) => { setDescription(filteredData) })
                                        handleInputChange(text, formKeys.description)
                                    }}
                                    onPressDropDownListitem={(choosenSuggestion) => {
                                        handleInputChange(choosenSuggestion, formKeys.description,)

                                        setDescription([])
                                    }}
                                    // optional={true}
                                    editable={true}
                                    style={styles.InputValidationView}
                                    inputMainViewStyle={{ ...styles.InputValidationView, }}
                                    inputStyle={{ ...styles.inputStyle, height: 130, textAlignVertical: "top", }}
                                />

                                {/* change event date */}
                                <View style={styles.checkBoxView}>
                                    <BouncyCheckbox
                                        size={20}
                                        disabled={shouldDisable()}
                                        fillColor={shouldDisable() ? Colors.lightGray : Colors.primary}
                                        unfillColor={shouldDisable() ? Colors.lightGray : Colors.white}
                                        iconStyle={{ borderColor: shouldDisable() ? Colors.lightGray : Colors.primary }}
                                        isChecked={formValues.changeEventDate}
                                        onPress={value => {
                                            setFormValues({
                                                ...formValues,
                                                [formKeys.changeEventDate]: value,
                                                [formKeys.time]: '',
                                                [formKeys.date]: '',
                                            });
                                        }}
                                    />
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <Text style={styles.saveAsTemplate}>{labels["change-event-date"]}</Text>
                                    </View>
                                </View>

                                {
                                    formValues.changeEventDate
                                        ? <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                                            {/* date */}
                                            <InputValidation
                                                // uniqueKey={empFormKeys.joining_date}
                                                // validationObj={validationObj}
                                                disabled={shouldDisable()}
                                                iconRight="calendar"
                                                iconColor={Colors.primary}
                                                editable={false}
                                                optional={true}
                                                onPress={() => {
                                                    setOpenDatePicker(true);
                                                    setMode(Constants.DatePickerModes.date_mode);
                                                    setDatePickerKey(formKeys.date);
                                                }}
                                                value={
                                                    formValues.date
                                                        ? formatDate(formValues.date)
                                                        : ''
                                                }
                                                placeHolder={labels["date"]}
                                                style={{ ...styles.InputValidationView, width: "48%" }}
                                                inputStyle={styles.inputStyle}
                                            />

                                            {/* Time */}
                                            <InputValidation
                                                // uniqueKey={empFormKeys.joining_date}
                                                // validationObj={validationObj}
                                                disabled={shouldDisable()}
                                                iconRight="time"
                                                optional={true}
                                                iconColor={Colors.primary}
                                                editable={false}
                                                onPress={() => {
                                                    setOpenDatePicker(true);
                                                    setMode(Constants.DatePickerModes.time_mode);
                                                    setDatePickerKey(formKeys.time);
                                                }}
                                                value={
                                                    formValues.time
                                                        ? formatTime(formValues.time)
                                                        : ''
                                                }
                                                placeHolder={labels["time"]}
                                                style={{ ...styles.InputValidationView, width: "48%" }}
                                                inputStyle={styles.inputStyle}
                                            />
                                        </View>
                                        : null}
                                {
                                    props?.route?.params?.itemID
                                        ?
                                        // reason for editing
                                        < InputValidation
                                            uniqueKey={formKeys.reason_for_editing}
                                            validationObj={secondViewValidationObj}
                                            // multiline={true}
                                            value={formValues.reason_for_editing}
                                            placeHolder={labels["reason-for-editing"]}
                                            onChangeText={(text) => {
                                                removeErrorTextForInputThatUserIsTyping(secondViewForm, formKeys.reason_for_editing,);
                                                handleInputChange(text, formKeys.reason_for_editing)
                                            }}
                                            editable={true}
                                            style={{ ...styles.InputValidationView, }}
                                            inputMainViewStyle={{ ...styles.InputValidationView, }}
                                            inputStyle={{ ...styles.inputStyle, }}
                                        />
                                        : null
                                }


                                {/* secret journal */}
                                <View style={styles.checkBoxView}>
                                    <BouncyCheckbox
                                        size={20}
                                        fillColor={Colors.primary}
                                        unfillColor={Colors.white}
                                        iconStyle={{ borderColor: Colors.primary }}
                                        isChecked={formValues.secretJournal}
                                        onPress={value => {
                                            handleInputChange(value, formKeys.secretJournal)
                                        }}
                                    />
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <Text style={styles.saveAsTemplate}>{labels["secret-journal"]}</Text>
                                    </View>
                                </View>


                                {/* status active or inactive */}
                                {formValues.is_signed && props?.route?.params?.itemID
                                    ? <View style={styles.checkBoxView}>
                                        <BouncyCheckbox
                                            size={20}
                                            fillColor={Colors.primary}
                                            unfillColor={Colors.white}
                                            iconStyle={{ borderColor: Colors.primary }}
                                            isChecked={formValues.status}
                                            onPress={value => {
                                                handleInputChange(value, formKeys.status)
                                            }}
                                        />
                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                            <Text style={styles.saveAsTemplate}>{labels["active"]}</Text>
                                        </View>
                                    </View> : null}


                                {/* save button */}
                                {!formValues.is_signed
                                    ? <CustomButton
                                        style={{
                                            ...styles.nextButton,
                                            backgroundColor: Colors.primary,
                                            marginTop: 20
                                        }}
                                        onPress={() => {
                                            Keyboard.dismiss()
                                            if (validation(secondViewForm)) {
                                                let badWordString = getBadWordString();
                                                //console.log('validation success')
                                                if (badWordString) {
                                                    Alert.showBasicDoubleAlertForBoth(badWordString, () => {
                                                        saveOrEditJournal()
                                                    }, null, messages.message_bad_word_alert)
                                                }
                                                else
                                                    saveOrEditJournal()
                                                // alert("badWordfound")
                                            }
                                            else
                                                Alert.showAlert(Constants.warning, messages.message_fill_all_required_fields)


                                        }}
                                        title={labels["save"]}
                                    /> : null}

                                {/* sign button */}
                                <CustomButton
                                    style={{
                                        ...styles.nextButton,
                                        backgroundColor: Colors.white,
                                        borderColor: Colors.primary,
                                        borderWidth: 1
                                    }}
                                    titleStyle={{ color: Colors.primary }}
                                    onPress={() => {
                                        Keyboard.dismiss()
                                        if (validation(secondViewForm))
                                            saveOrEditJournal(true)
                                        else
                                            Alert.showAlert(Constants.warning, messages.message_fill_all_required_fields)
                                    }}
                                    title={labels["sign"]}
                                />
                            </>
                            : null}
                </View>

                <DatePicker
                    modal
                    mode={mode}
                    open={openDatePicker}
                    minimumDate={mode == Constants.DatePickerModes.date_mode ? new Date() : null}
                    date={new Date()}
                    onConfirm={date => {
                        setOpenDatePicker(false);
                        if (mode == Constants.DatePickerModes.date_mode)
                            handleInputChange(date, datePickerKey);
                        else if (mode == Constants.DatePickerModes.time_mode)
                            handleInputChange(date, datePickerKey);
                        else handleInputChange(date, datePickerKey);
                    }}
                    onCancel={() => {
                        setOpenDatePicker(false);
                    }}
                />

            </KeyboardAwareScrollView>


            <ActionSheet ref={actionSheetRef}>
                <ActionSheetComp
                    title={labels[actionSheetDecide]}
                    closeActionSheet={closeActionSheet}
                    keyToShowData={"name"}
                    keyToCompareData="id"
                    APIDetails={getAPIDetails()}
                    changeAPIDetails={payload => {
                        changeAPIDetails(payload);
                    }}
                    onPressItem={item => {
                        onPressItem(item);
                    }}
                />
            </ActionSheet>
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
    checkBoxView: { flexDirection: 'row', alignItems: 'center', marginTop: 20 },
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
