import { StyleSheet, Text, View } from 'react-native';
import Colors from '../Constants/Colors';
import { getProportionalFontSize, } from '../Services/CommonMethods';
import React from 'react';
import Assets from '../Assets/Assets';

const HoursData = (props) => {
    return (
        <View style={{ ...styles.cardStyle, marginTop: 20, marginBottom: 0 }} >
            <Text style={{ ...styles.headingTitleStyle, marginVertical: 10 }}>{props.titleName}</Text>
            {/* <Text>{`{{ formFields.employee.name }}`}</Text> */}
            <View style={styles.forRow}>
                <Text style={[styles.labelsText]}>{props.label_1} : </Text>
                <Text numberOfLines={1} style={[styles.secondrytext,]}>{props.value_for_label_1}</Text>
            </View>

            <View style={styles.forRow}>
                <Text style={[styles.labelsText]}>{props.label_2} : </Text>
                <Text numberOfLines={1} style={[styles.secondrytext,]}>{props.value_for_label_2}</Text>
            </View>

            <View style={{ ...styles.forRow, marginBottom: 10 }}>
                <Text style={[styles.labelsText]}>{props.label_3} : </Text>
                <Text numberOfLines={1} style={[styles.secondrytext,]}>{props.value_for_label_3}</Text>
            </View>
        </View>
    )
}

export default HoursData

const styles = StyleSheet.create({
    cardStyle: {
        shadowOffset: { width: 3, height: 3, },
        shadowOpacity: 10,
        elevation: 15,
        shadowColor: Platform.OS == "ios" ? Colors.shadowColorIosDefault : Colors.shadowColorAndroidDefault,
        shadowRadius: 20,
        backgroundColor: Colors.white,
        // marginVertical: 10,
        borderRadius: 20,
        padding: 10,
        marginBottom: 30,
        zIndex: -1000
        // marginHorizontal: Constants.globalPaddingHorizontal,
    },
    headingTitleStyle: {
        fontFamily: Assets.fonts.regular,
        fontSize: getProportionalFontSize(15),
        marginTop: 20
    },
    forRow: {
        flexDirection: "row",
        alignItems: "center"
    },
    secondrytext: {
        fontFamily: Assets.fonts.regular,
        fontSize: getProportionalFontSize(11),
        width: "30%"
    },
    labelsText: {
        fontFamily: Assets.fonts.semiBold,
        fontSize: getProportionalFontSize(12),
        width: "70%",

    },
})