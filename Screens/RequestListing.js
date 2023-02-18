import React from 'react'
import { StyleSheet, Text, View, ScrollView, FlatList, RefreshControl, TouchableOpacity, Platform, Image, ImageBackground } from 'react-native'
import { FAB } from 'react-native-paper';
import EmptyList from '../Components/EmptyList';
import Colors from '../Constants/Colors';
import { formatDateForAPI, getProportionalFontSize } from '../Services/CommonMethods';
import { useSelector, useDispatch } from 'react-redux';
import BaseContainer from '../Components/BaseContainer';
import Constants from '../Constants/Constants';
import APIService from '../Services/APIService';
import ListLoader from '../Components/ListLoader';
import Can from '../can/Can';
import { Modal, Portal, } from 'react-native-paper';
import FooterCompForFlatlist from '../Components/FooterCompForFlatlist';
import Alert from '../Components/Alert';
import Assets from '../Assets/Assets';
import CustomButton from '../Components/CustomButton';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import EmptyDataContainer from '../Components/EmptyDataContainer';
import RequestModal from '../Components/RequestModal';

export default RequestListing = (props) => {

    // REDUX hooks
    const UserLogin = useSelector(state => state.User.UserLogin);
    const permissions = UserLogin?.permissions ?? {};
    const labels = useSelector(state => state.Labels);

    //hooks
    const [listData, setListData] = React.useState([]);
    const [requestObj, setRequestObj] = React.useState(null);
    const [isLoading, setIsLoading] = React.useState(true);
    const [operationInProgress, setOperationInProgress] = React.useState(false);
    const [isRefreshing, setIsRefreshing] = React.useState(false);
    const [paginationLoading, setPaginationLoading] = React.useState(false);
    const [page, setPage] = React.useState(0);
    const [isModalVisible, setIsModalVisible] = React.useState(false);

    const requestStatus = {
        "": "pending",
        "0": "pending",
        "1": "approved",
        "2": "rejected"
    }

    const requestStatusColor = {
        "": Colors.yellow,
        "0": Colors.yellow,
        "1": Colors.green,
        "2": Colors.red,
    }


    React.useEffect(() => {
        getListData(null, null)
    }, [])

    React.useEffect(() => {
        if (props?.route?.params?.addModalVisible)
            setIsModalVisible(true)
        else
            setIsModalVisible(false)
    }, [props?.route?.params])



    React.useEffect(() => {
        const unsubscribe = props.navigation.addListener('focus', () => {
            // console.log('Focus___________________________________________')
            getListData(null, true)
        });
        return unsubscribe;
    }, [props.navigation]);

    const getListData = async (page, refresh) => {
        if (refresh) setIsRefreshing(true);
        else if (!page) setIsLoading(true);
        else setPaginationLoading(true);
        let params = {
            perPage: Constants.perPage,
            page: page ?? 1,
        };

        let url = Constants.apiEndPoints.moduleRequestsList;
        let response = await APIService.postData(url, params, UserLogin.access_token, null, 'request listing');
        if (!response.errorMsg) {
            if (!page) {
                setPage(1);
                setListData(response.data.payload.data);
                setIsLoading(false);
                if (refresh) setIsRefreshing(false);
            } else {
                let tempList = [...listData];
                tempList = tempList.concat(response.data.payload.data);
                setPage(page);
                setListData([...tempList]);
                setPaginationLoading(false);
            }
        } else {
            if (!page) setIsLoading(false);
            else setPaginationLoading(false);
            if (refresh) setIsRefreshing(false);
            Alert.showAlert(Constants.danger, response.errorMsg);
        }
    }

    const deleteListItemAPI = async (item, index) => {
        setIsLoading(true);
        // console.log('item', item)
        let url = Constants.apiEndPoints.stampling + "/" + item.id;
        let response = await APIService.deleteData(url, UserLogin.access_token, null, "deleteStamplingAPI");
        if (!response.errorMsg) {
            let tempList = [...listData];
            tempList.splice(index, 1)
            setListData(tempList);
            Alert.showToast(labels.message_delete_success)
            setIsLoading(false);
        }
        else {
            setIsLoading(false);
            Alert.showAlert(Constants.danger, response.errorMsg)
        }
    }


    const flatListRenderItem = ({ item, index }) => {
        return (
            <TouchableOpacity activeOpacity={1} onPress={() => { }} style={styles.cardContainer}>

                {/* Status */}
                <View style={[styles.statusView, { backgroundColor: requestStatusColor[item.status] }]}>
                    <Text style={[styles.rightTitle, { color: Colors.white, width: "100%", }]}>
                        {labels[requestStatus[item.status]]}
                    </Text>
                </View>

                {/* module name */}
                <View style={styles.rowStyle}>
                    <Text style={styles.leftTitle}>{labels.module_m} : </Text>
                    <Text style={styles.rightTitle}>{item.module_names}</Text>
                </View>

                {/* comment */}
                <View style={styles.rowStyle}>
                    <Text style={styles.leftTitle}>{labels.comment} : </Text>
                    <Text style={styles.rightTitle}>{item.request_comment}</Text>
                </View>

                {/* reply on comment */}
                {item.reply_comment
                    ? <View style={styles.rowStyle}>
                        <Text style={styles.leftTitle}>{labels.reply_on_comment} : </Text>
                        <Text style={styles.rightTitle}>{item.reply_comment}</Text>
                    </View> : null}

                {/* requested by */}
                <View style={styles.rowStyle}>
                    <Text style={styles.leftTitle}>{labels.requested_by} : </Text>
                    <Text style={styles.rightTitle}>{item.user?.name}</Text>
                </View>

                {/* requested at */}
                <View style={styles.rowStyle}>
                    <Text style={styles.leftTitle}>{labels.requested_at_m} : </Text>
                    <Text style={styles.rightTitle}>{formatDateForAPI(item.created_at)}</Text>
                </View>

                {(UserLogin?.user_type_id == 1 && (item.status == "0" || !item.status))
                    ? <View style={[styles.rowStyle, { justifyContent: "space-between" }]}>
                        <CustomButton
                            style={[styles.nextButton, { backgroundColor: Colors.red }]}
                            titleStyle={[styles.rightTitle, { color: Colors.white, width: "100%", textAlign: "center" }]}
                            isLoading={operationInProgress}
                            onPress={() => {
                                item['request_status_choosen'] = "2";
                                setRequestObj(item)
                                setIsModalVisible(true)
                            }}
                            title={labels.reject}
                        />
                        <CustomButton
                            style={[styles.nextButton, { backgroundColor: Colors.green }]}
                            titleStyle={[styles.rightTitle, { color: Colors.white, width: "100%", textAlign: "center" }]}
                            isLoading={operationInProgress}
                            onPress={() => {
                                item['request_status_choosen'] = "1";
                                setRequestObj(item)
                                setIsModalVisible(true)
                            }}
                            title={labels['approve-this']}
                        />
                    </View> : null}

            </TouchableOpacity>
        )
    }

    const onRequestClose = () => {
        // console.log('onRequestClose called')
        setIsModalVisible(false)
        setRequestObj(null)
    }

    // Render
    // console.log(' props?.route?.params', props?.route?.params)
    return (
        <BaseContainer
            onPressLeftIcon={props.navigation.openDrawer}
            leftIcon="list"
            leftIconSize={24}
            title={labels.requests}
            style={{}}
        >
            {
                isLoading
                    ? <ListLoader />
                    : <View style={styles.mainView}>
                        {/* MODAL */}
                        <Portal>
                            <Modal
                                animationType="slide"
                                transparent={true}
                                visible={isModalVisible}
                                onRequestClose={onRequestClose}
                            // onDismiss={onRequestClose}
                            >
                                <RequestModal
                                    refreshAPI={() => { getListData() }}
                                    requestObj={requestObj}
                                    onRequestClose={onRequestClose}
                                />
                            </Modal>
                        </Portal>

                        <FlatList
                            ListEmptyComponent={<EmptyList subHeading={labels.new_request_msg} />}
                            data={listData}
                            renderItem={({ item, index }) => {
                                return flatListRenderItem({ item, index })
                            }}
                            contentContainerStyle={{ paddingHorizontal: Constants.globalPaddingHorizontal, paddingBottom: 50 }}
                            //style={{ paddingHorizontal: Constants.globalPaddingHorizontal }}
                            keyExtractor={item => '' + item.id}
                            onEndReached={() => { getListData(page + 1) }}
                            onEndReachedThreshold={0.1}
                            refreshControl={
                                <RefreshControl
                                    refreshing={isRefreshing}
                                    onRefresh={() => {
                                        getListData(null, true)
                                    }}
                                />
                            }
                            ListFooterComponent={() => <FooterCompForFlatlist paginationLoading={paginationLoading} />}
                        />

                        {UserLogin?.user_type_id != 1 ?
                            <FAB
                                style={styles.fab}
                                color={Colors.white}
                                icon="plus"
                                onPress={() => { setIsModalVisible(true) }}
                            /> : null}
                    </View>
            }
        </BaseContainer>
    )
}


const styles = StyleSheet.create({
    mainView: {
        flex: 1,
        // paddingBottom: 20
    },
    stamplingHeader: {
        height: "40%",
        width: "100%",
        borderWidth: 1
    },
    statusView: {
        position: "absolute",
        right: 5,
        top: 5,
        borderRadius: 8,
        padding: 5,
        justifyContent: "center",
        alignItems: "center"
    },
    nextButton: {
        justifyContent: 'center',
        alignItems: 'center',
        width: '44%',
        minHeight: 20,
        borderRadius: 9,
        paddingVertical: 5
    },
    leftTitle: {
        fontFamily: Assets.fonts.robotoregular,
        color: Colors.gray,
        fontSize: getProportionalFontSize(12),
        width: "30%"
    },
    rightTitle: {
        fontFamily: Assets.fonts.robotoMedium,
        color: Colors.primary,
        fontSize: getProportionalFontSize(12),
        width: "70%"
    },
    floatingPlusView: {
        height: 70,
        width: 70,
        backgroundColor: Colors.white,
        borderRadius: 22,
        position: "absolute",
        right: 12,
        top: "45%",
        justifyContent: "center",
        alignItems: "center",
        // shadow
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 15,
        elevation: 15,
        shadowColor: Colors.darkPrimary,
        shadowRadius: 6,
    },
    fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        backgroundColor: Colors.primary,
        bottom: 0,
    },
    rowStyle: {
        flexDirection: "row",
        // alignItems: "center",
        marginTop: 10
    },
    logInFab: { zIndex: 100, flexDirection: "row", alignItems: "center", justifyContent: "center", position: "absolute", right: 15, bottom: 20, backgroundColor: Colors.primary, borderRadius: 15, height: 40, width: 150 },
    loginText: { fontFamily: Assets.fonts.boldItalic, fontSize: getProportionalFontSize(17), color: Colors.white },
    cardContainer: {
        backgroundColor: Colors.white,
        paddingHorizontal: 15,
        paddingVertical: 20,
        marginTop: Constants.formFieldTopMargin,
        // shadow
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 15,
        elevation: 15,
        shadowColor: Colors.primary,
        shadowRadius: 6,
        borderRadius: 7,
    },
    normalText: {
        fontSize: getProportionalFontSize(13),
        fontFamily: Assets.fonts.semiBold,
        color: Colors.gray
    },
    boldText: {
        fontSize: getProportionalFontSize(13),
        fontFamily: Assets.fonts.bold,
        color: Colors.primary
    }
})
