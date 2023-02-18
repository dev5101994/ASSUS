import React from 'react';
import {
    StyleSheet,
    Text, View, SafeAreaView, Image, TouchableOpacity, ScrollView
} from 'react-native';
import Colors from '../Constants/Colors';
import Assets from '../Assets/Assets'
import { getProportionalFontSize, checkEmailFormat, formatDateWithTime, formatDate, formatTime, checkMobileNumberFormat, ReplaceAll, getActionSheetAPIDetail, formatDateByFormat, CreateLicenseKey } from '../Services/CommonMethods';
import InputValidation from '../Components/InputValidation';
import APIService from '../Services/APIService'
import Constants from '../Constants/Constants'
import ProgressLoader from '../Components/ProgressLoader'
import { useSelector, useDispatch } from 'react-redux'
import BaseContainer from '../Components/BaseContainer'
import CustomButton from '../Components/CustomButton'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import DatePicker from 'react-native-date-picker';
import Alert from '../Components/Alert';
import ActionSheet from 'react-native-actions-sheet';
import ActionSheetComp from '../Components/ActionSheetComp';

const basic = "basic";
const Address = "address";
const package_info = "package_info";


export default AddLicenseKey = (props) => {
    const formFieldTopMargin = Constants.formFieldTopMargin;

    // Hooks
    const actionSheetRef = React.useRef();

    // REDUX hooks
    const dispatch = useDispatch();
    const isInternetActive = useSelector(state => state.IsInternetActive);
    const UserLogin = useSelector(state => state.User.UserLogin);
    const labels = useSelector(state => state.Labels);
    const messages = useSelector(state => state.Labels);

    // form keys
    const formFieldsKeys = {
        id: "id",
        package: 'package',
        modules: 'modules',
        subscription: 'subscription',
        licenseKey: "licenseKey",
        licence_end_date: "licence_end_date",
        company: "company",

    }

    //form initial validation
    const initialPackageValidationObj = {
        [formFieldsKeys.company_type]: {
            invalid: false,
            title: labels.company_type_required
        },
        [formFieldsKeys.modules]: {
            invalid: false,
            title: labels.modules_required
        },
        [formFieldsKeys.package]: {
            invalid: false,
            title: labels.package_required
        },

    };

    //form initial values
    const initialFormFields = {
        package: '',
        modules: [],
        subscription: '',
        licenseKey: "",
        licence_end_date: "",
        company: {}
    }

    // useState hooks
    const [itemId, setItemId] = React.useState('')
    const [isItemFound, setIsItemFound] = React.useState(false);
    const [formFields, setFormFields] = React.useState(initialFormFields);
    const [isEditable, setIsEditable] = React.useState(true);
    const [isLoading, setIsLoading] = React.useState(false);
    const [viewDecider, setViewDecider] = React.useState(1);
    const [uploadingFile, setUploadingFile] = React.useState(false);
    const [isModalVisible, setIsModalVisible] = React.useState(false);
    const [packagevalidationObj, setPackageValidationObj] = React.useState({
        ...initialPackageValidationObj,
    });
    const [dateObject, setDateObject] = React.useState({ isVisible: false, pickerKey: null, mode: Constants.DatePickerModes.date_mode });
    const [actionSheetDecide, setActionSheetDecide] = React.useState('');
    const [companyAS, setCompanyAS] = React.useState(getActionSheetAPIDetail({
        url: Constants.apiEndPoints.administrationCompanies, debugMsg: 'companyList', token: UserLogin.access_token, selectedData: [],
    }));

    const [packageAS, setPackageAS] = React.useState(getActionSheetAPIDetail({
        url: Constants.apiEndPoints.administrationPackageList, method: 'post', debugMsg: "packageList", token: UserLogin.access_token, page: null, perPage: null,
        selectedData: formFields[formFieldsKeys.package] ? [formFields[formFieldsKeys.package]] : []
    }));
    const [modulesAS, setModulesAS] = React.useState(getActionSheetAPIDetail({
        url: Constants.apiEndPoints.moduleList, method: 'post', params: { status: '1' }, debugMsg: "modulesList", token: UserLogin.access_token, page: null, perPage: null,
        selectedData: formFields[formFieldsKeys.modules] ? formFields[formFieldsKeys.modules] : []
    }));


    // useEffect hooks
    React.useEffect(() => {

        if (props?.route?.params?.itemId) {
            //console.log('item Id FOund')
            setIsItemFound(true)
            setItemId(props?.route?.params?.itemId)
            getLicenseDetails(props?.route?.params?.itemId)
        } else {
            setIsLoading(false);
            setIsEditable(true);
        }

    }, [])

    /**
     * getLicenseDetails
     * @param {*} itemId 
     */
    const getLicenseDetails = async (itemId) => {
        setIsLoading(true);
        // let params = {
        // }
        ////console.log("itemId", itemId)
        let url = Constants.apiEndPoints.licenceKeyAdd + "/" + itemId;
        //console.log("url", url);
        let response = await APIService.getData(url, UserLogin.access_token, null, "licenseDetailsApi");
        // console.log("payload getLicenseDetails", response.data.payload);
        // return
        if (!response.errorMsg) {


            let getModule = [];
            if (response.data?.payload?.assigned_module) {
                response.data?.payload?.assigned_module.map((obj, index) => {
                    getModule.push(obj.module)
                })
            }
            // console.log("======getModule=======", getModule)

            setFormFields({
                ...response.data.payload,
                package: response?.data?.payload?.package ?? {},
                modules: response?.data?.payload?.module ?? [],
                // subscription: response?.data?.payload?.package?? '',
                licenseKey: response?.data?.payload?.licence_key ?? "",
                // licence_end_date: licence_end_date ?? "",
                company: response?.data?.payload?.company ?? {},
                licence_end_date: getDateFromDays(response?.data?.payload?.validity_in_days)

            })

            setCompanyAS({
                ...companyAS,
                selectedData: [response?.data?.payload?.company]
            })
            setModulesAS({
                ...modulesAS,
                selectedData: [...response?.data?.payload?.module]
            })
            setPackageAS({
                ...packageAS,
                selectedData: [response?.data?.payload?.package]
            })
            setIsLoading(false);
        }
        else {
            setIsLoading(false);
            Alert.showAlert(Constants.danger, response.errorMsg);
        }
    }

    /**
     * saveLicenseDetails
     * @param {*} licenseKeyID 
     */
    const saveLicenseDetails = async (licenseKeyID) => {
        let modules = [];

        formFields[formFieldsKeys.modules].map(m_obj => {
            if (m_obj?.id)
                modules.push('' + m_obj.id)
        })
        let params = {
            licence_end_date: "2022-09-02",
            licence_key: formFields?.licenseKey,
            modules: modules ?? [],
            package_id: formFields[formFieldsKeys.package]['id'] ?? "",
            // user_type_id: formFields?.user_type_id ?? "2",
            "user_id": formFields[formFieldsKeys.company]['id'] ?? "",
        }
        // console.log('params----- ', params)
        let url = Constants.apiEndPoints.licenceKeyAdd;
        // return
        if (licenseKeyID)
            url = url + '/' + licenseKeyID;
        let response = {};
        setIsLoading(true);
        if (licenseKeyID)
            response = await APIService.putData(url, params, UserLogin.access_token, null, "editLicenseDetails");
        else
            response = await APIService.postData(url, params, UserLogin.access_token, null, "saveLicenseDetails");

        if (!response.errorMsg) {
            setIsLoading(false);

            //console.log("SUCCESS............")
            Alert.showAlert(Constants.success, licenseKeyID ? labels.message_add_success : labels.message_add_success, () => { props.navigation.pop() });
            // packageDetailsAPI()
        }
        else {
            setIsLoading(false);
            // autoCloseModal()
            Alert.showAlert(Constants.danger, response.errorMsg)
        }
    }

    // Helper Methods 
    const removeErrorTextForInputThatUserIsTyping = (uniqueKey, form) => {
        if (form == package_info) {
            let tempValidationObj = { ...packagevalidationObj }
            tempValidationObj[uniqueKey] = initialPackageValidationObj[uniqueKey];
            setPackageValidationObj(tempValidationObj);
        }
    }

    const handleInputChange = (key, value) => {
        setFormFields({ ...formFields, [key]: value })
    }
    // console.log("----------formFields", formFields)

    const onConfirmDatePicker = (date) => {
        setDateObject({ ...dateObject, isVisible: false })
        removeErrorTextForInputThatUserIsTyping(dateObject.pickerKey);
        let value = '';
        if (dateObject.mode == Constants.DatePickerModes.date_mode)
            handleInputChange(dateObject.pickerKey, formatDate(date))
        else if (dateObject.mode == Constants.DatePickerModes.time_mode)
            handleInputChange(dateObject.pickerKey, formatTime(date))
        else
            handleInputChange(dateObject.pickerKey, formatDateWithTime(date))
    }

    const onCancelDatePicker = () => {
        setDateObject({ ...dateObject, isVisible: false })
    }

    const closeActionSheet = () => {
        setActionSheetDecide('');
        actionSheetRef?.current?.setModalVisible();
    }

    const validation = (form) => {

        if (form == package_info) {
            let validationObjTemp = { ...packagevalidationObj };
            let isValid = true;
            for (const [key, value] of Object.entries(validationObjTemp)) {
                // console.log(`${key}: ${value['invalid']}`);
                // if (key == formFieldsKeys.company_type) {
                //     if (formFields[key]?.length <= 0) {
                //         value['invalid'] = true;
                //         value['title'] = labels[key + '_required']
                //         ////console.log(labels[(key + '_required')]);
                //         isValid = false;
                //         break;
                //     }
                //     //return false;
                // }
                if (key == formFieldsKeys.modules) {
                    if (formFields[key]?.length <= 0) {
                        value['invalid'] = true;
                        value['title'] = labels[key + '_required']
                        // console.log("op mukesah");
                        isValid = false;
                        break;
                    }
                }

                if (key == formFieldsKeys.package) {
                    if (!formFields.package.name) {
                        value['invalid'] = true;
                        value['title'] = labels[key + '_required']

                        isValid = false;
                        break;
                    }
                }
            }
            setPackageValidationObj(validationObjTemp);
            return isValid;
        }
    };

    const isActionSheetMultiple = () => {
        switch (actionSheetDecide) {
            case formFieldsKeys.modules: {
                return true;
            }
            case formFieldsKeys.company_type: {
                return true;
            }
            default: {
                return false;
            }
        }
    }
    const generateLicenseKey = async () => {
        let key = await CreateLicenseKey()
        handleInputChange(formFieldsKeys.licenseKey, key)
    }

    const getDateFromDays = (days = 10) => {
        const addDay = (d, day) => {
            const someDate = new Date(d)
            const numberOfDaysToAdd = day
            const result = someDate.setDate(someDate.getDate() + numberOfDaysToAdd)
            return result
        }
        let dateStr = formatDateByFormat(new Date(addDay(new Date(), days)), "YYYY-MM-DD")
        return dateStr
    }

    // Render view
    if (isLoading)
        return <ProgressLoader />

    return (
        <BaseContainer
            onPressLeftIcon={() => { props.navigation.pop() }}
            leftIcon="arrow-back"
            leftIconSize={24}
            title={labels["add-license"]}
            leftIconColor={Colors.primary}
        >

            <KeyboardAwareScrollView style={{ flex: 1 }}>

                <ActionSheet
                    containerStyle={{ backgroundColor: Colors.backgroundColor, }}
                    ref={actionSheetRef}>
                    <ActionSheetComp
                        title={labels[actionSheetDecide]}
                        closeActionSheet={closeActionSheet}
                        keyToShowData="name"
                        keyToCompareData="id"
                        multiSelect={isActionSheetMultiple()}

                        // multiSelect

                        APIDetails={actionSheetDecide == formFieldsKeys.company ? companyAS
                            : actionSheetDecide == formFieldsKeys.package ? packageAS
                                : actionSheetDecide == formFieldsKeys.modules ? modulesAS
                                    : null}
                        changeAPIDetails={(payload) => {
                            // console.log('changeAPIDetails CALLED-------------------------------------')
                            if (actionSheetDecide == formFieldsKeys.company) {
                                setCompanyAS(getActionSheetAPIDetail({ ...companyAS, ...payload }));
                            }
                            else if (actionSheetDecide == formFieldsKeys.package) {
                                setPackageAS(getActionSheetAPIDetail({ ...packageAS, ...payload }))
                            }
                            else if (actionSheetDecide == formFieldsKeys.modules) {
                                setModulesAS(getActionSheetAPIDetail({ ...modulesAS, ...payload }))
                            }
                        }}
                        onPressItem={(item) => {
                            // console.log('item --------', item)
                            if (actionSheetDecide == formFieldsKeys.company) {
                                handleInputChange(formFieldsKeys.company, item)
                                //setCategoryType(item)
                                removeErrorTextForInputThatUserIsTyping(formFieldsKeys.company_type, package_info)
                            }
                            else if (actionSheetDecide == formFieldsKeys.package) {
                                setFormFields({
                                    ...formFields,
                                    [formFieldsKeys.package]: item,
                                    licenseKey: props?.route?.params?.itemId ? formFields.licenseKey : CreateLicenseKey(),
                                    licence_end_date: getDateFromDays(item.validity_in_days)
                                })
                                removeErrorTextForInputThatUserIsTyping(formFieldsKeys.package, package_info);
                            }
                            else if (actionSheetDecide == formFieldsKeys.modules) {
                                handleInputChange(formFieldsKeys.modules, item)
                                removeErrorTextForInputThatUserIsTyping(formFieldsKeys.modules, package_info)
                            }
                        }}

                    />

                </ActionSheet>




                <View style={styles.mainView}>
                    {/* company  */}
                    <InputValidation
                        // uniqueKey={formFieldsKeys.company}
                        // validationObj={validationObj}
                        value={formFields.company?.name ?? ''}
                        placeHolder={labels.company}
                        iconRight='chevron-down'
                        iconColor={Colors.primary}
                        editable={false}
                        onPressIcon={() => {
                            // removeErrorTextForInputThatUserIsTyping(formFieldsKeys.company);
                            setActionSheetDecide(formFieldsKeys.company);
                            actionSheetRef.current?.setModalVisible()
                        }}
                        style={styles.InputValidationView}
                        inputStyle={styles.inputStyle}
                    />

                    {/* module */}
                    <InputValidation
                        uniqueKey={formFieldsKeys.modules}
                        validationObj={packagevalidationObj}
                        value={''}
                        iconRight='chevron-down'
                        iconColor={Colors.primary}
                        onPressIcon={() => {
                            if (isEditable) {
                                setActionSheetDecide(formFieldsKeys.modules);
                                //removeErrorTextForInputThatUserIsTyping(ipFormKeys.category);
                                actionSheetRef.current?.setModalVisible();
                            }
                        }}
                        placeHolder={labels["Modules"]}
                        style={{ marginTop: formFieldTopMargin }}
                        size={30}
                        inputMainViewStyle={styles.InputValidationView}
                        inputStyle={styles.inputStyle}
                        editable={false}
                    />
                    <MSDataViewer
                        data={formFields?.[formFieldsKeys.modules] ?? []}
                        setNewDataOnPressClose={(newArr) => {
                            setModulesAS({ ...modulesAS, selectedData: newArr });
                            handleInputChange(formFieldsKeys.modules, newArr)
                        }}
                    />

                    {/* package */}
                    <InputValidation
                        uniqueKey={formFieldsKeys.package}
                        validationObj={packagevalidationObj}
                        value={formFields[formFieldsKeys.package]['name'] ?? ''}
                        iconRight='chevron-down'
                        iconColor={Colors.primary}
                        onPressIcon={() => {
                            setActionSheetDecide(formFieldsKeys.package);
                            actionSheetRef.current?.setModalVisible();
                        }}
                        placeHolder={labels["Packages"]}
                        style={{ marginTop: formFieldTopMargin }}
                        size={30}
                        inputMainViewStyle={styles.InputValidationView}
                        inputStyle={styles.inputStyle}
                        editable={false}
                    />

                    {/* license key*/}
                    <InputValidation
                        value={formFields[formFieldsKeys.licenseKey]}
                        placeHolder={labels["licence_key"]}
                        onChangeText={(text) => {
                            handleInputChange(formFieldsKeys.name, text)
                        }}
                        style={styles.InputValidationView}
                        inputStyle={styles.inputStyle}
                        editable={false}
                        iconRight={props?.route?.params?.itemId ? null : "refresh-circle"}
                        size={30}
                        onPressIcon={
                            formFields[formFieldsKeys.package]['name']
                                ? props?.route?.params?.itemId ? () => { } : () => { generateLicenseKey() }
                                : () => { Alert.showToast("select package", Constants.success) }
                        }
                    />

                    {formFields[formFieldsKeys.package]['name'] && formFields[formFieldsKeys.licenseKey]
                        ? <View
                            style={styles.priceWithDiscount}>
                            <Text style={styles.discountTagLine}>{labels.licence_end_date}:</Text>
                            <Text style={{ ...styles.discountTagLine, marginLeft: 10 }}>
                                {formFields.licence_end_date}
                            </Text>
                        </View>
                        : null
                    }

                    {/* save button */}
                    <CustomButton
                        title={labels["save"]}
                        style={{ marginTop: formFieldTopMargin }}
                        onPress={() => {

                            if (validation(package_info)) {
                                // console.log('validation success')
                                if (itemId) {
                                    // console.log('valid=++++++++++++')
                                    saveLicenseDetails(itemId)
                                } else {
                                    saveLicenseDetails()
                                }
                            } else {
                                Alert.showAlert(Constants.warning, messages.message_fill_all_required_fields)
                                // console.log('validation fail')
                            }
                        }}
                    />

                </View>

                <DatePicker
                    modal={true}
                    mode={dateObject.mode}
                    open={dateObject.isVisible}
                    date={new Date()}
                    onConfirm={onConfirmDatePicker}
                    onCancel={onCancelDatePicker}
                />
            </KeyboardAwareScrollView>
        </BaseContainer>
    )
}

const styles = StyleSheet.create({
    mainView: {
        flex: 1,
        paddingHorizontal: Constants.globalPaddingHorizontal,
        backgroundColor: Colors.backgroundColor,
        paddingBottom: 30
    },
    scrollView: {
        flex: 1,
        backgroundColor: Colors.backgroundColor
    },
    welcomeText: {
        fontSize: getProportionalFontSize(24),
        marginTop: 30,
        color: Colors.primary,
        fontFamily: Assets.fonts.bold
    },
    InputValidationView: {
        backgroundColor: Colors.transparent,
        //borderColor: 'red',
        marginTop: 15,
        //borderRadius: 10,
        //color: 'red'
    },
    normalText: {
        color: Colors.white,
        fontFamily: Assets.fonts.bold,
        fontSize: getProportionalFontSize(15)
    },
    inputStyle: {
        fontSize: getProportionalFontSize(16),
        borderColor: Colors.borderColor,
        backgroundColor: Colors.white
    },
    checkBoxView: { flexDirection: 'row', alignItems: 'center', marginTop: 30 },
    checkBoxTitle: { fontSize: getProportionalFontSize(15), fontFamily: Assets.fonts.regular },
    priceWithDiscount: {
        flexDirection: 'row',
        // justifyContent: 'space-between',
        // borderWidth: 1,
        // borderColor: Colors.borderColor,
        borderRadius: 10,
        paddingHorizontal: 10,
        paddingVertical: 5,
        // marginTop: 10,
    },
    discountTagLine: {
        fontSize: getProportionalFontSize(15),
        fontFamily: Assets.fonts.boldItalic
    },
    nextButton: {
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: 40,
        borderRadius: 5,
        backgroundColor: Colors.secondary,
        marginTop: Constants.formFieldTopMargin,
    },
    modalMainView: { backgroundColor: 'transparent', justifyContent: "center", alignItems: "center", paddingHorizontal: 16 },
    innerViewForModel: {
        width: '100%', minHeight: 150, backgroundColor: Colors.backgroundColor, padding: Constants.globalPaddingHorizontal * 2, paddingHorizontal: 16, borderRadius: 20,
    },
});