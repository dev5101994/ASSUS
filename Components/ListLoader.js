import React from "react";
import { ActivityIndicator, View, StyleSheet, Dimensions } from "react-native";

import Colors from '../Constants/Colors';
import LottieView from 'lottie-react-native';
import { itemsLoading } from "../Assets/Assets"
import Constants from "../Constants/Constants";


const ListLoader = () => {
    return (
        <View style={{
            flex: 1,
            marginHorizontal: Constants.globalPaddingHorizontal,

        }}>
            <LottieView
                source={require('../Assets/images/items-loading.json')}
                autoPlay
                loop
                style={{
                    width: "100%",
                }}
            /></View>
    );

}
export default ListLoader

const STYLES = StyleSheet.create({

    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: 'center',
        position: "absolute",
        width: Dimensions.get("window").width,
        height: Dimensions.get("window").height,
        zIndex: 997,
        backgroundColor: Colors.backgroundColor,
        //borderWidth: 1
    },
    loader: {
        //borderWidth: 1
    },
    onActivityIndicatorStyle: {},
    container: {
        position: "absolute",
        width: Dimensions.get("window").width,
        height: Dimensions.get("window").height,
        zIndex: 997,
    },
    containerOpac: {
        position: "absolute",
        width: Dimensions.get("window").width,
        height: Dimensions.get("window").height,
        backgroundColor: "rgba(0,0,0,0.5)",
        zIndex: 998
    },
    spinner: {
        flex: 1,
        alignSelf: "center",
        zIndex: 1000
    }
});
