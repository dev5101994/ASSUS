import React from 'react'
import { StyleSheet, Text, View, ScrollView, FlatList, RefreshControl } from 'react-native'
import { FAB } from 'react-native-paper';
import EmptyList from '../Components/EmptyList';
import Colors from '../Constants/Colors';
import { getProportionalFontSize, firstLetterFromString } from '../Services/CommonMethods';
import { useSelector, useDispatch } from 'react-redux';
import Constants from '../Constants/Constants';
import Icon from 'react-native-vector-icons/MaterialIcons';
import APIService from '../Services/APIService'
import Alert from '../Components/Alert';
import CommonCRUDCard from '../Components/CommonCRUDCard'
import IPListCard from '../Components/IPListCard';
import FooterCompForFlatlist from '../Components/FooterCompForFlatlist';
import Can from '../can/Can';
import TaskListCard from '../Components/TaskListCard';
import ListLoader from '../Components/ListLoader';
import FilterModalEmployeeComp from './FilterModalEmployeeComp'
import { Portal, Provider, Modal } from 'react-native-paper';
import FilterModalTaskListing from './FilterModalTaskListing';
//const Data = [];

const TaskListing = (props) => {

    const routeParam = props?.route?.params ?? {}

    const [TaskList, setTaskList] = React.useState([]);
    const [isLoading, setIsLoading] = React.useState(true);
    const [isRefreshing, setIsRefreshing] = React.useState(false);
    const [paginationLoading, setPaginationLoading] = React.useState(false);
    const [page, setPage] = React.useState(0);
    // REDUX hooks
    const dispatch = useDispatch();
    const isInternetActive = useSelector(state => state.IsInternetActive);
    const UserLogin = useSelector(state => state.User.UserLogin);
    const permissions = UserLogin?.permissions ?? {}
    const labels = useSelector(state => state.Labels);
    const messages = useSelector(state => state.Labels);
    const [param, setParam] = React.useState({ "title": "", "emp_id": "", "employee": "", "name": "", "email": "", "start_date": new Date(), "end_date": "", "patient": "", "contact_number": "", "personal_number": "", "status": "", "refreshAPI": false });
    const [isModalVisible, setIsModalVisible] = React.useState(false);
    // console.log("labels-------------------++++++++++++++++++++", param)
    // console.table("labels-------------------++++++++++++++++++++", param)
    // useEffect hooks
    React.useEffect(() => {
        taskListingAPI()
    }, [param])
    // React.useEffect(() => {
    //     console.warn("from hooks")
    //     let status = "";
    //     activityListingListingAPI(null, null, status)
    // }, [option])

    React.useEffect(() => {
        const unsubscribe = props.navigation.addListener('focus', () => {
            // console.log('Focus___________________________________________')
            taskListingAPI(null, true)
        });
        return unsubscribe;
    }, [props.navigation]);

    // API methods
    const taskListingAPI = async (page, refresh) => {

        let params = {
            "perPage": Constants.perPage,
            "page": page ?? 1,
            "ip_id": routeParam.IPId,

            "patient": param?.patient?.id ?? "",
            // "status": "1",
            // "status": param?.status?.id ?? "",
            "start_date": param?.start_date ?? "",
            "end_date": param?.end_date ?? "",
            // "employee": 
            "emp_id": param?.employee.id ?? "",
            // "title": param?.name?.id ?? "",
            "title": param?.title ?? "",
            "status": param?.status?.id ?? "",

            // ...param
        }
        // console.log("params------------------nnnnnnnnnn", params);
        let url = Constants.apiEndPoints.task
        // console.log("url", url);
        // console.log("params------------------nnnnnnnnnn", params);
        // setIsLoading(false);
        // return
        if (refresh)
            setIsRefreshing(true)
        else if (!page)
            setIsLoading(true);
        else
            setPaginationLoading(true)
        let response = await APIService.postData(url, params, UserLogin.access_token, null, "taskListingAPI");
        // console.log("data", response.data)
        if (!response.errorMsg) {
            // console.log('response-------------------+++++++++++++', JSON.stringify(response))
            if (!page) {
                setPage(1);
                setTaskList(response.data.payload.data);
                setIsLoading(false);
                if (refresh)
                    setIsRefreshing(false);
            }
            else {
                let tempList = [...TaskList];
                tempList = tempList.concat(response.data.payload.data);
                setPage(page);
                setTaskList([...tempList]);
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


    // const deleteTaskAPI = async (item, index) => {
    //     setIsLoading(true);
    //     // console.log('item', item)
    //     let url = Constants.apiEndPoints.addTask + "/" + item.id;
    //     let response = await APIService.deleteData(url, UserLogin.access_token, null, "deleteTaskAPI");
    //     if (!response.errorMsg) {
    //         let tempTaskList = [...TaskList];
    //         tempTaskList.splice(index, 1)
    //         setTaskList(tempTaskList);
    //         Alert.showToast(messages.message_delete_success)
    //         setIsLoading(false);
    //     }
    //     else {
    //         setIsLoading(false);
    //         Alert.showAlert(Constants.danger, response.errorMsg)
    //     }
    // }

    // const deleteTaskAPI = async (item) => {

    //     setIsLoading(true);
    //     console.log('item', item)
    //     let url = Constants.apiEndPoints.addTask + "/" + item.id;
    //     let response = await APIService.deleteData(url, UserLogin.access_token, null, "deleteTaskAPI");
    //     if (!response.errorMsg) {
    //         let tempTaskList = [...TaskList];
    //         tempTaskList.splice(index, 1)
    //         setTaskList(tempTaskList);
    //         Alert.showToast(messages.message_delete_success)
    //         setIsLoading(false);
    //     }
    //     else {
    //         setIsLoading(false);
    //         Alert.showAlert(Constants.danger, response.errorMsg)
    //     }
    // }

    const deleteTaskAPI = async (item) => {
        setIsLoading(true);
        let url = Constants.apiEndPoints.addTask + "/" + item.id;
        let response = await APIService.deleteData(url, UserLogin.access_token, null, "deleteTaskAPI");

        if (!response.errorMsg) {
            Alert.showToast(messages.message_delete_success)
            await taskListingAPI(null, true)
            setIsLoading(false);
        }
        else {
            setIsLoading(false);
            Alert.showAlert(Constants.danger, response.errorMsg)
        }
    }

    const flatListRenderItem = ({ item, index }) => {
        let labelText = firstLetterFromString(item.title)
        // console.log("check data ----------", item)
        return (
            <>

                <TaskListCard
                    assign_employees={item.assign_employee}
                    start_date={item.start_date}
                    end_date={item.end_date}
                    patientName={item?.patient?.name}
                    patientGender={item?.patient?.gender}
                    patientNumber={item?.patient?.personal_number}
                    onPressCard={
                        Can(Constants.permissionsKey.taskRead, permissions)
                            ? () => props.navigation.navigate("TaskDetails", { taskID: item.id, })
                            : () => { }
                    }
                    title={item.title}
                    labelText={labelText}
                    showIcons={true}
                    showDeleteIcon={
                        Can(Constants.permissionsKey.taskDelete, permissions)
                    }
                    showEditIcon={
                        Can(Constants.permissionsKey.taskEdit, permissions)
                    }
                    // showSecondaryTitle={true}
                    subTitle={item.status == 0 ? labels?.["not-done-activity"] ?? "Incomplete" : item.status == 1 ? labels['complete'] : false}
                    taskStatus={item.status}
                    // second_title_value={`${formatDate(jsCoreDateCreator(item.plan_start_date))}  -  ${item.end_date ? formatDate(jsCoreDateCreator(item.end_date)) : ""}`}
                    //second_title_value_style={{ color: category_status_color[item.status] }}
                    onPressEdit={() => {
                        props.navigation.navigate("AddTask", { taskID: item.id, categoryTypeID: item.type_id })
                    }}
                    // onPressDelete={() => {
                    //     Alert.showDoubleAlert(Constants.warning, messages.message_delete_confirmation, () => {
                    //         deleteTaskAPI(item.id, index);
                    //     })
                    // }}

                    onPressDelete={() => {
                        Alert.showDoubleAlert(Constants.warning, messages.message_delete_confirmation, () => {
                            deleteTaskAPI(item);
                        })
                    }}
                >
                </TaskListCard>
            </>
        )
    }

    const onRequestClose = () => {
        // console.log('onRequestClose called')
        // setCategoryItem(null);
        setIsModalVisible(false);
    }
    if (param.refreshAPI) {
        // console.log("param===============================", param)
        setParam({ ...param, refreshAPI: false })
        branchListingAPI()
    }
    const openModel = () => {
        // setModelView(view)
        // console.log("rowData", rowData)
        setIsModalVisible(true);
        // settempdata(rowData)
        // console.error("isModalVisible", isModalVisible)
    }

    //render item
    return (
        <BaseContainer
            onPressLeftIcon={() => { props.navigation.pop() }}
            leftIcon="arrow-back"
            rightIcon="filter-list"
            onPressRightIcon={() => openModel()}
            // leftIconSize={24}
            title={labels["tasks"]}
            leftIconColor={Colors.white}
        >

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

                        {/* <FilterModalEmployeeComp
                            // labels={labels}
                            // onRequestClose={onRequestClose}
                            // // // UserLogin={UserLogin}
                            // setParam={setParam}
                            // param={param}
                        /> */}



                        {/* <Filtermodel */}

                        <FilterModalTaskListing
                            onRequestClose={onRequestClose}
                            labels={labels}
                            // onRequestClose={onRequestClose}
                            UserLogin={UserLogin}
                            setParam={setParam}
                            param={param}
                        />

                    </Modal>
                </Portal>
            </View>


            {
                isLoading
                    ? <ListLoader />
                    : <>
                        {/* <View style={{ paddingTop: 5, paddingRight: 5 }}> */}
                        <FlatList
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={{ borderWidth: 0, paddingVertical: Constants.globalPaddingVetical, paddingHorizontal: Constants.globalPaddingHorizontal }}
                            ListEmptyComponent={<EmptyList />}
                            data={TaskList}
                            renderItem={flatListRenderItem}
                            keyExtractor={(item, index) => index}
                            onEndReached={() => { taskListingAPI(page + 1) }}
                            onEndReachedThreshold={0.1}
                            refreshControl={
                                <RefreshControl
                                    refreshing={isRefreshing}
                                    onRefresh={() => {
                                        taskListingAPI(null, true)
                                    }}
                                />
                            }
                            ListFooterComponent={() => <FooterCompForFlatlist paginationLoading={paginationLoading} />}
                        />

                        {/* </View> */}
                        {/* FLOATING ADD BUTTON */}
                        {
                            Can(Constants.permissionsKey.taskAdd, permissions)
                                ? <FAB
                                    style={styles.fab}
                                    color={Colors.white}
                                    icon="plus"
                                    onPress={() => { props.navigation.navigate('AddTask', { resourceID: routeParam?.resourceID ?? null, categoryTypeID: null }) }}
                                /> : null
                        }
                    </>
            }
        </BaseContainer>
    )
}

export default TaskListing

const styles = StyleSheet.create({
    fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        backgroundColor: Colors.primary,
        bottom: 0,
    },

    branchTypeCard: {
        width: "100%",
        minHeight: 80,
        paddingHorizontal: 12,
        paddingVertical: 5,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        shadowOffset: { width: 3, height: 3, },
        shadowOpacity: 10,
        elevation: 15,
        shadowColor: Platform.OS == "ios" ? Colors.shadowColorIosDefault : Colors.shadowColorAndroidDefault,
        shadowRadius: 10,
        marginTop: 15,
        backgroundColor: 'white',
        borderRadius: 15
    },
    branchNameView: {
        width: '80%'
    },
    branchNameText: {
        fontFamily: Assets.fonts.bold,
        fontSize: getProportionalFontSize(15),
    },
    statusMainView: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    statusTitle: {
        fontFamily: Assets.fonts.regular,
        fontSize: getProportionalFontSize(12)
    },
    statusValue: {
        fontFamily: Assets.fonts.boldItalic,
        fontSize: getProportionalFontSize(13)
    },
    editDeleteIconView: {
        flexDirection: 'row',
        alignItems: 'center',

    }
})
