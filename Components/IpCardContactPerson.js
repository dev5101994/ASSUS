import React from 'react';
import { View, StyleSheet, Text, Platform, TouchableOpacity, Image, Dimensions, FlatList } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import Icon2 from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Colors from '../Constants/Colors'
import Assets from '../Assets/Assets';
import { getProportionalFontSize, formatDateByFormat } from '../Services/CommonMethods';
import { useSelector, useDispatch } from 'react-redux';
import Constants from '../Constants/Constants';
import { Avatar, FAB, Portal } from 'react-native-paper';
import Foundation from 'react-native-vector-icons/Foundation';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'; //notebook

export default IPListCard = props => {
    // const [openCardOptions, setOpenCardOptions] = React.useState()
    const labels = useSelector(state => state.Labels);
    const gender = useSelector(state => state.Labels.gender);


    return (
        <TouchableOpacity onPress={() => { if (props.onPressCard) { props.onPressCard(); props.setOpenCardOptions() } }}
            style={styles.categoryTypeCard}
            activeOpacity={0.9}
        >
            <TouchableOpacity style={{
                zIndex: props.index == props.openCardOptions ? 100 : -100,
                backgroundColor: props.index == props.openCardOptions ? "#000a" : "#0000",
                width: "100%",
                height: "100%",
                position: "absolute",
                justifyContent: "center",
                alignItems: "center",
                borderRadius: 15,
            }}
                onPress={props.setOpenCardOptions ? () => props.setOpenCardOptions() : () => { }}
            >
                <View style={styles.closeCircle}>
                    <Ionicons name='close-circle' size={25} color={"#fff"} onPress={() => { props.setOpenCardOptions() }} />
                </View>
                <View style={styles.icons}>
                    {
                        props.onPressCard
                            ? <TouchableOpacity onPress={() => { if (props.onPressCard) { props.onPressCard(); props.setOpenCardOptions() } }} style={{ justifyContent: "center", alignItems: "center", }}>
                                <Icon name="eye" color={Colors.white} size={20} />
                                <Text style={{ fontFamily: Assets.fonts.medium, color: Colors.white, fontSize: getProportionalFontSize(12), marginTop: 5 }}>{labels.View}</Text>
                            </TouchableOpacity>
                            : null
                    }
                    {props.showEditIcon
                        ? <TouchableOpacity onPress={() => { if (props.onPressEdit) { props.onPressEdit(); props.setOpenCardOptions() } }} style={{ justifyContent: "center", alignItems: "center", }}>
                            <Icon name="edit" color={Colors.white} size={20} />
                            <Text style={{ fontFamily: Assets.fonts.medium, color: Colors.white, fontSize: getProportionalFontSize(12), marginTop: 5 }}>{labels.Edit}</Text>
                        </TouchableOpacity>
                        : null
                    }
                    {props.showAssignWork
                        ? <TouchableOpacity onPress={() => { if (props.onPressAssignWork) { props.onPressAssignWork(); props.setOpenCardOptions() } }} style={{ justifyContent: "center", alignItems: "center", }}>
                            <Ionicons name="file-tray-outline" color={Colors.white} size={20} />
                            <Text style={{ fontFamily: Assets.fonts.medium, color: Colors.white, fontSize: getProportionalFontSize(12), marginTop: 5 }}>{labels.assignWork}</Text>
                        </TouchableOpacity>
                        : null
                    }
                    {props.showDeleteIcon
                        ? <TouchableOpacity onPress={() => { if (props.onPressDelete) { props.setOpenCardOptions(); props.onPressDelete(); } }} style={{ justifyContent: "center", alignItems: "center", }}>
                            <Icon2 name="delete" color={Colors.white} size={20} />
                            <Text style={{ fontFamily: Assets.fonts.medium, color: Colors.white, fontSize: getProportionalFontSize(12), marginTop: 5 }}>{labels.delete}</Text>
                        </TouchableOpacity>
                        : null
                    }
                    {props.showLeaveApprovedIcon
                        ? <TouchableOpacity onPress={() => { if (props.onPressLeaveIcon) { props.setOpenCardOptions(); props.onPressLeaveIcon(); } }} style={{ justifyContent: "center", alignItems: "center", }}>
                            <Ionicons name="ios-checkmark-circle-outline" color={Colors.white} size={20} />
                            <Text style={{ fontFamily: Assets.fonts.medium, color: Colors.white, fontSize: getProportionalFontSize(12), marginTop: 5 }}>{labels.approve}</Text>
                        </TouchableOpacity>
                        : null
                    }

                </View>
            </TouchableOpacity>

            <View style={{ ...styles.innerContainer }}>
                <View style={{ ...styles.avatarContainer }}>
                    {/* {
                        props.isBranch
                            ? <MaterialIcons name='add-business' size={20} color={"#000"} style={{ ...styles.avatarImage, backgroundColor: "#fff", }} />
                            : <Image source={{ uri: props.image ?? props?.gender == "female" ? Constants.userImageFemale : Constants.userImageMale }} style={styles.avatarImage} />
                    } */}
                    {
                        props?.avatarColor
                            ? <FontAwesome name='circle' color={props.workShiftColor} size={40} style={styles.avatarImage} />
                            : null
                    }

                    {
                        !props?.hideAvatar
                            ? <Image source={{ uri: props.image ?? props.isBranch ? Constants.branchIcon : props?.gender == "female" ? Constants.userImageFemale : Constants.userImageMale }} style={styles.avatarImage} />
                            : null
                    }

                    {/* {
                        props?.image
                            ? <Image source={{ uri: props.image }} style={styles.avatarImage} resizeMode="cover" />
                            : props?.labelText
                                ? <Avatar.Text size={Constants.avatarTextSize} label={props?.labelText} color="#fff" labelStyle={styles.avatarText} />
                                : null
                    } */}
                </View>


                {/* title and status view */}
                <View style={{ ...styles.categoryNameView, width: '80%', paddingLeft: props?.hideAvatar ? 15 : 60, }}>
                    {/* <View style={{
                        width: '100%', flexDirection: 'row', position: 'absolute', marginLeft: getProportionalFontSize(40),
                    }}> */}
                    {/* title or ip title or ptient name */}



                    <View style={[styles.mainTitle, props.fromWorkShift ? { paddingLeft: 59, paddingTop: 5, } : {}, { marginLeft: props.hideAvatar ? 0 : getProportionalFontSize(40), }]}>

                        {props.showShiftColor ?
                            <>
                                <Foundation name='social-picasa' color={props.workShiftColor} size={25} style={{ marginRight: 10, }} />
                            </>
                            : null
                        }

                        {/* title or ip title or ptient name */}
                        <View style={{ flexDirection: 'row', }}>
                            <Text numberOfLines={1} style={{
                                ...styles.categoryNameText,
                                // paddingLeft: getProportionalFontSize(25),
                                paddingLeft: 25,
                                paddingTop: props?.subTitle ? 0 : 10
                            }}>{props.title}</Text>
                        </View>
                        {/* subTitle or ip category and sub category or patient age */}
                        {props?.subTitle ? <Text numberOfLines={1} style={[styles.statusValue, { marginTop: 18 }, props.fromWorkShift ? { paddingLeft: 61, paddingTop: 3, } : {}]}>({props.subTitle})</Text> : null}
                    </View>
                </View>

                {/* 
                {props.showSecretIcon ?
                    <View style={{ borderWidth: 2 }}>
                        <Icon name="shield" color="#fff" size={20} />
                        <FontAwesome5 name='shield-alt' color="#fff" size={20} />
                    </View>
                    : null
                } */}


                {/* edit and delete icon view */}
                <View style={[styles.editDeleteIconView, { width: '20%' }]}>
                    <View style={{
                        width: props.showSecretIcon && props.showEditIcon && props.showDeleteIcon
                            ? "80%"
                            : props.showEditIcon && props.showDeleteIcon
                                ? "50%" : '25%',
                        flexDirection: 'row',
                        position: 'absolute',
                        top: 5, right: 15,
                        justifyContent: "flex-end",
                        alignItems: "center",
                        // backgroundColor: "black",
                        // backgroundColor: '#5059B8',
                        // borderRadius: 19,
                        // paddingTop: 9,

                    }}>
                        {props.showSecretIcon ?
                            <>
                                <Foundation name='shield' color={Colors.red} size={21} style={{ marginRight: 10, }} />
                            </>
                            : null
                        }
                        {
                            props.showMenu
                                ?
                                // <View style={{ right: 1, backgroundColor: '#5059B8', borderRadius: 55, width: 22, height: 22, paddingLeft: -15, marginTop: 47, }}>
                                // {/* <Ionicons name='ellipsis-horizontal-sharp' size={20} color={"#fff"} */}
                                <MaterialCommunityIcons style={styles.threeDotIconView} name='dots-horizontal-circle' color={Colors.primary} size={22}
                                    onPress={props.setOpenCardOptions ? () => {
                                        if (props.showMenu) {
                                            props.setOpenCardOptions(props.index)
                                            // console.log("openCardOptions:", props.openCardOptions)
                                        }
                                    } : () => { }} />
                                // {/* </View> */}
                                : null
                        }


                    </View>
                    <View
                        style={styles.statusMainView}>
                        <Text numberOfLines={1} style={[styles.statusTitle, props.second_title_style]}>{props.second_title}</Text>
                        <Text numberOfLines={1} style={[styles.statusValue, props.second_title_value_style, props.second_title ? { marginStart: 5 } : {}]}>{props.second_title_value}</Text>
                    </View>
                </View>
            </View>
            <View style={{
                paddingHorizontal: Constants.globalPaddingHorizontal, paddingVertical: Constants.globalPaddingVetical, marginTop: 5,
            }}>
                {
                    props?.showSecondaryTitle
                        // ? <Text style={styles.patient_detail}>{labels.patient_detail}</Text> : null
                        ? <View style={{ ...styles.forRow, marginTop: props.hide_patient_details_text ? -15 : 0 }}>
                            {props.hide_patient_details_text ? null : <Text style={styles.patient_detail}>{labels["patient-details"]}</Text>}
                            {props.cardLabels
                                ? <View style={{ width: props.hide_patient_details_text ? "100%" : "60%", alignItems: "flex-end", }}>
                                    <Text numberOfLines={1}
                                        style={{
                                            fontFamily: Assets.fonts.regular,
                                            fontSize: getProportionalFontSize(10),
                                            backgroundColor: props.is_approved == 0 ? Colors.gray : Colors.primary,
                                            color: Colors.white,
                                            paddingHorizontal: 5,
                                            paddingVertical: 2,
                                            borderRadius: 3,

                                        }}>
                                        {props.cardLabels}
                                    </Text>
                                </View> : null}
                        </View> : null
                }
                {
                    props.patientName
                        ? <View style={styles.forRow}>
                            <Text style={styles.labelsText}>{labels["name"]} : </Text>
                            <Text numberOfLines={1} style={styles.secondrytext}>{props.patientName}</Text>
                        </View> : null
                }
                {
                    props.patientGender ? <View style={styles.forRow}>
                        <Text style={styles.labelsText}>{labels["gender"]} : </Text>
                        <Text numberOfLines={1} style={styles.secondrytext}>{props.patientGender}</Text>
                    </View> : null
                }
                {
                    props.email ? <View style={styles.forRow}>
                        <Text style={styles.labelsText}>{labels["email"]} : </Text>
                        <Text numberOfLines={1} style={styles.secondrytext}>{props.email
                        }</Text>
                    </View> : null
                }
                {
                    props?.phoneNumber
                        ? <View style={styles.forRow}>
                            <Text style={styles.labelsText}>{labels["contact-number"]} : </Text>
                            <Text numberOfLines={1} style={styles.secondrytext}>{props?.phoneNumber}</Text>
                        </View> : null
                }
                {

                    props?.patientPersonal_number
                        ? <View style={styles.forRow}>
                            <Text style={styles.labelsText}>{labels["personal-number"]} : </Text>
                            <Text numberOfLines={1} style={styles.secondrytext}>{props?.patientPersonal_number}</Text>
                        </View> : null
                }
                {

                    props?.patientPatient_ID
                        ? <View style={styles.forRow}>
                            <Text style={styles.labelsText}>{labels["patient-id"]} : </Text>
                            <Text numberOfLines={1} style={styles.secondrytext}>{props?.patientPatient_ID}</Text>
                        </View> : null
                }
                {
                    props?.branchId
                        ? <View style={styles.forRow}>
                            <Text style={styles.labelsText}>{labels["branch-id"]} : </Text>
                            <Text numberOfLines={1} style={styles.secondrytext}>{props?.branchId}</Text>
                        </View> : null
                }
                {

                    props?.patientBranchName
                        ? <View style={styles.forRow}>
                            <Text style={styles.labelsText}>{labels["branch-name"]} : </Text>
                            <Text numberOfLines={1} style={styles.secondrytext}>{props?.patientBranchName}</Text>
                        </View> : null
                }
                {
                    props?.city
                        ? <View style={styles.forRow}>
                            <Text style={styles.labelsText}>{labels["city"]} : </Text>
                            <Text numberOfLines={1} style={styles.secondrytext}>{props?.city}</Text>
                        </View> : null
                }
                {
                    props?.packageName
                        ? <View style={styles.forRow}>
                            <Text style={styles.labelsText}>{labels["package"]} : </Text>
                            <Text numberOfLines={1} style={styles.secondrytext}>{props?.packageName}</Text>
                        </View> : null
                }
                {
                    props?.startDate
                        ? <View style={styles.forRow}>
                            <Text style={styles.labelsText}>{labels["start-date"]} : </Text>
                            <Text numberOfLines={1} style={styles.secondrytext}>{props?.startDate}</Text>
                        </View> : null
                }
                {
                    props?.endDate
                        ? <View style={styles.forRow}>
                            <Text style={styles.labelsText}>{labels["end-date"]} : </Text>
                            <Text numberOfLines={1} style={styles.secondrytext}>{props?.endDate}</Text>
                        </View> : null
                }
                {
                    props?.date
                        ? <View style={styles.forRow}>
                            <Text style={styles.labelsText}>{labels["date"]} : </Text>
                            <Text numberOfLines={1} style={styles.secondrytext}>{props?.date}</Text>
                        </View> : null
                }
                {
                    props?.startTime
                        ? <View style={styles.forRow}>
                            <Text style={[styles.labelsText, props.fromWorkShift ? { paddingLeft: 60, } : {}]}>{labels["start-time"]} : </Text>
                            <Text numberOfLines={1} style={[styles.secondrytext, props.fromWorkShift ? { paddingLeft: 40, } : {}]}>{props?.startTime}</Text>
                        </View> : null
                }
                {
                    props?.endTime
                        ? <View style={styles.forRow}>
                            <Text style={[styles.labelsText, props.fromWorkShift ? { paddingLeft: 60, } : {}]}>{labels["end-time"]} : </Text>
                            <Text numberOfLines={1} style={[styles.secondrytext, props.fromWorkShift ? { paddingLeft: 40, } : {}]}>{props?.endTime}</Text>
                        </View> : null
                }
                {
                    props?.reason
                        ? <View style={{ ...styles.forRow, marginBottom: 10 }}>
                            <Text style={[styles.labelsText, props.fromWorkShift ? { paddingLeft: 60, } : {}]}>{labels["reason"]} : </Text>
                            <Text numberOfLines={1} style={[styles.secondrytext, props.fromWorkShift ? { paddingLeft: 40, } : {}]}>{props?.reason}</Text>
                        </View> : null
                }
                {
                    props?.leaveDates
                        ? <View style={{ ...styles.forRow, alignItems: "flex-start" }}>
                            <Text style={[styles.labelsText, props.fromWorkShift ? { paddingLeft: 60, } : {}]}>{labels["date"]} : </Text>
                            {/* <Text numberOfLines={1} style={[styles.secondrytext, props.fromWorkShift ? { paddingLeft: 40, } : {}]}>{"props?.leaveDates"}</Text> */}
                            <FlatList
                                data={props?.leaveDates}
                                numColumns="3"
                                keyExtractor={(item, index) => index}
                                // horizontal
                                renderItem={
                                    ({ item }) => (
                                        <Text
                                            style={{
                                                backgroundColor: Colors.primary, color: Colors.white,
                                                fontSize: getProportionalFontSize(12),
                                                marginRight: 10,
                                                fontFamily: Assets.fonts.semiBold,
                                                marginBottom: props.leaveDates.length > 3 ? 5 : 0,
                                                paddingHorizontal: 10,
                                                paddingVertical: 1,
                                                borderRadius: 5
                                            }}>{formatDateByFormat(item.date, "DD/MM")}</Text>
                                    )
                                }
                            />
                        </View> : null
                }


            </View>
            {
                props.children
            }
        </TouchableOpacity >

    );
};

const styles = StyleSheet.create({
    avatarContainer: {
        position: 'absolute',
        top: 20,
        left: 15,
    },
    avatarImage: {
        width: Constants.avatarTextSize,
        height: Constants.avatarTextSize,
        borderRadius: 50,
        marginTop: 5,
        // backgroundColor: 100
        // width: 100,



    },
    avatarText: {
        borderWidth: 0,
        fontSize: getProportionalFontSize(18),
        fontFamily: Assets.fonts.semiBold,
        textTransform: "uppercase", marginTop: -5,
    },
    categoryTypeCard: {
        width: "100%",
        minHeight: 80,
        shadowOffset: { width: 3, height: 3, },
        shadowOpacity: 10,
        elevation: 15,
        shadowColor: Platform.OS == "ios" ? Colors.shadowColorIosDefault : Colors.shadowColorAndroidDefault,
        shadowRadius: 10,
        marginBottom: Constants.listItemBottomMargin,
        backgroundColor: 'white',
        borderRadius: 15,
    },
    categoryNameView: {

        borderWidth: 0,
    },
    categoryNameText: {
        fontFamily: Assets.fonts.bold,
        color: Colors.black,
        fontSize: getProportionalFontSize(15),
        textTransform: 'capitalize',
        marginTop: 13

    },
    statusMainView: {
        flexDirection: 'row',
        paddingTop: 1,
        // elevation: 10
        // marginTop: 20
    },
    statusTitle: {
        fontFamily: Assets.fonts.regular,
        color: Colors.white,
        fontSize: getProportionalFontSize(12),

    },
    statusValue: {
        // fontFamily: Assets.fonts.regular,
        fontFamily: Assets.fonts.bold,
        color: Colors.black,
        fontSize: getProportionalFontSize(10),
        paddingLeft: getProportionalFontSize(5),
        // marginTop: 20
        // paddingTop: 20,
        // paddingLeft: 110
    },
    editDeleteIconView: {
        borderWidth: 0,

    },
    innerContainer: {
        flexDirection: 'row',
        // backgroundColor: Colors.cardColor,
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
        width: '100%',
    },
    patient_detail: {

        fontFamily: Assets.fonts.bold,
        fontSize: getProportionalFontSize(12),
        width: "40%"
    },
    labelsText: {
        fontFamily: Assets.fonts.semiBold,
        fontSize: getProportionalFontSize(12),
        width: "40%"
    },
    secondrytext: {
        fontFamily: Assets.fonts.regular,
        fontSize: getProportionalFontSize(11),
        width: "60%"
    },
    forRow: {
        flexDirection: "row",
        alignItems: "center",
        paddingLeft: "15%",
        // paddingTop: "10%"
        // paddingBottom: "20%"
        // marginTop: -10,
    },
    mainTitle: {
        width: '100%',
        flexDirection: 'row',
        position: 'absolute',

    },
    threeDotIconView: {
        position: "absolute",
        top: 10,
        right: 5,
        zIndex: 90
    },
    closeCircle: {
        position: "absolute",
        //     // width: 40,
        //     // height: 40,
        top: 10,
        right: 20

    },
    icons: {
        width: "70%",
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",

    }

});
