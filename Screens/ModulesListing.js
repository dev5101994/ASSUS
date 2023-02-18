import React, { useState } from 'react'
import { StyleSheet, Text, View, ScrollView, FlatList, RefreshControl, TouchableOpacity } from 'react-native'
import { FAB } from 'react-native-paper';
import EmptyList from '../Components/EmptyList';
import Colors from '../Constants/Colors';
import { getProportionalFontSize } from '../Services/CommonMethods';
import { useSelector, useDispatch } from 'react-redux';
import APIService from '../Services/APIService';
import Alert from '../Components/Alert';
import Constants from '../Constants/Constants';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Modal, Portal, } from 'react-native-paper';
import ModalForModules from '../Components/ModalForModules';
// import ProgressLoader from '../Components/ProgressLoader';
import ModuleCard from './ModuleCard'



const ModulesListing = (props) => {
    const [modulesList, setModulesList] = useState([]);
    // console.log("hey mukesh------", modulesList)
    const [modulesItem, setModulesItem] = useState(null)
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [page, setPage] = useState(0);
    const [paginationLoading, setPaginationLoading] = React.useState(false);
    const [isModalVisible, setIsModalVisible] = React.useState(false);
    const [viewInactive, setViewInactive] = React.useState(false)
    // console.log("viewInactive", viewInactive)
    // REDUX hooks
    const dispatch = useDispatch();
    const isInternetActive = useSelector(state => state.IsInternetActive);
    // const UserLogin = useSelector(state => state.UserLogin);
    const UserLogin = useSelector(state => state.User.UserLogin);
    const labels = useSelector(state => state.Labels);
    const messages = useSelector(state => state.Labels);
    const module_status = labels;
    const module_status_color = Colors.active_inactive_status_color;

    // useEffect hooks
    React.useEffect(() => {
        modulesListAPI()
    }, [])

    // API methods
    const modulesListAPI = async (page, refresh) => {
        if (refresh)
            setIsRefreshing(true)
        else if (!page)
            setIsLoading(true);
        else
            setPaginationLoading(true)
        let params = {
            "perPage": Constants.perPage,
            "page": page ?? 1,
            "status": viewInactive ? null : 1

        }
        let url = Constants.apiEndPoints.moduleList;
        // console.log('params=========>>>>>', JSON.stringify(params))
        let response = await APIService.postData(url, params, UserLogin.access_token, null, "modulesListingAPI");
        if (!response.errorMsg) {

            //console.log("response.data.payload", response.data.payload.data)
            //setCompanyList(response.data?.payload?.data);
            //setIsLoading(false);

            if (!page) {
                setModulesList(response.data.payload.data);
                setIsLoading(false);
                if (refresh)
                    setIsRefreshing(false);
                setPage(1);
            }
            else {
                let tempModulesList = [...modulesList];
                tempModulesList = tempModulesList.concat(response.data.payload.data);
                setPage(page);
                setModulesList([...tempModulesList]);
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

    const deleteModuleAPI = async (item, index) => {
        setIsLoading(true);
        // console.log('item', item)
        let url = Constants.apiEndPoints.addmodule + "/" + item.id;
        let response = await APIService.deleteData(url, UserLogin.access_token, null, "deleteModuleAPI");
        if (!response.errorMsg) {
            let tempmodulesList = [...modulesList];
            tempmodulesList.splice(index, 1)
            setModulesList(tempmodulesList);
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
        setModulesItem(null);
        setIsModalVisible(false);
    }
    // console.log("labels.status", labels.status)

    // Helper methods
    const flatListRenderItem = ({ item, index }) => {
        return (
            // <CommonCRUDCard
            <ModuleCard
                title={item.name}
                // showIcons={true}
                // second_title={labels.status}
                second_title_value={module_status[Constants.active_inactive_status_keys[item.status]]}
                second_title_value_style={{ color: module_status_color[item.status] }}
                onPressEdit={() => {
                    setModulesItem(item);
                    setIsModalVisible(true);
                }}
                onPressDelete={() => {
                    Alert.showDoubleAlert(Constants.warning, messages.message_delete_confirmation, () => { deleteModuleAPI(item, index) })
                }}
            />
        )
    }

    React.useEffect(() => {
        modulesListAPI()
    }, [viewInactive])

    // renderview
    if (isLoading)
        return <ProgressLoader />
    return (
        <BaseContainer
            onPressLeftIcon={() => { props.navigation.pop() }}
            leftIcon="arrow-back"
            leftIconSize={24}
            title={labels.Modules}
            leftIconColor={Colors.primary}
        >
            <View style={{ ...styles.mainView, paddingTop: 10 }}>
                {/* <TouchableOpacity
                    style={styles.view_inactive_modules}
                    onPress={() => {
                        setViewInactive(!viewInactive)

                        // refreshAPI()
                    }}
                >
                    {/* <Text style={{ ...styles.view_inactive_modules_text, color: !viewInactive ? Colors.lightGray : Colors.lightPrimary }}>{!viewInactive ? labels.view : labels.hide} {labels.inactive_modules}</Text>
                    <Ionicons name={!viewInactive ? 'eye' : "eye-off"} color={!viewInactive ? Colors.lightGray : Colors.lightPrimary} size={18} /> */}
                {/* </TouchableOpacity> */}

                {/* MODAL */}
                <Portal>
                    <Modal
                        animationType="slide"
                        transparent={true}
                        style={{ justifyContent: "center", alignItems: 'center' }}
                        visible={isModalVisible}
                        onRequestClose={onRequestClose}
                    >
                        <ModalForModules
                            modulesItem={modulesItem}
                            UserLogin={UserLogin}
                            isInternetActive={isInternetActive}
                            labels={labels}
                            refreshAPI={modulesListAPI}
                            onRequestClose={onRequestClose}
                        />
                    </Modal>
                </Portal>
                {/* module Listing  */}
                <FlatList
                    ListEmptyComponent={<EmptyList />}
                    data={modulesList}
                    renderItem={flatListRenderItem}
                    keyExtractor={item => item.id}
                    contentContainerStyle={{ flex: 1, borderWidth: 0, paddingHorizontal: Constants.globalPaddingHorizontal }}
                    showsVerticalScrollIndicator={false}
                    onEndReached={() => { modulesListAPI(page + 1) }}
                    onEndReachedThreshold={0.1}
                    refreshControl={
                        <RefreshControl
                            refreshing={isRefreshing}
                            onRefresh={() => {
                                modulesListAPI(null, true)
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
    )
}

export default ModulesListing

const styles = StyleSheet.create({
    mainView: {
        flex: 1,
        //paddingHorizontal: 24,
        backgroundColor: Colors.backgroundColor,
        paddingBottom: 20,
    },
    view_inactive_modules: {
        flexDirection: "row",
        justifyContent: "flex-end",
        alignItems: "center",
        marginHorizontal: 30,
        marginTop: Constants.formFieldTopMargin
        // position: "absolute"
    },
    view_inactive_modules_text: {
        fontFamily: Assets.fonts.boldItalic,
        fontSize: 12,
        // color: Colors.lightGray,
        marginRight: 10
    },
    fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        backgroundColor: Colors.primary,
        bottom: 0,
    },

    moduleTypeCard: {
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
        backgroundColor: 'white',
        borderRadius: 15
    },
    moduleNameView: {
        width: '80%'
    },
    moduleNameText: {
        fontFamily: Assets.fonts.bold,
        fontSize: getProportionalFontSize(15),
    },
    statusMainView: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    statusTitle: {
        fontFamily: Assets.fonts.regular,
        fontSize: getProportionalFontSize(12)
    },
    statusValue: {
        fontFamily: Assets.fonts.boldItalic,
        fontSize: getProportionalFontSize(13)
    },
    editDeleteIconView: {
        flexDirection: 'row',
        alignItems: 'center',

    }
})
