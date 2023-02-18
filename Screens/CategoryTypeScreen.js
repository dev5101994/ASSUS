import React from 'react';
import {
    StyleSheet,
    Text, View, SafeAreaView, Image, TouchableOpacity, ScrollView, FlatList, RefreshControl, Dimensions
} from 'react-native';
import Colors from '../Constants/Colors';
import Assets from '../Assets/Assets'
import { firstLetterFromString, getProportionalFontSize } from '../Services/CommonMethods';
import APIService from '../Services/APIService'
import Constants from '../Constants/Constants'
import ProgressLoader from '../Components/ProgressLoader'
import { useSelector, useDispatch } from 'react-redux'
import Icon from 'react-native-vector-icons/MaterialIcons';
import BaseContainer from '../Components/BaseContainer';
import AddCategoryTypeModal from '../Components/AddCategoryTypeModal'
import { Modal, Portal, } from 'react-native-paper';
import { FAB } from 'react-native-paper';
import EmptyList from '../Components/EmptyList';
import Alert from '../Components/Alert';
import CommonCRUDCard from '../Components/CommonCRUDCard'



export default CategoryTypeScreen = (props) => {

    // useState hooks
    const [categoryTypeList, setCategoryTypeList] = React.useState([]);
    const [isModalVisible, setIsModalVisible] = React.useState(false);
    const [categoryTypeItem, setCategoryTypeItem] = React.useState(null);
    const [isLoading, setIsLoading] = React.useState(true);
    const [isRefreshing, setIsRefreshing] = React.useState(false);
    const [paginationLoading, setPaginationLoading] = React.useState(false);
    const [page, setPage] = React.useState(0);

    // REDUX hooks
    const isInternetActive = useSelector(state => state.IsInternetActive);
    const UserLogin = useSelector(state => state.User.UserLogin);
    const labels = useSelector(state => state.Labels);
    const messages = useSelector(state => state.Labels);

    // useEffect hooks
    React.useEffect(() => {
        categoryTypeAPI()
    }, [])

    // Helper Methods
    const getCategoryTypeCard = ({ item, index }) => {
        let labelText = firstLetterFromString(item.name)
        return (
            <CommonCRUDCard
                title={item.name}
                showIcons={false}
                labelText={labelText}
                //second_title={labels.status}
                //second_title_value={category_type_status[Constants.active_inactive_status_keys[item.status]]}
                //second_title_value_style={{ color: category_type_status_color[item.status] }}
                onPressEdit={() => {
                    setCategoryTypeItem(item);
                    setIsModalVisible(true);
                }}
                onPressDelete={() => {
                    Alert.showDoubleAlert(Constants.warning, messages.message_delete_confirmation, () => { deleteCategoryTypeAPI(item, index) })
                }}
            />
        )
    }

    // API methods
    const categoryTypeAPI = async (page, refresh) => {
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
        let url = Constants.apiEndPoints.categoryTypeList;
        let response = await APIService.postData(url, params, UserLogin.access_token, null, "categoryTypeAPI");
        if (!response.errorMsg) {

            if (!page) {
                setCategoryTypeList(response.data.payload.data);
                setIsLoading(false);
                if (refresh)
                    setIsRefreshing(false);
                setPage(1);
            }
            else {
                let tempCategoryTypeList = [...categoryTypeList];
                tempCategoryTypeList = tempCategoryTypeList.concat(response.data.payload.data);
                setPage(page);
                setCategoryTypeList([...tempCategoryTypeList]);
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

    const deleteCategoryTypeAPI = async (item, index) => {
        setIsLoading(true);
        // console.log('item', item)
        let url = Constants.apiEndPoints.addCategoryType + "/" + item.id;
        let response = await APIService.deleteData(url, UserLogin.access_token, null, "deleteCategoryTypeAPI");
        if (!response.errorMsg) {
            let tempCategoryTypeList = [...categoryTypeList];
            tempCategoryTypeList.splice(index, 1)
            setCategoryTypeList(tempCategoryTypeList);
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
        setCategoryTypeItem(null);
        setIsModalVisible(false);
    }

    // Render view
    if (isLoading)
        return <ProgressLoader />

    return (
        <SafeAreaView style={styles.scrollView}>
            <BaseContainer
                onPressLeftIcon={() => { props.navigation.goBack() }}
                leftIcon="arrow-back"
                leftIconSize={24}
                title={labels["category-type"]}
                leftIconColor={Colors.primary}
            >

                {/* Main View */}
                <View style={styles.mainView}>

                    {/* MODAL */}
                    <Portal>
                        <Modal
                            animationType="slide"
                            transparent={true}
                            style={{ justifyContent: "center", alignItems: 'center' }}
                            visible={isModalVisible}
                            onRequestClose={onRequestClose}
                        >
                            <AddCategoryTypeModal
                                categoryTypeItem={categoryTypeItem}
                                UserLogin={UserLogin}
                                isInternetActive={isInternetActive}
                                labels={labels}
                                refreshAPI={categoryTypeAPI}
                                onRequestClose={onRequestClose}
                            />
                        </Modal>
                    </Portal>

                    {/* Category type listing */}
                    < FlatList
                        ListEmptyComponent={EmptyList}
                        contentContainerStyle={{ paddingHorizontal: Constants.globalPaddingHorizontal, width: '100%', }}
                        data={categoryTypeList}
                        showsVerticalScrollIndicator={false}
                        keyExtractor={(item, index) => index}
                        renderItem={getCategoryTypeCard}
                        onEndReached={() => { categoryTypeAPI(page + 1) }}
                        onEndReachedThreshold={0.1}
                        refreshControl={
                            <RefreshControl
                                refreshing={isRefreshing}
                                onRefresh={() => {
                                    categoryTypeAPI(null, true)
                                }}
                            />
                        }
                    />

                    {/* FLOATING ADD BUTTON */}
                    {/* <FAB
                        style={styles.fab}
                        color={Colors.white}
                        icon="plus"
                        onPress={() => { setIsModalVisible(true) }}
                    /> */}
                </View>
            </BaseContainer>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    scrollView: { flex: 1, backgroundColor: Colors.backgroundColor },
    mainView: {
        flex: 1,
        backgroundColor: Colors.backgroundColor,
        paddingBottom: 20,
        height: Dimensions.get('window').height
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
    categoryTypeCard: {
        width: "100%",
        minHeight: 80,
        paddingHorizontal: 12,
        paddingVertical: 5,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        shadowOffset: { width: 3, height: 3, },
        shadowOpacity: 10,
        elevation: 15,
        shadowColor: Platform.OS == "ios" ? Colors.shadowColorIosDefault : Colors.shadowColorAndroidDefault,
        shadowRadius: 10,
        marginTop: 15,
        backgroundColor: Colors.white,
        borderRadius: 15
    },
    categoryNameView: {
        width: '80%'
    },
    categoryNameText: {
        fontFamily: Assets.fonts.semiBold,
        fontSize: getProportionalFontSize(15),
    },
    statusMainView: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    statusTitle: {
        fontFamily: Assets.fonts.regular,
        fontSize: getProportionalFontSize(13)
    },
    statusValue: {
        fontFamily: Assets.fonts.semiBold,
        fontSize: getProportionalFontSize(13)
    },
    editDeleteIconView: {
        flexDirection: 'row',
        alignItems: 'center',

    }
});