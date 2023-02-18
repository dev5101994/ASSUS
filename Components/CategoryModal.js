import React from 'react';
import { View, StyleSheet, Text, SafeAreaView, TouchableOpacity, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Colors from '../Constants/Colors';
import { getProportionalFontSize, getActionSheetAPIDetail, isDocOrImage } from '../Services/CommonMethods';
import InputValidation from '../Components/InputValidation'
import CustomButton from './CustomButton';
import Constants from '../Constants/Constants'
import APIService from '../Services/APIService';
import ActionSheet from "react-native-actions-sheet";
import { Checkbox } from 'react-native-paper';
import ActionSheetComp from '../Components/ActionSheetComp';
import Assets from '../Assets/Assets'
import { Modal, Portal, } from 'react-native-paper';
import Alert from './Alert'
import ColorPicker from 'react-native-wheel-color-picker'
import UploadedFileViewer from './UploadedFileViewer';
import ProgressLoader from './ProgressLoader';
import { useSelector, useDispatch } from 'react-redux'
import ImagePickerActionSheetComp from './ImagePickerActionSheetComp';
import CommonAPIFunctions from '../Services/CommonAPIFunctions';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';


const { width, height } = Dimensions.get('window');

export default CategoryModal = props => {

    // Immutable Variables
    const initialValidationObj = {
        categoryName: {
            invalid: false,
            title: props.labels.category_name_required
        },
        categoryType: {
            invalid: false,
            title: props.labels.category_type_required
        },
        category: {
            invalid: false,
            title: props.labels.category_required
        },
    }

    // Hooks
    const actionSheetRef = React.useRef();


    // BadWords & Suggetion

    const [suggestion, setSuggestion] = React.useState([]);
    const [badWords, setBadWords] = React.useState([]);

    // useEffect hooks
    React.useEffect(() => {
        CommonAPIFunctions.getSuggestions(UserLogin.access_token, (data) => { setSuggestion(data) });
        CommonAPIFunctions.getBadWords(UserLogin.access_token, (data) => { setBadWords(data) });
        // userDetailAPI()

    }, [])

    const getBadWordString = () => {
        let result = '';
        for (let i = 0; i < badWords?.length; i++) {
            let currBadWord = badWords[i]?.name?.toLowerCase();

            if (categoryName?.toLowerCase()?.includes(currBadWord)
                // || formFields?.description?.toLowerCase()?.includes(currBadWord)

            ) {
                if (!result?.toLowerCase()?.includes(currBadWord))
                    result = result + badWords[i]?.name + ", ";
            }
        }
        if (result)
            result = result?.substring(0, result?.length - 2);
        return result;
    }

    // useState hooks
    const [validationObj, setValidationObj] = React.useState({ ...initialValidationObj });
    const messages = useSelector(state => state.Labels);
    const [categoryName, setCategoryName] = React.useState(props.categoryItem?.name ?? '');
    const [categoryType, setCategoryType] = React.useState(props.categoryItem?.category_type ?? null);
    const [category, setCategory] = React.useState(props.categoryItem?.parent ?? null);
    const [isLoading, setIsLoading] = React.useState(false);
    const [statusCheckBox, setStatusCheckBox] = React.useState(props.categoryItem?.status ?? false);
    const [uploadingFile, setUploadingFile] = React.useState(false);
    const [documents, setDocuments] = React.useState(props.categoryItem?.follow_up_image ? [{
        'uploaded_doc_url': props.categoryItem?.follow_up_image,
        'uri': props.categoryItem?.follow_up_image,
        'type': isDocOrImage(props.categoryItem?.follow_up_image)
    }] : []);
    const UserLogin = useSelector(state => state.User.UserLogin);
    const [isModalVisible, setIsModalVisible] = React.useState(false);
    const [actionSheetDecide, setActionSheetDecide] = React.useState('');
    const [color, setColor] = React.useState(props.categoryItem?.category_color ?? '');
    const [categoryTypeAS, setCategoryTypeAS] = React.useState(getActionSheetAPIDetail({
        url: Constants.apiEndPoints.categoryTypeList, debugMsg: "categoryType", token: props.UserLogin.access_token,
        selectedData: props.categoryItem?.category_type ? [props.categoryItem?.category_type] : []
    }));
    const [categoryAS, setCategoryAS] = React.useState({});

    // helper Methods
    const removeErrorTextForInputThatUserIsTyping = (uniqueKey) => {
        let tempValidationObj = { ...validationObj }
        tempValidationObj[uniqueKey] = initialValidationObj[uniqueKey];
        setValidationObj(tempValidationObj);
    }

    const closeActionSheet = () => {
        setActionSheetDecide('');
        actionSheetRef?.current?.setModalVisible();
    }

    const validation = (message) => {
        let validationObjTemp = { ...validationObj };

        if (!categoryType) {
            validationObjTemp.categoryType.invalid = true;
            setValidationObj(validationObjTemp);
            return false;
        }
        else {
            validationObjTemp['categoryType'] = initialValidationObj['categoryType']
        }
        if (!categoryName) {
            validationObjTemp.categoryName.invalid = true;
            validationObjTemp.categoryName.title = message ? message : props.labels.category_name_required
            setValidationObj(validationObjTemp);
            return false;
        }
        else {
            validationObjTemp['categoryName'] = initialValidationObj['categoryName']
        }
        if (!category && !color) {
            Alert.showAlert(Constants.warning, props.labels.color_required)
            return false;
        }
        setValidationObj(validationObjTemp);
        return true;
    }

    // API methods
    const addOrEditCategoryAPI = async (categoryId) => {

        setIsLoading(true);

        let params = {
            "category_type_id": categoryType?.id ?? null,
            "name": categoryName,
            "parent_id": category?.id ?? null,
            "status": statusCheckBox ? 1 : 0,
            "category_color": color,
            follow_up_image: documents?.length > 0 ? documents[0].uploaded_doc_url : ''
        }

        // console.log('params', params)
        // return

        let url = Constants.apiEndPoints.addCategory;

        if (categoryId) {
            url = url + '/' + categoryId;
        }

        let response = {};

        if (categoryId)
            response = await APIService.putData(url, params, props.UserLogin.access_token, null, "editCategoryAPI");
        else
            response = await APIService.postData(url, params, props.UserLogin.access_token, null, "addCategoryAPI");

        if (!response.errorMsg) {
            setIsLoading(false);
            props.onRequestClose();
            props.refreshAPI()
        }
        else {
            setIsLoading(false);
            Alert.showAlert(Constants.danger, response.errorMsg)
        }
    }

    const onRequestClose = () => {
        if (uploadingFile)
            return;
        // console.log('onRequestClose called')
        // setCategoryItem(null);
        setIsModalVisible(false);
    }

    const imageOrDocumentResponseHandler = async (response) => {
        if (response.didCancel) {
            //console.log('User cancelled image picker');
        } else if (response.error) {
            //console.log('ImagePicker Error: ', response.error);
            Alert.showAlert(Constants.danger, messages.message_something_went_wrong)
        } else if (response.customButton) {
            //console.log('User tapped custom button: ', response.customButton);
        } else {
            //  this.setState({ avatarSource: response, imagePathText: response.type });
            if (Array.isArray(response) && response.length > 0) {
                // console.log('first')
                let uploaded_doc_arr = await uploadFile(response[0]);
                if (!uploaded_doc_arr)
                    return;
                let tempArr = [{
                    'uploaded_doc_url': uploaded_doc_arr.file_name,
                    'uri': uploaded_doc_arr.file_name,
                    'type': uploaded_doc_arr.uploading_file_name
                }]
                setDocuments(tempArr)
            }
            else if (response?.assets) {
                // console.log('second', response?.assets)
                let uploaded_doc_arr = await uploadFile(response?.assets[0]);
                // console.log('uploaded_doc_arr', uploaded_doc_arr)
                if (!uploaded_doc_arr)
                    return;
                let tempArr = [{
                    'uploaded_doc_url': uploaded_doc_arr.file_name,
                    'uri': uploaded_doc_arr.file_name,
                    'type': uploaded_doc_arr.uploading_file_name
                }]
                setDocuments(tempArr)
            }
        }
    }


    const uploadFile = async (attachmentObj) => {
        // if (!checkFileSize(attachmentObj))
        //     return;
        setUploadingFile(true)
        let res = await APIService.uploadFile(Constants.apiEndPoints.uploadDoc, attachmentObj, UserLogin.access_token, 'category_attachment_', 'single', 'category attachment')
        setUploadingFile(false)
        if (res.errorMsg) {
            Alert.showAlert(Constants.danger, res.errorMsg)
            return null;
        }
        else {
            Alert.showAlert(Constants.success, messages.message_uploaded_successfully)
            return res.data.payload;
        }
    }


    // Render view
    //console.log('props.categoryItem', props.categoryItem)
    // console.log('documents', documents)

    return (
        <View style={styles.modalMainView}>

            <Portal>
                {console.log("%%%%%%%%%%%%is mode visible", isModalVisible)}
                <Modal
                    animationType="slide"
                    transparent={true}
                    style={{ justifyContent: "center", alignItems: 'center' }}
                    visible={isModalVisible}
                    onRequestClose={onRequestClose}
                >

                    <View style={{ padding: 40, }}>
                        <ColorPicker
                            ref={r => { picker = r }}
                            onColorChangeComplete={(color) => { setColor(color) }}
                            color={color ?? Colors.primary}
                            thumbSize={40}
                            sliderSize={40}
                            noSnap={true}
                            row={false}
                        />
                        <CustomButton
                            onPress={onRequestClose}
                            title={props.labels.done}
                            style={{ marginTop: 20 }} />
                    </View>
                </Modal>
            </Portal>

            <View style={styles.innerView}>
                {/* close icon */}
                <Icon name='cancel' color={Colors.primary} size={30} onPress={isLoading ? () => { } : props.onRequestClose} />
                <KeyboardAwareScrollView style={{ maxHeight: height * 0.7, }}>
                    {/* category type */}
                    <InputValidation
                        uniqueKey={'categoryType'}
                        validationObj={validationObj}
                        value={categoryType?.name ?? ""}
                        placeHolder={props.labels.select_category_type}
                        iconRight='chevron-down'
                        iconColor={Colors.primary}
                        editable={false}
                        onPressIcon={() => {
                            // console.log('HOLA')
                            setActionSheetDecide("categoryType")
                            actionSheetRef.current?.setModalVisible()
                        }}
                        isIconTouchable={true}
                        style={styles.mainInputStyle}
                        inputStyle={styles.inputStyle}
                    />


                    {/* category name input */}
                    <InputValidation
                        uniqueKey='categoryName'
                        validationObj={validationObj}
                        value={categoryName}
                        placeHolder={props.labels.category_name}
                        iconColor={Colors.primary}
                        onChangeText={(text) => {
                            removeErrorTextForInputThatUserIsTyping('categoryName');
                            setCategoryName(text)
                        }}
                        style={styles.mainInputStyle}
                        inputStyle={styles.inputStyle}
                    />

                    {/* select category bar */}
                    <InputValidation
                        uniqueKey={'category'}
                        validationObj={validationObj}
                        value={category?.name ?? ""}
                        iconRight='chevron-down'
                        iconColor={Colors.primary}
                        editable={false}
                        optional={true}
                        onPressIcon={() => {
                            setActionSheetDecide("category");
                            actionSheetRef.current?.setModalVisible();
                        }}
                        isIconTouchable={true}
                        placeHolder={props.labels.select_category}
                        style={styles.mainInputStyle}
                        inputStyle={styles.inputStyle}
                    />

                    {/* Choose Color button */}
                    {/* {!category
                    ? <CustomButton onPress={() => {
                        setIsModalVisible(true)
                    }} title={props.labels.choose_color} style={{ marginTop: 20 }} />
                    : null} */}

                    {/* Choosen Color */}
                    {/* {color
                    ? <CustomButton style={{ marginTop: 15, backgroundColor: color, height: 20 }} />
                    : null} */}



                    {/* <ErrorComp
                    uniqueKey={empFormKeys.color}
                    validationObj={validationObj}
                /> */}

                    <UploadedFileViewer
                        isLoading={uploadingFile}
                        data={documents}
                        setNewData={(newArr) => {
                            // console.log('newArr', newArr)
                            setDocuments(newArr ? [...newArr] : [])
                        }}
                    />

                    {/* UPLOAD */}
                    {documents?.length <= 0
                        ? <TouchableOpacity
                            onPress={() => {
                                setActionSheetDecide('documents')
                                actionSheetRef?.current?.setModalVisible();
                            }}
                            style={{
                                ...styles.nextButton, marginVertical: 0, marginTop: 30, minHeight: 35,
                                backgroundColor: Colors.white, flexDirection: "row", alignItems: "center", borderWidth: 1.5, borderColor: Colors.primary, borderRadius: 10
                            }}>
                            {uploadingFile
                                ? <ProgressLoader onActivityIndicator={true} onActivityIndicatorSize='small' onActivityIndicatorColor={Colors.primary} />
                                : <View style={{ flexDirection: "row", alignItems: "center" }}>
                                    <Ionicons name="cloud-upload-sharp" color={Colors.primary} size={30} />
                                    <Text style={{
                                        fontFamily: Assets.fonts.bold,
                                        fontSize: getProportionalFontSize(15), color: Colors.primary, marginStart: 5
                                    }}>{props.labels.upload}</Text>
                                </View>}
                        </TouchableOpacity> : null}

                    {!category
                        ? <View style={{ flexDirection: "row", alignItems: "center", width: "100%", marginTop: Constants.formFieldTopMargin, justifyContent: "space-between" }}>
                            {/* choose color */}
                            <CustomButton
                                style={{ width: color ? "80%" : "100%", }}
                                onPress={() => {
                                    setIsModalVisible(true)
                                }} title={props.labels.choose_color} />

                            {/* Choosen Color */}
                            {color
                                ? <CustomButton style={{ backgroundColor: color, width: "15%", borderWidth: 1 }} />
                                : null}
                        </View>
                        : null}

                    {/* status checkbox  */}
                    <View style={styles.checkBoxView}>
                        <Checkbox
                            color={Colors.primary}
                            status={statusCheckBox ? 'checked' : 'unchecked'}
                            onPress={() => { setStatusCheckBox(!statusCheckBox) }}
                        />
                        <Text style={styles.normalText}>{props.labels.make_it_active}</Text>
                    </View>

                </KeyboardAwareScrollView>

                {/* save button */}
                <CustomButton onPress={() => {
                    if (validation()) {
                        // console.log('validation success')
                        let badWordString = getBadWordString();
                        if (badWordString) {
                            Alert.showBasicDoubleAlertForBoth(badWordString,
                                () => { addOrEditCategoryAPI(props.categoryItem?.id ?? null); },
                                null, messages.message_bad_word_alert)
                        }
                        else
                            addOrEditCategoryAPI()
                    }
                    else {
                        Alert.showAlert(Constants.warning, props.labels.message_fill_all_required_fields)
                        // console.log('validation fail')
                    }
                }} isLoading={isLoading} title={props.labels.save} style={{ marginTop: Constants.formFieldTopMargin }} />
            </View>

            <ActionSheet ref={actionSheetRef}
            // containerStyle={{ backgroundColor: Colors.navBackgroundWhite }}
            >
                {
                    actionSheetDecide == "documents"
                        ? <ImagePickerActionSheetComp
                            // chooseMultiple={true}
                            //giveChoice={true}
                            closeSheet={closeActionSheet}
                            responseHandler={(res) => {
                                imageOrDocumentResponseHandler(res)
                            }}
                        />
                        :
                        <ActionSheetComp
                            title={props.labels[actionSheetDecide]}
                            closeActionSheet={closeActionSheet}
                            keyToShowData="name"
                            keyToCompareData="id"

                            // multiSelect
                            APIDetails={actionSheetDecide == "categoryType" ? categoryTypeAS : actionSheetDecide == "category" ? categoryAS : null}
                            changeAPIDetails={(payload) => {
                                if (actionSheetDecide == "categoryType") {
                                    setCategoryTypeAS(getActionSheetAPIDetail({ ...categoryTypeAS, ...payload }))
                                }
                                else if (actionSheetDecide == "category") {
                                    setCategoryAS(getActionSheetAPIDetail({ ...categoryAS, ...payload }))
                                }
                            }}
                            onPressItem={(item) => {
                                // console.log('item', item)
                                if (actionSheetDecide == "categoryType") {
                                    setCategoryType(item)
                                    removeErrorTextForInputThatUserIsTyping("categoryType")
                                    setCategoryAS(getActionSheetAPIDetail({
                                        url: Constants.apiEndPoints.categoryList, params: { "category_type_id": item.id, }, debugMsg: "category", token: props.UserLogin.access_token,
                                        selectedData: []
                                    })
                                    )
                                }
                                else if (actionSheetDecide == "category") {
                                    // console.log('item-----', item)
                                    setColor(item?.category_color ?? '');
                                    setCategory(item)
                                }
                            }}
                        />}
            </ActionSheet>
        </View >
    );
};

const styles = StyleSheet.create({
    modalMainView: { backgroundColor: 'transparent', justifyContent: "center", alignItems: "center", paddingHorizontal: 16 },
    innerView: { width: '100%', minHeight: 300, backgroundColor: Colors.backgroundColor, paddingVertical: 15, paddingHorizontal: 16, borderRadius: 20 },
    InputValidationView: {
        backgroundColor: Colors.backgroundColor,
        marginTop: 30,
        // borderRadius: 20,
        // paddingHorizontal: 5
    },
    inputStyle: {
        fontSize: getProportionalFontSize(16),
        borderColor: Colors.borderColor,
        backgroundColor: Colors.white
    },
    checkBoxView: { flexDirection: 'row', alignItems: 'center', marginTop: Constants.formFieldTopMargin },
    normalText: {
        fontSize: getProportionalFontSize(15),
        fontFamily: Assets.fonts.regular,
    },
    mainInputStyle: {
        backgroundColor: Colors.transparent,
        marginTop: 15,
    },
    nextButton: {
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        // height: 40,
        // borderRadius: 5,
        paddingHorizontal: 16,
        backgroundColor: Colors.primary,
        marginVertical: 16
    },
});
