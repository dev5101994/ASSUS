import React, { Component, Fragment } from 'react';
import { Alert, StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { Calendar, CalendarProps, Agenda, DateData, AgendaEntry, AgendaSchedule } from 'react-native-calendars';
import Colors from '../Constants/Colors';
import { getProportionalFontSize, } from '../Services/CommonMethods';
import Constants from '../Constants/Constants';
import Assets from '../Assets/Assets';
import { CurruntDate } from "../Services/CommonMethods"
import APIService from '../Services/APIService';
import ProgressLoader from './ProgressLoader';

import { useSelector, useDispatch } from 'react-redux'

const todaydate = CurruntDate()
// console.log(typeof (todaydate))
const mk = todaydate

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

const CalendarAgenda = () => {
    // REDUX hooks
    const dispatch = useDispatch();
    const isInternetActive = useSelector(state => state.IsInternetActive);
    const UserLogin = useSelector(state => state.User.UserLogin);
    const messages = useSelector(state => state.Labels.messages);
    //hooks
    const [isLoading, setIsLoading] = React.useState(true);
    const [data, setData] = React.useState({});
    const [today, setToday] = React.useState("");
    console.log("today", today)



    const getCalendarData = async () => {
        setIsLoading(true);
        let params = {};
        // console.log('params=======', params)
        let url = Constants.apiEndPoints.calanderDataForActivity;

        let response = await APIService.postData(url, params, UserLogin.access_token, null, "saveWordDetails");
        // console.log("SUCCESS............response", response.data.payload)
        // return
        if (!response.errorMsg) {
            setData(response.data.payload)
            setIsLoading(false);
            // console.log("SUCCESS............")

        }
        else {
            setIsLoading(false);
            Alert.showAlert(Constants.danger, response.errorMsg)
        }
    }
    //=============================================================================


    React.useEffect(() => {
        getCalendarData()
    }, [])

    interface State {
        items?: AgendaSchedule;
    }
    // helper function
    class AgendaScreen extends Component<State> {
        state = {
            items: undefined
        };

        render() {
            return (
                <Agenda
                    testID={testIDs.agenda.CONTAINER}
                    items={this.state.items}//** */
                    loadItemsForMonth={this.loadItems}//** */

                    renderItem={this.renderItem}
                    onDayPress={day => {
                        // console.log('day pressed');
                    }}
                    // renderEmptyDate={this.renderEmptyDate}
                    // rowHasChanged={this.rowHasChanged}
                    showClosingKnob={true}
                    // markingType={'period'}
                    // markedDates={{
                    //     '2022-02-08': { textColor: '#43515c' },
                    //     '2022-02-09': { textColor: '#43515c' },
                    //     '2022-02-14': { startingDay: true, endingDay: true, color: 'blue' },
                    //     '2022-02-21': { startingDay: true, color: 'blue' },
                    //     '2022-02-22': { endingDay: true, color: 'gray' },
                    //     '2022-02-24': { startingDay: true, color: 'gray' },
                    //     '2022-02-25': { color: 'gray' },
                    //     '2022-02-26': { endingDay: true, color: 'gray' }
                    // }}
                    // monthFormat={'yyyy'}
                    theme={{
                        calendarBackground: Colors.white,
                        // agendaKnobColor: Colors.red,
                        textDayFontFamily: Assets.fonts.medium,
                        textMonthFontFamily: Assets.fonts.medium,
                        todayButtonFontFamily: Assets.fonts.medium,
                        textDayHeaderFontFamily: Assets.fonts.medium,
                        // textDayFontSize: 16,
                        // textMonthFontSize: 16,
                        // textDayHeaderFontSize: 16,
                        // backgroundColor: '#ffffff',
                        calendarBackground: '#ffffff',
                        textSectionTitleColor: '#b6c1cd',
                        textSectionTitleDisabledColor: '#d9e1e8',
                        selectedDayBackgroundColor: Colors.primary,
                        selectedDayTextColor: '#ffffff',
                        todayTextColor: Colors.primary,
                        dayTextColor: '#2d4150',
                        textDisabledColor: '#d9e1e8',
                        dotColor: '#00adf5',
                        selectedDotColor: '#ffffff',
                    }}
                    // renderDay={(day, item) => (<Text>{day ? day.day : 'item'}</Text>)}
                    hideExtraDays={true}
                    // showOnlySelectedDayItems

                    pastScrollRange={2}

                    futureScrollRange={36}
                    renderKnob={() => {
                        return (<View style={{ width: 35, height: 4, borderRadius: 10, backgroundColor: Colors.red, marginTop: 10 }} ></View>)
                    }}
                    // renderEmptyData={() => {
                    //     return (<View style={{ width: 10, height: 10, backgroundColor: Colors.red }}></View>)
                    // }}
                    selected={todaydate}
                />
            );
        }

        loadItems = (day) => {

            // const items = this.state.items || {};
            const items = data ?? {}

            setTimeout(() => {
                for (let i = -15; i < 85; i++) {
                    const time = day.timestamp + i * 24 * 60 * 60 * 1000;

                    const strTime = this.timeToString(time);
                    if (!items[strTime]) {
                        items[strTime] = [];

                        const numItems = Math.floor(Math.random() * 3 + 1);
                        // for (let j = 0; j < numItems; j++) {
                        //     items[strTime].push({
                        //         name: 'Item for ' + strTime + ' #' + j,
                        //         height: Math.max(50, Math.floor(Math.random() * 150)),
                        //         day: strTime
                        //     });
                        // }
                    }
                }

                const newItems = {};
                Object.keys(items).forEach(key => {
                    newItems[key] = items[key];
                });
                this.setState({
                    items: newItems
                });
            }, 1000);
        }
        // text content to view
        renderItem = (reservation, isFirst) => {
            const fontSize = isFirst ? 16 : 14;
            const color = isFirst ? 'black' : '#43515c';

            return (
                <TouchableOpacity
                    testID={testIDs.agenda.ITEM}
                    style={[styles.item,]}
                // onPress={() => Alert.alert(reservation.name)}
                >
                    <Text style={{ fontSize: getProportionalFontSize(14), color: '#43515c', fontFamily: Assets.fonts.medium, }}>{reservation.name}</Text>
                </TouchableOpacity>
            );
        }

        renderEmptyDate = () => {
            return (
                <View style={styles.emptyDate}>
                    <Text>This is empty date!</Text>
                </View>
            );
        }

        // rowHasChanged = (r1: AgendaEntry, r2: AgendaEntry) => {
        //     return r1.name !== r2.name;
        // }

        timeToString(time) {
            const date = new Date(time);
            return date.toISOString().split('T')[0];
        }
    }
    // Render view
    if (isLoading)
        return <ProgressLoader />

    return (
        <AgendaScreen />
    )

}

export default CalendarAgenda

const styles = StyleSheet.create({
    item: {
        backgroundColor: 'white',
        flex: 1,
        borderRadius: 5,
        padding: 10,
        marginRight: Constants.globalPaddingHorizontal,
        marginTop: 17
    },
    emptyDate: {
        height: 15,
        flex: 1,
        paddingTop: 30
    }
})