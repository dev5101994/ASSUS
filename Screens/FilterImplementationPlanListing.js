import React from 'react';
import { View, StyleSheet, Keyboard, Text, ScrollView, Dimensions, FlatList } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Colors from '../Constants/Colors';
// import CustomButton from './CustomButton';
import CustomButton from '../Components/CustomButton';
import Constants from '../Constants/Constants'
import APIService from '../Services/APIService';
// import Alert from './Alert';
import Alert from '../Components/Alert';
import ActionSheet from "react-native-actions-sheet";
// import ActionSheetComp from './ActionSheetComp';
import ActionSheetComp from '../Components/ActionSheetComp';
import DatePicker from 'react-native-date-picker';
import InputValidation from '../Components/InputValidation';
import { RadioButton } from "react-native-paper";

import { getProportionalFontSize, CurruntDate, formatDateByFormat, getActionSheetAPIDetail, formatDate, formatTime, placeholderCreator, checkUrlFormat, checkFileSize, reverseFormatDate, formatDateForAPI } from '../Services/CommonMethods';
import BouncyCheckbox from 'react-native-bouncy-checkbox';

const { width, height } = Dimensions.get('window');
const formFieldTopMargin = Constants.formFieldTopMargin;



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
        company_types: '',
        // country_id: "209",
        name: "",
        email: "",
        contact_number: "",
        personal_number: '',
        // "organization_number": "",
        organization_number: "",
        start_date: "",
        end_date: "",
        patient: {},
        employee: [],
        title: "",
        status: "",
        category: {},
        subCategory: {},

    }
    // const [formFieldsKeys, setFormFieldsKeyformFieldsKeys] = React.useState({ ...initialKeys });
    const initialKeys = {
        company_types: "", //
        name: 'name',//
        email: 'email',//
        // country_id: 'country_id',//
        contact_number: 'contact_number',//
        organization_number: 'organization_number',//
        personal_number: 'personal_number',
        start_date: "start_date",
        end_date: "end_date",
        patient: 'patient',
        employee: 'employee',
        status: "status",
        // company_types:''
        title: "title",
        category: "category",
        subCategory: 'subCategory',
    }

    //Hooks
    const actionSheetRef = React.useRef();
    // useState hooks
    const [actionSheetDecide, setActionSheetDecide] = React.useState('');
    const [openDatePicker, setOpenDatePicker] = React.useState(false);
    const [mode, setMode] = React.useState(Constants.DatePickerModes.date_mode);
    const [datePickerKey, setDatePickerKey] = React.useState(null);
    // const [mode, setMode] = React.useState('date')
    // const [categoryAS, setCategoryAS] = React.useState(getActionSheetAPIDetail({
    //     url: Constants.apiEndPoints.categoryParentList, debugMsg: "categoryAS", token: UserLogin.access_token,
    //     selectedData: [],
    // }));
    const [categoryAS, setCategoryAS] = React.useState(getActionSheetAPIDetail({
        url: Constants.apiEndPoints.categoryParentList, params: { "category_type_id": "2", }, debugMsg: "categoryAS", token: UserLogin.access_token,
        selectedData: [],
    }));

    const [subCategoryAS, setSubCategoryAS] = React.useState(getActionSheetAPIDetail({
        // url: Constants.apiEndPoints.categoryChildList, param: {""}, debugMsg: "subCategoryAS", token: UserLogin.access_token,
    }));

    const [patientListAS, setPatientListAS] = React.useState(getActionSheetAPIDetail({
        url: Constants.apiEndPoints.userList, params: { user_type_id: '6' }, debugMsg: "patientListAS", token: UserLogin.access_token,
        selectedData: [],
    }));

    const [ImplementationPlanAS, setImplementationPlanAS] = React.useState(getActionSheetAPIDetail({
        url: Constants.apiEndPoints.implementationPlanList, debugMsg: "ImplementationPlanAS", token: UserLogin.access_token,
        selectedData: [],
    }));

    const [employeeAS, setEmployeeAS] = React.useState(getActionSheetAPIDetail({
        url: Constants.apiEndPoints.userList, params: { user_type_id: '3' }, debugMsg: "employeeAS", token: UserLogin.access_token,
        selectedData: [],
    }));
    const [statusAS, setStatusAS] = React.useState(getActionSheetAPIDetail({
        url: '', data: statusData,
        selectedData: []
    }));



    const [formFields, setFormFields] = React.useState({ ...initialValues });
    // console.log("ok mks --------", formFields)
    // const [formFieldsKeys, setFormFieldsKeyformFieldsKeys] = React.useState({ ...initialKeys });

    const [isLoading, setIsLoading] = React.useState(false);

    // Immutable Variables
    const formFieldsKeys = {
        "company_types": "company_types", //
        "name": "name",//
        "establishment_date": "establishment_date",//
        personal_number: 'personal_number',
        // email: 'email',
        "title": "title",
        "patient": "patient",
        "employee": "employee",
        "status": "status",
        "category": "category",
        "subCategory": "subCategory",
        "start_date": "start_date",
        "end_date": "end_date"
    }


    const initialValidationObj = {
        [formFieldsKeys.name]: {
            invalid: false,
            title: '',
        },
        [formFieldsKeys.personal_number]: {
            invalid: false,
            title: '',
        },
        [formFieldsKeys.email]: {
            invalid: false,
            title: '',
        },
        [formFieldsKeys.contact_number]: {
            invalid: false,
            title: '',
        },
        [formFieldsKeys.organization_number]: {
            invalid: false,
            title: labels.organization_number_required
        },
        [formFieldsKeys.patient]: {
            invalid: false,
            title: '1'
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
        setFormFields({ ...formFields, ...props.param })
        // setStatusAS({ ...statusAS, selectedData: [props.param.status] })
        // setCategoryAS({ ...categoryAS, selectedData: [props.param.category] })
    }, [])

    const getBranchDetails = async (itemId) => {
        setIsLoading(true);
        // let params = {
        // }
        //console.log("itemId", itemId)
        let url = Constants.apiEndPoints.userView + "/" + itemId;
        // console.log("url", url);
        let response = await APIService.getData(url, UserLogin.access_token, null, "BranchAPI");
        if (!response.errorMsg) {
            // console.log("payload getBranchDetails", response.data.payload);
            setFormFields({
                ...response.data.payload,
                "is_substitute": response.data.payload.is_substitute == "0" ? false : true,
                "is_regular": response.data.payload.is_regular == "0" ? false : true,
                "is_seasonal": response.data.payload.is_seasonal == "0" ? false : true,
                "is_file_required": response.data.payload.is_file_required == "0" ? false : true,
                "documents": response?.data?.payload?.documents ? JSON.parse(response.data.payload.documents) : []
            })
            setCompanyTypeAS({ ...companyTypeAS, selectedData: [response.data.payload.company_types] })
            //console.log("data", response.data.success);
            setIsLoading(false);
        }
        else {
            setIsLoading(false);
            Alert.showAlert(Constants.danger, response.errorMsg);
        }
    }


    const getAPIDetails = () => {
        // console.log("----------------oooooooo-------", actionSheetDecide)
        // console.log("-------------- formFieldsKeys.patient---------", formFields)
        switch (actionSheetDecide) {
            // case formFieldsKeys.company_types: {
            //     return companyTypeAS
            // }
            case formFieldsKeys.patient: {
                return patientListAS
            }
            case formFieldsKeys.employee: {
                return employeeAS
            }
            case formFieldsKeys.subCategory: {
                return subCategoryAS
            }
            case formFieldsKeys.category: {
                return categoryAS
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
            case formFieldsKeys.subCategory: {
                setSubCategoryAS(getActionSheetAPIDetail({ ...subCategoryAS, ...payload }))
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
                setImplementationPlanAS(getActionSheetAPIDetail({
                    ...ImplementationPlanAS, params: { patient_id: item?.id }, debugMsg: "ImplementationPlan", token: UserLogin.access_token,
                    selectedData: []
                }))
                break;
            }
            case formFieldsKeys.patient: {
                handleInputChange(formFieldsKeys.patient, item)
                break;
            }
            case formFieldsKeys.category: {
                handleInputChange(formFieldsKeys.category, item)
                setSubCategoryAS(getActionSheetAPIDetail({
                    url: Constants.apiEndPoints.categoryChildList, params: { parent_id: item?.id }, debugMsg: "sub-category", token: UserLogin.access_token,
                    selectedData: []
                }))

                // removeErrorTextForInputThatUserIsTyping(formFieldsKeys.category)
                break;
            }
            case formFieldsKeys.subCategory: {
                handleInputChange(formFieldsKeys.subCategory, item)
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

                    {/* patient */}
                    <InputValidation
                        optional={true}
                        // uniqueKey={formFieldsKeys.patient}
                        // validationObj={validationObj}
                        placeHolder={labels["patient"]}
                        value={formFields.patient?.name ?? ""}
                        iconRight='chevron-down'
                        iconColor={Colors.primary}
                        editable={false}
                        isIconTouchable={true}
                        onPress={() => {
                            // console.log("press")
                            setActionSheetDecide(formFieldsKeys.patient)
                            actionSheetRef.current?.setModalVisible()
                        }}
                        style={{ marginTop: Constants.formFieldTopMargin, }}
                        inputMainViewStyle={styles.InputValidationView}
                        inputStyle={styles.inputStyle}
                    />

                    {/* start date */}
                    <InputValidation
                        optional={true}
                        // uniqueKey={initialKeys.start_date}
                        // validationObj={validationForTimeAndRepetition}
                        iconRight='calendar'
                        iconColor={Colors.primary}
                        editable={false}
                        onPressIcon={() => {
                            // removeErrorTextForInputThatUserIsTyping(time_and_repetition, initialKeys.start_date)
                            setOpenDatePicker(true);
                            setMode(Constants.DatePickerModes.date_mode);
                            setDatePickerKey(initialKeys.start_date)
                        }}
                        value={formFields.start_date ? reverseFormatDate(formFields.start_date) : ''}
                        placeHolder={props.labels.startDate}
                        style={styles.InputValidationView}
                        inputStyle={styles.inputStyle}
                    />

                    {/* end date */}
                    {/* {formFields.start_date */}
                    <InputValidation
                        // uniqueKey={initialKeys.end_date}
                        // validationObj={validationForTimeAndRepetition}
                        iconRight='calendar'
                        iconColor={Colors.primary}
                        editable={false}
                        optional={true}
                        onPressIcon={() => {
                            // removeErrorTextForInputThatUserIsTyping(time_and_repetition, initialKeys.end_date)
                            setOpenDatePicker(true);
                            setMode(Constants.DatePickerModes.date_mode);
                            setDatePickerKey(initialKeys.end_date)
                        }}
                        value={formFields.end_date ? reverseFormatDate(formFields.end_date) : ''}
                        placeHolder={props.labels.endDate}
                        style={styles.InputValidationView}
                        inputStyle={styles.inputStyle}
                    />


                    {/* organization number */}
                    {/* title */}
                    <InputValidation
                        // uniqueKey={formFieldsKeys.title}
                        // validationObj={validationForActivityDetails}
                        value={formFields.title}
                        optional={true}
                        placeHolder={labels["title"]}
                        iconColor={Colors.primary}
                        onChangeText={(text) => {
                            // removeErrorTextForInputThatUserIsTyping(task_details, formFieldsKeys.title);
                            handleInputChange(formFieldsKeys.title, text)
                            // actionSheetRef.current?.setModalVisible()
                        }}
                        style={{ marginTop: Constants.formFieldTopMargin }}
                        inputMainViewStyle={styles.InputValidationView}
                        inputStyle={styles.inputStyle}
                    />

                    <InputValidation
                        optional={true}
                        uniqueKey={formFieldsKeys.status}
                        // validationObj={validationObj}
                        placeHolder={labels["status"]}
                        value={formFields?.status?.name ?? ""}
                        iconRight='chevron-down'
                        iconColor={Colors.primary}
                        editable={false}
                        // isIconTouchable={true}
                        onPress={() => {
                            // console.log("onpress")
                            // removeErrorTextForInputThatUserIsTyping(formFieldsKeys.status)
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
                        // validationObj={validationForActivityDetails}
                        placeHolder={labels['category']}
                        value={formFields.category?.name ?? ""}
                        iconRight='chevron-down'
                        iconColor={Colors.primary}
                        editable={false}
                        // optional={true}
                        onPressIcon={
                            formFields.implementation_plan?.title ? (
                                () => { Alert.showToast(labels.category_imported_from_ip, Constants.success) }
                            ) : (
                                () => {
                                    // removeErrorTextForInputThatUserIsTyping(activity_details, formFieldsKeys.category)
                                    setActionSheetDecide(formFieldsKeys.category)
                                    actionSheetRef.current?.setModalVisible()
                                }
                            )
                        }
                        style={{ marginTop: Constants.formFieldTopMargin, }}
                        inputMainViewStyle={styles.InputValidationView}
                        inputStyle={styles.inputStyle}
                    />

                    {/* subcategory */}
                    <InputValidation
                        // uniqueKey={formFieldsKeys.subCategory}
                        // validationObj={validationForActivityDetails}
                        placeHolder={labels['sub-category']}
                        // value={formFields.subcategory?.name ?? ""}
                        value={formFields.subCategory?.name ?? ""}
                        iconRight='chevron-down'
                        iconColor={Colors.primary}
                        optional={true}
                        editable={false}
                        onPressIcon={
                            formFields.implementation_plan?.title ? (
                                () => { Alert.showToast(labels.sub_category_imported_from_ip, Constants.success) }
                            ) : (() => {
                                // removeErrorTextForInputThatUserIsTyping(activity_details, formFieldsKeys.subcategory)
                                setActionSheetDecide(formFieldsKeys.subCategory)
                                actionSheetRef.current?.setModalVisible()
                            })
                        }
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

                    {/* //applyFilter */}

                    <CustomButton onPress={() => {
                        // console.log("formFields", JSON.stringify(formFields.patient))
                        props.setParam({
                            ...props.param,
                            company_types: formFields?.company_types ?? "",
                            name: formFields?.name ?? "",
                            email: formFields?.email ?? "",
                            contact_number: formFields?.contact_number ?? "",
                            personal_number: formFields?.personal_number ?? "",
                            // organization_number: formFields?.organization_number ?? "",
                            "patient_id": formFields.patient?.id ?? "",
                            employee: formFields.employee ?? "",
                            "status": formFields?.status ?? "",
                            "category_id": formFields.category?.id ?? "",
                            "subcategory_id": formFields.subCategory?.id ?? "",
                            "patient": formFields.patient?.id ?? "",
                            start_date: formFields?.start_date ? formatDateForAPI(formFields?.start_date) : "",
                            end_date: formFields?.end_date ? formatDateForAPI(formFields?.end_date) : "",
                            title: formFields?.title ?? "",
                            // "branch": formFields.branch ?? "",
                            // "ip": formFields?.implementation_plan ?? "",
                        })
                        props.onRequestClose()
                    }} isLoading={isLoading} title={labels.apply} style={{
                        width: "45%",
                        // marginBottom: 10
                        // margin: "4%",
                        // marginTop: 30,
                    }} />



                </View>
                {/* </View> */}
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
                minimumDate={mode == Constants.DatePickerModes.date_mode ? new Date() : null}
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
        backgroundColor: 'transparent', flex: 1, justifyContent: "center", alignItems: "center", paddingHorizontal: 16
    },
    innerView: { width: '98%', backgroundColor: Colors.backgroundColor, paddingVertical: 15, paddingHorizontal: 16, borderRadius: 20 },
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
        width: "100%", flexDirection: "row", justifyContent: "space-between",
        marginTop: 10
    },
    baar: {
        width: "45%",
        // marginBottom: 10
        // margin: "4%",
        // marginTop: 30,
    },
    checkBoxView: { flexDirection: 'row', alignItems: 'center', marginTop: 30, minWidth: "40%" },
    saveAsTemplate: { fontSize: getProportionalFontSize(13), fontFamily: Assets.fonts.regular }
})