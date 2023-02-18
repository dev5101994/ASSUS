import React, { useEffect, useState } from 'react';
import {
    StyleSheet,
    Text, View, SafeAreaView, Image, TouchableOpacity, ScrollView, FlatList, RefreshControl
} from 'react-native';
import Colors from '../Constants/Colors';
import Assets from '../Assets/Assets'
import { firstLetterFromString, getProportionalFontSize } from '../Services/CommonMethods';
import InputValidation from '../Components/InputValidation';
import APIService from '../Services/APIService'
import Constants from '../Constants/Constants'
import ProgressLoader from '../Components/ProgressLoader'
import { useSelector, useDispatch } from 'react-redux'
import Icon from 'react-native-vector-icons/MaterialIcons';
import BaseContainer from '../Components/BaseContainer';
import AddCompanyTypeModal from '../Components/AddCompanyTypeModal'
import { FAB, Modal, Portal, } from 'react-native-paper';
import Alert from '../Components/Alert';
import EmptyList from '../Components/EmptyList';
import CustomButton from '../Components/CustomButton';
import CommonCRUDCard from '../Components/CommonCRUDCard';

export default CompanyTypeScreen = (props) => {

    // useState hooks
    const [companyTypeList, setCompanyTypeList] = React.useState([]);
    const [isModalVisible, setIsModalVisible] = React.useState(false);
    const [companyTypeItem, setCompanyTypeItem] = React.useState(null);
    const [isLoading, setIsLoading] = React.useState(true);
    const [isRefreshing, setIsRefreshing] = React.useState(false);
    const [paginationLoading, setPaginationLoading] = React.useState(false);
    const [page, setPage] = React.useState(0);

    // REDUX hooks
    const isInternetActive = useSelector(state => state.IsInternetActive);
    const UserLogin = useSelector(state => state.User.UserLogin);
    const labels = useSelector(state => state.Labels);
    const messages = useSelector(state => state.Labels);
    const company_type_status = useSelector(state => state.Labels);

    const company_type_status_color = Colors.active_inactive_status_color;
    // useEffect hooks
    React.useEffect(() => {
        companyTypeAPI()
    }, [])

    // Helper Methods
    const getCompanyTypeCard = ({ item, index }) => {
        let labelText = firstLetterFromString(item.name)
        return (
            <CommonCRUDCard
                title={item.name}
                //showIcons={false}
                labelText={labelText}
                second_title={labels["status"]}
                second_title_value={company_type_status[Constants.active_inactive_status_keys[item.status]]}
                second_title_value_style={{ color: company_type_status_color[item.status] }}
                onPressEdit={() => {
                    setCompanyTypeItem(item);
                    setIsModalVisible(true);
                }}
                onPressDelete={() => {
                    Alert.showDoubleAlert(Constants.warning, messages.message_delete_confirmation, () => { deleteCompanyTypeAPI(item, index) })
                }}
            />
        )
    }

    const onRequestClose = () => {
        // console.log('onRequestClose called')
        setCompanyTypeItem(null);
        setIsModalVisible(false);
    }
    const renderFooter = () => {
        return (
            // Load More button
            <CustomButton
                onPress={companyTypeAPI}
                isLoading={paginationLoading}
                title={labels.load_more}
                style={styles.loadMoreButton} />
        );
    };

    // API methods
    const companyTypeAPI = async (page, refresh) => {
        if (refresh)
            setIsRefreshing(true)
        else if (!page)
            setIsLoading(true);
        else
            setPaginationLoading(true)

        let params = {
            "perPage": Constants.perPage,
            "page": page ?? 1,
            // "status": "0"
        }

        // console.log('params', params)

        let url = Constants.apiEndPoints.companyTypeList;
        let response = await APIService.postData(url, params, UserLogin.access_token, null, "companyTypeAPI");
        if (!response.errorMsg) {
            if (!page) {
                setCompanyTypeList(response.data.payload.data);
                setIsLoading(false);
                if (refresh)
                    setIsRefreshing(false);
                setPage(1);
            }
            else {
                let tempCompanyTypeList = [...companyTypeList];
                tempCompanyTypeList = tempCompanyTypeList.concat(response.data.payload.data);
                setPage(page);
                setCompanyTypeList([...tempCompanyTypeList]);
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

    const deleteCompanyTypeAPI = async (item, index) => {
        setIsLoading(true);

        let url = Constants.apiEndPoints.companyType + "/" + item.id;
        let response = await APIService.deleteData(url, UserLogin.access_token, null, "deleteCompanyTypeAPI");
        if (!response.errorMsg) {
            let tempCompanyTypeList = [...companyTypeList];
            tempCompanyTypeList.splice(index, 1)
            setCompanyTypeList([...tempCompanyTypeList]);
            Alert.showToast(messages.message_delete_success)
            setIsLoading(false);
        }
        else {
            setIsLoading(false);
            Alert.showAlert(Constants.danger, response.errorMsg)
        }
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
                title={labels["company-types"]}
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
                            <AddCompanyTypeModal
                                companyTypeItem={companyTypeItem}
                                UserLogin={UserLogin}
                                isInternetActive={isInternetActive}
                                labels={labels}
                                refreshAPI={companyTypeAPI}
                                onRequestClose={onRequestClose}
                            />
                        </Modal>
                    </Portal>

                    {/* company type listing */}
                    <FlatList
                        style={{ width: '100%', paddingHorizontal: 16 }}
                        data={companyTypeList}
                        ListEmptyComponent={EmptyList}
                        showsVerticalScrollIndicator={false}
                        keyExtractor={(item, index) => index}
                        renderItem={getCompanyTypeCard}
                        onEndReached={() => { companyTypeAPI(page + 1) }}
                        onEndReachedThreshold={0.1}
                        refreshControl={
                            <RefreshControl
                                refreshing={isRefreshing}
                                onRefresh={() => {
                                    companyTypeAPI(null, true)
                                }}
                            />
                        }
                    // ListFooterComponent={renderFooter}
                    />

                    {/* FLOATING ADD BUTTON */}
                    <FAB
                        style={styles.fab}
                        color={Colors.white}
                        icon="plus"
                        onPress={() => { setIsModalVisible(true) }}
                    />

                </View>
            </BaseContainer>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    scrollView: { flex: 1, backgroundColor: Colors.backgroundColor },
    mainView: {
        flex: 1,
        //paddingHorizontal: 24,
        backgroundColor: Colors.backgroundColor,
        paddingBottom: 20
    },
    headingText: {
        fontSize: getProportionalFontSize(24),
        // marginTop: 10,
        color: Colors.primary,
        fontFamily: Assets.fonts.bold
    },
    fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        backgroundColor: Colors.primary,
        bottom: 0,
    },
    loadMoreButton: { width: "40%", alignSelf: "center", marginTop: 20 },
    userTypeCard: {
        width: "100%",
        minHeight: 80,
        paddingHorizontal: 16,
        paddingVertical: 5,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        shadowOffset: { width: 3, height: 3, },
        shadowOpacity: 10,
        elevation: 15,
        shadowColor: Platform.OS == "ios" ? Colors.shadowColorIosDefault : Colors.shadowColorAndroidDefault,
        shadowRadius: 10,
        marginVertical: 10,
        backgroundColor: 'white',
        borderRadius: 15
    },
    userNameView: {
        width: '80%'
    },
    userNameText: {
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

    },
});