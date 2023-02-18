
import React from 'react';
import {
    Text,
    TouchableOpacity,
    View, Platform
} from 'react-native';
import { useSelector } from 'react-redux';
import Assets from '../Assets/Assets';
import Colors from '../Constants/Colors';
import { getProportionalFontSize } from '../Services/CommonMethods';
import PickerAndLocationServices from '../Services/PickerAndLocationServices'

export default ImagePickerActionSheetComp = (props) => {

    const labels = useSelector(state => state.Labels);
    const [title, setTitle] = React.useState(props.giveChoice ? labels.choose : labels.select_photo);
    const [firstSubTitle, setFirstSubTitle] = React.useState(props.giveChoice ? labels.choose_document : labels.open_camera);
    const [secondSubTitle, setSecondSubTitle] = React.useState(props.giveChoice ? labels.choose_image : labels.choose_from_library);

    return (
        // Main view
        <View style={[{ height: Platform.OS == 'ios' ? '65%' : '45%', width: '100%', }, props.style]}>

            <View style={{ width: "100%", alignItems: 'center', justifyContent: 'center', marginTop: 5 }}>
                <View style={{ backgroundColor: 'grey', borderRadius: 10, width: 45, height: 7 }} />
            </View>

            <View style={{ padding: 20 }}>
                <Text style={{ fontFamily: Assets.fonts.bold, fontSize: getProportionalFontSize(16) }}>{title}</Text>
            </View>

            <View style={{ padding: 20 }}>
                <TouchableOpacity
                    onPress={async () => {
                        if (firstSubTitle == labels.choose_document) {
                            let docRes = await PickerAndLocationServices.OpenDocumentPicker(props.chooseMultiple)
                            if (!docRes)
                                return;
                            if (props.responseHandler) {
                                // console.log('docRes', docRes)
                                props.responseHandler(docRes);
                            }
                            if (props.closeSheet)
                                props.closeSheet()
                        }
                        else if (firstSubTitle == labels.open_camera) {
                            let camRes = await PickerAndLocationServices.openCamera(props.chooseMultiple)
                            if (!camRes)
                                return;
                            if (props.responseHandler) {
                                // console.log('camRes', camRes)
                                props.responseHandler(camRes);
                            }
                            if (props.closeSheet)
                                props.closeSheet()
                        }
                    }}
                    style={{ marginVertical: 10 }}>
                    <Text style={{ fontFamily: Assets.fonts.robotoregular, fontSize: getProportionalFontSize(16) }}>{firstSubTitle}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={async () => {
                        if (secondSubTitle == labels.choose_from_library) {
                            let libRes = await PickerAndLocationServices.openImageLibrary(props.chooseMultiple);
                            if (props.responseHandler) {
                                props.responseHandler(libRes);
                                // console.log('libRes', libRes)
                            }
                            if (props.closeSheet)
                                props.closeSheet()
                        }
                        else if (secondSubTitle == labels.choose_image) {
                            setTitle(labels.select_photo)
                            setFirstSubTitle(labels.open_camera)
                            setSecondSubTitle(labels.choose_from_library)
                        }
                    }}
                    style={{ marginVertical: 10 }}>
                    <Text style={{ fontFamily: Assets.fonts.robotoregular, fontSize: getProportionalFontSize(16) }}>{secondSubTitle}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => {
                        if (props.closeSheet)
                            props.closeSheet()
                    }}
                    style={{ marginVertical: 10 }}>
                    <Text style={{ fontFamily: Assets.fonts.robotoregular, fontSize: getProportionalFontSize(16) }}>{labels.cancel}</Text>
                </TouchableOpacity>
            </View>

        </View >
    )
}
