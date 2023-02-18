import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { check, PERMISSIONS, RESULTS, request } from 'react-native-permissions';
import DocumentPicker from 'react-native-document-picker';
import {
    Platform,
    PermissionsAndroid,
} from 'react-native';
import Constants from '../Constants/Constants';
import Geolocation from 'react-native-geolocation-service';
import Alert from '../Components/Alert';

export default {

    requestCameraPermission: async () => {
        let permission = false;
        if (Platform.OS == 'ios') {
            let iosPermission = await check(PERMISSIONS.IOS.CAMERA)
            // console.log('iosPermission', iosPermission)
            if (iosPermission == RESULTS.DENIED) {
                let iosRequestResult = await request(PERMISSIONS.IOS.CAMERA)
                // console.log('iosRequestResult', iosRequestResult)
                if (iosRequestResult == RESULTS.GRANTED) {
                    permission = true;
                }
            }
            else if (iosPermission == RESULTS.GRANTED) {
                permission = true;
            }
        }
        else {
            try {
                let androidPermission = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.CAMERA)
                if (!androidPermission) {
                    const granted = await PermissionsAndroid.request(
                        PermissionsAndroid.PERMISSIONS.CAMERA,
                        {
                            title: Constants.labels_for_non_react_files.app_camera_permission,
                            message: Constants.labels_for_non_react_files.app_needs_access_to_your_camera,
                            buttonNeutral: Constants.labels_for_non_react_files.ask_me_later,
                            buttonNegative: Constants.labels_for_non_react_files.cancel,
                            buttonPositive: Constants.labels_for_non_react_files.ok
                        }
                    );
                    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                        permission = true;
                    } else {
                        // console.log("Camera permission denied");
                    }
                }
                else if (androidPermission) {
                    permission = true;
                }
            } catch (err) {
                console.warn(err);
            }
        }
        if (!permission)
            Alert.showToast(Constants.labels_for_non_react_files.camera_permission_not_available)
        return permission;
    },

    openCamera: async function (chooseMultiple) {
        let response = null;
        let permission = await this.requestCameraPermission()
        if (permission) {
            await launchCamera({
                mediaType: 'photo',
                quality: 1,
                cameraType: 'back',
                selectionLimit: chooseMultiple ? Constants.documentOrImageSelectionLimit : 1,
            }, (res) => { response = res })
        }
        return response;
    },


    OpenDocumentPicker: async function (chooseMultiple) {
        // console.log('DocumentPicker.types=====', DocumentPicker.types);
        let permission = await this.requestImageOrStoragePermission(true);
        let res = null;
        if (permission) {
            try {
                if (chooseMultiple) {
                    res = await DocumentPicker.pickMultiple({
                        type: [
                            DocumentPicker.types.pdf,
                            DocumentPicker.types.doc,
                            DocumentPicker.types.docx,
                        ],
                    });
                } else {
                    res = await DocumentPicker.pick({
                        type: [
                            DocumentPicker.types.pdf,
                            DocumentPicker.types.doc,
                            DocumentPicker.types.docx,
                        ],
                    });
                }
                return res;
            } catch (err) {
                // console.log('DocumentPicker Error', err);
                if (DocumentPicker.isCancel(err)) {
                    // User cancelled the picker, exit any dialogs or menus and move on
                } else {
                    throw err;
                }
            }
        }
        return res;
    },

    requestImageOrStoragePermission: async function (askingForDocumentPicker) {
        let permission = false;
        if (Platform.OS == 'ios') {
            let iosPermission = await check(askingForDocumentPicker ? PERMISSIONS.IOS.MEDIA_LIBRARY : PERMISSIONS.IOS.PHOTO_LIBRARY)
            // console.log('iosPermission', iosPermission)
            if (iosPermission == RESULTS.DENIED) {
                let iosRequestResult = await request(askingForDocumentPicker ? PERMISSIONS.IOS.MEDIA_LIBRARY : PERMISSIONS.IOS.PHOTO_LIBRARY)
                // console.log('iosRequestResult', iosRequestResult)
                if (iosRequestResult == RESULTS.GRANTED) {
                    permission = true;
                }
            }
            else if (iosPermission == RESULTS.GRANTED) {
                permission = true;
            }
        }
        else {
            try {
                let androidPermission = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE)
                if (!androidPermission) {
                    const granted = await PermissionsAndroid.request(
                        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
                        {
                            title: Constants.labels_for_non_react_files.app_image_permission,
                            message: Constants.labels_for_non_react_files.app_needs_access_to_your_image_library,
                            buttonNeutral: Constants.labels_for_non_react_files.ask_me_later,
                            buttonNegative: Constants.labels_for_non_react_files.cancel,
                            buttonPositive: Constants.labels_for_non_react_files.ok
                        }
                    );
                    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                        permission = true;
                    } else {
                        // console.log("READ_MEDIA_IMAGES permission denied");
                    }
                }
                else if (androidPermission) {
                    permission = true;
                }
            } catch (err) {
                console.warn(err);
            }
        }
        if (!permission)
            Alert.showToast(Constants.labels_for_non_react_files.image_permission_not_available)
        return permission;
    },

    openImageLibrary: async function (chooseMultiple) {
        let response = null;
        let permission = await this.requestImageOrStoragePermission()
        if (permission) {
            try {
                await launchImageLibrary({
                    mediaType: 'photo',
                    quality: 1,
                    cameraType: 'back',
                    selectionLimit: chooseMultiple ? Constants.documentOrImageSelectionLimit : 1,
                }, (res) => { response = res; })
            }
            catch (error) {
                // console.log('library error', error)
            }
        }
        return response;
    },

    requestLocationPermission: async function () {
        if (Platform.OS == 'ios') {
            let iosPermission = await check(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE)
            // console.log('iosPermission', iosPermission)
            if (iosPermission == RESULTS.DENIED) {
                let iosRequestResult = await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE)
                // console.log('iosRequestResult', iosRequestResult)
                if (iosRequestResult == RESULTS.GRANTED) {
                    return true;
                }
                else {
                    return false;
                }
            }
            else if (iosPermission == RESULTS.GRANTED) {
                return true;
            }
            else {
                return false;
            }
        }
        else if (Platform.OS == 'android') {
            const hasLocationPermission = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
            //console.log('hasLocationPermission', hasLocationPermission)
            if (hasLocationPermission) {
                return true;
            }
            else if (!hasLocationPermission) {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                    {
                        'title': Constants.labels_for_non_react_files.location_permission_required,
                        'message': Constants.labels_for_non_react_files.grant_location_permission,
                    }
                )
                //    console.log('granted', granted)
                if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                    return true
                } else {
                    return false;
                }
            }
        }
    },

    getCurrentLocation: async function (onSuccess, onFailure) {
        const hasLocationPermission = await this.requestLocationPermission()
        if (hasLocationPermission) {
            Geolocation.getCurrentPosition(
                (position) => {
                    // console.log(position);
                    onSuccess ? onSuccess(position) : null
                },
                (error) => {
                    // See error code charts below.
                    // console.log(error.code, error.message);
                    onFailure ? onFailure() : null
                    Alert.showToast(error.message ? error.message : '');
                },
                { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
            );
        }
        else {
            Alert.showToast(Constants.labels_for_non_react_files.location_permission_required)
            onFailure ? onFailure() : null
        }
    }
}