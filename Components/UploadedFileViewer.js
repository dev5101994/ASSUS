import React from 'react';
import { View, StyleSheet, Text, SafeAreaView, TouchableOpacity, FlatList, Image, Modal, Linking } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Colors from '../Constants/Colors'
import Assets from '../Assets/Assets';
import { getProportionalFontSize } from '../Services/CommonMethods';
import Constants from '../Constants/Constants';
import { useSelector, } from 'react-redux'
import ImageViewer from 'react-native-image-zoom-viewer';
import Alert from './Alert';
import ProgressLoader from './ProgressLoader';

export default UploadedFileViewer = props => {
    //console.log("props.data****************", props.data)

    const messages = useSelector(state => state.Labels);
    const [isModalVisible, setIsModalVisible] = React.useState(false);
    const [selectedImage, setSelectedImage] = React.useState('');

    if (!props.data || props.data?.length <= 0) {
        return (
            <View style={styles.dummyDataView}>
                <Icon name='cloud-offline-sharp' size={getProportionalFontSize(28)} color={Colors.gray} />
                <Text style={styles.dummyDataText}>{messages.message_no_file_uploaded}</Text>
            </View>
        )
    }

    if (props.isLoading) {
        return (
            <ProgressLoader onActivityIndicator={true} onActivityIndicatorColor={Colors.primary} onActivityIndicatorStyle={{ marginTop: Constants.formFieldTopMargin }} />
        )
    }

    return (
        <>
            <Modal onRequestClose={() => { setSelectedImage(''); setIsModalVisible(false) }} visible={isModalVisible} transparent={true}>
                <ImageViewer
                    renderHeader={() => {
                        return <Icon onPress={() => { setSelectedImage(''); setIsModalVisible(false) }}
                            name='close' size={27} color={Colors.white} style={{ alignSelf: "flex-end", padding: 5 }} />
                    }} imageUrls={[{ url: selectedImage }]} />
            </Modal>

            <FlatList
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{}}
                numColumns={3}
                keyExtractor={(item, index) => index}
                data={props.data}
                renderItem={({ item, index }) => {
                    // console.log("----------item----------", item)
                    return (
                        <TouchableOpacity
                            onPress={async () => {
                                if (item?.type?.includes('image')) {
                                    setSelectedImage(item.uri)
                                    setIsModalVisible(true)
                                }
                                else {
                                    let canOpenURL = await Linking.canOpenURL(item?.uploaded_doc_url)
                                    if (canOpenURL)
                                        Linking.openURL(item?.uploaded_doc_url);
                                    else {
                                        Alert.showToast(messages.message_url_can_not_open)
                                    }
                                }
                            }}
                            style={{ ...styles.flatListCompStyle, }}>
                            <Icon
                                name='close-circle-sharp'
                                size={getProportionalFontSize(20)}
                                color={Colors.red}
                                style={styles.iconStyle}
                                onPress={() => {
                                    let tempArr = props.data;
                                    tempArr.splice(index, 1);
                                    if (props.setNewData)
                                        props.setNewData(tempArr);
                                    Alert.showToast(messages.message_removed_successfully)
                                }}
                            />
                            {
                                item?.type?.includes('image') || item?.["file_url"]
                                    ? <Image
                                        source={{ uri: item.uri ?? item?.["file_url"] }}
                                        style={{ height: "100%", width: "100%", borderRadius: 10 }}
                                        resizeMode="cover"
                                    // onLoad={({nativeEvent}) =>{ setLoading( false)}}
                                    />
                                    : <Text numberOfLines={2} style={styles.normalText}>{item.type}</Text>
                            }
                        </TouchableOpacity>
                    )
                }}
            />
        </>
    );
};

const styles = StyleSheet.create({
    flatListCompStyle: {
        justifyContent: "center", alignItems: "center", borderRadius: 10, borderWidth: 1, borderColor: Colors.primary, height: 100, width: 100, marginStart: 5,
        marginTop: Constants.formFieldTopMargin,
    },
    iconStyle: { position: "absolute", right: 1, top: 1, zIndex: 100 },
    normalText: { fontFamily: Assets.fonts.semiBold, fontSize: getProportionalFontSize(8), color: Colors.black },
    dummyDataView: { justifyContent: "center", alignItems: "center", marginTop: Constants.formFieldTopMargin },
    dummyDataText: { fontFamily: Assets.fonts.boldItalic, color: Colors.gray, fontSize: getProportionalFontSize(13) }
});
