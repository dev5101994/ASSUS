import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Colors from '../Constants/Colors';
import Assets from '../Assets/Assets';
import { getProportionalFontSize } from '../Services/CommonMethods';

export default ErrorComp = (props) => {

    const isErrorTrue = () => {
        if (props.validationObj && props.uniqueKey && props.validationObj[props.uniqueKey].invalid === true)
            return true;
        return false;
    }

    return (
        //  error red text 
        isErrorTrue()
            ? <Text style={[styles.errorText, props.style]}>{props.validationObj[props.uniqueKey].title}</Text>
            : null
    );
};

const styles = StyleSheet.create({
    errorText: {
        color: Colors.red,
        fontFamily: Assets.fonts.regular,
        fontSize: getProportionalFontSize(12),
        marginTop: 7
    },
});

