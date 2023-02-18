import React from 'react';
import { View, StyleSheet, Keyboard, Text, ScrollView, Dimensions, FlatList } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Colors from '../Constants/Colors';
import CustomButton from './CustomButton';
import Constants from '../Constants/Constants'
import APIService from '../Services/APIService';
import Alert from './Alert';
import ActionSheet from "react-native-actions-sheet";
import ActionSheetComp from './ActionSheetComp';
import DatePicker from 'react-native-date-picker';
import { Checkbox } from 'react-native-paper';
import InputValidation from '../Components/InputValidation';
import { RadioButton } from "react-native-paper";

import { getProportionalFontSize, CurruntDate, formatDateByFormat, getActionSheetAPIDetail, formatDate, formatTime, placeholderCreator, checkUrlFormat, checkFileSize, formatDateForAPI } from '../Services/CommonMethods';
import BouncyCheckbox from 'react-native-bouncy-checkbox';

const { width, height } = Dimensions.get('window');

const FilterModalComp = (props) => {
    const statusData = [
        {
            id: 0,
            name: "Upcoming"
        },
        {
            id: 1,
            name: "Done"
        },
        {
            id: 2,
            name: "Not Done"
        },
        {
            id: 3,
            name: "Not Applicable"
        },
    ]
    const { labels, onRequestClose, UserLogin } = props;
    const initialValues = {
        patient: "",
        category: "",
        implementation_plan: "",
        branch: "",
        status: "",
        "start_date": "",
        "end_date": "",
        title: "",
        journals: false,
        deviation: false,
        is_completed: false,
    }
    const initialKeys = {
        title: "title",
        patient: "patient",
        category: "category",
        implementation_plan: "implementation_plan",
        branch: "branch",
        status: "status",
        start_date: "start_date",
        end_date: "end_date",
        journals: "journals",
        deviation: "deviation",
        is_completed: "Is Completed"
    }
    // "perPage" :"10",
    // "page" :"1",
    // "status" :"",
    // "category_id" :"",
    // "ip_id" :"",
    // "patient_id" :"",
    // "branch_id" :"",
    // "start_date" :"",
    // "end_date" :"",
    // "title" :""


    //Hooks
    const actionSheetRef = React.useRef();
    // useState hooks
    const [actionSheetDecide, setActionSheetDecide] = React.useState('');
    const [openDatePicker, setOpenDatePicker] = React.useState(false);
    const [mode, setMode] = React.useState(Constants.DatePickerModes.date_mode);
    const [datePickerKey, setDatePickerKey] = React.useState(null);
    const [categoryAS, setCategoryAS] = React.useState(getActionSheetAPIDetail({
        url: Constants.apiEndPoints.categoryParentList, params: { "category_type_id": "2", }, debugMsg: "categoryAS", token: UserLogin.access_token,
        selectedData: [],
    }));
    const [patientListAS, setPatientListAS] = React.useState(getActionSheetAPIDetail({
        url: Constants.apiEndPoints.userList, params: { user_type_id: '6' }, debugMsg: "patientListAS", token: UserLogin.access_token,
        selectedData: [],
    }));
    const [ImplementationPlanAS, setImplementationPlanAS] = React.useState(getActionSheetAPIDetail({
        url: Constants.apiEndPoints.implementationPlanList, debugMsg: "ImplementationPlanAS", token: UserLogin.access_token,
        selectedData: [],
    }));
    const [branchAS, setBranchAS] = React.useState(getActionSheetAPIDetail({
        url: Constants.apiEndPoints.userList, debugMsg: "branchList", token: UserLogin.access_token,
        selectedData: [], params: { "user_type_id": "11" }
    }));

    const [statusAS, setStatusAS] = React.useState(getActionSheetAPIDetail({
        url: '', data: statusData,
        selectedData: []
    }));
    // const [validationObj, setValidationObj] = React.useState({ ...initialValidationObj });
    const [formFields, setFormFields] = React.useState({ ...initialValues });

    const [formFieldsKeys, setFormFieldsKeyformFieldsKeys] = React.useState({ ...initialKeys });

    const [isLoading, setIsLoading] = React.useState(false);

    const initialValidationObj = {
        [formFieldsKeys.patient]: {
            invalid: false,
            title: '1'
        },
        [formFieldsKeys.category]: {
            invalid: false,
            title: '2'
        },
        [formFieldsKeys.implementation_plan]: {
            invalid: false,
            title: '3'
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
        setFormFields({ ...formFields, ...props.param, start_date: "" })
        // setStatusAS({ ...statusAS, selectedData: [props.param.status] })
        // setCategoryAS({ ...categoryAS, selectedData: [props.param.category] })
    }, [])
    // if (props.param) {

    //     () => {

    //     }

    // }
    const getAPIDetails = () => {
        switch (actionSheetDecide) {
            case formFieldsKeys.patient: {
                return patientListAS
            }
            case formFieldsKeys.category: {
                return categoryAS
            }

            case formFieldsKeys.implementation_plan: {
                return ImplementationPlanAS
            }
            case formFieldsKeys.branch: {
                return branchAS
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
            case formFieldsKeys.category: {
                setCategoryAS(getActionSheetAPIDetail({ ...categoryAS, ...payload }))
                break;
            }
            case formFieldsKeys.implementation_plan: {
                setImplementationPlanAS(getActionSheetAPIDetail({ ...ImplementationPlanAS, ...payload }))
                break;
            }
            case formFieldsKeys.branch: {
                setBranchAS(getActionSheetAPIDetail({ ...branchAS, ...payload }))
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
            [key]: value,
        });
    };



    const onPressItem = (item) => {
        switch (actionSheetDecide) {

            case formFieldsKeys.patient: {
                handleInputChange(formFieldsKeys.patient, item)
                removeErrorTextForInputThatUserIsTyping(formFieldsKeys.patient)
                setImplementationPlanAS(getActionSheetAPIDetail({
                    ...ImplementationPlanAS, params: { patient_id: item?.id }, debugMsg: "sub-category", token: UserLogin.access_token,
                    selectedData: []
                }))
                break;
            }
            case formFieldsKeys.category: {
                handleInputChange(formFieldsKeys.category, item)
                removeErrorTextForInputThatUserIsTyping(formFieldsKeys.category)
                break;
            }
            case formFieldsKeys.implementation_plan: {
                handleInputChange(formFieldsKeys.implementation_plan, item)
                removeErrorTextForInputThatUserIsTyping(formFieldsKeys.implementation_plan)
                break;
            }
            case formFieldsKeys.branch: {
                handleInputChange(formFieldsKeys.branch, item)
                removeErrorTextForInputThatUserIsTyping(formFieldsKeys.branch)
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
    // console.log('formFields?.patient ', formFields?.patient)
    return (
        <View style={styles.modalMainView}>
            <View style={styles.innerView}>
                {/* close icon */}
                <Icon name='cancel' color={Colors.primary} size={30} onPress={props.onRequestClose} />
                <ScrollView showsVerticalScrollIndicator={false} style={{ maxHeight: height * 0.7, }}>
                    {/* title */}
                    <InputValidation
                        optional={true}
                        // uniqueKey={formFieldsKeys.title}
                        // validationObj={validationForActivityDetails}
                        value={formFields.title}
                        placeHolder={labels["title"]}
                        iconColor={Colors.primary}
                        onChangeText={(text) => {
                            // removeErrorTextForInputThatUserIsTyping(task_details, formFieldsKeys.title);
                            handleInputChange(formFieldsKeys.title, text)
                        }}
                        style={{ marginTop: Constants.formFieldTopMargin }}
                        inputMainViewStyle={styles.InputValidationView}
                        inputStyle={styles.inputStyle}
                    />
                    {/* status */}
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

                    {/* category */}
                    <InputValidation
                        optional={true}
                        // uniqueKey={formFieldsKeys.category}
                        // validationObj={validationObj}
                        placeHolder={labels["category"]}
                        value={formFields?.category?.name ?? ""}
                        iconRight='chevron-down'
                        iconColor={Colors.primary}
                        editable={false}
                        isIconTouchable={true}
                        onPressIcon={() => {
                            removeErrorTextForInputThatUserIsTyping(formFieldsKeys.category)
                            setActionSheetDecide(formFieldsKeys.category)
                            actionSheetRef.current?.setModalVisible()
                        }}
                        style={{ marginTop: Constants.formFieldTopMargin, }}
                        inputMainViewStyle={styles.InputValidationView}
                        inputStyle={styles.inputStyle}
                    />

                    {/* patient */}
                    <InputValidation
                        optional={true}
                        uniqueKey={formFieldsKeys.patient}
                        validationObj={validationObj}
                        placeHolder={labels["patient"]}
                        value={formFields.patient?.name ?? ""}
                        iconRight='chevron-down'
                        iconColor={Colors.primary}
                        editable={false}
                        isIconTouchable={true}
                        onPress={() => {
                            // console.log("press")
                            removeErrorTextForInputThatUserIsTyping(formFieldsKeys.patient)
                            setActionSheetDecide(formFieldsKeys.patient)
                            actionSheetRef.current?.setModalVisible()
                        }}
                        style={{ marginTop: Constants.formFieldTopMargin, }}
                        inputMainViewStyle={styles.InputValidationView}
                        inputStyle={styles.inputStyle}
                    />

                    {/* implementationPlanList */}
                    < InputValidation
                        // uniqueKey={formFieldsKeys.patient}
                        // validationObj={validationObj}
                        placeHolder={labels["ip-modal"]}
                        optional={true}
                        // value={formFields.implementation_plan?.what_happened ?? ""}
                        value={formFields.implementation_plan?.title ?? ""}
                        iconRight='chevron-down'
                        iconColor={Colors.primary}
                        editable={false}
                        isIconTouchable={true}
                        onPressIcon={() => {
                            // removeErrorTextForInputThatUserIsTyping(formFieldsKeys.implementation_plan)
                            setActionSheetDecide(formFieldsKeys.implementation_plan)
                            actionSheetRef.current?.setModalVisible()
                        }}
                        style={{ marginTop: Constants.formFieldTopMargin, }}
                        inputMainViewStyle={styles.InputValidationView}
                        inputStyle={styles.inputStyle}
                    />

                    {/* branch */}
                    <InputValidation
                        // uniqueKey={empFormKeys.branch}
                        // validationObj={validationObj}
                        placeHolder={labels["branch"]}
                        optional={true}
                        value={formFields.branch?.name ?? ''}
                        iconRight='chevron-down'
                        iconColor={Colors.primary}
                        editable={false}
                        isIconTouchable={true}
                        onPressIcon={() => {
                            removeErrorTextForInputThatUserIsTyping(formFieldsKeys.branch);
                            setActionSheetDecide(formFieldsKeys.branch);
                            actionSheetRef.current?.setModalVisible()
                        }}
                        style={{ marginTop: Constants.formFieldTopMargin, }}
                        inputMainViewStyle={styles.InputValidationView}
                        inputStyle={styles.inputStyle}
                    />

                    <View style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        flexWrap: "wrap"
                    }}>
                        <View style={styles.checkBoxView}>
                            <Checkbox
                                color={Colors.primary}
                                status={formFields.journals ? 'checked' : 'unchecked'}
                                onPress={() => {
                                    setFormFields({
                                        ...formFields,
                                        [formFieldsKeys.journals]: !formFields.journals,
                                    });
                                }}
                            />
                            <Text style={styles.normalText}>{labels["secret-journal"]}</Text>
                        </View>

                        <View style={styles.checkBoxView}>
                            <Checkbox
                                color={Colors.primary}
                                status={formFields.deviation ? 'checked' : 'unchecked'}
                                onPress={() => {
                                    setFormFields({
                                        ...formFields,
                                        [formFieldsKeys.deviation]: !formFields.deviation,
                                    });
                                }}
                            />
                            <Text style={styles.normalText}>{labels["secret-journal"]}</Text>
                        </View>

                    </View>

                    {/* start date */}
                    <InputValidation
                        optional={true}
                        // uniqueKey={formFieldsKeys.start_date}
                        // validationObj={validationObj}
                        iconRight='calendar'
                        iconColor={Colors.primary}
                        editable={false}
                        isIconTouchable={true}
                        onPressIcon={() => {
                            removeErrorTextForInputThatUserIsTyping(formFieldsKeys.start_date)
                            setOpenDatePicker(true);
                            setMode("start_date");
                            setDatePickerKey(formFieldsKeys.start_date)
                        }}
                        value={formFields.start_date ? formatDate(formFields.start_date) : ''}
                        placeHolder={labels["start-date"]}
                        style={styles.InputValidationView}
                        inputStyle={styles.inputStyle}
                    />

                    {/* end date */}
                    {formFields.start_date
                        ? <InputValidation
                            optional={true}
                            // uniqueKey={formFieldsKeys.end_date}
                            // validationObj={validationObj}
                            iconRight='calendar'
                            iconColor={Colors.primary}
                            editable={false}
                            isIconTouchable={true}
                            onPressIcon={() => {
                                removeErrorTextForInputThatUserIsTyping(formFieldsKeys.end_date)
                                setOpenDatePicker(true);
                                setMode("end_date");
                                setDatePickerKey(formFieldsKeys.end_date)
                            }}
                            value={formFields.end_date ? formatDate(formFields.end_date) : ''}
                            placeHolder={labels["end-date"]}
                            style={styles.InputValidationView}
                            inputStyle={styles.inputStyle}
                        /> : null}
                </ScrollView>

                <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
                    {/* save button */}

                    <CustomButton
                        onPress={() => {
                            setFormFields({ ...initialValues })
                            setPatientListAS({ ...patientListAS, selectedData: [] })
                            setCategoryAS({ ...categoryAS, selectedData: [] })
                            setImplementationPlanAS({ ...ImplementationPlanAS, selectedData: [] })
                            setBranchAS({ ...branchAS, selectedData: [] })
                        }}
                        isLoading={isLoading}
                        title={props?.labels?.clear}
                        style={{ marginTop: 10, width: 150 }} />

                    <CustomButton onPress={() => {
                        // console.log("formFields", JSON.stringify(formFields.patient))
                        props.setParam({
                            "status": formFields?.status ?? "",
                            "category": formFields?.category ?? "",
                            "ip": formFields?.implementation_plan ?? "",
                            "patient": formFields?.patient ?? "",
                            "branch": formFields?.branch ?? "",
                            "start_date": formFields?.start_date ? formatDateForAPI(formFields?.start_date) : "",
                            "end_date": formFields?.end_date ? formatDateForAPI(formFields?.end_date) : "",
                            title: formFields?.title ?? "",
                            journals: formFields?.journals ?? false,
                            deviation: formFields?.deviation ?? false,
                            "refreshAPI": true,
                        })
                        props.onRequestClose()
                    }} isLoading={isLoading} title={props?.labels?.apply} style={{ marginTop: 10, width: 150 }} />
                    {/* minWidth: 290 */}


                </View>
            </View>
            <ActionSheet ref={actionSheetRef}>
                <ActionSheetComp
                    title={labels[actionSheetDecide]}
                    closeActionSheet={closeActionSheet}
                    keyToShowData={actionSheetDecide == formFieldsKeys.implementation_plan ? "title" : "name"}
                    keyToCompareData="id"

                    // multiSelect
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
                    if (mode == "start_date")
                        handleInputChange(formFieldsKeys.start_date, date,)
                    else if (mode == "end_date")
                        handleInputChange(formFieldsKeys.end_date, date,)
                    else
                        handleInputChange(ipForm, date,)
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
        backgroundColor: 'transparent', flex: 1, justifyContent: "center", alignItems: "center", paddingHorizontal: 16
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
    checkBoxView: { flexDirection: 'row', alignItems: 'center', marginTop: 20, minWidth: "40%" },
    saveAsTemplate: { fontSize: getProportionalFontSize(13), fontFamily: Assets.fonts.regular }
})