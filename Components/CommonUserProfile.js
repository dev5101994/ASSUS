import { StyleSheet, Text, View, Dimensions, TouchableOpacity, Image, ScrollView, FlatList, ImageBackground } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Colors from '../Constants/Colors';
import { getProportionalFontSize, formatTime, formatDateByFormat, formatDate, reverseFormatDate, getJSObjectFromTimeString } from '../Services/CommonMethods';
import Assets from '../Assets/Assets';
import React, { useState, useCallback } from 'react';
import Constants from '../Constants/Constants';
import { Divider, Portal, Modal } from 'react-native-paper';
import Alert from '../Components/Alert';
import APIService from '../Services/APIService'
//redux
import { useSelector, useDispatch } from 'react-redux';
import CustomButton from './CustomButton';
import BaseContainer from '../Components/BaseContainer';
import { BarChart, LineChart } from "react-native-chart-kit";
import moment from 'moment';
import Entypo from 'react-native-vector-icons/Entypo';

const { width, height } = Dimensions.get("window")

const CommonUserProfile = (props) => {
    const { fromDrawer } = props?.route?.params
    const { fromCompanyListing } = props?.route?.params
    const routeParams = props?.route?.params ?? {}

    const [UserDetails, setUserDetails] = React.useState([])
    const [personalDetails, setShowPersonalDetails] = React.useState(true)
    const [showRegistrationDetails, setShowRegistrationDetails] = React.useState(false)
    const [showPackageDetails, setShowPackageDetails] = React.useState(false)
    const [itemId, setItemId] = React.useState('')
    const [isItemFound, setIsItemFound] = React.useState(false)
    const [isLoading, setIsLoading] = React.useState(true);
    const [showFamily, setShowFamily] = React.useState(false);
    const [disabilityDetails, setDisabilityDetails] = React.useState(false);
    const [studiesWork, setStudiesWork] = React.useState(false);
    const [otherActivities, setOtherActivities] = React.useState(false);
    const [decisionsDocuments, setDecisionsDocuments] = React.useState(false);
    const [isModalVisible, setIsModalVisible] = React.useState(false);
    const [personsIndex, setPersonsIndex] = React.useState(0)
    const [chartDate, setChartData] = React.useState({})
    const [chartLabels, setChartLabels] = React.useState([])
    const [param, setParam] = React.useState({
        "patient_id": null,
        "data_of": 7, // days 1, 7, 30
        "start_date": null,
        "end_date": null
    })

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

        } else if (props?.route?.params?.fromDrawer) {
            // current user details
            // console.log("UserLogin-------", UserLogin)
            setUserDetails([])
            setIsLoading(false);
        } else {
            Alert.showBasicAlert("something went wrong", () => props.navigation.pop())
        }

        if (fromCompanyListing) {
            companyChartDataAPI(null, props?.route?.params?.itemId)
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
            console.log("payload getUserDetails", response.data.payload);
            // console.log("payload getUserDetails", response.data);
            setUserDetails({ ...response.data.payload, modules: response.data?.payload?.module_list ?? [], package: response.data?.payload?.subscription?.package_details ?? "" })
            // console.log("data", response.data.success);
            setIsLoading(false);
        }
        else {
            setIsLoading(false);
            Alert.showAlert(Constants.danger, response.errorMsg);
        }
    }

    {/* Chart Api */ }
    const companyChartDataAPI = async (data, itemId) => {
        if (UserDetails?.user_type_id != 2) {
            return
        }
        let params = {
            "patient_id": param.patient_id ?? null,
            "data_of": data ?? 7, // days 1, 7, 30
            "start_date": param.start_date ?? null,
            "end_date": param.end_date ?? null
        }

        let uri = Constants.apiEndPoints.companyStats;
        let url = uri + "/" + itemId;
        // console.log("url", url);
        // console.log("params", params);
        setIsLoading(true)
        let response = await APIService.postData(url, params, UserLogin.access_token, null, "companyChartDataAPI");
        // return
        // console.log("response", JSON.stringify(response))
        if (!response.errorMsg) {

            let temp = []
            if (response.data.payload.date_labels) {
                response.data.payload.date_labels.map((data, i) => {
                    let date = moment(data).format("DDMMMM");
                    temp.push(date)
                    // console.log("date.............", date)
                })
            }
            setChartLabels([])
            setChartData({ ...response.data.payload, labels: temp })
            setIsLoading(false)
        }
        else {
            Alert.showAlert(Constants.danger, response.errorMsg)
        }
    }

    const renderItemForLineChart = ({ item }) => {
        return (
            <View style={{ flexDirection: "row", minWidth: getProportionalFontSize(110) }}>
                <Entypo name={'dot-single'} color={item.color} size={20} />
                <Text style={{ fontFamily: Assets.fonts.regular, color: item.color, fontSize: getProportionalFontSize(10) }}>{item.name}</Text>
            </View>
        )
    }
    const RenderFilterText = ({ label, last, onPress, color }) => (
        <TouchableOpacity
            onPress={onPress}
            style={{ borderRightWidth: !last ? 1 : 0, paddingHorizontal: 15 }} >
            <Text style={{ fontFamily: Assets.fonts.bold, color: color, fontSize: getProportionalFontSize(10), }}>
                {label}
            </Text>
            {/* <Icon name='chevron-down' /> */}
        </TouchableOpacity>
    )


    const RenderChartItems = ({ item, dateLabel, dataColor, chartName }) => {

        return (
            <View style={styles.chartContainer}>
                <Text style={{ fontFamily: Assets.fonts.regular, color: Colors.black, fontSize: getProportionalFontSize(13) }}>{chartName}</Text>
                <View style={{ width: "100%", flexDirection: "row", justifyContent: "flex-end", }}>
                    <View style={{ flexDirection: "row", minWidth: getProportionalFontSize(110) }}>
                        <Entypo name={'dot-single'} color={dataColor ?? Colors.primary} size={20} />
                        <Text style={{ fontFamily: Assets.fonts.regular, color: dataColor ?? Colors.primary, fontSize: getProportionalFontSize(10) }}>{dateLabel}</Text>
                    </View>
                </View>
                {console.log("from chart_______________")}

                <BarChart
                    data={{
                        labels: chartDate.labels,
                        datasets: [{
                            data: [...item],
                        },],
                        // legend: ['Maths', 'SOM', 'DS'],
                    }}
                    width={Dimensions.get("window").width - Constants.globalPaddingHorizontal * 4} // from react-native
                    height={220}
                    fromZero={true}
                    // yAxisLabel="$"
                    // yAxisSuffix="k"
                    yAxisInterval={1} // optional, defaults to 1
                    // horizontalLabelRotation={"45"}
                    // verticalLabelRotation={-15}
                    showValuesOnTopOfBars={true}
                    chartConfig={{
                        backgroundGradientFrom: Colors.white,
                        backgroundGradientTo: Colors.white,
                        barPercentage: 0.7,
                        height: 5000,
                        fillShadowGradient: dataColor ?? Colors.primary,
                        fillShadowGradientOpacity: 1,
                        decimalPlaces: 0, // optional, defaults to 2dp
                        color: (opacity = 1) => dataColor ?? Colors.primary,
                        labelColor: (opacity = 1) => Colors.black,

                        style: {
                            borderRadius: 16,
                            fontFamily: Assets.fonts.medium,
                        },
                        propsForBackgroundLines: {
                            strokeWidth: 1,
                            stroke: Colors.shadowColorIosPrimary,
                            strokeDasharray: "0",
                            // translateX:20
                            x1: 20
                        },
                        propsForLabels: {
                            fontFamily: Assets.fonts.medium,
                            fontSize: getProportionalFontSize(10)
                        },

                    }}
                    bezier
                    style={{ paddingHorizontal: 5, marginLeft: -10 }}
                />
            </View >
        )
    }
    // All Chart components ends here 

    const InfoContainer = (props) => {
        const { iconName, title, content } = props;
        return (
            // <View>
            //     <View style={{ flexDirection: "row", marginTop: 20, alignItems: 'center' }}>
            //         <Icon style={{ marginRight: 5 }} name={iconName} color={Colors.black} size={17} />
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

    const renderItemForHorizontalList = (title, count = "0") => (
        <View style={styles.FlatlistCardContainer}>
            <Text style={styles.FlatlistCardTitle}>{title}</Text>
            <Divider style={{ color: Colors.black, width: "100%", height: 1 }} />
            <Text style={styles.FlatlistCardCount}>
                {count}
            </Text>
        </View>
    )

    const onRequestClose = () => {
        // console.log('onRequestClose called')
        setIsModalVisible(false);
    }

    // console.log("out of loop", UserDetails ? 1 : 2  ) 
    // console.log("cUserLogin?.avatar", UserLogin?.avatar)
    // Render view
    if (isLoading)
        return <ProgressLoader />

    return (
        <BaseContainer
            title={labels["profile"]}
            leftIcon="arrow-back"
            leftIconColor={Colors.primary}
            onPressLeftIcon={() => { props.navigation.pop() }}
            titleStyle={{ marginStart: 5 }}
            rightIcon={props?.route?.params?.itemId ? "" : "edit"}
            rightIconColor={Colors.primary}
            onPressRightIcon={() => { props.navigation.navigate("EditUserProfile", { user_type_id: 2 }) }}
            style={{}}
        >

            {/* Main View */}

            <ScrollView
                style={styles.mainView}
                showsVerticalScrollIndicator={false}
            >
                <ImageBackground
                    source={Assets.images.profileImageBackground}
                    resizeMode="cover"
                    style={{ flex: 1 }}>
                    <View
                        style={styles.imageContainer}>

                        {/* <Image source={{ uri: UserDetails?.image ?? userImage }} style={{ ...styles.profileImg }} /> */}



                        {
                            routeParams.fromDrawer
                                ? <Image
                                    source={{ uri: UserLogin?.avatar ? UserLogin?.avatar : UserLogin?.user_type?.name?.toLowerCase() == "branch" ? Constants.branchIcon : UserLogin?.gender == "female" ? Constants.userImageFemale : Constants.userImageMale }}
                                    style={{ ...styles.profileImg, }}
                                />
                                : <Image
                                    source={{ uri: UserLogin?.avatar ? UserLogin?.avatar : UserDetails?.user_type?.name?.toLowerCase() == "branch" ? Constants.branchIcon : UserDetails?.gender == "female" ? Constants.userImageFemale : Constants.userImageMale }}
                                    style={{ ...styles.profileImg, }}
                                />
                        }


                        <Text style={{ ...styles.usernameText, color: UserDetails?.status == 0 ? Colors.red : Colors.white }}>{fromDrawer ? UserLogin?.name : UserDetails?.name ?? "User_Name"}</Text>
                        {
                            UserDetails?.user_type?.name ? <Text style={styles.heading}>( {UserDetails.user_type.name} )</Text> : null
                        }
                        {
                            UserDetails.status == 0 ? <Text style={styles.inactiveLabel}>{labels["inactive"]}</Text> : null
                        }
                    </View>

                </ImageBackground>


                {/* Vertical scrollbar */}
                {UserDetails?.user_type_id == 2 || UserDetails?.user_type_id == 1 ? (
                    <ScrollView
                        showsHorizontalScrollIndicator={false}
                        horizontal={true}
                    >

                        {renderItemForHorizontalList(labels?.total_employee, UserDetails?.package?.number_of_employees)}
                        {renderItemForHorizontalList(labels?.total_patients, UserDetails?.package?.number_of_patients)}
                        {renderItemForHorizontalList(labels?.total_branches, UserDetails?.total_branches)}
                        {renderItemForHorizontalList(labels?.total_department, UserDetails?.total_branches)}


                    </ScrollView>) : null}


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
                        {/* Description */}

                        {
                            UserDetails.description ? (<View>
                                <Text style={styles.descriptionText}>{labels["description"]}</Text>
                                <TextContent textContent={UserDetails?.description} />
                            </View>) : null
                        }
                        {/* contact-person-name */}
                        {UserDetails?.user_type_id == 2 ? (
                            <InfoContainer
                                iconName={'ios-person-add-outline'}
                                title={labels["contact-person-name"]}
                                content={UserDetails?.contact_person_name ?? "N/A"}
                            />
                        ) : null}

                        {/* EMail */}
                        <InfoContainer
                            iconName={"md-mail-outline"}
                            title={labels["Email"]}
                            content={fromDrawer ? UserLogin?.email : UserDetails?.email}
                            status={UserDetails?.email_verified_at}
                        />
                        {/* created_at */}
                        {UserDetails?.user_type_id == 2 ||
                            fromDrawer ?
                            (
                                <InfoContainer
                                    iconName={'calendar-outline'}
                                    title={labels["created-at"]}
                                    // content={reverseFormatDate(UserDetails?.created_at)}
                                    content={fromDrawer ? reverseFormatDate(UserLogin?.created_at) : reverseFormatDate(UserDetails?.created_at)}
                                />
                            ) : null}

                        {/* Contact Number */}
                        <InfoContainer
                            iconName={"md-call-outline"}
                            title={labels["contact-number"]}
                            content={fromDrawer ? UserLogin?.contact_number : UserDetails?.contact_number}
                        />

                        {/*city */}
                        {UserDetails?.user_type_id == 2 ||
                            fromDrawer ? (
                            <InfoContainer
                                iconName={'contract-sharp'}
                                title={labels["city"]}
                                // content={UserDetails?.city}
                                content={fromDrawer ? UserLogin?.city : UserDetails?.city}
                            />
                        ) : null}

                        {/* country */}
                        {/* {UserDetails?.user_type_id == 2 ||
                            fromDrawer ? (
                            <InfoContainer
                                iconName={'earth'}
                                title={labels["country"]}
                                content={UserDetails?.country?.name}
                            // content={fromDrawer ? UserLogin?.country?.name : UserDetails?.country?.name}
                            />
                        ) : null} */}

                        {/* postal_area */}
                        {UserDetails?.user_type_id == 2 ||
                            fromDrawer ? (
                            <InfoContainer
                                iconName={'funnel-outline'}
                                title={labels["postal-code"]}
                                // content={UserDetails?.postal_area}
                                content={fromDrawer ? UserLogin?.postal_area : UserDetails?.postal_area}
                            />
                        ) : null}

                        {/* zipcode */}
                        {UserDetails?.user_type_id == 2 ||
                            fromDrawer ? (
                            <InfoContainer
                                iconName={'menu'}
                                title={labels["zipcode"]}
                                // content={UserDetails?.zipcode}
                                content={fromDrawer ? UserLogin?.zipcode : UserDetails?.zipcode}
                            />
                        ) : null}

                        {/* Address */}
                        <InfoContainer
                            iconName={"location-outline"}
                            title={labels["full-address"]}
                            content={fromDrawer ? UserLogin?.full_address : UserDetails?.full_address}
                        />

                        {/* personal details*/}
                        {UserDetails?.user_type_id == 9 ? (
                            <InfoContainer
                                iconName={'person-outline'}
                                title={labels["personal-number"]}
                                content={UserDetails?.personal_number}
                            />
                        ) : null}

                        {UserDetails?.user_type_id == 9 ? (
                            <InfoContainer
                                iconName={'business'}
                                title={labels["branch"]}
                                content={UserDetails?.branch?.name}
                            />
                        ) : null}

                        {/* gender */}
                        {UserDetails?.user_type_id == 3 ||
                            UserDetails?.user_type_id == 6 ||

                            UserDetails?.user_type_id == 9 ? (
                            <InfoContainer
                                iconName={'male-female'}
                                title={labels["gender"]}
                                content={UserDetails?.gender}
                                hideBottomLine={UserDetails?.user_type_id == 9 ? true : false}
                            />
                        ) : null}

                        {/* gender */}
                        {/* {
                            UserDetails?.user_type_id == 3 || UserDetails?.user_type_id == 6 ? (
                                <InfoContainer
                                    iconName={"male-female"}
                                    title={labels.gender}
                                    content={UserDetails?.gender}
                                />) : null
                        } */}

                        {/* weekly_hours_alloted_by_govt */}
                        {
                            UserDetails?.user_type_id == 6 ? (
                                <InfoContainer
                                    iconName={"time-outline"}
                                    title={labels["weekly-hours-alloted-by-govt"]}
                                    content={UserDetails?.agency_hours[0]?.assigned_hours}
                                />) : null
                        }
                        {/* department */}
                        {
                            UserDetails?.user_type_id == 3 || UserDetails?.user_type_id == 6 ? (
                                <InfoContainer
                                    iconName={"apps-outline"}
                                    title={labels["department"]}
                                    content={UserDetails?.department?.name}
                                    hideBottomLine={true}
                                />) : null
                        }

                        {/*Company Types */}
                        {
                            fromDrawer ?
                                <View>
                                    <View style={{ flexDirection: "row", marginTop: 0 }}>
                                        <Icon style={{ marginRight: 15, marginTop: 20 }} name={"ellipsis-vertical-sharp"} color={Colors.black} size={20} />
                                        <View style={{
                                            flex: 1,
                                            borderBottomColor: Colors.placeholderTextColor,
                                            borderBottomWidth: 0,
                                            paddingVertical: 10
                                        }}>
                                            <Text style={{ ...styles.descriptionText, }}>{labels["company-types"]}</Text>

                                            <Text style={styles.contentText}>{
                                                UserLogin?.company_types?.map((item) => {
                                                    return (
                                                        <View key={item.id} >
                                                            <View>
                                                                <Text style={{ ...styles.contentText, paddingHorizontal: 5, backgroundColor: Colors.ultraLightProPrimary, borderRadius: 10, marginTop: 5, }}>{item?.name} </Text>
                                                            </View>
                                                        </View>
                                                    )
                                                })
                                                ?? "N/A"}</Text>
                                        </View>
                                    </View>
                                </View> : null
                        }

                        {/*assigned-module */}
                        {
                            fromDrawer ?
                                <View>
                                    <View style={{ flexDirection: "row", marginTop: 0 }}>
                                        <Icon style={{ marginRight: 15, marginTop: 20 }} name={"apps-outline"} color={Colors.black} size={20} />
                                        <View style={{
                                            flex: 1,
                                            borderBottomColor: Colors.placeholderTextColor,
                                            borderBottomWidth: 0,
                                            paddingVertical: 10
                                        }}>
                                            <Text style={{ ...styles.descriptionText, }}>{labels["assigned-module"]}</Text>

                                            <Text style={styles.contentText}>{
                                                UserLogin?.assigned_module?.map((item) => {
                                                    return (
                                                        <View key={item.id} >
                                                            <View>
                                                                <Text style={{ ...styles.contentText, paddingHorizontal: 5, backgroundColor: Colors.ultraLightProPrimary, borderRadius: 10, marginTop: 5, }}>{item?.module?.name} </Text>
                                                            </View>
                                                        </View>
                                                    )
                                                })
                                                ?? "N/A"}</Text>
                                        </View>
                                    </View>
                                </View> : null
                        }

                        {/* license status*/}
                        {
                            UserDetails?.user_type_id == 2
                                ? (
                                    <InfoContainer
                                        iconName={"star-half-outline"}
                                        title={labels["license-status"]}
                                        // content={UserDetails?.licence_status == 1 ? "Active" : "Inactive"}
                                        content={UserDetails?.licence_status == 1 ? labels.active : labels.inactive}
                                    />) : null
                        }

                    </View>
                </View>


                {/* ---------personal_details(Patient)--------- */}
                <View style={{
                    ...styles.detailsContainer,
                    display: UserDetails?.user_type_id == 6 ? null : "none"
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
                            content={UserDetails?.personal_number}
                        />

                        {/* Patient ID */}
                        <InfoContainer
                            iconName={"ios-person-add-outline"}
                            title={labels["custom-unique-id"]}
                            content={UserDetails?.custom_unique_id}
                        />

                        {/* EMail */}
                        <InfoContainer
                            iconName={"md-mail-outline"}
                            title={labels["email"]}
                            content={UserDetails?.email}
                            status={UserDetails?.email_verified_at}
                        />

                        {/* Contact Number */}
                        <InfoContainer
                            iconName={"md-call-outline"}
                            title={labels["contact-number"]}
                            content={UserDetails?.contact_number}
                        />

                        {/* Address */}
                        <InfoContainer
                            iconName={"location-outline"}
                            title={labels["full-address"]}
                            content={UserDetails?.full_address}
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
                                        UserDetails?.patient_types?.map((item) => {
                                            return (
                                                <View key={item.id} >
                                                    <View>
                                                        <Text style={{ ...styles.contentText, paddingHorizontal: 5, backgroundColor: Colors.ultraLightProPrimary, borderRadius: 10, marginTop: 5, }}>{item?.designation} </Text>
                                                    </View>

                                                </View>

                                            )
                                        })
                                        ?? "N/A"}</Text>
                                    <Divider style={{ color: Colors.black, width: "100%", height: 2.5, marginTop: 15 }} />
                                </View>

                            </View>
                        </View>
                    </View>
                </View>


                {/* ---------registration_details--------- */}
                <View style={{
                    ...styles.detailsContainer,
                    marginBottom: 20,
                    display: UserDetails?.user_type_id == 2 || UserDetails?.user_type_id == 11 || fromDrawer ? null : "none"
                }} >
                    <TouchableOpacity
                        style={{ ...styles.overview, }}
                        onPress={() => setShowRegistrationDetails(!showRegistrationDetails)} >
                        <Text style={styles.overviewText}>{labels["registration-details"]}</Text>
                        <Icon name={!showRegistrationDetails ? 'chevron-down' : 'chevron-up'} color={Colors.black} size={25} />
                    </TouchableOpacity>
                    <View style={{ display: !showRegistrationDetails ? "none" : "flex" }}>
                        {/* organization_number */}
                        <InfoContainer
                            iconName={"business-outline"}
                            title={labels["organization_number"]}
                            // content={UserDetails?.organization_number}
                            content={fromDrawer ? UserLogin?.organization_number : UserDetails?.organization_number}
                        />

                        {/* joining_date */}
                        {

                            (UserDetails?.user_type_id == 3 || UserDetails?.user_type_id == 6 || fromDrawer)
                                ?
                                (<InfoContainer
                                    iconName={"calendar-outline"}
                                    title={labels["joining_date"]}
                                    content={UserDetails?.joining_date}
                                // content={fromDrawer ? UserLogin?.joining_date : UserDetails?.joining_date}
                                />) : null
                        }

                        {/* establishment_date */}
                        {
                            (UserDetails?.user_type_id == 1 || UserDetails?.user_type_id == 2
                                || fromDrawer)
                                ? (<InfoContainer
                                    iconName={"calendar-outline"}
                                    title={labels["registration-date"]}
                                    content={UserDetails?.establishment_date}
                                // content={fromDrawer ? UserLogin?.establishment_date : UserDetails?.establishment_date}
                                />) : null

                        }

                        {/* licence_key */}
                        <InfoContainer
                            iconName={"key-outline"}
                            title={labels["license-key"]}
                            // content={UserDetails?.licence_key}
                            content={fromDrawer ? UserLogin?.licence_key : UserDetails?.licence_key}
                        />
                        {/* licence_end_date */}
                        <InfoContainer
                            iconName={"calendar-outline"}
                            title={labels["licence_end_date"]}
                            // content={UserDetails?.licence_end_date}
                            content={fromDrawer ? UserLogin?.licence_end_date : UserDetails?.licence_end_date}
                        />
                        {
                            UserDetails?.establishment_year || fromDrawer
                                ? <InfoContainer
                                    iconName={"calendar-outline"}
                                    title={labels["establishment_date"]}
                                    // content={UserDetails?.establishment_year}
                                    content={fromDrawer ? UserLogin?.establishment_year : UserDetails?.establishment_year}
                                    hideBottomLine={true}
                                /> : null
                        }


                    </View>
                </View>

                {/* ---------Package_details--------- */}
                <View style={{
                    ...styles.detailsContainer,
                    marginBottom: 20,
                    display: UserDetails?.user_type_id == 2 || fromDrawer ? null : "none"
                }} >
                    <TouchableOpacity
                        style={{ ...styles.overview, }}
                        onPress={() => setShowPackageDetails(!showPackageDetails)} >
                        <Text style={styles.overviewText}>{labels["Packages"]}</Text>
                        <Icon name={!showPackageDetails ? 'chevron-down' : 'chevron-up'} color={Colors.black} size={25} />
                    </TouchableOpacity>
                    <View style={{ display: !showPackageDetails ? "none" : "flex" }}>
                        {/* package_name */}
                        <InfoContainer
                            iconName={"ribbon-outline"}
                            title={labels["package-name"]}
                            content={UserDetails?.package?.name}
                        // content={fromDrawer ? UserLogin?.package?.name : UserDetails?.package?.name}
                        />
                        {/* Package_start_date */}
                        <InfoContainer
                            iconName={"calendar-outline"}
                            title={labels["start-date"]}
                            // content={UserDetails?.created_at?.slice(0, 10)}
                            content={fromDrawer ? UserLogin?.created_at?.slice(0, 10) : UserDetails?.created_at?.slice(0, 10)}
                        />
                        {/* package validity_in_days */}
                        <InfoContainer
                            iconName={"calendar-outline"}
                            title={labels["validity"]}
                            content={UserDetails?.package?.validity_in_days}
                        // content={fromDrawer ? UserLogin?.package?.validity_in_days : UserDetails?.package?.validity_in_days}
                        />
                        {/* package_status */}
                        {/*
                        <InfoContainer
                            iconName={"star-half-outline"}
                            title={labels["status"]}
                            content={UserDetails?.package?.status == 1 ? "Active" : "Inactive"}
                            hideBottomLine={true}
                        />*/}
                    </View>
                </View>

                {/* ---------persons--------- */}
                <View style={{
                    ...styles.detailsContainer,
                    marginBottom: 20,
                    display: UserDetails?.user_type_id == 6 ? null : "none"
                }} >
                    <TouchableOpacity
                        style={{ ...styles.overview, }}
                        onPress={() => setShowFamily(!showFamily)} >
                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                            <Text style={styles.overviewText}>{labels["persons"]}</Text>
                            <View style={styles.countLabel}>
                                <Text style={styles.countLabelText}>{UserDetails?.persons?.length}</Text>
                            </View>
                        </View>
                        <Icon name={!showFamily ? 'chevron-down' : 'chevron-up'} color={Colors.black} size={25} />
                    </TouchableOpacity>
                    <View style={{ display: !showFamily ? "none" : "flex" }}>
                        {/*
                        {
                            UserDetails?.persons?.map((item) => {
                                return (
                                    <View key={item.id} style={{ flexDirection: 'row', alignItems: "center", marginTop: 10 }}>
                                        <View>
                                            <Image source={{ uri: userImage }} style={{ width: 25, height: 25, marginRight: 20 }} />
                                        </View>
                                        <View>
                                            <Text style={styles.descriptionText}>{item?.name}</Text>
                                            <View style={{ flexDirection: "row" }}>
                                                {item?.is_family_member ? <Text style={styles.contentText}>{labels["is-family-member"]}</Text> : null}
                                                {item?.is_caretaker ? <Text style={styles.contentText}> {labels["is-caretaker"]}</Text> : null}
                                                {item?.is_contact_person ? <Text style={styles.contentText}>{labels["is-contact-person"]}</Text> : null}
                                            </View>
                                        </View>
                                    </View>
                                )
                            })
                        }
                    */}
                        {
                            UserDetails?.persons?.map((item, index) => {
                                return (
                                    <TouchableOpacity
                                        key={item.id}
                                        style={{ flexDirection: 'row', alignItems: "center", }}
                                        onPress={() => {
                                            setPersonsIndex(index)
                                            setIsModalVisible(true)
                                        }}
                                    >
                                        <View>
                                            {/* source={{ uri: props.image ?? props.isBranch ? Constants.branchIcon : props?.gender == "female" ? Constants.userImageFemale : Constants.userImageMale */}
                                            <Image source={{
                                                uri: item?.image ?? item?.persons?.gender?.toLowerCase() == "female" ? Constants.userImageFemale : Constants.userImageMale
                                            }} style={{ width: 25, height: 25, marginRight: 20 }} />
                                        </View>
                                        <View style={{
                                            flex: 1,
                                            borderTopColor: Colors.placeholderTextColor,
                                            borderTopWidth: index == 0 ? 0 : 0.5,
                                            paddingVertical: 10
                                        }}>
                                            <Text style={styles.descriptionText}>{item?.name}</Text>
                                            <View style={{ flexDirection: "row" }}>
                                                {item?.is_family_member ? <Text style={styles.contentText}>{labels["is-family-member"]}</Text> : null}
                                                {item?.is_caretaker ? <Text style={styles.contentText}> {labels["is-caretaker"]}</Text> : null}
                                                {item?.is_contact_person ? <Text style={styles.contentText}>{labels["is-contact-person"]}</Text> : null}
                                            </View>
                                        </View>
                                        <View>
                                            <Icon name='md-chevron-forward' size={20} color={Colors.black} />
                                        </View>
                                    </TouchableOpacity>
                                )
                            })
                        }


                    </View>
                </View>

                {/* ---------Disability Details--------- */}
                <View style={{
                    ...styles.detailsContainer,
                    marginBottom: 20,
                    display: UserDetails?.user_type_id == 6 ? null : "none"
                }} >
                    <TouchableOpacity
                        style={{ ...styles.overview, }}
                        onPress={() => setDisabilityDetails(!disabilityDetails)} >
                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                            <Text style={styles.overviewText}>{labels["disability-details"]}</Text>
                        </View>
                        <Icon name={!disabilityDetails ? 'chevron-down' : 'chevron-up'} color={Colors.black} size={25} />
                    </TouchableOpacity>

                    <View style={{ display: !disabilityDetails ? "none" : "flex" }}>


                        <InfoContainer
                            iconName={"list-outline"}
                            title={labels["disease-description"]}
                            content={UserDetails?.disease_description}
                        />


                        <InfoContainer
                            iconName={"ios-information-circle-outline"}
                            title={labels["aids"]}
                            content={UserDetails?.patient_information?.aids}
                        />


                        <InfoContainer
                            iconName={"information"}
                            title={labels["special-information"]}
                            content={UserDetails?.patient_information?.special_information}
                            hideBottomLine={true}
                        />
                    </View>
                </View>


                {/* ---------Studies & Work--------- */}
                <View style={{
                    ...styles.detailsContainer,
                    marginBottom: 20,
                    display: UserDetails?.user_type_id == 6 ? null : "none"
                }} >
                    <TouchableOpacity
                        style={{ ...styles.overview, }}
                        onPress={() => setStudiesWork(!studiesWork)} >
                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                            <Text style={styles.overviewText}>{labels["studies-work"]}</Text>
                        </View>
                        <Icon name={!studiesWork ? 'chevron-down' : 'chevron-up'} color={Colors.black} size={25} />
                    </TouchableOpacity>
                    <View style={{ display: !studiesWork ? "none" : "flex" }}>

                        {/* ---------institute section--------- */}
                        {
                            UserDetails?.patient_information?.institute_name
                                ? <InfoContainer
                                    iconName={"ios-tablet-landscape-sharp"}
                                    title={labels["institute-name"]}
                                    content={UserDetails?.patient_information?.institute_name}
                                /> : null
                        }


                        {
                            UserDetails?.patient_information?.institute_name
                                ? <InfoContainer
                                    iconName={"md-call-outline"}
                                    title={labels["contact-person"]}
                                    content={UserDetails?.patient_information?.institute_contact_person}
                                /> : null
                        }

                        {
                            UserDetails?.patient_information?.institute_name
                                ? <InfoContainer
                                    iconName={"md-call-outline"}
                                    title={labels["institute-phone"]}
                                    content={UserDetails?.patient_information?.institute_contact_number}
                                /> : null
                        }

                        {
                            UserDetails?.patient_information?.institute_name
                                ? <InfoContainer
                                    iconName={"location-outline"}
                                    title={labels["institute-address"]}
                                    content={UserDetails?.patient_information?.institute_full_address}
                                /> : null
                        }

                        {
                            UserDetails?.patient_information?.institute_name
                                ? <InfoContainer
                                    iconName={"time-outline"}
                                    title={labels["time-from"]}
                                    content={formatTime(getJSObjectFromTimeString(UserDetails?.patient_information?.classes_from))}
                                /> : null
                        }

                        {
                            UserDetails?.patient_information?.institute_name
                                ? <InfoContainer
                                    iconName={"time-outline"}
                                    title={labels["time-to"]}
                                    content={UserDetails?.patient_information?.classes_to}
                                    hideBottomLine={UserDetails?.patient_information?.company_name
                                        ? false : true}
                                /> : null
                        }

                        {/* ---------company section--------- */}
                        {
                            UserDetails?.patient_information?.company_name
                                ? <InfoContainer
                                    iconName={"ios-tablet-landscape-sharp"}
                                    title={labels["company-name"]}
                                    content={UserDetails?.patient_information?.company_name}
                                /> : null
                        }


                        {
                            UserDetails?.patient_information?.company_name
                                ? <InfoContainer
                                    iconName={"md-call-outline"}
                                    title={labels["contact-person"]}
                                    content={UserDetails?.patient_information?.company_contact_person}
                                /> : null
                        }

                        {
                            UserDetails?.patient_information?.company_name
                                ? <InfoContainer
                                    iconName={"md-call-outline"}
                                    title={labels["company-phone"]}
                                    content={UserDetails?.patient_information?.company_contact_number}
                                /> : null
                        }

                        {
                            UserDetails?.patient_information?.company_name
                                ? <InfoContainer
                                    iconName={"location-outline"}
                                    title={labels["company-address"]}
                                    content={UserDetails?.patient_information?.company_full_address}
                                /> : null
                        }

                        {
                            UserDetails?.patient_information?.company_name
                                ? <InfoContainer
                                    iconName={"time-outline"}
                                    title={labels["working-from"]}
                                    content={UserDetails?.patient_information?.from_timing}
                                /> : null
                        }

                        {
                            UserDetails?.patient_information?.company_name
                                ? <InfoContainer
                                    iconName={"time-outline"}
                                    title={labels["working-to"]}
                                    content={UserDetails?.patient_information?.to_timing}
                                    hideBottomLine={true}
                                /> : null
                        }

                    </View>
                </View>

                {/* ---------Other Activities--------- */}
                <View style={{
                    ...styles.detailsContainer,
                    marginBottom: 20,
                    display: UserDetails?.user_type_id == 6 ? null : "none"
                }} >
                    <TouchableOpacity
                        style={{ ...styles.overview, }}
                        onPress={() => setOtherActivities(!otherActivities)} >
                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                            <Text style={styles.overviewText}>{labels["other-activities"]}</Text>
                        </View>
                        <Icon name={!otherActivities ? 'chevron-down' : 'chevron-up'} color={Colors.black} size={25} />
                    </TouchableOpacity>
                    <View style={{ display: !otherActivities ? "none" : "flex" }}>

                        <InfoContainer
                            iconName={"md-file-tray-full-outline"}
                            title={labels["another-activity"]}
                            content={UserDetails?.patient_information?.another_activity}
                        />


                        <InfoContainer
                            iconName={"text-outline"}
                            title={labels["name"]}
                            content={UserDetails?.patient_information?.another_activity_name}
                        />


                        <InfoContainer
                            iconName={"information-circle-outline"}
                            title={labels["another-activity-contact-person"]}
                            content={UserDetails?.patient_information?.another_activity_contact_person}
                        />


                        <InfoContainer
                            iconName={"md-call-outline"}
                            title={labels["contact-number"]}
                            content={UserDetails?.patient_information?.activitys_contact_number}
                        />


                        <InfoContainer
                            iconName={"location-outline"}
                            title={labels["full-address"]}
                            content={UserDetails?.patient_information?.activitys_full_address}
                            hideBottomLine={true}
                        />
                    </View>
                </View>

                {/* ---------Decisions & Documents--------- */}
                <View style={{
                    ...styles.detailsContainer,
                    marginBottom: 20,
                    display: UserDetails?.user_type_id == 6 ? null : "none"
                }} >
                    <TouchableOpacity
                        style={{ ...styles.overview, }}
                        onPress={() => setDecisionsDocuments(!decisionsDocuments)} >
                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                            <Text style={styles.overviewText}>{labels["ip-file"]}</Text>
                        </View>
                        <Icon name={!decisionsDocuments ? 'chevron-down' : 'chevron-up'} color={Colors.black} size={25} />
                    </TouchableOpacity>
                    <View style={{ display: !decisionsDocuments ? "none" : "flex" }}>


                        {
                            UserDetails?.agency_hours?.map((item) => {
                                return (
                                    <View key={item.id}>
                                        {/* Agency */}
                                        <InfoContainer
                                            iconName={"md-file-tray-full-outline"}
                                            title={labels["no-of-hours"]}
                                            content={item?.name}
                                        />

                                        {/*Hours*/}
                                        <InfoContainer
                                            iconName={"time-outline"}
                                            title={labels["weekly-hour-alloted-by-govt"]}
                                            content={item?.assigned_hours}
                                        />

                                        {/* Start Date*/}
                                        <InfoContainer
                                            iconName={"md-reader-outline"}
                                            title={labels["start-date"]}
                                            content={item?.start_date}
                                        />

                                        {/* End Date */}
                                        <InfoContainer
                                            iconName={"md-reader-outline"}
                                            title={labels["end-date"]}
                                            content={item?.end_date}
                                            hideBottomLine={true}
                                        />
                                    </View>
                                )
                            })
                        }

                    </View>
                </View>


                {/* ---------nurse--------- */}
                {/* <View style={{
                    ...styles.detailsContainer,
                    marginBottom: 20,
                    display: UserDetails?.user_type_id == 6 ? null : "none"
                }} >
                    <TouchableOpacity
                        style={{ ...styles.overview, }}
                        onPress={() => setShowNurse(!showNurse)} >
                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                            <Text style={styles.overviewText}>{labels.nurse}</Text>
                            <View style={styles.countLabel}>
                                <Text style={styles.countLabelText}>{nurse.length}</Text>
                            </View>
                        </View>
                        <Icon name={!showNurse ? 'chevron-down' : 'chevron-up'} color={Colors.black} size={25} />
                    </TouchableOpacity>
                    <View style={{ display: !showNurse ? "none" : "flex" }}>
                        {
                            nurse.map((item) => {
                                return (
                                    <View key={item.id} style={{ flexDirection: 'row', alignItems: "center", marginTop: 10 }}>
                                        <View>
                                            <Image source={{ uri: userImage }} style={{ width: 25, height: 25, marginRight: 20 }} />
                                        </View>
                                        <View>
                                            <Text style={styles.descriptionText}>{item?.name}</Text>
                                            <Text style={styles.contentText}>{item?.relation}</Text>
                                        </View>
                                    </View>
                                )
                            })
                        }
                    </View>
                </View> */}

                {/* add Implementation plan */}
                {routeParams?.user_type_id == "6"
                    ? <View style={{ paddingHorizontal: Constants.globalPaddingHorizontal }}>
                        < CustomButton
                            style={{
                                ...styles.nextButton, marginTop: 10,
                                backgroundColor: Colors.primary
                            }}
                            onPress={() => {
                                props.navigation.navigate('ImplementationPlanStack',
                                    { screen: 'ImplementationPlan', params: { patientId: routeParams.itemId } })
                            }} title={labels["create_ips"]} />
                    </View>
                    : null}

                {/*chat view */}

                {
                    fromCompanyListing
                        ?
                        <View style={{ width: "100%", justifyContent: "center", alignItems: "center", marginTop: 20 }}>
                            <View style={{ paddingVertical: 5, borderWidth: 1, borderColor: Colors.black, justifyContent: "center", marginBottom: 7, borderRadius: 5, flexDirection: "row" }}>
                                <RenderFilterText label={labels?.["today"] ?? "Today"}
                                    onPress={() => {
                                        setParam({ ...param, data_of: "1" });
                                        companyChartDataAPI("1", props?.route?.params?.itemId)
                                    }}
                                    color={param.data_of == 1 ? Colors.primary : Colors.black}
                                />
                                <RenderFilterText label={labels?.["week"] ?? "This Week"}
                                    last={true}
                                    onPress={() => {
                                        setParam({ ...param, data_of: "7" });
                                        companyChartDataAPI("7", props?.route?.params?.itemId)
                                    }}
                                    color={param.data_of == 7 ? Colors.primary : Colors.black}
                                />
                                {/* <RenderFilterText label={labels?.["month"] ?? "Month"}
                                    last={true}
                                    color={(param.data_of != 1 && param.data_of != 7) ? Colors.primary : Colors.black}
                                    onPress={() => {
                                        setParam({ ...param, data_of: "30" });
                                        companyChartDataAPI("30", props?.route?.params?.itemId)
                                    }}
                                /> */}
                            </View>
                        </View> : null
                }

                {
                    fromCompanyListing ?

                        <View style={styles.container}>
                            {
                                chartDate.labels
                                    ?
                                    <View style={{}}>

                                        {/* Activity Stats */}
                                        <ScrollView
                                            horizontal={true}
                                        >
                                            <RenderChartItems chartName={labels?.["company-stats"]} item={chartDate.company_branchs_count} dateLabel={labels?.["total-branches"] ?? "Total Branches"} dataColor={Colors.primary} />
                                            <RenderChartItems item={chartDate.company_patients_count} dateLabel={labels?.["total-patients"] ?? "Total Patients"} dataColor={Colors.green} />
                                            <RenderChartItems item={chartDate.company_employees_count} dateLabel={labels?.["total-employee"] ?? "Total Employee"} dataColor={Colors.aqua} />
                                        </ScrollView>

                                        {/* Activity Patient Stats */}
                                        <ScrollView
                                            horizontal={true}
                                        >
                                            <RenderChartItems item={chartDate.company_activities_count} dateLabel={labels?.["dataset-total-activity"] ?? "Total Activity"} dataColor={Colors.primary} />
                                            <RenderChartItems item={chartDate.company_assignedModule_count} dateLabel={labels?.["total-module"] ?? "Total Modules"} dataColor={Colors.green} />
                                            <RenderChartItems item={chartDate.company_followUps_count} dateLabel={labels?.["total-followups"] ?? "Total Followups"} dataColor={Colors.aqua} />
                                            <RenderChartItems item={chartDate.company_ips_count} dateLabel={labels?.["not-done"] ?? "Not Done"} dataColor={Colors.gray} />
                                            <RenderChartItems item={chartDate.company_tasks_count} dateLabel={labels?.["total-task"] ?? "Total Task"} dataColor={Colors.green} />
                                        </ScrollView>

                                    </View>
                                    : null
                            }
                        </View>
                        : null
                }




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
                                <Icon name='md-close-circle' color={Colors.primary} size={30} onPress={onRequestClose} />
                            </View>

                            {/* main view */}
                            <View style={{ flexDirection: 'row', alignItems: "center", marginTop: 10 }}   >
                                <View>
                                    <Image source={{
                                        uri: UserDetails?.persons?.[personsIndex]?.image ?? UserDetails?.persons?.[personsIndex]?.persons?.gender?.toLowerCase() == "female" ? Constants.userImageFemale : Constants.userImageMale
                                    }} style={{ width: 25, height: 25, marginRight: 20 }} />
                                </View>
                                <View>
                                    <Text style={styles.descriptionText}>{UserDetails?.persons?.[personsIndex]?.name}</Text>
                                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                                        {/* <Text style={styles.contentText}>{labels["email"]} : </Text> */}
                                        <Icon style={{ marginRight: 5 }} name="md-person-outline" color={Colors.black} size={15} />
                                        {UserDetails?.persons?.[personsIndex]?.is_family_member ? <Text style={styles.contentText}>{labels["is-family-member"]}</Text> : null}

                                        {UserDetails?.persons?.[personsIndex]?.is_caretaker ? <Text style={styles.contentText}> {labels["is-caretaker"]}</Text> : null}

                                        {UserDetails?.persons?.[personsIndex]?.is_contact_person ? <Text style={styles.contentText}>{labels["is-contact-person"]}</Text> : null}

                                    </View>
                                </View>
                            </View>

                            {/* contact_number */}
                            <InfoContainer
                                iconName={"md-call-outline"}
                                title={labels["contact-number"]}
                                content={UserDetails?.persons?.[personsIndex]?.contact_number}
                            />

                            {/* email */}
                            <InfoContainer
                                iconName={"md-mail-outline"}
                                title={labels["email"]}

                                content={UserDetails?.persons?.[personsIndex]?.email}
                                hideBottomLine={true}

                            />

                            {/* address */}
                            <InfoContainer
                                iconName={"location-outline"}
                                title={labels["full-address"]}
                                content={UserDetails?.persons?.[personsIndex]?.full_address}
                            />

                            {/* <CustomButton title={labels.view_profile}
                             style={styles.buttonView}
                             titleStyle={{ color: Colors.black, fontSize: getProportionalFontSize(14) }}
                             onPress={() => {
                                 props.navigation.navigate("CommonUserProfile", { itemId: activityDetails?.assign_persons[personsIndex]?.id, url: Constants.apiEndPoints.userView })
                             }}
                         /> */}
                        </View>
                    </View>
                </Modal>
            </Portal>


        </BaseContainer >
    )
}

export default CommonUserProfile

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
        // backgroundColor: Colors.primary
        // source={Assets.images.backGroundImage}

    },
    profileImg: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 2, borderColor: Colors.gray
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
        fontSize: getProportionalFontSize(14),
        color: Colors.white,
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
        fontSize: getProportionalFontSize(16),
        color: Colors.black
    },
    descriptionText: {
        // 
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
    //Chart CSS from here    
    container: {
        flex: 1,
        // marginLeft: 10
        // borderWidth: 2,
        // borderColor: "red",
        minHeight: Dimensions.get("window").height,
        paddingTop: 20,
        // paddingHorizontal: Constants.globalPaddingHorizontal,
    },
    title: {

        fontSize: getProportionalFontSize(16),
        fontFamily: Assets.fonts.semiBold,
        color: Colors.primary,
    },
    chartContainer: {
        width: Dimensions.get("window").width * 0.90,
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

    innerView: { width: width - Constants.globalPaddingHorizontal * 3, minHeight: 300, backgroundColor: Colors.backgroundColor, paddingVertical: 15, paddingHorizontal: 16, borderRadius: 20 },

})