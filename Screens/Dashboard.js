import React, { useEffect, useState } from 'react';
import {
    FlatList,
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    ImageBackground,
    Dimensions,
} from 'react-native';
import BaseContainer from '../Components/BaseContainer';
import Colors from '../Constants/Colors';
import { getProportionalFontSize, } from '../Services/CommonMethods';
import { useSelector, useDispatch } from 'react-redux';
import APIService from '../Services/APIService';
import Assets from '../Assets/Assets';
import Alert from '../Components/Alert';
import Constants from '../Constants/Constants';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Fontisto from 'react-native-vector-icons/Fontisto';
import Octicons from 'react-native-vector-icons/Octicons';
import Foundation from 'react-native-vector-icons/Foundation'
import Can from "../can/Can";
import { NavDataAction } from '../Redux/Actions/NavDataAction';
import { Searchbar } from 'react-native-paper';
import FormSubHeader from '../Components/FormSubHeader';
import EmptyDataContainer from '../Components/EmptyDataContainer';

export default Dashboard = props => {

    const { width, height } = Dimensions.get('window');

    // CONSTANTS
    const initial = "initial";
    const plans = "plans_mob";
    const masters = "Masters";
    const users_man = "user-management";
    const activity = "activity";
    const schedule = "schedule";

    // Hooks
    const [dashboardCount, setDashboardCount] = useState({});
    const [isLoading, setIsLoading] = React.useState(false);
    const [dashboardItems, setDashboardItems] = React.useState([]);
    const [selectedCard, setSelectedCard] = React.useState(initial);
    const [searchBarVisible, setSearchBarVisible] = React.useState(false);
    const [searchQuery, setSearchQuery] = React.useState('');

    // Redux Hooks
    const Labels = useSelector(state => state.Labels);
    const UserLogin = useSelector(state => state.User.UserLogin);
    const permissions = UserLogin?.permissions ?? {};
    const dispatch = useDispatch();
    let NavData = useSelector(state => state.NavData);

    //list multiple data arrays
    const userManagementData = [
        {
            id: 16,
            key: 'companies',
            title: '230k',
            subTitle: Labels.companies,// 'Companies',
            icon: 'business',
            color: Colors.dashboard.primary,
            bgColor: Colors.dashboard.primaryLight,
            navigateTo: 'CompanyListing',
            group_name: Constants.permissionsKey.companiesBrowse,// 'companies',
            iconLibrary: Ionicons,
            showCountKey: "companyCount"
        },
        {
            id: 2,
            key: 'branches',
            title: '230k',
            subTitle: Labels.Branches,// 'Branches',
            icon: 'add-business',
            color: Colors.dashboard.primary,
            bgColor: Colors.dashboard.primaryLight,
            navigateTo: 'BranchListing',
            group_name: Constants.permissionsKey.branchBrowse,// 'branch',
            iconLibrary: MaterialIcons,
            showCountKey: "branchCount"
        },
        // {
        //     id: 3,
        //     key: 'department',
        //     title: '$9745',
        //     subTitle: Labels.Departments,// 'Departments',
        //     icon: 'drag-indicator',
        //     color: Colors.dashboard.primary,
        //     bgColor: Colors.dashboard.primaryLight,
        //     navigateTo: 'DepartmentListing',
        //     group_name: Constants.permissionsKey.departmentsBrowse,// 'departments',
        //     iconLibrary: MaterialIcons,
        //     showCountKey: "departmentCount"
        // },
        {
            id: 5,
            key: 'patients',
            title: '$9745',
            subTitle: Labels.patients,// 'Patients',
            icon: 'hand-holding-medical',
            color: Colors.dashboard.primary,
            bgColor: Colors.dashboard.primaryLight,
            navigateTo: 'PatientListing',
            group_name: Constants.permissionsKey.patientsBrowse,// 'patients',
            iconLibrary: FontAwesome5,
            showCountKey: "patientCount"
        },
        {
            id: 4,
            key: 'employees',
            title: '1.423k',
            subTitle: Labels.employees,// 'Employees',
            icon: 'human-male-male',
            color: Colors.dashboard.primary,
            bgColor: Colors.dashboard.primaryLight,
            navigateTo: 'EmployeeListing',
            group_name: Constants.permissionsKey.employeesBrowse,// 'employees',
            iconLibrary: MaterialCommunityIcons,
            showCountKey: "employeeCount"
        },
        // {
        //     id: 11,
        //     key: 'contact_person',
        //     title: '1.423k',
        //     subTitle: Labels.ContactPerson,// "Contact Person",
        //     icon: 'person',
        //     color: Colors.dashboard.primary,
        //     bgColor: Colors.dashboard.primaryLight,
        //     navigateTo: 'ContactPersonList',
        //     group_name: Constants.permissionsKey.personBrowse,// 'ContactPerson',
        //     iconLibrary: MaterialIcons,
        //     showCountKey: false
        // },
    ]

    const plansData = [
        {
            id: 1,
            key: 'implementationPlans',
            title: '1.423k',
            subTitle: Labels.IP_mobile_dashboard,// "IP's",
            icon: 'notebook',
            color: Colors.dashboard.primary,
            bgColor: Colors.dashboard.primaryLight,
            navigateTo: 'ImplementationPlanStack',
            group_name: Constants.permissionsKey.ipBrowse,// 'ipPatients',
            iconLibrary: MaterialCommunityIcons,
            showCountKey: "ipCount"
        },
        {
            id: 2,
            key: 'FollowUps',
            title: '$9745',
            subTitle: Labels.followup,
            icon: 'timetable',
            color: Colors.dashboard.primary,
            bgColor: Colors.dashboard.primaryLight,
            navigateTo: 'ImplementationPlanStack',
            initialScreen: "FollowUpListing",
            group_name: Constants.permissionsKey.followupBrowse,// 'scheduleEmployees',
            iconLibrary: MaterialCommunityIcons,
            showCountKey: false
        },
    ]

    const mastersData = [

        {
            id: 12,
            key: 'word',
            title: '1.423k',
            subTitle: Labels.Word,// "Word",
            icon: 'file-word-box',
            color: Colors.dashboard.primary,
            bgColor: Colors.dashboard.primaryLight,
            navigateTo: 'WordStack',
            group_name: Constants.permissionsKey.wordsBrowse,// 'words',
            iconLibrary: MaterialCommunityIcons,
            showCountKey: false
        },
        {
            id: 13,
            key: 'paragraph',
            title: '1.423k',
            subTitle: Labels.paragraph,// "Paragraph",
            icon: 'parking',
            color: Colors.dashboard.primary,
            bgColor: Colors.dashboard.primaryLight,
            navigateTo: 'ParagraphStack',
            group_name: Constants.permissionsKey.paragraphsBrowse,// 'paragraphs',
            iconLibrary: FontAwesome5,
            showCountKey: false
        },
        {
            id: 1,
            key: 'catagories',
            title: '8.549k',
            subTitle: Labels.categories,// 'Categories',
            icon: 'sitemap',
            color: Colors.dashboard.primary,
            bgColor: Colors.dashboard.primaryLight,
            navigateTo: 'CategoryScreen',
            iconLibrary: MaterialCommunityIcons,
            group_name: Constants.permissionsKey.categoriesBrowse,// 'categories',
            showCountKey: false,
        },
        {
            id: 18,
            key: 'roles',
            title: '209',
            subTitle: Labels.Roles,// 'Categories',
            icon: 'persons',
            color: Colors.dashboard.primary,
            bgColor: Colors.dashboard.primaryLight,
            navigateTo: 'RolesStack',
            group_name: Constants.permissionsKey.roleBrowse,// 'categories',
            iconLibrary: Fontisto,
            showCountKey: false,
        },
        {
            id: 15,
            key: 'packages',
            title: '1.423k',
            subTitle: Labels.package,// 'Package',
            icon: 'card-membership',
            color: Colors.dashboard.primary,
            bgColor: Colors.dashboard.primaryLight,
            navigateTo: 'Packages',
            group_name: Constants.permissionsKey.packagesBrowse,// 'packages',
            iconLibrary: MaterialIcons,
            showCountKey: "packageCount"
        },
        {
            id: 14,
            key: 'modules',
            title: '$9745',
            subTitle: Labels.active_modules,// 'Modules',
            icon: 'view-module',
            color: Colors.dashboard.primary,
            bgColor: Colors.dashboard.primaryLight,
            navigateTo: 'ModulesListing',
            group_name: Constants.permissionsKey.modulesBrowse,// 'modules',
            iconLibrary: MaterialIcons,
            showCountKey: "moduelCount"
        },
        {
            id: 21,
            key: 'license',
            title: '209',
            subTitle: Labels.License,// 'License',
            icon: 'license',
            color: Colors.dashboard.primary,
            bgColor: Colors.dashboard.primaryLight,
            navigateTo: 'LicenseStack',
            group_name: Constants.permissionsKey.licencesBrowse,// 'categories',
            iconLibrary: MaterialCommunityIcons,
            showCountKey: false,
        },
    ]

    const scheduleData = [
        {
            id: 10,
            key: 'schedule',
            title: '$9745',
            subTitle: Labels.schedule,// 'Schedule',
            icon: 'timetable',
            color: Colors.dashboard.primary,
            bgColor: Colors.dashboard.primaryLight,
            navigateTo: 'ScheduleStack',
            group_name: Constants.permissionsKey.scheduleBrowse,// 'scheduleEmployees',
            iconLibrary: MaterialCommunityIcons,
            showCountKey: false,
        },
        // {
        //     id: 24,
        //     key: 'stampling',
        //     title: '209',
        //     subTitle: Labels.stampling,
        //     icon: 'building',
        //     color: Colors.dashboard.primary,
        //     bgColor: Colors.dashboard.primaryLight,
        //     navigateTo: 'StamplingStack',
        //     group_name: Constants.permissionsKey.stamplingBrowse,
        //     iconLibrary: FontAwesome,
        //     showCountKey: false,
        // },
        {
            id: 26,
            key: 'scheduleTemplate',
            title: '$9745',
            subTitle: Labels.ScheduleTemplate,
            icon: 'timetable',
            color: Colors.dashboard.primary,
            bgColor: Colors.dashboard.primaryLight,
            navigateTo: 'ScheduleTemplateStack',
            // group_name: Constants.permissionsKey.scheduleTemplateBrowse,// 'scheduleEmployees',
            group_name: Constants.permissionsKey.scheduleTemplateBrowse,// 'scheduleEmployees',
            iconLibrary: MaterialCommunityIcons,
            showCountKey: false
        },
        {
            id: 25,
            key: 'Leaves',
            title: '209',
            subTitle: Labels.Leaves,
            icon: 'building',
            color: Colors.dashboard.primary,
            bgColor: Colors.dashboard.primaryLight,
            navigateTo: 'LeavesStack',
            group_name: Constants.permissionsKey.leaveBrowse,
            iconLibrary: FontAwesome,
            showCountKey: false,
        },
        {
            id: 22,
            key: 'workShift',
            title: '209',
            subTitle: Labels.workShift,// 'workShift',
            icon: 'filter-tilt-shift',
            color: Colors.dashboard.primary,
            bgColor: Colors.dashboard.primaryLight,
            navigateTo: 'WorkShiftListing',
            group_name: Constants.permissionsKey.workShiftBrowse,
            iconLibrary: MaterialIcons,
            showCountKey: false,
        },
        {
            id: 27,
            key: 'Reports',
            title: '$9745',
            subTitle: Labels.reports,
            icon: 'graph',
            color: Colors.dashboard.primary,
            bgColor: Colors.dashboard.primaryLight,
            navigateTo: 'Reports',
            group_name: Constants.permissionsKey.reportsDelete,// 'scheduleEmployees',
            iconLibrary: Octicons,
            showCountKey: false
        },
        {
            id: 23,
            key: 'OV',
            title: '209',
            subTitle: Labels.ov,
            icon: 'filter-tilt-shift',
            color: Colors.dashboard.primary,
            bgColor: Colors.dashboard.primaryLight,
            navigateTo: 'OvStack',
            group_name: Constants.permissionsKey,
            iconLibrary: MaterialIcons,
            showCountKey: false,
        },
    ]

    const activityData = [
        {
            id: 7,
            key: 'activities',
            title: '$9745',
            subTitle: Labels.activities,// 'Activities',
            icon: 'timeline',
            color: Colors.dashboard.primary,
            bgColor: Colors.dashboard.primaryLight,
            navigateTo: 'ActivityStack',
            group_name: Constants.permissionsKey.activityBrowse,
            iconLibrary: MaterialIcons,
            showCountKey: "activityCount",
        },
        {
            id: 17,
            key: 'task',
            title: '1.423k',
            subTitle: Labels.tasks,// 'Tasks',
            icon: 'tasks',
            color: Colors.dashboard.primary,
            bgColor: Colors.dashboard.primaryLight,
            navigateTo: 'TaskStack',
            group_name: Constants.permissionsKey.taskBrowse,// 'task',
            iconLibrary: FontAwesome5,
            showCountKey: "taskCount"
        },
        {
            id: 1,
            key: 'activities statistics',
            title: '$9745',
            subTitle: Labels['activity-stats'],// 'Activities',
            icon: 'stats-chart',
            color: Colors.dashboard.primary,
            bgColor: Colors.dashboard.primaryLight,
            initialScreen: 'ActivityStats',
            navigateTo: 'ActivityStack',
            group_name: Constants.permissionsKey.activitySelfStats,
            iconLibrary: Ionicons,
            //showCountKey: "activityCount",
        },
        {
            id: 19,
            key: 'trahed_activities',
            title: '$9745',
            subTitle: Labels.trashedActivity,// 'Activities',
            icon: 'trash',
            color: Colors.dashboard.primary,
            bgColor: Colors.dashboard.primaryLight,
            navigateTo: 'TrashedActivity',
            group_name: Constants.permissionsKey.trashedActivites,
            iconLibrary: Ionicons,
            showCountKey: ""
        },
    ]

    const initialData = [
        {
            id: 7,
            key: 'activities',
            title: '$9745',
            subTitle: Labels.activities,// 'Activities',
            icon: 'timeline',
            color: Colors.dashboard.primary,
            bgColor: Colors.dashboard.primaryLight,
            navigateTo: '',
            //group_name: Constants.permissionsKey.activityBrowse,
            iconLibrary: MaterialIcons,
            showCountKey: "activityCount",
            onPress: () => { setSelectedCard(activity) }
        },
        {
            id: 1,
            key: 'plans',
            subTitle: Labels.plans_mob,// 'Activities',
            icon: 'clipboard-pencil',
            color: Colors.dashboard.primary,
            bgColor: Colors.dashboard.primaryLight,
            navigateTo: '',
            //group_name: Constants.permissionsKey.activityBrowse,
            iconLibrary: Foundation,
            //  showCountKey: "activityCount"
            onPress: () => { setSelectedCard(plans) }
        },
        {
            id: 2,
            key: 'user-management',
            subTitle: Labels['user-management'],// 'Activities',
            icon: 'users',
            color: Colors.dashboard.primary,
            bgColor: Colors.dashboard.primaryLight,
            navigateTo: '',
            // group_name: Constants.permissionsKey.activityBrowse,
            iconLibrary: FontAwesome,
            //   showCountKey: "activityCount"
            onPress: () => { setSelectedCard(users_man) }
        },
        {
            id: 10,
            key: 'schedule',
            title: '$9745',
            subTitle: Labels.schedule,// 'Schedule',
            icon: 'timetable',
            color: Colors.dashboard.primary,
            bgColor: Colors.dashboard.primaryLight,
            navigateTo: '',
            //group_name: Constants.permissionsKey.scheduleBrowse,// 'scheduleEmployees',
            iconLibrary: MaterialCommunityIcons,
            showCountKey: false,
            onPress: () => { setSelectedCard(schedule) }
        },
        {
            id: 8,
            key: 'journals',
            title: '1.423k',
            subTitle: Labels.Journals,// "Journals",
            icon: 'menu-book',
            color: Colors.dashboard.primary,
            bgColor: Colors.dashboard.primaryLight,
            navigateTo: 'JournalsListing',
            group_name: Constants.permissionsKey.journalBrowse,// 'journalPatients',
            iconLibrary: MaterialIcons,
            showCountKey: false,
        },
        {
            id: 9,
            key: 'deviations',
            title: '$9745',
            subTitle: Labels.Deviations,// 'Deviations',
            icon: 'sign-direction-remove',
            color: Colors.dashboard.primary,
            bgColor: Colors.dashboard.primaryLight,
            navigateTo: 'DeviationStack',
            group_name: Constants.permissionsKey.deviationBrowse,// 'deviationPatients',
            iconLibrary: MaterialCommunityIcons,
            showCountKey: false,
        },
        {
            id: 3,
            key: 'Masters',
            subTitle: Labels['Masters'],// 'Activities',
            icon: 'database',
            color: Colors.dashboard.primary,
            bgColor: Colors.dashboard.primaryLight,
            navigateTo: '',
            // group_name: Constants.permissionsKey.activityBrowse,
            iconLibrary: FontAwesome,
            //   showCountKey: "activityCount"
            onPress: () => { setSelectedCard(masters) }
        },
    ]

    useEffect(() => {
        //  APIService.getData('get-email-templates', UserLogin.access_token, null, "get-email-templates api");
        navigateFromNotification()
        dashboardCountDetails()
    }, []);

    useEffect(() => {
        createDashboardItems()
    }, [selectedCard]);

    const isUserHasModule = (moduleToCheck) => {
        let temp = UserLogin.assigned_module
        let isUserHasModule = temp.find((obj) => {
            return obj.module.name == Constants.allModules[moduleToCheck]
        })
        if (isUserHasModule)
            return true
        else
            return false
    }

    const navigateFromNotification = () => {
        if (!NavData && !NavData?.module && !NavData?.screen)
            return;
        let localNavData = { ...NavData };
        dispatch(NavDataAction(null));
        NavData = null;
        switch (localNavData.module) {
            case "activity":
                if (localNavData?.type == "trashed-activity") {
                    props.navigation.navigate('TrashedActivity')
                }
                else if (localNavData?.screen == "list") {
                    props.navigation.navigate('ActivityStack')
                }
                else if (localNavData?.screen == "detail" && localNavData?.id !== null && localNavData?.id !== undefined) {
                    let hasPerm = isUserHasModule(Constants.allModules.Activity);
                    if (hasPerm)
                        props.navigation.navigate('ActivityStack', { screen: "ActivityDetails", params: { itemId: localNavData?.id } })
                    else
                        props.navigation.navigate('ActivityStack')
                }
                break;
            case "task":
                if (localNavData?.screen == "list") {
                    props.navigation.navigate('TaskStack')
                }
                else if (localNavData?.screen == "detail" && localNavData?.id !== null && localNavData?.id !== undefined) {
                    props.navigation.navigate('TaskStack', { screen: "TaskDetails", params: { taskID: localNavData?.id } })
                }
                break;
            case "journal":
                if (localNavData?.screen == "list") {
                    props.navigation.navigate('JournalsListing')
                }
                else if (localNavData?.screen == "detail" && localNavData?.id !== null && localNavData?.id !== undefined) {
                    let hasPerm = isUserHasModule(Constants.allModules.Journal);
                    if (hasPerm)
                        props.navigation.navigate('JournalDetail', { itemID: localNavData?.id })
                    else
                        props.navigation.navigate('JournalsListing')
                }
                break;
            case "deviation":
                if (localNavData?.screen == "list") {
                    props.navigation.navigate('DeviationStack')
                }
                else if (localNavData?.screen == "detail" && localNavData?.id !== null && localNavData?.id !== undefined) {
                    let hasPerm = isUserHasModule(Constants.allModules.Deviation);
                    if (hasPerm)
                        props.navigation.navigate('DeviationStack', { screen: "DeviationDetails", params: { itemId: localNavData?.id } })
                    else
                        props.navigation.navigate('DeviationStack')
                }
                break;
            case "messages":
                if (localNavData?.screen == "list") {
                    props.navigation.navigate('MessagesStack')
                }
                else if (localNavData?.screen == "detail" && localNavData?.id !== null && localNavData?.id !== undefined) {
                    props.navigation.navigate('MessagesStack', { screen: "ChatScreen", params: { itemID: localNavData?.id } })
                }
                break;
            case "Module":
                if (localNavData?.type == "module-request") {
                    props.navigation.navigate('RequestsStack')
                }
                break;
            case "schedule":
                if (localNavData?.type == 'leave') {
                    props.navigation.navigate('LeavesStack')
                }
                else if (localNavData?.type == 'schedule') {
                    props.navigation.navigate('ScheduleStack')
                }
                break;
            case "plan":
                if (localNavData?.type == "ip") {
                    if (localNavData?.screen == "list") {
                        props.navigation.navigate('ImplementationPlanStack')
                    }
                    else if (localNavData?.screen == "detail" && localNavData?.id !== null && localNavData?.id !== undefined) {
                        props.navigation.navigate('ImplementationPlanStack', { screen: "ImplementationPlanDetail", params: { itemId: localNavData?.id } })
                    }
                }
                else if (localNavData?.type == "followup") {
                    if (localNavData?.screen == "list") {
                        props.navigation.navigate('ImplementationPlanStack', { screen: "FollowUpListing" })
                    }
                    else if (localNavData?.screen == "detail" && localNavData?.id !== null && localNavData?.id !== undefined) {
                        props.navigation.navigate('ImplementationPlanStack', { screen: "FollowUpDetails", params: { followUPId: localNavData?.id } })
                    }
                }
                break;
            case "user":
                if (localNavData?.type == 'branch') {
                    if (localNavData?.screen == "list") {
                        props.navigation.navigate('BranchListing')
                    }
                    else if (localNavData?.screen == "detail" && localNavData?.id !== null && localNavData?.id !== undefined) {
                        props.navigation.navigate("CommonUserProfile", { itemId: localNavData?.id, url: Constants.apiEndPoints.userView, user_type_id: '11' })
                    }
                }
                else if (localNavData?.type == 'patient') {
                    if (localNavData?.screen == "list") {
                        props.navigation.navigate('PatientListing')
                    }
                    else if (localNavData?.screen == "detail" && localNavData?.id !== null && localNavData?.id !== undefined) {
                        props.navigation.navigate("CommonUserProfile", { itemId: localNavData?.id, url: Constants.apiEndPoints.userView, user_type_id: '6' })
                    }
                }
                else if (localNavData?.type == 'employee') {
                    if (localNavData?.screen == "list") {
                        props.navigation.navigate('EmployeeListing')
                    }
                    else if (localNavData?.screen == "detail" && localNavData?.id !== null && localNavData?.id !== undefined) {
                        props.navigation.navigate("CommonUserProfile", { itemId: localNavData?.id, url: Constants.apiEndPoints.userView, user_type_id: '3' })
                    }
                }
                break;
            default:
                break;
        }
    }

    const dashboardCountDetails = async () => {
        setIsLoading(true)
        let response = await APIService.getData(Constants.apiEndPoints.dashboard, UserLogin.access_token, null, "dashboardCountAPI");
        if (!response.errorMsg) {
            // console.log("payload getUserDetails", response.data.payload);
            setDashboardCount({ ...response.data.payload })
            // console.log("data", response.data.success);
            setIsLoading(false);
        }
        else {
            setIsLoading(false);
            Alert.showAlert(Constants.danger, response.errorMsg);
        }
    }


    const createDashboardItems = () => {

        let temp = []

        if (selectedCard == initial) {
            initialData.forEach((item) => {
                if (
                    Can(item.group_name, [...permissions]) || !item.group_name
                ) {
                    temp.push(item)
                }
            })
        }
        else if (selectedCard == plans) {
            plansData.forEach((item) => {
                if (
                    Can(item.group_name, [...permissions]) || !item.group_name
                ) {
                    temp.push(item)
                }
            })
        }
        else if (selectedCard == masters) {
            mastersData.forEach((item) => {
                if (
                    Can(item.group_name, [...permissions]) || !item.group_name
                ) {
                    temp.push(item)
                }
            })
        }
        else if (selectedCard == users_man) {
            userManagementData.forEach((item) => {
                if (
                    Can(item.group_name, [...permissions]) || !item.group_name
                ) {
                    temp.push(item)
                }
            })
        }
        else if (selectedCard == activity) {
            activityData.forEach((item) => {
                if (
                    Can(item.group_name, [...permissions]) || !item.group_name
                ) {
                    temp.push(item)
                }
            })
        }
        else if (selectedCard == schedule) {
            scheduleData.forEach((item) => {
                if (
                    Can(item.group_name, [...permissions]) || !item.group_name
                ) {
                    temp.push(item)
                }
            })
        }
        setDashboardItems(temp)
    }

    const filterListData = () => {
        if (searchQuery) {
            return dashboardItems.filter((item) => {
                if (item?.subTitle?.toLocaleLowerCase()?.includes(searchQuery?.toLocaleLowerCase()))
                    return true;
                else
                    return false;
            })
        }
        else {
            return dashboardItems;
        }
    }

    const _CardData = () => {
        return (
            <FlatList
                keyboardShouldPersistTaps="always"
                horizontal={false}
                numColumns={2}
                ListEmptyComponent={<EmptyDataContainer style={{ marginTop: 10, color: Colors.white }} />}
                keyExtractor={(item, index) => '' + item.id}
                showsVerticalScrollIndicator={false}
                columnWrapperStyle={{ justifyContent: "space-evenly" }}
                data={filterListData()}
                renderItem={({ item, index }) => {
                    return (
                        <TouchableOpacity
                            style={[styles.card, { width: '38%', height: (width / 100) * 37, }]}
                            onPress={() => {
                                if (item.navigateTo && item.initialScreen)
                                    props.navigation.navigate(item.navigateTo, { screen: item.initialScreen });
                                else if (item.navigateTo)
                                    props.navigation.navigate(item.navigateTo);
                                else if (item.onPress)
                                    item.onPress()
                            }}
                            activeOpacity={0.9}
                        >

                            <View style={styles.textContainer}>
                                <item.iconLibrary
                                    name={item.icon}
                                    size={getProportionalFontSize(32)}
                                    color={Colors.primary}
                                />
                                <Text style={styles.cardTextSubtitle}>{item.subTitle}</Text>
                            </View>
                            {
                                item.showCountKey && dashboardCount[item.showCountKey] >= 0
                                    ? <View style={styles.counterView}>
                                        <Text style={{ fontFamily: Assets.fonts.bold, color: Colors.white, fontSize: getProportionalFontSize(13) }}>{dashboardCount[item.showCountKey] > 99 ? '99+' : dashboardCount[item.showCountKey]}</Text>
                                    </View> : null
                            }
                        </TouchableOpacity>
                    );

                }}
            />
        );
    };

    // console.log('UserLogin', UserLogin.user_type_id);
    // Render view
    if (isLoading)
        return <ProgressLoader />
    return (
        <BaseContainer
            title={props?.route?.name}
            leftIcon={"list"}
            // leftIconColor={Colors.primary}
            rightIcon={searchBarVisible ? "close" : "search"}
            onPressRightIcon={() => {
                setSearchBarVisible(!searchBarVisible)
                setSearchQuery('')
            }}
            onPressLeftIcon={props.navigation.openDrawer}
            titleStyle={{ color: Colors.white }}>
            <ImageBackground
                source={Assets.images.homebg}
                resizeMode="cover"
                style={{ flex: 1 }}>

                {searchBarVisible
                    ? <Searchbar
                        autoFocus={true}
                        placeholder={Labels.search}
                        style={styles.searchBarStyle}
                        onChangeText={(text) => { setSearchQuery(text) }}
                        value={searchQuery}
                        inputStyle={{ fontSize: getProportionalFontSize(16) }}
                    /> : null}

                {selectedCard != initial
                    ? <FormSubHeader
                        leftIconColor={searchBarVisible ? Colors.primary : Colors.white}
                        titleStyle={{ color: searchBarVisible ? Colors.primary : Colors.white }}
                        leftIconName={'chevron-back-circle-outline'}
                        onPressLeftIcon={
                            () => { setSelectedCard(initial); }
                        }
                        title={
                            Labels[selectedCard]
                        }
                    /> : null}

                <View style={styles.dashboardContainer}>

                    <View style={styles.cardContainer}>
                        <_CardData navigation={props.navigation} />
                    </View>

                </View>
            </ImageBackground>

        </BaseContainer>
    );
};

const styles = StyleSheet.create({
    dashboardContainer: {
        // backgroundColor: Colors.white,
        flex: 1,
    },
    greeting: {
        width: '100%',
        flexDirection: 'row',
    },
    greetingText: {
        fontSize: getProportionalFontSize(14),
        //fontWeight: '700',
        fontFamily: Assets.fonts.bold,
    },
    cardContainer: {
        width: '100%',
        // paddingVertical: 20,
        borderWidth: 0,
        //paddingHorizontal: 16,
    },
    searchBarStyle: { marginTop: Constants.formFieldTopMargin, marginHorizontal: Constants.globalPaddingHorizontal, borderRadius: 15 },
    card: {
        padding: 10,
        paddingVertical: 15,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: Colors.white,
        marginVertical: 12,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 15,
        elevation: 10,
        shadowColor: Colors.primary,
        // Platform.OS == 'ios'
        //     ? Colors.shadowColorIosDefault
        //     : Colors.shadowColorAndroidDefault,
        shadowRadius: 8,
        borderRadius: 25,
    },
    cardTextTitle: {
        fontFamily: Assets.fonts.semiBold,
        fontSize: getProportionalFontSize(13),
        color: Colors.black,
        marginBottom: 5,
    },
    cardTextSubtitle: {
        fontFamily: Assets.fonts.bold,
        fontSize: getProportionalFontSize(15),
        color: Colors.primary,
        textAlign: "center",
        marginTop: 5
    },
    counterView: {
        position: "absolute",
        top: 17,
        right: -15,
        backgroundColor: Colors.primary,
        borderRadius: 20,
        alignItems: "center",
        justifyContent: "center",
        width: 35,
        height: 35,
        backgroundColor: Colors.primary,
        borderWidth: 1.5,
        borderColor: Colors.white,
    },
    iconContainer: {
        borderRadius: 50,
        width: 45,
        //flex: 1,
        borderWidth: 0,
        // padding: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    textContainer: {
        //borderRadius: 50,
        width: '100%',
        borderWidth: 0,
        //flex: 1,
        //paddingHorizontal: 5,
        // marginLeft: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    iconBg: {
        height: 45,
        width: 45,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 50,
    },
});
