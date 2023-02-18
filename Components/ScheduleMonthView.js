import React, { useState, Fragment, useCallback } from 'react';
import { StyleSheet, View, ScrollView, Text, TouchableOpacity, Dimensions, FlatList, ActivityIndicator } from 'react-native';
import { Calendar, CalendarProps, Agenda, AgendaEntry } from 'react-native-calendars';
import Constants from '../Constants/Constants';

import Icon from 'react-native-vector-icons/MaterialIcons';

import Colors from '../Constants/Colors';
import { getProportionalFontSize, getActionSheetAPIDetail, reverseFormatDate } from '../Services/CommonMethods';
import { useSelector, useDispatch } from 'react-redux';
import APIService from '../Services/APIService';
import Alert from '../Components/Alert';
import moment from 'moment';
import Assets from '../Assets/Assets';
import { Portal, Modal, } from 'react-native-paper';
import Ionicons from 'react-native-vector-icons/Ionicons';

const testIDs = {
    menu: {
        CONTAINER: 'menu',
        CALENDARS: 'calendars_btn',
        CALENDAR_LIST: 'calendar_list_btn',
        HORIZONTAL_LIST: 'horizontal_list_btn',
        AGENDA: 'agenda_btn',
        EXPANDABLE_CALENDAR: 'expandable_calendar_btn',
        WEEK_CALENDAR: 'week_calendar_btn'
    },
    calendars: {
        CONTAINER: 'calendars',
        FIRST: 'first_calendar',
        LAST: 'last_calendar'
    },
    calendarList: { CONTAINER: 'calendarList' },
    horizontalList: { CONTAINER: 'horizontalList' },
    agenda: {
        CONTAINER: 'agenda',
        ITEM: 'item'
    },
    expandableCalendar: { CONTAINER: 'expandableCalendar' },
    weekCalendar: { CONTAINER: 'weekCalendar' }
};
const INITIAL_DATE = '2021-02-16';

const vacation = { key: 'vacation', color: Colors.ligthRed, };
const leave = { key: 'leave', color: Colors.yellow, };
const normal_shift = { key: 'normal_shift', color: Colors.primary };

const ScheduleMonthView = (props) => {
    const { setDateParam } = props
    const UserLogin = useSelector(state => state.User.UserLogin);
    // console.log("UserLogin.id", UserLogin.user_type_id)
    const labels = useSelector(state => state.Labels);
    const [selected, setSelected] = React.useState(INITIAL_DATE);
    const [isRefreshing, setIsRefreshing] = React.useState(false);
    const [isModalVisible, setIsModalVisible] = React.useState(false);
    const [apiRes, setApiRes] = React.useState([])
    const [dates, setDates] = React.useState([])
    const [employeeData, setEmployeeData] = React.useState([])
    const [crrDate, setCrrDate] = React.useState("")

    React.useEffect(() => {
        var currentMonth = new Date().getMonth() + 1
        getScheduleList(currentMonth)
    }, [])
    const getScheduleList = async (month) => {
        var pre_month = month - 1;
        if (pre_month == 0) { pre_month = 12 }
        if (pre_month < 10) { pre_month = "0" + pre_month }

        var next_month = month + 1
        if (next_month == 13) { next_month = 1 }
        if (next_month < 10) { next_month = "0" + next_month }

        let shift_end_date = "2022-" + next_month + "-01";
        let shift_start_date = "2022-" + pre_month + "-01";

        setDateParam({ "shift_end_date": shift_end_date, "shift_start_date": shift_start_date })

        let params = {
            is_active: 1,
            shift_end_date: shift_end_date ?? "",
            shift_start_date: shift_start_date ?? "",
            user_id: UserLogin.user_type_id != 2 ? UserLogin.id : null,
            schedule_template_id: props?.scheduleTemplateId ?? "",
        };

        // console.log('param---------------------123', JSON.stringify(params))
        let url = Constants.apiEndPoints?.scheduleList;
        // setIsRefreshing(true)
        props.setIsLoading(true)
        let response = await APIService.postData(url, params, UserLogin.access_token, null, 'ScheduleListAPI',);
        if (!response.errorMsg) {

            setApiRes(response?.data?.payload)
            let temp = {}
            if (response?.data?.payload) {
                response.data.payload.map((obj) => {
                    let value = ""
                    if (obj?.leave_type == "vacation") { value = vacation }
                    else if (obj?.leave_type == "leave") { value = leave }
                    else { value = normal_shift }
                    let crr_date = temp[obj?.shift_date]
                    if (crr_date) {
                        let flag = crr_date.dots.find((element, i) => (element == value))
                        if (flag?.key) temp = { ...temp, [obj?.shift_date]: { dots: [...crr_date?.dots] } }
                        else temp = { ...temp, [obj?.shift_date]: { dots: [...crr_date?.dots, value] } }
                    } else temp = { ...temp, [obj?.shift_date]: { dots: [value] } }
                })
            }
            setDates(temp)
            // setIsRefreshing(false);
            props.setIsLoading(false)
        } else {
            //  setIsRefreshing(false);
            props.setIsLoading(false)
            Alert.showAlert(Constants.danger, response.errorMsg);
        }
    }

    const onDayPress = day => {
        if (day.dateString == selected) {
            setSelected();
        } else {
            setSelected(day.dateString);
        }
        setCrrDate(day.dateString)
        openModel(day.dateString)

    };
    // helper function
    const openModel = (day) => {

        setIsModalVisible(true);
        let filterData = apiRes.filter((obj, i) => {
            return obj?.shift_date == day
        })
        setEmployeeData(filterData)
    }
    const onRequestClose = () => {
        // console.log('onRequestClose called')
        setIsModalVisible(false);
    }
    const calendarTheme = {
        textDayFontSize: getProportionalFontSize(14),
        textMonthFontSize: getProportionalFontSize(16),
        calendarBackground: Colors.white,
        textMonthFontFamily: Assets.fonts.semiBold,
        monthTextColor: Colors.primary,
        todayButtonFontFamily: Assets.fonts.medium,
        textDayHeaderFontFamily: Assets.fonts.semiBold,
        textDayFontFamily: Assets.fonts.semiBold,
        selectedDayBackgroundColor: Colors.primary,
        selectedDayTextColor: Colors.white,
        todayTextColor: Colors.green,
        dayTextColor: Colors.primary,
        textDisabledColor: Colors.darkPlaceHoldColor,
        'stylesheet.calendar.header': {
            week: {
                borderColor: Colors.lightGray,
                borderWidth: 1,
                flexDirection: 'row',
                justifyContent: 'space-between',
                paddingHorizontal: 15,
                backgroundColor: Colors.primary,
                borderRadius: 30,
                paddingTop: 5,
                marginBottom: 10,
                marginTop: 10
            },

        },
        stylesheet: {
            calendar: {
                main: { backgroundColor: Colors.red },
                header: {
                    backgroundColor: Colors.red
                },
            }
        }
    }
    const Arrow = ({ direction }) => {
        if (direction == 'left') { return <Ionicons name="chevron-back-sharp" size={25} color={Colors.primary} /> }
        else if (direction == 'right') { return <Ionicons name="chevron-forward-sharp" size={25} color={Colors.primary} style={{}} /> }
        else { return true }
    }
    const renderCalendar = () => {
        return (

            <Calendar
                firstDay={1}
                testID={testIDs.calendars.FIRST}
                markingType={'multi-dot'}
                enableSwipeMonths
                // current={INITIAL_DATE}
                style={styles.calendar}
                onDayPress={onDayPress}
                markedDates={dates}
                theme={calendarTheme}
                renderArrow={direction => <Arrow direction={direction} />}
                onMonthChange={month => { getScheduleList(month.month) }}

            />

        );
    };
    const ListHeaderComponent = ({ item, index }) => {
        return (
            <View>
                <Text style={{
                    fontFamily: Assets.fonts.semiBold,
                    fontSize: getProportionalFontSize(18),
                    color: Colors.black,
                }}>{moment(crrDate).format('MMMM DD, YYYY')}
                </Text>
            </View>

        )
    }

    const renderItem = ({ item, index }) => {
        let background_color = item.leave_type == "vacation" ? Colors.ultraLightProRed : item.leave_type == "leave" ? Colors.ultraLightyellow : Colors.ultraLightPrimary;
        let border_color = item.leave_type == "vacation" ? Colors.ultraLightRed : item.leave_type == "leave" ? Colors.lightYellow : Colors.lightPrimary;
        let text_color = item.leave_type == "vacation" ? Colors.ligthRed : item.leave_type == "leave" ? Colors.yellow : Colors.primary;
        let badgeIcon = item.leave_type == "vacation" ? "S" : item.leave_type == "leave" ? "L" : null;
        return (
            <View style={{ ...styles.listContainer, backgroundColor: background_color, borderColor: border_color }}>
                <View style={{}}>
                    <Text style={{ ...styles.text, color: text_color }}>{item?.user?.name ?? "employee_name_not_valid"} </Text>
                    {background_color == Colors.ultraLightPrimary ? <Text style={{ ...styles.text, color: text_color }}>{item?.start_time}-{item?.end_time} </Text> : null}
                </View>
                {
                    badgeIcon
                        ? <View style={{ ...styles.badgeView, backgroundColor: text_color, }}>
                            <Text style={styles.badgeText}>{badgeIcon}</Text>
                        </View>
                        : null
                }
            </View>
        )
    }
    // render view 
    return (
        <ScrollView showsVerticalScrollIndicator={false} testID={testIDs.calendars.CONTAINER} style={{ paddingTop: getProportionalFontSize(25), }}>
            <View style={{
                minHeight: Dimensions.get("window").height * 0.72
            }}>
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

                        }}>
                            <ActivityIndicator size={"large"} color={Colors.white} />
                        </View>
                        : null
                } */}
                {renderCalendar()}

                <View style={styles.symbolContainer}>
                    <View style={styles.symbolView}>
                        <View style={{ ...styles.symbol, backgroundColor: Colors.yellow, }} />
                        <Text style={styles.symbolText}>{labels.leave ?? "leave"}</Text>
                    </View>

                    <View style={styles.symbolView}>
                        <View style={{ ...styles.symbol, backgroundColor: Colors.ligthRed, }} />
                        <Text style={styles.symbolText}>{labels.vacation ?? "vacation"}</Text>
                    </View>

                    <View style={styles.symbolView}>
                        <View style={{ ...styles.symbol, backgroundColor: Colors.primary, }} />
                        <Text style={styles.symbolText}>{labels.schedule ?? "schedule"}</Text>
                    </View>
                </View>
            </View>
            {/* MODAL */}
            <Portal>
                <Modal
                    animationType="slide"
                    transparent={true}
                    style={{ justifyContent: "center", alignItems: 'center' }}
                    visible={isModalVisible}
                    onRequestClose={onRequestClose}
                    onDismiss={onRequestClose}
                >
                    <View style={styles.modalMainView}>
                        <View style={styles.innerViewforModel}>
                            {/* close icon */}
                            <View style={{
                                width: "100%",
                                marginTop: 5,

                            }}>
                                <Icon name='cancel' color={Colors.primary} size={30} onPress={onRequestClose} />
                            </View>

                            {/* main view */}
                            <View style={{ flexDirection: 'row', alignItems: "center", marginTop: 10 }}   >
                                <FlatList
                                    data={employeeData}
                                    renderItem={renderItem}
                                    ListHeaderComponent={ListHeaderComponent}
                                    contentContainerStyle={{
                                        maxHeight: Dimensions.get("window").height * 0.7
                                    }}
                                />
                            </View>

                        </View>
                    </View>
                </Modal>
            </Portal>
        </ScrollView>
    )
}

export default ScheduleMonthView

const styles = StyleSheet.create({


    detailsContainer: {
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
    modalMainView: { backgroundColor: 'transparent', justifyContent: "center", alignItems: "center", paddingHorizontal: 16, minWidth: Dimensions.get("window").width * 1, },
    innerViewforModel: {
        width: '100%', minHeight: 150, backgroundColor: Colors.backgroundColor, paddingBottom: Constants.globalPaddingHorizontal * 2, paddingHorizontal: 16, borderRadius: 20,
    },
    text: {
        fontFamily: Assets.fonts.medium,
        fontSize: getProportionalFontSize(14),

    },
    listContainer: {
        width: "100%",
        marginVertical: 5,
        borderRadius: 10,
        paddingHorizontal: 15,
        paddingVertical: 5,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        borderWidth: 1,
    },
    badgeView: {
        width: getProportionalFontSize(30),
        height: getProportionalFontSize(30),
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 5
    },
    badgeText: {
        fontFamily: Assets.fonts.semiBold,
        fontSize: getProportionalFontSize(15),
        color: Colors.white,
    },
    symbolContainer: { width: "100%", marginVertical: 20, flexDirection: "row", justifyContent: "space-around", backgroundColor: Colors.white, paddingVertical: 15 },
    symbolView: { flexDirection: "row", alignItems: "center" },
    symbol: { width: 10, height: 10, borderRadius: 10, marginRight: 10 },
    symbolText: {
        fontFamily: Assets.fonts.medium, fontSize: getProportionalFontSize(14)
    },
})