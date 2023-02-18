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

import { getProportionalFontSize, CurruntDate, formatDateByFormat, getActionSheetAPIDetail, formatDate, formatTime, placeholderCreator, checkUrlFormat, checkFileSize, reverseFormatDate, formatDateForAPI } from '../Services/CommonMethods';
import BouncyCheckbox from 'react-native-bouncy-checkbox';

const { width, height } = Dimensions.get('window');

const FilterModalDeviationComp = (props) => {
    const withActivityData = [
        {
            id: 1,
            name: "Yes"
        },
        {
            id: 0,
            name: "No"
        },

    ]
    const { labels, onRequestClose, UserLogin } = props;
    const initialValues = {
        patient: "",
        // category: "",
        // subcategory: "",
        category: {},
        subcategory: {},
        branch: "",
        withActivity: "",
        "start_date": "",
        "end_date": "",
        is_completed: false,
        is_secret: false,
    }
    const initialKeys = {
        patient: "patient",
        category: "category",
        subcategory: "subcategory",
        branch: "branch",
        withActivity: "withActivity",
        start_date: "start_date",
        end_date: "end_date",
        is_secret: "is_secret",
        is_completed: "is_completed"
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
        // url: Constants.apiEndPoints.categoryParentList, params: { category_type_id: '4' }, debugMsg: "categoryAS", token: UserLogin.access_token,
        // selectedData: [],
        url: Constants.apiEndPoints.categoryParentList, debugMsg: "categoryAS", token: UserLogin.access_token,
        selectedData: [], params: { category_type_id: '4' }
    }));

    const [subCategoryAS, setSubCategoryAS] = React.useState(getActionSheetAPIDetail({}));

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

    const [withActivityAS, setWithActivityAS] = React.useState(getActionSheetAPIDetail({
        url: '', data: withActivityData,
        selectedData: []
    }));
    // const [validationObj, setValidationObj] = React.useState({ ...initialValidationObj });
    const [formFields, setFormFields] = React.useState({ ...initialValues });
    // console.log("ok mks --------", formFields)
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
        [formFieldsKeys.withActivity]: {
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
        setFormFields({ ...formFields, ...props.param })
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
            case formFieldsKeys.subcategory: {
                return subCategoryAS;
            }
            case formFieldsKeys.implementation_plan: {
                return ImplementationPlanAS
            }
            case formFieldsKeys.branch: {
                return branchAS
            }
            case formFieldsKeys.withActivity: {
                return withActivityAS
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
            case formFieldsKeys.subcategory: {
                setSubCategoryAS(getActionSheetAPIDetail({ ...subCategoryAS, ...payload }));
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
                setWithActivityAS(getActionSheetAPIDetail({
                    url: '', data: withActivityData,
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
                setFormFields({ ...formFields, [formFieldsKeys.category]: item, [formFieldsKeys.subcategory]: {} })
                // handleInputChange(formFieldsKeys.category, item);
                // removeErrorTextForInputThatUserIsTyping(formFieldsKeys.category);
                setSubCategoryAS(getActionSheetAPIDetail({
                    url: Constants.apiEndPoints.categoryChildList, params: { parent_id: item?.id }, debugMsg: "sub-category", token: UserLogin.access_token,
                    selectedData: []
                }))
                break;
            }

            case formFieldsKeys.subcategory: {
                handleInputChange(formFieldsKeys.subcategory, item)

                // removeErrorTextForInputThatUserIsTyping(formFieldsKeys.subcategory)

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
            case formFieldsKeys.withActivity: {
                handleInputChange(formFieldsKeys.withActivity, item)
                removeErrorTextForInputThatUserIsTyping(formFieldsKeys.withActivity)
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
    // const getdateFormate = (text) => {
    //     return text.sb(0, 10)
    // }
    return (
        <View style={styles.modalMainView}>
            <View style={styles.innerView}>
                {/* close icon */}
                <Icon name='cancel' color={Colors.primary} size={30} onPress={props.onRequestClose} />
                <ScrollView showsVerticalScrollIndicator={false} style={{ maxHeight: height * 0.7, }}>


                    {/* category */}
                    <InputValidation
                        optional={true}
                        // uniqueKey={formFieldsKeys.category}
                        // validationObj={validationObj}
                        placeHolder={labels.category}
                        // value={formFields?.category?.name ?? ""}
                        value={formFields?.[formFieldsKeys.category]?.name ?? ""}
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

                    {/* subcategory */}
                    <InputValidation
                        optional={true}
                        // uniqueKey={formFieldsKeys.subcategory}
                        // validationObj={validationObjForCategoryAndSubCategory}
                        value={formFields.subcategory?.name ?? ""}
                        placeHolder={labels.subcategory}
                        iconRight='chevron-down'
                        iconColor={Colors.primary}
                        editable={false}
                        onPressIcon={() => {
                            setActionSheetDecide(formFieldsKeys.subcategory);
                            // removeErrorTextForInputThatUserIsTyping(catSubCat, formFieldsKeys.subcategory);
                            actionSheetRef.current?.setModalVisible();

                            // setActionSheetDecide(ipFormKeys.subcategory);
                            // removeErrorTextForInputThatUserIsTyping(catSubCat, ipFormKeys.subcategory);
                            // actionSheetRef.current?.setModalVisible();
                        }}
                        style={styles.InputValidationView}
                        inputStyle={styles.inputStyle}
                    />

                    {/* branch */}
                    <InputValidation
                        // uniqueKey={empFormKeys.branch}
                        // validationObj={validationObj}
                        placeHolder={labels.branch}
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

                    {/* patient */}
                    <InputValidation
                        optional={true}
                        uniqueKey={formFieldsKeys.patient}
                        validationObj={validationObj}
                        placeHolder={labels.patient}
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

                    {/* With Activity */}
                    <InputValidation
                        optional={true}
                        // uniqueKey={formFieldsKeys.status}
                        // validationObj={validationObj}
                        placeHolder={labels.with_or_without_activity}
                        value={formFields?.withActivity?.name ?? ""}
                        iconRight='chevron-down'
                        iconColor={Colors.primary}
                        editable={false}
                        // isIconTouchable={true}
                        onPress={() => {
                            // console.log("onpress")
                            removeErrorTextForInputThatUserIsTyping(formFieldsKeys.withActivity)
                            setActionSheetDecide(formFieldsKeys.withActivity)
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
                        {/* <View style={styles.checkBoxView}>
                            <BouncyCheckbox
                                size={20}
                                fillColor={Colors.primary}
                                unfillColor={Colors.white}
                                iconStyle={{ borderColor: Colors.primary }}
                                isChecked={formFields.is_secret}
                                onPress={(value) => {
                                    // handleInputChange( value, personFormKeys.other_name);
                                    setFormFields({
                                        ...formFields,
                                        [formFieldsKeys.is_secret]: value,
                                    });
                                }}
                            />
                            <Text style={styles.saveAsTemplate}>{labels.is_secret}</Text>
                        </View> */}

                        <View style={styles.checkBoxView}>
                            <Checkbox
                                color={Colors.primary}
                                status={formFields.is_secret ? 'checked' : 'unchecked'}
                                onPress={() => {
                                    setFormFields({
                                        ...formFields,
                                        [formFieldsKeys.is_secret]: !formFields.is_secret,
                                    });
                                }}
                            />
                            <Text style={styles.normalText}>{labels["is_secret"]}</Text>
                        </View>
                        {/* <View style={styles.checkBoxView}>
                            <BouncyCheckbox
                                size={20}
                                fillColor={Colors.primary}
                                unfillColor={Colors.white}
                                iconStyle={{ borderColor: Colors.primary }}
                                isChecked={formFields.is_completed}
                                onPress={(value) => {
                                    // handleInputChange( value, personFormKeys.other_name);
                                    setFormFields({
                                        ...formFields,
                                        [formFieldsKeys.is_completed]: value,
                                    });
                                }}
                            />
                            <Text style={styles.saveAsTemplate}>{labels.is_completed}</Text>
                        </View> */}

                        <View style={styles.checkBoxView}>
                            <Checkbox
                                color={Colors.primary}
                                status={formFields.is_completed ? 'checked' : 'unchecked'}
                                onPress={() => {
                                    setFormFields({
                                        ...formFields,
                                        [formFieldsKeys.is_completed]: !formFields.is_completed,
                                    });
                                }}
                            />
                            <Text style={styles.normalText}>{labels["is_completed"]}</Text>
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
                        value={formFields.start_date ? formatDate(formFields?.start_date) : null}
                        placeHolder={labels.startDate}
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
                            placeHolder={labels.endDate}
                            style={styles.InputValidationView}
                            inputStyle={styles.inputStyle}
                        /> : null}
                </ScrollView>

                {/* save button */}
                <View style={{ flexDirection: "row", width: Dimensions.get("window").width - Constants.globalPaddingHorizontal * 4, justifyContent: "space-between" }}>
                    <CustomButton
                        onPress={() => {
                            setFormFields({ ...initialValues })
                            setCategoryAS({ ...categoryAS, selectedData: [] })
                            setSubCategoryAS({ ...subCategoryAS, selectedData: [] })
                            setBranchAS({ ...branchAS, selectedData: [] })
                            setPatientListAS({ ...patientListAS, selectedData: [] })
                            setWithActivityAS({ ...withActivityAS, selectedData: [] })
                        }}
                        isLoading={isLoading}
                        title={props?.labels?.clear}
                        style={{ marginTop: 10, width: "35%", backgroundColor: Colors.primary, borderWidth: 2, borderColor: Colors.primary }}
                        titleStyle={{ color: Colors.white }}
                    />

                    <CustomButton onPress={() => {
                        // console.log("formFields", JSON.stringify(formFields.patient))
                        props.setParam({
                            ...props.param,
                            "with_or_without_activity": formFields?.withActivity?.name ?? null,
                            "refreshAPI": true,
                            "category_id": formFields?.category?.id ?? null,
                            "subcategory_id": formFields?.subcategory?.id ?? null,
                            "patient_id": formFields?.patient?.id ?? null,
                            "branch_id": formFields?.branch?.id ?? null,
                            // "from_date": reverseFormatDate(formFields?.start_date ?? null )  ,
                            "from_date": formFields?.start_date ? formatDateForAPI(formFields?.start_date) : "",
                            "end_date": formFields?.end_date ? formatDateForAPI(formFields?.end_date) : "",
                            // title: formFields?.title ??null,
                            is_secret: formFields?.is_secret ?? false,
                            is_completed: formFields?.is_completed ?? false,
                        })
                        props.onRequestClose()
                    }} isLoading={isLoading} title={props?.labels?.apply} style={{ marginTop: 10, width: "35%", }} />

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
                minimumDate={mode == Constants.DatePickerModes.date_mode ? new Date() : null}
                date={new Date()}
                onConfirm={(date) => {
                    setOpenDatePicker(false)
                    // console.log('date : ', date)
                    let value = '';
                    if (mode == "start_date")
                        handleInputChange(formFieldsKeys.start_date, reverseFormatDate(date),)
                    else if (mode == "end_date")
                        handleInputChange(formFieldsKeys.end_date, reverseFormatDate(date),)
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





export default FilterModalDeviationComp
const styles = StyleSheet.create({
    modalMainView: {
        backgroundColor: 'transparent', flex: 1, justifyContent: "center", alignItems: "center", paddingHorizontal: 16
    },
    innerView: { width: '100%', minHeight: 300, backgroundColor: Colors.backgroundColor, paddingVertical: 15, paddingHorizontal: 16, borderRadius: 20 },
    inputStyle: {
        fontSize: getProportionalFontSize(16),
        borderColor: Colors.borderColor,
        backgroundColor: Colors.white,
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
    checkBoxView: { flexDirection: 'row', alignItems: 'center', marginTop: 15, minWidth: "40%" },
    saveAsTemplate: { fontSize: getProportionalFontSize(13), fontFamily: Assets.fonts.regular }
})