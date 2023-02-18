import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    ScrollView,
    SafeAreaView,
    FlatList,
    RefreshControl
} from 'react-native';
import { FAB } from 'react-native-paper';
import Icon from 'react-native-vector-icons/Ionicons';
import EmptyList from '../Components/EmptyList';
import Colors from '../Constants/Colors';
import { getProportionalFontSize, firstLetterFromString } from '../Services/CommonMethods';
import { useSelector, useDispatch } from 'react-redux';
import Alert from '../Components/Alert';
import Constants from '../Constants/Constants';
import APIService from '../Services/APIService'
import Assets from '../Assets/Assets';
import PackageDetails from '../Components/PackageSummary';
import PackageSummary from '../Components/PackageSummary';
import Can from '../can/Can';
import ListLoader from '../Components/ListLoader';
import PackagesListCard from '../Components/PackagesListCard';


const Packages = props => {
    // useState hooks
    const [PackegeData, setPackegeData] = React.useState([])
    const [packageList, setpackageList] = React.useState([]);
    const [isLoading, setIsLoading] = React.useState(true);
    const [isRefreshing, setIsRefreshing] = React.useState(false);
    const [paginationLoading, setPaginationLoading] = React.useState(false);
    const [page, setPage] = React.useState(0);
    const [showItemDetail, setShowItemDetail] = React.useState(false);
    // const [item, setItem] = React.useState({});

    // REDUX hooks
    const UserLogin = useSelector(state => state.User.UserLogin);
    const permissions = UserLogin?.permissions ?? {}
    const labels = useSelector(state => state.Labels);

    const messages = useSelector(state => state.Labels);

    // useEffect hooks
    React.useEffect(() => {
        packageListingAPI()
    }, [])

    React.useEffect(() => {
        const unsubscribe = props.navigation.addListener('focus', () => {
            // The screen is focused
            // Call any action
            // console.log('Focus___________________________________________')
            packageListingAPI()
        });

        // Return the function to unsubscribe from the event so it gets removed on unmount
        return unsubscribe;
    }, [props.navigation]);

    // API methods
    const packageListingAPI = async (page, refresh) => {
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
        // console.log('params', params)
        let url = Constants.apiEndPoints.administrationPackageList;
        // console.log("url", url);
        let response = await APIService.postData(url, params, UserLogin.access_token, null, "packageAPI");

        if (!response?.errorMsg) {
            // console.log('response-------------------+++++++++++++', JSON.stringify(response))
            if (!page) {
                setPage(1);
                setpackageList(response?.data?.payload?.data);
                setIsLoading(false);
                if (refresh)
                    setIsRefreshing(false);
            }
            else {
                let tempPackageList = [...packageList];
                tempPackageList = tempPackageList.concat(response.data.payload.data);
                setPage(page);
                setpackageList([...tempPackageList]);
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


    const deletePackageAPI = async (itemId, index) => {
        setIsLoading(true);
        let url = Constants.apiEndPoints.administrationPackage + "/" + itemId;
        let response = await APIService.deleteData(url, UserLogin.access_token, null, "deleteCompanyTypeAPI");
        if (!response.errorMsg) {

            let tempPackageList = [...packageList];
            tempPackageList.splice(index, 1)
            setpackageList([...tempPackageList]);
            Alert.showToast(messages.message_delete_success)
            setIsLoading(false);
        }
        else {
            setIsLoading(false);
            Alert.showAlert(Constants.danger, response.errorMsg)
        }
    }


    // Helper methods
    const RenderItem = ({ item, index }) => {
        let labelText = firstLetterFromString(item.name)
        //item.showDetails = false
        // const { id, package_name, package_price, is_on_offer, flat_discount, discounted_price, discount_in_percentage, discount_type, validity_in_days, number_of_patients, number_of_employee } = item
        return (
            <View>
                <PackagesListCard
                    index={index}
                    title={item.name}
                    // labelText={labelText}
                    price={item.price}
                    number_of_patients={item.number_of_patients}
                    number_of_employees={item.number_of_employees}
                    validity_in_days={item.validity_in_days}
                    is_on_offer={item.is_on_offer == "1" ? true : false}
                    discount_type={item.discount_type}
                    discount_value={item.discount_value}
                    discounted_price={item.discounted_price}
                    is_enable_bankid_charges={item.is_enable_bankid_charges == "1" ? true : false}
                    is_sms_enable={item.is_sms_enable == "1" ? true : false}
                    total_buyer={item.purchaseCount}
                    showEditButton={Can(Constants.permissionsKey.packagesEdit, permissions)}
                    showDeleteButton={Can(Constants.permissionsKey.packagesDelete, permissions)}
                    sms_charges={item.sms_charges}
                    bankid_charges={item.bankid_charges}
                    // onPressCard={
                    //     Can(Constants.permissionsKey.packagesBrowse, permissions)
                    //         ? () => { props.navigation.navigate("AddPackages", { package_id: item.id }) }
                    //         : () => { }
                    // }


                    onPressEdit={() => {
                        props.navigation.navigate("AddPackages", { package_id: item.id })
                    }}
                    onPressDelete={() => {
                        Alert.showDoubleAlert(Constants.warning, messages.message_delete_confirmation, () => {
                            deletePackageAPI(item.id, index);

                        })
                    }}
                >

                </PackagesListCard>
            </View>
        )
    }
    //render item
    // if ()
    //     return <ProgressLoader />

    return (
        <BaseContainer
            onPressLeftIcon={() => {
                props.navigation.navigate('Home');
            }}
            leftIcon="arrow-back"
            leftIconSize={24}
            title={labels.package_listing}
            leftIconColor={Colors.primary}
            //rightIconSize={32}
            titleStyle={styles.headingText}
        >
            {
                isLoading
                    ? <ListLoader />
                    : <View style={styles.mainView}>
                        <FlatList
                            contentContainerStyle={{ paddingHorizontal: Constants.globalPaddingHorizontal, paddingTop: Constants.globalPaddingHorizontal }}
                            ListEmptyComponent={<EmptyList />}
                            data={packageList}
                            renderItem={RenderItem}
                            keyExtractor={item => item.id}
                            onEndReached={() => { packageListingAPI(page + 1) }}
                            onEndReachedThreshold={0.1}
                            refreshControl={
                                <RefreshControl
                                    refreshing={isRefreshing}
                                    onRefresh={() => {
                                        packageListingAPI(null, true)
                                    }}
                                />
                            }
                        />
                        {/* FLOATING ADD BUTTON */}
                        {
                            Can(Constants.permissionsKey.packagesAdd, permissions)
                                ? <FAB
                                    style={styles.fab}
                                    color={Colors.white}
                                    icon="plus"
                                    onPress={() => { props.navigation.navigate('AddPackages') }}
                                /> : null}
                    </View>
            }
        </BaseContainer>

    );
};

export default Packages;

const styles = StyleSheet.create({
    scrollView: { flex: 1, backgroundColor: Colors.backgroundColor },
    mainView: {
        // marginTop: 20,
        flex: 1,
        backgroundColor: Colors.backgroundColor,
        // paddingBottom: 20,
    },
    fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        backgroundColor: Colors.primary,
        bottom: 0,
    },
    headingText: {
        fontSize: getProportionalFontSize(24),
        // marginTop: 10,
        color: Colors.primary,
        fontFamily: Assets.fonts.bold,
    },
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

    categoryTypeCardContainer: {
        width: "100%",
        shadowOffset: { width: 3, height: 3, },
        shadowOpacity: 10,
        elevation: 10,
        shadowColor: Platform.OS == "ios" ? Colors.shadowColorIosDefault : Colors.shadowColorAndroidDefault,
        shadowRadius: 10,
        backgroundColor: 'white',
        marginTop: 15,
        borderRadius: 15,
        paddingHorizontal: Constants.globalPaddingHorizontal
    },
    categoryTypeCard: {
        width: "100%",
        minHeight: 80,
        // paddingHorizontal: 12,
        paddingVertical: 5,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',


        backgroundColor: 'white',
        borderRadius: 15
    },
    categoryNameView: {
        width: '80%'
    },
    categoryNameText: {
        fontFamily: Assets.fonts.bold,
        fontSize: getProportionalFontSize(15),
    },
    PriceView: {
        flexDirection: 'row',
        alignItems: "flex-end"
    },
    price: {
        fontFamily: Assets.fonts.semiBold,
        fontSize: getProportionalFontSize(14),
        marginLeft: 10
    },
    priceTitle: {
        fontFamily: Assets.fonts.semiBold,
        fontSize: getProportionalFontSize(14)
    },
    editDeleteIconView: {
        flexDirection: 'row',
        alignItems: 'center',

    }
});
