import React, { useState } from 'react';
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
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'; //timeline
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'; //notebook

const borderRadius = 15;

export default PatientAndEmployeeCard = (props) => {

    const labels = useSelector(state => state.Labels);
    const gender = useSelector(state => state.Labels.gender);

    return (
        // Main view
        <TouchableOpacity onPress={() => { if (props.onPressCard) { props.onPressCard(); props.setOpenCardOptions() } }}
            style={styles.mainView}>


            {/*       View_________________Edit_________________Delete       */}

            {props.index == props.openCardOptions
                ? <TouchableOpacity style={{
                    zIndex: props.index == props.openCardOptions ? 100 : -100,
                    backgroundColor: props.index == props.openCardOptions ? Colors.transparent_black : Colors.black,
                    // opacity: props.index == props.openCardOptions ? 1 : 0,
                    width: "100%",
                    height: "100%",
                    position: "absolute",
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: 15,
                    // backgroundColor: 'white',

                }}
                    onPress={props.setOpenCardOptions ? () => props.setOpenCardOptions() : () => { }}
                >

                    {/*Styles Ionicons */}
                    <View style={styles.Ionicons}>
                        <Ionicons name='close-circle' size={getProportionalFontSize(20)} color={Colors.white} onPress={() => { props.setOpenCardOptions() }} />
                    </View>

                    <View style={styles.EditDelete}>
                        {props.onPressCard
                            ? <TouchableOpacity onPress={() => { if (props.onPressCard && props.index == props.openCardOptions) { props.onPressCard(); props.setOpenCardOptions() } }}
                                style={{ ...styles.actionContainer, }}
                            >
                                <View style={styles.categoryTypeCard}>

                                    <Icon name="eye" color={Colors.primary} size={getProportionalFontSize(18)} />
                                    <Text style={styles.actionText}>{labels.View}</Text>

                                </View>
                            </TouchableOpacity>
                            : null
                        }
                        {props.showEditIcon
                            ? <TouchableOpacity onPress={() => { if (props.onPressEdit && props.index == props.openCardOptions) { props.onPressEdit(); props.setOpenCardOptions() } }}
                                style={{ ...styles.actionContainer, }}>
                                <View style={styles.categoryTypeCard}>
                                    <Icon name="edit" color={Colors.primary} size={getProportionalFontSize(16)} />
                                    <Text style={styles.actionText}>{labels.Edit}</Text>
                                </View>
                            </TouchableOpacity>
                            : null
                        }
                        {props.showDeleteIcon
                            ? <TouchableOpacity onPress={() => { if (props.onPressDelete && props.index == props.openCardOptions) { props.setOpenCardOptions(); props.onPressDelete(); } }}
                                style={{ ...styles.actionContainer, }}>
                                <View style={styles.categoryTypeCard}>
                                    <Icon2 name="delete" color={Colors.primary} size={getProportionalFontSize(15)} />

                                    <Text style={styles.actionText}>{labels.delete}</Text>

                                </View>
                            </TouchableOpacity>
                            : null
                        }
                        {props.showAssignWork
                            ? <TouchableOpacity onPress={() => { if (props.onPressAssignWork && props.index == props.openCardOptions) { props.onPressAssignWork(); props.setOpenCardOptions() } }}
                                style={{ ...styles.actionContainer, }}>
                                <View style={styles.categoryTypeCard}>
                                    <Ionicons name="file-tray-outline" color={Colors.primary} size={getProportionalFontSize(15)} />
                                    <Text style={styles.actionText}>{labels.assignWork}</Text>
                                </View>
                            </TouchableOpacity>
                            : null
                        }
                        {props.showLeaveApprovedIcon
                            ? <TouchableOpacity onPress={() => { if (props.onPressLeaveIcon && props.index == props.openCardOptions) { props.setOpenCardOptions(); props.onPressLeaveIcon(); } }} style={{ ...styles.actionContainer, }}>
                                <View style={styles.categoryTypeCard}>
                                    <Ionicons name="ios-checkmark-circle-outline" color={Colors.primary} size={getProportionalFontSize(15)} />
                                    <Text style={styles.actionText}>{labels.approve}</Text>
                                </View>
                            </TouchableOpacity>
                            : null
                        }
                    </View>
                </TouchableOpacity>
                : null
            }


            {/* Shield Icon & threeDot Icon */}
            <View
                style={{
                    width: props.showSecretIcon && props.showEditIcon && props.showDeleteIcon
                        ? "80%"
                        : props.showEditIcon && props.showDeleteIcon
                            ? "50%" : '25%',
                    flexDirection: 'row',
                    position: 'absolute',
                    top: 5, right: 15,
                    justifyContent: "flex-end",
                    alignItems: "center",
                    // position: "absolute"
                }}
            >
                {props.showSecretIcon && !(props.index == props.openCardOptions) ?
                    <>
                        <Foundation style={styles.shield} name='shield' color={Colors.red} size={22}
                        />
                    </>
                    : null
                }
                <View style={{
                    position: "absolute",
                    // width: 40,
                    // height: 40,
                    top: 10,
                    right: 20
                }}>
                    <Ionicons name='close-circle' size={getProportionalFontSize(30)} color={"#fff"} onPress={() => { props.setOpenCardOptions() }} />
                </View>
                {
                    props.showMenu
                        ?

                        <MaterialCommunityIcons style={styles.threeDotIconView} name='dots-horizontal-circle' color={Colors.primary} size={22}
                            //  onPress={() => { }} 

                            onPress={props.setOpenCardOptions ? () => {
                                if (props.showMenu) {
                                    props.setOpenCardOptions(props.index)
                                    // console.log("openCardOptions:", props.openCardOptions)
                                }
                            } : () => { }}

                        />

                        : null
                }
            </View>


            {/* Floting three dot icon  */}
            {/* <MaterialCommunityIcons style={styles.threeDotIconView} name='dots-horizontal-circle' color={Colors.primary} size={15}
                //  onPress={() => { }} 
                onPress={props.setOpenCardOptions ? () => {
                    if (props.showMenu) {
                        props.setOpenCardOptions(props.index)
                        console.log("openCardOptions:", props.openCardOptions)
                    }
                } : () => { }}

            /> */}

            {/* left view with primary backgroundColor */}
            <View style={styles.leftView}>
                {/* profile image */}
                <Image
                    source={{ uri: props.image ?? props.isBranch ? Constants.branchIcon : props?.gender == "female" ? Constants.userImageFemale : Constants.userImageMale }}
                    style={styles.profileImage}
                />

                {!props.hideCount
                    ? <View style={{ width: "65%", }} >
                        <View style={styles.badgeContainer}>
                            <View style={styles.badge}>
                                <MaterialIcons name='timeline' color={Colors.primary} size={15} />
                            </View>
                            <Text style={styles.badgeText}>{props.counttimeline > 99 ? "99+" : props.counttimeline}</Text>
                        </View>
                        <View style={styles.badgeContainer}>
                            <View style={styles.badge}>
                                <FontAwesome5 name='tasks' color={Colors.primary} size={12} />
                            </View>
                            <Text style={styles.badgeText}>{props.counttasks > 99 ? '99+' : props.counttasks}</Text>
                        </View>
                        <View style={styles.badgeContainer}>
                            <View style={styles.badge}>
                                <MaterialCommunityIcons name='notebook' color={Colors.primary} size={12} />
                            </View>
                            <Text style={styles.badgeText}>{props.countnotebook > 99 ? '99+' : props.countnotebook}</Text>
                        </View>
                    </View>
                    : null
                }
            </View>

            {/* right white view */}
            <View style={styles.rightView}>
                <View style={styles.informationView}>

                    <Text style={styles.topTitle}>{props.title}</Text>

                    <Text style={[styles.smallGrayText, { marginTop: 2 }]}>{props.subTitle}</Text>

                    <View style={[styles.infoRow, { marginTop: 15 }]}>
                        <Text numberOfLines={1} style={[styles.boldGrayText, { flex: 1 }]}>{labels["Email"]} :</Text>
                        <Text numberOfLines={1} style={[styles.smallGrayText, { flex: 1.2 }]}>{props.email}</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Text numberOfLines={1} style={[styles.boldGrayText, { flex: 1 }]}>{labels["contact-number"]} :</Text>
                        <Text numberOfLines={1} style={[styles.smallGrayText, { flex: 1.2 }]}>{props?.phoneNumber}</Text>
                    </View>
                    {props?.patientBranchName
                        ? <View style={styles.infoRow}>
                            <Text numberOfLines={1} style={[styles.boldGrayText, { flex: 1 }]}>{labels["branch-name"]} :</Text>
                            <Text numberOfLines={1} style={[styles.smallGrayText, { flex: 1.2 }]}>{props?.patientBranchName}</Text>
                        </View>
                        : null}
                </View>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    informationView: {
        padding: 15
    },
    topTitle: {
        fontSize: getProportionalFontSize(14),
        fontFamily: Assets.fonts.semiBold,
        color: Colors.black
    },
    boldGrayText: {
        fontSize: getProportionalFontSize(13),
        fontFamily: Assets.fonts.semiBold,
        color: Colors.gray,
    },
    infoRow: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 2,
        width: "100%"
    },
    smallGrayText: {
        fontSize: getProportionalFontSize(12),
        fontFamily: Assets.fonts.regular,
        color: Colors.gray
    },
    profileImage: {
        height: 55,
        width: 55,
        zIndex: 100,
        borderRadius: 30,
    },
    whiteCircleView: {
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: Colors.white,
        borderRadius: 10,
        height: 17,
        width: 17
    },
    leftView: {
        borderTopLeftRadius: borderRadius,
        borderBottomLeftRadius: borderRadius,
        width: "25%",
        height: "100%",
        backgroundColor: Colors.primary,
        justifyContent: "space-evenly",
        alignItems: "center"
    },
    rightView: {
        borderTopEndRadius: borderRadius,
        borderBottomEndRadius: borderRadius,
        width: "75%",
        height: "100%",
        backgroundColor: Colors.white
    },
    mainView: {
        flexDirection: "row",
        width: "100%",
        height: 150,
        borderRadius: borderRadius,
        marginTop: Constants.formFieldTopMargin,

        // shadow styles
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 10,
        elevation: 10,
        shadowColor: Colors.primary,
        shadowRadius: 4,
        // backgroundColor: 'white',
    },
    badgeContainer: {
        width: "100%",
        height: 19,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: Colors.white,
        flexDirection: "row",
        alignItems: "center",
        marginVertical: 3
    },
    badge: {
        backgroundColor: Colors.white,
        width: 17,
        height: 17,
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",

    },
    badgeText: {
        fontFamily: Assets.fonts.semiBold,
        fontSize: getProportionalFontSize(12),
        color: Colors.white,
        marginLeft: 8,
    },
    threeDotIconView: {
        position: "absolute",
        top: 5,
        right: 5,
        zIndex: 90
    },
    actionText: {
        color: Colors.primary,
        marginLeft: 5
    },
    categoryTypeCard: {
        width: "100%",
        minHeight: 22,
        paddingHorizontal: 10,
        shadowOffset: { width: 3, height: 3, },
        shadowOpacity: 10,
        elevation: 8,
        shadowColor: Platform.OS == "ios" ? Colors.shadowColorIosDefault : Colors.shadowColorAndroidDefault,
        shadowRadius: 10,
        marginBottom: Constants.listItemBottomMargin,
        backgroundColor: 'white',
        borderRadius: 15,
        flexDirection: "row",
        alignItems: "center",
        // justifyContent: "center"
        // justifyContent: "space-evenly"
        // marginVertical: 40,
        // borderWidth: 2

    },
    Ionicons: {
        position: "absolute",
        // width: 40,
        // height: 40,
        top: 10,
        right: 20,
    },
    EditDelete: {
        width: "70%",
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
        flexWrap: "wrap",

        // borderWidth: 2
    },
    shield: {
        position: "absolute",
        top: 5,
        right: 30,
        zIndex: 100,

    }
});
