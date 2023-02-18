import React from 'react';
import {
    StyleSheet,
    Text, View, SafeAreaView, Image, TouchableOpacity, ScrollView, FlatList
} from 'react-native';
import Colors from '../Constants/Colors';
import Assets from '../Assets/Assets'
import { getProportionalFontSize, formatDate, formatTime, getActionSheetAPIDetail, jsCoreDateCreator, getJSObjectFromTimeString, } from '../Services/CommonMethods';
import InputValidation from './InputValidation';
import BouncyCheckbox from "react-native-bouncy-checkbox";
import Constants from '../Constants/Constants'
import ProgressLoader from './ProgressLoader'
import { useSelector, useDispatch } from 'react-redux'
import DatePicker from 'react-native-date-picker';
import ActionSheet from 'react-native-actions-sheet';
import ActionSheetComp from './ActionSheetComp';
import Alert from './Alert';
import CustomButton from './CustomButton'
import FormSubHeader from './FormSubHeader'
import APIService from '../Services/APIService';
import { RadioButton } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default OverallGoalsComp = (props) => {

    // REDUX hooks
    const dispatch = useDispatch();
    const labels = useSelector(state => state.Labels);
    const labelsImplentationPlanDetail = useSelector(state => state.Labels);
    const messages = useSelector(state => state.Labels);
    const UserLogin = useSelector(state => state.User.UserLogin);

    const overall_goals = [
        { name: "living-an-independent-life", id: 1, label: labels.living_an_independent_life },
        { name: "not-specified", id: 2, label: labels.not_specified },
        { name: "not-applicable", id: 3, label: labels.not_applicable },
    ];

    //Constants
    const formFieldTopMargin = Constants.formFieldTopMargin;

    const overallGoalKey = {
        good_living_conditions: "good_living_conditions",
        full_participation: "full_participation",
        living_like_others: "living_like_others",
        living_an_independent_life: "living_an_independent_life",
        not_specified: "not_specified",
        not_applicable: "not_applicable",
        overall_goals: "overall_goals",
        overall_goal_details: "overall_goal_details",

    }

    let overallGoalInitialValues = {
        // good_living_conditions: "",
        // full_participation: "",
        // living_like_others: "",
        // living_an_independent_life: "",
        // not_specified: "",
        // not_applicable: "",
        overall_goals: "",
        overall_goal_details: ""
    };

    // useState hooks
    const [overallGoalValues, setOverallGoalValues] = React.useState(props.overallGoalValues ? props.overallGoalValues : overallGoalInitialValues);
    const [isLoading, setIsLoading] = React.useState(false);
    const [temp, settemp] = React.useState('');
    const [actionSheetDecide, setActionSheetDecide] = React.useState('');
    const [limitationAS, setLimitationAS] = React.useState(getActionSheetAPIDetail({
        url: '', debugMsg: "", token: '',
        selectedData: [], data: overall_goals
    }));
    const [detailSuggestion, setDetailSuggestion] = React.useState([]);

    // useEffect hooks
    React.useEffect(() => {

    }, [])

    //hooks
    const actionSheetRef = React.useRef();

    const handleInputChange = (value, key) => {
        setOverallGoalValues({
            ...overallGoalValues,
            [key]: value,
        });
    };

    const closeActionSheet = () => {
        setActionSheetDecide('');
        actionSheetRef?.current?.setModalVisible();
    }

    const getBadWordString = () => {
        let array = [
            overallGoalValues.overall_goal_details
        ]
        let result = '';
        for (let i = 0; i < props?.badWords?.length; i++) {
            let currBadWord = props?.badWords[i]?.name?.toLowerCase();
            array.map((str) => {
                if (str?.toLowerCase()?.includes(currBadWord)) {
                    if (!result?.toLowerCase()?.includes(currBadWord))
                        result = result + props?.badWords[i]?.name + ", ";
                }
            })
        }
        if (result)
            result = result?.substring(0, result?.length - 2);
        return result;
    }

    const filterSuggestion = (query, setFilteredData) => {
        if (query) {
            // Making a case insensitive regular expression
            const regex = new RegExp(`${query.trim()}`, 'i');
            // Setting the filtered film array according the query
            if (setFilteredData)
                setFilteredData(props?.suggestion.filter((suggestion) => suggestion?.paragraph?.search(regex) >= 0))
        } else {
            // If the query is null then return blank
            if (setFilteredData)
                setFilteredData([])
        }
    }


    // Render view
    return (
        //Main View 
        <View style={styles.mainView}>
            {
                isLoading
                    ? <ProgressLoader />
                    : null
            }

            <FlatList
                data={overall_goals}
                renderItem={({ item }) => {
                    return (
                        <View style={{
                            width: "100%",
                            flexDirection: "row",
                            alignItems: "center"
                        }}>
                            <RadioButton
                                color={Colors.primary}
                                value={item.name}
                                status={overallGoalValues.overall_goals === item.name ? 'checked' : 'unchecked'}
                                onPress={() => {
                                    if (overallGoalValues.overall_goals == item.name)
                                        handleInputChange("", overallGoalKey.overall_goals)
                                    else
                                        handleInputChange(item.name, overallGoalKey.overall_goals)
                                }}
                            /><Text style={{
                                fontFamily: Assets.fonts.medium
                            }}>{item.label}</Text>
                        </View>
                    )
                }}
            />
            {
                overallGoalValues.overall_goals
                    ? <InputValidation
                        // uniqueKey={ipFormKeys.what_happened}
                        // validationObj={ipValidationObj}
                        dropDownListData={detailSuggestion}
                        onPressDropDownListitem={(choosenSuggestion) => {
                            handleInputChange(choosenSuggestion, overallGoalKey.overall_goal_details)
                            setDetailSuggestion([])
                        }}
                        multiline={true}
                        optional={true}
                        value={overallGoalValues.overall_goal_details}
                        placeHolder={overallGoalValues.overall_goals ? `${labels.details_for} ${labelsImplentationPlanDetail[overallGoalValues.overall_goals]}` : labels.overall_goal_details}
                        onChangeText={(text) => {
                            filterSuggestion(text, (filteredData) => { setDetailSuggestion(filteredData) })
                            handleInputChange(text, overallGoalKey.overall_goal_details)
                        }}
                        style={styles.InputValidationView}
                        inputStyle={{ ...styles.inputStyle, ...{ height: 110 } }}
                    /> : null
            }

            {/* Button View */}
            <View style={styles.buttonView}>
                {/* back button */}
                <CustomButton
                    style={{
                        ...styles.nextButton,
                        backgroundColor: Colors.primary
                    }}
                    onPress={() => {
                        // let badWordString = getBadWordString();
                        // if (badWordString) {
                        //     Alert.showBasicDoubleAlertForBoth(badWordString, () => {
                        //         props.setOverallGoalValues(overallGoalValues)
                        //         props.setViewDecider(props.viewDecider - 1)
                        //     }, null, messages.message_bad_word_alert)
                        // }
                        // else {
                        props.setOverallGoalValues(overallGoalValues)
                        props.setViewDecider(props.viewDecider - 1)
                        // }
                    }}
                    title={labels.back} />

                {/* next button */}
                <CustomButton
                    style={{
                        ...styles.nextButton,
                        backgroundColor: Colors.primary,
                    }}
                    onPress={() => {
                        // console.log("overallGoalValues", overallGoalValues)
                        let badWordString = getBadWordString();
                        if (badWordString) {
                            Alert.showBasicDoubleAlertForBoth(badWordString, () => {
                                props.setOverallGoalValues(overallGoalValues)
                                props.setViewDecider(props.viewDecider + 1)
                            }, null, messages.message_bad_word_alert)
                        }
                        else {
                            props.setOverallGoalValues(overallGoalValues)
                            props.setViewDecider(props.viewDecider + 1)
                        }
                    }}
                    title={labels.Next} />
            </View>

            <CustomButton
                style={{
                    ...styles.nextButton, marginVertical: 0, marginTop: Constants.formFieldTopMargin,
                    backgroundColor: Colors.primary, width: '100%', marginTop: 0
                }}
                onPress={() => {
                    let badWordString = getBadWordString();
                    if (badWordString) {
                        Alert.showBasicDoubleAlertForBoth(badWordString, () => {
                            props.onSave();
                        }, null, messages.message_bad_word_alert)
                    }
                    else {
                        props.onSave();
                    }
                }} title={labels.save} />

            <ActionSheet ref={actionSheetRef} containerStyle={{ backgroundColor: Colors.backgroundColor }}>
                <ActionSheetComp
                    title={labels[actionSheetDecide]}
                    closeActionSheet={closeActionSheet}
                    keyToShowData={actionSheetDecide == overallGoalKey.choose_from_template ? "template_title" : "name"}
                    keyToCompareData="id"

                    // multiSelect
                    APIDetails={actionSheetDecide == overallGoalKey.overall_goals ? limitationAS : null}
                    changeAPIDetails={(payload) => {
                        if (actionSheetDecide == overallGoalKey.overall_goals) {
                            setLimitationAS(getActionSheetAPIDetail({ ...limitationAS, ...payload }))
                        }
                    }}
                    onPressItem={(item) => {
                        // console.log('item', item)
                        if (actionSheetDecide == overallGoalKey.overall_goals) {
                            handleInputChange(item, overallGoalKey.overall_goals)
                            // removeErrorTextForInputThatUserIsTyping(ipFormKeys.overall_goals)
                        }
                    }}
                />
            </ActionSheet>
        </View>
    )
}

const styles = StyleSheet.create({
    countIndicatorText: { fontFamily: Assets.fonts.bold, fontSize: getProportionalFontSize(15), },
    buttonView: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: "space-between"
    },
    headingText: {
        fontSize: getProportionalFontSize(24),
        // marginTop: 10,
        color: Colors.primary,
        fontFamily: Assets.fonts.bold,
        // marginLeft: 16,
        // width: '80%',
        borderWidth: 0,
        //justifyContent: 'center'
    },
    mainView: {
        // flex: 1,
        paddingHorizontal: Constants.globalPaddingHorizontal
    },
    imageLogin: { width: '100%', height: 200, marginTop: 30 },
    formHeaderContainer: {
        flexDirection: 'row',
        width: "100%",
        borderWidth: 0,
        alignItems: 'center',
        justifyContent: 'space-between',
        alignContent: 'center',
        height: 40,
        paddingHorizontal: Constants.globalPaddingHorizontal
    },

    leftView: {
        width: '12%',
        height: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        alignContent: 'center',
        borderWidth: 0,
    },
    rightView: {
        width: '12%',
        height: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        alignContent: 'center',
        borderWidth: 0,
    },
    centerView: {
        width: '75%',
        height: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        alignContent: 'center',
        borderWidth: 0,
    },

    welcomeText: {
        fontSize: getProportionalFontSize(13),
        color: Colors.black,
        fontFamily: Assets.fonts.bold
    },
    InputValidationView: {
        backgroundColor: Colors.transparent,
        //borderColor: 'red',
        marginTop: Constants.formFieldTopMargin,
        //borderRadius: 10,
        //color: 'red'
    },
    nextButton: {
        justifyContent: 'center',
        alignItems: 'center',
        width: '48%',
        height: 40,
        borderRadius: 5,
        paddingHorizontal: 16,
        backgroundColor: Colors.primary,
        marginVertical: 16
    },
    normalText: {
        color: Colors.white,
        fontFamily: Assets.fonts.bold,
        fontSize: getProportionalFontSize(15)
    },
    inputStyle: {
        fontSize: getProportionalFontSize(15),
        borderColor: Colors.borderColor,
        backgroundColor: Colors.white
    },
    checkBoxView: { flexDirection: 'row', alignItems: 'center', marginTop: 30 },
    saveAsTemplate: { fontSize: getProportionalFontSize(13), fontFamily: Assets.fonts.regular }
});