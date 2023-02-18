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
import InputValidation from '../Components/InputValidation';
import { Checkbox } from 'react-native-paper';
import { RadioButton } from "react-native-paper";
import { useSelector, useDispatch } from 'react-redux';
import { getProportionalFontSize, CurruntDate, formatDateByFormat, getActionSheetAPIDetail, formatDate, formatTime, placeholderCreator, checkUrlFormat, checkFileSize, formatDateForAPI } from '../Services/CommonMethods';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import Assets from '../Assets/Assets';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';


const { width, height } = Dimensions.get('window');

const JournalFilter = (props) => {

    const labels = useSelector(state => state.Labels);
    const UserLogin = useSelector(state => state.User.UserLogin);

    const initialValues = {
        category: {},
        subCategory: {},
        branch: {},
        patient: {},
        date: "",
        is_secret: false,
        is_active: false,
        is_signed: false,
        activity: false
    }

    const initialKeys = {
        category: "category",
        subCategory: 'subCategory',
        branch: 'branch',
        patient: 'patient',
        date: "date",
        is_secret: 'is_secret',
        is_active: 'is_active',
        is_signed: 'is_signed',
        activity: "activity"
    }


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
    const [subCategoryAS, setSubCategoryAS] = React.useState(getActionSheetAPIDetail({}));

    const [patientListAS, setPatientListAS] = React.useState(getActionSheetAPIDetail({
        url: Constants.apiEndPoints.userList, params: { user_type_id: '6' }, debugMsg: "patientListAS", token: UserLogin.access_token,
        selectedData: [],
    }));

    const [branchAS, setBranchAS] = React.useState(getActionSheetAPIDetail({
        url: Constants.apiEndPoints.userList, debugMsg: "branchList", token: UserLogin.access_token,
        selectedData: [], params: { "user_type_id": "11" }
    }));


    const [formFields, setFormFields] = React.useState({ ...initialValues });
    const [formFieldsKeys, setFormFieldsKeyformFieldsKeys] = React.useState({ ...initialKeys });
    const [isLoading, setIsLoading] = React.useState(false);

    const initialValidationObj = {

    }

    const [validationObj, setValidationObj] = React.useState({ ...initialValidationObj });

    React.useEffect(() => {

    }, [])

    const getAPIDetails = () => {
        switch (actionSheetDecide) {
            case formFieldsKeys.patient: {
                return patientListAS
            }
            case formFieldsKeys.category: {
                return categoryAS
            }
            case formFieldsKeys.branch: {
                return branchAS
            }
            case formFieldsKeys.subCategory: {
                return subCategoryAS
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
            case formFieldsKeys.branch: {
                setBranchAS(getActionSheetAPIDetail({ ...branchAS, ...payload }))
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
                break;
            }
            case formFieldsKeys.category: {
                handleInputChange(formFieldsKeys.category, item)
                setSubCategoryAS(getActionSheetAPIDetail({
                    url: Constants.apiEndPoints.categoryChildList, params: { parent_id: item?.id }, debugMsg: "sub-category", token: UserLogin.access_token,
                    selectedData: []
                }))
                break;
            }

            case formFieldsKeys.branch: {
                handleInputChange(formFieldsKeys.branch, item)
                break;
            }
            case formFieldsKeys.subCategory: {
                handleInputChange(formFieldsKeys.subCategory, item)
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
    // const getdateFormate = (text) => {
    //     return text.sb(0, 10)
    // }
    return (
        <View style={styles.modalMainView}>
            <View style={styles.innerView}>
                {/* close icon */}
                <View style={{ flexDirection: "row", alignItems: "center", }}>
                    <Icon name='cancel' color={Colors.primary} size={30} onPress={props.onRequestClose} style={{ flex: 1 }} />
                    <Text style={{ flex: 2, fontFamily: Assets.fonts.bold, fontSize: getProportionalFontSize(15), color: Colors.primary }}>{labels["journal-filter"]}</Text>
                </View>

                <KeyboardAwareScrollView style={{ maxHeight: height * 0.6, }}>
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
                            setActionSheetDecide(formFieldsKeys.category)
                            actionSheetRef.current?.setModalVisible()
                        }}
                        style={{ marginTop: Constants.formFieldTopMargin, }}
                        inputMainViewStyle={styles.InputValidationView}
                        inputStyle={styles.inputStyle}
                    />

                    {/* sub category */}
                    <InputValidation
                        optional={true}
                        // uniqueKey={formFieldsKeys.category}
                        // validationObj={validationObj}
                        placeHolder={labels["subcategory"]}
                        value={formFields?.subCategory?.name ?? ""}
                        iconRight='chevron-down'
                        iconColor={Colors.primary}
                        editable={false}
                        isIconTouchable={true}
                        onPressIcon={() => {
                            setActionSheetDecide(formFieldsKeys.subCategory)
                            actionSheetRef.current?.setModalVisible()
                        }}
                        style={{ marginTop: Constants.formFieldTopMargin, }}
                        inputMainViewStyle={styles.InputValidationView}
                        inputStyle={styles.inputStyle}
                    />

                    {/* branch */}
                    {/* <InputValidation
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
                            setActionSheetDecide(formFieldsKeys.branch);
                            actionSheetRef.current?.setModalVisible()
                        }}
                        style={{ marginTop: Constants.formFieldTopMargin, }}
                        inputMainViewStyle={styles.InputValidationView}
                        inputStyle={styles.inputStyle}
                    /> */}

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

                    {/* date */}
                    <InputValidation
                        optional={true}
                        iconRight='calendar'
                        iconColor={Colors.primary}
                        editable={false}
                        isIconTouchable={true}
                        onPressIcon={() => {
                            setOpenDatePicker(true);
                            setMode(Constants.DatePickerModes.date_mode);
                            setDatePickerKey(formFieldsKeys.date)
                        }}
                        value={formFields.date ? formatDate(formFields.date) : ''}
                        placeHolder={labels["date"]}
                        style={styles.InputValidationView}
                        inputStyle={styles.inputStyle}
                    />

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
                        <Text style={styles.saveAsTemplate}>{labels.secret_journal}</Text>
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
                        <Text style={styles.normalText}>{labels["secret-journal"]}</Text>
                    </View>
                    {/* 
                    <View style={styles.checkBoxView}>
                        <BouncyCheckbox
                            size={20}
                            fillColor={Colors.primary}
                            unfillColor={Colors.white}
                            iconStyle={{ borderColor: Colors.primary }}
                            isChecked={formFields.is_active}
                            onPress={(value) => {
                                // handleInputChange( value, personFormKeys.other_name);
                                setFormFields({
                                    ...formFields,
                                    [formFieldsKeys.is_active]: value,
                                });
                            }}
                        />
                        <Text style={styles.saveAsTemplate}>{labels.active}</Text>
                    </View> */}

                    <View style={styles.checkBoxView}>
                        <Checkbox
                            color={Colors.primary}
                            status={formFields.is_active ? 'checked' : 'unchecked'}
                            onPress={() => {
                                setFormFields({
                                    ...formFields,
                                    [formFieldsKeys.is_active]: !formFields.is_active,
                                });
                            }}
                        />
                        <Text style={styles.normalText}>{labels["active"]}</Text>
                    </View>

                    {/* <View style={styles.checkBoxView}>
                        <BouncyCheckbox
                            size={20}
                            fillColor={Colors.primary}
                            unfillColor={Colors.white}
                            iconStyle={{ borderColor: Colors.primary }}
                            isChecked={formFields.is_signed}
                            onPress={(value) => {
                                // handleInputChange( value, personFormKeys.other_name);
                                setFormFields({
                                    ...formFields,
                                    [formFieldsKeys.is_signed]: value,
                                });
                            }}
                        />
                        <Text style={styles.saveAsTemplate}>{labels.signed}</Text>
                    </View> */}

                    <View style={styles.checkBoxView}>
                        <Checkbox
                            color={Colors.primary}
                            status={formFields.is_signed ? 'checked' : 'unchecked'}
                            onPress={() => {
                                setFormFields({
                                    ...formFields,
                                    [formFieldsKeys.is_signed]: !formFields.is_signed,
                                });
                            }}
                        />
                        <Text style={styles.normalText}>{labels["is-signed"]}</Text>
                    </View>

                    {/* <View style={styles.checkBoxView}>
                        <BouncyCheckbox
                            size={20}
                            fillColor={Colors.primary}
                            unfillColor={Colors.white}
                            iconStyle={{ borderColor: Colors.primary }}
                            isChecked={formFields.activity}
                            onPress={(value) => {
                                // handleInputChange( value, personFormKeys.other_name);
                                setFormFields({
                                    ...formFields,
                                    [formFieldsKeys.activity]: value,
                                });
                            }}
                        />
                        <Text style={styles.saveAsTemplate}>{labels.activity}</Text>
                    </View> */}

                    <View style={styles.checkBoxView}>
                        <Checkbox
                            color={Colors.primary}
                            status={formFields.activity ? 'checked' : 'unchecked'}
                            onPress={() => {
                                setFormFields({
                                    ...formFields,
                                    [formFieldsKeys.activity]: !formFields.activity,
                                });
                            }}
                        />
                        <Text style={styles.normalText}>{labels["Activity"]}</Text>
                    </View>
                </KeyboardAwareScrollView>

                {/* apply filter button */}
                <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
                    {/* reset button */}
                    <CustomButton
                        onPress={() => {
                            setFormFields({ ...initialValues })
                            setPatientListAS({ ...patientListAS, selectedData: [] })
                            setCategoryAS({ ...categoryAS, selectedData: [] })
                            setSubCategoryAS({ ...subCategoryAS, selectedData: [] })
                            setBranchAS({ ...branchAS, selectedData: [] })
                        }}
                        isLoading={isLoading}
                        title={labels["clear"]}
                        // title={props?.labels?.clear}
                        style={{ marginTop: 20, width: 150 }} />

                    <CustomButton onPress={() => {
                        // console.log("formFields", JSON.stringify(formFields.patient))
                        let params = {
                            // "activity_id": null,
                            "branch_id": formFields.branch?.id ?? null,
                            "patient_id": formFields.patient?.id ?? null,
                            "with_or_without_activity": formFields.activity ? 'yes' : 'no',
                            // "emp_id": null,
                            "category_id": formFields.category?.id ?? null,
                            "subcategory_id": formFields.subCategory?.id ?? null,
                            "data_of": formFields.date ? formatDateForAPI(formFields.date) : null,
                            "is_secret": formFields.is_secret ? 'yes' : 'no',
                            "is_signed": formFields.is_signed ? 'yes' : 'no',
                            "is_active": formFields.is_active ? 'yes' : 'no',
                        }
                        if (formFields.patient)
                            params['patientObj'] = formFields.patient
                        props.filterAPI(params)
                        props.onRequestClose()
                    }} isLoading={isLoading} title={labels["apply"]} style={{ marginTop: 20, width: 150 }} />


                </View>
            </View>
            <ActionSheet ref={actionSheetRef}>
                <ActionSheetComp
                    title={labels[actionSheetDecide]}
                    closeActionSheet={closeActionSheet}
                    keyToShowData={"name"}
                    keyToCompareData="id"

                    // multiSelect
                    APIDetails={getAPIDetails()}
                    changeAPIDetails={(payload) => changeAPIDetails(payload)}
                    onPressItem={(item) => onPressItem(item)}
                />
            </ActionSheet>

            <DatePicker
                modal
                mode={mode}
                open={openDatePicker}
                minimumDate={mode == Constants.DatePickerModes.date_mode ? new Date() : null}
                date={new Date()}
                onConfirm={date => {
                    setOpenDatePicker(false);
                    if (mode == Constants.DatePickerModes.date_mode)
                        handleInputChange(datePickerKey, date);
                    else if (mode == Constants.DatePickerModes.time_mode)
                        handleInputChange(datePickerKey, date);
                    else handleInputChange(datePickerKey, date);
                }}
                onCancel={() => {
                    setOpenDatePicker(false);
                }}
            />
        </View >
    )
}





export default JournalFilter

const styles = StyleSheet.create({
    normalText: {
        fontSize: getProportionalFontSize(15),
        fontFamily: Assets.fonts.regular,
    },
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
    checkBoxView: { flexDirection: 'row', alignItems: 'center', marginTop: 10, minWidth: "40%" },
    saveAsTemplate: { fontSize: getProportionalFontSize(13), fontFamily: Assets.fonts.regular }
})