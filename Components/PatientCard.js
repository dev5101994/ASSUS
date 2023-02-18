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
import { black } from 'react-native-paper/lib/typescript/styles/colors';

export default IPListCard = props => {
    // const [openCardOptions, setOpenCardOptions] = React.useState()
    const labels = useSelector(state => state.Labels);
    const gender = useSelector(state => state.Labels.gender);

    // const ActionCard=()=>{
    //     return(

    //     )
    // }
    return (
        <TouchableOpacity onPress={() => { if (props.onPressCard) { props.onPressCard(); props.setOpenCardOptions() } }}
            style={styles.categoryTypeCard}
            activeOpacity={0.9}
        >
            {props.index == props.openCardOptions
                ? <TouchableOpacity style={{
                    zIndex: props.index == props.openCardOptions ? 100 : -100,
                    // backgroundColor: props.index == props.openCardOptions ? "#000a" : "#0000",
                    backgroundColor: props.index == props.openCardOptions ? "#000a" : Colors.black,
                    // opacity: props.index == props.openCardOptions ? 1 : 0,
                    width: "100%",
                    height: "100%",
                    position: "absolute",
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: 15,

                }}
                    onPress={props.setOpenCardOptions ? () => props.setOpenCardOptions() : () => { }}
                >
                    <View style={{
                        position: "absolute",
                        // width: 40,
                        // height: 40,
                        top: 10,
                        right: 20
                    }}>
                        <Ionicons name='close-circle' size={(40)} color={"#fff"} onPress={() => { props.setOpenCardOptions() }} />
                    </View>
                    <View style={{
                        width: "70%",
                        flexDirection: "row",
                        justifyContent: "space-around",
                        alignItems: "center",
                        flexWrap: "wrap",
                        // borderWidth: 2
                    }}>
                        {props.onPressCard
                            ? <TouchableOpacity onPress={() => { if (props.onPressCard && props.index == props.openCardOptions) { props.onPressCard(); props.setOpenCardOptions() } }}
                                style={{ ...styles.actionContainer, }}>
                                <Icon name="eye" color={Colors.primary} size={getProportionalFontSize(18)} />
                                <Text style={styles.actionText}>{labels.view}</Text>
                            </TouchableOpacity>
                            : null
                        }
                        {props.showEditIcon
                            ? <TouchableOpacity onPress={() => { if (props.onPressEdit && props.index == props.openCardOptions) { props.onPressEdit(); props.setOpenCardOptions() } }}
                                style={{ ...styles.actionContainer, }}>
                                <Icon name="edit" color={Colors.primary} size={getProportionalFontSize(16)} />
                                <Text style={styles.actionText}>{labels.edit}</Text>
                            </TouchableOpacity>
                            : null
                        }
                        {props.showDeleteIcon
                            ? <TouchableOpacity onPress={() => { if (props.onPressDelete && props.index == props.openCardOptions) { props.setOpenCardOptions(); props.onPressDelete(); } }}
                                style={{ ...styles.actionContainer, }}>
                                <Icon2 name="delete" color={Colors.primary} size={getProportionalFontSize(16)} />
                                <Text style={styles.actionText}>{labels.delete}</Text>
                            </TouchableOpacity>
                            : null
                        }
                        {props.showAssignWork
                            ? <TouchableOpacity onPress={() => { if (props.onPressAssignWork && props.index == props.openCardOptions) { props.onPressAssignWork(); props.setOpenCardOptions() } }}
                                style={{ ...styles.actionContainer, }}>
                                <Ionicons name="file-tray-outline" color={Colors.primary} size={getProportionalFontSize(17)} />
                                <Text style={styles.actionText}>{labels.assignWork}</Text>
                            </TouchableOpacity>
                            : null
                        }
                        {props.showLeaveApprovedIcon
                            ? <TouchableOpacity onPress={() => { if (props.onPressLeaveIcon && props.index == props.openCardOptions) { props.setOpenCardOptions(); props.onPressLeaveIcon(); } }} style={{ ...styles.actionContainer, }}>
                                <Ionicons name="ios-checkmark-circle-outline" color={Colors.primary} size={getProportionalFontSize(16)} />
                                <Text style={styles.actionText}>{labels.approve}</Text>
                            </TouchableOpacity>
                            : null
                        }

                    </View>
                </TouchableOpacity>
                : null
            }
            <View style={{ ...styles.innerContainer }}>
                <View style={{ ...styles.avatarContainer }}>
                    {/* {
                        props.isBranch
                            ? <MaterialIcons name='add-business' size={20} color={"#000"} style={{ ...styles.avatarImage, backgroundColor: "#fff", }} />
                            : <Image source={{ uri: props.image ?? props?.gender == "female" ? Constants.userImageFemale : Constants.userImageMale }} style={styles.avatarImage} />
                    } */}
                    {
                        props?.avatarColor
                            ?
                            <FontAwesome name='circle' color={props.workShiftColor} size={40} style={styles.avatarImage} />
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
                        <Text numberOfLines={1} style={{
                            ...styles.categoryNameText,
                            paddingLeft: 54.40,
                            marginTop: 10,
                            paddingTop: props?.subTitle ? 0 : 10
                        }}>{props.title}</Text>
                    </View>
                    {/* subTitle or ip category and sub category or patient age */}
                    {props?.subTitle ? <Text numberOfLines={1} style={[styles.statusValue, { marginTop: 35, marginBottom: -10, }, props.fromWorkShift ? { paddingLeft: 5, paddingTop: 3, } : {}]}>{props.subTitle}</Text> : null}
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
                        alignItems: "center"
                    }}>
                        {props.showSecretIcon ?
                            <>
                                <Foundation name='shield' color={Colors.red} size={21} style={{ marginRight: 10, marginTop: 19, }} />
                            </>
                            : null
                        }
                        {
                            props.showMenu
                                ?
                                <View style={styles.styles_ellipsishorizontal_sharp}>
                                    <Ionicons name='ellipsis-horizontal-sharp' size={16} color={"#fff"} style={{ marginTop: 2, marginLeft: 3 }}
                                        onPress={props.setOpenCardOptions ? () => {
                                            if (props.showMenu) {
                                                props.setOpenCardOptions(props.index)
                                                // console.log("openCardOptions:", props.openCardOptions)
                                            }
                                        } : () => { }} />
                                </View>
                                : null
                        }


                    </View>


                    <View style={styles.statusMainView}>
                        <Text numberOfLines={1} style={[styles.statusTitle, props.second_title_style]}>{props.second_title}</Text>
                        <Text numberOfLines={1} style={[styles.statusValue, props.second_title_value_style, props.second_title ? { marginStart: 5 } : {}]}>{props.second_title_value}</Text>
                    </View>
                </View>
            </View>

            <View style={{
                paddingHorizontal: Constants.globalPaddingHorizontal, paddingVertical: Constants.globalPaddingVetical, marginTop: 10,
            }}>
                {
                    props?.showSecondaryTitle
                        // ? <Text style={styles.patient_detail}>{labels.patient_detail}</Text> : null
                        ? <View style={{ ...styles.forRow, marginTop: props.hide_patient_details_text ? -15 : 0 }}>
                            {props.hide_patient_details_text ? null : <Text style={styles.patient_detail}>{labels["patient-details"]}</Text>}
                            {props.cardLabels
                                ? <View style={{ width: props.hide_patient_details_text ? "100%" : "60%", alignItems: "flex-end", }}>
                                    <Text numberOfLines={1}
                                        // <View style={styles.statusMainView}></View>
                                        style={{
                                            fontFamily: Assets.fonts.regular,
                                            fontSize: getProportionalFontSize(10),
                                            backgroundColor: props.is_approved == 0 ? Colors.gray : Colors.primary,
                                            color: Colors.white,
                                            paddingHorizontal: 5,
                                            paddingVertical: 2,
                                            borderRadius: 3,
                                            // paddingTop: -5
                                            // paddingLeft: 10
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
                    props?.shiftType
                        ? <View style={styles.forRow}>
                            <Text style={[styles.labelsText, props.fromWorkShift ? { paddingLeft: 60, } : {}]}>{labels["shift_type"]} : </Text>
                            <Text numberOfLines={1} style={[styles.secondrytext, props.fromWorkShift ? { paddingLeft: 40, } : {}]}>{props?.shiftType}</Text>
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
                                            }}>{formatDateByFormat(item.shift_date, "DD/MM")}</Text>
                                    )
                                }
                            />
                        </View> : null
                }


            </View>
            <View style={styles.children}>
                {

                    props.children

                }
            </View>
        </TouchableOpacity >

    );
};

const styles = StyleSheet.create({
    avatarContainer: {
        position: 'absolute',
        // top: 20,
        // left: 10,
        width: '22%',
        height: '100%',
        backgroundColor: Colors.primary,
        paddingBottom: 189.56,
        borderTopLeftRadius: 20,
        borderBottomLeftRadius: 16

    },
    avatarImage: {
        width: Constants.avatarTextSize,
        height: Constants.avatarTextSize,
        borderRadius: 50,
        marginLeft: 20.50,
        marginTop: 11

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
        elevation: 8,
        shadowColor: Platform.OS == "ios" ? Colors.shadowColorIosDefault : Colors.shadowColorAndroidDefault,
        shadowRadius: 10,
        marginBottom: Constants.listItemBottomMargin,
        backgroundColor: 'white',
        borderRadius: 15,
        // marginVertical: 30,
        // borderWidth: 2

    },
    categoryNameView: {

        borderWidth: 0,
    },
    categoryNameText: {
        fontFamily: Assets.fonts.bold,
        color: Colors.black,
        fontSize: getProportionalFontSize(15),
        textTransform: 'capitalize',

    },
    statusMainView: {
        flexDirection: 'row',
        paddingTop: 25
    },
    statusTitle: {
        fontFamily: Assets.fonts.regular,
        color: Colors.white,
        fontSize: getProportionalFontSize(12),

    },
    statusValue: {
        fontFamily: Assets.fonts.regular,
        color: Colors.black,
        fontSize: getProportionalFontSize(10),
        paddingLeft: 38,

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
        paddingBottom: 10
        // paddingTop: getProportionalFontSize(2),

        // backgroundColor: Colors.primary,
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
        // paddingLeft: getProportionalFontSize(70.68),
        paddingLeft: 81.68,
        // marginVertical: getProportionalFontSize(3),
        marginVertical: 3,
        // marginTop: -1
        // paddingTop: getProportionalFontSize(10)

    },
    mainTitle: {
        width: '100%',
        flexDirection: 'row',
        position: 'absolute',

    },
    children: {

        marginTop: -120,
        // marginBottom: 

    },
    actionContainer: {
        flexDirection: "row",
        backgroundColor: Colors.white,
        paddingHorizontal: 10,
        paddingVertical: 3,
        borderRadius: 50,
        marginVertical: 5
    },
    actionText: {
        fontFamily: Assets.fonts.semiBold,
        color: Colors.primary,
        fontSize: getProportionalFontSize(12),
        marginLeft: 5
    },
    styles_ellipsishorizontal_sharp: {
        right: 1,
        backgroundColor: Colors.primary,
        borderRadius: 20,
        width: 22,
        height: 22, paddingLeft: -15,
        marginTop: 4,

    }

});
