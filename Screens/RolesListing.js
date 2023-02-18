import React, { useState } from 'react'
import { StyleSheet, Text, View, ScrollView, FlatList, RefreshControl, Platform, TouchableOpacity } from 'react-native'
import { FAB } from 'react-native-paper';
import EmptyList from '../Components/EmptyList';
import Colors from '../Constants/Colors';
import { getProportionalFontSize } from '../Services/CommonMethods';
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
import Can from '../can/Can';

const RolesListing = (props) => {

    // REDUX hooks
    const labels = useSelector(state => state.Labels);
    const [rolesList, setRolesList] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [page, setPage] = useState(0);
    const [paginationLoading, setPaginationLoading] = useState(false);
    const UserLogin = useSelector(state => state.User.UserLogin);
    const permissions = UserLogin?.permissions ?? {}

    React.useEffect(() => {
        getRolesList()
    }, [])

    React.useEffect(() => {
        const unsubscribe = props.navigation.addListener('focus', () => {
            // The screen is focused
            // Call any action
            // console.log('Focus___________________________________________')
            getRolesList(null, true)
        });
        // Return the function to unsubscribe from the event so it gets removed on unmount
        return unsubscribe;
    }, [props.navigation]);

    const flatListRenderItem = ({ item, index }) => {
        return (
            <TouchableOpacity onPress={() => { props.navigation.navigate('AddRole', { itemID: item.id }) }} style={styles.cardContainer}>
                <Text style={styles.normalText}>{labels["this-role-has"]} {item.permissions?.length} {labels["Permissions"]}</Text>
                <Text style={{ ...styles.boldText, marginTop: Constants.formFieldTopMargin }}>{item.se_name}</Text>

                <View style={styles.rowStyle}>
                    <Text style={{ ...styles.normalText, fontSize: getProportionalFontSize(14) }}>{labels.edit}</Text>
                    < Icon
                        name="key-sharp"
                        color={Colors.primary}
                        size={getProportionalFontSize(23)}
                    />
                </View>
            </TouchableOpacity>
        )
    }

    const getRolesList = async (page, refresh) => {

        if (refresh)
            setIsRefreshing(true)
        else if (!page)
            setIsLoading(true);
        else
            setPaginationLoading(true)
        let params = {
            "perPage": Constants.perPage,
            "page": page ?? 1,
        }

        let url = Constants.apiEndPoints.roles;
        let response = await APIService.postData(url, params, UserLogin.access_token, null, "RolesList");
        if (!response.errorMsg) {
            if (!page) {
                setRolesList(response.data.payload.data);
                setIsLoading(false);
                if (refresh)
                    setIsRefreshing(false);
                setPage(1);
            }
            else {
                let tempRoleList = [...rolesList];
                tempRoleList = tempRoleList.concat(response.data.payload.data);
                setPage(page);
                setRolesList([...tempRoleList]);
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

    // if (isLoading)
    //     return <ProgressLoader />

    return (
        <BaseContainer
            onPressLeftIcon={() => { props.navigation.pop() }}
            leftIcon="arrow-back"
            leftIconSize={24}
            title={labels["Roles"]}
            leftIconColor={Colors.primary}
        >
            {
                isLoading
                    ? <ListLoader />
                    : (
                        <View style={styles.mainView}>


                            <Text style={{ ...styles.boldText, marginTop: Constants.formFieldTopMargin, textAlign: "center" }}>{labels["manage-roles"]}</Text>


                            <FlatList
                                ListEmptyComponent={<EmptyList />}
                                data={rolesList}
                                renderItem={flatListRenderItem}
                                keyExtractor={item => '' + item.id}
                                showsVerticalScrollIndicator={false}
                                style={{ marginTop: Constants.formFieldTopMargin }}
                                refreshControl={(
                                    <RefreshControl
                                        refreshing={isRefreshing}
                                        onRefresh={() => {
                                            getRolesList(null, true);
                                        }}
                                    />
                                )}
                                contentContainerStyle={{ paddingBottom: 50, paddingHorizontal: Constants.globalPaddingHorizontal }}
                                ListFooterComponent={() => <FooterCompForFlatlist paginationLoading={paginationLoading} />}
                                onEndReachedThreshold={0.3}
                                onEndReached={() => { getRolesList(page + 1, null) }}
                            />


                            {/* FLOATING ADD BUTTON */}
                            {
                                Can(Constants.permissionsKey.roleAdd, permissions)
                            }
                            <FAB
                                style={styles.fab}
                                color={Colors.white}
                                icon="plus"
                                onPress={() => { props.navigation.navigate('AddRole'); }}
                            />

                        </View>
                    )
            }
        </BaseContainer>
    )
}

export default RolesListing

const styles = StyleSheet.create({
    mainView: {
        flex: 1,
        //paddingHorizontal: 24,
        backgroundColor: Colors.backgroundColor,
        paddingBottom: 20,
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
    }
})
