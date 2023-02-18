import React, { useCallback } from 'react'
import { StyleSheet, Text, View, ScrollView, FlatList, RefreshControl } from 'react-native';
import { FAB, Portal, Modal } from 'react-native-paper';
import EmptyList from '../Components/EmptyList';
import Colors from '../Constants/Colors';
import { firstLetterFromString, getProportionalFontSize } from '../Services/CommonMethods';
import { useSelector, useDispatch } from 'react-redux';
import Constants from '../Constants/Constants';
import APIService from '../Services/APIService';
import ProgressLoader from '../Components/ProgressLoader';
import Alert from '../Components/Alert';
import CommonCRUDCard from '../Components/CommonCRUDCard';
import WordParagraphModal from '../Components/WordParagraphModal';

import LottieView from 'lottie-react-native';
import ListLoader from '../Components/ListLoader';
import FooterCompForFlatlist from '../Components/FooterCompForFlatlist';
import Can from '../can/Can';
import WordListingCard from '../Components/WordCard';

const Data = [];

const WordListing = (props) => {
    // REDUX hooks
    const dispatch = useDispatch();
    const isInternetActive = useSelector(state => state.IsInternetActive);
    const UserLogin = useSelector(state => state.User.UserLogin);
    const labels = useSelector(state => state.Labels);
    const messages = useSelector(state => state.Labels);
    const permissions = UserLogin?.permissions ?? {}

    //use state hooks
    const [WordsList, setWordsList] = React.useState([]);
    const [isLoading, setIsLoading] = React.useState(true);
    const [isRefreshing, setIsRefreshing] = React.useState(false);
    const [page, setPage] = React.useState(0);
    const [paginationLoading, setPaginationLoading] = React.useState(false);
    const [isModalVisible, setIsModalVisible] = React.useState(false);
    const [Item, setItem] = React.useState({});
    const [mode, setMode] = React.useState("word")

    // useEffect hooks
    React.useEffect(() => {
        getWordsList()
    }, [])

    React.useEffect(() => {
        const unsubscribe = props.navigation.addListener('focus', () => {
            // The screen is focused
            // Call any action
            // console.log('Focus___________________________________________')
            getWordsList()
        });

        // Return the function to unsubscribe from the event so it gets removed on unmount
        return unsubscribe;
    }, [props.navigation]);

    // API methods
    const getWordsList = async (page, refresh) => {
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
        let url = Constants.apiEndPoints.words;

        let response = await APIService.postData(url, params, UserLogin.access_token, null, "WordsList");
        // console.log('params=========>>>>>', JSON.stringify(response))
        if (!response.errorMsg) {

            if (!page) {
                setWordsList(response.data.payload.data);
                setIsLoading(false);
                if (refresh)
                    setIsRefreshing(false);
                setPage(1);
            }
            else {
                let tempWord = [...WordsList];
                tempWord = tempWord.concat(response.data.payload.data);
                setPage(page);
                setWordsList([...tempWord]);
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

    const deleteWords = async (itemId, index) => {
        setIsLoading(true);
        // let params = {
        // }
        // console.log("itemId", itemId)
        let url = Constants.apiEndPoints.word + "/" + itemId;
        // console.log("url", url);
        let response = await APIService.deleteData(url, UserLogin.access_token, null, "deleteWordsAPI");
        if (!response.errorMsg) {
            // console.log("payload===", response.data.payload);
            Alert.showToast(messages.message_delete_success, Constants.success)
            WordsList.splice(index, 1)
            setIsLoading(false);
        }
        else {
            setIsLoading(false);
            Alert.showAlert(Constants.danger, response.errorMsg);
        }
    }

    const onRequestClose = () => {
        // console.log('onRequestClose called')
        setIsModalVisible(false);
    }
    const flatListRenderItem = useCallback(({ item, index }) => {
        const { top_most_parent_id } = item
        let labelText = firstLetterFromString(item.name)


        return (
            <WordListingCard
                title={item.name}
                showDeleteIcon={
                    !top_most_parent_id || top_most_parent_id == 1
                        ? false
                        : Can(Constants.permissionsKey.wordsDelete, permissions)
                }
                showEditIcon={
                    !top_most_parent_id || top_most_parent_id == 1
                        ? false
                        : Can(Constants.permissionsKey.wordsEdit, permissions)

                }
                labelText={labelText}
                onPressEdit={() => {
                    setItem(item)
                    setIsModalVisible(true);
                }}
                onPressDelete={() => {
                    Alert.showDoubleAlert(Constants.warning, messages.message_delete_confirmation, () => {
                        deleteWords(item.id, index);
                    })
                }}
            />
        )


    })
    return (
        <BaseContainer
            onPressLeftIcon={!isLoading ? () => { props.navigation.goBack() } : () => { }}
            leftIcon="arrow-back"
            leftIconSize={24}
            title={labels["word-listing"]}
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
                    <WordParagraphModal
                        Item={Item}
                        labels={labels}
                        onRequestClose={onRequestClose}
                        mode={mode}
                        refreshAPI={getWordsList}
                    />
                </Modal>
            </Portal>
            {
                isLoading ? (
                    <ListLoader />
                ) : (
                    <>
                        <FlatList
                            ListEmptyComponent={<EmptyList />}
                            data={WordsList}
                            renderItem={flatListRenderItem}
                            keyExtractor={item => item.id}
                            contentContainerStyle={{ borderWidth: 0, paddingVertical: Constants.globalPaddingVetical, paddingHorizontal: Constants.globalPaddingHorizontal }}
                            showsVerticalScrollIndicator={false}
                            onEndReached={() => { getWordsList(page + 1) }}
                            onEndReachedThreshold={0.1}
                            refreshControl={
                                <RefreshControl
                                    refreshing={isRefreshing}
                                    onRefresh={() => {
                                        getWordsList(null, true);
                                    }}
                                />
                            }
                            ListFooterComponent={() => <FooterCompForFlatlist paginationLoading={paginationLoading} />}
                        />
                        {/* FLOATING ADD BUTTON */}
                        {
                            Can(Constants.permissionsKey.wordsAdd, permissions)
                                ? <FAB
                                    style={styles.fab}
                                    color={Colors.white}
                                    icon="plus"
                                    onPress={() => {
                                        setItem("")
                                        setIsModalVisible(true)
                                    }}
                                />
                                : null}
                    </>
                )
            }


            {/* </ScrollView> */}
        </BaseContainer>
    )
}

export default WordListing

const styles = StyleSheet.create({
    fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        backgroundColor: Colors.primary,
        bottom: 0,
    },
})
