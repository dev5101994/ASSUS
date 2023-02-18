import React, { useState } from 'react';
import { View, StyleSheet, Keyboard, Dimensions, FlatList, Text, TouchableOpacity, Linking } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Colors from '../Constants/Colors';
import { getProportionalFontSize, CurruntDate, formatDate, reverseFormatDate, getActionSheetAPIDetail, formatTime, getJSObjectFromTimeString, formatTimeForAPI } from '../Services/CommonMethods';
import CustomButton from './CustomButton';
import Constants from '../Constants/Constants'
import APIService from '../Services/APIService';
import Alert from './Alert';
import DatePicker from 'react-native-date-picker';
import { Checkbox } from 'react-native-paper';
import InputValidation from './InputValidation';
import { useSelector } from 'react-redux';
import ActionSheet from 'react-native-actions-sheet';
import ActionSheetComp from '../Components/ActionSheetComp';
import ErrorComp from './ErrorComp';
import { Modal, Portal, RadioButton } from 'react-native-paper';
import ColorPicker from 'react-native-wheel-color-picker';
import CommonAPIFunctions from '../Services/CommonAPIFunctions';

let picker = null;

const WorkShiftModal = (props) => {



    // initialvalues
    const initialValues = {
        shiftName: "",
        toDate: '',
        color: '',
        shiftType: {},
        fromDate: ""
    }

    // initialKeys
    const initialKeys = {
        shiftName: "shiftName",
        toDate: "toDate",
        color: "color",
        shiftType: 'shiftType',
        fromDate: "fromDate"
    }

    // Immutable Variables

    const initialValidation = {
        [initialKeys.shiftType]: {
            invalid: false,
            title: ''
        },
        [initialKeys.shiftName]: {
            invalid: false,
            title: ''
        },
        [initialKeys.fromDate]: {
            invalid: false,
            title: ''
        },
        [initialKeys.toDate]: {
            invalid: false,
            title: ''
        },
        [initialKeys.color]: {
            invalid: false,
            title: ''
        },
    }

    const shiftTypeDataArr = [
        { name: props.labels.Basic, id: 1 },
        { name: props.labels.emergency, id: 2 },
    ];
    const shiftTypeObjWhileAdding = {
        [props.labels.basic]: 'normal',
        [props.labels.emergency]: 'emergency',
    };
    const shiftTypeObjWhileGetting = {
        normal: { name: props.labels.basic, id: 1 },
        emergency: { name: props.labels.emergency, id: 2 },
    };

    const actionSheetRef = React.useRef();

    // BadWords & Suggetion  /

    const [suggestion, setSuggestion] = React.useState([]);
    const [badWords, setBadWords] = React.useState([]);

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

            // formFields.shiftName
            if (formFields?.shiftName?.toLowerCase()?.includes(currBadWord)
                // || formFields?.description?.toLowerCase()?.includes(currBadWord)

            ) {
                if (!result?.toLowerCase()?.includes(currBadWord))
                    result = result + badWords[i]?.name + ", ";
            }
        }
        if (result)
            result = result?.substring(0, result?.length - 2);
        return result;
    }











    // useState hooks

    const [validationObj, setValidationObj] = React.useState({ ...initialValidation });
    const [formFields, setFormFields] = React.useState({ ...initialValues });
    const [isLoading, setIsLoading] = React.useState(false);
    const [mode, setMode] = React.useState('date')
    const messages = useSelector(state => state.Labels);
    const [openDatePicker, setOpenDatePicker] = React.useState(false);
    const [actionSheetDecide, setActionSheetDecide] = React.useState('');
    const [datePickerKey, setDatePickerKey] = React.useState('');
    const [isModalVisible, setIsModalVisible] = React.useState(false);
    const UserLogin = useSelector(state => state.User.UserLogin);
    const [shiftTypeAS, setShiftTypeAS] = React.useState(
        getActionSheetAPIDetail({
            url: '',
            debugMsg: '',
            token: '',
            selectedData: [],
            data: shiftTypeDataArr,
        }),
    );

    // console.log("99999999999999999", formFields)
    React.useEffect(() => {
        if (props.workShiftItem) {
            setFormFields({
                ...formFields,
                "shiftName": props.workShiftItem?.shift_name ?? '',
                "shiftType": props.workShiftItem?.shift_type ? shiftTypeObjWhileGetting[props.workShiftItem?.shift_type?.toLowerCase()] : " ",
                "fromDate": props.workShiftItem?.shift_start_time ? getJSObjectFromTimeString(props.workShiftItem?.shift_start_time) : " ",
                "toDate": props.workShiftItem?.shift_end_time ? getJSObjectFromTimeString(props.workShiftItem?.shift_end_time) : " ",
                "color": props.workShiftItem?.shift_color,

            })
            setShiftTypeAS({
                ...shiftTypeAS,
                selectedData: [
                    shiftTypeObjWhileGetting[props.workShiftItem?.shift_type?.toLowerCase()],
                ],
            });
        }
    }, [])

    const getAPIDetails = () => {
        switch (actionSheetDecide) {
            case initialKeys.shiftType: {
                return shiftTypeAS;
            }
            default: {
                return null;
            }
        }
    };

    const changeAPIDetails = (payload) => {
        switch (actionSheetDecide) {
            case initialKeys.shiftType: {
                setShiftTypeAS(getActionSheetAPIDetail({ ...shiftTypeAS, ...payload }));
                break;
            }
            default: {
                break;
            }
        }
    };

    const onPressItem = item => {
        switch (actionSheetDecide) {
            case initialKeys.shiftType: {
                handleInputChange(initialKeys.shiftType, item);
                // removeErrorTextForInputThatUserIsTyping(empFormKeys.shiftType);
                break;
            }
            default: {
                break;
            }
        }
    };

    const removeErrorTextForInputThatUserIsTyping = (uniqueKey) => {
        let tempValidationObj = { ...validationObj }
        tempValidationObj[uniqueKey] = initialValidation[uniqueKey];
        setValidationObj(tempValidationObj);
    }

    const handleInputChange = (key, value) => {
        setFormFields({ ...formFields, [key]: value })
    }

    const closeActionSheet = () => {
        actionSheetRef?.current?.setModalVisible();
        setActionSheetDecide('');

    };

    const validation = () => {
        let validationObjTemp = { ...initialValidation };
        let isValid = true;
        for (const [key, value] of Object.entries(initialValidation)) {

            if (key == initialKeys.shiftType && !formFields?.shiftType?.name) {
                // console.log(`${key}-----1`, key)
                value['invalid'] = true;
                value['title'] = props?.labels?.required
                isValid = false;
                break;
            }
            if (key == initialKeys.shiftName && !formFields?.shiftName) {
                // console.log(`${key}-----1`, key)
                value['invalid'] = true;
                value['title'] = props?.labels?.workShiftNameRequired
                isValid = false;
                break;
            }
            if (key == initialKeys.fromDate) {
                // console.log(`${key}-----1`, key)
                if (!formFields?.fromDate) {
                    value['invalid'] = true;
                    value['title'] = props?.labels?.start_time_required
                    isValid = false;
                    break;
                }
                else if (formFields?.toDate && formFields?.toDate?.getTime() <= formFields?.fromDate?.getTime()) {
                    value['invalid'] = true;
                    value['title'] = props?.labels?.start_time_invalid_msg
                    isValid = false;
                    break;
                }
            }
            if (key == initialKeys.toDate && !formFields?.toDate) {
                // console.log(`${key}-----1`, key)
                value['invalid'] = true;
                value['title'] = props?.labels?.end_time_required
                isValid = false;
                break;
            }
            if (key == initialKeys.color && !formFields?.color) {
                // console.log(`${key}-----1`, key)
                value['invalid'] = true;
                value['title'] = props?.labels?.color_required
                isValid = false;
                break;
            }
        }
        setValidationObj({ ...validationObjTemp });
        return isValid;
    }

    const addEditShiftAPI = async (shiftId) => {

        setIsLoading(true);

        let url = Constants.apiEndPoints.work_shift
        if (shiftId) {
            url = url + '/' + shiftId;
        }
        let msg = messages.message_add_success;
        let params = {
            "shift_name": formFields.shiftName ?? " ",
            "shift_type": shiftTypeObjWhileAdding[formFields?.shiftType?.name],
            "shift_start_time": formFields.fromDate ? formatTime(formFields.fromDate) : " ",
            "shift_end_time": formFields.toDate ? formatTime(formFields.toDate) : " ",
            "shift_color": formFields.color,
            "entry_mode": "0"
        }

        let response = {};

        if (shiftId)
            response = await APIService.putData(url, params, UserLogin.access_token, null, "EditShiftAPI");
        else
            response = await APIService.postData(url, params, UserLogin.access_token, null, "addShiftAPI");

        // console.log("PARAMS======", params, url);
        // return
        if (!response.errorMsg) {

            setIsLoading(false);
            props.onRequestClose()
            Alert.showToast(msg, Constants.success)
            props.refreshAPI(null, true)
        }
        else {
            setIsLoading(false);
            Alert.showAlert(Constants.danger, response.errorMsg);
        }
    }

    return (
        <View style={styles.modalMainView}>
            <View style={styles.innerView}>

                {/* close icon */}
                <View style={{ width: "100%", alignItems: "flex-end" }} >
                    <Icon name='cancel' color={Colors.primary} size={30} onPress={() => {
                        if (!isLoading)
                            props.onRequestClose()
                    }} />
                </View>

                <Text style={styles.titleStyle}>{props.workShiftItem ? props.labels.edit ?? "Edit" : props.labels.addWorkShift ?? "Add Work Shift"}</Text>

                {/* shift_type */}
                <InputValidation
                    uniqueKey={initialKeys.shiftType}
                    validationObj={validationObj}
                    // optional={true}
                    value={formFields?.shiftType?.name ?? ''}
                    placeHolder={props.labels.shift_type}
                    iconRight="chevron-down"
                    iconColor={Colors.primary}
                    editable={false}
                    onPressIcon={() => {
                        removeErrorTextForInputThatUserIsTyping(initialKeys.shiftType)
                        setActionSheetDecide(initialKeys.shiftType);
                        actionSheetRef.current?.setModalVisible();
                    }}
                    style={styles.InputValidationView}
                    inputStyle={styles.inputStyle}
                />


                {/* shift Name */}
                <InputValidation
                    uniqueKey={initialKeys.shiftName}
                    validationObj={validationObj}
                    value={formFields.shiftName}
                    placeHolder={props.labels.shiftName}
                    iconColor={Colors.primary}
                    onChangeText={(text) => {
                        removeErrorTextForInputThatUserIsTyping(initialKeys.shiftName)
                        setFormFields({ ...formFields, shiftName: text })
                    }}
                    style={styles.mainInputStyle}
                    inputStyle={styles.inputStyle}
                />

                {/* start time */}
                <InputValidation
                    uniqueKey={initialKeys.fromDate}
                    validationObj={validationObj}
                    iconRight='calendar'
                    iconColor={Colors.primary}
                    editable={false}
                    isIconTouchable={true}
                    onPressIcon={() => {
                        removeErrorTextForInputThatUserIsTyping(initialKeys.fromDate)
                        setOpenDatePicker(true);
                        setMode(Constants.DatePickerModes.time_mode);
                        setDatePickerKey(initialKeys.fromDate)
                    }}
                    value={formFields?.fromDate ? formatTime(formFields.fromDate) : ''}
                    placeHolder={props.labels.start_time}
                    style={styles.InputValidationView}
                    inputStyle={styles.inputStyle}
                />

                {/* end time */}
                {formFields.fromDate
                    ? <InputValidation
                        uniqueKey={initialKeys.toDate}
                        validationObj={validationObj}
                        iconRight='calendar'
                        iconColor={Colors.primary}
                        editable={false}
                        isIconTouchable={true}
                        onPressIcon={() => {
                            removeErrorTextForInputThatUserIsTyping(initialKeys.toDate)
                            setOpenDatePicker(true);
                            setMode(Constants.DatePickerModes.time_mode);
                            setDatePickerKey(initialKeys.toDate)
                        }}
                        value={formFields?.toDate ? formatTime(formFields.toDate) : ''}
                        placeHolder={props.labels.end_time}
                        style={styles.InputValidationView}
                        inputStyle={styles.inputStyle}
                    /> : null}

                {/* choose color */}
                <View
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        width: '100%',
                        marginTop: Constants.formFieldTopMargin,
                        justifyContent: 'space-between',
                    }}>
                    {/* choose color */}
                    <CustomButton
                        style={{ width: formFields.color ? '80%' : '100%' }}
                        // style={{ width: '80%' }}
                        onPress={() => {
                            removeErrorTextForInputThatUserIsTyping(
                                initialKeys.color,
                            );
                            setIsModalVisible(true);
                        }}
                        title={props.labels.choose_color}
                    />

                    {/* Choosen Color */}
                    {formFields.color ? (
                        <CustomButton
                            style={{
                                backgroundColor: formFields.color,
                                width: '15%',
                                borderWidth: 1,
                            }}
                        />
                    ) : null}
                </View>

                {/* Color validation  */}

                <ErrorComp
                    uniqueKey={initialKeys.color}
                    validationObj={validationObj}
                />

                {/* save button */}
                <CustomButton onPress={() => {
                    if (validation()) {
                        let badWordString = getBadWordString();
                        if (badWordString) {
                            Alert.showBasicDoubleAlertForBoth(badWordString, () => {
                                addEditShiftAPI(props.workShiftItem?.id ?? null)
                            }, null, messages.message_bad_word_alert)
                        }
                        else {
                            addEditShiftAPI(props.workShiftItem?.id ?? null)
                        }
                    }
                    else {
                        Alert.showAlert(Constants.warning, messages.message_fill_all_required_fields)
                        // console.log('validation fail')
                    }

                }} isLoading={isLoading} title={props.labels.save} style={{ marginTop: Constants.formFieldTopMargin, minWidth: 290 }} />

                <DatePicker
                    modal
                    mode={mode}
                    open={openDatePicker}
                    minimumDate={formFields?.fromDate ? formFields.fromDate : null}
                    date={new Date()}
                    onConfirm={date => {
                        setOpenDatePicker(false);
                        if (mode == Constants.DatePickerModes.date_mode)
                            handleInputChange(datePickerKey, date);
                        else if (mode == Constants.DatePickerModes.time_mode)
                            handleInputChange(datePickerKey, date);
                        else handleInputChange(datePickerKey, date);
                    }}
                    onCancel={() => {
                        setOpenDatePicker(false);
                    }}
                />

                <Portal>
                    <Modal
                        animationType="slide"
                        transparent={true}
                        style={{ justifyContent: 'center', alignItems: 'center' }}
                        visible={isModalVisible}
                        onRequestClose={() => {
                            setIsModalVisible(false);
                        }}>
                        <View style={{ padding: 20 }}>
                            <ColorPicker
                                ref={r => {
                                    picker = r;
                                }}
                                onColorChangeComplete={color => {
                                    handleInputChange(initialKeys.color, color);
                                }}
                                color={formFields.color ?? Colors.primary}
                                thumbSize={40}
                                sliderSize={40}
                                noSnap={true}
                                row={false}
                            />
                            <CustomButton
                                onPress={() => {
                                    setIsModalVisible(false);
                                }}
                                title={props.labels.done}
                                style={{ marginTop: 20 }}
                            />
                        </View>
                    </Modal>
                </Portal>

                <ActionSheet ref={actionSheetRef}>
                    <ActionSheetComp
                        // title={labels[actionSheetDecide]}
                        title={props.labels[actionSheetDecide]}
                        closeActionSheet={closeActionSheet}
                        // keyToShowData="name"
                        // keyToShowData={empFormKeys.roles ?  "se_name"  :"name"}
                        keyToShowData={"name"}
                        keyToCompareData="id"

                        // multiSelect
                        APIDetails={getAPIDetails()}
                        changeAPIDetails={payload => {
                            changeAPIDetails(payload);
                        }}

                        onPressItem={item => {

                            onPressItem(item);
                        }}

                    />
                </ActionSheet>

            </View>

        </View >
    )
}

export default WorkShiftModal

const styles = StyleSheet.create({
    modalMainView: { backgroundColor: 'transparent', justifyContent: "center", alignItems: "center", paddingHorizontal: 16 },
    innerView: {
        width: '100%',
        // minHeight: 300, 
        backgroundColor: Colors.backgroundColor, paddingVertical: 15, paddingHorizontal: 16, borderRadius: 20
    },
    inputStyle: {
        fontSize: getProportionalFontSize(16),
        borderColor: Colors.borderColor,
        backgroundColor: Colors.white
    },
    mainInputStyle: {
        backgroundColor: Colors.transparent,
        marginTop: 15,

    },
    InputValidationView: {
        backgroundColor: Colors.backgroundColor,
        marginTop: Constants.formFieldTopMargin,
        //borderRadius: 20,
        // paddingHorizontal: 5
    },
    listView: {
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
        height: 30,
    },
    checkBoxView: { flexDirection: 'row', alignItems: 'center', marginTop: Constants.formFieldTopMargin },
    normalText: {
        fontSize: getProportionalFontSize(15),
        fontFamily: Assets.fonts.regular,
    },
    titleStyle: {
        width: '100%',
        // textAlign: 'center',
        fontSize: getProportionalFontSize(20),
        color: Colors.primary,
        fontFamily: Assets.fonts.semiBold,
        // marginTop: 10
        // borderWidth: 1
    },
})