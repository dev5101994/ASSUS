import React from 'react';
import { View, StyleSheet, Text, SafeAreaView, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Colors from '../Constants/Colors';
import { getProportionalFontSize } from '../Services/CommonMethods';
import InputValidation from '../Components/InputValidation'
import { useSelector, useDispatch } from 'react-redux'
import CommonAPIFunctions from '../Services/CommonAPIFunctions';


export default AddressInputComp = props => {

    const labels = useSelector(state => state.Labels);
    //console.log('===================================', labels)

    const validationObj = { ...props.validationObj }

    const UserLogin = useSelector(state => state.User.UserLogin);
    // BadWords & Suggetion

    const [suggestion, setSuggestion] = React.useState([]);
    // const [badWords, setBadWords] = React.useState([]);

    const [full_addressSuggestion, setFull_addressSuggestion] = React.useState([]);

    // useEffect hooks
    React.useEffect(() => {
        CommonAPIFunctions.getSuggestions(UserLogin.access_token, (data) => { setSuggestion(data) });
        // CommonAPIFunctions.getBadWords(UserLogin.access_token, (data) => { setBadWords(data) });
        // userDetailAPI()

    }, [])

    const filterSuggestion = (query, setFilteredData) => {
        if (query) {
            // Making a case insensitive regular expression
            const regex = new RegExp(`${query.trim()}`, 'i');
            // Setting the filtered film array according the query
            if (setFilteredData)
                setFilteredData(suggestion.filter((suggestion) => suggestion?.paragraph?.search(regex) >= 0))
        } else {
            // If the query is null then return blank
            if (setFilteredData)
                setFilteredData([])
        }
    }

    // Render view
    return (
        <View >
            {/* country */}
            {/* <InputValidation
                uniqueKey={props.uniqueKeys.country}
                validationObj={props.validationObj}
                value={props.formValues[props.uniqueKeys.country]?.name ?? ''}
                placeHolder={labels.country}
                iconRight='chevron-down'
                iconColor={Colors.primary}
                editable={false}
                onPressIcon={() => {
                    props.onPressIcon(props.uniqueKeys.country)
                }}
                style={styles.InputValidationView}
                inputStyle={styles.inputStyle}
            /> */}

            {/* street address */}
            <InputValidation
                uniqueKey={props.uniqueKeys.full_address}
                validationObj={props.validationObj}
                dropDownListData={full_addressSuggestion}
                multiline={true}
                value={props.formValues[props.uniqueKeys.full_address]}
                placeHolder={labels.street_address}
                onChangeText={(text) => {
                    filterSuggestion(text, (filteredData) => { setFull_addressSuggestion(filteredData) })
                    props.onChangeText(text, props.uniqueKeys.full_address)
                }}
                onPressDropDownListitem={(choosenSuggestion) => {
                    // handleInputChange(patientForm, choosenSuggestion, formFieldsKeys.full_addressSuggestion)
                    props.onChangeText(choosenSuggestion, props.uniqueKeys.full_address)
                    setFull_addressSuggestion([])
                }}
                style={styles.InputValidationView}
                inputStyle={{ ...styles.inputStyle, height: 110 }}
            />

            {/* postal area */}
            <InputValidation
                maxLength={5}
                keyboardType={'number-pad'}
                uniqueKey={props.uniqueKeys.postalArea}
                validationObj={props.validationObj}
                // multiline={true}
                value={props.formValues[props.uniqueKeys.postalArea]}
                placeHolder={labels.postalArea}
                onChangeText={(text) => {
                    props.onChangeText(text, props.uniqueKeys.postalArea)
                }}
                style={styles.InputValidationView}
                inputStyle={{ ...styles.inputStyle, }}
            />

            {/* zip code */}
            <InputValidation
                maxLength={5}
                uniqueKey={props.uniqueKeys.zipCode}
                validationObj={props.validationObj}
                value={props.formValues[props.uniqueKeys.zipCode]}
                // value={props.formValues[props.zipCode]}
                keyboardType={'number-pad'}
                placeHolder={labels.zipcode}
                onChangeText={(text) => {
                    props.onChangeText(text, props.uniqueKeys.zipCode)
                    // props.onChangeText(text, props.zipCode)
                }}
                style={styles.InputValidationView}
                inputStyle={styles.inputStyle}
            />

            {/* city */}
            <InputValidation
                uniqueKey={props.uniqueKeys.city}
                validationObj={props.validationObj}
                // multiline={true}
                value={props.formValues[props.uniqueKeys.city]}
                placeHolder={labels.city}
                onChangeText={(text) => {
                    props.onChangeText(text, props.uniqueKeys.city)
                }}
                style={styles.InputValidationView}
                inputStyle={{ ...styles.inputStyle, }}
            />

        </View >
    );
};

const styles = StyleSheet.create({
    InputValidationView: {
        backgroundColor: Colors.transparent,
        //borderColor: 'red',
        marginTop: 15,
        //borderRadius: 10,
        //color: 'red'
    },
    inputStyle: {
        fontSize: getProportionalFontSize(16),
        borderColor: Colors.borderColor,
        backgroundColor: Colors.white
    },
});
