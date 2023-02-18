import React from 'react'
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import Colors from '../Constants/Colors';
import { getProportionalFontSize } from '../Services/CommonMethods';
// icons
import Ionicons from 'react-native-vector-icons/Ionicons';
import Icon from 'react-native-vector-icons/dist/FontAwesome';

export const ListingView = ({ item }) => {
    const { email, company_name, contact_number, organization_number, establishment_date, full_address, licence_key, company_type } = item;
    // renderview
    return (
        <TouchableOpacity
            // onPress={() => props.navigation.navigate("AddPackages", { itemId: id, deleteFunction: Delete })}
            style={styles.companyTypeCard}>
            <View style={styles.companyNameView}>
                <Text style={styles.companyNameText}>{company_name}</Text>
                {/* title and status view */}
                <View style={styles.PriceView}>
                    <Text style={{ ...styles.priceTitle, }}> {email}</Text>
                    <Text style={{ ...styles.priceTitle, }}> {company_type}</Text>
                </View>
            </View>
            {/* edit and delete icon view */}
            {/* <View style={styles.editDeleteIconView}>
            <Icon name="edit" color="green" size={25} onPress={() => {
                setCategoryItem(item);
                setIsModalVisible(true);
            }} />
            <Icon name="delete" color="red" size={25} style={{ marginStart: 5 }} onPress={() => {

            }} />
        </View> */}
        </TouchableOpacity>
    );
}



const styles = StyleSheet.create({
    //  list styling........
    companyTypeCard: {
        width: "100%",
        minHeight: 80,
        paddingHorizontal: 12,
        paddingVertical: 5,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        shadowOffset: { width: 3, height: 3, },
        shadowOpacity: 10,
        elevation: 15,
        shadowColor: Platform.OS == "ios" ? Colors.shadowColorIosDefault : Colors.shadowColorAndroidDefault,
        shadowRadius: 10,
        marginTop: 15,
        backgroundColor: 'white',
        borderRadius: 15
    },
    companyNameView: {
        width: '80%'
    },
    companyNameText: {
        fontFamily: Assets.fonts.bold,
        fontSize: getProportionalFontSize(16),
    },
    priceTitle: {
        fontFamily: Assets.fonts.semiBold,
        fontSize: getProportionalFontSize(13)
    },
})
