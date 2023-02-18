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


export default TreatmentAndWorkingComp = (props) => {

    // REDUX hooks
    const dispatch = useDispatch();
    const labels = useSelector(state => state.Labels);
    const messages = useSelector(state => state.Labels);
    const UserLogin = useSelector(state => state.User.UserLogin);

    //Constants
    const formFieldTopMargin = Constants.formFieldTopMargin;

    const treatmentAndWorkingKey = {
        treatment: "treatment",
        working_method: "working_method",
    }

    let treatmentAndWorkingInitialValues = {
        treatment: "",
        working_method: "",
    };


    // useState hooks
    const [treatmentAndWorkingValues, setTreatmentAndWorkingValues] = React.useState(props.treatmentAndWorkingValues ? props.treatmentAndWorkingValues : treatmentAndWorkingInitialValues);
    const [isLoading, setIsLoading] = React.useState(false);
    const [treatmentSuggestion, setTreatmentSuggestion] = React.useState([]);
    const [workingMethodSuggestion, setWorkingMethodSuggestion] = React.useState([]);

    // useEffect hooks
    React.useEffect(() => {

    }, [])

    //hooks
    const actionSheetRef = React.useRef();

    const handleInputChange = (value, key) => {
        setTreatmentAndWorkingValues({
            ...treatmentAndWorkingValues,
            [key]: value,
        });
    };

    const getBadWordString = () => {
        let array = [
            treatmentAndWorkingValues.treatment,
            treatmentAndWorkingValues.working_method
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

            {/* treatment */}
            <InputValidation
                // uniqueKey={ipFormKeys.what_happened}
                // validationObj={ipValidationObj}
                dropDownListData={treatmentSuggestion}
                onPressDropDownListitem={(choosenSuggestion) => {
                    handleInputChange(choosenSuggestion, treatmentAndWorkingKey.treatment)
                    setTreatmentSuggestion([])
                }}
                multiline={true}
                optional={true}
                value={treatmentAndWorkingValues.treatment}
                placeHolder={labels.treatment}
                onChangeText={(text) => {
                    filterSuggestion(text, (filteredData) => { setTreatmentSuggestion(filteredData) })
                    handleInputChange(text, treatmentAndWorkingKey.treatment)
                }}
                style={styles.InputValidationView}
                inputStyle={{ ...styles.inputStyle, ...{ height: 110 } }}
            />

            {/* working method */}
            <InputValidation
                // uniqueKey={ipFormKeys.what_happened}
                // validationObj={ipValidationObj}
                dropDownListData={workingMethodSuggestion}
                onPressDropDownListitem={(choosenSuggestion) => {
                    handleInputChange(choosenSuggestion, treatmentAndWorkingKey.working_method)
                    setWorkingMethodSuggestion([])
                }}
                multiline={true}
                optional={true}
                value={treatmentAndWorkingValues.working_method}
                placeHolder={labels.working_method}
                onChangeText={(text) => {
                    filterSuggestion(text, (filteredData) => { setWorkingMethodSuggestion(filteredData) })
                    handleInputChange(text, treatmentAndWorkingKey.working_method)
                }}
                style={styles.InputValidationView}
                inputStyle={{ ...styles.inputStyle, ...{ height: 110 } }}
            />

            {/* Button View */}
            <View style={styles.buttonView}>
                {/* back button */}
                <CustomButton
                    style={{
                        ...styles.nextButton,
                        backgroundColor: Colors.primary
                    }}
                    onPress={() => {
                        props.setTreatmentAndWorkingValues(treatmentAndWorkingValues)
                        props.setViewDecider(props.viewDecider - 1)
                    }}
                    title={labels.back} />

                {/* next button */}
                <CustomButton
                    style={{
                        ...styles.nextButton,
                        backgroundColor: Colors.primary
                    }}
                    onPress={() => {

                        let badWordString = getBadWordString();
                        if (badWordString) {
                            Alert.showBasicDoubleAlertForBoth(badWordString, () => {
                                props.setTreatmentAndWorkingValues(treatmentAndWorkingValues)
                                props.setViewDecider(props.viewDecider + 1)
                            }, null, messages.message_bad_word_alert)
                        }
                        else {
                            props.setTreatmentAndWorkingValues(treatmentAndWorkingValues)
                            props.setViewDecider(props.viewDecider + 1)
                        }
                    }}
                    title={labels.next} />
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