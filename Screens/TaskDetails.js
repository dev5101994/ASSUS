import React from 'react'
import { StyleSheet, Text, View, ScrollView, FlatList, TouchableOpacity, Image, Linking } from 'react-native'
import Colors from '../Constants/Colors';
import { useSelector, useDispatch } from 'react-redux';
// import { FAB, Provider, Portal } from 'react-native-paper';
import BaseContainer from '../Components/BaseContainer';
import Constants from '../Constants/Constants';
import { firstLetterFromString, formatDateWithTime, formatTime, getProportionalFontSize, formatDate } from '../Services/CommonMethods';
import APIService from '../Services/APIService';
import Alert from '../Components/Alert';
import ProgressLoader from '../Components/ProgressLoader';
import { FAB, Portal, Provider, Modal } from 'react-native-paper';
// icons
import Icon from 'react-native-vector-icons/MaterialIcons';
const userImage = 'https://st3.depositphotos.com/15648834/17930/v/600/depositphotos_179308454-stock-illustration-unknown-person-silhouette-glasses-profile.jpg'

const TaskDetails = (props) => {
    const routeParam = props?.route?.params ?? {}
    // console.log("routeParam", routeParam)
    // REDUX hooks
    const dispatch = useDispatch();
    const isInternetActive = useSelector(state => state.IsInternetActive);
    const UserLogin = useSelector(state => state.User.UserLogin);
    const labels = useSelector(state => state.Labels);

    //hooks
    const [ShowBasicDetails, setShowBasicDetails] = React.useState(true);
    const [taskDetails, settaskDetails] = React.useState([]);
    const [showEmployee, setShowEmployee] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(true);
    const [isModalVisible, setIsModalVisible] = React.useState(false);

    React.useEffect(() => {
        if (props?.route?.params?.taskID) {
            getTaskDetails(props?.route?.params?.taskID)
        }
    }, [props?.route?.params]);


    const getTaskDetails = async (taskID) => {
        setIsLoading(true);
        let url = Constants.apiEndPoints.addTask + "/" + taskID;
        // console.log("url", url)
        let response = await APIService.getData(url, UserLogin.access_token, null, "taskDetailAPI");
        // console.log("response", JSON.stringify(response.data.payload))
        if (!response.errorMsg) {
            settaskDetails(response.data.payload)
            setIsLoading(false);

        }
        else {
            setIsLoading(false);
            Alert.showAlert(Constants.danger, response.errorMsg);
        }
    }
    const openModel = () => {
        setIsModalVisible(true);
    }
    const onRequestClose = () => {
        // console.log('onRequestClose called')
        setIsModalVisible(false);
    }
    //helper 
    const InfoContainer = (props) => {
        const { iconName, title, content } = props;
        return (
            <View>
                <View style={{ flexDirection: "row", marginTop: 20, alignItems: 'center' }}>
                    {iconName ? <Icon style={{ marginRight: 5 }} name={iconName} color={Colors.black} size={17} /> : null}
                    <Text style={styles.descriptionText}>{title}</Text>
                </View>
                <Text style={styles.contentText}>{content ?? "N/A"}</Text>
            </View>
        )
    }
    // render view
    if (isLoading)
        return <ProgressLoader />

    return (
        <BaseContainer
            onPressLeftIcon={() => { props.navigation.goBack() }}
            leftIcon="arrow-back"
            leftIconSize={24}
            title={labels["task-details"]}
            leftIconColor={Colors.primary}
        >
            {/* Main View */}
            <ScrollView
                style={styles.mainView}
                showsVerticalScrollIndicator={false}
            >

                {/* ---------basic_details--------- */}
                <View style={styles.detailsContainer} >
                    <TouchableOpacity
                        style={styles.header}
                        onPress={() => setShowBasicDetails(!ShowBasicDetails)} >
                        <Text style={styles.headerText}>{labels["Details"]}</Text>
                        <Icon name={!ShowBasicDetails ? 'expand-more' : 'expand-less'} color={Colors.black} size={25} />
                    </TouchableOpacity>
                    <View style={{ display: !ShowBasicDetails ? "none" : "flex" }}>
                        {/* status */}
                        <InfoContainer
                            iconName={"alt-route"}
                            title={labels.status}
                            content={taskDetails?.status == 0 ? labels["pending"] : taskDetails?.status == 1 ? labels["done"] : taskDetails?.status == 2 ? labels['not-done'] : labels["not-applicable-activity"]}
                        />

                        {/* title */}
                        <InfoContainer
                            iconName={"title"}
                            title={labels["title"]}
                            content={taskDetails?.title}
                        />
                        {/* description */}
                        <InfoContainer
                            iconName={"art-track"}
                            title={labels["description"]}
                            content={taskDetails?.description}
                        />
                        {/* category */}
                        {
                            taskDetails?.category?.name
                                ? <InfoContainer
                                    iconName={"drag-indicator"}
                                    title={labels["category"]}
                                    content={taskDetails?.category?.name}
                                /> : null
                        }
                        {/*
                        <InfoContainer
                            iconName={"drag-indicator"}
                            title={labels["category"]}
                            content={taskDetails?.category?.name}
                        />*/}
                        {/* subcategory */}
                        {
                            taskDetails?.subcategory?.name
                                ? <InfoContainer
                                    iconName={"grain"}
                                    title={labels["subcategory"]}
                                    content={taskDetails?.subcategory?.name}
                                /> : null
                        }
                        {/* 
                        <InfoContainer
                            iconName={"grain"}
                            title={labels["subcategory"]}
                            content={taskDetails?.subcategory?.name}
                        />*/}
                        {/* patient */}
                        {
                            taskDetails?.patient?.name
                                ? <InfoContainer
                                    iconName={"elderly"}
                                    title={labels["patient"]}
                                    content={taskDetails?.patient?.name}
                                /> : null
                        }
                        {/*
                        <InfoContainer
                            iconName={"elderly"}
                            title={labels["patient"]}
                            content={taskDetails?.patient?.name}
                        />*/}

                        {/* start_date */}
                        <InfoContainer
                            iconName={"date-range"}
                            title={labels["start-date"]}
                            content={taskDetails?.start_date}
                        />
                        {/* start_time */}
                        <InfoContainer
                            iconName={"alarm"}
                            title={labels["start-time"]}
                            content={taskDetails?.start_time}
                        />
                        {/* end_date */}
                        <InfoContainer
                            iconName={"date-range"}
                            title={labels["end-date"]}
                            content={taskDetails?.end_date}
                        />
                        {/* end_time */}
                        <InfoContainer
                            iconName={"alarm"}
                            title={labels["end-time"]}
                            content={taskDetails?.end_time}
                        />
                    </View>
                </View>

                {/* ---------Employees--------- */}
                <View style={{
                    ...styles.detailsContainer,
                }} >
                    <TouchableOpacity
                        style={{ ...styles.header, }}
                        onPress={() => setShowEmployee(!showEmployee)} >
                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                            <Text style={styles.headerText}>{labels["employees"]}</Text>
                            <View style={styles.countLabel}>
                                <Text style={styles.countLabelText}>{taskDetails?.assign_employee?.length}</Text>
                            </View>
                        </View>
                        <Icon name={!showEmployee ? 'expand-more' : 'expand-less'} color={Colors.black} size={25} />
                    </TouchableOpacity>
                    <View style={{ display: !showEmployee ? "none" : "flex" }}>
                        {
                            taskDetails?.assign_employee?.map((item) => {
                                return (
                                    <View key={item.id} style={{ flexDirection: 'row', alignItems: "center", marginTop: 10 }}>
                                        <View>
                                            <Image source={{ uri: userImage }} style={{ width: 25, height: 25, marginRight: 20 }} />
                                        </View>
                                        <View>
                                            <Text style={styles.descriptionText}>{item?.employee?.name}</Text>
                                            <View style={{ flexDirection: "row" }}>
                                                <Text style={styles.contentText}>{labels["assignment-date"]} : </Text>
                                                <Text style={styles.contentText}> {item?.assignment_date}</Text>
                                            </View>
                                        </View>
                                    </View>
                                )
                            })
                        }
                    </View>
                </View>
            </ScrollView>

            {/* MODAL */}
            <Portal>
                <Modal
                    animationType="slide"
                    transparent={true}
                    style={{ justifyContent: "center", alignItems: 'center' }}
                    visible={isModalVisible}
                    onRequestClose={onRequestClose}
                >
                    {/* <ModalComp
                        onRequestClose={onRequestClose}
                        labels={props?.label}
                        modelView={modelView}
                        employee={employee}
                        activityId={activityId}
                        UserLogin={UserLogin}
                    // data={tempdata}
                    /> */}
                </Modal>
            </Portal>
        </BaseContainer>
    )
}
export default TaskDetails


const styles = StyleSheet.create({
    mainView: {
        // flex: 1,

        backgroundColor: Colors.backgroundColor,
        paddingBottom: 40
    },

    detailsContainer: {
        // width: "100%",
        shadowOffset: { width: 3, height: 3, },
        shadowOpacity: 10,
        elevation: 15,
        shadowColor: Platform.OS == "ios" ? Colors.shadowColorIosDefault : Colors.shadowColorAndroidDefault,
        shadowRadius: 10,
        backgroundColor: Colors.white,
        padding: Constants.globalPaddingHorizontal,
        marginVertical: 10,
        borderRadius: 10,
        marginHorizontal: Constants.globalPaddingHorizontal,
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
    descriptionText: {
        fontFamily: Assets.fonts.medium,
        fontSize: getProportionalFontSize(14),
        // lineHeight: 24,
        color: Colors.lightBlack
    },
    contentText: {
        fontFamily: Assets.fonts.regular,
        fontSize: getProportionalFontSize(12),
        lineHeight: 17,
        color: Colors.black
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
        fontFamily: Assets.fonts.semiBold,
        fontSize: getProportionalFontSize(14),
        color: Colors.black,
    },
    timeAndDate: {
        marginHorizontal: 10,
        fontFamily: Assets.fonts.regular,
        fontSize: getProportionalFontSize(10),
        // lineHeight: 24,
        color: Colors.gray,
        // justifyContent: "flex-end",
        alignSelf: "flex-end"
    },
    reply: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",

        // marginHorizontal: 10
    }
})