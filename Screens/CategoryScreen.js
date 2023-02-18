import React from 'react';
import {
    StyleSheet,
    Text, View, SafeAreaView, Image, TouchableOpacity, ScrollView, FlatList, RefreshControl
} from 'react-native';
import Colors from '../Constants/Colors';
import { firstLetterFromString, getProportionalFontSize } from '../Services/CommonMethods';
import Assets from '../Assets/Assets'

import APIService from '../Services/APIService'
import Constants from '../Constants/Constants'
import ProgressLoader from '../Components/ProgressLoader'
import { useSelector, useDispatch } from 'react-redux'
import Icon from 'react-native-vector-icons/MaterialIcons';
import BaseContainer from '../Components/BaseContainer';
import CategoryModal from '../Components/CategoryModal'
import { Modal, Portal, } from 'react-native-paper';
import { FAB } from 'react-native-paper';
import Alert from '../Components/Alert';
import EmptyList from '../Components/EmptyList'
import CommonCRUDCard from '../Components/CommonCRUDCard';
import FooterCompForFlatlist from '../Components/FooterCompForFlatlist';
import Can from '../can/Can';
import ListLoader from '../Components/ListLoader';
import CategoryCard from '../Components/CategoryCard';
// import FilterModalBranchComp from './FilterModalBranchComp';
// import categoryFilter from '../Components/CategoryFilter'
import CategoryFilter from '../Components/CategoryFilter';
// D:\Accus\aceuss-mobile\ACEUSS\src\Components\categoryFilter.js



export default CategoryScreen = (props) => {
    const [param, setParam] = React.useState({ "category_type_id": "", "name": "", "status": null, "category_id": "", "categoryName": "", "refreshAPI": false });
    // console.log('----------------------ok', JSON.stringify(param));
    // useState hooks
    const [categoryList, setCategoryList] = React.useState([]);
    const [isModalVisible, setIsModalVisible] = React.useState(false);
    const [categoryItem, setCategoryItem] = React.useState(null);
    const [isLoading, setIsLoading] = React.useState(true);
    const [isRefreshing, setIsRefreshing] = React.useState(false);
    const [paginationLoading, setPaginationLoading] = React.useState(false);
    const [page, setPage] = React.useState(0);
    const [modelView, setModelView] = React.useState('');

    // REDUX hooks
    const isInternetActive = useSelector(state => state.IsInternetActive);
    const UserLogin = useSelector(state => state.User.UserLogin);
    const permissions = UserLogin?.permissions ?? {}
    const labels = useSelector(state => state.Labels);
    const messages = useSelector(state => state.Labels);
    const category_status = labels;
    const category_status_color = Colors.active_inactive_status_color;

    // useEffect hooks
    React.useEffect(() => {
        categoryListingAPI()
    }, [param])

    // Helper Methods
    const getCategoryCard = ({ item, index }) => {
        let labelText = firstLetterFromString(item.name)
        return (
            <CategoryCard
                style={{ marginTop: index == 0 ? Constants.formFieldTopMargin : 0, }}
                title={item.name}
                hideCount={true}
                showEditIcon={
                    Can(Constants.permissionsKey.categoriesEdit, permissions)
                }
                showDeleteIcon={
                    Can(Constants.permissionsKey.categoriesDelete, permissions)
                }
                second_title={labels["status"]}
                second_title_value={item?.status ? category_status?.[Constants?.active_inactive_status_keys?.[item?.status]] : false}
                second_title_value_style={{ color: item?.status ? category_status_color?.[item?.status] : Colors.primary }}
                labelText={labelText}
                onPressEdit={() => {
                    setCategoryItem(item);
                    setIsModalVisible(true);
                }}
                onPressDelete={() => {
                    Alert.showDoubleAlert(Constants?.warning, messages?.message_delete_confirmation, () => { deleteCategoryAPI(item, index) })
                }}
            />
        )
    }

    // API methods
    const categoryListingAPI = async (page, refresh) => {
        if (refresh)
            setIsRefreshing(true)
        else if (!page)
            setIsLoading(true);
        else
            setPaginationLoading(true)
        let params = {
            "perPage": Constants.perPage,
            "page": page ?? 1,

            "name": param?.categoryName ?? "",
            // "name": param?.name ?? "",
            // "category_type_id": param?.category_type_id?.id ?? "",
            "category_type_id": param?.category_id ?? "",
            // "category_type_id": categoryType?.id ?? null,
            // "status": param?.status?.id ?? "",


            // ...param
        }
        // setIsLoading(false);
        // return
        let url = Constants.apiEndPoints.categoryParentList;
        let response = await APIService.postData(url, params, UserLogin.access_token, null, "categoryListingAPI");
        if (!response.errorMsg) {
            if (!page) {
                setCategoryList(response.data.payload.data);
                setIsLoading(false);
                if (refresh)
                    setIsRefreshing(false);
                setPage(1);
            }
            else {
                let tempCategoryList = [...categoryList];
                tempCategoryList = tempCategoryList.concat(response.data.payload.data);
                setPage(page);
                setCategoryList([...tempCategoryList]);
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

    const deleteCategoryAPI = async (item, index) => {
        setIsLoading(true);
        // console.log('item', item)
        let url = Constants.apiEndPoints.addCategory + "/" + item.id;
        let response = await APIService.deleteData(url, UserLogin.access_token, null, "deleteCategoryAPI");
        if (!response.errorMsg) {
            let tempCategoryList = [...categoryList];
            tempCategoryList.splice(index, 1)
            setCategoryList(tempCategoryList);
            Alert.showToast(messages.message_delete_success)
            setIsLoading(false);
        }
        else {
            setIsLoading(false);
            Alert.showAlert(Constants.danger, response.errorMsg)
        }
    }

    const onRequestClose = () => {
        // console.log('onRequestClose called')
        setCategoryItem(null);
        setIsModalVisible(false);
    }
    if (param.refreshAPI) {
        // console.log("param===============================", param)
        setParam({ ...param, refreshAPI: false })
        branchListingAPI()
    }

    // Render view
    //  console.log('categoryList', categoryList)
    // if (isLoading)
    //     return <ProgressLoader />
    function modeVisible(view) {
        setModelView(view)
        setIsModalVisible(true)
    }
    return (
        <BaseContainer
            onPressLeftIcon={() => { props.navigation.pop() }}
            leftIcon="arrow-back"
            leftIconSize={24}
            title={labels["category"]}
            // title={labels["CategoryFilter"]}
            leftIconColor={Colors.white}
            titleStyle={styles.headingText}
            rightIcon="filter-list"
            onPressRightIcon={() => modeVisible("filter")}
        >

            {/* Main View */}
            {/* <View style={styles.mainView}> */}
            {
                isLoading
                    ? <ListLoader />
                    : (
                        <>
                            {/* MODAL */}

                            <Portal>
                                <Modal
                                    animationType="slide"
                                    transparent={true}
                                    style={{}}
                                    visible={isModalVisible}
                                    onRequestClose={onRequestClose}
                                    onDismiss={onRequestClose}
                                >
                                    {
                                        modelView == "add"
                                            ? <CategoryModal
                                                categoryItem={categoryItem}
                                                UserLogin={UserLogin}
                                                isInternetActive={isInternetActive}
                                                labels={labels}
                                                refreshAPI={categoryListingAPI}
                                                onRequestClose={onRequestClose}
                                            />
                                            : <CategoryFilter
                                                labels={labels}
                                                onRequestClose={onRequestClose}
                                                UserLogin={UserLogin}
                                                setParam={setParam}
                                                param={param}

                                            />
                                    }

                                    {/* <CategoryFilter
                                        categoryItem={categoryItem}
                                        UserLogin={UserLogin}
                                        isInternetActive={isInternetActive}
                                        labels={labels}
                                        refreshAPI={categoryListingAPI}
                                        onRequestClose={onRequestClose}
                                    /> */}
                                </Modal>
                            </Portal>

                            {/* Category listing */}
                            <FlatList
                                contentContainerStyle={{ borderWidth: 0, paddingHorizontal: 25, }}
                                data={categoryList}
                                showsVerticalScrollIndicator={false}
                                ListEmptyComponent={EmptyList}
                                keyExtractor={(item, index) => index}
                                renderItem={getCategoryCard}
                                onEndReached={() => { categoryListingAPI(page + 1) }}
                                onEndReachedThreshold={0.1}
                                refreshControl={
                                    <RefreshControl
                                        refreshing={isRefreshing}
                                        onRefresh={() => {
                                            categoryListingAPI(null, true);
                                        }}
                                    />
                                }
                                ListFooterComponent={() => <FooterCompForFlatlist paginationLoading={paginationLoading} />}
                            />

                            {/* FLOATING ADD BUTTON */}
                            {
                                Can(Constants.permissionsKey.categoriesAdd, permissions)
                                    ? <FAB
                                        style={styles.fab}
                                        color={Colors.white}
                                        icon="plus"
                                        onPress={() => { modeVisible("add") }}
                                    // onPress={() => { props.navigation.navigate('CategoryModal'); }}
                                    /> : null}
                        </>
                    )
            }
            {/* </View> */}
        </BaseContainer>
    )
}

const styles = StyleSheet.create({
    scrollView: { flex: 1, backgroundColor: Colors.backgroundColor },
    mainView: {
        flex: 1,
        backgroundColor: Colors.backgroundColor,
        paddingBottom: 20,
    },
    fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        backgroundColor: Colors.primary,
        bottom: 0,
    },
    headingText: {
        // fontSize: getProportionalFontSize(24),
        // color: Colors.primary,
        // fontFamily: Assets.fonts.bold,
    },
});