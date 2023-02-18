import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { getProportionalFontSize } from '../Services/CommonMethods';
import { useSelector, useDispatch } from 'react-redux';
import Colors from '../Constants/Colors';
import InputValidation from '../Components/InputValidation';

const PackageDetails = ({ route, navigation }) => {
    const { Item } = route.params;
    const { package_id, package_price, is_on_offer, flat_discount, discounted_price, discount_in_percentage, discount_type, validity_in_days, number_of_patients, number_of_employee } = Item
    // REDUX hooks
    const isInternetActive = useSelector(state => state.IsInternetActive);
    const UserLogin = useSelector(state => state.UserLogin);
    const labels = useSelector(state => state.Labels);
    return (
        <BaseContainer
            onPressLeftIcon={() => {
                navigation.pop();
            }}
            leftIcon="arrow-back"
            leftIconSize={24}
            title={labels.package_details}
            leftIconColor={Colors.primary}
            //rightIconSize={32}
            titleStyle={styles.headingText}
        >
            <View style={styles.mainView} >
                <InputValidation
                    // uniqueKey={packageFormKeys.package_id}
                    // validationObj={validationObj}
                    value={package_id}
                    placeHolder={labels.package_name}
                    // onChangeText={(text) => {
                    //     removeErrorTextForInputThatUserIsTyping(packageFormKeys.package_id);
                    //     handleInputChange(text, packageFormKeys.package_id)
                    // }}
                    style={styles.InputValidationView}
                    inputStyle={styles.inputStyle}
                    editable={false}
                />
                <InputValidation
                    value={package_price}
                    placeHolder={labels.price}
                    style={styles.InputValidationView}
                    inputStyle={styles.inputStyle}
                    editable={false}
                />

                <InputValidation
                    value={discount_type == "flat" ? flat_discount : discount_in_percentage}
                    placeHolder={labels.discount}
                    style={styles.InputValidationView}
                    inputStyle={styles.inputStyle}
                    editable={false}
                />
                <InputValidation
                    value={validity_in_days}
                    placeHolder={labels.validity}
                    style={styles.InputValidationView}
                    inputStyle={styles.inputStyle}
                    editable={false}
                />
                <InputValidation
                    value={number_of_patients}
                    placeHolder={labels.total_patients}
                    style={styles.InputValidationView}
                    inputStyle={styles.inputStyle}
                    editable={false}
                />
                <InputValidation
                    // uniqueKey={packageFormKeys.package_id}
                    // validationObj={validationObj}
                    value={number_of_employee}
                    placeHolder={labels.total_employee}
                    // onChangeText={(text) => {
                    //     removeErrorTextForInputThatUserIsTyping(packageFormKeys.package_id);
                    //     handleInputChange(text, packageFormKeys.package_id)
                    // }}
                    style={styles.InputValidationView}
                    inputStyle={styles.inputStyle}
                />
            </View>
        </BaseContainer>

    );
};

export default PackageDetails;

const styles = StyleSheet.create({
    headingText: {
        fontSize: getProportionalFontSize(24),
        // marginTop: 10,
        color: Colors.primary,
        fontFamily: Assets.fonts.bold,
    },
    mainView: {
        flex: 1,
        paddingHorizontal: 24
    },
    tableView: {
        flexDirection: "row",
        marginTop: 10,
        borderTopColor: "#0005",
        borderTopWidth: 1,
    },
    column: {
        flex: 2,
    },
    row: {
        fontFamily: Assets.fonts.semiBold,
        fontSize: getProportionalFontSize(15),
        paddingVertical: 5,
        borderBottomColor: "#0005",
        borderBottomWidth: 1,
        paddingHorizontal: 20,
    },
    Title: {

    },
    value: {

    },
    PriceView: {
        flexDirection: 'row',
        alignItems: "flex-end",
        borderBottomColor: "#0005",
        borderBottomWidth: 1,
        paddingVertical: 5,
        paddingHorizontal: 20,
    },
    price: {
        fontFamily: Assets.fonts.semiBold,
        fontSize: getProportionalFontSize(15),
    },
    inputStyle: {
        fontSize: getProportionalFontSize(15),
        fontFamily: Assets.fonts.regular
    },
    InputValidationView: {
        //backgroundColor: Colors.ultraLightPrimary,
        marginTop: 30,
        borderRadius: 20,
        // paddingHorizontal: 5
    }
});
