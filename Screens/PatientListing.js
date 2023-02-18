import React from 'react'
import { StyleSheet, Text, View, ScrollView, FlatList, RefreshControl, ActivityIndicator, TouchableOpacity, ImageBackground } from 'react-native'
// import { } from 'react-native-paper';
import EmptyList from '../Components/EmptyList';
import Colors from '../Constants/Colors';
import { getProportionalFontSize, firstLetterFromString, calculate_age, getAgeByPersonalNo } from '../Services/CommonMethods';
import { useSelector, useDispatch } from 'react-redux';
import Constants from '../Constants/Constants';
import APIService from '../Services/APIService';
import Alert from '../Components/Alert';
import ProgressLoader from '../Components/ProgressLoader';
import BaseContainer from '../Components/BaseContainer'
import CommonCRUDCard from '../Components/CommonCRUDCard';
import Assets from '../Assets/Assets';
import FooterCompForFlatlist from '../Components/FooterCompForFlatlist';
import Icon from 'react-native-vector-icons/Ionicons';
import IPListCard from '../Components/IPListCard';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'; //timeline
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'; //tasks
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'; //notebook
import PatientListCard from '../Components/PatientListCard';
import Can from "../can/Can";
import moment from 'moment';
import { Portal, Provider, Modal, FAB, Badge } from 'react-native-paper';
// import FilterModalBranchComp from './FilterModalBranchComp';
import FilterModalPatientComp from './FilterModalPatientComp';
import ListLoader from '../Components/ListLoader';
import IpCardPatient from '../Components/PatientCard';


export default PatientListing = (props) => {

    // REDUX hooks
    const dispatch = useDispatch();
    const UserLogin = useSelector(state => state.User.UserLogin);
    const permissions = UserLogin?.permissions ?? {}

    // const [param, setParam] = React.useState({ "name": "", "email": "", "contact_number ": "", "personal_number": "", "status": null, "category": null, "ip": null, "patient": "", "branch": null, "start_date": null, "end_date": null, "refreshAPI": false });
    const [param, setParam] = React.useState({ "name": "", "email": "", "contact_number ": "", "personal_number": "", "patientType_id": "", "patient": "", "refreshAPI": false });
    const [isModalVisible, setIsModalVisible] = React.useState(false);
    const labels = useSelector(state => state.Labels);
    const messages = useSelector(state => state.Labels);

    // useState Hooks
    const [patientList, setPatientList] = React.useState([]);
    const [isLoading, setIsLoading] = React.useState(true);
    const [isRefreshing, setIsRefreshing] = React.useState(false);
    const [paginationLoading, setPaginationLoading] = React.useState(false);
    const [page, setPage] = React.useState(0);
    const [openCardOptions, setOpenCardOptions] = React.useState()

    // useEffect hooks
    React.useEffect(() => {
        patientListingAPI()
        // console.log("hey")
    }, [param])

    React.useEffect(() => {
        const unsubscribe = props.navigation.addListener('focus', () => {
            // The screen is focused
            // Call any action
            // console.log('Focus___________________________________________')
            patientListingAPI(null, true)
        });
        // Return the function to unsubscribe from the event so it gets removed on unmount
        return unsubscribe;
    }, [props.navigation]);

    // API methods
    const patientListingAPI = async (page, refresh) => {
        if (refresh)
            setIsRefreshing(true)
        else if (!page)
            setIsLoading(true);
        else
            setPaginationLoading(true)
        let params = {
            "perPage": Constants.perPage,
            "page": page ?? 1,
            "user_type_id": "6",
            "patient": param?.patient?.id ?? "",
            "name": param?.name ?? "",
            "email": param?.email ?? "",
            "contact_number": param?.contact_number ?? "",
            "patient_type_id": param?.patientType_id?.id ?? "",
            "personal_number": param?.personal_number ?? "",
            // "patientType_id": param?.patientType_id ?? "",
            // ...param
        }
        // console.log('params77777777777777777777777777', param)
        let url = Constants.apiEndPoints.userList;
        // console.log("url", url);
        let response = await APIService.postData(url, params, UserLogin.access_token, null, "patientListingAPI");

        if (!response.errorMsg) {
            // console.log('response-------------------+++++++++++++', JSON.stringify(response))
            if (!page) {
                setPage(1);
                setPatientList(response.data.payload.data);
                setIsLoading(false);
                if (refresh)
                    setIsRefreshing(false);
            }
            else {
                let tempPatientList = [...patientList];
                tempPatientList = tempPatientList.concat(response.data.payload.data);
                setPage(page);
                setPatientList([...tempPatientList]);
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

    const deletePatientAPI = async (item) => {
        setIsLoading(true);
        let url = Constants.apiEndPoints.userView + "/" + item.id;
        let response = await APIService.deleteData(url, UserLogin.access_token, null, "deletePatientAPI");

        if (!response.errorMsg) {
            Alert.showToast(messages.message_delete_success)
            await patientListingAPI(null, true)
            setIsLoading(false);
        }
        else {
            setIsLoading(false);
            Alert.showAlert(Constants.danger, response.errorMsg)
        }
    }

    // calculate_age(item?.personal_number?.slice(0, 4))
    // const flatListRenderItem = ({ item, index }) => {
    //     return (
    //         <PatientListCard />
    //     )
    // }

    const flatListRenderItem = ({ item, index, }) => {
        let labelText = firstLetterFromString(item.name)
        let sub_title = getAgeByPersonalNo(item?.personal_number);

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
                    Can(Constants.permissionsKey.patientsRead, permissions) ?

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
                showDeleteIcon={Can(Constants.permissionsKey.patientsDelete, permissions)}
                showEditIcon={Can(Constants.permissionsKey.patientsEdit, permissions)}
                subTitle={sub_title ?? false}
                onPressEdit={() => {
                    props.navigation.navigate("AddPatient", { patientId: item.id })
                }}
                onPressDelete={() => {
                    Alert.showDoubleAlert(Constants.warning, messages.message_delete_confirmation, () => { deletePatientAPI(item) })
                }}
            >
            </PatientAndEmployeeCard>
        )


    }

    const onRequestClose = () => {
        // console.log('onRequestClose called')
        // setCategoryItem(null);
        setIsModalVisible(false);
    }
    if (param.refreshAPI) {
        // console.log("param===============================", param)
        setParam({ ...param, refreshAPI: false })
        branchListingAPI()
    }
    const openModel = () => {
        // setModelView(view)
        // console.log("rowData", rowData)
        setIsModalVisible(true);
        // settempdata(rowData)
        // console.error("isModalVisible", isModalVisible)
    }


    // render
    // console.log('UserLogin id=======', UserLogin?.user_type_id == 2 ? 1 : 2)
    // console.log('patientList', JSON.stringify(patientList))

    return (

        <BaseContainer
            BaseContainer
            onPressLeftIcon={() => { props.navigation.pop() }}
            leftIcon="arrow-back"
            rightIcon="filter-list"
            // leftIconSize={32}
            onPressRightIcon={() => openModel()}
            title={labels.patient}
            leftIconColor={Colors.white}
        >
            {
                isLoading ? (
                    <ListLoader />
                ) : (

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
                                <FilterModalPatientComp
                                    labels={labels}
                                    onRequestClose={onRequestClose}
                                    // UserLogin={UserLogin}
                                    setParam={setParam}
                                    param={param}

                                />
                                {/* <Filtermodel */}
                            </Modal>
                        </Portal>

                        <FlatList
                            ListEmptyComponent={<EmptyList />}
                            data={patientList}
                            renderItem={flatListRenderItem}
                            contentContainerStyle={{ borderWidth: 0, paddingVertical: Constants.globalPaddingVetical, paddingHorizontal: Constants.globalPaddingHorizontal }}
                            keyExtractor={item => item.id}
                            onEndReached={() => { patientListingAPI(page + 1) }}
                            onEndReachedThreshold={0.1}
                            refreshControl={
                                <RefreshControl
                                    refreshing={isRefreshing}
                                    onRefresh={() => {
                                        patientListingAPI(null, true)
                                    }}
                                />
                            }
                            ListFooterComponent={() => <FooterCompForFlatlist paginationLoading={paginationLoading} />}
                        />

                        {/* FLOATING ADD BUTTON */}
                        {Can(Constants.permissionsKey.patientsAdd, permissions)
                            ?
                            <FAB style={styles.fab}
                                color={Colors.white}
                                icon="plus"
                                onPress={() => { props.navigation.navigate('AddPatient'); }}
                            />
                            : null}
                    </View>
                )
            }

        </BaseContainer>
    )
}

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
        width: "15%",
        borderWidth: 1,
        borderColor: Colors.white,
        marginVertical: 7,
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
        fontSize: getProportionalFontSize(14),
        // color: Colors.black,
        marginLeft: 3, textAlign: "center", width: "40%",
        // marginVertical: 20,
        color: Colors.white

    },
    mainView: {
        flex: 1
    },
    countView: {
        // flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 10,
        paddingHorizontal: 5,
        // marginVertical: 20,
        paddingLeft: 13.5
    },
})
