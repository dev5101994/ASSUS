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
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';


export default LeavesListCard = props => {
    // const [openCardOptions, setOpenCardOptions] = React.useState()
    const labels = useSelector(state => state.Labels);


    return (
        <TouchableOpacity
            style={styles.categoryTypeCard}
            activeOpacity={0.9}
        >

            {props.index == props.openCardOptions
                ? <TouchableOpacity style={{
                    zIndex: props.index == props.openCardOptions ? 100 : -100,
                    backgroundColor: props.index == props.openCardOptions ? "#000a" : "#0000",
                    // opacity: props.index == props.openCardOptions ? 1 : 0,
                    width: "100%",
                    height: "100%",
                    position: "absolute",
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: 15,


                }}
                    activeOpacity={1}
                >

                    <Ionicons name='close-circle' size={getProportionalFontSize(20)} color={"#fff"} style={{ alignSelf: "flex-end", bottom: 8, right: 9 }} onPress={() => { props.setOpenCardOptions() }} />
                    {/* <TouchableOpacity onPress={() => { if (props.onPressAssignWork && props.index == props.openCardOptions) { props.onPressAssignWork(); props.setOpenCardOptions() } }}
                        style={{ ...styles.actionContainer, }}>
                        <Ionicons name="file-tray-outline" color={Colors.primary} size={getProportionalFontSize(17)} />

                        <Text style={styles.actionText}>{labels.assignWork}</Text>

                    </TouchableOpacity> */}
                    {/* <View style={{ bottom: 15 }}>
                        <TouchableOpacity onPress={() => { if (props.onPressLeaveIcon && props.index == props.openCardOptions) { props.setOpenCardOptions(); props.onPressLeaveIcon(); } }} style={{ ...styles.actionContainer, }}>
                            <Ionicons name="ios-checkmark-circle-outline" color={Colors.primary} size={getProportionalFontSize(16)} />
                            <Text style={styles.actionText}>{labels.approve}</Text>
                        </TouchableOpacity>
                    </View> */}

                    <View style={{
                        width: "70%",
                        flexDirection: "row",
                        justifyContent: "space-around",
                        alignItems: "center",
                        flexWrap: "wrap",
                        bottom: 8
                        // borderWidth: 2
                    }}>
                        {props.onPressCard
                            ? <TouchableOpacity onPress={() => { if (props.onPressCard && props.index == props.openCardOptions) { props.onPressCard(); props.setOpenCardOptions() } }}
                                style={{ ...styles.actionContainer, }}>
                                <Icon name="eye" color={Colors.primary} size={getProportionalFontSize(18)} />
                                <Text style={styles.actionText}>{labels.View}</Text>
                            </TouchableOpacity>
                            : null
                        }
                        {props.showEditIcon
                            ? <TouchableOpacity onPress={() => { if (props.onPressEdit && props.index == props.openCardOptions) { props.onPressEdit(); props.setOpenCardOptions() } }}
                                style={{ ...styles.actionContainer, }}>
                                <Icon name="edit" color={Colors.primary} size={getProportionalFontSize(16)} />
                                <Text style={styles.actionText}>{labels.Edit}</Text>
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
            {/* new view created */}
            <View style={{ flexDirection: "row", paddingHorizontal: 15, paddingTop: 20, }} >
                <View style={styles.icons}
                // style={{ flex: 1, backgroundColor: Colors.primary, borderRadius: 30, right: 35, height: 60, paddingHorizontal: 10, alignSelf: "center", }}
                >
                    {/* <Image source={{ uri: props.image ?? props.isBranch ? Constants.branchIcon : props?.gender == "female" ? Constants.userImageFemale : Constants.userImageMale }} style={styles.avatarImage} /> */}
                    <MaterialCommunityIcons name="calendar-month-outline" color={Colors.white} size={32} style={styles.icon} />
                </View>
                <View style={{ flex: 6 }} >

                    {/* title and status view */}
                    <View style={{ ...styles.categoryNameView, }}>
                        <Text numberOfLines={1} style={{
                            ...styles.categoryNameText,
                        }}>{props.title}</Text>
                        {props?.subTitle ? <Text numberOfLines={1} style={[styles.statusValue, props.fromWorkShift ? { paddingLeft: 61, paddingTop: 3, } : {}]}>Date :{props.subTitle}</Text> : null}
                    </View>



                    <View style={{
                        paddingLeft: 10, marginVertical: 5,
                    }}>
                        {
                            props?.showSecondaryTitle
                                // ? <Text style={styles.patient_detail}>{labels.patient_detail}</Text> : null
                                ?
                                <View style={{ ...styles.forRow, marginTop: props.hide_patient_details_text ? -15 : 0 }}>
                                    {props.hide_patient_details_text ? null : <Text style={styles.patient_detail}>{labels["patient-details"]}</Text>}
                                    {props.cardLabels
                                        ?

                                        <View style={{ width: props.hide_patient_details_text ? "100%" : "60%", alignItems: "flex-end", }}>
                                            {/* <Text>yu</Text> */}
                                            {/* (props.index == props.openCardOptions) ? */}


                                            {
                                                props.showMenu
                                                    ? (

                                                        <MaterialCommunityIcons style={{ bottom: 10 }} name='dots-horizontal-circle' color={Colors.primary} size={22}
                                                            onPress={props.setOpenCardOptions ? () => {
                                                                if (props.showMenu) {
                                                                    props.setOpenCardOptions(props.index)
                                                                    // console.log("openCardOptions:", props.openCardOptions)
                                                                }
                                                            } : () => { }}



                                                        />) : null

                                            }
                                            <View style={{ backgroundColor: props.status == 0 ? Colors.red : Colors.green, paddingHorizontal: 5, paddingVertical: 0, borderRadius: 20 }}>

                                                <Text numberOfLines={1}
                                                    style={{
                                                        fontFamily: Assets.fonts.regular,
                                                        fontSize: getProportionalFontSize(12),
                                                        // backgroundColor: props.status == 0 ? Colors.red : Colors.green,
                                                        color: Colors.white,
                                                        // paddingHorizontal: 5,
                                                        // paddingVertical: 2,
                                                        bottom: 9,
                                                        borderRadius: 5,
                                                        top: 0
                                                        // alignSelf: "center"

                                                    }}>
                                                    {props.cardLabels}
                                                </Text>
                                            </View>
                                        </View> : null}
                                </View> : null
                        }


                    </View>
                </View>
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
    },
    avatarText: {
        borderWidth: 0,
        fontSize: getProportionalFontSize(18),
        fontFamily: Assets.fonts.semiBold,
        textTransform: "uppercase", marginTop: -5,
    },
    categoryTypeCard: {
        width: "90%",
        // minHeight: 80,
        height: 95,
        shadowOffset: { width: -3, height: -3, },
        shadowOpacity: 10,
        elevation: 10,
        shadowColor: Colors.primary,
        shadowRadius: 10,
        marginBottom: Constants.listItemBottomMargin,
        backgroundColor: 'white',
        // borderRadius: 15,
        borderBottomLeftRadius: 20,
        borderTopLeftRadius: 20,
        left: 40,
        borderTopRightRadius: 20,
        borderBottomRightRadius: 20
        // borderTopLeftRadius: 20
        // borderTopLeftRadius: 40
        // paddingHorizontal: 16
        // paddingVertical: 10,
        // flex: 1
    },
    categoryNameView: {
        // left: 0,
        top: 10,
        right: 25,
        borderWidth: 0,
    },
    categoryNameText: {
        fontFamily: Assets.fonts.bold,
        color: Colors.primary,
        fontSize: getProportionalFontSize(15),
        textTransform: 'capitalize'
    },
    statusMainView: {
        flexDirection: 'row',
        paddingTop: 25
    },
    statusTitle: {
        fontFamily: Assets.fonts.regular,
        color: Colors.white,
        fontSize: getProportionalFontSize(12)
    },
    statusValue: {
        fontFamily: Assets.fonts.regular,
        color: Colors.gray,
        fontSize: getProportionalFontSize(12),
        top: 5
    },
    editDeleteIconView: {
        borderWidth: 0,

    },

    patient_detail: {

        fontFamily: Assets.fonts.bold,
        fontSize: getProportionalFontSize(12),
        width: "40%"
    },
    labelsText: {
        fontFamily: Assets.fonts.semiBold,
        fontSize: getProportionalFontSize(12),
        width: "25%"
    },
    secondrytext: {
        fontFamily: Assets.fonts.regular,
        fontSize: getProportionalFontSize(11),
        width: "75%"
    },
    forRow: {
        flexDirection: "row",
        alignItems: "center",

    },
    mainTitle: {
        width: '100%',
        flexDirection: 'row',
        position: 'absolute',

    },
    icon: {
        justifyContent: "center",
        alignItems: "center",
        alignSelf: "center",
        marginVertical: 13

    },
    icons: {
        flex: 1,
        backgroundColor: Colors.primary,
        borderRadius: 30,
        height: 60,
        paddingHorizontal: 8,
        alignSelf: "center",
        right: 45

    },
    actionContainer: {
        flexDirection: "row",
        backgroundColor: Colors.white,
        paddingHorizontal: 10,
        paddingVertical: 2,
        borderRadius: 50,
        marginVertical: 5
    }
    ,
    actionText: { fontFamily: Assets.fonts.semiBold, color: Colors.primary, fontSize: getProportionalFontSize(15), marginLeft: 5 }

});
