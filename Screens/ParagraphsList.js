import React from 'react'
import { StyleSheet, Text, View, ScrollView, FlatList, RefreshControl } from 'react-native'
import { FAB, Portal, Provider, Modal } from 'react-native-paper';
import EmptyList from '../Components/EmptyList';
import Colors from '../Constants/Colors';
import { firstLetterFromString, getProportionalFontSize } from '../Services/CommonMethods';
import { useSelector, useDispatch } from 'react-redux';
import Constants from '../Constants/Constants';
import APIService from '../Services/APIService';
import ProgressLoader from '../Components/ProgressLoader';
import Alert from '../Components/Alert';
import CommonCRUDCard from '../Components/CommonCRUDCard';
import Icon from 'react-native-vector-icons/MaterialIcons';
import WordParagraphModal from '../Components/WordParagraphModal';
import ListLoader from '../Components/ListLoader';
import FooterCompForFlatlist from '../Components/FooterCompForFlatlist';
import Can from '../can/Can';
import WordListingCard from '../Components/WordCard';

const Data = [];

const ParagraphsList = (props) => {
    // REDUX hooks
    const dispatch = useDispatch();
    const isInternetActive = useSelector(state => state.IsInternetActive);
    const UserLogin = useSelector(state => state.User.UserLogin);
    const labels = useSelector(state => state.Labels);
    const messages = useSelector(state => state.Labels);
    const permissions = UserLogin?.permissions ?? {}

    //use state hooks
    const [Paragraph, setParagraph] = React.useState([]);
    const [isLoading, setIsLoading] = React.useState(true);
    const [isRefreshing, setIsRefreshing] = React.useState(false);
    const [page, setPage] = React.useState(0);
    const [paginationLoading, setPaginationLoading] = React.useState(false);
    const [isModalVisible, setIsModalVisible] = React.useState(false);
    const [text, setText] = React.useState('');
    const [Item, setItem] = React.useState({});
    const [mode, setMode] = React.useState("")

    // useEffect hooks
    React.useEffect(() => {
        getParagraph()
    }, [])

    React.useEffect(() => {
        const unsubscribe = props.navigation.addListener('focus', () => {
            // The screen is focused
            // Call any action
            // console.log('Focus___________________________________________')
            getParagraph()
        });

        // Return the function to unsubscribe from the event so it gets removed on unmount
        return unsubscribe;
    }, [props.navigation]);

    // API methods
    const getParagraph = async (page, refresh) => {
        if (refresh)
            setIsRefreshing(true)
        else if (!page)
            setIsLoading(true);
        else
            setPaginationLoading(true)
        let params = {
            "perPage": Constants.perPage,
            "page": page ?? 1,
        }
        let url = Constants.apiEndPoints.paragraphs;
        // console.log('params=========>>>>>', JSON.stringify(params))

        let response = await APIService.postData(url, params, UserLogin.access_token, null, "Paragraph");

        if (!response.errorMsg) {

            if (!page) {
                setParagraph(response.data.payload.data);
                setIsLoading(false);
                // console.log("response.data.payload.data", response.data.payload.data)
                if (refresh)
                    setIsRefreshing(false);
                setPage(1);
            }
            else {
                let temParagraph = [...Paragraph];
                temParagraph = temParagraph.concat(response.data.payload.data);
                setPage(page);
                setParagraph([...temParagraph]);
                setPaginationLoading(false);
            }
        }
        else {
            if (!page)
                setIsLoading(false);
            else
                setPaginationLoading(false)
            if (refresh)
                setIsRefreshing(false);
            Alert.showAlert(Constants.danger, response.errorMsg)
        }
    }

    const deleteParagraphs = async (itemId, index) => {
        setIsLoading(true);
        // let params = {
        // }
        // console.log("itemId", itemId)
        let url = Constants.apiEndPoints.paragraph + "/" + itemId;
        // console.log("url", url);
        let response = await APIService.deleteData(url, UserLogin.access_token, null, "deleteParagraphsAPI");
        if (!response.errorMsg) {
            // console.log("payload===", response.data.payload);
            Alert.showToast(messages.message_delete_success, Constants.success)
            Paragraph.splice(index, 1)
            setIsLoading(false);
        }
        else {
            setIsLoading(false);
            Alert.showAlert(Constants.danger, response.errorMsg);
        }
    }
    const openModel = (text) => {
        // setText(text.paragraph)
        setItem(text)
        setIsModalVisible(true);
    }
    const onRequestClose = () => {
        // getParagraph()
        // console.log('onRequestClose called')
        setIsModalVisible(false);
    }

    const flatListRenderItem = ({ item, index }) => {
        const { top_most_parent_id } = item
        let labelText = firstLetterFromString(item.paragraph)
        return (
            <WordListingCard
                hideAvtar={true}
                title={item.paragraph}
                showDeleteIcon={
                    !top_most_parent_id || top_most_parent_id == 1
                        ? false
                        : Can(Constants.permissionsKey.paragraphsDelete, permissions)
                }
                showEditIcon={
                    !top_most_parent_id || top_most_parent_id == 1
                        ? false
                        : Can(Constants.permissionsKey.paragraphsEdit, permissions)

                }

                // labelText={labelText}
                second_title_value={labels["read-more"]}
                second_title_value_style={{ color: Colors.primary }}
                onPressEdit={() => {
                    setItem(item)
                    setIsModalVisible(true);
                }}
                onPressDelete={() => {
                    Alert.showDoubleAlert(Constants.warning, messages.message_delete_confirmation, () => {
                        deleteParagraphs(item.id, index);
                    })
                }}
            />
        )
    }

    // renderview
    // if (isLoading)
    //     return <ProgressLoader />
    return (
        <BaseContainer
            onPressLeftIcon={() => { props.navigation.pop() }}
            leftIcon="arrow-back"
            leftIconSize={24}
            title={labels["paragraph"]}
            leftIconColor={Colors.primary}
        >
            {/* MODAL */}
            <Portal>
                <Modal
                    animationType="slide"
                    transparent={true}
                    style={{}}
                    visible={isModalVisible}
                    onRequestClose={onRequestClose}
                >
                    {
                        mode == "paragraph" ? (
                            <WordParagraphModal
                                Item={Item}
                                labels={labels}
                                onRequestClose={onRequestClose}
                                mode={mode}
                                refreshAPI={getParagraph}
                            />
                        ) : (
                            <View style={styles.modalMainView}>
                                <View style={styles.innerView}>
                                    <Icon name='cancel' color={Colors.primary} size={30} onPress={onRequestClose} />
                                    <Text style={styles.descriptionText}>{Item.paragraph}</Text>
                                </View>
                            </View>
                        )
                    }
                </Modal>
            </Portal>
            {/* <ScrollView style={{ paddingTop: 5, paddingRight: 5 }}> */}

            {
                isLoading ? (
                    <ListLoader />
                ) : (
                    <>
                        <FlatList
                            ListEmptyComponent={<EmptyList />}
                            data={Paragraph}
                            renderItem={flatListRenderItem}
                            keyExtractor={item => item.id}
                            contentContainerStyle={{ borderWidth: 0, paddingVertical: Constants.globalPaddingVetical, paddingHorizontal: Constants.globalPaddingHorizontal }}
                            showsVerticalScrollIndicator={false}
                            onEndReached={() => { getParagraph(page + 1) }}
                            onEndReachedThreshold={0.1}
                            refreshControl={
                                <RefreshControl
                                    refreshing={isRefreshing}
                                    onRefresh={() => {
                                        getParagraph(null, true);
                                    }}
                                />
                            }
                            ListFooterComponent={() => <FooterCompForFlatlist paginationLoading={paginationLoading} />}
                        />
                        {/* FLOATING ADD BUTTON */}
                        {
                            Can(Constants.permissionsKey.paragraphsAdd, permissions)
                                ? <FAB
                                    style={styles.fab}
                                    color={Colors.white}
                                    icon="plus"
                                    onPress={() => {
                                        setMode("paragraph")
                                        openModel()
                                        //  props.navigation.navigate('AddParagraph', { itemId: '' }); 
                                    }}
                                />
                                : null
                        }
                    </>
                )}


            {/* </ScrollView> */}


        </BaseContainer>
    )
}

export default ParagraphsList

const styles = StyleSheet.create({
    modalMainView: { backgroundColor: 'transparent', flex: 1, justifyContent: "center", alignItems: "center", paddingHorizontal: 16, minWidth: 300 },
    innerView: { width: '100%', minHeight: 100, backgroundColor: Colors.backgroundColor, paddingVertical: 15, paddingHorizontal: 16, borderRadius: 20 },

    fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        backgroundColor: Colors.primary,
        bottom: 0,
    },
    descriptionText: {
        fontFamily: Assets.fonts.medium,
        fontSize: getProportionalFontSize(14),
        // lineHeight: 24,
        color: Colors.lightBlack
    },
})
