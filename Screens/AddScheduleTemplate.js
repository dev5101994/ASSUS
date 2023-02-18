import { StyleSheet, Text, View, Dimensions, ImageBackground, TouchableOpacity, FlatList, ScrollView } from 'react-native'
import React, { useState } from 'react'
import EmptyList from '../Components/EmptyList';
import Colors from '../Constants/Colors';
// import { getProportionalFontSize, CurruntDate, differenceInWeek } from '../Services/CommonMethods';
import { useSelector, useDispatch } from 'react-redux';
import BaseContainer from '../Components/BaseContainer';
import { Calendar } from 'react-native-calendars';
import Assets from '../Assets/Assets';
import Icon from 'react-native-vector-icons/MaterialIcons';
import moment from 'moment';
import ScheduleForm from '../Components/ScheduleForm';
import { FAB, Button, Card, Title, Paragraph, Checkbox, Portal, Modal, RadioButton } from 'react-native-paper';
import Constants from '../Constants/Constants';
import APIService from '../Services/APIService';
import ProgressLoader from '../Components/ProgressLoader';
import Alert from '../Components/Alert';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import CommonAPIFunctions from '../Services/CommonAPIFunctions';
import InputValidation from '../Components/InputValidation';
import { getProportionalFontSize, getActionSheetAPIDetail, formatDate, formatTime, reverseFormatDate, diffInTime, jsCoreDateCreator, getJSObjectFromTimeString, checkFileSize, formatDateByFormat, isDocOrImage, CurruntDate, differenceInWeek } from '../Services/CommonMethods';
import CustomButton from '../Components/CustomButton';
import ActionSheet from "react-native-actions-sheet";
// import Icon from 'react-native-vector-icons/MaterialIcons';
import DatePicker from 'react-native-date-picker';
import MSDataViewer from '../Components/MSDataViewer';





const AddScheduleTemplate = (props) => {
    const { onRequestClose, item, modalActionMode } = props
    // console.log("------------", item)
    const initialKeys = {
        "title": "title",
        "status": "status",
        "schedule_template": "schedule_template",
    }
    const initialValues = {
        "title": "",
        "status": "",
        "schedule_template": {},
    }
    const initialValidation = {
        [initialKeys.title]: {
            invalid: false,
            title: ''
        },
    }

    // REDUX hooks
    const dispatch = useDispatch();
    const isInternetActive = useSelector(state => state.IsInternetActive);
    const UserLogin = useSelector(state => state.User.UserLogin);
    const labels = useSelector(state => state.Labels);
    //Hooks
    const actionSheetRef = React.useRef();
    //hooks
    const [formFields, setFormFields] = React.useState(item ? { ...initialValues, "title": item.title, "status": item.status } : initialValues);
    // console.log("------------------ formFields", formFields)
    const [isLoading, setIsLoading] = React.useState(false);
    const [actionSheetDecide, setActionSheetDecide] = React.useState('');
    const [validationObj, setValidationObj] = React.useState({ ...initialValidation });
    const [statusCheckBox, setStatusCheckBox] = React.useState(props.modulesItem?.status ?? false);
    const [workShiftAS, setWorkShiftAS] = React.useState(getActionSheetAPIDetail({
        url: Constants.apiEndPoints.workShifts, debugMsg: "workShiftAS", token: UserLogin.access_token, selectedData: [],
    }));
    const [scheduleTemplateAS, setScheduleTemplateAS] = useState(
        getActionSheetAPIDetail({
            url: Constants.apiEndPoints?.["schedule-templates"],
            debugMsg: 'schedule-template',
            token: UserLogin.access_token,
            selectedData: [],
            params: { "status": modalActionMode == "change_template_status" ? "active" : "" }
        }),
    );
    const messages = useSelector(state => state.Labels);
    // BadWords & Suggetion

    // const [suggestion, setSuggestion] = React.useState([]);
    const [badWords, setBadWords] = React.useState([]);
    React.useEffect(() => {
        // CommonAPIFunctions.getSuggestions(UserLogin.access_token, (data) => { setSuggestion(data) });
        CommonAPIFunctions.getBadWords(UserLogin.access_token, (data) => { setBadWords(data) });
        // userDetailAPI()

    }, [])

    const getBadWordString = () => {
        let result = '';
        for (let i = 0; i < badWords?.length; i++) {
            let currBadWord = badWords[i]?.name?.toLowerCase();

            if (formFields?.title?.toLowerCase()?.includes(currBadWord)
                // || formFields?.full_address?.toLowerCase()?.includes(currBadWord)
                // || formFields?.postal_area?.toLowerCase()?.includes(currBadWord)
                // || formFields?.city?.toLowerCase()?.includes(currBadWord)

            ) {
                if (!result?.toLowerCase()?.includes(currBadWord))
                    result = result + badWords[i]?.name + ", ";
            }
        }
        if (result)
            result = result?.substring(0, result?.length - 2);
        return result;
    }

    React.useEffect(() => {

    }, [])
    const closeActionSheet = () => {
        actionSheetRef?.current?.setModalVisible();
        setActionSheetDecide('');
    }

    const getAPIDetails = () => {
        switch (actionSheetDecide) {

            case initialKeys.shifts: {
                return workShiftAS
            }
            case initialKeys.schedule_template: {
                return scheduleTemplateAS;
            }
            default: {
                return null
            }
        }
    }

    const changeAPIDetails = (payload) => {
        switch (actionSheetDecide) {

            case initialKeys.shifts: {
                setWorkShiftAS(getActionSheetAPIDetail({ ...workShiftAS, ...payload }))
                break;
            }
            case initialKeys.schedule_template: {
                setScheduleTemplateAS(getActionSheetAPIDetail({ ...scheduleTemplateAS, ...payload }));
                break;
            }
            default: {
                break;
            }
        }
    }

    const onPressItem = (item) => {
        // console.log('item---------------', item)
        switch (actionSheetDecide) {
            case initialKeys.shifts: {
                // handleInputChange(initialKeys.shift, item)
                // console.log("hey user your start date is here------", item.shift_from_date ? getJSObjectFromTimeString(item.shift_from_date) : "oops!")
                setFormFields({ ...formFields, "shifts": item, })
                // removeErrorTextForInputThatUserIsTyping(initialKeys.shift)
                break;
            }
            case initialKeys.schedule_template: {
                setFormFields({ ...formFields, "schedule_template": item, })
                //  setScheduleTemplate({item})
                break;
            }
            default: {
                break;
            }
        }
    }

    const handleInputChange = (key, value) => {
        // console.log("key", key, value)
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
        if (modalActionMode == "edit_template" || modalActionMode == "merge_template" || modalActionMode == "add_template") {
            if (!formFields.title || formFields.title.trim() == "") {
                validationObjTemp.title['invalid'] = true;
                validationObjTemp.title['title'] = labels['title_required']
                isValid = false;
            }
        }


        setValidationObj({ ...validationObjTemp });
        // console.log(validationObjTemp)
        return isValid;
    }
    const saveOrEditScheduleTemplate = async () => {
        let params = {
            "status": statusCheckBox ? 1 : 0,
            "title": formFields.title ?? "",
            "is_repeat": "",
            "template_id": formFields.schedule_template.id ?? "",
        }
        if (modalActionMode == "merge_template") {
            params = {
                new_template_name: formFields.title ?? "",
                old_template_id: item?.id,
            }
        }
        if (modalActionMode == "change_template_status") {
            params = {
                replacing_template_id: formFields.schedule_template ?? "",
                "status": 1
            }
        }


        let url = Constants.apiEndPoints?.["schedule-template"]
        let apiMsg = "saveScheduleTemp"
        if (modalActionMode == "edit_template") {
            url = url + "/" + item?.id
        }
        if (modalActionMode == "merge_template") {
            url = Constants.apiEndPoints?.scheduleClones;
            apiMsg = "mergeScheduleTemp"
        }
        if (modalActionMode == "change_template_status") {
            url = Constants.apiEndPoints?.scheduleTemplateChangeStatus + "/" + item?.id;
            apiMsg = "change_template_status"
        }
        // console.log("url", url);
        // console.log("params", params);
        // return
        setIsLoading(true);
        let response = {}
        if (modalActionMode == "edit_template") {
            response = await APIService.putData(url, params, UserLogin.access_token, null, "editScheduleTemp");
        }
        else {
            response = await APIService.postData(url, params, UserLogin.access_token, null, apiMsg);
        }
        if (!response.errorMsg) {
            if (props.route == "from_schedule_form") {
                // console.log("find your data here............... formFields=", props.formFields, "props.schedule_template=", props.schedule_template, "response.data.payload=", response.data.payload)
                props.setFormFields({ ...props.formFields, [props.schedule_template]: response.data.payload })
            }
            setIsLoading(false);
            setFormFields(initialValues)
            onRequestClose(true)
        }
        else {
            setIsLoading(false);
            Alert.showBasicAlert(response.errorMsg);
        }
    }


    if (isLoading)
        return <ProgressLoader />
    return (
        <View style={styles.modalMainView}>
            <View style={styles.innerViewforModel}>
                {/* close icon */}
                <View style={{ position: "absolute", top: 10, right: 10, zIndex: 100 }} >
                    <Icon name='cancel' color={Colors.primary} size={30} onPress={() => onRequestClose()} />
                </View>
                <View>
                    <Text style={styles.titleStyle}>{item ? labels.rename_schedule_template : labels.create_schedule_template}</Text>
                    {modalActionMode == "edit_template" || modalActionMode == "merge_template" || modalActionMode == "add_template"
                        ? <InputValidation
                            uniqueKey={"title"}
                            validationObj={validationObj}
                            placeHolder={labels["title"]}
                            value={formFields?.title ?? ""}
                            onChangeText={(text) => {
                                removeErrorTextForInputThatUserIsTyping("title");
                                setFormFields({ ...formFields, title: text })
                            }}
                            style={{ marginTop: Constants.formFieldTopMargin, }}
                            inputMainViewStyle={styles.InputValidationView}
                            inputStyle={styles.inputStyle}
                        />
                        : null

                    }
                    {
                        modalActionMode == "add_template" || modalActionMode == "change_template_status"
                            ? <InputValidation
                                optional={true}
                                value={formFields.schedule_template?.title ?? ''}
                                placeHolder={labels["ScheduleTemplate"]}
                                iconRight="chevron-down"
                                iconColor={Colors.primary}
                                editable={false}
                                onPressIcon={() => {

                                    setActionSheetDecide(initialKeys.schedule_template);
                                    actionSheetRef.current?.setModalVisible();
                                }}
                                style={{ marginTop: Constants.formFieldTopMargin, }}
                                inputMainViewStyle={styles.InputValidationView}
                                inputStyle={styles.inputStyle}
                            />
                            : null
                    }

                    {/* save button */}
                    <CustomButton
                        isLoading={isLoading}
                        style={{
                            ...styles.nextButton,
                            backgroundColor: Colors.primary,
                            marginTop: 20
                        }}
                        onPress={() => {
                            // alert("sd")
                            // let badWordString = getBadWordString();
                            // if (validation()) {
                            //     console.log('Validation true',);
                            //     saveOrEditScheduleTemplate()
                            // } else {
                            //     console.log('Validation false');
                            // }

                            if (validation()) {
                                // console.log('validation success')
                                let badWordString = getBadWordString();
                                if (badWordString) {

                                    Alert.showBasicDoubleAlertForBoth(badWordString, () => {
                                        saveOrEditScheduleTemplate()
                                    }, null, messages.message_bad_word_alert)
                                }
                                else
                                    saveOrEditScheduleTemplate()


                            }
                            else {
                                Alert.showAlert(Constants.warning, messages.message_fill_all_required_fields)
                                // console.log('validation fail')
                            }


                        }}
                        title={labels["save"]}
                    />
                </View>
            </View>
            <ActionSheet ref={actionSheetRef}>
                <ActionSheetComp
                    title={labels[actionSheetDecide]}
                    closeActionSheet={closeActionSheet}
                    keyToShowData={actionSheetDecide == initialKeys.shifts ? "shift_name" : actionSheetDecide == initialKeys.schedule_template ? "title" : "name"}
                    keyToCompareData="id"

                    multiSelect={actionSheetDecide == initialKeys.shifts ? true : false}
                    APIDetails={getAPIDetails()}
                    changeAPIDetails={(payload) => changeAPIDetails(payload)}
                    onPressItem={(item) => onPressItem(item)}
                />
            </ActionSheet>
        </View>




    )
}

export default AddScheduleTemplate

const styles = StyleSheet.create({
    checkBoxView: { flexDirection: 'row', alignItems: 'center', marginTop: 30 },
    normalText: {
        fontSize: getProportionalFontSize(16),
        fontFamily: Assets.fonts.semiBold,
        color: Colors.primary,
        marginLeft: 5
    },
    modalMainView: { backgroundColor: 'transparent', justifyContent: "center", alignItems: "center", paddingHorizontal: 16 },
    innerViewforModel: {
        width: '100%', minHeight: 150, backgroundColor: Colors.backgroundColor, padding: Constants.globalPaddingHorizontal * 2, paddingHorizontal: 16, borderRadius: 20,
    },
    cardStyle: {
        shadowOffset: { width: 3, height: 3, },
        shadowOpacity: 10,
        elevation: 15,
        shadowColor: Platform.OS == "ios" ? Colors.shadowColorIosDefault : Colors.shadowColorAndroidDefault,
        shadowRadius: 20,
        backgroundColor: Colors.white,
        // marginVertical: 10,
        borderRadius: 20,
        padding: 10,
        marginBottom: 30,
        zIndex: -1000
        // marginHorizontal: Constants.globalPaddingHorizontal,
    },
    weekCircleView: { justifyContent: "center", alignItems: "center", backgroundColor: Colors.primary, borderRadius: 20, height: 40, width: 40, marginStart: 5, borderWidth: 1, borderColor: Colors.primary },
    weekText: {
        fontFamily: Assets.fonts.bold,
        // color: Colors.white,
        // fontSize: getProportionalFontSize(15)
    },
    headingTitleStyle: {
        fontFamily: Assets.fonts.regular,
        fontSize: getProportionalFontSize(15),
        marginTop: 20
    },
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
    mainView: {
        flex: 1,
        paddingHorizontal: Constants.globalPaddingHorizontal,
        paddingBottom: 15,
    },
    redioListItems: {
        width: "40%",
        flexDirection: "row",
        alignItems: "center"
    },
    RadioBtnsText: {
        fontSize: getProportionalFontSize(14), fontFamily: Assets.fonts.regular,
        width: 160
    },
    headingTitleStyle: {
        fontFamily: Assets.fonts.regular,
        fontSize: getProportionalFontSize(15),
    },
    labelsText: {
        fontFamily: Assets.fonts.semiBold,
        fontSize: getProportionalFontSize(12),
        width: "70%",

    },
    forRow: {
        flexDirection: "row",
        alignItems: "center"
    },
    secondrytext: {
        fontFamily: Assets.fonts.regular,
        fontSize: getProportionalFontSize(11),
        width: "30%"
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