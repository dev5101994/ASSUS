import React from 'react';
import { View, StyleSheet, Text, Platform, TouchableOpacity, Image, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import Icon2 from 'react-native-vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Colors from '../Constants/Colors'
import Assets from '../Assets/Assets';
import { getProportionalFontSize } from '../Services/CommonMethods';
import { useSelector, useDispatch } from 'react-redux';
import Constants from '../Constants/Constants';
import { Avatar } from 'react-native-paper';
import Foundation from 'react-native-vector-icons/Foundation';

const CardForKeyList = (props) => {
    const labels = useSelector(state => state.Labels);
    return (
        <TouchableOpacity
            style={styles.categoryTypeCard}
            onPress={() => { if (props.onPressCard) { props.onPressCard() } }}
        >
            <View style={{ ...styles.innerContainer }}>
                {/* <View style={{ ...styles.avatarContainer }}>

                    <Image source={{ uri: props.image ?? props.isBranch ? Constants.branchIcon : props?.gender == "female" ? Constants.userImageFemale : Constants.userImageMale }} style={styles.avatarImage} />

                </View> */}

                {/* title and status view */}
                <View style={{ ...styles.categoryNameView, width: '80%', }}>
                    <View style={{
                        width: '100%', flexDirection: 'row',

                    }}>
                        {/* title or ip title or ptient name */}
                        <Text numberOfLines={1} style={{
                            ...styles.categoryNameText,
                        }}>{props.title}</Text>
                    </View>
                    {/* subTitle or ip category and sub category or patient age */}
                    {props?.subTitle ? <Text numberOfLines={1} style={{ ...styles.statusValue, marginTop: 20, }}>{props.subTitle}</Text> : null}
                </View>

                {/* edit and delete icon view */}
                <View style={[styles.editDeleteIconView, { width: '20%' }]}>
                    <View style={{
                        width: props.showSecretIcon && props.showEditIcon && props.showDeleteIcon
                            ? "80%"
                            : props.showEditIcon && props.showDeleteIcon
                                ? "50%" : '50%',
                        flexDirection: 'row',
                        justifyContent: "flex-end",
                        position: 'absolute',
                        top: 5, right: 15,
                        // borderWidth: 2
                    }}>

                        {props.showEditIcon ?
                            <>
                                <Icon name="edit" color="#fff" size={20} onPress={() => { if (props.onPressEdit) { props.onPressEdit() } }} />

                            </>
                            : null
                        }
                        {props.showDeleteIcon ?
                            <>
                                <Icon2 name="delete" color="#fff" size={20} style={{ marginStart: 5, }} onPress={() => { if (props.onPressDelete) { props.onPressDelete() } }} />
                            </>
                            : null
                        }
                    </View>
                </View>
            </View>
            <View style={{
                paddingHorizontal: Constants.globalPaddingHorizontal, paddingVertical: Constants.globalPaddingVetical
            }}>
                {
                    props?.showLabel
                        // ? <Text style={styles.patient_detail}>{labels.patient_detail}</Text> : null
                        ? <View style={styles.forRow}>
                            <Text style={styles.patient_detail}>{labels["license-key-details"]}</Text>
                            {props.cardLabels
                                ? <View style={{ width: "60%", alignItems: "flex-end" }}>
                                    <Text numberOfLines={1}
                                        style={{
                                            fontFamily: Assets.fonts.regular,
                                            fontSize: getProportionalFontSize(10),
                                            backgroundColor: props?.is_used == 1 ? Colors.primary : Colors.yellow,
                                            color: props?.is_used == 1 ? Colors.white : Colors.black,
                                            paddingHorizontal: 5,
                                            paddingVertical: 2,
                                            borderRadius: 3
                                        }}>
                                        {props.cardLabels}
                                    </Text>
                                </View> : null}
                        </View> : null
                }
                {
                    props?.company
                        ? <View style={styles.forRow}>
                            <Text style={styles.labelsText}>{labels["company"]} : </Text>

                            <Text style={styles.secondrytext}>{props.company}</Text>
                        </View> : null
                }
                {
                    props.module_attached
                        ? <View style={styles.forRow}>
                            <Text style={styles.labelsText}>{labels["Modules"]} : </Text>

                            <Text style={styles.secondrytext}>{props.module_attached}</Text>
                        </View> : null
                }
                {
                    props.package_details
                        ? <View style={styles.forRow}>
                            <Text style={styles.labelsText}>{labels["package"]} : </Text>
                            <Text numberOfLines={1} style={styles.secondrytext}>{props.package_details}</Text>
                        </View> : null
                }
                {
                    props.active_from ? <View style={styles.forRow}>
                        <Text style={styles.labelsText}>{labels["created-at"]} : </Text>
                        <Text numberOfLines={1} style={styles.secondrytext}>{props.active_from}</Text>
                    </View> : null
                }
                {
                    props.expire_at ? <View style={styles.forRow}>
                        <Text style={styles.labelsText}>{labels["expire_date"]} : </Text>
                        <Text numberOfLines={1} style={styles.secondrytext}>{props.expire_at}</Text>
                    </View> : null
                }

                {props.children}

            </View>


        </TouchableOpacity >
    )
}

export default CardForKeyList

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
        shadowOffset: { width: 3, height: 3, },
        shadowOpacity: 10,
        elevation: 8,
        shadowColor: Platform.OS == "ios" ? Colors.shadowColorIosDefault : Colors.shadowColorAndroidDefault,
        shadowRadius: 10,
        marginBottom: Constants.listItemBottomMargin,
        backgroundColor: 'white',
        borderRadius: 15,
        // borderWidth: 3
    },
    categoryNameView: {
        paddingLeft: 15,
        justifyContent: "center"
    },
    categoryNameText: {
        fontFamily: Assets.fonts.bold,
        color: Colors.white,
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
        color: Colors.white,
        fontSize: getProportionalFontSize(10)
    },
    editDeleteIconView: {
        borderWidth: 0,

    },
    innerContainer: {
        flexDirection: 'row',
        backgroundColor: Colors.cardColor,
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
        width: '100%',
        height: 40
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
        marginVertical: 1
    },
})