import React from 'react'
import { StyleSheet, Text, View, ScrollView, FlatList, RefreshControl, ImageBackground } from 'react-native'
// import {  } from 'react-native-paper';
import EmptyList from '../Components/EmptyList';
import Colors from '../Constants/Colors';
import { firstLetterFromString, getProportionalFontSize } from '../Services/CommonMethods';
import { useSelector, useDispatch } from 'react-redux';
import Constants from '../Constants/Constants';
import APIService from '../Services/APIService';
import ProgressLoader from '../Components/ProgressLoader';
import Alert from '../Components/Alert';
import CommonCRUDCard from '../Components/CommonCRUDCard';
import FooterCompForFlatlist from '../Components/FooterCompForFlatlist';
import { Portal, Provider, Modal, FAB } from 'react-native-paper';
import FilterModalBranchComp from './FilterModalBranchComp';
import FilterModalDepartmentListing from './FilterModalDepartmentListing'
import ListLoader from '../Components/ListLoader';
import Can from '../can/Can';

const Data = [];

const DepartmentListing = (props) => {
    // REDUX hooks
    const dispatch = useDispatch();
    const isInternetActive = useSelector(state => state.IsInternetActive);
    const UserLogin = useSelector(state => state.User.UserLogin);
    const labels = useSelector(state => state.Labels);
    const messages = useSelector(state => state.Labels);
    const permissions = UserLogin?.permissions ?? {}
    const [isModalVisible, setIsModalVisible] = React.useState(false);
    const [param, setParam] = React.useState({ "perPage": "", "page": "", "status": "", "category": "", "ip": "", "patient": "", "branch": "", "start_date": "", "name": "", "refreshAPI": false });
    // console.log("param--", JSON.stringify(param))
    //use state hooks
    const [departmentList, setDepartmentList] = React.useState([]);
    const [isLoading, setIsLoading] = React.useState(true);
    const [isRefreshing, setIsRefreshing] = React.useState(false);
    const [page, setPage] = React.useState(0);
    const [paginationLoading, setPaginationLoading] = React.useState(false);


    // useEffect hooks
    React.useEffect(() => {
        getDepartmentList()
    }, [])

    React.useEffect(() => {
        const unsubscribe = props.navigation.addListener('focus', () => {
            // The screen is focused
            // Call any action
            // console.log('Focus___________________________________________')
            getDepartmentList()
        });

        // Return the function to unsubscribe from the event so it gets removed on unmount
        return unsubscribe;
    }, [props.navigation]);

    // API methods
    const getDepartmentList = async (page, refresh) => {
        if (refresh)
            setIsRefreshing(true)
        else if (!page)
            setIsLoading(true);
        else
            setPaginationLoading(true)
        let params = {
            "perPage": Constants.perPage,
            "page": page ?? 1,
            "status": '1'
        }
        let url = Constants.apiEndPoints.departmentList;
        // console.log('params=========>>>>>', JSON.stringify(params))
        let response = await APIService.postData(url, params, UserLogin.access_token, null, "departmentList");
        // console.log('response=========>>>>>', JSON.stringify(response))
        if (!response.errorMsg) {

            if (!page) {
                setDepartmentList(response.data.payload.data);
                setIsLoading(false);
                if (refresh)
                    setIsRefreshing(false);
                setPage(1);
            }
            else {
                let tempDeptList = [...departmentList];
                tempDeptList = tempDeptList.concat(response.data.payload.data);
                setPage(page);
                setDepartmentList([...tempDeptList]);
                setPaginationLoading(false);
            }
        }
        else {
            if (!page)
                setIsLoading(false)
            else
                setPaginationLoading(false)
            if (refresh)
                setIsRefreshing(false);
            Alert.showAlert(Constants.danger, response.errorMsg)
        }
    }

    const deleteDepartment = async (itemId, index) => {
        setIsLoading(true);
        // let params = {
        // }
        // console.log("itemId", itemId)
        let url = Constants.apiEndPoints.department + "/" + itemId;
        // console.log("url", url);
        let response = await APIService.deleteData(url, UserLogin.access_token, null, "deleteDepartmentAPI");
        if (!response.errorMsg) {
            // console.log("payload===", response.data.payload);
            Alert.showToast(messages.message_delete_success, Constants.success)
            departmentList.splice(index, 1)
            setIsLoading(false);
        }
        else {
            setIsLoading(false);
            Alert.showAlert(Constants.danger, response.errorMsg);
        }
    }

    const flatListRenderItem = ({ item, index }) => {
        let labelText = firstLetterFromString(item.name)
        return (
            <CommonCRUDCard
                title={item.name}
                showDeleteIcon={Can(Constants.permissionsKey.departmentsDelete, permissions)}
                showEditIcon={Can(Constants.permissionsKey.departmentsEdit, permissions)}
                labelText={labelText}
                onPressEdit={() => { props.navigation.navigate("AddDepartment", { itemId: item.id }) }}
                onPressDelete={() => {
                    Alert.showDoubleAlert(Constants.warning, messages.message_delete_confirmation, () => {
                        deleteDepartment(item.id, index);
                    })
                }}
            />
        )
    }
    const openModel = () => {
        setIsModalVisible(true);
    }
    const onRequestClose = () => {
        // console.log('onRequestClose called')
        setIsModalVisible(false);
    }

    // renderview
    // if (isLoading)
    //     return <ProgressLoader />
    return (
        <BaseContainer
            onPressLeftIcon={() => { props.navigation.pop() }}
            leftIcon="arrow-back"
            leftIconSize={24}
            title={labels["department"]}
            leftIconColor={Colors.white}
            rightIcon="filter-list"
            onPressRightIcon={() => openModel()}
            rightIconColor={Colors.primary}
        >
            {/* MODAL */}
            <Portal>
                <Modal
                    // animationType="slide"
                    // transparent={true}
                    style={{ justifyContent: "center", alignItems: 'center' }}
                    visible={isModalVisible}
                    onRequestClose={onRequestClose}
                >
                    <FilterModalDepartmentListing
                        labels={labels}
                        onRequestClose={onRequestClose}
                        UserLogin={UserLogin}
                        setParam={setParam}
                        param={param}
                        mukesh={"mukesh"}
                    />

                    {/* <Filtermodel */}
                </Modal>
            </Portal>


            {/* //FlatList */}
            {
                isLoading
                    ? <ListLoader />
                    : (
                        <>
                            <FlatList
                                ListEmptyComponent={<EmptyList />}
                                data={departmentList}
                                renderItem={flatListRenderItem}
                                keyExtractor={item => item.id}
                                contentContainerStyle={{ borderWidth: 0, paddingVertical: Constants.globalPaddingVetical, paddingHorizontal: Constants.globalPaddingHorizontal }}
                                showsVerticalScrollIndicator={false}
                                onEndReached={() => { getDepartmentList(page + 1) }}
                                onEndReachedThreshold={0.1}
                                refreshControl={
                                    <RefreshControl
                                        refreshing={isRefreshing}
                                        onRefresh={() => {
                                            getDepartmentList(null, true);
                                        }}
                                    />
                                }
                                ListFooterComponent={() => <FooterCompForFlatlist paginationLoading={paginationLoading} />}
                            />

                            {/* </ScrollView> */}
                            {/* FLOATING ADD BUTTON */}
                            {
                                Can(Constants.permissionsKey.departmentsAdd, permissions)
                                    ? <FAB
                                        style={styles.fab}
                                        color={Colors.white}
                                        icon="plus"
                                        onPress={() => { props.navigation.navigate('AddDepartment', { itemId: '' }); }}
                                    />
                                    : null
                            }
                        </>
                    )
            }




        </BaseContainer>
    )
}

export default DepartmentListing

const styles = StyleSheet.create({
    fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        backgroundColor: Colors.primary,
        bottom: 0,
    },
})
