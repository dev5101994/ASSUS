import React from 'react'
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, FlatList, RefreshControl, ImageBackground } from 'react-native'
import { FAB } from 'react-native-paper';
import EmptyList from '../Components/EmptyList';
import Colors from '../Constants/Colors';
import { getProportionalFontSize } from '../Services/CommonMethods';
import { useSelector, useDispatch } from 'react-redux';
import Constants from '../Constants/Constants';
import Icon from 'react-native-vector-icons/MaterialIcons';
import APIService from '../Services/APIService'
import Alert from '../Components/Alert';
import CommonCRUDCard from '../Components/CommonCRUDCard';
import FooterCompForFlatlist from '../Components/FooterCompForFlatlist';
import IPListCard from '../Components/IPListCard';
import { Portal, Provider, Modal } from 'react-native-paper';
import FilterModalComp from '../Components/FilterModalComp';
// import FilterModalBranchComp from '../Components/FilterModalBranchComp'
import FilterModalBranchComp from './FilterModalBranchComp';
import CardListBranch from '../Components/BranchCard';
import PatientAndEmployeeCard from '../Components/PatientAndEmployeeCard'

import Can from '../can/Can';
import ListLoader from '../Components/ListLoader';

const BranchListing = (props) => {
    const [branchList, setbranchList] = React.useState([]);
    const [isLoading, setIsLoading] = React.useState(true);
    const [isRefreshing, setIsRefreshing] = React.useState(false);
    const [paginationLoading, setPaginationLoading] = React.useState(false);
    const [page, setPage] = React.useState(0);
    const [isLast, setIsLast] = React.useState(false);
    const [isModalVisible, setIsModalVisible] = React.useState(false);
    const [param, setParam] = React.useState({ "company_type_id": "", "name": "", "email": "", "contact_number": "", "personal_number": "", "status": null, "category": null, "ip": null, "patient": null, "branch": null, "refreshAPI": false });
    // console.log("params----------------", param)
    // "company_types": "",
    const [activityList, setActivityList] = React.useState([]);
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
        branchListingAPI()
    }, [param])

    React.useEffect(() => {
        const unsubscribe = props.navigation.addListener('focus', () => {
            // The screen is focused
            // Call any action
            // console.log('Focus___________________________________________')
            branchListingAPI(null, true)
        });

        // Return the function to unsubscribe from the event so it gets removed on unmount
        return unsubscribe;
    }, [props.navigation]);

    // API methods
    const branchListingAPI = async (page, refresh) => {
        if (refresh)
            setIsRefreshing(true)
        else if (!page)
            setIsLoading(true);
        else
            setPaginationLoading(true)
        let params = {
            // "perPage": Constants.perPage,
            // "page": page ?? 1,
            "perPage": Constants.perPage,
            "pageNumber": page ?? 1,
            "status": "1",
            "user_type_id": "11",
            "name": param?.name ?? "",
            // "tittle": param?.name?.id ?? "",
            "email": param?.email ?? "",
            // "contact_number": param?.contact_number?.id ?? "",
            "contact_number": param?.contact_number ?? "",
            "personal_number": param?.personal_number?.id ?? "",
            "company_type_id": param?.company_type_id.id ?? "",
            // "company_type_id": 3
            // "company_types": param?.company_types ?? "",



            // ...param
        }
        // console.log("params``````````````````88888888888888", params)
        let url = Constants.apiEndPoints.userList;
        // console.log("url", url);
        let response = await APIService.postData(url, params, UserLogin.access_token, null, "branchAPI");

        if (!response.errorMsg) {
            // console.log('response-------------------+++++++++++++', JSON.stringify(response))
            if (!page) {
                setPage(1);
                setbranchList(response.data.payload.data);
                setIsLoading(false);
                if (refresh)
                    setIsRefreshing(false);
            }
            else {
                let tempbranchList = [...branchList];
                tempbranchList = tempbranchList.concat(response.data.payload.data);
                setPage(page);
                setbranchList([...tempbranchList]);
                setPaginationLoading(false);
            }
            if (response?.data?.payload?.data?.length < 9) {
                setIsLast(true)
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

    const deleteBranchAPI = async (item, index) => {
        setIsLoading(true);
        // console.log('item', item)
        let url = Constants.apiEndPoints.userView + "/" + item.id;
        let response = await APIService.deleteData(url, UserLogin.access_token, null, "deletebranchAPI");
        if (!response.errorMsg) {
            let tempbranchList = [...branchList];
            tempbranchList.splice(index, 1)
            setbranchList(tempbranchList);
            Alert.showToast(messages.message_delete_success)
            setIsLoading(false);
        }
        else {
            setIsLoading(false);
            Alert.showAlert(Constants.danger, response.errorMsg)
        }
    }

    const flatListRenderItem = ({ item, index }) => {
        const companyTypes = (data) => {
            let types = "";
            data.forEach((obj) => {
                types = types + obj.name + ", "
            })
            return types;
        }
        return (
            // <TouchableOpacity onPress={() => { if (props.onPressCard) { props.onPressCard(); props.setOpenCardOptions() } }}>
            // <CardListBranch
            <PatientAndEmployeeCard
                showMenu={true}
                openCardOptions={openCardOptions}
                setOpenCardOptions={setOpenCardOptions}
                index={index}
                hideCount={true}
                isBranch={true}
                phoneNumber={item?.contact_number}
                email={item?.email}
                branchId={item?.unique_id}
                gender={item?.gender?.toLowerCase()}
                title={item.name}
                showDeleteIcon={
                    Can(Constants.permissionsKey.branchDelete, [...permissions])
                }
                showEditIcon={
                    Can(Constants.permissionsKey.branchEdit, permissions)
                }
                city={item.city}
                subTitle={item?.company_types?.length > 0 ? companyTypes(item?.company_types) : false}
                onPressEdit={() => {
                    props.navigation.navigate("AddBranch", { itemId: item.id })
                }}
                onPressDelete={() => {
                    Alert.showDoubleAlert(Constants.warning, messages.message_delete_confirmation, () => { deleteBranchAPI(item, index) })
                }}
                onPressCard={
                    // () => { console.log('item.user_type_id', item.user_type_id) }
                    Can(Constants.permissionsKey.branchRead, permissions)
                        ? () => { props.navigation.navigate("CommonUserProfile", { itemId: item.id, url: Constants.apiEndPoints.userView, user_type_id: item.user_type_id }) } : null
                }
            />
            // </TouchableOpacity>
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
            // leftIconSize={24}
            title={labels["branch"]}
            leftIconColor={Colors.primary}
            rightIcon="filter-list"
            onPressRightIcon={() => openModel()}
            rightIconColor={Colors.primary}
        >
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
                        <FilterModalBranchComp
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
            {/* </ImageBackground> */}

            {
                isLoading
                    ? <ListLoader />
                    : (
                        <>
                            <FlatList
                                showsVerticalScrollIndicator={false}
                                contentContainerStyle={{ borderWidth: 0, paddingVertical: Constants.globalPaddingVetical, paddingHorizontal: Constants.globalPaddingHorizontal }}
                                ListEmptyComponent={<EmptyList />}
                                data={branchList}
                                renderItem={flatListRenderItem}
                                keyExtractor={(item, index) => index}
                                onEndReached={!isLast ? () => { branchListingAPI(page + 1) } : () => { }}
                                onEndReachedThreshold={0.1}
                                refreshControl={
                                    <RefreshControl
                                        refreshing={isRefreshing}
                                        onRefresh={() => {
                                            branchListingAPI(null, true)
                                        }}
                                    />
                                }
                                ListFooterComponent={() => <FooterCompForFlatlist paginationLoading={paginationLoading} />}
                            />

                            {/* </View> */}
                            {/* FLOATING ADD BUTTON */}
                            {Can(Constants.permissionsKey.branchAdd, permissions)
                                ? (
                                    <FAB
                                        style={styles.fab}
                                        color={Colors.white}
                                        icon="plus"
                                        onPress={() => { props.navigation.navigate('AddBranch'); }}
                                    />) : null}
                        </>
                    )
            }

        </BaseContainer>
    )
}

export default BranchListing

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
