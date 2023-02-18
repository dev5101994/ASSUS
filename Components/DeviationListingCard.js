import React from 'react';
import { View, StyleSheet, Text, Platform, TouchableOpacity, Image, Dimensions, FlatList } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import Feather from 'react-native-vector-icons/Feather';
import Icon2 from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Colors from '../Constants/Colors'
import Assets from '../Assets/Assets';
import { getProportionalFontSize, formatDateByFormat } from '../Services/CommonMethods';
import { useSelector, useDispatch } from 'react-redux';
import Constants from '../Constants/Constants';
import { Avatar, FAB, Portal, Divider } from 'react-native-paper';
// import Ionicons from 'react-native-vector-icons/Ionicons';
import Foundation from 'react-native-vector-icons/Foundation';
import { black } from 'react-native-paper/lib/typescript/styles/colors';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'; //timeline
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'; //notebook

// const borderRadius = 15;

const DeviationListingCard = (props) => {

    // const labels = useSelector(state => state.Labels);
    // const gender = useSelector(state => state.Labels.gender);


    return (
        // Main view
        <TouchableOpacity onPress={() => { }} style={styles.mainView}>
            {/* // <TouchableOpacity onPress={() => { if (props.onPressCard) { props.onPressCard(); props.setOpenCardOptions() } }}> */}

            {/* Floting three dot icon  */}
            {/* <MaterialCommunityIcons onPress={() => { }} style={styles.threeDotIconView} name='dots-horizontal-circle' color={Colors.primary} size={23} /> */}



            {/* left view with primary backgroundColor */}
            <View style={styles.leftView}>
                {/* profile image */}
                <Image style={styles.profileImage}
                    source={{ uri: "https://cdn.pixabay.com/photo/2020/07/14/13/07/icon-5404125_1280.png" }}
                />
            </View>
            <View style={{ position: "absolute", right: -8, top: 65 }}>

                <Feather name="edit" color={Colors.white} size={16} style={styles.IconVieww} onPress={() => { if (props.onPressEdit) { props.onPressEdit() } }} />

                <FontAwesome name="trash-o" color={Colors.white} size={17} style={styles.IconView} onPress={() => { if (props.onPressDelete) { props.onPressDelete() } }} />

            </View>
            {/* right white view */}

            <View style={styles.rightView}>
                <View style={styles.informationView}>

                    <Text style={styles.topTitle}>David Dobrik</Text>
                    <Text style={styles.company}>Company</Text>
                    <Text style={[styles.smallGrayText, { marginTop: 2 }]}>Ej utford insaster</Text>
                    <Text style={styles.date}> Date 18 jul 22</Text>
                    <Text style={[styles.smallGrayText, { marginTop: 2 }]}>Ej utford insaster</Text>
                    <Text style={[styles.smallGrayText, { marginTop: 2 }]}>Ej utford insaster</Text>

                </View>

                <Divider style={{ height: 2, marginVertical: 2, marginHorizontal: 10, color: Colors.black, }} />
                <View style={styles.dateText} >
                    <Text style={styles.TextDate}>2022-07-18,company</Text>

                </View>
                <View style={styles.done}>
                    <Ionicons name="checkmark-done-circle" color={Colors.primary} size={25} />
                </View>
            </View>




        </TouchableOpacity>
    );
};

export default DeviationListingCard

const styles = StyleSheet.create({
    informationView: {
        padding: 15
    },
    topTitle: {
        fontSize: getProportionalFontSize(12),
        fontFamily: Assets.fonts.semiBold,
        color: Colors.primary
    },
    date: {
        fontSize: getProportionalFontSize(12),
        fontFamily: Assets.fonts.semiBold,
        color: Colors.primary,
        left: -5,
        top: 3,
    },
    company: {
        fontSize: getProportionalFontSize(10),
        // fontFamily: Assets.fonts.semiBold,
        color: Colors.black

    },
    boldGrayText: {
        fontSize: getProportionalFontSize(13),
        fontFamily: Assets.fonts.semiBold,
        color: Colors.gray,
    },
    infoRow: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 2,
        width: "100%"
    },
    smallGrayText: {
        fontSize: getProportionalFontSize(8),
        fontFamily: Assets.fonts.regular,
        color: Colors.gray
    },
    profileImage: {
        height: 80,
        width: 80,
        zIndex: 100,
        borderRadius: 30,
    },
    whiteCircleView: {
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: Colors.white,
        borderRadius: 10,
        height: 17,
        width: 17
    },
    leftView: {
        borderTopLeftRadius: 15,
        borderBottomLeftRadius: 15,
        width: "25%",
        height: "100%",
        backgroundColor: Colors.primary,
        justifyContent: "space-evenly",
        alignItems: "center"
    },
    rightView: {
        borderTopEndRadius: 15,
        borderBottomEndRadius: 15,
        width: "75%",
        height: "100%",
        backgroundColor: Colors.white
    },
    mainView: {
        flexDirection: "row",
        width: "95%",
        marginHorizontal: 16,
        height: 170,
        right: 5,
        // borderRadius: 20,
        marginTop: Constants.formFieldTopMargin,

        // shadow styles
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 10,
        elevation: 10,
        shadowColor: Colors.primary,
        shadowRadius: 4,
    },


    IconView: {
        position: "absolute",
        top: 5,
        right: 30,
        zIndex: 100,
        // justifyContent: "center"
        justifyContent: "center",
        backgroundColor: Colors.primary,
        paddingHorizontal: 8,
        paddingVertical: 6,
        borderRadius: 20

    },
    IconVieww: {
        position: "absolute",
        top: 5,
        right: 70,
        zIndex: 100,
        justifyContent: "center",
        backgroundColor: Colors.primary,
        paddingHorizontal: 6,
        paddingVertical: 6,
        borderRadius: 25


    },
    done: {

        alignItems: "flex-end",
        right: 20,
        bottom: 17
    },
    dateText: {
        backgroundColor: Colors.primary,
        top: 8,
        marginHorizontal: 60,
        height: 20,
        borderRadius: 20,
        right: 40

    },
    TextDate: {
        left: 21,
        color: Colors.white,
        fontFamily: Assets.fonts.regular,
    }


});
