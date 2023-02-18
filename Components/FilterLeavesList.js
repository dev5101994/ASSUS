import React from 'react';
import { View, StyleSheet, ScrollView, Dimensions, } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Colors from '../Constants/Colors';
import CustomButton from '../Components/CustomButton';
import Constants from '../Constants/Constants'
import ActionSheet from "react-native-actions-sheet";
import ActionSheetComp from '../Components/ActionSheetComp';
import DatePicker from 'react-native-date-picker';
import InputValidation from '../Components/InputValidation';

import { getProportionalFontSize, CurruntDate, formatDateByFormat, getActionSheetAPIDetail, formatDate, formatTime, placeholderCreator, checkUrlFormat, checkFileSize, reverseFormatDate, formatDateForAPI } from '../Services/CommonMethods';
const { width, height } = Dimensions.get('window');
const FilterModalComp = (props) => {
    const { labels, onRequestClose, UserLogin } = props;
    const statusData = [
        {
            id: 0,
            name: labels?.["not-approve"]
        },
        {
            id: 1,
            name: labels.approved
        },
    ]

    const initialValues = {
        start_date: "",
        end_date: "",
        employee: [],
        title: "",
    }
    //Hooks
    const actionSheetRef = React.useRef();

    const [actionSheetDecide, setActionSheetDecide] = React.useState('');
    const [openDatePicker, setOpenDatePicker] = React.useState(false);
    const [mode, setMode] = React.useState(Constants.DatePickerModes.date_mode);
    const [datePickerKey, setDatePickerKey] = React.useState(null);

    const [employeeAS, setEmployeeAS] = React.useState(getActionSheetAPIDetail({
        url: Constants.apiEndPoints.userList, params: { user_type_id: '3' }, debugMsg: "employeeAS", token: UserLogin.access_token,
        selectedData: [],
    }));
    const [statusAS, setStatusAS] = React.useState(getActionSheetAPIDetail({
        url: '', data: statusData,
        selectedData: []
    }));

    const [formFields, setFormFields] = React.useState({ ...initialValues });
    const [isLoading, setIsLoading] = React.useState(false);

    // Immutable Variables
    const formFieldsKeys = {
        "title": "title",
        "patient": "patient",
        "employee": "employee",
        "status": "status",

        start_date: "start_date",
        end_date: "end_date",
    }
    // console.log("--------------formFields", formFields)


    const initialValidationObj = {
        [formFieldsKeys.name]: {
            invalid: false,
            title: '',
        },

        [formFieldsKeys.patient]: {
            invalid: false,
            title: '1'
        },

        [formFieldsKeys.status]: {
            invalid: false,
            title: '3'
        },
        [formFieldsKeys.start_date]: {
            invalid: false,
            title: '4'
        },
        [formFieldsKeys.end_date]: {
            invalid: false,
            title: '5'
        },
    }
    const [validationObj, setValidationObj] = React.useState({ ...initialValidationObj });
    React.useEffect(() => {
        setFormFields({
            ...formFields,
            ...props.param,
            status: props?.param?.is_approved ?? {},
            employee: props?.param?.user_id ?? {}
        })
        // console.log("new parm data", props.param)
        // setStatusAS({ ...statusAS, selectedData: [props.param.status] })
        // setCategoryAS({ ...categoryAS, selectedData: [props.param.category] })
    }, [])






    const getAPIDetails = () => {
        switch (actionSheetDecide) {

            case formFieldsKeys.patient: {
                return patientListAS
            }

            case formFieldsKeys.employee: {
                return employeeAS
            }


            case formFieldsKeys.status: {
                return statusAS
            }
            default: {
                return null
            }
        }
    }

    const changeAPIDetails = (payload) => {
        switch (actionSheetDecide) {
            case formFieldsKeys.patient: {
                setPatientListAS(getActionSheetAPIDetail({ ...patientListAS, ...payload }))
                break;
            }
            case formFieldsKeys.employee: {
                setEmployeeAS(getActionSheetAPIDetail({ ...employeeAS, ...payload }))
                break;
            }
            case formFieldsKeys.branch: {
                setStatusAS(getActionSheetAPIDetail({
                    url: '', data: statusData,
                    selectedData: []
                }))
                break;
            }
            default: {
                break;
            }
        }
    }
    const handleInputChange = (key, value) => {
        setFormFields({
            ...formFields,
            company_types: formFields?.company_types,
            // patient: formFields?.patient,
            [key]: value,
        });
    };
    const onPressItem = (item) => {
        switch (actionSheetDecide) {
            case formFieldsKeys.patient: {
                handleInputChange(formFieldsKeys.patient, item)
                removeErrorTextForInputThatUserIsTyping(formFieldsKeys.patient)
                break;
            }

            case formFieldsKeys.employee: {
                handleInputChange(formFieldsKeys.employee, item)
                removeErrorTextForInputThatUserIsTyping(formFieldsKeys.employee)
                break;
            }
            case formFieldsKeys.company_types: {
                handleInputChange(formFieldsKeys?.company_types, item)
                removeErrorTextForInputThatUserIsTyping(formFieldsKeys?.company_types)
                break;
            }


            case formFieldsKeys.status: {
                handleInputChange(formFieldsKeys.status, item)
                removeErrorTextForInputThatUserIsTyping(formFieldsKeys.status)
                break;
            }
            default: {
                break;
            }
        }
    }

    const removeErrorTextForInputThatUserIsTyping = (uniqueKey) => {
        let tempValidationObj = { ...validationObj }
        tempValidationObj[uniqueKey] = initialValidationObj[uniqueKey];
        setValidationObj(tempValidationObj);
    }


    const closeActionSheet = () => {
        actionSheetRef?.current?.setModalVisible();
        setActionSheetDecide('');
    }
    return (

        <View style={styles.modalMainView}>
            <View style={styles.innerView}>
                {/* close icon */}
                <Icon name='cancel' color={Colors.primary} size={30} onPress={props.onRequestClose} />
                <ScrollView showsVerticalScrollIndicator={false} style={{ maxHeight: height * 0.7, }}>

                    {/* employee */}
                    <InputValidation
                        optional={true}
                        uniqueKey={formFieldsKeys.employee}
                        // validationObj={validationForActivityDetails}
                        placeHolder={labels["employees"]}
                        value={formFields.employee?.name ?? ""}
                        iconRight='chevron-down'
                        iconColor={Colors.primary}
                        editable={false}
                        onPressIcon={() => {
                            // removeErrorTextForInputThatUserIsTyping(task_details, formFieldsKeys.employee)
                            setActionSheetDecide(formFieldsKeys.employee)
                            actionSheetRef.current?.setModalVisible()
                        }}
                        style={{ marginTop: Constants.formFieldTopMargin, }}
                        inputMainViewStyle={styles.InputValidationView}
                        inputStyle={styles.inputStyle}
                    />




                    {/* start date */}
                    <InputValidation
                        optional={true}
                        // uniqueKey={formFieldsKeys.start_date}
                        // validationObj={validationForTimeAndRepetition}
                        iconRight='calendar'
                        iconColor={Colors.primary}
                        editable={false}
                        onPressIcon={() => {
                            // removeErrorTextForInputThatUserIsTyping(time_and_repetition, formFieldsKeys.start_date)
                            setOpenDatePicker(true);
                            setMode(Constants.DatePickerModes.date_mode);
                            setDatePickerKey(formFieldsKeys.start_date)
                        }}
                        value={formFields.start_date ? reverseFormatDate(formFields.start_date) : ''}
                        placeHolder={props.labels.startDate}
                        style={styles.InputValidationView}
                        inputStyle={styles.inputStyle}
                    />

                    {/* end date */}

                    <InputValidation
                        // uniqueKey={formFieldsKeys.end_date}
                        // validationObj={validationForTimeAndRepetition}
                        iconRight='calendar'
                        iconColor={Colors.primary}
                        editable={false}
                        optional={true}
                        onPressIcon={() => {
                            // removeErrorTextForInputThatUserIsTyping(time_and_repetition, formFieldsKeys.end_date)
                            setOpenDatePicker(true);
                            setMode(Constants.DatePickerModes.date_mode);
                            setDatePickerKey(formFieldsKeys.end_date)
                        }}
                        // value={formFields.end_date ? reverseFormatDate(formFields.end_date) : ''}
                        value={formFields.end_date ? reverseFormatDate(formFields.end_date) : ''}
                        placeHolder={props.labels.endDate}
                        style={styles.InputValidationView}
                        inputStyle={styles.inputStyle}
                    />

                    {/* Status */}

                    <InputValidation
                        optional={true}
                        // uniqueKey={formFieldsKeys.status}
                        // validationObj={validationObj}
                        placeHolder={labels["status"]}
                        value={formFields?.status?.name ?? ""}
                        iconRight='chevron-down'
                        iconColor={Colors.primary}
                        editable={false}
                        // isIconTouchable={true}
                        onPress={() => {
                            // console.log("onpress")
                            removeErrorTextForInputThatUserIsTyping(formFieldsKeys.status)
                            setActionSheetDecide(formFieldsKeys.status)
                            actionSheetRef.current?.setModalVisible()
                        }}
                        style={{ marginTop: Constants.formFieldTopMargin, }}
                        inputMainViewStyle={styles.InputValidationView}
                        inputStyle={styles.inputStyle}
                    />

                </ScrollView>

                {/* save button */}
                <View style={styles.bar}>


                    <CustomButton
                        onPress={() => {
                            setFormFields({ ...initialValues })
                            // console.log("-----------op ", formFields)
                        }}
                        isLoading={isLoading}
                        title={labels.clear}
                        // style={{ marginTop: 10, minWidth: 290 }}
                        style={styles.baar}

                    />

                    <CustomButton onPress={() => {
                        props.setParam({
                            "is_approved": formFields?.status ?? "",
                            "start_date": formFields?.start_date ? formatDateForAPI(formFields?.start_date) : "",
                            "end_date": formFields?.end_date ? formatDateForAPI(formFields?.end_date) : "",
                            "user_id": formFields?.employee ?? "",
                            refreshAPI: true
                        })
                        props.onRequestClose()
                    }} isLoading={isLoading} title={labels.apply} style={{
                        width: "45%",
                        // marginBottom: 10
                        margin: "4%",
                        marginTop: 30,
                    }} />



                </View>
            </View>

            <ActionSheet ref={actionSheetRef}>
                <ActionSheetComp
                    title={labels[actionSheetDecide]}
                    closeActionSheet={closeActionSheet}
                    keyToShowData={actionSheetDecide == formFieldsKeys.implementation_plan ? "title" : "name"}
                    keyToCompareData="id"
                    APIDetails={getAPIDetails()}
                    changeAPIDetails={(payload) => changeAPIDetails(payload)}
                    onPressItem={(item) => onPressItem(item)}
                />
            </ActionSheet>

            <DatePicker
                modal
                mode={"date"}
                open={openDatePicker}
                // minimumDate={mode == Constants.DatePickerModes.date_mode ? new Date() : null}
                date={new Date()}
                onConfirm={(date) => {
                    setOpenDatePicker(false)
                    // console.log('date : ', date)
                    let value = '';
                    if (mode == Constants.DatePickerModes.date_mode)
                        handleInputChange(datePickerKey, date,)
                    else if (mode == Constants.DatePickerModes.time_mode)
                        handleInputChange(datePickerKey, date,)
                    else
                        handleInputChange(datePickerKey, date,)
                }}
                onCancel={() => {
                    setOpenDatePicker(false)
                }}
            />
        </View >
    )
}





export default FilterModalComp
const styles = StyleSheet.create({
    modalMainView: {
        backgroundColor: 'transparent', justifyContent: "center", alignItems: "center", paddingHorizontal: 16
    },
    innerView: { width: '100%', minHeight: 300, backgroundColor: Colors.backgroundColor, paddingVertical: 15, paddingHorizontal: 16, borderRadius: 20 },
    inputStyle: {
        fontSize: getProportionalFontSize(16),
        borderColor: Colors.borderColor,
        backgroundColor: Colors.white
    },
    mainInputStyle: {
        backgroundColor: Colors.transparent,
        marginTop: 15,
    }
    ,
    InputValidationView: {
        backgroundColor: Colors.backgroundColor,
        marginTop: Constants.formFieldTopMargin,
        //borderRadius: 20,
        // paddingHorizontal: 5
    },
    bar: {
        width: "100%", flexDirection: "row", justifyContent: "center",
    },
    baar: {
        width: "45%",
        // marginBottom: 10
        margin: "4%",
        marginTop: 30,
    },
    checkBoxView: { flexDirection: 'row', alignItems: 'center', marginTop: 30, minWidth: "40%" },
    saveAsTemplate: { fontSize: getProportionalFontSize(13), fontFamily: Assets.fonts.regular }
})