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

export default WorkShiftListingCard = props => {
    // const [openCardOptions, setOpenCardOptions] = React.useState()
    const labels = useSelector(state => state.Labels);
    const gender = useSelector(state => state.Labels.gender);


    return (
        <TouchableOpacity onPress={() => { if (props.onPressCard) { props.onPressCard(); props.setOpenCardOptions() } }}
            style={styles.categoryTypeCard}
            activeOpacity={0.9}
        >
            {/* <View style={styles.ColorCard}> */}
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
                <View
                    style={{
                        position: "absolute",
                        // width: 40,
                        // height: 40,
                        top: 10,
                        right: 20
                    }}>
                    <Ionicons name='close-circle' size={25} color={"#fff"} onPress={() => { props.setOpenCardOptions() }} />
                </View>
                <View style={{
                    width: "70%",
                    flexDirection: "row",
                    justifyContent: "space-around",
                    alignItems: "center",
                }}>

                    {props.showEditIcon
                        ? <TouchableOpacity onPress={() => { if (props.onPressEdit) { props.onPressEdit(); props.setOpenCardOptions() } }} style={{ justifyContent: "center", alignItems: "center", }}>
                            <Icon name="edit" color="#fff" size={20} />
                            <Text style={{ fontFamily: Assets.fonts.medium, color: Colors.white, fontSize: getProportionalFontSize(12), marginTop: 5 }}>{labels.Edit}</Text>
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


                </View>
            </TouchableOpacity>


            <View style={styles}>
                <View style={{ ...styles.avatarContainer, }}>


                    {
                        props?.avatarColor
                            ? <FontAwesome name='circle' color={props.workShiftColor} size={55} style={styles.avatarImage} />
                            : null
                    }


                </View>
            </View>
            {/* </ImageBackground> */}




            {/* title and status view */}
            <View style={{ ...styles.categoryNameView, width: '80%', paddingLeft: props?.hideAvatar ? 15 : 60, }}>

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
                        paddingLeft: 31,
                        paddingTop: props?.subTitle ? 0 : 10,
                        marginTop: 10
                    }}>{props.title}</Text>
                </View>
                {/* subTitle or ip category and sub category or patient age */}
                {props?.subTitle ? <Text numberOfLines={1} style={[styles.statusValue, { marginTop: 34 }, props.fromWorkShift ? { paddingLeft: 75, paddingTop: 5, } : {}]}>{props.subTitle}</Text> : null}
            </View>


            {/* edit and delete icon view */}

            <View style={[styles.editDeleteIconView, { width: '20%' }]}>
                <View style={{
                    width: props.showSecretIcon && props.showEditIcon && props.showDeleteIcon
                        ? "80%"
                        : props.showEditIcon && props.showDeleteIcon
                            ? "50%" : '25%',
                    flexDirection: 'row',
                    position: 'absolute',
                    top: -25, right: -280,
                    // backgroundColor: '#5059B8',
                    alignItems: "center",
                    // borderRadius: 20,


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

                            <View style={styles.IconCircle}>

                                <Ionicons name='ellipsis-horizontal-sharp' size={16} color={"#fff"} style={{ marginTop: 2, marginLeft: 3 }}


                                    onPress={props.setOpenCardOptions ? () => {
                                        // if (props.showMenu) {
                                        props.setOpenCardOptions(props.index)
                                        // console.log("openCardOptions:", props.openCardOptions)
                                        // }
                                    } : () => { }}


                                />
                            </View>
                            : null
                    }

                </View>


                <Text numberOfLines={1} style={[styles.statusTitle, props.second_title_style]}>{props.second_title}</Text>
                <Text numberOfLines={1} style={[styles.statusValue, props.second_title_value_style, props.second_title ? { marginStart: 5 } : {}]}>{props.second_title_value}</Text>
            </View>


            {/* </ImageBackground> */}


            <View style={{
                paddingHorizontal: Constants.globalPaddingHorizontal, paddingVertical: Constants.globalPaddingVetical, marginTop: -50, marginLeft: 80,
            }}>

                {
                    props?.startTime
                        ? <View style={styles.forRow}>
                            <Text style={[styles.labelsText, props.fromWorkShift ? { paddingLeft: 30, } : {}]}>{labels["start-time"]} : </Text>
                            <Text numberOfLines={1} style={[styles.secondrytext, props.fromWorkShift ? { paddingLeft: 40, } : {}]}>{props?.startTime}</Text>
                        </View> : null
                }
                {
                    props?.endTime
                        ? <View style={{ ...styles.forRow, marginBottom: 5 }}>
                            <Text style={[styles.labelsText, props.fromWorkShift ? { paddingLeft: 30, } : {}]}>{labels["end-time"]} : </Text>
                            <Text numberOfLines={1} style={[styles.secondrytext, props.fromWorkShift ? { paddingLeft: 40, } : {}]}>{props?.endTime}</Text>
                        </View> : null
                }




            </View>
            {
                props.children
            }
            {/* </View > */}
        </TouchableOpacity>


    );
};

const styles = StyleSheet.create({
    avatarContainer: {
        position: 'absolute',
        // top: 20,
        // left: 15,
        // right: -250,
        backgroundColor: Colors.primary,
        width: "25%",
        height: 110,
        borderBottomLeftRadius: 10,
        borderTopLeftRadius: 10

    },
    avatarImage: {
        // width: Constants.avatarTextSize,
        // height: Constants.avatarTextSize,
        borderRadius: 50,
        // paddingTop: 25
        marginTop: 25,
        left: 25,
        width: 55,
        height: 55,

    },
    avatarText: {
        borderWidth: 0,
        fontSize: getProportionalFontSize(18),
        fontFamily: Assets.fonts.semiBold,
        textTransform: "uppercase", marginTop: 5,
    },
    categoryTypeCard: {
        width: "100%",
        // minHeight: 80,
        height: 110,
        shadowOffset: { width: 3, height: 3, },
        shadowOpacity: 10,
        elevation: 8,
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
        // color: Colors.white,
        color: Colors.black,
        fontSize: getProportionalFontSize(15),
        textTransform: 'capitalize',
        marginLeft: 36

    },
    statusMainView: {
        flexDirection: 'row',
        paddingTop: 25
        // marginTop: '0',
    },
    statusTitle: {
        fontFamily: Assets.fonts.regular,
        color: Colors.white,
        fontSize: getProportionalFontSize(12)

    },
    statusValue: {
        fontFamily: Assets.fonts.regular,
        // color: Colors.black,
        // color: "#727272",
        fontSize: getProportionalFontSize(10),
        marginLeft: 37,
        // visiblity: hidden
        // display: "none"
        opacity: 0
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
        // marginBottom: 3
    },
    mainTitle: {
        width: '100%',
        flexDirection: 'row',
        position: 'absolute',
        // color: Colors.black,

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
    ImageIcon: {
        // backgroundColor: '#5059B8',
        backgroundColor: Colors.primary,
        width: '15%',
        borderBottomLeftRadius: 10,
        borderTopLeftRadius: 10,
        left: -14,
        paddingBottom: 63,
        paddingTop: 20,
        top: -20

    },
    IconCircle: {
        right: 1,
        backgroundColor: Colors.primary,
        borderRadius: 20,
        width: 22,
        height: 22,
        marginLeft: 29,
        paddingLeft: -1,
        marginTop: -14,

    },
    ColorCard: {
        backgroundColor: Colors.primary,
        width: "50%",
        // height: "100%"
    },


});
