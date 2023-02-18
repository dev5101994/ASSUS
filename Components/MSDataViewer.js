import React, { useEffect } from 'react';
import { View, StyleSheet, Text, SafeAreaView, TouchableOpacity, FlatList } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Colors from '../Constants/Colors'
import Assets from '../Assets/Assets';
import { getProportionalFontSize } from '../Services/CommonMethods';
import Constants from '../Constants/Constants';

export default MSDataViewer = props => {
    // console.log('data==============', props.data)

    useEffect(() => {
        removeDuplicate()
    }, [props.data])

    const removeDuplicate = () => {
        const map = new Map();
        let duplicateFound = false;
        const newArray = [];
        props?.data?.map((item) => {
            let value = props.keyName ? item[props.keyName] : item?.name ? item.name : item;
            if (map.has(value)) {
                duplicateFound = true;
            }
            else {
                map.set(value, value)
                newArray.push(item);
            }
        })
        if (duplicateFound) {
            // console.log('duplicate found', map)
            props.setNewDataOnPressClose(newArray ?? [])
        }
        else {
            // console.log('duplicate NOT found')
        }
    }

    if (!props.data || props.data?.length <= 0)
        return null;

    return (
        <FlatList
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ marginTop: Constants.formFieldTopMargin }}
            horizontal
            keyExtractor={(item, index) => index}
            data={props.data}
            renderItem={({ item, index }) => {
                return (
                    <View style={{ ...styles.flatListCompStyle, backgroundColor: props.backgroundColor ?? Colors.primary, marginStart: index == 0 ? 0 : 5 }}>
                        <Text numberOfLines={2} style={styles.textStyle}>{props.keyName ? item[props.keyName] : item?.name ? item.name : item}</Text>
                        <Icon
                            size={getProportionalFontSize(20)}
                            onPress={props.onPressIcon ? props.onPressIcon : () => {
                                if (props.setNewDataOnPressClose) {
                                    let newArray = props.data;
                                    newArray?.splice(index, 1)
                                    props.setNewDataOnPressClose(newArray ?? [])
                                }
                            }}
                            name='close'
                            color={props.iconColor ?? Colors.red}
                        />
                    </View>
                )
            }}
        />
    );
};

const styles = StyleSheet.create({
    flatListCompStyle: {
        minWidth: 70, maxWidth: 130, paddingHorizontal: 7, height: 40, borderRadius: 10, justifyContent: "space-around", alignItems: "center", flexDirection: "row",
    },
    textStyle: {
        fontFamily: Assets.fonts.bold,
        fontSize: getProportionalFontSize(12),
        color: Colors.white,
        width: "80%"
    },
});
