import React, { useState, Fragment, useCallback } from 'react';
import { StyleSheet, View, ScrollView, Text, TouchableOpacity } from 'react-native';
import { Calendar, CalendarProps, Agenda, AgendaEntry } from 'react-native-calendars';


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

const CalendarComponent = () => {
    const [selected, setSelected] = React.useState(INITIAL_DATE);

    const onDayPress = day => {
        setSelected(day.dateString);
    };
    // helper function
    const renderCalendar = () => {
        return (
            <Fragment>
                <Calendar
                    firstDay={1}
                    testID={testIDs.calendars.FIRST}
                    enableSwipeMonths
                    // current={INITIAL_DATE}
                    style={styles.calendar}
                    onDayPress={onDayPress}
                    markedDates={{
                        '2022-02-17': { marked: true },
                        '2022-02-18': { marked: true, dotColor: 'red', activeOpacity: 0 },
                        [selected]: {
                            selected: true,
                            disableTouchEvent: true,
                            // selectedColor: 'green',
                            // selectedTextColor: 'red',
                        },
                    }}
                    // style={styles.calendarContainer}
                    theme={styles.calendarTheme}
                />
            </Fragment>
        );
    };
    // render view 
    return (
        <ScrollView showsVerticalScrollIndicator={false} testID={testIDs.calendars.CONTAINER}>
            {renderCalendar()}
        </ScrollView>
    )
}

export default CalendarComponent

const styles = StyleSheet.create({

    // const styles = StyleSheet.create({
    //     calendarContainer: {
    //         // borderWidth: 1,
    //         // borderColor: 'gray',
    //         // height: 350,

    //     },
    //     calendarTheme: {
    //         backgroundColor: '#00000007',
    //         calendarBackground: '#00000007',
    //         // textSectionTitleColor: '#b6c1cd',
    //         // textSectionTitleDisabledColor: '#d9e1e8',
    //         // selectedDayBackgroundColor: '#00adf5',
    //         // selectedDayTextColor: '#ffffff',
    //         // todayTextColor: '#00adf5',
    //         // dayTextColor: '#2d4150',
    //         // textDisabledColor: '#d9e1e8',
    //         // dotColor: '#00adf5',
    //         // selectedDotColor: '#ffffff',
    //         // arrowColor: 'orange',
    //         // disabledArrowColor: '#d9e1e8',
    //         // monthTextColor: 'black',
    //         // indicatorColor: 'black',
    //         // textDayFontFamily: 'monospace',
    //         // textMonthFontFamily: 'monospace',
    //         // textDayHeaderFontFamily: 'monospace',
    //         // textDayFontWeight: '300',
    //         // textMonthFontWeight: 'bold',
    //         // textDayHeaderFontWeight: '300',
    //         // textDayFontSize: 16,
    //         // textMonthFontSize: 16,
    //         // textDayHeaderFontSize: 16
    //         // 'stylesheet.calendar.header': {
    //         //     week: {
    //         //         marginTop: 30,
    //         //         marginHorizontal: 12,
    //         //         flexDirection: 'row',
    //         //         justifyContent: 'space-between'
    //         //     }

    //         // }
    //         // 'stylesheet.day.basic': {
    //         //     'base': {
    //         //         width: 30,
    //         //         height: 30,
    //         //         // borderWidth: 1,
    //         //         marginVertical: 10,
    //         //         justifyContent: "center",
    //         //         alignItems: "center"

    //         //     }
    //         // },

    //     }
    // })
})