import React from 'react';
import { Text, StyleSheet } from 'react-native';
import Assets from '../Assets/Assets';
import Constants from '../Constants/Constants';
import { getProportionalFontSize } from '../Services/CommonMethods';
import { useSelector, useDispatch } from 'react-redux'

export default EmptyDataContainer = (props) => {

    const labels = useSelector(state => state.Labels);

    // render view
    return (
        <Text style={[styles.textStyle, props.style]}>{labels.no_data_found}</Text>
    );
}

const styles = StyleSheet.create({
    textStyle: {
        fontFamily: Assets.fonts.semiBold,
        fontSize: getProportionalFontSize(15),
        textAlign: "center",
        textAlignVertical: "center",
        width: "100%"
    }
});
