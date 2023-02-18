import React, { useState } from 'react'
import { StyleSheet, Text, View, ScrollView, FlatList, ActivityIndicator, TouchableOpacity, ImageBackground, Dimensions } from 'react-native';
import EmptyList from '../Components/EmptyList';
import Colors from '../Constants/Colors';
import { getProportionalFontSize } from '../Services/CommonMethods';
import { useSelector, useDispatch } from 'react-redux';
import ActivityTimeline from '../Components/ActivityTimeline';
import ActivityTimelineCard from '../Components/ActivityTimelineCard'
//FAB BUTTON GROUP.............
import { FAB, Portal, Provider, Modal } from 'react-native-paper';
import Constants from '../Constants/Constants';
import APIService from '../Services/APIService'
import Alert from '../Components/Alert';
import ProgressLoader from '../Components/ProgressLoader';
import FilterModalComp from '../Components/FilterModalComp';
import Can from '../can/Can';
import ListLoader from '../Components/ListLoader';
import Assets from '../Assets/Assets';
import AntDesign from 'react-native-vector-icons/AntDesign';



const ActivityListing = (props) => {
    const [fabButton, setFabButton] = React.useState({ open: false });
    const [fabActionButtons, setFabActionButtons] = React.useState([]);
    const onFabStateChange = ({ open }) => setFabButton({ open });
    const { open } = fabButton;
    const [option, setOption] = React.useState("Upcoming");
    const [paramStatus, setparamStatus] = React.useState("0");

    const [activityList, setActivityList] = React.useState([]);
    const [isLoading, setIsLoading] = React.useState(true);
    const [isRefreshing, setisRefreshing] = React.useState(false);
    const [paginationLoading, setPaginationLoading] = React.useState(false);
    const [page, setPage] = React.useState(0);
    const [isModalVisible, setIsModalVisible] = React.useState(false);
    const [param, setParam] = React.useState({ "perPage": "", "page": "", "status": "", "category": "", "ip": "", "patient": "", "branch": "", "start_date": new Date(), "end_date": "", "refreshAPI": false });

    // REDUX hooks
    const dispatch = useDispatch();
    const isInternetActive = useSelector(state => state.IsInternetActive);
    const UserLogin = useSelector(state => state.User.UserLogin);
    const permissions = UserLogin?.permissions ?? {}
    const labels = useSelector(state => state.Labels);

    const isUserHasModule = () => {
        let temp = UserLogin.assigned_module
        let isUserHasModule = temp.find((obj) => {
            return obj.module.name == Constants.allModules["Activity"]
        })
        if (isUserHasModule)
            return true
        else
            return false
    }

    // useEffect hooks
    React.useEffect(() => {
        setFabButtons();
    }, [])



    const setFabButtons = () => {
        let temp = []
        if (Can(Constants?.permissionsKey?.activitySelfStats, permissions)) {
            temp.push(
                {
                    icon: 'chart-bar',
                    small: false,
                    label: labels?.['activity-stats'] ?? 'Activity Stats',
                    onPress: () => { props.navigation.navigate("ActivityStats") }
                }
            )
        }

        if (Can(Constants?.permissionsKey?.calendarBrowse, permissions)) {
            temp.push(
                {
                    icon: 'calendar-today',
                    label: 'Calendar View',
                    onPress: () => { props.navigation.navigate('CalendarView') },
                    small: false,
                }
            )
        }

        if (Can(Constants.permissionsKey.activityAdd, permissions)) {
            temp.push(
                {
                    icon: 'plus',
                    label: "Add Activity",
                    onPress: () => { props.navigation.navigate('AddActivity', { itemId: '' }); },
                    small: false,
                }
            )
        }
        setFabActionButtons(temp)
    }

    // useEffect hooks
    React.useEffect(() => {
        // console.warn("from hooks")
        let status = "";
        activityListingListingAPI(null, null, status)
    }, [option])

    React.useEffect(() => {
        const unsubscribe = props.navigation.addListener('focus', () => {
            // console.warn("from focus")
            setparamStatus("0")
            // console.log('Focus___________________________________________')
            activityListingListingAPI()
        });
        return unsubscribe;
    }, [props.navigation]);

    // API methods
    const activityListingListingAPI = async (page, refresh, status) => {
        // setIsLoading(true);
        if (refresh)
            setisRefreshing(true)
        else if (!page)
            setIsLoading(true);
        else
            setPaginationLoading(true)
        let params = {
            "perPage": Constants.perPage,
            "page": page ?? 1,
            "status": param?.status?.id ?? "",
            // "category": param?.category?.id ?? "",
            "category_id": param?.category?.id ?? "",
            // "ip": param?.ip?.id ?? "",
            "ip_id": param?.ip?.id ?? "",
            "patient": param?.patient?.id ?? "",
            // "branch": param?.branch?.id ?? "",
            "branch_id": param?.branch?.id ?? "",
            "start_date": param?.start_date ?? new Date(),
            "end_date": param?.end_date ?? "",
            "title": param?.title ?? "",
        }
        let url = Constants.apiEndPoints.activitiesList;
        // console.log("url", url);
        // console.log("params", params);

        let response = await APIService.postData(url, params, UserLogin.access_token, null, "activityListingListingAPI");
        // console.log("response", JSON.stringify(response))
        // return
        setIsLoading(false)
        if (!response.errorMsg) {
            // console.log('response-------------------+++++++++++++', JSON.stringify(response))
            if (!page) {
                setPage(1);
                setActivityList(response?.data?.payload?.data ?? []);
                setIsLoading(false);
                if (refresh)
                    setisRefreshing(false);
            }
            else {
                let tempactivityListList = [...activityList];
                tempactivityListList = tempactivityListList.concat(response?.data?.payload?.data);
                setPage(page);
                setActivityList([...tempactivityListList]);
                setPaginationLoading(false);
            }
        }
        else {
            if (!page)
                setIsLoading(false);
            else
                setPaginationLoading(false)
            if (refresh)
                setisRefreshing(false);
            Alert.showAlert(Constants.danger, response.errorMsg)
        }
    }
    if (param.refreshAPI) {
        // console.log("param===============================", param)
        setParam({ ...param, refreshAPI: false })
        activityListingListingAPI()
    }
    const openModel = () => {
        // setModelView(view)
        // console.log("rowData", rowData)
        setIsModalVisible(true);
        // settempdata(rowData)
        // console.error("isModalVisible", isModalVisible)
    }
    const onRequestClose = () => {
        // console.log('onRequestClose called')
        // setCategoryItem(null);
        setIsModalVisible(false);
    }

    //helper
    const Options = (props) => {
        return (
            <TouchableOpacity onPress={() => setOption(props.title)}
                style={{
                    ...styles.optionContainer,
                    backgroundColor: props.focused ? "#E4FFF0" : Colors.white,
                    borderWidth: props.focused ? 1 : 0,
                }}>
                <Text style={styles.options} >{props.title}</Text>
            </TouchableOpacity>
        )
    }

    const deleteActivityAPI = async (activity_id) => {
        setIsLoading(true);
        let url = Constants.apiEndPoints.addActivity + "/" + activity_id;
        let response = await APIService.deleteData(url, UserLogin.access_token, null, "deleteActivityAPI");
        if (!response.errorMsg) {
            Alert.showToast(labels.message_delete_success)
            setIsLoading(false);
            activityListingListingAPI(null, true);
        }
        else {
            setIsLoading(false);
            Alert.showAlert(Constants.danger, response.errorMsg)
        }
    }


    // Render view
    //console.log('activityList', JSON.stringify(activityList))
    // if (isLoading)
    //     return <ProgressLoader />
    return (
        <BaseContainer
            onPressLeftIcon={() => { props.navigation.pop() }}
            leftIcon="arrow-back"
            title={labels["Activity"]}
            style={{ backgroundColor: Colors.transparent }}
            leftIconColor={Colors.primary}
            rightIcon={isUserHasModule() ? "filter-list" : null}
            onPressRightIcon={() => openModel()}
            rightIconColor={Colors.primary}
            headerBar={{ backgroundColor: Colors.blueMagenta }}
        >
            {
                isLoading
                    ? <ListLoader />
                    : isUserHasModule()
                        ? (
                            <ImageBackground resizeMode="stretch" source={Assets.images.acttivityBG} style={{ flex: 1, }}>

                                {Can(Constants.permissionsKey.activityAdd, permissions)
                                    ? <TouchableOpacity
                                        onPress={() => { props.navigation.navigate('AddActivity', { itemId: '' }); }}
                                        style={styles.floatingPlusView}>
                                        <AntDesign
                                            name="plus"
                                            color={Colors.primary}
                                            style={{}}
                                            size={40}
                                        />
                                    </TouchableOpacity> : null}

                                {/* <ImageBackground source={Assets.images.backGroundImage} style={{ flex: 1 }}> */}
                                {/* Main View */}
                                <View style={styles.mainView}>
                                    {/* MODAL */}
                                    <Portal>
                                        <Modal
                                            animationType="slide"
                                            transparent={true}
                                            style={{ justifyContent: "center", alignItems: 'center' }}
                                            visible={isModalVisible}
                                            onRequestClose={onRequestClose}
                                        >
                                            <FilterModalComp
                                                labels={labels}
                                                onRequestClose={onRequestClose}
                                                UserLogin={UserLogin}
                                                setParam={setParam}
                                                param={param}
                                            />
                                        </Modal>
                                    </Portal>

                                    {activityList?.length == 0 ? (
                                        <EmptyList />
                                    ) : (
                                        // <ActivityTimeline
                                        <ActivityTimelineCard
                                            data={activityList}
                                            refreshAPI={() => {
                                                activityListingListingAPI()
                                            }}
                                            deleteActivityAPI={deleteActivityAPI}
                                            label={labels}
                                            isRefreshing={isRefreshing}
                                            setisRefreshing={setisRefreshing}
                                            myfunction={activityListingListingAPI}
                                            onEndReached={activityListingListingAPI}
                                            page={page}
                                            navigation={props.navigation}
                                            paginationLoading={paginationLoading}
                                        />
                                    )}
                                    {/* </ScrollView> */}

                                    {/* FLOATING ADD BUTTON GROUP*/}

                                    {/* <Provider>
                                        <Portal >
                                            <FAB.Group
                                                fabStyle={{ backgroundColor: Colors.white, borderRadius: 15, bottom: 170 }}
                                                open={open}
                                                icon={open ? 'close' : 'plus'}
                                                color={Colors.primary}
                                                actions={fabActionButtons}
                                                onStateChange={onFabStateChange}
                                                onPress={() => {
                                                    if (open) {
                                                        console.log("close btn group")
                                                    }
                                                }}
                                            />

                                        </Portal>
                                    </Provider> */}
                                </View>
                            </ImageBackground>
                        )
                        : <EmptyList navigation={props.navigation} noModuleMsg={true} />
            }
        </BaseContainer>
    )
}

export default ActivityListing

const styles = StyleSheet.create({
    optionContainer: {
        shadowOffset: { width: 3, height: 3, },
        shadowOpacity: 10,
        elevation: 15,
        shadowColor: Platform.OS == "ios" ? Colors.shadowColorIosDefault : Colors.shadowColorAndroidDefault,
        shadowRadius: 10,
        marginRight: 40,
        borderColor: "#29C76F",
        borderRadius: 5,

    },
    floatingPlusView: {
        height: 80,
        width: 80,
        backgroundColor: Colors.white,
        borderRadius: 22,
        position: "absolute",
        right: 12,
        top: "13%",
        justifyContent: "center",
        alignItems: "center",
        // shadow
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 15,
        elevation: 15,
        shadowColor: Colors.primary,
        shadowRadius: 6,
    },
    options: {
        width: "100%",
        // maxHeight: 30,
        fontSize: 11,
        paddingHorizontal: 15,
        paddingVertical: 8,
        fontFamily: Assets.fonts.medium,
        // borderWidth: 1,

    },
    fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        backgroundColor: Colors.primary,
        bottom: 0,

    },
    mainView: {
        flex: 1,
        //paddingHorizontal: Constants.globalPaddingHorizontal,
        // backgroundColor: Colors.backgroundColor,
        paddingBottom: 30,
    },

    container: {
        flex: 1,
        padding: 20,
        paddingTop: 65,
        backgroundColor: 'white'
    },
    list: {
        flex: 1,
        marginTop: 20,
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold'
    },
    descriptionContainer: {
        flexDirection: 'row',
        paddingRight: 50
    },
    image: {
        width: 50,
        height: 50,
        borderRadius: 25
    },
    textDescription: {
        marginLeft: 10,
        color: 'gray'
    }
})

