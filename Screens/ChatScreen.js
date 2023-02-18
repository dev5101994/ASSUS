import React, { useState } from 'react'
import { StyleSheet, Text, View, ScrollView, RefreshControl, Platform, TouchableOpacity, Image, TextInput, KeyboardAvoidingView, FlatList, ActivityIndicator } from 'react-native'
import { FAB } from 'react-native-paper';
import EmptyList from '../Components/EmptyList';
import Colors from '../Constants/Colors';
import { formatDate, formatDateWithTime, getProportionalFontSize } from '../Services/CommonMethods';
import { useSelector, useDispatch } from 'react-redux';
import BaseContainer from '../Components/BaseContainer';
import APIService from '../Services/APIService';
import Constants from '../Constants/Constants';
import Alert from '../Components/Alert';
import FooterCompForFlatlist from '../Components/FooterCompForFlatlist';
import ProgressLoader from '../Components/ProgressLoader'
import Assets from '../Assets/Assets';
import Icon from 'react-native-vector-icons/Ionicons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { chatDataAction } from '../Redux/Actions/MessagesDataAction';


const ChatScreen = (props) => {

    const routeParams = props?.route?.params ?? {};

    // REDUX hooks
    const labels = useSelector(state => state.Labels);
    // const [chatData, setChatData] = useState([
    //     {
    //         id: 17,
    //         created_at: new Date(),
    //         message: "sure",
    //         sender_id: 2
    //     },
    //     {
    //         id: 16,
    //         created_at: new Date(),
    //         message: "ok great then bring me a sandwich!!!",
    //         sender_id: 1
    //     },
    //     {
    //         id: 4,
    //         created_at: new Date(),
    //         message: "At chipole, just chilling..",
    //         sender_id: 2
    //     },
    //     {
    //         id: 12,
    //         created_at: new Date(),
    //         message: "Where you at ?",
    //         sender_id: 1
    //     },
    //     {
    //         id: 11,
    //         created_at: new Date(),
    //         message: "Sup ??",
    //         sender_id: 2
    //     },
    //     {
    //         id: 10,
    //         created_at: new Date(),
    //         message: "Hi",
    //         sender_id: 1
    //     },
    // ]);
    const [KeyboardScrollViewRef, setKeyboardScrollViewRef] = React.useState(null);
    const [scrolledDownAlready, setScrolledDownAlready] = React.useState(false);
    const UserLogin = useSelector(state => state.User.UserLogin);
    const sendJsonMessage = useSelector(state => state.MessagesData.sendJsonMessage);
    const chatData = useSelector(state => state.MessagesData.chatData);
    const onlineUsers = useSelector(state => state.MessagesData.onlineUsers);
    const lastMessage = useSelector(state => state.MessagesData.lastMessage);
    const [textMessage, setTextMessage] = useState('');
    const [sendingMessage, setSendingMessage] = useState(false);
    const readyState = useSelector(state => state.MessagesData.socketMessagesReadyState);

    const dispatch = useDispatch();

    React.useEffect(() => {
        getChat()
    }, [props?.route?.params]);


    React.useEffect(() => {
        newMessagesHandler()
    }, [lastMessage]);


    const newMessagesHandler = async () => {
        let tempLastMessage = null;
        if (lastMessage?.data)
            tempLastMessage = lastMessage?.data;
        if (tempLastMessage) {
            let jsonLastMessage = await JSON.parse(tempLastMessage);
            if (jsonLastMessage?.command == Constants.socket_constants.commands.send_msg) {
                let messageSendByMe = (jsonLastMessage?.from == UserLogin?.id && jsonLastMessage?.to == props?.route?.params?.itemID);
                let messageReceivedToMe = (jsonLastMessage?.from == props?.route?.params?.itemID && jsonLastMessage?.to == UserLogin?.id);
                if (messageSendByMe) {
                    setSendingMessage(false)
                    setTextMessage('')
                }
                if (messageSendByMe || messageReceivedToMe) {
                    let newMsg = {
                        ...jsonLastMessage,
                        "sender_id": jsonLastMessage.from
                    }
                    dispatch(chatDataAction({ data: [newMsg].concat(chatData?.data) }))
                    if (messageSendByMe)
                        KeyboardScrollViewRef?.scrollToEnd({ animated: true })
                }
            }
        }
    }


    const getChat = async (page, refresh) => {
        if (!Constants.isConnected) {
            Alert.showAlert(Constants.warning, labels.connect_internet_message)
            return;
        }
        if (readyState != 1) {
            Alert.showToast(labels.message_something_went_wrong)
            return;
        }
        if (!sendJsonMessage)
            return;
        if (refresh)
            dispatch(chatDataAction({ isRefreshing: true }));
        else if (!page)
            dispatch(chatDataAction({ isLoading: true }));
        else
            dispatch(chatDataAction({ paginationLoading: true }));
        let params = {
            command: Constants.socket_constants.commands.get_chat,
            token: UserLogin?.access_token,
            logged_in_user_id: UserLogin?.id,
            other_user_id: props?.route?.params?.itemID,
            from_date: null,
            end_date: null,
            per_page: Constants.chatPerPage,
            page: page ?? 1,
            // page: 2
        }
        let params_read_chat = {
            command: Constants.socket_constants.commands.read_messages,
            token: UserLogin?.access_token,
            logged_in_user_id: UserLogin?.id,
            other_user_id: props?.route?.params?.itemID,
        }
        let params_unread_count = {
            command: Constants.socket_constants.commands.totalunreadmessage,
            "userId": UserLogin?.id,
            "token": UserLogin?.access_token
        }
        // console.log('params', params)
        sendJsonMessage(params)
        sendJsonMessage(params_read_chat)
        sendJsonMessage(params_unread_count)
    }

    const sendMessage = () => {
        if (!Constants.isConnected) {
            Alert.showAlert(Constants.warning, labels.connect_internet_message)
            return;
        }
        if (readyState != 1) {
            Alert.showToast(labels.message_something_went_wrong)
            return;
        }
        if (!sendJsonMessage)
            return;
        if (!textMessage)
            return;
        let param = {
            command: Constants.socket_constants.commands.send_msg,
            token: UserLogin?.access_token,
            to: props?.route?.params?.itemID,
            from: UserLogin?.id,
            message: textMessage,
            file_path: "",
            file_type: ""
        }
        setSendingMessage(true)
        sendJsonMessage(param)
    }

    const flatListRenderItem = ({ item, index }) => {
        return (
            <>
                {UserLogin.id == item.sender_id
                    // Right chat box 
                    ? <TouchableOpacity
                        activeOpacity={1}
                        style={[styles.chatBoxMainView, { flexDirection: "row-reverse", }]}>
                        <View style={styles.triangleChatMySide} />
                        <View style={[styles.chattingComp, { backgroundColor: Colors.primary }]}>
                            {/* date time and separator */}
                            <Text style={[styles.dateTimeStyle, { color: Colors.white }]}>{`${formatDateWithTime(item.created_at)}`}</Text>
                            <View style={[styles.separator, { borderColor: Colors.white }]} />

                            <Text style={[styles.chatText, { color: Colors.white }]}>{item.message}</Text>

                        </View>
                    </TouchableOpacity>

                    //    Left chat box 
                    : <TouchableOpacity activeOpacity={1} style={styles.chatBoxMainView}>
                        <View style={styles.triangleChat} />
                        <View style={[styles.chattingComp, { backgroundColor: "white" }]}>
                            {/* date time and separator */}
                            <Text style={styles.dateTimeStyle}>{`${formatDateWithTime(item.created_at)}`}</Text>
                            <View style={styles.separator} />
                            <Text style={styles.chatText}>{item.message}</Text>
                        </View>
                    </TouchableOpacity>
                }
            </>
        )
    }

    const isUserOnline = (userId) => {
        if (userId === null || userId === undefined)
            return false;
        return (onlineUsers[userId] && typeof (onlineUsers[userId]) == 'object'
            && !Array.isArray(onlineUsers[userId] && Object.keys(onlineUsers[userId])?.length > 0))
    }

    // render view
    // console.log('chatData?.data', chatData?.data?.length)
    if (chatData?.isLoading)
        return <ProgressLoader />

    return (
        <BaseContainer
            onPressLeftIcon={() => { props.navigation.navigate('MessagesListing') }}
            leftIcon="arrow-back"
            leftIconSize={24}
            titleNumberOfLines={4}
            title={isUserOnline(props?.route?.params?.itemID) ? routeParams.title + ` (${labels.mobile_online})` : routeParams.title}
            leftIconColor={Colors.primary}
            style={{ backgroundColor: '#f8f8f8' }}
        >
            <KeyboardAwareScrollView
                ref={ref => { setKeyboardScrollViewRef(ref) }}
                onContentSizeChange={() => {
                    if (!scrolledDownAlready) {
                        setScrolledDownAlready(true)
                        KeyboardScrollViewRef?.scrollToEnd({ animated: true })
                    }
                }}
                showsVerticalScrollIndicator={false} style={[styles.scrollView, { paddingBottom: 30 }]}>

                <View style={styles.mainView}>

                    {chatData?.data?.length <= 0
                        ? <EmptyList messageIcon="wechat" title={labels.empty_chat_message} shouldAddDataMessageVisible={false} />
                        : <FlatList
                            inverted={true}
                            data={chatData?.data ?? []}
                            renderItem={flatListRenderItem}
                            keyExtractor={(item, index) => '' + index}
                            showsVerticalScrollIndicator={false}
                            style={{}}
                            contentContainerStyle={{
                                // paddingBottom: 20,
                            }}
                            ListFooterComponent={() => {
                                if (chatData?.stopLoadingMore)
                                    return null;
                                if (!chatData?.paginationLoading) {
                                    return (
                                        <TouchableOpacity onPress={() => { getChat(chatData?.page + 1) }} style={{ alignItems: "center", }}>
                                            <Icon size={getProportionalFontSize(25)} color={Colors.gray} name={"ios-refresh-sharp"} />
                                            <Text style={styles.graySmallText}>{labels.see_older_messages}</Text>
                                        </TouchableOpacity>
                                    )
                                }
                                else
                                    return <FooterCompForFlatlist activityIndicator paginationLoading={chatData?.paginationLoading} />
                            }}
                        // onEndReachedThreshold={0.1}
                        // onEndReached={() => {
                        //     getChat(chatData?.page + 1)
                        // }}
                        />}

                </View>
            </KeyboardAwareScrollView>

            {/* Chat text input view */}
            <KeyboardAvoidingView
                keyboardVerticalOffset={50}
                style={{ backgroundColor: '#f8f8f8' }}
                behavior={Platform.OS === "ios" ? "position" : "height"} >

                <View style={styles.chattingInputMainView}>

                    <View style={styles.chattingInputView}>
                        <TextInput
                            textAlign={"left"}
                            textAlignVertical="center"
                            value={textMessage}
                            onChangeText={(text) => {
                                if (text == ' ')
                                    text = '';
                                text = text.includes('  ') ? text.replace(Constants.noSpacePattern, '') : text;
                                setTextMessage(text)
                            }}
                            style={styles.chatTextInput}
                            placeholder={labels.message}
                            multiline={true}
                        />
                    </View>
                    {/* send icon */}
                    <TouchableOpacity
                        onPress={() => {
                            sendMessage()
                        }} style={styles.sendIconView}>
                        {
                            sendingMessage
                                ? <ActivityIndicator color={Colors.white} />
                                : <Icon name={"send"} style={styles.sendIcon} />
                        }
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </BaseContainer>
    )
}

export default ChatScreen

const styles = StyleSheet.create({
    mainView: {
        flex: 1,
        //paddingHorizontal: 24,
        backgroundColor: '#f8f8f8',
        paddingBottom: 20,
    },
    scrollView: { flex: 1, backgroundColor: '#f8f8f8', },
    rowStyle: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: Constants.formFieldTopMargin },
    graySmallText: { fontFamily: Assets.fonts.semiBold, fontSize: getProportionalFontSize(11), color: Colors.gray },
    fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        backgroundColor: Colors.primary,
        bottom: 0,
    },
    cardContainer: {
        backgroundColor: "#fff",
        padding: 15,
        marginTop: Constants.formFieldTopMargin,
        // shadow
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 15,
        elevation: 15,
        shadowColor: Platform.OS == 'ios' ? Colors.primary : Colors.primary,
        shadowRadius: 6,
        borderRadius: 7,
    },
    normalText: {
        fontSize: getProportionalFontSize(13),
        fontFamily: Assets.fonts.semiBold,
        color: Colors.gray
    },
    boldText: {
        fontSize: getProportionalFontSize(15),
        fontFamily: Assets.fonts.bold,
        color: Colors.primary
    },

    chattingInputMainView: {
        // position: 'absolute',
        // zIndex: 1,
        // bottom: 0,
        // flex: 1,
        // backgroundColor: '#f8f8f8',
        paddingHorizontal: 10,
        width: "100%",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-end",
        backgroundColor: Colors.placeholderTextColor,
        paddingVertical: 10
        // marginBottom: 5,
        // borderWidth: 1
        // marginTop: 10
    },
    chattingInputView: {
        width: "85%",
        //minHeight: 40,
        borderWidth: 0.1,
        // backgroundColor: '#f8f8f8',
        borderRadius: 25,
    },
    chatTextInput: {
        width: "100%",
        minHeight: 40,
        paddingHorizontal: 13,
        paddingVertical: 5,
        backgroundColor: Colors.white,
        borderRadius: 25,
        // borderColor: Colors.primary,
        // borderWidth: 1
    },
    sendIconView: {
        height: 40,
        width: 40,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 20,
        backgroundColor: Colors.primary
    },
    sendIcon: {
        color: "white",
        fontSize: getProportionalFontSize(18)
    },
    chattingComp: {
        width: "88%",
        minHeight: 70,
        borderRadius: 10,
        backgroundColor: '#dcf8c6',
        // paddingHorizontal: 10,
        // paddingVertical: 5,
        padding: 10,
        elevation: 8,
        shadowOffset: { width: 0, height: 0, },
        shadowOpacity: 25,
        shadowColor: Platform.OS == "ios" ? 'rgba(0,0,0,0.1)' : 'rgba(0,0,0,0.3)',
        shadowRadius: 7,
        marginBottom: 10,
    },
    triangleChat: {
        height: 0,
        width: 0,
        borderBottomWidth: 7,
        borderTopWidth: 7,
        borderRightWidth: 13,
        borderRightColor: "white",
        borderBottomColor: "transparent",
        borderTopColor: 'transparent',
        borderLeftColor: "transparent",
        marginTop: 10,
        elevation: 8,
        shadowOffset: { width: 0, height: 0, },
        shadowOpacity: 25,
        shadowColor: Platform.OS == "ios" ? 'rgba(0,0,0,0.1)' : 'rgba(0,0,0,0.3)',
        shadowRadius: 7,
        marginBottom: 10,
    },

    triangleChatMySide: {
        height: 0,
        width: 0,
        borderBottomWidth: 7,
        borderTopWidth: 7,
        borderLeftWidth: 13,
        borderLeftColor: Colors.primary,
        borderBottomColor: "transparent",
        borderTopColor: 'transparent',
        borderRightColor: "transparent",
        marginTop: 10,
        elevation: 8,
        shadowOffset: { width: 0, height: 0, },
        shadowOpacity: 25,
        shadowColor: Platform.OS == "ios" ? 'rgba(0,0,0,0.1)' : 'rgba(0,0,0,0.3)',
        shadowRadius: 7,
        marginBottom: 10,
    },
    chatBoxMainView: {
        width: "100%",
        flexDirection: "row",
        paddingHorizontal: Constants.globalPaddingHorizontal,
        marginTop: 8,
        marginBottom: 5,
    },
    chatText: {
        fontSize: getProportionalFontSize(13),
        fontFamily: Assets.fonts.semiBold,
        marginTop: 13
    },
    separator: { height: 0, width: "100%", borderBottomWidth: 0.2, borderColor: 'rgba(117, 120, 123, 1)' },
    dateTimeStyle: { fontSize: getProportionalFontSize(11), fontFamily: Assets.fonts.semiBold, color: 'rgba(117, 120, 123, 1)' },
})