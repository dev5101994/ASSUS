import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, View, ScrollView, FlatList, TouchableOpacity, RefreshControl } from 'react-native'
import EmptyList from '../Components/EmptyList';
import Colors from '../Constants/Colors';
import { useSelector, useDispatch } from 'react-redux';
import { Data } from '../Constants/TempData';
import { ListingView } from '../Components/ListingView';
import BaseContainer from '../Components/BaseContainer';
import Constants from '../Constants/Constants';
import CommonCRUDCard from '../Components/CommonCRUDCard';
import { firstLetterFromString, formatDate, formatDateWithTime, formatTime, jsCoreDateCreator, getProportionalFontSize } from '../Services/CommonMethods';
import APIService from '../Services/APIService';
import Alert from '../Components/Alert';
//FAB BUTTON GROUP.............
import { FAB, Portal, Provider, Modal } from 'react-native-paper';
import IPListCard from '../Components/IPListCard';
import FooterCompForFlatlist from '../Components/FooterCompForFlatlist';
import Can from '../can/Can';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'; //timeline
// import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'; //tasks
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'; //notebook
import Ionicons from 'react-native-vector-icons/Ionicons'; //notebook
import ListLoader from '../Components/ListLoader';
import ImplementationPlanCardList from './ImplementationPlanCardList';
import FilterImplementationPlanListing from './FilterImplementationPlanListing';
// import { Portal, Provider, Modal } from 'react-native-paper';

const ImplementationPlanListing = (props) => {
    // REDUX hooks
    const dispatch = useDispatch();
    const UserLogin = useSelector(state => state.User.UserLogin);
    const permissions = UserLogin?.permissions ?? {}
    const labels = useSelector(state => state.Labels);
    const messages = useSelector(state => state.Labels);
    const [isModalVisible, setIsModalVisible] = React.useState(false);
    // const [param, setParam] = React.useState({ "name": "", "email": "", "contact_number": "", "personal_number": "", "status": null, "category": null, "ip": null, "patient": null, "branch": null, "start_date": null, "end_date": null, "refreshAPI": false });
    const [param, setParam] = React.useState({ "title": "", "patient_id": "", "branch": "", "category_id": "", "subcategory_id": "", "status": "", "patient": null, "start_date": null, "end_date": null, "refreshAPI": false });
    // console.log("Param-----------------------------", JSON.stringify(param))
    //use state hooks
    const [ipList, setIPList] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [page, setPage] = useState(0);
    const [fabActionButtons, setFabActionButtons] = useState([]);
    const [paginationLoading, setPaginationLoading] = useState(false);
    const [openCardOptions, setOpenCardOptions] = React.useState()
    //fab btn Group
    const [fabButton, setFabButton] = useState({ open: false });
    const onFabStateChange = ({ open }) => setFabButton({ open });
    const { open } = fabButton;


    // useEffect hooks
    useEffect(() => {
        setFabButtons();
        getIPList()
    }, [param])

    useEffect(() => {
        const unsubscribe = props.navigation.addListener('focus', () => {
            // The screen is focused
            // Call any action
            // console.log('Focus___________________________________________')
            getIPList(null, true);
        });

        // Return the function to unsubscribe from the event so it gets removed on unmount
        return unsubscribe;
    }, [props.navigation]);

    const setFabButtons = () => {

        fabActionButtons.push(
            {
                icon: 'plus',
                label: "Add IP's",
                onPress: () => { props.navigation.navigate('ImplementationPlan', { itemId: '' }); },
                small: false,
            }
        )
        setFabActionButtons(fabActionButtons)
    }


    const getIPList = async (page, refresh) => {
        if (refresh)
            setIsRefreshing(true)
        else if (!page)
            setIsLoading(true);
        else
            setPaginationLoading(true)
        let params = {
            "perPage": Constants.perPage,
            "page": page ?? 1,
            // "status": "",
            "status": param?.status?.id ?? "",
            // "patient": param?.patient?.id ?? "",
            "patient_id": param?.patient_id ?? "",
            "start_date": param?.start_date ?? "",
            "end_date": param?.end_date ?? "",
            // "emp_id": param?.employee.id ?? "",
            // "category_id": param?.category_id.id ?? "",
            "category_id": param?.category_id ?? "",
            "subcategory_id": param?.subcategory_id ?? "",
            // "title": param?.title.id ?? "",
            "title": param?.title ?? "",
            "branch": param?.branch ?? "",
            // ...param
        }
        let url = Constants.apiEndPoints.implementationPlanList;
        // console.log('params=========>>>>>', JSON.stringify(params))
        let response = await APIService.postData(url, params, UserLogin.access_token, null, "IPList");
        if (!response.errorMsg) {

            if (!page) {
                setIPList(response.data.payload.data);
                setIsLoading(false);
                if (refresh)
                    setIsRefreshing(false);
                setPage(1);
            }
            else {
                let tempDeptList = [...ipList];
                tempDeptList = tempDeptList.concat(response.data.payload.data);
                setPage(page);
                setIPList([...tempDeptList]);
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

    const deleteIP = async (ipId, index) => {
        setIsLoading(true);
        // let params = {
        // }
        // console.log("ipId", ipId)
        let url = Constants.apiEndPoints.implementationPlan + "/" + ipId;
        // console.log("url", url);
        let response = await APIService.deleteData(url, UserLogin.access_token, null, "deleteIPAPI");
        if (!response.errorMsg) {
            // console.log("payload===", response.data.payload);
            Alert.showToast(messages.message_delete_success, Constants.success)
            ipList.splice(index, 1)
            setIsLoading(false);
        }
        else {
            setIsLoading(false);
            Alert.showAlert(Constants.danger, response.errorMsg);
        }
    }

    const flatListRenderItem = ({ item, index }) => {
        // console.log('item', JSON.stringify(item))
        let labelText = firstLetterFromString(labels['ip-modal'])
        return (
            <ImplementationPlanCardList
                showMenu={true}
                openCardOptions={openCardOptions}
                setOpenCardOptions={setOpenCardOptions}
                index={index}
                patientName={item?.patient?.name}
                patientGender={item?.patient?.gender}
                patientNumber={item?.patient?.personal_number}
                onPressCard={
                    Can(Constants.permissionsKey.ipRead, permissions)
                        ? () => props.navigation.navigate("ImplementationPlanDetail", { itemId: item.id, showHistoryBtn: true }) : () => { }
                }
                title={item.title}
                labelText={labelText}
                showIcons={true}
                status={item?.status}
                cardLabels={item?.status == 0 ? labels["not-approved"] : item?.status == 1 ? labels["approved"] : item?.status == 2 ? labels["done-activity"] : labels["ok"]}
                showDeleteIcon={
                    Can(Constants.permissionsKey.ipDelete, permissions)
                }
                showEditIcon={
                    Can(Constants.permissionsKey.ipedit, permissions)
                }
                showSecondaryTitle={true}
                subTitle={item?.category?.name ? `${item?.category?.name} / ${item?.subcategory?.name}` : false}
                // hideAvatar={true}
                onPressEdit={() => {
                    props.navigation.navigate("ImplementationPlan", { itemId: item.id })
                }}
                onPressDelete={() => {
                    Alert.showDoubleAlert(Constants.warning, messages.message_delete_confirmation, () => {
                        deleteIP(item.id, index);
                    })
                }}
            >
                <View style={styles.countView}>
                    {/* Activity count  */}
                    <View style={styles.badgeContainer}>
                        <View style={styles.badge}>
                            <MaterialIcons name='timeline' color={Colors.white} size={15} />
                        </View>
                        <Text style={styles.badgeText}>
                            {item.assignActivityCount ?? 0}
                        </Text>
                    </View>
                    {/* task */}
                    <View style={styles.badgeContainer}>
                        <View style={styles.badge}>
                            <MaterialCommunityIcons name='human-wheelchair' color={Colors.white} size={14} />
                        </View>
                        <Text style={styles.badgeText}>
                            {item.assignTaskCount ?? 0}
                        </Text>
                    </View>
                    {/* contact person */}
                    <View style={styles.badgeContainer}>
                        <View style={styles.badge}>
                            <Ionicons name='person' color={Colors.white} size={14} />
                        </View>
                        <Text style={styles.badgeText}>
                            {item.ipCount ?? 0}
                        </Text>
                    </View>
                </View>

            </ImplementationPlanCardList>
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

    return (
        <BaseContainer
            onPressLeftIcon={() => { props.navigation.pop() }}
            leftIcon="arrow-back"
            onPressRightIcon={() => openModel()}
            rightIcon="filter-list"
            leftIconSize={24}
            title={labels["ip-modal"]}
            leftIconColor={Colors.primary}
        >

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
                        <FilterImplementationPlanListing
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


            {
                isLoading
                    ? <ListLoader />
                    : (
                        <>
                            <FlatList
                                data={ipList}
                                renderItem={flatListRenderItem}
                                keyExtractor={item => item.id}
                                ListEmptyComponent={<EmptyList />}
                                contentContainerStyle={{ borderWidth: 0, paddingVertical: Constants.globalPaddingVetical, paddingHorizontal: Constants.globalPaddingHorizontal }}
                                showsVerticalScrollIndicator={false}
                                onEndReached={() => { getIPList(page + 1) }}
                                onEndReachedThreshold={0.1}
                                refreshControl={
                                    <RefreshControl
                                        refreshing={isRefreshing}
                                        onRefresh={() => {
                                            getIPList(null, true);
                                        }}
                                    />
                                }
                                ListFooterComponent={() => <FooterCompForFlatlist paginationLoading={paginationLoading} />}
                            />
                            {Can(Constants.permissionsKey.ipAdd, permissions)
                                ? <FAB
                                    style={styles.fab}
                                    color={Colors.white}
                                    icon="plus"
                                    onPress={() => { props.navigation.navigate('ImplementationPlan', { itemId: '' }) }}
                                /> : null}
                        </>
                    )
            }
        </BaseContainer>
    )
}

export default ImplementationPlanListing

const styles = StyleSheet.create({
    fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        backgroundColor: Colors.primary,
        bottom: 0,
    },
    countView: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 10,
        // paddingHorizontal: 5,
        borderTopWidth: 1,
        paddingTop: 8,
        marginHorizontal: 10,
        borderColor: Colors.lightGray

    },
    badgeContainer: {
        backgroundColor: Colors.transparent,
        height: 22,
        borderRadius: 25,
        padding: 0,
        flexDirection: "row",
        alignItems: "center",
        // maxWidth: "33%",
        width: "20%",
        borderWidth: 1,
        borderColor: Colors.primary,

    },
    badge: {
        backgroundColor: Colors.primary,
        width: 20,
        height: 20,
        borderRadius: 26,
        justifyContent: "center",
        alignItems: "center",
        // position: "absolute",
        margin: 0
    },
    badgeText: {
        fontFamily: Assets.fonts.semiBold,
        fontSize: getProportionalFontSize(12),
        // color: Colors.black,
        marginLeft: 3, textAlign: "center", width: "40%"
    },
})
