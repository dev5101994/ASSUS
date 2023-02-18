import { StyleSheet, Text, View, Dimensions, ScrollView, FlatList, TouchableOpacity } from 'react-native'
import React from 'react'
import { BarChart, LineChart } from "react-native-chart-kit";
import Constants from '../Constants/Constants';
import APIService from '../Services/APIService';
import { Divider, FAB, Portal, Modal } from 'react-native-paper';
import { useSelector, useDispatch } from 'react-redux';
import Alert from '../Components/Alert';
import Colors from '../Constants/Colors';
import { getProportionalFontSize } from '../Services/CommonMethods';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Assets from '../Assets/Assets';
import moment from 'moment';
import Entypo from 'react-native-vector-icons/Entypo';
import DatePicker from 'react-native-date-picker';
import FilterModalCompForDeviationStates from '../Components/FilterModalCompForDeviationStates';

import { FmAction } from '../Redux/Actions/LabelsAction';
// import moment from 'moment';

const { width, height } = Dimensions.get("window")

const JournalsStats = (props) => {
    // REDUX hooks
    const dispatch = useDispatch();
    const isInternetActive = useSelector(state => state.IsInternetActive);
    const UserLogin = useSelector(state => state.User.UserLogin);
    const labels = useSelector(state => state.Labels);
    const permissions = UserLogin?.permissions ?? {};
    const messages = useSelector(state => state.Labels);
    // React-Hooks
    const [isLoading, setIsLoading] = React.useState(true);
    const [chartDate, setChartData] = React.useState({})
    const [chartLabels, setChartLabels] = React.useState([])
    const [param, setParam] = React.useState({
        "patient_id": null,
        "request_for": 7, // days 1, 7, 30
        "start_date": null,
        "end_date": null
    })
    const [isModalVisible, setIsModalVisible] = React.useState(false);
    // console.log("------chartData-------", chartDate.dataset_total_journal)
    React.useEffect(() => {
        journalChartDataAPI()

    }, [])

    // API methods
    const journalChartDataAPI = async (data) => {
        let params = {
            "patient_id": param.patient_id ?? null,
            "request_for": data ?? 7, // days 1, 7, 30
            "start_date": param.start_date ?? null,
            "end_date": param.end_date ?? null
        }
        let url = Constants.apiEndPoints.journalChart;
        // console.log("url", url);
        // console.log("params", params);
        setIsLoading(true)
        let response = await APIService.postData(url, params, UserLogin.access_token, null, "journalChartDataAPI");
        // return
        // console.log("response", JSON.stringify(response))
        if (!response.errorMsg) {

            let temp = []
            if (response.data.payload.labels) {
                response.data.payload.labels.map((data, i) => {
                    let date = moment(data).format("DDMMMM");
                    temp.push(date)
                    // console.log("date.............", date)
                })
            }
            setChartLabels([])
            setChartData({ ...response.data.payload, labels: temp })
            setIsLoading(false)
        }
        else {
            Alert.showAlert(Constants.danger, response.errorMsg)
        }
    }

    const openModel = () => {
        setIsModalVisible(true);
    }
    const onRequestClose = () => {
        // console.log('onRequestClose called')
        setIsModalVisible(false);
    }

    // const chartConfig = {
    //     backgroundGradientFrom: Colors.white,
    //     backgroundGradientTo: Colors.white,
    //     barPercentage: 0.7,
    //     height: 5000,
    //     fillShadowGradient: Colors.primary,
    //     fillShadowGradientOpacity: 1,
    //     decimalPlaces: 0, // optional, defaults to 2dp
    //     color: (opacity = 1) => Colors.primary,
    //     labelColor: (opacity = 1) => Colors.black,

    //     style: {
    //         borderRadius: 16,
    //         fontFamily: Assets.fonts.medium,
    //     },
    //     propsForBackgroundLines: {
    //         strokeWidth: 1,
    //         stroke: Colors.shadowColorIosPrimary,
    //         strokeDasharray: "0",
    //         // translateX:20
    //         x1: 20
    //     },
    //     propsForLabels: {
    //         fontFamily: Assets.fonts.medium,

    //     },

    // };

    const renderItemForLineChart = ({ item }) => {
        return (
            <View style={{ flexDirection: "row", minWidth: getProportionalFontSize(110) }}>
                <Entypo name={'dot-single'} color={item.color} size={20} />
                <Text style={{ fontFamily: Assets.fonts.regular, color: item.color, fontSize: getProportionalFontSize(10) }}>{item.name}</Text>
            </View>
        )
    }
    const RenderFilterText = ({ label, last, onPress, color }) => (
        <TouchableOpacity
            onPress={onPress}
            style={{ borderRightWidth: !last ? 1 : 0, paddingHorizontal: 15 }} >
            <Text style={{ fontFamily: Assets.fonts.bold, color: color, fontSize: getProportionalFontSize(10), }}>
                {label}
            </Text>
            {/* <Icon name='chevron-down' /> */}
        </TouchableOpacity>
    )

    // console.log("---------", chartDate.dataset_total_journal)

    const RenderChartItems = ({ item, dateLabel, dataColor }) => {

        return (
            <View style={styles.chartContainer}>

                <View style={{ width: "100%", flexDirection: "row", justifyContent: "flex-end", }}>
                    <View style={{ flexDirection: "row", minWidth: getProportionalFontSize(110) }}>
                        <Entypo name={'dot-single'} color={dataColor ?? Colors.primary} size={20} />
                        <Text style={{ fontFamily: Assets.fonts.regular, color: dataColor ?? Colors.primary, fontSize: getProportionalFontSize(10) }}>{dateLabel}</Text>
                    </View>
                </View>
                {/* {console.log("from chart_______________")} */}

                <BarChart
                    data={{
                        labels: chartDate.labels,
                        datasets: [{
                            data: [...item],
                        },],
                        // legend: ['Maths', 'SOM', 'DS'],
                    }}
                    width={Dimensions.get("window").width - Constants.globalPaddingHorizontal * 4} // from react-native
                    height={220}
                    fromZero={true}
                    // yAxisLabel="$"
                    // yAxisSuffix="k"
                    yAxisInterval={1} // optional, defaults to 1
                    // horizontalLabelRotation={"45"}
                    // verticalLabelRotation={-15}
                    showValuesOnTopOfBars={true}
                    chartConfig={{
                        backgroundGradientFrom: Colors.white,
                        backgroundGradientTo: Colors.white,
                        barPercentage: 0.7,
                        height: 5000,
                        fillShadowGradient: dataColor ?? Colors.primary,
                        fillShadowGradientOpacity: 1,
                        decimalPlaces: 0, // optional, defaults to 2dp
                        color: (opacity = 1) => dataColor ?? Colors.primary,
                        labelColor: (opacity = 1) => Colors.black,

                        style: {
                            borderRadius: 16,
                            fontFamily: Assets.fonts.medium,
                        },
                        propsForBackgroundLines: {
                            strokeWidth: 1,
                            stroke: Colors.shadowColorIosPrimary,
                            strokeDasharray: "0",
                            // translateX:20
                            x1: 20
                        },
                        propsForLabels: {
                            fontFamily: Assets.fonts.medium,
                            fontSize: getProportionalFontSize(10)
                        },

                    }}
                    bezier
                    style={{ paddingHorizontal: 5, marginLeft: -10 }}
                />
            </View>
        )
    }
    // Render view
    if (isLoading)
        return <ProgressLoader />
    return (
        <BaseContainer
            onPressLeftIcon={() => { props.navigation.pop() }}
            leftIcon="arrow-back"
            leftIconSize={24}
            title={labels["journal-stats"]}
            leftIconColor={Colors.primary}
        // rightIcon="filter-list"
        // onPressRightIcon={() => openModel()}
        // rightIconColor={Colors.primary}
        >
            <View style={{ width: "100%", justifyContent: "center", alignItems: "center", marginTop: 20 }}>
                <View style={{ paddingVertical: 5, borderWidth: 1, borderColor: Colors.black, justifyContent: "center", marginBottom: 7, borderRadius: 5, flexDirection: "row" }}>
                    <RenderFilterText label={labels?.["today"] ?? "Today"}
                        onPress={() => {
                            setParam({ ...param, request_for: "1" });
                            journalChartDataAPI("1")
                        }}
                        color={param.request_for == 1 ? Colors.primary : Colors.black}
                    />
                    <RenderFilterText label={labels?.["week"] ?? "This Week"}
                        last={true}
                        onPress={() => {
                            setParam({ ...param, request_for: "7" });
                            journalChartDataAPI("7")
                        }}
                        color={param.request_for == 7 ? Colors.primary : Colors.black}
                    />
                    {/* <RenderFilterText label={labels?.["custom"] ?? "Custom"}
                        last={true}
                        color={(param.request_for != 1 && param.request_for != 7) ? Colors.primary : Colors.black}
                        onPress={() => openModel()}
                    /> */}
                </View>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.container}>
                    {
                        chartDate.labels
                            ? <View style={{}}>
                                <ScrollView
                                    horizontal={true}
                                >
                                    <RenderChartItems item={chartDate.dataset_total_journal} dateLabel={labels?.["total-journal"] ?? "Total Journal"} dataColor={Colors.primary} />
                                    <RenderChartItems item={chartDate.dataset_total_signed} dateLabel={labels?.["total_signed"] ?? "Total Signed"} dataColor={Colors.green} />
                                    <RenderChartItems item={chartDate.dataset_with_activity} dateLabel={labels?.["with_activity"] ?? "With Activity"} dataColor={Colors.aqua} />
                                    <RenderChartItems item={chartDate.dataset_without_activity} dateLabel={labels?.["without_activity"] ?? "Without Activity"} dataColor={Colors.gray} />
                                </ScrollView>

                                <View style={styles.chartContainer}>
                                    <View style={{ flexDirection: "row", width: "100%", justifyContent: "space-between" }}>
                                        <View>
                                            {/* <FilterComp /> */}
                                        </View>
                                        <View>
                                            <FlatList
                                                data={[{ name: labels?.["total-journal"] ?? 'Total Journal', color: Colors.primary }, { name: labels?.["total_signed"] ?? "Total Signed", color: Colors.green }, { name: labels?.["with_activity"] ?? "With Activity", color: Colors.aqua }, { name: labels?.["without_activity"] ?? "Without Activity", color: Colors.gray }]}
                                                renderItem={renderItemForLineChart}
                                                keyExtractor={({ item, index }) => index}
                                                numColumns={2}

                                            />
                                        </View>
                                    </View>
                                    <LineChart
                                        data={{
                                            labels: chartDate.labels,
                                            datasets: [
                                                {
                                                    data: [...chartDate.dataset_total_journal],
                                                    strokeWidth: 2,
                                                    color: (opacity = 1) => Colors.primary,
                                                },
                                                {
                                                    data: [...chartDate.dataset_total_signed],
                                                    strokeWidth: 2,
                                                    color: (opacity = 1) => Colors.green,
                                                },
                                                {
                                                    data: [...chartDate.dataset_without_activity],
                                                    strokeWidth: 2,
                                                    color: (opacity = 1) => Colors.gray,
                                                },
                                                {
                                                    data: [...chartDate.dataset_with_activity],
                                                    strokeWidth: 2,
                                                    color: (opacity = 1) => Colors.aqua,
                                                },
                                            ],
                                        }}
                                        fromZero={true}
                                        width={Dimensions.get("window").width - Constants.globalPaddingHorizontal * 4} // from react-native
                                        height={220}
                                        yAxisInterval={1} // optional, defaults to 1
                                        chartConfig={{
                                            backgroundGradientFrom: Colors.white,
                                            backgroundGradientTo: Colors.white,
                                            fillShadowGradient: Colors.white,
                                            fillShadowGradientOpacity: 0,
                                            decimalPlaces: 0, // optional, defaults to 2dp
                                            color: (opacity = 1) => Colors.primary,
                                            labelColor: (opacity = 1) => Colors.black,
                                            // backgroundColor: "#e26a00",
                                            style: {
                                                borderRadius: 16
                                            },
                                            propsForDots: {
                                                r: "5",
                                                strokeWidth: "5",
                                            },
                                            style: {
                                                borderRadius: 16,
                                                fontFamily: Assets.fonts.medium,
                                            },
                                            propsForBackgroundLines: {
                                                strokeWidth: 1,
                                                stroke: Colors.shadowColorIosPrimary,
                                                strokeDasharray: "0",
                                            },
                                            propsForLabels: {
                                                fontFamily: Assets.fonts.medium,
                                                fontSize: getProportionalFontSize(10)
                                            },
                                        }}
                                        bezier
                                        style={{
                                            marginVertical: 8,
                                            borderRadius: 16
                                        }}
                                    />
                                </View>

                            </View>
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
                            <FilterModalCompForDeviationStates
                                // labels={labels}
                                onRequestClose={onRequestClose}
                                UserLogin={UserLogin}
                                setParam={setParam}
                                param={param}
                                labels={labels}
                            />
                        </Modal>
                    </Portal>
                </View>
            </ScrollView>
        </BaseContainer>
    )
}


export default JournalsStats

const styles = StyleSheet.create({
    //new data
    container: {
        flex: 1,
        // marginLeft: 10
        // borderWidth: 2,
        // borderColor: "red",
        minHeight: Dimensions.get("window").height,
        paddingTop: 20,
        // paddingHorizontal: Constants.globalPaddingHorizontal,
    },
    title: {

        fontSize: getProportionalFontSize(16),
        fontFamily: Assets.fonts.semiBold,
        color: Colors.primary,
    },
    chartContainer: {
        width: Dimensions.get("window").width * 0.90,
        shadowOffset: { width: 3, height: 3, },
        shadowOpacity: 10,
        elevation: 5,
        shadowColor: Platform.OS == "ios" ? Colors.shadowColorIosDefault : Colors.shadowColorAndroidDefault,
        shadowRadius: 10,
        backgroundColor: Colors.white,
        padding: Constants.globalPaddingHorizontal,
        marginVertical: 10,
        borderRadius: 10,
        marginHorizontal: Constants.globalPaddingHorizontal,
    },
    modalMainView: {
        backgroundColor: 'transparent', flex: 1, justifyContent: "center", alignItems: "center", paddingHorizontal: 16
    },
    innerView: { width: width - Constants.globalPaddingHorizontal * 3, minHeight: 300, backgroundColor: Colors.backgroundColor, paddingVertical: 15, paddingHorizontal: 16, borderRadius: 20 },
})