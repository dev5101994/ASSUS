import { StyleSheet, Text, View, Dimensions, ImageBackground, TouchableOpacity, FlatList, ScrollView } from 'react-native'
import React, { useState } from 'react'
import EmptyList from '../Components/EmptyList';
import Colors from '../Constants/Colors';
import { getProportionalFontSize, differenceInWeek, CurruntDate } from '../Services/CommonMethods';
import { useSelector, useDispatch } from 'react-redux';
import BaseContainer from '../Components/BaseContainer';
import { Calendar } from 'react-native-calendars';
import Assets from '../Assets/Assets';
import Icon from 'react-native-vector-icons/Ionicons';
import moment from 'moment';
import OvForm from '../Components/OvForm';
import { FAB, Button, Card, Title, Paragraph, Checkbox, Portal, Modal } from 'react-native-paper';
import Constants from '../Constants/Constants';
import APIService from '../Services/APIService';
import ProgressLoader from '../Components/ProgressLoader';
import InputValidation from "../Components/InputValidation"
// import ErrorComp 
const week_days_data = [
    { name: 'S', number: 7, selected: false }, { name: 'M', number: 1, selected: false }, { name: 'T', number: 2, selected: false },
    { name: 'W', number: 3, selected: false }, { name: 'T', number: 4, selected: false },
    { name: 'F', number: 5, selected: false }, { name: 'S', number: 6, selected: false },
]

const AddOv = (props) => {
    let initialFormFields = {
        "every_week": "",
        "week_days": week_days_data,

    }
    // REDUX hooks
    const dispatch = useDispatch();
    const isInternetActive = useSelector(state => state.IsInternetActive);
    const UserLogin = useSelector(state => state.User.UserLogin);
    const labels = useSelector(state => state.Labels);
    //hooks
    const [startDay, setStartDay] = useState(null);
    const [endDay, setEndDay] = useState(null);
    const [markedDates, setMarkedDates] = useState({});
    const [markedDatesForForm, setMarkedDatesForForm] = useState([]);
    const [DateRange, setDateRange] = React.useState(false)
    const [headerData, setHeaderData] = React.useState({})
    const [calendarDate, setCalendarDate] = React.useState(moment().format('YYYY-MM-DD'))
    const [isModalVisible, setIsModalVisible] = React.useState(false);
    const [OvDetails, setOvDetails] = React.useState({});
    const [isLoading, setIsLoading] = React.useState(true);
    const [weekLabels, setweekLabels] = React.useState(labels?.every_week ?? "");
    const [formFields, setFormFields] = React.useState(initialFormFields);
    // console.log("formFields------------", formFields)
    const onRequestClose = () => {
        setIsModalVisible(false);
    }



    React.useEffect(() => {
        setMarkedDates({})
        setMarkedDatesForForm([])

    }, [DateRange])
    React.useEffect(() => {
        if (props?.route?.params?.itemId) {
            getOvDetails()
        } else {
            setIsLoading(false);
        }
    }, [])
    const getOvDetails = async () => {
        setIsLoading(true);
        let url = Constants.apiEndPoints.ovhour + '/' + props?.route?.params?.itemId;
        let response = {};
        response = await APIService.getData(url, UserLogin.access_token, null, 'OvDetailAPI');
        // console.log('----------------------ok', JSON.stringify(response));
        if (!response.errorMsg) {
            setOvDetails(response.data.payload)
            let temp = { [response.data.payload.date]: { selected: true, } }
            setMarkedDatesForForm("" + Object.keys(temp))
            setMarkedDates(temp);
            setCalendarDate(response.data.payload.date)
            setIsLoading(false);
        } else {
            setIsLoading(false);
            Alert.showAlert(Constants.danger, response.errorMsg);
        }
    }

    const selectedDate = (day) => {
        if (props?.route?.params?.itemId) {
            let temp = { [day?.dateString]: { selected: true, } }
            setMarkedDatesForForm(day?.dateString)
            setMarkedDates({ ...temp });
        }
        else if (!DateRange) {
            // day = { "dateString": "2022-06-15", "day": 15, "month": 6, "timestamp": 1655251200000, "year": 2022 }
            if (markedDatesForForm.length > 0) {
                let check = markedDatesForForm.find((item) => { return item == day?.dateString })
                if (check) {
                    let newArr = markedDatesForForm.filter((item) => { return check != item })
                    delete markedDates[check]
                    setMarkedDatesForForm([...newArr])
                    // console.log("--------------------newObj-", markedDates, check)
                    setMarkedDates({ ...markedDates });
                } else {
                    // console.log("ok elements2",)
                    let temp = { [day?.dateString]: { selected: true, } }
                    setMarkedDatesForForm([...markedDatesForForm, day?.dateString])
                    setMarkedDates({ ...markedDates, ...temp });
                }
            }
            else {
                // console.log("ok elements3",)
                let temp = { [day?.dateString]: { selected: true, } }
                setMarkedDatesForForm([...markedDatesForForm, day?.dateString])
                setMarkedDates({ ...markedDates, ...temp });
            }
            // console.log('selected day', markedDates);
        }
        else {
            if (startDay && !endDay) {
                const date = {}
                for (const d = moment(startDay); d.isSameOrBefore(day.dateString); d.add(1, 'days')) {
                    date[d.format('YYYY-MM-DD')] = {
                        // marked: true,
                        color: Colors.primary,
                        textColor: Colors.white
                    };

                    if (d.format('YYYY-MM-DD') === startDay) {
                        date[d.format('YYYY-MM-DD')].startingDay = true
                        // date[d.format('YYYY-MM-DD')].endingDay = false
                        date[d.format('YYYY-MM-DD')].color = Colors.primary
                    };
                    if (d.format('YYYY-MM-DD') === day.dateString) {
                        date[d.format('YYYY-MM-DD')].endingDay = true
                        date[d.format('YYYY-MM-DD')].color = Colors.primary
                    };
                }
                setMarkedDatesForForm(Object.keys(date))
                setMarkedDates(date);
                setEndDay(day.dateString);
                // console.log("-===============================startDay", startDay, "===============================EndDay", day.dateString)
                // if (DateRange && markedDatesForForm.length > 1) {
                let startDate = startDay + ''
                let endDate = day.dateString + ''
                let week = differenceInWeek(startDate, endDate)

                // console.log("---------week---", week)
                setweekLabels(week)
                // }
            } else {
                setStartDay(day.dateString)
                setEndDay(null)
                setMarkedDatesForForm([day.dateString]);
                setMarkedDates({
                    [day.dateString]: {
                        color: Colors.primary,
                        textColor: Colors.white,
                        startingDay: true,
                        endingDay: true
                    }
                })
            }
        }
    }
    const calendarTheme = {
        // backgroundColor: '#0ff',
        // textSectionTitleDisabledColor: '#0f5f5f',
        // arrowColor: 'orange',
        // disabledArrowColor: '#afaf1f',
        // indicatorColor: 'blue',
        textDayFontSize: getProportionalFontSize(14),
        textMonthFontSize: getProportionalFontSize(14),
        // textDayHeaderFontSize: getProportionalFontSize(14),

        //
        calendarBackground: Colors.white,
        textMonthFontFamily: Assets.fonts.semiBold,
        monthTextColor: Colors.black,
        todayButtonFontFamily: Assets.fonts.medium,
        textDayHeaderFontFamily: Assets.fonts.semiBold,
        textSectionTitleColor: Colors.white,
        textDayFontFamily: Assets.fonts.semiBold,
        selectedDayBackgroundColor: Colors.primary,
        selectedDayTextColor: Colors.white,
        todayTextColor: Colors.green,
        dayTextColor: Colors.primary,
        textDisabledColor: Colors.darkPlaceHoldColor,

        // dotColor: '#ffadf5',
        // selectedDotColor: '#ff0',


        'stylesheet.calendar.header': {
            week: {
                borderColor: Colors.lightGray,
                borderWidth: 1,
                flexDirection: 'row',
                justifyContent: 'space-between',
                paddingHorizontal: 15,
                backgroundColor: Colors.primary,
                borderRadius: 30,
                paddingTop: 5,
                marginBottom: 10
            },
            // dayTextAtIndex0: {
            //     color: Colors.lightGray
            // },            
        },

    }
    const Arrow = ({ direction }) => {
        if (direction == 'left') { return <Icon name="chevron-back-sharp" size={25} color={Colors.primary} /> }
        else if (direction == 'right') { return <Icon name="chevron-forward-sharp" size={25} color={Colors.primary} style={{}} /> }
        else { return true }
    }

    const CalendarDayComponent = () => {
        return (
            <View>
                <Text>hi</Text>
            </View>
        )
    }
    function onPressArrowLeft(subtractMonth) {
        // console.log("ok mukesh ", subtractMonth)
        // subtractMonth()
        let c = moment(calendarDate).add(-1, 'month');
        setCalendarDate(c)
        // console.log("ccc", c)
    }

    function onPressArrowRight() {
        // calendarDate = calendarDate.add(1, 'month');
        // this.updateCalendarDate();
    }
    // console.log("ok------------", Number(formFields?.every_week), Number(weekLabels))
    if (isLoading)
        return <ProgressLoader />

    return (
        <BaseContainer
            onPressLeftIcon={() => { props.navigation.pop() }}
            leftIcon="arrow-back"
            leftIconSize={24}
            title={labels["ov"]}
            leftIconColor={Colors.primary}
        // rightIcon={isUserHasModule() ? "filter-list" : null}
        >
            <ScrollView>
                <ImageBackground source={Assets.images.calendarHeader_bg} resizeMode={'stretch'} style={{ width: "100%", height: 70, flexDirection: "row", justifyContent: "space-between", }} >
                    <View style={{ marginLeft: 20, justifyContent: "center" }}>
                        <Text style={{
                            fontSize: getProportionalFontSize(12),
                            fontFamily: Assets.fonts.semiBold,
                            color: "#fff"
                        }}>{headerData?.year ?? moment(new Date()).format('yyyy')}</Text>
                        <Text style={{
                            fontSize: getProportionalFontSize(25),
                            fontFamily: Assets.fonts.semiBold,
                            color: "#fff"
                        }}>{headerData?.dateString ? moment(headerData?.dateString).format('MMMM') : moment(new Date()).format('MMMM')}</Text>
                    </View>
                    <View style={{
                        marginRight: 20,
                        alignItems: "flex-end",
                        flexDirection: "row",
                        marginBottom: 10
                    }}>
                        <Icon name="chevron-back-sharp" size={25} color={Colors.white} />
                        <Icon name="chevron-forward-sharp" size={25} color={Colors.white} style={{ marginLeft: 15 }} />
                    </View>
                </ImageBackground>
                <View style={{
                    flex: 1,
                    paddingHorizontal: 10,
                    marginTop: 20
                    // backgroundColor: Colors.primary,
                    // borderTopColor: Colors.lightGray,
                    // borderTopWidth: 1,
                    // paddingHorizontal: 0
                }}>
                    <View style={{ ...styles.cardStyle, }} >
                        <Calendar
                            firstDay={1}
                            current={calendarDate}
                            minDate={CurruntDate()}
                            // monthFormat={'yyyy MM'}
                            markingType={DateRange ? 'period' : 'custom'}
                            renderArrow={direction => <Arrow direction={direction} />}
                            onDayPress={(day) => {
                                selectedDate(day)
                            }}
                            markedDates={markedDates}
                            theme={calendarTheme}
                            enableSwipeMonths={true}
                            onMonthChange={month => {
                                // console.log('month changed', month);
                                setHeaderData(month)
                            }}
                        // hideDayNames={false}
                        // hideArrows={true}

                        // onPressArrowLeft={subtractMonth => onPressArrowLeft(subtractMonth)}
                        // Handler which gets executed when press arrow icon right. It receive a callback can go next month
                        // onPressArrowRight={addMonth => addMonth()}

                        // dayComponent={CalendarDayComponent}
                        // renderHeader={date => {
                        //     /*Return JSX*/
                        //   }}

                        // headerStyle
                        // customHeader={CalendarDayComponent}
                        />

                    </View>
                    {
                        !props?.route?.params?.itemId
                            ? <View style={{ ...styles.cardStyle, paddingLeft: 20, }} >
                                <View style={styles.checkBoxView}>
                                    <Checkbox
                                        color={Colors.primary}
                                        status={DateRange ? 'checked' : 'unchecked'}
                                        onPress={() => {
                                            setDateRange(!DateRange);
                                            setFormFields({ ...initialFormFields })
                                        }}
                                    />
                                    <Text style={styles.normalText}>{labels.enable_range}</Text>
                                </View>

                            </View>
                            : null

                    }

                    {
                        DateRange
                            ? <View style={{ ...styles.cardStyle, paddingLeft: 20, }}>
                                {/* repeatetion type */}
                                <InputValidation
                                    // showSoftInputOnFocus={false}                            
                                    // uniqueKey={formFieldsKeys.name}
                                    // validationObj={validationObj}
                                    value={formFields.every_week}
                                    placeHolder={labels["week"]}
                                    onChangeText={(text) => {
                                        // removeErrorTextForInputThatUserIsTyping(formFieldsKeys.name);
                                        setFormFields({ ...formFields, every_week: text })
                                    }}

                                    keyboardType={"number-pad"}
                                    maxLength={2}
                                    style={styles.InputValidationView}
                                    inputStyle={styles.inputStyle}
                                // editable={isEditable}
                                />
                                {

                                    markedDatesForForm.length > 1
                                        ? <Text style={{ fontFamily: Assets.fonts.medium, fontSize: getProportionalFontSize(12), }}>{`${labels.max_week_count} ${weekLabels}`}</Text>
                                        : null
                                }
                                {/* {console.log("------------------fd", markedDatesForForm)} */}

                                <Text style={styles.headingTitleStyle}>{labels["select-days"]}</Text>
                                {/* week_days */}
                                <FlatList
                                    show={false}
                                    contentContainerStyle={{ marginTop: Constants.formFieldTopMargin }}
                                    keyExtractor={(item, index) => item.number}
                                    horizontal
                                    data={formFields.week_days}
                                    renderItem={({ item, index }) => {
                                        return (
                                            <TouchableOpacity
                                                onPress={() => {
                                                    let temp_week_days = [...formFields.week_days]
                                                    temp_week_days.map((obj) => {
                                                        if (item.number == obj.number)
                                                            obj.selected = !obj.selected
                                                    })
                                                    setFormFields({ ...formFields, week_days: [...temp_week_days] })
                                                }}
                                                style={{ ...styles.weekCircleView, backgroundColor: item.selected ? Colors.primary : Colors.white }} >
                                                <Text style={{ ...styles.weekText, color: !item.selected ? Colors.primary : Colors.white }}>{item.name}</Text>
                                            </TouchableOpacity>
                                        )
                                    }}
                                />
                                {/* <ErrorComp
                        uniqueKey={formFieldsKeys.week_days}
                        validationObj={validationForTimeAndRepetition} /> */}
                            </View>
                            : null
                    }

                    {/* <View style={{
                    marginTop: 20,
                    width: "100%",
                    height: Dimensions.get("window").width,
                    backgroundColor: Colors.white,
                    borderTopLeftRadius: 50,
                    borderTopRightRadius: 50
                }}>
                    <ScheduleForm DateRange={DateRange} setDateRange={setDateRange} />

                </View> */}
                </View>
            </ScrollView>
            <FAB
                style={{
                    ...styles.fab,
                    //  Object.keys(markedDates).length > 0 ? Colors.primary : Colors.lightGray, 
                    backgroundColor: Colors.primary
                    // Object.keys(markedDates).length > 0
                    //     ? DateRange
                    //         ? formFields?.every_week.trim() != "" && Number(formFields?.every_week) <= Number(weekLabels)
                    //             ? Colors.primary
                    //             : Colors.lightGray
                    //         : Colors.primary
                    //     : Colors.lightGray
                }}
                color={Colors.white}
                icon="plus"
                // onPress={Object.keys(markedDates).length > 0 ? () => { setIsModalVisible(true) } : () => { } }
                onPress={() => { setIsModalVisible(true) }
                    // Object.keys(markedDates).length > 0
                    // ? DateRange
                    //     ? formFields?.every_week.trim() != "" && Number(formFields?.every_week) <= Number(weekLabels)
                    //         ? () => { setIsModalVisible(true) }
                    //         : () => { }
                    //     : () => { setIsModalVisible(true) }
                    // : () => { }
                }
            />
            {/* <TouchableOpacity
                    style={{ backgroundColor: Object.keys(markedDates).length > 0 ? Colors.primary : Colors.lightGray, width: 55, height: 55, borderRadius: 50, justifyContent: "center", alignItems: "center", bottom: 10, right: 16, zIndex: 1000 }}
                    onPress={Object.keys(markedDates).length > 0 ? () => { setIsModalVisible(true) } : () => { }}
                >
                    <Icon name='add' size={30} color={Colors.white} />
                </TouchableOpacity> */}


            <Portal>
                <Modal
                    animationType="slide"
                    transparent={true}
                    style={{}}
                    visible={isModalVisible}
                    onRequestClose={onRequestClose}
                    onDismiss={onRequestClose}
                >
                    <View style={styles.modalMainView}>
                        <View style={styles.innerViewforModel}>
                            <OvForm
                                DateRange={DateRange}
                                setDateRange={setDateRange}
                                labels={labels} UserLogin={UserLogin}
                                markedDatesForForm={markedDatesForForm}
                                onRequestClose={onRequestClose}
                                navigation={props.navigation}
                                isEditing={props?.route?.params?.itemId ? true : false}
                                OvDetails={OvDetails}
                                formValues={formFields}
                            // DateRange={DateRange}
                            />
                        </View>
                    </View>
                </Modal>
            </Portal>

        </BaseContainer>
    )
}

export default AddOv

const styles = StyleSheet.create({
    fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        backgroundColor: Colors.primary,
        bottom: 0,
        // zIndex: 1000
    },
    checkBoxView: { flexDirection: 'row', alignItems: 'center', marginTop: 30 },
    normalText: {
        fontSize: getProportionalFontSize(16),
        fontFamily: Assets.fonts.semiBold,
        color: Colors.primary,
        marginLeft: 5
    },
    modalMainView: { backgroundColor: 'transparent', justifyContent: "center", alignItems: "center", paddingHorizontal: 16 },
    innerViewforModel: {
        width: '100%', minHeight: 150, backgroundColor: Colors.backgroundColor, paddingBottom: Constants.globalPaddingHorizontal * 2, paddingHorizontal: 16, borderRadius: 20,
    },
    cardStyle: {
        shadowOffset: { width: 3, height: 3, },
        shadowOpacity: 10,
        elevation: 15,
        shadowColor: Platform.OS == "ios" ? Colors.shadowColorIosDefault : Colors.shadowColorAndroidDefault,
        shadowRadius: 20,
        backgroundColor: Colors.white,
        // marginVertical: 10,
        borderRadius: 20,
        padding: 10,
        marginBottom: 30,
        zIndex: -1000
        // marginHorizontal: Constants.globalPaddingHorizontal,
    },
    weekCircleView: { justifyContent: "center", alignItems: "center", backgroundColor: Colors.primary, borderRadius: 20, height: 40, width: 40, marginStart: 5, borderWidth: 1, borderColor: Colors.primary },
    weekText: {
        fontFamily: Assets.fonts.bold,
        // color: Colors.white,
        // fontSize: getProportionalFontSize(15)
    },
    headingTitleStyle: {
        fontFamily: Assets.fonts.regular,
        fontSize: getProportionalFontSize(15),
        marginTop: 20
    },
})