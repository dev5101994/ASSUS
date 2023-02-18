import React from 'react';
import { View, StyleSheet, Text, Platform, TouchableOpacity, } from 'react-native';
import Colors from '../Constants/Colors'
import Assets from '../Assets/Assets';
import { getProportionalFontSize } from '../Services/CommonMethods';
import Constants from '../Constants/Constants';
import { Avatar } from 'react-native-paper';
import ProgressLoader from './ProgressLoader';
import { useSelector, useDispatch } from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';
const PackagesListCard = (props) => {
    const { title, price, discounted_price, index, sms_charges, bankid_charges, onPressDelete, is_on_offer, discount_type, discount_value, number_of_patients, number_of_employees, validity_in_days, is_enable_bankid_charges, is_sms_enable, total_buyer, onPressEdit } = props;



    // REDUX hooks
    const UserLogin = useSelector(state => state.User.UserLogin);
    const permissions = UserLogin?.permissions ?? {}
    const labels = useSelector(state => state.Labels);

    const messages = useSelector(state => state.Labels.messages);

    return (
        <TouchableOpacity
            activeOpacity={0.8}
            // onPress={() => { if (props.onPressCard) { props.onPressCard() } }}
            style={styles.categoryTypeCard}>

            {/* Offer tag */}
            {
                is_on_offer
                    ? <View style={{
                        position: "absolute",
                        backgroundColor: Colors.primary,
                        paddingHorizontal: 10,
                        paddingVertical: 3,
                        borderRadius: 10,
                        right: Constants.globalPaddingHorizontal,
                        top: Constants.globalPaddingHorizontal * 4,
                    }}>
                        <Text style={{
                            fontFamily: Assets.fonts.bold,
                            fontSize: getProportionalFontSize(10),
                            color: Colors.white
                        }}> {
                                discount_type == 1
                                    ? `${discount_value}% ${labels?.off}`
                                    : `${labels?.flat} ${discount_value}${Constants.currency}`
                            } </Text>
                    </View>
                    : null
            }

            {/* title */}
            <View style={{ flexDirection: "row", justifyContent: "space-between" }} >
                <Text style={styles.packageName}>{title}</Text>
                <View style={{ flexDirection: "row", }}>
                    {/* {
                        showEditButton

                    }
                    {
                        showDeleteButton
                    } */}
                    <Icon
                        name="create"
                        color={Colors.green}
                        size={22}
                        onPress={() => {
                            onPressEdit();
                        }}
                    />
                    <Icon
                        name="trash"
                        color={Colors.red}
                        size={20}
                        style={{ marginLeft: 10 }}
                        onPress={() => {
                            onPressDelete()
                        }}
                    />
                </View>
            </View>

            {/* price */}
            <View style={{ ...styles.createRow, marginVertical: 10 }}>
                <Text style={styles.currentPrice} >
                    {
                        is_on_offer
                            ? discounted_price > 0 ? `${discounted_price}${Constants.currency}` : labels?.["free"]
                            : `${price}${Constants.currency}`
                    }

                </Text>
                {is_on_offer ? <Text style={styles.actualPrice} >/{price}{Constants.currency}</Text> : null}
            </View>

            {/* info */}
            <Text style={{ ...styles.normalText, color: Colors.black, }}>{labels?.["this_package_has"]} {total_buyer} {labels.users}</Text>

            <View style={styles.infoContainer}>
                <View style={styles.createRow}>
                    <Icon name={"checkmark-circle"} color={Colors.green} size={17} />
                    <Text style={{ ...styles.normalText, marginLeft: 10 }}>{labels.number_of_employees} - {number_of_employees}</Text>
                </View>
                <View style={styles.createRow}>
                    <Icon name={"checkmark-circle"} color={Colors.green} size={17} />
                    <Text style={{ ...styles.normalText, marginLeft: 10 }}>{labels.number_of_patients} - {number_of_patients}</Text>
                </View>
                <View style={styles.createRow}>
                    <Icon name={"checkmark-circle"} color={Colors.green} size={17} />
                    <Text style={{ ...styles.normalText, marginLeft: 10 }}>{validity_in_days} {labels.days_validity}</Text>
                </View>
                <View style={styles.createRow}>
                    <Icon name={is_enable_bankid_charges ? "checkmark-circle" : "close-circle"} color={is_enable_bankid_charges ? Colors.green : Colors.yellow} size={17} />
                    <Text style={{ ...styles.normalText, marginLeft: 10 }}>{labels?.bank_id} {is_enable_bankid_charges ? labels?.["enable"] : labels?.["disable"]}</Text>
                    {
                        is_enable_bankid_charges
                            ? <Text style={{ ...styles.normalText, marginLeft: 10 }}>{`(${sms_charges}${Constants.currency} ${labels.per} ${labels.sms})`}</Text>
                            : null
                    }
                </View>
                <View style={styles.createRow}>
                    <Icon name={is_sms_enable ? "checkmark-circle" : "close-circle"} color={is_sms_enable ? Colors.green : Colors.yellow} size={17} />
                    <Text style={{ ...styles.normalText, marginLeft: 10 }}>{labels.sms} {is_sms_enable ? labels?.["enable"] : labels?.["disable"]}</Text>
                    {
                        is_sms_enable
                            ? <Text style={{ ...styles.normalText, marginLeft: 10 }}>{`(${bankid_charges}${Constants.currency} ${labels.per} ${labels.bank_id})`}</Text>
                            : null
                    }
                </View>
            </View>
        </TouchableOpacity>
    )
}

export default PackagesListCard

const styles = StyleSheet.create({
    categoryTypeCard: {
        width: "100%",
        minHeight: 80,
        paddingHorizontal: Constants.globalPaddingHorizontal,
        paddingVertical: Constants.globalPaddingVetical * 2,
        shadowOffset: { width: 3, height: 3, },
        shadowOpacity: 10,
        elevation: 15,
        shadowColor: Platform.OS == "ios" ? Colors.shadowColorIosDefault : Colors.shadowColorAndroidDefault,
        shadowRadius: 10,
        marginBottom: Constants.listItemBottomMargin,
        backgroundColor: 'white',
        borderRadius: 15
    },
    createRow: {
        flexDirection: 'row',
        alignItems: 'flex-end',
    },
    packageName: {
        fontFamily: Assets.fonts.semiBold,
        fontSize: getProportionalFontSize(15),
        color: Colors.primary,
        textTransform: "capitalize"
    },
    currentPrice: {
        fontFamily: Assets.fonts.bold,
        fontSize: getProportionalFontSize(25),
        color: Colors.green
    },
    actualPrice: {
        fontFamily: Assets.fonts.semiBold,
        fontSize: getProportionalFontSize(14),
        color: Colors.black,
        textDecorationLine: "line-through"
    },
    normalText: {
        fontFamily: Assets.fonts.medium,
        fontSize: getProportionalFontSize(14),
        color: Colors.gray,
    },
    infoContainer: {
        marginTop: 10
    }
})