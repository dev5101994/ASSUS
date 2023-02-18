import React, { useCallback, useState } from 'react'
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, FlatList, RefreshControl, Dimensions, ImageBackground } from 'react-native';
import EmptyList from '../Components/EmptyList';
import Colors from '../Constants/Colors';
import { firstLetterFromString, getProportionalFontSize, reverseFormatDate } from '../Services/CommonMethods';
import { useSelector, useDispatch } from 'react-redux';
import Constants from '../Constants/Constants';
import APIService from '../Services/APIService';
import ProgressLoader from '../Components/ProgressLoader';
import Alert from '../Components/Alert';
import CommonCRUDCard from '../Components/CommonCRUDCard';
import IPListCard from '../Components/IPListCard';
import LottieView from 'lottie-react-native';
import ListLoader from '../Components/ListLoader';
import FooterCompForFlatlist from '../Components/FooterCompForFlatlist';
import Can from '../can/Can';
import moment from 'moment';
import ScheduleListCard from '../Components/ScheduleListCard';
import { FAB, Portal, Modal, } from 'react-native-paper';
import LeavesForm from '../Components/LeavesForm';
import Assets from '../Assets/Assets';
import LeaveApproveModel from '../Components/LeaveApproveModel';
import FilterShedule from './FilterSchedule';
// import FilterLeavesList from '../Components/FilterLeavesList'
import FilterLeavesList from '../Components/FilterLeavesList'
import LeaveListCard from './LeaveListCard';
import AntDesign from 'react-native-vector-icons/AntDesign';

const LeavesList = (props) => {
    // REDUX hooks
    const dispatch = useDispatch();
    const isInternetActive = useSelector(state => state.IsInternetActive);
    const UserLogin = useSelector(state => state.User.UserLogin);
    const labels = useSelector(state => state.Labels);
    const messages = useSelector(state => state.Labels);
    const permissions = UserLogin?.permissions ?? {}
    const [isFilterModalVisible, setIsFilterModalVisible] = React.useState(false);
    const [modelView, setModelView] = React.useState('');
    // console.log("permissions----------------------------", permissions)
    // hooks
    const [LeavesData, setLeavesData] = useState([
    ])
    const [isLoading, setIsLoading] = React.useState(false);
    const [isRefreshing, setIsRefreshing] = React.useState(false);
    const [page, setPage] = React.useState(0);
    const [paginationLoading, setPaginationLoading] = React.useState(false);
    const [openCardOptions, setOpenCardOptions] = React.useState()
    const [isModalVisible, setIsModalVisible] = React.useState(false);
    const [LeaveDetails, setLeaveDetails] = React.useState({});
    const [param, setParam] = React.useState({ "emp_id": "", "start_date": "", "status": "", "end_date": "", "refreshAPI": false });
    const onRequestClose = () => {
        setIsModalVisible(false);
        setIsFilterModalVisible(false);
    }
    const openModel = (view) => {
        setModelView(view)
        setIsModalVisible(true);
    }
    // useEffect hooks
    React.useEffect(() => {
        getLeavesData()
    }, [param])

    React.useEffect(() => {
        const unsubscribe = props.navigation.addListener('focus', () => {
            // console.log('Focus___________________________________________')
            getLeavesData()
        });
        return unsubscribe;
    }, [props.navigation]);

    const refreshPage = () => {
        getLeavesData(null, true)
    }

    // API methods
    const getLeavesData = async (page, refresh) => {
        if (refresh)
            setIsRefreshing(true)
        else if (!page)
            setIsLoading(true);
        else
            setPaginationLoading(true)
        if (page) {

        }
        let params = {
            // {"is_approved":0,"start_date":"2022-07-12","end_date":"2022-07-12","user_id":249}
            "perPage": Constants.perPage,
            "page": page ?? "1",
            // "leave_approved": param?.is_approved?.id ? param?.is_approved?.id == 1 ? "yes" : "no" : "",
            "leave_approved": param?.is_approved?.id == 1 ? "yes" : "no",
            "start_date": param?.start_date ?? "",
            "end_date": param?.end_date ?? "",
            "leave_group_id": "yes",
            "emp_id": param?.user_id?.id ?? "",
        }
        // console.log('param---------------------123', JSON.stringify(params))
        let url = Constants.apiEndPoints.leaves;
        let response = await APIService.postData(url, params, UserLogin.access_token, null, "Leaves-ListApi");
        if (!response.errorMsg) {
            if (!page) {
                setLeavesData(response.data.payload.data);
                setIsLoading(false);
                if (refresh)
                    setIsRefreshing(false);
                setPage(1);
            }
            else {
                let temp = [...LeavesData];
                temp = temp.concat(response.data.payload.data);
                console.log(temp)
                setPage(page);
                setLeavesData([...temp]);
                setPaginationLoading(false);
            }
        }
        else {
            if (!page)
                setIsLoading(false);
            else
                setPaginationLoading(false);
            if (refresh)
                setIsRefreshing(false);
            Alert.showAlert(Constants.danger, response.errorMsg)
        }
    }

    const flatListRenderItem = ({ item, index }) => {
        // console.log("item-----", JSON.stringify(item))
        return (
            // <IPListCard
            <LeaveListCard
                showMenu={item.leave_approved == 0 ? true : false}
                openCardOptions={openCardOptions}
                setOpenCardOptions={setOpenCardOptions}
                index={index}
                hideAvatar={true}
                title={UserLogin.user_type_id == 3 ? labels["appliyed-on"] : item.user.name}
                subTitle={reverseFormatDate(item?.created_at)}
                reason={item?.leave_reason ?? "Vacation"}
                leaveDates={item?.leaves}
                showSecondaryTitle={true}
                cardLabels={item.leave_approved == 0 ? labels["not-approved"] : labels["approved"]}
                is_approved={item.leave_approved}
                hide_patient_details_text={true}
                showDeleteIcon={
                    UserLogin.user_type_id == 3
                        ? Can(Constants.permissionsKey.leaveDelete, [...permissions])
                        : false
                }
                showEditIcon={
                    UserLogin.user_type_id == 3
                        ? Can(Constants.permissionsKey.leaveEdit, permissions)
                        : false
                }
                showLeaveApprovedIcon={UserLogin.user_type_id == 2 ? true : false}
                onPressEdit={() => {
                    setLeaveDetails(item)
                    openModel("edit")
                }}
                onPressDelete={() => {
                    Alert.showDoubleAlert(Constants.warning, messages.message_delete_confirmation, () => { deleteLeave(item, index) })
                }}
                onPressLeaveIcon={() => { setLeaveDetails(item); openModel("leave"); }}

            >
                {
                    item.leave_approved != 0 && UserLogin.user_type_id == 3
                        ? <View style={{
                            flexDirection: "row",
                            paddingHorizontal: 15,
                            marginBottom: getProportionalFontSize(15),
                            borderTopWidth: 1,
                            borderTopColor: Colors.lightGray,
                            paddingTop: 5
                        }} >
                            <Text style={styles.cardText} >
                                {labels["approved-by"]}-
                            </Text>
                            <Text style={styles.cardText}>
                                &nbsp;{item?.leave_approved_by?.name}
                            </Text>
                        </View>
                        : null
                }

            </LeaveListCard>




        )
    }
    const deleteLeave = async (item, index) => {
        setIsRefreshing(true);
        let url = Constants.apiEndPoints.leave + "/" + item.id;
        let response = await APIService.deleteData(url, UserLogin.access_token, null, "deleteLeave");
        if (!response.errorMsg) {
            let tempList = [...LeavesData];
            tempList.splice(index, 1)
            setLeavesData(tempList);
            Alert.showToast(labels.message_delete_success)
            setIsRefreshing(false);
        }
        else {
            setIsRefreshing(false);
            Alert.showAlert(Constants.danger, response.errorMsg)
        }
    }
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

    return (
        <BaseContainer
            onPressLeftIcon={!isLoading ? () => { props.navigation.goBack() } : () => { }}
            leftIcon="arrow-back"
            leftIconSize={24}
            title={labels["Leaves"]}
            rightIcon="filter-list"
            onPressRightIcon={() => openModel("filter")}
            leftIconColor={Colors.primary}
            headerBar={{ backgroundColor: Colors.blueMagenta }}
        >
            {
                isLoading ? (
                    <ListLoader />
                ) : (
                    <ImageBackground resizeMode="stretch" source={Assets.images.Leave} style={{ flex: 1, }}>
                        <View style={{
                            flexDirection: 'row',
                            justifyContent: 'space-around',
                            alignItems: 'center',
                            top: '18%'

                        }}>
                        </View>
                        {Can(Constants.permissionsKey.activityAdd, permissions)
                            ? <TouchableOpacity
                                // onPress={() => { props.navigation.navigate('AddActivity', { itemId: '' }); }}
                                onPress={() => {
                                    //  props.navigation.navigate(''); 
                                    // setIsModalVisible(true)
                                    // alert("hello")
                                    props.navigation.navigate('AddLeaves', { itemId: '' });
                                }}
                                style={styles.floatingPlusView}>
                                <AntDesign
                                    name="plus"
                                    color={Colors.primary}
                                    // style={{}}
                                    size={40}
                                />
                            </TouchableOpacity> : null}


                        <View style={{ marginTop: Dimensions.get("window").height * 0.37 }}>
                            <FlatList
                                ListEmptyComponent={<EmptyList />}
                                data={LeavesData}
                                renderItem={flatListRenderItem}
                                keyExtractor={(item, index) => index}
                                contentContainerStyle={{ borderWidth: 0, paddingVertical: Constants.globalPaddingVetical, paddingHorizontal: Constants.globalPaddingHorizontal }}
                                showsVerticalScrollIndicator={false}
                                //   onEndReached={() => { getLeavesData(page + 1) }}
                                // onEndReachedThreshold={0.1}
                                refreshControl={
                                    <RefreshControl
                                        refreshing={isRefreshing}
                                        onRefresh={() => {
                                            getLeavesData(null, true);
                                        }}
                                    />
                                }
                                ListFooterComponent={() => <FooterCompForFlatlist paginationLoading={paginationLoading} />}
                            />
                        </View>
                        {/* FLOATING ADD BUTTON */}
                        {
                            // UserLogin.user_type_id == 3
                            // Can(Constants.permissionsKey.leaveAdd, permissions)
                            //     ? 
                            // <FAB
                            //     style={styles.fab}
                            //     color={Colors.white}
                            //     icon="plus"
                            //     onPress={() => {
                            //         props.navigation.navigate('AddLeaves', { itemId: '' });

                            //     }}
                            // />
                            // : null
                            // : null
                        }

                    </ImageBackground>
                )
            }


            <Portal>
                <Modal
                    animationType="slide"
                    transparent={true}
                    style={{ justifyContent: "center", alignItems: 'center', }}
                    // visible={isModalVisible}
                    visible={isModalVisible}
                    onRequestClose={onRequestClose}
                    onDismiss={onRequestClose}
                >
                    <View style={styles.modalMainView}>
                        <View style={styles.innerViewforModel}>
                            {

                                modelView == "leave"
                                    ? <LeaveApproveModel
                                        labels={labels} UserLogin={UserLogin}
                                        LeaveDetails={LeaveDetails}
                                        onRequestClose={onRequestClose}
                                        refreshPage={refreshPage}
                                        isUserHasModule={isUserHasModule()}
                                    />
                                    : modelView == "edit"
                                        ? <LeavesForm
                                            DateRange={[]}
                                            setDateRange={() => { }}
                                            labels={labels} UserLogin={UserLogin}
                                            markedDatesForForm={[]}
                                            onRequestClose={onRequestClose}
                                            navigation={props.navigation}
                                            isEditing={true}
                                            LeaveDetails={LeaveDetails}
                                            formValues={{}}
                                            refreshPage={refreshPage}
                                        />
                                        : <FilterLeavesList
                                            labels={labels}
                                            onRequestClose={onRequestClose}
                                            UserLogin={UserLogin}
                                            setParam={setParam}
                                            param={param}
                                        />
                            }
                        </View>
                    </View>
                </Modal>
            </Portal>
        </BaseContainer>
    )
}

export default LeavesList

const styles = StyleSheet.create({
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
    cardText: {
        fontFamily: Assets.fonts.semiBold,
        color: Colors.gray,
        fontSize: getProportionalFontSize(12),
        textTransform: 'capitalize',
    },
    modalMainView: { backgroundColor: 'transparent', justifyContent: "center", alignItems: "center", paddingHorizontal: 16 },
    innerViewforModel: {
        width: Dimensions.get("window").width * 0.9, minHeight: 150, backgroundColor: Colors.backgroundColor, paddingBottom: Constants.globalPaddingHorizontal * 2, paddingHorizontal: 0, borderRadius: 20, maxHeight: Dimensions.get("window").height * 0.8
    },
})