import React from 'react'
import { StyleSheet, Text, View, ScrollView, FlatList, TouchableOpacity, Image, Linking } from 'react-native'
import Colors from '../Constants/Colors';
import { useSelector, useDispatch } from 'react-redux';
import { FAB, Provider, Portal, Modal } from 'react-native-paper';
import BaseContainer from '../Components/BaseContainer';
import Constants from '../Constants/Constants';
import { firstLetterFromString, formatDateWithTime, formatTime, getProportionalFontSize, formatDate, getJSObjectFromTimeString, formatDateByFormat } from '../Services/CommonMethods';
import APIService from '../Services/APIService';
import Alert from '../Components/Alert';
// icons
import Icon from 'react-native-vector-icons/Ionicons';
import Can from '../can/Can';
import Assets from '../Assets/Assets';
import JournalActionModal from '../Components/JournalActionModal';

const userImage = 'https://st3.depositphotos.com/15648834/17930/v/600/depositphotos_179308454-stock-illustration-unknown-person-silhouette-glasses-profile.jpg'

const JournalDetail = (props) => {
    // console.log("itemId+++++++++++++++", props?.route?.params?.itemId)
    const routeParam = props?.route?.params ?? {}
    // REDUX hooks
    const UserLogin = useSelector(state => state.User.UserLogin);
    const labels = useSelector(state => state.Labels);
    const labels_journal_listing = useSelector(state => state.Labels);
    const permissions = UserLogin?.permissions ?? {}

    //hooks
    const [showBasicDetail, setShowBasicDetail] = React.useState(true);
    const [showCreatedDetail, setShowCreatedDetail] = React.useState(false);
    const [showPatientDetail, setShowPatientDetail] = React.useState(false);
    const [showAction, setShowAction] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(true);
    const [journalDetail, setJournalDetail] = React.useState(null);
    const [isModalVisible, setIsModalVisible] = React.useState(false);
    const [journalActionIndex, setJournalActionIndex] = React.useState(null);


    React.useEffect(() => {
        getDetails()
    }, [props?.route?.params]);

    const getDetails = async () => {
        if (!props?.route?.params?.itemID)
            return;
        setIsLoading(true);
        let url = Constants.apiEndPoints.journal + "/" + props?.route?.params?.itemID;

        let response = await APIService.getData(url, UserLogin.access_token, null, "journalDetail API");
        if (!response.errorMsg) {
            setJournalDetail(response.data.payload)
            setIsLoading(false);
        }
        else {
            setIsLoading(false);
            Alert.showAlert(Constants.danger, response.errorMsg);
        }
    }

    //helper 
    const InfoContainer = (props) => {
        const { iconName, title, content } = props;
        return (
            <View style={{ ...props.style_main, alignSelf: "flex-start" }}>
                <View style={{ flexDirection: "row", marginTop: 20, alignItems: 'center', justifyContent: "space-between" }}>
                    <View style={{ flexDirection: "row", alignItems: 'center' }}>
                        {iconName ? <Icon style={{ marginRight: 5 }} name={iconName} color={Colors.black} size={17} /> : null}
                        <Text style={{ ...styles.descriptionText, }}>{title}</Text>
                    </View>
                    {props.extraIconName ? <Icon onPress={props.onPressExtraIcon ? props.onPressExtraIcon : () => { }} style={{ marginRight: 5 }} name={props.extraIconName} color={Colors.primary} size={getProportionalFontSize(24)} /> : null}
                </View>
                <Text style={{ ...styles.contentText, ...props.contentTextStyle }}>{content ?? "N/A"}</Text>
            </View>
        )
    }

    const onRequestClose = () => {
        // console.log('onRequestClose called')
        setIsModalVisible(false);
        setJournalActionIndex(null)
    }

    //render
    //console.log('ipval--', JSON.stringify(ipValues))
    if (isLoading)
        return <ProgressLoader />

    return (

        <BaseContainer
            onPressLeftIcon={() => { props.navigation.goBack() }}
            leftIcon="arrow-back"
            leftIconSize={24}
            title={labels["journal-menu"]}
            leftIconColor={Colors.primary}
        >
            {/* Main View */}
            <ScrollView
                style={styles.mainView}
                showsVerticalScrollIndicator={false}
            >

                {/* ---------basic details--------- */}
                <View style={styles.detailsContainer} >
                    <TouchableOpacity
                        style={styles.header}
                        onPress={() => setShowBasicDetail(!showBasicDetail)} >
                        <Text style={styles.headerText}>{labels["spacial-information"]}</Text>
                        <Icon name={!showBasicDetail ? 'chevron-down' : 'chevron-up'} color={Colors.black} size={25} />
                    </TouchableOpacity>

                    <View style={{ display: !showBasicDetail ? "none" : "flex" }}>
                        {/* category */}
                        <InfoContainer
                            iconName={"list-outline"}
                            title={labels["category"]}
                            content={journalDetail?.category?.name}
                        />
                        {/* subcategory */}
                        <InfoContainer
                            iconName={"list-outline"}
                            title={labels["subcategory"]}
                            content={journalDetail?.subcategory?.name}
                        />
                        {/* incident date */}
                        <InfoContainer
                            iconName={"calendar-outline"}
                            title={labels["incident-date"]}
                            content={journalDetail?.date}
                        />
                        {/* description */}
                        <InfoContainer
                            iconName={"text"}
                            title={labels["description"]}
                            content={journalDetail?.description}
                        />

                        <FlatList
                            keyExtractor={(item, index) => '' + index}
                            data={journalDetail?.journal_logs ?? []}
                            renderItem={({ item, index }) => {
                                return (
                                    <InfoContainer
                                        // iconName={"text"}
                                        contentTextStyle={{ textDecorationLine: "line-through" }}
                                        title={labels["old-description"]}
                                        content={item?.description}
                                    />
                                )
                            }}
                        />
                        {/* created at */}
                        <InfoContainer
                            iconName={"calendar-outline"}
                            title={labels["created-at"]}
                            content={formatDateByFormat(journalDetail?.created_at, "yyyy-MM-DD")}
                        />
                        {/* sign */}
                        <InfoContainer
                            iconName={"pencil-outline"}
                            title={labels["is-signed"]}
                            content={journalDetail?.is_signed ? labels["yes"] : labels["no"]}
                        />
                    </View>
                </View>

                {/* --------- Actions --------- */}
                <View style={styles.detailsContainer} >
                    <TouchableOpacity
                        style={styles.header}
                        onPress={() => setShowAction(!showAction)} >
                        <Text style={styles.headerText}>{labels["action"]}</Text>
                        <Icon name={!showAction ? 'chevron-down' : 'chevron-up'} color={Colors.black} size={25} />
                    </TouchableOpacity>

                    <View style={{ display: !showAction ? "none" : "flex" }}>
                        <FlatList
                            keyExtractor={(item, index) => '' + index}
                            data={journalDetail?.journal_actions ?? []}
                            ListEmptyComponent={<Text style={{ textAlign: "center", marginTop: Constants.formFieldTopMargin, fontSize: getProportionalFontSize(14), fontFamily: Assets.fonts.semiBold }}>{labels["no-actions-performed"]}</Text>}
                            renderItem={({ item, index }) => {
                                return (
                                    <>
                                        {/* action */}
                                        <View style={styles.commonRowStyle}>
                                            <InfoContainer
                                                style_main={{ flex: 1, }}
                                                iconName={"albums-outline"}
                                                title={labels["action"]}
                                                content={item?.comment_action}
                                            />
                                            {/* result */}
                                            <InfoContainer
                                                style_main={{ flex: 1 }}
                                                iconName={"albums-outline"}
                                                title={labels["result"]}
                                                extraIconName="create"
                                                onPressExtraIcon={() => {
                                                    setJournalActionIndex(index)
                                                    setIsModalVisible(true)
                                                }}
                                                content={item?.comment_result}
                                            />
                                        </View>

                                        <View style={styles.commonRowStyle}>
                                            {/* created at */}
                                            <InfoContainer
                                                style_main={{ flex: 1 }}
                                                iconName={"calendar-outline"}
                                                title={labels["created-at"]}
                                                content={formatDateByFormat(item?.created_at, "yyyy-MM-DD")}
                                            />
                                            {/* edited at */}
                                            <InfoContainer
                                                style_main={{ flex: 1 }}
                                                iconName={"calendar-outline"}
                                                title={labels["edited-at"]}
                                                content={formatDateByFormat(item?.updated_at, "yyyy-MM-DD")}
                                            />
                                        </View>

                                        {/* sign */}
                                        <InfoContainer
                                            style_main={{ flex: 1 }}
                                            iconName={"pencil-outline"}
                                            title={labels["is-signed"]}
                                            content={item?.is_signed ? labels["yes"] : labels["no"]}
                                        />
                                        {
                                            journalDetail?.journal_actions?.length - 1 == index
                                                ? null : <View style={{ height: 0, width: "100%", marginTop: Constants.formFieldTopMargin, borderWidth: 1, borderColor: Colors.lightGray }} />
                                        }
                                    </>
                                )
                            }}
                        />
                    </View>
                </View>


                {/* --------- created by --------- */}
                <View style={styles.detailsContainer} >
                    <TouchableOpacity
                        style={styles.header}
                        onPress={() => setShowCreatedDetail(!showCreatedDetail)} >
                        <Text style={styles.headerText}>{labels["created-by"]}</Text>
                        <Icon name={!showCreatedDetail ? 'chevron-down' : 'chevron-up'} color={Colors.black} size={25} />
                    </TouchableOpacity>

                    <View style={{ display: !showCreatedDetail ? "none" : "flex" }}>
                        {/* Full Name */}
                        <InfoContainer
                            iconName={"person-outline"}
                            title={labels["name"]}
                            content={journalDetail?.employee?.name}
                        />
                        {/* created at */}
                        <InfoContainer
                            iconName={"calendar-outline"}
                            title={labels["created-at"]}
                            content={`${formatDateByFormat(journalDetail?.employee?.created_at, "yyyy-MM-DD")} ${formatTime(journalDetail?.employee?.created_at)}`}
                        />

                    </View>
                </View>

                {/* patient detail */}
                {journalDetail?.patient?.id
                    ? <CustomButton
                        style={{
                            ...styles.nextButton,
                            backgroundColor: Colors.primary
                        }}
                        onPress={() => {
                            props.navigation.navigate("CommonUserProfile", { itemId: journalDetail?.patient?.id, url: Constants.apiEndPoints.userView, user_type_id: 6 })

                        }}
                        title={labels["patient-detail"]}
                    /> : null}

                {/* MODAL */}
                <Portal>
                    <Modal
                        animationType="slide"
                        transparent={true}
                        style={{ justifyContent: "center", alignItems: 'center' }}
                        visible={isModalVisible}
                        onRequestClose={onRequestClose}
                        onDismiss={onRequestClose}
                    >
                        {
                            <JournalActionModal
                                journal_action_index={journalActionIndex}
                                onRequestClose={onRequestClose}
                                labels={labels_journal_listing}
                                journal={journalDetail}
                                refreshAPI={() => { getDetails() }}
                            />
                        }
                    </Modal>
                </Portal>

            </ScrollView>
        </BaseContainer >
    )
}

export default JournalDetail

const styles = StyleSheet.create({
    mainView: {
        // flex: 1,
        paddingHorizontal: Constants.globalPaddingHorizontal,
        backgroundColor: Colors.backgroundColor,
        paddingBottom: 40
    },
    nextButton: {
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: 40,
        borderRadius: 5,
        backgroundColor: Colors.secondary,
        marginTop: Constants.formFieldTopMargin,
    },
    detailsContainer: {
        width: "100%",
        shadowOffset: { width: 3, height: 3, },
        shadowOpacity: 10,
        elevation: 15,
        shadowColor: Platform.OS == "ios" ? Colors.shadowColorIosDefault : Colors.shadowColorAndroidDefault,
        shadowRadius: 10,
        backgroundColor: Colors.white,
        padding: Constants.globalPaddingHorizontal,
        marginVertical: 10,
        borderRadius: 10,
    },
    header: {
        flexDirection: "row",
        width: "100%",
        justifyContent: "space-between",
        alignItems: "center",

    },
    headerText: {
        fontFamily: Assets.fonts.bold,
        fontSize: getProportionalFontSize(18),
        color: Colors.black
    },
    commonRowStyle: { flexDirection: "row", alignItems: "center", },
    descriptionText: {
        fontFamily: Assets.fonts.medium,
        fontSize: getProportionalFontSize(15),
        lineHeight: 24,
        color: Colors.black
    },
    contentText: {
        fontFamily: Assets.fonts.regular,
        fontSize: getProportionalFontSize(12),
        lineHeight: 17,
        color: Colors.black,
        padding: 2
    },
    countLabel: {
        backgroundColor: Colors.placeholderTextColor,
        minWidth: 24,
        height: 24,
        borderRadius: 5,
        marginLeft: 15,
        justifyContent: 'center',
        alignItems: "center",
        paddingHorizontal: 7,
    },
    countLabelText: {
        fontFamily: Assets.fonts.semiBold,
        fontSize: getProportionalFontSize(14),
        color: Colors.white,
    },
    fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        backgroundColor: Colors.primary,
        bottom: 0,
        // fontSize: 9
    },
    iconButton: { marginTop: Constants.formFieldTopMargin, flexDirection: "row", justifyContent: "space-evenly", alignItems: "center", height: 40, width: "100%", backgroundColor: Colors.primary, borderRadius: 10 },
    normal_text: {
        fontFamily: Assets.fonts.bold,
        fontSize: getProportionalFontSize(16),
        color: Colors.white,
    },
})