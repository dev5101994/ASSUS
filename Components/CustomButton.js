import React from 'react';
import { View, StyleSheet, Text, SafeAreaView, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Colors from '../Constants/Colors'
import Assets from '../Assets/Assets';
import { getProportionalFontSize } from '../Services/CommonMethods';
import ProgressLoader from './ProgressLoader';

export default CustomButton = props => {
    return (
        <TouchableOpacity
            activeOpacity={props.activeOpacity ?? (props.onPress ? 0 : 1)}
            onPress={(props.onPress && !props.isLoading) ? props.onPress : () => { }}
            style={[styles.button, props.style]}>
            {props.isLoading
                ? <ProgressLoader onActivityIndicator={true} onActivityIndicatorSize='small' onActivityIndicatorColor={props?.titleStyle?.color ? props?.titleStyle?.color : Colors.white} />
                : <Text
                    numberOfLines={props.numberOfLines ?? null}
                    style={[styles.buttonTitle, props.titleStyle]}>{props.title}</Text>}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        width: '100%',
        minHeight: 40,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        backgroundColor: Colors.primary,
        paddingVertical: 5
    },
    buttonTitle: {
        fontFamily: Assets.fonts.bold,
        fontSize: getProportionalFontSize(15),
        color: Colors.white
    },
    loaderStyle: {
        position: 'relative', width: '80%', backgroundColor: "transparent"
    }
});
