import React from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { StyleSheet, Text, View, FlatList } from 'react-native';
import Colors from '../Constants/Colors';

import Assets from '../Assets/Assets';
import { DefaultTheme, TextInput } from 'react-native-paper';
import { checkEmailFormat, checkMobileNumberFormat, firstLetterFromString, getProportionalFontSize, ReplaceAll } from '../Services/CommonMethods';
import TextInputMask from 'react-native-text-input-mask';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Constants from '../Constants/Constants';
import InputValidation from './InputValidation';
import { useSelector, useDispatch } from 'react-redux'
import CommonCRUDCard from './CommonCRUDCard';
import Alert from './Alert';
import BouncyCheckbox from "react-native-bouncy-checkbox";
import FormSubHeader from './FormSubHeader';
import APIService from '../Services/APIService'
import EmptyList from './EmptyList';

export default PersonFormComp = (props) => {

    const formFieldTopMargin = Constants.formFieldTopMargin;

    const personFormKeys = {
        name: "name",
        email: "email",
        contact_number: "contact_number",
        // country: "country",
        city: "city",
        zipcode: "zipcode",
        full_address: "full_address",
        is_contact_person: "is_contact_person",
        is_family_member: "is_family_member",
        is_caretaker: "is_caretaker",
        postal_area: "postal_area",
        is_guardian: "is_guardian",
        is_participated: "is_participated",
        is_presented: "is_presented",
        how_helped: "how_helped",
        "is_other": "is_other",
        "how_helped": "how_helped",
        "is_other_name": "is_other_name",
        other_name: "other_name",
        personal_number: "personal_number"
    };

    const initialPersonFormValidationObj = {
        [personFormKeys.name]: {
            invalid: false,
            title: ''
        },
        [personFormKeys.email]: {
            invalid: false,
            title: ''
        },
        [personFormKeys.contact_number]: {
            invalid: false,
            title: ''
        },
        // country: {
        //     invalid: false,
        //     title: ''
        // },
        [personFormKeys.full_address]: {
            invalid: false,
            title: ''
        },
        [personFormKeys.postal_area]: {
            invalid: false,
            title: ''
        },
        [personFormKeys.zipcode]: {
            invalid: false,
            title: ''
        },
        [personFormKeys.city]: {
            invalid: false,
            title: ''
        },
        [personFormKeys.how_helped]: {
            invalid: false,
            title: ''
        },

    }

    const personFormInitialValues = {
        name: "",
        email: "",
        contact_number: "",
        city: "",
        zipcode: "",
        full_address: "",
        postal_area: "",
        is_caretaker: false,
        is_contact_person: false,
        is_family_member: false,
        is_guardian: false,
        "is_other": false,
        is_presented: false,
        "is_participated": false,
        "how_helped": "",
        "is_other_name": "",
        other_name: false,
        personal_number: ""
    };

    // redux hooks
    const labels = useSelector(state => state.Labels);
    const messages = useSelector(state => state.Labels);
    const UserLogin = useSelector(state => state.User.UserLogin);

    // Hooks
    const [personValidationObj, setPersonValidationObj] = React.useState({ ...initialPersonFormValidationObj });
    const [personFormValues, setPersonFormValues] = React.useState({ ...personFormInitialValues });
    // const [isPersonFormVisible, setIsPersonFormVisible] = React.useState(false);
    const [isEditable, setIsEditable] = React.useState(true);
    const [isValid, setIsValid] = React.useState(true);
    const [personList, setPersonList] = React.useState(props.personList ?? []);
    const [isLoading, setIsLoading] = React.useState(false);
    const [deleteInProgress, setDeleteInProgress] = React.useState(false);

    const [streetAddressSuggestion, setStreetAddressSuggestion] = React.useState([]);
    const [howHelpedSuggestion, setHowHelpedSuggestion] = React.useState([]);


    // helper methods
    const removeErrorTextForInputThatUserIsTyping = (uniqueKey) => {
        let tempValidationObj = { ...personValidationObj }
        tempValidationObj[uniqueKey] = initialPersonFormValidationObj[uniqueKey];
        setPersonValidationObj(tempValidationObj);
    }

    const handleInputChange = (value, key) => {
        setPersonFormValues({
            ...personFormValues,
            [key]: value,
        });
    };

    React.useEffect(() => {
        if (props.personFormToInitialValue) {
            setPersonFormValues({ ...personFormInitialValues })
            props.setPersonFormToInitialValue(false)
        }
    }, [props.isPersonFormVisible])

    const validation = () => {
        let validationObjTemp = { ...personValidationObj };
        let isValid = true;
        for (const [key, value] of Object.entries(validationObjTemp)) {
            // console.log(`${key}: ${value['invalid']}`);
            if (key == personFormKeys.how_helped) {
                if (personFormValues[personFormKeys.is_participated] && personFormValues[key] == '') {
                    value['invalid'] = true;
                    value['title'] = labels[key + '_required']
                    //console.log(labels[(key + '_required')]);
                    isValid = false;
                    break;
                }
                //return false;
            }
            else if (personFormValues[key] == '') {
                value['invalid'] = true;
                value['title'] = labels[key + '_required']
                //console.log(labels[(key + '_required')]);
                isValid = false;
                break;
                //return false;
            }
            else if (key == personFormKeys.email && !checkEmailFormat(ReplaceAll(personFormValues[key], ' ', ''))) {
                value['invalid'] = true;
                value['title'] = labels[key + '_invalid']
                //console.log(labels[(key + '_required')]);
                isValid = false;
                break;
                //return false;
            }
            else if (key == personFormKeys.contact_number && !checkMobileNumberFormat(ReplaceAll(personFormValues[key], ' ', ''))) {
                value['invalid'] = true;
                value['title'] = labels[key + '_invalid']
                //console.log(labels[(key + '_required')]);
                isValid = false;
                break;
                //return false;
            }
        }
        setPersonValidationObj(validationObjTemp);
        return isValid;
    }

    const addOrEditPersonAPI = async (personID) => {
        props.setIsLoading(true)
        let url = personID ? Constants.apiEndPoints.person + "/" + personID : Constants.apiEndPoints.person;
        let params = {
            ...personFormValues,
            contact_number: ReplaceAll(personFormValues.contact_number, ' ', ''),
            country_id: 209,
            patient_id: props.patient_id,
            personal_number: personFormValues.personal_number ? ReplaceAll(personFormValues.personal_number, '-', '') : '',
            // "ip_id": "",
            // "follow_up_id": "",
        }
        let response = {};
        if (personID)
            response = await APIService.putData(url, params, UserLogin.access_token, null, "EditPersonAPI");
        else
            response = await APIService.postData(url, params, UserLogin.access_token, null, "addPersonAPI");
        if (!response.errorMsg) {
            if (personFormValues.index !== undefined && personFormValues.index !== null) {
                personList.splice(personFormValues.index, 1, {
                    ...personFormValues,
                    country_id: 209,
                    id: response.data.payload.id,
                    // contact_number: ReplaceAll(personFormValues.contact_number, ' ', '')
                })
            }
            else {
                // console.log('personList', personList)
                personList.push({
                    ...personFormValues,
                    country_id: 209,
                    id: response.data.payload.id,
                    //contact_number: ReplaceAll(personFormValues.contact_number, ' ', '')
                })
            }
            setPersonList(personList)
            props.setIsPersonFormVisible(false)
            props.setIsLoading(false)
        }
        else {
            props.setIsLoading(false)
            Alert.showAlert(Constants.danger, response.errorMsg);
        }
    }

    const deletetPersonAPI = async (personID, index) => {
        setDeleteInProgress(true)
        let url = Constants.apiEndPoints.person + "/" + personID
        let response = {};
        response = await APIService.deleteData(url, UserLogin.access_token, null, "deletetPersonAPI");
        if (!response.errorMsg) {
            let tempPersonList = [...personList]
            tempPersonList.splice(index, 1)
            setPersonList(tempPersonList)
            Alert.showToast(messages.message_delete_success, Constants.success);
            setDeleteInProgress(false)
        }
        else {
            setDeleteInProgress(false)
            Alert.showAlert(Constants.danger, response.errorMsg);
        }
    }

    const personListRenderItem = ({ item, index }) => {
        //console.log('person--item------------', item)
        const labelText = firstLetterFromString(item[personFormKeys.name])
        return (
            <CommonCRUDCard
                inProgress={deleteInProgress}
                labelText={labelText}
                title={item[personFormKeys.name]}
                //showIcons={isEditable}
                showDeleteIcon={isEditable}
                showEditIcon={isEditable}
                //second_title={labels.email}
                second_title_value={item[personFormKeys.email]}
                //second_title_value_style={{ color: category_status_color[item.status] }}
                onPressEdit={() => {
                    // console.log("item", item)
                    props.setIsPersonFormVisible(true);
                    setPersonFormValues({
                        ...item, index: index,
                        other_name: item.is_other_name ? true : false
                    });
                }}
                onPressDelete={() => {
                    Alert.showDoubleAlert(Constants.warning, messages.message_delete_confirmation, () => {
                        if (props.crudByAPI)
                            deletetPersonAPI(item.id, index)
                        else {
                            let tempPersonList = [...personList]
                            tempPersonList.splice(index, 1)
                            setPersonList([...tempPersonList])
                            props.changePersonList ? props.changePersonList(tempPersonList) : null
                            Alert.showToast(messages.message_delete_success, Constants.success);
                        }
                    })
                }}
                extraBottomTitle={props.showIPSpecificFields ? labels.is_present : ""}
                extraBottomSecondTitle={props.showIPSpecificFields ? labels.is_participating : ""}
                is_present={item.is_presented}
                is_participating={item.is_participated}
            />
        )
    }

    const getBadWordString = () => {
        let array = [
            personFormValues.name, personFormValues.email,
            personFormValues.postal_area, personFormValues.city,
            personFormValues.is_other_name, personFormValues.how_helped,
            personFormValues.full_address
        ]
        let result = '';
        for (let i = 0; i < props?.badWords?.length; i++) {
            let currBadWord = props?.badWords[i]?.name?.toLowerCase();
            array.map((str) => {
                if (str?.toLowerCase()?.includes(currBadWord)) {
                    if (!result?.toLowerCase()?.includes(currBadWord))
                        result = result + props?.badWords[i]?.name + ", ";
                }
            })
        }
        if (result)
            result = result?.substring(0, result?.length - 2);
        return result;
    }

    const filterSuggestion = (query, setFilteredData) => {
        if (query) {
            // Making a case insensitive regular expression
            const regex = new RegExp(`${query.trim()}`, 'i');
            // Setting the filtered film array according the query
            if (setFilteredData)
                setFilteredData(props?.suggestion.filter((suggestion) => suggestion?.paragraph?.search(regex) >= 0))
        } else {
            // If the query is null then return blank
            if (setFilteredData)
                setFilteredData([])
        }
    }

    // render view
    // console.log('personList', personList)
    return (
        <View style={styles.mainView}>

            {/* <FormSubHeader
                leftIconName={"chevron-back-circle-outline"}
                onPressLeftIcon={() => { if (props.onPressBack) { props.onPressBack() } }}
                title={labels.personDetails}
                rightIconName={isEditable ? "person-add-outline" : ''}
                onPressRightIcon={() => { setPersonFormValues(personFormInitialValues); setIsPersonFormVisible(true) }}
            /> */}

            {!props.isPersonFormVisible ?
                <View>
                    {isEditable ? <View style={styles.buttonView}>
                        <View style={{ paddingHorizontal: Constants.globalPaddingHorizontal }}>
                            <TouchableOpacity
                                activeOpacity={isValid ? 0 : 1}
                                disabled={isValid ? false : true}
                                onPress={() => {
                                    if (props.onPressSave)
                                        props.onPressSave(true, [...personList])
                                    if (props.onPressBack)
                                        props.onPressBack([...personList])
                                }}
                                style={{
                                    ...styles.nextButton,
                                    backgroundColor: isValid ? Colors.primary : Colors.lightPrimary
                                }}>
                                <Text style={styles.normalText}>{props.labelOne ?? labels.skip_and_continue}</Text>
                            </TouchableOpacity>
                        </View>
                        <View>
                            <TouchableOpacity
                                activeOpacity={isValid ? 0 : 1}
                                disabled={isValid ? false : true}
                                onPress={() => {
                                    // console.log("===============================", personList)
                                    if (props.onPressSave)
                                        props.onPressSave(false, personList)
                                    if (props.onPressNext)
                                        props.onPressNext(personList)
                                }}
                                style={{
                                    ...styles.nextButton,
                                    backgroundColor: isValid ? Colors.primary : Colors.lightPrimary
                                }}>
                                <Text style={styles.normalText}>{props.labelTwo ?? labels.save}</Text>
                            </TouchableOpacity>
                        </View>

                    </View> : null}
                    <FlatList
                        ListEmptyComponent={<EmptyList messageIcon="user-plus" title={labels.persons_not_found} />}
                        data={personList}
                        renderItem={personListRenderItem}
                        keyExtractor={item => item.index}
                        contentContainerStyle={{ flex: 1, borderWidth: 0, paddingVertical: Constants.globalPaddingVetical, paddingHorizontal: Constants.globalPaddingHorizontal }}
                        showsVerticalScrollIndicator={false}
                    />
                </View>
                : null
            }

            {/* person Name */}
            {props.isPersonFormVisible ?
                <>
                    <InputValidation
                        uniqueKey={personFormKeys.name}
                        validationObj={personValidationObj}
                        value={personFormValues[personFormKeys.name]}
                        placeHolder={labels.name}
                        onChangeText={(text) => {
                            removeErrorTextForInputThatUserIsTyping(personFormKeys.name);
                            handleInputChange(text, personFormKeys.name)
                        }}
                        style={styles.InputValidationView}
                        inputStyle={styles.inputStyle}
                        editable={isEditable}

                    />

                    {/* personal number */}
                    <InputValidation
                        // uniqueKey={personFormKeys.name}
                        // validationObj={personValidationObj}
                        maskedInput={true}
                        keyboardType={'number-pad'}
                        mask={Constants.personal_number_format}
                        optional={true}
                        value={personFormValues[personFormKeys.personal_number]}
                        placeHolder={labels.personal_number}
                        onChangeText={(text) => {
                            handleInputChange(text, personFormKeys.personal_number)
                        }}
                        style={styles.InputValidationView}
                        inputStyle={styles.inputStyle}
                        editable={isEditable}
                    />

                    {/* Email */}
                    <InputValidation
                        uniqueKey={personFormKeys.email}
                        validationObj={personValidationObj}
                        value={personFormValues[personFormKeys.email]}
                        placeHolder={labels.Email}
                        onChangeText={(text) => {
                            removeErrorTextForInputThatUserIsTyping(personFormKeys.email);
                            handleInputChange(text, personFormKeys.email)
                        }}
                        style={{ marginTop: formFieldTopMargin }}
                        inputMainViewStyle={styles.InputValidationView}
                        inputStyle={styles.inputStyle}
                        editable={isEditable}
                        keyboardType={"email-address"}
                    />

                    {/* Contact Number */}
                    <InputValidation
                        maskedInput={true}
                        mask={Constants.phone_number_format}
                        keyboardType={'number-pad'}
                        uniqueKey={personFormKeys.contact_number}
                        validationObj={personValidationObj}
                        value={personFormValues[personFormKeys.contact_number]}
                        placeHolder={labels.contact_number}
                        onChangeText={(text) => {
                            removeErrorTextForInputThatUserIsTyping(personFormKeys.contact_number);
                            handleInputChange(text, personFormKeys.contact_number,)
                        }}
                        style={{ marginTop: formFieldTopMargin }}
                        inputMainViewStyle={styles.InputValidationView}
                        inputStyle={styles.inputStyle}
                        editable={isEditable}
                    />

                    {/* country */}
                    {/* <InputValidation
                        uniqueKey={personFormKeys.country}
                        validationObj={personValidationObj}
                        value={personFormValues[personFormKeys.country]['name'] ?? ''}
                        iconRight='chevron-down'
                        iconColor={Colors.primary}
                        editable={false}
                        onPressIcon={() => {
                            if (isEditable) {
                                setActionSheetDecide(personFormKeys.country);
                                //removeErrorTextForInputThatUserIsTyping(ipFormKeys.category);
                                actionSheetRef.current?.setModalVisible();
                            }
                        }}
                        placeHolder={labels.country}
                        style={{ marginTop: formFieldTopMargin }}
                        inputMainViewStyle={styles.InputValidationView}
                        inputStyle={styles.inputStyle}
                    //editable={isEditable}
                    /> */}

                    {/* street address */}
                    <InputValidation
                        uniqueKey={personFormKeys.full_address}
                        validationObj={personValidationObj}
                        dropDownListData={streetAddressSuggestion}
                        onPressDropDownListitem={(choosenSuggestion) => {
                            handleInputChange(choosenSuggestion, personFormKeys.full_address)
                            setStreetAddressSuggestion([])
                        }}
                        multiline={true}
                        value={personFormValues[personFormKeys.full_address]}
                        placeHolder={labels.full_address}
                        onChangeText={(text) => {
                            removeErrorTextForInputThatUserIsTyping(personFormKeys.full_address);
                            filterSuggestion(text, (filteredData) => { setStreetAddressSuggestion(filteredData) })
                            handleInputChange(text, personFormKeys.full_address)
                        }}
                        style={{ marginTop: formFieldTopMargin }}
                        inputMainViewStyle={styles.InputValidationView}
                        inputStyle={{ ...styles.inputStyle, height: 150, textAlignVertical: "top" }}
                        editable={isEditable}
                    />

                    {/* postal area */}
                    <InputValidation
                        maxLength={5}
                        keyboardType={'number-pad'}
                        uniqueKey={personFormKeys.postal_area}
                        // keyboardType={'number-pad'}
                        validationObj={personValidationObj}
                        value={personFormValues[personFormKeys.postal_area]}
                        placeHolder={labels.postal_area}
                        onChangeText={(text) => {
                            removeErrorTextForInputThatUserIsTyping(personFormKeys.postal_area);
                            handleInputChange(text, personFormKeys.postal_area)
                        }}
                        style={{ marginTop: formFieldTopMargin }}
                        inputMainViewStyle={styles.InputValidationView}
                        inputStyle={styles.inputStyle}
                        editable={isEditable}
                    />

                    {/* zipcode */}
                    <InputValidation
                        uniqueKey={personFormKeys.zipcode}
                        maxLength={5}
                        keyboardType={'number-pad'}
                        validationObj={personValidationObj}
                        value={personFormValues[personFormKeys.zipcode]}
                        placeHolder={labels.zipcode}
                        onChangeText={(text) => {
                            removeErrorTextForInputThatUserIsTyping(personFormKeys.zipcode);
                            handleInputChange(text, personFormKeys.zipcode)
                        }}
                        style={{ marginTop: formFieldTopMargin }}
                        inputMainViewStyle={styles.InputValidationView}
                        inputStyle={styles.inputStyle}
                        editable={isEditable}
                    />

                    {/* city */}
                    <InputValidation
                        uniqueKey={personFormKeys.city}
                        validationObj={personValidationObj}
                        value={personFormValues[personFormKeys.city]}
                        placeHolder={labels.city}
                        onChangeText={(text) => {
                            removeErrorTextForInputThatUserIsTyping(personFormKeys.city);
                            handleInputChange(text, personFormKeys.city)
                        }}
                        style={{ marginTop: formFieldTopMargin }}
                        inputMainViewStyle={styles.InputValidationView}
                        inputStyle={styles.inputStyle}
                        editable={isEditable}
                    />


                    {/* other name  */}
                    <View style={styles.checkBoxView}>
                        <BouncyCheckbox
                            size={20}
                            fillColor={Colors.primary}
                            unfillColor={Colors.white}
                            iconStyle={{ borderColor: Colors.primary }}
                            isChecked={personFormValues.other_name}
                            onPress={(value) => {
                                // handleInputChange( value, personFormKeys.other_name);
                                setPersonFormValues({
                                    ...personFormValues,
                                    [personFormKeys.other_name]: value,
                                });
                            }}
                        />
                        <Text style={styles.saveAsTemplate}>{labels.other_name}</Text>
                    </View>
                    {
                        personFormValues.other_name
                            ? <InputValidation
                                // uniqueKey={personFormKeys.is_other_name}
                                // validationObj={personValidationObj}
                                value={personFormValues[personFormKeys.is_other_name]}
                                placeHolder={labels.is_other_name}
                                optional={true}
                                onChangeText={(text) => {
                                    // removeErrorTextForInputThatUserIsTyping(personFormKeys.is_other_name);
                                    handleInputChange(text, personFormKeys.is_other_name)
                                }}
                                style={{ marginTop: formFieldTopMargin }}
                                inputMainViewStyle={styles.InputValidationView}
                                inputStyle={styles.inputStyle}
                                editable={isEditable}
                            /> : null
                    }


                    {/* checkbox Family member */}
                    {!personFormValues.is_contact_person
                        ? <View style={styles.checkBoxView}>
                            <BouncyCheckbox
                                size={20}
                                fillColor={Colors.primary}
                                unfillColor={Colors.white}
                                iconStyle={{ borderColor: Colors.primary }}
                                isChecked={personFormValues.is_family_member}
                                onPress={(value) => {
                                    // handleInputChange( value, personFormKeys.is_family_member);
                                    setPersonFormValues({
                                        ...personFormValues,
                                        [personFormKeys.is_contact_person]: value ? false : personFormValues.is_contact_person,
                                        [personFormKeys.is_family_member]: value,
                                    });
                                }}
                            />
                            <Text style={styles.saveAsTemplate}>{labels.is_family_member}</Text>
                        </View> : null}

                    {/* checkbox Caretaker */}
                    {!personFormValues.is_contact_person
                        ? <View style={styles.checkBoxView}>
                            <BouncyCheckbox
                                size={20}
                                fillColor={Colors.primary}
                                unfillColor={Colors.white}
                                iconStyle={{ borderColor: Colors.primary }}
                                isChecked={personFormValues.is_caretaker}
                                onPress={(value) => {
                                    setPersonFormValues({
                                        ...personFormValues,
                                        [personFormKeys.is_contact_person]: value ? false : personFormValues.is_contact_person,
                                        [personFormKeys.is_caretaker]: value,
                                    });
                                }}
                            />
                            <Text style={styles.saveAsTemplate}>{labels.is_caretaker}</Text>
                        </View> : null}

                    {/* checkbox Contact Person */}
                    {(!personFormValues.is_family_member && !personFormValues.is_caretaker)
                        ? <View style={styles.checkBoxView}>
                            <BouncyCheckbox
                                size={20}
                                fillColor={Colors.primary}
                                unfillColor={Colors.white}
                                iconStyle={{ borderColor: Colors.primary }}
                                isChecked={personFormValues.is_contact_person}
                                onPress={(value) => {
                                    setPersonFormValues({
                                        ...personFormValues,
                                        [personFormKeys.is_contact_person]: value,
                                        [personFormKeys.is_family_member]: value ? false : personFormValues.is_family_member,
                                        [personFormKeys.is_caretaker]: value ? false : personFormValues.is_caretaker,
                                    });
                                }}
                            />
                            <Text style={styles.saveAsTemplate}>{labels.is_contact_person}</Text>
                        </View> : null}

                    {/* checkbox is guardian */}
                    {(props.shouldGuardianCheckBoxVisible)
                        ? <View style={styles.checkBoxView}>
                            <BouncyCheckbox
                                size={20}
                                fillColor={Colors.primary}
                                unfillColor={Colors.white}
                                iconStyle={{ borderColor: Colors.primary }}
                                isChecked={personFormValues.is_guardian}
                                onPress={(value) => {
                                    handleInputChange(value, personFormKeys.is_guardian)
                                }}
                            />
                            <Text style={styles.saveAsTemplate}>{labels.is_guardian}</Text>
                        </View> : null}

                    {
                        props.showIPSpecificFields
                            ? <>
                                <View style={styles.checkBoxView}>
                                    <BouncyCheckbox
                                        size={20}
                                        fillColor={Colors.primary}
                                        unfillColor={Colors.white}
                                        iconStyle={{ borderColor: Colors.primary }}
                                        isChecked={personFormValues.is_presented}
                                        onPress={(value) => {
                                            //  handleInputChange(value, personFormKeys.is_presented)
                                            setPersonFormValues({
                                                ...personFormValues,
                                                [personFormKeys.is_presented]: value,
                                                [personFormKeys.is_participated]: false,
                                                [personFormKeys.how_helped]: ""
                                            });
                                        }}
                                    />
                                    <Text style={styles.saveAsTemplate}>{labels.is_present}</Text>
                                </View>

                                {personFormValues.is_presented
                                    ? <View style={styles.checkBoxView}>
                                        <BouncyCheckbox
                                            size={20}
                                            fillColor={Colors.primary}
                                            unfillColor={Colors.white}
                                            iconStyle={{ borderColor: Colors.primary }}
                                            isChecked={personFormValues.is_participated}
                                            onPress={(value) => {
                                                // handleInputChange(value, personFormKeys.is_participated)
                                                setPersonFormValues({
                                                    ...personFormValues,
                                                    [personFormKeys.is_participated]: value,
                                                    [personFormKeys.how_helped]: ""
                                                });
                                            }}
                                        />
                                        <Text style={styles.saveAsTemplate}>{labels.is_participating}</Text>
                                    </View> : null}

                                {/* participating in what way */}
                                {personFormValues.is_participated
                                    ? <InputValidation
                                        uniqueKey={personFormKeys.how_helped}
                                        dropDownListData={howHelpedSuggestion}
                                        onPressDropDownListitem={(choosenSuggestion) => {
                                            handleInputChange(choosenSuggestion, personFormKeys.how_helped)
                                            setHowHelpedSuggestion([])
                                        }}
                                        validationObj={personValidationObj}
                                        multiline={true}
                                        value={personFormValues[personFormKeys.how_helped]}
                                        placeHolder={labels.participating_in_what_way}
                                        onChangeText={(text) => {
                                            removeErrorTextForInputThatUserIsTyping(personFormKeys.how_helped);
                                            filterSuggestion(text, (filteredData) => { setHowHelpedSuggestion(filteredData) })
                                            handleInputChange(text, personFormKeys.how_helped)
                                        }}
                                        style={{ marginTop: formFieldTopMargin }}
                                        inputMainViewStyle={styles.InputValidationView}
                                        inputStyle={{ ...styles.inputStyle, height: 150, textAlignVertical: "top" }}
                                    /> : null}
                            </>
                            : null
                    }

                    {/* Button View */}
                    <View style={styles.buttonView}>
                        <View>
                            <TouchableOpacity
                                activeOpacity={isValid ? 0 : 1}
                                disabled={isValid ? false : true}
                                onPress={() => {
                                    // props.setPersonFormToInitialValue(true)
                                    setPersonFormValues({ ...personFormInitialValues })
                                    props.setIsPersonFormVisible(false)
                                }}
                                style={{
                                    ...styles.nextButton,
                                    backgroundColor: isValid ? Colors.primary : Colors.lightPrimary
                                }}>
                                <Text style={styles.normalText}>{labels.cancel}</Text>
                            </TouchableOpacity>
                        </View>
                        <View>
                            <TouchableOpacity
                                activeOpacity={isValid ? 0 : 1}
                                disabled={isValid ? false : true}
                                onPress={() => {
                                    if (validation()) {
                                        if (props.validationBeforeAdding) {
                                            if (!props.validationBeforeAdding(personFormValues)) {
                                                return;
                                            }
                                        }
                                        // console.log('Validation true')
                                        let badWordString = getBadWordString();
                                        if (badWordString) {
                                            Alert.showBasicDoubleAlertForBoth(badWordString, () => {
                                                if (props.crudByAPI) {
                                                    let personID = personFormValues.index !== undefined && personFormValues.index !== null ? personList[personFormValues.index].id : null
                                                    addOrEditPersonAPI(personID)
                                                }
                                                else {
                                                    if (personFormValues.index !== undefined && personFormValues.index !== null) {
                                                        personList.splice(personFormValues.index, 1, {
                                                            ...personFormValues,
                                                            // country_id: personFormValues[personFormKeys.country]['id'] ?? '' 
                                                            country_id: 209,
                                                            contact_number: ReplaceAll(personFormValues.contact_number, ' ', '')
                                                        })
                                                    }
                                                    else {
                                                        personList.push({
                                                            ...personFormValues,
                                                            // country_id: personFormValues[personFormKeys.country]['id'] ?? ''
                                                            country_id: 209,
                                                            contact_number: ReplaceAll(personFormValues.contact_number, ' ', '')
                                                        })
                                                    }
                                                    setPersonList(personList)
                                                    props.setIsPersonFormVisible(false)
                                                }
                                            }, null, messages.message_bad_word_alert)
                                        }
                                        else {
                                            if (props.crudByAPI) {
                                                let personID = personFormValues.index !== undefined && personFormValues.index !== null ? personList[personFormValues.index].id : null
                                                addOrEditPersonAPI(personID)
                                            }
                                            else {
                                                if (personFormValues.index !== undefined && personFormValues.index !== null) {
                                                    personList.splice(personFormValues.index, 1, {
                                                        ...personFormValues,
                                                        // country_id: personFormValues[personFormKeys.country]['id'] ?? '' 
                                                        country_id: 209,
                                                        contact_number: ReplaceAll(personFormValues.contact_number, ' ', '')
                                                    })
                                                }
                                                else {
                                                    personList.push({
                                                        ...personFormValues,
                                                        // country_id: personFormValues[personFormKeys.country]['id'] ?? ''
                                                        country_id: 209,
                                                        contact_number: ReplaceAll(personFormValues.contact_number, ' ', '')
                                                    })
                                                }
                                                setPersonList(personList)
                                                props.setIsPersonFormVisible(false)
                                            }
                                        }
                                    }
                                    else {
                                        Alert.showAlert(Constants.warning, messages.message_fill_all_required_fields)
                                        // console.log('Validation false')
                                    }
                                    //setViewDecider(2)
                                }}
                                style={{
                                    ...styles.nextButton,
                                    backgroundColor: isValid ? Colors.primary : Colors.lightPrimary
                                }}>
                                <Text style={styles.normalText}>{labels.Add}</Text>
                            </TouchableOpacity>
                        </View>

                    </View>
                </> : null
            }

        </View >

    );
};

const styles = StyleSheet.create({
    impMessageText: {
        fontSize: getProportionalFontSize(10),
        marginTop: 5,
        color: Colors.gray,
        fontFamily: Assets.fonts.bold,
    },
    buttonView: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-evenly'
    },
    headingText: {
        fontSize: getProportionalFontSize(24),
        // marginTop: 10,
        color: Colors.primary,
        fontFamily: Assets.fonts.bold,
        // marginLeft: 16,
        // width: '80%',
        borderWidth: 0,
        //justifyContent: 'center'
    },
    mainView: {
        flex: 1,
        paddingHorizontal: Constants.globalPaddingHorizontal
    },
    imageLogin: { width: '100%', height: 200, marginTop: 30 },
    formHeaderContainer: {
        flexDirection: 'row',
        width: "100%",
        borderWidth: 0,
        alignItems: 'center',
        justifyContent: 'space-between',
        alignContent: 'center',
        height: 40,
        paddingHorizontal: Constants.globalPaddingHorizontal
    },

    leftView: {
        width: '12%',
        height: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        alignContent: 'center',
        borderWidth: 0,
    },
    rightView: {
        width: '12%',
        height: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        alignContent: 'center',
        borderWidth: 0,
    },
    centerView: {
        width: '75%',
        height: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        alignContent: 'center',
        borderWidth: 0,
    },

    welcomeText: {
        fontSize: getProportionalFontSize(13),
        color: Colors.black,
        fontFamily: Assets.fonts.bold
    },
    InputValidationView: {
        backgroundColor: Colors.transparent,
        //borderColor: 'red',
        marginTop: Constants.formFieldTopMargin,
        //borderRadius: 10,
        //color: 'red'
    },
    nextButton: {
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: 40,
        borderRadius: 5,
        paddingHorizontal: 16,
        backgroundColor: Colors.primary,
        marginVertical: 16
    },
    normalText: {
        color: Colors.white,
        fontFamily: Assets.fonts.bold,
        fontSize: getProportionalFontSize(15)
    },
    inputStyle: {
        fontSize: getProportionalFontSize(15),
        borderColor: Colors.borderColor,
        backgroundColor: Colors.white
    },
    checkBoxView: { flexDirection: 'row', alignItems: 'center', marginTop: 30 },
    saveAsTemplate: { fontSize: getProportionalFontSize(13), fontFamily: Assets.fonts.regular }

});

