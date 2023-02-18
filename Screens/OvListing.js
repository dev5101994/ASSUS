import React, { useCallback, useState } from 'react'
import { StyleSheet, Text, View, ScrollView, FlatList, RefreshControl } from 'react-native';
import { FAB, Portal, Modal } from 'react-native-paper';
import EmptyList from '../Components/EmptyList';
import Colors from '../Constants/Colors';
import { firstLetterFromString, getProportionalFontSize, } from '../Services/CommonMethods';
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
import WorkShiftModal from '../Components/WorkShiftModal';
import IpCardPatient from '../Components/PatientCard';
import OVcard from './OVcard';

import FilterOV from '../Components/FilterOV';



const OvListing = (props) => {
    // REDUX hooks
    const dispatch = useDispatch();
    const isInternetActive = useSelector(state => state.IsInternetActive);
    const UserLogin = useSelector(state => state.User.UserLogin);
    const labels = useSelector(state => state.Labels);
    const messages = useSelector(state => state.Labels);
    const permissions = UserLogin?.permissions ?? {}
    const [isModalVisible, setIsModalVisible] = React.useState(false);
    // hooks
    const [OvList, setOvList] = useState([])
    const [isLoading, setIsLoading] = React.useState(false);
    const [isRefreshing, setIsRefreshing] = React.useState(false);
    const [page, setPage] = React.useState(0);
    const [paginationLoading, setPaginationLoading] = React.useState(false);
    const [openCardOptions, setOpenCardOptions] = React.useState()
    const [param, setParam] = React.useState({ "title": "", "end_time": "", "start_time": "", "refreshAPI": false });
    // console.log("hey mukesh ", permissions)

    // useEffect hooks
    React.useEffect(() => {
        getOvList()

    }, [param])

    React.useEffect(() => {
        const unsubscribe = props.navigation.addListener('focus', () => {
            // The screen is focused
            // Call any action
            // console.log('Focus___________________________________________')
            getOvList()
        });

        // Return the function to unsubscribe from the event so it gets removed on unmount
        return unsubscribe;
    }, [props.navigation]);

    // API methods
    const getOvList = async (page, refresh) => {
        if (refresh)
            setIsRefreshing(true)
        else if (!page)
            setIsLoading(true);
        else
            setPaginationLoading(true)
        let params = {
            "perPage": Constants.perPage,
            "page": page ?? 1,
            // "shift_name": param?.shift_name ?? "",
            "title": param?.title ?? "",
            "start_time": param?.start_time ?? "",
            "end_time": param?.end_time ?? "",
        }
        // console.log("param888888888888888888888888", param)
        let url = Constants.apiEndPoints.ovhours;

        let response = await APIService.postData(url, params, UserLogin.access_token, null, "ovhoursListApi");
        // console.log('params=========>>>>>', JSON.stringify(response))
        if (!response.errorMsg) {

            if (!page) {
                setOvList(response.data.payload.data);
                setIsLoading(false);
                if (refresh)
                    setIsRefreshing(false);
                setPage(1);
            }
            else {
                let temp = [...OvList];
                temp = temp.concat(response.data.payload.data);
                // console.log(temp)
                setPage(page);
                setOvList([...temp]);
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

    // const deleteWords = async (itemId, index) => {
    //     setIsLoading(true);
    //     let url = Constants.apiEndPoints.word + "/" + itemId;
    //     console.log("url", url);
    //     let response = await APIService.deleteData(url, UserLogin.access_token, null, "deleteWordsAPI");
    //     if (!response.errorMsg) {
    //         console.log("payload===", response.data.payload);
    //         Alert.showToast(messages.message_delete_success, Constants.success)
    //         WordsList.splice(index, 1)
    //         setIsLoading(false);
    //     }
    //     else {
    //         setIsLoading(false);
    //         Alert.showAlert(Constants.danger, response.errorMsg);
    //     }
    // }


    const flatListRenderItem = ({ item, index }) => {
        return (
            <OVcard
                showMenu={true}
                openCardOptions={openCardOptions}
                setOpenCardOptions={setOpenCardOptions}
                index={index}
                hideAvatar={true}
                title={item.title}
                startTime={item.start_time}
                endTime={item.end_time}
                date={item.date ? moment(item.date).format("DD MMM yyyy") : false}
                showDeleteIcon={
                    Can(Constants.permissionsKey.scheduleDelete, [...permissions])
                }
                showEditIcon={
                    Can(Constants.permissionsKey.scheduleEdit, permissions)
                }

                onPressEdit={() => {
                    props.navigation.navigate("AddOv", { itemId: item.id })
                }}
                onPressDelete={() => {
                    Alert.showDoubleAlert(Constants.warning, messages.message_delete_confirmation, () => { deleteOv(item, index) })
                }}
            />

        )



    }
    //     OvList
    // setOvList
    const deleteOv = async (item, index) => {
        setIsRefreshing(true);
        // console.log('item', item)
        let url = Constants.apiEndPoints.ovhour + "/" + item.id;
        let response = await APIService.deleteData(url, UserLogin.access_token, null, "deleteOv");
        if (!response.errorMsg) {
            let tempList = [...OvList];
            tempList.splice(index, 1)
            setOvList(tempList);
            Alert.showToast(labels.message_delete_success)
            setIsRefreshing(false);
        }
        else {
            setIsRefreshing(false);
            Alert.showAlert(Constants.danger, response.errorMsg)
        }
    }


    const onRequestClose = () => {
        // console.log('onRequestClose called')
        // setWorkShiftItem(null)
        setIsModalVisible(false);
        // setIsModalVisible(true)
        // setIsFilterModalVisible(false)
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
            onPressLeftIcon={!isLoading ? () => { props.navigation.goBack() } : () => { }}
            leftIcon="arrow-back"
            rightIcon="filter-list"
            leftIconSize={24}
            title={labels["ov"]}
            onPressRightIcon={() => openModel()}
            leftIconColor={Colors.primary}
        >

            {/* MODAL */}
            <Portal>
                <Modal
                    animationType="slide"
                    transparent={true}
                    style={{ justifyContent: "center", alignItems: 'center' }}
                    visible={isModalVisible}
                    onRequestClose={onRequestClose}
                >

                    <FilterOV
                        labels={labels}
                        onRequestClose={onRequestClose}
                        UserLogin={UserLogin}
                        setParam={setParam}
                        param={param}
                    />





                </Modal>
            </Portal>

            {
                isLoading ? (
                    <ListLoader />
                ) : (
                    <>
                        <FlatList
                            ListEmptyComponent={<EmptyList />}
                            data={OvList}
                            renderItem={flatListRenderItem}
                            keyExtractor={item => item.id}
                            contentContainerStyle={{ borderWidth: 0, paddingVertical: Constants.globalPaddingVetical, paddingHorizontal: Constants.globalPaddingHorizontal }}
                            showsVerticalScrollIndicator={false}
                            onEndReached={() => { getOvList(page + 1) }}
                            onEndReachedThreshold={0.1}
                            refreshControl={
                                <RefreshControl
                                    refreshing={isRefreshing}
                                    onRefresh={() => {
                                        getOvList(null, true);
                                    }}
                                />
                            }
                            ListFooterComponent={() => <FooterCompForFlatlist paginationLoading={paginationLoading} />}
                        />
                        {/* FLOATING ADD BUTTON */}
                        {
                            Can(Constants.permissionsKey.scheduleAdd, permissions)
                                ? <FAB
                                    style={styles.fab}
                                    color={Colors.white}
                                    icon="plus"
                                    onPress={() => {
                                        props.navigation.navigate('AddOv', { itemId: '' });

                                    }}
                                />
                                : null}
                    </>
                )
            }


            {/* </ScrollView> */}
        </BaseContainer>
    )
}

export default OvListing

const styles = StyleSheet.create({
    fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        backgroundColor: Colors.primary,
        bottom: 0,
    },



    mainView: {
        flex: 1
    },

})