import React from 'react';
import { View, StyleSheet, Keyboard, Dimensions, Text } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Colors from '../Constants/Colors';
import { getProportionalFontSize, CurruntDate } from '../Services/CommonMethods';
import CustomButton from './CustomButton';
import Constants from '../Constants/Constants'
import APIService from '../Services/APIService';
import Alert from './Alert';
import InputValidation from './InputValidation';
import { useSelector, useDispatch } from 'react-redux';
import CommonAPIFunctions from '../Services/CommonAPIFunctions';

const WordParagraphModal = (props) => {

    // REDUX hooks
    const dispatch = useDispatch();
    const isInternetActive = useSelector(state => state.IsInternetActive);
    const UserLogin = useSelector(state => state.User.UserLogin);
    const messages = useSelector(state => state.Labels);

    const initialValidationObj = {
        "input": {
            invalid: false,
            title: ""
        },
    }

    const [isLoading, setIsLoading] = React.useState(true);
    const [word, setword] = React.useState('');
    const [paragraph, setparagraph] = React.useState('');
    const [badWords, setBadWords] = React.useState([]);
    const [validationObj, setValidationObj] = React.useState({ ...initialValidationObj });
    // console.log("item", props.Item)
    // useEffect hooks
    React.useEffect(() => {
        CommonAPIFunctions.getBadWords(UserLogin.access_token, (data) => { setBadWords(data) });
    }, [])
    React.useEffect(() => {
        if (props?.Item) {
            // console.log('item Id FOund')
            if (props.mode == "word") {
                setword(props?.Item?.name)
            }
            if (props.mode == "paragraph") {
                setparagraph(props?.Item?.paragraph)
            }
            setIsLoading(false)
        } else {
            // setword()
            // setparagraph()
            setIsLoading(false);
            // setIsEditable(true);
        }
    }, [])

    const saveOrEditApi = async (id) => {
        setIsLoading(true);
        let params;
        let url;
        let msg = messages.message_add_success;
        if (props.mode == "word") {
            params = {
                name: word,
            };
            url = Constants.apiEndPoints.word;
        }
        if (props.mode == "paragraph") {
            params = {
                paragraph: paragraph,
            };
            url = Constants.apiEndPoints.paragraph;
        }
        // console.log('params=======', params)
        let response = {};
        if (id) {
            url = url + '/' + id;
            msg = messages.message_update_success;
            response = await APIService.putData(url, params, UserLogin.access_token, null, "editWordOrParagraphDetails");
        }
        else
            response = await APIService.postData(url, params, UserLogin.access_token, null, "saveWordOrParagraphDetails");

        if (!response.errorMsg) {
            setIsLoading(false);
            // console.log("SUCCESS............")
            props.onRequestClose()
            Alert.showToast(msg, Constants.success)
            props.refreshAPI(null, true)
        }
        else {
            setIsLoading(false);
            Alert.showAlert(Constants.danger, response.errorMsg)
        }
    }
    const getBadWordString = () => {
        //paragraph != ""
        let result = '';
        for (let i = 0; i < badWords?.length; i++) {
            let currBadWord = badWords[i]?.name?.toLowerCase();
            if (paragraph?.toLowerCase()?.includes(currBadWord)) {
                if (!result?.toLowerCase()?.includes(currBadWord))
                    result = result + badWords[i]?.name + ", ";
            }
        }
        if (result)
            result = result?.substring(0, result?.length - 2);
        return result;
    }
    return (
        <View style={styles.modalMainView}>
            <View style={styles.innerView}>
                {/* close icon */}
                <Icon name='cancel' color={Colors.primary} size={30} onPress={props.onRequestClose} />

                {
                    props.mode == "word" ? (
                        <InputValidation
                            uniqueKey='input'
                            validationObj={validationObj}
                            value={word}
                            placeHolder={props.labels.name}
                            iconColor={Colors.primary}

                            onChangeText={(text) => {
                                setValidationObj({ "input": { invalid: false, title: "" } })
                                setword(text)
                            }}
                            style={styles.mainInputStyle}
                            inputStyle={styles.inputStyle}
                        />
                    ) : null
                }
                {
                    props.mode == "paragraph" ? (
                        <InputValidation
                            multiline={true}
                            uniqueKey={"input"}
                            validationObj={validationObj}
                            value={paragraph}
                            placeHolder={props.labels.paragraph}
                            onChangeText={(text) => {
                                setparagraph(text)
                                setValidationObj({ "input": { invalid: false, title: "" } })
                            }}
                            style={styles.InputValidationView}
                            inputStyle={{ ...styles.inputStyle, height: 110 }}

                        />
                    ) : null
                }

                {/* save button */}
                <CustomButton onPress={() => {
                    if (props.mode == "word" && word) {
                        // console.log('success....', word)
                        saveOrEditApi(props?.Item?.id)
                    } else if (props.mode == "paragraph" && paragraph) {
                        let badWordString = getBadWordString();
                        // console.log('validation success', badWordString);
                        if (badWordString) {
                            // alert("ok")
                            Alert.showBasicDoubleAlertForBoth(badWordString, () => {
                                saveOrEditApi(props?.Item?.id)    // saveWord(itemId)
                            }, null, messages.message_bad_word_alert)
                        }
                        else {
                            // alert("done")
                            saveOrEditApi(props?.Item?.id)
                        }
                    }
                    else {
                        Alert.showAlert(Constants.warning, messages.message_fill_all_required_fields)
                        // console.log('validation fail')
                    }
                }} isLoading={isLoading} title={props.labels.save} style={{ marginTop: 30, minWidth: 290 }} />
            </View>
        </View>
    )
}

export default WordParagraphModal

const styles = StyleSheet.create({
    modalMainView: { backgroundColor: 'transparent', justifyContent: "center", alignItems: "center", paddingHorizontal: 16 },
    innerView: { width: '100%', minHeight: 300, backgroundColor: Colors.backgroundColor, paddingVertical: 15, paddingHorizontal: 16, borderRadius: 20 },
    inputStyle: {
        fontSize: getProportionalFontSize(16),
        borderColor: Colors.borderColor,
        backgroundColor: Colors.white
    },
    mainInputStyle: {
        backgroundColor: Colors.transparent,
        marginTop: 15,

    },
    InputValidationView: {
        backgroundColor: Colors.backgroundColor,
        marginTop: Constants.formFieldTopMargin,
        //borderRadius: 20,
        // paddingHorizontal: 5
    },
})