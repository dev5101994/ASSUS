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

import { getProportionalFontSize, CurruntDate, formatDateByFormat, getActionSheetAPIDetail, formatDate, formatTime, placeholderCreator, checkUrlFormat, checkFileSize, reverseFormatDate } from '../Services/CommonMethods';
import BouncyCheckbox from 'react-native-bouncy-checkbox';

const { width, height } = Dimensions.get('window');
const formFieldTopMargin = Constants.formFieldTopMargin;



const FilterModalComp = (props) => {

    const { labels, onRequestClose, UserLogin } = props;
    const initialValues = {
        category: {},
        // subCategory: {},

        categoryName: "",
        name: "",
        // categoryType: "",
        // "name": "categoryName",

        category_type_id: "",
        status: ""
    }

    //Hooks
    const actionSheetRef = React.useRef();
    // useState hooks
    const [actionSheetDecide, setActionSheetDecide] = React.useState('');
    const [categoryType, setCategoryType] = React.useState(props.categoryItem?.category_type ?? null);
    const [categoryName, setCategoryName] = React.useState(props.categoryItem?.name ?? '');
    const [categoryAS, setCategoryAS] = React.useState(getActionSheetAPIDetail({
        url: Constants.apiEndPoints.categoryParentList, params: { "category_type_id": "2", }, debugMsg: "categoryAS", token: UserLogin.access_token,
        selectedData: [],
    }));
    const [formFields, setFormFields] = React.useState({ ...initialValues });
    const [isLoading, setIsLoading] = React.useState(false);

    // Immutable Variables
    const formFieldsKeys = {

        "name": "name",//
        "status": "status",
        "category": "category",
        "categoryName": "categoryName"
    }

    const initialValidationObj = {

    }

    const [validationObj, setValidationObj] = React.useState({ ...initialValidationObj });

    React.useEffect(() => {
        setFormFields({ ...formFields, ...props.param })

    }, [])

    const getAPIDetails = () => {
        // console.log("----------------oooooooo-------", actionSheetDecide)
        // console.log("-------------- formFieldsKeys.patient---------", formFields)
        switch (actionSheetDecide) {


            case formFieldsKeys.category: {
                return categoryAS
            }



            default: {
                return null
            }
        }
    }

    const changeAPIDetails = (payload) => {
        switch (actionSheetDecide) {

            case formFieldsKeys.category: {
                setCategoryAS(getActionSheetAPIDetail({ ...categoryAS, ...payload }))
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

            // case formFields.categoryName: {
            //     handleInputChange(formFieldsKeys.categoryName, item)
            //     break;
            // }
            case formFields.name: {
                handleInputChange(formFieldsKeys.name, item)
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

                    {/* category */}
                    <InputValidation
                        optional={true}
                        uniqueKey={formFieldsKeys.category}
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

                    {/* category name input */}
                    <InputValidation
                        optional={true}
                        // uniqueKey='categoryName'
                        // validationObj={validationObj}
                        value={formFields.categoryName}
                        placeHolder={props.labels.category_name}
                        iconColor={Colors.primary}
                        onChangeText={(text) => {
                            // removeErrorTextForInputThatUserIsTyping('categoryName');
                            handleInputChange(formFieldsKeys.categoryName, text)
                            // setCategoryName(text)
                        }}
                        style={styles.mainInputStyle}
                        inputStyle={styles.inputStyle}
                    />

                </ScrollView>

                {/* save button */}
                {/* <View style={{ width: "100%", flexDirection: "row", justifyContent: "center" }}> */}
                <View style={styles.bar}>
                    <CustomButton
                        onPress={() => {
                            setCategoryAS({ ...categoryAS, selectedData: [] })
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
                        props.setParam({
                            ...props.param,
                            // company_types: formFields?.company_types ?? "",
                            name: formFields?.name ?? "",
                            // "category_type_id": categoryType?.id ?? null,
                            "category_id": formFields.category?.id ?? "",
                            // "name": categoryName,

                            "status": formFields?.status ?? "",
                            // "category_id": formFields.category?.id ?? "",

                            // "category_id": formFields.category_id.id ?? "",
                            "categoryName": formFields?.categoryName ?? "",
                            // "parent_id": category?.id ?? null,
                            // "status": statusCheckBox ? 1 : 0,
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