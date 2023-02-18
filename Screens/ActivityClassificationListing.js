
import React from 'react';
import {
    StyleSheet,
    Text, View, SafeAreaView, Image, TouchableOpacity, ScrollView, FlatList,
} from 'react-native';
import Colors from '../Constants/Colors';
import Assets from '../Assets/Assets'
import { getProportionalFontSize } from '../Services/CommonMethods';
import APIService from '../Services/APIService'
import Constants from '../Constants/Constants'
import ProgressLoader from '../Components/ProgressLoader'
import { useSelector, useDispatch } from 'react-redux'
import Icon from 'react-native-vector-icons/MaterialIcons';
import BaseContainer from '../Components/BaseContainer';
import AddActivityCls from '../Components/AddActivityCls'
import { Modal, Portal, } from 'react-native-paper';
import { FAB } from 'react-native-paper';
import EmptyList from '../Components/EmptyList';
import Alert from '../Components/Alert';



const ActivityClassificationListing = (props) => {
    // useState hooks
    const [activityClsList, setactivityClsList] = React.useState([]);
    const [isModalVisible, setIsModalVisible] = React.useState(false);
    const [activityClsItem, setactivityClsItem] = React.useState(null);
    const [isLoading, setIsLoading] = React.useState(true);

    // REDUX hooks
    const isInternetActive = useSelector(state => state.IsInternetActive);
    const UserLogin = useSelector(state => state.User.UserLogin);
    const labels = useSelector(state => state.Labels);

    const category_type_status = labels;
    const category_type_status_color = Colors.active_inactive_status_color;

    // useEffect hooks
    React.useEffect(() => {
        activityClsAPI()
    }, [])

    // Helper Methods
    const getActivityCls = ({ item, index }) => {
        return (
            <View style={styles.activityClsCard}>
                <View style={styles.activityNameView}>
                    <Text style={styles.activityNameText}>{item.name}</Text>
                    {/* title and status view */}
                    <View style={styles.statusMainView}>
                        <Text style={styles.statusTitle}>{labels["status"]}</Text>
                        <Text style={{ ...styles.statusValue, color: category_type_status_color[item.status] }}> {category_type_status[Constants.active_inactive_status_keys[item.status]]}</Text>
                    </View>
                </View>
                {/* edit and delete icon view */}
                <View style={styles.editDeleteIconView}>
                    <Icon name="edit" color={Colors.primary} size={25} onPress={() => {
                        setactivityClsItem(item);
                        setIsModalVisible(true);
                    }} />
                    <Icon name="delete-outline" color={Colors.red} size={25} style={{ marginStart: 5 }} onPress={() => {
                        Alert.showDoubleAlert(Constants.danger, "Do you wish to continue ?",
                            () => { deleteActivityClsAPI(item, index); })
                    }} />
                </View>
            </View>
        )
    }

    // API methods
    const activityClsAPI = async () => {
        setIsLoading(true);
        let params = {
        }
        let url = Constants.apiEndPoints.activityClsList;
        let response = await APIService.postData(url, params, UserLogin.access_token, null, "activityClsAPI");
        if (!response.errorMsg) {
            setactivityClsList(response.data.payload);
            setIsLoading(false);
        }
        else {
            setIsLoading(false);
            Alert.showAlert(Constants.danger, response.errorMsg)
        }
    }

    const deleteActivityClsAPI = async (item, index) => {
        setIsLoading(true);
        // console.log('item', item)
        let url = Constants.apiEndPoints.administrationActivityCls + "/" + item.id;
        let response = await APIService.deleteData(url, UserLogin.access_token, null, "deleteActivityClsAPI");
        if (!response.errorMsg) {
            let tempactivityClsList = [...activityClsList];
            tempactivityClsList.splice(index, 1)
            setactivityClsList(tempactivityClsList);
            setIsLoading(false);
        }
        else {
            setIsLoading(false);
            Alert.showAlert(Constants.danger, response.errorMsg)
        }
    }

    const onRequestClose = () => {
        // console.log('onRequestClose called')
        setactivityClsItem(null);
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
                // leftIconSize={24}
                title={labels["activity-classification"]}
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
                            <AddActivityCls
                                activityClsItem={activityClsItem}
                                UserLogin={UserLogin}
                                isInternetActive={isInternetActive}
                                labels={labels}
                                refreshAPI={activityClsAPI}
                                onRequestClose={onRequestClose}
                            />
                        </Modal>
                    </Portal>

                    {/* Category type listing */}
                    {activityClsList?.length > 0
                        ? < FlatList
                            contentContainerStyle={{ paddingHorizontal: Constants.globalPaddingHorizontal, width: '100%', }}
                            data={activityClsList}
                            showsVerticalScrollIndicator={false}
                            keyExtractor={(item, index) => index}
                            renderItem={getActivityCls}
                        />
                        : <EmptyList />
                    }

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
    );
};

export default ActivityClassificationListing;

const styles = StyleSheet.create({
    scrollView: { flex: 1, backgroundColor: Colors.backgroundColor },
    mainView: {
        flex: 1,
        backgroundColor: Colors.backgroundColor,
        paddingBottom: 20,
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
    activityClsCard: {
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
    activityNameView: {
        width: '80%'
    },
    activityNameText: {
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
