import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import Colors from '../Constants/Colors'
import Constants from '../Constants/Constants'
import { getProportionalFontSize } from '../Services/CommonMethods'
import Assets from '../Assets/Assets'// icons
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Icon from 'react-native-vector-icons/Feather';
import Icon2 from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import moment from 'moment'

import { DataTable } from 'react-native-paper';

const ScheduleListCard = ({ item, index, allDates, labels }) => {
    let dt = allDates ?? []
    const [shiftTimeArr, setShiftTimeArr] = React.useState([])
    React.useEffect(() => {
        let shift_time_arr = []
        if (item?.schedules?.length > 0) {
            dt.map((date, index) => {
                shift_time_arr.push("-")
                item?.schedules.map((obj, i) => {
                    if (moment(date).format('YYYY-MM-DD') == moment(obj.shift_date).format('YYYY-MM-DD')) {
                        let shift_time = `${obj.start_time}-${obj.end_time}`
                        shift_time_arr.pop()
                        shift_time_arr.push(shift_time)
                    }
                })
            })
        } else {
            dt.map((date, index) => {
                shift_time_arr.push("-")
            })
        }
        setShiftTimeArr(shift_time_arr)
    }, [])


    return (
        <View style={{ backgroundColor: index % 2 != 0 ? "#00000015" : Colors.white, }}>
            {
                index == 0
                    ? <DataTable.Header style={{ backgroundColor: index % 2 == 0 ? "#00000022" : Colors.white }}>
                        <DataTable.Title style={{ paddingHorizontal: 10, width: 100, }}>
                            <Text style={{
                                fontSize: getProportionalFontSize(12), fontFamily: Assets.fonts.medium, color: Colors.black
                            }}>{labels['employees']}</Text>
                        </DataTable.Title>
                        {
                            dt.map((item1, i) => (
                                <DataTable.Title style={{
                                    ...styles.row,
                                }}
                                    textStyle={
                                        { fontFamily: Assets.fonts.medium, fontSize: 10 }
                                    } >  <Text style={{
                                        fontSize: getProportionalFontSize(12), fontFamily: Assets.fonts.medium, color: Colors.black
                                    }}>{item1}</Text></DataTable.Title>
                            ))
                        }
                    </DataTable.Header>
                    : null
            }

            <DataTable.Row>
                <DataTable.Cell style={{ paddingHorizontal: 10, width: 100, }}>
                    <Text style={{
                        fontSize: getProportionalFontSize(11), fontFamily: Assets.fonts.medium, color: Colors.black
                    }}>{item.name}</Text> </DataTable.Cell>
                {/* {
                    item?.schedules?.length > 0
                        ? item?.schedules.map((obj, i) => (
                            obj?.leave_applied == 0
                                ? <DataTable.Cell style={{
                                    ...styles.row
                                }} >{obj.start_time}-{obj.end_time}</DataTable.Cell>
                                : <DataTable.Cell style={{
                                    ...styles.row
                                }}>S</DataTable.Cell>
                        )
                        )
                        : dt.map((item1, i) => (
                            <DataTable.Title style={{
                                ...styles.row
                            }}>{""}</DataTable.Title>
                        ))

                } */}
                {
                    shiftTimeArr.map((date, i) => (
                        <DataTable.Cell style={{
                            ...styles.row
                        }} ><Text style={{
                            fontSize: getProportionalFontSize(11), fontFamily: Assets.fonts.medium, color: Colors.black
                        }}>{date}</Text>  </DataTable.Cell>
                    ))
                }
            </DataTable.Row>
        </View>
    )
}

export default ScheduleListCard

const styles = StyleSheet.create({
    row: { paddingHorizontal: 10, width: 100, borderLeftWidth: 0.5, borderColor: Colors.lightGray },
    //
    container: {
        width: "100%",

        backgroundColor: Colors.white,
        marginBottom: 20,
        borderRadius: 20,
        elevation: 10,
        shadowOffset: { width: 3, height: 3, },
        shadowOpacity: 10,
        shadowColor: Platform.OS == "ios" ? Colors.shadowColorIosDefault : Colors.shadowColorAndroidDefault,
        shadowRadius: 20,
    },
    titleStyle: {
        // textAlign: "justify",
        fontSize: getProportionalFontSize(14),
        color: Colors.black,
        fontFamily: Assets.fonts.semiBold,
        marginBottom: 5
    },
    textStyle: {
        // textAlign: "justify",
        fontSize: getProportionalFontSize(12),
        color: Colors.gray,
        fontFamily: Assets.fonts.semiBold,
        marginBottom: 5
    }
})