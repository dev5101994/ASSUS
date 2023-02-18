import React from 'react';
import { LogBox, ImageBackground, Platform, Image, View, StyleSheet, Text } from 'react-native';
import {
    NavigationContainer,
    DefaultTheme as NavigationDefaultTheme,
    DarkTheme as NavigationDarkTheme,
} from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import Colors from '../Constants/Colors';
import BaseContainer from '../Components/BaseContainer';
import DrawerCustomComp from '../Components/DrawerCustomComp';
import { getProportionalFontSize } from '../Services/CommonMethods';
import Login from '../Screens/Login';
import NetInfo from '@react-native-community/netinfo';
import Dashboard from '../Screens/Dashboard';
import AddCompanyForm from '../Screens/AddCompanyForm';
import CategoryTypeScreen from '../Screens/CategoryTypeScreen';
import ForgetPassword from '../Screens/ForgetPassword';
import OTPconfirmation from '../Screens/OTPconfirmation';
import CreateNewPassword from '../Screens/CreateNewPassword';
import Packages from '../Screens/Packages';
import CompanyListing from '../Screens/CompanyListing';
import Settings from '../Screens/Settings';
import SuperAdminProfile from '../Screens/SuperAdminProfile';
import AddPackages from '../Screens/AddPackages';
import CategoryScreen from '../Screens/CategoryScreen'
import AddBranch from '../Screens/AddBranch'
import AddDepartment from '../Screens/AddDepartment';
import BranchListing from "../Screens/BranchListing";
import DepartmentListing from "../Screens/DepartmentListing";
import EmployeeListing from "../Screens/EmployeeListing";
import PatientListing from "../Screens/PatientListing";
import ImplementationPlanListing from "../Screens/ImplementationPlanListing";
import ActivityListing from "../Screens/ActivityListing";
import JournalsListing from "../Screens/JournalsListing";
import DeviationListing from "../Screens/DeviationListing";
import DeviationDetails from "../Screens/DeviationDetails"
import WorkShiftListing from "../Screens/WorkShiftListing";
import ModulesListing from "../Screens/ModulesListing";
import PackageDetails from "../Screens/PackageDetails";
import ActivityClassificationListing from '../Screens/ActivityClassificationListing';
import AddActivity from '../Screens/AddActivity';
import EditUserProfile from '../Screens/EditUserProfile';
import CalendarView from "../Screens/CalendarView";
import CommonUserProfile from "../Components/CommonUserProfile";
import ContactPersonList from "../Screens/ContactPersonList";
import AddContactPerson from "../Screens/AddContactPerson";
import IpEditHistory from '../Screens/IpEditHistory';
import SplashScreen from '../Screens/SplashScreen'
import AddJournal from '../Screens/AddJournal'
import WordListing from '../Screens/WordListing';
// import AddWord from '../Screens/AddWord';
import ParagraphsList from '../Screens/ParagraphsList';
// import AddParagraph from '../Screens/AddParagraph';
import ActivityDetails from "../Screens/ActivityDetails"
import AddSubTask from '../Screens/AddSubTask';
import SubTaskList from '../Screens/SubTaskList';
import JournalDetail from '../Screens/JournalDetail';
import AddDeviation from '../Screens/AddDeviation';
import DeviationStats from '../Screens/DeviationStats';
import ActivityStats from '../Screens/ActivityStats';
import RolesListing from '../Screens/RolesListing'
import AddRole from '../Screens/AddRole';
import JournalsStats from '../Screens/JournalsStats';
import MessagesListing from '../Screens/MessagesListing';
import ChatScreen from '../Screens/ChatScreen';
import TrashedActivity from '../Screens/TrashedActivity';
import Alert from './Alert';
import { navigationRef, isReadyRef, navigate, } from '../Services/NavigationService';
import { CommonActions } from '@react-navigation/native';
import { NavDataAction } from '../Redux/Actions/NavDataAction';
import ExtendLicense from '../Screens/ExtendLicense';
import LicenseKeyList from '../Screens/LicenseKeyList';
import AddLicenseKey from '../Screens/AddLicenseKey';
import NotificationList from '../Screens/NotificationList';
import AddSchedule from '../Screens/AddSchedule';
import OvListing from '../Screens/OvListing';
import AddOv from '../Screens/AddOv';
import StamplingList from '../Screens/StamplingList';
import LeavesList from '../Screens/LeavesList';
import AddLeaves from '../Screens/AddLeaves';
import UserTypeScreen from '../Screens/UserTypeScreen';
import CompanyTypeScreen from '../Screens/CompanyTypeScreen';
import Assets from '../Assets/Assets';
import AddEmployee from '../Screens/AddEmployee';
import AddPatient from '../Screens/AddPatient';
import Constants from '../Constants/Constants';
import ModulesScreen from '../Screens/ModulesScreen';
import ImplementationPlanDetail from '../Screens/ImplementationPlanDetail';
import IPFollowUpScreen from '../Screens/IPFollowUpScreen';
import FollowUpListing from '../Screens/FollowUpListing';
import FollowUpDetails from '../Screens/FollowUpDetails';
import FollowUpEditHistory from '../Screens/FollowUpEditHistory';
import TaskDetails from '../Screens/TaskDetails';
import AddTask from '../Screens/AddTask';
import TaskListing from '../Screens/TaskListing';
import ImplementationPlanForm from '../Screens/ImplementationPlanForm';
import AssignWorkEmployee from '../Screens/AssignWorkEmployee'
import ScheduleTemplateListing from '../Screens/ScheduleTemplateListing';
import AddScheduleTemplate from '../Screens/AddScheduleTemplate';
import Reports from '../Screens/Reports';
import ScheduleTempDetail from './ScheduleTempDetail';

// REDUX imports
import { useDispatch, useSelector } from 'react-redux';
import { IsInternetActiveAction, NetInfoDetailsAction } from '../Redux/Actions/IsInternetActiveAction';
import { SocketMessagesReadyStateAction, SendJsonMessageAction, lastMessageAction, ContactsWithMessagesAction, chatDataAction, AllContactListAction, onlineUsersAction, unreadMessagesAction } from '../Redux/Actions/MessagesDataAction'
// ---**--

// Firebase libraries
//import messaging from '@react-native-firebase/messaging';
import PushNotification from 'react-native-push-notification';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
// --**--

// Socket Imports
import useWebSocket, { ReadyState } from 'react-native-use-websocket';
import { allContactList, chatData, contactsWithMessages, onlineUsers } from '../Redux/ActionTypes';
import AllContacts from '../Screens/AllContacts';
import RequestListing from '../Screens/RequestListing';
import ScheduleListing from '../Screens/ScheduleListing';
// --**--

const DrawerNavigator = createDrawerNavigator();
const TabNavigator = createMaterialBottomTabNavigator();
const StackNavigator = createStackNavigator();

const ComingSoonScreen = props => {
    //console.log('props : ', props)
    return (
        <BaseContainer
            title={props?.route?.name}
            leftIcon="list"
            leftIconColor={Colors.white}
            onPressLeftIcon={props.navigation.openDrawer}
            titleStyle={{ marginStart: 5, color: Colors.white }}
        >
            <ImageBackground style={{ flex: 1 }} source={Assets.images.homebg}>
                <Text style={styles.aceussText}>
                    {`${props?.route?.name} (Coming Soon)`}
                </Text>
            </ImageBackground>
        </BaseContainer>
    );
};

const MessagesStackNavigatorComponent = () => {
    return (
        <StackNavigator.Navigator
            initialRouteName="MessagesListing"
            screenOptions={{ headerShown: false }}>
            <StackNavigator.Screen name="MessagesListing" component={MessagesListing} />
            <StackNavigator.Screen name="ChatScreen" component={ChatScreen} />
            <StackNavigator.Screen name="AllContacts" component={AllContacts} />
        </StackNavigator.Navigator>
    );
};

const NotificationsStackNavigatorComponent = () => {
    return (
        <StackNavigator.Navigator
            initialRouteName="NotificationList"
            screenOptions={{ headerShown: false }}>
            {/* <StackNavigator.Screen name="Notifications" component={ComingSoonScreen} />   */}
            <StackNavigator.Screen name="NotificationList" component={NotificationList} />
        </StackNavigator.Navigator>
    );
};


const HomeStackNavigatorComponent = () => {

    return (
        <StackNavigator.Navigator
            initialRouteName={"Home"}
            screenOptions={{ headerShown: false }}>
            <StackNavigator.Screen name="Splash" component={SplashScreen} />
            <StackNavigator.Screen name="Home" component={Dashboard} />
            <StackNavigator.Screen name="AddEmployee" component={AddEmployee} />
            <StackNavigator.Screen name="AssignWorkEmployee" component={AssignWorkEmployee} />
            <StackNavigator.Screen name="AddPatient" component={AddPatient} />
            <StackNavigator.Screen name="AddCompanyForm" component={AddCompanyForm} />
            <StackNavigator.Screen name="CategoryTypeScreen" component={CategoryTypeScreenStackNavigatorComponent} />
            <StackNavigator.Screen name="CategoryScreen" component={CategoryScreen} />
            <StackNavigator.Screen name="CompanyListing" component={CompanyListing} />
            <StackNavigator.Screen name="Packages" component={Packages} />
            <StackNavigator.Screen name="AddPackages" component={AddPackages} />
            <StackNavigator.Screen name="PackageDetails" component={PackageDetails} />
            <StackNavigator.Screen name="AddBranch" component={AddBranch} />
            <StackNavigator.Screen name="AddDepartment" component={AddDepartment} />
            <StackNavigator.Screen name="BranchListing" component={BranchListing} />
            <StackNavigator.Screen name="DepartmentListing" component={DepartmentListing} />
            <StackNavigator.Screen name="EmployeeListing" component={EmployeeListing} />
            <StackNavigator.Screen name="PatientListing" component={PatientListing} />
            <StackNavigator.Screen name="ActivityStack" component={ActivityStack} />
            <StackNavigator.Screen name="JournalsListing" component={JournalsListing} />
            <StackNavigator.Screen name="AddJournal" component={AddJournal} />
            <StackNavigator.Screen name="JournalDetail" component={JournalDetail} />
            <StackNavigator.Screen name="JournalsStats" component={JournalsStats} />
            <StackNavigator.Screen name="DeviationStack" component={DeviationStack} />
            <StackNavigator.Screen name="ScheduleStack" component={ScheduleStack} />
            <StackNavigator.Screen name="ModulesListing" component={ModulesListing} />
            <StackNavigator.Screen name="SuperAdminProfile" component={SuperAdminProfile} />
            <StackNavigator.Screen name="ActivityClassificationListing" component={ActivityClassificationListing} />
            <StackNavigator.Screen name='EditUserProfile' component={EditUserProfile} />
            <StackNavigator.Screen name="ImplementationPlanStack" component={ImplementationPlanStack} />
            <StackNavigator.Screen name="CommonUserProfile" component={CommonUserProfile} />
            <StackNavigator.Screen name="ContactPersonList" component={ContactPersonList} />
            <StackNavigator.Screen name="AddContactPerson" component={AddContactPerson} />
            <StackNavigator.Screen name="TaskStack" component={TaskStack} />
            <StackNavigator.Screen name="WordStack" component={WordStack} />
            <StackNavigator.Screen name="ParagraphStack" component={ParagraphStack} />
            <StackNavigator.Screen name="RolesStack" component={RolesStack} />
            <StackNavigator.Screen name="CompanyTypeScreen" component={CompanyTypeScreen} />
            <StackNavigator.Screen name="TrashedActivity" component={TrashedActivity} />
            <StackNavigator.Screen name="LicenseStack" component={LicenseStack} />
            <StackNavigator.Screen name="WorkShiftListing" component={WorkShiftListing} />
            <StackNavigator.Screen name="OvStack" component={OvStack} />
            <StackNavigator.Screen name="StamplingStack" component={StamplingStack} />
            <StackNavigator.Screen name="LeavesStack" component={LeavesStack} />
            <StackNavigator.Screen name="ScheduleTemplateStack" component={ScheduleTemplateStack} />
            <StackNavigator.Screen name="Reports" component={Reports} />

        </StackNavigator.Navigator>
    );
};
const ScheduleTemplateStack = () => {
    return (
        <StackNavigator.Navigator initialRouteName="ScheduleTemplateListing" screenOptions={{ headerShown: false, }}>
            <StackNavigator.Screen name="ScheduleTemplateListing" component={ScheduleTemplateListing} />
            <StackNavigator.Screen name="AddScheduleTemplate" component={AddScheduleTemplate} />
            <StackNavigator.Screen name="ScheduleTempDetail" component={ScheduleTempDetail} />

        </StackNavigator.Navigator>
    )
}


const LeavesStack = () => {
    return (
        <StackNavigator.Navigator initialRouteName="LeavesList" screenOptions={{ headerShown: false, }}>
            <StackNavigator.Screen name="LeavesList" component={LeavesList} />
            <StackNavigator.Screen name="AddLeaves" component={AddLeaves} />
        </StackNavigator.Navigator>
    )
}

const StamplingStack = () => {
    return (
        <StackNavigator.Navigator initialRouteName="StamplingList" screenOptions={{ headerShown: false, }}>
            <StackNavigator.Screen name="StamplingList" component={StamplingList} />
        </StackNavigator.Navigator>
    )
}

const OvStack = () => {
    return (
        <StackNavigator.Navigator initialRouteName="OvListing" screenOptions={{ headerShown: false, }}>
            <StackNavigator.Screen name="OvListing" component={OvListing} />
            <StackNavigator.Screen name="AddOv" component={AddOv} />
        </StackNavigator.Navigator>
    )
}

const ScheduleStack = () => {
    return (
        <StackNavigator.Navigator initialRouteName="ScheduleListing" screenOptions={{ headerShown: false, }}>
            <StackNavigator.Screen name="ScheduleListing" component={ScheduleListing} />
            <StackNavigator.Screen name="AddSchedule" component={AddSchedule} />
        </StackNavigator.Navigator>
    )
}

const LicenseStack = () => {
    return (
        <StackNavigator.Navigator initialRouteName="LicenseKeyList" screenOptions={{ headerShown: false }}>
            <StackNavigator.Screen name="LicenseKeyList" component={LicenseKeyList} />
            <StackNavigator.Screen name="AddLicenseKey" component={AddLicenseKey} />
        </StackNavigator.Navigator>
    )
}

const DeviationStack = () => {
    return (
        <StackNavigator.Navigator
            initialRouteName="DeviationListing"
            screenOptions={{ headerShown: false }}>
            <StackNavigator.Screen name="DeviationListing" component={DeviationListing} />
            <StackNavigator.Screen name="AddDeviation" component={AddDeviation} />
            <StackNavigator.Screen name="DeviationDetails" component={DeviationDetails} />
            <StackNavigator.Screen name="DeviationStats" component={DeviationStats} />

        </StackNavigator.Navigator>
    )
}

const RolesStack = () => {
    return (
        <StackNavigator.Navigator
            initialRouteName="RolesListing"
            screenOptions={{ headerShown: false }}>
            <StackNavigator.Screen name="RolesListing" component={RolesListing} />
            <StackNavigator.Screen name="AddRole" component={AddRole} />
        </StackNavigator.Navigator>
    )
}

const WordStack = () => {
    return (
        <StackNavigator.Navigator
            initialRouteName="WordListing"
            screenOptions={{ headerShown: false }}>
            <StackNavigator.Screen name="WordListing" component={WordListing} />
            {/* <StackNavigator.Screen name="AddWord" component={AddWord} /> */}
        </StackNavigator.Navigator>
    )
}

const ParagraphStack = () => {
    return (
        <StackNavigator.Navigator
            initialRouteName="ParagraphsList"
            screenOptions={{ headerShown: false }}>
            <StackNavigator.Screen name="ParagraphsList" component={ParagraphsList} />
            {/* <StackNavigator.Screen name="AddParagraph" component={AddParagraph} /> */}
        </StackNavigator.Navigator>
    )
}

const ImplementationPlanStack = () => {
    return (
        <StackNavigator.Navigator
            initialRouteName="ImplementationPlanListing"
            screenOptions={{ headerShown: false }}>
            <StackNavigator.Screen name="ImplementationPlanListing" component={ImplementationPlanListing} />
            <StackNavigator.Screen name="ImplementationPlan" component={ImplementationPlanForm} />
            <StackNavigator.Screen name="CalendarView" component={CalendarView} />
            <StackNavigator.Screen name="ImplementationPlanDetail" component={ImplementationPlanDetail} />
            <StackNavigator.Screen name="IpEditHistory" component={IpEditHistory} />
            <StackNavigator.Screen name="IPFollowUpScreen" component={IPFollowUpScreen} />
            <StackNavigator.Screen name="FollowUpListing" component={FollowUpListing} />
            <StackNavigator.Screen name="FollowUpDetails" component={FollowUpDetails} />
            <StackNavigator.Screen name="FollowUpEditHistory" component={FollowUpEditHistory} />

        </StackNavigator.Navigator>
    )
}


const ActivityStack = () => {
    return (
        <StackNavigator.Navigator
            initialRouteName="ActivityListing"
            screenOptions={{ headerShown: false }}>
            <StackNavigator.Screen name="ActivityListing" component={ActivityListing} />
            <StackNavigator.Screen name="AddActivity" component={AddActivity} />
            <StackNavigator.Screen name="CalendarView" component={CalendarView} />
            <StackNavigator.Screen name="ActivityDetails" component={ActivityDetails} />
            <StackNavigator.Screen name="ActivityStats" component={ActivityStats} />
        </StackNavigator.Navigator>
    );
}


const TaskStack = () => {
    return (
        <StackNavigator.Navigator
            initialRouteName="TaskListing"
            screenOptions={{ headerShown: false }}>
            <StackNavigator.Screen name="AddTask" component={AddTask} />
            <StackNavigator.Screen name="TaskListing" component={TaskListing} />
            <StackNavigator.Screen name="TaskDetails" component={TaskDetails} />
            <StackNavigator.Screen name="AddSubTask" component={AddSubTask} />
            <StackNavigator.Screen name="SubTaskList" component={SubTaskList} />
        </StackNavigator.Navigator>
    );
}

const RequestsStackNavigatorComponent = () => {
    return (
        <StackNavigator.Navigator
            initialRouteName="RequestListing"
            screenOptions={{ headerShown: false }}>
            <StackNavigator.Screen name="RequestListing" component={RequestListing} />
        </StackNavigator.Navigator>
    );
};

const SettingsStackNavigatorComponent = () => {
    return (
        <StackNavigator.Navigator
            initialRouteName="Settings"
            screenOptions={{ headerShown: false }}>
            <StackNavigator.Screen name="Settings" component={Settings} />
            {/* <StackNavigator.Screen name="SuperAdminProfile" component={SuperAdminProfile} />
            <StackNavigator.Screen name="ActivityClassificationListing" component={ActivityClassificationListing} />
            <StackNavigator.Screen name='EditUserProfile' component={EditUserProfile} /> */}
        </StackNavigator.Navigator>
    );
};

const ImplementationPlanStackNavigatorComponent = () => {
    return (
        <StackNavigator.Navigator
            initialRouteName="ImplementationPlanForm"
            screenOptions={{ headerShown: false }}>
            <StackNavigator.Screen
                name="ImplementationPlanForm"
                component={ImplementationPlanForm}
            />
        </StackNavigator.Navigator>
    );
};

const CompanyTypeScreenStackNavigatorComponent = () => {
    return (
        <StackNavigator.Navigator
            initialRouteName="CompanyTypeScreen"
            screenOptions={{ headerShown: false }}>
            <StackNavigator.Screen
                name="CompanyTypeScreen"
                component={CompanyTypeScreen}
            />
        </StackNavigator.Navigator>
    );
};

const UserTypeScreenStackNavigatorComponent = () => {
    return (
        <StackNavigator.Navigator
            initialRouteName="UserTypeScreen"
            screenOptions={{ headerShown: false }}>
            <StackNavigator.Screen
                name="UserTypeScreen"
                component={UserTypeScreen}
            />
        </StackNavigator.Navigator>
    );
};

const CategoryTypeScreenStackNavigatorComponent = () => {
    return (
        <StackNavigator.Navigator
            initialRouteName="CategoryTypeScreen"
            screenOptions={{ headerShown: false }}>
            <StackNavigator.Screen
                name="CategoryTypeScreen"
                component={CategoryTypeScreen}
            />
        </StackNavigator.Navigator>
    );
};

const RenderTabBarIcons = (color, iconName) => {
    return (
        <Icon name={iconName} color={color} size={25} />
    )
}

const TabNavigatorComponent = () => {

    const UserLogin = useSelector(state => state.User.UserLogin);
    const labels = useSelector(state => state.Labels);
    const MessagesData = useSelector(state => state.MessagesData);

    return (
        <TabNavigator.Navigator
            initialRouteName="HomeStack"
            screenOptions={{ headerShown: false }}
            activeColor={Colors.primary}
            inactiveColor={Colors.lightGray}
            barStyle={{
                backgroundColor: Colors.white,
            }}
        >
            <TabNavigator.Screen
                name="MessagesStack"
                component={MessagesStackNavigatorComponent}
                options={{
                    tabBarLabel: <Text style={styles.tabBarLabel}>{labels.mobile_tab_bar_label_message}</Text>,
                    tabBarBadge: MessagesData?.unreadMessages > 9 ? '9+' : MessagesData?.unreadMessages <= 0 ? null : MessagesData?.unreadMessages,
                    tabBarIcon: ({ color }) => {
                        return RenderTabBarIcons(color, 'chat')
                    },
                }}
            />
            <TabNavigator.Screen
                name="NotificationsStack"
                component={NotificationsStackNavigatorComponent}
                options={{
                    tabBarLabel: <Text style={styles.tabBarLabel}>{labels.mobile_tab_bar_label_notification}</Text>,
                    tabBarIcon: ({ color }) => {
                        return RenderTabBarIcons(color, 'notifications')
                    },
                }}
            />
            <TabNavigator.Screen
                name="HomeStack"
                component={HomeStackNavigatorComponent}
                options={{
                    // tabBarLabel: labels.mobile_tab_bar_label_home,
                    tabBarLabel: <Text style={styles.tabBarLabel}>{labels.mobile_tab_bar_label_home}</Text>,
                    tabBarIcon: ({ color }) => {
                        return RenderTabBarIcons(color, 'home')
                    },
                }}
            />
            {(UserLogin?.user_type_id == 2 || UserLogin?.user_type_id == 1)
                ? <TabNavigator.Screen
                    name="RequestsStack"
                    component={RequestsStackNavigatorComponent}
                    options={{
                        tabBarLabel: <Text style={styles.tabBarLabel}>{labels.mobile_tab_bar_label_request}</Text>,
                        tabBarIcon: ({ color }) => {
                            return RenderTabBarIcons(color, 'admin-panel-settings')
                        },
                    }}
                />
                : null}
            <TabNavigator.Screen
                name="ModulesStack"
                component={ModulesScreen}
                options={{
                    tabBarLabel: <Text style={styles.tabBarLabel}>{labels.mobile_tab_bar_label_module}</Text>,
                    tabBarIcon: ({ color }) => {
                        return RenderTabBarIcons(color, 'apps')
                    },
                }}
            >
            </TabNavigator.Screen>
        </TabNavigator.Navigator>
    );
};

const DrawerNavigatorComponent = () => {
    return (
        <DrawerNavigator.Navigator
            drawerContent={props => <DrawerCustomComp {...props} />}
            screenOptions={{ headerShown: false }}>
            <DrawerNavigator.Screen name="Home" component={TabNavigatorComponent} />
        </DrawerNavigator.Navigator>
    );

};

export default function RootNavigator() {

    // Redux Hooks
    const dispatch = useDispatch();
    const UserLogin = useSelector(state => state.User.UserLogin);
    const labels = useSelector(state => state.Labels);
    const MessagesReadyState = useSelector(state => state.MessagesData.socketMessagesReadyState);
    const MessagesData = useSelector(state => state.MessagesData);
    const [messageSocketReconnectCount, setMessageSocketReconnectCount] = React.useState(0)

    // Socket Hooks
    const { sendJsonMessage, lastMessage, readyState, getWebSocket } = useWebSocket(Constants.socket_constants.message_socket_url,
        {
            shouldReconnect: (closeEvent) => {
                return true
            },
            reconnectAttempts: 5,
            reconnectInterval: 3000
        })
    // console.log('MessagesReadyState', MessagesReadyState)
    // console.log('MessagesReadyState', MessagesReadyState, "messageSocketReconnectCount = " + messageSocketReconnectCount)
    // if (lastMessage?.data)
    //     console.log('lastMessage', lastMessage)

    const registerChat = () => {
        let params = {
            command: Constants.socket_constants.commands.subscribe_socket,
            userId: '' + UserLogin?.id,
            token: UserLogin?.access_token
        }
        // console.log('CALLED, registerChat', params)
        sendJsonMessage(params)
    }

    const NotificationAndroid = async () => {
        PushNotification.createChannel(
            {
                channelId: "1", // (required)
                channelName: "Aceuss", // (required)
                // channelDescription: "A channel to categorise your notifications", // (optional) default: undefined.
                //playSound: true, // (optional) default: true
                soundName: "default", // (optional) See `soundName` parameter of `localNotification` function
                // importance: Importance.HIGH, // (optional) default: Importance.HIGH. Int value of the Android notification importance
                // vibrate: true, // (optional) default: true. Creates the default vibration patten if true.
            },
            (created) => {
                // console.log(`createChannel returned '${created}'`)

            }// (optional) callback returns whether the channel was created, false means it already existed.
        );

        PushNotification.configure({
            // (required) Called when a remote is received or opened, or local notification is opened

            onNotification: async (notification) => {
                // console.log(`notification   '${notification}'`)
                if (notification?.userInteraction) {
                    navigationFromNotification(notification?.data)
                }
                // process the notification
                // (required) Called when a remote is received or opened, or local notification is opened
                notification.finish(PushNotificationIOS.FetchResult.NoData);
            },
        });
    }

    const navigationFromNotification = (data) => {
        if (!data && !data?.screen && !data?.module)
            return;
        let shouldNavigateFromSplashScreen = false;
        if (labels !== null && labels !== undefined) {
            if (Object.keys(labels)?.length <= 0)
                shouldNavigateFromSplashScreen = true;
        }
        navigate(() => { dispatch(NavDataAction(data)) }, shouldNavigateFromSplashScreen)
    }

    const NotificationIOS = async () => {

    }

    const localMessageDataReducer = (key, actionCreator, jsonLastMessage) => {
        // console.log('jsonLastMessage', jsonLastMessage)
        if (!key)
            return;
        const defaultObject = {
            data: [],
            isLoading: false,
            paginationLoading: false,
            isRefreshing: false,
            page: 0
        }
        let newData = key == chatData ? jsonLastMessage?.data?.data : jsonLastMessage?.data;
        if (newData === null || newData === undefined)
            return;

        if (newData && typeof (newData) == 'object' && !Array.isArray(newData)) {
            // console.log('newData is object', newData)
            let convertedArray = []
            for (const [key, value] of Object.entries(newData)) {
                convertedArray.push(value);
            }
            newData = [...convertedArray];
        }
        // console.log('newData length', newData?.length)
        if (MessagesData?.[key]?.paginationLoading) {
            let prevData = MessagesData?.[key]?.data;
            dispatch(actionCreator({
                ...defaultObject, page: MessagesData?.[key]?.page + 1, data: prevData?.concat(newData),
                stopLoadingMore: (newData?.length <= 0 || newData.length < Constants.chatPerPage) ? true : false
            }))
        }
        else if (MessagesData?.[key]?.isLoading || MessagesData?.[key]?.isRefreshing) {
            dispatch(actionCreator({
                ...defaultObject, data: newData,
                stopLoadingMore: (newData?.length <= 0 || newData.length < Constants.chatPerPage) ? true : false
            }))
        }
    }

    // This function listens to Socket events and changes data in redux according to the command of Event
    const SocketMessageDataDispatcher = async () => {
        dispatch(lastMessageAction(lastMessage))
        let tempLastMessage = null;
        if (lastMessage?.data)
            tempLastMessage = lastMessage?.data;
        if (tempLastMessage) {
            let jsonLastMessage = await JSON.parse(tempLastMessage)
            if (jsonLastMessage) {
                // console.log('jsonLastMessage', JSON.stringify(jsonLastMessage))
                switch (jsonLastMessage?.command) {
                    case Constants.socket_constants.commands.get_contacts_with_chat_initiated: {
                        localMessageDataReducer(contactsWithMessages, ContactsWithMessagesAction, jsonLastMessage);
                        break;
                    }
                    case Constants.socket_constants.commands.get_chat: {
                        localMessageDataReducer(chatData, chatDataAction, jsonLastMessage);
                        break;
                    }
                    case Constants.socket_constants.commands.get_all_contacts: {
                        localMessageDataReducer(allContactList, AllContactListAction, jsonLastMessage);
                        break;
                    }
                    case Constants.socket_constants.commands.online_users: {
                        dispatch(onlineUsersAction(jsonLastMessage?.data ?? {}))
                        break;
                    }
                    case Constants.socket_constants.commands.totalunreadmessage: {
                        dispatch(unreadMessagesAction(jsonLastMessage?.data ?? 0))
                        break;
                    }
                    default:
                        break;
                }
            }
        }
    }

    // Push Notification and Internet connection listener
    React.useEffect(() => {

        if (Platform.OS == 'android') {
            NotificationAndroid()
        }
        else if (Platform.OS == 'ios') {
            NotificationIOS()
        }

        const unsubscribe = NetInfo.addEventListener(state => {

            // console.log('Connection type', state.type);
            // console.log('Is connected?', state.isConnected);
            // console.log('details', state.details);

            Constants.isConnected = state.isConnected;
            dispatch(IsInternetActiveAction(state.isConnected));
            dispatch(NetInfoDetailsAction(state.details));

        });
        return unsubscribe;
    }, []);

    // Socket useEffects Logic
    React.useEffect(() => {
        if (UserLogin?.access_token && UserLogin?.id)
            registerChat()
    }, [UserLogin?.access_token]);

    React.useEffect(() => {
        dispatch(SocketMessagesReadyStateAction(readyState))
        // console.log('readyState', readyState)
        if (readyState == 1 && UserLogin?.id && UserLogin?.access_token) {
            let params = {
                command: Constants.socket_constants.commands.totalunreadmessage,
                "userId": UserLogin?.id,
                "token": UserLogin?.access_token
            }
            sendJsonMessage(params)
        }
        // Disconnect socket on unmounting
        return () => {
            if (readyState == 1 && UserLogin?.id) {
                let params = { command: Constants.socket_constants.commands.disconnect_socket, userId: UserLogin?.id }
                sendJsonMessage(params)
            }
        }
    }, [readyState]);

    React.useEffect(() => {
        SocketMessageDataDispatcher()
    }, [lastMessage]);

    React.useEffect(() => {
        dispatch(SendJsonMessageAction(sendJsonMessage))
    }, [sendJsonMessage]);

    return (
        <NavigationContainer
            ref={navigationRef}
            onReady={() => {
                isReadyRef.current = true;
            }}
        >
            <StackNavigator.Navigator
                screenOptions={{ headerShown: false }}
                initialRouteName="Splash">
                <StackNavigator.Screen name="Splash" component={SplashScreen} />
                <StackNavigator.Screen
                    name="Login"
                    component={Login}
                />
                <StackNavigator.Screen
                    name="ForgetPassword"
                    component={ForgetPassword}
                />
                <StackNavigator.Screen
                    name="OTPconfirmation"
                    component={OTPconfirmation}
                />
                <StackNavigator.Screen
                    name="CreateNewPassword"
                    component={CreateNewPassword}
                />
                <StackNavigator.Screen
                    name="AuthUserStack"
                    component={DrawerNavigatorComponent}
                />
                <StackNavigator.Screen
                    name="ExtendLicense"
                    component={ExtendLicense}
                />
            </StackNavigator.Navigator>
        </NavigationContainer>
    );
}

const styles = StyleSheet.create({
    aceussText: {
        fontSize: getProportionalFontSize(20),
        height: '100%',
        textAlign: 'center',
        textAlignVertical: 'center',
        color: Colors.black,
        fontFamily: Assets.fonts.bold
    },
    tabBarLabel: {
        fontSize: getProportionalFontSize(11),
        color: Colors.primary,
        fontFamily: Assets.fonts.medium
    }
});
