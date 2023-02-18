import * as React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import { useSelector, useDispatch } from 'react-redux';
import Assets from "../Assets/Assets";
import { getProportionalFontSize } from "../Services/CommonMethods";
// import { Colors } from '../Constants/Colors';
import Colors from '../Constants/Colors';
import Constants from '../Constants/Constants';
const PackageSummary = (props) => {
    const { item } = props
    // console.log(item)
    const [expanded, setExpanded] = React.useState(false);

    // REDUX hooks
    // const UserLogin = useSelector(state => state.User.UserLogin);
    const labels = useSelector(state => state.Labels);

    const handlePress = () => setExpanded(!expanded);

    const RenderItem = () => {
        return (
            <View>
                <View style={styles.row}>
                    <Text style={styles.rowText}>{labels.validity_in_days}: </Text>
                    <Text style={styles.rowText}>{item.validity_in_days} </Text>
                </View >
                <View style={styles.row}>
                    <Text style={styles.rowText}>{labels.number_of_patients}: </Text>
                    <Text style={styles.rowText}>{item.number_of_patients} </Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.rowText}>{labels.number_of_employee}: </Text>
                    <Text style={styles.rowText}>{item.number_of_employees} </Text>
                </View>
                <View style={styles.priceContainer}>
                    <View style={styles.row}>
                        <Text style={{ ...styles.totleprice, }}>{labels.totle}: </Text>
                        <Text style={{ ...styles.totleprice, width: 120, textAlign: 'right', textDecorationLine: "line-through" }}>{Constants.currency} {item.price} </Text>
                    </View>
                    <View style={{ ...styles.row, alignItems: "center" }}>
                        <Text
                            style={{
                                fontFamily: Assets.fonts.medium,
                                fontSize: getProportionalFontSize(9),
                                color: Colors.primary,

                            }}
                        >( {labels.after_discount} ) </Text>
                        <Text
                            style={{
                                fontFamily: Assets.fonts.medium,
                                fontSize: getProportionalFontSize(24),
                                color: Colors.companyListing.textColor,
                                width: 120,
                                textAlign: 'right'
                            }}>
                            {Constants.currency} {item.discounted_price} </Text>
                    </View>
                </View>
            </View>
        )
    }
    //render View
    return (
        <View style={{ paddingHorizontal: 0 }}>
            <View style={{ display: !expanded ? "none" : null, marginTop: 10, }}>
                <RenderItem />
            </View>
            <TouchableOpacity
                style={styles.touchableButton}
                onPress={handlePress}>
                <Text style={styles.touchableButtonText}>{labels.click_here_to} {!expanded ? labels.read_more : labels.collapse}  </Text>
                <Entypo style={styles.touchableButtonIcon} name={!expanded ? "chevron-down" : "chevron-up"} color="green" size={25} />
            </TouchableOpacity>


        </View>
    );
};

export default PackageSummary;

const styles = StyleSheet.create({
    touchableButton: { flexDirection: "row", justifyContent: "flex-end", width: "100%", marginTop: 10 },
    touchableButtonText: {},
    touchableButtonIcon: {},
    row: {
        flexDirection: 'row'
    },
    rowText: {
        flex: 2,
        fontFamily: Assets.fonts.medium,
        fontSize: getProportionalFontSize(14),
        color: Colors.companyListing.textColor,
        lineHeight: getProportionalFontSize(27)
    },
    // rowTextKey: {
    //     flex: 2,
    //     fontFamily: Assets.fonts.medium,
    //     fontSize: getProportionalFontSize(14)
    // },
    // rowTextValue: {
    //     flex: 2,
    //     fontFamily: Assets.fonts.medium
    // },
    priceContainer: {
        width: "100%",
        alignItems: "flex-end",
        marginTop: getProportionalFontSize(19)
    },
    totleprice: {
        fontFamily: Assets.fonts.medium,
        fontSize: getProportionalFontSize(13),
        color: Colors.companyListing.textColor
    }
})