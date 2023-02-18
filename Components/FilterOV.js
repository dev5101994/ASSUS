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
import { RadioButton, Modal, Portal } from "react-native-paper";
// import moment from 'moment';


import { getProportionalFontSize, CurruntDate, formatDateByFormat, getActionSheetAPIDetail, formatDate, formatTime, placeholderCreator, checkUrlFormat, checkFileSize, reverseFormatDate, formatTimeForAPI } from '../Services/CommonMethods';
import BouncyCheckbox from 'react-native-bouncy-checkbox';

const { width, height } = Dimensions.get('window');
const formFieldTopMargin = Constants.formFieldTopMargin;



const FilterModalComp = (props) => {

    const { labels, onRequestClose, UserLogin } = props;

    // initialValues

    const initialValues = {

        // name: "",
        title: "",
        // status: "",
        shift_end_time: "",
        start_time: "",
        end_time: "",



    }
    // const [formFieldsKeys, setFormFieldsKeyformFieldsKeys] = React.useState({ ...initialKeys });
    const initialKeys = {
        // company_types: "", //
        title: 'title',//
        // status: "status",
        end_time: "end_time",
        start_time: "start_time",
        // shift_name: "shift_name",
    }




    //Hooks
    const actionSheetRef = React.useRef();
    // useState hooks
    const [actionSheetDecide, setActionSheetDecide] = React.useState('');
    const [openDatePicker, setOpenDatePicker] = React.useState(false);
    const [mode, setMode] = React.useState('date')
    const [datePickerKey, setDatePickerKey] = React.useState('');







    const [formFields, setFormFields] = React.useState({ ...initialValues });


    const [isLoading, setIsLoading] = React.useState(false);

    // Immutable Variables
    const formFieldsKeys = {


        "end_time": "end_time",
        "start_time": "start_time",
        // "start_time": ['00:00'],
        "title": "title",

    }
    // console.log("111111111111111111111111", formFields)

    // const initialValidationObj = {

    // }
    // const [validationObj, setValidationObj] = React.useState({ ...initialValidationObj });
    React.useEffect(() => {
        setFormFields({ ...formFields, ...props.param })

    }, [])




    const getAPIDetails = () => {

        switch (actionSheetDecide) {


            default: {
                return null
            }
        }
    }

    const changeAPIDetails = (payload) => {
        switch (actionSheetDecide) {

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



            // case formFieldsKeys.status: {
            //     handleInputChange(formFieldsKeys.status, item)
            //     // removeErrorTextForInputThatUserIsTyping(formFieldsKeys.status)
            //     break;
            // }
            default: {
                break;
            }
        }
    }




    const closeActionSheet = () => {
        actionSheetRef?.current?.setModalVisible();
        setActionSheetDecide('');
    }
    // let params = {
    //     "end_time": formFields?.end_time ? moment(formFields?.end_time).format('hh:mm:ss') : "",
    //     "start_time": formFields?.start_time ? moment(formFields?.start_time).format('hh:mm:ss') : "",
    //     "title": formFields?.title ?? "",
    // }


    // const getdateFormate = (text) => {
    //     return text.sb(0, 10)
    // }


    return (

        <View style={styles.modalMainView}>
            <View style={styles.innerView}>
                {/* close icon */}
                <Icon name='cancel' color={Colors.primary} size={30} onPress={props.onRequestClose} />
                <ScrollView showsVerticalScrollIndicator={false} style={{ maxHeight: height * 0.7, }}>









                    {/* title */}
                    <InputValidation
                        optional={true}
                        // uniqueKey={formFieldsKeys.title}
                        // validationObj={validationForActivityDetails}
                        value={formFields.title}
                        placeHolder={labels["title"]}
                        iconColor={Colors.primary}
                        onChangeText={(text) => {
                            // removeErrorTextForInputThatUserIsTyping(task_details, formFieldsKeys.title);
                            handleInputChange(formFieldsKeys.title, text)
                        }}
                        style={{ marginTop: Constants.formFieldTopMargin }}
                        inputMainViewStyle={styles.InputValidationView}
                        inputStyle={styles.inputStyle}
                    />



                    <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>

                        {/* Start time */}
                        <InputValidation
                            optional={true}
                            // uniqueKey={initialKeys.start_time}
                            // validationObj={validationObj}
                            iconRight="time"
                            value={formFields?.start_time ? formatTime(formFields.start_time) : ""}
                            // value={formFields?.start_time ? getdateFormate(formFields.start_time) : ""}
                            placeHolder={labels['start-time']}
                            onPressIcon={() => {
                                setMode(Constants.DatePickerModes.time_mode)
                                setDatePickerKey("start_time")
                                setOpenDatePicker(true)
                            }}
                            style={{ ...styles.InputValidationView, width: "48%" }}
                            inputStyle={{ ...styles.inputStyle }}
                            editable={false}
                        />

                        {/* end time */}
                        <InputValidation
                            iconRight="time"
                            optional={true}
                            value={formFields.end_time ? formatTime(formFields.end_time) : ""}
                            placeHolder={labels['end-time']}

                            onPressIcon={() => {
                                setMode(Constants.DatePickerModes.time_mode)
                                setDatePickerKey("end_time")
                                setOpenDatePicker(true)
                            }}
                            style={{ ...styles.InputValidationView, width: "48%" }}
                            inputStyle={{ ...styles.inputStyle }}
                            editable={false}
                        />
                    </View>
                    {/* <InputValidation
                        // uniqueKey={initialKeys.start_date}
                        // validationObj={validationForTimeAndRepetition}
                        iconRight='calendar'
                        iconColor={Colors.primary}
                        editable={false}
                        onPressIcon={() => {
                            // removeErrorTextForInputThatUserIsTyping(time_and_repetition, initialKeys.start_date)
                            setOpenDatePicker(true);
                            setMode(Constants.DatePickerModes.date_mode);
                            setDatePickerKey(initialKeys.start_date)
                        }}
                        value={formFields.start_date ? reverseFormatDate(formFields.start_date) : ''}
                        placeHolder={props.labels.date}
                        style={styles.InputValidationView}
                        inputStyle={styles.inputStyle}
                    /> */}







                </ScrollView>

                {/* save button */}
                {/* <View style={{ width: "100%", flexDirection: "row", justifyContent: "center" }}> */}
                <View style={styles.bar}>


                    <CustomButton
                        onPress={() => {
                            setFormFields({ ...initialValues })
                            // console.log("-----------op ", formFields)
                        }}
                        isLoading={isLoading}
                        title={labels.clear}
                        // style={{ marginTop: 10, minWidth: 290 }}
                        style={styles.baar} />


                    <DatePicker
                        modal
                        mode={mode}
                        open={openDatePicker}
                        date={new Date()}
                        minimumDate={formFields.start_time ? formFields.start_time : null}
                        onConfirm={(date) => {
                            setOpenDatePicker(false)
                            // console.log('date : ', date)
                            let value = '';
                            if (mode == Constants.DatePickerModes.date_mode) {
                                handleInputChange(datePickerKey, date)
                            }
                            else if (mode == Constants.DatePickerModes.time_mode) {
                                handleInputChange(datePickerKey, date)
                                // removeErrorTextForInputThatUserIsTyping(datePickerKey)
                            }
                            else
                                handleInputChange(datePickerKey, date)
                        }}
                        onCancel={() => {
                            setOpenDatePicker(false)
                        }}
                    />












                    <CustomButton onPress={() => {
                        // console.log("formFields", JSON.stringify(formFields.patient))
                        props.setParam({
                            ...props.param,

                            // "shift_name": formFields.shift_name ?? " ",
                            // "shift_start_time": formFields.shift_start_time ? formatTime(formFields.shift_start_time) : " ",
                            // "shift_end_time": formFields.shift_end_time ? formatTime(formFields.shift_end_time) : " ",
                            // // "shift_color": formFields.color,
                            // "entry_mode": "0",
                            "title": formFields.title ?? "",
                            "end_time": formFields?.end_time ? formatTimeForAPI(formFields?.end_time) : "",
                            "start_time": formFields?.start_time ? formatTimeForAPI(formFields?.start_time) : "",


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
                    keyToShowData={actionSheetDecide == formFieldsKeys.implementation_plan ? "title" : "title"}
                    keyToCompareData="id"

                    // multiSelect
                    APIDetails={getAPIDetails()}
                    changeAPIDetails={(payload) => changeAPIDetails(payload)}
                    onPressItem={(item) => onPressItem(item)}
                />

            </ActionSheet>


            {/* Modal */}
            <Portal>
                <Modal
                    animationType="slide"
                    transparent={true}
                    style={{ justifyContent: 'center', alignItems: 'center' }}
                    // visible={isModalVisible}
                    onRequestClose={() => {
                        setIsModalVisible(false);
                    }}>
                    <View style={{ padding: 20 }}>

                        <CustomButton
                            onPress={() => {
                                setIsModalVisible(false);
                            }}
                            title={props.labels.done}
                            style={{ marginTop: 20 }}
                        />
                    </View>
                </Modal>
            </Portal>

        </View >
    )
}





export default FilterModalComp
const styles = StyleSheet.create({
    modalMainView: {
        backgroundColor: 'transparent', justifyContent: "center", alignItems: "center", paddingHorizontal: 16
    },
    innerView: { width: '100%', minHeight: 300, backgroundColor: Colors.backgroundColor, paddingVertical: 15, paddingHorizontal: 16, borderRadius: 20, },
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