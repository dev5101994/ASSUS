import React from 'react'
import { StyleSheet, Text, View, ScrollView, FlatList, TouchableOpacity, Image, Dimensions } from 'react-native'
import Colors from '../Constants/Colors';
import { useSelector, useDispatch } from 'react-redux';
import BaseContainer from '../Components/BaseContainer';
import Constants from '../Constants/Constants';

import { FAB, Provider, Portal, TextInput, Modal } from 'react-native-paper';
import { firstLetterFromString, formatDateWithTime, formatTime, getProportionalFontSize, formatDate, getActionSheetAPIDetail } from '../Services/CommonMethods';
import APIService from '../Services/APIService';
import Alert from '../Components/Alert';
// icons
import Icon from 'react-native-vector-icons/Ionicons';
import CustomButton from '../Components/CustomButton';
import FormSubHeader from '../Components/FormSubHeader';
import Assets from '../Assets/Assets';
import InputValidation from '../Components/InputValidation';
import ActionSheetComp from '../Components/ActionSheetComp';
import ActionSheet from 'react-native-actions-sheet';
import { Checkbox } from 'react-native-paper';
import EmptyDataContainer from '../Components/EmptyDataContainer'

const userImage = 'https://st3.depositphotos.com/15648834/17930/v/600/depositphotos_179308454-stock-illustration-unknown-person-silhouette-glasses-profile.jpg'

const FollowUpDetails = (props) => {

    const { width, height } = Dimensions.get('window');
    // console.log("itemId+++++++++++++++", props?.route?.params?.itemId)
    const routeParam = props?.route?.params ?? {}
    const selecting_new_questions = 'selecting_new_questions'

    const formKeys = {
        new_question: "new_question",
        comment: "comment",
        first_name: "first_name",
        last_name: "last_name"
    }

    const formInitialValues = {
        new_question: "",
        comment: "",
        first_name: "",
        last_name: ""
    }


    // REDUX hooks
    const dispatch = useDispatch();
    const isInternetActive = useSelector(state => state.IsInternetActive);
    const UserLogin = useSelector(state => state.User.UserLogin);
    const labels = useSelector(state => state.Labels);
    //hooks
    const actionSheetRef = React.useRef();
    const [actionSheetDecide, setActionSheetDecide] = React.useState('');
    const [ShowBasicDetails, setShowBasicDetails] = React.useState(true);
    const [formValues, setFormValues] = React.useState({ ...formInitialValues });
    const [questionValidationObj, setQuestionValidationObj] = React.useState({
        [formKeys.new_question]: {
            invalid: false,
            title: labels.question_required
        },
    });
    const [IpDetails, setShowIpDetails] = React.useState(false);
    const [showWitness, setShowWitness] = React.useState(false);
    const [showMoreWitness, setShowMoreWitness] = React.useState(false);
    const [showPerson, setShowPerson] = React.useState(false);
    const [addNewQuestionLoading, setAddNewQuestionLoading] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(true);
    const [questions, setQuestions] = React.useState([]);
    const [witness, setWitness] = React.useState([]);
    const [moreWitness, setMoreWitness] = React.useState([]);
    const [FollowUpsValues, setFollowUpsValues] = React.useState();
    const [showquestions, setShowquestions] = React.useState(false);
    const [questionGroupIndex, setQuestionGroupIndex] = React.useState(null);
    const [isModalVisible, setIsModalVisible] = React.useState(false);
    const [addWitnessModal, setAddWitnessModal] = React.useState(false);
    const [viewDecider, setViewDecider] = React.useState(1);
    const [questionsAS, setQuestionsAS] = React.useState(getActionSheetAPIDetail({
        url: '',
        selectedData: [],
    }));

    const initialWitnessValidationObj = {
        [formKeys.first_name]: {
            invalid: false,
            title: labels.required_field
        },
        [formKeys.last_name]: {
            invalid: false,
            title: labels.required_field
        },
    }

    const [witnessValidationObj, setWitnessValidationObj] = React.useState({ ...initialWitnessValidationObj });

    React.useEffect(() => {
        // console.log('routeParam---------', routeParam)
        getFollowUpsDetails(props?.route?.params?.followUPId)

    }, [props?.route?.params]);


    const getPatientDetail = async (patientID) => {

        let url = Constants.apiEndPoints.userView + "/" + patientID;
        let response = await APIService.getData(url, UserLogin.access_token, null, "getPatientDetail API");
        if (!response.errorMsg) {
            if (response.data.payload?.persons?.length > 0)
                setWitness(response.data.payload?.persons)
        }
        else {
            Alert.showToast(response.errorMsg);
        }
    }

    // React.useEffect(() => {
    //     const unsubscribe = props.navigation.addListener('focus', () => {
    //         console.log('Focus___________________________________________')
    //         getFollowUpsDetails(routeParam?.followUPId)
    //     });
    //     return unsubscribe;
    // }, [props.navigation]);

    // const getQuestions = async (alreadySelectedQuestions) => {
    //     //   console.log('alreadySelectedQuestions-------------------------------', JSON.stringify(alreadySelectedQuestions))
    //     let url = Constants.apiEndPoints.questions;
    //     let params = {}
    //     let response = await APIService.postData(url, params, UserLogin.access_token, null, "getQuestionsAPI");
    //     if (!response.errorMsg) {
    //         if (alreadySelectedQuestions) {
    //             let tempQuestion = [...response.data.payload]
    //             //console.log('tempQuestion------', JSON.stringify(tempQuestion))
    //             tempQuestion.map((obj) => {
    //                 alreadySelectedQuestions.map((obj1) => {
    //                     obj.questions.map((obj2) => {
    //                         if (obj1.question_id == obj2.id) {
    //                             //   console.log('obj2{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{', obj2)
    //                             obj2['is_visible'] = 1;
    //                         }
    //                         else if (obj2['is_visible']) {
    //                             //console.log('2')
    //                         }
    //                         else {
    //                             //console.log('3')
    //                             obj2['is_visible'] = 0;
    //                         }
    //                     })
    //                 })
    //             })
    //             setQuestions([...tempQuestion]);
    //         }
    //         else {
    //             setQuestions(response.data.payload);
    //         }
    //     }
    //     else {
    //         Alert.showAlert(Constants.danger, response.errorMsg);
    //     }
    // }


    const getQuestions = async (addedNewQuestion) => {
        let url = Constants.apiEndPoints.questions;
        let params = {
            is_visible: 1
        }
        let response = await APIService.postData(url, params, UserLogin.access_token, null, "getQuestionsAPI");
        if (!response.errorMsg) {
            // if (addedNewQuestion && questions?.length > 0) {
            //     let res = response.data.payload;
            //     let tempQuestions = [...questions]
            //     tempQuestions.map((obj, index) => {
            //         obj.questions.map((innerObj, innerIndex) => {
            //             innerObj = { ...innerObj, ...res[index]['questions'][innerIndex] }
            //         })
            //     })
            // }
            // else {
            setQuestions(response.data.payload && Array.isArray(response.data.payload) ? response.data.payload : []);
            // }
        }
        else {
            Alert.showAlert(Constants.danger, response.errorMsg);
        }
    }

    const getFollowUpsDetails = async (Id) => {
        setIsLoading(true);
        let url = Constants.apiEndPoints.followUp + "/" + Id;
        let response = await APIService.getData(url, UserLogin.access_token, null, "followUpDetailAPI");
        if (!response.errorMsg) {
            setFollowUpsValues(response.data.payload)
            if (response.data.payload.more_witness && response.data.payload.is_completed) {
                let temp = await JSON.parse(response.data.payload.more_witness);
                setMoreWitness(temp)
            }
            // if (props?.route?.params?.showHistoryBtn)
            //     await getQuestions(response.data.payload.questions)
            if (props?.route?.params?.showHistoryBtn)
                await getQuestions()
            setIsLoading(false);

            if (response.data.payload?.patient_implementation_plan?.patient?.id)
                getPatientDetail(response.data.payload?.patient_implementation_plan?.patient?.id)
        }
        else {
            setIsLoading(false);
            Alert.showAlert(Constants.danger, response.errorMsg);
        }
    }

    //helper 
    const onRequestClose = () => {
        // console.log('onRequestClose called')
        setQuestionGroupIndex(null)
        setIsModalVisible(false);
        setAddWitnessModal(false);
        setFormValues({ ...formValues, [formKeys.first_name]: '', [formKeys.last_name]: '' })
    }

    const InfoContainer = (props) => {
        const { iconName, title, content } = props;
        return (
            <View>
                <View style={{ flexDirection: "row", marginTop: 20, alignItems: 'center' }}>
                    {iconName ? <Icon style={{ marginRight: 5 }} name={iconName} color={Colors.black} size={17} /> : null}
                    <Text style={styles.descriptionText}>{title}</Text>
                </View>
                <Text style={styles.contentText}>{content ?? "N/A"}</Text>
            </View>
        )
    }

    const addNewQuestionAPI = async (newQuestion) => {
        setAddNewQuestionLoading(true);
        let url = Constants.apiEndPoints.addNewQuestion;
        let params = { ...newQuestion }
        let response = await APIService.postData(url, params, UserLogin.access_token, null, "addNewQuestionAPI");
        if (!response.errorMsg) {
            let tempQuestion = [...questions]
            let tempNewQuestion = response.data.payload
            tempNewQuestion['is_visible'] = 1;
            // tempQuestion.push(newQuestion)
            tempQuestion[questionGroupIndex]['questions'].push({ ...tempNewQuestion })
            setQuestions([...tempQuestion])
            // await getQuestions(true)
            setAddNewQuestionLoading(false);
            onRequestClose()
        }
        else {
            setAddNewQuestionLoading(false);
            Alert.showBasicAlert(response.errorMsg);
        }
    }


    const closeActionSheet = () => {
        actionSheetRef?.current?.setModalVisible();
        setActionSheetDecide('');
    }

    const completeFollowUpAPI = async () => {
        setIsLoading(true);
        let url = Constants.apiEndPoints.followUpComplete;
        let tempQuestions = [...questions]
        let question_answer = []
        tempQuestions.map((obj) => {
            obj.questions.map((innerObj) => {
                if (innerObj.is_visible == 1) {
                    question_answer.push({
                        "question_id": innerObj.id,
                        "answer": innerObj.answer ?? ''
                    })
                }
            })
        })
        let witnessIdArray = []
        witness.map((obj) => {
            if (obj.checked)
                witnessIdArray.push(obj.id)
        })
        let params = {
            "follow_up_id": routeParam.followUPId,
            "question_answer": question_answer,
            "more_witness": moreWitness,
            "comment": formValues.comment,
            "witness": witnessIdArray,
        }
        //   console.log('param', JSON.stringify(params))
        let response = await APIService.postData(url, params, UserLogin.access_token, null, "addNewQuestionAPI");
        if (!response.errorMsg) {
            Alert.showAlert(Constants.success, labels.follow_up_completed_successfully, () => { props.navigation.pop() })
        }
        else {
            setAddNewQuestionLoading(false);
            Alert.showBasicAlert(response.errorMsg);
        }
    }

    const getAPIDetails = () => {
        switch (actionSheetDecide) {
            case selecting_new_questions: {
                return questionsAS;
            }
            default: {
                return null
            }
        }
    }

    const changeAPIDetails = (payload) => {
        switch (actionSheetDecide) {
            case selecting_new_questions: {
                setQuestionsAS(getActionSheetAPIDetail({ ...questionsAS, ...payload }))
                break;
            }
            default: {
                break;
            }
        }
    }

    const onPressItem = (item) => {
        switch (actionSheetDecide) {
            case selecting_new_questions: {
                let tempQuestions = [...questions]
                tempQuestions[questionGroupIndex]["questions"].map((obj) => {
                    item.map((innerObj) => {
                        if (innerObj.id == obj.id)
                            obj['is_visible'] = 1;
                    })
                })
                setQuestions([...tempQuestions]);
                onRequestClose()
                break;
            }
            default: {
                break;
            }
        }
    }


    const validation = () => {
        let validationObjTemp = { ...witnessValidationObj };
        // console.log('validationObjTemp', validationObjTemp);
        let isValid = true;
        for (const [key, value] of Object.entries(validationObjTemp)) {
            if (!formValues[key]) {
                value['invalid'] = true;
                isValid = false;
                break;
            }
        }
        setWitnessValidationObj({ ...validationObjTemp });
        return isValid;
    }

    //console.log('UserLogin', UserLogin.id)
    if (isLoading)
        return <ProgressLoader />

    return (
        <BaseContainer
            onPressLeftIcon={() => { props.navigation.goBack() }}
            leftIcon="arrow-back"
            leftIconSize={24}
            title={labels["followups-details"]}
            leftIconColor={Colors.primary}
        >


            {(viewDecider == 2 || viewDecider == 3)
                ? <FormSubHeader
                    onPressRightIcon={() => { viewDecider == 2 ? setViewDecider(3) : viewDecider == 3 ? setAddWitnessModal(true) : null }}
                    rightIconName={viewDecider == 2 ? "chevron-forward-circle-outline" : 'person-add-outline'}
                    leftIconName={"chevron-back-circle-outline"}
                    onPressLeftIcon={() => {
                        viewDecider == 2 ? setViewDecider(1) : viewDecider == 3 ? setViewDecider(2) : null
                    }}
                    title={viewDecider == 3 ? labels["select-witness"] : labels["questions"]}
                />
                : null}

            {/* Main View */}
            <ScrollView
                style={styles.mainView}
                showsVerticalScrollIndicator={false}
            >

                <Portal>
                    <Modal
                        animationType="slide"
                        transparent={true}
                        style={{ paddingHorizontal: 10 }}
                        visible={isModalVisible || addWitnessModal}
                        onRequestClose={onRequestClose}
                    >
                        <View style={styles.innerView}>

                            {/* close icon */}
                            <Icon name='close-circle' color={Colors.primary} size={30} onPress={() => {
                                if (!addNewQuestionLoading)
                                    onRequestClose()
                            }} />

                            {
                                addWitnessModal ?
                                    <>
                                        <InputValidation
                                            uniqueKey={formKeys.first_name}
                                            validationObj={witnessValidationObj}
                                            value={formValues[formKeys.first_name]}
                                            placeHolder={labels["first-name"]}
                                            iconColor={Colors.primary}
                                            onChangeText={(text) => {
                                                // handleInputChange(formKeys.new_question, text)
                                                setFormValues({ ...formValues, [formKeys.first_name]: text })
                                            }}
                                            style={styles.InputValidationView}
                                            inputStyle={styles.inputStyle}
                                        />
                                        <InputValidation
                                            uniqueKey={formKeys.last_name}
                                            validationObj={witnessValidationObj}
                                            value={formValues[formKeys.last_name]}
                                            placeHolder={labels["last-name"]}
                                            iconColor={Colors.primary}
                                            onChangeText={(text) => {
                                                // handleInputChange(formKeys.new_question, text)
                                                setFormValues({ ...formValues, [formKeys.last_name]: text })
                                            }}
                                            style={styles.InputValidationView}
                                            inputStyle={styles.inputStyle}
                                        />

                                        <CustomButton
                                            onPress={() => {
                                                if (validation()) {
                                                    let newWitness = {
                                                        name: "" + formValues.first_name + " " + formValues.last_name,
                                                        first_name: formValues.first_name,
                                                        last_name: formValues.last_name,
                                                    }
                                                    let tempMoreWitness = [...moreWitness];
                                                    tempMoreWitness.push(newWitness)
                                                    setMoreWitness(tempMoreWitness)
                                                    onRequestClose()
                                                }
                                            }}
                                            title={labels["add"]}
                                            style={{ marginTop: Constants.formFieldTopMargin }} />
                                    </>
                                    : <>
                                        {/* question input */}
                                        <InputValidation
                                            uniqueKey={formKeys.new_question}
                                            validationObj={questionValidationObj}
                                            value={formValues[formKeys.new_question]}
                                            placeHolder={labels["new-question"]}
                                            iconColor={Colors.primary}
                                            onChangeText={(text) => {
                                                setQuestionValidationObj({
                                                    [formKeys.new_question]: {
                                                        invalid: false,
                                                        title: labels["question_required"]
                                                    },
                                                })
                                                // handleInputChange(formKeys.new_question, text)
                                                setFormValues({ ...formValues, [formKeys.new_question]: text })
                                            }}
                                            style={styles.InputValidationView}
                                            inputStyle={styles.inputStyle}
                                        />

                                        {/* add button */}
                                        <CustomButton
                                            isLoading={addNewQuestionLoading}
                                            onPress={() => {
                                                if (formValues[formKeys.new_question]) {
                                                    // console.log('validation success')
                                                    let newQuestion = {
                                                        "group_name": questions[questionGroupIndex].group_name,
                                                        "question": formValues[formKeys.new_question],
                                                        "is_visible": 0,
                                                    }
                                                    addNewQuestionAPI(newQuestion)
                                                    // let tempQuestion = [...questions];
                                                    // let tempQuestionArray = tempQuestion[questionGroupIndex].questions;

                                                    // tempQuestionArray.push({ ...newQuestion })

                                                    // tempQuestion[questionGroupIndex]['questions'] = [...tempQuestionArray]
                                                    // console.log('tempQuestion', JSON.stringify(tempQuestion))
                                                    // setQuestions([...tempQuestion])
                                                    // handleInputChange(formKeys.new_question, '')
                                                    // Alert.showToast(labels.question_added_successfully)
                                                    // onRequestClose()
                                                }
                                                else {
                                                    let tempObj = { ...questionValidationObj }
                                                    tempObj[formKeys.new_question]['invalid'] = true;
                                                    setQuestionValidationObj(tempObj)
                                                }
                                            }}
                                            title={labels["add"]}
                                            style={{ marginTop: 30 }} />

                                        <CustomButton
                                            isLoading={addNewQuestionLoading}
                                            onPress={() => {
                                                setQuestionsAS({ ...questionsAS, data: [...questions[questionGroupIndex]['questions']] })
                                                setActionSheetDecide(selecting_new_questions)
                                                actionSheetRef.current?.setModalVisible()
                                            }}
                                            title={labels["select-questions"]}
                                            style={{ marginTop: 10 }} />
                                    </>
                            }
                        </View>
                    </Modal>
                </Portal>

                <View style={{ paddingBottom: 80 }}>
                    {viewDecider == 1
                        ? <>
                            {/* ---------basic_details--------- */}
                            <View style={styles.detailsContainer} >

                                <TouchableOpacity
                                    style={styles.header}
                                    onPress={() => setShowBasicDetails(!ShowBasicDetails)} >
                                    <Text style={styles.headerText}>{labels["details"]}</Text>
                                    <Icon name={!ShowBasicDetails ? 'chevron-down' : 'chevron-up'} color={Colors.black} size={25} />
                                </TouchableOpacity>

                                <View style={{ display: !ShowBasicDetails ? "none" : "flex" }}>
                                    {/* title */}
                                    <InfoContainer
                                        // iconName={"md-mail-outline"}
                                        title={labels["title"]}
                                        content={FollowUpsValues?.title}
                                    />
                                    {/* description */}
                                    <InfoContainer
                                        // iconName={"md-call-outline"}
                                        title={labels["description"]}
                                        content={FollowUpsValues?.description}
                                    />
                                    {/* is_completed */}
                                    <InfoContainer
                                        // iconName={"location-outline"}
                                        title={labels["is-completed"]}
                                        content={FollowUpsValues?.is_completed == 1 ? "Yes" : "No"}
                                    />
                                    {/* start_date */}
                                    <InfoContainer
                                        // iconName={"location-outline"}
                                        title={labels["start-date"]}
                                        content={FollowUpsValues?.start_date}
                                    />
                                    {/* end_date */}
                                    <InfoContainer
                                        // iconName={"location-outline"}
                                        title={labels["end-date"]}
                                        content={FollowUpsValues?.end_date}
                                    />
                                    {/* remarks */}
                                    <InfoContainer
                                        // iconName={"location-outline"}
                                        title={labels["remarks"]}
                                        content={FollowUpsValues?.remarks}
                                    />

                                    {/* comment */}
                                    {FollowUpsValues?.comment
                                        ? <InfoContainer
                                            // iconName={"location-outline"}
                                            title={labels["comment"]}
                                            content={FollowUpsValues?.comment}
                                        /> : null}

                                </View>

                            </View>

                            {/* --------ip Details--------- */}
                            <View style={styles.detailsContainer} >
                                <TouchableOpacity
                                    style={styles.header}
                                    onPress={() => setShowIpDetails(!IpDetails)} >
                                    <Text style={styles.headerText}>{labels["ip-details"]}</Text>
                                    <Icon name={!IpDetails ? 'chevron-down' : 'chevron-up'} color={Colors.black} size={25} />
                                </TouchableOpacity>
                                <View style={{ display: !IpDetails ? "none" : "flex" }}>

                                    {/* what_happened */}
                                    <InfoContainer
                                        // iconName={"md-mail-outline"}
                                        title={labels["what-happened"]}
                                        content={FollowUpsValues?.patient_implementation_plan?.what_happened}
                                    />

                                    {/* how_it_happened */}
                                    <InfoContainer
                                        // iconName={"md-call-outline"}
                                        title={labels["how-happened"]}
                                        content={FollowUpsValues?.patient_implementation_plan?.how_it_happened}
                                    />

                                    {/* when_it_started */}
                                    <InfoContainer
                                        // iconName={"location-outline"}
                                        title={labels["when-it-started"]}
                                        content={FollowUpsValues?.patient_implementation_plan?.when_it_started}
                                    />

                                    {/* what_to_do */}
                                    <InfoContainer
                                        // iconName={"location-outline"}
                                        title={labels["what-to-do"]}
                                        content={FollowUpsValues?.patient_implementation_plan?.what_to_do}
                                    />

                                    {/* goal */}
                                    <InfoContainer
                                        // iconName={"location-outline"}
                                        title={labels["goal"]}
                                        content={FollowUpsValues?.patient_implementation_plan?.goal}
                                    />

                                    {/* sub_goal */}
                                    <InfoContainer
                                        // iconName={"location-outline"}
                                        title={labels["sub-goal"]}
                                        content={FollowUpsValues?.patient_implementation_plan?.sub_goal}
                                    />

                                    {/* plan_start_date */}
                                    <InfoContainer
                                        // iconName={"location-outline"}
                                        title={labels["plan-start-date"]}
                                        content={FollowUpsValues?.patient_implementation_plan?.plan_start_date}
                                    />

                                    {/* plan_start_time */}
                                    <InfoContainer
                                        // iconName={"location-outline"}
                                        title={labels["plan-start-time"]}
                                        content={formatTime(FollowUpsValues?.patient_implementation_plan?.plan_start_time)}
                                    />

                                    {/* remark */}
                                    <InfoContainer
                                        // iconName={"location-outline"}
                                        title={labels["remark"]}
                                        content={FollowUpsValues?.patient_implementation_plan?.remark}
                                    />

                                    {/* activity_message */}
                                    <InfoContainer
                                        // iconName={"location-outline"}
                                        title={labels["activity-message"]}
                                        content={FollowUpsValues?.patient_implementation_plan?.activity_message}
                                    />

                                </View>
                            </View>

                            {/* witness */}
                            {FollowUpsValues.is_completed
                                ? <View style={styles.detailsContainer} >
                                    <TouchableOpacity
                                        style={styles.header}
                                        onPress={() => setShowWitness(!showWitness)} >
                                        <Text style={styles.headerText}>{labels["witnessed_by"]}</Text>
                                        <Icon name={!showWitness ? 'chevron-down' : 'chevron-up'} color={Colors.black} size={25} />
                                    </TouchableOpacity>
                                    <View style={{ display: !showWitness ? "none" : "flex" }}>
                                        {
                                            FollowUpsValues?.witness_List?.map((item) => {
                                                return (
                                                    <InfoContainer
                                                        // iconName={"md-mail-outline"}
                                                        title={item?.name}
                                                        content={item?.email}
                                                    />
                                                )
                                            })
                                        }
                                    </View>
                                </View> : null}

                            {/* more witness */}
                            {moreWitness?.length > 0 && FollowUpsValues.is_completed
                                ? <View style={styles.detailsContainer} >
                                    <TouchableOpacity
                                        style={styles.header}
                                        onPress={() => setShowMoreWitness(!showMoreWitness)} >
                                        <Text style={styles.headerText}>{labels["more-witness"]}</Text>
                                        <Icon name={!showMoreWitness ? 'chevron-down' : 'chevron-up'} color={Colors.black} size={25} />
                                    </TouchableOpacity>
                                    <View style={{ display: !showMoreWitness ? "none" : "flex" }}>

                                        {
                                            moreWitness?.map((item) => {
                                                return (
                                                    <InfoContainer
                                                        // iconName={"md-mail-outline"}
                                                        title={labels.name}
                                                        content={item?.first_name + " " + (item?.last_name ?? '')}
                                                    />
                                                )
                                            })
                                        }
                                    </View>
                                </View> : null}

                            {/* ---------questions--------- */}
                            {props?.route?.params?.showHistoryBtn
                                ? <View style={{
                                    ...styles.detailsContainer,
                                }} >
                                    <TouchableOpacity
                                        style={{ ...styles.header, }}
                                        onPress={() => setShowquestions(!showquestions)} >
                                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                                            <Text style={styles.headerText}>{labels["questions"]}</Text>
                                            <View style={styles.countLabel}>
                                                <Text style={styles.countLabelText}>{FollowUpsValues?.questions?.length ?? "0"}</Text>
                                            </View>
                                        </View>
                                        <Icon name={!showquestions ? 'chevron-down' : 'chevron-up'} color={Colors.black} size={25} />
                                    </TouchableOpacity>
                                    <View style={{ display: !showquestions ? "none" : "flex" }}>
                                        {
                                            FollowUpsValues?.questions?.map((item, index) => {
                                                let que = `${labels.q}${index + 1} : ${item.question}`
                                                let ans = `${labels.ans} : ${item.answer ?? ""}`
                                                return (
                                                    <View key={item.id} style={{ flexDirection: 'row', alignItems: "center", }}>
                                                        <InfoContainer
                                                            title={que}
                                                            content={ans}
                                                        />
                                                    </View>
                                                )
                                            })
                                        }
                                    </View>
                                </View> : null}

                            {/* ---------Persons--------- */}
                            <View style={{
                                ...styles.detailsContainer,
                                marginBottom: 70,
                            }} >
                                <TouchableOpacity
                                    style={{ ...styles.header, }}
                                    onPress={() => setShowPerson(!showPerson)} >
                                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                                        <Text style={styles.headerText}>{labels["persons"]}</Text>
                                        <View style={styles.countLabel}>
                                            <Text style={styles.countLabelText}>{FollowUpsValues?.persons?.length ?? "0"}</Text>
                                        </View>
                                    </View>
                                    <Icon name={!showPerson ? 'chevron-down' : 'chevron-up'} color={Colors.black} size={25} />
                                </TouchableOpacity>
                                <View style={{ display: !showPerson ? "none" : "flex" }}>
                                    {
                                        FollowUpsValues?.persons?.map((item) => {
                                            return (
                                                <View key={item.id} style={{ flexDirection: 'row', alignItems: "center", marginTop: 10 }}>
                                                    <View>
                                                        <Image source={{ uri: userImage }} style={{ width: 25, height: 25, marginRight: 20 }} />
                                                    </View>
                                                    <View>
                                                        <Text style={styles.descriptionText}>{item?.name}</Text>
                                                        <View style={{ flexDirection: "row" }}>
                                                            {item?.is_family_member ? <Text style={styles.contentText}>{labels["is-family-member"]},</Text> : null}
                                                            {item?.is_caretaker ? <Text style={styles.contentText}> {labels["is-caretaker"]},</Text> : null}
                                                            {item?.is_contact_person ? <Text style={styles.contentText}> {labels["is-contact-person"]}</Text> : null}
                                                        </View>
                                                    </View>
                                                </View>
                                            )
                                        })
                                    }
                                </View>
                            </View>

                            {/* complete follow up button */}
                            {props?.route?.params?.showHistoryBtn
                                ? <View style={{ paddingHorizontal: Constants.globalPaddingHorizontal }}>
                                    <TouchableOpacity
                                        activeOpacity={FollowUpsValues.is_completed ? 1 : 0}
                                        onPress={() => {
                                            if (!FollowUpsValues.is_completed)
                                                setViewDecider(2)
                                        }}
                                        style={styles.iconButton}>
                                        <Text style={styles.normal_text}>{FollowUpsValues.is_completed ? labels["completed"] : labels.complete_follow_up}</Text>
                                        {!FollowUpsValues.is_completed ? <Icon style={{}} name={'arrow-forward-outline'} color={Colors.white} size={30} /> : null}
                                    </TouchableOpacity>
                                </View>
                                : null}

                        </>
                        : viewDecider == 2
                            ?
                            <>
                                <FlatList
                                    scrollEnabled={false}
                                    ListEmptyComponent={<EmptyDataContainer />}
                                    contentContainerStyle={{ paddingHorizontal: Constants.globalPaddingHorizontal }}
                                    // keyExtractor={(item, index) => item.group_name}
                                    keyExtractor={(item, index) => '' + index}
                                    data={questions}
                                    renderItem={({ item, index }) => {
                                        let outerIndex = index;
                                        return (
                                            <View style={{ marginTop: index == 0 ? Constants.formFieldTopMargin : 25 }}>
                                                <View style={{ flexDirection: "row", alignItems: "center", width: "100%", justifyContent: "space-between" }}>
                                                    <Text style={{ ...styles.welcomeText, width: "90%", fontFamily: Assets.fonts.bold }}>{item.group_name}</Text>
                                                    <Icon name='add-circle-outline' color={Colors.primary} size={28} onPress={() => {
                                                        setQuestionGroupIndex(outerIndex)
                                                        setIsModalVisible(true)
                                                    }}
                                                    />
                                                </View>
                                                {
                                                    item.questions.map((item, index) => {
                                                        let tempItem = { ...item };
                                                        if (item.is_visible == 0)
                                                            return null;
                                                        return (
                                                            <View style={{ marginTop: 5 }}>
                                                                <Text style={{ width: "90%", fontFamily: Assets.fonts.boldItalic, fontSize: getProportionalFontSize(13) }}>{item.question}</Text>
                                                                <TextInput
                                                                    value={item.answer ?? ""}
                                                                    onChangeText={(text) => {
                                                                        if (text == ' ')
                                                                            text = '';
                                                                        text = text.includes('  ') ? text.replace(Constants.noSpacePattern, '') : text;
                                                                        tempItem['answer'] = text;
                                                                        let tempQuestion = [...questions];
                                                                        tempQuestion[outerIndex]['questions'][index] = { ...tempItem };
                                                                        setQuestions([...tempQuestion])
                                                                    }}
                                                                    multiline={true}
                                                                    placeholder={labels.write_your_answer}
                                                                    textAlignVertical="top"
                                                                    style={styles.answerTextInput}
                                                                />
                                                            </View>
                                                        )
                                                    })
                                                }
                                                {/* <FlatList
                                                    scrollEnabled={false}
                                                    ListEmptyComponent={<EmptyDataContainer />}
                                                    contentContainerStyle={{}}
                                                    keyExtractor={(item, index) => '' + index}
                                                    // keyExtractor={(item, index) => '' + item.group_name}
                                                    data={item.questions}
                                                    // ListFooterComponent={() => { return renderFooter(outerIndex) }}
                                                    renderItem={({ item, index }) => {
                                                        // if (item.question == 'er')
                                                        //     console.log('item---------------------------------', item)
                                                        let tempItem = { ...item };
                                                        if (item.is_visible == 0)
                                                            return null;
                                                        return (
                                                            <View style={{ marginTop: 5 }}>
                                                                <Text style={{ width: "90%", fontFamily: Assets.fonts.boldItalic, fontSize: getProportionalFontSize(13) }}>{item.question}</Text>
                                                                <TextInput
                                                                    value={item.answer ?? ""}
                                                                    onChangeText={(text) => {
                                                                        tempItem['answer'] = text;
                                                                        let tempQuestion = [...questions];
                                                                        tempQuestion[outerIndex]['questions'][index] = { ...tempItem };
                                                                        setQuestions([...tempQuestion])
                                                                    }}
                                                                    multiline={true}
                                                                    placeholder={labels.write_your_answer}
                                                                    textAlignVertical="top"
                                                                    style={styles.answerTextInput}
                                                                />
                                                            </View>
                                                        )
                                                    }}
                                                /> */}
                                            </View>
                                        )
                                    }}
                                />
                            </>
                            :
                            viewDecider == 3
                                ? <View style={{ paddingHorizontal: Constants.globalPaddingHorizontal, }}>
                                    <FlatList
                                        // scrollEnabled={false}
                                        style={{ maxHeight: (height / 100) * 30, }}
                                        ListEmptyComponent={<EmptyDataContainer />}
                                        contentContainerStyle={{ marginTop: 5 }}
                                        keyExtractor={(item, index) => '' + index}
                                        data={witness}
                                        renderItem={({ item, index }) => {
                                            return (
                                                <View style={{ marginTop: index == 0 ? 0 : 5, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                                                    <Text
                                                        onPress={() => {
                                                            item['checked'] = !item['checked'];
                                                            let tempWitness = [...witness];
                                                            tempWitness[index] = item;
                                                            setWitness(tempWitness)
                                                        }}
                                                        numberOfLines={2}
                                                        style={{ width: "90%", fontFamily: Assets.fonts.robotoregular, fontSize: getProportionalFontSize(15), color: Colors.black }}>
                                                        {item.name}
                                                    </Text>
                                                    <Checkbox
                                                        color={Colors.primary}
                                                        status={item['checked'] ? 'checked' : 'unchecked'}
                                                        onPress={() => {
                                                            item['checked'] = !item['checked'];
                                                            let tempWitness = [...witness];
                                                            tempWitness[index] = item;
                                                            setWitness(tempWitness)
                                                        }}
                                                    />
                                                </View>
                                            )
                                        }}
                                    />

                                    <Text style={{
                                        fontFamily: Assets.fonts.robotoMedium,
                                        fontSize: getProportionalFontSize(15), color: Colors.darkPrimary
                                    }}>{labels['more-witness']}</Text>

                                    <FlatList
                                        // scrollEnabled={false}
                                        style={{ maxHeight: (height / 100) * 30, }}
                                        ListEmptyComponent={<EmptyDataContainer />}
                                        contentContainerStyle={{ marginTop: 5 }}
                                        keyExtractor={(item, index) => '' + index}
                                        data={moreWitness}
                                        renderItem={({ item, index }) => {
                                            return (
                                                <View style={{ marginTop: index == 0 ? 0 : 5, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                                                    <Text
                                                        numberOfLines={2}
                                                        style={{ width: "28%", fontFamily: Assets.fonts.semiBold, fontSize: getProportionalFontSize(15), color: Colors.gray }}>
                                                        {labels.name} :
                                                    </Text>
                                                    <Text
                                                        numberOfLines={2}
                                                        style={{ textAlign: "right", width: "70%", fontFamily: Assets.fonts.robotoregular, fontSize: getProportionalFontSize(15), color: Colors.black }}>
                                                        {item.name}
                                                    </Text>
                                                </View>
                                            )
                                        }}
                                    />

                                    <InputValidation
                                        // uniqueKey={formKeys.new_question}
                                        // validationObj={questionValidationObj}
                                        value={formValues[formKeys.comment]}
                                        placeHolder={labels["comment"]}
                                        iconColor={Colors.primary}
                                        optional={true}
                                        onChangeText={(text) => {
                                            // handleInputChange(formKeys.new_question, text)
                                            setFormValues({ ...formValues, [formKeys.comment]: text })
                                        }}
                                        style={{ ...styles.InputValidationView, }}
                                        multiline={true}
                                        inputStyle={{ ...styles.inputStyle, height: 80 }}
                                    />
                                </View>
                                : null
                    }
                    <ActionSheet ref={actionSheetRef}>
                        {
                            <ActionSheetComp
                                title={labels[actionSheetDecide]}
                                closeActionSheet={closeActionSheet}
                                keyToShowData={"question"}
                                keyToCompareData="id"

                                multiSelect={true}
                                APIDetails={getAPIDetails()}
                                changeAPIDetails={(payload) => changeAPIDetails(payload)}
                                onPressItem={(item) => onPressItem(item)}
                            />
                        }
                    </ActionSheet>
                </View>
            </ScrollView>

            {/* FLOATING ADD BUTTON */}
            {
                props?.route?.params?.showHistoryBtn && viewDecider == 1
                    ? <FAB
                        style={styles.fab}
                        color={Colors.white}
                        size={20}
                        icon="history"
                        label={labels["edit-history"]}
                        onPress={() => { FollowUpsValues.parent_id ? props.navigation.navigate('FollowUpEditHistory', { parent_id: FollowUpsValues.parent_id }) : Alert.showAlert(Constants.warning, labels.history_not_available) }}
                    /> : null
            }

            {
                viewDecider == 2
                    ? <TouchableOpacity
                        onPress={() => { setViewDecider(3) }}
                        style={{ justifyContent: "center", alignItems: "center", height: 35, width: 150, backgroundColor: Colors.primary, borderRadius: 20, position: "absolute", bottom: 10, right: 5 }}>
                        <Text style={[styles.normal_text, {}]}>{labels["next"]}</Text>
                    </TouchableOpacity>
                    : null
            }

            {
                viewDecider == 3
                    ? <TouchableOpacity
                        onPress={() => { completeFollowUpAPI() }}
                        style={{ justifyContent: "center", alignItems: "center", height: 35, width: 150, backgroundColor: Colors.primary, borderRadius: 20, position: "absolute", bottom: 10, right: 5 }}>
                        <Text style={[styles.normal_text, {}]}>{labels["save"]}</Text>
                    </TouchableOpacity>
                    : null
            }
        </BaseContainer >
    )
}

export default FollowUpDetails

const styles = StyleSheet.create({
    innerView: { width: '100%', minHeight: 300, backgroundColor: Colors.backgroundColor, paddingVertical: 15, paddingHorizontal: 16, borderRadius: 20 },
    answerTextInput: { minHeight: 40, width: "100%", borderWidth: 1, borderRadius: 7, borderColor: Colors.primary, fontFamily: Assets.fonts.regular, fontSize: getProportionalFontSize(14), marginTop: 5 },
    mainView: {
        // flex: 1,
        // 
        // backgroundColor: Colors.backgroundColor,

    },
    welcomeText: {
        fontSize: getProportionalFontSize(15),
        color: Colors.primary,
        fontFamily: Assets.fonts.semiBold
    },
    detailsContainer: {
        // width: "100%",
        shadowOffset: { width: 3, height: 3, },
        shadowOpacity: 10,
        elevation: 15,
        shadowColor: Platform.OS == "ios" ? Colors.shadowColorIosDefault : Colors.shadowColorAndroidDefault,
        shadowRadius: 10,
        backgroundColor: Colors.white,
        padding: Constants.globalPaddingHorizontal,
        marginVertical: 10,
        borderRadius: 10,
        marginHorizontal: 10
    },
    header: {
        flexDirection: "row",
        width: "100%",
        justifyContent: "space-between",
        alignItems: "center",

    },
    headerText: {
        fontFamily: Assets.fonts.bold,
        fontSize: getProportionalFontSize(18),
        color: Colors.black
    },
    descriptionText: {
        fontFamily: Assets.fonts.medium,
        fontSize: getProportionalFontSize(15),
        lineHeight: 24,
        color: Colors.black
    },
    contentText: {
        fontFamily: Assets.fonts.regular,
        fontSize: getProportionalFontSize(12),
        lineHeight: 17,
        color: Colors.black
    },
    countLabel: {
        backgroundColor: Colors.placeholderTextColor,
        minWidth: 24,
        height: 24,
        borderRadius: 5,
        marginLeft: 15,
        justifyContent: 'center',
        alignItems: "center",
        paddingHorizontal: 7,
    },
    countLabelText: {
        fontFamily: Assets.fonts.semiBold,
        fontSize: getProportionalFontSize(14),
        color: Colors.white,
    },
    fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        backgroundColor: Colors.primary,
        bottom: 0,
        // fontSize: 9
    },
    iconButton: { marginTop: Constants.formFieldTopMargin, flexDirection: "row", justifyContent: "space-evenly", alignItems: "center", height: 40, width: "100%", backgroundColor: Colors.primary, borderRadius: 10, },
    normal_text: {
        fontFamily: Assets.fonts.bold,
        fontSize: getProportionalFontSize(16),
        color: Colors.white,
    },
    InputValidationView: {
        backgroundColor: Colors.transparent,
        //borderColor: 'red',
        marginTop: Constants.formFieldTopMargin,
        //borderRadius: 10,
        //color: 'red'
    },
    inputStyle: {
        fontSize: getProportionalFontSize(15),
        borderColor: Colors.borderColor,
        backgroundColor: Colors.white
    },
})