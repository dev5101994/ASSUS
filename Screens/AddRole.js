import React, { useState, useRef, useEffect } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    ScrollView,
    FlatList
} from 'react-native';
import Colors from '../Constants/Colors';
import Assets from '../Assets/Assets';
import {
    getProportionalFontSize,
    getActionSheetAPIDetail,
} from '../Services/CommonMethods';
import InputValidation from '../Components/InputValidation';
import { Checkbox } from 'react-native-paper';
import APIService from '../Services/APIService';
import Constants from '../Constants/Constants';
import ProgressLoader from '../Components/ProgressLoader';
import { useSelector, } from 'react-redux';
import ActionSheet from 'react-native-actions-sheet';
import ActionSheetComp from '../Components/ActionSheetComp';
import Alert from '../Components/Alert';
import FormSubHeader from '../Components/FormSubHeader';
import CommonAPIFunctions from '../Services/CommonAPIFunctions';

export default AddRole = props => {

    //uniqueKeys
    const formKeys = {
        role_name: 'role_name',
        user_type: 'user_type',
        permissions: 'permissions',
    }

    // Immutable Variables
    const initialFirstViewValidationObj = {
        [formKeys.role_name]: {
            invalid: false,
            title: '',
        },
        [formKeys.user_type]: {
            invalid: false,
            title: '',
        },
        [formKeys.permissions]: {
            invalid: false,
            title: '',
        },
    };

    // Hooks
    const actionSheetRef = useRef();

    // REDUX hooks
    const labels = useSelector(state => state.Labels);
    const UserLogin = useSelector(state => state.User.UserLogin);
    const messages = useSelector(state => state.Labels);
    const permissions = UserLogin?.permissions ?? {};

    //initialValues
    const formInitialValues = {
        role_name: '',
        user_type: { name: labels.employee, id: 3 },
        permissions: [],
    }

    // useState hooks
    const [firstViewValidationObj, setFirstViewValidationObj] = useState({
        ...initialFirstViewValidationObj,
    });
    const [formValues, setFormValues] = useState({
        ...formInitialValues,
    });
    const [isLoading, setIsLoading] = useState(false);
    const [actionSheetDecide, setActionSheetDecide] = useState('');
    const [userTypeAS, setUserTypeAS] = React.useState(getActionSheetAPIDetail({
        // url: Constants.apiEndPoints.userTypePermission, params: { user_type_id: '6' }, debugMsg: "patient-list", token: UserLogin.access_token, perPage: Constants.perPage,
        selectedData: [{ name: labels.employee, id: 3 }],
        data: [{ name: labels.employee, id: 3 }, { name: labels.patient, id: 6 }]
    }));

    // BadWords & Suggetion

    const [suggestion, setSuggestion] = React.useState([]);
    const [badWords, setBadWords] = React.useState([]);

    // useEffect hooks
    React.useEffect(() => {
        CommonAPIFunctions.getSuggestions(UserLogin.access_token, (data) => { setSuggestion(data) });
        CommonAPIFunctions.getBadWords(UserLogin.access_token, (data) => { setBadWords(data) });
        // userDetailAPI()

    }, [])

    const getBadWordString = () => {
        let result = '';
        for (let i = 0; i < badWords?.length; i++) {
            let currBadWord = badWords[i]?.name?.toLowerCase();

            if (formValues?.role_name?.toLowerCase()?.includes(currBadWord)
                || formValues?.description?.toLowerCase()?.includes(currBadWord)

            ) {
                if (!result?.toLowerCase()?.includes(currBadWord))
                    result = result + badWords[i]?.name + ", ";
            }
        }
        if (result)
            result = result?.substring(0, result?.length - 2);
        return result;
    }

    // useEffect hooks
    useEffect(() => {
        if (props?.route?.params?.itemID)
            getRoleDetail();
        else
            getUserPermissions()
    }, []);

    const handleInputChange = (value, key) => {
        setFormValues({
            ...formValues,
            [key]: value,
        });
    };

    const closeActionSheet = () => {
        setActionSheetDecide('');
        actionSheetRef?.current?.setModalVisible();
    };

    const removeErrorTextForInputThatUserIsTyping = (uniqueKey) => {
        let tempValidationObj = { ...firstViewValidationObj };
        tempValidationObj[uniqueKey] = initialFirstViewValidationObj[uniqueKey];
        setFirstViewValidationObj(tempValidationObj);
    };

    const validation = () => {
        let validationObjTemp = { ...firstViewValidationObj };
        let isValid = true;
        //  console.log('validationObjTemp===', JSON.stringify(validationObjTemp))
        for (const [key, value] of Object.entries(validationObjTemp)) {
            // console.log(`${key}: ${ipFormValues[key]}`);
            if (key == formKeys.user_type) {
                if (!formValues[key]?.name) {
                    value['invalid'] = true;
                    value['title'] = labels['required_field']
                    isValid = false;
                    break;
                }
            }
            else if (!formValues[key]) {
                // console.log('key', key)
                value['invalid'] = true;
                value['title'] = labels['required_field']
                isValid = false;
                break;
            }
        }
        setFirstViewValidationObj({ ...validationObjTemp });
        return isValid;
    };

    const getAPIDetails = () => {
        switch (actionSheetDecide) {
            case formKeys.user_type: {
                return userTypeAS;
            }
            default: {
                return null;
            }
        }
    };

    const changeAPIDetails = payload => {
        switch (actionSheetDecide) {
            case formKeys.user_type: {
                setUserTypeAS(
                    getActionSheetAPIDetail({ ...userTypeAS, ...payload }),
                );
                break;
            }
            default: {
                break;
            }
        }
    };

    const onPressItem = item => {
        switch (actionSheetDecide) {
            case formKeys.user_type: {
                // handleInputChange(item, formKeys.user_type);
                removeErrorTextForInputThatUserIsTyping(formKeys.user_type);
                getUserPermissions(item.id, {
                    [formKeys.user_type]: item
                })
                break;
            }
            default: {
                break;
            }
        }
    };

    const saveOrEditRole = async () => {
        let permissionArr = [];
        formValues.permissions.map((item) => {
            item.permissions?.map((item) => {
                if (item.checked)
                    permissionArr.push(item.id)
            })
        })
        if (permissionArr?.length <= 0) {
            Alert.showAlert(Constants.warning, labels.select_permissions)
            return;
        }
        setIsLoading(true);
        let url = Constants.apiEndPoints.role;
        if (props?.route?.params?.itemID)
            url = url + "/" + props?.route?.params?.itemID
        let params = {
            permissions: permissionArr,
            se_name: formValues.role_name,
            user_type_id: formValues?.user_type?.id,
        }
        let response = {}
        if (props?.route?.params?.itemID) {
            response = await APIService.putData(url, params, UserLogin.access_token, null, "editRole");
        }
        else
            response = await APIService.postData(url, params, UserLogin.access_token, null, "saveROLE");

        if (!response.errorMsg) {
            setIsLoading(false);
            Alert.showAlert(Constants.success, props?.route?.params?.itemID ? labels.role_updated_msg : labels.role_saved_msg, () => { props.navigation.pop() })
        }
        else {
            setIsLoading(false);
            Alert.showAlert(Constants.danger, response.errorMsg);
        }
    }

    const getRoleDetail = async () => {
        if (!props?.route?.params?.itemID)
            return;
        setIsLoading(true);
        let url = Constants.apiEndPoints.role + "/" + props?.route?.params?.itemID;
        let response = await APIService.getData(url, UserLogin.access_token, null, "getRoleDetail");
        if (!response.errorMsg) {
            let user_type = {}
            // console.log('response.data.payload.user_type_id', response.data.payload.user_type_id)
            userTypeAS?.data?.map((item) => {
                if (item.id == response.data.payload.user_type_id)
                    user_type = item;
            })
            // setFormValues({
            //     ...formValues,
            //     [formKeys.role_name]: response.data.payload.se_name,
            //     [formKeys.user_type]: user_type
            // })
            // console.log('user_type', user_type)
            getUserPermissions(user_type.id,
                {
                    [formKeys.role_name]: response.data.payload.se_name,
                    [formKeys.user_type]: user_type
                },
                response.data.payload
            )
            // setIsLoading(false);
        }
        else {
            setIsLoading(false);
            Alert.showAlert(Constants.danger, response.errorMsg);
        }
    }

    const getUserPermissions = async (user_type_id, obj, editData) => {
        if (!editData)
            setIsLoading(true);
        let url = Constants.apiEndPoints.userTypePermission;
        let params = {
            belongs_to: 2,
            user_type_id: (user_type_id !== null && user_type_id !== undefined) ? user_type_id : 3
        }
        let response = await APIService.postData(url, params, UserLogin.access_token, null, "getUserPermissions");
        if (!response.errorMsg) {
            const selected = []
            const permission = {}
            response?.data?.payload?.forEach((per) => {
                if (permission[per?.permission?.group_name] === undefined) {
                    permission[per?.permission?.group_name] = []
                }
                if (per?.permission?.entry_mode === "required") {
                    selected.push(per?.permission?.id)
                }
                permission[per?.permission?.group_name].push(per?.permission);
            })

            let permissionArr = []
            for (const [key, value] of Object.entries(permission)) {
                permissionArr.push({
                    name: '' + key,
                    permissions: value
                })
            }
            if (editData) {
                permissionArr.map((outer_item) => {
                    outer_item.permissions.map((item => {
                        editData?.permissions.map((inner_item) => {
                            if (inner_item.id == item.id) {
                                // console.log('INSide+++++++++++++++++++++++++====')
                                item['checked'] = true;
                            }
                        })
                    }))
                })
            }
            if (!obj) {
                handleInputChange(permissionArr, formKeys.permissions)
            }
            else {
                setFormValues({
                    ...formValues,
                    [formKeys.permissions]: permissionArr,
                    ...obj
                });
            }
            setIsLoading(false);
        }
        else {
            setIsLoading(false);
            Alert.showAlert(Constants.danger, response.errorMsg);
        }
    }

    const flatListRenderItem = ({ item, index }) => {
        let outer_index = index;
        return (
            <View style={{}}>
                <Text style={{
                    color: Colors.gray,
                    fontFamily: Assets.fonts.semiBold,
                    fontSize: getProportionalFontSize(14),
                    marginTop: Constants.formFieldTopMargin
                }}>{item.name?.length > 0 ? (item.name?.charAt(0).toUpperCase() + item.name.substring(1, item.name.length)) : ''}</Text>

                <View style={{ height: 0, width: "100%", borderWidth: 0.5, marginVertical: 5, borderColor: Colors.placeholderTextColor }} />

                <FlatList
                    data={item.permissions ?? []}
                    numColumns={2}
                    renderItem={({ item, index }) => {

                        return (
                            <View style={styles.checkBoxView}>
                                <Checkbox
                                    color={Colors.primary}
                                    status={item['checked'] ? 'checked' : 'unchecked'}
                                    onPress={() => {
                                        // console.log('inner_index', inner_index)
                                        let tempPermissionsArr = [...formValues.permissions]
                                        tempPermissionsArr[outer_index]['permissions'][index]['checked'] = !item['checked'];
                                        handleInputChange(tempPermissionsArr, formKeys.permissions);
                                    }}
                                />
                                <Text style={{
                                    color: Colors.gray,
                                    fontFamily: Assets.fonts.semiBold,
                                    fontSize: getProportionalFontSize(12),
                                }}>{item.se_name}</Text>
                            </View>
                        )
                    }}
                    keyExtractor={item => '' + item.id}
                    showsVerticalScrollIndicator={false}
                    style={{}}
                    contentContainerStyle={{}}
                />
            </View>
        )
    }

    //console.log('formValues.permissions', formValues.permissions);

    // render view
    if (isLoading)
        return <ProgressLoader />;

    return (
        <BaseContainer
            title={labels["add-role"]}
            onPressLeftIcon={() => {
                props.navigation.pop();
            }}
            titleStyle={styles.headingText}
            leftIcon="arrow-back"
            leftIconSize={24}
            leftIconColor={Colors.primary}>

            {/* <FormSubHeader
                title={
                    labels.assign_permission_message
                }
                titleNumberOfLines={5}
            /> */}

            <ScrollView style={{ flex: 1, }}>
                {/* Main View */}

                <View style={styles.mainView}>

                    {/* user type */}
                    <InputValidation
                        uniqueKey={formKeys.user_type}
                        validationObj={firstViewValidationObj}
                        value={formValues.user_type?.name ?? ''}
                        placeHolder={labels["user-types"]}
                        iconRight="chevron-down"
                        iconColor={Colors.primary}
                        editable={false}
                        onPress={() => {
                            removeErrorTextForInputThatUserIsTyping(formKeys.user_type,);
                            setActionSheetDecide(formKeys.user_type);
                            actionSheetRef.current?.setModalVisible();
                        }}
                        style={styles.InputValidationView}
                        inputStyle={styles.inputStyle}
                    />

                    {/* role name */}
                    <InputValidation
                        uniqueKey={formKeys.role_name}
                        validationObj={firstViewValidationObj}
                        value={formValues.role_name ?? ''}
                        placeHolder={labels["role-name"]}
                        editable={true}
                        onChangeText={(text) => {
                            removeErrorTextForInputThatUserIsTyping(formKeys.role_name);
                            handleInputChange(text, formKeys.role_name);
                        }}
                        style={styles.InputValidationView}
                        inputStyle={styles.inputStyle}
                    />

                    <Text style={[styles.normalText, { marginTop: 20 }]}>{labels["Permissions"]}</Text>

                    <FlatList
                        data={formValues.permissions}
                        // numColumns={2}
                        renderItem={flatListRenderItem}
                        keyExtractor={(item, index) => '' + index}
                        showsVerticalScrollIndicator={false}
                        style={{}}
                        contentContainerStyle={{ marginBottom: 40 }}
                    />

                    {/* {
                        formValues.permissions.map((item, index) => {
                            return flatListRenderItem({ item, index });
                        })
                    } */}

                </View>

            </ScrollView>

            {/* save button */}
            <TouchableOpacity
                onPress={() => {
                    if (validation()) {
                        let badWordString = getBadWordString();
                        if (badWordString) {
                            Alert.showBasicDoubleAlertForBoth(badWordString, () => {
                                saveOrEditRole()

                            }, null, messages.message_bad_word_alert)
                        }
                        else {
                            saveOrEditRole()
                        }
                        // alert("badWordfound")
                    }
                    else {
                        Alert.showAlert(Constants.warning, messages.message_fill_all_required_fields)
                        // console.log('validation fail');
                    }
                    // if (formFields.documents?.length > 0) {
                    //     if (formFields.documents[0]?.editedSameFile) {
                    //         saveOrEditTask(formFields.documents[0]?.fileName ?? formFields.documents[0]?.name)
                    //     }
                    //     else {
                    //         let fileName = await uploadFile();
                    //         if (fileName)
                    //             saveOrEditTask(fileName)
                    //     }
                    // }
                    // else {
                    //     saveOrEditRole()
                    // }



                }}
                style={styles.floatingSaveButton}>
                <Text style={[styles.normalText, { color: Colors.white }]}>{labels["save"]}</Text>
            </TouchableOpacity>

            <ActionSheet ref={actionSheetRef}>
                <ActionSheetComp
                    title={labels[actionSheetDecide]}
                    closeActionSheet={closeActionSheet}
                    keyToShowData={"name"}
                    keyToCompareData="id"
                    APIDetails={getAPIDetails()}
                    changeAPIDetails={payload => {
                        changeAPIDetails(payload);
                    }}
                    onPressItem={item => {
                        onPressItem(item);
                    }}
                />
            </ActionSheet>
        </BaseContainer>
    );
};

const styles = StyleSheet.create({
    rowStyle: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: Constants.formFieldTopMargin },
    buttonView: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-evenly',
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
        paddingHorizontal: Constants.globalPaddingHorizontal,
        paddingBottom: 15,
    },
    imageLogin: { width: '100%', height: 200, marginTop: 30 },
    welcomeText: {
        fontSize: getProportionalFontSize(24),
        marginTop: 30,
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
    floatingSaveButton: { justifyContent: "center", alignItems: "center", height: 35, width: 150, backgroundColor: Colors.primary, borderRadius: 20, position: "absolute", bottom: 10, right: 5 }
    ,
    nextButton: {
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: 40,
        borderRadius: 5,
        backgroundColor: Colors.secondary,
        marginTop: Constants.formFieldTopMargin,
    },
    normalText: {
        color: Colors.primary,
        fontFamily: Assets.fonts.bold,
        fontSize: getProportionalFontSize(15),
    },
    inputStyle: {
        fontSize: getProportionalFontSize(16),
        borderColor: Colors.borderColor,
        backgroundColor: Colors.white,
    },
    checkBoxView: { flexDirection: 'row', alignItems: 'center', },
    saveAsTemplate: {
        fontSize: getProportionalFontSize(13),
        fontFamily: Assets.fonts.regular,
    },
    radioButtons: {
        // color: Colors.placeholderTextColor,
        // fontFamily: Assets.fonts.regular,
    },
    radioButtonView: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 15,
    },
    radioButtonLabel: {
        fontFamily: Assets.fonts.regular,
        fontSize: getProportionalFontSize(15),
    },
});
