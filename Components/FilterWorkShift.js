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


import { getProportionalFontSize, CurruntDate, formatDateByFormat, getActionSheetAPIDetail, formatDate, formatTime, placeholderCreator, checkUrlFormat, checkFileSize, reverseFormatDate, formatTimeForAPI } from '../Services/CommonMethods';
import BouncyCheckbox from 'react-native-bouncy-checkbox';

const { width, height } = Dimensions.get('window');
const formFieldTopMargin = Constants.formFieldTopMargin;



const FilterModalComp = (props) => {
    const { labels, onRequestClose, UserLogin } = props;

    // Immutable Variables
    const formFieldsKeys = {
        "shift_end_time": "shift_end_time",
        "shift_start_time": "shift_start_time",
        "shift_name": "shift_name",

    }
    const initialKeys = {
        // company_types: "", //
        name: 'name',//
        // status: "status",
        shift_end_time: "shift_end_time",
        shift_start_time: "shift_start_time",
        shift_name: "shift_name",
        shiftType: 'shiftType',
    }

    const initialValues = {
        name: "",
        title: "",
        shift_end_time: "",
        shift_start_time: "",
        shift_name: "",
        shiftType: {},
        // shiftType: "",
        // name: "",
    }
    const handleInputChange = (key, value) => {
        setFormFields({ ...formFields, [key]: value })
    }
    //Hooks
    const actionSheetRef = React.useRef();
    // useState hooks
    const [formFields, setFormFields] = React.useState({ ...initialValues });
    const [isLoading, setIsLoading] = React.useState(false);
    const [actionSheetDecide, setActionSheetDecide] = React.useState('');
    const [openDatePicker, setOpenDatePicker] = React.useState(false);
    const [mode, setMode] = React.useState('date')
    const [datePickerKey, setDatePickerKey] = React.useState('');
    const shiftTypeDataArr = [
        { name: props.labels.Basic, id: 1 },
        { name: props.labels.emergency, id: 2 },
    ];

    const [shiftTypeAS, setShiftTypeAS] = React.useState(
        getActionSheetAPIDetail({
            url: '',
            debugMsg: '',
            token: '',
            selectedData: [],
            data: shiftTypeDataArr,
        }),
    );




    React.useEffect(() => {
        setFormFields({ ...formFields, ...props.param })

    }, [])

    React.useEffect(() => {
        if (props.workShiftItem) {
            setFormFields({
                ...formFields,
                "shiftName": props.workShiftItem?.shift_name ?? '',
                "shiftType": props.workShiftItem?.shift_type ? shiftTypeObjWhileGetting[props.workShiftItem?.shift_type?.toLowerCase()] : " ",
                "fromDate": props.workShiftItem?.shift_start_time ? getJSObjectFromTimeString(props.workShiftItem?.shift_start_time) : " ",
                "toDate": props.workShiftItem?.shift_end_time ? getJSObjectFromTimeString(props.workShiftItem?.shift_end_time) : " ",
                "color": props.workShiftItem?.shift_color,

            })
            setShiftTypeAS({
                ...shiftTypeAS,
                selectedData: [
                    shiftTypeObjWhileGetting[props.workShiftItem?.shift_type?.toLowerCase()],
                ],
            });
        }
    }, [])

    const getAPIDetails = () => {
        switch (actionSheetDecide) {
            case initialKeys.shiftType: {
                return shiftTypeAS;
            }
            default: {
                return null;
            }
        }
    };

    const changeAPIDetails = (payload) => {
        switch (actionSheetDecide) {
            case initialKeys.shiftType: {
                setShiftTypeAS(getActionSheetAPIDetail({ ...shiftTypeAS, ...payload }));
                break;
            }
            default: {
                break;
            }
        }
    };

    const onPressItem = item => {
        switch (actionSheetDecide) {
            case initialKeys.shiftType: {
                handleInputChange(initialKeys.shiftType, item);

                // removeErrorTextForInputThatUserIsTyping(empFormKeys.shiftType);
                break;
            }
            default: {
                break;
            }
        }
    };


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

                    {/* title */}
                    <InputValidation
                        // uniqueKey={formFieldsKeys.title}
                        // validationObj={validationForActivityDetails}
                        value={formFields.shift_name}
                        placeHolder={labels["title"]}
                        optional={true}
                        iconColor={Colors.primary}
                        onChangeText={(text) => {
                            // removeErrorTextForInputThatUserIsTyping(task_details, formFieldsKeys.title);
                            handleInputChange(formFieldsKeys.shift_name, text)
                        }}
                        style={{ marginTop: Constants.formFieldTopMargin }}
                        inputMainViewStyle={styles.InputValidationView}
                        inputStyle={styles.inputStyle}
                    />

                    <InputValidation
                        // uniqueKey={initialKeys.shiftType}
                        // validationObj={validationObj}
                        optional={true}
                        value={formFields?.shiftType?.name ?? ''}
                        placeHolder={props.labels.shift_type}
                        iconRight="chevron-down"
                        iconColor={Colors.primary}
                        editable={false}
                        onPressIcon={() => {
                            // removeErrorTextForInputThatUserIsTyping(initialKeys.shiftType)
                            setActionSheetDecide(initialKeys.shiftType);
                            actionSheetRef.current?.setModalVisible();
                        }}
                        style={styles.InputValidationView}
                        inputStyle={styles.inputStyle}
                    />

                    <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>

                        {/* Start time */}
                        <InputValidation
                            // uniqueKey={initialKeys.start_time}
                            // validationObj={validationObj}
                            iconRight="time"
                            value={formFields?.start_time ? formatTime(formFields.start_time) : ""}
                            placeHolder={labels['start-time']}
                            optional={true}
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

                            "shift_name": formFields.shift_name ?? " ",
                            "shift_start_time": formFields.shift_start_time ? formatTime(formFields.shift_start_time) : " ",
                            "shift_end_time": formFields.shift_end_time ? formatTime(formFields.shift_end_time) : " ",
                            // "shift_color": formFields.color,
                            "shift_type": formFields.shiftType ?? "",
                            "entry_mode": "0"

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
                    keyToShowData={actionSheetDecide == formFieldsKeys.implementation_plan ? "title" : "name"}
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

            <ActionSheet ref={actionSheetRef}>
                <ActionSheetComp
                    // title={labels[actionSheetDecide]}
                    title={"Gender"}
                    closeActionSheet={closeActionSheet}
                    // keyToShowData="name"
                    // keyToShowData={empFormKeys.roles ?  "se_name"  :"name"}
                    keyToShowData={"name"}
                    keyToCompareData="id"

                    // multiSelect
                    APIDetails={getAPIDetails()}
                    changeAPIDetails={payload => {
                        changeAPIDetails(payload);
                    }}

                    onPressItem={item => {
                        // console.log("000000", item)
                        onPressItem(item);
                    }}
                />
            </ActionSheet>

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