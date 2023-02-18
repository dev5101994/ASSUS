import { StyleSheet, Text, View, ActivityIndicator } from 'react-native'
import React from 'react'
import Colors from '../Constants/Colors';
import LottieView from 'lottie-react-native';
// loading.json

const FooterCompForFlatlist = (props) => {
    if (props.paginationLoading) {
        return (
            <View style={{ height: 30, width: "100%", justifyContent: "center", alignItems: "center" }}>
                {/* <ActivityIndicator size="large" color={Colors.primary} /> */}
                {props.activityIndicator
                    ? <ActivityIndicator color={Colors.primary} />
                    : <LottieView
                        source={require('../Assets/images/loading.json')}
                        autoPlay
                        loop
                        style={{
                            width: "25%",
                        }}
                    />}
            </View>
        )
    } else {
        return (
            <View style={{ height: 30, width: "100%", justifyContent: "center", alignItems: "center" }}>
                {/* <Text style={{ fontSize: 25, }}>~</Text> */}
            </View>
        )
    }

}

export default FooterCompForFlatlist

const styles = StyleSheet.create({})

