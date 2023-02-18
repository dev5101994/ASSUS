import React from 'react'
import { StyleSheet, Text, View, ScrollView, FlatList, RefreshControl, TouchableOpacity, Platform, Image, ImageBackground } from 'react-native'
import { FAB } from 'react-native-paper';
import EmptyList from '../Components/EmptyList';
import Colors from '../Constants/Colors';
import { formatDate, formatDateByFormat, formatTime, funGetTime, getJSObjectFromTimeString, getProportionalFontSize } from '../Services/CommonMethods';
import { useSelector, useDispatch } from 'react-redux';
import BaseContainer from '../Components/BaseContainer';
import Constants from '../Constants/Constants';
import APIService from '../Services/APIService';
import ListLoader from '../Components/ListLoader';
import Can from '../can/Can';
import { Modal, Portal, } from 'react-native-paper';
import FooterCompForFlatlist from '../Components/FooterCompForFlatlist';
import Alert from '../Components/Alert';
import Assets from '../Assets/Assets';
import CustomButton from '../Components/CustomButton';
import ProgressLoader from '../Components/ProgressLoader';
import PickerAndLocationServices from '../Services/PickerAndLocationServices';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import EmptyDataContainer from '../Components/EmptyDataContainer';
import ScheduleListModal from '../Components/ScheduleListModal';

const StamplingList = (props) => {
    // REDUX hooks
    //  const dispatch = useDispatch();
    //  const isInternetActive = useSelector(state => state.IsInternetActive);
    const UserLogin = useSelector(state => state.User.UserLogin);
    const permissions = UserLogin?.permissions ?? {};
    const labels = useSelector(state => state.Labels);
    const previous = "previous";
    const current = "current";

    //hooks
    const [listData, setListData] = React.useState([]);
    const [currentlyLoggedInData, setCurrentlyLoggedInData] = React.useState([]);
    const [isLoading, setIsLoading] = React.useState(true);
    const [isRefreshing, setIsRefreshing] = React.useState(false);
    const [paginationLoading, setPaginationLoading] = React.useState(false);
    const [page, setPage] = React.useState(0);
    const [scheduleModalVisible, setScheduleModalVisible] = React.useState(false);
    const [StamplingItem, setStamplingItem] = React.useState(null);
    const [loginButtonLoading, setLoginButtonLoading] = React.useState(false);
    const [reasonPlaceHolder, setReasonPlaceHolder] = React.useState('');
    const netInfoDetails = useSelector(state => state.NetInfoDetails);
    const [scheduleObj, setScheduleObj] = React.useState(null);
    const [selectedTab, setSelectedTab] = React.useState(current);


    React.useEffect(() => {
        getCurrentlyStampedList()
        getListData()
    }, [])

    React.useEffect(() => {
        const unsubscribe = props.navigation.addListener('focus', () => {
            // console.log('Focus___________________________________________')
            getCurrentlyStampedList()
            getListData(null, true)
        });
        return unsubscribe;
    }, [props.navigation]);


    const isUserHasModule = () => {
        let temp = UserLogin.assigned_module
        let isUserHasModule = temp.find((obj) => {
            return obj.module.name == Constants.allModules["Stampling"]
        })
        if (isUserHasModule)
            return true
        else
            return false
    }


    const getCurrentlyStampedList = async () => {
        let url = Constants.apiEndPoints.stampInData;
        let response = await APIService.getData(url, UserLogin.access_token, null, 'getCurrentlyStampedList..API');
        if (!response.errorMsg) {
            let tempCurrentlyLoggedInData = response.data.payload ?? [];
            setCurrentlyLoggedInData(tempCurrentlyLoggedInData)
        } else {
            Alert.showToast(response.errorMsg);
        }
    }

    const getListData = async (page, refresh) => {
        if (refresh) setIsRefreshing(true);
        else if (!page) setIsLoading(true);
        else setPaginationLoading(true);
        let params = {
            perPage: Constants.perPage,
            page: page ?? 1,
        };

        let url = Constants.apiEndPoints.stamplings;
        let response = await APIService.postData(url, params, UserLogin.access_token, null, 'StamplingListAPI');
        if (!response.errorMsg) {
            if (!page) {
                setPage(1);
                let priviousData = response.data.payload.data;
                // let tempCurrentlyLoggedInData = [];
                // response.data.payload.data.map((item) => {
                //     if (item.out_time)
                //         priviousData = priviousData.concat(item)
                //     else
                //         tempCurrentlyLoggedInData = tempCurrentlyLoggedInData.concat(item)
                // })
                setListData(priviousData);
                // setCurrentlyLoggedInData(tempCurrentlyLoggedInData)
                setIsLoading(false);
                if (refresh) setIsRefreshing(false);
            } else {
                let priviousData = response.data.payload.data;
                // let tempCurrentlyLoggedInData = [];
                // response.data.payload.data.map((item) => {
                //     if (item.out_time)
                //         priviousData = priviousData.concat(item)
                //     else
                //         tempCurrentlyLoggedInData = tempCurrentlyLoggedInData.concat(item)
                // })
                let tempList = [...listData];
                // let tempCurrList = [...currentlyLoggedInData];
                tempList = tempList.concat(priviousData);
                //  tempCurrList = tempCurrList.concat(tempCurrentlyLoggedInData);
                setPage(page);
                setListData([...tempList]);
                //  setCurrentlyLoggedInData(tempCurrList)
                setPaginationLoading(false);
            }
        } else {
            if (!page) setIsLoading(false);
            else setPaginationLoading(false);
            if (refresh) setIsRefreshing(false);
            Alert.showAlert(Constants.danger, response.errorMsg);
        }
    }

    const deleteListItemAPI = async (item, index) => {
        setIsLoading(true);
        // console.log('item', item)
        let url = Constants.apiEndPoints.stampling + "/" + item.id;
        let response = await APIService.deleteData(url, UserLogin.access_token, null, "deleteStamplingAPI");
        if (!response.errorMsg) {
            let tempList = [...listData];
            tempList.splice(index, 1)
            setListData(tempList);
            Alert.showToast(labels.message_delete_success)
            setIsLoading(false);
        }
        else {
            setIsLoading(false);
            Alert.showAlert(Constants.danger, response.errorMsg)
        }
    }

    const createStamp = async (type, locationOBJ, schedule, punchin_id) => {
        let reason = lateOrEarlyReasonDecider_logout(schedule)
        if (reason) {
            setReasonPlaceHolder(reason)
            schedule['punchin_id'] = punchin_id ?? null
            setScheduleObj(schedule)
            setScheduleModalVisible(true)
            return;
        }
        let params = {
            "type": type,
            "location": {
                "lat": locationOBJ.coords.latitude,
                "lng": locationOBJ.coords.longitude,
                "ip_address": netInfoDetails?.ipAddress ?? "",
            },
            "schedule_id": schedule?.id ?? null,
            "punchin_id": punchin_id ?? null
        }
        let url = Constants.apiEndPoints.stampling;
        let response = await APIService.postData(url, params, UserLogin.access_token, null, "createStamp API");
        if (!response.errorMsg) {
            getCurrentlyStampedList()
            getListData(null, true)
            setLoginButtonLoading(false);
            Alert.showToast(labels.stamp_out_success_msg)
        }
        else {
            setLoginButtonLoading(false);
            Alert.showAlert(Constants.danger, response.errorMsg)
        }
    }

    const lateOrEarlyReasonDecider_logout = (scheduleOBJ) => {
        // return labels.mobile_reason_for_late_logout;

        if (scheduleOBJ?.shift_end_date) {
            let shift_end_date = getJSObjectFromTimeString(scheduleOBJ?.shift_end_time);
            if (!isNaN(shift_end_date)) {
                let currDate = new Date();
                if (shift_end_date.getMonth() < currDate.getMonth()) {
                    return labels.mobile_reason_for_late_logout;
                }
                else if (shift_end_date.getMonth() == currDate.getMonth()) {
                    if (shift_end_date.getDate() < currDate.getDate()) {
                        return labels.mobile_reason_for_late_logout;
                    }
                }
            }
        }

        if (scheduleOBJ?.shift_end_time) {
            let shift_end_time = getJSObjectFromTimeString(scheduleOBJ?.shift_end_time)
            if (!isNaN(shift_end_time)) {
                let currTime = new Date();
                if (currTime.getTime() > shift_end_time.getTime()) {
                    if (currTime.getHours() == shift_end_time.getHours()) {
                        if (currTime.getMinutes() - shift_end_time.getMinutes() > Constants.employee_relaxation_time_in_minutes)
                            return labels.mobile_reason_for_late_logout;
                        else
                            return '';
                    }
                    else {
                        return labels.mobile_reason_for_late_logout;
                    }
                }
                else if (currTime.getTime() < shift_end_time.getTime()) {
                    if (shift_end_time.getHours() - currTime.getHours() == 1) {
                        if (shift_end_time.getMinutes() - currTime.getMinutes() > Constants.employee_relaxation_time_in_minutes) {
                            return labels.mobile_reason_for_early_logout;
                        }
                        else if (currTime.getMinutes() - shift_end_time.getMinutes() > Constants.employee_relaxation_time_in_minutes) {
                            return labels.mobile_reason_for_early_logout;
                        }
                        else return '';
                    }
                    else {
                        return labels.mobile_reason_for_early_logout;
                    }
                }
                else
                    return '';
            }
            return '';
        }
        return '';
    }



    const flatListRenderItem = ({ item, index }, stampOutVisible) => {
        return (
            <View style={styles.cardContainer}>

                <View style={[styles.rowStyle, { justifyContent: "flex-start", marginTop: 0 }]}>
                    <View style={[styles.rowStyle, { marginTop: 0, flex: 1, }]}>
                        <Text numberOfLines={1} style={[styles.normalText, {}]}>{labels.date}</Text>
                        <Text numberOfLines={1} style={[styles.normalText, {}]}> : </Text>
                    </View>
                    <Text numberOfLines={1} style={{ ...styles.boldText, flex: 3.5, marginStart: 5 }}>{stampOutVisible ? (item.in_time ? formatDateByFormat(item.in_time, 'yyyy-MM-DD') : '') : item.date}</Text>
                </View>

                {item.in_time
                    ? <View style={[styles.rowStyle, { justifyContent: "flex-start", marginTop: 0 }]}>
                        <View style={[styles.rowStyle, { marginTop: 0, flex: 1, }]}>
                            <Text numberOfLines={1} style={[styles.normalText, {}]}>{labels.in_time}</Text>
                            <Text numberOfLines={1} style={[styles.normalText, {}]}> : </Text>
                        </View>
                        <Text numberOfLines={1} style={{ ...styles.boldText, flex: 3.5, marginStart: 5 }}>{formatTime(item.in_time)}</Text>
                    </View> : null}

                {item.out_time
                    ? <View style={[styles.rowStyle, { justifyContent: "flex-start", marginTop: 0 }]}>
                        <View style={[styles.rowStyle, { marginTop: 0, flex: 1, }]}>
                            <Text numberOfLines={1} style={[styles.normalText, {}]}>{labels.out_time}</Text>
                            <Text numberOfLines={1} style={[styles.normalText, {}]}> : </Text>
                        </View>
                        <Text numberOfLines={1} style={{ ...styles.boldText, flex: 3.5, marginStart: 5 }}>{formatTime(item.out_time)}</Text>
                    </View> : null}

                {/* LOG OUT BUTTON */}
                {/* {item.out_time === null
                    ?  */}
                {stampOutVisible
                    ? <TouchableOpacity onPress={() => {
                        if (!loginButtonLoading) {
                            setLoginButtonLoading(true)
                            PickerAndLocationServices.getCurrentLocation((position) => { createStamp('OUT', position, item.schedule, item?.id) }, () => { setLoginButtonLoading(false) })
                        }
                    }}
                        style={[styles.logInFab, { height: 35, width: 90, bottom: 5, right: 5 }]}>
                        {loginButtonLoading
                            ? <ProgressLoader onActivityIndicator={true} onActivityIndicatorSize='small' onActivityIndicatorColor={Colors.white} />
                            : <Text style={[styles.loginText, { fontSize: getProportionalFontSize(13), }]}>{labels.stamp_out}</Text>}
                    </TouchableOpacity> : null}
            </View>
        )
    }

    const onRequestClose = () => {
        // console.log('onRequestClose called')
        setStamplingItem(null)
        setScheduleModalVisible(false);
        setLoginButtonLoading(false)
        setReasonPlaceHolder('')
        setScheduleObj(null)
    }

    const isStampedIn = (id) => {
        for (let i = 0; i < currentlyLoggedInData?.length; i++) {
            if (currentlyLoggedInData[i]?.id == id)
                return true;
        }
        return false;
    }

    // Render
    //console.log('currentlyLoggedInData', JSON.stringify(currentlyLoggedInData))
    return (
        <BaseContainer
            onPressLeftIcon={() => {
                if (!loginButtonLoading)
                    props.navigation.pop()
            }}
            leftIcon="arrow-back"
            leftIconSize={24}
            title={labels.stampling}
            headerBar={{ backgroundColor: Colors.blueMagenta }}
            rightIcon={(loginButtonLoading || !isUserHasModule()) ? null : "login"}
            rightIconSize={30}
            onPressRightIcon={() => {
                if (!loginButtonLoading) {
                    setLoginButtonLoading(true)
                    // getUserScheduleList()
                    setScheduleModalVisible(true)
                }
            }}
        >
            {
                isLoading
                    ? <ListLoader />
                    : !isUserHasModule()
                        ? <EmptyList navigation={props.navigation} noModuleMsg={true} />
                        : <View source={Assets.images.stamplingBG} style={styles.mainView}>
                            {/* MODAL */}
                            <Portal>
                                <Modal
                                    animationType="slide"
                                    transparent={true}
                                    style={{}}
                                    visible={scheduleModalVisible}
                                    onRequestClose={onRequestClose}
                                //  onDismiss={onRequestClose}
                                >
                                    <ScheduleListModal
                                        scheduleObj={scheduleObj}
                                        reasonPlaceHolder={reasonPlaceHolder}
                                        refreshAPI={() => {
                                            getCurrentlyStampedList()
                                            getListData(null, true)
                                        }}
                                        onRequestClose={onRequestClose}
                                    />
                                </Modal>
                            </Portal>

                            {/* Top Tab Bar */}
                            <View style={styles.tabBarMainView}>
                                <TouchableOpacity
                                    onPress={() => { setSelectedTab(current) }}
                                    style={[styles.tabView, { backgroundColor: selectedTab == current ? Colors.primary : Colors.white, borderTopEndRadius: 15 }]}>
                                    <Text numberOfLines={2}
                                        style={[styles.tabText, { color: selectedTab == current ? Colors.white : Colors.primary }]}>{labels.currently_logged_in}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => { setSelectedTab(previous) }}
                                    style={[styles.tabView, { backgroundColor: selectedTab == previous ? Colors.primary : Colors.white, borderTopLeftRadius: 15 }]}>
                                    <Text numberOfLines={2}
                                        style={[styles.tabText, { color: selectedTab == previous ? Colors.white : Colors.primary }]}>{labels.previous}</Text>
                                </TouchableOpacity>
                            </View>


                            {/* <Image resizeMode="stretch" style={styles.stamplingHeader} source={Assets.images.stamplingHeader} /> */}

                            {/* currently logged in */}
                            {/* <Text numberOfLines={1} style={{ ...styles.boldText, marginTop: 20, fontSize: getProportionalFontSize(17), paddingHorizontal: Constants.globalPaddingHorizontal }}>{labels.currently_logged_in}</Text>
                            <ScrollView style={{ paddingHorizontal: Constants.globalPaddingHorizontal, }}>
                                {currentlyLoggedInData?.length > 0
                                    ? currentlyLoggedInData.map((item, index) => {
                                        return flatListRenderItem({ item, index }, true)
                                    })
                                    : <EmptyDataContainer style={{ paddingVertical: 10 }} />
                                }

                            </ScrollView> */}

                            {/* Previous */}
                            {/* <Text numberOfLines={1} style={{ ...styles.boldText, fontSize: getProportionalFontSize(17), paddingHorizontal: Constants.globalPaddingHorizontal }}>{selectedTab == current ? labels.currently_logged_in : selectedTab == previous ? labels.previous : ''}</Text> */}
                            <FlatList
                                ListEmptyComponent={<EmptyDataContainer style={{ paddingVertical: 10 }} />}
                                data={selectedTab == previous ? listData : selectedTab == current ? currentlyLoggedInData : []}
                                renderItem={({ item, index }) => {
                                    if (selectedTab == previous) {
                                        if (!isStampedIn(item?.id))
                                            return flatListRenderItem({ item, index })
                                    }
                                    else if (selectedTab == current) {
                                        return flatListRenderItem({ item, index }, true)
                                    }
                                    else
                                        return null
                                }}
                                contentContainerStyle={{ paddingHorizontal: Constants.globalPaddingHorizontal, }}
                                // style={{ paddingTop: 10 }}
                                keyExtractor={item => '' + item.id}
                                onEndReached={() => {
                                    if (selectedTab == previous)
                                        getListData(page + 1)
                                }}
                                onEndReachedThreshold={0.1}
                                refreshControl={
                                    <RefreshControl
                                        refreshing={isRefreshing}
                                        onRefresh={() => {
                                            getCurrentlyStampedList()
                                            getListData(null, true)
                                        }}
                                    />
                                }
                                ListFooterComponent={() => <FooterCompForFlatlist paginationLoading={paginationLoading} />}
                            />

                            {/* LOG IN FAB BUTTON */}
                            {/* <TouchableOpacity onPress={() => {
                            // if (currentlyLoggedInData?.length > 0) {
                            //     Alert.showAlert(Constants.warning, labels.already_stamped_inMsg);
                            //     return;
                            // }
                            if (!loginButtonLoading) {
                                setLoginButtonLoading(true)
                                // getUserScheduleList()
                                setScheduleModalVisible(true)
                            }
                        }}
                            style={styles.logInFab}>
                            {loginButtonLoading
                                ? <ProgressLoader onActivityIndicator={true} onActivityIndicatorSize='small' onActivityIndicatorColor={Colors.white} />
                                : <Text style={styles.loginText}>{labels.stamp_in}</Text>}
                        </TouchableOpacity> */}

                            {/* stamp in button (FLOATING) */}
                            {/* <TouchableOpacity
                                onPress={() => {
                                    if (!loginButtonLoading) {
                                        setLoginButtonLoading(true)
                                        // getUserScheduleList()
                                        setScheduleModalVisible(true)
                                    }
                                }}
                                style={styles.floatingPlusView}>
                                {loginButtonLoading
                                    ? <ProgressLoader onActivityIndicator={true} onActivityIndicatorSize='small' onActivityIndicatorColor={Colors.white} />
                                    : <MaterialCommunityIcons
                                        name="login"
                                        color={Colors.white}
                                        size={40}
                                    />}
                            </TouchableOpacity> */}

                        </View>
            }
        </BaseContainer>
    )
}

export default StamplingList

const styles = StyleSheet.create({
    mainView: {
        flex: 1,
        //paddingHorizontal: 24,
        // backgroundColor: Colors.backgroundColor,
        // paddingTop: "55%",
        // paddingBottom: 30,
    },
    tabBarMainView: { flexDirection: "row", alignItems: "center", width: "100%", marginTop: Constants.formFieldTopMargin, },
    tabView: {
        width: "50%", height: 43, justifyContent: "center", alignItems: "center", padding: 3,

    },
    tabText: { fontFamily: Assets.fonts.bold, fontSize: getProportionalFontSize(13), width: "100%", textAlign: "center" },
    stamplingHeader: {
        height: "40%",
        width: "100%",
        borderWidth: 1
    },
    floatingPlusView: {
        height: 70,
        width: 70,
        backgroundColor: Colors.darkPrimary,
        borderRadius: 22,
        position: "absolute",
        right: 12,
        bottom: 12,
        // top: "45%",
        justifyContent: "center",
        alignItems: "center",
        // shadow
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 15,
        elevation: 15,
        shadowColor: Colors.darkPrimary,
        shadowRadius: 6,
    },
    fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        backgroundColor: Colors.primary,
        bottom: 0,
    },
    logInFab: { zIndex: 100, flexDirection: "row", alignItems: "center", justifyContent: "center", position: "absolute", right: 15, bottom: 20, backgroundColor: Colors.primary, borderRadius: 15, height: 40, width: 150 },
    loginText: { fontFamily: Assets.fonts.boldItalic, fontSize: getProportionalFontSize(17), color: Colors.white },
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
    }
})
