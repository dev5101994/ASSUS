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
import CommonCRUDCard from '../Components/CommonCRUDCard';
import Can from '../can/Can';
import IPListCard from '../Components/IPListCard';
import { Portal, Provider, Modal } from 'react-native-paper';
// import FilterModalBranchComp from './FilterModalBranchComp';
import FilterFollowUpListing from './FilterFollowUpListing';

const FollowUpListing = (props) => {

    const routeParam = props?.route?.params ?? {}

    const [FollowupList, setFollowupList] = React.useState([]);
    const [isLoading, setIsLoading] = React.useState(true);
    const [isRefreshing, setIsRefreshing] = React.useState(false);
    const [paginationLoading, setPaginationLoading] = React.useState(false);
    const [page, setPage] = React.useState(0);
    const [openCardOptions, setOpenCardOptions] = React.useState()
    const [param, setParam] = React.useState({ "title": "", "start_date": "", "end_date": "", "status": "", "ip_id": null, "refreshAPI": false });
    const [isModalVisible, setIsModalVisible] = React.useState(false);
    // REDUX hooks
    const dispatch = useDispatch();
    const isInternetActive = useSelector(state => state.IsInternetActive);
    const UserLogin = useSelector(state => state.User.UserLogin);
    const permissions = UserLogin?.permissions ?? {}
    const labels = useSelector(state => state.Labels);
    const messages = useSelector(state => state.Labels);

    // useEffect hooks
    React.useEffect(() => {
        followUpListingAPI()
    }, [param])

    React.useEffect(() => {
        const unsubscribe = props.navigation.addListener('focus', () => {
            // console.log('Focus___________________________________________')
            followUpListingAPI(null, true)
        });
        return unsubscribe;
    }, [props.navigation]);

    // API methods
    const followUpListingAPI = async (page, refresh) => {
        if (refresh)
            setIsRefreshing(true)
        else if (!page)
            setIsLoading(true);
        else
            setPaginationLoading(true)
        let params = {
            "perPage": Constants.perPage,
            "page": page ?? 1,
            "ip_id": routeParam.IPId,
            "title": param?.title ?? "",
            "start_date": param?.start_date ?? "",
            "end_date": param?.end_date ?? "",
            // "status": param?.status ?? "",
            "status": param?.status?.id ?? "",


            // "status": "1",
        }

        // console.log("param--1111111111111111111111111111", param)
        let url = Constants.apiEndPoints.followUpsListing;
        // console.log("url", url);
        // console.log("params", params);

        let response = await APIService.postData(url, params, UserLogin.access_token, null, "followUpListingAPI");
        // console.log("data", response.data)
        if (!response.errorMsg) {
            // console.log('response-------------------+++++++++++++', JSON.stringify(response))
            if (!page) {
                setPage(1);
                setFollowupList(response.data.payload.data);
                setIsLoading(false);
                if (refresh)
                    setIsRefreshing(false);
            }
            else {
                let tempFollowupListList = [...FollowupList];
                tempFollowupListList = tempFollowupListList.concat(response.data.payload.data);
                setPage(page);
                setFollowupList([...tempFollowupListList]);
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

    const deleteFollowupListAPI = async (item, index) => {
        setIsLoading(true);
        // console.log('item', item)
        let url = Constants.apiEndPoints.followUp + "/" + item.id;
        // console.log("url", url)
        // return
        let response = await APIService.deleteData(url, UserLogin.access_token, null, "deletebranchAPI");
        if (!response.errorMsg) {
            let tempFollowupList = [...FollowupList];
            tempFollowupList.splice(index, 1)
            setFollowupList(tempFollowupList);
            Alert.showToast(messages.message_delete_success)
            setIsLoading(false);
        }
        else {
            setIsLoading(false);
            Alert.showAlert(Constants.danger, response.errorMsg)
        }
    }
    const flatListRenderItem = ({ item, index }) => {

        return (
            <IPListCard
                showMenu={true}
                openCardOptions={openCardOptions}
                setOpenCardOptions={setOpenCardOptions}
                index={index}
                isBranch={true}
                startDate={item?.start_date}
                endDate={item?.end_date}
                startTime={item?.start_time}
                endTime={item?.end_time}
                title={item.title}
                showDeleteIcon={
                    Can(Constants.permissionsKey.followupDelete, permissions)
                }
                showEditIcon={
                    Can(Constants.permissionsKey.followupEdit, permissions)
                }
                city={item.city}
                subTitle={item.is_completed == 0 ? labels?.["not-done-activity"] ?? "Incomplete" : item.is_completed == 1 ? labels['complete'] : false}
                onPressEdit={() => {
                    props.navigation.navigate("IPFollowUpScreen", { IPId: routeParam?.IPId, followUPId: item.id })
                }}
                onPressDelete={() => {
                    Alert.showDoubleAlert(Constants.warning, messages.message_delete_confirmation, () => {
                        deleteFollowupListAPI(item, index);
                    })
                }}
                onPressCard={
                    Can(Constants.permissionsKey.followupRead, permissions)
                        ? () => { props.navigation.navigate('FollowUpDetails', { IPId: routeParam?.IPId, followUPId: item.id, showHistoryBtn: true }) } : null
                }
            />
        )
    }
    // console.log("implementationName: routeParam?.implementationName", routeParam?.implementationName)
    //render item
    if (isLoading)
        return <ProgressLoader />


    const onRequestClose = () => {
        // console.log('onRequestClose called')
        // setCategoryItem(null);
        setIsModalVisible(false);
        // setIsModalVisible(true)
    }
    if (param.refreshAPI) {
        // console.log("param===============================", param)
        setParam({ ...param, refreshAPI: false })
        // branchListingAPI()
    }
    const openModel = () => {
        // setModelView(view)
        // console.log("rowData", rowData)
        setIsModalVisible(true);
        // settempdata(rowData)
        // console.error("isModalVisible", isModalVisible)
    }




    return (
        <BaseContainer
            onPressLeftIcon={() => { props.navigation.pop() }}
            leftIcon="arrow-back"
            // leftIconSize={24}
            rightIcon="filter-list"
            onPressRightIcon={() => openModel()}
            title={labels["followups"]}
            leftIconColor={Colors.primary}
        >

            {/* MODAL */}
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
                        {/* <FilterModalBranchComp
                            labels={labels}
                            onRequestClose={onRequestClose}
                            UserLogin={UserLogin}
                            setParam={setParam}
                            param={param} /> */}

                        <FilterFollowUpListing
                            labels={labels}
                            onRequestClose={onRequestClose}
                            UserLogin={UserLogin}
                            setParam={setParam}
                            param={param}

                        />



                        {/* <Filtermodel */}
                    </Modal>
                </Portal>

            </View>




            {/* <View style={{ paddingTop: 5, paddingRight: 5 }}> */}
            <FlatList
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ borderWidth: 0, paddingVertical: Constants.globalPaddingVetical, paddingHorizontal: Constants.globalPaddingHorizontal }}
                ListEmptyComponent={<EmptyList />}
                data={FollowupList}
                renderItem={flatListRenderItem}
                keyExtractor={(item, index) => index}
                onEndReached={() => { followUpListingAPI(page + 1) }}
                onEndReachedThreshold={0.1}
                refreshControl={
                    <RefreshControl
                        refreshing={isRefreshing}
                        onRefresh={() => {
                            followUpListingAPI(null, true)
                        }}
                    />
                }
            />

            {/* </View> */}
            {/* FLOATING ADD BUTTON */}
            {
                Can(Constants.permissionsKey.followupAdd, permissions)
                    ? <FAB
                        style={styles.fab}
                        color={Colors.white}
                        icon="plus"
                        onPress={() => { props.navigation.navigate('IPFollowUpScreen', { IPId: routeParam?.IPId, implementationName: routeParam?.implementationName }) }}
                    /> : null
            }
        </BaseContainer>
    )
}

export default FollowUpListing

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
