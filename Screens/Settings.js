import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity,
    FlatList,
} from 'react-native';

//local files
import BaseContainer from '../Components/BaseContainer';
import Colors from '../Constants/Colors';
import { getProportionalFontSize } from '../Services/CommonMethods';
import Assets from '../Assets/Assets';

// icons
import Icon from 'react-native-vector-icons/FontAwesome';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
//redux
import { useSelector, useDispatch } from 'react-redux';

// TEMP user data.........
const profileImg = 'https://st3.depositphotos.com/15648834/17930/v/600/depositphotos_179308454-stock-illustration-unknown-person-silhouette-glasses-profile.jpg';

const settingsOption = [
    {
        id: 1,
        iconType: Ionicons,
        icon: 'business',
        option: 'Company Types',
        navigateTo: 'CompanyTypeScreen',
    },
    {
        id: 2,
        iconType: Icon,
        icon: 'user',
        option: 'User Types',
        navigateTo: 'UserTypeScreen',
    },
    {
        id: 3,
        iconType: Icon,
        icon: 'bell',
        option: 'Category Types',
        navigateTo: 'CategoryTypeScreen',
    },
    // {
    //     id: 4,
    //     iconType: Icon,
    //     icon: 'gears',
    //     option: 'Activity Classification',
    //     navigateTo: 'ActivityClassificationListing',
    // },
];

const Settings = props => {

    // REDUX hooks
    const isInternetActive = useSelector(state => state.IsInternetActive);
    const UserLogin = useSelector(state => state.User.UserLogin);
    const labels = useSelector(state => state.Labels);


    const _userProfileCard = ({ navigation }) => {

        return (
            <TouchableOpacity
                onPress={() => navigation.navigate('SuperAdminProfile')}
                style={styles.profileContainer}>
                <View style={styles.profileInfo}>
                    <Image style={{ ...styles.profileImg, borderWidth: UserLogin.status == 0 ? 1 : 0 }} source={{ uri: UserLogin.image ?? profileImg }} />

                    <View style={{ marginLeft: 25 }}>
                        <Text style={[styles.profileText]}>{UserLogin.name}</Text>
                        <Text style={[styles.profileSubText]}>{UserLogin.roles}</Text>
                    </View>
                </View>
                <View>
                    <Icon
                        name="chevron-right"
                        size={22}
                        color={Colors.primary ? Colors.primary : '#000'}
                    />
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <BaseContainer
            title={props?.route?.name}
            leftIcon="list"
            leftIconColor={Colors.primary}
            onPressLeftIcon={props.navigation.openDrawer}
            titleStyle={{ marginStart: 5 }}>

            {/*  */}
            <View style={{ flex: 1, paddingHorizontal: 10, }}>
                {/* userProfile */}
                <_userProfileCard navigation={props.navigation} />
                {/* options */}
                <View>
                    <FlatList
                        style={styles.flatListStyling}
                        data={settingsOption}
                        renderItem={({ item }) => {
                            return (
                                <TouchableOpacity
                                    onPress={() => props.navigation.navigate(item.navigateTo)}
                                    style={{ flexDirection: 'row', marginVertical: 10, alignItems: 'center', justifyContent: "space-between" }}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                                        <item.iconType
                                            name={item.icon}
                                            size={item.icon == "bell" ? 17 : 20}
                                            color={Colors.primary}
                                        />
                                        <Text style={styles.flatListText}>{item.option}</Text>
                                    </View>
                                    <Icon
                                        name="chevron-right"
                                        size={20}
                                        color={Colors.primary ? Colors.primary : '#000'}
                                    />
                                </TouchableOpacity>
                            );
                        }}
                    />
                </View>
            </View>
        </BaseContainer>
    );
};

export default Settings;

const styles = StyleSheet.create({
    profileContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 20,
        padding: 15,
        paddingVertical: 20,
        backgroundColor: '#fff',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 15,
        elevation: 15,
        shadowColor: Platform.OS == 'ios' ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.9)',
        shadowRadius: 10,
        borderRadius: 10,
    },
    profileInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    profileImg: {
        width: 60,
        height: 60,
        borderRadius: 50,
        borderColor: Colors.red
    },
    profileText: {
        fontSize: getProportionalFontSize(20),
        color: Colors.black ? Colors.black : '#000',
        fontFamily: Assets.fonts.bold,
    },
    profileSubText: {
        fontSize: getProportionalFontSize(17),
        color: Colors.companyListing.primary,
        fontFamily: Assets.fonts.semiBold,
    },
    flatListStyling: {
        // backgroundColor: '#fff',
        borderRadius: 10,
        marginTop: 20,
        padding: 20,
    },
    flatListText: {
        fontSize: getProportionalFontSize(17),
        color: Colors.black,
        fontFamily: Assets.fonts.semiBold,
        marginLeft: 15,
    },
});
