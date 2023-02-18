import React from 'react';
import { View, StyleSheet, Text, Platform, TouchableOpacity, Image } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Colors from '../Constants/Colors'
import Assets from '../Assets/Assets';
import { getProportionalFontSize } from '../Services/CommonMethods';
import Constants from '../Constants/Constants';
import { Avatar } from 'react-native-paper';
import ProgressLoader from '../Components/ProgressLoader';
import { color } from 'react-native-reanimated';
//import ProgressLoader from './ProgressLoader';

export default ModuleCard = props => {
    return (
        <TouchableOpacity
            onPress={() => { if (props.onPressCard) { props.onPressCard() } }}
            style={styles.categoryTypeCard}>
            <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
            }}>
                {/* {
                    props?.image ? <Image source={{ uri: props.image }} style={styles.avatarImage} resizeMode="cover" /> : props?.labelText ? <Avatar.Text size={Constants.avatarTextSize} label={props?.labelText} color="#fff" labelStyle={styles.avatarText} /> : null
                } */}

                <Image source={Assets.images.Module_Icon} style={{ height: 40, width: 40, top: 10, left: 25, }} />

                <View style={styles.categoryNameView}>
                    {/* <Image source={Assets.images.Module_Icon} style={{ height: 20, width: 20 }} /> */}

                    <Text numberOfLines={1} style={styles.categoryNameText}>{props.title}</Text>
                    {/* title and status view */}
                    <View style={styles.statusMainView}>
                        {/* <Text numberOfLines={1} style={[styles.statusTitle, props.second_title_style]}>{props.second_title}</Text> */}
                        <Text numberOfLines={1} style={[styles.statusValue, props.second_title_value_style, props.second_title ? { marginStart: 5 } : {}]}>{props.second_title_value}</Text>
                    </View>
                    {/* <View style={styles.statusMainView}>
                        <Text numberOfLines={1} style={[styles.statusTitle, props.second_title_style]}>{props.third_title}</Text>
                        <Text numberOfLines={1} style={[styles.statusValue, props.second_title_value_style, props.third_title ? { marginStart: 5 } : {}]}>{props.third_title_value}</Text>
                    </View> */}
                </View>
                {/* edit and delete icon view */}
                {/* <View style={[styles.editDeleteIconView, { width: props.showEditIcon && props.showDeleteIcon ? "20%" : '10%' }]}>
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
                </View> */}

            </View>

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
    // avatarImage: { width: Constants.avatarTextSize, height: Constants.avatarTextSize, borderRadius: 50, },
    // avatarText: { borderWidth: 0, fontSize: getProportionalFontSize(20), fontFamily: Assets.fonts.semiBold, textTransform: "uppercase" },
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
        elevation: 25,
        shadowColor: Platform.OS == "ios" ? Colors.shadowColorIosDefault : Colors.shadowColorAndroidDefault,
        shadowRadius: 10,
        marginBottom: Constants.listItemBottomMargin,
        // backgroundColor: 'white',
        backgroundColor: Colors.MorelightGreen,
        // backgroundColor: Colors.MorelightGreen,
        borderRadius: 15,
        borderRadius: 50,
        // border: "2px",
        // color: Colors.black
    },
    categoryNameView: {
        width: '60%',
        borderWidth: 0,
        // left: 100
        //justifyContent: 'center',
        //flexDirection: 'row',
        //alignItems: 'center'

    },
    categoryNameText: {
        fontFamily: Assets.fonts.bold,
        color: Colors.black,
        fontSize: getProportionalFontSize(15),
        // left: -10
        top: 10
    },
    // statusMainView: {
    //     flexDirection: 'row',
    //     alignItems: 'center'
    // },
    // statusTitle: {
    //     fontFamily: Assets.fonts.regular,
    //     color: Colors.black,
    //     fontSize: getProportionalFontSize(12)
    // },
    statusValue: {
        fontFamily: Assets.fonts.regular,
        color: Colors.black,
        fontSize: getProportionalFontSize(12),
        top: 10
    },
    // editDeleteIconView: {
    //     width: '20%',
    //     flexDirection: 'row',
    //     alignItems: 'center',
    //     justifyContent: 'center',
    //     borderWidth: 0,
    // }
});
