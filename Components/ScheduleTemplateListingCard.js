import React from 'react';
import { View, StyleSheet, Text, Platform, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Colors from '../Constants/Colors'
import Assets from '../Assets/Assets';
import { getProportionalFontSize } from '../Services/CommonMethods';
import Constants from '../Constants/Constants';
import { Avatar } from 'react-native-paper';
import ProgressLoader from './ProgressLoader';
import ScheduleTemplateListing from '../Screens/ScheduleTemplateListing';
//import ProgressLoader from './ProgressLoader';
import { Divider } from 'react-native-paper';
import FontAwesome from 'react-native-vector-icons/dist/FontAwesome';
import AntDesign from 'react-native-vector-icons/dist/AntDesign'
import MaterialCommunityIcons from 'react-native-vector-icons/dist/MaterialCommunityIcons'
import { color } from 'react-native-reanimated';
import Feather from 'react-native-vector-icons/dist/Feather'

export default ScheduleTemplateListingCard = props => {
    return (
        <TouchableOpacity
            onPress={() => { if (props.onPressCard) { props.onPressCard() } }}
            style={styles.categoryTypeCard}>
            <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                // justifyContent: "flex-end"
                // top: 100,
                justifyContent: 'space-between',
            }}>
                {/* {
                    props?.image ? <Image source={{ uri: props.image }} style={styles.avatarImage} resizeMode="cover" /> : props?.labelText ? <Avatar.Text size={Constants.avatarTextSize} label={props?.labelText} color="#fff" labelStyle={styles.avatarText} /> : null
                } */}
                <View style={styles.categoryNameView}>
                    <Text numberOfLines={1} style={styles.categoryNameText}>{props.title}</Text>
                    {/* title and status view */}
                    <View style={styles.statusMainView}>
                        <Text numberOfLines={1} style={[styles.statusTitle, props.second_title_style]}>{props.second_title}</Text>
                        <Text numberOfLines={1} style={[styles.statusValue, props.second_title_value_style, props.second_title ? { marginStart: 5 } : {}]}>{props.second_title_value}</Text>
                    </View>
                </View>

                {/* edit and delete icon view */}
                <View style={[styles.editDeleteIconView, { width: props.showEditIcon && props.showDeleteIcon ? "20%" : '10%' }]}>
                    {props.showEditIcon ?
                        <>
                            {props.inProgress
                                ? <ProgressLoader onActivityIndicator={true} onActivityIndicatorSize='small' onActivityIndicatorColor={Colors.primary} />
                                : <Icon name="edit" color="green" size={25} onPress={() => { if (props.onPressEdit) { props.onPressEdit() } }} />
                            }
                        </>
                        : null
                    }
                    {
                        props.showDeleteIcon ?
                            <>
                                {props.inProgress
                                    ? <ProgressLoader onActivityIndicator={true} onActivityIndicatorSize='small' onActivityIndicatorColor={Colors.primary} />
                                    : <Icon name="delete" color="red" size={25} style={{ marginStart: 5 }} onPress={() => { if (props.onPressDelete) { props.onPressDelete() } }} />
                                }
                            </>
                            : null
                    }
                    {
                        props.showCopyIcon ?
                            <>
                                {props.inProgress
                                    ? <ProgressLoader onActivityIndicator={true} onActivityIndicatorSize='small' onActivityIndicatorColor={Colors.primary} />
                                    : <Icon name="content-copy" color={Colors.yellow} size={25} style={{ marginStart: 5 }} onPress={() => { if (props.onPressCopy) { props.onPressCopy() } }} />
                                }
                            </>
                            : null
                    }
                    {
                        props.showActiveIcon ?
                            <>
                                {props.inProgress
                                    ? <ProgressLoader onActivityIndicator={true} onActivityIndicatorSize='small' onActivityIndicatorColor={Colors.primary} />
                                    : <Icon name="power-settings-new" color={Colors.yellow} size={25} style={{ marginStart: 5 }} onPress={() => { if (props.onPressActive) { props.onPressActive() } }} />
                                }
                            </>
                            : null
                    }
                </View>

            </View>
            {/* <View style={styles.Divider}>
                <Divider bold={true} style={{ color: Colors.black, height: 2 }} />

                <View style={styles.icons}>
                    <View style={styles.edit}>
                        <Feather name="edit" color={Colors.white} size={22} style={{ left: 8, top: 5 }} />
                    </View>
                    <View style={styles.delete}>
                        <FontAwesome name="trash-o" color={Colors.white} size={24} style={{ left: 8, top: 5 }} />
                    </View>
                    <View style={styles.copy}>
                        <MaterialCommunityIcons name="content-copy" color={Colors.white} size={24} style={{ left: 5, top: 5 }} />
                    </View>
                    <View style={styles.power}>
                        <FontAwesome name="power-off" color={Colors.white} size={24} style={{ left: 7, top: 6 }} />
                    </View>
                </View>

            </View> */}

            {/* {props.extraBottomTitle
                ? <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginTop: 5
                }}>
                    <Text numberOfLines={1} style={[styles.statusTitle,]}>{props.extraBottomTitle}</Text>
                    {props.is_present ?
                        <Icon name="check" color="green" size={25} />
                        : <Icon name="close" color="red" size={25} />
                    }
                </View>
                : null
            } */}

            {/* {props.extraBottomSecondTitle
                ? <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                }}>
                    <Text numberOfLines={1} style={[styles.statusTitle,]}>{props.extraBottomSecondTitle}</Text>
                    {props.is_participating ?
                        <Icon name="check" color="green" size={25} />
                        : <Icon name="close" color="red" size={25} />
                    }
                </View>
                : null
            } */}



        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    avatarImage: { width: Constants.avatarTextSize, height: Constants.avatarTextSize, borderRadius: 50 },
    avatarText: { borderWidth: 0, fontSize: getProportionalFontSize(20), fontFamily: Assets.fonts.semiBold, textTransform: "uppercase" },
    categoryTypeCard: {
        width: "100%",
        // minHeight: 80,
        height: 90,
        paddingHorizontal: Constants.globalPaddingHorizontal,
        paddingVertical: Constants.globalPaddingVetical,
        // flexDirection: 'row',
        // alignItems: 'center',
        // justifyContent: 'space-between',
        shadowOffset: { width: 3, height: 3, },
        shadowOpacity: 10,
        elevation: 15,
        shadowColor: Platform.OS == "ios" ? Colors.shadowColorIosDefault : Colors.shadowColorAndroidDefault,
        shadowRadius: 10,
        marginBottom: Constants.listItemBottomMargin,
        backgroundColor: 'white',
        borderRadius: 15
    },
    categoryNameView: {
        width: '83%',
        borderWidth: 0,

        //justifyContent: 'center',
        //flexDirection: 'row',
        //alignItems: 'center'
    },
    categoryNameText: {
        fontFamily: Assets.fonts.bold,
        color: Colors.black,
        fontSize: getProportionalFontSize(15),
    },
    statusMainView: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    statusTitle: {
        fontFamily: Assets.fonts.regular,
        color: Colors.gray,
        fontSize: getProportionalFontSize(12)
    },
    statusValue: {
        fontFamily: Assets.fonts.regular,
        // color: Colors.black,
        color: Colors.gray,
        fontSize: getProportionalFontSize(12)
    },
    editDeleteIconView: {
        width: '20%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 0,
    },
    Divider: {
        width: "100%",
        // height: 20,
        top: 30,
        color: Colors.black
    },
    icons: {
        flexDirection: "row",
        // justifyContent: "space-around",
        justifyContent: "space-between",
        top: 10
    },
    delete: {
        backgroundColor: Colors.bloodred,
        borderRadius: 30,
        height: 35,
        width: 35
    },
    edit: {
        backgroundColor: Colors.primary,
        borderRadius: 30,
        height: 35,
        width: 35

    },
    copy: {
        backgroundColor: Colors.yellow,
        borderRadius: 30,
        height: 35,
        width: 35
    },
    power: {
        backgroundColor: Colors.yellow,
        borderRadius: 30,
        height: 35,
        width: 35
    }
});
