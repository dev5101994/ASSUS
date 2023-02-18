import React from 'react';
import { View, StyleSheet, Text, SafeAreaView, TouchableOpacity, FlatList, RefreshControl, Platform } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Colors from '../Constants/Colors';
import { getProportionalFontSize, getActionSheetAPIDetail } from '../Services/CommonMethods';
import InputValidation from './InputValidation'
import CustomButton from './CustomButton';
import Constants from '../Constants/Constants'
import APIService from '../Services/APIService';
import Assets from '../Assets/Assets'
import Alert from './Alert'
import EmptyList from './EmptyList';
import ProgressLoader from './ProgressLoader';
import Can from '../can/Can';
import { useSelector, useDispatch } from 'react-redux';


export default TaskListingModel = props => {

    // REDUX hooks
    const dispatch = useDispatch();
    const UserLogin = useSelector(state => state?.User?.UserLogin);
    const UserDetail = useSelector(state => state?.User?.UserDetail);
    const labels = useSelector(state => state.Labels);
    const permissions = UserLogin?.permissions ?? {};

    // useState hooks
    const [isLoading, setIsLoading] = React.useState(true);
    const [isRefreshing, setIsRefreshing] = React.useState(false);
    const [paginationLoading, setPaginationLoading] = React.useState(false);
    const [page, setPage] = React.useState(0);
    const [TaskList, setTaskList] = React.useState([]);

    React.useEffect(() => {
        taskListingAPI()
    }, [])

    const taskListingAPI = async (page, refresh) => {
        if (refresh)
            setIsRefreshing(true)
        else if (!page)
            setIsLoading(true);
        else
            setPaginationLoading(true)
        let params = {
            "perPage": Constants.perPage,
            "page": page ?? 1,
            "resource_id": props.activityID
            // "ip_id": routeParam.IPId
            // "status": "1",
        }
        let url = Constants.apiEndPoints.task
        // console.log("url", url);
        // console.log("params", params);

        let response = await APIService.postData(url, params, props.UserLogin.access_token, null, "taskListingAPI");
        // console.log("data", response.data)
        if (!response.errorMsg) {
            // console.log('response-------------------+++++++++++++', JSON.stringify(response))
            if (!page) {
                setPage(1);
                setTaskList(response.data.payload.data);
                setIsLoading(false);
                if (refresh)
                    setIsRefreshing(false);
            }
            else {
                let tempList = [...TaskList];
                tempList = tempList.concat(response.data.payload.data);
                setPage(page);
                setTaskList([...tempList]);
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

    // Render view
    // console.log('activityID++++++++++', props.activityID)
    return (

        // isLoading
        //     ? <ProgressLoader />
        //     :
        <View style={styles.modalMainView}>

            <View style={styles.innerView}>
                {/* close icon */}
                <Icon name='cancel' color={Colors.primary} size={30} onPress={isLoading ? () => { } : props.onRequestClose} />

                <Text style={styles.headingText}>{props.title}</Text>
                <View style={{ height: '70%', }}>
                    <FlatList
                        showsVerticalScrollIndicator={false}
                        style={{ marginTop: Constants.formFieldTopMargin }}
                        contentContainerStyle={{ paddingHorizontal: Constants.globalPaddingHorizontal, }}
                        ListEmptyComponent={<EmptyList shouldAddDataMessageVisible={false} />}
                        data={TaskList}
                        renderItem={({ item, index }) => {
                            return (
                                <TouchableOpacity onPress={() => { props.onPressCard(item.id) }} style={styles.barStyle}>
                                    <Text numberOfLines={3} style={styles.normalText}>{`${index + 1}. ${item?.title}`}</Text>
                                </TouchableOpacity>
                            )
                        }}
                        keyExtractor={(item, index) => index}
                        // onEndReached={() => { followUpListingAPI(page + 1) }}
                        onEndReachedThreshold={0.1}
                        refreshControl={
                            <RefreshControl
                                refreshing={isRefreshing}
                                onRefresh={() => {
                                    taskListingAPI(null, true)
                                }}
                            />
                        }
                    />
                </View>

                {/* add new button */}
                {
                    Can(Constants.permissionsKey.taskAdd, permissions)
                        ? <CustomButton
                            titleStyle={{ color: Colors.primary }}
                            onPress={() => {
                                if (props.onPressButton) {
                                    props.onPressButton()
                                }
                            }} isLoading={isLoading} title={props.buttonTitle} style={{ marginTop: 30, backgroundColor: Colors.white, borderColor: Colors.primary, borderWidth: 1 }} /> : null
                }
            </View>

        </View >
    );
};

const styles = StyleSheet.create({
    modalMainView: { backgroundColor: 'transparent', justifyContent: "center", alignItems: "center", paddingHorizontal: 16 },
    innerView: { width: '100%', minHeight: 300, backgroundColor: Colors.backgroundColor, paddingVertical: 15, paddingHorizontal: 16, borderRadius: 20 },
    InputValidationView: {
        backgroundColor: Colors.backgroundColor,
        marginTop: 30,
        //borderRadius: 20,
        // paddingHorizontal: 5
    },
    inputStyle: {
        fontSize: getProportionalFontSize(16),
        borderColor: Colors.borderColor,
        backgroundColor: Colors.white
    },
    checkBoxView: { flexDirection: 'row', alignItems: 'center', marginTop: 30 },
    normalText: {
        fontSize: getProportionalFontSize(15),
        fontFamily: Assets.fonts.semiBold,
        color: Colors.white
    },
    mainInputStyle: {
        backgroundColor: Colors.transparent,
        marginTop: 15,
    },
    headingText: {
        fontSize: getProportionalFontSize(18),
        fontFamily: Assets.fonts.bold,
        textAlign: "center",
        // marginTop: 20,
        color: Colors.primary
    },
    barStyle: {
        width: "100%", marginTop: 5,
        backgroundColor: Colors.primary,
        // borderWidth: 1,
        borderColor: Colors.primary,
        padding: 10,
        borderRadius: 7,
        // shadowOffset: { width: 0, height: 0 },
        // shadowOpacity: 15,
        // elevation: 15,
        // shadowColor: Platform.OS == 'ios' ? Colors.shadowColorIosDefault : Colors.primary,
    }
});
