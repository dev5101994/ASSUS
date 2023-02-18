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
import ListLoader from '../Components/ListLoader';
import { AllContactListAction, } from '../Redux/Actions/MessagesDataAction';
import { Searchbar } from 'react-native-paper';

export default AllContacts = (props) => {

    // REDUX hooks
    const labels = useSelector(state => state.Labels);
    const UserLogin = useSelector(state => state.User.UserLogin);
    const sendJsonMessage = useSelector(state => state.MessagesData.sendJsonMessage);
    const allContactList = useSelector(state => state.MessagesData.allContactList);
    const onlineUsers = useSelector(state => state.MessagesData.onlineUsers);
    const [searchBarVisible, setSearchBarVisible] = React.useState(false);
    const [searchQuery, setSearchQuery] = React.useState('');
    const readyState = useSelector(state => state.MessagesData.socketMessagesReadyState);

    const dispatch = useDispatch();

    React.useEffect(() => {
        getContacts()
    }, [])

    React.useEffect(() => {
        const unsubscribe = props.navigation.addListener('focus', () => {
            // The screen is focused
            // Call any action
            // console.log('Focus___________________________________________')
            getContacts(null, true)
        });
        // Return the function to unsubscribe from the event so it gets removed on unmount
        return unsubscribe;
    }, [props.navigation]);

    const flatListRenderItem = ({ item, index }) => {
        return (
            <TouchableOpacity
                onPress={() => {
                    props.navigation.navigate('ChatScreen', { itemID: item?.id, title: item?.name })
                }}
                style={[styles.cardMainView, { borderBottomWidth: index == allContactList?.data?.length - 1 ? 0.5 : 0, marginTop: index == 0 ? Constants.formFieldTopMargin : 0 }]}>

                <View style={styles.imageTextView}>
                    <View >
                        <Image
                            source={{ uri: item?.avatar ?? null }}
                            style={styles.image}
                        />
                        {isUserOnline(item?.id)
                            ? <View style={styles.onlineDotView} />
                            : null
                        }
                    </View>
                    <Text numberOfLines={5} style={[styles.nameText, { flex: 1 }]}>{item?.name}</Text>
                </View>
            </TouchableOpacity>
        )
    }

    const getContacts = async (page, refresh) => {
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
            dispatch(AllContactListAction({ isRefreshing: true }));
        else if (!page)
            dispatch(AllContactListAction({ isLoading: true }));
        else
            dispatch(AllContactListAction({ paginationLoading: true }));
        let params = {
            command: Constants.socket_constants.commands.get_all_contacts,
            token: UserLogin?.access_token,
            userId: UserLogin?.id,
            top_most_parent_id: UserLogin?.top_most_parent?.id
            // perPage: Constants.perPage,
            // page: page ?? 1,
        }
        // console.log('params', params)
        sendJsonMessage(params)
    }

    const isUserOnline = (userId) => {
        if (userId === null || userId === undefined)
            return false;
        return (onlineUsers[userId] && typeof (onlineUsers[userId]) == 'object'
            && !Array.isArray(onlineUsers[userId] && Object.keys(onlineUsers[userId])?.length > 0))
    }

    const filterListData = () => {
        if (searchQuery) {
            return allContactList?.data.filter((item) => {
                if (item?.name?.toLocaleLowerCase()?.includes(searchQuery?.toLocaleLowerCase()))
                    return true;
                else
                    return false;
            })
        }
        else {
            return allContactList?.data;
        }
    }

    // if (isLoading)
    //     return <ProgressLoader />
    // render
    //console.log('allContactList', JSON.stringify(allContactList))
    return (
        <BaseContainer
            onPressLeftIcon={() => { props.navigation.pop() }}
            leftIcon="arrow-back"
            leftIconSize={24}
            rightIcon={searchBarVisible ? "close" : "search"}
            rightIconStyle={{ alignSelf: "flex-end", paddingStart: getProportionalFontSize(13) }}
            onPressRightIcon={() => {
                setSearchBarVisible(!searchBarVisible)
                setSearchQuery('')
            }}
            title={labels.all_contacts}
            leftIconColor={Colors.primary}
        >
            {
                allContactList?.isLoading
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
                            ListEmptyComponent={<EmptyList messageIcon="list-alt" title={labels.mobile_no_contacts_to_show} shouldAddDataMessageVisible={false} />}
                            data={filterListData()}
                            renderItem={flatListRenderItem}
                            keyExtractor={(item, index) => '' + index}
                            showsVerticalScrollIndicator={false}
                            style={{}}
                            refreshControl={(
                                <RefreshControl
                                    refreshing={allContactList?.isRefreshing}
                                    onRefresh={() => {
                                        getContacts(null, true);
                                    }}
                                />
                            )}
                            contentContainerStyle={{
                                paddingBottom: 20,
                            }}
                            //ListFooterComponent={() => <FooterCompForFlatlist paginationLoading={allContactList?.paginationLoading} />}
                            onEndReachedThreshold={0.3}
                            onEndReached={() => {
                                // getContacts(allContactList?.page + 1)
                            }}
                        />
                    </View>
            }
        </BaseContainer>
    )
}



const styles = StyleSheet.create({
    onlineDotView: { height: 18, width: 18, borderRadius: 20, backgroundColor: Colors.green, position: "absolute", top: 0, right: 0 },
    searchBarStyle: { marginTop: Constants.formFieldTopMargin, marginHorizontal: Constants.globalPaddingHorizontal, borderRadius: 15 },
    mainView: {
        flex: 1,
        //paddingHorizontal: 24,
        backgroundColor: Colors.backgroundColor,
        // paddingBottom: 20,
    },
    rowStyle: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: Constants.formFieldTopMargin },
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
    cardMainView: { paddingHorizontal: 5, paddingVertical: 10, flexDirection: "row", justifyContent: "space-between", borderTopWidth: 0.5, borderColor: Colors.placeholderTextColor, },
    imageTextView: { flexDirection: "row", flex: 1, alignItems: "center" },
    image: { height: 60, width: 60, borderRadius: 40 },
    nameText: { width: "100%", fontFamily: Assets.fonts.bold, fontSize: getProportionalFontSize(14), marginLeft: 5, color: Colors.black },
    rightView: { justifyContent: "space-between", alignItems: "flex-end", flex: 1 },
    dateText: { fontFamily: Assets.fonts.semiBold, fontSize: getProportionalFontSize(12) },
    messageCounterView: { justifyContent: "center", alignItems: "center", borderRadius: 50, width: 35, height: 35, backgroundColor: Colors.primary, padding: 2 },
    smallText: { fontFamily: Assets.fonts.semiBold, fontSize: getProportionalFontSize(11), color: Colors.white }
})
