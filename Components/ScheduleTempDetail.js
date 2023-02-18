import React, { useState, Fragment, useCallback } from 'react';
import { StyleSheet, View, ScrollView, Text, TouchableOpacity, Dimensions, FlatList, ActivityIndicator } from 'react-native';
import EmptyList from './EmptyList';
import Colors from '../Constants/Colors';
import { getProportionalFontSize, formatDateForAPI } from '../Services/CommonMethods';
import { useSelector } from 'react-redux';
import BaseContainer from './BaseContainer';
import Constants from '../Constants/Constants';
import APIService from '../Services/APIService';
import Alert from '../Components/Alert';
import Assets from '../Assets/Assets';
import TransparentLoader from '../Components/TransparentLoader';
import ScheduleListComp from '../Components/ScheduleListComp';
import ScheduleWeekComp from '../Components/ScheduleWeekComp';
import { Modal, Portal, } from 'react-native-paper';
import FilterShedule from '../Screens/FilterSchedule';
import ScheduleDayView from '../Components/ScheduleDayView';
import ScheduleMonthView from '../Components/ScheduleMonthView';

const ScheduleListingNew = (props) => {
    const routeParm = props?.route?.params ?? {}
    // console.log("scheduleTemplateId", routeParm.scheduleTemplateId)
    const day = "day";
    const week = "week";
    const month = "month";
    const list = "list";

    // REDUX hooks   
    const UserLogin = useSelector(state => state.User.UserLogin);
    const labels = useSelector(state => state.Labels);
    const [selectedTab, setSelectedTab] = React.useState(month);

    //hooks
    const [scheduleList, setScheduleList] = React.useState([]);
    const [isLoading, setIsLoading] = React.useState(true);
    const [isRefreshing, setIsRefreshing] = React.useState(false);
    const [paginationLoading, setPaginationLoading] = React.useState(false);
    const [page, setPage] = React.useState(0);
    const [isModalVisible, setIsModalVisible] = React.useState(false);
    const [param, setParam] = React.useState({});
    const [dateParam, setDateParam] = React.useState({});

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

    // React.useEffect(() => {
    //     getScheduleList(null, null, { start_date: formatDateForAPI(new Date()) })
    // }, [])

    const onRequestClose = () => {
        setIsModalVisible(false);
    }

    const openModel = () => {
        setIsModalVisible(true);
    }

    const getScheduleList = async (page, refresh, filterParams) => {
        if (refresh) setIsRefreshing(true);
        else if (!page) setIsLoading(true);
        else setPaginationLoading(true);
        let params = {
            perPage: Constants.perPage,
            page: page ?? 1,
            user_id: UserLogin.user_type_id != 2 ? UserLogin.id : null,
            schedule_template_id: routeParm?.scheduleTemplateId ?? ""
        };

        if (filterParams)
            params = { ...params, ...filterParams }

        if (param)
            params = { ...params, ...param }

        let url = Constants.apiEndPoints.scheduleList;
        let response = await APIService.postData(url, params, UserLogin.access_token, null, 'ScheduleListAPI');
        if (!response.errorMsg) {
            if (!page) {
                setPage(1);
                setScheduleList(response.data.payload.data ? response.data.payload.data : response.data.payload);
                setIsLoading(false);
                if (refresh) setIsRefreshing(false);
            } else {
                let tempData = response.data.payload.data ? response.data.payload.data : response.data.payload;

                let tempList = [...scheduleList];
                // let tempCurrList = [...currentlyLoggedInData];
                tempList = tempList.concat(tempData);
                //  tempCurrList = tempCurrList.concat(tempCurrentlyLoggedInData);
                setPage(page);
                setScheduleList([...tempList]);
                //  setCurrentlyLoggedInData(tempCurrList)
                setPaginationLoading(false);
            }
        } else {
            if (!page) setIsLoading(false);
            else setPaginationLoading(false);
            if (refresh) setIsRefreshing(false);
            Alert.showAlert(Constants.danger, response.errorMsg);
        }
    }

    const onPressWeekTab = () => {
        if (selectedTab == week)
            return;
        setParam({})
        setSelectedTab(week)
        let curr_date = new Date();
        let start_date = new Date();
        start_date.setFullYear(curr_date.getFullYear() - 2);
        let end_date = new Date();
        end_date.setFullYear(curr_date.getFullYear() + 2);
        getScheduleList(null, null, {
            start_date: formatDateForAPI(start_date), end_date: formatDateForAPI(end_date),
            perPage: null,
            page: null,
        })
    }

    const onPressListTab = () => {
        if (selectedTab == list)
            return;
        setParam({})
        setSelectedTab(list)
        getScheduleList(null, null, { start_date: formatDateForAPI(new Date()) })
    }
    const onPressMonthTab = () => {
        if (selectedTab == month)
            return;
        setParam({})
        setSelectedTab(month);
        // getScheduleList(null, null, { start_date: formatDateForAPI(new Date()) })
    }

    return (
        <BaseContainer
            onPressLeftIcon={() => { props.navigation.pop() }}
            leftIcon="arrow-back"
            leftIconSize={24}
            title={labels["ScheduleTemplate"]}
            onPressRightIcon={() => openModel()}
            leftIconColor={Colors.primary}
            rightIcon={isUserHasModule() ? "filter-list" : null}
        >
            <View style={{ flex: 1 }}>

                {
                    !isUserHasModule()
                        ? <EmptyList navigation={props.navigation} noModuleMsg={true} />
                        : <View style={styles.mainView}>

                            {/* Loader */}
                            <TransparentLoader isLoading={isLoading} />

                            {/* Top Tab Bar */}
                            <View style={styles.tabBarMainView}>

                                {/* month */}
                                <TouchableOpacity
                                    onPress={onPressMonthTab}
                                    style={[styles.tabView, { backgroundColor: selectedTab == month ? Colors.primary : Colors.white, }]}>
                                    <Text numberOfLines={2}
                                        style={[styles.tabText, { color: selectedTab == month ? Colors.white : Colors.primary }]}>{labels.month}</Text>
                                </TouchableOpacity>

                                {/* week */}
                                <TouchableOpacity
                                    onPress={onPressWeekTab}
                                    style={[styles.tabView, { backgroundColor: selectedTab == week ? Colors.primary : Colors.white, }]}>
                                    <Text numberOfLines={2}
                                        style={[styles.tabText, { color: selectedTab == week ? Colors.white : Colors.primary }]}>{labels.week}</Text>
                                </TouchableOpacity>

                                {/* day */}
                                <TouchableOpacity
                                    onPress={() => {
                                        setParam({})
                                        setSelectedTab(day)
                                    }}
                                    style={[styles.tabView, { backgroundColor: selectedTab == day ? Colors.primary : Colors.white, }]}>
                                    <Text numberOfLines={2}
                                        style={[styles.tabText, { color: selectedTab == day ? Colors.white : Colors.primary }]}>{labels.day}</Text>
                                </TouchableOpacity>

                                {/* list */}
                                <TouchableOpacity
                                    onPress={onPressListTab}
                                    style={[styles.tabView, { backgroundColor: selectedTab == list ? Colors.primary : Colors.white, }]}>
                                    <Text numberOfLines={2}
                                        style={[styles.tabText, { color: selectedTab == list ? Colors.white : Colors.primary }]}>{labels.list}</Text>
                                </TouchableOpacity>
                            </View>

                            {
                                selectedTab == list
                                    ? <ScheduleListComp
                                        scheduleList={scheduleList}
                                        paginationLoading={paginationLoading}
                                        isRefreshing={isRefreshing}
                                        getScheduleList={getScheduleList}
                                        page={page}
                                    />
                                    : selectedTab == week && !isLoading
                                        ? <ScheduleWeekComp
                                            scheduleList={scheduleList}
                                        />
                                        : selectedTab == month
                                            ? <ScheduleMonthView scheduleTemplateId={routeParm?.scheduleTemplateId} setDateParam={setDateParam} isLoading={isLoading} setIsLoading={setIsLoading} />
                                            : selectedTab == day
                                                ? <ScheduleDayView scheduleTemplateId={routeParm?.scheduleTemplateId} scheduleList={scheduleList} isLoading={isLoading} setIsLoading={setIsLoading} />
                                                : null
                            }

                            {/* MODAL */}
                            <Portal>
                                <Modal
                                    animationType="slide"
                                    transparent={true}
                                    style={{ justifyContent: "center", alignItems: 'center' }}
                                    visible={isModalVisible}
                                    onRequestClose={onRequestClose}
                                >
                                    <FilterShedule
                                        labels={labels}
                                        onRequestClose={onRequestClose}
                                        UserLogin={UserLogin}
                                        filterAPI={(filterParams) => {
                                            setParam(filterParams)
                                            setSelectedTab(list)
                                            getScheduleList(null, null, filterParams)
                                        }}
                                    />

                                </Modal>
                            </Portal>
                        </View>
                }
            </View>

        </BaseContainer>
    )
}

export default ScheduleListingNew

const styles = StyleSheet.create({
    mainView: {
        flex: 1,
        //paddingHorizontal: 24,
        backgroundColor: Colors.navBackgroundWhite,
        // paddingBottom: 20,
    },
    fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        backgroundColor: Colors.primary,
        bottom: 0,
    },
    container: {
        margin: Constants.globalPaddingHorizontal,
        paddingHorizontal: Constants.globalPaddingHorizontal,
        backgroundColor: Colors.white,
        marginBottom: 20,
        borderRadius: 20,
        elevation: 10,
        shadowOffset: { width: 3, height: 3, },
        shadowOpacity: 10,
        shadowColor: Platform.OS == "ios" ? Colors.shadowColorIosDefault : Colors.shadowColorAndroidDefault,
        shadowRadius: 20,
    },
    tabBarMainView: { flexDirection: "row", alignItems: "center", width: "100%", marginTop: Constants.formFieldTopMargin, },
    tabView: {
        height: 43, justifyContent: "center", alignItems: "center", padding: 3, flex: 1
    },
    tabText: { fontFamily: Assets.fonts.bold, fontSize: getProportionalFontSize(13), width: "100%", textAlign: "center" },
})