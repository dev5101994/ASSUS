import React from 'react'; Icon
import { StyleSheet, Text, View, Image, FlatList, TouchableOpacity, Dimensions, RefreshControl, Linking, ActivityIndicator } from 'react-native';
import { Avatar } from 'react-native-paper';
import Colors from '../Constants/Colors';
import { getProportionalFontSize, getActionSheetAPIDetail, CurruntDate, CompareDates, funGetTime, createDateFormateFromTime, getJSObjectFromTimeString } from '../Services/CommonMethods';
import Assets from '../Assets/Assets';
// import Timeline
import Timeline from 'react-native-timeline-flatlist';
import Entypo from 'react-native-vector-icons/Entypo';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import comment from "../Assets/images/comment.png"
import Alert from './Alert';
import Constants from '../Constants/Constants';
import APIService from '../Services/APIService'
import { useSelector, useDispatch } from 'react-redux';
import { Modal, Portal, Provider, } from 'react-native-paper';
import ModalComp from './ModalComp';
import ActionSheet from "react-native-actions-sheet";
import ActionSheetComp from './ActionSheetComp';
import TaskListingModel from './TaskListingModel';
import ActionSheetForComment from './ActionSheetForComment';
import FooterCompForFlatlist from './FooterCompForFlatlist';
import Can from '../can/Can';
import moment from 'moment';
import { color } from 'react-native-reanimated';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Foundation from 'react-native-vector-icons/Foundation';
import ColorPicker from 'react-native-wheel-color-picker';
// import { FAB, Portal, Provider, Modal } from 'react-native-paper';

const { width, height } = Dimensions.get('window');

const buttons = [
    "Done", "Edit", "Share", "Comment", "Not Applicable"
]



const FirstLatterofString = (label) => {
    // let text = "HELLO WORLD";
    let letter = label.charAt(0);
    let uppercase = letter.toUpperCase();
    return (uppercase)
}

const ActivityTimeline = (props) => {
    // REDUX hooks
    const dispatch = useDispatch();
    const isInternetActive = useSelector(state => state.IsInternetActive);
    const UserLogin = useSelector(state => state.User.UserLogin);
    const permissions = UserLogin?.permissions ?? {}
    // Hooks
    const actionSheetRef = React.useRef();
    //hooks
    const [btnIsLoading, setBtnIsLoading] = React.useState(false)
    const [isModalVisible, setIsModalVisible] = React.useState(false);
    const [isTaskModalVisible, setIsTaskModalVisible] = React.useState(false);
    const [tempdata, settempdata] = React.useState({});
    const [activityId, setActivityId] = React.useState();
    const [modelView, setModelView] = React.useState({});
    const [actionSheetDecide, setActionSheetDecide] = React.useState('');
    const [employee, setEmployee] = React.useState();
    const [employeeAS, setEmployeeAS] = React.useState(getActionSheetAPIDetail({
        url: Constants.apiEndPoints.userList, params: { user_type_id: '3' }, debugMsg: "employee-list", token: UserLogin.access_token, perPage: Constants.perPage,
        selectedData: employee ? employee : []
    }));


    const openUrl = async (url, msg) => {
        // console.log("openurl", url)
        try {
            await Linking.openURL(url)
        } catch (err) {
            Alert.showAlert(Constants.warning, msg)
        }

    }

    const openModel = (rowData, view) => {
        setModelView(view)
        // console.log("rowData", rowData)
        setIsModalVisible(true);
        settempdata(rowData)
        // console.error("isModalVisible", isModalVisible)
    }
    const onRequestClose = () => {
        // console.log('onRequestClose called')
        // setCategoryItem(null);
        setActivityId(null)
        setIsModalVisible(false);
        setIsTaskModalVisible(false)
    }

    const getStatus = (status, end_time) => {
        if (status == 0) {
            if (end_time) {
                let end_time_obj = getJSObjectFromTimeString(end_time)
                if (!isNaN(end_time_obj)) {
                    let currTime = new Date().getTime();
                    if (currTime > end_time_obj.getTime())
                        return 'not_done'
                    else
                        return 'pending'
                }
                else
                    return 'pending'
            }
            else {
                return 'pending'
            }
        }
        else if (status == 1) {
            return 'done'
        }
        else if (status == 2) {
            return 'not_done'
        }
        else if (status == 3) {
            return 'not_applicable'
        }
    }


    const activityStatusColor = {
        pending: Colors.primary,
        done: Colors.green,
        not_done: Colors.darkRed,
        not_applicable: Colors.activity_grey
    }


    const renderDetail = (rowData, sectionID, rowID) => {
        //  console.log('sectionID', sectionID)
        return (

            <View style={{}}>
                {/* <View style={styles.triangleChat} /> */}
                <View style={styles.StartEndDate}>
                    {rowData?.start_date
                        ? <View style={styles.Calender}>

                            <Icon name={"calendar"} size={13} color={(activityStatusColor[getStatus(rowData?.status, rowData?.end_time)])} />

                            <Text style={{
                                fontFamily: Assets.fonts.bold,
                                fontSize: getProportionalFontSize(13),
                                color: (activityStatusColor[getStatus(rowData?.status, rowData?.end_time)])
                            }}> {rowData?.start_date} </Text>
                        </View> : null}

                    {rowData?.start_time
                        ? <View style={styles.time}>

                            <Icon name={"time"} size={13} color={(activityStatusColor[getStatus(rowData?.status, rowData?.end_time)])} />

                            <Text style={{
                                fontFamily: Assets.fonts.bold,
                                fontSize: getProportionalFontSize(13),
                                color: (activityStatusColor[getStatus(rowData?.status, rowData?.end_time)])
                            }}> {rowData?.start_time} - {rowData?.end_time} </Text>
                        </View> : null}
                </View>
                {/* <View style={styles.triangleChat} /> */}

                <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={Can(Constants.permissionsKey.activityRead, permissions)
                        ? () => { props.navigation.navigate("ActivityDetails", { itemId: rowData.id }) } : () => Alert.showToast(props.label.permission_required_for_this_action)

                    } style={{
                        ...styles.cardContainer,

                        backgroundColor: Colors.white,
                        shadowColor: activityStatusColor[getStatus(rowData?.status, rowData?.end_time)]
                    }}>

                    {/* HeaderTittle */}
                    {/* <View style={styles.triangleChatMySide} /> */}

                    <View style={{ ...styles.patientView, backgroundColor: activityStatusColor[getStatus(rowData?.status, rowData?.end_time)] }}>
                        <View style={{ ...styles.triangleChat, borderRightColor: activityStatusColor[getStatus(rowData?.status, rowData?.end_time)] }} />
                        <Text numberOfLines={1} style={{
                            ...styles.headerTitile, color: Colors.white,
                            fontFamily: Assets.fonts.boldItalic, width: "60%"
                        }}>{rowData?.patient?.name}</Text>
                        <View style={{ flexDirection: "row", alignItems: "center", width: "40%", justifyContent: "flex-end" }}>

                            {!rowData?.file
                                ? <Icon
                                    name="document-attach"
                                    color={Colors.white}
                                    size={getProportionalFontSize(19)}
                                    style={{ marginHorizontal: 2 }}
                                    onPress={() => openUrl(rowData?.file, props.label.urlmsg)}
                                /> : null}

                            {!rowData?.address_url
                                ? <Entypo
                                    name="location-pin"
                                    color={Colors.white}
                                    size={getProportionalFontSize(21)}
                                    style={{ marginStart: 2, }}
                                    onPress={() => openUrl(rowData?.address_url, props.label.urlmsg)}
                                /> : null}

                            {!rowData?.information_url
                                ? <Entypo
                                    name="info"
                                    color={Colors.white}
                                    style={{ marginHorizontal: 2 }}
                                    size={getProportionalFontSize(19)}
                                    onPress={() => openUrl(rowData?.information_url, props.label.urlmsg)}
                                /> : null}

                            {!rowData?.video_url
                                ? <Entypo
                                    name="youtube"
                                    style={{ marginHorizontal: 2 }}
                                    color={Colors.white}
                                    size={getProportionalFontSize(19)}
                                    onPress={() => openUrl(rowData?.video_url, props.label.urlmsg)}
                                /> : null}
                        </View>
                    </View>

                    <View style={styles.descriptionContainer}>
                        <View style={{ flexDirection: "row", }}>

                            <View style={{ width: '100%', flexDirection: 'row', justifyContent: "space-between", alignItems: "center" }}>
                                <View style={{ marginBottom: 0, width: '72%' }}>
                                    <Text numberOfLines={1} style={[styles.rowTitle, { color: activityStatusColor[getStatus(rowData?.status, rowData?.end_time)] }]}>{rowData?.title}</Text>
                                    {rowData.category ? <Text style={[styles.rowTitle, { color: Colors.black, fontSize: getProportionalFontSize(12) }]} >{rowData?.category?.name ?? rowData?.category}</Text>
                                        : null}
                                </View>

                                <View style={{ flexDirection: "row", marginRight: 20, justifyContent: "space-evenly", width: "25%" }}>


                                    {Can(Constants.permissionsKey.activityAdd, permissions)
                                        ?

                                        <View style={styles.trash}>
                                            <Feather name="edit"
                                                color={Colors.primary}
                                                size={18}
                                                // style={{ marginLeft: 5, borderWidth: 0, }}
                                                onPress={() => props.navigation.navigate('AddActivity', { activityId: rowData.id })}
                                            />
                                        </View>
                                        : null}

                                    <View style={styles.trash}>
                                        <Icon
                                            name="person-add-sharp"
                                            color={rowData?.assign_employee?.length > 0 ? Colors.green : Colors.gray}
                                            size={18}
                                            style={{ borderWidth: 0 }}
                                            onPress={() => {
                                                setActionSheetDecide("employee");
                                                setActivityId(rowData.id)
                                                actionSheetRef.current?.setModalVisible();
                                            }}
                                        />
                                    </View>

                                    <View style={styles.trash}>
                                        <FontAwesome name="trash-o"
                                            // style={{ marginRight: 5, borderWidth: 0, }}
                                            color={Colors.primary}
                                            size={18}
                                            onPress={() => {
                                                Alert.showDoubleAlert(Constants.warning, props.label.message_delete_confirmation, () => {
                                                    props.deleteActivityAPI(rowData.id)
                                                })
                                            }}
                                        />
                                    </View>

                                </View>
                            </View>
                        </View>


                        {/* Avatar or image, title , category  */}


                        {/*start date && Description */}
                        <View style={{ marginLeft: 0, width: "100%", borderWidth: 0, flexWrap: "nowrap" }}>
                            {/* {rowData.category ? <Text style={styles.rowTitle} >{props?.label?.category}: {rowData?.category?.name ?? rowData?.category}</Text> : null} */}
                            <Text numberOfLines={5} style={[styles.textDescriptionStyle]}>
                                {rowData?.description}
                            </Text>
                            {/* divider line with text */}





                            {/*Divider */}
                            <View style={styles.Divider} />

                            {/* BUTTONS comment,  done, not applicable  */}
                            <View style={styles.lowerButton}>
                                {/* comment */}
                                <View style={{ flexDirection: "row", alignItems: "center" }}>
                                    <View style={styles.bottomIconContainer}>
                                        <TouchableOpacity
                                            onPress={() => {
                                                setActionSheetDecide("comment");
                                                setActivityId(rowData.id)
                                                actionSheetRef.current?.setModalVisible();
                                            }}
                                            style={{ backgroundColor: activityStatusColor[getStatus(rowData?.status, rowData?.end_time)], flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingVertical: 0, paddingHorizontal: 5, borderRadius: 5, width: 35 }}
                                        >
                                            <Icon
                                                name="chatbox"
                                                color={Colors.white}
                                                size={getProportionalFontSize(13)}
                                            />
                                            <Text style={{ fontFamily: Assets.fonts.bold, color: Colors.white, fontSize: getProportionalFontSize(13), marginBottom: 3, left: 2 }}>{rowData?.comments_count}</Text>

                                            {/* <Image tintColor={Colors.primary} source={Assets.images.chatIcon} style={{ width: 32, height: 32 }} /> */}

                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={() => {
                                            setActivityId(rowData.id);
                                            setIsTaskModalVisible(true)
                                        }} style={[styles.linkIcon, {
                                            backgroundColor: Colors.white,
                                            paddingHorizontal: 10,
                                        }]}>
                                            <Foundation
                                                name="clipboard-pencil"
                                                color={activityStatusColor[getStatus(rowData?.status, rowData?.end_time)]}
                                                size={23}
                                            />
                                            {/* <Image source={Assets.images.taskIcon} style={{ width: 32, height: 32, tintColor: Colors.primary }} /> */}
                                        </TouchableOpacity>

                                        <TouchableOpacity
                                            onPress={
                                                rowData?.status == 3
                                                    ?
                                                    () => { Alert.showToast(props?.label?.already_not_applicable) }
                                                    : () => {
                                                        setActivityId(rowData.id)
                                                        openModel(null, "not_applicable")
                                                    }

                                            }
                                            style={[styles.linkIcon, { backgroundColor: Colors.white, paddingHorizontal: 10, }]}>

                                            <Icon
                                                name="md-close-circle-outline"
                                                color={activityStatusColor[getStatus(rowData?.status, rowData?.end_time)]}
                                                size={25}
                                            />

                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            onPress={rowData?.status != 1
                                                ? CompareDates(CurruntDate(), rowData?.start_date)
                                                    ? () => {
                                                        setActivityId(rowData.id)
                                                        openModel(null, "done")
                                                    }
                                                    : () => { Alert.showToast(props?.label?.action_is_not_available) }
                                                : () => { Alert.showToast(props?.label?.already_done) }}
                                            style={[styles.linkIcon, { backgroundColor: Colors.white, paddingHorizontal: 10, }]}>
                                            {/* <Icon
                                                name="checkmark-done-circle" */}
                                            <FontAwesome5
                                                name="check-circle"
                                                color={Colors.white}
                                                size={21}
                                                style={{ backgroundColor: activityStatusColor[getStatus(rowData?.status, rowData?.end_time)], borderRadius: 30 }}

                                            />

                                        </TouchableOpacity >
                                    </View>

                                    {/* task */}

                                </View >

                                {/* done, not applicable */}

                            </View>
                        </View >

                    </View>
                </TouchableOpacity>
            </View>
        );
    };
    const onEndReached = () => {
        // console.log("onEndReached")
        props.onEndReached(props.page + 1)
    }
    const onRefreshing = () => {
        // console.log("onRefreshing")
        props.myfunction(null, true)
    }
    const renderFooter = () => {
        // console.log("renderFooter")
        // if (props.paginationLoading) {
        return (
            <View style={{ width: "100%", height: 400, justifyContent: "center", alignItems: "center", }}>
                <ActivityIndicator loaderSize='small' loader={Colors.black} />
            </View>
        )
        // } else {
        //     return <Text>~</Text>;
        // }
    }

    const closeActionSheet = () => {
        setActionSheetDecide('');
        actionSheetRef?.current?.setModalVisible();
    }


    // renderview
    return (
        <View style={styles.container}>
            {/* MODAL */}
            <Portal>
                <Modal
                    animationType="slide"
                    transparent={true}
                    style={{}}
                    visible={isModalVisible}
                    onRequestClose={onRequestClose}
                    onDismiss={onRequestClose}
                >
                    <ModalComp
                        onRequestClose={onRequestClose}
                        refreshAPI={props.refreshAPI}
                        labels={props?.label}
                        modelView={modelView}
                        employee={employee}
                        activityId={activityId}
                        UserLogin={UserLogin}
                    // data={tempdata}
                    />
                </Modal>
            </Portal>

            {/* TAsk listing MODAL */}
            <Portal>
                <Modal
                    animationType="slide"
                    transparent={true}
                    style={{}}
                    visible={isTaskModalVisible}
                    onRequestClose={onRequestClose}
                    onDismiss={onRequestClose}
                >
                    <TaskListingModel
                        permissions={permissions}
                        activityID={activityId}
                        UserLogin={UserLogin}
                        onRequestClose={onRequestClose}
                        title={props.label?.tasks}
                        buttonTitle={props.label?.add_new_task}
                        onPressCard={(taskId) => {
                            onRequestClose()
                            props.navigation.navigate('TaskStack', {
                                screen: 'TaskDetails',
                                params: { taskID: taskId, },
                                //  params: { notificationNavigation: 'ContestDetailScreen', id: "1e88490e-56e6-43c5-89a4-3bdedbeec363" } 
                            })
                        }}
                        onPressButton={() => {
                            onRequestClose()
                            props.navigation.navigate('TaskStack', {
                                screen: 'AddTask',
                                params: { resourceID: activityId, categoryTypeID: 1 },
                                //  params: { notificationNavigation: 'ContestDetailScreen', id: "1e88490e-56e6-43c5-89a4-3bdedbeec363" } 
                            })
                        }}
                    />
                </Modal>
            </Portal>

            <View style={{ flexDirection: "row", alignItems: "center", width: "100%", justifyContent: "space-between", marginTop: 14, paddingHorizontal: 10 }}>
                <Text style={styles.title}>
                    {props?.label?.today}:{' '} {CurruntDate()}
                </Text>
                <View style={{ flexDirection: "row", alignItems: "center", }}>
                    {Can(Constants?.permissionsKey?.calendarBrowse, permissions)
                        ?
                        <TouchableOpacity onPress={() => { props.navigation.navigate('CalendarView') }} style={[styles.whiteRBG, { marginEnd: 6 }]}>
                            <FontAwesome5

                                name="calendar-alt"
                                color={Colors.blueMagenta}
                                size={20}
                                style={{}}
                            />
                        </TouchableOpacity>
                        : null}
                    {Can(Constants?.permissionsKey?.activitySelfStats, permissions)
                        ? <TouchableOpacity onPress={() => { props.navigation.navigate("ActivityStats") }} style={[styles.whiteRBG]}>
                            <Icon name={"stats-chart"} size={20} color={Colors.blueMagenta} />
                        </TouchableOpacity>
                        : null}
                </View>
            </View>

            <Timeline
                data={props.data}
                circleSize={getProportionalFontSize(15)}
                circleColor={Colors.primary}
                lineColor={Colors.primary}
                listViewStyle={{ borderWidth: 1 }}
                showTime={false}
                descriptionStyle={{ color: Colors.lightGray }}
                options={{
                    showsVerticalScrollIndicator: false,
                    // initialScrollIndex: 3,
                    contentContainerStyle: { paddingBottom: 50, },
                    style: {},
                    refreshControl: (
                        <RefreshControl
                            refreshing={props.isRefreshing}
                            onRefresh={onRefreshing}
                        />
                    ),
                    // renderFooter: renderFooter,
                    ListFooterComponent: () => <FooterCompForFlatlist paginationLoading={props.paginationLoading} />,
                    onEndReached: onEndReached,
                    onEndReachedThreshold: 0.3
                }}

                innerCircle={'dot'}
                // onEventPress={(item) =>
                //     props.navigation.navigate("ActivityDetails", { itemId: item.id })

                // }
                renderDetail={renderDetail}
                style={{ paddingTop: "30%", paddingRight: 0, paddingBottom: 100 }}
            />

            <ActionSheet ref={actionSheetRef} containerStyle={{ backgroundColor: Colors.backgroundColor }}>
                {
                    actionSheetDecide == "employee" ? (
                        <ActionSheetComp
                            title={props?.label[actionSheetDecide]}
                            closeActionSheet={closeActionSheet}
                            keyToShowData="name"
                            keyToCompareData="id"

                            // multiSelect
                            APIDetails={employeeAS}
                            changeAPIDetails={(payload) => {
                                if (actionSheetDecide == "employee") {
                                    setEmployeeAS(getActionSheetAPIDetail({ ...employeeAS, ...payload }))
                                }
                            }}
                            onPressItem={(item) => {
                                // console.log('item', item)
                                if (actionSheetDecide == "employee") {
                                    setEmployee(item)
                                    setModelView("employee")
                                    setIsModalVisible(true)

                                    // removeErrorTextForInputThatUserIsTyping("employee")
                                }
                            }}
                        />
                    ) : (
                        actionSheetDecide == "comment" ? (<ActionSheetForComment
                            closeActionSheet={closeActionSheet}
                            title={"Comments"}
                            activityId={activityId}
                            UserLogin={UserLogin}
                            labels={props?.label}
                        />) : null
                    )
                }


            </ActionSheet>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // marginLeft: 10
        // borderWidth: 2,
        // borderColor: "red",
        minHeight: Dimensions.get("window").height,
    },
    startTimeContainer: {
        flexDirection: "row",
        marginBottom: 10
    },
    startTimeText: {
        // padding: 16,
        fontSize: getProportionalFontSize(15),
        fontFamily: Assets.fonts.semiBold,
        marginRight: 10,
        color: Colors.black
    },
    title: {
        fontSize: getProportionalFontSize(17),
        fontFamily: Assets.fonts.semiBold,
        color: Colors.white,
        // marginLeft: 10,
        // marginTop: 20
    },
    patientView: {
        flexDirection: "row",
        paddingVertical: getProportionalFontSize(10),
        paddingHorizontal: getProportionalFontSize(20),
        width: "100%",
        backgroundColor: Colors.primary,
        marginTop: -35,
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
        // marginLeft: -25,
        // borderRadius: 5,
        // borderTopRightRadius: 40,
        alignItems: "center",
        justifyContent: "space-between"

    },
    headerTitile: {
        fontSize: getProportionalFontSize(14),
        fontFamily: Assets.fonts.bold,
        color: Colors.primary,

    },
    cardContainer: {
        flex: 1,
        backgroundColor: "#fff",
        paddingBottom: 5,
        // paddingEnd: 15,
        // paddingStart: 15,
        // paddingTop: 15,
        marginRight: 30,
        // shadow
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 15,
        elevation: 15,
        shadowColor: Platform.OS == 'ios' ? Colors.shadowColorIosDefault : Colors.primary,
        shadowRadius: 10,
        borderRadius: getProportionalFontSize(10),
        marginTop: -40,
        // borderWidth: 1,
        // borderColor: Colors.borderColor

    },
    rowTitle: {
        fontSize: getProportionalFontSize(14),
        fontFamily: Assets.fonts.semiBold,
        color: Colors.primary,
        textTransform: 'capitalize',
        paddingLeft: 20
        // paddingVertical: 20

    },
    descriptionContainer: {
        flexDirection: 'column',
        //paddingRight: 10,
        width: "100%",
        marginTop: 5
    },
    imageStyle: {
        width: getProportionalFontSize(45),
        height: getProportionalFontSize(45),
        borderRadius: getProportionalFontSize(45),
        padding: 5,

    },
    textDescriptionStyle: {
        //minWidth: getProportionalFontSize(275),
        color: Colors.black,
        fontFamily: Assets.fonts.semiBold,
        fontSize: getProportionalFontSize(11),
        textAlign: "justify",
        marginTop: 5,
        paddingLeft: 20
    },
    linkIcon: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.primary,
    },
    normalText: {
        fontFamily: Assets.fonts.regular,
        fontSize: getProportionalFontSize(11),
        color: Colors.black
    },
    actionButtons: {
        backgroundColor: Colors.lightGray,
        color: Colors.white,
        paddingVertical: 2,
        paddingHorizontal: 4,
        fontSize: 13,
        marginRight: 5,
        borderRadius: 2,
        marginBottom: 5,
        fontFamily: Assets.fonts.bold,
    },
    commentStyle: {
        zIndex: 1000,
        borderLeftWidth: 3,
        borderLeftColor: Colors.lightGray,
        backgroundColor: "#0001",
        paddingHorizontal: 15,
        marginBottom: 5,
    },
    commentView: {
        flexDirection: "row",
        borderRadius: 20,
        backgroundColor: "#E4FFF0",
        paddingHorizontal: 9,
        paddingVertical: 5,
        alignItems: "center"
    }
    ,
    doneButton: {
        width: 50,
        height: 50,
        backgroundColor: Colors.primary,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 50
    },
    loaderStyle: {
        position: 'relative',
        width: '80%',
        backgroundColor: "transparent"
    },
    dividerContainer: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: "space-between",
        marginVertical: 5
    },
    bottomIconContainer: {
        width: '100%',
        height: 40,
        flexDirection: 'row',
        alignItems: "center",
        justifyContent: 'space-around'
    },
    trash: {
        // backgroundColor: Colors.backgroundGray,
        // borderRadius: 50
        backgroundColor: Colors.backgroundGray,
        justifyContent: "center",
        alignItems: "center",
        alignSelf: "center",
        alignContent: "center",
        borderRadius: 50,
        width: 25,
        height: 25,
        marginHorizontal: 2
    },
    triangleChat: {
        height: 0,
        width: 0,
        marginLeft: -10,
        borderBottomWidth: 7,
        borderTopWidth: 7,
        borderRightWidth: 13,
        borderRightColor: Colors.primary,
        borderBottomColor: "transparent",
        borderTopColor: 'transparent',
        borderLeftColor: "transparent",
        marginTop: 0,
        elevation: 8,
        shadowOffset: { width: 0, height: 0, },
        shadowOpacity: 25,
        shadowColor: Platform.OS == "ios" ? 'rgba(0,0,0,0.1)' : 'rgba(0,0,0,0.3)',
        shadowRadius: 7,
        position: "absolute"

        // <View style={styles.triangleChatMySide} />
    },
    StartEndDate: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 90,
        marginTop: -10,
        marginLeft: 10,
        justifyContent: "flex-start"

    }, whiteRBG: {
        justifyContent: "center",
        alignItems: "center",
        width: 30,
        height: 30,
        borderRadius: 30,
        backgroundColor: Colors.white
    },
    Calender: {

        flexDirection: "row",
        alignItems: "center",
        // marginBottom: 20
    },
    time: {
        flexDirection: "row",
        alignItems: "center",
        // marginBottom: 20
        marginLeft: 10,
    },
    Divider: {
        width: '100%',
        height: 0,
        borderWidth: 0.5,
        borderColor: Colors.placeholderTextColor,
        marginVertical: 5
    },
    lowerButton: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    }

});

export default ActivityTimeline;