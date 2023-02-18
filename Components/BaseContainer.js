import React from 'react';
import { View, StyleSheet, Text, SafeAreaView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Colors from '../Constants/Colors';
import { getProportionalFontSize } from '../Services/CommonMethods';
import Assets from '../Assets/Assets'

export default BaseContainer = props => {
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: Colors.navBackgroundWhite, }}>
            <View style={[props.style, { flex: 1, backgroundColor: Colors.navBackgroundWhite, }]}>
                <View style={[styles.headerBar,
                props.headerBar
                ]}>
                    {props.leftIcon ? (
                        <Icon
                            name={props.leftIcon}
                            size={
                                props.leftIconSize
                                    ? props.leftIconSize
                                    : getProportionalFontSize(25)
                            }
                            onPress={props.onPressLeftIcon ? props.onPressLeftIcon : () => { }}
                            color={
                                // props.leftIconColor ? props.leftIconColor : 
                                Colors.white
                            }
                            style={{ width: '10%', }}
                        />
                    ) :
                        < View style={{ height: 30, width: '10%', }} />}

                    {props.title ? (
                        <Text numberOfLines={props.titleNumberOfLines} style={[styles.titleStyle,
                            // props.titleStyle
                        ]}>
                            {props.title}
                        </Text>
                    ) : null}

                    {props.rightIcon ? (
                        <Icon
                            name={props.rightIcon}
                            onPress={
                                props.onPressRightIcon ? props.onPressRightIcon : () => { }
                            }
                            size={
                                props.rightIconSize
                                    ? props.rightIconSize
                                    : getProportionalFontSize(25)
                            }
                            color={
                                // props.rightIconColor ? props.rightIconColor :
                                'white'}
                            style={[{ width: '10%', }, props.rightIconStyle]}
                        />
                    ) :
                        < View style={{ height: 30, width: '10%', }} />
                    }
                </View>
                {props.children}
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    headerBar: {
        width: '100%',
        minHeight: 50,
        flexDirection: 'row',
        padding: 10,
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: Colors.darkPrimary
    },
    titleStyle: {
        width: '80%',
        textAlign: 'center',
        fontSize: getProportionalFontSize(16),
        color: Colors.white,
        fontFamily: Assets.fonts.semiBold,
    },
});
