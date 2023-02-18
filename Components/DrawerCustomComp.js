import React from 'react';
import { View, StyleSheet, TouchableOpacity, FlatList, ImageBackground, Image } from 'react-native';
import {
    DrawerContentScrollView,
    DrawerItem
} from '@react-navigation/drawer';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Colors from '../Constants/Colors';
import { checkPermission, getProportionalFontSize } from '../Services/CommonMethods';
import AsyncStorageService from '../Services/AsyncStorageService';
import Constants from '../Constants/Constants';
import { UserLoginAction, UserLoginActionWithPayload } from '../Redux/Actions/UserLoginAction';
import { CommonActions } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Assets from '../Assets/Assets'
import { useSelector, useDispatch } from 'react-redux';
import Can from '../can/Can';
import ProgressLoader from "./ProgressLoader";
import ChangeLanguage from './ChangeLanguage';
import {
    useTheme,
    Avatar,
    Title,
    Caption,
    Paragraph,
    Drawer,
    Text,
    Switch, Portal, Modal
} from 'react-native-paper';
import Alert from './Alert';
import { UserDetailAction } from '../Redux/Actions/UserDetailAction';



export default function DrawerCustomComp(props) {
    // REDUX hooks
    const dispatch = useDispatch();
    const UserLogin = useSelector(state => state?.User?.UserLogin);
    const UserDetail = useSelector(state => state?.User?.UserDetail);
    const labels = useSelector(state => state.Labels);
    const permissions = UserLogin?.permissions ?? {};
    const sendJsonMessage = useSelector(state => state.MessagesData.sendJsonMessage);
    const readyState = useSelector(state => state.MessagesData.socketMessagesReadyState);
    const [isModalVisible, setIsModalVisible] = React.useState(false);
    const [isLoggingOut, setIsLoggingOut] = React.useState(false);
    // console.log('permissions-----', permissions)

    let drawerContentData = [
        {
            label: labels?.Dashboard ?? "",
            group_name: 'dashboard',
            route: 'HomeStack',
            icon: 'sitemap',
            iconLibrary: MaterialCommunityIcons,
            specificRouteName: 'Home'
        },
        {
            label: labels?.categories ?? "",
            route: 'CategoryScreen',
            group_name: Constants.permissionsKey.categoriesBrowse,
            icon: 'sitemap',
            iconLibrary: MaterialCommunityIcons
        },
        {
            label: labels?.Branches ?? "",
            route: 'BranchListing',
            group_name: Constants.permissionsKey.branchBrowse,
            icon: 'add-business',
            iconLibrary: MaterialIcons
        },
        {
            label: labels?.Departments ?? "",
            group_name: Constants.permissionsKey.departmentsBrowse,
            route: 'DepartmentListing',
            icon: 'drag-indicator',
            iconLibrary: MaterialIcons
        },
        {
            label: labels?.employees ?? "",
            group_name: Constants.permissionsKey.employeesBrowse,
            route: 'EmployeeListing',
            icon: 'human-male-male',
            iconLibrary: MaterialCommunityIcons
        },
        {
            label: labels?.patients ?? "",
            group_name: Constants.permissionsKey.patientsBrowse,
            route: 'PatientListing',
            icon: 'hand-holding-medical',
            iconLibrary: FontAwesome5
        },
        {
            label: labels?.IP_mobile_dashboard ?? "",
            group_name: Constants.permissionsKey.ipBrowse,
            route: 'ImplementationPlanStack',
            icon: 'notebook',
            iconLibrary: MaterialCommunityIcons
        },
        {
            label: labels?.companies ?? "",
            route: 'CompanyListing',
            group_name: Constants.permissionsKey.companiesBrowse,
            icon: 'business',
            iconLibrary: Ionicons
        },
    ]

    const onRequestClose = () => {
        setIsLoggingOut(false)
        setIsModalVisible(false);
    }

    // console.log("========ok ", UserLogin?.user_type_id)
    // useState Hooks
    // const [isLoading, setIsLoading] = React.useState(false);

    // useEffect Hooks
    // React.useEffect(() => {
    //     getUserDetails()
    // }, [])

    // const getUserDetails = () => {
    //     if (!UserDetail.name) {
    //         let params = {
    //             token: UserLogin.access_token,
    //             id: UserLogin.id
    //         }
    //         setIsLoading(true)
    //         dispatch(UserDetailAction(params, onSuccessDetail, onFailureDetail));
    //     }
    // }

    // const onSuccessDetail = () => {
    //     setIsLoading(false)
    // }

    // const onFailureDetail = (errorMsg) => {
    //     setIsLoading(false)
    //     Alert.showAlert(Constants.danger, errorMsg)
    // }

    const navigateToLogin = () => {
        props.navigation.dispatch(
            CommonActions.reset({
                index: 0,
                routes: [{ name: 'Login' }],
            }),
        );
    };

    const disconnectSocket = () => {
        if (readyState == 1 && UserLogin?.id && sendJsonMessage) {
            let params = { command: Constants.socket_constants.commands.disconnect_socket, userId: UserLogin?.id }
            sendJsonMessage(params)
        }
    }

    const logout = async () => {
        // if (!Constants.isConnected) {
        //     Alert.showAlert(Constants.warning, labels.connect_internet_message)
        //     return;
        // }
        try {
            await AsyncStorageService._removeData(
                Constants.asyncStorageKeys.user_login,
            );
            onRequestClose()
            dispatch(UserLoginActionWithPayload({}));
            disconnectSocket();
            navigateToLogin();
        } catch (error) {
            // console.log('AsyncStorageService Logout Error', error);
            onRequestClose()
            Alert.showToast(labels.message_something_went_wrong)
        }
    };

    // render view
    // if (isLoading)
    //     return (<ProgressLoader
    //         onActivityIndicator={true}
    //         onActivityIndicatorStyle={{ borderWidth: 1, height: "100%" }}
    //     />)
    // console.log('UserLogin', UserLogin.avatar);
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: Colors.navBackgroundWhite }}>
            <View style={{ flex: 1, }}>
                {/* <DrawerContentScrollView {...props}> */}
                <View style={styles.drawerContent}>
                    <ImageBackground resizeMode="stretch" source={Assets.images.NavHeader} style={styles.userInfoSection} imageStyle={{ width: "100%", height: "100%" }} >

                        <View style={{ marginTop: 10, padding: 10 }}>
                            <AntDesign
                                onPress={() => { props.navigation.closeDrawer() }}
                                name={'arrowleft'}
                                color={Colors.white}
                                size={getProportionalFontSize(32)}
                            />
                            <Title numberOfLines={2} style={[styles.title, { width: "55%" }]}>
                                {UserDetail?.name ?? UserLogin.name}
                            </Title>
                        </View>

                        <TouchableOpacity
                            onPress={() => {
                                props.navigation.navigate('CommonUserProfile', { fromDrawer: true });
                            }}
                            style={[styles.profileRoundView]}>
                            <Image
                                resizeMode="cover"
                                source={{
                                    uri: UserLogin?.avatar ? UserLogin?.avatar
                                        : (UserLogin?.gender?.toLowerCase() == "female" ? Constants?.userImageFemale : Constants?.userImageMale)
                                }}
                                style={{ height: "100%", width: "100%", borderRadius: 50 }}
                                size={getProportionalFontSize(50)}
                            />
                            <TouchableOpacity
                                onPress={() => {
                                    props.navigation.navigate('CommonUserProfile', { fromDrawer: true });
                                }}
                                style={styles.editFloatingView}>

                                <FontAwesome5
                                    name={'pencil-alt'}
                                    color={Colors.black}
                                    size={getProportionalFontSize(15)}
                                />
                            </TouchableOpacity>
                        </TouchableOpacity>

                        {/* <View
                            style={{
                                // marginTop: 15,
                                borderWidth: 0,
                                justifyContent: 'center',
                                alignItems: 'center',
                                borderWidth: 1
                            }}>
                            <TouchableOpacity
                                style={{
                                    width: '100%',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}
                                onPress={() => {
                                    props.navigation.navigate('CommonUserProfile', { fromDrawer: true });
                                }}>
                                <Avatar.Image
                                    source={{
                                        uri: UserLogin?.avatar ? UserLogin?.avatar : UserLogin?.gender?.toLowerCase() == "female" ? Constants?.userImageFemale : Constants?.userImageMale,
                                    }}
                                    size={getProportionalFontSize(50)}
                                />
                                <View
                                    style={{
                                        // marginLeft: 15,
                                        // justifyContent: 'flex-start',
                                        // flexDirection: 'column',
                                        // borderWidth: 1
                                    }}>
                                    <Title style={styles.title}>
                                        {UserDetail?.name ?? UserLogin.name}
                                    </Title>
                                </View>
                            </TouchableOpacity>
                        </View> */}
                    </ImageBackground>

                    <Drawer.Section style={styles.drawerSection}>
                        <FlatList
                            data={drawerContentData}
                            contentContainerStyle={{}}
                            keyExtractor={(item, index) => item.label + '_' + index}
                            renderItem={({ item, index }) => {
                                if (

                                    Can(item.group_name, permissions)
                                    // checkPermission(
                                    //     item.group_name,
                                    //     Constants.permissionType.browse,
                                    //     permissions,
                                    // )
                                ) {
                                    return (
                                        <DrawerItem
                                            style={{ marginTop: 0 }}
                                            icon={({ color, size }) => (
                                                // <Icon
                                                //     name={item.icon}
                                                //     color={Colors.primary}
                                                //     size={getProportionalFontSize(24)}
                                                // />

                                                <item.iconLibrary
                                                    name={item.icon}
                                                    color={Colors.primary}
                                                    size={getProportionalFontSize(22)}
                                                />

                                            )}
                                            labelStyle={styles.labelStyle}
                                            label={item.label}
                                            onPress={() => {
                                                if (item.route) {
                                                    if (item.specificRouteName) {
                                                        props.navigation.navigate(item.route, {
                                                            screen: item.specificRouteName,
                                                        });
                                                    }
                                                    else { props.navigation.navigate(item.route); }
                                                }
                                                else if (item.isOpenModel) {
                                                    setIsModalVisible(true);
                                                }
                                            }}
                                        />
                                    );
                                } else {
                                    return <></>;
                                }
                            }}
                        />
                        <DrawerItem
                            style={{ marginTop: 0 }}
                            icon={({ color, size }) => (
                                <MaterialIcons
                                    name={"language"}
                                    color={Colors.primary}
                                    size={getProportionalFontSize(22)}
                                />
                            )}
                            labelStyle={styles.labelStyle}
                            label={labels?.mobile_languages ?? "language"}
                            onPress={() => { setIsModalVisible(true); }}
                        />

                    </Drawer.Section>


                </View>
                {/* </DrawerContentScrollView> */}

                {/* Logout button */}
                <Drawer.Section style={styles.bottomDrawerSection}>
                    <DrawerItem
                        icon={({ color, size }) => (
                            <Icon
                                name="logout"
                                color={Colors.primary}
                                size={getProportionalFontSize(24)}
                            />
                        )}
                        labelStyle={styles.labelStyle}
                        label="Log Out"
                        onPress={() => {
                            setIsLoggingOut(true)
                            // logout();
                        }}
                    />
                    <Text
                        style={[
                            styles.labelStyle,
                            { alignSelf: 'center', color: Colors.primary },
                        ]}>
                        {labels.aceuss}
                    </Text>
                </Drawer.Section>

                <Portal>
                    <Modal
                        animationType="slide"
                        transparent={true}
                        style={{}}
                        visible={isModalVisible || isLoggingOut}
                    // onRequestClose={onRequestClose}
                    // onDismiss={onRequestClose}
                    >
                        <View style={styles.modalMainView}>
                            <View style={styles.innerViewforModel}>
                                <ChangeLanguage
                                    logout={logout}
                                    isLoggingOut={isLoggingOut}
                                    navigation={props.navigation}
                                    onRequestClose={onRequestClose}
                                />
                            </View>
                        </View>
                    </Modal>
                </Portal>
            </View>

            {/* OLD CODE  */}

            {/* <View style={styles.drawerContent}>
                <FlatList
                    data={drawerContentData}
                    keyExtractor={(item) => item.label}
                    renderItem={({ item, index }) => {
                        return (
                            <TouchableOpacity
                                style={{ flexDirection: 'row', alignItems: 'center', marginTop: 40 }}
                                onPress={() => {
                                    if (item.route != 'Logout')
                                        props.navigation.navigate(item.route)
                                    else
                                        logout()

                                }}
                            >
                                <Icon
                                    name={item.icon}
                                    color={Colors.primary}
                                    size={24}
                                />
                                <Text style={styles.title}>{item.label}</Text>
                            </TouchableOpacity>
                        )
                    }}
                />
            </View> */}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    // drawerContent: {
    //     flex: 1,
    //     paddingLeft: 15,
    //     backgroundColor: Colors.backgroundColor
    // },
    // title: {
    //     fontSize: getProportionalFontSize(15),
    //     color: Colors.primary,
    //     fontWeight: 'bold',
    //     marginLeft: 5
    // },
    profileRoundView: {
        backgroundColor: Colors.primary,
        position: "absolute", bottom: 10, right: 15, height: 100, width: 100,
        borderWidth: 0, borderRadius: 50, borderColor: Colors.white, justifyContent: "center", alignItems: "center"
    },
    drawerContent: {
        flex: 1,
    },
    userInfoSection: {
        // paddingHorizontal: Constants.globalPaddingHorizontal,
        width: "100%",
        height: "30%",
    },
    title: {
        fontSize: getProportionalFontSize(18),
        color: Colors.white,
        fontFamily: Assets.fonts.semiBold,
        marginLeft: 5,
    },
    caption: {
        fontSize: getProportionalFontSize(12),
        lineHeight: 14,
    },
    row: {
        marginTop: 20,
        flexDirection: 'row',
        alignItems: 'center',
    },
    section: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 15,
    },
    paragraph: {
        fontWeight: 'bold',
        marginRight: 3,
    },
    drawerSection: {
        marginTop: 15,
        // backgroundColor: '#c4dbfd',
        borderWidth: 0,
        borderBottomColor: Colors.transparent,
    },
    bottomDrawerSection: {
        marginBottom: 15,
        borderTopColor: Colors.primary,
        borderTopWidth: 1,
    },
    preference: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 12,
        paddingHorizontal: 16,
    },
    labelStyle: {
        color: Colors.black,
        fontSize: getProportionalFontSize(12),
        fontFamily: Assets.fonts.bold,
    },
    modalMainView: { backgroundColor: Colors.transparent, justifyContent: "center", alignItems: "center", paddingHorizontal: 16 },
    innerViewforModel: {
        width: '100%', minHeight: 150, backgroundColor: Colors.backgroundColor, paddingBottom: Constants.globalPaddingHorizontal * 2, paddingHorizontal: 16, borderRadius: 20,
    },
    editFloatingView: { borderWidth: 1, borderColor: Colors.primary, position: "absolute", top: 3, right: 3, height: 27, width: 27, borderRadius: 25, justifyContent: "center", alignItems: "center", backgroundColor: Colors.white }
});
