import { StyleSheet, Text, View, Dimensions, ScrollView, FlatList, TouchableOpacity } from 'react-native'
import React from 'react'
import { BarChart, LineChart } from "react-native-chart-kit";
import Constants from '../Constants/Constants';
import APIService from '../Services/APIService';
import { Divider, FAB, Portal, Modal } from 'react-native-paper';
import { useSelector, useDispatch } from 'react-redux';
import Alert from '../Components/Alert';
import Colors from '../Constants/Colors';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Assets from '../Assets/Assets';
import moment from 'moment';
import Entypo from 'react-native-vector-icons/Entypo';
import DatePicker from 'react-native-date-picker';
import { getProportionalFontSize, getActionSheetAPIDetail, formatDate, formatTime, placeholderCreator, checkUrlFormat, checkFileSize, getJSObjectFromTimeString } from '../Services/CommonMethods';
import ActionSheet from "react-native-actions-sheet";
import ActionSheetComp from './ActionSheetComp';

// import moment from 'moment';

const { width, height } = Dimensions.get("window")

const FilterModalCompForDeviationStates = (props) => {
    const { UserLogin } = props
    const initialValues = {
        start_date: "",
        end_date: "",
        patient: {}
    }
    //Hooks
    const actionSheetRef = React.useRef();
    //hooks
    const [formValues, setFormValues] = React.useState({ ...initialValues })
    const [openDatePicker, setOpenDatePicker] = React.useState(false);
    const [mode, setMode] = React.useState('');
    const [datePickerKey, setDatePickerKey] = React.useState(null);
    const [actionSheetDecide, setActionSheetDecide] = React.useState('');
    const [patientListAS, setPatientListAS] = React.useState(getActionSheetAPIDetail({
        url: Constants.apiEndPoints.userList, params: { user_type_id: '6' }, debugMsg: "patientListAS", token: UserLogin.access_token,
        selectedData: [],
    }));
    const handleInputChange = (value, key) => {
        setFormValues({
            ...formValues,
            [key]: value
        })
    }
    // console.log("eeee", formValues)
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
                    <InputValidation
                        iconRight="calendar"
                        iconColor={Colors.primary}
                        editable={false}
                        isIconTouchable={true}
                        onPressIcon={() => {
                            setMode(Constants.DatePickerModes.date_mode);
                            setDatePickerKey("start_date");
                            setOpenDatePicker(true);
                        }}
                        value={formValues.start_date ? formatDate(formValues.start_date) : ''}
                        placeHolder={props.labels.startDate}
                        style={styles.InputValidationView}
                        inputStyle={styles.inputStyle}
                    />
                    {formValues.start_date ? (
                        <InputValidation
                            iconRight="calendar"
                            iconColor={Colors.primary}
                            editable={false}
                            isIconTouchable={true}
                            onPressIcon={() => {
                                setMode(Constants.DatePickerModes.date_mode);
                                setDatePickerKey("end_date");
                                setOpenDatePicker(true);
                            }}
                            value={formValues.end_date ? formatDate(formValues.end_date) : ''}
                            placeHolder={props.labels.endDate}
                            style={styles.InputValidationView}
                            inputStyle={styles.inputStyle}
                        />
                    ) : null}
                    {/* patient */}
                    <InputValidation
                        placeHolder={props.labels.patient}
                        value={formValues.patient?.name ?? ""}
                        iconRight='chevron-down'
                        iconColor={Colors.primary}
                        editable={false}
                        onPressIcon={() => {
                            // setActionSheetDecide("patient")
                            actionSheetRef.current?.setModalVisible()
                        }}
                        style={{ marginTop: Constants.formFieldTopMargin, }}
                        inputMainViewStyle={styles.InputValidationView}
                        inputStyle={styles.inputStyle}
                    />

                    <View style={{
                        width: "100%",
                        flexDirection: "row",
                        justifyContent: "space-between"
                    }}>
                        <CustomButton
                            onPress={() => { setFormValues({ ...initialValues }); setPatientListAS({ ...patientListAS, selectedData: [] }) }}
                            title={props.labels.clear_filter}
                            style={{ ...styles.loadMoreButton, backgroundColor: Colors.transparent, borderWidth: 2, borderColor: Colors.primary }}
                            titleStyle={{ color: Colors.primary }}
                        />
                        <CustomButton
                            onPress={() => {
                                alert("we r working on it !!");
                                //  console.log("-------------------", JSON.stringify(formValues))

                            }}
                            title={props.labels.apply}
                            style={{ ...styles.loadMoreButton, }}
                        />
                    </View>

                </ScrollView>

                <DatePicker
                    modal
                    mode={mode}
                    open={openDatePicker}
                    minimumDate={
                        mode == Constants.DatePickerModes.date_mode ? new Date() : null
                    }
                    date={new Date()}
                    onConfirm={date => {
                        setOpenDatePicker(false);
                        // console.log('date : ', date);
                        let value = '';
                        if (mode == Constants.DatePickerModes.date_mode)
                            handleInputChange(date, datePickerKey);
                        else if (mode == Constants.DatePickerModes.time_mode)
                            handleInputChange(date, datePickerKey);
                        else handleInputChange(date, datePickerKey);
                    }}
                    onCancel={() => {
                        setOpenDatePicker(false);
                    }}
                />

                <ActionSheet ref={actionSheetRef}>
                    <ActionSheetComp
                        title={props.labels[actionSheetDecide]}
                        closeActionSheet={closeActionSheet}
                        keyToShowData={"name"}
                        keyToCompareData="id"

                        multiSelect={false}
                        APIDetails={patientListAS}
                        changeAPIDetails={(payload) => setPatientListAS(getActionSheetAPIDetail({ ...patientListAS, ...payload }))}
                        onPressItem={(item) => handleInputChange(item, "patient")}
                    />
                </ActionSheet>
            </View>
        </View>
    )
}

export default FilterModalCompForDeviationStates



const styles = StyleSheet.create({
    //new data
    container: {
        flex: 1,
        // marginLeft: 10
        // borderWidth: 2,
        // borderColor: "red",
        minHeight: Dimensions.get("window").height,
        paddingTop: 20,
        // paddingHorizontal: Constants.globalPaddingHorizontal,
    },
    title: {

        fontSize: getProportionalFontSize(16),
        fontFamily: Assets.fonts.semiBold,
        color: Colors.primary,
    },
    chartContainer: {
        // width: "100%",
        shadowOffset: { width: 3, height: 3, },
        shadowOpacity: 10,
        elevation: 5,
        shadowColor: Platform.OS == "ios" ? Colors.shadowColorIosDefault : Colors.shadowColorAndroidDefault,
        shadowRadius: 10,
        backgroundColor: Colors.white,
        padding: Constants.globalPaddingHorizontal,
        marginVertical: 10,
        borderRadius: 10,
        marginHorizontal: Constants.globalPaddingHorizontal,
    },
    modalMainView: {
        backgroundColor: 'transparent', flex: 1, justifyContent: "center", alignItems: "center", paddingHorizontal: 16
    },
    innerView: { width: width - Constants.globalPaddingHorizontal * 3, minHeight: 300, backgroundColor: Colors.backgroundColor, paddingVertical: 15, paddingHorizontal: 16, borderRadius: 20 },
    loadMoreButton: { marginTop: Constants.formFieldTopMargin, width: "40%", alignSelf: "center", }
})

