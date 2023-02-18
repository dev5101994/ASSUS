import React, { useEffect } from 'react'
import { StyleSheet, Text, View, ScrollView, FlatList, TouchableOpacity, Image, RefreshControl } from 'react-native'
import Colors from '../Constants/Colors';
import { useSelector, useDispatch } from 'react-redux';
import { FAB } from 'react-native-paper';
import BaseContainer from '../Components/BaseContainer';
import Constants from '../Constants/Constants';
import { firstLetterFromString, formatDateWithTime, formatTime, getProportionalFontSize, formatDate } from '../Services/CommonMethods';
import APIService from '../Services/APIService';
import Alert from '../Components/Alert';
// icons
import Icon from 'react-native-vector-icons/Ionicons';
import EmptyList from '../Components/EmptyList';

const IpEditHistory = (props) => {
    // console.log("user_id", props.route.params.user_id)
    // REDUX hooks
    const dispatch = useDispatch();
    const isInternetActive = useSelector(state => state.IsInternetActive);
    const UserLogin = useSelector(state => state.User.UserLogin);
    const permissions = UserLogin?.permissions ?? {}
    const labels = useSelector(state => state.Labels);
    //hooks
    const [ipHistory, setIPHistory] = React.useState([]);
    const [isLoading, setIsLoading] = React.useState(true);
    const [isRefreshing, setIsRefreshing] = React.useState(false);
    const [page, setPage] = React.useState(0);
    const [paginationLoading, setPaginationLoading] = React.useState(false);
    // console.log("--------------------------------------------------", ipHistory)


    useEffect(() => {
        if (props.route.params.parent_id)
            getIPHistory()
    }, [])

    const getIPHistory = async (page, refresh) => {
        if (refresh)
            setIsRefreshing(true)
        else if (!page)
            setIsLoading(true);
        else
            setPaginationLoading(true)
        let params = {
            "perPage": Constants.perPage,
            "page": page ?? 1,
            "parent_id": props.route.params.parent_id
        }
        let url = Constants.apiEndPoints.ipEditHistory;
        // console.log('params=========>>>>>', JSON.stringify(params))
        // console.log("URL", url)
        // return
        let response = await APIService.postData(url, params, UserLogin.access_token, null, "IPHistory");
        // console.log("response---------------------", JSON.stringify(response))
        if (!response.errorMsg) {

            if (!page) {
                setIPHistory(response?.data?.payload?.data);
                setIsLoading(false);
                if (refresh)
                    setIsRefreshing(false);
                setPage(1);
            }
            else {
                let tempDeptHistory = [...ipHistory];
                tempDeptHistory = tempDeptHistory.concat(response?.data?.payload?.data);
                setPage(page);
                setIPHistory([...tempDeptHistory]);
                setPaginationLoading(false);
            }
        }
        else {
            if (!page)
                setIsLoading(false);
            else
                setPaginationLoading(false)
            if (refresh)
                setIsRefreshing(false);
            Alert.showAlert(Constants.danger, response.errorMsg)
        }
    }

    //helper 
    const InfoContainer = (props) => {
        const { iconName, title, content } = props;
        return (
            <View>
                <View style={{ flexDirection: "row", marginTop: 20, alignItems: 'center' }}>
                    {iconName ? <Icon style={{ marginRight: 5 }} name={iconName} color={Colors.black} size={17} /> : null}
                    <Text style={styles.descriptionText}>{title}</Text>
                </View>
                <Text style={styles.contentText}>{content ?? "N/A"}</Text>
            </View>
        )
    }

    const flatListRenderItem = ({ item }) => (
        <TouchableOpacity
            style={styles.container}
            onPress={() => props.navigation.push("ImplementationPlanDetail", { itemId: item.id, showHistoryBtn: false })}
        >
            {/* reason_for_editing */}
            {/* <InfoContainer
                title={labels["reason-for-editing"]}
                content={item?.reason_for_editing}
            /> */}

            {/* how_it_happened */}
            <InfoContainer
                title={labels["how-it-happened"]}
                content={item?.how_it_happened}
            />

            {/* created_at */}
            <InfoContainer
                title={labels["created-at"]}
                content={formatDate(item.created_at)}
            />
        </TouchableOpacity>

    );

    //render
    if (isLoading)
        return <ProgressLoader />
    return (
        <BaseContainer
            onPressLeftIcon={() => { props.navigation.pop() }}
            leftIcon="arrow-back"
            leftIconSize={24}
            title={labels["edit-history"]}
            leftIconColor={Colors.primary}
        >
            <FlatList
                data={ipHistory}
                renderItem={flatListRenderItem}
                keyExtractor={item => item.id}
                ListEmptyComponent={<EmptyList />}
                contentContainerStyle={{ borderWidth: 0, paddingVertical: Constants.globalPaddingVetical, paddingHorizontal: Constants.globalPaddingHorizontal }}
                showsVerticalScrollIndicator={false}
                onEndReached={() => { getIPHistory(page + 1) }}
                onEndReachedThreshold={0.1}
                refreshControl={
                    <RefreshControl
                        refreshing={isRefreshing}
                        onRefresh={() => {
                            getIPHistory(null, true);
                        }}
                    />
                }
            />
        </BaseContainer>
    )
}

export default IpEditHistory

const styles = StyleSheet.create({
    container: {
        width: "100%",
        shadowOffset: { width: 3, height: 3, },
        shadowOpacity: 10,
        elevation: 15,
        shadowColor: Platform.OS == "ios" ? Colors.shadowColorIosDefault : Colors.shadowColorAndroidDefault,
        shadowRadius: 10,
        backgroundColor: Colors.white,
        padding: Constants.globalPaddingHorizontal,
        marginVertical: 10,
        borderRadius: 10,
    },
    descriptionText: {
        fontFamily: Assets.fonts.medium,
        fontSize: getProportionalFontSize(15),
        lineHeight: 24,
        color: Colors.black
    },
    contentText: {
        fontFamily: Assets.fonts.regular,
        fontSize: getProportionalFontSize(12),
        lineHeight: 17,
        color: Colors.black
    },
})