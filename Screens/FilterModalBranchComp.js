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

import { getProportionalFontSize, CurruntDate, formatDateByFormat, getActionSheetAPIDetail, formatDate, formatTime, placeholderCreator, checkUrlFormat, checkFileSize, ReplaceAll } from '../Services/CommonMethods';
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

        company_type_id: "",
        name: "",
        email: "",
        contact_number: "",


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

    }

    //Hooks
    const actionSheetRef = React.useRef();
    // useState hooks
    const [actionSheetDecide, setActionSheetDecide] = React.useState('');


    const [companyTypeAS, setCompanyTypeAS] = React.useState(getActionSheetAPIDetail({
        url: Constants.apiEndPoints.companyTypeList, debugMsg: "companyTypeList", token: UserLogin.access_token, perPage: Constants.perPage,
        selectedData: formFields?.[formFieldsKeys?.company_type_id] ? formFields[formFieldsKeys.company_type_id] : []
    }));

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


    const [formFields, setFormFields] = React.useState({ ...initialValues });
    // console.log("ok mks --------", formFields)
    // const [formFieldsKeys, setFormFieldsKeyformFieldsKeys] = React.useState({ ...initialKeys });

    const [isLoading, setIsLoading] = React.useState(false);

    // Immutable Variables
    const formFieldsKeys = {
        // "company_types": "company_types", //
        company_type_id: "company_type_id",
        "name": "name",//
        "email": "email",//
        contact_number: 'contact_number'
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

        switch (actionSheetDecide) {
            // case formFieldsKeys.company_types:
            case formFieldsKeys.company_type_id: {
                return companyTypeAS
            }
            default: {
                return null
            }
        }
    }

    const changeAPIDetails = (payload) => {
        switch (actionSheetDecide) {
            case formFieldsKeys.company_type_id: {
                setCompanyTypeAS(getActionSheetAPIDetail({ ...companyTypeAS, ...payload }))
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

            case formFieldsKeys.company_type_id: {
                handleInputChange(formFieldsKeys?.company_type_id, item)
                removeErrorTextForInputThatUserIsTyping(formFieldsKeys?.company_type_id)
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
                    {/* name */}
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


                    {/* email*/}
                    <InputValidation
                        optional={true}
                        // uniqueKey={formFieldsKeys.email}
                        // validationObj={validationObj}
                        value={formFields[formFieldsKeys.email]}
                        placeHolder={labels.Email}
                        onChangeText={(text) => {
                            setActionSheetDecide(formFieldsKeys.email);
                            // removeErrorTextForInputThatUserIsTyping(formFieldsKeys.email);
                            handleInputChange(formFieldsKeys.email, text)
                        }}
                        style={{ marginTop: formFieldTopMargin }}
                        inputMainViewStyle={styles.InputValidationView}
                        inputStyle={styles.inputStyle}
                        keyboardType={"email-address"}
                    />

                    {/* contact_number */}
                    <InputValidation
                        maskedInput={true}
                        mask={Constants.phone_number_format}
                        uniqueKey={formFieldsKeys.contact_number}
                        validationObj={validationObj}
                        keyboardType={'number-pad'}
                        value={formFields?.contact_number ?? ''}
                        placeHolder={labels.contact_number}
                        onChangeText={text => {
                            removeErrorTextForInputThatUserIsTyping(formFieldsKeys.contact_number);
                            handleInputChange(formFieldsKeys.contact_number, text);
                        }}
                        style={styles.InputValidationView}
                        inputStyle={styles.inputStyle}
                        optional={true}
                    />


                    {/* company_types */}
                    <InputValidation
                        optional={true}
                        placeHolder={labels.company_types}
                        value={formFields.company_type_id?.name}
                        iconRight='chevron-down'
                        iconColor={Colors.primary}
                        editable={false}
                        onPress={() => {
                            removeErrorTextForInputThatUserIsTyping(formFieldsKeys.company_type_id)
                            setActionSheetDecide(formFieldsKeys.company_type_id)
                            actionSheetRef.current?.setModalVisible()
                        }}
                        style={{ marginTop: Constants.formFieldTopMargin, }}
                        inputMainViewStyle={styles.InputValidationView}
                        inputStyle={styles.inputStyle}
                    />


                </ScrollView>


                <View style={styles.bar}>
                    <CustomButton
                        onPress={() => {
                            setFormFields({ ...initialValues })
                            setCompanyTypeAS({ ...companyTypeAS, selectedData: [] })
                        }}
                        isLoading={isLoading}
                        title={labels.clear}
                        style={styles.baar}

                    />

                    <CustomButton onPress={() => {
                        // console.log("formFields", JSON.stringify(formFields.patient))
                        props.setParam({
                            ...props.param,
                            company_type_id: formFields?.company_type_id ?? "",
                            name: formFields?.name ?? "",
                            email: formFields?.email ?? "",
                            contact_number: formFields?.contact_number ? ReplaceAll(formFields?.contact_number.substring(1), " ", "") : "",
                        })
                        props.onRequestClose()
                    }} isLoading={isLoading} title={labels.apply} style={{
                        width: "45%",
                        margin: "4%",
                        marginTop: 30,
                    }} />


                </View>
                {/* </View> */}
            </View>


            {/* ActionSheet */}
            <ActionSheet ref={actionSheetRef}>
                <ActionSheetComp
                    title={actionSheetDecide == "company_type_id" ? labels['company_type'] : labels[actionSheetDecide]}
                    closeActionSheet={closeActionSheet}
                    keyToShowData={"name"}
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