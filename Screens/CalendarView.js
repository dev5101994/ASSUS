import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import Colors from '../Constants/Colors';
import { getProportionalFontSize, CurruntDate } from '../Services/CommonMethods';
import Constants from '../Constants/Constants';
import Assets from '../Assets/Assets';
import CalendarComponent from '../Components/CalendarComponent';
import CalendarAgenda from '../Components/CalendarAgenda';
import { useSelector, useDispatch } from 'react-redux';

const currunt_date = CurruntDate()

const CalendarView = ({ navigation }) => {
    const [option, setOption] = React.useState("Schadule");
    // REDUX hooks
    const UserLogin = useSelector(state => state.User.UserLogin);
    const labels = useSelector(state => state.Labels);
    const messages = useSelector(state => state.Labels);

    const Options = (props) => {
        return (
            <TouchableOpacity onPress={() => setOption(props.title)}
                style={{
                    ...styles.optionContainer,
                    backgroundColor: props.focused ? "#E4FFF0" : Colors.white,
                    borderWidth: props.focused ? 1 : 0,
                }}>
                <Text style={styles.options} >{props.title}</Text>
            </TouchableOpacity>
        )
    }

    return (
        <BaseContainer
            title={labels["calendar"]}
            leftIcon="arrow-back"
            leftIconColor={Colors.primary}
            // leftIconSize={24}
            onPressLeftIcon={() => { navigation.pop() }}
            titleStyle={{ marginStart: 5 }}>
            {/* <View style={{ paddingHorizontal: Constants.globalPaddingHorizontal, }}>
                <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                    <Text style={{
                        fontFamily: Assets.fonts.medium,
                        fontSize: 15,
                    }}>{labels.select_the_view}</Text>
                    <Text style={{
                        fontFamily: Assets.fonts.medium,
                        fontSize: 12,
                        color: Colors.black
                    }}>
                        {currunt_date}
                    </Text>
                </View>

                <View style={{ flexDirection: "row", marginVertical: 15 }}>
                    <Options title="Schadule" focused={option == "Schadule" ? true : false} />
                    <Options title="Calendar" focused={option == "Calendar" ? true : false} />
                </View>
            </View> */}
            {
                option == "Schadule" ? <CalendarAgenda /> : <CalendarComponent />
            }
        </BaseContainer>
    )
}

export default CalendarView
const styles = StyleSheet.create({
    optionContainer: {
        shadowOffset: { width: 3, height: 3, },
        shadowOpacity: 10,
        elevation: 15,
        shadowColor: Platform.OS == "ios" ? Colors.shadowColorIosDefault : Colors.shadowColorAndroidDefault,
        shadowRadius: 10,
        marginRight: 40,
        borderColor: "#29C76F",
        borderRadius: 5
    },
    options: {
        fontSize: 11,
        paddingHorizontal: 15,
        paddingVertical: 8,
        fontFamily: Assets.fonts.medium
    }
});