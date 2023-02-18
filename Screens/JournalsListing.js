import React, { useState } from 'react'
import { StyleSheet, Text, View, ScrollView, FlatList, TouchableOpacity, RefreshControl, ImageBackground } from 'react-native'
import { FAB } from 'react-native-paper';
import EmptyList from '../Components/EmptyList';
import Colors from '../Constants/Colors';
import { CurruntDate, formatDate, formatTime, getActionSheetAPIDetail, getProportionalFontSize } from '../Services/CommonMethods';
import { useSelector, useDispatch } from 'react-redux';

import { Data } from '../Constants/TempData';
import { ListingView } from '../Components/ListingView';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import FoundationIcon from 'react-native-vector-icons/Foundation';
import EntypoIcon from 'react-native-vector-icons/Entypo';

import Constants from '../Constants/Constants';
import Timeline from 'react-native-timeline-flatlist';
import ProgressLoader from '../Components/ProgressLoader';
import AntDesign from 'react-native-vector-icons/AntDesign';
import APIService from '../Services/APIService';
import Alert from '../Components/Alert';
import { Modal, Portal, } from 'react-native-paper';
import JournalActionModal from '../Components/JournalActionModal';
import Assets from '../Assets/Assets';
import ActionSheet from 'react-native-actions-sheet';
import ActionSheetComp from '../Components/ActionSheetComp';
import CustomButton from '../Components/CustomButton';
import JournalFilter from '../Components/JournalFilter';
import FooterCompForFlatlist from '../Components/FooterCompForFlatlist';
import PrintJournalModal from '../Components/PrintJournalModal';
import ListLoader from '../Components/ListLoader';
import Can from '../can/Can';

//const Data = [];


const JournalsListing = (props) => {
    // REDUX hooks
    const dispatch = useDispatch();
    const labels = useSelector(state => state.Labels);
    const UserLogin = useSelector(state => state.User.UserLogin);
    const permissions = UserLogin?.permissions ?? {}

    const [journalList, setJournalList] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [patient, setPatient] = useState(null);
    const [page, setPage] = useState(0);
    const [paginationLoading, setPaginationLoading] = useState(false);
    const [isModalVisible, setIsModalVisible] = React.useState(false);
    const [isFilterModalVisible, setIsFilterModalVisible] = React.useState(false);
    const [isPrintJournalModalVisible, setIsPrintJournalModalVisible] = React.useState(false);
    const [actionSheetDecide, setActionSheetDecide] = useState('');
    const [journalObj, setJournalObj] = React.useState(null);
    const [patientAS, setPatientAS] = React.useState(getActionSheetAPIDetail({
        url: Constants.apiEndPoints.userList, params: { user_type_id: '6' }, debugMsg: "patient-list", token: UserLogin.access_token, perPage: Constants.perPage,
        selectedData: []
    }));

    // Hooks
    const actionSheetRef = React.useRef();

    // Fab group 
    const [state, setState] = React.useState({ open: false });
    const onStateChange = ({ open }) => setState({ open });
    const { open } = state;
    const [FabAction, setFabAction] = React.useState([])

    const setFabButtons = () => {
        let temp = []
        if (Can(Constants?.permissionsKey?.journalStatsView, permissions)) {
            temp.push(
                {
                    icon: 'chart-bar',
                    small: false,
                    label: labels?.['journal-stats'] ?? 'Deviation Stats',
                    onPress: () => { props.navigation.navigate("JournalsStats") }
                }
            )
        }
        // if (Can(Constants?.permissionsKey?.journalAdd, permissions)) {
        //     temp.push(
        //         {
        //             icon: 'plus',
        //             small: false,
        //             label: labels?.['create-new'] ?? 'Add Deviation',
        //             onPress: () => { props.navigation.navigate("AddJournal") }
        //         }
        //     )
        // }
        setFabAction(temp)
    }
    const isUserHasModule = () => {
        let temp = UserLogin.assigned_module
        let isUserHasModule = temp.find((obj) => {
            return obj.module.name == Constants.allModules["Journal"]
        })
        if (isUserHasModule)
            return true
        else
            return false
    }

    React.useEffect(() => {
        getJournalList(null, null, patient)
        setFabButtons();
    }, [])

    React.useEffect(() => {
        const unsubscribe = props.navigation.addListener('focus', () => {
            // The screen is focused
            // Call any action
            // console.log('Focus___________________________________________')
            getJournalList(null, true, patient);
        });
        // Return the function to unsubscribe from the event so it gets removed on unmount
        return unsubscribe;
    }, [props.navigation]);

    const getJournalList = async (page, refresh, patient, filterParams) => {
        if (!patient?.id && !filterParams?.patient_id) {
            // console.log('filterParams', filterParams)
            // console.log('patient', patient)
            return;
        }
        if (refresh)
            setIsRefreshing(true)
        else if (!page)
            setIsLoading(true);
        else
            setPaginationLoading(true)
        let params = {
            "perPage": Constants.perPage,
            "page": page ?? 1,
            "patient_id": patient?.id,
        }
        if (filterParams)
            params = { ...params, ...filterParams }

        let url = Constants.apiEndPoints.journal_list;
        let response = await APIService.postData(url, params, UserLogin.access_token, null, "JournalList");
        if (!response.errorMsg) {
            if (!page) {
                setJournalList(response.data.payload.data);
                if (filterParams?.patientObj?.id)
                    setPatient(filterParams?.patientObj)
                else if (filterParams) {
                    setPatient(null)
                    setPatientAS({ ...patientAS, selectedData: [] })
                }
                setIsLoading(false);
                if (refresh)
                    setIsRefreshing(false);
                setPage(1);
            }
            else {
                let tempJournalList = [...journalList];
                tempJournalList = tempJournalList.concat(response.data.payload.data);
                setPage(page);
                setJournalList([...tempJournalList]);
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

    const closeActionSheet = () => {
        setActionSheetDecide('');
        setJournalObj(null);
        actionSheetRef?.current?.setModalVisible();
    };

    const journalActions = async (journalIdsArr, action, extra_params) => {
        setIsLoading(true);
        let url = Constants.apiEndPoints.actionJournal
        let params = {
            "journal_ids": journalIdsArr,
        }
        if (action == 'sign')
            params['is_signed'] = 1;
        else if (action == 'approve')
            params['is_approved'] = 1;
        else if (action == 'active') {
            params['journal_id'] = journalIdsArr[0];
            delete params.journal_ids
            url = Constants.apiEndPoints.isActiveJournal;
            params = { ...params, ...extra_params };
        }

        let response = await APIService.postData(url, params, UserLogin.access_token, null, "journalActions");

        if (!response.errorMsg) {
            Alert.showAlert(Constants.success, action == 'sign' ? labels.journal_sign_msg : action == 'approve' ? labels.journal_approve_msg
                : action == 'active' ? (params.is_active ? labels.journal_active_msg : labels.journal_inactive_msg) : '',
                () => { getJournalList(null, true, patient) })
            setIsLoading(false);
        }
        else {
            setIsLoading(false);
            Alert.showAlert(Constants.danger, response.errorMsg);
        }
    }

    const renderDetail = (item) => {
        return (

            <TouchableOpacity
                onPress={() => { props.navigation.navigate('JournalDetail', { itemID: item.id }) }}
                style={styles.cardContainer}
            >
                <View style={styles.patientView}>
                    <Text numberOfLines={2} style={{ ...styles.headerTitile, color: Colors.white }}>{item.category?.name} / {item.subcategory?.name}</Text>
                </View>

                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                    <Text style={{ ...styles.subheaderValue, width: "82%", marginTop: 5 }}>{labels["incident-date"]} {item.date ? formatDate(item.date) : ''} {item.time}</Text>
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                        {item.is_secret
                            ? <FoundationIcon
                                name="shield"
                                color={Colors.red}
                                size={getProportionalFontSize(26)}
                                style={{ marginEnd: 5 }}
                            /> : null}
                        {!item.is_signed
                            ? < Icon
                                name="create"
                                color={Colors.primary}
                                size={getProportionalFontSize(25)}
                                onPress={() => { props.navigation.navigate('AddJournal', { itemID: item.id }) }}
                            /> : null}
                    </View>

                </View>


                <Text style={styles.subheaderTitle}>{labels["description"]}</Text>
                <Text numberOfLines={3} style={styles.subheaderValue}>{item.description}</Text>

                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                    <Text numberOfLines={1} style={{ ...styles.subheaderTitle, width: "50%", fontFamily: Assets.fonts.semiBold, color: Colors.primary }}>{item?.employee?.name}</Text>
                    <Text numberOfLines={1} style={{ ...styles.subheaderValue, width: "50%", textAlign: "right" }}>{formatDate(item.created_at)} {formatTime(item.created_at)}</Text>
                </View>
                {
                    item.journal_actions?.length > 0
                        ? <>
                            <Text style={styles.subheaderTitle}>{labels["action"]}</Text>
                            <Text numberOfLines={3} style={styles.subheaderValue}>{item.journal_actions[0]?.comment_action}</Text>

                            <Text style={styles.subheaderTitle}>{labels["result"]}</Text>
                            <Text numberOfLines={3} style={styles.subheaderValue}>{item.journal_actions[0]?.comment_result}</Text>

                            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                                <Text numberOfLines={1} style={{ ...styles.subheaderTitle, width: "50%", fontFamily: Assets.fonts.semiBold, color: Colors.primary }}>{item?.employee?.name}</Text>
                                <Text numberOfLines={1} style={{ ...styles.subheaderValue, width: "50%", textAlign: "right" }}>{formatDate(item.journal_actions[0]?.created_at)} {formatTime(item.journal_actions[0]?.created_at)}</Text>
                            </View>
                        </>
                        : null
                }

                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 10 }}>
                    {item.is_signed
                        ? <Icon
                            name="arrow-up-circle"
                            color={Colors.gray}
                            size={getProportionalFontSize(25)}
                            onPress={() => { props.navigation.navigate('AddJournal', { itemID: item.id }) }}
                        />
                        : null}
                    <MaterialCommunityIcons
                        name="fountain-pen-tip"
                        color={item.is_signed ? 'green' : Colors.gray}
                        size={getProportionalFontSize(29)}
                        onPress={() => {
                            if (!item.is_signed)
                                Alert.showDoubleAlert(Constants.warning, labels.journal_sign_confirm_msg, () => { journalActions([item.id], 'sign') })
                            else
                                Alert.showToast(labels.already_signed)
                        }}
                    />

                    {item.is_signed
                        ? <Icon
                            name="checkbox"
                            color={item.is_active ? 'green' : Colors.gray}
                            size={getProportionalFontSize(22)}
                            onPress={() => {
                                Alert.showDoubleAlert(Constants.warning, item.is_active ? labels.inactive_msg : labels.journal_active_confirm_msg, () => { journalActions([item.id], 'active', { is_active: item.is_active ? 0 : 1 }) })
                            }}
                        /> : null}
                    <Icon
                        name="add-circle"
                        color={Colors.gray}
                        size={getProportionalFontSize(27)}
                        onPress={() => {
                            setJournalObj(item);
                            setIsModalVisible(true);
                        }}
                    />
                    {item.activity_id ? <Icon
                        name="analytics"
                        color={Colors.gray}
                        size={getProportionalFontSize(27)}
                        onPress={() => {
                            props.navigation.navigate("ActivityStack", { screen: "ActivityDetails", params: { itemId: item.activity_id } })
                        }}
                    /> : null}

                </View>
            </TouchableOpacity>
        )
    }

    const onRequestClose = () => {
        // console.log('onRequestClose called')
        setJournalObj(null);
        setIsModalVisible(false);
        setIsFilterModalVisible(false);
        setIsPrintJournalModalVisible(false);
    }

    const getAPIDetails = () => {
        switch (actionSheetDecide) {
            case 'patient': {
                return patientAS;
            }
            default: {
                return null;
            }
        }
    };

    const changeAPIDetails = payload => {
        switch (actionSheetDecide) {
            case 'patient': {
                setPatientAS(
                    getActionSheetAPIDetail({ ...patientAS, ...payload }),
                );
                break;
            }
            default: {
                break;
            }
        }
    };

    const onPressItem = item => {
        switch (actionSheetDecide) {
            case 'patient': {
                setPatient(item)
                getJournalList(null, null, item)
                break;
            }
            default: {
                break;
            }
        }
    };

    const emptyListComp = () => {
        return (
            <View style={{ justifyContent: "center", alignItems: "center", marginTop: 150 }}>
                {/* <Text style={{ ...styles.headerTitile, fontSize: getProportionalFontSize(17) }}>{labels["total-journal"]}</Text> */}
                {Can(Constants.permissionsKey.patientsBrowse, permissions)
                    ? <CustomButton
                        style={styles.nextButton}
                        titleStyle={{ color: Colors.white }}
                        onPress={() => {
                            setActionSheetDecide('patient');
                            actionSheetRef?.current?.setModalVisible();
                        }}
                        title={labels["please-select-patient"]}
                    />
                    : null
                }
            </View>
        )
    }

    // if (isLoading)
    //     return <ProgressLoader />

    // renderview
    return (
        <BaseContainer
            onPressLeftIcon={() => { props.navigation.pop() }}
            leftIcon="arrow-back"
            headerBar={{ backgroundColor: Colors.blueMagenta }}
            leftIconSize={24}
            title={labels["journal-menu"]}
            leftIconColor={Colors.primary}
            rightIcon={isUserHasModule() ? "filter-list" : null}
            onPressRightIcon={() => setIsFilterModalVisible(true)}
            rightIconColor={Colors.primary}
        >
            {
                isLoading
                    ? <ListLoader />
                    : isUserHasModule()
                        ? (
                            <>
                                <ImageBackground resizeMode="stretch" source={Assets.images.acttivityBG} style={{ flex: 1 }}>

                                    {Can(Constants?.permissionsKey?.journalAdd, permissions)
                                        ? <TouchableOpacity
                                            onPress={() => { props.navigation.navigate("AddJournal") }}
                                            style={styles.floatingPlusView}>
                                            <AntDesign
                                                name="plus"
                                                color={Colors.primary}
                                                style={{}}
                                                size={40}
                                            />
                                        </TouchableOpacity> : null}
                                    {/* MODAL */}
                                    <Portal>
                                        <Modal
                                            animationType="slide"
                                            transparent={true}
                                            style={isPrintJournalModalVisible ? {} : { justifyContent: "center", alignItems: 'center' }}
                                            visible={isModalVisible || isFilterModalVisible || isPrintJournalModalVisible}
                                            onRequestClose={onRequestClose}
                                            onDismiss={onRequestClose}
                                        >
                                            {
                                                isFilterModalVisible
                                                    ? <JournalFilter
                                                        onRequestClose={onRequestClose}
                                                        filterAPI={(filterParams) => { getJournalList(null, null, patient, filterParams) }} />
                                                    : isPrintJournalModalVisible
                                                        ?
                                                        <PrintJournalModal
                                                            patient={patient}
                                                            labels={labels}
                                                            onRequestClose={onRequestClose}
                                                        />
                                                        : Can(Constants?.permissionsKey?.journalAction, permissions)
                                                            ? <JournalActionModal
                                                                journal_action_index={0}
                                                                onRequestClose={onRequestClose}
                                                                labels={labels}
                                                                journal={journalObj}
                                                                refreshAPI={() => { getJournalList(null, true, patient) }}
                                                            /> : null
                                            }
                                        </Modal>
                                    </Portal>
                                    <View style={styles.titleAndIconView}>
                                        <Text style={styles.title}>
                                            {labels["today"]}:{' '} {CurruntDate()}
                                        </Text>
                                        <View style={{ flexDirection: "row", alignItems: "center", }}>
                                            {Can(Constants?.permissionsKey?.journalStatsView, permissions)
                                                ? <View style={[styles.whiteRBG, { marginEnd: 6 }]}>
                                                    <Icon
                                                        name="stats-chart"
                                                        color={Colors.blueMagenta}
                                                        size={getProportionalFontSize(22)}
                                                        onPress={() => {
                                                            props.navigation.navigate("JournalsStats")
                                                        }}
                                                    />
                                                </View> : null}

                                            <View style={[styles.whiteRBG, { marginEnd: 6 }]}>
                                                <Icon
                                                    name="print"
                                                    color={Colors.blueMagenta}
                                                    size={getProportionalFontSize(22)}
                                                    onPress={() => {
                                                        if (patient?.id) {
                                                            setIsPrintJournalModalVisible(true)
                                                        }
                                                        else
                                                            Alert.showAlert(Constants.warning, labels.select_patient_first)
                                                    }}
                                                />
                                            </View>

                                            {
                                                Can(Constants?.permissionsKey?.patientsBrowse, permissions)
                                                    ? <View style={styles.whiteRBG}>
                                                        <Icon
                                                            name="person"
                                                            color={Colors.blueMagenta}
                                                            size={getProportionalFontSize(22)}
                                                            onPress={() => {
                                                                setActionSheetDecide('patient');
                                                                actionSheetRef?.current?.setModalVisible();
                                                            }}
                                                        />
                                                    </View>
                                                    : null
                                            }
                                        </View>
                                    </View>

                                    {/* patient name */}
                                    <Text numberOfLines={2} style={{ ...styles.title, alignSelf: "center", width: "45%", textAlign: "center", fontFamily: Assets.fonts.bold, fontSize: getProportionalFontSize(18) }}>
                                        {patient?.name}
                                    </Text>
                                    <Timeline
                                        data={journalList}
                                        circleSize={getProportionalFontSize(15)}
                                        circleColor={Colors.primary}
                                        lineColor={Colors.primary}
                                        listViewStyle={{ borderWidth: 1 }}
                                        showTime={false}
                                        descriptionStyle={{ color: Colors.lightGray }}
                                        options={{
                                            showsVerticalScrollIndicator: false,
                                            style: { marginTop: Constants.formFieldTopMargin, },
                                            refreshControl: (
                                                <RefreshControl
                                                    refreshing={isRefreshing}
                                                    onRefresh={() => {
                                                        getJournalList(null, true, patient);
                                                    }}
                                                />
                                            ),
                                            ListEmptyComponent: emptyListComp(),
                                            contentContainerStyle: { paddingBottom: 50, paddingTop: "15%" },
                                            ListFooterComponent: () => <FooterCompForFlatlist paginationLoading={paginationLoading} />,
                                            onEndReachedThreshold: 0.3,
                                            onEndReached: () => { getJournalList(page + 1, null, patient) },
                                        }}
                                        innerCircle={'dot'}
                                        renderDetail={renderDetail}
                                        style={{ paddingTop: 0, paddingRight: 0, }}
                                    />

                                    {/* FLOATING ADD BUTTON */}
                                    {/* <FAB
                                    style={styles.fab}
                                    color={Colors.white}
                                    icon="plus"
                                    onPress={() => { props.navigation.navigate('AddJournal') }}
                                /> */}
                                    {/* <FAB.Group
                                        fabStyle={{ backgroundColor: Colors.primary }}
                                        open={open}
                                        icon={open ? 'close' : 'arrow-up-bold-box'}
                                        color={Colors.white}
                                        actions={FabAction}
                                        onStateChange={onStateChange}
                                        onPress={() => {
                                            if (open) {
                                                // do something if the speed dial is open
                                            }
                                        }}
                                    /> */}
                                    <ActionSheet ref={actionSheetRef}>
                                        <ActionSheetComp
                                            title={labels[actionSheetDecide]}
                                            closeActionSheet={closeActionSheet}
                                            keyToShowData={"name"}
                                            keyToCompareData="id"
                                            APIDetails={getAPIDetails()}
                                            changeAPIDetails={payload => {
                                                changeAPIDetails(payload);
                                            }}
                                            onPressItem={item => {
                                                onPressItem(item);
                                            }}
                                        />
                                    </ActionSheet>
                                </ImageBackground>
                            </>
                        )
                        : <EmptyList navigation={props.navigation} noModuleMsg={true} />
            }

        </BaseContainer>
    )
}

export default JournalsListing

const styles = StyleSheet.create({
    fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        backgroundColor: Colors.primary,
        bottom: 0,
    },
    whiteRBG: {
        justifyContent: "center",
        alignItems: "center",
        width: 30,
        height: 30,
        borderRadius: 30,
        backgroundColor: Colors.white
    },
    floatingPlusView: {
        height: 80,
        width: 80,
        backgroundColor: Colors.white,
        borderRadius: 22,
        position: "absolute",
        right: 12,
        top: "13%",
        justifyContent: "center",
        alignItems: "center",
        // shadow
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 15,
        elevation: 15,
        shadowColor: Colors.primary,
        shadowRadius: 6,
        zIndex: 100
    },
    title: {
        // padding: 16,
        fontSize: getProportionalFontSize(16),
        fontFamily: Assets.fonts.semiBold,
        color: Colors.white,
    },
    cardContainer: {
        flex: 1,
        backgroundColor: "#fff",
        padding: 15,
        marginTop: 20,
        marginRight: 30,
        // shadow
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 15,
        elevation: 15,
        shadowColor: Platform.OS == 'ios' ? Colors.shadowColorIosDefault : Colors.shadowColorAndroidDefault,
        shadowRadius: 6,
        borderRadius: getProportionalFontSize(10),
        // borderWidth: 1
        // borderWidth: 1,
        // borderColor: Colors.borderColor

    },
    headerTitile: {
        fontSize: getProportionalFontSize(14),
        fontFamily: Assets.fonts.bold,
        color: Colors.primary,
    },
    subheaderTitle: {
        fontFamily: Assets.fonts.semiBold,
        color: Colors.black, marginTop: 5, fontSize: getProportionalFontSize(14)
    },
    subheaderValue: {
        fontSize: getProportionalFontSize(13),
        fontFamily: Assets.fonts.semiBold,
        color: Colors.gray,
    },
    nextButton: {
        justifyContent: 'center',
        alignItems: 'center',
        width: '75%',
        height: 45,
        borderRadius: 20,
        backgroundColor: Colors.primary,
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
        borderTopRightRadius: 40

    },
    titleAndIconView: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: Constants.globalPaddingHorizontal, marginVertical: Constants.formFieldTopMargin }
})
