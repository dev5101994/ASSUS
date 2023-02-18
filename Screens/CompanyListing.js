import React from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    FlatList,
    RefreshControl,
    Image
} from 'react-native';
import Colors from '../Constants/Colors';
import Constants from '../Constants/Constants'
import { getProportionalFontSize, firstLetterFromString } from '../Services/CommonMethods';
import Assets from '../Assets/Assets';
import EmptyList from '../Components/EmptyList';
import { FAB } from 'react-native-paper';
import { useSelector, useDispatch } from 'react-redux';
import APIService from '../Services/APIService';
import ListLoader from '../Components/ListLoader';
// icons
// import Ionicons from 'react-native-vector-icons/Ionicons';
// import Icon from 'react-native-vector-icons/dist/FontAwesome';
import Alert from '../Components/Alert';
import { Avatar } from 'react-native-paper';
import Can from '../can/Can';
import IPListCard from '../Components/IPListCard';
import FooterCompForFlatlist from '../Components/FooterCompForFlatlist';
// import ListLoader from '../Components/ListLoader';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'; //timeline
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'; //tasks
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'; //notebook

const CompanyListing = (props) => {

    const [companyList, setCompanyList] = React.useState([]);
    const [isLoading, setIsLoading] = React.useState(true);
    const [isRefreshing, setIsRefreshing] = React.useState(false);
    const [page, setPage] = React.useState(0);
    const [paginationLoading, setPaginationLoading] = React.useState(false);

    // REDUX hooks
    const dispatch = useDispatch();
    const UserLogin = useSelector(state => state.User.UserLogin);
    const permissions = UserLogin?.permissions ?? {}
    const labels = useSelector(state => state.Labels);
    const messages = useSelector(state => state.messages);
    const [openCardOptions, setOpenCardOptions] = React.useState()

    // useEffect hooks
    React.useEffect(() => {
        companyListingAPI()
    }, [])

    React.useEffect(() => {
        const unsubscribe = props.navigation.addListener('focus', () => {
            // The screen is focused
            // Call any action
            // console.log('Focus___________________________________________')
            companyListingAPI(null, true)
        });

        // Return the function to unsubscribe from the event so it gets removed on unmount
        return unsubscribe;
    }, [props.navigation]);

    // API methods
    const companyListingAPI = async (page, refresh) => {
        if (refresh)
            setIsRefreshing(true)
        else if (!page)
            setIsLoading(true);
        else
            setPaginationLoading(true)
        let params = {
            "perPage": Constants.perPage,
            "page": page ?? 1,
            "status": '1',
        }
        let url = Constants.apiEndPoints.administrationCompanies;
        // console.log('params=========>>>>>', JSON.stringify(params))
        let response = await APIService.postData(url, params, UserLogin.access_token, null, "administrationCompaniesListingAPI");
        if (!response.errorMsg) {
            //console.log("response.data.payload", response.data.payload.data)
            //setCompanyList(response.data?.payload?.data);
            //setIsLoading(false);
            if (!page) {
                setCompanyList(response.data.payload.data);
                setIsLoading(false);
                if (refresh)
                    setIsRefreshing(false);
                setPage(1);
            }
            else {
                let tempCompanyList = [...companyList];
                tempCompanyList = tempCompanyList.concat(response.data.payload.data);
                setPage(page);
                setCompanyList([...tempCompanyList]);
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

    const deleteCompany = async (itemId, index) => {
        setIsLoading(true);
        // let params = {
        // }
        // console.log("itemId", itemId)
        let url = Constants.apiEndPoints.administrationCompanyDetails + "/" + itemId;
        // console.log("url", url);
        let response = await APIService.deleteData(url, UserLogin.access_token, null, "companyAPI");
        if (!response.errorMsg) {
            // console.log("payload", response.data.payload);
            companyList.splice(index, 1)
            setIsLoading(false);
        }
        else {
            setIsLoading(false);
            Alert.showAlert(Constants.danger, response.errorMsg);
        }
    }

    // Helper Methods
    // const flatListRenderItem = ({ item, index }) => {
    //     let labelText = firstLetterFromString(item.name)
    //     return (
    //         <CommonCRUDCard
    //             title={item.name}
    //             labelText={labelText}
    //             showDeleteIcon={
    //                 // permissions?.companies?.delete
    //                 Can(Constants.permissionsKey.companiesDelete, permissions)
    //             }
    //             showEditIcon={
    //                 // permissions?.companies?.edit
    //                 Can(Constants.permissionsKey.companiesEdit, permissions)
    //             }
    //             //second_title={labels.email}
    //             second_title_value={item.email}
    //             //second_title_value_style={{ color: category_status_color[item.status] }}
    //             onPressEdit={() => {
    //                 props.navigation.navigate("AddCompanyForm", { itemId: item.id })
    //             }}
    //             onPressDelete={() => {
    //                 Alert.showDoubleAlert(Constants.warning, messages.message_delete_confirmation, () => {
    //                     deleteCompany(item.id, index);
    //                 })
    //             }}
    //             onPressCard={
    //                 // permissions?.companies?.read
    //                 Can(Constants.permissionsKey.companiesRead, permissions)
    //                     ? () => {
    //                         props.navigation.navigate("CommonUserProfile", { itemId: item.id, url: Constants.apiEndPoints.administrationCompanyDetails })
    //                     }
    //                     : () => { }
    //             }
    //         />
    //     )
    // };


    const flatListRenderItem = ({ item, index }) => {
        // console.log("types.concat(obj.name)---------------", item)
        // console.log("---------------", item.subscription)
        const companyTypes = (data) => {
            let types = "";
            data.forEach((obj) => {
                // console.log("types.concat(obj.name)---------------", types.concat(obj.name, ", "))
                types = types + obj.name + ", "
            })
            return types;
        }
        return (
            <IPListCard
                showMenu={true}
                openCardOptions={openCardOptions}
                setOpenCardOptions={setOpenCardOptions}
                index={index}
                isBranch={true}
                phoneNumber={item?.contact_number}
                email={item?.email}
                title={item.name}
                showDeleteIcon={
                    Can(Constants.permissionsKey.companiesDelete, permissions)
                }
                showEditIcon={
                    Can(Constants.permissionsKey.companiesEdit, permissions)
                }
                city={item?.city ?? "N/A"}
                packageName={item?.subscription?.package_details?.name ?? "N/A"}
                subTitle={item?.company_types?.length > 0 ? companyTypes(item?.company_types) : false}
                onPressEdit={() => {
                    props.navigation.navigate("AddCompanyForm", { itemId: item.id })
                }}
                onPressDelete={() => {
                    Alert.showDoubleAlert(Constants.warning, labels.message_delete_confirmation, () => {
                        deleteCompany(item.id, index);
                    })
                }}
                onPressCard={
                    Can(Constants.permissionsKey.companiesRead, permissions)
                        ? () => { props.navigation.navigate("CommonUserProfile", { itemId: item.id, url: Constants.apiEndPoints.administrationCompanyDetails, fromCompanyListing: true }) } : null
                }
            >
                <View style={styles.countView}>
                    <View style={styles.badgeContainer}>
                        <View style={styles.badge}>
                            <MaterialIcons name='add-business' color={Colors.white} size={18} />
                        </View>
                        <Text style={styles.badgeText}>
                            {item.branchs_count ?? 0}
                        </Text>
                    </View>
                    <View style={styles.badgeContainer}>
                        <View style={styles.badge}>
                            <FontAwesome5 name='hand-holding-medical' color={Colors.white} size={16} />
                        </View>
                        <Text style={styles.badgeText}>
                            {item.patients_count ?? 0}</Text>
                    </View>
                    <View style={styles.badgeContainer}>
                        <View style={styles.badge}>
                            <MaterialCommunityIcons name='human-male' color={Colors.white} size={18} />
                        </View>
                        <Text style={styles.badgeText}>
                            {item.employees_count ?? 0}</Text>
                    </View>
                </View>
            </IPListCard>
        )
    }
    // render view
    // if ()
    //     return <ProgressLoader />

    return (
        <BaseContainer
            onPressLeftIcon={() => {
                props.navigation.pop();
            }}
            leftIcon="arrow-back"
            leftIconSize={24}
            title={labels.company_listing}
            leftIconColor={Colors.primary}
            titleStyle={styles.headingText}
            rightIconColor={Colors.primary}
        >
            {
                isLoading
                    ? <ListLoader />
                    : (
                        <>
                            <View style={styles.mainView}>
                                <FlatList
                                    contentContainerStyle={{ borderWidth: 0, paddingVertical: Constants.globalPaddingVetical, paddingHorizontal: Constants.globalPaddingHorizontal }}
                                    showsVerticalScrollIndicator={false}
                                    ListEmptyComponent={<EmptyList />}
                                    data={companyList}
                                    renderItem={flatListRenderItem}
                                    keyExtractor={item => item.id}
                                    onEndReached={() => { companyListingAPI(page + 1) }}
                                    onEndReachedThreshold={0.1}
                                    refreshControl={
                                        <RefreshControl
                                            refreshing={isRefreshing}
                                            onRefresh={() => {
                                                companyListingAPI(null, true)
                                            }}
                                        />
                                    }
                                    ListFooterComponent={() => <FooterCompForFlatlist paginationLoading={paginationLoading} />}
                                />

                                {/* FLOATING ADD BUTTON */}
                                {
                                    // permissions?.companies?.add
                                    Can(Constants.permissionsKey.companiesAdd, permissions)
                                        ? <FAB
                                            style={styles.fab}
                                            color={Colors.white}
                                            icon="plus"
                                            onPress={() => { props.navigation.navigate('AddCompanyForm', { itemId: '' }) }}
                                        /> : null}
                            </View>
                        </>
                    )
            }

        </BaseContainer>
    );
};

export default CompanyListing;

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingRight: 5,
        paddingVertical: 5,
        borderBottomColor: Colors.ultraLightPrimary,
        borderBottomWidth: 1,
    },
    headerText: {
        fontSize: getProportionalFontSize(20),
        color: Colors.primary,
        fontFamily: Assets.fonts.semiBold,
    },
    scrollView: { flex: 1, backgroundColor: Colors.backgroundColor },
    fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        backgroundColor: Colors.primary,
        bottom: 0,
    },
    mainView: {
        flex: 1,
        //paddingHorizontal: 24,
        backgroundColor: Colors.backgroundColor,
        paddingBottom: 20,
    },
    headingText: {
        fontSize: getProportionalFontSize(24),
        // marginTop: 10,
        color: Colors.primary,
        fontFamily: Assets.fonts.bold,
    },
    //  list styling........
    companyTypeCard: {
        width: "100%",
        minHeight: 80,
        paddingHorizontal: Constants.globalPaddingHorizontal,
        paddingVertical: Constants.globalPaddingVetical,
        flexDirection: 'row',
        // alignItems: 'center',
        // justifyContent: 'space-between',
        shadowOffset: { width: 3, height: 3, },
        shadowOpacity: 10,
        elevation: 15,
        shadowColor: Platform.OS == "ios" ? Colors.shadowColorIosDefault : Colors.shadowColorAndroidDefault,
        shadowRadius: 10,
        marginTop: 15,
        backgroundColor: 'white',
        borderRadius: 15,

    },
    avatarText: { fontSize: getProportionalFontSize(22), fontFamily: Assets.fonts.semiBold, textTransform: "uppercase" },
    avatarImage: { width: 43, height: 43, borderRadius: 50, },
    companyNameView: {
        marginLeft: getProportionalFontSize(20),

    },
    companyNameText: {
        fontFamily: Assets.fonts.semiBold,
        fontSize: getProportionalFontSize(16),
        color: Colors.companyListing.textColor,
        letterSpacing: 0.5
    },
    detailsTitle: {
        fontSize: getProportionalFontSize(11),
        color: Colors.companyListing.textColor,
    },
    badge: {
        backgroundColor: Colors.cardColor,
        width: 23,
        height: 23,
        borderRadius: 26,
        justifyContent: "center",
        alignItems: "center",
        // position: "absolute",
        margin: 0
    },
    badgeText: {
        fontFamily: Assets.fonts.semiBold,
        fontSize: getProportionalFontSize(14),
        // color: Colors.black,
        marginLeft: 3, textAlign: "center", width: "40%"
    },
    countView: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 5,
        paddingHorizontal: 5
    },
    badgeContainer: {
        backgroundColor: Colors.transparent,
        height: 24,
        borderRadius: 25,
        padding: 0,
        flexDirection: "row",
        alignItems: "center",
        // maxWidth: "33%",
        width: "20%",
        borderWidth: 1,
        borderColor: Colors.cardColor,

    },
});
