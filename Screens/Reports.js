import { StyleSheet, Text, View, Dimensions, ScrollView, ActivityIndicator } from 'react-native'
import React, { useState, useEffect, useRef } from 'react';
import { firstLetterFromString, getProportionalFontSize, getActionSheetAPIDetail, reverseFormatDate } from '../Services/CommonMethods';
import { useSelector, useDispatch } from 'react-redux';
import Constants from '../Constants/Constants';
import ListLoader from '../Components/ListLoader';
import Colors from '../Constants/Colors';
import ActionSheet from 'react-native-actions-sheet';
import ActionSheetComp from '../Components/ActionSheetComp';
import { BarChart, LineChart, StackedBarChart } from "react-native-chart-kit";
import APIService from '../Services/APIService';
import { Divider, FAB, Portal, Modal } from 'react-native-paper';
import Alert from '../Components/Alert';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Assets from '../Assets/Assets';
import moment from 'moment';
import Entypo from 'react-native-vector-icons/Entypo';
import DatePicker from 'react-native-date-picker';

const screenWidth = Dimensions.get("window").width - getProportionalFontSize(80);

const Reports = (props) => {
    const initialKeys = {
        "employee": "employee",

    }
    const initialKeys1 = {
        start_date: "start_date",
        end_date: "end_date",
        "employee1": "employee1"

    }
    const initialValues = {
        "employee": []

    }
    const initialValues1 = {

        start_date: "",
        end_date: "",
        "employee1": {}
    }


    const dispatch = useDispatch();
    const isInternetActive = useSelector(state => state.IsInternetActive);
    const UserLogin = useSelector(state => state.User.UserLogin);
    const labels = useSelector(state => state.Labels);
    const messages = useSelector(state => state.Labels);
    const permissions = UserLogin?.permissions ?? {}

    // Hooks
    const actionSheetRef = React.useRef();
    const [isLoading, setIsLoading] = React.useState(false);
    const [chartDate, setChartData] = React.useState([])
    const [chartLabels, setChartLabels] = React.useState([]);
    const [actionSheetDecide, setActionSheetDecide] = useState('');
    const [screenWidth_chart, setScreenWidth_chart] = useState(screenWidth)
    const [screenWidth_chart1, setScreenWidth_chart1] = useState(screenWidth)
    // console.log("screenWidth_chart", screenWidth_chart);
    // console.log("screenWidth_chart1", screenWidth_chart1);
    const [chartDate1, setChartData1] = React.useState([])
    const [chartLabels1, setChartLabels1] = React.useState([]);
    const [showReport, setShowReport] = React.useState(false);
    const [showState, setShowState] = React.useState(false);
    const [openDatePicker, setOpenDatePicker] = React.useState(false);
    const [mode, setMode] = React.useState(Constants.DatePickerModes.date_mode);
    const [datePickerKey, setDatePickerKey] = React.useState(null);
    const [formValues, setFormValues] = React.useState({ ...initialValues });
    const [formValues1, setFormValues1] = React.useState({ ...initialValues1 });
    const [chartLoader, setChartLoader] = useState(true)
    const [chartLoader1, setChartLoader1] = useState(true)
    const [employeeAS, setEmployeeAS] = React.useState(getActionSheetAPIDetail({
        url: Constants.apiEndPoints.userList, params: { user_type_id: '3', }, debugMsg: "employee-list", token: UserLogin.access_token, perPage: Constants.perPage,
        selectedData: []
    }));
    const [employeeAS1, setEmployeeAS1] = React.useState(getActionSheetAPIDetail({
        url: Constants.apiEndPoints.userList, params: { user_type_id: '3', }, debugMsg: "employee-list", token: UserLogin.access_token, perPage: Constants.perPage,
        selectedData: []
    }));
    // const [chartLabels]
    const data = {
        labels: chartLabels,
        data: [
            ...chartDate
        ],
        barColors: [Colors.gray, Colors.primary, Colors.aqua, Colors.yellow, Colors.red]
    };
    const data1 = {
        labels: chartLabels1,
        data: [
            ...chartDate1
        ],
        barColors: [Colors.gray, Colors.primary, Colors.aqua, Colors.yellow, Colors.red]
    };

    React.useEffect(() => {
        ScheduleReportAPI()
        setFormValues1({
            ...formValues1,
            "start_date": new Date(),
            "end_date": moment(new Date()).add(7, "day"),
        })
        setIsLoading(false)
        // ScheduleStatsAPI()
    }, [])
    React.useEffect(() => {

        if (formValues.employee.length > 0) {
            let tempArr = []
            formValues.employee.map((obj) => {
                tempArr.push(obj.id)
            })
            ScheduleReportAPI(tempArr)
        } else {
            setChartLabels([])
            setChartData([])
            setScreenWidth_chart(screenWidth)
        }


    }, [formValues.employee])

    // API methods
    const ScheduleReportAPI = async (data = []) => {
        // console.log(data)
        if (data.length == 0) {
            setChartLoader(false)
            return false
        }
        let params = {
            user_ids: data
        }
        let url = Constants.apiEndPoints.scheduleReports;
        // console.log("url", url);
        // console.log("params", params);
        setChartLoader(true)
        let response = await APIService.postData(url, params, UserLogin.access_token, null, "ScheduleReportAPI");
        // return
        // console.log("response", JSON.stringify(response))
        if (!response.errorMsg) {
            if (response?.data?.payload?.labels) {
                let arr = []
                let flag = false;
                for (let i = 0; i < response?.data?.payload?.labels.length; i++) {
                    let temp = []
                    if (response?.data?.payload?.obe_hours[i]) { temp.push(response?.data?.payload?.obe_hours[i]); flag = true } else { temp.push(0) }
                    if (response?.data?.payload?.regular_hours[i]) { temp.push(response?.data?.payload?.regular_hours[i]); flag = true } else { temp.push(0) }
                    if (response?.data?.payload?.total_hours[i]) { temp.push(response?.data?.payload?.total_hours[i]); flag = true } else { temp.push(0) }
                    if (response?.data?.payload?.emergency_hours[i]) { temp.push(response?.data?.payload?.emergency_hours[i]); flag = true } else { temp.push(0) }
                    if (response?.data?.payload?.extra_hours[i]) { temp.push(response?.data?.payload?.extra_hours[i]); flag = true } else { temp.push(0) }
                    // if (response?.data?.payload?.vacation_hours) { temp.push(response?.data?.payload?.vacation_hours[i]) }
                    arr.push(temp)
                }
                setChartLabels(response?.data?.payload?.labels)
                setChartData(arr)
                setShowReport(flag)
                if (flag) {
                    let temp = (Dimensions.get("window").width) / 4
                    let width = response?.data?.payload?.labels.length * temp;
                    setScreenWidth_chart(width)
                }
            }
            setChartLoader(false)
        }
        else {
            setChartLoader(false)
            Alert.showAlert(Constants.danger, response.errorMsg)
        }
    }

    React.useEffect(() => {
        ScheduleStatsAPI()
    }, [formValues1])

    // API methods
    const ScheduleStatsAPI = async () => {
        let params = {
            end_date: formValues1?.end_date ? reverseFormatDate(formValues1?.end_date) : "",
            start_date: formValues1?.start_date ? reverseFormatDate(formValues1?.start_date) : "",
            user_id: formValues1.employee1.id,
        }
        let url = Constants.apiEndPoints.schedule_stats;
        // console.log("url1------------", url);
        // console.log("params1---------", params);
        setChartLoader1(true)
        let response = await APIService.postData(url, params, UserLogin.access_token, null, "ScheduleStatsAPI");
        // return
        // console.log("response", JSON.stringify(response))
        if (!response.errorMsg) {
            if (response?.data?.payload?.labels) {
                let arr = []
                let flag = false
                for (let i = 0; i < response?.data?.payload?.labels.length; i++) {
                    let temp = []
                    if (response?.data?.payload?.obe_hours[i]) { temp.push(response?.data?.payload?.obe_hours[i]); flag = true } else { temp.push(0) }
                    if (response?.data?.payload?.regular_hours[i]) { temp.push(response?.data?.payload?.regular_hours[i]); flag = true } else { temp.push(0) }
                    if (response?.data?.payload?.total_hours[i]) { temp.push(response?.data?.payload?.total_hours[i]); flag = true } else { temp.push(0) }
                    if (response?.data?.payload?.emergency_hours[i]) { temp.push(response?.data?.payload?.emergency_hours[i]); flag = true } else { temp.push(0) }
                    if (response?.data?.payload?.extra_hours[i]) { temp.push(response?.data?.payload?.extra_hours[i]); flag = true } else { temp.push(0) }
                    arr.push(temp)
                }
                setChartLabels1(response?.data?.payload?.labels);
                setChartData1(arr);
                setShowState(flag)
                // console.log("data format", arr)
                if (flag) {

                    let temp = (Dimensions.get("window").width) / 4
                    let width = response?.data?.payload?.labels.length * temp;
                    setScreenWidth_chart1(width)
                }
            }
            setChartLoader1(false)
        }
        else {
            setChartLoader1(false)
            Alert.showAlert(Constants.danger, response.errorMsg)
        }
    }

    const chartConfig = {
        // backgroundGradientFrom: "#1E2923",
        // backgroundGradientFromOpacity: 0,
        // backgroundGradientTo: "#08130D",
        // backgroundGradientToOpacity: 0.5,
        // color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
        // strokeWidth: 2, // optional, default 3
        // barPercentage: 0.5,
        // useShadowColorFromDataset: false // optional

        backgroundGradientFrom: Colors.white,
        backgroundGradientTo: Colors.white,
        barPercentage: 0.7,
        // height: 5000,
        // fillShadowGradient: Colors.green ?? Colors.primary,
        // fillShadowGradientOpacity: 1,
        // decimalPlaces: 0, // optional, defaults to 2dp
        color: (opacity = 1) => Colors.green ?? Colors.primary,
        labelColor: (opacity = 1) => Colors.black,

        style: {
            borderRadius: 16,
            fontFamily: Assets.fonts.medium,

        },
        propsForBackgroundLines: {
            strokeWidth: 1,
            stroke: Colors.shadowColorIosPrimary,
            strokeDasharray: "0",
            // translateX:20
            x1: 20
        },
        propsForLabels: {
            fontFamily: Assets.fonts.medium,
            fontSize: getProportionalFontSize(10)
        },
    };
    const handleInputChange = (key, value) => {
        setFormValues1({
            ...formValues1,
            [key]: value,
        });
    };
    const getAPIDetails = () => {
        switch (actionSheetDecide) {
            case initialKeys.employee: {
                return employeeAS;
            }
            case initialKeys1.employee1: {
                return employeeAS1;
            }
            default: {
                return null;
            }
        }
    };

    const changeAPIDetails = payload => {
        switch (actionSheetDecide) {
            case initialKeys.employee: {
                setEmployeeAS(getActionSheetAPIDetail({ ...employeeAS, ...payload }));
                break;
            }
            case initialKeys1.employee1: {
                setEmployeeAS1(getActionSheetAPIDetail({ ...employeeAS1, ...payload }));
                break;
            }
            default: {
                return null;
            }
        }
    };

    const onPressItem = item => {
        switch (actionSheetDecide) {
            case initialKeys.employee: {
                setFormValues({ ...formValues, [initialKeys.employee]: item })
                break;
            }
            case initialKeys1.employee1: {
                setFormValues1({ ...formValues, [initialKeys1.employee1]: item })
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
    return (
        <BaseContainer
            onPressLeftIcon={!isLoading ? () => { props.navigation.goBack() } : () => { }}
            leftIcon="arrow-back"
            leftIconSize={24}
            title={labels.reports}
            leftIconColor={Colors.primary}
        >
            <ActionSheet ref={actionSheetRef}>
                <ActionSheetComp
                    title={labels[actionSheetDecide]}
                    closeActionSheet={closeActionSheet}
                    keyToShowData={"name"}
                    keyToCompareData="id"
                    multiSelect={actionSheetDecide == initialKeys.employee ? true : false}
                    APIDetails={getAPIDetails()}
                    changeAPIDetails={payload => {
                        changeAPIDetails(payload);
                    }}
                    onPressItem={item => {
                        onPressItem(item);
                    }}
                />
            </ActionSheet>

            <DatePicker
                modal
                mode={"date"}
                open={openDatePicker}
                // minimumDate={mode == Constants.DatePickerModes.date_mode ? new Date() : null}
                maximumDate={datePickerKey == "end_date"
                    ? formValues1?.start_date ? moment(formValues1.start_date).add(7, "day") : null
                    : null}
                // maximumDate={moment(new Date()).add(7, "day")}
                date={new Date()}
                onConfirm={(date) => {
                    setOpenDatePicker(false)
                    // console.log('date : ', date)
                    let value = '';
                    if (mode == Constants.DatePickerModes.date_mode) {

                        if (datePickerKey == "start_date") {
                            let end = moment(date).add(7, "day")
                            setFormValues1({
                                ...formValues1,
                                [datePickerKey]: date,
                                "end_date": end
                            });
                            // handleInputChange("end_date", end,)
                        } else {
                            handleInputChange(datePickerKey, date,)
                        }
                    }
                    else if (mode == Constants.DatePickerModes.time_mode)
                        handleInputChange(datePickerKey, date,)
                    else
                        handleInputChange(datePickerKey, date,)
                }}
                onCancel={() => {
                    setOpenDatePicker(false)
                }}
            />

            {
                isLoading ? (
                    <ListLoader />
                ) : (
                    <ScrollView>
                        <View style={styles.chartContainer}>
                            <View style={{ justifyContent: "center", alignItems: "center" }}>
                                <Text style={styles.heading}>{labels.schedule_report ?? "Schedule Report"}</Text>
                            </View>
                            {/* employee */}
                            <InputValidation
                                iconRight="chevron-down"
                                optional={true}
                                value={formValues?.employee?.name ?? ""}
                                placeHolder={labels['employee']}
                                onPressIcon={() => {
                                    setActionSheetDecide(initialKeys.employee);
                                    actionSheetRef.current?.setModalVisible();
                                }}
                                style={{ ...styles.InputValidationView, }}
                                inputStyle={{ ...styles.inputStyle }}
                                editable={false}
                            />
                            <MSDataViewer
                                data={formValues.employee}
                                setNewDataOnPressClose={(newArr) => {
                                    setEmployeeAS({ ...employeeAS, selectedData: newArr });
                                    handleInputChange(initialKeys.employee, newArr);
                                }}
                            />

                            <View style={{ width: "100%", flexDirection: "row", flexWrap: "wrap", marginTop: 20 }}>
                                <View style={{ flexDirection: "row", minWidth: getProportionalFontSize(110), alignItems: "center" }}>
                                    <View style={{ width: 10, height: 10, backgroundColor: Colors.gray, marginRight: 5 }} />
                                    <Text style={{ fontFamily: Assets.fonts.regular, color: Colors.gray ?? Colors.primary, fontSize: getProportionalFontSize(10) }}>{labels.obe_hours}</Text>
                                </View>
                                <View style={{ flexDirection: "row", minWidth: getProportionalFontSize(110), alignItems: "center" }}>
                                    <View style={{ width: 10, height: 10, backgroundColor: Colors.primary, marginRight: 5 }} />
                                    <Text style={{ fontFamily: Assets.fonts.regular, color: Colors.primary ?? Colors.primary, fontSize: getProportionalFontSize(10) }}>{labels.regular_hours}</Text>
                                </View>
                                <View style={{ flexDirection: "row", minWidth: getProportionalFontSize(110), alignItems: "center" }}>
                                    <View style={{ width: 10, height: 10, backgroundColor: Colors.aqua, marginRight: 5 }} />
                                    <Text style={{ fontFamily: Assets.fonts.regular, color: Colors.aqua ?? Colors.aqua, fontSize: getProportionalFontSize(10) }}>{labels.total_hours}</Text>
                                </View>
                                <View style={{ flexDirection: "row", minWidth: getProportionalFontSize(110), alignItems: "center" }}>
                                    <View style={{ width: 10, height: 10, backgroundColor: Colors.yellow, marginRight: 5 }} />
                                    <Text style={{ fontFamily: Assets.fonts.regular, color: Colors.yellow ?? Colors.primary, fontSize: getProportionalFontSize(10) }}>{labels.emergency_hours}</Text>
                                </View>
                                <View style={{ flexDirection: "row", minWidth: getProportionalFontSize(110), alignItems: "center" }}>
                                    <View style={{ width: 10, height: 10, backgroundColor: Colors.red, marginRight: 5 }} />
                                    <Text style={{ fontFamily: Assets.fonts.regular, color: Colors.red ?? Colors.primary, fontSize: getProportionalFontSize(10) }}>{labels.extra_hours}</Text>
                                </View>
                            </View>
                            {
                                chartLoader
                                    ? <View style={{ width: "100%", height: 220, justifyContent: "center", alignItems: "center" }}>
                                        <ActivityIndicator size={'large'} />
                                    </View>
                                    : showReport
                                        ? <ScrollView horizontal={true}>
                                            <StackedBarChart
                                                data={data}
                                                width={screenWidth_chart}
                                                height={220}
                                                chartConfig={chartConfig}
                                            />
                                        </ScrollView>
                                        : <View style={{ width: "100%", height: 220, justifyContent: "center", alignItems: "center" }}>
                                            <Text style={styles.normalText} >{labels?.data_not_found ?? "data_not_found"}</Text>
                                        </View>
                            }
                        </View >


                        <View style={styles.chartContainer}>
                            <View style={{ justifyContent: "center", alignItems: "center" }}>
                                <Text style={styles.heading}>{labels.employee_stats ?? "employee_stats"}</Text>
                            </View>
                            {/* employee */}
                            <InputValidation
                                iconRight="chevron-down"
                                optional={true}
                                value={formValues1?.employee1?.name ?? ""}
                                placeHolder={labels['employee']}
                                onPressIcon={() => {
                                    setActionSheetDecide(initialKeys1.employee1);
                                    actionSheetRef.current?.setModalVisible();
                                }}
                                style={{ ...styles.InputValidationView }}
                                inputStyle={{ ...styles.inputStyle }}
                                editable={false}
                            />
                            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                                {/* start date */}
                                <InputValidation
                                    optional={true}
                                    // uniqueKey={initialKeys1.start_date}
                                    // validationObj={validationForTimeAndRepetition}
                                    iconRight='calendar'
                                    iconColor={Colors.primary}
                                    editable={false}
                                    onPressIcon={() => {
                                        // removeErrorTextForInputThatUserIsTyping(time_and_repetition, initialKeys1.start_date)
                                        setOpenDatePicker(true);
                                        setMode(Constants.DatePickerModes.date_mode);
                                        setDatePickerKey(initialKeys1.start_date)
                                    }}
                                    value={formValues1.start_date ? reverseFormatDate(formValues1.start_date) : ''}
                                    placeHolder={labels.startDate}
                                    style={{ ...styles.InputValidationView, width: "48%" }}
                                    inputStyle={styles.inputStyle}
                                />

                                {/* end date */}
                                <InputValidation
                                    // uniqueKey={initialKeys1.end_date}
                                    // validationObj={validationForTimeAndRepetition}
                                    iconRight='calendar'
                                    iconColor={Colors.primary}
                                    editable={false}
                                    optional={true}
                                    onPressIcon={() => {
                                        // removeErrorTextForInputThatUserIsTyping(time_and_repetition, initialKeys1.end_date)
                                        setOpenDatePicker(true);
                                        setMode(Constants.DatePickerModes.date_mode);
                                        setDatePickerKey(initialKeys1.end_date)
                                    }}
                                    // value={formValues1.end_date ? reverseFormatDate(formValues1.end_date) : ''}
                                    value={formValues1.end_date ? reverseFormatDate(formValues1.end_date) : ''}
                                    placeHolder={labels.endDate}
                                    style={{ ...styles.InputValidationView, width: "48%" }}
                                    inputStyle={styles.inputStyle}
                                />

                            </View>

                            <View style={{ width: "100%", flexDirection: "row", flexWrap: "wrap", marginTop: 20 }}>
                                <View style={{ flexDirection: "row", minWidth: getProportionalFontSize(110), alignItems: "center" }}>
                                    <View style={{ width: 10, height: 10, backgroundColor: Colors.gray, marginRight: 5 }} />
                                    <Text style={{ fontFamily: Assets.fonts.regular, color: Colors.gray ?? Colors.primary, fontSize: getProportionalFontSize(10) }}>{labels.obe_hours}</Text>
                                </View>
                                <View style={{ flexDirection: "row", minWidth: getProportionalFontSize(110), alignItems: "center" }}>
                                    <View style={{ width: 10, height: 10, backgroundColor: Colors.primary, marginRight: 5 }} />
                                    <Text style={{ fontFamily: Assets.fonts.regular, color: Colors.primary ?? Colors.primary, fontSize: getProportionalFontSize(10) }}>{labels.regular_hours}</Text>
                                </View>
                                <View style={{ flexDirection: "row", minWidth: getProportionalFontSize(110), alignItems: "center" }}>
                                    <View style={{ width: 10, height: 10, backgroundColor: Colors.aqua, marginRight: 5 }} />
                                    <Text style={{ fontFamily: Assets.fonts.regular, color: Colors.aqua ?? Colors.aqua, fontSize: getProportionalFontSize(10) }}>{labels.total_hours}</Text>
                                </View>
                                <View style={{ flexDirection: "row", minWidth: getProportionalFontSize(110), alignItems: "center" }}>
                                    <View style={{ width: 10, height: 10, backgroundColor: Colors.yellow, marginRight: 5 }} />
                                    <Text style={{ fontFamily: Assets.fonts.regular, color: Colors.yellow ?? Colors.primary, fontSize: getProportionalFontSize(10) }}>{labels.emergency_hours}</Text>
                                </View>
                                <View style={{ flexDirection: "row", minWidth: getProportionalFontSize(110), alignItems: "center" }}>
                                    <View style={{ width: 10, height: 10, backgroundColor: Colors.red, marginRight: 5 }} />
                                    <Text style={{ fontFamily: Assets.fonts.regular, color: Colors.red ?? Colors.primary, fontSize: getProportionalFontSize(10) }}>{labels.extra_hours}</Text>
                                </View>
                            </View>
                            {
                                chartLoader1
                                    ? <View style={{ width: "100%", height: 220, justifyContent: "center", alignItems: "center" }}>
                                        <ActivityIndicator size={'large'} />
                                    </View>
                                    : showState
                                        ? <ScrollView horizontal={true}>
                                            <StackedBarChart
                                                data={data1}
                                                width={screenWidth_chart1}
                                                height={220}
                                                chartConfig={chartConfig}
                                            />
                                        </ScrollView>
                                        : <View style={{ width: "100%", height: 220, justifyContent: "center", alignItems: "center" }}>
                                            <Text style={styles.normalText} >{labels?.data_not_found ?? "data_not_found"}</Text>
                                        </View>
                            }
                        </View>
                    </ScrollView>
                )
            }
        </BaseContainer>
    )
}

export default Reports

const styles = StyleSheet.create({
    chartContainer: {
        width: Dimensions.get("window").width * 0.90,
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
    normalText: {
        fontFamily: Assets.fonts.regular,
        fontSize: getProportionalFontSize(14),
        color: Colors.primary
    },
    heading: {
        backgroundColor: Colors.primary, paddingHorizontal: 10, paddingVertical: 3, borderRadius: 10, fontFamily: Assets.fonts.semiBold, color: Colors.white, fontSize: getProportionalFontSize(13),
        minWidth: 100,
        textAlign: "center"
    }
})