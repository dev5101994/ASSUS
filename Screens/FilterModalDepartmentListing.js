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

import { getProportionalFontSize, CurruntDate, formatDateByFormat, getActionSheetAPIDetail, formatDate, formatTime, placeholderCreator, checkUrlFormat, checkFileSize } from '../Services/CommonMethods';
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
    // console.log("bbbbbbbbbbbbbbbbbbbbbbbbb", JSON.stringify(props))
    // console.log('----------------------ok', JSON.stringify(response));
    const { labels, onRequestClose, UserLogin } = props;
    const initialValues = {

        name: "",

    }
    // const [formFieldsKeys, setFormFieldsKeyformFieldsKeys] = React.useState({ ...initialKeys });




    //Hooks
    const actionSheetRef = React.useRef();
    // useState hooks
    const [actionSheetDecide, setActionSheetDecide] = React.useState('');
    const [isEditable, setIsEditable] = React.useState(false);


    const [companyTypeAS, setCompanyTypeAS] = React.useState(getActionSheetAPIDetail({
        url: Constants.apiEndPoints.companyTypeList, debugMsg: "companyTypeList", token: UserLogin.access_token, perPage: Constants.perPage,
        selectedData: formFields?.[formFieldsKeys?.company_types] ? formFields[formFieldsKeys.company_types] : []
    }));

    //   const [formFields, setFormFields] = React.useState({ ...initialValues });

    const [openDatePicker, setOpenDatePicker] = React.useState(false);
    const [mode, setMode] = React.useState(Constants.DatePickerModes.date_mode);
    const [datePickerKey, setDatePickerKey] = React.useState(null);
    const [categoryAS, setCategoryAS] = React.useState(getActionSheetAPIDetail({
        url: Constants.apiEndPoints.categoryParentList, debugMsg: "categoryAS", token: UserLogin.access_token,
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

    // const [statusAS, setStatusAS] = React.useState(getActionSheetAPIDetail({
    //     url: '', data: statusData,
    //     selectedData: []
    // }));
    // const [validationObj, setValidationObj] = React.useState({ ...initialValidationObj });
    const [formFields, setFormFields] = React.useState({ ...initialValues });
    // console.log("ok mks --------", formFields)
    // const [formFieldsKeys, setFormFieldsKeyformFieldsKeys] = React.useState({ ...initialKeys });

    const [isLoading, setIsLoading] = React.useState(false);
    // Immutable Variables
    const formFieldsKeys = {
        // "company_types": "company_types", //
        "name": "name",//
        // "email": "email",//
        // "password": "password",//
        // "confirm-password": "confirm-password",//
        // "contact_number": "contact_number",//
        // "organization_number": "organization_number",//
        // "country_id": "country_id",//
        // "city": "city",//
        // "postal_area": "postal_area",//
        // "zipcode": "zipcode",//
        // "full_address": "full_address",//
        // "license_key": "license_key",
        // "license_end_date": "license_end_date",
        // "is_substitute": "is_substitute",
        // "is_regular": "is_regular",
        // "is_seasonal": "is_seasonal",
        // "joining_date": "joining_date",
        // "establishment_date": "establishment_date",//
        // "user_color": "user_color",
        // "is_file_required": "is_file_required",
        // "documents": "documents",
        // "attachment": "attachment",
        // "establishment_year": "establishment_year",
        // personal_number: 'personal_number',
        // email: 'email',

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
        // [formFieldsKeys.patient]: {
        //     invalid: false,
        //     title: '1'
        // },
        // [formFieldsKeys.category]: {
        //     invalid: false,
        //     title: '2'
        // },
        // [formFieldsKeys.implementation_plan]: {
        //     invalid: false,
        //     title: '3'
        // },
        // [formFieldsKeys.status]: {
        //     invalid: false,
        //     title: '3'
        // },
        // [formFieldsKeys.start_date]: {
        //     invalid: false,
        //     title: '4'
        // },
        // [formFieldsKeys.end_date]: {
        //     invalid: false,
        //     title: '5'
        // },
    }
    const [validationObj, setValidationObj] = React.useState({ ...initialValidationObj });
    React.useEffect(() => {
        setFormFields({ ...formFields, ...props.param })
        // setStatusAS({ ...statusAS, selectedData: [props.param.status] })
        // setCategoryAS({ ...categoryAS, selectedData: [props.param.category] })
    }, [])
    // if (props.param) {

    //     () => {

    //     }

    // }


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
            case formFieldsKeys.company_types: {
                return companyTypeAS
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

            // case formFieldsKeys.name: {
            //     setCategoryAS(getActionSheetAPIDetail({ ...name, ...payload }))
            //     break;
            // }


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
            // company_types: formFields?.company_types,
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
            // case formFieldsKeys.category: {
            //     handleInputChange(formFieldsKeys.category, item)
            //     removeErrorTextForInputThatUserIsTyping(formFieldsKeys.category)
            //     break;
            // }

            case formFieldsKeys.company_types: {
                handleInputChange(formFieldsKeys?.company_types, item)
                removeErrorTextForInputThatUserIsTyping(formFieldsKeys?.company_types)
                break;
            }

            // case formFieldsKeys.implementation_plan: {
            //     handleInputChange(formFieldsKeys.implementation_plan, item)
            //     removeErrorTextForInputThatUserIsTyping(formFieldsKeys.implementation_plan)
            //     break;
            // }
            // case formFieldsKeys.branch: {
            //     handleInputChange(formFieldsKeys.branch, item)
            //     removeErrorTextForInputThatUserIsTyping(formFieldsKeys.branch)
            //     break;
            // }
            // case formFieldsKeys.status: {
            //     handleInputChange(formFieldsKeys.status, item)
            //     removeErrorTextForInputThatUserIsTyping(formFieldsKeys.status)
            //     break;
            // }
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
    // const getdateFormate = (text) => {
    //     return text.sb(0, 10)
    // }

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
                        value={formFields.name}
                        placeHolder={labels.name}
                        // placeHolder={"NAME"}

                        iconColor={Colors.primary}
                        onChangeText={(text) => {
                            // removeErrorTextForInputThatUserIsTyping(task_details, formFieldsKeys.title);
                            handleInputChange(formFieldsKeys.name, text)
                        }}
                        style={{ marginTop: Constants.formFieldTopMargin }}
                        inputMainViewStyle={styles.InputValidationView}
                        inputStyle={styles.inputStyle}
                    />




                    {/* BouncyCheckbox */}
                    <View style={styles.checkBoxView}>
                        <BouncyCheckbox
                            size={20}
                            fillColor={Colors.primary}
                            unfillColor={Colors.white}
                            iconStyle={{ borderColor: Colors.primary }}
                            isChecked={formFields.journals}
                            onPress={(value) => {
                                // handleInputChange( value, personFormKeys.other_name);
                                setFormFields({
                                    ...formFields,
                                    [formFieldsKeys.journals]: value,
                                });
                            }}
                        />
                        <Text style={styles.saveAsTemplate}>{labels.Department_Status}</Text>
                    </View>




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
                            placeHolder={labels.endDate}
                            style={styles.InputValidationView}
                            inputStyle={styles.inputStyle}
                        /> : null}
                </ScrollView>





                {/* save button */}
                {/* <View style={{ width: "100%", flexDirection: "row", justifyContent: "center" }}> */}

                <View style={styles.bar}>
                    {/* <CustomButton onPress={() => {
                        console.log("formFields", JSON.stringify(formFields.patient))
                        props.setParam({
                            "status": formFields?.status ?? "",
                            "category": formFields?.category ?? "",
                            "ip": formFields?.implementation_plan ?? "",
                            "patient": formFields?.patient ?? "",
                            "branch": formFields?.branch ?? "",
                            "start_date": formFields?.start_date ?? "",
                            "end_date": formFields?.end_date ?? "",
                            title: formFields?.title ?? "",
                            journals: formFields?.journals ?? false,
                            deviation: formFields?.deviation ?? false,
                            "refreshAPI": true,
                        })
                        props.onRequestClose()
                    }} isLoading={isLoading}
                        // title={props?.labels?.applyFilter}
                        // style={{ marginTop: 10, minWidth: 290 }}
                        // style={{ width: "40%", }}
                        // placeHolder={labels.organization_number}
                        // title={props?.labels?.reset}
                        title={labels.clear}
                        style={styles.baar}
                    /> */}

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
                        // console.log("formFields--", JSON.stringify(formFields))
                        props.setParam({
                            // company_types: formFields?.company_types ?? "",
                            name: formFields?.name ?? "",


                            // email: formFields?.email ?? "",
                            // contact_number: formFields?.contact_number ?? "",
                            // personal_number: formFields?.personal_number ?? "",
                            // organization_number: formFields?.organization_number ?? "",

                            // "status": formFields?.status ?? "",
                            // "category": formFields?.category ?? "",
                            // "ip": formFields?.implementation_plan ?? "",
                            // "patient": formFields?.patient ?? "",
                            // "branch": formFields?.branch ?? "",
                            // "start_date": formFields?.start_date ?? "",
                            // "end_date": formFields?.end_date ?? "",
                            // title: formFields?.title ?? "",
                            // journals: formFields?.journals ?? false,
                            // deviation: formFields?.deviation ?? false,
                            "refreshAPI": true,
                            // title={labels.apply}
                        })
                        props.onRequestClose()
                    }} isLoading={isLoading} title={labels.apply} style={{
                        width: "45%",
                        // marginBottom: 10
                        margin: "4%",
                        marginTop: 30,
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