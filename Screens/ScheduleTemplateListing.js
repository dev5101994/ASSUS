import React from 'react'
import { StyleSheet, Text, View, FlatList, RefreshControl } from 'react-native'
// import { FAB, } from 'react-native-paper';
import EmptyList from '../Components/EmptyList';
import Colors from '../Constants/Colors';
import { getProportionalFontSize, firstLetterFromString } from '../Services/CommonMethods';
import { useSelector, useDispatch } from 'react-redux';
import BaseContainer from '../Components/BaseContainer';
import Constants from '../Constants/Constants';
import APIService from '../Services/APIService';
import ListLoader from '../Components/ListLoader';
import Can from '../can/Can';
import FooterCompForFlatlist from '../Components/FooterCompForFlatlist';
import Alert from '../Components/Alert';
import Icon from 'react-native-vector-icons/MaterialIcons';
// import CommonCRUDCard from '../Components/CommonCRUDCard';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import { FAB, Button, Card, Title, Paragraph, Checkbox, Portal, Modal, RadioButton } from 'react-native-paper';
import AddScheduleTemplate from './AddScheduleTemplate';
import ScheduleTemplateListingCard from '../Components/ScheduleTemplateListingCard';


//"https://testing.3mad.in/api/v1/schedule-templates";
// {
//     "id": 19,
//     "top_most_parent_id": 2,
//     "title": "website",
//     "from_date": "2022-06-24",
//     "to_date": "2022-06-24",
//     "shifts": "[67]",
//     "status": 0,
//     "deactivation_date": null,
//     "entry_mode": "web-0.0.1",
//     "created_at": "2022-06-24T12:03:14.000000Z",
//     "updated_at": "2022-06-24T12:03:14.000000Z",
//     "deleted_at": null
//   },

//

//"https://aceuss.3mad.in/api/v1/schedule-templates";
// {
//     "id": 6,
//     "top_most_parent_id": 2,
//     "title": "bogdan",
//     "status": 0,
//     "deactivation_date": null,
//     "entry_mode": "web-0.0.1",
//     "created_at": "2022-06-21T09:32:12.000000Z",
//     "updated_at": "2022-06-24T09:55:36.000000Z",
//     "deleted_at": null
//   }

const ScheduleTemplateListing = (props) => {
    const initialValidation = {
        ["title"]: {
            invalid: false,
            title: ''
        },
    }
    const UserLogin = useSelector(state => state.User.UserLogin);
    const permissions = UserLogin?.permissions ?? {};
    const labels = useSelector(state => state.Labels);
    const [isModalVisible, setIsModalVisible] = React.useState(false);
    // const [param, setParam] = React.useState({ "employee": "", "patient_id": "", "start_date": "", "shift": "", "refreshAPI": false });
    //hooks
    const [scheduleTemplateList, setScheduleTemplateList] = React.useState([]);
    const [isLoading, setIsLoading] = React.useState(true);
    const [isRefreshing, setIsRefreshing] = React.useState(false);
    const [paginationLoading, setPaginationLoading] = React.useState(false);
    const [page, setPage] = React.useState(0);
    const [validationObj, setValidationObj] = React.useState({ ...initialValidation });
    const [item, setItem] = React.useState();
    const [modalActionMode, setModalActionMode] = React.useState(false);

    React.useEffect(() => {
        getScheduleTemplateList()
    }, [])
    React.useEffect(() => {
        const unsubscribe = props.navigation.addListener('focus', () => {
            // console.log('Focus___________________________________________')
            getScheduleTemplateList(null, true)
        });
        return unsubscribe;
    }, [props.navigation]);

    const removeErrorTextForInputThatUserIsTyping = (uniqueKey) => {
        let tempValidationObj = { ...initialValidation }
        tempValidationObj[uniqueKey] = initialValidation[uniqueKey];
        setValidationObj(tempValidationObj);
    }

    const getScheduleTemplateList = async (page, refresh) => {
        if (refresh) setIsRefreshing(true);
        else if (!page) setIsLoading(true);
        else setPaginationLoading(true);
        let params = {

            perPage: Constants.perPage,
            page: page ?? 1,

            // "patient_id": param?.patient ?? "",
            // user_id: param?.employee ?? "",
            // "shift_id": param?.shift ?? "",
            // "shift_start_date": param?.start_date ?? "",
            // "shift_end_date": param?.end_time ?? "",


        };
        // console.log('param---------------------123', JSON.stringify(params))
        let url = Constants.apiEndPoints?.["schedule-templates"];
        // console.log("url", url);
        let response = await APIService.postData(url, params, UserLogin.access_token, null, 'ScheduleListAPI',);

        if (!response.errorMsg) {
            // console.log('response-------------------+++++++++++++', JSON.stringify(response))
            if (!page) {
                setPage(1);
                setScheduleTemplateList(response.data.payload.data);
                setIsLoading(false);
                if (refresh) setIsRefreshing(false);
            } else {
                let tempScheduleList = [...scheduleTemplateList];
                tempScheduleList = tempScheduleList.concat(response.data.payload.data);
                setPage(page);
                setScheduleTemplateList([...tempScheduleList]);
                setPaginationLoading(false);
            }
        } else {
            if (!page) setIsLoading(false);
            else setPaginationLoading(false);
            if (refresh) setIsRefreshing(false);
            Alert.showAlert(Constants.danger, response.errorMsg);
        }
    }

    const deleteScheduleTemplateAPI = async (id, index) => {
        setIsLoading(true);
        // console.log('item', item)
        let url = Constants?.apiEndPoints?.["schedule-template"] + "/" + id;
        let response = await APIService.deleteData(url, UserLogin.access_token, null, "deleteScheduleAPI");
        if (!response.errorMsg) {
            let tempList = [...scheduleTemplateList];
            tempList.splice(index, 1)
            setScheduleTemplateList(tempList);
            Alert.showToast(labels.message_delete_success)
            setIsLoading(false);
        }
        else {
            setIsLoading(false);
            Alert.showAlert(Constants.danger, response.errorMsg)

        }
    }

    const flatListRenderItem = ({ item, index }) => {
        return (
            // <CommonCRUDCard
            <ScheduleTemplateListingCard
                title={item.title}
                second_title={labels.status}
                second_title_value={item.status == 1 ? "Active" : "Inactive"}
                labelText={firstLetterFromString(item.title)}
                onPressCard={
                    () => props.navigation.navigate("ScheduleTempDetail", { scheduleTemplateId: item.id })
                }
                showDeleteIcon={
                    item.status == 0
                        ? Can(Constants.permissionsKey.scheduleTemplateDelete, permissions)
                        : false
                }
                showEditIcon={true
                    // Can(Constants.permissionsKey.scheduleTemplateAdd, permissions)
                }
                showCopyIcon={false
                    // Can(Constants.permissionsKey.scheduleTemplateRead, permissions)
                }
                showActiveIcon={false
                    // item.status == 0
                    //     ? Can(Constants.permissionsKey.scheduleTemplateRead, permissions)
                    //     : false

                }
                onPressEdit={() => {
                    // Alert.showAlert(Constants.warning, labels.schedule_template_use_web_msg)

                    setModalActionMode("edit_template")
                    setItem(item)
                    setIsModalVisible(true);
                }}
                onPressDelete={() => {
                    Alert.showDoubleAlert(Constants.warning, labels.message_delete_confirmation, () => {
                        deleteScheduleTemplateAPI(item.id, index);
                    })
                }}
                onPressCopy={() => {
                    setModalActionMode("merge_template")
                    setItem(item)
                    setIsModalVisible(true);
                    // Alert.showAlert(Constants.warning, "Action is Under Construction", () => { })
                }}
                onPressActive={() => {
                    setModalActionMode("change_template_status")
                    setItem(item)
                    setIsModalVisible(true);
                    // Alert.showAlert(Constants.warning, "Action is Under Construction", () => { })
                }}

            />
        )
    }

    const onRequestClose = (reloadList) => { setIsModalVisible(false); if (reloadList) getScheduleTemplateList(null, true) }
    const openModel = () => { setIsModalVisible(true); }
    const isUserHasModule = () => {
        let temp = UserLogin.assigned_module
        let isUserHasModule = temp.find((obj) => {
            return obj.module.name == Constants.allModules["Schedule"]
        })
        if (isUserHasModule)
            return true
        else
            return false
    }

    return (
        <BaseContainer
            onPressLeftIcon={() => { props.navigation.pop() }}
            // headerBar={{ backgroundColor: Colors.transparent }}
            leftIcon="arrow-back"
            leftIconSize={24}
            title={labels["ScheduleTemplate"]}
        // onPressRightIcon={() => openModel()}
        // leftIconColor={Colors.primary}
        // rightIcon={"filter-list"}
        >
            {
                !isUserHasModule()
                    ? <EmptyList navigation={props.navigation} noModuleMsg={true} />
                    : isLoading
                        ? <ListLoader />
                        : <View style={styles.mainView}>

                            <FlatList
                                ListEmptyComponent={<EmptyList />}
                                data={scheduleTemplateList}
                                renderItem={flatListRenderItem}
                                contentContainerStyle={{ borderWidth: 0, paddingVertical: Constants.globalPaddingVetical, paddingHorizontal: Constants.globalPaddingHorizontal }}
                                //style={{ paddingHorizontal: Constants.globalPaddingHorizontal }}
                                keyExtractor={item => item.id}
                                onEndReached={() => { getScheduleTemplateList(page + 1) }}
                                onEndReachedThreshold={0.1}
                                refreshControl={
                                    <RefreshControl
                                        refreshing={isRefreshing}
                                        onRefresh={() => {
                                            getScheduleTemplateList(null, true)
                                        }}
                                    />
                                }
                                ListFooterComponent={() => <FooterCompForFlatlist paginationLoading={paginationLoading} />}
                            />
                            {/* FLOATING ADD BUTTON */}
                            {
                                Can(Constants.permissionsKey.scheduleTemplateAdd, permissions)
                                    ? <FAB
                                        style={styles.fab}
                                        color={Colors.white}
                                        icon="plus"
                                        onPress={() => {
                                            Alert.showAlert(Constants.warning, labels.schedule_template_use_web_msg)
                                            //  setModalActionMode("add_template"); setIsModalVisible(true)
                                        }}
                                    />
                                    : null
                            }
                            <Portal>
                                <Modal
                                    animationType="slide"
                                    transparent={true}
                                    style={{}}
                                    visible={isModalVisible}
                                    onRequestClose={onRequestClose}
                                    onDismiss={onRequestClose}
                                >
                                    <AddScheduleTemplate
                                        onRequestClose={onRequestClose}
                                        modalActionMode={modalActionMode}
                                        item={modalActionMode == "add_template" ? false : item}
                                    />
                                </Modal>
                            </Portal>
                        </View>
            }
        </BaseContainer>
    )
}

export default ScheduleTemplateListing

const styles = StyleSheet.create({
    mainView: {
        flex: 1
    },
    fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        backgroundColor: Colors.primary,
        bottom: 0,
    },
    modalMainView: { backgroundColor: 'transparent', justifyContent: "center", alignItems: "center", paddingHorizontal: 16 },
    innerViewforModel: {
        width: '100%', minHeight: 150, backgroundColor: Colors.backgroundColor, paddingBottom: Constants.globalPaddingHorizontal * 2, paddingTop: Constants.globalPaddingHorizontal, paddingHorizontal: 16, borderRadius: 20,
    },
    InputValidationView: {
        backgroundColor: Colors.transparent,
        //borderColor: 'red',
        marginTop: 15,
        //borderRadius: 10,
        //color: 'red'
    },
    inputStyle: {
        fontSize: getProportionalFontSize(15),
        fontFamily: Assets.fonts.regular
    },

    checkBoxView: { flexDirection: 'row', alignItems: 'center', marginTop: 30 },
    RadioBtnsText: {
        fontSize: getProportionalFontSize(14), fontFamily: Assets.fonts.regular,
        width: 160
    },
})