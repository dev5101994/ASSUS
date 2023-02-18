import React, { useState, Fragment, useCallback } from 'react';
import { StyleSheet, View, ScrollView, Text, TouchableOpacity, Dimensions, FlatList, ActivityIndicator } from 'react-native';
import { Calendar, CalendarProps, Agenda, AgendaEntry } from 'react-native-calendars';
import Constants from '../Constants/Constants';

import Icon from 'react-native-vector-icons/MaterialIcons';

import Colors from '../Constants/Colors';
import { getProportionalFontSize, getActionSheetAPIDetail, reverseFormatDate, formatDateForAPI } from '../Services/CommonMethods';
import { useSelector, useDispatch } from 'react-redux';
import APIService from '../Services/APIService';
import Alert from '../Components/Alert';
import moment, { isMoment } from 'moment';

import Assets from '../Assets/Assets';

import { Portal, Modal, } from 'react-native-paper';
import Ionicons from 'react-native-vector-icons/Ionicons';
import EmptyDataContainer from './EmptyDataContainer';

let left = "left"
let right = "right"

const flatListRenderItem = ({ item, index }) => {
    return (
        <View>
            <Text>ok</Text>
        </View>
    )
}

const EmptyTable = () => (
    <View>
        {
            formFields?.schedule_template?.id ?
                <Text>{labels["no-record"]} </Text>
                : <Text>{labels["select-schedule-template-alert"]} </Text>
        }


    </View>
)

const ScheduleDayView = (props) => {
    // const { isRefreshing, setIsRefreshing } = props;
    // redux_hooks
    const UserLogin = useSelector(state => state.User.UserLogin);
    const labels = useSelector(state => state.Labels);

    // hooks
    const [isRefreshing, setIsRefreshing] = React.useState(true)
    const [date, setDate] = React.useState(new Date())
    let crr_month = moment(new Date()).format("MM")
    const [month, setMonth] = React.useState(crr_month)
    const [scheduleList, setScheduleList] = React.useState([])
    const [dateWiseSchedule, setDateWiseSchedule] = React.useState([1])
    const scheduleStatusColor = {
        [labels.upcoming]: Colors.blueMagenta,
        [labels.passed]: Colors.gray,
        [labels.leave]: Colors.red,
        [labels.vacation]: Colors.yellow,
    }
    const getScheduleStatus = (item) => {

        if (item.leave_type)
            return labels[item.leave_type]

        let curr = new Date();
        let shiftDate = new Date(item.shift_date ?? '')
        if (formatDateForAPI(shiftDate) == formatDateForAPI(new Date())) {
            return labels.upcoming
        }
        else if (shiftDate > curr) {
            return labels.upcoming
        }
        else {
            return labels.passed
        }
    }
    // React.useEffect(() => {
    //     
    // }, [])
    //api for month data
    React.useEffect(() => {
        var currentMonth = new Date().getMonth() + 1
        getScheduleList(currentMonth);
    }, [])

    React.useEffect(() => {
        getScheduleForCurrentDate(new Date())
    }, [scheduleList])

    const getScheduleList = async (month) => {
        // setIsRefreshing(true)
        props.setIsLoading(true)
        var pre_month = month - 1;
        if (pre_month == 0) { pre_month = 12 }
        if (pre_month < 10) { pre_month = "0" + pre_month }

        var next_month = month + 1
        if (next_month == 13) { next_month = 1 }
        if (next_month < 10) { next_month = "0" + next_month }

        let shift_end_date = "2022-" + next_month + "-01";
        let shift_start_date = "2022-" + pre_month + "-01";

        let params = {
            is_active: 1,
            patient_id: "",
            schedule_template_id: null,
            shift_end_date: shift_end_date ?? "",
            shift_id: "",
            shift_start_date: shift_start_date ?? "",
            user_id: UserLogin.user_type_id != 2 ? UserLogin.id : null,
        };

        let url = Constants.apiEndPoints?.scheduleList;
        // setIsRefreshing(true)
        // props.setIsLoading(true)
        let response = await APIService.postData(url, params, UserLogin.access_token, null, 'ScheduleListAPI',);
        if (!response.errorMsg) {
            // console.log('-response?.data?.payload-------------------123', JSON.stringify(response?.data?.payload))
            setScheduleList(response?.data?.payload)
            props.setIsLoading(false)
        } else {
            //  setIsRefreshing(false);
            props.setIsLoading(false)
            Alert.showAlert(Constants.danger, response.errorMsg);
        }
    }
    //function
    const changeDate = (arrow) => {
        let new_date = date
        if (arrow == right) new_date = moment(date).add(1, "days")
        if (arrow == left) new_date = moment(date).subtract(1, 'days')
        setDate(new_date);
        let temp_month = moment(new_date).format("MM")
        if (month != temp_month) {
            setMonth(temp_month)
            getScheduleList(temp_month)
        }
        getScheduleForCurrentDate(new_date)
    }

    function getScheduleForCurrentDate(current_date) {
        //   setIsRefreshing(true)
        props.setIsLoading(true)
        // console.log("scheduleList", scheduleList)
        let format_date = moment(current_date).format("yyyy-MM-DD")
        let ScheduleForCurrentDateArr = scheduleList.filter((obj, i) => obj.shift_date == format_date)
        // console.log(ScheduleForCurrentDateArr)
        setDateWiseSchedule(ScheduleForCurrentDateArr)
        // if (ScheduleForCurrentDateArr.length > 0 && scheduleList.length > 0) {
        //    setIsRefreshing(false);
        props.setIsLoading(false)
        // }
        // 
    }

    const renderListComp = (item, index) => {
        return (
            <View style={styles.cardContainer}>

                {/* Status */}
                <View style={[styles.statusView, { backgroundColor: scheduleStatusColor[getScheduleStatus(item)] }]}>
                    <Text style={[styles.rightTitle, { color: Colors.white, width: "100%", }]}>
                        {getScheduleStatus(item)}
                    </Text>
                </View>

                {item.user?.name
                    ? <Text numberOfLines={1} style={{ ...styles.magentaText, marginBottom: 5 }}>{item.user?.name}</Text>
                    : null}

                <View style={[styles.rowStyle, { justifyContent: "flex-start", marginTop: 0 }]}>
                    <View style={[styles.rowStyle, { marginTop: 0, flex: 1, }]}>
                        <Text numberOfLines={1} style={[styles.normalText, {}]}>{labels.date}</Text>
                        <Text numberOfLines={1} style={[styles.normalText, {}]}> : </Text>
                    </View>
                    <Text numberOfLines={1} style={{ ...styles.boldText, flex: 3.5, marginStart: 5 }}>{item.shift_date}</Text>
                </View>

                <View style={[styles.rowStyle, { justifyContent: "flex-start", marginTop: 0 }]}>
                    <View style={[styles.rowStyle, { marginTop: 0, flex: 1, }]}>
                        <Text numberOfLines={1} style={[styles.normalText, {}]}>{labels.time}</Text>
                        <Text numberOfLines={1} style={[styles.normalText, {}]}> : </Text>
                    </View>
                    <Text numberOfLines={1} style={{ ...styles.boldText, flex: 3.5, marginStart: 5 }}>{item.start_time + " - " + item.end_time}</Text>
                </View>
            </View>
        )
    }

    //render view
    return (
        <View >
            {/* {
                isRefreshing
                    ?
                    <View style={{
                        position: "absolute",
                        width: "100%",
                        height: "100%",
                        zIndex: 10,
                        justifyContent: "center",
                        alignItems: "center",
                        backgroundColor: "#0009",
                        top: 0,
                        left: 0,
                        minHeight: 700,
                        minWidth: 400
                    }}>
                        <ActivityIndicator size={"large"} color={Colors.white} />
                    </View>
                    : null
            } */}

            <View style={styles.headerContainer}>
                <View style={styles.icon}>
                    <Ionicons name="chevron-back-sharp" size={25} color={Colors.primary} style={{}} onPress={() => changeDate(left)} />
                </View>
                <Text style={styles.headerText}>{moment(date).format("MMMM DD, yyyy")}</Text>
                <View style={styles.icon}>
                    <Ionicons name="chevron-forward-sharp" size={25} color={Colors.primary} style={{}} onPress={() => changeDate(right)} />
                </View>
            </View>

            {/* //temp list */}
            <FlatList
                ListEmptyComponent={<EmptyDataContainer style={{ paddingVertical: 10 }} />}
                data={dateWiseSchedule ?? []}
                renderItem={({ item, index }) => {
                    return renderListComp(item, index)
                }}
                contentContainerStyle={{ paddingHorizontal: Constants.globalPaddingHorizontal, paddingBottom: 150 }}
                // style={{ paddingTop: 10 }}
                keyExtractor={item => '' + item.id}

            />
        </View>
    )
}

export default ScheduleDayView

const styles = StyleSheet.create({
    headerContainer: {
        width: "100%",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: getProportionalFontSize(20),
        paddingVertical: getProportionalFontSize(10),
        marginVertical: getProportionalFontSize(10),
        // backgroundColor: Colors.white
    },
    icon: {
        backgroundColor: Colors.white,
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: "center",
        alignItems: "center"
    },
    headerText: {
        fontFamily: Assets.fonts.semiBold,
        color: Colors.primary,
        fontSize: getProportionalFontSize(16)
    },
    rightIcon: {

    },



    cardContainer: {
        backgroundColor: Colors.white,
        paddingHorizontal: 15,
        paddingVertical: 20,
        marginTop: Constants.formFieldTopMargin,
        // shadow
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 15,
        elevation: 15,
        shadowColor: Platform.OS == 'ios' ? Colors.primary : Colors.primary,
        shadowRadius: 6,
        borderRadius: 7,
    },
    magentaText: { fontFamily: Assets.fonts.robotoBold, color: Colors.blueMagenta, fontSize: getProportionalFontSize(15) },
    rowStyle: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: Constants.formFieldTopMargin },
    normalText: {
        fontSize: getProportionalFontSize(13),
        fontFamily: Assets.fonts.semiBold,
        color: Colors.gray
    },
    boldText: {
        fontSize: getProportionalFontSize(13),
        fontFamily: Assets.fonts.bold,
        color: Colors.primary
    },
    statusView: {
        position: "absolute",
        right: 5,
        top: 5,
        borderRadius: 8,
        padding: 5,
        justifyContent: "center",
        alignItems: "center"
    },
    rightTitle: {
        fontFamily: Assets.fonts.semiBold,
        color: Colors.primary,
        fontSize: getProportionalFontSize(12),
        width: "70%"
    },
})