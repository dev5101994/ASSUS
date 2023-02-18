import React, { useState } from 'react'
import { StyleSheet, Text, View, FlatList, RefreshControl, ImageBackground, TouchableOpacity } from 'react-native'
import Colors from '../Constants/Colors';
import { formatDate, getProportionalFontSize } from '../Services/CommonMethods';
import { useSelector, useDispatch } from 'react-redux';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Constants from '../Constants/Constants';
import APIService from '../Services/APIService';
import Alert from '../Components/Alert';
import Assets from '../Assets/Assets';
import FooterCompForFlatlist from '../Components/FooterCompForFlatlist';
import ListLoader from '../Components/ListLoader';
import Can from '../can/Can';
import EmptyDataContainer from '../Components/EmptyDataContainer';


const TrashedActivity = (props) => {
    // REDUX hooks
    const dispatch = useDispatch();
    const labels = useSelector(state => state.Labels);
    const UserLogin = useSelector(state => state.User.UserLogin);
    const permissions = UserLogin?.permissions ?? {}

    const [trashedActivityList, setTrashedActivityList] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [page, setPage] = useState(0);
    const [paginationLoading, setPaginationLoading] = useState(false);

    React.useEffect(() => {
        getTrashedActivity(null, null)
    }, [])

    React.useEffect(() => {
        const unsubscribe = props.navigation.addListener('focus', () => {
            // The screen is focused
            // Call any action
            // console.log('Focus___________________________________________')
            getTrashedActivity(null, true);
        });
        // Return the function to unsubscribe from the event so it gets removed on unmount
        return unsubscribe;
    }, [props.navigation]);

    const getTrashedActivity = async (page, refresh) => {
        if (refresh)
            setIsRefreshing(true)
        else if (!page)
            setIsLoading(true);
        else
            setPaginationLoading(true)
        let params = {
            "perPage": Constants.perPage,
            "page": page ?? 1,
        }

        let url = Constants.apiEndPoints.trashedActivites;
        let response = await APIService.postData(url, params, UserLogin.access_token, null, "trashedActivites API");
        if (!response.errorMsg) {
            if (!page) {
                setTrashedActivityList(response.data.payload.data);
                setIsLoading(false);
                if (refresh)
                    setIsRefreshing(false);
                setPage(1);
            }
            else {
                let tempTrashedActivityList = [...trashedActivityList];
                tempTrashedActivityList = tempTrashedActivityList.concat(response.data.payload.data);
                setPage(page);
                setTrashedActivityList([...tempTrashedActivityList]);
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

    const renderDetail = ({ item, index }) => {
        return (
            <View
                style={styles.cardContainer}
            >
                {/* Card Header */}
                <View style={styles.topPrimaryView}>
                    <Text numberOfLines={2} style={{ ...styles.headerTitile, color: Colors.white }}>{item.category?.name}</Text>

                    <View style={styles.rightIconsView}>
                        {
                            Can(Constants.permissionsKey.trashedActivitesRestore, permissions)
                                ? <TouchableOpacity
                                    onPress={() => { Alert.showDoubleAlert(Constants.warning, labels.activity_restored_confirmation_msg, () => { restoreActivityAPI(item.id) }) }}
                                    style={[styles.roundWhiteView, { marginEnd: 5 }]}>
                                    <MaterialCommunityIcons
                                        name="delete-restore"
                                        color={Colors.bloodred}
                                        style={{}}
                                        size={20}
                                    />
                                </TouchableOpacity>
                                : null}

                        {
                            Can(Constants.permissionsKey.trashedActivitesRestore, permissions)
                                ? <TouchableOpacity
                                    onPress={() => { Alert.showDoubleAlert(Constants.warning, labels.message_delete_confirmation, () => { deleteTrashedActivityAPI(item.id) }) }}
                                    style={styles.roundWhiteView}>
                                    <MaterialCommunityIcons
                                        name="delete"
                                        color={Colors.bloodred}
                                        size={20}
                                    />
                                </TouchableOpacity>
                                : null}
                    </View>
                </View>

                <View style={styles.lowerWhiteView}>
                    {/* title */}
                    <Text style={styles.subheaderTitle}>{item.title}</Text>
                    {/* description */}
                    {/* <Text style={styles.subheaderValue}>{labels.description}</Text> */}
                    <Text numberOfLines={3} style={{ ...styles.subheaderValue, width: "82%", }}>{item.description}</Text>

                    {/* patient */}
                    <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                        <Text style={{ ...styles.subheaderValue, width: "82%", }}>{labels.patient} : {item?.patient?.name}</Text>
                    </View>
                    {/* date */}
                    <Text style={{ ...styles.subheaderValue, width: "82%", }}>{labels.date} : {formatDate(item?.start_date)}{item?.end_date ? (" - " + formatDate(item?.end_date)) : ""}</Text>
                    {/* time */}
                    {item?.start_time
                        ? <Text style={{ ...styles.subheaderValue, width: "82%", }}>{labels.time} : {item?.start_time}{item?.end_time ? (" - " + item?.end_time) : ""}</Text>
                        : null}
                </View>
            </View>
        )
    }

    const deleteTrashedActivityAPI = async (activity_id) => {
        setIsLoading(true);
        let url = Constants.apiEndPoints.trashedActivitesPermanentDelete + "/" + activity_id;
        let response = await APIService.deleteData(url, UserLogin.access_token, null, "deleteTrashedActivityAPI");
        if (!response.errorMsg) {
            Alert.showToast(labels.message_delete_success)
            setIsLoading(false);
            getTrashedActivity(null, true);
        }
        else {
            setIsLoading(false);
            Alert.showAlert(Constants.danger, response.errorMsg)
        }
    }

    const restoreActivityAPI = async (activity_id) => {
        setIsLoading(true);
        let url = Constants.apiEndPoints.trashedActivitesRestore + "/" + activity_id;
        let response = await APIService.getData(url, UserLogin.access_token, null, "restoreActivityAPI");
        if (!response.errorMsg) {
            Alert.showToast(labels.activity_restored_successfully_msg)
            setIsLoading(false);
            getTrashedActivity(null, true);
        }
        else {
            setIsLoading(false);
            Alert.showAlert(Constants.danger, response.errorMsg)
        }
    }

    // if (isLoading)
    //     return <ProgressLoader />

    // renderview
    return (
        <BaseContainer
            onPressLeftIcon={() => { props.navigation.pop() }}
            leftIcon="arrow-back"
            leftIconSize={24}
            title={labels.trashedActivity}
            leftIconColor={Colors.primary}
        // rightIcon="filter-list"
        // onPressRightIcon={() => {}}
        // rightIconColor={Colors.primary}
        >
            {
                isLoading
                    ? <ListLoader />
                    : (
                        <View style={{ flex: 1 }}>
                            <FlatList
                                ListEmptyComponent={<EmptyDataContainer style={{ marginTop: 20 }} />}
                                data={trashedActivityList}
                                renderItem={renderDetail}
                                showsVerticalScrollIndicator={false}
                                refreshControl={(
                                    <RefreshControl
                                        refreshing={isRefreshing}
                                        onRefresh={() => {
                                            getTrashedActivity(null, true);
                                        }}
                                    />
                                )}
                                contentContainerStyle={{ paddingBottom: 50, paddingHorizontal: Constants.globalPaddingHorizontal, }}
                                ListFooterComponent={() => <FooterCompForFlatlist paginationLoading={paginationLoading} />}
                                onEndReachedThreshold={0.3}
                                onEndReached={() => { getTrashedActivity(page + 1, null) }}
                            />
                        </View>
                    )
            }

        </BaseContainer>
    )
}

export default TrashedActivity

const styles = StyleSheet.create({
    fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        backgroundColor: Colors.primary,
        bottom: 0,
    },
    rightIconsView: { flexDirection: "row", alignItems: "center", width: "30%", justifyContent: "flex-end" },
    roundWhiteView: {
        width: 25, height: 25,
        backgroundColor: Colors.white,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 12
    },
    topPrimaryView: {
        height: "25%",
        width: "100%",
        backgroundColor: Colors.primary,
        borderTopRightRadius: 12,
        borderTopLeftRadius: 12,
        paddingHorizontal: 10,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between"
    },
    lowerWhiteView: {
        height: "75%",
        width: "100%",
        backgroundColor: Colors.white,
        paddingHorizontal: 10,
        borderBottomEndRadius: 12,
        borderBottomStartRadius: 12,
        justifyContent: "space-evenly"
    },
    title: {
        // padding: 16,
        fontSize: getProportionalFontSize(16),
        fontFamily: Assets.fonts.semiBold,
        color: Colors.white,
    },
    cardContainer: {
        height: 220,
        width: "100%",
        backgroundColor: Colors.white,
        // padding: 15,
        marginTop: Constants.formFieldTopMargin,
        // marginRight: 30,
        // shadow
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 15,
        elevation: 15,
        shadowColor: Colors.primary,
        shadowRadius: 6,
        borderRadius: getProportionalFontSize(10),
        // borderColor: Colors.borderColor

    },
    headerTitile: {
        fontSize: getProportionalFontSize(14),
        fontFamily: Assets.fonts.bold,
        color: Colors.primary,
        width: "70%"
    },
    subheaderTitle: {
        fontFamily: Assets.fonts.bold,
        color: Colors.black, marginTop: 5, fontSize: getProportionalFontSize(14)
    },
    subheaderValue: {
        fontSize: getProportionalFontSize(13),
        fontFamily: Assets.fonts.semiBold,
        color: Colors.darkGray,
    },
    nextButton: {
        justifyContent: 'center',
        alignItems: 'center',
        width: '50%',
        height: 40,
        borderRadius: 5,
        backgroundColor: Colors.secondary,
        marginTop: Constants.formFieldTopMargin,
    },
    patientView: {
        flexDirection: "row",
        paddingVertical: getProportionalFontSize(10),
        paddingHorizontal: getProportionalFontSize(20),
        width: "100%",
        backgroundColor: Colors.primary,
        marginTop: -35,
        marginLeft: -25,
        borderRadius: 5,
        borderTopRightRadius: 40,
        justifyContent: "space-between",
        alignItems: "center"
    },
    titleAndIconView: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: Constants.globalPaddingHorizontal, marginVertical: Constants.formFieldTopMargin }
})
