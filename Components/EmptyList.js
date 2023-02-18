import React from 'react';
import { StyleSheet, Text, View, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/SimpleLineIcons';
import IconFontAwesome from 'react-native-vector-icons/FontAwesome';
import { getProportionalFontSize } from '../Services/CommonMethods';
import Assets from '../Assets/Assets';
import Constants from '../Constants/Constants';
import Colors from '../Constants/Colors';
import { useSelector, useDispatch } from 'react-redux'
import LottieView from 'lottie-react-native';

const deviceHeight = Dimensions.get('window').height;

const EmptyList = (props) => {

    const labels = useSelector(state => state.Labels);

    return (
        <View style={styles.container}>
            {props.noModuleMsg
                ? <LottieView
                    source={require('../Assets/images/no_module.json')}
                    autoPlay
                    loop={true}
                    style={{
                        width: "15%",
                    }}
                />
                : props.messageIcon
                    ? <IconFontAwesome name={props.messageIcon} size={50} color={Colors.lightGray} />
                    : <Icon name={"social-dropbox"} size={50} color={Colors.lightGray} />}

            <Text style={styles.text}>{props.noModuleMsg ? labels.module_inactive : props.title ? props.title : labels.no_data_found}</Text>
            {props.noModuleMsg
                ? <Text style={styles.smallText}>{labels["contact-admin"]}</Text>
                : props.shouldAddDataMessageVisible === false
                    ? null
                    : <Text style={styles.smallText}>{props.subHeading ?? labels.click_add}</Text>
            }

            {props.noModuleMsg
                ? <CustomButton
                    style={styles.nextButton}
                    titleStyle={{ color: Colors.white }}
                    onPress={() => {
                        props?.navigation?.navigate ? props?.navigation?.navigate('RequestsStack', { screen: "RequestListing", params: { addModalVisible: true } }) : null
                    }}
                    title={labels.request_admin}
                />
                : null
            }
        </View>
    );
};

export default EmptyList;

const styles = StyleSheet.create({
    container: {
        height: deviceHeight / 2,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        fontSize: getProportionalFontSize(20),
        fontFamily: Assets.fonts.regular,
        marginTop: 20,
        letterSpacing: 1,
    },
    smallText: {
        fontSize: getProportionalFontSize(12),
        fontFamily: Assets.fonts.semiBold,
    },
    nextButton: {
        justifyContent: 'center',
        alignItems: 'center',
        width: '75%',
        height: 40,
        borderRadius: 20,
        backgroundColor: Colors.primary,
        marginTop: Constants.formFieldTopMargin,
    },
});
