import React, { useState, useCallback } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, ScrollView, } from 'react-native';
// icons
import Icon from 'react-native-vector-icons/Ionicons';
// import Icon from 'react-native-vector-icons/FontAwesome';
//local files
import Colors from '../Constants/Colors';
import { getProportionalFontSize } from '../Services/CommonMethods';
import Assets from '../Assets/Assets';
//redux
import { useSelector, useDispatch } from 'react-redux';
import Constants from '../Constants/Constants'
import APIService from '../Services/APIService'
import CommonUserProfile from '../Components/CommonUserProfile';
import ProgressLoader from "../Components/ProgressLoader";
import Alert from '../Components/Alert';
import { UserDetailAction } from '../Redux/Actions/UserDetailAction';


const SuperAdminProfile = ({ navigation }) => {
    // immmutable variables
    const userImage = 'https://st3.depositphotos.com/15648834/17930/v/600/depositphotos_179308454-stock-illustration-unknown-person-silhouette-glasses-profile.jpg'

    // useState Hooks
    const [isLoading, setIsLoading] = React.useState(false);
    const [showOverview, setShowOverview] = React.useState(true)
    const [showDetails, setShowDetails] = React.useState(false)


    // REDUX hooks
    const dispatch = useDispatch();
    const UserLogin = useSelector(state => state.User.UserLogin);
    const UserDetail = useSelector(state => state?.User?.UserDetail);
    const labels = useSelector(state => state.Labels);

    // useEffect Hooks
    React.useEffect(() => {
        getUserDetails()
    }, [])

    const onSuccessDetail = () => {
        setIsLoading(false)
    }

    const onFailureDetail = (errorMsg) => {
        setIsLoading(false)
        Alert.showAlert(Constants.danger, errorMsg)
    }

    // React.useEffect(() => {
    //     const unsubscribe = navigation.addListener('focus', () => {
    //         // The screen is focused
    //         // Call any action
    //         console.log('Focus___________________________________________')
    //         getUserDetails(UserLogin.id)
    //     });

    //     // Return the function to unsubscribe from the event so it gets removed on unmount
    //     return unsubscribe;
    // }, [navigation]);

    const getUserDetails = () => {
        if (!UserDetail.name) {
            let params = {
                token: UserLogin.access_token,
                id: UserLogin.id
            }
            setIsLoading(true)
            dispatch(UserDetailAction(params, onSuccessDetail, onFailureDetail));
        }
    }


    const InfoContainer = (props) => {
        const { iconName, title, content } = props;
        return (
            <View>
                <View style={{ flexDirection: "row", marginTop: 20, alignItems: 'center' }}>
                    <Icon style={{ marginRight: 5 }} name={iconName} color={Colors.black} size={17} />
                    <Text style={styles.descriptionText}>{title}</Text>
                </View>
                <Text style={styles.contentText}>{content ?? "N/A"}</Text>
            </View>
        )
    }

    // renderView
    if (isLoading)
        return <ProgressLoader />

    return (
        <BaseContainer
            title={labels.profile} //{props?.route?.name}
            leftIcon="arrow-back"
            leftIconColor={Colors.primary}
            // leftIconSize={24}
            onPressLeftIcon={() => { navigation.pop() }}
            rightIcon="edit"
            rightIconColor={Colors.primary}
            rightIconSize={25}
            onPressRightIcon={() => navigation.navigate("EditUserProfile")}
            titleStyle={{ marginStart: 5 }}>

            {/* Main View */}
            <ScrollView style={styles.mainView}>
                <View>
                    <View
                        style={styles.imageContainer}>
                        <Image source={{ uri: UserDetail?.image ?? userImage }} style={{ ...styles.profileImg }} />
                        <Text style={{ ...styles.usernameText, color: UserDetail.status == 0 ? Colors.red : Colors.black }}>{UserDetail.name}</Text>
                        {
                            UserDetail?.user_type?.name ? <Text style={styles.heading}>( {UserDetail.user_type?.name} )</Text> : null
                        }
                        {
                            UserDetail.status == 0 ? <Text style={styles.inactiveLabel}>{labels.inactive}</Text> : null
                        }
                    </View>

                    <TouchableOpacity
                        style={styles.overview}
                        onPress={() => setShowOverview(!showOverview)} >
                        <Text style={styles.overviewText}>{labels.overview}</Text>
                        <Icon name={!showOverview ? 'chevron-down' : 'chevron-up'} color={Colors.black} size={25} />
                    </TouchableOpacity>
                    <View style={{ display: !showOverview ? "none" : "flex" }}>
                        {/* Description */}
                        {
                            UserDetail.description ? (<View>
                                <Text style={styles.descriptionText}>{labels.description}</Text>
                                {/* <TextContent textContent={UserDetail.description} /> */}
                            </View>) : null
                        }

                        {/* EMail */}
                        <InfoContainer
                            iconName={"md-mail-outline"}
                            title={labels.email}
                            content={UserDetail.email}
                            status={UserDetail.email_verified_at}
                        />

                        {/* Contact Number */}
                        <InfoContainer
                            iconName={"md-call-outline"}
                            title={labels.contact_number}
                            content={UserDetail.contact_number}
                        />

                        {/* Address */}
                        <InfoContainer
                            iconName={"location-outline"}
                            title={labels.address}
                            content={UserDetail.full_address}
                        />

                        {/* Date Of Birth */}
                        <InfoContainer
                            iconName={"calendar-outline"}
                            title={labels.joining_date}
                            content={UserDetail.joining_date}
                        />
                    </View>

                    <TouchableOpacity
                        style={styles.overview}
                        onPress={() => setShowDetails(!showDetails)} >
                        <Text style={styles.DetailsText}>{labels.registration_details}</Text>
                        <Icon name={!showDetails ? 'chevron-down' : 'chevron-up'} color={Colors.black} size={25} />
                    </TouchableOpacity>
                    <View style={{ display: !showDetails ? "none" : "flex" }}>
                        {/* licence_key */}

                        <InfoContainer
                            iconName={"ios-key-outline"}
                            title={labels.licence_key}
                            content={UserDetail.licence_key}
                        />
                        {/* licence_end_date */}
                        <InfoContainer
                            iconName={"calendar-outline"}
                            title={labels.licence_end_date}
                            content={UserDetail.licence_end_date}
                        />
                        {/* weekly_hours_alloted_by_govt */}
                        <InfoContainer
                            iconName={"md-mail-outline"}
                            title={labels.weekly_hours_alloted_by_govt}
                            content={UserDetail.weekly_hours_alloted_by_govt}
                        />
                        {/* weekly_hours_alloted_by_govt */}
                        {
                            UserDetail.department ? <InfoContainer
                                iconName={"md-mail-outline"}
                                title={labels.department}
                                content={UserDetail.department}
                            /> : null
                        }
                    </View>
                    <TouchableOpacity style={styles.changePassBtn}>
                        <Text style={styles.changePassText}>{labels.change_password}</Text>
                    </TouchableOpacity>
                </View>

            </ScrollView >
        </BaseContainer >
    );
};

export default SuperAdminProfile;

const styles = StyleSheet.create({
    mainView: {
        flex: 1,
        paddingHorizontal: Constants.globalPaddingHorizontal,
        backgroundColor: Colors.backgroundColor,
        paddingBottom: 30,

    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingRight: 10,
        paddingVertical: 5,
        borderBottomColor: Colors.ultraLightPrimary,
        borderBottomWidth: 1,
    },
    headerText: {
        fontSize: getProportionalFontSize(20),
        color: Colors.primary,
        fontFamily: Assets.fonts.semiBold,
    },



    detailsBox: {
        marginVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: Colors.companyListing.horizontalLineColor
            ? Colors.companyListing.horizontalLineColor
            : '#0002',
        paddingVertical: 5,
    },
    cardTitle: {
        fontSize: getProportionalFontSize(15),
        fontFamily: Assets.fonts.semiBold,
        color: Colors.companyListing.primary,
    },
    cardText: {
        fontSize: getProportionalFontSize(20),
        color: Colors.black,
        paddingLeft: 15,
        fontFamily: Assets.fonts.regular,
    },
    changePassBtn: {
        backgroundColor: Colors.primary,


        padding: 10,
        borderRadius: 7,
        alignItems: 'center',
        marginBottom: 20,
        marginTop: 10,
    },
    changePassText: {
        fontSize: getProportionalFontSize(20),
        color: Colors.white,
        fontFamily: Assets.fonts.semiBold,
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
    overview: {
        flexDirection: "row",
        width: "100%",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: 30
    },
    overviewText: {
        fontFamily: Assets.fonts.bold,
        fontSize: getProportionalFontSize(18)
    },
    descriptionText: {
        fontFamily: Assets.fonts.medium,
        fontSize: getProportionalFontSize(15),
        lineHeight: 24,
    },
    contentText: {
        fontFamily: Assets.fonts.regular,
        fontSize: getProportionalFontSize(12),
        lineHeight: 17
    },
});
