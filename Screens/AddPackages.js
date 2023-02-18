import React, { useState, } from 'react';
import {
    Keyboard,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { Checkbox, RadioButton } from 'react-native-paper';
import Assets from '../Assets/Assets';
import { getProportionalFontSize } from '../Services/CommonMethods';
import Colors from '../Constants/Colors';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import InputValidation from '../Components/InputValidation';
import { useSelector, } from 'react-redux';
import Alert from '../Components/Alert';
import Constants from '../Constants/Constants';
import APIService from '../Services/APIService';

const AddPackages = props => {
    // REDUX hooks
    const UserLogin = useSelector(state => state.User.UserLogin);
    const labels = useSelector(state => state.Labels);

    // Immutable Variables
    const initialValidationObj = {
        name: {
            invalid: false,
            title: labels.name_required
        },
        price: {
            invalid: false,
            title: labels.price_required
        },
        flat_discount: {
            invalid: false,
            title: labels.flat_discount_required
        },
        discount_in_percentage: {
            invalid: false,
            title: labels.discounted_price_required
        },
        validity_in_days: {
            invalid: false,
            title: labels.validity_in_days_required
        },
        number_of_patients: {
            invalid: false,
            title: labels.number_of_patients_required
        },
        number_of_employees: {
            invalid: false,
            title: labels.number_of_employees_required
        },
        type_of_discount: {
            invalid: false,
            title: labels.type_of_discount_required
        },
        bankid_charges: {
            invalid: false,
            title: labels.type_of_discount_required
        },
        sms_charges: {
            invalid: false,
            title: labels.type_of_discount_required
        }
    }

    //initialValues
    const packageInitialValues = {
        "name": "",
        "price": '',
        "is_on_offer": '',
        "discount_type": "",
        "discount_value": '',
        "discounted_price": '',
        "validity_in_days": '',
        "number_of_patients": '',
        "number_of_employees": '',
        "bankid_charges": '',
        "sms_charges": '',
        "status": '',
        "OffercheckBox": false,
        "radioBtnValue": '',
        "is_sms_enable": false,
        "is_enable_bankid_charges": false,
    };

    //uniqueKeys   
    const packageFormKeys = {
        name: "name",
        price: "price",
        is_on_offer: "is_on_offer",
        flat_discount: "flat_discount",
        discount_in_percentage: "discount_in_percentage",
        discount_type: "discount_type",
        discount_value: "discount_value",
        discounted_price: "discounted_price",
        validity_in_days: "validity_in_days",
        number_of_patients: "number_of_patients",
        number_of_employees: "number_of_employees",
        status: "status",
        entry_mode: "entry_mode",
        OffercheckBox: "OffercheckBox",
        radioBtnValue: 'radioBtnValue',
        type_of_discount: "type_of_discount",
        is_enable_bankid_charges: "is_enable_bankid_charges",
        is_sms_enable: "is_sms_enable",
        bankid_charges: "bankid_charges",
        sms_charges: "sms_charges",
    };

    //Hooks..........
    const [packageFormValues, setPackageFormValues] = useState({ ...packageInitialValues });
    const [radioBtnValue, setRadioBtnValue] = useState("percentage");
    const [validationObj, setValidationObj] = useState({ ...initialValidationObj });
    const [isEditable, setIsEditable] = useState(true);
    const [isLoading, setIsLoading] = React.useState(true);
    const messages = useSelector(state => state.Labels.messages);
    // console.log("====+________", packageFormValues)

    // useEffect hooks
    React.useEffect(() => {
        if (props?.route?.params?.package_id) {
            // console.log("ok Mukesh---", props?.route?.params?.package_id)
            packageDetailsAPI(props?.route?.params?.package_id)
        } else {
            setIsLoading(false)
        }
    }, [])

    // API get methods 
    const packageDetailsAPI = async (packageId) => {
        setIsLoading(true);
        let url = Constants.apiEndPoints.administrationPackage + "/" + packageId;
        // console.log("url", url);
        let response = await APIService.getData(url, UserLogin.access_token, null, "packageDetailsAPI");
        if (!response.errorMsg) {
            // console.log("payload", response.data.payload);
            setPackageFormValues({
                ...response.data.payload,
                "OffercheckBox": response?.data?.payload?.is_on_offer == "1" ? true : false,
                "radioBtnValue": response?.data?.payload?.discount_type == "2" ? "flat" : response?.data?.payload?.discount_type == "1" ? "percentage" : '',
                "flat_discount": response?.data?.payload?.discount_type == "2" ? response?.data?.payload?.discount_value : "",
                "discount_in_percentage": response?.data?.payload?.discount_type == "1" ? response?.data?.payload?.discount_value : "",
            })
            //console.log("data", response.data.success);
            setIsLoading(false);
        }
        else {
            setIsLoading(false);
            Alert.showAlert(Constants.danger, response.errorMsg);
        }
    }

    const addOrEditPackageAPI = async (packageID) => {
        // console.log("packageID-----", packageID)

        let params = {
            "name": packageFormValues?.name,
            "price": packageFormValues?.price,
            "is_on_offer": packageFormValues?.OffercheckBox ? 1 : 0,
            "discount_type": packageFormValues?.radioBtnValue == "flat" ? 2 : packageFormValues?.radioBtnValue == "percentage" ? 1 : '',
            "discount_value": packageFormValues?.radioBtnValue == "flat"
                ? packageFormValues?.flat_discount
                : packageFormValues?.radioBtnValue == "percentage"
                    ? packageFormValues?.discount_in_percentage
                    : 0,
            "validity_in_days": packageFormValues?.validity_in_days,
            "number_of_patients": packageFormValues?.number_of_patients,
            "number_of_employees": packageFormValues?.number_of_employees,
            "bankid_charges": packageFormValues?.bankid_charges,
            "is_enable_bankid_charges": packageFormValues?.is_enable_bankid_charges ? 1 : 0,
            "is_sms_enable": packageFormValues?.is_sms_enable ? 1 : 0,
            "sms_charges": packageFormValues?.sms_charges

        }
        // console.log('params', params)
        // return
        setIsLoading(true);
        let url = Constants.apiEndPoints.administrationPackage;
        if (packageID)
            url = url + '/' + packageID;
        let response = {};
        if (packageID)
            response = await APIService.putData(url, params, UserLogin.access_token, null, "editPackageAPI");
        else
            response = await APIService.postData(url, params, UserLogin.access_token, null, "addPackageAPI");

        if (!response.errorMsg) {
            setIsLoading(false);
            Alert.showAlert(Constants.success, labels.package_saved_successfully, () => { props.navigation.pop() })
        }
        else {
            setIsLoading(false);
            Alert.showAlert(Constants.danger, response.errorMsg)
        }
    }

    // Helper Methods
    const handleInputChange = (value, key) => {
        setPackageFormValues({ ...packageFormValues, [key]: value })
    };

    const removeErrorTextForInputThatUserIsTyping = (uniqueKey) => {
        let tempValidationObj = { ...validationObj }
        tempValidationObj[uniqueKey] = initialValidationObj[uniqueKey];
        setValidationObj(tempValidationObj);
    }

    const validation = () => {
        let validationObjTemp = { ...validationObj };
        if (!packageFormValues.name) {
            validationObjTemp[packageFormKeys.name].invalid = true;
            setValidationObj({ ...validationObjTemp });
            return false;
        } else {
            validationObjTemp[packageFormKeys.name] = initialValidationObj[packageFormKeys.name];
        }
        if (!packageFormValues.price) {
            validationObjTemp[packageFormKeys.price].invalid = true;
            setValidationObj({ ...validationObjTemp });
            return false;
        } else {
            validationObjTemp[packageFormKeys.price] = initialValidationObj[packageFormKeys.price];
        }
        if (packageFormValues.OffercheckBox) {
            if (!packageFormValues.radioBtnValue) {
                Alert.showAlert(Constants.danger, validationObjTemp[packageFormKeys.type_of_discount].title)
                return false;
            }
            else if (packageFormValues.radioBtnValue == 'percentage' && !packageFormValues.discount_in_percentage) {
                Alert.showAlert(Constants.danger, validationObjTemp[packageFormKeys.discount_in_percentage].title)
                return false;
            }
            else if (packageFormValues.radioBtnValue == 'flat' && !packageFormValues.flat_discount) {
                Alert.showAlert(Constants.danger, validationObjTemp[packageFormKeys.flat_discount].title)
                return false;
            }
            else if (packageFormValues.discounted_price <= 0) {
                Alert.showAlert(Constants.danger, labels.discounted_price_can_not_lesser)
                return false;
            }
        }
        if (!packageFormValues.validity_in_days) {
            validationObjTemp[packageFormKeys.validity_in_days].invalid = true;
            setValidationObj({ ...validationObjTemp });
            return false;
        } else {
            validationObjTemp[packageFormKeys.validity_in_days] = initialValidationObj[packageFormKeys.validity_in_days];
        }
        if (!packageFormValues.number_of_patients) {
            validationObjTemp[packageFormKeys.number_of_patients].invalid = true;
            setValidationObj({ ...validationObjTemp });
            return false;
        } else {
            validationObjTemp[packageFormKeys.number_of_patients] = initialValidationObj[packageFormKeys.number_of_patients];
        }
        if (!packageFormValues.number_of_employees) {
            validationObjTemp[packageFormKeys.number_of_employees].invalid = true;
            setValidationObj({ ...validationObjTemp });
            return false;
        } else {
            validationObjTemp[packageFormKeys.number_of_employees] = initialValidationObj[packageFormKeys.number_of_employees];
        }
        setValidationObj(validationObjTemp);
        return true;
    };

    const CreateOffer = () => {
        // console.log("")
        return (
            <RadioButton.Group
                onValueChange={value => {
                    setPackageFormValues({
                        ...packageFormValues, [packageFormKeys.radioBtnValue]: value,
                        [packageFormKeys.discount_in_percentage]: 0,
                        [packageFormKeys.flat_discount]: 0, [packageFormKeys.discounted_price]: packageFormValues.price
                    })
                }}
                value={packageFormValues.radioBtnValue}
            >
                <View style={{
                    flexDirection: "row",
                    flexWrap: "wrap",
                }}>
                    <RadioButton.Item
                        color={Colors.primary}
                        uncheckedColor={Colors.placeholderTextColor}
                        labelStyle={{ ...styles.radioButtons, color: packageFormValues.radioBtnValue == "flat" ? Colors.black : Colors.placeholderTextColor, }}
                        label={labels?.['flat-discount']}
                        position='leading'
                        style={{
                            paddingHorizontal: 0
                        }}
                        value="flat" />

                    <RadioButton.Item
                        color={Colors.primary}
                        uncheckedColor={Colors.placeholderTextColor}
                        labelStyle={{ ...styles.radioButtons, color: packageFormValues.radioBtnValue == "percentage" ? Colors.black : Colors.placeholderTextColor, }}
                        // labelStyle={styles.radioButtons}
                        label={labels?.['percent-discount']}
                        position='leading'
                        style={{
                            paddingHorizontal: 0,
                            marginLeft: 25,
                        }}
                        value="percentage" />
                </View>
            </RadioButton.Group>
        );
    };

    const onChangePrice = (text) => {
        removeErrorTextForInputThatUserIsTyping(packageFormKeys.price);
        let tempTextToNumber = Number(text);
        if (tempTextToNumber === NaN) {
            return;
        }
        if (packageFormValues.OffercheckBox) {
            if (packageFormValues.radioBtnValue == "flat") {
                setPackageFormValues({
                    ...packageFormValues, [packageFormKeys.discounted_price]: tempTextToNumber - packageFormValues.flat_discount,
                    [packageFormKeys.price]: tempTextToNumber
                })
            }
            else if (packageFormValues.radioBtnValue == "percentage") {
                let percentToMinus = (tempTextToNumber / 100) * packageFormValues.discount_in_percentage
                setPackageFormValues({
                    ...packageFormValues, [packageFormKeys.discounted_price]: tempTextToNumber - percentToMinus,
                    [packageFormKeys.price]: tempTextToNumber
                })
            }
            else {
                setPackageFormValues({
                    ...packageFormValues, [packageFormKeys.price]: tempTextToNumber, [packageFormKeys.discounted_price]: tempTextToNumber
                })
            }
        }
        else {
            setPackageFormValues({
                ...packageFormValues, [packageFormKeys.price]: tempTextToNumber, [packageFormKeys.discounted_price]: tempTextToNumber
            })
        }
    }

    const onChangeDiscountInPercentage = (text) => {
        removeErrorTextForInputThatUserIsTyping(packageFormKeys.discount_in_percentage);
        let tempTextToNumber = Number(text);
        if (tempTextToNumber === NaN) {
            return;
        }
        if (tempTextToNumber < 0) {
            return;
        }
        if (packageFormValues.price > 0) {
            let percentToMinus = (packageFormValues.price / 100) * tempTextToNumber
            setPackageFormValues({
                ...packageFormValues, [packageFormKeys.discounted_price]: packageFormValues.price - percentToMinus,
                [packageFormKeys.discount_in_percentage]: tempTextToNumber
            })
        }
        else {
            let validationObjTemp = { ...validationObj };
            validationObjTemp[packageFormKeys.discount_in_percentage].invalid = true;
            validationObjTemp[packageFormKeys.discount_in_percentage].title = labels.add_price_first;
            setValidationObj({ ...validationObjTemp });
        }
    }

    const onChangeFlatDiscount = (text) => {
        removeErrorTextForInputThatUserIsTyping(packageFormKeys.flat_discount);
        let tempTextToNumber = Number(text);
        if (tempTextToNumber === NaN) {
            return;
        }
        if (tempTextToNumber < 0) {
            return;
        }
        if (packageFormValues.price > 0) {
            setPackageFormValues({
                ...packageFormValues, [packageFormKeys.discounted_price]: packageFormValues.price - tempTextToNumber,
                [packageFormKeys.flat_discount]: tempTextToNumber
            })
        }
        else {
            // console.log('third')
            let validationObjTemp = { ...validationObj };
            validationObjTemp[packageFormKeys.flat_discount].invalid = true;
            validationObjTemp[packageFormKeys.flat_discount].title = labels.add_price_first;
            setValidationObj({ ...validationObjTemp });
        }
    }

    //render item
    if (isLoading)
        return <ProgressLoader />

    return (
        <BaseContainer
            onPressLeftIcon={() => props.navigation.goBack()}
            leftIcon="arrow-back"
            // leftIconSize={32}
            title={labels.add_package}
        // leftIconColor={Colors.primary}
        // titleStyle={styles.headingText}
        // rightIcon={null}
        // rightIconSize={25}
        // rightIconColor={Colors.primary}
        // onPressRightIcon={() => { }}
        >
            {/* Main View */}
            <KeyboardAwareScrollView keyboardShouldPersistTaps={"handled"}
                style={styles.mainView}>
                {/* package name */}
                <InputValidation
                    uniqueKey={packageFormKeys.name}
                    validationObj={validationObj}
                    value={packageFormValues.name}
                    placeHolder={labels?.["enter-name"]}
                    onChangeText={(text) => {
                        removeErrorTextForInputThatUserIsTyping(packageFormKeys.name);
                        handleInputChange(text, packageFormKeys.name)
                    }}
                    style={styles.InputValidationView}
                    inputStyle={styles.inputStyle}
                    editable={isEditable}
                />
                {/* valdity in days */}
                <InputValidation
                    uniqueKey={packageFormKeys.validity_in_days}
                    validationObj={validationObj}
                    value={packageFormValues.validity_in_days?.toString() ?? "no data"}
                    placeHolder={labels.validity_in_days}
                    maxLength={4}
                    onChangeText={(text) => {
                        removeErrorTextForInputThatUserIsTyping(packageFormKeys.validity_in_days);
                        handleInputChange(text, packageFormKeys.validity_in_days)
                    }}
                    style={{ ...styles.InputValidationView, }}
                    inputStyle={styles.inputStyle}
                    keyboardType="numeric"
                    editable={isEditable}

                />

                {/* number of petients */}
                <InputValidation
                    uniqueKey={packageFormKeys.number_of_patients}
                    validationObj={validationObj}
                    value={packageFormValues.number_of_patients?.toString() ?? "no data"}
                    placeHolder={labels.number_of_patients}
                    onChangeText={(text) => {
                        removeErrorTextForInputThatUserIsTyping(packageFormKeys.number_of_patients);
                        handleInputChange(text, packageFormKeys.number_of_patients)
                    }}
                    style={styles.InputValidationView}
                    inputStyle={styles.inputStyle}
                    keyboardType="numeric"
                    editable={isEditable}
                    maxLength={5}
                />

                {/* number Of Employees */}
                <InputValidation
                    uniqueKey={packageFormKeys.number_of_employees}
                    validationObj={validationObj}
                    value={packageFormValues.number_of_employees?.toString() ?? "no data"}
                    placeHolder={labels.number_of_employees}
                    onChangeText={(text) => {
                        removeErrorTextForInputThatUserIsTyping(packageFormKeys.number_of_employees);
                        handleInputChange(text, packageFormKeys.number_of_employees)
                    }}
                    style={styles.InputValidationView}
                    inputStyle={styles.inputStyle}
                    keyboardType="numeric"
                    editable={isEditable}
                    maxLength={5}
                />

                {/* package price */}
                <InputValidation
                    uniqueKey={packageFormKeys.price}
                    validationObj={validationObj}
                    value={packageFormValues.price?.toString() ?? "no data"}
                    placeHolder={labels.price}
                    onChangeText={(text) => {
                        onChangePrice(text)
                    }}
                    style={styles.InputValidationView}
                    inputStyle={styles.inputStyle}
                    keyboardType="number-pad"
                    editable={isEditable}
                    maxLength={10}
                />
                {/* price after discount */}
                {packageFormValues.price && packageFormValues.OffercheckBox
                    ? <View
                        style={styles.priceWithDiscount}>
                        <Text style={styles.discountTagLine}>{labels.price_after_discount}:</Text>
                        <Text style={{ ...styles.discountTagLine, marginLeft: 10 }}>
                            {'' + packageFormValues.discounted_price} {Constants.currency}
                        </Text>
                    </View>
                    : null
                }
                {
                    packageFormValues.price
                        ? <>
                            <View style={styles.checkBoxView}>
                                <Checkbox
                                    color={Colors.primary}
                                    status={packageFormValues.OffercheckBox ? 'checked' : 'unchecked'}
                                    onPress={() => {
                                        setPackageFormValues({
                                            ...packageFormValues,
                                            [packageFormKeys.OffercheckBox]: !packageFormValues.OffercheckBox,
                                            [packageFormKeys.radioBtnValue]: '', [packageFormKeys.discount_in_percentage]: 0,
                                            [packageFormKeys.flat_discount]: 0, [packageFormKeys.discounted_price]: packageFormValues.price
                                        })
                                    }}
                                />
                                <Text style={styles.normalText}>{labels?.["is_on_offer"]}</Text>
                            </View>


                            {/* <Checkbox.Item
                                theme={{
                                    backfaceVisibility: "#000"
                                }}
                                position='leading'
                                // mode='android'
                                style={{ marginTop: 15, borderWidth: 2, paddingHorizontal: 0, width: "50%" }}
                                color={Colors.primary}
                                uncheckedColor={Colors.lightGray}
                                labelStyle={{
                                    color: !packageFormValues.OffercheckBox ? Colors.placeholderTextColor : Colors.black,
                                    fontFamily: Assets.fonts.regular
                                }}
                                label={labels?.["is_on_offer"]}
                                status={packageFormValues.OffercheckBox ? 'checked' : 'unchecked'}
                                onPress={() => {
                                    setPackageFormValues({
                                        ...packageFormValues,
                                        [packageFormKeys.OffercheckBox]: !packageFormValues.OffercheckBox,
                                        [packageFormKeys.radioBtnValue]: '', [packageFormKeys.discount_in_percentage]: 0,
                                        [packageFormKeys.flat_discount]: 0, [packageFormKeys.discounted_price]: packageFormValues.price
                                    })
                                }}
                            />  */}
                        </>
                        : null
                }

                {packageFormValues.OffercheckBox && packageFormValues.price ? CreateOffer() : null}

                {/* flat discount price    */}
                {
                    packageFormValues.OffercheckBox && packageFormValues.radioBtnValue == "flat"
                        ? <InputValidation
                            uniqueKey={packageFormKeys.flat_discount}
                            validationObj={validationObj}
                            value={'' + packageFormValues.flat_discount}
                            placeHolder={labels.discount_value}
                            onChangeText={(text) => {
                                onChangeFlatDiscount(text)
                            }}
                            style={styles.InputValidationView}
                            inputStyle={styles.inputStyle}
                            keyboardType="number-pad"
                            editable={isEditable}
                        /> : null
                }

                {/* discount percentage */}
                {
                    packageFormValues.OffercheckBox && packageFormValues.radioBtnValue == "percentage"
                        ? <InputValidation
                            uniqueKey={packageFormKeys.discount_in_percentage}
                            validationObj={validationObj}
                            value={'' + packageFormValues.discount_in_percentage}
                            placeHolder={labels.discount_value}
                            onChangeText={(text) => {
                                onChangeDiscountInPercentage(text)
                            }}
                            style={styles.InputValidationView}
                            inputStyle={styles.inputStyle}
                            keyboardType="number-pad"
                            iconRight="percent"
                            editable={isEditable}
                        /> : null
                }
                <View style={{ ...styles.checkBoxView, marginTop: packageFormValues.OffercheckBox && packageFormValues.radioBtnValue == '' ? 0 : 15 }}>
                    <Checkbox
                        color={Colors.primary}
                        status={packageFormValues.is_sms_enable ? 'checked' : 'unchecked'}
                        onPress={() => {
                            setPackageFormValues({
                                ...packageFormValues,
                                [packageFormKeys.is_sms_enable]: !packageFormValues.is_sms_enable,

                            })
                        }}
                    />
                    <Text style={styles.normalText}>{labels?.["is-sms-enable"]}</Text>
                </View>
                {
                    packageFormValues.is_sms_enable
                        ? <InputValidation
                            uniqueKey={packageFormKeys.sms_charges}
                            validationObj={validationObj}
                            value={packageFormValues.sms_charges?.toString() ?? "no data"}
                            placeHolder={labels?.["sms-charges"]}
                            onChangeText={(text) => {
                                removeErrorTextForInputThatUserIsTyping(packageFormKeys.sms_charges);
                                handleInputChange(text, packageFormKeys.sms_charges)
                            }}
                            style={{ ...styles.InputValidationView, marginTop: 0 }}
                            inputStyle={styles.inputStyle}
                            keyboardType="numeric"
                            editable={isEditable}
                            maxLength={5}
                        />
                        : null
                }
                <View style={{ ...styles.checkBoxView, marginTop: 15 }}>
                    <Checkbox
                        color={Colors.primary}
                        status={packageFormValues.is_enable_bankid_charges ? 'checked' : 'unchecked'}
                        onPress={() => {
                            setPackageFormValues({
                                ...packageFormValues,
                                [packageFormKeys.is_enable_bankid_charges]: !packageFormValues.is_enable_bankid_charges,
                            })
                        }}
                    />
                    <Text style={styles.normalText}>{labels?.["is-enable-bankid"]}</Text>
                </View>

                {
                    packageFormValues.is_enable_bankid_charges
                        ? <InputValidation
                            uniqueKey={packageFormKeys.bankid_charges}
                            validationObj={validationObj}
                            value={packageFormValues.bankid_charges?.toString() ?? "no data"}
                            placeHolder={labels?.['bankid-charges']}
                            onChangeText={(text) => {
                                removeErrorTextForInputThatUserIsTyping(packageFormKeys.bankid_charges);
                                handleInputChange(text, packageFormKeys.bankid_charges)
                            }}
                            style={{ ...styles.InputValidationView, marginTop: 5 }}
                            inputStyle={styles.inputStyle}
                            keyboardType="numeric"
                            editable={isEditable}
                            maxLength={5}
                        />
                        : null
                }
                {/* save button */}
                <CustomButton
                    title={labels.save}
                    style={{ marginTop: 20 }}
                    onPress={() => {
                        Keyboard.dismiss()
                        if (validation()) {
                            addOrEditPackageAPI(props?.route?.params?.package_id)
                        }
                        else {
                            Alert.showAlert(Constants.warning, messages.message_fill_all_required_fields)
                            // console.log('validation fail')
                        }
                    }}
                />
            </KeyboardAwareScrollView>
        </BaseContainer>

    );
};

export default AddPackages;

const styles = StyleSheet.create({
    nextButton: {
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: 40,
        borderRadius: 5,
        backgroundColor: Colors.secondary,
        marginTop: 30
    },
    normalText: {
        color: Colors.primary,
        fontFamily: Assets.fonts.bold,
        fontSize: getProportionalFontSize(15)
    },
    scrollView: { flex: 1, backgroundColor: Colors.backgroundColor },
    mainView: {
        flex: 1,
        paddingHorizontal: 24
    },
    headingText: {
        fontSize: getProportionalFontSize(24),
        // marginTop: 10,
        color: Colors.primary,
        fontFamily: Assets.fonts.bold,
    },
    InputValidationView: {
        backgroundColor: Colors.transparent,
        //borderColor: 'red',
        marginTop: 15,
        //borderRadius: 10,
        //color: 'red'
    },
    inputStyle: {
        fontSize: getProportionalFontSize(15),
        fontFamily: Assets.fonts.regular
    },
    radioButtons: {
        fontFamily: Assets.fonts.regular
    },
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
    checkBoxView: { flexDirection: 'row', alignItems: 'center', marginTop: 10 },
    normalText: {
        fontSize: getProportionalFontSize(15),
        fontFamily: Assets.fonts.regular,
    },
    discountTagLine: {
        fontSize: getProportionalFontSize(15),
        fontFamily: Assets.fonts.boldItalic
    }
});
