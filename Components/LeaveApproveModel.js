import { StyleSheet, Text, View, ScrollView, FlatList } from 'react-native'
import React, { useRef, useState } from 'react';
import LottieView from 'lottie-react-native';
// import Can from '../can/Can';
import { getProportionalFontSize, getActionSheetAPIDetail, reverseFormatDate } from '../Services/CommonMethods';
import Assets from '../Assets/Assets';
import Colors from '../Constants/Colors';
import Constants from '../Constants/Constants';
import Alert from './Alert';
import APIService from '../Services/APIService';
import ActionSheet from 'react-native-actions-sheet';
import ActionSheetComp from '../Components/ActionSheetComp';
import CustomButton from './CustomButton';
import Icon from 'react-native-vector-icons/MaterialIcons';

const LeaveApproveModel = (props) => {
    const { labels, UserLogin, LeaveDetails, onRequestClose, refreshPage, isUserHasModule } = props;

    const initialKeys = {
        "approve_by": "approve_by",
        "notify_employees": "notify_employees",
        "employee_type": "employee_type",
        "leaves": "leaves",
        "employee": "employee"
    }
    const initialValues = {
        "notify_employees": "",
        "approve_by": {},
        flatListData: LeaveDetails.leaves ?? [],
        "employee_type": []
    }
    const approvedByDataArr = [
        { name: labels["assign-employee"], id: 1 },
        { name: labels["notifie-employee"], id: 2 },
    ];
    const empTypeDataArr = [
        { name: labels["seasonal"], id: 1 },
        { name: labels["regular"], id: 2 },
        { name: labels["substitute"], id: 3 },
        { name: labels["other"], id: 4 },
    ];

    // Hooks
    const actionSheetRef = useRef();
    const [btnLoader, setBtnLoader] = React.useState(false);
    const [formValues, setFormValues] = React.useState({ ...initialValues });
    const [actionSheetDecide, setActionSheetDecide] = useState('');
    const [approvedByAS, setapprovedByAS] = React.useState(getActionSheetAPIDetail({
        url: '', debugMsg: '', token: '', selectedData: [], data: approvedByDataArr,
    }));
    const [empTypeAS, setempTypeAS] = React.useState(getActionSheetAPIDetail({
        url: '', debugMsg: '', token: '', selectedData: [], data: empTypeDataArr,
    }));
    const [employeeAS, setEmployeeAS] = React.useState(getActionSheetAPIDetail({
        url: Constants.apiEndPoints.userList, params: { user_type_id: '3', "branch_id": LeaveDetails?.user?.branch_id, }, debugMsg: "employee-list", token: UserLogin.access_token, perPage: Constants.perPage,
        selectedData: []
    }));
    const [flatListDataArr, setflatListDataArr] = React.useState({
        index: "",
        key: ""
    });
    // console.log("formValues", JSON.stringify(formValues))

    const approvalLeave = async () => {
        if (isUserHasModule) {
            let totalLeaves = [];
            formValues.flatListData.map((obj) => {
                totalLeaves.push(
                    {
                        "leave_id": obj?.id,
                        "employee_id": obj?.employee?.id
                    }
                )
            })
            let empType = [];
            formValues.employee_type.map((obj) => {
                empType.push(obj.id)
            })

            let params = {
                "leave_group_id": LeaveDetails.leave_group_id ?? "",
                "notify_employees": formValues.approve_by.id == 1 ? false : true,
                "employee_type": empType,
                "leaves": formValues.approve_by.id == 1 ? totalLeaves : null
            }
            let url = Constants.apiEndPoints.leaves_approve
            // console.log("url", url);
            // console.log("params", params);
            // return
            setBtnLoader(true);
            let response = response = await APIService.postData(url, params, UserLogin.access_token, null, "saveOV");
            if (!response.errorMsg) {
                // console.log("payload getUserDetails", response);
                Alert.showAlert(Constants.success, Constants.success, () => { onRequestClose(); refreshPage() })
            }
            else {
                setBtnLoader(true);
                Alert.showBasicAlert(response.errorMsg);
            }
        } else {
            setBtnLoader(true);
            let url = Constants.apiEndPoints["leaves-approve-by-group-id"] + "/" + LeaveDetails.leave_group_id;
            // console.log("url", url);
            // return
            let response = await APIService.getData(url, UserLogin.access_token, null, "approveLeave");
            if (!response.errorMsg) {
                setBtnLoader(false);
                // console.log("payload getUserDetails", response);
                // onRequestClose();
                // refreshPage();
                Alert.showAlert(Constants.success, Constants.success, () => { onRequestClose(); refreshPage() })

            }
            else {
                setBtnLoader(false);
                Alert.showAlert(Constants.danger, response.errorMsg);
            }
        }

    }
    const handleInputChange = (value, key) => {
        setFormValues({
            ...formValues,
            [key]: value,
        });
    };
    const getAPIDetails = () => {
        switch (actionSheetDecide) {
            case initialKeys.approve_by: {
                return approvedByAS;
            }
            case initialKeys.employee: {
                return employeeAS;
            }
            case initialKeys.employee_type: {
                return empTypeAS;
            }
            default: {
                return null;
            }
        }
    };

    const changeAPIDetails = payload => {
        switch (actionSheetDecide) {
            case initialKeys.approve_by: {
                setapprovedByAS(getActionSheetAPIDetail({ ...approvedByAS, ...payload }));
                break;
            }
            case initialKeys.employee: {
                setEmployeeAS(getActionSheetAPIDetail({ ...employeeAS, ...payload }));
                break;
            }
            case initialKeys.employee_type: {
                setempTypeAS(getActionSheetAPIDetail({ ...empTypeAS, ...payload }));
                break;
            }
            default: {
                return null;
            }
        }
    };

    const onPressItem = item => {
        switch (actionSheetDecide) {
            case initialKeys.approve_by: {
                setFormValues({ ...initialValues, approve_by: item })
                setempTypeAS({
                    ...empTypeAS, selectedData: [],
                })
                // removeErrorTextForInputThatUserIsTyping(initialKeys.approve_by);
                break;
            }
            case initialKeys.employee: {
                let tempData = [...formValues.flatListData];
                tempData[flatListDataArr.index][flatListDataArr.key] = item;
                setFormValues({ ...formValues, ["flatListData"]: tempData })
                break;
            }
            case initialKeys.employee_type: {
                handleInputChange(item, initialKeys.employee_type);
                // removeErrorTextForInputThatUserIsTyping(initialKeys.approve_by);
                break;
            }
            default: {
                break;
            }
        }
    };


    const closeActionSheet = () => {
        setActionSheetDecide('');
        actionSheetRef?.current?.setModalVisible();
    };
    const renderItems = ({ item, index }) => {
        // console.log("item-------", item)
        return (
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>

                {/*date */}
                <InputValidation
                    // uniqueKey={formFieldsKeys.start_time}
                    // validationObj={validationForTimeAndRepetition}
                    // iconRight="time"
                    optional={true}
                    value={item?.shift_date ? reverseFormatDate(item?.shift_date) : ""}
                    placeHolder={labels['start-date']}
                    style={{ ...styles.InputValidationView, width: "35%" }}
                    inputStyle={{ ...styles.inputStyle }}
                    editable={false}
                />


                {/* empl;oyee */}
                <InputValidation
                    iconRight="chevron-down"
                    optional={true}
                    value={item?.employee?.name ?? ""}
                    placeHolder={labels['employee']}
                    onPressIcon={() => {
                        setflatListDataArr({
                            index: index,
                            key: "employee"
                        })
                        setActionSheetDecide(initialKeys.employee);
                        actionSheetRef.current?.setModalVisible();
                    }}
                    style={{ ...styles.InputValidationView, width: "60%" }}
                    inputStyle={{ ...styles.inputStyle }}
                    editable={false}
                />
            </View>
        )
    }
    return (
        isUserHasModule
            ? <View style={{
                marginTop: 10,
                marginHorizontal: 20,
                // width: "100%",
                maxHeight: "100%"
            }}>

                {/* close icon */}
                <View style={{ width: "100%", alignItems: "flex-end" }} >
                    <Icon name='cancel' color={Colors.primary} size={30} onPress={onRequestClose ? () => onRequestClose() : () => { }} />
                </View>

                {/* <Text style={styles.titleStyle}>{isEditing ? labels.editLeave ?? "Leave" : labels.create_Leave ?? "Leave"}</Text> */}
                <ActionSheet ref={actionSheetRef}>
                    <ActionSheetComp
                        title={labels[actionSheetDecide]}
                        closeActionSheet={closeActionSheet}
                        // keyToShowData="name"
                        // keyToShowData={initialKeys.roles ?  "se_name"  :"name"}
                        keyToShowData={"name"}
                        keyToCompareData="id"

                        multiSelect={actionSheetDecide == initialKeys.employee_type ? true : false}
                        APIDetails={getAPIDetails()}
                        changeAPIDetails={payload => {
                            changeAPIDetails(payload);
                        }}
                        onPressItem={item => {
                            onPressItem(item);
                        }}
                    />
                </ActionSheet>
                <ScrollView>
                    <InputValidation
                        optional={true}
                        value={formValues.approve_by?.name ?? ''}
                        placeHolder={labels["approved-by"]}
                        iconRight="chevron-down"
                        iconColor={Colors.primary}
                        editable={false}
                        onPressIcon={() => {
                            setActionSheetDecide(initialKeys.approve_by);
                            actionSheetRef.current?.setModalVisible();
                        }}
                        style={styles.InputValidationView}
                        inputStyle={styles.inputStyle}
                    />
                    {
                        formValues.approve_by?.id == 2
                            ? <View>
                                <InputValidation
                                    optional={true}
                                    value={formValues.employee_type?.name ?? ''}
                                    placeHolder={labels["employee-type"] ?? "emp type"}
                                    iconRight="chevron-down"
                                    iconColor={Colors.primary}
                                    editable={false}
                                    onPressIcon={() => {
                                        setActionSheetDecide(initialKeys.employee_type);
                                        actionSheetRef.current?.setModalVisible();
                                    }}
                                    style={styles.InputValidationView}
                                    inputStyle={styles.inputStyle}
                                />
                                <MSDataViewer
                                    data={formValues.employee_type}
                                    // keyName={"designation"}
                                    setNewDataOnPressClose={(newArr) => {
                                        setempTypeAS({ ...empTypeAS, selectedData: newArr });
                                        handleInputChange(newArr, initialKeys.employee_type)
                                    }}
                                />
                            </View>
                            : formValues.approve_by?.id == 1
                                ? <View>
                                    <FlatList
                                        data={formValues.flatListData}
                                        renderItem={renderItems}
                                        keyExtractor={(item, index) => index}
                                    />
                                </View>
                                : null
                    }
                </ScrollView>
                <CustomButton
                    onPress={approvalLeave}
                    // isLoading={paginationLoading}
                    title={labels.approve}
                    style={{ ...styles.loadMoreButton, backgroundColor: props.listBarColor ?? Colors.primary }} />

            </View>

            : <View style={{
                marginTop: 10,
                marginHorizontal: 20,
                // width: "100%"
                // height: "100%"
            }}>
                {/* close icon */}
                <View style={{ width: "100%", alignItems: "flex-end" }} >
                    <Icon name='cancel' color={Colors.primary} size={30} onPress={onRequestClose ? () => onRequestClose() : () => { }} />
                </View>

                {/* <Text style={styles.titleStyle}>{isEditing ? labels.editLeave ?? "Leave" : labels.create_Leave ?? "Leave"}</Text> */}
                <View style={{
                    width: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                    // marginTop: -10
                }}>
                    <LottieView
                        source={require('../Assets/images/i.json')}
                        autoPlay
                        loop={true}
                        style={{
                            width: "20%",
                        }}
                    />
                    <Text style={{ fontFamily: Assets.fonts.semiBold, fontSize: getProportionalFontSize(16), color: Colors.primary }}>{labels["approve"]}?</Text>
                    <Text style={{ fontFamily: Assets.fonts.regular, fontSize: getProportionalFontSize(11), color: Colors.primary }}>{labels["you-wont-be-able-to-revert-this"]}</Text>
                </View>
                <View style={{ flexDirection: "row", width: '100%', justifyContent: "space-around", marginTop: 10 }}>
                    <CustomButton
                        style={{ ...styles.nextButton, backgroundColor: Colors.white, }}
                        titleStyle={{ color: Colors.primary, fontFamily: Assets.fonts.medium, }}
                        onPress={() => { onRequestClose() }}
                        title={labels["no"]}
                    />

                    <CustomButton
                        isLoading={btnLoader}
                        style={{ ...styles.nextButton, backgroundColor: Colors.primary, marginLeft: 10, }}
                        titleStyle={{ fontFamily: Assets.fonts.medium, }}
                        onPress={() => { approvalLeave() }}
                        title={labels["yes"]} />
                </View>
            </View>

    )
}

export default LeaveApproveModel

const styles = StyleSheet.create({
    nextButton: {
        justifyContent: 'center',
        alignItems: 'center',
        width: "35%",
        paddingHorizontal: 16,
        backgroundColor: Colors.primary,
        marginVertical: 16,
        marginVertical: 0, marginTop: Constants.formFieldTopMargin,
        borderColor: Colors.primary,
        borderWidth: 2,
        minHeight: 30
    },
    checkBoxTitle: {
        fontSize: getProportionalFontSize(15),
        fontFamily: Assets.fonts.semiBold,
        color: Colors.primary
    },
    InputValidationView: {
        backgroundColor: Colors.transparent,
        //borderColor: 'red',
        marginTop: 15,
        //borderRadius: 10,
        //color: 'red'
    },
    inputStyle: {
        fontSize: getProportionalFontSize(16),
        borderColor: Colors.borderColor,
        backgroundColor: Colors.white,
    },
    loadMoreButton: { marginTop: Constants.formFieldTopMargin, width: "100%", alignSelf: "center", }
})