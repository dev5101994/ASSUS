



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

export default ImplementationPlanCardList = props => {
    // const [openCardOptions, setOpenCardOptions] = React.useState()
    const labels = useSelector(state => state.Labels);


    return (
        <TouchableOpacity
            onPress={() => {
                props.onPressCard ? props.onPressCard() : null
            }}
            style={styles.categoryTypeCard}
            activeOpacity={0.9}
        >
            <View style={{
                width: 6,
                position: "absolute",
                backgroundColor: props.status == 0 ? Colors.red : Colors.green,
                height: "50%",
                left: 0,
                top: "25%",
                borderTopRightRadius: 10,
                borderBottomRightRadius: 10
                // transform: {
                //     translateX: "-50%"
                // }

            }} />


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
                    <View style={{
                        position: "absolute",
                        // width: 40,
                        // height: 40,
                        top: 10,
                        right: 20
                    }}>
                        <Ionicons name='close-circle' size={getProportionalFontSize(30)} color={"#fff"} onPress={() => { props.setOpenCardOptions() }} />
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
            <View style={{ flexDirection: "row", paddingHorizontal: 15, paddingTop: 20 }} >
                <View style={{ flex: 1 }}>
                    <Image source={{ uri: props.image ?? props.isBranch ? Constants.branchIcon : props?.gender == "female" ? Constants.userImageFemale : Constants.userImageMale }} style={styles.avatarImage} />
                </View>
                <View style={{ flex: 6 }} >
                    <View style={{ ...styles.innerContainer, paddingHorizontal: 10, }}>
                        {/* title and status view */}
                        <View style={{ ...styles.categoryNameView, }}>
                            <Text numberOfLines={1} style={{
                                ...styles.categoryNameText,
                            }}>{props.title}</Text>
                            {props?.subTitle ? <Text numberOfLines={1} style={[styles.statusValue, props.fromWorkShift ? { paddingLeft: 61, paddingTop: 3, } : {}]}>{props.subTitle}</Text> : null}
                        </View>
                        {/* edit and delete icon view */}
                        <View style={[styles.editDeleteIconView,]}>
                            <View >
                                {
                                    props.showMenu
                                        ?
                                        <View style={styles.IconCircle}>
                                            <Ionicons name='ellipsis-horizontal-sharp' size={18} color={Colors.white} style={{ marginTop: 1.5, marginLeft: 2.5 }}
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
                        </View>
                    </View>

                    <View style={{
                        paddingLeft: 10, marginVertical: 5,
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
                                                    fontSize: getProportionalFontSize(9),
                                                    backgroundColor: props.status == 0 ? Colors.red : Colors.green,
                                                    color: Colors.white,
                                                    paddingHorizontal: 5,
                                                    paddingVertical: 2,
                                                    borderRadius: 10
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
        width: "100%",
        minHeight: 80,
        shadowOffset: { width: -3, height: -3, },
        shadowOpacity: 10,
        elevation: 10,
        shadowColor: Colors.primary,
        shadowRadius: 10,
        marginBottom: Constants.listItemBottomMargin,
        backgroundColor: 'white',
        borderRadius: 15,
        // paddingVertical: 10,
        // flex: 1
    },
    categoryNameView: {

        borderWidth: 0,
    },
    categoryNameText: {
        fontFamily: Assets.fonts.bold,
        color: Colors.black,
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
        color: Colors.black,
        fontSize: getProportionalFontSize(10)
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
        justifyContent: "space-between"
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
    IconCircle: {
        right: 1,
        backgroundColor: Colors.primary,
        borderRadius: 20,
        width: 22,
        height: 22,
        // top: 3
        // marginLeft: 25,
        // paddingLeft: -1,
        // marginTop: -14,

    },
    actionContainer: {
        flexDirection: "row",
        backgroundColor: Colors.white,
        paddingHorizontal: 10,
        paddingVertical: 3,
        borderRadius: 50,
        marginVertical: 5
    },
    actionText: { fontFamily: Assets.fonts.semiBold, color: Colors.primary, fontSize: getProportionalFontSize(12), marginLeft: 5 }

});
