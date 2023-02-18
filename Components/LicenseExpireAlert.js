import React from 'react';
import { View, StyleSheet, Keyboard, Dimensions, FlatList, Text, TouchableOpacity, } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Colors from '../Constants/Colors';
import { getProportionalFontSize, CurruntDate, formatDate, reverseFormatDate } from '../Services/CommonMethods';
import CustomButton from './CustomButton';
import Constants from '../Constants/Constants'
import APIService from '../Services/APIService';
import Alert from './Alert';
import InputValidation from './InputValidation';
import { RadioButton } from 'react-native-paper';
import Assets from '../Assets/Assets';

const LicenseExpireAlert = () => {
    return (
        <View style={styles.modalMainView}>
            <View style={styles.innerView}>
                {/* close icon */}
                <Icon name='cancel' color={Colors.primary} size={30} onPress={props.onRequestClose} />
            </View>
        </View>
    )
}

export default LicenseExpireAlert

const styles = StyleSheet.create({
    modalMainView: { backgroundColor: 'transparent', justifyContent: "center", alignItems: "center", paddingHorizontal: 16 },
    innerView: {
        width: '100%',
        // minHeight: 300, 
        backgroundColor: Colors.backgroundColor, paddingVertical: 15, paddingHorizontal: 16, borderRadius: 20
    },
})