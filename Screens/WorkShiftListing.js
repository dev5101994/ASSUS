import React from 'react';
import {
    StyleSheet,
    Text, View, SafeAreaView, Image, TouchableOpacity, ScrollView, FlatList, RefreshControl, ImageBackground, Dimensions
} from 'react-native';
import Colors from '../Constants/Colors';
import Assets from '../Assets/Assets'
import { getProportionalFontSize, reverseFormatDate } from '../Services/CommonMethods';
import APIService from '../Services/APIService'
import Constants from '../Constants/Constants'
import ProgressLoader from '../Components/ProgressLoader'
import { useSelector, useDispatch } from 'react-redux'
import Icon from 'react-native-vector-icons/MaterialIcons';
import BaseContainer from '../Components/BaseContainer';
import CategoryModal from '../Components/CategoryModal'
import { Modal, Portal, } from 'react-native-paper';
import { FAB } from 'react-native-paper';
import Alert from '../Components/Alert';
import EmptyList from '../Components/EmptyList'
import CommonCRUDCard from '../Components/CommonCRUDCard';
import IPListCard from '../Components/IPListCard';
import FooterCompForFlatlist from '../Components/FooterCompForFlatlist';
import Can from '../can/Can';
import ListLoader from '../Components/ListLoader';
import WorkShiftModal from '../Components/WorkShiftModal';
// import FilterShedule from './FilterSchedule';
// import WorkShiftListing from '../Components/FilterWorkShift'
import FilterWorkShift from '../Components/FilterWorkShift'
import WorkShiftListingCard from '../Components/WorkShiftListingCard'
import AntDesign from 'react-native-vector-icons/AntDesign';
import { Badge } from 'react-native-paper';
const WorkShiftListing = (props) => {
    // useState hooks
    const [workShiftList, setWorkShiftList] = React.useState([]);
    const [workShiftItem, setWorkShiftItem] = React.useState(null);
    const [isLoading, setIsLoading] = React.useState(true);
    const [isRefreshing, setIsRefreshing] = React.useState(false);
    const [openCardOptions, setOpenCardOptions] = React.useState()
    const [paginationLoading, setPaginationLoading] = React.useState(false);
    const [page, setPage] = React.useState(0);
    const [isModalVisible, setIsModalVisible] = React.useState(false);
    const [isFilterModalVisible, setIsFilterModalVisible] = React.useState(false);


    // REDUX hooks
    const isInternetActive = useSelector(state => state.IsInternetActive);
    const UserLogin = useSelector(state => state.User.UserLogin);
    const permissions = UserLogin?.permissions ?? {}
    const labels = useSelector(state => state.Labels);
    const messages = useSelector(state => state.Labels);
    const category_status = labels;
    const category_status_color = Colors.active_inactive_status_color;
    const [param, setParam] = React.useState({ "shift_name": "", "shift_start_time": "", "shift_end_time": "", "shift_type": "", "refreshAPI": false });

    // useEffect hooks
    React.useEffect(() => {
        workShiftListingAPI()
    }, [param])
    React.useEffect(() => {
        const unsubscribe = props.navigation.addListener('focus', () => {
            // console.log('Focus___________________________________________')
            // taskListingAPI(null, true)
        });
        return unsubscribe;
    }, [props.navigation]);

    const flatListRenderItem = ({ item, index }) => {
        // console.log(item.shift_name)
        return (
            <WorkShiftListingCard
                showMenu={true}
                openCardOptions={openCardOptions}
                setOpenCardOptions={setOpenCardOptions}
                index={index}
                hideAvatar={true}
                avatarColor={true}
                fromWorkShift={true}
                shiftType={item.shift_type?.length > 0 ? (item.shift_type?.charAt(0).toUpperCase() + item.shift_type.substring(1, item.shift_type.length)) : ''}
                // shiftType={item.shift_type}
                startTime={item.shift_start_time}
                endTime={item.shift_end_time}
                title={item.shift_name}
                subTitle={labels["created-at"] + ": " + reverseFormatDate(item.created_at)}
                workShiftColor={item.shift_color}
                showDeleteIcon={
                    Can(Constants.permissionsKey.workShiftDelete, permissions)
                }
                showEditIcon={
                    Can(Constants.permissionsKey.workShiftEdit, permissions)
                }
                onPressEdit={() => {
                    setWorkShiftItem(item);
                    setIsModalVisible(true);

                }}
                onPressDelete={() => {
                    Alert.showDoubleAlert(Constants?.warning, messages?.message_delete_confirmation, () => { deleteWorkShiftAPI(item, index) })
                }}

            />
        )
    }

    // API methods
    const workShiftListingAPI = async (page, refresh) => {
        if (refresh)
            setIsRefreshing(true)
        else if (!page)
            setIsLoading(true);
        else
            setPaginationLoading(true)

        let tempShiftType = ""
        if (param?.shift_type.id == 1) {
            tempShiftType = "normal"
        }
        else if (param?.shift_type.id == 2) {
            tempShiftType = "emergency"
        }

        let params = {
            "perPage": Constants.perPage,
            "page": page ?? 1,
            "shift_name": param?.shift_name ?? "",
            // "shift_start_time": "",
            // "shift_start_time": param?.shift_start_time ?? "",
            // "shift_end_time": param?.shift_end_time ?? "",
            "shift_start_time": "",
            "shift_end_time": "",
            "shift_type": tempShiftType,
            // ...param
        }
        // return
        let url = Constants.apiEndPoints.workshifts;
        let response = await APIService.postData(url, params, UserLogin.access_token, null, "workShiftListingAPI");
        if (!response.errorMsg) {
            if (!page) {
                setWorkShiftList(response.data.payload.data);
                setIsLoading(false);
                if (refresh)
                    setIsRefreshing(false);
                setPage(1);
            }
            else {
                let tempWorkShiftList = [...workShiftList];
                tempWorkShiftList = tempWorkShiftList.concat(response.data.payload.data);
                setPage(page);
                setWorkShiftList([...tempWorkShiftList]);
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

    const deleteWorkShiftAPI = async (item, index) => {
        setIsLoading(true);
        // console.log('item', item)
        let url = Constants.apiEndPoints.work_shift + "/" + item.id;
        let response = await APIService.deleteData(url, UserLogin.access_token, null, "deleteWorkShiftAPI");
        if (!response.errorMsg) {
            let tempWorkShiftList = [...workShiftList];
            tempWorkShiftList.splice(index, 1)
            setWorkShiftList(tempWorkShiftList);
            Alert.showToast(messages.message_delete_success)
            setIsLoading(false);
        }
        else {
            setIsLoading(false);
            Alert.showAlert(Constants.danger, response.errorMsg)
        }
    }

    // const onRequestClose = () => {
    //     console.log('onRequestClose called')
    //     setWorkShiftItem(null);
    //     setIsModalVisible(false);
    // }

    const onRequestClose = () => {
        // console.log('onRequestClose called')
        setWorkShiftItem(null)
        setIsModalVisible(false);
        // setIsModalVisible(true)
        setIsFilterModalVisible(false)
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


    // Render view
    //  console.log('categoryList', categoryList)
    // if (isLoading)
    //     return <ProgressLoader />

    return (
        <BaseContainer
            onPressLeftIcon={() => { props.navigation.pop() }}
            leftIcon="arrow-back"
            leftIconSize={24}
            title={labels["work-shift"]}
            leftIconColor={Colors.primary}
            rightIcon="filter-list"
            // onPressRightIcon={() => openModel()}
            onPressRightIcon={() => setIsFilterModalVisible(true)}
            headerBar={{ backgroundColor: Colors.blueMagenta }}

        // rightIcon={isUserHasModule() ? "filter-list" : null}
        >

            {/* MODAL */}
            <Portal>
                <Modal
                    animationType="slide"
                    transparent={true}
                    //  style={isPrintJournalModalVisible ? {} : { justifyContent: "center", alignItems: 'center' }}
                    style={{}}
                    visible={isModalVisible || isFilterModalVisible}
                    // visible={isFilterModalVisible}
                    onRequestClose={onRequestClose}
                    onDismiss={onRequestClose}
                >
                    {
                        isFilterModalVisible ?
                            <FilterWorkShift
                                labels={labels}
                                onRequestClose={onRequestClose}
                                UserLogin={UserLogin}
                                setParam={setParam}
                                param={param}
                            />

                            :
                            <WorkShiftModal
                                workShiftItem={workShiftItem}
                                labels={labels}
                                onRequestClose={onRequestClose}
                                refreshAPI={workShiftListingAPI}
                            />
                    }
                </Modal>
            </Portal>
            {/* </ImageBackground> */}

            {/* Main View */}
            {/* <View style={styles.mainView}> */}
            {
                isLoading
                    ? <ListLoader />
                    : (
                        <ImageBackground resizeMode="stretch" source={Assets.images.workShift} style={{ flex: 1, }}>
                            <View style={{
                                flexDirection: 'row',
                                justifyContent: 'space-around',
                                alignItems: 'center',
                                top: '12%'

                            }}>
                                <Badge style={styles.badgee}><Text style={styles.badge}>DS</Text></Badge>
                                <Badge style={styles.badgee}><Text style={styles.badge}>ES</Text></Badge>
                                <Badge style={styles.badgee}><Text style={styles.badge}>NS</Text></Badge>
                            </View>

                            <View
                                style={{
                                    flexDirection: 'row',
                                    justifyContent: 'space-evenly',
                                    alignItems: 'center',
                                    top: '7.5%'

                                }}>

                                <TouchableOpacity style={styles.box}><Text style={styles.text}>Day Shift</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.box}><Text style={styles.text}>Evening Shift</Text></TouchableOpacity>
                                <TouchableOpacity style={styles.box}><Text style={styles.text}>Night Shift</Text></TouchableOpacity>

                            </View>



                            {Can(Constants.permissionsKey.activityAdd, permissions)
                                ? <TouchableOpacity
                                    // onPress={() => { props.navigation.navigate('AddActivity', { itemId: '' }); }}
                                    onPress={() => {
                                        //  props.navigation.navigate(''); 
                                        setIsModalVisible(true)
                                        // alert("hello")
                                    }}
                                    style={styles.floatingPlusView}>
                                    <AntDesign
                                        name="plus"
                                        color={Colors.primary}
                                        // style={{}}
                                        size={40}
                                    />
                                </TouchableOpacity> : null}

                            {/* Category listing */}
                            <View style={{ marginTop: Dimensions.get("window").height * 0.25 }}>
                                <FlatList
                                    contentContainerStyle={{
                                        borderWidth: 0, paddingHorizontal: Constants.globalPaddingHorizontal,
                                        paddingBottom: 100
                                    }}
                                    data={workShiftList}
                                    showsVerticalScrollIndicator={false}
                                    ListEmptyComponent={EmptyList}
                                    keyExtractor={(item, index) => index}
                                    renderItem={flatListRenderItem}
                                    onEndReached={() => { workShiftListingAPI(page + 1) }}
                                    onEndReachedThreshold={0.1}
                                    refreshControl={
                                        <RefreshControl
                                            refreshing={isRefreshing}
                                            onRefresh={() => {
                                                workShiftListingAPI(null, true);
                                            }}
                                        />
                                    }
                                    ListFooterComponent={() => <FooterCompForFlatlist paginationLoading={paginationLoading} />}
                                />
                            </View>
                        </ImageBackground>

                    )

            }

        </BaseContainer>
    )
}

export default WorkShiftListing

const styles = StyleSheet.create({
    mainView: {
        flex: 1,
        //paddingHorizontal: 24,
        backgroundColor: Colors.backgroundColor,
        paddingBottom: 20,
    },
    fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        backgroundColor: Colors.primary,
        bottom: 0,
    },
    floatingPlusView: {
        height: 80,
        width: 80,
        backgroundColor: Colors.white,
        borderRadius: 22,
        position: "absolute",
        right: 35,
        top: "29%",
        justifyContent: "center",
        alignItems: "center",
        // shadow
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 15,
        elevation: 15,
        shadowColor: Colors.primary,
        shadowRadius: 6,
        zIndex: 20
    },
    box: {
        width: "29%",
        height: 75,
        backgroundColor: Colors.white,
        borderRadius: 15,
        alignItems: "center",
        justifyContent: "center"
    },
    text: {
        color: Colors.blueMagenta,
        fontSize: getProportionalFontSize(15),
        fontFamily: Assets.fonts.semiBold,
        top: 5

    },
    badge: {
        color: Colors.blueMagenta,
        fontSize: getProportionalFontSize(15),
        fontFamily: Assets.fonts.semiBold,
    },
    badgee: {
        backgroundColor: Colors.white,
        width: 39,
        height: 39,
        borderRadius: 20,
        elevation: 15,
    },

})
