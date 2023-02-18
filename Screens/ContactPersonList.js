import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    FlatList,
    RefreshControl,
} from 'react-native';
import { FAB } from 'react-native-paper';
import EmptyList from '../Components/EmptyList';
import Colors from '../Constants/Colors';
import { getProportionalFontSize, firstLetterFromString, getAgeByPersonalNo } from '../Services/CommonMethods';
import { useSelector, useDispatch } from 'react-redux';
import Constants from '../Constants/Constants';
import APIService from '../Services/APIService';
import Alert from '../Components/Alert';
import ProgressLoader from '../Components/ProgressLoader';
import BaseContainer from '../Components/BaseContainer';
import CommonCRUDCard from '../Components/CommonCRUDCard';
import Assets from '../Assets/Assets';
import FooterCompForFlatlist from '../Components/FooterCompForFlatlist';
import Can from '../can/Can';
import AddContactPerson from './AddContactPerson';
import IPListCard from '../Components/IPListCard';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'; //timeline
import moment from 'moment';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'; //tasks
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'; //notebook
import ListLoader from '../Components/ListLoader';
import IpCardContactPerson from '../Components/IpCardContactPerson';

const ContactPersonList = props => {
    // REDUX hooks
    const dispatch = useDispatch();
    const isInternetActive = useSelector(state => state.IsInternetActive);
    const UserLogin = useSelector(state => state.User.UserLogin);
    const permissions = UserLogin?.permissions ?? {};
    const labels = useSelector(state => state.Labels);
    const messages = useSelector(state => state.Labels);

    // useState Hooks
    const [contactPerson, setContactPerson] = React.useState([]);
    const [isRefreshing, setIsRefreshing] = React.useState(false);
    const [paginationLoading, setPaginationLoading] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(false);
    const [page, setPage] = React.useState(0);
    const [openCardOptions, setOpenCardOptions] = React.useState()

    React.useEffect(() => {
        const unsubscribe = props.navigation.addListener('focus', () => {
            // The screen is focused
            // Call any action
            // console.log('Focus___________________________________________');
            contactPersonListingAPI();
        });
        // Return the function to unsubscribe from the event so it gets removed on unmount
        return unsubscribe;
    }, [props.navigation]);

    // API methods
    const contactPersonListingAPI = async (page, refresh) => {
        if (refresh) setIsRefreshing(true);
        else if (!page) setIsLoading(true);
        else setPaginationLoading(true);
        let params = {
            perPage: Constants.perPage,
            page: page ?? 1,
            user_type_id: '9',
        };
        // console.log('params', params);
        let url = Constants.apiEndPoints.userList;
        // console.log('url', url);
        let response = await APIService.postData(
            url,
            params,
            UserLogin.access_token,
            null,
            'patientListingAPI',
        );

        if (!response.errorMsg) {
            // console.log(
            //     'response-------------------+++++++++++++',
            //     JSON.stringify(response),
            // );
            if (!page) {
                setPage(1);
                setContactPerson(response.data.payload.data);
                setIsLoading(false);
                if (refresh) setIsRefreshing(false);
            } else {
                let tempcontactPerson = [...contactPerson];
                tempcontactPerson = tempcontactPerson.concat(
                    response.data.payload.data,
                );
                setPage(page);
                setContactPerson([...tempcontactPerson]);
                setPaginationLoading(false);
            }
        } else {
            if (!page) setIsLoading(false);
            else setPaginationLoading(false);
            if (refresh) setIsRefreshing(false);
            Alert.showAlert(Constants.danger, response.errorMsg);
        }
    };

    const deletePersonAPI = async item => {
        setIsLoading(true);
        let url = Constants.apiEndPoints.userView + '/' + item.id;
        let response = await APIService.deleteData(
            url,
            UserLogin.access_token,
            null,
            'deletePersonAPI',
        );

        if (!response.errorMsg) {
            Alert.showToast(messages.message_delete_success);
            await contactPersonListingAPI(null, true);
            setIsLoading(false);
        } else {
            setIsLoading(false);
            Alert.showAlert(Constants.danger, response.errorMsg);
        }
    };


    const flatListRenderItem = ({ item, index, }) => {
        let labelText = firstLetterFromString(item.name)
        let sub_title = getAgeByPersonalNo(item?.personal_number);
        return (
            <IpCardContactPerson
                showMenu={true}
                openCardOptions={openCardOptions}
                setOpenCardOptions={setOpenCardOptions}
                index={index}
                phoneNumber={item?.contact_number}
                email={item?.email}
                // patientPersonal_number={item.personal_number}
                patientPatient_ID={item?.custom_unique_id}
                patientBranchName={UserLogin?.user_type_id == 2 ? item?.branch?.name : null}
                // patientBranchName={item?.branch?.name}
                onPressCard={
                    Can(
                        Constants.permissionsKey.personsRead,
                        permissions,
                    )
                        ? () => {
                            props.navigation.navigate('CommonUserProfile', {
                                itemId: item.id,
                                url: Constants.apiEndPoints.userView,
                            });
                        }
                        : () => { }
                }
                gender={item?.gender?.toLowerCase()}
                title={item.name}
                unique_id={item.unique_id}
                labelText={labelText}
                showIcons={true}
                showSecretIcon={item?.is_secret == 1 ? true : false}
                showDeleteIcon={Can(
                    Constants.permissionsKey.personsDelete,
                    permissions,
                )}
                showEditIcon={Can(
                    Constants.permissionsKey.personsEdit,
                    permissions,
                )}
                subTitle={sub_title ?? false}
                onPressEdit={() => {
                    props.navigation.navigate('AddContactPerson', { personId: item.id });
                }}
                onPressDelete={() => {
                    Alert.showDoubleAlert(
                        Constants.warning,
                        messages.message_delete_confirmation,
                        () => {
                            deletePersonAPI(item);
                        },
                    );
                }}


            />
        )
    }
    return (
        <BaseContainer
            onPressLeftIcon={() => {
                props.navigation.pop();
            }}
            leftIcon="arrow-back"
            title={labels["contact-person"]}
            leftIconColor={Colors.primary}>
            {/* Main View */}
            {
                isLoading
                    ? <ListLoader />
                    : (
                        <View style={styles.mainView}>
                            <FlatList
                                ListEmptyComponent={<EmptyList />}
                                data={contactPerson}
                                renderItem={flatListRenderItem}
                                contentContainerStyle={{
                                    borderWidth: 0,
                                    paddingVertical: Constants.globalPaddingVetical,
                                    paddingHorizontal: Constants.globalPaddingHorizontal,
                                }}
                                keyExtractor={item => item.id}
                                onEndReached={() => {
                                    contactPersonListingAPI(page + 1);
                                }}
                                onEndReachedThreshold={0.1}
                                refreshControl={
                                    <RefreshControl
                                        refreshing={isRefreshing}
                                        onRefresh={() => {
                                            contactPersonListingAPI(null, true);
                                        }}
                                    />
                                }
                                ListFooterComponent={() => (
                                    <FooterCompForFlatlist paginationLoading={paginationLoading} />
                                )}
                            />

                            {/* FLOATING ADD BUTTON */}
                            {Can(
                                Constants.permissionsKey.personsAdd,
                                permissions,
                            ) ? (
                                <FAB
                                    style={styles.fab}
                                    color={Colors.white}
                                    icon="plus"
                                    onPress={() => {
                                        props.navigation.navigate('AddContactPerson');
                                    }}
                                />
                            ) : null
                            }
                        </View>
                    )
            }
        </BaseContainer>
    );
};

export default ContactPersonList;

const styles = StyleSheet.create({
    mainView: {
        flex: 1,
        backgroundColor: Colors.backgroundColor,
        paddingBottom: 20,
    },
    fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        backgroundColor: Colors.primary,
        bottom: 0,
    },
});
