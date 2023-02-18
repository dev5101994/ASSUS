import React, { useCallback } from 'react'
import { StyleSheet, Text, View, ScrollView, FlatList, Image, RefreshControl, TouchableOpacity, Dimensions, ImageBackground } from 'react-native'
import EmptyList from '../Components/EmptyList';
import Colors from '../Constants/Colors';
import { getProportionalFontSize, CurruntDate } from '../Services/CommonMethods';
import { useSelector, useDispatch } from 'react-redux';
import { Data } from '../Constants/TempData';
import { ListingView } from '../Components/ListingView';
import Timeline from 'react-native-timeline-flatlist';
import Constants from '../Constants/Constants';
import APIService from '../Services/APIService';
import FooterCompForFlatlist from '../Components/FooterCompForFlatlist';
import Can from '../can/Can';
// import Timeline from 'react-native-timeline-flatlist';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Icon from 'react-native-vector-icons/Ionicons';
import Foundation from 'react-native-vector-icons/Foundation';
import { Divider, FAB, Portal, Modal } from 'react-native-paper';
import moment from 'moment';
import Assets from '../Assets/Assets';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import CustomButton from '../Components/CustomButton';
import Alert from '../Components/Alert';
import Feather from 'react-native-vector-icons/Feather';

import LottieView from 'lottie-react-native';

import FilterModalDeviationComp from '../Components/FilterModalDeviationComp';
import ListLoader from '../Components/ListLoader';
import { Item } from 'react-native-paper/lib/typescript/components/List/List';
import DeviationListingCard from '../Components/DeviationListingCard';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

// import Alert from './Alert';
// const Data = [];


const DeviationListing = (props) => {
    const initialValuesForModelForm = {
        // "deviation_ids": [1,2],
        "is_signed": false,
        "is_completed": false
    }
    // React-Hooks
    const [openCardOptions, setOpenCardOptions] = React.useState()
    const [isLoading, setIsLoading] = React.useState(true);
    const [isRefreshing, setisRefreshing] = React.useState(false);
    const [paginationLoading, setPaginationLoading] = React.useState(false);
    const [btnLoader, setBtnLoader] = React.useState(false);
    const [page, setPage] = React.useState(0);
    const [deviationList, setDeviationList] = React.useState([]);
    const [isModalVisible, setIsModalVisible] = React.useState(false);
    const [valuesForModelForm, setValuesForModelForm] = React.useState({ ...initialValuesForModelForm })
    const [param, setParam] = React.useState({
        "is_completed": null,
        "is_signed": null,
        "is_secret": null,
        "with_or_without_activity": null,
        "from_date": CurruntDate(),
        "end_date": null,
        "refreshAPI": false
    });
    // console.log("params are--------", param)
    const [currentItem, setCurrentItem] = React.useState({});
    const [view, setView] = React.useState("");
    // console.log("all currentItem list here............", currentItem)
    // REDUX hooks
    const dispatch = useDispatch();
    const isInternetActive = useSelector(state => state.IsInternetActive);
    // const UserLogin = useSelector(state => state.UserLogin);
    const UserLogin = useSelector(state => state.User.UserLogin);
    const labels = useSelector(state => state.Labels);
    const permissions = UserLogin?.permissions ?? {};
    const messages = useSelector(state => state.Labels.messages);

    // Fab group 
    const [state, setState] = React.useState({ open: false });
    const onStateChange = ({ open }) => setState({ open });
    const { open } = state;
    const [FabAction, setFabAction] = React.useState([])

    const setFabButtons = () => {
        let temp = []
        if (Can(Constants.permissionsKey.deviationStatsView, permissions)) {
            temp.push(
                {
                    icon: 'chart-bar',
                    small: false,
                    label: labels?.['deviation-stats'] ?? 'Deviation Stats',
                    onPress: () => { props.navigation.navigate("DeviationStats") }
                }
            )
        }
        if (Can(Constants.permissionsKey.deviationAdd, permissions)) {
            temp.push(
                {
                    icon: 'plus',
                    small: false,
                    label: labels?.['create-new'] ?? 'Add Deviation',
                    onPress: () => { props.navigation.navigate("AddDeviation") }
                }
            )
        }
        setFabAction(temp)
    }
    const isUserHasModule = () => {
        let temp = UserLogin.assigned_module
        let isUserHasModule = temp.find((obj) => {
            return obj.module.name == Constants.allModules["Deviation"]
        })
        if (isUserHasModule)
            return true
        else
            return false
    }

    // useEffect hooks
    React.useEffect(() => {
        let status = "";
        deviationListingAPI(null, null, status)
        setFabButtons()
    }, [])

    React.useEffect(() => {
        const unsubscribe = props.navigation.addListener('focus', () => {
            // The screen is focused
            // Call any action
            // console.log('Focus___________________________________________')
            deviationListingAPI(null, true);
        });

        // Return the function to unsubscribe from the event so it gets removed on unmount
        return unsubscribe;
    }, [props.navigation]);

    // API methods
    const deviationListingAPI = async (page, refresh, status) => {
        if (refresh)
            setisRefreshing(true)
        else if (!page)
            setIsLoading(true);
        else
            setPaginationLoading(true)
        let params = {
            "perPage": Constants.perPage,
            "page": page ?? 1,
            // "user_type_id": null,
            // "with_or_without_activity": null,
            // "activity_id": null,
            // "branch_id": null,
            // "patient_id": null,
            // "emp_id": null,
            // "category_id": null,
            // "subcategory_id": null,
            // "from_date": null,
            // "end_date": null,
            // "critical_range": null,
            // "is_secret": null,
            // "is_signed": null,
            // "is_completed": null

            //****from new collection */
            // "is_completed": null,
            // "is_signed": null,
            // "is_secret": null,
            // "with_or_without_activity": null,
            // "from_date": CurruntDate(),
            // "end_date": null,
            ...param

        }
        let url = Constants.apiEndPoints.deviation_listing;
        // console.log("url", url);
        // console.log("params", params);

        let response = await APIService.postData(url, params, UserLogin.access_token, null, "deviationListingAPI");
        // console.log("response issssssss", JSON.stringify(response))
        // return
        setIsLoading(false)
        if (!response.errorMsg) {
            // console.log('response-------------------+++++++++++++', JSON.stringify(response))
            if (!page) {
                // console.log('response- from -------!page-----------+++++++++++++', JSON.stringify(response?.data?.payload?.data))
                setPage(1);
                setDeviationList(response?.data?.payload?.data ?? []);
                setIsLoading(false);
                if (refresh)
                    setisRefreshing(false);
            }
            else {
                let tempDeviationList = [...deviationList];
                tempDeviationList = tempDeviationList.concat(response?.data?.payload?.data);
                setPage(page);
                setDeviationList([...tempDeviationList]);
                setPaginationLoading(false);
            }
        }
        else {
            if (!page)
                setIsLoading(false);
            else
                setPaginationLoading(false)
            if (refresh)
                setisRefreshing(false);
            Alert.showAlert(Constants.danger, response.errorMsg)
        }

    }
    if (param.refreshAPI) {
        // console.log("param===============================", param)
        setParam({ ...param, refreshAPI: false })
        deviationListingAPI()
    }

    const openModel = (data) => {
        setView(data)
        // console.log("rowData", rowData)
        setIsModalVisible(true);
        // settempdata(rowData)
        // console.error("isModalVisible", isModalVisible)
    }
    const onRequestFilterClose = () => {
        // console.log('onRequestFilterClose called')
        // setCategoryItem(null);
        setIsModalVisible(false);
    }

    const markAction = async (is_signed, is_completed) => {
        setBtnLoader(true)
        let params = {
            "deviation_ids": [currentItem.id],
            "is_signed": is_signed,
            "is_completed": is_completed,
        }
        let url = Constants.apiEndPoints.action_deviation;
        // console.log("url", url);
        // console.log("params", params);
        // return
        let response = await APIService.postData(url, params, UserLogin.access_token, null, "action_on_deviation_API");

        setIsLoading(false)
        if (!response.errorMsg) {
            Alert.showAlert(Constants.success, "success", () => deviationListingAPI(null, true))
            onRequestClose()
            setBtnLoader(false)
        }
        else {
            setBtnLoader(false)
            setIsLoading(false);
            Alert.showAlert(Constants.danger, response.errorMsg, onRequestClose)
        }

    }
    const deleteDeviation = async (id, index) => {
        let url = Constants.apiEndPoints.deviation + "/" + id;
        // console.log("url", url);
        setisRefreshing(true)
        let response = await APIService.deleteData(url, UserLogin.access_token, null, "deviation_API");

        setisRefreshing(false)
        if (!response.errorMsg) {
            let tempDeviationList = [...deviationList];
            tempDeviationList.splice(index, 1)
            setDeviationList(tempDeviationList);
            setisRefreshing(false);
        }
        else {
            setisRefreshing(false);
            Alert.showAlert(Constants.danger, response.errorMsg)
        }

    }


    // const renderDeviationCard = useCallback(({ item }) => {
    //     return (

    //         <DeviationListingCard >
    //             {/* {item}, {index}, {cardID} */}

    //         </DeviationListingCard>

    //     )
    // }, [])

    const renderDeviationCard = ({ item, index }) => {
        // console.log("-------so late--------", item)
        return (
            <TouchableOpacity
                activeOpacity={0.8}
                onPress={Can(Constants.permissionsKey.journalRead, permissions)
                    ? () => { props.navigation.navigate("DeviationDetails", { itemId: item.id, url: Constants.apiEndPoints.deviation, user_type_id: item.user_type_id }) } : () => Alert.showToast(labels.permission_required_for_this_action)

                }
                style={{
                    ...styles.cardContainer,
                    //  backgroundColor: item?.status == 3 ? Colors.lightGray : item?.status == 0 ? Colors.white : Colors.ultraLightProPrimary,
                    backgroundColor: Colors.white,

                    shadowColor: item.is_completed == "1" ? Colors.green : Colors.primary
                }}

            >
                {/* patient View or floating view */}
                {/* <View
                    style={{
                        ...styles.patientView,
                        backgroundColor: item.is_completed == "1" ? Colors.green : Colors.primary
                    }}> */}

                <View style={{ ...styles.leftView, backgroundColor: item.is_completed == "1" ? Colors.green : Colors.primary }}>
                    {/* profile image */}
                    <Image style={styles.profileImage}
                        source={{ uri: "https://cdn.pixabay.com/photo/2020/07/14/13/07/icon-5404125_1280.png" }}
                    />
                </View>

                <View style={{ paddingVertical: 10, }} >
                    <View style={{ flexDirection: "row", left: 8 }}>
                        {/* <Icon name='person-outline' size={20} color={Colors.white} /> */}
                        <Text style={{ ...styles.rowTitle, color: item.is_completed == "1" ? Colors.green : Colors.primary }}> {item?.patient?.name} </Text>

                        <View style={{ flexDirection: "row" }}>
                            {
                                item?.activity_id
                                    ? <MaterialIcons
                                        name='timeline' size={20} color={Colors.white}
                                        onPress={() => {
                                            props.navigation.navigate('ActivityStack', {
                                                screen: 'ActivityDetails',
                                                params: { itemId: item.activity_id },
                                            })
                                        }} /> : null
                            }
                            {
                                item?.is_secret ? <Foundation name='shield' color={Colors.red} size={21} style={{ paddingLeft: 20 }} /> : null
                            }

                        </View>
                    </View>
                    {/* </View> */}
                    <View style={{ flexDirection: 'row', justifyContent: "space-between", paddingHorizontal: 10, }}>
                        {/* branch and actegory subcategory */}
                        <View style={{ marginBottom: 0, width: '72%', justifyContent: "center" }}>
                            {item?.branch?.name ? <Text numberOfLines={1} style={[styles.rowTitle, { color: Colors.black }]}>{item?.branch?.name}</Text> : null}
                            {(item?.category?.name || item?.subcategory?.name) ? <Text style={[styles.normalText, { color: Colors.gray }]}>
                                {item?.category?.name ?? ''}/{item?.subcategory?.name ?? ''}
                            </Text> : null}

                        </View>

                    </View>
                    {/* horizontal Divider */}
                    {/* <Divider style={{ height: 1, marginTop: 5, paddingHorizontal: 5 }} /> */}
                    <View style={styles.descriptionContainer}>
                        {/*start date && Description */}
                        <View style={{ marginLeft: 0, width: "100%", borderWidth: 0, marginTop: 10, flexWrap: "nowrap" }}>
                            <View style={{ flexDirection: "row", right: 10 }}>

                                {item.date_time ? <Text style={{ ...styles.rowTitle, color: item.is_completed == "1" ? Colors.green : Colors.primary }} >{labels["date"]}: {moment(item?.date_time).format("DD MMM YY")}</Text> : null}
                                <View style={{ flexDirection: "row", left: 50 }}>
                                    {/* edit icon */}
                                    {
                                        Can(Constants.permissionsKey.journalEdit, permissions)
                                            ?
                                            // <Icon
                                            //     style={{ marginRight: 10 }}
                                            //     name="md-pencil"
                                            //     color={Colors.black}
                                            //     size={20}
                                            <View style={{}}>

                                                <Feather name="edit" color={Colors.white} size={16} style={{ ...styles.IconVieww, backgroundColor: item.is_completed == "1" ? Colors.green : Colors.primary }}
                                                    onPress={() => props.navigation.navigate('AddDeviation', { itemId: item.id })}
                                                />
                                            </View>
                                            : null
                                    }
                                    {/* delete icon */}
                                    {
                                        Can(Constants.permissionsKey.journalDelete, permissions)
                                            ?
                                            <View style={{}}>
                                                <FontAwesome name="trash-o" color={Colors.white} size={17} style={{ ...styles.IconView, backgroundColor: item.is_completed == "1" ? Colors.green : Colors.primary }}
                                                    onPress={() => Alert.showDoubleAlert(Constants.warning, labels?.message_delete_confirmation, () => {
                                                        deleteDeviation(item.id, index);
                                                    })}
                                                />
                                            </View>
                                            : null
                                    }

                                </View>
                            </View>

                            <Text numberOfLines={2} style={[styles.textDescriptionStyle]}>
                                {item?.description ?? ""}
                            </Text>
                            {/* {item?.description ? <Divider style={{ height: 1, marginTop: 5 }} /> : null} */}
                            <Text numberOfLines={2} style={[styles.textDescriptionStyle]}>
                                {item?.immediate_action ?? ""}
                            </Text>
                        </View >
                    </View>
                    {/* devider */}
                    {/* <Divider style={{ height: 1, marginTop: 5, paddingHorizontal: 15 }} /> */}
                    <Divider style={{ height: 1, marginHorizontal: 10, width: "70%" }} />
                    <View style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        paddingTop: 10,
                        paddingHorizontal: 15,
                        width: "75%",
                        top: 5
                        // alignItems: "center",
                        // backgroundColor: "red"
                        // borderWidth: 2
                    }}>
                        {/* complete date */}
                        {item.completed_date
                            ? <View style={{
                                backgroundColor: item.is_completed == "1" ? Colors.green : Colors.primary,
                                borderRadius: 20,
                                paddingHorizontal: 10,
                                paddingVertical: 5,
                                justifyContent: "center",
                                bottom: 5

                            }}>
                                <Text style={{
                                    fontSize: getProportionalFontSize(10),
                                    fontFamily: Assets.fonts.medium,
                                    color: Colors.white,
                                }}>{item?.completed_date ?? ""} , {item?.completed_by?.name ?? ""}</Text>

                            </View>
                            : <View style={{ width: "100%", }} ></View>}
                        <View style={{ flexDirection: "row", bottom: 10, }}>
                            {
                                item.is_signed == 1 || item.is_completed == 1
                                    ?
                                    <Icon name='at' color={item.is_completed == "1" ? Colors.green : Colors.primary} size={25} style={{ top: 5 }} onPress={() => Alert.showToast("Deviation is completed", Constants.success)}
                                    />
                                    : null
                            }
                            {
                                item.is_completed != 1
                                    ? <TouchableOpacity
                                        onPress={() => {
                                            setCurrentItem(item)
                                            // setIsModalVisible(true)
                                            openModel("action")
                                        }}
                                    >
                                        <Icon name='checkmark-done-circle' color={item.is_completed == "1" ? Colors.green : Colors.primary} size={25} style={{ right: -15, top: 5 }} />
                                    </TouchableOpacity>
                                    : null
                            }
                        </View>
                    </View>
                </View>
            </TouchableOpacity>

        )
    }








    const onRequestClose = () => {
        // console.log('onRequestClose called')
        setValuesForModelForm({ ...initialValuesForModelForm })
        setIsModalVisible(false);
    }


    // // Render view
    // if (isLoading)
    //     return <ProgressLoader />


    return (
        <BaseContainer
            onPressLeftIcon={() => { props.navigation.pop() }}
            leftIcon="arrow-back"
            leftIconSize={24}
            title={labels["deviation-menu"]}
            leftIconColor={Colors.primary}
            rightIcon={isUserHasModule() ? "filter-list" : null}
            onPressRightIcon={() => openModel("filter")}
            rightIconColor={Colors.primary}
        >
            {
                isLoading
                    ? <ListLoader />
                    : isUserHasModule()
                        ? (
                            <>
                                {/* <ImageBackground source={Assets.images.backGroundImage} style={{ flex: 1 }}> */}


                                <View >
                                    {/* <Text style={{ ...styles.title, padding: 5, paddingLeft: 150, }}>
                                            {param.from_date === CurruntDate() ? CurruntDate() : labels["all-data"]}
                                        </Text> */}
                                </View>


                                <View style={styles.container}>

                                    {
                                        deviationList.length > 0
                                            ?
                                            // <Timeline
                                            //     data={deviationList}
                                            //     circleSize={getProportionalFontSize(15)}
                                            //     circleColor={Colors.primary}
                                            //     lineColor={Colors.primary}
                                            //     listViewStyle={{ borderWidth: 2, }}
                                            //     showTime={false}
                                            //     descriptionStyle={{ color: Colors.lightGray }}
                                            //     options={{
                                            //         showsVerticalScrollIndicator: false,
                                            //         style: {},
                                            //         contentContainerStyle: {
                                            //             // borderWidth: 1,
                                            //             // borderColor: "red",
                                            //         },
                                            //         refreshControl: (
                                            //             <RefreshControl
                                            //                 refreshing={isRefreshing}
                                            //                 onRefresh={() => deviationListingAPI(null, true)}
                                            //             />
                                            //         ),
                                            //         ListFooterComponent: () => <FooterCompForFlatlist paginationLoading={props.paginationLoading} />,
                                            //         onEndReached: () => deviationListingAPI(page + 1),
                                            //         onEndReachedThreshold: 0.3
                                            //     }}
                                            //     innerCircle={'dot'}
                                            //     renderDetail={renderDeviationCard}
                                            //     style={{ paddingTop: 0, paddingRight: 0, paddingBottom: 100, }}
                                            // />

                                            <FlatList

                                                // data={[1]}
                                                data={deviationList}
                                                renderDetail={renderDeviationCard}
                                                showTime={false}
                                                renderItem={renderDeviationCard}
                                                contentContainerStyle={{ borderWidth: 0, paddingVertical: Constants.globalPaddingVetical, paddingHorizontal: Constants.globalPaddingHorizontal }}
                                                keyExtractor={item => item.id}
                                                style={{
                                                    marginBottom: 140
                                                }}
                                            />
                                            : <EmptyList />

                                    }
                                    {/* MODAL */}
                                    {view == "action"
                                        ? <Portal>
                                            <Modal
                                                animationType="slide"
                                                transparent={true}
                                                style={{ justifyContent: "center", alignItems: 'center' }}
                                                visible={isModalVisible}
                                                onRequestClose={onRequestClose}
                                            >
                                                {/* popup view */}
                                                <View style={styles.modalMainView}>
                                                    <View style={styles.innerViewforModel}>
                                                        <View style={{
                                                            width: "100%",
                                                            justifyContent: "center",
                                                            alignItems: "center",
                                                            // marginTop: -10
                                                        }}>
                                                            {/* close icon */}
                                                            {/* <Icon name='close-circle' color={Colors.primary} size={30} onPress={onRequestClose} style={{ width: "100%" }} />
                    <View style={{ width: "100%" }}>
                        <Text style={styles.rowTitle}>
                            {labels.action}
                        </Text>
                    </View>
                    <Divider style={{ height: 1, marginVertical: 5, backgroundColor: Colors.black, color: Colors.black, }} /> */}
                                                            {
                                                                currentItem.is_signed == 0 || !currentItem.is_signed
                                                                    ? <View style={styles.checkBoxView} >
                                                                        <View style={{ width: "100%", justifyContent: "center", alignItems: "center" }}>
                                                                            <LottieView
                                                                                source={require('../Assets/images/i.json')}
                                                                                autoPlay
                                                                                loop={true}
                                                                                style={{
                                                                                    width: "20%",
                                                                                }}
                                                                            />
                                                                        </View>
                                                                        <Text style={{ ...styles.checkBoxTitle, }}>{labels["want-to-create-sign-deviation"]}</Text>
                                                                        <Text style={{ ...styles.checkBoxText, marginBottom: 10 }}>{labels["you-wont-be-able-to-revert-this"]}</Text>
                                                                    </View>
                                                                    : <View style={styles.checkBoxView} >
                                                                        <View style={{ width: "100%", justifyContent: "center", alignItems: "center" }}>
                                                                            <LottieView
                                                                                source={require('../Assets/images/i.json')}
                                                                                autoPlay
                                                                                loop={true}
                                                                                style={{
                                                                                    width: "20%",
                                                                                }}
                                                                            />
                                                                        </View>

                                                                        <Text style={{ ...styles.checkBoxTitle, }}>{labels["want-to-create-complete-deviation"]}</Text>
                                                                        <Text style={{ ...styles.checkBoxText, marginBottom: 10 }}>{labels["you-wont-be-able-to-revert-this"]}</Text>
                                                                    </View>
                                                            }


                                                            <View style={{ flexDirection: "row", width: '100%', justifyContent: "flex-end" }}>
                                                                <CustomButton
                                                                    style={{ ...styles.nextButton, backgroundColor: Colors.white, }}
                                                                    titleStyle={{ color: Colors.primary, fontFamily: Assets.fonts.medium, }}
                                                                    onPress={() => { onRequestClose() }} title={labels["no"]} />

                                                                <CustomButton
                                                                    isLoading={btnLoader}
                                                                    style={{ ...styles.nextButton, backgroundColor: Colors.primary, marginLeft: 10, }}
                                                                    titleStyle={{ fontFamily: Assets.fonts.medium, }}
                                                                    onPress={() => {
                                                                        currentItem.is_signed == 0 || !currentItem.is_signed
                                                                            ? markAction("1", "0")
                                                                            : markAction("1", "0")

                                                                    }} title={labels["yes"]} />
                                                            </View>
                                                        </View>

                                                    </View>
                                                </View>


                                            </Modal>
                                        </Portal>
                                        : <Portal>
                                            <Modal
                                                animationType="slide"
                                                transparent={true}
                                                style={{ justifyContent: "center", alignItems: 'center' }}
                                                visible={isModalVisible}
                                                onRequestClose={onRequestFilterClose}
                                            >
                                                <FilterModalDeviationComp
                                                    labels={labels}
                                                    onRequestClose={onRequestFilterClose}
                                                    UserLogin={UserLogin}
                                                    setParam={setParam}
                                                    param={param}
                                                />
                                            </Modal>
                                        </Portal>

                                    }

                                </View>
                                <FAB.Group
                                    fabStyle={{ backgroundColor: Colors.primary }}
                                    open={open}
                                    icon={open ? 'close' : 'plus'}
                                    color={Colors.white}
                                    actions={FabAction}
                                    onStateChange={onStateChange}
                                    onPress={() => {
                                        if (open) {
                                            // do something if the speed dial is open
                                        }
                                    }}
                                />
                                {/* </ImageBackground> */}
                            </>
                        )
                        : <EmptyList navigation={props.navigation} noModuleMsg={true} />
            }
        </BaseContainer>
    )
}

export default DeviationListing;

const styles = StyleSheet.create({
    fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        backgroundColor: Colors.primary,
        bottom: 0,
    },

    //new data
    container: {
        flex: 1,
        // marginLeft: 10
        // borderWidth: 2,
        // borderColor: "red",
        minHeight: Dimensions.get("window").height - 5,
        paddingTop: 20


    },
    startTimeContainer: {
        flexDirection: "row",
        marginBottom: 10
    },
    startTimeText: {
        // padding: 16,
        fontSize: getProportionalFontSize(15),
        fontFamily: Assets.fonts.semiBold,
        marginRight: 10,
        color: Colors.black
    },
    title: {
        padding: 16,
        fontSize: getProportionalFontSize(16),
        fontFamily: Assets.fonts.semiBold,
        color: Colors.white, paddingLeft: 35
    },
    cardContainer: {
        // 
        flex: 1,
        backgroundColor: "#fff",
        marginTop: 10,
        marginBottom: 10,
        flexDirection: "row",
        minheight: 205,

        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 15,
        elevation: 15,
        shadowColor: Platform.OS == 'ios' ? Colors.shadowColorIosDefault : Colors.primary,
        shadowRadius: 10,
        borderRadius: getProportionalFontSize(10),
        // marginTop: 20,
        // borderWidth: 1,
        // borderColor: Colors.borderColor
    },
    patientView: {
        flexDirection: "row",
        paddingVertical: getProportionalFontSize(10),
        paddingHorizontal: getProportionalFontSize(20),
        width: "100%",
        backgroundColor: Colors.primary,
        marginTop: -35,
        marginLeft: -10,
        borderRadius: 5,
        borderTopRightRadius: 40,
        justifyContent: "space-between",
        // height: 20,

    },
    rowTitle: {
        fontSize: getProportionalFontSize(14),
        fontFamily: Assets.fonts.regular,
        color: Colors.primary,
        textTransform: 'capitalize',
        left: 0
    },
    descriptionContainer: {
        flexDirection: 'column',
        //paddingRight: 10,
        width: "100%",
        paddingHorizontal: 15,
        left: 5
    },
    imageStyle: {
        width: getProportionalFontSize(45),
        height: getProportionalFontSize(45),
        borderRadius: getProportionalFontSize(45),
        padding: 5,

    },
    textDescriptionStyle: {
        //minWidth: getProportionalFontSize(275),
        color: Colors.gray,
        fontFamily: Assets.fonts.regular,
        fontSize: getProportionalFontSize(11),
        textAlign: "justify",
        marginTop: 5

    },
    linkIcon: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.primary,
    },
    normalText: {
        fontFamily: Assets.fonts.regular,
        fontSize: getProportionalFontSize(11),
        color: Colors.black
    },
    actionButtons: {
        backgroundColor: Colors.lightGray,
        color: Colors.white,
        paddingVertical: 2,
        paddingHorizontal: 4,
        fontSize: 13,
        marginRight: 5,
        borderRadius: 2,
        marginBottom: 5,
        fontFamily: Assets.fonts.bold,
    },
    commentStyle: {
        zIndex: 1000,
        borderLeftWidth: 3,
        borderLeftColor: Colors.lightGray,
        backgroundColor: "#0001",
        paddingHorizontal: 15,
        marginBottom: 5,
    },
    commentView: {
        flexDirection: "row",
        borderRadius: 20,
        backgroundColor: "#E4FFF0",
        paddingHorizontal: 9,
        paddingVertical: 5,
        alignItems: "center"
    }
    ,
    doneButton: {
        width: 50,
        height: 50,
        backgroundColor: Colors.primary,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 50
    },
    loaderStyle: {
        position: 'relative',
        width: '80%',
        backgroundColor: "transparent"
    },
    dividerContainer: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 5
    },
    bottomIconContainer: {
        width: '100%',
        height: 40,
        flexDirection: 'row',
        alignItems: "center",
        justifyContent: 'space-between'
    },

    modalMainView: { backgroundColor: 'transparent', justifyContent: "center", alignItems: "center", paddingHorizontal: 16 },
    innerViewforModel: {
        width: Dimensions.get("window").width * 0.9, minHeight: 150, backgroundColor: Colors.backgroundColor, paddingVertical: Constants.globalPaddingHorizontal, paddingHorizontal: Constants.globalPaddingHorizontal, borderRadius: 20,
    },
    checkBoxView: { alignItems: "center", width: "100%" },
    checkBoxText: { fontSize: getProportionalFontSize(13), fontFamily: Assets.fonts.regular },
    nextButton: {
        justifyContent: 'center',
        alignItems: 'center',
        width: "35%",
        paddingHorizontal: 16,
        backgroundColor: Colors.primary,
        marginVertical: 16,
        marginVertical: 0, marginTop: Constants.formFieldTopMargin,
        borderColor: Colors.primary,
        borderWidth: 2,
        minHeight: 30
    },
    checkBoxTitle: {
        fontSize: getProportionalFontSize(15),
        fontFamily: Assets.fonts.semiBold,
        color: Colors.primary
    },
    IconVieww: {
        // position: "absolute",
        // top: 5,
        // right: 10,
        // zIndex: 100,
        justifyContent: "center",
        backgroundColor: Colors.primary,
        paddingHorizontal: 6,
        paddingVertical: 6,
        borderRadius: 25,
        left: 30



    },
    IconView: {
        // position: "absolute",
        // top: 5,
        // right: 20,
        // zIndex: 100,
        // justifyContent: "center"
        justifyContent: "center",
        backgroundColor: Colors.primary,
        paddingHorizontal: 8,
        paddingVertical: 6,
        borderRadius: 20,
        left: 40
    },
    leftView: {
        // borderTopLeftRadius: 15,
        // borderBottomLeftRadius: 15,
        // top: -9,
        width: "25%",
        minHeight: 205,
        // position: 'absolute',
        //height: 205,
        // backgroundColor: Colors.primary,
        // justifyContent: "space-evenly",
        alignItems: "center",
        //bottom: 15,
        borderTopLeftRadius: 10,
        borderBottomLeftRadius: 10,
        // marginVertical: 20


    },
    profileImage: {
        height: 80,
        width: 80,
        zIndex: 100,
        borderRadius: 30,
        top: 50
    },
})
