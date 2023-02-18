import React from 'react';
import { View, StyleSheet, Text, Platform, TouchableOpacity, Image, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import Icon2 from 'react-native-vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Colors from '../Constants/Colors'
import Assets from '../Assets/Assets';
import { getProportionalFontSize } from '../Services/CommonMethods';
import { useSelector, useDispatch } from 'react-redux';
import Constants from '../Constants/Constants';
import { Avatar, Divider } from 'react-native-paper';
import Foundation from 'react-native-vector-icons/Foundation';



export default TaskListCard = props => {
    const labels = useSelector(state => state.Labels);
    const gender = useSelector(state => state.Labels.gender);
    // console.log("props?.assign_employees ", props?.assign_employees)
    // console.log("props.assign_employees.length  ", props.assign_employees.length)
    return (
        <TouchableOpacity
            style={styles.categoryTypeCard}
            onPress={() => { if (props.onPressCard) { props.onPressCard() } }}
        >
            <View style={{ ...styles.innerContainer }}>
                <View style={{ ...styles.avatarContainer }}>

                    {
                        props?.image
                            ? <Image source={{ uri: props.image }} style={styles.avatarImage} resizeMode="cover" />
                            : props?.labelText
                                ? <Avatar.Text size={Constants.avatarTextSize} label={props?.labelText} color="#fff" labelStyle={styles.avatarText} />
                                : null
                    }
                </View>

                {/* title and status view */}
                <View style={{ ...styles.categoryNameView, width: '80%', }}>
                    <View style={{
                        width: '100%', flexDirection: 'row', position: 'absolute', marginLeft: getProportionalFontSize(40),

                    }}>
                        {/* title or ip title or ptient name */}
                        <Text numberOfLines={1} style={{
                            ...styles.categoryNameText,
                            paddingLeft: getProportionalFontSize(15),
                        }}>{props.title}</Text>
                    </View>
                    {/* subTitle or ip category and sub category or patient age */}
                    {props?.subTitle ? <Text numberOfLines={1} style={{ ...styles.statusValue, marginTop: 20, color: props.taskStatus ? Colors.green : Colors.yellow, }}>{props.subTitle}</Text> : null}
                </View>



                {/* edit and delete icon view */}
                <View style={[styles.editDeleteIconView, { width: '20%' }]}>
                    <View style={{
                        width: props.showSecretIcon && props.showEditIcon && props.showDeleteIcon
                            ? "80%"
                            : props.showEditIcon && props.showDeleteIcon
                                ? "50%" : '25%',
                        flexDirection: 'row',
                        position: 'absolute',
                        top: 5, right: 15,
                    }}>
                        {props.showSecretIcon ?
                            <>
                                <Foundation name='shield' color={Colors.red} size={21} style={{ marginRight: 8, }} />
                            </>
                            : null
                        }
                        {props.showEditIcon ?
                            <>
                                <Icon name="edit" color="#fff" size={20} onPress={() => { if (props.onPressEdit) { props.onPressEdit() } }} />

                            </>
                            : null
                        }
                        {props.showDeleteIcon ?
                            <>
                                <Icon2 name="delete" color="#fff" size={20} style={{ marginStart: 5, }} onPress={() => { if (props.onPressDelete) { props.onPressDelete() } }} />
                            </>
                            : null
                        }
                    </View>
                    <View style={styles.statusMainView}>
                        <Text numberOfLines={1} style={[styles.statusTitle, props.second_title_style]}>{props.second_title}</Text>
                        <Text numberOfLines={1} style={[styles.statusValue, props.second_title_value_style, props.second_title ? { marginStart: 5 } : {}]}>{props.second_title_value}</Text>
                    </View>
                </View>
            </View>
            <View style={{
                paddingHorizontal: Constants.globalPaddingHorizontal, paddingVertical: Constants.globalPaddingVetical, marginTop: 5,
            }}>


                {

                    props?.assign_employees && props.assign_employees.length > 0
                        ? props.assign_employees.map((val, index) => {
                            return (
                                <View key={index}>
                                    {index != 0 ? <Divider style={{ height: 0.5, marginVertical: 10 }} /> : null}
                                    <Text style={styles.patient_detail}>{labels.assigned_to} {index + 1}</Text>
                                    <View style={styles.forRow} >
                                        <Text style={styles.labelsText}>{labels.name} : </Text>
                                        <Text numberOfLines={1} style={styles.secondrytext}>{val?.employee?.name}</Text>
                                    </View>
                                    <View style={styles.forRow} >
                                        <Text style={styles.labelsText}>{labels.Email} : </Text>
                                        <Text numberOfLines={1} style={styles.secondrytext}>{val?.employee?.email}</Text>
                                    </View>
                                    <View style={styles.forRow} >
                                        <Text style={styles.labelsText}>{labels.phone} : </Text>
                                        <Text numberOfLines={1} style={styles.secondrytext}>{val?.employee?.contact_number}</Text>
                                    </View>
                                    <View style={styles.forRow} >
                                        <Text style={styles.labelsText}>{labels.assignment_date} : </Text>
                                        <Text numberOfLines={1} style={styles.secondrytext}>{val.assignment_date}</Text>
                                    </View>
                                    <View style={styles.forRow} >
                                        <Text style={styles.labelsText}>{labels.start_date} : </Text>
                                        <Text numberOfLines={1} style={styles.secondrytext}>{props.start_date}</Text>
                                    </View>
                                    <View style={styles.forRow} >
                                        <Text style={styles.labelsText}>{labels.end_date} : </Text>
                                        <Text numberOfLines={1} style={styles.secondrytext}>{props.end_date}</Text>
                                    </View>

                                </View>
                            )
                        }) : <View>
                            <Text style={styles.emptyDetail}>{labels["no-employee-assigned"]}</Text>
                        </View>
                }







            </View>
            {
                props.children
            }
        </TouchableOpacity >
    );
};

const styles = StyleSheet.create({
    avatarContainer: {
        position: 'absolute',
        top: 20,
        left: 15,
    },
    avatarImage: {
        width: Constants.avatarTextSize,
        height: Constants.avatarTextSize,
        borderRadius: 50,
    },
    avatarText: {
        borderWidth: 0,
        fontSize: getProportionalFontSize(18),
        fontFamily: Assets.fonts.semiBold,
        textTransform: "uppercase", marginTop: -5,
    },
    categoryTypeCard: {
        width: "100%",
        minHeight: 80,
        shadowOffset: { width: 3, height: 3, },
        shadowOpacity: 10,
        elevation: 8,
        shadowColor: Platform.OS == "ios" ? Colors.shadowColorIosDefault : Colors.shadowColorAndroidDefault,
        shadowRadius: 10,
        marginBottom: Constants.listItemBottomMargin,
        backgroundColor: 'white',
        borderRadius: 15,
    },
    categoryNameView: {

        borderWidth: 0, paddingLeft: 60,
    },
    categoryNameText: {
        fontFamily: Assets.fonts.bold,
        color: Colors.white,
        fontSize: getProportionalFontSize(15),
        textTransform: 'capitalize'
    },
    statusMainView: {
        flexDirection: 'row',
        paddingTop: 25
    },
    statusTitle: {
        fontFamily: Assets.fonts.regular,
        color: Colors.white,
        fontSize: getProportionalFontSize(12)
    },
    statusValue: {
        fontFamily: Assets.fonts.regular,
        color: Colors.white,
        fontSize: getProportionalFontSize(10)
    },
    editDeleteIconView: {
        borderWidth: 0,

    },
    innerContainer: {
        flexDirection: 'row',
        backgroundColor: Colors.cardColor,
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
        width: '100%',
    },
    patient_detail: {
        color: Colors.black,
        fontFamily: Assets.fonts.bold,
        fontSize: getProportionalFontSize(12),
        width: "40%"
    },
    labelsText: {
        fontFamily: Assets.fonts.semiBold,
        fontSize: getProportionalFontSize(12),
        width: "40%"
    },
    secondrytext: {
        fontFamily: Assets.fonts.regular,
        fontSize: getProportionalFontSize(11),
        width: "60%"
    },
    forRow: {
        flexDirection: "row",
        alignItems: "center"
    },
    emptyDetail: {
        color: Colors.black,
        fontFamily: Assets.fonts.bold,
        fontSize: getProportionalFontSize(12),
        paddingLeft: 80
    },
});
