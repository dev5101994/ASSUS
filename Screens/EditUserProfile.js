import React, { useEffect, useState } from 'react';
import {
    StyleSheet,
    Text, View, SafeAreaView, Image, TouchableOpacity, ScrollView
} from 'react-native';
import Colors from '../Constants/Colors';
import Assets from '../Assets/Assets'
import { getProportionalFontSize, checkEmailFormat, formatDateWithTime, formatDate, formatTime, checkMobileNumberFormat, getActionSheetAPIDetail, ReplaceAll } from '../Services/CommonMethods';
import InputValidation from '../Components/InputValidation';
import APIService from '../Services/APIService'
import Constants from '../Constants/Constants'
import ProgressLoader from '../Components/ProgressLoader'
import { useSelector, useDispatch } from 'react-redux'
import BaseContainer from '../Components/BaseContainer'
import CustomButton from '../Components/CustomButton'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import DatePicker from 'react-native-date-picker';
import ActionSheet from 'react-native-actions-sheet';
import ActionSheetComp from '../Components/ActionSheetComp';
import Alert from '../Components/Alert';
import { UserDetailActionWithPayload } from '../Redux/Actions/UserDetailAction';
import AsyncStorageService from '../Services/AsyncStorageService';
import { UserLoginActionWithPayload } from '../Redux/Actions/UserLoginAction'
import Icon from 'react-native-vector-icons/MaterialIcons';

const EditUserProfile = (props) => {
    const routeParams = props?.route?.params ?? {}

    //hooks
    const actionSheetRef = React.useRef();

    // REDUX hooks
    const UserLogin = useSelector(state => state.User.UserLogin);
    const labels = useSelector(state => state.Labels);
    const UserDetail = useSelector(state => state?.User?.UserDetail);
    const dispatch = useDispatch();
    // console.log("========", UserLogin)
    // Helper Methods
    const removeErrorTextForInputThatUserIsTyping = (uniqueKey) => {
        let tempValidationObj = { ...validationObj }
        tempValidationObj[uniqueKey] = initialValidationObj[uniqueKey];
        setValidationObj(tempValidationObj);
    }

    const handleInputChange = (key, value) => {
        setFormFields({ ...formFields, [key]: value })
    }

    // Immutable Variables
    const formFieldsKeys = {
        email: 'email',
        contact_number: 'contact_number',
        password: 'password',
        full_address: 'full_address',
        name: 'name',
        //
        user_type_id: "user_type_id",
        role_id: "role_id",
        company_type: "company_type",
        "confirm-password": "confirm-password",
        gender: "gender",
        personal_number: "personal_number",
        organization_number: "organization_number",
        country_id: "country_id",
        zipcode: "zipcode",
        full_address: "full_address",
        licence_key: "licence_key",
        licence_end_date: "licence_end_date",
        is_substitute: "is_substitute",
        is_regular: "is_regular",
        is_seasonal: "is_seasonal",
        joining_date: "joining_date",
        establishment_date: "establishment_date",
        user_color: "user_color",
        is_file_required: "is_file_required",
        category_id: "category_id",
        branch_id: "branch_id",
        dept_id: "dept_id",
        govt_id: "govt_id",
        weekly_hours_alloted_by_govt: "weekly_hours_alloted_by_govt",
        company_type_id: "company_type_id",
        is_file_required: "is_file_required",
        city: "city",
        postal_area: "postal_area",
        avatar: "avatar"
    }

    const initialValidationObj = {
        [formFieldsKeys.email]: {
            invalid: false,
            title: labels.invalid_email
        },
        [formFieldsKeys.organization_number]: {
            invalid: false,
            title: labels.message_fill_all_required_fields
        },
        [formFieldsKeys.city]: {
            invalid: false,
            title: labels.message_fill_all_required_fields
        },
        [formFieldsKeys.zipcode]: {
            invalid: false,
            title: labels.message_fill_all_required_fields
        },
        [formFieldsKeys.postal_area]: {
            invalid: false,
            title: labels.message_fill_all_required_fields
        },
        [formFieldsKeys.name]: {
            invalid: false,
            title: labels.name_required
        },
        [formFieldsKeys.contact_number]: {
            invalid: false,
            title: labels.contact_number_required
        },
        [formFieldsKeys.full_address]: {
            invalid: false,
            title: labels.full_address_required
        },
    }

    const initialFormFields = {
        email: '',
        contact_number: '',
        full_address: '',
        name: '',
        postal_area: "",
        zipcode: "",
    }

    // useState hooks
    const [isLoading, setIsLoading] = React.useState(false);
    const [formFields, setFormFields] = React.useState(initialFormFields);
    const [validationObj, setValidationObj] = React.useState({ ...initialValidationObj });
    const [dateObject, setDateObject] = React.useState({ isVisible: false, pickerKey: null, mode: Constants.DatePickerModes.date_mode });
    const [actionSheetDecide, setActionSheetDecide] = React.useState('');
    // const [companyTypeAS, setCompanyTypeAS] = React.useState(getActionSheetAPIDetail({
    //     url: Constants.apiEndPoints.companyTypeList, debugMsg: "companyTypeList", token: UserLogin.access_token, perPage: Constants.perPage,
    //     selectedData: formFields[formFieldsKeys.company_type] ? [formFields[formFieldsKeys.company_type]] : []
    // }));
    React.useEffect(() => {
        setIsLoading(true)
        if (UserLogin) {
            setFormFields({
                id: UserLogin?.id ?? "N/A",
                name: UserLogin?.name ?? "N/A",
                email: UserLogin?.email ?? "N/A",
                contact_number: UserLogin?.contact_number ?? "N/A",
                full_address: UserLogin?.full_address ?? "N/A",
                //
                user_type_id: UserLogin?.user_type_id ?? "",
                role_id: UserLogin?.role_id ?? "",
                company_type_id: ['' + UserLogin?.company_type_id],
                category_id: UserLogin?.category_id ?? "1",
                country_id: UserLogin?.country_id ?? "",
                branch_id: UserLogin?.branch_id ?? "",
                dept_id: UserLogin?.dept_id ?? "",
                govt_id: UserLogin?.govt_id ?? "",
                weekly_hours_alloted_by_govt: UserLogin?.weekly_hours_alloted_by_govt ?? "",
                gender: UserLogin?.gender ?? "",
                personal_number: UserLogin?.personal_number ?? "",
                organization_number: UserLogin?.organization_number ?? "",
                zipcode: UserLogin?.zipcode ?? "",
                licence_key: UserLogin?.licence_key ?? "",
                licence_end_date: UserLogin?.licence_end_date ?? "",
                is_substitute: UserLogin?.is_substitute ?? "",
                is_regular: UserLogin?.is_regular ?? "",
                is_seasonal: UserLogin?.is_seasonal ?? "",
                joining_date: UserLogin?.joining_date ?? "",
                establishment_date: UserLogin?.establishment_date ?? "",
                user_color: UserLogin?.user_color ?? "",
                is_file_required: UserLogin?.is_file_required ?? "",
                city: UserLogin?.city ?? "",
                postal_area: UserLogin?.postal_area ?? "",
                avatar: UserLogin?.avatar ?? "",
            })
            setIsLoading(false)
        }
    }, [])


    const validation = () => {
        let validationObjTemp = { ...validationObj };
        // let isValid = true;
        // for (const [key, value] of Object.entries(validationObjTemp)) {
        if (!formFields.name) {
            validationObjTemp[formFieldsKeys.name].invalid = true;
            setValidationObj({ ...validationObjTemp });
            return false;
        } else {
            validationObjTemp[formFieldsKeys.name] = initialValidationObj[formFieldsKeys.name];
        }

        if (!formFields.email) {
            validationObjTemp[formFieldsKeys.email].invalid = true;
            setValidationObj({ ...validationObjTemp });
            return false;
        } else {
            validationObjTemp[formFieldsKeys.email] = initialValidationObj[formFieldsKeys.email];
        }
        if (!checkEmailFormat(formFields.email)) {
            validationObjTemp[formFieldsKeys.email].invalid = true;
            validationObjTemp[formFieldsKeys.email].title = labels.invalid_email;
            setValidationObj({ ...validationObjTemp });
            return false;
        } else {
            validationObjTemp[formFieldsKeys.email] = initialValidationObj[formFieldsKeys.email];
        }

        if (!formFields.contact_number) {
            validationObjTemp[formFieldsKeys.contact_number].invalid = true;
            setValidationObj({ ...validationObjTemp });
            return false;
        } else {
            validationObjTemp[formFieldsKeys.contact_number] = initialValidationObj[formFieldsKeys.contact_number];
        }
        if (!checkMobileNumberFormat(ReplaceAll(formFields.contact_number, ' ', ''))) {
            // console.log("invalid formate")
            validationObjTemp[formFieldsKeys.contact_number].invalid = true;
            validationObjTemp[formFieldsKeys.contact_number].title = labels.invalid_contact_number;
            setValidationObj({ ...validationObjTemp });
            return false;
        } else {
            validationObjTemp[formFieldsKeys.contact_number] = initialValidationObj[formFieldsKeys.contact_number];
        }

        if (!formFields.full_address) {
            validationObjTemp[formFieldsKeys.full_address].invalid = true;
            setValidationObj({ ...validationObjTemp });
            return false;
        } else {
            validationObjTemp[formFieldsKeys.full_address] = initialValidationObj[formFieldsKeys.full_address];
        }
        if (formFields[formFieldsKeys.zipcode] && formFields[formFieldsKeys.zipcode].length < 5) {
            validationObjTemp[formFieldsKeys.zipcode].invalid = true;
            setValidationObj({ ...validationObjTemp });
            return false;
        } else {
            validationObjTemp[formFieldsKeys.zipcode] = initialValidationObj[formFieldsKeys.zipcode];
        }

        if (formFields[formFieldsKeys.postal_area] && formFields[formFieldsKeys.postal_area].length < 5) {
            validationObjTemp[formFieldsKeys.postal_area].invalid = true;
            setValidationObj({ ...validationObjTemp });
            return false;
        } else {
            validationObjTemp[formFieldsKeys.postal_area] = initialValidationObj[formFieldsKeys.postal_area];
        }



        if (!formFields.organization_number) {
            validationObjTemp[formFieldsKeys.organization_number].invalid = true;
            setValidationObj({ ...validationObjTemp });
            return false;
        } else {
            validationObjTemp[formFieldsKeys.organization_number] = initialValidationObj[formFieldsKeys.organization_number];
        }
        setValidationObj({ ...validationObjTemp });
        return true;

        // }
    }


    // API methods
    const updateUserDetailAPI = async () => {
        let companyTypeIdArr = []

        UserLogin.company_types.map((obj) => {
            companyTypeIdArr.push('' + obj.id)
        })

        // console.log('$$$$$$$$$$$$$$companyTypeIdArr', companyTypeIdArr)
        // return;
        let params = {}
        params = {
            ...params,
            "user_type_id": formFields[formFieldsKeys.user_type_id],
            "role_id": formFields[formFieldsKeys.role_id],
            "company_type_id": companyTypeIdArr,
            "category_id": formFields[formFieldsKeys.category_id],
            "country_id": formFields[formFieldsKeys.country_id],
            "branch_id": formFields[formFieldsKeys.branch_id],
            "dept_id": formFields[formFieldsKeys.dept_id],
            "govt_id": formFields[formFieldsKeys.govt_id],
            "weekly_hours_alloted_by_govt": formFields[formFieldsKeys.weekly_hours_alloted_by_govt],
            "name": formFields[formFieldsKeys.name],
            "email": formFields[formFieldsKeys.email],
            // "password": "12345678",//formFields[formFieldsKeys.password],
            // "confirm-password": "12345678",// formFields[formFieldsKeys.password], //edit it 
            "contact_number": ReplaceAll(formFields[formFieldsKeys.contact_number], ' ', ''),
            "gender": formFields[formFieldsKeys.gender],
            "personal_number": ReplaceAll(formFields[formFieldsKeys.personal_number], '-', ''),
            "organization_number": formFields[formFieldsKeys.organization_number],
            "zipcode": formFields[formFieldsKeys.zipcode],
            "full_address": formFields[formFieldsKeys.full_address],
            "licence_key": formFields[formFieldsKeys.licence_key],
            "licence_end_date": formFields[formFieldsKeys.licence_end_date],
            "is_substitute": formFields[formFieldsKeys.is_substitute],
            "is_regular": formFields[formFieldsKeys.is_regular],
            "is_seasonal": formFields[formFieldsKeys.is_seasonal],
            "joining_date": formFields[formFieldsKeys.joining_date],
            "establishment_date": formFields[formFieldsKeys.establishment_date],
            "user_color": formFields[formFieldsKeys.user_color],
            "is_file_required": formFields[formFieldsKeys.is_file_required],
            "city": formFields[formFieldsKeys.city],
            "postal_area": formFields[formFieldsKeys.postal_area],
            "avatar": formFields[formFieldsKeys.avatar],
        }

        if (routeParams.user_type_id == 2) {
            params = {
                "name": formFields[formFieldsKeys.name],
                "email": formFields[formFieldsKeys.email],
                "contact_number": ReplaceAll(formFields[formFieldsKeys.contact_number], ' ', ''),
                // "gender" :"Female",
                // "personal_number": ReplaceAll(formFields[formFieldsKeys.personal_number], '-', ''),
                "organization_number": formFields[formFieldsKeys.organization_number],

                "city": formFields[formFieldsKeys.city],
                "postal_area": formFields[formFieldsKeys.postal_area],
                "zipcode": formFields[formFieldsKeys.zipcode],
                "full_address": formFields[formFieldsKeys.full_address],
                "avatar": formFields[formFieldsKeys.avatar],
            }


        }
        // console.log('params', JSON.stringify(params))

        let url = ""
        if (formFields.user_type_id == 1) {
            url = Constants.apiEndPoints.administrationCompanyDetails + '/' + formFields.id;;
        }
        else if (formFields.user_type_id == 2) {
            url = Constants.apiEndPoints.updateProfile;
        }
        else {
            url = Constants.apiEndPoints.userView + '/' + formFields.id;;
        }

        // console.log("url", url)
        // return
        setIsLoading(true);
        let response = {};
        if (formFields.user_type_id == 2) {
            response = await APIService.postData(url, params, UserLogin.access_token, null, "updateUserDetailAPI");
        } else {
            response = await APIService.putData(url, params, UserLogin.access_token, null, "updateUserDetailAPI");
        }

        // console.log("-----------data updated---------------", JSON.stringify(response));
        if (!response.errorMsg) {
            dispatch(UserDetailActionWithPayload(response.data.payload))
            await updateUserLogin(response.data.payload)
            Alert.showAlert(Constants.success, labels.your_details_updated_successfully, () => props.navigation.pop())
        }
        else {
            setIsLoading(false);
            Alert.showAlert(Constants.danger, response.errorMsg)
        }
    }

    const updateUserLogin = async (updatedData) => {
        // console.log("-----------updateUserLogin----------")
        let userLoginUpdatedData = {
            ...UserLogin,
            name: updatedData?.name,
            email: updatedData?.email,
            contact_number: updatedData?.contact_number,
            city: updatedData?.city,
            postal_area: updatedData?.postal_area,
            zipcode: updatedData?.zipcode,
            organization_number: updatedData?.organization_number,
            full_address: updatedData?.full_address,
            avatar: updatedData?.avatar,

        }
        dispatch(UserLoginActionWithPayload({ ...userLoginUpdatedData }))
        try {
            await AsyncStorageService._storeDataAsJSON(
                Constants.asyncStorageKeys.user_login,
                { ...userLoginUpdatedData },
            );
            // console.log('DONE');
        } catch (error) {
            // console.log('saveUserInAsyncStorage....AsyncStorageService error', error);
        }
    }

    // Render view
    // console.log('UserLogin----', JSON.stringify(UserLogin))
    if (isLoading)
        return <ProgressLoader />

    return (
        <BaseContainer
            title={labels["edit-profile"]} //{props?.route?.name}
            leftIcon="arrow-back"
            leftIconColor={Colors.primary}
            // leftIconSize={32}
            onPressLeftIcon={() => { props.navigation.pop() }}
            titleStyle={{ marginStart: 5 }}>
            <KeyboardAwareScrollView style={{ flex: 1 }}>

                {/* Main View */}
                <View style={styles.mainView}>

                    {/* profile pic */}
                    <View style={styles.imageContainer}>
                        <Image source={{ uri: UserLogin?.avatar ? UserLogin?.avatar : Constants.userImageMale }}
                            style={{ ...styles.profileImg, }} />
                    </View>

                    {/*Name */}
                    <InputValidation
                        uniqueKey={formFieldsKeys.name}
                        validationObj={validationObj}
                        value={formFields[formFieldsKeys.name]}
                        placeHolder={labels["name"]}
                        onChangeText={(text) => {
                            // removeErrorTextForInputThatUserIsTyping(formFieldsKeys.name);
                            handleInputChange(formFieldsKeys.name, text)
                        }}
                        style={styles.InputValidationView}
                        inputStyle={styles.inputStyle}
                    />

                    {/* Email */}
                    <InputValidation
                        uniqueKey={formFieldsKeys.email}
                        validationObj={validationObj}
                        value={formFields[formFieldsKeys.email]}
                        placeHolder={labels["email"]}
                        onChangeText={(text) => {
                            removeErrorTextForInputThatUserIsTyping(formFieldsKeys.email);
                            handleInputChange(formFieldsKeys.email, text)
                        }}
                        style={{ marginTop: Constants.formFieldTopMargin }}
                        inputMainViewStyle={styles.InputValidationView}
                        inputStyle={styles.inputStyle}
                        keyboardType={"email-address"}
                    />

                    {/* Contact Number */}
                    <InputValidation
                        maskedInput={true}
                        mask={Constants.phone_number_format}
                        // maxLength={10}
                        uniqueKey={formFieldsKeys.contact_number}
                        validationObj={validationObj}
                        value={formFields[formFieldsKeys.contact_number]}
                        placeHolder={labels["contact-number"]}
                        onChangeText={(text) => {
                            removeErrorTextForInputThatUserIsTyping(formFieldsKeys.contact_number);
                            handleInputChange(formFieldsKeys.contact_number, text)
                        }}
                        style={{ marginTop: Constants.formFieldTopMargin }}
                        inputMainViewStyle={styles.InputValidationView}
                        inputStyle={styles.inputStyle}
                    />
                    {/*orgenisation Number*/}
                    <InputValidation
                        uniqueKey={formFieldsKeys.organization_number}
                        validationObj={validationObj}
                        value={formFields[formFieldsKeys.organization_number]}
                        placeHolder={labels["organization_number"]}
                        onChangeText={(text) => {
                            removeErrorTextForInputThatUserIsTyping(formFieldsKeys.organization_number);
                            handleInputChange(formFieldsKeys.organization_number, text)
                        }}
                        style={styles.InputValidationView}
                        inputStyle={styles.inputStyle}
                    />

                    {/*city*/}
                    <InputValidation
                        uniqueKey={formFieldsKeys.city}
                        validationObj={validationObj}
                        value={formFields[formFieldsKeys.city]}
                        placeHolder={labels["city"]}
                        onChangeText={(text) => {
                            removeErrorTextForInputThatUserIsTyping(formFieldsKeys.city);
                            handleInputChange(formFieldsKeys.city, text)
                        }}
                        style={styles.InputValidationView}
                        inputStyle={styles.inputStyle}
                    />

                    {/*postal_area*/}
                    <InputValidation
                        maxLength={5}
                        keyboardType={'number-pad'}
                        uniqueKey={formFieldsKeys.postal_area}
                        validationObj={validationObj}
                        value={formFields[formFieldsKeys.postal_area]}
                        placeHolder={labels["postal-code"]}
                        onChangeText={(text) => {
                            removeErrorTextForInputThatUserIsTyping(formFieldsKeys.postal_area);
                            handleInputChange(formFieldsKeys.postal_area, text)
                        }}
                        style={styles.InputValidationView}
                        inputStyle={styles.inputStyle}
                    />

                    {/*zipcode*/}
                    <InputValidation
                        maxLength={5}
                        uniqueKey={formFieldsKeys.zipcode}
                        validationObj={validationObj}
                        value={formFields[formFieldsKeys.zipcode]}
                        placeHolder={labels["zipcode"]}
                        onChangeText={(text) => {
                            removeErrorTextForInputThatUserIsTyping(formFieldsKeys.zipcode);
                            handleInputChange(formFieldsKeys.zipcode, text)
                        }}
                        style={styles.InputValidationView}
                        inputStyle={styles.inputStyle}
                    />


                    {/* full address */}
                    <InputValidation
                        uniqueKey={formFieldsKeys.full_address}
                        validationObj={validationObj}
                        multiline={true}
                        maxLength={150}
                        value={formFields[formFieldsKeys.full_address]}
                        placeHolder={labels["full-address"]}
                        onChangeText={(text) => {
                            removeErrorTextForInputThatUserIsTyping(formFieldsKeys.full_address);
                            handleInputChange(formFieldsKeys.full_address, text)
                        }}
                        style={{ marginTop: Constants.formFieldTopMargin }}
                        inputMainViewStyle={styles.InputValidationView}
                        inputStyle={{ ...styles.inputStyle, height: 150, textAlignVertical: "top" }}
                    />


                    {/* save button */}
                    <CustomButton
                        title={labels["save"]}
                        style={{ marginTop: 30 }}
                        onPress={() => {
                            if (validation()) {
                                // console.log('validation success')
                                updateUserDetailAPI();
                            }
                            else {
                                Alert.showAlert(Constants.warning, labels.message_fill_all_required_fields)
                                // console.log('validation fail')
                            }
                        }}
                    />
                </View>

            </KeyboardAwareScrollView>
        </BaseContainer>

    )
}

export default EditUserProfile

const styles = StyleSheet.create({
    mainView: {
        flex: 1,
        paddingHorizontal: Constants.globalPaddingHorizontal,
        backgroundColor: Colors.backgroundColor,
        paddingBottom: 30
    },
    InputValidationView: {
        backgroundColor: Colors.transparent,
        // borderColor: 'red',
        marginTop: 15,
        // borderRadius: 10,
        // color: 'red'
    },
    inputStyle: {
        fontSize: getProportionalFontSize(16),
        borderColor: Colors.borderColor,
        backgroundColor: Colors.white
    },
    imageContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 15,
    },
    profileImg: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 2, borderColor: Colors.gray
    },
})