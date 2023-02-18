import React from 'react';
import { StyleSheet, Text, View, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { getProportionalFontSize } from '../Services/CommonMethods';
import Assets from '../Assets/Assets';
import Constants from '../Constants/Constants';
import Colors from '../Constants/Colors';

const deviceHeight = Dimensions.get('window').height;

const FormSubHeader = (props) => {
    return (
        <View style={styles.formHeaderContainer}>

            <View style={styles.leftView}>
                {props.leftIconName
                    ? <Icon name={props.leftIconName ?? null} color={props.leftIconColor ? props.leftIconColor : Colors.primary} size={30}
                        onPress={props.onPressLeftIcon ? props.onPressLeftIcon : () => { }} />
                    : null}
            </View>


            <View style={styles.centerView}>
                <Text numberOfLines={props.titleNumberOfLines ?? 1} style={[styles.welcomeText, props.titleStyle]}>
                    {props.title}
                </Text>
            </View>

            <View style={styles.rightView}>
                {props.rightIconName
                    ? <Icon name={props.rightIconName ?? null} color={Colors.primary} size={30}
                        onPress={props.onPressRightIcon ? props.onPressRightIcon : () => { }} />
                    : null}
            </View>

        </View>
    );
};

export default FormSubHeader;

const styles = StyleSheet.create({
    formHeaderContainer: {
        flexDirection: 'row',
        width: "100%",
        borderWidth: 0,
        alignItems: 'center',
        justifyContent: 'space-between',
        alignContent: 'center',
        height: 40,
        paddingHorizontal: Constants.globalPaddingHorizontal
    },

    leftView: {
        width: '12%',
        height: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        alignContent: 'center',
        borderWidth: 0,
    },
    rightView: {
        width: '12%',
        height: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        alignContent: 'center',
        borderWidth: 0,
    },
    centerView: {
        width: '75%',
        height: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        alignContent: 'center',
        borderWidth: 0,
    },
    welcomeText: {
        fontSize: getProportionalFontSize(15),
        color: Colors.primary,
        fontFamily: Assets.fonts.bold
    },
});