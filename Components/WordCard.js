import React, { useState } from 'react';
import { View, StyleSheet, Text, Platform, TouchableOpacity, } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Colors from '../Constants/Colors'
import Assets from '../Assets/Assets';
import { getProportionalFontSize } from '../Services/CommonMethods';
import Constants from '../Constants/Constants';
import { Avatar } from 'react-native-paper';
import ProgressLoader from './ProgressLoader';
import { black } from 'react-native-paper/lib/typescript/styles/colors';
//import ProgressLoader from './ProgressLoader';

export default CommonCRUDCard = props => {

    return (
        <TouchableOpacity
            onPress={() => { if (props.onPressCard) { props.onPressCard() } }}
            style={styles.categoryTypeCard}>
            <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
            }}>
                {/* <View style={styles.avatarBackground}> */}
                {!props.hideAvtar ? <View style={styles.avatarImagesBackground}>
                    {
                        // <View>
                        props?.image ? <Image source={{ uri: props.image }} style={styles.avatarImage} resizeMode="cover" /> : props?.labelText ? <Avatar.Text size={Constants.avatarTextSize} label={props?.labelText} color="#fff" labelStyle={styles.avatarText} /> : null
                        // {/* </View> */}
                    }
                    {/* </View> */}
                </View> : null}
                <View style={{ ...styles.categoryNameView, paddingLeft: !props.hideAvtar ? 0 : 20, }}>
                    <Text numberOfLines={1} style={styles.categoryNameText}>{props.title}</Text>
                    {/* title and status view */}
                    <View style={styles.statusMainView}>
                        <Text numberOfLines={1} style={[styles.statusTitle, props.second_title_style]}>{props.second_title}</Text>
                        <Text numberOfLines={1} style={[styles.statusValue, props.second_title_value_style, props.second_title ? { marginStart: 5 } : {}, { color: !props.hideAvtar ? '#000' : null }]}>{props.second_title_value}</Text>
                    </View>
                    {/* <View style={styles.statusMainView}>
                        <Text numberOfLines={1} style={[styles.statusTitle, props.second_title_style]}>{props.third_title}</Text>
                        <Text numberOfLines={1} style={[styles.statusValue, props.second_title_value_style, props.third_title ? { marginStart: 5 } : {}]}>{props.third_title_value}</Text>
                    </View> */}
                </View>

                {/* edit and delete icon view */}
                <View style={[styles.editDeleteIconView, { width: props.showEditIcon && props.showDeleteIcon ? "20%" : '10%' }]}>
                    {props.showEditIcon ?
                        <>
                            {props.inProgress
                                ? <ProgressLoader onActivityIndicator={true} onActivityIndicatorSize='small' onActivityIndicatorColor={Colors.primary} />
                                // : <Icon name="edit" color="green" size={25} onPress={() => { if (props.onPressEdit) { props.onPressEdit() } }} />
                                :
                                <View style={styles.IconColor}>
                                    <Feather name="edit" color={Colors.primary} size={20} style={{ paddingLeft: 1 }} onPress={() => { if (props.onPressEdit) { props.onPressEdit() } }} />
                                </View>
                            }
                        </>
                        : null
                    }
                    {
                        props.showDeleteIcon ?
                            <>
                                {props.inProgress
                                    ? <ProgressLoader onActivityIndicator={true} onActivityIndicatorSize='small' onActivityIndicatorColor={Colors.primary} />
                                    :
                                    <View style={styles.IconColors}>
                                        <FontAwesome name="trash-o" color={Colors.primary} size={20} style={{ paddingLeft: 1 }} onPress={() => { if (props.onPressDelete) { props.onPressDelete() } }} />
                                    </View>
                                    //  <Icon name="delete" color="red" size={25} style={{ marginStart: 5 }} onPress={() => { if (props.onPressDelete) { props.onPressDelete() } }} />

                                }
                            </>
                            : null
                    }
                </View>

            </View>

            {props.extraBottomTitle
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
            }

            {props.extraBottomSecondTitle
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
            }

        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    avatarImage: { width: Constants.avatarTextSize, height: Constants.avatarTextSize, borderRadius: 50 },
    avatarText: { borderWidth: 0, fontSize: getProportionalFontSize(0), fontFamily: Assets.fonts.semiBold, textTransform: "uppercase", marginTop: -3 },
    categoryTypeCard: {
        width: "100%",
        minHeight: 80,
        paddingHorizontal: Constants.globalPaddingHorizontal,
        shadowOffset: { width: 3, height: 3, },
        shadowOpacity: 10,
        elevation: 15,
        shadowColor: Platform.OS == "ios" ? Colors.shadowColorIosDefault : Colors.shadowColorAndroidDefault,
        shadowRadius: 10,
        marginBottom: Constants.listItemBottomMargin,
        backgroundColor: 'white',
        borderRadius: 50
    },
    categoryNameView: {
        width: '60%',
        borderWidth: 0,


    },
    categoryNameText: {
        fontFamily: Assets.fonts.bold,
        color: Colors.black,
        fontSize: getProportionalFontSize(15),
        paddingTop: 32,
    },
    statusMainView: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    statusTitle: {
        fontFamily: Assets.fonts.regular,
        color: Colors.black,
        fontSize: getProportionalFontSize(12),
        paddingBottom: 23
    },
    statusValue: {
        fontFamily: Assets.fonts.regular,
        color: Colors.black,
        fontSize: getProportionalFontSize(12),
        paddingBottom: 17
    },
    editDeleteIconView: {
        width: '20%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 0,
    },
    avatarImagesBackground: {
        backgroundColor: Colors.white,
        padding: 1.25,
        borderRadius: 100,

    },
    IconColor: {
        backgroundColor: Colors.backgroundGray,
        paddingTop: 8,
        paddingBottom: 8,
        borderRadius: 100,
        paddingLeft: 8,
        paddingRight: 8,
        marginHorizontal: 5,
        // paddingLeft: -500



    },
    IconColors: {
        backgroundColor: Colors.backgroundGray,
        paddingTop: 8,
        paddingBottom: 8,
        borderRadius: 100,
        paddingLeft: 10,
        paddingRight: 10,
        marginHorizontal: 5,
        // paddingLeft: -500

    }
    // avatarBackground: {
    //     backgroundColor: "#D9D9D9",
    //     padding: getProportionalFontSize(1),
    //     borderRadius: 100,


    // }
});
