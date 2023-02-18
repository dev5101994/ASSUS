import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, SafeAreaView, TouchableOpacity, FlatList, RefreshControl, Platform } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Colors from '../Constants/Colors'
import Assets from '../Assets/Assets';
import { formatDateForAPI, getProportionalFontSize } from '../Services/CommonMethods';
import Constants from '../Constants/Constants';
import EmptyDataContainer from './EmptyDataContainer';
import FooterCompForFlatlist from './FooterCompForFlatlist';
import { useSelector, } from 'react-redux';
import { WeekCalendar, CalendarProvider } from 'react-native-calendars';


export default ScheduleWeekComp = props => {

    const labels = useSelector(state => state.Labels);

    const [markedDates, setMarkedDates] = useState({})

    const [scheduleListObject, setScheduleListObject] = useState({})

    const [selectedDateData, setSelectedDateData] = useState([])

    const [selectedDate, setSelectedDate] = useState('')

    useEffect(() => {
        getMarkedDates()
    }, [props.scheduleList])

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

    const getMarkedDates = () => {
        // console.log('props.scheduleList', props.scheduleList)
        const marked = {};
        const allDates = {};
        props.scheduleList?.forEach(item => {
            marked[item.shift_date] = { marked: true };
            if (allDates[item.shift_date]) {
                let arr = allDates[item.shift_date];
                arr.push(item);
                allDates[item.shift_date] = arr;
            }
            else {
                allDates[item.shift_date] = [item];
            }
        });
        let currDateData = [];
        if (allDates[formatDateForAPI(new Date())]) {
            currDateData = allDates[formatDateForAPI(new Date())]
        }
        setMarkedDates(marked)
        setScheduleListObject(allDates)
        setSelectedDateData(currDateData)
        setSelectedDate(formatDateForAPI(new Date()))
    }

    const onDateChanged = (date) => {
        // console.log('date----onDateChanged', date)
        setSelectedDateData(scheduleListObject[date])
        setSelectedDate(date)
    }
    const onMonthChange = (e) => {
        // console.log('e----onMonthChange', e)
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


    return (
        <CalendarProvider
            date={formatDateForAPI(new Date())}
            onDateChanged={onDateChanged}
            onMonthChange={onMonthChange}
            disabledOpacity={0.6}
            style={{ paddingTop: Constants.formFieldTopMargin, backgroundColor: Colors.navBackgroundWhite }}
        >

            <Text style={[styles.magentaText, { paddingHorizontal: Constants.globalPaddingHorizontal, marginBottom: Constants.formFieldTopMargin }]}>{selectedDate}</Text>

            <WeekCalendar
                markedDates={markedDates}
            />

            <FlatList
                ListEmptyComponent={<EmptyDataContainer style={{ paddingVertical: 10 }} />}
                data={selectedDateData ?? []}
                renderItem={({ item, index }) => {
                    return renderListComp(item, index)
                }}
                contentContainerStyle={{ paddingHorizontal: Constants.globalPaddingHorizontal, paddingBottom: 10, }}
                keyExtractor={item => '' + item.id}
            />
        </CalendarProvider>
    );
};

const styles = StyleSheet.create({
    cardContainer: {
        backgroundColor: Colors.white,
        paddingHorizontal: 15,
        paddingVertical: 20,
        marginTop: Constants.formFieldTopMargin,
        // shadow
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 15,
        elevation: 15,
        shadowColor: Colors.primary,
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
});
