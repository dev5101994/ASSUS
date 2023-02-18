import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    FlatList,
    RefreshControl,
    ImageBackground
} from 'react-native';
import { FAB } from 'react-native-paper';
import EmptyList from '../Components/EmptyList';
import Colors from '../Constants/Colors';
import { getProportionalFontSize, firstLetterFromString, getAgeByPersonalNo } from '../Services/CommonMethods';
import { useSelector, useDispatch } from 'react-redux';
import Constants from '../Constants/Constants';
import APIService from '../Services/APIService';
import Alert from '../Components/Alert';
import ProgressLoader from '../Components/ProgressLoader';
import BaseContainer from '../Components/BaseContainer';
import CommonCRUDCard from '../Components/CommonCRUDCard';
import Assets from '../Assets/Assets';
import FooterCompForFlatlist from '../Components/FooterCompForFlatlist';
import Can from '../can/Can';
import IPListCard from '../Components/IPListCard';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'; //timeline
import moment from 'moment';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'; //tasks
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'; //notebook
import FilterModalPatientComp from './FilterModalPatientComp';
import { Portal, Provider, Modal } from 'react-native-paper';

import FilterModalEmployeeComp from './FilterModalEmployeeComp';
import IpCardPatient from '../Components/PatientCard';
import PatientAndEmployeeCard from '../Components/PatientAndEmployeeCard'


const EmployeeListing = props => {
    // REDUX hooks
    const dispatch = useDispatch();
    const isInternetActive = useSelector(state => state.IsInternetActive);
    const UserLogin = useSelector(state => state.User.UserLogin);
    const permissions = UserLogin?.permissions ?? {};
    const labels = useSelector(state => state.Labels);
    // const messages = useSelector(state => state.Labels.messages);
    const [param, setParam] = React.useState({ "name": "", "email": "", "contact_number": "", "personal_number": "", "status": null, "category": null, "ip": null, "patient": null, "branch": null, "start_date": null, "end_date": null, "refreshAPI": false });
    const [isModalVisible, setIsModalVisible] = React.useState(false);

    // useState Hooks
    const [employeeList, setEmployeeList] = React.useState([]);
    const [isLoading, setIsLoading] = React.useState(true);
    const [isRefreshing, setIsRefreshing] = React.useState(false);
    const [paginationLoading, setPaginationLoading] = React.useState(false);
    const [openCardOptions, setOpenCardOptions] = React.useState()
    const [page, setPage] = React.useState(0);

    // useEffect hooks
    React.useEffect(() => {
        employeeListingAPI();
    }, [param]);

    React.useEffect(() => {
        const unsubscribe = props.navigation.addListener('focus', () => {
            // The screen is focused
            // Call any action
            // console.log('Focus___________________________________________');
            employeeListingAPI(null, true);
        });
        // Return the function to unsubscribe from the event so it gets removed on unmount
        return unsubscribe;
    }, [props.navigation]);

    // API methods
    const employeeListingAPI = async (page, refresh) => {
        if (refresh) setIsRefreshing(true);
        else if (!page) setIsLoading(true);
        else setPaginationLoading(true);
        let params = {
            perPage: Constants.perPage,
            page: page ?? 1,
            user_type_id: '3',
            "name": param?.name ?? "",
            "email": param?.email ?? "",
            "contact_number": param?.contact_number ?? "",
            "personal_number": param?.personal_number ?? "",
            // ...param
        };
        // console.log('params', params)
        let url = Constants.apiEndPoints.userList;
        // console.log("url", url);
        let response = await APIService.postData(
            url,
            params,
            UserLogin.access_token,
            null,
            'employeeListingAPI',
        );

        if (!response.errorMsg) {
            // console.log('response-------------------+++++++++++++', JSON.stringify(response))
            if (!page) {
                setPage(1);
                setEmployeeList(response.data.payload.data);
                setIsLoading(false);
                if (refresh) setIsRefreshing(false);
            } else {
                let tempEmployeeList = [...employeeList];
                tempEmployeeList = tempEmployeeList.concat(response.data.payload.data);
                setPage(page);
                setEmployeeList([...tempEmployeeList]);
                setPaginationLoading(false);
            }
        } else {
            if (!page) setIsLoading(false);
            else setPaginationLoading(false);
            if (refresh) setIsRefreshing(false);
            Alert.showAlert(Constants.danger, response.errorMsg);
        }
    };

    // const deleteEmployeeAPI = async item => {
    //     setIsLoading(true);
    //     let url = Constants.apiEndPoints.userView + '/' + item.id;
    //     let response = await APIService.deleteData(url, UserLogin.access_token, null, 'deleteEmployeeAPI',);
    //     if (!response.errorMsg) {
    //         // Alert.showToast(labels.message_delete_success);
    //          employeeListingAPI(null, true);
    //         setIsLoading(false);
    //     } else {
    //         setIsLoading(false);
    //         Alert.showAlert(Constants.danger, response.errorMsg);
    //     }
    // }

    const deleteEmployeeAPI = async (item, index) => {
        setIsLoading(true);
        // console.log('item', item)
        let url = Constants.apiEndPoints.userView + '/' + item.id;
        let response = await APIService.deleteData(url, UserLogin.access_token, null, 'deleteEmployeeAPI',);

        if (!response?.errorMsg) {
            let tempEmpList = [...employeeList];
            tempEmpList.splice(index, 1)
            setEmployeeList(tempEmpList);
            Alert.showToast(labels.message_delete_success, Constants.success);
            setIsLoading(false);
        }
        else {
            setIsLoading(false);
            Alert.showAlert(Constants.danger, response?.errorMsg)
        }
    }



    const flatListRenderItem = ({ item, index, }) => {
        let labelText = firstLetterFromString(item.name)
        let sub_title = getAgeByPersonalNo(item?.personal_number)
        return (
            <PatientAndEmployeeCard
                showMenu={true}
                openCardOptions={openCardOptions}
                setOpenCardOptions={setOpenCardOptions}
                index={index}
                phoneNumber={item?.contact_number}
                email={item?.email}
                gender={item?.gender?.toLowerCase()}
                // patientPersonal_number={item.personal_number}
                patientPatient_ID={item?.custom_unique_id}
                patientBranchName={UserLogin?.user_type_id == 2 ? item?.branch?.name : null}
                // patientBranchName={item?.branch?.name}
                onPressCard={
                    Can(Constants.permissionsKey.employeesRead, permissions) ?
                        () => {
                            // console.log('item.user_type_id', item.user_type_id)
                            // return
                            props.navigation.navigate("CommonUserProfile", { itemId: item.id, url: Constants.apiEndPoints.userView, user_type_id: item.user_type_id })
                        }
                        : () => { }
                }
                // gender={item.gender.toLowerCase()}
                title={item.name}
                counttimeline={item.assignActivityCount ?? 0}
                counttasks={item.assignTaskCount ?? 0}
                countnotebook={item.ipCount ?? 0}

                unique_id={item.unique_id}
                labelText={labelText}
                showIcons={true}
                showSecretIcon={item?.is_secret == 1 ? true : false}
                showDeleteIcon={Can(Constants.permissionsKey.employeesDelete, permissions)}
                showEditIcon={Can(Constants.permissionsKey.employeesEdit, permissions)}
                subTitle={sub_title ?? false}
                onPressEdit={() => {
                    props.navigation.navigate("AddEmployee", { employeeId: item.id })
                }}
                onPressDelete={() => {
                    Alert.showDoubleAlert(Constants.warning, labels.message_delete_confirmation, () => { deleteEmployeeAPI(item, index) })
                }}
                showAssignWork={Can(Constants.permissionsKey.employeesEdit, permissions)}
                onPressAssignWork={() => {
                    props.navigation.navigate("AssignWorkEmployee", { employeeId: item.id, employeeWorkId: item.assigned_work?.id, })
                }}
            >
            </PatientAndEmployeeCard>

        )
    }
    const onRequestClose = () => {
        setIsModalVisible(false);
    }
    if (param.refreshAPI) {
        setParam({ ...param, refreshAPI: false })
        branchListingAPI()
    }
    const openModel = () => {
        setIsModalVisible(true);
    }


    return (
        isLoading
            ? <ProgressLoader />
            : <BaseContainer
                onPressLeftIcon={() => { props.navigation.pop() }}
                leftIcon="arrow-back"
                rightIcon="filter-list"
                onPressRightIcon={() => openModel()}
                // leftIconSize={32}
                title={labels.employees}
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
                            <FilterModalEmployeeComp
                                labels={labels}
                                onRequestClose={onRequestClose}
                                // // UserLogin={UserLogin}
                                setParam={setParam}
                                param={param}
                            />
                            {/* <Filtermodel */}
                        </Modal>
                    </Portal>
                    {/* FLOATING ADD BUTTON GROUP*/}
                </View>
                {/* </ImageBackground> */}

                <FlatList
                    ListEmptyComponent={<EmptyList />}
                    data={employeeList}
                    renderItem={flatListRenderItem}
                    contentContainerStyle={{ borderWidth: 0, paddingVertical: Constants.globalPaddingVetical, paddingHorizontal: Constants.globalPaddingHorizontal }}
                    //style={{ paddingHorizontal: Constants.globalPaddingHorizontal }}
                    keyExtractor={item => item.id}
                    onEndReached={() => { employeeListingAPI(page + 1) }}
                    onEndReachedThreshold={0.1}
                    refreshControl={
                        <RefreshControl
                            refreshing={isRefreshing}
                            onRefresh={() => {
                                employeeListingAPI(null, true)
                            }}
                        />
                    }
                    ListFooterComponent={() => <FooterCompForFlatlist paginationLoading={paginationLoading} />}
                />
                {/* FLOATING ADD BUTTON */}
                {
                    Can(Constants.permissionsKey.employeesAdd, permissions)
                        ? (
                            <FAB
                                style={styles.fab}
                                color={Colors.white}
                                icon="plus"
                                onPress={() => { props.navigation.navigate('AddEmployee'); }}
                            />
                        ) : null}
            </BaseContainer>
    )
}

export default EmployeeListing

const styles = StyleSheet.create({
    fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        backgroundColor: Colors.primary,
        bottom: 0,
    },

    badgeContainer: {
        backgroundColor: Colors.primary,
        borderRadius: 25,
        flexDirection: "row",
        alignItems: "center",
        width: "17%",
        borderWidth: 1,
        borderColor: Colors.white,
        marginVertical: 7,
        // paddingTop: 20,


        // paddingHorizontal: getProportionalFontSize(-110),
    },

    badge: {
        backgroundColor: Colors.white,
        width: 20,
        height: 20,
        borderRadius: 20,
        justifyContent: "center",
        alignItems: "center",

    },

    badgeText: {
        fontFamily: Assets.fonts.semiBold,
        fontSize: getProportionalFontSize(11),
        // color: Colors.black,
        marginLeft: 3,
        textAlign: "center", width: "40%",
        // marginVertical: 20,
        color: Colors.white

    },

    countView: {
        // flexDirection: "row",
        justifyContent: "space-between",
        // marginBottom: 15.59,
        paddingHorizontal: 5,
        // marginVertical: 20,
        // paddingBottom: 110,
        paddingLeft: 13.5,
        // borderWidth: 2,
        marginBottom: 15.59,
    },
    countVieww: {
        // paddingTop: 35.50,
        // paddingBottom: -200
        marginBottom: 0
    },


})