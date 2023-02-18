import React, { useEffect } from 'react';
import { View, StyleSheet, Text, SafeAreaView, TouchableOpacity, FlatList, RefreshControl, Platform } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Colors from '../Constants/Colors'
import Assets from '../Assets/Assets';
import { formatDateForAPI, getJSObjectFromTimeString, getProportionalFontSize } from '../Services/CommonMethods';
import Constants from '../Constants/Constants';
import EmptyDataContainer from './EmptyDataContainer';
import FooterCompForFlatlist from './FooterCompForFlatlist';
import { useSelector, } from 'react-redux';

export default ScheduleListComp = props => {

    const labels = useSelector(state => state.Labels);

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

    const renderListComp = (item, index) => {
        // console.log('getScheduleStatus(item)', getScheduleStatus(item))
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
        <FlatList
            ListEmptyComponent={<EmptyDataContainer style={{ paddingVertical: 10 }} />}
            data={props.scheduleList ?? []}
            renderItem={({ item, index }) => {
                return renderListComp(item, index)
            }}
            contentContainerStyle={{ paddingHorizontal: Constants.globalPaddingHorizontal, }}
            // style={{ paddingTop: 10 }}
            keyExtractor={item => '' + item.id}
            onEndReached={() => {
                props.getScheduleList(props.page + 1)
            }}
            onEndReachedThreshold={0.1}
            refreshControl={
                <RefreshControl
                    refreshing={props.isRefreshing}
                    onRefresh={() => {
                        props.getScheduleList(null, true)
                    }}
                />
            }
            ListFooterComponent={() => <FooterCompForFlatlist paginationLoading={props.paginationLoading} />}
        />
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
});
