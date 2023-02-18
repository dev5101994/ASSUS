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
import Can from '../can/Can';

const SubTaskList = (props) => {
    const routeParam = props?.route?.params ?? {}

    const [TaskList, setTaskList] = React.useState([]);
    const [isLoading, setIsLoading] = React.useState(true);
    const [isRefreshing, setIsRefreshing] = React.useState(false);
    const [paginationLoading, setPaginationLoading] = React.useState(false);
    const [page, setPage] = React.useState(0);
    const [openCardOptions, setOpenCardOptions] = React.useState()
    // REDUX hooks
    const dispatch = useDispatch();
    const isInternetActive = useSelector(state => state.IsInternetActive);
    const UserLogin = useSelector(state => state.User.UserLogin);
    const permissions = UserLogin?.permissions ?? {}
    const labels = useSelector(state => state.Labels);
    const messages = useSelector(state => state.Labels);

    // useEffect hooks
    React.useEffect(() => {
        taskListingAPI()
    }, [])

    React.useEffect(() => {
        const unsubscribe = props.navigation.addListener('focus', () => {
            console.log('Focus___________________________________________')
            taskListingAPI()
        });
        return unsubscribe;
    }, [props.navigation]);

    // API methods
    const taskListingAPI = async (page, refresh) => {
        if (refresh)
            setIsRefreshing(true)
        else if (!page)
            setIsLoading(true);
        else
            setPaginationLoading(true)
        let params = {
            "perPage": Constants.perPage,
            "page": page ?? 1,
            "ip_id": routeParam.IPId
            // "status": "1",
        }
        let url = Constants.apiEndPoints.task
        // console.log("url", url);
        // console.log("params", params);

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

    const deleteTaskAPI = async (item, index) => {
        setIsLoading(true);
        // console.log('item', item)
        let url = Constants.apiEndPoints.addTask + "/" + item.id;
        let response = await APIService.deleteData(url, UserLogin.access_token, null, "deleteTaskAPI");
        if (!response.errorMsg) {
            let tempTaskList = [...TaskList];
            tempTaskList.splice(index, 1)
            setTaskList(tempTaskList);
            Alert.showToast(messages.message_delete_success)
            setIsLoading(false);
        }
        else {
            setIsLoading(false);
            Alert.showAlert(Constants.danger, response.errorMsg)
        }
    }

    const flatListRenderItem = ({ item, index }) => {
        let labelText = firstLetterFromString(item.title)
        return (
            <IPListCard
                showMenu={true}
                openCardOptions={openCardOptions}
                setOpenCardOptions={setOpenCardOptions}
                index={index}
                onPressCard={() => { props.navigation.navigate('AddTask', { resourceID: routeParam?.resourceID ?? null, categoryTypeID: null, taskID: item.id }); }}
                title={item.title}
                labelText={labelText}
                showDeleteIcon={Can(Constants.permissionsKey.taskDelete, permissions)}
                showEditIcon={Can(Constants.permissionsKey.taskEdit, permissions)}
                second_title_value={item.email}
                onPressEdit={() => {
                    props.navigation.navigate('AddTask', { resourceID: routeParam?.resourceID ?? null, categoryTypeID: null, taskID: item.id });
                }}
                onPressDelete={() => {
                    Alert.showDoubleAlert(Constants.warning, messages.message_delete_confirmation, () => {
                        deleteTaskAPI(item, index);
                    })
                }}
                showIcons={true}

            />
        )
    }
    //render item
    // console.log('rou', routeParam)
    if (isLoading)
        return <ProgressLoader />

    return (
        <BaseContainer
            onPressLeftIcon={() => { props.navigation.pop() }}
            leftIcon="arrow-back"
            // leftIconSize={24}
            title={labels["tasks"]}
            leftIconColor={Colors.white}
        >
            {/* <View style={{ paddingTop: 5, paddingRight: 5 }}> */}
            <FlatList
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ borderWidth: 0, paddingVertical: Constants.globalPaddingVetical, paddingHorizontal: Constants.globalPaddingHorizontal }}
                ListEmptyComponent={<EmptyList />}
                data={TaskList}
                renderItem={flatListRenderItem}
                keyExtractor={(item, index) => index}
                // onEndReached={() => { followUpListingAPI(page + 1) }}
                onEndReachedThreshold={0.1}
                refreshControl={
                    <RefreshControl
                        refreshing={isRefreshing}
                        onRefresh={() => {
                            taskListingAPI(null, true)
                        }}
                    />
                }
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

        </BaseContainer>
    )
}

export default SubTaskList

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
