import React, { useCallback, useState } from 'react'
import { StyleSheet, Text, View, ScrollView, FlatList, RefreshControl, TouchableOpacity } from 'react-native';
import { FAB, Portal, Modal, ActivityIndicator } from 'react-native-paper';
import EmptyList from '../Components/EmptyList';
import Colors from '../Constants/Colors';
import { firstLetterFromString, getProportionalFontSize, getActionSheetAPIDetail } from '../Services/CommonMethods';
import { useSelector, useDispatch } from 'react-redux';
import Constants from '../Constants/Constants';
import APIService from '../Services/APIService';
import ProgressLoader from '../Components/ProgressLoader';
import Alert from '../Components/Alert';
import CommonCRUDCard from '../Components/CommonCRUDCard';
import WordParagraphModal from '../Components/WordParagraphModal';
import LottieView from 'lottie-react-native';
import ListLoader from '../Components/ListLoader';
import FooterCompForFlatlist from '../Components/FooterCompForFlatlist';
import Can from '../can/Can';
import CardForKeyList from '../Components/CardForKeyList';
import ActionSheet from 'react-native-actions-sheet';
import ActionSheetComp from '../Components/ActionSheetComp';
// import CommonCRUDCard from '../CommonCRUDCard';
// import { render } from 'react-native/Libraries/Renderer/implementations/ReactNativeRenderer-prod';

const LicenseKeyList = (props) => {
    // Hooks
    const actionSheetRef = React.useRef();
    const dispatch = useDispatch();
    const isInternetActive = useSelector(state => state.IsInternetActive);
    const UserLogin = useSelector(state => state.User.UserLogin);
    const labels = useSelector(state => state.Labels);
    const messages = useSelector(state => state.Labels);
    const permissions = UserLogin?.permissions ?? {}

    //use state hooks
    const [licenseKeyList, setLicenseKeyList] = React.useState([]);
    const [isLoading, setIsLoading] = React.useState(true);
    const [isRefreshing, setIsRefreshing] = React.useState(false);
    const [company, setCompany] = React.useState();
    const [page, setPage] = React.useState(0);
    const [paginationLoading, setPaginationLoading] = React.useState(false);
    const [isModalVisible, setIsModalVisible] = React.useState(false);
    const [buttonLoader, setButtonLoader] = React.useState(false)
    const [companyAS, setCompanyAS] = React.useState(getActionSheetAPIDetail({
        url: Constants.apiEndPoints.administrationCompanies, params: { "status": "0" }, debugMsg: 'companyList', token: UserLogin.access_token, selectedData: [],
    }));
    // const [Item, setItem] = React.useState({});
    // const [mode, setMode] = React.useState("word")
    // console.log("----------------licenseKeyList", JSON.stringify(licenseKeyList))
    // useEffect hooks
    React.useEffect(() => {
        getLicenseKeyList()
    }, [])

    React.useEffect(() => {
        const unsubscribe = props.navigation.addListener('focus', () => {
            // The screen is focused
            // Call any action
            // console.log('Focus___________________________________________')
            getLicenseKeyList()
        });

        // Return the function to unsubscribe from the event so it gets removed on unmount
        return unsubscribe;
    }, [props.navigation]);

    // API methods
    const getLicenseKeyList = async (page, refresh) => {
        if (refresh)
            setIsRefreshing(true);
        else if (!page)
            setIsLoading(true);
        else
            setPaginationLoading(true)
        let params = {
            "perPage": Constants.perPage,
            "page": page ?? 1,
        }
        let url = Constants.apiEndPoints.licenceKeysList;
        // console.log('params=========>>>>>', JSON.stringify(params))
        // console.log('params=========>>>>>', url)
        let response = await APIService.postData(url, params, UserLogin.access_token, null, "licenseKeyList");
        // console.log('response=========>>>>>', JSON.stringify(response))
        if (!response.errorMsg) {
            if (!page) {
                setLicenseKeyList(response.data.payload.data);
                setIsLoading(false);
                if (refresh)
                    setIsRefreshing(false);
                setPage(1);
            }
            else {
                let tempWord = [...licenseKeyList];
                tempWord = tempWord.concat(response.data.payload.data);
                setPage(page);
                setLicenseKeyList([...tempWord]);
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

    const moduleStr = (data) => {
        let str = ''
        if (Array.isArray(data)) {
            data.map((obj, i) => {
                if (i != 0) {
                    str = str + ", "
                }
                str = str + obj?.name
            })
            return str
        }
    }

    const openSheet = () => {
        actionSheetRef.current?.setModalVisible();
    }
    const flatListRenderItem = ({ item, index }) => {
        let selected_package = item.package_details ? JSON.parse(item.package_details) : ""
        return (
            < CardForKeyList
                // onPressCard={
                //     Can(Constants.permissionsKey.personsRead, permissions)
                //         ? () => props.navigation.navigate("ImplementationPlanDetail", { itemId: item.id,  }) : () => { }
                // }
                title={item.licence_key}
                module_attached={moduleStr(item?.module)}
                package_details={selected_package?.name ?? ""}
                active_from={item.active_from}
                expire_at={item.expire_at}
                is_used={item.is_used}
                company={item?.company?.name}
                // showIcons={true}
                cardLabels={item?.is_used == 1 ? labels["used"] : labels["not-used"]}
                // showDeleteIcon={
                //     item?.is_used == 0
                //         ? Can(Constants.permissionsKey.licencesDelete, permissions)
                //         : false
                // }
                showEditIcon={
                    item?.is_used == 0
                        ? Can(Constants.permissionsKey.licencesEdit, permissions)
                        : false
                }
                showLabel={true}
                onPressEdit={() => {
                    props.navigation.navigate("AddLicenseKey", { itemId: item.id })

                }}
                openSheet={openSheet}
            // onPressDelete={() => {
            //     Alert.showDoubleAlert(Constants.warning, messages.message_delete_confirmation, () => {
            //         deleteIP(item.id, index);
            //     })
            // }}
            >
                <View>
                    {
                        item.is_used == 0
                            ? <TouchableOpacity
                                onPress={
                                    // () => actionSheetRef.current?.setModalVisible()
                                    item?.company?.licence_status == 0
                                        ? () => {
                                            Alert.showDoubleAlert(Constants.warning, messages?.["are-you-sure"], () => { assignLicenseKey(item.id) })
                                        }
                                        : () => { Alert.showToast(labels.company_has_active_license, Constants.success) }
                                }
                                style={{
                                    marginTop: 16,
                                    backgroundColor: item?.company?.licence_status == 0 ? Colors.green : Colors.lightGray,
                                    borderRadius: 20,
                                    // paddingHorizontal: 10,
                                    paddingVertical: 5,
                                    justifyContent: "center",
                                    width: "40%",
                                    alignItems: "center",
                                    minHeight: 30,
                                }}>
                                {
                                    buttonLoader
                                        ? <ActivityIndicator color={Colors.white} size={"small"} animating={true} />
                                        : <Text style={{
                                            ...styles.labelsText,
                                            // fontSize: getProportionalFontSize(10),
                                            // fontFamily: Assets.fonts.medium,
                                            color: Colors.white,
                                            width: "auto"
                                        }}> {labels["assign-licence-key"] ?? ""}</Text>
                                }
                            </TouchableOpacity>
                            : null
                    }
                </View>
            </CardForKeyList>
        )
    }
    const assignLicenseKey = async (id) => {
        let params = {}
        let url = Constants.apiEndPoints.administrationAssignLicenseKey + "/" + id;
        // console.log("assign license api --------", url)
        // return
        setButtonLoader(true);
        let response = await APIService.postData(url, params, UserLogin.access_token, null, "administrationAssignLicenseKeyAPI");
        // // console.log(" IP response---------", JSON.stringify(response.data.payload))
        if (!response.errorMsg) {
            setButtonLoader(false);
            Alert.showAlert(Constants.success, labels.license_assigned);
        }
        else {
            setButtonLoader(false);
            Alert.showAlert(Constants.danger, response.errorMsg);
        }
    }
    const closeActionSheet = () => {
        // setActionSheetDecide('');
        actionSheetRef?.current?.setModalVisible();
    }
    // render
    return (
        <BaseContainer
            onPressLeftIcon={!isLoading ? () => { props.navigation.goBack() } : () => { }}
            leftIcon="arrow-back"
            leftIconSize={24}
            title={labels["License"]}
            leftIconColor={Colors.primary}
        >
            <ActionSheet
                containerStyle={{ backgroundColor: Colors.backgroundColor, }}
                ref={actionSheetRef}>
                <ActionSheetComp
                    title={labels["actionSheetDecide"]}
                    closeActionSheet={closeActionSheet}
                    keyToShowData="name"
                    keyToCompareData="id"
                    multiSelect={false}
                    APIDetails={companyAS}
                    changeAPIDetails={(payload) => {
                        // console.log('changeAPIDetails CALLED-------------------------------------')
                        setCompanyAS(getActionSheetAPIDetail({ ...companyAS, ...payload }));
                    }}
                    onPressItem={(item) => {
                        // console.log('item --------', item)
                        setCompany(item)
                    }}
                />
            </ActionSheet>
            {
                isLoading ? (
                    <ListLoader />
                ) : (
                    <>
                        <FlatList
                            ListEmptyComponent={<EmptyList />}
                            data={licenseKeyList}
                            renderItem={flatListRenderItem}
                            keyExtractor={(item, index) => index}
                            contentContainerStyle={{ borderWidth: 0, paddingVertical: Constants.globalPaddingVetical, paddingHorizontal: Constants.globalPaddingHorizontal }}
                            showsVerticalScrollIndicator={false}
                            onEndReached={() => { getLicenseKeyList(page + 1) }}
                            onEndReachedThreshold={0.1}
                            refreshControl={
                                <RefreshControl
                                    refreshing={isRefreshing}
                                    onRefresh={() => {
                                        getLicenseKeyList(null, true);
                                    }}
                                />
                            }
                            ListFooterComponent={() => <FooterCompForFlatlist paginationLoading={paginationLoading} />}
                        />
                        {/* FLOATING ADD BUTTON */}
                        {
                            Can(Constants.permissionsKey.licencesAdd, permissions)
                                ? <FAB
                                    style={styles.fab}
                                    color={Colors.white}
                                    icon="plus"
                                    onPress={() => {
                                        props.navigation.navigate('AddLicenseKey', { itemId: '' });
                                    }}
                                />
                                : null}
                    </>
                )
            }
            {/* </ScrollView> */}
        </BaseContainer>
    )
}

export default LicenseKeyList

const styles = StyleSheet.create({
    fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        backgroundColor: Colors.primary,
        bottom: 0,
    },
    labelsText: {
        fontFamily: Assets.fonts.semiBold,
        fontSize: getProportionalFontSize(12),
        width: "40%"
    },
})