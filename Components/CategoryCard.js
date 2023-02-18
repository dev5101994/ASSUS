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
import { color } from 'react-native-reanimated';


const CategoryCard = (props) => {

    return (

        <TouchableOpacity
            onPress={() => { if (props.onPressCard) { props.onPressCard() } }}
            style={[styles.categoryTypeCard, props.style]}>
            <View style={styles.categoryTypeCards}>

                <View style={{ ...styles.avatarImagesBackground }}>
                    {
                        props?.labelText
                            ? <Avatar.Text size={getProportionalFontSize(45)} label={props?.labelText}
                                color={Colors.white}
                                labelStyle={styles.avatarText} />
                            : null
                    }
                </View>


                {/* MID View */}
                <View style={{ ...styles.categoryNameView, paddingLeft: !props.hideAvtar ? 0 : 20, }}>
                    <Text numberOfLines={1} style={styles.categoryNameText}>{props.title}</Text>

                    {/* title and status view */}
                    <View style={styles.statusMainView}>
                        <Text numberOfLines={1} style={[styles.statusTitle, props.second_title_style]}>{props.second_title}</Text>
                        {/* <Text numberOfLines={1} style={[styles.statusValue, props.second_title_value_style, props.second_title ? { marginStart: 5 } : {}, { color: !props.hideAvtar ? '#000' : null }]}>{props.second_title_value}</Text> */}
                    </View>
                </View>


                {/* edit and delete icon view */}
                <View style={[styles.editDeleteIconView, { width: props.showEditIcon && props.showDeleteIcon ? "20%" : '10%' }]}>
                    <View style={styles.box}>
                        {props.showEditIcon ?
                            <>
                                {props.inProgress
                                    ? <ProgressLoader onActivityIndicator={true} onActivityIndicatorSize='small' onActivityIndicatorColor={Colors.primary} />

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


                                    }
                                </>
                                : null
                        }
                    </View>
                </View>
            </View>

        </TouchableOpacity>

    );
};

export default CategoryCard
const styles = StyleSheet.create({
    avatarImage: { width: Constants.avatarTextSize, height: Constants.avatarTextSize, borderRadius: 50 },
    avatarText: { borderWidth: 0, fontSize: getProportionalFontSize(0), fontFamily: Assets.fonts.semiBold, textTransform: "uppercase", marginTop: -3 },
    categoryTypeCard: {
        width: "100%",
        minHeight: 100,
        paddingHorizontal: Constants.globalPaddingHorizontal,
        shadowOffset: { width: 3, height: 3, },
        shadowOpacity: 10,
        elevation: 15,
        shadowColor: Colors.primary,
        shadowRadius: 10,
        marginBottom: Constants.listItemBottomMargin,
        backgroundColor: 'white',
        borderRadius: 30,
        // borderWidth: 2
        // backgroundColor: Colors.primary

    },
    categoryNameView: {
        width: '60%',
        borderWidth: 0,
        justifyContent: "center"
    },
    categoryNameText: {
        fontFamily: Assets.fonts.bold,
        color: Colors.black,
        fontSize: getProportionalFontSize(15),
        // marginTop: 2
        // paddingTop: 32,
    },
    statusMainView: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    statusTitle: {
        fontFamily: Assets.fonts.regular,
        color: Colors.gray,
        fontSize: getProportionalFontSize(12),
        marginTop: 5
    },
    statusValue: {
        fontFamily: Assets.fonts.regular,
        color: Colors.black,
        // color: Colors.gray,
        fontSize: getProportionalFontSize(12),
        paddingBottom: 17
    },
    editDeleteIconView: {
        width: '20%',
        // flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 0,
        color: Colors.black,

        // justifyContent: "space-around",

    },
    avatarImagesBackground: {
        backgroundColor: Colors.white,
        padding: 2,
        borderRadius: 100,
        marginLeft: -34,
        // borderWidth: 1,
        // borderColor: Colors.white
    },
    IconColor: {
        backgroundColor: Colors.white,
        width: 30,
        borderRadius: 50,
        height: 30,
        alignItems: "center",
        justifyContent: "center"

    },
    IconColors: {
        backgroundColor: Colors.white,
        width: 30,
        borderRadius: 50,
        height: 30,
        alignItems: "center",
        justifyContent: "center"


    },
    box: {
        width: 80,
        height: 100,
        backgroundColor: Colors.primary,
        borderTopRightRadius: 20,
        borderBottomRightRadius: 20,
        alignItems: "center",
        justifyContent: "space-evenly",
        marginLeft: 20

    },
    categoryTypeCards: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        // color: Colors.primary
    }

});
