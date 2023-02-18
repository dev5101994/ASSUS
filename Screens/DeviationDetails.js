import { StyleSheet, Text, View, Dimensions, TouchableOpacity, Image, ScrollView, FlatList } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Colors from '../Constants/Colors';
import { getProportionalFontSize, formatTime, formatDate, reverseFormatDate } from '../Services/CommonMethods';
import Assets from '../Assets/Assets';
import React, { useState, useCallback } from 'react';
import Constants from '../Constants/Constants';
import { Divider, Portal, Modal } from 'react-native-paper';
import Alert from '../Components/Alert';
import APIService from '../Services/APIService'
//redux
import { useSelector, useDispatch } from 'react-redux';
import BaseContainer from '../Components/BaseContainer';

const DeviationDetails = (props) => {

    const routeParams = props?.route?.params ?? {}

    const [UserDetails, setUserDetails] = React.useState([])
    // console.log("UserDetails  ", JSON.stringify(UserDetails));
    const [personalDetails, setShowPersonalDetails] = React.useState(true)


    const [itemId, setItemId] = React.useState('')
    const [isItemFound, setIsItemFound] = React.useState(false)
    const [isLoading, setIsLoading] = React.useState(true);

    const [showRelatedFactor, setShowRelatedFactor] = React.useState(false);
    const [showBasicDetails, setShowBasicDetails] = React.useState(false);
    const [showDescriptions, setShowDescriptions] = React.useState(false);
    const [showImmediateAction, setShowImmediateAction] = React.useState(false);
    const [showProbableCause, setShowProbableCause] = React.useState(false);
    const [showSuggestion, setShowSuggestion] = React.useState(false);

    const [isModalVisible, setIsModalVisible] = React.useState(false);
    const [personsIndex, setPersonsIndex] = React.useState(0)

    // REDUX hooks
    const dispatch = useDispatch();
    const UserLogin = useSelector(state => state.User.UserLogin);
    const User = useSelector(state => state?.User?.UserDetail);
    const labels = useSelector(state => state.Labels);

    // useEffect hooks
    React.useEffect(() => {
        if (props?.route?.params?.itemId) {
            // console.log('item Id Found')
            setIsItemFound(true)
            setItemId(props?.route?.params?.itemId)
            getUserDetails(props?.route?.params?.itemId, props?.route?.params?.url)
        } else {
            //current user details  
            getUserDetails(UserLogin.id, Constants.apiEndPoints.administrationCompanyDetails)
        }
    }, [])

    /**
     * getUserDetails
     * @param {*} itemId 
     */
    const getUserDetails = async (itemId, uri) => {
        setIsLoading(true);
        // let params = {
        // }
        //console.log("itemId", itemId)
        let url = uri + "/" + itemId;
        // console.log("url", url);
        let response = await APIService.getData(url, UserLogin.access_token, null, "UserAPI");
        if (!response.errorMsg) {
            // console.log("payload getUserDetails", response.data.payload);
            setUserDetails({ ...response.data.payload, modules: response.data?.payload?.module_list ?? [], package: response.data?.payload?.subscription?.package_details ?? "" })
            // console.log("data", response.data.success);
            setIsLoading(false);
        }
        else {
            setIsLoading(false);
            Alert.showAlert(Constants.danger, response.errorMsg);
        }
    }

    const InfoContainer = (props) => {
        const { iconName, title, content } = props;
        return (

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


    const onRequestClose = () => {
        // console.log('onRequestClose called')
        setIsModalVisible(false);
    }

    // console.log("out of loop", UserDetails ? 1 : 2  )
    // console.log("current age is",  UserDetails?.is_secret)
    // Render view
    if (isLoading)
        return <ProgressLoader />

    return (
        <BaseContainer
            title={labels["deviation-details"]}
            leftIcon="arrow-back"
            leftIconColor={Colors.primary}
            onPressLeftIcon={() => { props.navigation.pop() }}
            titleStyle={{ marginStart: 5 }}
            rightIcon={props?.route?.params?.itemId ? "" : "edit"}
            rightIconColor={Colors.primary}
            onPressRightIcon={() => { props.navigation.navigate("EditUserProfile") }}
            style={{ paddingBottom: 20 }}
        >
            {/* Main View */}
            <ScrollView
                style={styles.mainView}
                showsVerticalScrollIndicator={false}
            >
                <View
                    style={styles.imageContainer}>

                    {/* <Image source={{ uri: UserDetails?.image ?? userImage }} style={{ ...styles.profileImg }} /> */}

                    <Image
                        source={{ uri: UserDetails?.image ?? UserDetails?.user_type?.name?.toLowerCase() == "branch" ? Constants.branchIcon : UserDetails?.gender == "female" ? Constants.userImageFemale : Constants.userImageMale }}
                        style={{ ...styles.profileImg }}
                    />

                    <Text style={{ ...styles.usernameText, color: UserDetails?.status == 0 ? Colors.red : Colors.black }}>{UserDetails?.patient?.name ?? "User_Name"}</Text>
                    {
                        UserDetails?.user_type?.name ? <Text style={styles.heading}>( {UserDetails.user_type.name} )</Text> : null
                    }
                    {
                        UserDetails.status == 0 ? <Text style={styles.inactiveLabel}>{labels["inactive"]}</Text> : null
                    }
                </View>

                {/* ---------personal_details--------- */}
                <View style={{
                    ...styles.detailsContainer,
                    display: UserDetails?.user_type_id == 6 ? "none" : null
                }} >
                    <TouchableOpacity
                        style={styles.overview}
                        onPress={() => setShowPersonalDetails(!personalDetails)} >
                        <Text style={styles.overviewText}>{labels["personal-details"]}</Text>
                        <Icon name={!personalDetails ? 'chevron-down' : 'chevron-up'} color={Colors.black} size={25} />
                    </TouchableOpacity>
                    <View style={{ display: !personalDetails ? "none" : "flex" }}>


                        {/* Personal Number */}
                        <InfoContainer
                            iconName={"person-outline"}
                            title={labels["personal-number"]}
                            content={UserDetails?.patient?.personal_number}
                        />

                        {/* Patient ID */}
                        <InfoContainer
                            iconName={"ios-person-add-outline"}
                            title={labels["custom-unique-id"]}
                            content={UserDetails?.patient?.custom_unique_id}
                        />

                        {/* EMail */}
                        <InfoContainer
                            iconName={"md-mail-outline"}
                            title={labels["email"]}
                            content={UserDetails?.patient?.email}
                            status={UserDetails?.patient?.email_verified_at}
                        />

                        {/* Contact Number */}
                        <InfoContainer
                            iconName={"md-call-outline"}
                            title={labels["contact-number"]}
                            content={UserDetails?.patient?.contact_number}
                        />

                        {/* Address */}
                        <InfoContainer
                            iconName={"location-outline"}
                            title={labels["full-address"]}
                            content={UserDetails?.patient?.full_address}
                        />

                        {/* Patient Type */}
                        <View>
                            <View style={{ flexDirection: "row", marginTop: 0 }}>
                                <Icon style={{ marginRight: 15, marginTop: 20 }} name={"ellipsis-vertical-sharp"} color={Colors.black} size={20} />
                                <View style={{
                                    flex: 1,
                                    borderBottomColor: Colors.placeholderTextColor,
                                    borderBottomWidth: 0,
                                    paddingVertical: 10
                                }}>
                                    <Text style={{ ...styles.descriptionText, }}>{labels["patient-type"]}</Text>

                                    <Text style={styles.contentText}>{
                                        UserDetails?.patient?.patient_types?.map((item) => {
                                            return (
                                                <View key={item.id} >
                                                    <View>
                                                        <Text style={{ ...styles.contentText, paddingHorizontal: 5, backgroundColor: Colors.ultraLightProPrimary, borderRadius: 10, marginTop: 5, }}>{item?.designation} </Text>
                                                    </View>
                                                </View>
                                            )
                                        })
                                        ?? "N/A"}</Text>
                                </View>
                            </View>
                        </View>


                    </View>
                </View>

                {/* ---------Basic Details--------- */}
                <View style={{
                    ...styles.detailsContainer,
                    marginBottom: 20,

                }} >
                    <TouchableOpacity
                        style={{ ...styles.overview, }}
                        onPress={() => setShowBasicDetails(!showBasicDetails)} >
                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                            <Text style={styles.overviewText}>{labels["Details"]}</Text>
                        </View>
                        <Icon name={!showBasicDetails ? 'chevron-down' : 'chevron-up'} color={Colors.black} size={25} />
                    </TouchableOpacity>

                    <View style={{ display: !showBasicDetails ? "none" : "flex" }}>
                        {
                            UserDetails?.category?.name
                                ? <InfoContainer
                                    iconName={"list-outline"}
                                    title={labels["category"]}
                                    content={UserDetails?.category?.name}
                                /> : null
                        }

                        {
                            UserDetails?.subcategory?.name
                                ? <InfoContainer
                                    iconName={"ellipsis-vertical-sharp"}
                                    title={labels["subcategory"]}
                                    content={UserDetails?.subcategory?.name}
                                /> : null
                        }

                        {
                            UserDetails?.branch?.name
                                ? <InfoContainer
                                    iconName={"ios-tablet-landscape-sharp"}
                                    title={labels["branch"]}
                                    content={UserDetails?.branch?.name}
                                /> : null
                        }

                        {
                            UserDetails?.date_time
                                ? <InfoContainer
                                    iconName={"calendar-outline"}
                                    title={labels["date-time"]}
                                    content={UserDetails?.date_time}
                                /> : null
                        }

                        {
                            UserDetails?.created_at
                                ? <InfoContainer
                                    iconName={"calendar-outline"}
                                    title={labels["created_at"]}
                                    content={reverseFormatDate(UserDetails?.created_at)}
                                /> : null
                        }


                        {
                            UserDetails?.edited_date
                                ? <InfoContainer
                                    iconName={"calendar-outline"}
                                    title={labels["edited-date"]}
                                    content={UserDetails?.edited_date}
                                    hideBottomLine={true}
                                /> : null
                        }

                    </View>
                </View>

                {/* ---------RelatedFactor--------- */}
                <View style={{
                    ...styles.detailsContainer,
                    marginBottom: 20,
                }} >
                    <TouchableOpacity
                        style={{ ...styles.overview, }}
                        onPress={() => setShowRelatedFactor(!showRelatedFactor)} >
                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                            <Text style={styles.overviewText}>{labels["related-factor"]}</Text>
                        </View>
                        <Icon name={!showRelatedFactor ? 'chevron-down' : 'chevron-up'} color={Colors.black} size={25} />
                    </TouchableOpacity>
                    <View style={{ display: !showRelatedFactor ? "none" : "flex" }}>

                        <View style={{ width: "100%", minHeight: 300, marginTop: 10 }}>
                            <View style={{ width: "100%", justifyContent: "center", alignItems: "center" }}>
                                <Image source={UserDetails?.follow_up_image ? { uri: UserDetails?.follow_up_image } : { uri: "https://aceuss.3mad.in/uploads/1652529096-39896.png" }} style={{ width: 300, height: 300 }} />
                            </View>
                        </View>
                    </View>
                </View>

                {/* ---------Descriptions--------- */}
                <View style={{
                    ...styles.detailsContainer,
                    marginBottom: 20,

                }} >
                    <TouchableOpacity
                        style={{ ...styles.overview, }}
                        onPress={() => setShowDescriptions(!showDescriptions)} >
                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                            <Text style={styles.overviewText}>{labels["descriptions"]}</Text>
                        </View>
                        <Icon name={!showDescriptions ? 'chevron-down' : 'chevron-up'} color={Colors.black} size={25} />
                    </TouchableOpacity>

                    <View style={{ display: !showDescriptions ? "none" : "flex" }}>


                        <View style={{}}>
                            <Text style={{ ...styles.descriptionText, textAlign: "left" }}>{UserDetails?.description}</Text>
                        </View>

                    </View>
                </View>


                {/* ---------immediate_action--------- */}
                <View style={{
                    ...styles.detailsContainer,
                    marginBottom: 20,

                }} >
                    <TouchableOpacity
                        style={{ ...styles.overview, }}
                        onPress={() => setShowImmediateAction(!showImmediateAction)} >
                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                            <Text style={styles.overviewText}>{labels["immediate-action"]}</Text>
                        </View>
                        <Icon name={!showImmediateAction ? 'chevron-down' : 'chevron-up'} color={Colors.black} size={25} />
                    </TouchableOpacity>

                    <View style={{ display: !showImmediateAction ? "none" : "flex" }}>


                        <View style={{}}>
                            <Text style={{ ...styles.descriptionText, textAlign: "left" }}>{UserDetails?.immediate_action}</Text>
                        </View>

                    </View>
                </View>

                {/* ---------probable_cause--------- */}
                <View style={{
                    ...styles.detailsContainer,
                    marginBottom: 20,

                }} >
                    <TouchableOpacity
                        style={{ ...styles.overview, }}
                        onPress={() => setShowProbableCause(!showProbableCause)} >
                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                            <Text style={styles.overviewText}>{labels["probable-cause-of-the-incident"]}</Text>
                        </View>
                        <Icon name={!showProbableCause ? 'chevron-down' : 'chevron-up'} color={Colors.black} size={25} />
                    </TouchableOpacity>

                    <View style={{ display: !showProbableCause ? "none" : "flex" }}>


                        <View style={{}}>
                            <Text style={{ ...styles.descriptionText, textAlign: "left" }}>{UserDetails?.probable_cause_of_the_incident}</Text>
                        </View>

                    </View>
                </View>


                {/* ---------suggestion_to--------- */}
                <View style={{
                    ...styles.detailsContainer,
                    marginBottom: 20,

                }} >
                    <TouchableOpacity
                        style={{ ...styles.overview, }}
                        onPress={() => setShowSuggestion(!showSuggestion)} >
                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                            <Text style={styles.overviewText}>{labels['suggestion']}</Text>
                        </View>
                        <Icon name={!showSuggestion ? 'chevron-down' : 'chevron-up'} color={Colors.black} size={25} />
                    </TouchableOpacity>

                    <View style={{ display: !showSuggestion ? "none" : "flex" }}>


                        <View style={{}}>
                            <Text style={{ ...styles.descriptionText, textAlign: "left" }}>{UserDetails?.suggestion_to_prevent_event_again}</Text>
                        </View>

                    </View>
                </View>


            </ScrollView>


        </BaseContainer>
    )
}


export default DeviationDetails;

const styles = StyleSheet.create({
    mainView: {
        flex: 1,
        // paddingHorizontal: Constants.globalPaddingHorizontal,
        backgroundColor: Colors.backgroundColor,
        paddingBottom: 30,

    },
    //
    nextButton: {
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: 40,
        borderRadius: 5,
        backgroundColor: Colors.secondary,
        marginTop: 30,
        // paddingHorizontal: 16,
    },
    imageContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 15,
    },
    profileImg: {
        width: 100,
        height: 100,
        borderRadius: 50,
    },
    usernameText: {
        fontFamily: Assets.fonts.bold,
        fontSize: getProportionalFontSize(23)
    },

    FlatlistCardContainer: {
        width: 120,
        backgroundColor: Colors.white,
        margin: Constants.globalPaddingHorizontal,
        alignItems: "center",
        // shadow
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 15,
        elevation: 15,
        shadowColor: Platform.OS == 'ios' ? Colors.shadowColorIosDefault : Colors.shadowColorAndroidDefault,
        shadowRadius: 6,
        borderRadius: getProportionalFontSize(5),
    },
    FlatlistCardTitle: {
        fontSize: getProportionalFontSize(12),
        fontFamily: Assets.fonts.medium,
        marginVertical: 10,
        color: Colors.black,

    },
    FlatlistCardCount: {
        marginVertical: 20,
        fontSize: getProportionalFontSize(30),
        fontFamily: Assets.fonts.medium,
        color: Colors.black,
    },
    heading: {
        fontFamily: Assets.fonts.regular,
        fontSize: getProportionalFontSize(14)
    },
    inactiveLabel: {
        fontFamily: Assets.fonts.bold,
        fontSize: getProportionalFontSize(12),
        color: Colors.white,
        position: 'absolute',
        right: 20,
        top: 20,
        backgroundColor: Colors.red,
        paddingHorizontal: 10,
        paddingVertical: 1,
        borderRadius: 50
    },
    detailsContainer: {
        // 
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
    overview: {
        // 
        flexDirection: "row",
        width: "100%",
        justifyContent: "space-between",
        alignItems: "center",

    },
    overviewText: {
        // 
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
    contentText: {
        fontFamily: Assets.fonts.regular,
        fontSize: getProportionalFontSize(12),
        lineHeight: 17,
        color: Colors.black
    },
    modalMainView: { backgroundColor: 'transparent', justifyContent: "center", alignItems: "center", paddingHorizontal: 16, minWidth: Dimensions.get("window").width * 1 },
    innerViewforModel: {
        width: '100%', minHeight: 150, backgroundColor: Colors.backgroundColor, paddingBottom: Constants.globalPaddingHorizontal * 2, paddingHorizontal: 16, borderRadius: 20,
    },
})
