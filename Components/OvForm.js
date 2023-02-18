import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import InputValidation from './InputValidation';
import Colors from '../Constants/Colors';
import Assets from '../Assets/Assets';
import { getProportionalFontSize, getActionSheetAPIDetail, formatDate, formatTime, createDateFormateFromTime, checkUrlFormat, jsCoreDateCreator, getJSObjectFromTimeString, checkFileSize, formatDateByFormat, isDocOrImage } from '../Services/CommonMethods';
import { Checkbox } from 'react-native-paper';
import CustomButton from './CustomButton';
import ActionSheet from "react-native-actions-sheet";
import Constants from "../Constants/Constants";
import Icon from 'react-native-vector-icons/MaterialIcons';
import APIService from '../Services/APIService';
import Alert from './Alert';
import DatePicker from 'react-native-date-picker';
import moment from 'moment';
import CommonAPIFunctions from '../Services/CommonAPIFunctions';
import { useSelector } from 'react-redux';

const OvForm = ({ markedDatesForForm, DateRange, labels, UserLogin, onRequestClose, navigation, isEditing, OvDetails, formValues }) => {

    const initialKeys = {
        // "is_range": 0,
        // "dates" :["2022-06-03", "2022-06-30"],
        "start_time": "start_time",
        "end_time": "end_time",
        "is_repeat": "is_repeat",
        "title": "title",
        // "every_week": 2,
        // "week_days": [1,4]
    }
    const initialValues = {
        // "is_range": 0,
        // "dates" :["2022-06-03", "2022-06-30"],
        "start_time": "",
        "end_time": "",
        "is_repeat": "",
        "title": "",
        // "every_week": 2,
        // "week_days": [1,4]
    }
    const initialValidation = {
        // [initialKeys.employee]: {
        //     invalid: false,
        //     title: ''
        // },
        // [initialKeys.shift]: {
        //     invalid: false,
        //     title: ''
        // },
        [initialKeys.title]: {
            invalid: false,
            title: ''
        },
        [initialKeys.start_time]: {
            invalid: false,
            title: ''
        },
        [initialKeys.end_time]: {
            invalid: false,
            title: ''
        },
    }
    //Hooks
    const actionSheetRef = React.useRef();
    // BadWords & Suggetion

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
            if (formFields?.title?.toLowerCase()?.includes(currBadWord)

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



    //hooks
    const [formFields, setFormFields] = React.useState({ ...initialValues });
    const [actionSheetDecide, setActionSheetDecide] = React.useState('');
    const [validationObj, setValidationObj] = React.useState({ ...initialValidation });
    const [isLoading, setIsLoading] = React.useState(false);
    const [mode, setMode] = React.useState(Constants.DatePickerModes.time_mode);
    const [datePickerKey, setDatePickerKey] = React.useState(null);
    const [openDatePicker, setOpenDatePicker] = React.useState(false);
    const messages = useSelector(state => state.Labels);

    React.useEffect(() => {
        if (isEditing) {
            setFormFields({
                ...formFields,
                "start_time": OvDetails.start_time ? getJSObjectFromTimeString(OvDetails.start_time) : "",
                "end_time": OvDetails.end_time ? getJSObjectFromTimeString(OvDetails.end_time) : "",
                "title": OvDetails.title ?? "",
            })
        }
    }, [])


    const handleInputChange = (key, value) => {
        // console.log("key", key)
        setFormFields({ ...formFields, [key]: value })

    }
    const removeErrorTextForInputThatUserIsTyping = (uniqueKey) => {
        let tempValidationObj = { ...initialValidation }
        tempValidationObj[uniqueKey] = initialValidation[uniqueKey];
        setValidationObj(tempValidationObj);
    }
    const validation = () => {
        let validationObjTemp = { ...initialValidation };
        let isValid = true;
        for (const [key, value] of Object.entries(initialValidation)) {
            if (key == initialKeys.title && !formFields?.title) {
                // console.log(`${key}-----1`, key)
                value['invalid'] = true;
                value['title'] = labels[key + '_required']
                isValid = false;
                break;
            }
            // if (key == initialKeys.start_time) {
            //     if (formFields.start_time && formFields.end_time || markedDatesForForm.length > 0) {
            //         break;
            //     } else {
            //         console.log(`${key}-----1`, formFields?.key,)
            //         value['invalid'] = true;
            //         value['title'] = "you need to fill atlist start time and end time" // labels[key + '_required']
            //         isValid = false;
            //         break;
            //     }
            // }
            if (key == initialKeys.start_time) {
                if (!formFields.start_time) {
                    // console.log(`${key}-----1`, formFields?.key,)
                    value['invalid'] = true;
                    value['title'] = "you need to fill atleast start time and end time" // labels[key + '_required']
                    isValid = false;
                    break;
                }
            }
            // if (key == initialKeys.start_time && !formFields?.start_time) {
            //     console.log(`${key}-----1`, formFields?.key,)
            //     value['invalid'] = true;
            //     value['title'] = labels[key + '_required']
            //     isValid = false;
            //     break;
            // }
            // if (key == initialKeys.end_time && !formFields?.end_time) {
            //     console.log(`${key}-----1`, key)
            //     value['invalid'] = true;
            //     value['title'] = labels[key + '_required']
            //     isValid = false;
            //     break;
            // }

        }
        setValidationObj({ ...validationObjTemp });
        return isValid;
    }

    const saveOrEditOv = async () => {
        let tempDates = []
        if (DateRange) {
            tempDates = [markedDatesForForm[0], markedDatesForForm[markedDatesForForm.length - 1]]
        }
        let week_days = []
        formValues?.week_days.map((obj) => {
            if (obj.selected) {
                week_days.push('' + obj.number)
            }
        })
        let params = {
            "end_time": formFields?.end_time ? moment(formFields?.end_time).format('hh:mm:ss') : "",
            "start_time": formFields?.start_time ? moment(formFields?.start_time).format('hh:mm:ss') : "",
            "title": formFields?.title ?? "",
        }
        if (isEditing) {
            params = {
                ...params,
                date: markedDatesForForm,
            }
        } else {
            params = {
                ...params,
                // "shift_id": formFields?.shift?.id ?? "",
                // "user_id": formFields?.employee?.id ?? "",
                // "shift_dates": markedDatesForForm ?? [],
                "is_range": DateRange ? 1 : 0,
                "dates": DateRange ? tempDates : markedDatesForForm,
                "is_repeat": DateRange ? 1 : 0,
                "every_week": formValues?.every_week ?? "",
                "week_days": DateRange ? week_days : null,
                // top_most_parent_id: 2
            }
        }


        let url = Constants.apiEndPoints.ovhour
        if (isEditing) {
            url = url + "/" + OvDetails.id
        }
        // console.log("url", url);
        // console.log("params", params);
        // return
        setIsLoading(true);
        let response = {}
        if (isEditing) {
            response = await APIService.putData(url, params, UserLogin.access_token, null, "editOv");
        } else {
            response = await APIService.postData(url, params, UserLogin.access_token, null, "saveOV");
        }

        // console.log("data", response.data)
        if (!response.errorMsg) {
            // console.log('response-------------------+++++++++++++', JSON.stringify(response))
            setIsLoading(true);
            onRequestClose()
            navigation.navigate("OvListing", { refresh: true })

        }
        else {
            setIsLoading(true);
            Alert.showBasicAlert(response.errorMsg);
        }
    }

    return (
        <View style={{
            marginTop: 10,
            marginHorizontal: 20,
            // height: "100%"
        }}>
            {/* close icon */}
            <View style={{ width: "100%", alignItems: "flex-end" }} >
                <Icon name='cancel' color={Colors.primary} size={30} onPress={onRequestClose ? () => onRequestClose() : () => { }} />
            </View>
            <Text style={styles.titleStyle}>{isEditing ? labels.edit ?? "Edit" : labels.create_Ov ?? "Create OV"}</Text>
            {/* <Text numberOfLines={4} style={styles.textStyle} >({labels.selected_dates}: {markedDatesForForm.join(", ")})</Text> */}
            <InputValidation
                // showSoftInputOnFocus={false}                            
                uniqueKey={initialKeys.title}
                validationObj={validationObj}
                // optional={true}
                value={formFields.title}
                placeHolder={labels.title}
                onChangeText={(text) => {
                    removeErrorTextForInputThatUserIsTyping(initialKeys.title);
                    setFormFields({ ...formFields, title: text })
                }}
                style={styles.InputValidationView}
                inputStyle={styles.inputStyle}
            />

            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                {/* Start time */}
                <InputValidation
                    // uniqueKey={initialKeys.start_time}
                    // validationObj={validationObj}
                    optional={true}
                    iconRight="time"
                    value={formFields?.start_time ? formatTime(formFields.start_time) : ""}
                    placeHolder={labels['start-time']}
                    onPressIcon={() => {
                        removeErrorTextForInputThatUserIsTyping(initialKeys.start_time);
                        setDatePickerKey("start_time")
                        setOpenDatePicker(true)
                    }}
                    style={{ ...styles.InputValidationView, width: "48%" }}
                    inputStyle={{ ...styles.inputStyle }}
                    editable={false}
                />

                {/* end time */}
                <InputValidation
                    iconRight="time"
                    optional={true}
                    value={formFields.end_time ? formatTime(formFields.end_time) : ""}
                    placeHolder={labels['end-time']}
                    onPressIcon={() => {
                        removeErrorTextForInputThatUserIsTyping(initialKeys.end_time);
                        setDatePickerKey("end_time")
                        setOpenDatePicker(true)
                    }}
                    style={{ ...styles.InputValidationView, width: "48%" }}
                    inputStyle={{ ...styles.inputStyle }}
                    editable={false}
                />
            </View>

            <ErrorComp
                uniqueKey={initialKeys.start_time}
                validationObj={validationObj}
            />

            {/* next button */}
            <CustomButton
                isLoading={isLoading}
                style={{
                    ...styles.nextButton,
                    backgroundColor: Colors.primary,
                    marginTop: 20
                }}
                onPress={() => {
                    if (validation()) {
                        // console.log('Validation true');
                        let badWordString = getBadWordString();
                        if (badWordString) {
                            Alert.showBasicDoubleAlertForBoth(badWordString, () => {
                                saveOrEditOv()
                            }, null, messages.message_bad_word_alert)
                        }
                        else {
                            saveOrEditOv()
                        }
                        // saveOrEditOv()
                    } else {
                        Alert.showAlert(Constants.warning, messages.message_fill_all_required_fields)
                        // console.log('Validation false');
                    }
                    // let badWordString = getBadWordString();
                    // if (badWordString) {
                    //     Alert.showBasicDoubleAlertForBoth(badWordString, () => {
                    //         saveOrEditOv()
                    //     }, null, messages.message_bad_word_alert)
                    // }
                    // else {
                    //     saveOrEditOv()
                    // }
                }}
                title={labels["save"]}
            />

            <DatePicker
                modal
                mode={mode}
                open={openDatePicker}
                date={new Date()}
                minimumDate={formFields.start_time ? formFields.start_time : null}
                onConfirm={(date) => {
                    setOpenDatePicker(false)
                    // console.log('date : ', date)
                    let value = '';
                    if (mode == Constants.DatePickerModes.date_mode) {
                        handleInputChange(datePickerKey, date)
                    }
                    else if (mode == Constants.DatePickerModes.time_mode) {
                        handleInputChange(datePickerKey, date)
                        removeErrorTextForInputThatUserIsTyping(datePickerKey)
                    }
                    else
                        handleInputChange(datePickerKey, date)
                }}
                onCancel={() => {
                    setOpenDatePicker(false)
                }}
            />

        </View>
    )
}

export default OvForm

const styles = StyleSheet.create({
    InputValidationView: {
        backgroundColor: Colors.transparent,
        //borderColor: 'red',
        marginTop: 15,
        //borderRadius: 10,
        //color: 'red'
    },
    inputStyle: {
        fontSize: getProportionalFontSize(15),
        fontFamily: Assets.fonts.regular
    },
    checkBoxView: { flexDirection: 'row', alignItems: 'center', marginTop: 30 },
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
    textStyle: {
        // textAlign: "justify",
        fontSize: getProportionalFontSize(12),
        color: Colors.black,
        fontFamily: Assets.fonts.medium,
    }
})