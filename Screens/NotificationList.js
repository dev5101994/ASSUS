import React, { useState } from 'react'
import { StyleSheet, Text, View, ScrollView, FlatList, RefreshControl, Platform, TouchableOpacity, Image, ImageBackground } from 'react-native'
import { FAB } from 'react-native-paper';
import EmptyList from '../Components/EmptyList';
import Colors from '../Constants/Colors';
import { formatDate, formatDateWithTime, getProportionalFontSize } from '../Services/CommonMethods';
import { useSelector, useDispatch } from 'react-redux';
import BaseContainer from '../Components/BaseContainer';
import APIService from '../Services/APIService';
import Constants from '../Constants/Constants';
import Alert from '../Components/Alert';
import FooterCompForFlatlist from '../Components/FooterCompForFlatlist';
import ProgressLoader from '../Components/ProgressLoader'
import Assets from '../Assets/Assets';
import Icon from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import ListLoader from '../Components/ListLoader';
import moment from 'moment';


const NotificationList = (props) => {
    const [notificationList, setnotificationList] = React.useState([])
    // REDUX hooks
    const labels = useSelector(state => state.Labels);
    const UserLogin = useSelector(state => state.User.UserLogin);
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [page, setPage] = useState(0);
    const [paginationLoading, setPaginationLoading] = useState(false);

    React.useEffect(() => {
        getNotificationList()
    }, [])

    React.useEffect(() => {
        const unsubscribe = props.navigation.addListener('focus', () => {
            // The screen is focused
            // Call any action
            // console.log('Focus___________________________________________')
            getNotificationList(null, true);
        });
        // Return the function to unsubscribe from the event so it gets removed on unmount
        return unsubscribe;
    }, [props.navigation]);

    const getNotificationList = async (page, refresh, patient) => {
        if (refresh)
            setIsRefreshing(true)
        else if (!page)
            setIsLoading(true);
        else
            setPaginationLoading(true)
        let params = {
            "perPage": Constants.perPage,
            "page": page ?? 1,
        }

        let url = Constants.apiEndPoints.notifications;
        let response = await APIService.postData(url, params, UserLogin.access_token, null, "AllNotificationsAPI");
        if (!response.errorMsg) {
            if (!page) {
                setnotificationList(response.data.payload.data);
                setIsLoading(false);
                if (refresh)
                    setIsRefreshing(false);
                setPage(1);
            }
            else {
                let tempList = [...notificationList];
                tempList = tempList.concat(response.data.payload.data);
                setPage(page);
                setnotificationList([...tempList]);
                setPaginationLoading(false);
            }
        }
        else {
            if (!page)
                setIsLoading(false);
            else
                setPaginationLoading(false)
            if (refresh)
                setIsRefreshing(false);
            Alert.showAlert(Constants.danger, response.errorMsg)
        }
    }

    const isUserHasModule = (moduleToCheck) => {
        let temp = UserLogin.assigned_module
        let isUserHasModule = temp.find((obj) => {
            return obj.module.name == Constants.allModules[moduleToCheck]
        })
        if (isUserHasModule)
            return true
        else
            return false
    }

    const navigateFromNotification = (item) => {
        let localNavData = {
            screen: item?.screen ?? "",
            module: item?.module ?? "",
            id: item?.data_id ?? "",
        };

        if (!localNavData?.screen && !localNavData?.module)
            return;

        switch (localNavData.module) {
            case "activity":
                if (localNavData?.type == "trashed-activity") {
                    props.navigation.navigate('TrashedActivity')
                }
                else if (localNavData?.screen == "list") {
                    props.navigation.navigate('ActivityStack')
                }
                else if (localNavData?.screen == "detail" && localNavData?.id !== null && localNavData?.id !== undefined) {
                    let hasPerm = isUserHasModule(Constants.allModules.Activity);
                    if (hasPerm)
                        props.navigation.navigate('ActivityStack', { screen: "ActivityDetails", params: { itemId: localNavData?.id } })
                    else
                        props.navigation.navigate('ActivityStack')
                }
                break;
            case "task":
                if (localNavData?.screen == "list") {
                    props.navigation.navigate('TaskStack')
                }
                else if (localNavData?.screen == "detail" && localNavData?.id !== null && localNavData?.id !== undefined) {
                    props.navigation.navigate('TaskStack', { screen: "TaskDetails", params: { taskID: localNavData?.id } })
                }
                break;
            case "journal":
                if (localNavData?.screen == "list") {
                    props.navigation.navigate('JournalsListing')
                }
                else if (localNavData?.screen == "detail" && localNavData?.id !== null && localNavData?.id !== undefined) {
                    let hasPerm = isUserHasModule(Constants.allModules.Journal);
                    if (hasPerm)
                        props.navigation.navigate('JournalDetail', { itemID: localNavData?.id })
                    else
                        props.navigation.navigate('JournalsListing')
                }
                break;
            case "deviation":
                if (localNavData?.screen == "list") {
                    props.navigation.navigate('DeviationStack')
                }
                else if (localNavData?.screen == "detail" && localNavData?.id !== null && localNavData?.id !== undefined) {
                    let hasPerm = isUserHasModule(Constants.allModules.Deviation);
                    if (hasPerm)
                        props.navigation.navigate('DeviationStack', { screen: "DeviationDetails", params: { itemId: localNavData?.id } })
                    else
                        props.navigation.navigate('DeviationStack')
                }
                break;
            case "messages":
                if (localNavData?.screen == "list") {
                    props.navigation.navigate('MessagesStack')
                }
                else if (localNavData?.screen == "detail" && localNavData?.id !== null && localNavData?.id !== undefined) {
                    props.navigation.navigate('MessagesStack', { screen: "ChatScreen", params: { itemID: localNavData?.id } })
                }
                break;
            case "Module":
                if (localNavData?.type == "module-request") {
                    props.navigation.navigate('RequestsStack')
                }
                break;
            case "schedule":
                if (localNavData?.type == 'leave') {
                    props.navigation.navigate('LeavesStack')
                }
                else if (localNavData?.type == 'schedule') {
                    props.navigation.navigate('ScheduleStack')
                }
                break;
            case "plan":
                if (localNavData?.type == "ip") {
                    if (localNavData?.screen == "list") {
                        props.navigation.navigate('ImplementationPlanStack')
                    }
                    else if (localNavData?.screen == "detail" && localNavData?.id !== null && localNavData?.id !== undefined) {
                        props.navigation.navigate('ImplementationPlanStack', { screen: "ImplementationPlanDetail", params: { itemId: localNavData?.id } })
                    }
                }
                else if (localNavData?.type == "followup") {
                    if (localNavData?.screen == "list") {
                        props.navigation.navigate('ImplementationPlanStack', { screen: "FollowUpListing" })
                    }
                    else if (localNavData?.screen == "detail" && localNavData?.id !== null && localNavData?.id !== undefined) {
                        props.navigation.navigate('ImplementationPlanStack', { screen: "FollowUpDetails", params: { followUPId: localNavData?.id } })
                    }
                }
                break;
            case "user":
                if (localNavData?.type == 'branch') {
                    if (localNavData?.screen == "list") {
                        props.navigation.navigate('BranchListing')
                    }
                    else if (localNavData?.screen == "detail" && localNavData?.id !== null && localNavData?.id !== undefined) {
                        props.navigation.navigate("CommonUserProfile", { itemId: localNavData?.id, url: Constants.apiEndPoints.userView, user_type_id: '11' })
                    }
                }
                else if (localNavData?.type == 'patient') {
                    if (localNavData?.screen == "list") {
                        props.navigation.navigate('PatientListing')
                    }
                    else if (localNavData?.screen == "detail" && localNavData?.id !== null && localNavData?.id !== undefined) {
                        props.navigation.navigate("CommonUserProfile", { itemId: localNavData?.id, url: Constants.apiEndPoints.userView, user_type_id: '6' })
                    }
                }
                else if (localNavData?.type == 'employee') {
                    if (localNavData?.screen == "list") {
                        props.navigation.navigate('EmployeeListing')
                    }
                    else if (localNavData?.screen == "detail" && localNavData?.id !== null && localNavData?.id !== undefined) {
                        props.navigation.navigate("CommonUserProfile", { itemId: localNavData?.id, url: Constants.apiEndPoints.userView, user_type_id: '3' })
                    }
                }
                break;
            default:
                break;
        }
    }

    const flatListRenderItem = ({ item, index }) => {
        return (
            <View style={{
                flexDirection: "row",
                marginHorizontal: 16,
                flex: 1,
            }}>
                <View style={{ marginRight: 8, width: 7, flexDirection: "column", justifyContent: "space-between", alignItems: "center", }} >
                    <View style={{ backgroundColor: index == 0 ? Colors.transparent : Colors.lightGray, width: 1, height: "22%", }} />
                    <View style={{ backgroundColor: item.read_status ? Colors.primary : Colors.borderColor, width: "100%", height: "60%", borderRadius: 20, }} />
                    <View style={{ backgroundColor: Colors.lightGray, width: 1, height: "22%", }} />
                </View>
                <TouchableOpacity
                    onPress={() => {
                        if (!item.read_status) {
                            let url = Constants.apiEndPoints.notification + "/" + item.id + "/read"
                            APIService.getData(url, UserLogin.access_token, null, "read notification API");
                        }
                        navigateFromNotification(item)
                    }}
                    style={[styles.cardMainView, { backgroundColor: item.read_status ? Colors.white : Colors.borderColor, }]}>
                    <Text numberOfLines={1} style={styles.dateText}>{moment(item.created_at).calendar("yyyy/MM/DD")}</Text>
                    <View style={{
                        width: getProportionalFontSize(40),
                        height: getProportionalFontSize(40),
                        borderRadius: 30,
                        backgroundColor: item.read_status ? Colors.primary : Colors.lightGray,
                        justifyContent: "center",
                        alignItems: "center",
                        marginLeft: getProportionalFontSize(5),
                    }}>
                        <Feather name='bell' size={20} color={Colors.white} />

                    </View>
                    <View style={{
                        width: "85%",

                    }}>
                        <Text numberOfLines={1} style={styles.nameText}>{item?.title ?? "New Notification"}</Text>
                        <Text style={styles.smallText}>{item?.message ?? ""}</Text>

                    </View>



                </TouchableOpacity>
            </View>
        )
    }
    return (
        <BaseContainer
            onPressLeftIcon={() => { props.navigation.openDrawer() }}
            leftIcon="list"
            leftIconSize={24}
            title={labels.notification_list ?? "notification"}
            leftIconColor={Colors.primary}
        >
            {
                isLoading
                    ? <ListLoader />
                    :
                    <View style={{ flex: 1 }}>
                        {/* <ImageBackground style={{ flex: 1 }} source={Assets.images.backGroundImage}> */}
                        <View style={styles.mainView}>
                            <FlatList
                                ListEmptyComponent={<EmptyList messageIcon="bell" title={labels.empty_notification_message} shouldAddDataMessageVisible={false} />}
                                data={notificationList}
                                renderItem={flatListRenderItem}
                                keyExtractor={(item, index) => '' + item.id}
                                showsVerticalScrollIndicator={false}
                                style={{ paddingTop: Constants.formFieldTopMargin, marginTop: 1 }}
                                refreshControl={(
                                    <RefreshControl
                                        refreshing={isRefreshing}
                                        onRefresh={() => {
                                            getNotificationList(null, true);
                                        }}
                                    />
                                )}
                                contentContainerStyle={{
                                    paddingBottom: 20,
                                    //paddingHorizontal: Constants.globalPaddingHorizontal
                                }}
                                ListFooterComponent={() => <FooterCompForFlatlist paginationLoading={paginationLoading} />}
                                onEndReachedThreshold={0.3}
                                onEndReached={() => {
                                    getNotificationList(page + 1)
                                }}
                            />
                        </View>
                        {/* </ImageBackground> */}
                    </View>
            }
        </BaseContainer>
    )
}

export default NotificationList

const styles = StyleSheet.create({
    mainView: {
        flex: 1,
        // borderWidth: 1,
        backgroundColor: Colors.transparent,
        // paddingBottom: 20,
    },

    cardMainView: {

        flex: 1,
        justifyContent: "space-between",
        shadowOffset: { width: 3, height: 3, },
        shadowOpacity: 10,
        elevation: 8,
        shadowColor: Platform.OS == "ios" ? Colors.shadowColorIosDefault : Colors.shadowColorAndroidDefault,
        shadowRadius: 10,
        marginVertical: 10,
        borderRadius: 10,
        paddingHorizontal: 5,
        paddingVertical: 15,
        flexDirection: "row",
        borderColor: Colors.placeholderTextColor,
    },
    imageView: {
        width: 30,
        height: 30,
        borderRadius: 30,
        backgroundColor: Colors.primary,

        // display: "flex",
        justifyContent: "center",
        alignItems: "center",

    },
    image: { height: 60, width: 60, borderRadius: 40 },
    nameText: { fontFamily: Assets.fonts.semiBold, fontSize: getProportionalFontSize(14), color: Colors.black },
    // rightView: { justifyContent: "space-between", alignItems: "flex-end", flex: 1 },
    dateText: {
        fontFamily: Assets.fonts.regular, fontSize: getProportionalFontSize(12), color: Colors.activity_grey,
        position: "absolute",
        top: 0,
        right: 15,
        marginTop: getProportionalFontSize(6)
    },
    // messageCounterView: { justifyContent: "center", alignItems: "center", borderRadius: 50, width: 35, height: 35, backgroundColor: Colors.primary, padding: 2 },
    smallText: { fontFamily: Assets.fonts.semiBold, fontSize: getProportionalFontSize(10), color: Colors.activity_grey, marginTop: 5 }
})