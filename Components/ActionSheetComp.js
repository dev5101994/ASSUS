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
    // console.log("99999999999999999900", props.APIDetails?.data)
    // useState hooks
    const [isLoading, setIsLoading] = React.useState(false);
    const [paginationLoading, setPaginationLoading] = React.useState(false);
    const [listData, setListData] = React.useState(props.APIDetails?.data ? [...props.APIDetails?.data] : []);
    const [selectedData, setSelectedData] = React.useState(props.APIDetails?.selectedData ? [...props.APIDetails?.selectedData] : []);
    const [searchText, setSearchText] = React.useState('');
    const [shouldLoadMore, setShouldLoadMore] = React.useState(props.APIDetails?.loadMoreVisible);

    // redux hooks
    const labels = useSelector(state => state.Labels);

    // useEffects
    React.useEffect(() => { initialLogic() }, [])

    const initialLogic = async () => {
        if (props.APIDetails?.url != '' && listData?.length <= 0) {
            await fetchData();
        }
        else if (listData?.length > 0) {
            let tempSelectedData = selectAlreadySelectedData(listData);
            setListData(tempSelectedData)
        }
    }

    // helper methods
    const selectAlreadySelectedData = (data) => {
        if (!data)
            return [];

        let finalSelectedData = [...data];
        let key = props.keyToCompareData ? props.keyToCompareData : props.keyToShowData ? props.keyToShowData : 'name';

        for (let i = 0; i < finalSelectedData?.length; i++) {
            let selected = false;
            for (let j = 0; j < selectedData?.length; j++) {
                if (finalSelectedData[i][key] == selectedData[j][key]) {
                    selected = true;
                }
            }
            finalSelectedData[i]['selected'] = selected;
        }
        return finalSelectedData;
    }

    const shouldItBeSelected = (item, index) => {
        if (props.shouldItBeSelected)
            return props.shouldItBeSelected(item, index, selectedData)
        return true;
    }

    const onPressListItem = async (item, index) => {
        if (props.multiSelect) {
            let tempListData = [...listData];
            let tempSelectedData = [...selectedData];
            if (isViewSelected(item)) {
                let selectedIndex = null;
                let key = props.keyToCompareData ? props.keyToCompareData : props.keyToShowData ? props.keyToShowData : 'name'

                for (let i = 0; i < selectedData?.length; i++) {
                    if (item[key] == selectedData[i][key]) {
                        selectedIndex = i;
                        break;
                    }
                }
                if (selectedIndex !== null) {
                    tempSelectedData.splice(selectedIndex, 1);
                }
                item['selected'] = false;
            }
            else {
                if (shouldItBeSelected(item, index)) {
                    item['selected'] = true;
                    tempSelectedData.push(item);
                }
            }
            tempListData[index] = item;
            setListData(tempListData);
            setSelectedData(tempSelectedData);
        }
        else {
            let value = null;
            let tempSelectedData = [];
            let tempListData = [...listData];
            if (isViewSelected(item)) {
                item['selected'] = false;
            }
            else {
                if (shouldItBeSelected(item, index)) {
                    value = item;
                    item['selected'] = true;
                    tempSelectedData.push(item);
                }
            }
            tempListData[index] = item;
            setListData(tempListData);
            setSelectedData(tempSelectedData);
            if (props.onPressItem) {
                props.changeAPIDetails({ selectedData: value ? [value] : [], loadMoreVisible: shouldLoadMore })
                props.onPressItem(value ? value : {});
            }
            props.closeActionSheet()
        }
    }

    const isViewSelected = (item) => {
        return item?.selected;
    }

    const renderListView = ({ item, index }) => {
        return (
            <TouchableOpacity
                onPress={() => { onPressListItem(item, index) }}
                style={{ ...styles.listViewCard, backgroundColor: isViewSelected(item) ? (props.listBarColor ?? Colors.primary) : Colors.white }}>
                <Text style={{ ...styles.listText, color: isViewSelected(item) ? Colors.white : (props.listBarColor ?? Colors.primary), }}>{props.keyToShowData ? item[props.keyToShowData] : item}</Text>
            </TouchableOpacity>
        )
    }

    const onPressCheck = () => {
        if (props.onPressItem) {
            props.changeAPIDetails({ selectedData: selectedData, loadMoreVisible: shouldLoadMore })
            props.onPressItem(selectedData);
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
        else {
            if (searchText && !isLoading) {
                setIsLoading(true)
                let key = props.keyToShowData ?? 'name';
                setListData(listData.filter((item) => {
                    if (item[key]?.toLowerCase()?.includes(searchText?.toLowerCase()))
                        return true
                    return false
                }))
                setIsLoading(false)
            }
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
            let finalSelectedData = selectAlreadySelectedData(response.data.payload.data ?? response.data.payload);
            if (!page) {
                setListData(finalSelectedData);
                props.changeAPIDetails({ data: searchQuery ? [] : response.data.payload.data ? response.data.payload.data : response.data.payload, loadMoreVisible: tempShouldLoadMore, })
                setIsLoading(false);
            }
            else {
                let tempData = [];
                tempData = tempData.concat([...listData]);
                tempData = tempData.concat(finalSelectedData)
                setListData([...tempData]);
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
    // console.log('selectedData', JSON.stringify(selectedData))
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
                <View style={styles.searchBarMainView}>
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
                        <Icon name="search" onPress={searchFromAPI} style={styles.searchIcon} />
                    </View>
                </View>

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
