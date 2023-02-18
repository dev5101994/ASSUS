import React, { useState } from 'react';
import { FlatList, StyleSheet, Text, View, TouchableOpacity, Dimensions, ImageBackground } from 'react-native';
import BaseContainer from '../Components/BaseContainer';
import Colors from '../Constants/Colors';
import { getProportionalFontSize } from '../Services/CommonMethods';
import { useSelector } from 'react-redux';
import APIService from '../Services/APIService';
import Assets from '../Assets/Assets';
import { ActivityIndicator, } from 'react-native-paper';
import Alert from '../Components/Alert';
import Constants from '../Constants/Constants';

const windowHeight = Dimensions.get('window').height;

export default ModulesScreen = props => {
    // Redux Hooks
    const Labels = useSelector(state => state.Labels);
    const UserLogin = useSelector(state => state.User.UserLogin);

    // Hooks
    const [modulesList, setModulesList] = useState([])
    const [isLoading, setIsLoading] = useState(true);

    React.useEffect(() => {
        modulesListAPI()
    }, [])

    // API methods
    const modulesListAPI = async () => {

        setIsLoading(true);

        let params = {}
        let url = Constants.apiEndPoints.moduleList;
        // console.log('params=========>>>>>', JSON.stringify(params))
        let response = await APIService.postData(url, params, UserLogin.access_token, null, "modulesListingAPI");
        if (!response.errorMsg) {
            // console.log('response.data.payload.data=========>>>>>', JSON.stringify(response.data.payload))
            setModulesList(response.data.payload);
            setIsLoading(false);
        }
        else {
            setIsLoading(false);
            Alert.showAlert(Constants.danger, response.errorMsg)
        }
    }


    const _CardData = () => {
        return (
            <FlatList
                showsVerticalScrollIndicator={false}
                style={{ borderWidth: 0, paddingHorizontal: Constants.globalPaddingHorizontal, height: (windowHeight * 0.74) }}
                data={modulesList}
                renderItem={({ item, index }) => {
                    if (item.value == "stampling")
                        return null;
                    return (
                        <TouchableOpacity
                            style={[styles.card, { width: '45%', marginRight: (index % 2) == 0 ? '3%' : '2%', marginLeft: (index % 2) != 0 ? '3%' : '2%' }]}
                            onPress={() => {
                                switch (item.value) {
                                    case 'activity':
                                        props.navigation.navigate('ActivityStack')
                                        break;
                                    case 'stampling':
                                        props.navigation.navigate('StamplingStack')
                                        break;
                                    case 'schedule':
                                        props.navigation.navigate('ScheduleStack')
                                        break;
                                    case 'deviation':
                                        props.navigation.navigate('DeviationStack')
                                        break;
                                    case 'journal':
                                        props.navigation.navigate('JournalsListing')
                                        break;
                                    default:
                                        break;
                                }
                            }}>
                            <View style={styles.textContainer}>
                                <Text style={styles.cardTextSubtitle}>{item.name}</Text>
                            </View>
                        </TouchableOpacity>
                    );
                }}
                numColumns={2}
            />
        );
    };

    // console.log('props', props)
    // renderview
    return (
        <BaseContainer
            title={Labels.modules}
            leftIcon="list"
            leftIconColor={Colors.white}
            style={{ backgroundColor: Colors.transparent }}
            onPressLeftIcon={props.navigation.openDrawer}
            titleStyle={{}}>

            {/* <ScrollView> */}
            <ImageBackground source={Assets.images.homebg}
                resizeMode="cover"
                style={{ flex: 1 }}>

                {isLoading
                    ? <ActivityIndicator color={Colors.primary} size="large" style={{ width: "100%", height: "100%" }} />
                    : <View style={styles.dashboardContainer}>
                        {/* categoryCards */}
                        <View style={styles.cardContainer}>
                            <_CardData navigation={props.navigation} />
                        </View>
                    </View>}

            </ImageBackground>
        </BaseContainer>
    )

}

const styles = StyleSheet.create({

    dashboardContainer: {

        // backgroundColor: Colors.backgroundColor,

    },
    greeting: {
        width: '100%',
        flexDirection: 'row',
    },
    greetingText: {
        fontSize: getProportionalFontSize(14),
        //fontWeight: '700',
        fontFamily: Assets.fonts.bold
    },
    cardContainer: {
        width: '100%',
        paddingVertical: 20,
        borderWidth: 0,
        //paddingHorizontal: 16,
    },
    card: {
        width: '45%',
        borderWidth: 0,
        minHeight: 100,
        padding: 10,
        paddingVertical: 15,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: Colors.white,
        //marginHorizontal: '1.5%',
        marginVertical: 12,
        // shadow
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 15,
        elevation: 15,
        shadowColor: Platform.OS == 'ios' ? Colors.shadowColorIosDefault : Colors.shadowColorAndroidDefault,
        shadowRadius: 8,
        borderRadius: 12,
    },
    cardTextTitle: {
        fontFamily: Assets.fonts.semiBold,
        fontSize: getProportionalFontSize(13),
        color: Colors.black,
        marginBottom: 5,
    },
    cardTextSubtitle: {
        fontFamily: Assets.fonts.semiBold,
        fontSize: getProportionalFontSize(18),
        color: Colors.primary
    },
    iconContainer: {
        borderRadius: 50,
        width: 45,
        //flex: 1,
        borderWidth: 0,
        // padding: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    textContainer: {
        //borderRadius: 50,
        width: '100%',
        borderWidth: 0,
        //flex: 1,
        //paddingHorizontal: 5,
        marginLeft: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    iconBg: {
        height: 45,
        width: 45,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 50,
    },

});
