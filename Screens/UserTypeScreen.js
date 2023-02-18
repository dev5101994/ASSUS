import React, { useEffect, useState } from 'react';
import {
    StyleSheet,
    Text, View, SafeAreaView, Image, TouchableOpacity, ScrollView, FlatList,
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
import AddUserTypeModal from '../Components/AddUserTypeModal'
import { FAB, Modal, Portal, } from 'react-native-paper';
import Alert from '../Components/Alert';
import EmptyList from '../Components/EmptyList'
import CommonCRUDCard from '../Components/CommonCRUDCard';

export default UserTypeScreen = (props) => {

    // useState hooks
    const [userTypeList, setUserTypeList] = React.useState([]);
    const [isModalVisible, setIsModalVisible] = React.useState(false);
    const [userTypeItem, setUserTypeItem] = React.useState(null);
    const [isLoading, setIsLoading] = React.useState(true);

    // REDUX hooks
    const isInternetActive = useSelector(state => state.IsInternetActive);
    const UserLogin = useSelector(state => state.User.UserLogin);
    const labels = useSelector(state => state.Labels);
    const user_type_status = useSelector(state => state.Labels);
    const user_type_status_color = Colors.active_inactive_status_color;

    // useEffect hooks
    React.useEffect(() => {
        userTypeAPI()
    }, [])

    // Helper Methods
    const getUserTypeCard = ({ item, index }) => {
        let labelText = firstLetterFromString(item.name)
        return (
            <CommonCRUDCard
                title={item.name}
                //showIcons={false}
                labelText={labelText}
                //second_title={labels.status}
                //second_title_value={company_type_status[Constants.active_inactive_status_keys[item.status]]}
                //second_title_value_style={{ color: company_type_status_color[item.status] }}
                onPressEdit={() => {

                }}
                onPressDelete={() => {

                }}
            />
        )
    }

    // API methods
    const userTypeAPI = async () => {
        setIsLoading(true);
        let url = Constants.apiEndPoints.userTypeList;
        let response = await APIService.getData(url, UserLogin.access_token);
        if (!response.errorMsg) {
            setUserTypeList(response.data.payload);
            setIsLoading(false);
        }
        else {
            setIsLoading(false);
            Alert.showAlert(Constants.danger, response.errorMsg)
        }
    }

    const deleteUserTypeAPI = async (item, index) => {
        setIsLoading(true);
        let params = {
            id: item.id
        }
        // console.log('item', item)
        // console.log('params', params)
        let url = Constants.apiEndPoints.deleteUserType;
        let response = await APIService.postData(url, params, UserLogin.access_token, null, "deleteUserTypeAPI");
        if (!response.errorMsg) {
            let tempUserTypeList = [...userTypeList];
            tempUserTypeList.splice(index, 1)
            setUserTypeList(tempUserTypeList);
            setIsLoading(false);
        }
        else {
            setIsLoading(false);
            Alert.showAlert(Constants.danger, response.errorMsg);
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
                title={labels["user-type"]}
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
                            onRequestClose={() => {
                                // console.log('onRequestClose called')
                                setUserTypeItem(null);
                                setIsModalVisible(false);
                            }}

                        >
                            <AddUserTypeModal
                                userTypeItem={userTypeItem}
                                UserLogin={UserLogin}
                                isInternetActive={isInternetActive}
                                labels={labels}
                                refreshAPI={userTypeAPI}
                                onRequestClose={() => {
                                    setUserTypeItem(null);
                                    setIsModalVisible(false);
                                }}
                            />
                        </Modal>
                    </Portal>

                    <FlatList
                        style={{ width: '100%', paddingHorizontal: 16, }}
                        data={userTypeList}
                        ListEmptyComponent={EmptyList}
                        showsVerticalScrollIndicator={false}
                        keyExtractor={(item, index) => index}
                        renderItem={getUserTypeCard}
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
    fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        backgroundColor: Colors.primary,
        bottom: 0,
    },
});