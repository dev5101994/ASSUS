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
import { useSelector, useDispatch } from 'react-redux';


import { getProportionalFontSize, CurruntDate, formatDateByFormat, getActionSheetAPIDetail, formatDate, formatTime, placeholderCreator, checkUrlFormat, checkFileSize, ReplaceAll } from '../Services/CommonMethods';
import BouncyCheckbox from 'react-native-bouncy-checkbox';

const { width, height } = Dimensions.get('window');
const formFieldTopMargin = Constants.formFieldTopMargin;





const FilterModalComp = (props) => {


    const { labels, onRequestClose, } = props;
    const initialValues = {

        name: "",
        email: "",
        contact_number: "",
        personal_number: '',


    }


    // REDUX hooks
    // const labels = useSelector(state => state.Labels.addPatient);
    const UserLogin = useSelector(state => state.User.UserLogin);
    const messages = useSelector(state => state.Labels.messages);
    // const patient_type_labels = useSelector(state => state.Labels.patient_type);
    const permissions = UserLogin?.permissions ?? {};



    //Hooks
    const actionSheetRef = React.useRef();
    // useState hooks
    const [actionSheetDecide, setActionSheetDecide] = React.useState('');
    const patient_type_labels = useSelector(state => state.Labels.patient_type);
    // const UserLogin = useSelector(state => state.User.UserLogin);
    // const [initialValues, setPatientFormValues] =
    //     React.useState(patientInitialValues);








    const [patientTypeAS, setPatientTypeAS] = React.useState(
        getActionSheetAPIDetail({
            url: Constants.apiEndPoints.patientTypes,
            debugMsg: 'patientType',
            token: UserLogin.access_token,
            selectedData: [],
        }),
    );



    const [formFields, setFormFields] = React.useState({ ...initialValues });
    // console.log("ok mks --------", formFields)
    // const [formFieldsKeys, setFormFieldsKeyformFieldsKeys] = React.useState({ ...initialKeys });

    const [isLoading, setIsLoading] = React.useState(false);

    // Immutable Variables
    const formFieldsKeys = {
        "company_types": "company_types", //
        "name": "name",//
        "email": "email",//

        "contact_number": "contact_number",//

        personal_number: 'personal_number',
        patient_type: 'patient_type',
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
            // title: labels.organization_number_required
        },

        [formFieldsKeys.category]: {
            invalid: false,
            title: '2'
        },

    }
    // const [validationObj, setValidationObj] = React.useState({ ...initialValidationObj });
    React.useEffect(() => {
        setFormFields({ ...formFields, ...props.param })

    }, [])

    const getBranchDetails = async (itemId) => {
        setIsLoading(true);

        let url = Constants.apiEndPoints.userView + "/" + itemId;
        // console.log("url", url);
        // let response = await APIService.getData(url, UserLogin.access_token, null, "BranchAPI");
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
            // setCompanyTypeAS({ ...companyTypeAS, selectedData: [response.data.payload.company_types] })
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

            default: {
                return null
            }
        }
    }


    const handleInputChange = (key, value) => {
        setFormFields({
            ...formFields,
            patient_type: formFields?.patient_type,
            [key]: value,
        });
    };




    const onPressItem = (item) => {
        // console.log('--DGFG--------------------ok',);

        switch (actionSheetDecide) {


            case formFieldsKeys.patient_type: {
                // console.log('----------------------FFFFFFFF', JSON.stringify(response));
                // console.log('----------------------ok',);


                setFormFields({
                    ...formFields,
                    [formFieldsKeys.patient_type]: item,

                });

                break;
            }
            default: {
                break;
            }
        }
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
                    {/* Name */}
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

                    {/* email */}
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

                    {/* contact number */}
                    <InputValidation
                        optional={true}
                        maskedInput={true}
                        mask={Constants.phone_number_format}
                        // uniqueKey={formFieldsKeys.contact_number}
                        // validationObj={validationObj}
                        keyboardType={'number-pad'}
                        value={'' + formFields.contact_number}
                        placeHolder={labels.contact_number}
                        onChangeText={text => {
                            // removeErrorTextForInputThatUserIsTyping(
                            //     formFieldsKeys.contact_number,
                            // );
                            handleInputChange(formFieldsKeys.contact_number, text,);
                        }}
                        style={styles.InputValidationView}
                        inputStyle={styles.inputStyle}
                    />

                    {/* personal_number */}
                    <InputValidation
                        optional={true}
                        maskedInput={true}
                        mask={Constants.personal_number_format}
                        // uniqueKey={formFieldsKeys.personal_number}
                        // validationObj={validationObj}
                        keyboardType={'number-pad'}
                        value={'' + formFields.personal_number}
                        // value={'' + formFields.personal_number}
                        placeHolder={labels.personal_number}
                        onChangeText={text => {
                            // removeErrorTextForInputThatUserIsTyping(formFieldsKeys.personal_number);
                            // handleInputChange(text, formFieldsKeys.personal_number);
                            handleInputChange(formFieldsKeys.personal_number, text,);
                        }}
                        style={styles.InputValidationView}
                        inputStyle={styles.inputStyle}
                    />


                </ScrollView>





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
                        // console.log("formFields", JSON.stringify(formFields.patient))
                        let peronal_number = ""
                        if (formFields?.personal_number) {
                            peronal_number = ReplaceAll(formFields?.personal_number, " ", "")
                            peronal_number = ReplaceAll(peronal_number, "-", "")
                        }
                        props.setParam({
                            ...props.param,
                            // patient_type: formFields?.patient_type ?? "",
                            name: formFields?.name ?? "",
                            email: formFields?.email ?? "",
                            contact_number: formFields?.contact_number ? ReplaceAll(formFields?.contact_number.substring(1), " ", "") : "",
                            personal_number: peronal_number,
                            // organization_number: formFields?.organization_number ?? "",
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
                    keyToShowData={actionSheetDecide == formFieldsKeys.patient_type ? "designation" : "name"}
                    keyToCompareData="id"

                    // multiSelect
                    // multiSelect={isMultiSelect()}
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