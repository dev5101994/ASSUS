import React from 'react';
import { View, StyleSheet, Text, SafeAreaView, TouchableOpacity, TextInput, } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Colors from '../Constants/Colors';
import { getProportionalFontSize } from '../Services/CommonMethods';
import CustomButton from './CustomButton';
import Constants from '../Constants/Constants'
import APIService from '../Services/APIService';
import Assets from '../Assets/Assets';
import ProgressLoader from './ProgressLoader';
import Alert from './Alert';
import EmptyDataContainer from './EmptyDataContainer';
import { ScrollView, FlatList } from 'react-native-gesture-handler'
import { useSelector, useDispatch } from 'react-redux'

export default ActionSheetComp = props => {
    // console.log("------------props.APIDetails------------", props.APIDetails)

    let selectedTemp = [];
    if (props.APIDetails?.selectedData)
        selectedTemp = [...props.APIDetails?.selectedData]

    // useState hooks
    const [isLoading, setIsLoading] = React.useState(false);
    const [paginationLoading, setPaginationLoading] = React.useState(false);
    const [listData, setListData] = React.useState(props.APIDetails?.data ?? []);
    const [permanentListData, setPermanentListData] = React.useState(props.APIDetails?.data ?? []);
    const [selectedIndexList, setSelectedIndexList] = React.useState({});
    const [selectedData, setSelectedData] = React.useState(selectedTemp);
    const [searchText, setSearchText] = React.useState('');
    const [shouldLoadMore, setShouldLoadMore] = React.useState(props.APIDetails?.loadMoreVisible);

    // redux hooks
    const labels = useSelector(state => state.Labels);

    // useEffects
    React.useEffect(() => { initialLogic() }, [])

    const initialLogic = async () => {
        if (props.APIDetails?.url != '' && permanentListData?.length <= 0) {
            await fetchData();
        }
        else if (selectedData?.length > 0 && permanentListData?.length > 0) {
            selectAlreadySelectedData();
        }
    }

    // helper methods
    const selectAlreadySelectedData = (data) => {

        let tempData = data ?? [...permanentListData];
        let tempSelectedIndexList = { ...selectedIndexList };
        tempData.map((item, index) => {
            selectedData?.map((innerItem, innerIndex) => {
                if (props.keyToCompareData && innerItem?.[props?.keyToCompareData] == item[props.keyToCompareData] && !innerItem.garbage) {
                    let indexString = data ? ('' + (permanentListData.length + index)) : ('' + index);
                    tempSelectedIndexList[indexString] = ("" + innerIndex);
                }
                else if (innerItem == item && !innerItem.garbage) {
                    let indexString = data ? ('' + (permanentListData.length + index)) : ('' + index);
                    tempSelectedIndexList[indexString] = ("" + innerIndex);
                }
            })
        })
        setSelectedIndexList({ ...tempSelectedIndexList });
    }

    const onPressListItem = async (item, index) => {
        let indexString = '' + index;
        let tempSelectedIndexList = { ...selectedIndexList };
        if (props.multiSelect) {
            let tempSelectedData = [...selectedData];
            if (!tempSelectedIndexList[indexString]) {
                if (props.keyToShowData == "designation") {
                    if (index == "0") {
                        if (!tempSelectedIndexList[2] && !tempSelectedIndexList[3]) {
                            item['garbage'] = false;
                            tempSelectedData.push(item);
                            // tempSelectedData.push({ name: item.name });
                            tempSelectedIndexList[indexString] = "" + (tempSelectedData.length - 1);
                        } else {
                            Alert.showToast(labels.working_or_old_age_can_not_be_minor_child);
                        }
                    } else if (index == "2") {
                        if (!tempSelectedIndexList[0]) {
                            item['garbage'] = false;
                            tempSelectedData.push(item);
                            // tempSelectedData.push({ name: item.name });
                            tempSelectedIndexList[indexString] = "" + (tempSelectedData.length - 1);
                        } else {
                            Alert.showToast(labels.minor_child_can_not_be_a_worker);
                        }
                    } else if (index == "3") {
                        if (!tempSelectedIndexList[0]) {
                            item['garbage'] = false;
                            tempSelectedData.push(item);
                            // tempSelectedData.push({ name: item.name });
                            tempSelectedIndexList[indexString] = "" + (tempSelectedData.length - 1);
                        } else {
                            Alert.showToast(labels.minor_child_can_not_be_a_old_age);
                        }
                    } else {
                        item['garbage'] = false;
                        tempSelectedData.push(item);
                        // tempSelectedData.push({ name: item.name });
                        tempSelectedIndexList[indexString] = "" + (tempSelectedData.length - 1);
                    }

                }
                else {
                    item['garbage'] = false;
                    tempSelectedData.push(item);
                    // tempSelectedData.push({ name: item.name });
                    tempSelectedIndexList[indexString] = "" + (tempSelectedData.length - 1);
                }
            }
            else {
                let tempObj = tempSelectedData[tempSelectedIndexList[indexString]]
                tempObj['garbage'] = true;
                tempSelectedData[tempSelectedIndexList[indexString]] = tempObj;
                tempSelectedIndexList[indexString] = false;
            }
            setSelectedData([...tempSelectedData]);
            setSelectedIndexList({ ...tempSelectedIndexList });
        }
        else {
            let value = null;
            if (!tempSelectedIndexList[indexString])
                value = true;
            else
                value = false;
            tempSelectedIndexList = {};
            tempSelectedIndexList[indexString] = value;
            setSelectedIndexList(tempSelectedIndexList);
            if (props.onPressItem) {
                props.changeAPIDetails({ selectedData: value ? [item] : [], loadMoreVisible: shouldLoadMore })
                props.onPressItem(value ? item : {});
                props.closeActionSheet()
            }
        }
    }

    const isViewSelected = (index) => {
        let indexString = '' + index;
        return selectedIndexList[indexString];
    }

    const renderListView = ({ item, index }) => {
        return (
            <TouchableOpacity
                onPress={() => { onPressListItem(item, index) }}
                style={{ ...styles.listViewCard, backgroundColor: isViewSelected(index) ? (props.listBarColor ?? Colors.primary) : Colors.white }}>
                <Text style={{ ...styles.listText, color: isViewSelected(index) ? Colors.white : (props.listBarColor ?? Colors.primary), }}>{props.keyToShowData ? item[props.keyToShowData] : item}</Text>
            </TouchableOpacity>
        )
    }

    const onPressCheck = () => {
        let isDataSelected = false;
        let i = 0;
        let actualSelectedData = [];
        // console.log('---------------------', selectedData)
        while (i < selectedData.length) {
            if (!selectedData[i]?.garbage) {
                isDataSelected = true;
                actualSelectedData.push(selectedData[i])
            }
            i++;
        }
        // if (!isDataSelected) {
        //     Alert.showToast(labels.please_select_some_data_first);
        //     return;
        // }
        // console.log('actualSelectedData', actualSelectedData)
        if (props.onPressItem) {
            props.changeAPIDetails({ selectedData: [...actualSelectedData], loadMoreVisible: shouldLoadMore })
            props.onPressItem(actualSelectedData);
        }
        props.closeActionSheet()
    }

    const onSearch = (text) => {
        setSearchText(text);
    }

    const searchFromAPI = async () => {
        if (props.APIDetails?.url != '') {
            if (searchText && !isLoading)
                fetchData(null, searchText)
        }
    }


    const onPressAdd = () => {
        if (searchText?.length > 0 && props.onPressItem) {
            let item = {};
            let tempPermanentData = [...permanentListData]
            if (props.multiSelect) {
                let tempData = [...selectedData];
                if (props.keyToShowData) {
                    item[props.keyToShowData] = searchText;
                    // if (props.keyToCompareData)
                    //     item[props.keyToShowData] = searchText;
                    tempData.push(item)
                    tempPermanentData.push(item)
                    props.changeAPIDetails({ selectedData: [...tempData], data: [...tempPermanentData], loadMoreVisible: shouldLoadMore })
                    if (props.onPressItem)
                        props.onPressItem([...tempData]);
                }
                else {
                    item = searchText;
                    tempData.push(item);
                    tempPermanentData.push(item);
                    props.changeAPIDetails({ selectedData: [...tempData], data: [...tempPermanentData], loadMoreVisible: shouldLoadMore })
                    if (props.onPressItem)
                        props.onPressItem([...tempData]);
                    props.onPressItem(item);
                }
            }
            else {
                if (props.keyToShowData) {
                    item[props.keyToShowData] = searchText;
                    // if (props.keyToCompareData)
                    //     item[props.keyToShowData] = searchText;
                    tempPermanentData.push(item)
                    props.changeAPIDetails({ selectedData: [item], data: [...tempPermanentData], loadMoreVisible: shouldLoadMore })
                    if (props.onPressItem)
                        props.onPressItem(item);
                }
                else {
                    item = searchText;
                    tempPermanentData.push(item)
                    props.changeAPIDetails({ selectedData: [item], data: [...tempPermanentData], loadMoreVisible: shouldLoadMore })
                    if (props.onPressItem)
                        props.onPressItem(item);
                }
            }
            props.closeActionSheet();
        }
    }

    const loadMore = () => {
        fetchData(props.APIDetails.page + 1);

    }

    const renderFooter = () => {
        if (props.APIDetails?.url == '')
            return null;
        if (!props.APIDetails?.page || !props.APIDetails?.perPage)
            return null;
        if (!shouldLoadMore)
            return null
        return (
            // Load More button
            <CustomButton
                onPress={loadMore}
                isLoading={paginationLoading}
                title={labels.load_more}
                style={{ ...styles.loadMoreButton, backgroundColor: props.listBarColor ?? Colors.primary }} />
        );
    };


    // API methods
    const fetchData = async (page, searchQuery) => {
        // //console.log("page--------------------", page)
        let currPage = searchQuery ? 1 : props.APIDetails.page;
        if (!page) {
            setIsLoading(true);
        }
        else {
            currPage = page;
            setPaginationLoading(true)
        }
        let response = null;
        if (props.APIDetails.method == 'post') {
            response = await APIService.postData(props.APIDetails.url + (props.APIDetails.perPage ? ('?perPage=' + 30) : "") + (props.APIDetails.page ? ('&page=' + currPage) : ""),
                searchQuery ? { ...props.APIDetails.params, [props.keyToShowData]: searchQuery } : props.APIDetails.params, props.APIDetails.token, props.APIDetails.controller, props.APIDetails.debugMsg);
        }
        else if (props.APIDetails.method == 'get') {
            response = await APIService.getData(props.APIDetails.url + (props.APIDetails.perPage ? ('?perPage=' + 30) : "") + (props.APIDetails.page ? ('&page=' + currPage) : ""),
                props.APIDetails.token, props.APIDetails.controller, props.APIDetails.debugMsg);
        }
        if (!response.errorMsg) {
            let tempShouldLoadMore = true;
            if (response.data.payload?.data?.length <= 0 || response.data.payload?.length <= 0 || response.data.payload?.data?.length < 30 || response.data.payload?.length < 30) {
                tempShouldLoadMore = false;
                setShouldLoadMore(tempShouldLoadMore);
            }
            selectAlreadySelectedData(response.data.payload.data ?? response.data.payload);
            if (!page) {
                setListData(response.data.payload.data ?? response.data.payload);
                setPermanentListData(response.data.payload.data ?? response.data.payload)
                props.changeAPIDetails({ data: searchQuery ? [] : response.data.payload.data ? response.data.payload.data : response.data.payload, loadMoreVisible: tempShouldLoadMore, })
                setIsLoading(false);
            }
            else {
                let tempData = [];
                tempData = tempData.concat([...permanentListData]);
                tempData = tempData.concat(response.data.payload.data ?? response.data.payload)
                setListData([...tempData]);
                setPermanentListData([...tempData])
                props.changeAPIDetails({ page: props.APIDetails.page + 1, data: [...tempData], loadMoreVisible: tempShouldLoadMore })
                setPaginationLoading(false)
            }
        }
        else {
            setIsLoading(false);
            setPaginationLoading(false)
            Alert.showBasicAlert(response.errorMsg);
        }
    }

    // Render view
    // console.log('selectedIndexList', selectedIndexList)
    return (
        // Main View
        <SafeAreaView >
            <View style={styles.mainView}>
                {/* Top floating black dash */}
                <View style={styles.blackDash} />

                {/* top two buttons view */}
                <View style={styles.twoButtonView}>
                    {/* down button */}
                    <View style={{ width: "15%" }}>
                        <TouchableOpacity
                            onPress={() => {
                                props.changeAPIDetails({ loadMoreVisible: shouldLoadMore })
                                props.closeActionSheet()
                            }}
                            style={styles.iconView}>
                            <Icon onPress={props.closeActionSheet} name="chevron-down-outline" style={{ ...styles.icon, color: props.listBarColor ?? Colors.primary }} />
                        </TouchableOpacity>
                    </View>

                    {/* Title */}
                    <Text numberOfLines={2} style={[styles.titleStyle, { color: props.listBarColor ?? Colors.primary, width: "70%" }]}>{props.title}</Text>

                    {/* check button */}
                    <View style={{ width: "15%" }}>
                        {props.multiSelect
                            ? <TouchableOpacity onPress={onPressCheck}
                                style={styles.iconView}>
                                <Icon name="checkmark-outline" style={{ ...styles.icon, color: props.listBarColor ?? Colors.primary }} />
                            </TouchableOpacity>
                            : null}
                    </View>
                </View>


                {/* search bar */}
                {props.APIDetails?.url != ''
                    ? <View style={styles.searchBarMainView}>
                        <View rounded style={styles.searchBarItemView}>

                            <TextInput
                                placeholder={labels.search}
                                value={searchText}
                                onChangeText={onSearch}
                                placeholderTextColor={Colors.placeholderTextColor}
                                keyboardType="default"
                                style={styles.searchInput}
                                onSubmitEditing={() => { searchFromAPI() }}
                            />
                            {(props.addButton && listData?.length <= 0)
                                ? <Icon
                                    onPress={onPressAdd}
                                    name="add-circle-outline"
                                    style={[styles.addIconStyle, { color: props.listBarColor ?? Colors.primary }]} />
                                : null}
                            <Icon name="search" onPress={searchFromAPI} style={styles.searchIcon} />
                        </View>
                    </View> : null}

                {/* list view */}
                {isLoading
                    ? <ProgressLoader loadingContainer={styles.progressLoader} loader={(props.listBarColor ? props.listBarColor : Colors.primary)} />
                    : <View style={{ marginTop: Constants.formFieldTopMargin, height: '100%' }}>
                        {listData?.length == 0
                            ? <EmptyDataContainer />
                            : <ScrollView showsVerticalScrollIndicator={false} style={{ width: '100%', }}>
                                <FlatList
                                    // ListEmptyComponent={<EmptyDataContainer />}
                                    onEndReached={() => {
                                        //console.log('reached hora getAPIDetails', listData)
                                    }}
                                    scrollEnabled={true}
                                    data={listData}
                                    keyExtractor={(item, index) => ('' + index)}
                                    renderItem={renderListView}
                                    style={styles.flatListContainerStyle}
                                    ListFooterComponent={renderFooter}
                                />
                            </ScrollView>}
                    </View>
                }
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    mainView: {
        height: "90%",
        backgroundColor: Colors.backgroundColor,
        // borderWidth: 10
    },
    blackDash: { backgroundColor: 'grey', borderRadius: 10, width: 45, height: 7, marginTop: 5, alignSelf: 'center' },
    titleStyle: {
        fontSize: getProportionalFontSize(15), fontFamily: Assets.fonts.bold, color: Colors.primary, textAlign: "center",
    },
    flatListContainerStyle: {
        paddingHorizontal: 16,
        width: '100%',
        height: "100%",
        backgroundColor: Colors.backgroundColor,

    },
    listViewCard: {
        width: '100%', justifyContent: 'center', borderRadius: 10, backgroundColor: Colors.primary, padding: 10, marginVertical: 5
    },
    listText: {
        fontSize: getProportionalFontSize(13), fontFamily: Assets.fonts.bold
    },
    progressLoader: { width: '100%', position: "relative", flex: 0, height: "100%" },
    searchBarMainView: { paddingHorizontal: 5, marginTop: 20, paddingHorizontal: 16 },
    searchBarItemView: {
        width: '100%', height: 50, paddingHorizontal: 8,
        borderRadius: 15, backgroundColor: 'white', elevation: 4,
        flexDirection: 'row', alignItems: 'center', justifyContent: "space-between"
    },
    searchIcon: { fontSize: getProportionalFontSize(25), color: Colors.placeholderTextColor, },
    searchInput: { fontSize: getProportionalFontSize(15), width: '80%' },
    addIconStyle: { fontSize: getProportionalFontSize(30), },
    twoButtonView: { width: '100%', flexDirection: 'row', alignItems: 'center', marginTop: 20, justifyContent: 'space-between', paddingHorizontal: Constants.globalPaddingHorizontal },
    iconView: { height: 40, width: 40, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center', borderRadius: 10, elevation: 7 },
    icon: { fontSize: getProportionalFontSize(24) },
    loadMoreButton: { marginTop: Constants.formFieldTopMargin, width: "40%", alignSelf: "center", }
});
