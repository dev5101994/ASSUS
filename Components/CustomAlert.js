import React from 'react';
import { View, StyleSheet, Text, SafeAreaView, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Colors from '../Constants/Colors'
import Assets from '../Assets/Assets';
import { getProportionalFontSize } from '../Services/CommonMethods';
import CustomButton from './CustomButton';

export default CustomAlert = props => {
    return (
        <View style={styles.modalMainView}>
            <View style={styles.innerView}>
                <View
                    style={[styles.card]}
                    onPress={() => {
                        props.navigation.navigate(props.navigateTo)
                    }}>
                    <View style={[styles.iconContainer]}>
                        <View
                            style={[
                                styles.iconBg,
                                { backgroundColor: props.iconBgColor ? props.iconBgColor : '#0003' },
                            ]}>
                            <Icon
                                name={props.icon}
                                size={30}
                                color={props.iconColor ? props.iconColor : '#000'}
                            />
                        </View>
                    </View>
                    <View style={styles.textContainer}>
                        {props.title ?
                            <View style={styles.cardTextContainer}>
                                <Text style={styles.cardTextTitle}>{props.title}</Text>
                            </View>
                            : null
                        }
                        {props.subTitle ?
                            <View style={styles.cardTextContainer}>
                                <Text style={styles.cardTextSubtitle}>{props.subTitle}</Text>
                            </View>
                            : null
                        }
                        {props.message ?
                            <View style={styles.cardTextContainer}>
                                <Text style={styles.cardTextMessage}>{props.message}</Text>
                            </View>
                            : null
                        }

                    </View>
                    {/* <View style={styles.buttonContainer}>
                        <View style={styles.btnView}>
                            <CustomButton
                                style={{ width: 80, borderColor: Colors.red, borderWidth: 1, backgroundColor: Colors.transparent }}
                                title={props.cancelText}
                                titleStyle={{ color: Colors.red }}
                                onPress={() => {
                                    props.onCancelPress()
                                }}
                            />
                        </View>
                        <View style={styles.btnView}>
                            <CustomButton
                                style={{ width: 40, }}
                                title={props.okText}
                                titleStyle
                                onPress={() => {
                                    props.onOkPress()
                                }}
                            />
                        </View>
                    </View> */}
                </View>

                <View style={styles.buttonContainer}>
                    <View style={styles.btnView}>
                        <CustomButton
                            style={{ width: 80, borderColor: Colors.red, borderWidth: 1, backgroundColor: Colors.transparent }}
                            title={props.cancelText}
                            titleStyle={{ color: Colors.red }}
                            onPress={() => {
                                props.onCancelPress()
                            }}
                        />
                    </View>
                    <View style={styles.btnView}>
                        <CustomButton
                            style={{ width: 50, }}
                            title={props.okText}
                            titleStyle
                            onPress={() => {
                                props.onOkPress()
                            }}
                        />
                    </View>
                </View>

            </View>
        </View>
    )

}

const styles = StyleSheet.create({
    modalMainView: { backgroundColor: 'transparent', flex: 1, justifyContent: "center", alignItems: "center", paddingHorizontal: 16 },
    innerView: {
        //flexDirection: 'column',
        //width: '100%',
        //minHeight: 100,
        backgroundColor: Colors.backgroundColor,
        //paddingVertical: 15,
        //paddingHorizontal: 16,
        borderRadius: 20,
    },
    card: {
        width: '100%',
        minHeight: 100,
        backgroundColor: Colors.backgroundColor,
        paddingVertical: 5,
        paddingHorizontal: 16,
        borderRadius: 20,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        // shadow
        // shadowOffset: { width: 0, height: 0 },
        // shadowOpacity: 15,
        // elevation: 15,
        // shadowColor: Platform.OS == 'ios' ? Colors.shadowColorIosDefault : Colors.shadowColorAndroidDefault,
        // shadowRadius: 6,
        //borderRadius: 10,
    },
    cardTextContainer: {
        padding: 5,
        justifyContent: 'center',
        marginVertical: 2,
        borderWidth: 0,
    },
    cardTextTitle: {
        fontFamily: Assets.fonts.bold,
        fontSize: getProportionalFontSize(17)
    },
    cardTextSubtitle: {
        fontFamily: Assets.fonts.semiBold,
        fontSize: getProportionalFontSize(13)
    },
    cardTextMessage: {
        fontFamily: Assets.fonts.regular,
        fontSize: getProportionalFontSize(13)
    },
    iconContainer: {
        borderRadius: 50,
        width: 45,
        //flex: 1,
        borderWidth: 0,
        // padding: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    textContainer: {
        //borderRadius: 50,
        width: '85%',
        borderWidth: 0,
        //flex: 1,
        padding: 5,
        marginLeft: 5,
        justifyContent: 'center',
        //alignItems: 'center',
    },
    iconBg: {
        height: 50,
        width: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 50,
    },
    buttonContainer: {
        //borderRadius: 50,
        width: '100%',
        borderWidth: 0,
        flexDirection: 'row',
        padding: 5,
        //marginTop: 5,
        justifyContent: 'flex-end',
        //alignItems: 'center',
    },
    btnView: {
        padding: 5
    }
})