import React from "react";
import { ActivityIndicator, View, StyleSheet, } from "react-native";
import Colors from '../Constants/Colors';


export default TransparentLoader = (props) => {
    return (
        <>
            {
                props.isLoading
                    ?
                    <View style={styles.transparentView} >
                        <ActivityIndicator color={Colors.primary} size="large" />
                    </View>
                    : null
            }
        </>
    );
}

const styles = StyleSheet.create({
    transparentView: {
        flex: 1,
        zIndex: 1000,
        backgroundColor: Colors.transparent_black,
        justifyContent: "center",
        alignItems: "center",
        position: "absolute",
        height: "100%",
        width: "100%"
    }
});
