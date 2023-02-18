import React from 'react';
import { View, StyleSheet, Text, SafeAreaView, TouchableOpacity, Keyboard, KeyboardAvoidingView, ScrollView, FlatList, Image } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Colors from '../Constants/Colors';
import { getProportionalFontSize, formatDateWithTime } from '../Services/CommonMethods';
import CustomButton from './CustomButton';
import Constants from '../Constants/Constants'
import APIService from '../Services/APIService';
import Assets from '../Assets/Assets';
import ProgressLoader from './ProgressLoader';
import Alert from './Alert';
import EmptyDataContainer from './EmptyDataContainer';
import InputValidation from './InputValidation';

const userImage = 'https://st3.depositphotos.com/15648834/17930/v/600/depositphotos_179308454-stock-illustration-unknown-person-silhouette-glasses-profile.jpg'

const ActionSheetForComment = (props) => {

    //hooks
    const [comments, SetComments] = React.useState([]);
    const [isLoading, setIsLoading] = React.useState(false);
    const [inputeComment, setInputeComment] = React.useState("");
    const [repliedTo, setRepliedTo] = React.useState({ replied_to: "", name: "", parent_id: "" });
    const [validationObj, setValidationObj] = React.useState({ "comment": { invalid: false, title: props.labels.name_required } });

    React.useEffect(() => {
        getComments(props.activityId)
    }, [])
    const getComments = async (id) => {
        setIsLoading(true);
        let params = {
            "source_id": id ?? "",
            "activity_id": "",
            "user_id": "",
        }
        let url = Constants.apiEndPoints.commentList;
        // console.log("url", url)
        let response = await APIService.postData(url, params, props.UserLogin.access_token, null, "commentAPI");

        // return
        if (!response.errorMsg) {
            SetComments(response.data.payload)
            setIsLoading(false);
        }
        else {
            setIsLoading(false);
            Alert.showAlert(Constants.danger, response.errorMsg);
        }
    }

    const addComment = async () => {
        Keyboard.dismiss()
        setIsLoading(true)
        let params = {
            "parent_id": repliedTo.parent_id ?? "",
            "source_id": props.activityId,
            "source_name": "Activity",
            "comment": inputeComment ?? "",
            "replied_to": repliedTo.replied_to ?? ""
        }
        let url = Constants.apiEndPoints.addCommentForActivity;
        let msg = ""
        // console.log("url", url);
        // console.log("params", params);
        // console.log("msg", msg);

        let response = await APIService.postData(url, params, props.UserLogin.access_token, null, msg);
        if (!response.errorMsg) {
            setInputeComment("")
            setIsLoading(false)
            // props.onRequestClose
            getComments(props.activityId)
        } else {
            setIsLoading(false)
            Alert.showAlert(Constants.labels_for_non_react_files.something_went_wrong, Constants.danger)
        }
    }

    const renderReplyListView = ({ item, index }) => {
        // console.log("----------reply items---------", item)
        return (
            <View key={item.id} style={{ flexDirection: 'row', alignItems: "center", marginTop: 10, }}>
                <View>
                    <Image source={{ uri: userImage }} style={{ width: 25, height: 25, marginRight: 20 }} />
                </View>
                <View style={{ flex: 8, }}>
                    <View style={{ flexDirection: "row" }}>
                        <Text style={styles.normal_text}>{item?.comment_by?.name}</Text>
                        <Text style={styles.timeAndDate}>{formatDateWithTime(item?.created_at)}</Text>
                    </View>
                    <Text style={{ ...styles.descriptionText, textAlign: "left" }}>{item?.comment}</Text>

                </View>
                <TouchableOpacity
                    onPress={() => { setRepliedTo({ replied_to: item?.comment_by?.id, name: item?.comment_by?.name, parent_id: item.id }) }}
                    style={styles.reply}>
                    <MaterialIcons style={{}} name="reply" color={Colors.black} size={17} />
                    <Text style={{ fontSize: 12 }}>{props.labels.reply}</Text>
                </TouchableOpacity>
            </View>
        )
    }

    const renderListView = ({ item, index }) => {
        // console.log("---------- items---------", JSON.stringify(item))
        return (
            <View>
                <View key={item.id} style={{ flexDirection: 'row', alignItems: "center", marginTop: 10, }}>
                    <View>
                        <Image source={{ uri: userImage }} style={{ width: 25, height: 25, marginRight: 20 }} />
                    </View>
                    <View style={{ flex: 8, }}>
                        <View style={{ flexDirection: "row" }}>
                            <Text style={styles.normal_text}>{item?.comment_by?.name}</Text>
                            <Text style={styles.timeAndDate}>{formatDateWithTime(item?.created_at)}</Text>
                        </View>
                        <Text style={{ ...styles.descriptionText, textAlign: "left" }}>{item?.comment}</Text>

                    </View>
                    <TouchableOpacity
                        onPress={() => { setRepliedTo({ replied_to: item?.comment_by?.id, name: item?.comment_by?.name, parent_id: item.id }) }}
                        style={styles.reply}>
                        <MaterialIcons style={{}} name="reply" color={Colors.black} size={17} />
                        <Text style={{ fontSize: 12 }}>{props.labels.reply}</Text>
                    </TouchableOpacity>
                </View>
                <View style={{ width: "100%" }}>
                    {
                        item?.reply_thread?.length
                            ? <>
                                <FlatList
                                    data={item?.reply_thread}
                                    keyExtractor={(item, index) => ('' + index)}
                                    renderItem={renderReplyListView}
                                    style={{
                                        paddingLeft: "13%",
                                        width: '100%',
                                        height: "100%",
                                        backgroundColor: Colors.backgroundColor,
                                    }}
                                    showsVerticalScrollIndicator={false}
                                    contentContainerStyle={{ borderWidth: 0, paddingVertical: Constants.globalPaddingVetical, }}
                                />
                            </> : null
                    }
                </View>
            </View>
        )
    }
    //render
    return (
        // Main View
        <SafeAreaView >
            <View style={styles.mainView}>
                {/* Top floating black dash */}
                <View style={styles.blackDash} />

                {/* top two buttons view */}
                <View style={{ ...styles.twoButtonView, height: "10%" }}>
                    {/* down button */}
                    <View style={{ flex: 1, }}>
                        <TouchableOpacity
                            onPress={props.closeActionSheet}
                            style={styles.iconView}>
                            <Icon onPress={props.closeActionSheet} name="chevron-down-outline" style={{ ...styles.icon, color: props.listBarColor ?? Colors.primary }} />
                        </TouchableOpacity>
                    </View>

                    {/* Title */}
                    <Text numberOfLines={2} style={[styles.titleStyle, { color: props.listBarColor ?? Colors.primary, }]}>{props.title}</Text>

                    {/* check button */}
                    <View style={{ flex: 1, }}>

                    </View>
                </View>
                <View style={{ height: "100%", }}>
                    {/* list view */}
                    {isLoading
                        ? <ProgressLoader loadingContainer={styles.progressLoader} loader={(props.listBarColor ? props.listBarColor : Colors.primary)} />
                        : <View style={{ marginTop: Constants.formFieldTopMargin, height: '90%', }}>
                            <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
                                <FlatList
                                    onEndReached={() => {
                                        // console.log('reached hola')
                                    }}

                                    data={comments}
                                    keyExtractor={(item, index) => ('' + index)}
                                    renderItem={renderListView}
                                    style={styles.flatListContainerStyle}
                                    ListEmptyComponent={<EmptyDataContainer />}
                                    showsVerticalScrollIndicator={false}
                                    contentContainerStyle={{ borderWidth: 0, paddingVertical: Constants.globalPaddingVetical, paddingHorizontal: Constants.globalPaddingHorizontal }}
                                // onEndReachedThreshold={0.1}
                                // refreshControl={
                                //     <RefreshControl
                                //         refreshing={isRefreshing}
                                //         onRefresh={() => {
                                //             branchListingAPI(null, true)
                                //         }}
                                //     />
                                // }
                                />
                            </ScrollView>
                        </View>
                    }
                    <View style={{
                        paddingHorizontal: Constants.globalPaddingHorizontal,
                        position: "absolute",
                        width: "100%",
                        bottom: 0,
                        borderTopColor: Colors.lightGray,
                        borderTopWidth: 0.2,
                    }}>
                        {
                            repliedTo.replied_to ? (
                                <View style={{ flexDirection: "row", justifyContent: "space-between", paddingTop: 6, backgroundColor: Colors.backgroundColor }}>
                                    <Text>{props.labels.reply_to} {repliedTo.name}</Text>
                                    <Icon onPress={() => setRepliedTo({ id: "", name: "" })} name="close" style={{ ...styles.icon, color: Colors.red }} />

                                </View>
                            ) : null
                        }

                        {/*  commentbox */}
                        <InputValidation
                            // showSoftInputOnFocus={false}                            
                            // uniqueKey={"comment"}
                            // validationObj={validationObj}
                            value={inputeComment}
                            placeHolder={props.labels.enterComment}
                            onChangeText={(text) => {
                                // removeErrorTextForInputThatUserIsTyping(formFieldsKeys.name);
                                setInputeComment(text)
                            }}
                            style={styles.InputValidationView}
                            inputStyle={styles.inputStyle}
                            // editable={isEditable}
                            optional={true}
                            iconRight='plus-circle'
                            iconColor={inputeComment == "" ? Colors.lightPrimary : Colors.primary}
                            size={40}
                            isIconTouchable={true}
                            onPressIcon={() => {
                                if (inputeComment == "") {

                                } else {
                                    addComment()
                                }
                            }}
                        />
                    </View>
                </View>
            </View>
        </SafeAreaView>
    )
}

export default ActionSheetForComment

const styles = StyleSheet.create({
    mainView: {
        height: "90%",
        backgroundColor: Colors.backgroundColor,
        // borderWidth: 10
    },
    twoButtonView: { width: '100%', flexDirection: 'row', alignItems: 'center', marginTop: 20, justifyContent: 'space-between', paddingHorizontal: Constants.globalPaddingHorizontal },
    iconView: { height: 40, width: 40, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center', borderRadius: 10, elevation: 7 },
    icon: { fontSize: getProportionalFontSize(24) },
    titleStyle: {
        fontSize: getProportionalFontSize(15), fontFamily: Assets.fonts.bold, color: Colors.primary, flex: 3, textAlign: "center"
    },
    progressLoader: { width: '100%', position: "relative", flex: 0, height: "100%" },
    flatListContainerStyle: {
        paddingHorizontal: 16,
        width: '100%',
        height: "100%",
        backgroundColor: Colors.backgroundColor,
        // borderWidth: 1

    },
    normal_text: {
        fontFamily: Assets.fonts.semiBold,
        fontSize: getProportionalFontSize(14),
        color: Colors.black,
    },
    timeAndDate: {
        marginHorizontal: 10,
        fontFamily: Assets.fonts.regular,
        fontSize: getProportionalFontSize(10),
        // lineHeight: 24,
        color: Colors.gray,
        // justifyContent: "flex-end",
        alignSelf: "flex-end"
    },
    reply: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",

        // marginHorizontal: 10
    },
    descriptionText: {
        fontFamily: Assets.fonts.medium,
        fontSize: getProportionalFontSize(14),
        // lineHeight: 24,
        color: Colors.lightBlack
    },
    InputValidationView: {

        backgroundColor: Colors.backgroundColor,
        paddingTop: 10,
        //borderRadius: 20,

    },
    inputStyle: {
        fontSize: getProportionalFontSize(15),
        backgroundColor: Colors.white,
        borderColor: Colors.borderColor,
    },
})