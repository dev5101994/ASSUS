import React, { useState } from 'react'
import { StyleSheet, Text, View, ScrollView, FlatList, RefreshControl, Platform, TouchableOpacity, Image } from 'react-native'
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
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import ListLoader from '../Components/ListLoader';
import { ContactsWithMessagesAction } from '../Redux/Actions/MessagesDataAction';
import { Searchbar } from 'react-native-paper';

const MessagesListing = (props) => {

    // REDUX hooks
    const labels = useSelector(state => state.Labels);
    // const [messagesList, setMessagesList] = useState([
    //     { name: "Naruto Uzumaki", id: 1, unread_messages_count: 10, date: new Date(), avatar: "https://www.apkmirror.com/wp-content/uploads/2021/07/04/60f6411308ec6.png" },
    //     { name: "Sasuke Uchiha", id: 2, unread_messages_count: 0, date: new Date(), avatar: "https://cdn.myanimelist.net/r/360x360/images/characters/9/131317.jpg?s=b53e816a48dfacc4bc7768066596800c" },
    //     { name: "Itachi Uchiha", id: 3, unread_messages_count: 1, date: new Date(), avatar: "https://cdn.myanimelist.net/images/characters/9/284122.jpg" },
    //     { name: "Sakura Haruno", id: 4, unread_messages_count: 101, date: new Date(), avatar: "https://www.ixpap.com/images/2022/04/Sakura-Haruno-Wallpaper-23.jpg" },
    //     { name: "Hinata Hyuga", id: 5, unread_messages_count: 0, date: new Date(), avatar: "https://dk2dv4ezy246u.cloudfront.net/widgets/sSFFVYULTat0_large.jpg" },
    //     { name: "Shikamaru Nara", id: 6, unread_messages_count: 0, date: new Date(), avatar: "https://cdn.myanimelist.net/r/360x360/images/characters/3/131315.jpg?s=9530d6913654a21fbe84c2b657750b61" },
    // ]);
    const UserLogin = useSelector(state => state.User.UserLogin);
    const sendJsonMessage = useSelector(state => state.MessagesData.sendJsonMessage);
    const contactsWithMessages = useSelector(state => state.MessagesData.contactsWithMessages);
    const onlineUsers = useSelector(state => state.MessagesData.onlineUsers);
    const [searchBarVisible, setSearchBarVisible] = React.useState(false);
    const [searchQuery, setSearchQuery] = React.useState('');
    const readyState = useSelector(state => state.MessagesData.socketMessagesReadyState);

    const dispatch = useDispatch();

    React.useEffect(() => {
        getMessagesList()
    }, [])

    React.useEffect(() => {
        const unsubscribe = props.navigation.addListener('focus', () => {
            // The screen is focused
            // Call any action
            // console.log('Focus___________________________________________')
            getMessagesList(null, true)
        });
        // Return the function to unsubscribe from the event so it gets removed on unmount
        return unsubscribe;
    }, [props.navigation]);

    const isUserOnline = (userId) => {
        if (userId === null || userId === undefined)
            return false;
        return (onlineUsers[userId] && typeof (onlineUsers[userId]) == 'object'
            && !Array.isArray(onlineUsers[userId] && Object.keys(onlineUsers[userId])?.length > 0))
    }


    const flatListRenderItem = ({ item, index }) => {

        let oppositeUser = item?.sender?.id == UserLogin.id ? item?.receiver : item?.receiver?.id == UserLogin.id ? item?.sender : {}

        return (
            <TouchableOpacity
                onPress={() => {
                    props.navigation.navigate('ChatScreen', { itemID: oppositeUser?.id, title: oppositeUser?.name })
                }}
                style={[styles.cardMainView, { borderBottomWidth: index == contactsWithMessages?.data?.length - 1 ? 0.5 : 0, marginTop: index == 0 ? Constants.formFieldTopMargin : 0 }]}>

                <View style={styles.imageTextView}>
                    <View >
                        <Image
                            source={{ uri: oppositeUser?.avatar ?? null }}
                            style={styles.image}
                        />
                        {isUserOnline(oppositeUser?.id)
                            ? <View style={styles.onlineDotView} />
                            : null
                        }
                    </View>
                    <View style={{ width: "90%" }}>
                        <Text numberOfLines={1} style={[styles.nameText, { flex: 1 }]}>{oppositeUser?.name}</Text>
                        <Text numberOfLines={2} style={[styles.nameText, { flex: 2, color: item.unread_messages_count > 0 ? Colors.primary : null }]}>{item?.message}</Text>
                    </View>
                </View>

                <View style={styles.rightView}>
                    <Text numberOfLines={1} style={styles.dateText}>{formatDateWithTime(oppositeUser?.updated_at)}</Text>
                    {item.unread_messages_count && item.unread_messages_count > 0
                        ? <View style={styles.messageCounterView}>
                            <Text numberOfLines={1} style={styles.smallText}>{item.unread_messages_count > 100 ? '100+' : item.unread_messages_count}</Text>
                        </View> : null}
                </View>

            </TouchableOpacity>
        )
    }

    const getMessagesList = async (page, refresh) => {
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
            dispatch(ContactsWithMessagesAction({ isRefreshing: true }));
        else if (!page)
            dispatch(ContactsWithMessagesAction({ isLoading: true }));
        else
            dispatch(ContactsWithMessagesAction({ paginationLoading: true }));
        let params = {
            command: Constants.socket_constants.commands.get_contacts_with_chat_initiated,
            token: UserLogin?.access_token,
            userId: UserLogin?.id,
            // perPage: Constants.perPage,
            // page: page ?? 1,
        }
        sendJsonMessage(params)
    }

    const filterListData = () => {
        if (searchQuery) {
            return contactsWithMessages?.data.filter((item) => {
                let oppositeUser = item?.sender?.id == UserLogin.id ? item?.receiver : item?.receiver?.id == UserLogin.id ? item?.sender : {}
                if (oppositeUser?.name?.toLocaleLowerCase()?.includes(searchQuery?.toLocaleLowerCase()))
                    return true;
                else
                    return false;
            })
        }
        else {
            return contactsWithMessages?.data;
        }
    }

    // if (isLoading)
    //     return <ProgressLoader />
    // render
    // console.log('onlineUsers', Array.isArray(onlineUsers[2]))
    // console.log('contactsWithMessages?.data', JSON.stringify(contactsWithMessages?.data))
    return (
        <BaseContainer
            onPressLeftIcon={() => { props.navigation.openDrawer() }}
            leftIcon="list"
            rightIcon={searchBarVisible ? "close" : "search"}
            onPressRightIcon={() => {
                setSearchBarVisible(!searchBarVisible)
                setSearchQuery('')
            }}
            rightIconStyle={{ alignSelf: "flex-end", paddingStart: getProportionalFontSize(13) }}
            leftIconSize={24}
            title={labels.chats}
            leftIconColor={Colors.primary}
        >
            {
                contactsWithMessages?.isLoading
                    ? <ListLoader />
                    : <View style={styles.mainView}>
                        {searchBarVisible
                            ? <Searchbar
                                autoFocus={true}
                                placeholder={labels.search}
                                style={styles.searchBarStyle}
                                onChangeText={(text) => { setSearchQuery(text) }}
                                value={searchQuery}
                                inputStyle={{ fontSize: getProportionalFontSize(16) }}
                            /> : null}

                        <FlatList
                            keyboardShouldPersistTaps="always"
                            ListEmptyComponent={<EmptyList messageIcon="wechat" title={labels.mobile_no_chats_to_show} shouldAddDataMessageVisible={false} />}
                            data={filterListData()}
                            renderItem={flatListRenderItem}
                            keyExtractor={(item, index) => '' + index}
                            showsVerticalScrollIndicator={false}
                            style={{}}
                            refreshControl={(
                                <RefreshControl
                                    refreshing={contactsWithMessages?.isRefreshing}
                                    onRefresh={() => {
                                        getMessagesList(null, true);
                                    }}
                                />
                            )}
                            contentContainerStyle={{
                                paddingBottom: 20,
                            }}
                            //ListFooterComponent={() => <FooterCompForFlatlist paginationLoading={contactsWithMessages?.paginationLoading} />}
                            onEndReachedThreshold={0.3}
                            onEndReached={() => {
                                // getMessagesList(contactsWithMessages?.page + 1)
                            }}
                        />

                        {/* FLOATING Button */}
                        <TouchableOpacity
                            style={[styles.fab, styles.roundButton]}
                            onPress={() => { props.navigation.navigate('AllContacts') }}>
                            <MaterialIcons
                                name="contacts"
                                color={Colors.white}
                                size={getProportionalFontSize(28)}
                            />
                        </TouchableOpacity>

                    </View>
            }
        </BaseContainer>
    )
}

export default MessagesListing

const styles = StyleSheet.create({
    onlineDotView: { height: 18, width: 18, borderRadius: 20, backgroundColor: Colors.green, position: "absolute", top: 0, right: 0 },
    mainView: {
        flex: 1,
        //paddingHorizontal: 24,
        backgroundColor: Colors.backgroundColor,
        // paddingBottom: 20,
    },
    rowStyle: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: Constants.formFieldTopMargin },
    searchBarStyle: { marginTop: Constants.formFieldTopMargin, marginHorizontal: Constants.globalPaddingHorizontal, borderRadius: 15 },
    fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        backgroundColor: Colors.primary,
        bottom: 0,
    },
    roundButton: {
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: Colors.primary,
        height: 60,
        width: 60,
        borderRadius: 35,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 15,
        elevation: 15,
        shadowColor: Colors.primary,
        shadowRadius: 6,
        zIndex: 100
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
    cardMainView: { paddingHorizontal: 5, paddingVertical: 10, flexDirection: "row", justifyContent: "space-between", borderTopWidth: 0.5, borderColor: Colors.placeholderTextColor, },
    imageTextView: { flexDirection: "row", flex: 1 },
    image: { height: 60, width: 60, borderRadius: 40 },
    nameText: { width: "100%", fontFamily: Assets.fonts.bold, fontSize: getProportionalFontSize(14), marginLeft: 5, color: Colors.black },
    rightView: { justifyContent: "space-between", alignItems: "flex-end", flex: 1 },
    dateText: { fontFamily: Assets.fonts.semiBold, fontSize: getProportionalFontSize(12) },
    messageCounterView: { justifyContent: "center", alignItems: "center", borderRadius: 50, width: 35, height: 35, backgroundColor: Colors.primary, padding: 2 },
    smallText: { fontFamily: Assets.fonts.semiBold, fontSize: getProportionalFontSize(11), color: Colors.white }
})
