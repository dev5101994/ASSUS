import React from 'react'
import { StyleSheet, Text, View, ScrollView, FlatList, TouchableOpacity, Image, Linking, Dimensions } from 'react-native'
import Colors from '../Constants/Colors';
import { useSelector, useDispatch } from 'react-redux';
// import { FAB, Provider, Portal } from 'react-native-paper';
import BaseContainer from '../Components/BaseContainer';
import Constants from '../Constants/Constants';
import { firstLetterFromString, formatDateWithTime, formatTime, getProportionalFontSize, formatDate } from '../Services/CommonMethods';
import APIService from '../Services/APIService';
import Alert from '../Components/Alert';
import ProgressLoader from '../Components/ProgressLoader';
import { Avatar, Button, Card, Title, Paragraph, Portal, Modal, Divider, Chip } from 'react-native-paper';
// icons
import Icon from 'react-native-vector-icons/MaterialIcons';
import Assets from '../Assets/Assets';
import CustomButton from '../Components/CustomButton';
import Can from '../can/Can';
import Entypo from 'react-native-vector-icons/Entypo';
import Ionicons from 'react-native-vector-icons/Ionicons';
import EmptyDataContainer from '../Components/EmptyDataContainer';

const userImage = 'https://st3.depositphotos.com/15648834/17930/v/600/depositphotos_179308454-stock-illustration-unknown-person-silhouette-glasses-profile.jpg'


const ActivityDetails = (props) => {
    const routeParam = props?.route?.params ?? {}
    // REDUX hooks
    const dispatch = useDispatch();
    const isInternetActive = useSelector(state => state.IsInternetActive);
    const UserLogin = useSelector(state => state.User.UserLogin);
    const labels = useSelector(state => state.Labels);
    const permissions = UserLogin?.permissions ?? {}
    const messages = useSelector(state => state.Labels);

    //hooks
    const [ShowBasicDetails, setShowBasicDetails] = React.useState(true);
    const [showPatientDetails, setShowPatientDetails] = React.useState(false);
    const [activityDetails, setActivityDetails] = React.useState([]);
    const [showEmployee, setShowEmployee] = React.useState(false);
    const [showExternalComment, setShowExternalComment] = React.useState(false);
    const [showInternalComment, setShowInternalComment] = React.useState(false);
    const [showComment, setShowComment] = React.useState(false);
    const [comments, SetComments] = React.useState([]);
    const [isLoading, setIsLoading] = React.useState(true);
    const [isModalVisible, setIsModalVisible] = React.useState(false);
    const [showIpDetails, setShowIpDetails] = React.useState(false);
    const [employeeIndex, setEmployeeIndex] = React.useState(0)

    // console.log("activity Details", JSON.stringify(activityDetails))
    React.useEffect(() => {
        const unsubscribe = props.navigation.addListener('focus', () => {
            // console.log('Focus___________________________________________')
            getIPDetails(routeParam?.itemId)
        });
        return unsubscribe;
    }, [props.navigation]);

    const getIPDetails = async (ipId) => {
        setIsLoading(true);
        let url = Constants.apiEndPoints.addActivity + "/" + ipId;
        // console.log("url", url)
        let response = await APIService.getData(url, UserLogin.access_token, null, "ActivityDetailAPI");
        // setIpUserId(response.data.payload.parent_id)
        // console.log("response.data.payload.parent_id", response.data.payload)
        // return
        if (!response.errorMsg) {
            setActivityDetails(response.data.payload)
            setIsLoading(false);
            getComments(routeParam?.itemId)
        }
        else {
            setIsLoading(false);
            Alert.showAlert(Constants.danger, response.errorMsg);
        }
    }

    const getComments = async (id) => {
        // setIsLoading(true);
        let params = {
            "source_id": id ?? "",
            "activity_id": "",
            "user_id": "",
        }
        let url = Constants.apiEndPoints.commentList;
        // console.log("url", url)
        let response = await APIService.postData(url, params, UserLogin.access_token, null, "commentAPI");

        // return
        if (!response.errorMsg) {
            SetComments(response.data.payload)
            // setIsLoading(false);
        }
        else {
            // setIsLoading(false);
            Alert.showAlert(Constants.danger, response.errorMsg);
        }
    }
    const openModel = () => {
        // setModelView(view)
        // console.log("rowData", rowData)
        setIsModalVisible(true);
        // settempdata(rowData)
        // console.error("isModalVisible", isModalVisible)
    }
    const onRequestClose = () => {
        // console.log('onRequestClose called')
        setIsModalVisible(false);
    }
    //helper 
    const openUrl = async (url, msg) => {
        // console.log("openurl", url)
        try {
            await Linking.openURL(url)
        } catch (err) {
            Alert.showAlert(Constants.warning, msg)
        }
    }
    const InfoContainer = (props) => {
        const { iconName, title, content } = props;
        return (
            // <View>
            //     <View style={{ flexDirection: "row", marginTop: 20, alignItems: 'center' }}>
            //         {iconName ? <Icon style={{ marginRight: 5 }} name={iconName} color={Colors.black} size={17} /> : null}
            //         <Text style={styles.descriptionText}>{title}</Text>
            //     </View>
            //     <Text style={styles.contentText}>{content ?? "N/A"}</Text>
            // </View>

            <View>
                <View style={{
                    flexDirection: "row", marginTop: 0,
                    //  alignItems: 'center' 
                }}>
                    {iconName ? <Icon style={{ marginRight: 15, marginTop: 20 }} name={iconName} color={Colors.black} size={20} /> : null}
                    <View style={{
                        flex: 1,
                        borderBottomColor: Colors.placeholderTextColor,
                        borderBottomWidth: props?.hideBottomLine ? 0 : 0.5,
                        paddingVertical: 10
                    }}>
                        <Text style={styles.descriptionText}>{title}</Text>
                        <Text style={styles.contentText}>{content ?? "N/A"}</Text>
                    </View>
                </View>

            </View>
        )
    }

    const renderReplyListView = ({ item, index }) => {
        // console.log("----------reply items---------", item)
        return (
            <View key={item.id} style={{ flexDirection: 'row', alignItems: "center", marginTop: 10, }}>
                <View>
                    <Image source={{ uri: userImage }} style={{ width: 25, height: 25, marginRight: 20 }} />
                </View>
                <View style={{ flex: 8, }}>
                    <View style={{ flexDirection: "row" }}>
                        <Text style={styles.normal_text}>{item?.comment_by?.name}</Text>
                        <Text style={styles.timeAndDate}>{formatDateWithTime(item?.created_at)}</Text>
                    </View>
                    <Text style={{ ...styles.descriptionText, textAlign: "left" }}>{item?.comment}</Text>

                </View>
                {/* <TouchableOpacity
                    onPress={() => { setRepliedTo({ replied_to: item?.comment_by?.id, name: item?.comment_by?.name, parent_id: item.id }) }}
                    style={styles.reply}>
                    <Icon style={{}} name="reply" color={Colors.black} size={17} />
                    <Text style={{ fontSize: 12 }}>{props.labels.reply}</Text>
                </TouchableOpacity> */}
            </View>
        )
    }

    const renderListView = ({ item, index }) => {
        // console.log("---------- items---------", JSON.stringify(item))
        return (
            <View>
                <View key={item.id} style={{ flexDirection: 'row', alignItems: "center", marginTop: 10, }}>
                    <View>
                        <Image source={{ uri: userImage }} style={{ width: 25, height: 25, marginRight: 20 }} />
                    </View>
                    <View style={{ flex: 8, }}>
                        <View style={{ flexDirection: "row" }}>
                            <Text style={styles.normal_text}>{item?.comment_by?.name}</Text>
                            <Text style={styles.timeAndDate}>{formatDateWithTime(item?.created_at)}</Text>
                        </View>
                        <Text style={{ ...styles.descriptionText, textAlign: "left" }}>{item?.comment}</Text>

                    </View>
                    {/* <TouchableOpacity
                        onPress={() => { setRepliedTo({ replied_to: item?.comment_by?.id, name: item?.comment_by?.name, parent_id: item.id }) }}
                        style={styles.reply}>
                        <Icon style={{}} name="reply" color={Colors.black} size={17} />
                        <Text style={{ fontSize: 12 }}>{props.labels.reply}</Text>
                    </TouchableOpacity> */}
                </View>
                <View style={{ width: "100%" }}>
                    {
                        item?.reply_thread?.length
                            ? <>
                                <FlatList
                                    data={item?.reply_thread}
                                    keyExtractor={(item, index) => ('' + index)}
                                    renderItem={renderReplyListView}
                                    style={{
                                        paddingLeft: "13%",
                                        width: '100%',
                                        height: "100%",
                                        backgroundColor: Colors.backgroundColor,
                                    }}
                                    showsVerticalScrollIndicator={false}
                                    contentContainerStyle={{ borderWidth: 0, paddingVertical: Constants.globalPaddingVetical, }}
                                />
                            </> : null
                    }
                </View>
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
            // leftIconSize={24}
            title={labels["activity-details"]}
            leftIconColor={Colors.primary}
        >
            {/* Main View */}
            <ScrollView
                style={styles.mainView}
                showsVerticalScrollIndicator={false}
            >
                {/* <View
                    style={{
                        width: "100%",
                        marginTop: 20,
                    }}
                >
                    <View style={{
                        width: "100%",
                        justifyContent: "center",
                        alignItems: "center",
                    }}>
                        <Text style={{
                            fontFamily: Assets.fonts.semiBold,
                            fontSize: getProportionalFontSize(16),
                            color: Colors.black
                        }}> {activityDetails?.title}
                        </Text>
                        <Text style={{
                            fontFamily: Assets.fonts.regular,
                            fontSize: getProportionalFontSize(14)
                        }}> 
                        {activityDetails?.description}
                        
                        </Text>
                    </View>

                </View> */}
                <Card style={{
                    padding: Constants.globalPaddingHorizontal,
                    marginVertical: 10,
                    borderRadius: 10,
                    marginHorizontal: Constants.globalPaddingHorizontal,
                }}>
                    <Card.Content>
                        <View style={{
                            backgroundColor: Colors.primary,
                            position: "absolute",
                            borderRadius: 10,
                            right: 0

                        }}>
                            <Text style={{
                                fontFamily: Assets.fonts.semiBold,
                                fontSize: getProportionalFontSize(10),
                                color: Colors.white,
                                paddingHorizontal: 10,
                                paddingVertical: 3,

                            }}>
                                {activityDetails?.status == 0 ? labels["pending"] : activityDetails?.status == 1 ? labels["done"] : activityDetails?.status == 2 ? labels["not-done"] : labels["not-applicable-activity"]}
                            </Text>
                        </View>
                        <View style={{
                            width: "100%",
                            justifyContent: "center",
                            alignItems: "center",
                        }}>
                            <Title style={{
                                fontFamily: Assets.fonts.semiBold,
                                fontSize: getProportionalFontSize(16),
                                color: Colors.black
                            }}>{activityDetails?.title}</Title>
                            <Paragraph style={{
                                fontFamily: Assets.fonts.regular,
                                fontSize: getProportionalFontSize(12),
                                color: Colors.black,
                                textAlign: "justify"
                            }}>
                                {activityDetails?.description}
                                {/* standard dummy text ever since the 1500s, when an unknoambled it to makok. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum */}
                            </Paragraph>
                        </View>

                        {/* employee View */}
                        {/* <View style={{ 
                            //  elevation: 2, backgroundColor: Colors.white 
                             }}>
                            <Text>All Employees</Text>
                            <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
                                <Chip textStyle={{ fontSize: getProportionalFontSize(10), fontFamily: Assets.fonts.medium }}
                                    style={{
                                        margin: 5,
                                        backgroundColor: Colors.ultraLightProPrimary
                                    }} icon="information" onPress={() => console.log('Pressed')}>Example Chip</Chip>
                                <Chip textStyle={{ fontSize: getProportionalFontSize(10), fontFamily: Assets.fonts.medium }}
                                    style={{
                                        margin: 5,
                                        backgroundColor: Colors.ultraLightProPrimary
                                    }}
                                    avatar={<Image source={{ uri: "https://miro.medium.com/max/1200/1*mk1-6aYaf_Bes1E3Imhc0A.jpeg" }} style={{ width: 25, height: 25 }} />}
                                    onPress={() => console.log('Pressed')}>Example Chip</Chip>
                                <Chip textStyle={{ fontSize: getProportionalFontSize(10), fontFamily: Assets.fonts.medium }}
                                    style={{
                                        margin: 5,
                                        backgroundColor: Colors.ultraLightProPrimary
                                    }}
                                    avatar={<Image source={{ uri: "https://miro.medium.com/max/1200/1*mk1-6aYaf_Bes1E3Imhc0A.jpeg" }} style={{ width: 25, height: 25 }} />}
                                    onPress={() => console.log('Pressed')}>Chip</Chip>
                            </View>
                        </View> */}

                        {/* divider */}
                        <Divider style={{ height: 1, marginVertical: 5 }} />

                        <View style={{
                            flexDirection: "row", alignItems: 'center', justifyContent: "space-around", marginBottom: -10,
                        }} >
                            {/* location */}
                            <View style={{
                                ...styles.linkIcon,
                                backgroundColor: activityDetails?.address_url ? Colors.primary : Colors.placeholderTextColor,
                            }}>
                                <Entypo
                                    name="location-pin"
                                    color={Colors.white}
                                    size={18}
                                    onPress={activityDetails?.address_url ? () => openUrl(activityDetails?.address_url, labels["urlmsg"]) : () => { Alert.showToast(labels.link_is_not_available, Constants.success) }}
                                />
                            </View>
                            {/* information_url */}
                            <View style={{
                                ...styles.linkIcon,
                                backgroundColor: activityDetails?.information_url ? Colors.primary : Colors.placeholderTextColor,
                            }}>
                                <Entypo
                                    name="info"
                                    color={Colors.white}
                                    size={16}
                                    onPress={activityDetails?.information_url ? () => openUrl(activityDetails?.information_url, labels["urlmsg"]) : () => { Alert.showToast(labels.link_is_not_available, Constants.success) }}
                                />
                            </View>
                            {/* video_url */}
                            <View style={{
                                ...styles.linkIcon,
                                backgroundColor: activityDetails?.video_url ? Colors.primary : Colors.placeholderTextColor,
                            }}>
                                <Entypo
                                    name="youtube"
                                    color={Colors.white}
                                    size={16}
                                    onPress={activityDetails?.video_url ? () => openUrl(activityDetails?.video_url, labels["urlmsg"]) : () => { Alert.showToast(labels.link_is_not_available, Constants.success) }}
                                />
                            </View>
                            {/* attachment */}
                            <View style={{
                                ...styles.linkIcon,
                                backgroundColor: activityDetails?.file ? Colors.primary : Colors.placeholderTextColor,
                            }}>
                                <Ionicons
                                    name="link"
                                    color={Colors.white}
                                    size={16}
                                    onPress={activityDetails?.file ? () => openUrl(activityDetails?.file, labels["urlmsg"]) : () => { Alert.showToast(labels.link_is_not_available, Constants.success) }}
                                />
                            </View>
                        </View>

                    </Card.Content>
                </Card>

                {/* ---------basic_details--------- */}
                <View style={styles.detailsContainer} >
                    <TouchableOpacity
                        style={styles.header}
                        onPress={() => setShowBasicDetails(!ShowBasicDetails)} >
                        <Text style={styles.headerText}>{labels["Details"]}</Text>
                        <Icon name={!ShowBasicDetails ? 'expand-more' : 'expand-less'} color={Colors.black} size={25} />
                    </TouchableOpacity>
                    <View style={{ display: !ShowBasicDetails ? "none" : "flex" }}>
                        {/* category */}
                        <InfoContainer
                            iconName={"drag-indicator"}
                            title={labels["category"]}
                            content={activityDetails?.category?.name}
                        />
                        {/* subcategory */}
                        <InfoContainer
                            iconName={"grain"}
                            title={labels["subcategory"]}
                            content={activityDetails?.subcategory?.name}
                        />
                        {/* patient */}
                        {/* <InfoContainer
                            iconName={"elderly"}
                            title={labels["patient"]}
                            content={activityDetails?.patient?.name}
                        /> */}

                        {/* start_date */}
                        <InfoContainer
                            iconName={"date-range"}
                            title={labels["start-date"]}
                            content={activityDetails?.start_date}
                        />
                        {/* start_time */}
                        <InfoContainer
                            iconName={"alarm"}
                            title={labels["start-time"]}
                            content={activityDetails?.start_time}
                        />
                        {/* end_date */}
                        <InfoContainer
                            iconName={"date-range"}
                            title={labels["end-date"]}
                            content={activityDetails?.end_date}
                        />
                        {/* end_time */}
                        <InfoContainer
                            iconName={"alarm"}
                            title={labels["end-time"]}
                            content={activityDetails?.end_time}
                            hideBottomLine={true}
                        />
                    </View>
                </View>

                {/* patient details */}
                <View style={styles.detailsContainer} >
                    <TouchableOpacity
                        style={styles.header}
                        onPress={() => setShowPatientDetails(!showPatientDetails)} >
                        <Text style={styles.headerText}>{labels["patient-details"]}</Text>
                        <Icon name={!showPatientDetails ? 'expand-more' : 'expand-less'} color={Colors.black} size={25} />
                    </TouchableOpacity>
                    <View style={{ display: !showPatientDetails ? "none" : "flex" }}>

                        {/* patient */}
                        <InfoContainer
                            iconName={"elderly"}
                            title={labels["name"]}
                            content={activityDetails?.patient?.name}
                        />
                        {/* email */}
                        <InfoContainer
                            iconName={"alternate-email"}
                            title={labels["email"]}
                            content={activityDetails?.patient?.email}
                        />
                        {/* contact_number */}
                        <InfoContainer
                            iconName={"phone"}
                            title={labels["contact-number"]}
                            content={activityDetails?.patient?.contact_number}
                        />
                        {/* personal_number */}
                        <InfoContainer
                            iconName={"date-range"}
                            title={labels["personal-number"]}
                            content={activityDetails?.patient?.personal_number}
                        />
                        {/* gender */}
                        <InfoContainer
                            iconName={"blur-circular"}
                            title={labels["gender"]}
                            content={activityDetails?.patient?.gender}
                            hideBottomLine={true}
                        />
                        <CustomButton
                            title={labels["View"]}
                            style={styles.buttonView}
                            titleStyle={{ color: Colors.primary, fontSize: getProportionalFontSize(14) }}
                            onPress={() => {
                                // props.navigation.navigate("CommonUserProfile", { patientId: activityDetails?.patient?.id })
                                props.navigation.navigate("CommonUserProfile",
                                    { itemId: activityDetails?.patient?.id, url: Constants.apiEndPoints.userView, user_type_id: activityDetails?.patient?.user_type_id })
                            }}
                        />
                    </View>
                </View>



                {/* ip details */}
                <View style={styles.detailsContainer} >
                    <TouchableOpacity
                        style={styles.header}
                        onPress={() => setShowIpDetails(!showIpDetails)} >
                        <Text style={styles.headerText}>{labels["ip-details"]}</Text>
                        <Icon name={!showIpDetails ? 'expand-more' : 'expand-less'} color={Colors.black} size={25} />
                    </TouchableOpacity>
                    <View style={{ display: !showIpDetails ? "none" : "flex" }}>
                        {/* title */}
                        <InfoContainer
                            iconName={"title"}
                            title={labels["title"]}
                            content={activityDetails?.implementation_plan?.title}
                        />
                        {/* start date*/}
                        <InfoContainer
                            iconName={"date-range"}
                            title={labels["start-date"]}
                            content={activityDetails?.implementation_plan?.start_date}
                        />
                        {/* end date */}
                        <InfoContainer
                            iconName={"date-range"}
                            title={labels["end-date"]}
                            content={activityDetails?.implementation_plan?.end_date}
                        />
                        {/* action date */}
                        <InfoContainer
                            iconName={"date-range"}
                            title={labels["action_date"]}
                            content={activityDetails?.implementation_plan?.action_date}
                        />
                        {/* goal */}
                        <InfoContainer
                            iconName={"blur-circular"}
                            title={labels["goal"]}
                            content={activityDetails?.implementation_plan?.goal}
                        // content="A divider is a thin, lightweight separator that groups content in lists and page layouts.A divider is a thin, lightweight separator that groups content in lists and page layouts.A divider is a thin, lightweight separator that groups content in lists and page layouts."
                        />
                        {/* sub goal */}
                        <InfoContainer
                            iconName={"blur-circular"}
                            title={labels["sub-goal"]}
                            content={activityDetails?.implementation_plan?.sub_goal}
                            hideBottomLine={true}
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
                            <Text style={styles.headerText}>{labels["Employees"]}</Text>
                            <View style={styles.countLabel}>
                                <Text style={styles.countLabelText}>{activityDetails?.assign_employee?.length}</Text>
                            </View>
                        </View>
                        <Icon name={!showEmployee ? 'expand-more' : 'expand-less'} color={Colors.black} size={25} />
                    </TouchableOpacity>
                    <View style={{ display: !showEmployee ? "none" : "flex" }}>
                        {
                            activityDetails?.assign_employee.length > 0
                                ? activityDetails?.assign_employee?.map((item, index) => {
                                    return (
                                        <TouchableOpacity
                                            key={item.id}
                                            style={{ flexDirection: 'row', alignItems: "center", }}
                                            onPress={() => {
                                                setEmployeeIndex(index)
                                                setIsModalVisible(true)
                                            }}
                                        >
                                            <View>
                                                {/* source={{ uri: props.image ?? props.isBranch ? Constants.branchIcon : props?.gender == "female" ? Constants.userImageFemale : Constants.userImageMale */}
                                                <Image source={{
                                                    uri: item?.image ?? item?.employee?.gender?.toLowerCase() == "female" ? Constants.userImageFemale : Constants.userImageMale
                                                }} style={{ width: 25, height: 25, marginRight: 20 }} />
                                            </View>
                                            <View style={{
                                                flex: 1,
                                                borderTopColor: Colors.placeholderTextColor,
                                                borderTopWidth: index == 0 ? 0 : 0.5,
                                                paddingVertical: 10
                                            }}>
                                                <Text style={styles.descriptionText}>{item?.employee?.name}</Text>
                                                <View style={{ flexDirection: "row" }}>
                                                    {/* <Text style={styles.contentText}>{labels["email"]} : </Text> */}
                                                    <Text style={styles.contentText}> {item?.employee?.email}</Text>
                                                </View>
                                            </View>
                                            <View>
                                                <Icon name='keyboard-arrow-right' size={20} color={Colors.black} />
                                            </View>
                                        </TouchableOpacity>

                                    )
                                }) : <Text style={styles.descriptionText}>{labels["data-is-not-available"]}</Text>
                        }
                    </View>
                </View>


                {/* external comment */}
                <View style={{
                    ...styles.detailsContainer,
                }} >
                    <TouchableOpacity
                        style={{ ...styles.header, }}
                        onPress={() => setShowExternalComment(!showExternalComment)} >
                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                            <Text style={styles.headerText}>{labels["external-comment"]}</Text>
                        </View>
                        <Icon name={!showExternalComment ? 'expand-more' : 'expand-less'} color={Colors.black} size={25} />
                    </TouchableOpacity>
                    <View style={{ display: !showExternalComment ? "none" : "flex" }}>

                        <View style={{}}>

                            <Text style={{ ...styles.descriptionText, textAlign: "left" }}>{activityDetails?.external_comment ?? labels["data-is-not-available"]}</Text>

                        </View>
                    </View>
                </View>

                {/* internal comment */}
                {
                    Can(Constants.permissionsKey.internalComRead, permissions)
                        ? <View style={{
                            ...styles.detailsContainer,
                        }} >
                            <TouchableOpacity
                                style={{ ...styles.header, }}
                                onPress={() => setShowInternalComment(!showInternalComment)} >
                                <View style={{ flexDirection: "row", alignItems: "center" }}>
                                    <Text style={styles.headerText}>{labels["internal-comment"]}</Text>
                                </View>
                                <Icon name={!showInternalComment ? 'expand-more' : 'expand-less'} color={Colors.black} size={25} />
                            </TouchableOpacity>
                            <View style={{ display: !showInternalComment ? "none" : "flex" }}>
                                <View style={{}}
                                >

                                    <Text style={{ ...styles.descriptionText, textAlign: "left" }}>{activityDetails?.internal_comment ?? labels["data-is-not-available"]}</Text>

                                </View>
                            </View>

                        </View> : null
                }


                {/* ---------comments--------- */}
                <View style={{
                    ...styles.detailsContainer,
                    marginBottom: 70,
                }} >
                    <TouchableOpacity
                        style={{ ...styles.header, }}
                        onPress={() => setShowComment(!showComment)} >
                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                            <Text style={styles.headerText}>{labels["comment"]}</Text>
                            {/* <View style={styles.countLabel}>
                                <Text style={styles.countLabelText}>{comments?.length}</Text>
                            </View> */}
                        </View>
                        <Icon name={!showComment ? 'expand-more' : 'expand-less'} color={Colors.black} size={25} />
                    </TouchableOpacity>
                    <View style={{ display: !showComment ? "none" : "flex" }}>
                        <FlatList
                            onEndReached={() => {
                                // console.log('reached hola')
                            }}
                            data={comments}
                            keyExtractor={(item, index) => ('' + index)}
                            renderItem={renderListView}
                            style={styles.flatListContainerStyle}
                            // ListEmptyComponent={<EmptyDataContainer />}
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={{ borderWidth: 0, paddingVertical: Constants.globalPaddingVetical, paddingHorizontal: Constants.globalPaddingHorizontal }}

                        />
                        {/* {
                            comments?.map((item) => {
                                return (

                                    <View key={item.id} style={{ flexDirection: 'row', alignItems: "center", marginTop: 10, }}>
                                       
                                        <View style={{ flex: 8, }}>
                                            <View style={{ flexDirection: "row" }}>
                                                <Text style={styles.normal_text}>{item?.comment_by?.name}</Text>
                                                <Text style={styles.timeAndDate}>{formatDateWithTime(item?.created_at)}</Text>
                                            </View>
                                            <Text style={{ ...styles.descriptionText, textAlign: "left" }}>{item?.comment}</Text>

                                        </View>
                                      
                                    </View>
                                )
                            })
                        } */}
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
                    onDismiss={onRequestClose}
                >
                    <View style={styles.modalMainView}>
                        <View style={styles.innerViewforModel}>
                            {/* close icon */}
                            <View style={{
                                width: "100%",
                                marginTop: 5,
                                // alignItems: 'flex-end',
                            }}>
                                <Icon name='cancel' color={Colors.primary} size={30} onPress={onRequestClose} />
                            </View>

                            {/* main view */}
                            <View style={{ flexDirection: 'row', alignItems: "center", marginTop: 10 }}   >
                                <View>
                                    <Image source={{
                                        uri: activityDetails?.assign_employee[employeeIndex]?.image ?? activityDetails?.assign_employee[employeeIndex]?.employee?.gender?.toLowerCase() == "female" ? Constants.userImageFemale : Constants.userImageMale
                                    }} style={{ width: 25, height: 25, marginRight: 20 }} />
                                </View>
                                <View>
                                    <Text style={styles.descriptionText}>{activityDetails?.assign_employee[employeeIndex]?.employee?.name}</Text>
                                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                                        {/* <Text style={styles.contentText}>{labels.email} : </Text> */}
                                        <Icon style={{ marginRight: 5 }} name="email" color={Colors.black} size={15} />
                                        <Text style={styles.contentText}> {activityDetails?.assign_employee[employeeIndex]?.employee?.email}</Text>
                                    </View>
                                </View>
                            </View>

                            {/* assignment_date */}
                            <InfoContainer
                                iconName={"date-range"}
                                title={labels["assignment_date"]}
                                content={activityDetails?.assign_employee[employeeIndex]?.assignment_date}
                            />
                            {/* assignment_day */}
                            <InfoContainer
                                iconName={"date-range"}
                                title={labels["assignment_day"]}
                                content={activityDetails?.assign_employee[employeeIndex]?.assignment_day}
                            />
                            {/* assigned_by */}
                            <InfoContainer
                                iconName={"person"}
                                title={labels["assign-by-user"]}
                                content={activityDetails?.assign_employee[employeeIndex]?.assigned_by}
                                hideBottomLine={true}
                            />
                            {/* <CustomButton title={labels["view"]}
                                style={styles.buttonView}
                                titleStyle={{ color: Colors.black, fontSize: getProportionalFontSize(14) }}
                                onPress={() => {
                                    props.navigation.navigate("CommonUserProfile", { itemId: activityDetails?.assign_employee[employeeIndex]?.id, url: Constants.apiEndPoints.userView })
                                }}
                            /> */}
                        </View>
                    </View>
                </Modal>
            </Portal>
        </BaseContainer>
    )
}

export default ActivityDetails

const styles = StyleSheet.create({

    buttonView: { marginTop: 10, backgroundColor: Colors.white, borderColor: Colors.primary, borderWidth: 0, elevation: 2, borderWidth: 1 },

    mainView: {
        // flex: 1,
        backgroundColor: Colors.backgroundColor,
        paddingBottom: 40
    },

    detailsContainer: {
        // width: "100%",
        shadowOffset: { width: 3, height: 3, },
        shadowOpacity: 10,
        elevation: 5,
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
        // 
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
    },
    modalMainView: { backgroundColor: 'transparent', justifyContent: "center", alignItems: "center", paddingHorizontal: 16, minWidth: Dimensions.get("window").width * 1 },
    innerViewforModel: {
        width: '100%', minHeight: 150, backgroundColor: Colors.backgroundColor, paddingBottom: Constants.globalPaddingHorizontal * 2, paddingHorizontal: 16, borderRadius: 20,
    },
    linkIcon: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 32,
        height: 32,
        borderRadius: 28,
    },
})