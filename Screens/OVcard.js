import React from 'react';
import { View, StyleSheet, Text, Platform, TouchableOpacity, Image, Dimensions, FlatList, ImageBackground, ImageBackgroundBase } from 'react-native';
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
import { color } from 'react-native-reanimated';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'; //notebook

export default IPListCard = props => {
    const [openCardOptions, setOpenCardOptions] = React.useState()
    const labels = useSelector(state => state.Labels);
    const gender = useSelector(state => state.Labels.gender);


    return (
        <TouchableOpacity onPress={() => { if (props.onPressCard) { props.onPressCard(); props.setOpenCardOptions() } }}
            style={{ ...styles.categoryTypeCard, }}
            activeOpacity={0.9}
        >
            <TouchableOpacity style={{
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
                onPress={props.setOpenCardOptions ? () => props.setOpenCardOptions() : () => { }}
            >
                <View style={{
                    position: "absolute",
                    // width: 40,
                    // height: 40,
                    top: 10,
                    right: 20,
                    // flex: 1,
                    // borderWidth: 2
                }}>
                    <Ionicons name='close-circle' size={25} color={"#fff"} onPress={() => { props.setOpenCardOptions() }} />
                </View>
                <View style={{
                    width: "70%",
                    flexDirection: "row",
                    justifyContent: "space-around",
                    alignItems: "center",
                    // flex: 2,
                    // borderWidth: 2
                }}>
                    {
                        props.onPressCard
                            ? <TouchableOpacity onPress={() => { if (props.onPressCard) { props.onPressCard(); props.setOpenCardOptions() } }} style={{ justifyContent: "center", alignItems: "center", }}>


                                <Icon name="eye" color="#fff" size={20} />
                                {/* <Icon name="eye" color={Colors.primary} size={getProportionalFontSize(18)} /> */}
                                <Text style={{ fontFamily: Assets.fonts.medium, color: Colors.white, fontSize: getProportionalFontSize(12), marginTop: 5 }}>{labels.view}</Text>
                                {/* <Text style={styles.actionText}>{labels.view}</Text> */}
                            </TouchableOpacity>
                            : null
                    }
                    {props.showEditIcon
                        ? <TouchableOpacity onPress={() => { if (props.onPressEdit) { props.onPressEdit(); props.setOpenCardOptions() } }} style={{ justifyContent: "center", alignItems: "center", }}>
                            <Icon name="edit" color="#fff" size={20} />
                            <Text style={{ fontFamily: Assets.fonts.medium, color: Colors.white, fontSize: getProportionalFontSize(12), marginTop: 5 }}>{labels.edit}</Text>
                        </TouchableOpacity>
                        : null
                    }
                    {props.showAssignWork
                        ? <TouchableOpacity onPress={() => { if (props.onPressAssignWork) { props.onPressAssignWork(); props.setOpenCardOptions() } }} style={{ justifyContent: "center", alignItems: "center", }}>
                            <Ionicons name="file-tray-outline" color="#fff" size={20} />
                            <Text style={{ fontFamily: Assets.fonts.medium, color: Colors.white, fontSize: getProportionalFontSize(12), marginTop: 5 }}>{labels.assignWork}</Text>
                        </TouchableOpacity>
                        : null
                    }
                    {props.showDeleteIcon
                        ? <TouchableOpacity onPress={() => { if (props.onPressDelete) { props.setOpenCardOptions(); props.onPressDelete(); } }} style={{ justifyContent: "center", alignItems: "center", }}>
                            <Icon2 name="delete" color="#fff" size={20} />
                            <Text style={{ fontFamily: Assets.fonts.medium, color: Colors.white, fontSize: getProportionalFontSize(12), marginTop: 5 }}>{labels.delete}</Text>
                        </TouchableOpacity>
                        : null
                    }
                    {props.showLeaveApprovedIcon
                        ? <TouchableOpacity onPress={() => { if (props.onPressLeaveIcon) { props.setOpenCardOptions(); props.onPressLeaveIcon(); } }} style={{ justifyContent: "center", alignItems: "center", }}>
                            <Ionicons name="ios-checkmark-circle-outline" color="#fff" size={20} />
                            <Text style={{ fontFamily: Assets.fonts.medium, color: Colors.white, fontSize: getProportionalFontSize(12), marginTop: 5 }}>{labels.approve}</Text>
                        </TouchableOpacity>
                        : null
                    }

                </View>
            </TouchableOpacity>

            <View style={{ flexDirection: "row", borderColor: "red", flex: 1 }}>
                <View style={{ ...styles.avatarContainer, flex: 2, overflow: "visible" }}>
                    {props.isBranch
                        ? <MaterialIcons name='add-business' size={20} color={"#000"} style={{ ...styles.avatarImage, backgroundColor: "#fff", }} />
                        :
                        <View style={{ backgroundColor: Colors.primary, width: "80%", overflow: "visible", height: "100%", borderBottomLeftRadius: 10, borderTopLeftRadius: 10, }}>
                            <Image source={{ uri: props.image ?? props?.gender == "female" ? Constants.userImageFemale : Constants.userImageMale }} style={styles.avatarImage} />
                        </View>}
                </View>

                <View style={{
                    flex: 9,
                    // paddingHorizontal: Constants.globalPaddingHorizontal, paddingVertical: Constants.globalPaddingVetical, marginLeft: 80,
                }}>
                    {/* title and status view */}
                    <View
                    // style={[styles.mainTitle,]}
                    >
                        {/* title or ip title or ptient name */}
                        <Text numberOfLines={1} style={{
                            ...styles.categoryNameText,

                        }}>{props.title}</Text>
                    </View>
                    <View style={{ paddingTop: 4 }}>
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
                    </View>
                </View>
                {/* edit and delete icon view */}


                <View style={[styles.editDeleteIconView, { width: '20%', flex: 1 }]}>

                    {
                        props.showMenu
                            ?
                            // <View style={{ right: -10, backgroundColor: '#5059B8', borderRadius: 100, width: 17, height: 10, paddingLeft: 1, marginTop: -3 }}>
                            // <View style={[styles.IconColors, { backgroundColor: Colors.primary, borderRadius: 10, paddingHorizontal: 1, paddingVertical: 2, marginLeft: 5, paddingLeft: 3, marginTop: -5 }]}>
                            <View style={styles.IconCircle}>
                                {/* // <View style={{ right: 1, backgroundColor: Colors.primary, borderRadius: 20, width: 22, height: 22, marginLeft: 29, paddingLeft: -1, marginTop: -8, }}> */}
                                <MaterialCommunityIcons style={styles.threeDotIconView} name='dots-horizontal-circle' color={Colors.primary} size={23}                                    /* <Ionicons name='ellipsis-horizontal-sharp' size={10} color={"#fff"} style={{
                                        marginRight: -35,
                                    }} */



                                    onPress={props.setOpenCardOptions ? () => {
                                        if (props.showMenu) {
                                            props.setOpenCardOptions(props.index)
                                            // console.log("openCardOptions:", props.openCardOptions)
                                        }
                                    } : () => { }} />
                            </View>
                            : null
                    }



                    <View style={styles.statusMainView}>
                        <Text numberOfLines={1} style={[styles.statusTitle, props.second_title_style]}>{props.second_title}</Text>
                        <Text numberOfLines={1} style={[styles.statusValue, props.second_title_value_style, props.second_title ? { marginStart: 5 } : {}]}>{props.second_title_value}</Text>
                    </View>
                </View>
            </View>

        </TouchableOpacity >

    );
};

const styles = StyleSheet.create({
    avatarContainer: {
        // position: 'absolute',
        // top: 15,
        // left: 15,
        // right: -200,
        // backgroundColor: Colors.primary,
        // width: 60,
        // height: 15,


    },
    avatarImage: {
        width: Constants.avatarTextSize,
        height: Constants.avatarTextSize,
        borderRadius: 50,
        // paddingTop: 25
        marginLeft: "50%",
        marginTop: "50%"
        // paddingTop: "20%"
        // left: 10,
        // width: 55,
        // height: 55,
        // borderWidth: 2



    },
    avatarText: {
        borderWidth: 0,
        fontSize: getProportionalFontSize(18),
        fontFamily: Assets.fonts.semiBold,
        textTransform: "uppercase", marginTop: 5,
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
        // borderWidth: 2,
        flex: 1
    },
    categoryNameView: {

        borderWidth: 0,
    },
    categoryNameText: {
        fontFamily: Assets.fonts.bold,
        // color: Colors.white,
        color: Colors.black,
        fontSize: getProportionalFontSize(15),
        textTransform: 'capitalize',
        marginLeft: 36,
        marginTop: "2%",
        // borderWidth: 2

    },
    statusMainView: {
        flexDirection: 'row',
        paddingTop: 25
        // marginTop: '0',
    },
    statusTitle: {
        fontFamily: Assets.fonts.regular,
        color: Colors.white,
        fontSize: getProportionalFontSize(12),
        // paddingBottom: 10

    },
    statusValue: {
        fontFamily: Assets.fonts.regular,
        color: Colors.thingrey,
        // color: "#727272",
        fontSize: getProportionalFontSize(10),
        marginLeft: 37
    },
    editDeleteIconView: {
        borderWidth: 0,

    },
    // innerContainer: {
    //     flexDirection: 'row',
    //     // backgroundColor: Colors.cardColor,
    //     // backgroundColor: '#2c2cc7',
    //     // flexDirection: 'column',
    //     // borderTopLeftRadius: 12,
    //     // borderTopRightRadius: 12,
    //     // width: '100%',
    //     // width: '100%',
    //     borderWidth: 2,
    //     flex: 7

    //     // paddingBottom: -90,
    //     // height: 50

    //     // justifyContent: 'space-evenly'

    //     // paddingRight: 9
    //     // paddingHorizontal: Constants.globalPaddingHorizontal,
    // },
    patient_detail: {

        fontFamily: Assets.fonts.bold,
        fontSize: getProportionalFontSize(12),
        width: "40%",

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
        // alignItems: "center"
        alignItems: "flex-end",
        paddingLeft: "13%",
        // marginTop: "10%"
    },
    mainTitle: {
        width: '100%',
        flexDirection: 'row',
        // position: 'absolute',
        // color: Colors.black,

    },

    actionContainer: {
        flexDirection: "row",
        backgroundColor: Colors.white,
        paddingHorizontal: 10,
        paddingVertical: 3,
        borderRadius: 50,
        marginVertical: 5,
        // borderWidth: 2
    },
    actionText: {
        fontFamily: Assets.fonts.semiBold,
        color: Colors.primary,
        fontSize: getProportionalFontSize(12),
        marginLeft: 5
    },
    ImageIcon: {
        // backgroundColor: '#5059B8',
        backgroundColor: Colors.primary,
        width: '15%',
        borderBottomLeftRadius: 10,
        borderTopLeftRadius: 10,
        left: -14,
        paddingBottom: 63,
        paddingTop: 20,
        top: -20,
        flex: 2

    },
    IconCircle: {

        // backgroundColor: Colors.primary,
        paddingTop: 35
        // borderRadius: 20,
        // width: 22,
        // height: 22,
    }



});
