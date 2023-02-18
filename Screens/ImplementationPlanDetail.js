import React from 'react'
import { StyleSheet, Text, View, ScrollView, FlatList, TouchableOpacity, Image, Linking } from 'react-native'
import Colors from '../Constants/Colors';
import { useSelector, useDispatch } from 'react-redux';
import { FAB, Provider, Portal } from 'react-native-paper';
import BaseContainer from '../Components/BaseContainer';
import Constants from '../Constants/Constants';
import { firstLetterFromString, formatDateWithTime, formatTime, getProportionalFontSize, formatDate, getJSObjectFromTimeString } from '../Services/CommonMethods';
import APIService from '../Services/APIService';
import Alert from '../Components/Alert';
// icons
import Icon from 'react-native-vector-icons/Ionicons';
import Can from '../can/Can';

const userImage = 'https://st3.depositphotos.com/15648834/17930/v/600/depositphotos_179308454-stock-illustration-unknown-person-silhouette-glasses-profile.jpg'

const ImplementationPlanDetail = (props) => {
    // console.log("itemId+++++++++++++++", props?.route?.params?.itemId)
    const routeParam = props?.route?.params ?? {}
    // REDUX hooks
    const dispatch = useDispatch();
    const isInternetActive = useSelector(state => state.IsInternetActive);
    const UserLogin = useSelector(state => state.User.UserLogin);
    const labels = useSelector(state => state.Labels);
    const week_days_labels = useSelector(state => state.Labels.week_days);
    const implementationPlanFormLabels = useSelector(state => state.Labels);
    const permissions = UserLogin?.permissions ?? {}

    //hooks
    const [ShowBasicDetails, setShowBasicDetails] = React.useState(true);
    const [ShowOverallGoal, setShowOverallGoal] = React.useState(false);
    const [ShowRelatedFactors, setShowRelatedFactors] = React.useState(false);
    const [ShowTreatment, setShowTreatment] = React.useState(false);
    const [subCategoryDetails, setShowSubCategoryDetails] = React.useState(false);
    const [showPerson, setShowPerson] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(true);
    const [ipValues, setIPValues] = React.useState();
    const [personList, setPersonList] = React.useState([]);
    const [fullIpDetail, setFullIpDetail] = React.useState(null);
    const [ipUserId, setIpUserId] = React.useState()
    const fabActionButtons = [];
    if (
        Can(Constants.permissionsKey.ipBrowse, permissions)
    ) {
        fabActionButtons.push({
            icon: 'history',
            label: labels.view_edit_history,
            onPress: () => {
                ipUserId
                    ? props.navigation.navigate('IpEditHistory', { parent_id: ipUserId })
                    : Alert.showAlert(Constants.warning, labels.history_not_available)
            },
            small: false,
        })
    }
    if (
        Can(Constants.permissionsKey.followupBrowse, permissions)
    ) {
        fabActionButtons.push({
            icon: 'human-wheelchair',
            label: labels.create_follow_up,
            onPress: () => { props.navigation.navigate('FollowUpListing', { IPId: routeParam?.itemId, implementationName: fullIpDetail?.title }) },
            small: false,
        })
    }
    //fab btn Group
    const [fabButton, setFabButton] = React.useState({ open: false });
    const onFabStateChange = ({ open }) => setFabButton({ open });
    const { open } = fabButton;

    React.useEffect(() => {
        // console.log('routeParam---------', routeParam)
        getIPDetails(routeParam?.itemId)
    }, []);

    React.useEffect(() => {
        const unsubscribe = props.navigation.addListener('focus', () => {
            // console.log('Focus___________________________________________')
            // console.log('routeParam---------', routeParam)
            getIPDetails(routeParam?.itemId)
        });
        // Return the function to unsubscribe from the event so it gets removed on unmount
        return unsubscribe;
    }, [props.navigation]);

    const getIPDetails = async (ipId) => {
        setIsLoading(true);
        let url = Constants.apiEndPoints.implementationPlan + "/" + ipId;

        let response = await APIService.getData(url, UserLogin.access_token, null, "IPDetailAPI");
        setIpUserId(response.data.payload.parent_id)
        // console.log("response.data.payload.parent_id", response.data.payload.parent_id)
        if (!response.errorMsg) {
            let tempSubCategory = response?.data?.payload?.subcategory
            tempSubCategory['ipForm'] = {
                "what_happened": response?.data?.payload?.what_happened,
                "how_it_happened": response?.data?.payload?.how_it_happened,
                "when_it_started": response?.data?.payload?.when_it_started,
                "what_to_do": response?.data?.payload?.what_to_do,
                "goal": response?.data?.payload?.goal,
                "sub_goal": response?.data?.payload?.sub_goal,
                "plan_start_date": response?.data?.payload?.plan_start_date,
                "plan_start_time": response?.data?.payload?.plan_start_time,
                "remark": response?.data?.payload?.remark,
                "activity_message": response?.data?.payload?.activity_message,
                "save_as_template": response?.data?.payload?.save_as_template == 1 ? true : false,
                "assign_employee": response?.data?.payload?.assign_employee ? true : false,
                "employee": response?.data?.payload?.assign_employee?.employee ?? {},
                "plan_end_date": response?.data?.payload?.end_date
            }
            let tempPayload = response?.data?.payload

            let tempWho_give_supportArr = []
            let tempWho_give_support = ''

            if (tempPayload?.who_give_support) {
                tempWho_give_supportArr = await JSON.parse(tempPayload?.who_give_support);
            }
            tempWho_give_supportArr?.map((item, index) => {
                if ((index + 1) == tempWho_give_supportArr.length)
                    tempWho_give_support = tempWho_give_support + item
                else
                    tempWho_give_support = tempWho_give_support + item + ", "
            })

            let temp_week_daysArr = []
            let temp_week_days = ''

            if (tempPayload?.week_days) {
                temp_week_daysArr = await JSON.parse(tempPayload?.week_days);
            }
            temp_week_daysArr.map((item, index) => {
                if ((index + 1) == temp_week_daysArr.length)
                    temp_week_days = temp_week_days + week_days_labels[item]
                else
                    temp_week_days = temp_week_days + week_days_labels[item] + ", "
            })

            tempPayload['who_give_support'] = tempWho_give_support
            tempPayload['week_days'] = temp_week_days

            temp_week_days
            setFullIpDetail(tempPayload)
            setPersonList(response?.data?.payload?.persons)
            setIPValues({
                ...ipValues,
                category: response?.data?.payload?.category,
                subcategory: [tempSubCategory],
                patient: response?.data?.payload?.patient,
            })
            setIsLoading(false);
        }
        else {
            setIsLoading(false);
            Alert.showAlert(Constants.danger, response.errorMsg);
        }
    }

    const getPdfLink = async (sign) => {
        let id = routeParam?.itemId;
        setIsLoading(true)
        let params = {
            sign: sign
        }
        let url = Constants.apiEndPoints.ipFollowupsPrint + "/" + id;
        // console.log('params=========>>>>>', JSON.stringify(params))
        // console.log('url=========>>>>>', url)
        let response = await APIService.postData(url, params, UserLogin.access_token, null, "WordsList");
        //console.log(JSON.stringify(response.data.payload.url))
        if (!response.errorMsg) {
            let pdfUrl = response.data.payload.url
            // console.log("pdfUrl+++++++++", pdfUrl)
            await Linking.openURL(pdfUrl);
            // const supported = await Linking.canOpenURL(pdfUrl);
            setIsLoading(false)
            // if (supported) {
            //     await Linking.openURL(pdfUrl);
            // } else {
            //     setIsLoading(false)
            //     // Alert.alert(`Don't know how to open this URL: ${pdfUrl}`);
            //     console.log(`Don't know how to open this URL: ${pdfUrl}`);
            // }
        }
        else {
            setIsLoading(false)
            // console.log("error in api")
        }
    }

    const continueToSignIpWithYes = () => {
        getPdfLink("Yes")
    }
    const continueToSignIpWithNo = () => {
        getPdfLink("No")
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

    //render
    //console.log('ipval--', JSON.stringify(ipValues))
    if (isLoading)
        return <ProgressLoader />

    return (

        <BaseContainer
            onPressLeftIcon={() => { props.navigation.goBack() }}
            leftIcon="arrow-back"
            leftIconSize={24}
            title={labels["ip-details"]}
            leftIconColor={Colors.primary}
        >
            {/* Main View */}
            <ScrollView
                style={styles.mainView}
                showsVerticalScrollIndicator={false}
            >

                {/* implementation plan title */}
                <Text style={[styles.headerText, { textAlign: "center", marginTop: Constants.formFieldTopMargin, color: Colors.primary }]}>{fullIpDetail.title}</Text>

                {/* ---------basic details--------- */}
                <View style={styles.detailsContainer} >
                    <TouchableOpacity
                        style={styles.header}
                        onPress={() => setShowBasicDetails(!ShowBasicDetails)} >
                        <Text style={styles.headerText}>{labels["patientAndhabitatsDetails"]}</Text>
                        <Icon name={!ShowBasicDetails ? 'chevron-down' : 'chevron-up'} color={Colors.black} size={25} />
                    </TouchableOpacity>
                    <View style={{ display: !ShowBasicDetails ? "none" : "flex" }}>
                        {/* patient */}
                        <InfoContainer
                            iconName={"md-mail-outline"}
                            title={labels["patient"]}
                            content={ipValues?.patient?.name}
                        />
                        {/* category */}
                        <InfoContainer
                            iconName={"md-call-outline"}
                            title={labels["category"]}
                            content={ipValues?.category?.name}
                        />
                        {/* subcategory */}
                        <InfoContainer
                            iconName={"location-outline"}
                            title={labels["subcategory"]}
                            content={ipValues?.subcategory[0]?.name}
                        />
                    </View>
                </View>



                {/* --------IP details--------- */}
                <View style={styles.detailsContainer} >
                    <TouchableOpacity
                        style={styles.header}
                        onPress={() => setShowSubCategoryDetails(!subCategoryDetails)} >
                        <Text style={styles.headerText}>{labels["ip-details"]}</Text>
                        <Icon name={!subCategoryDetails ? 'chevron-down' : 'chevron-up'} color={Colors.black} size={25} />
                    </TouchableOpacity>
                    <View style={{ display: !subCategoryDetails ? "none" : "flex" }}>

                        {/* what_happened */}
                        {/* <InfoContainer
                            // iconName={"md-mail-outline"}
                            title={labels["what-happened"]}
                            content={ipValues?.subcategory[0]?.ipForm?.what_happened}
                        /> */}

                        {/* how_it_happened */}
                        {/* <InfoContainer
                            // iconName={"md-call-outline"}
                            title={labels.how_it_happened}
                            content={ipValues?.subcategory[0]?.ipForm?.how_it_happened}
                        /> */}

                        {/* when_it_started */}
                        {/* <InfoContainer
                            // iconName={"location-outline"}
                            title={labels.when_it_started}
                            content={ipValues?.subcategory[0]?.ipForm?.when_it_started}
                        /> */}

                        {/* what_to_do */}
                        {/* <InfoContainer
                            // iconName={"location-outline"}
                            title={labels.what_to_do}
                            content={ipValues?.subcategory[0]?.ipForm?.what_to_do}
                        /> */}

                        {/* goal */}
                        <InfoContainer
                            iconName={"ios-apps"}
                            title={labels["goal"]}
                            content={ipValues?.subcategory[0]?.ipForm?.goal}
                        />
                        {/* sub_goal */}
                        <InfoContainer
                            iconName={"reorder-three-outline"}
                            title={labels["sub-goal"]}
                            content={ipValues?.subcategory[0]?.ipForm?.sub_goal}
                        />

                        {/* sub goal selected*/}
                        <InfoContainer
                            iconName={"checkmark-circle-sharp"}
                            title={labels['selected-sub-goal']}
                            content={implementationPlanFormLabels[fullIpDetail.sub_goal_selected]}
                        />

                        {/* sub goal detail*/}
                        <InfoContainer
                            iconName={"reader-outline"}
                            title={labels["sub-goal-info"]}
                            content={fullIpDetail.sub_goal_details}
                        />

                        {/* Limitation */}
                        <InfoContainer
                            iconName={"ios-alert-circle-outline"}
                            title={labels["limitations"]}
                            content={fullIpDetail.limitations ? labels[fullIpDetail.limitations] : null}
                        />

                        {/* Limitation detail */}
                        <InfoContainer
                            iconName={"newspaper-outline"}
                            title={labels["limitation-info"]}
                            content={fullIpDetail.limitation_details}
                        />

                        {/* how support should be given */}
                        <InfoContainer
                            iconName={"md-help"}
                            title={labels["how-support-should-be-given"]}
                            content={fullIpDetail.how_support_should_be_given}
                        />

                        {/* when during the day */}
                        {/* <InfoContainer
                            // iconName={"location-outline"}
                            title={labels.when_during_the_day}
                            content={fullIpDetail.when_during_the_day}
                        /> */}

                        {/* who give support */}
                        <InfoContainer
                            iconName={"md-help-circle-outline"}
                            title={labels["who-should-give-the-support"]}
                            content={fullIpDetail.who_give_support}
                        />
                        {/* week days */}
                        {/* <InfoContainer
                            // iconName={"location-outline"}
                            title={labels.week_days}
                            content={fullIpDetail.week_days}
                        /> */}

                        {/* start_date */}
                        <InfoContainer
                            iconName={"time-outline"}
                            title={labels['plan-start-date']}
                            content={fullIpDetail.start_date}
                        />

                        {/* plan_start_time */}
                        {/* <InfoContainer
                            // iconName={"location-outline"}
                            title={labels.plan_start_time}
                            content={formatTime(getJSObjectFromTimeString(ipValues?.subcategory[0]?.ipForm?.plan_start_time))}
                        /> */}

                        {/* remark */}
                        {/* <InfoContainer
                            // iconName={"location-outline"}
                            title={labels.remark}
                            content={ipValues?.subcategory[0]?.ipForm?.remark}
                        /> */}

                        {/* activity_message */}
                        {/* <InfoContainer
                            // iconName={"location-outline"}
                            title={labels.activity_message}
                            content={ipValues?.subcategory[0]?.ipForm?.activity_message}
                        /> */}

                        {/* employee */}
                        <InfoContainer
                            iconName={"md-people-sharp"}
                            title={labels["employees"]}
                            content={ipValues?.subcategory[0]?.ipForm?.employee?.name}
                        />

                        {/* plan_end_date */}
                        <InfoContainer
                            iconName={"time-sharp"}
                            title={labels["plan-end-date"]}
                            content={fullIpDetail.end_date}
                        />
                    </View>
                </View>

                {/* over all goal */}
                <View style={styles.detailsContainer} >
                    <TouchableOpacity
                        style={styles.header}
                        onPress={() => setShowOverallGoal(!ShowOverallGoal)} >
                        <Text style={styles.headerText}>{labels["overall-goal"]}</Text>
                        <Icon name={!ShowOverallGoal ? 'chevron-down' : 'chevron-up'} color={Colors.black} size={25} />
                    </TouchableOpacity>
                    <View style={{ display: !ShowOverallGoal ? "none" : "flex" }}>
                        {/*  Overall Goal */}
                        <InfoContainer
                            // iconName={"md-mail-outline"}
                            title={labels["overall-goal"]}
                            content={labels[fullIpDetail.overall_goal]}
                        />
                        {/* overall goal detail */}
                        <InfoContainer
                            // iconName={"md-call-outline"}
                            title={labels["overall-goal-details"]}
                            content={fullIpDetail?.overall_goal_details}
                        />
                    </View>
                </View>

                {/* realted factors*/}
                <View style={styles.detailsContainer} >
                    <TouchableOpacity
                        style={styles.header}
                        onPress={() => setShowRelatedFactors(!ShowRelatedFactors)} >
                        <Text style={styles.headerText}>{labels["related-factor"]}</Text>
                        <Icon name={!ShowRelatedFactors ? 'chevron-down' : 'chevron-up'} color={Colors.black} size={25} />
                    </TouchableOpacity>
                    <View style={{ display: !ShowRelatedFactors ? "none" : "flex" }}>

                        {/*  body functions */}
                        <InfoContainer
                            // iconName={"md-mail-outline"}
                            title={labels["body-functions"]}
                            content={fullIpDetail.body_functions}
                        />
                        {/* personal factors*/}
                        <InfoContainer
                            // iconName={"md-call-outline"}
                            title={labels["personal-factors"]}
                            content={fullIpDetail.personal_factors}
                        />
                        {/*  health conditions */}
                        <InfoContainer
                            // iconName={"md-mail-outline"}
                            title={labels["health-conditions"]}
                            content={fullIpDetail.health_conditions}
                        />
                        {/* other factors */}
                        <InfoContainer
                            // iconName={"md-call-outline"}
                            title={labels["other-factors"]}
                            content={fullIpDetail.other_factors}
                        />
                    </View>
                </View>

                {/*Treatment and working methods */}
                <View style={styles.detailsContainer} >
                    <TouchableOpacity
                        style={styles.header}
                        onPress={() => setShowTreatment(!ShowTreatment)} >
                        <Text style={styles.headerText}>{labels["treatment"]}</Text>
                        <Icon name={!ShowTreatment ? 'chevron-down' : 'chevron-up'} color={Colors.black} size={25} />
                    </TouchableOpacity>
                    <View style={{ display: !ShowTreatment ? "none" : "flex" }}>

                        {/*  treatment */}
                        <InfoContainer
                            // iconName={"md-mail-outline"}
                            title={labels["treatment"]}
                            content={fullIpDetail.treatment}
                        />
                        {/* working method*/}
                        <InfoContainer
                            // iconName={"md-call-outline"}
                            title={labels["working_method"]}
                            content={fullIpDetail.working_method}
                        />
                    </View>
                </View>

                {/* ---------Person--------- */}
                <View style={{
                    ...styles.detailsContainer,
                    // marginBottom: 70,
                }} >
                    <TouchableOpacity
                        style={{ ...styles.header, }}
                        onPress={() => setShowPerson(!showPerson)} >
                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                            <Text style={styles.headerText}>{labels["persons"]}</Text>
                            <View style={styles.countLabel}>
                                <Text style={styles.countLabelText}>{personList.length}</Text>
                            </View>
                        </View>
                        <Icon name={!showPerson ? 'chevron-down' : 'chevron-up'} color={Colors.black} size={25} />
                    </TouchableOpacity>
                    <View style={{ display: !showPerson ? "none" : "flex" }}>
                        {
                            personList.map((item) => {
                                return (
                                    <View key={item.id} style={{ flexDirection: 'row', alignItems: "center", marginTop: 10 }}>
                                        <View>
                                            <Image source={{ uri: userImage }} style={{ width: 25, height: 25, marginRight: 20 }} />
                                        </View>
                                        <View>
                                            <Text style={styles.descriptionText}>{item?.name}</Text>
                                            <View style={{ flexDirection: "row" }}>
                                                {item?.is_family_member ? <Text style={styles.contentText}>{labels["is-family-member"]},</Text> : null}
                                                {item?.is_caretaker ? <Text style={styles.contentText}> {labels["is-caretaker"]},</Text> : null}
                                                {item?.is_contact_person ? <Text style={styles.contentText}> {labels["is-contact-person"]}</Text> : null}
                                            </View>
                                        </View>
                                    </View>
                                )
                            })
                        }
                    </View>
                </View>

                {/* sign ip */}
                {props?.route?.params?.showHistoryBtn
                    ? <TouchableOpacity
                        // activeOpacity={FollowUpsValues.is_completed ? 1 : 0}
                        onPress={() => {
                            Alert.showBasicDoubleAlertForBoth(labels.proceed, continueToSignIpWithYes, continueToSignIpWithNo)
                        }}
                        style={styles.iconButton}>
                        <Text style={styles.normal_text}>{labels.mobile_sign_ip}</Text>
                        <Icon style={{}} name={'arrow-forward-outline'} color={Colors.white} size={30} />
                    </TouchableOpacity> : null}

                {/* create follow up */}
                {props?.route?.params?.showHistoryBtn
                    ? <TouchableOpacity
                        // activeOpacity={FollowUpsValues.is_completed ? 1 : 0}
                        onPress={() => {
                            props.navigation.navigate('IPFollowUpScreen', { IPId: fullIpDetail?.id, implementationName: fullIpDetail?.title })
                        }}
                        style={styles.iconButton}>
                        <Text style={styles.normal_text}>{labels.create_followups}</Text>
                    </TouchableOpacity> : null}

                {/* create activity */}
                {props?.route?.params?.showHistoryBtn
                    ? <TouchableOpacity
                        // activeOpacity={FollowUpsValues.is_completed ? 1 : 0}
                        onPress={() => {
                            props.navigation.navigate('ActivityStack', {
                                screen: "AddActivity",
                                params: {
                                    IPId: fullIpDetail?.id,
                                    patientID: fullIpDetail?.patient?.id
                                }
                            })
                        }}
                        style={styles.iconButton}>
                        <Text style={styles.normal_text}>{labels["add-activity"]}</Text>
                    </TouchableOpacity> : null}

            </ScrollView>

            {/* FLOATING ADD BUTTON */}
            {/* {
                props?.route?.params?.showHistoryBtn ? (
                    <>
                        <FAB
                            style={styles.fab}
                            color={Colors.white}
                            size={20}
                            // icon="plus"
                            label={labels.view_edit_history}
                            onPress={() => { props.navigation.navigate('IpEditHistory', { parent_id: ipUserId }) }}
                        />
                        <FAB
                            style={styles.fab}
                            color={Colors.white}
                            size={20}
                            // icon="plus"
                            label={labels.create_follow_up}
                            onPress={() => { props.navigation.navigate('IPFollowForm', {}) }}
                        />
                    </>
                ) : null
            } */}




            {props?.route?.params?.showHistoryBtn ? <Provider>
                <Portal>
                    <FAB.Group
                        //style={styles.fab}
                        fabStyle={{ backgroundColor: Colors.primary }}
                        open={open}
                        icon={open ? 'close' : 'arrow-up-bold-box'}
                        color={Colors.white}
                        actions={fabActionButtons}
                        onStateChange={onFabStateChange}
                        onPress={() => {
                            if (open) {
                                // console.log("close btn group")
                            }
                        }}
                    />
                </Portal>
            </Provider> : null}
        </BaseContainer>
    )
}

export default ImplementationPlanDetail

const styles = StyleSheet.create({
    mainView: {
        // flex: 1,
        paddingHorizontal: Constants.globalPaddingHorizontal,
        backgroundColor: Colors.backgroundColor,
        paddingBottom: 40
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
        fontFamily: Assets.fonts.bold,
        fontSize: getProportionalFontSize(16),
        color: Colors.white,
    },
})