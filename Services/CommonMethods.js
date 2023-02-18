import React from 'react';
import moment from 'moment';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import DocumentPicker from 'react-native-document-picker';
import ImagePicker from 'react-native-image-crop-picker';
import asyncStorageService from './AsyncStorageService';
import { Dimensions, Platform } from 'react-native';
// import Alert from '../Components/Alert'
import CryptoJS from 'react-native-crypto-js';

import Constants from '../Constants/Constants';
import Alert from '../Components/Alert';

const dateFormat = "DD-MM-yyyy";
const dateFormatReverse = "yyyy-MM-DD"
const timeFormat = "hh:mm:ss a";
const timeFormat24Hours = "HH:mm";

// let asyncStorageService = new AsyncStorageService();

const { width, height } = Dimensions.get('window');

const guidelineBaseWidth = 360;
const guidelineBaseHeight = 760;
const scale = size => (width / guidelineBaseWidth) * size;
const verticalScale = size => (height / guidelineBaseHeight) * size;
const moderateScale = (size, factor = 0.5) =>
    size + (scale(size) - size) * factor;

export const formatDateForAPI = (value, format = "YYYY-MM-DD") => {
    const d = moment(value).format(format)
    if (d !== "Invalid date") {
        return d
    } else {
        return null
    }
}

export const formatTimeForAPI = (value, format = "YYYY-MM-DD HH:mm") => {
    const d = moment(value).format(format)
    if (d !== "Invalid date") {
        return d
    } else {
        return null
    }
}

export const checkPermission = (group_name, type, permissions) => {
    if (permissions[group_name] && permissions[group_name][type])
        return true
    else
        return false
}

export const placeholderCreator = (defaultPlaceHolder, arr, keyInObject) => {
    if (arr?.length > 0) {
        let placeholder = "";
        placeholder = keyInObject ? arr[0][keyInObject] : arr[0];
        arr.map((item, index) => {
            if (index != 0) {
                placeholder = placeholder + ", " + (keyInObject ? item[keyInObject] : item)
            }
        })
        return placeholder;
    }
    else
        return defaultPlaceHolder;
}


export const getActionSheetAPIDetail = (payload) => {
    return (
        {
            url: '', method: 'post', data: [], perPage: 30, page: 1, token: '', params: {}, selectedData: [], loadMoreVisible: true, ...payload
        }
    )
}

export function setSwedishNumber(checkMe) {
    String.prototype.splice = function (idx, rem, str) {
        return this.slice(0, idx) + str + this.slice(idx + Math.abs(rem));
    };
    let temp = checkMe.toString();
    temp = temp.splice(4, 0, ' ');
    temp = temp.splice(8, 0, ' ');
    return temp;
}

export function Encrypt(value) {
    return CryptoJS.AES.encrypt(value, Constants.encryptionKey).toString();
}

export function EncryptObject(obj) {
    let basicDetailObj = obj;
    Object.keys(obj).map(key => {
        if (basicDetailObj[key] && shouldItBeDecyptedOrEncrypted(key)) {
            basicDetailObj[key] = Encrypt(basicDetailObj[key]);
        }
    });
    return basicDetailObj;
}

export function Decrypt(value) {
    if (!value) return '';
    let bytes = CryptoJS.AES.decrypt(value, Constants.encryptionKey);
    let originalText = bytes.toString(CryptoJS.enc.Utf8);
    //console.log('decrypted value', originalText)
    return originalText;
}

export function DecryptObject(obj) {
    let basicDetailObj = obj;
    Object.keys(obj).map(key => {
        if (basicDetailObj[key] && shouldItBeDecyptedOrEncrypted(key)) {
            basicDetailObj[key] = Decrypt(basicDetailObj[key]);
        }
    });
    return basicDetailObj;
}

function shouldItBeDecyptedOrEncrypted(key) {
    if (
        key == 'first_name' ||
        key == 'last_name' ||
        key == 'email' ||
        key == 'contact_number' ||
        key == 'dob' ||
        key == 'gender' ||
        key == 'guardian_first_name' ||
        key == 'guardian_last_name' ||
        key == 'guardian_email' ||
        key == 'guardian_contact_number' ||
        key == 'cp_first_name' ||
        key == 'cp_contact_number' ||
        key == 'cp_gender' ||
        key == 'cp_last_name' ||
        key == 'cp_email' ||
        key == 'social_security_number'
    )
        return true;
    return false;
}

export async function setDefaultLanguage(langData) {
    await asyncStorageService._storeDataAsJSON('defaultLanguage', langData);
}

export async function getDefaultLanguage() {
    let defaultLanguage = await asyncStorageService._retrieveDataAsJSON(
        'defaultLanguage',
    );
    return defaultLanguage;
}

export async function getUserType(type) {
    let userTypeList = await asyncStorageService._retrieveDataAsJSON(
        'userTypeList',
    );
    let userType = {};
    userTypeList.map(obj => {
        if (type == obj.title) {
            userType = obj;
        }
    });
    return userType;
}

export function getDropDownListFromLabels(object) {
    // console.log("object.....>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>", object)
    let object_list = [];
    Object.keys(object).map(key => {
        let obj = {
            label_name: key,
            label_value: object[key],
            value: object[key],
        };
        object_list.push(obj);
    });
    return object_list;
}

export const isFloat = n => {
    return Number(n) === n && n % 1 !== 0;
};

export const currencyFormat = (
    money,
    languageCode = 'sv',
    countryCode = 'SE',
    currency = 'SEK',
) => {
    // console.log('money', money);
    return new Intl.NumberFormat(`${languageCode}-${countryCode}`, {
        currency: currency,
        style: 'currency',
        // minimumFractionDigits: isFloat(money) ? 2: 0,
        //maximumFractionDigits: isFloat(money) ? 2 : 0,
    }).format(money);
};

export function checkUrlFormat(str) {
    var pattern = new RegExp(
        '^(https?:\\/\\/)?' + // protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
        '(\\#[-a-z\\d_]*)?$',
        'i',
    ); // fragment locator
    return pattern.test(str);
}

export function checkEmailFormat(email) {
    const emailCheck =
        /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i;
    return emailCheck.test(email);
}

export function paymentCardType(cardNumber) {
    const mastercard =
        /^5[1-5][0-9]{5,}|222[1-9][0-9]{3,}|22[3-9][0-9]{4,}|2[3-6][0-9]{5,}|27[01][0-9]{4,}|2720[0-9]{3,}$/;
    if (mastercard.test(cardNumber)) return 'mastercard';

    const americanexpress = /^3[47][0-9]{5,}$/;
    if (americanexpress.test(cardNumber)) return 'americanexpress';

    const visa = /^4[0-9]{6,}$/;
    if (visa.test(cardNumber)) return 'visa';

    const dinersclub = /^3(?:0[0-5]|[68][0-9])[0-9]{4,}$/;
    if (dinersclub.test(cardNumber)) return 'dinersclub';

    const discover = /^6(?:011|5[0-9]{2})[0-9]{3,}$/;
    if (discover.test(cardNumber)) return 'discover';

    const jcb = /^(?:2131|1800|35[0-9]{3})[0-9]{3,}$/;
    if (jcb.test(cardNumber)) return 'jcb';

    return null;
}

export function checkMobileNumberFormat(mobileNo) {
    const mobileNoCheck = /^[0-9]{10,10}$/;
    return mobileNoCheck.test(mobileNo);
}

export function formatDate(value) {
    return moment(value).format(dateFormat);
}
export function reverseFormatDate(value) {
    return moment(value).format(dateFormatReverse);
}
export function formatDateByFormat(value, format) {
    return moment(value).format(format);
}

export function formatTime(value) {
    //return this.datePipe.transform(value,this.timeFormat);
    // let time = value.split(':');
    let formattedTime = "";
    // let time_0 = parseInt(time[0]);
    // let time_1 = parseInt(time[1]);
    // //console.log(time);
    // if (time[0] <= 12)
    //     formattedTime = "" + time_0;
    // else
    //     formattedTime = time_0 - 12;

    // formattedTime = formattedTime + ":" + time_1;

    // if (time_0 >= 12 && time_1 >= 0)
    //     formattedTime = formattedTime + " PM";
    // else
    //     formattedTime = formattedTime + " AM";

    //console.log("formattedTime : ", formattedTime);
    formattedTime = moment(value).format(timeFormat24Hours);
    return formattedTime;

}

export const funGetTime = date => {
    var d = new Date(date);
    // if (isNaN(d))
    //     d = jsCoreDateCreator(date.substr(0, 20))
    //console.log('funGetTime', d)

    return moment(d).format('LT');
};

export const jsCoreDateCreator = dateString => {
    // dateString HAS to be in this format "YYYY-MM-DD HH:MM:SS"
    let dateParam = dateString?.split(/[\s-:]/);
    dateParam[1] = (parseInt(dateParam[1], 10) - 1).toString();
    return new Date(...dateParam);
};

export function formatDateWithTime(value) {
    const format = dateFormat + ' ' + timeFormat;
    return moment(value).format(format);
}

export function addDaysInDateObj(dateToAddDays, days) {
    // console.log('dateToAddDays', dateToAddDays);
    let date = new Date();
    // if (typeof (dateToAddDays == "string"))
    //     date.setDate(new Date(dateToAddDays).getDate() + days)
    // else
    var newDate = new Date(dateToAddDays.getTime() + days * 24 * 60 * 60 * 1000);
    // date.setDate(dateToAddDays.getDate() + days)
    // date.setMonth(dateToAddDays.getMonth())
    // console.log(
    //     'date--------------------------------------',
    //     formatDate(newDate),
    // );
    return newDate;
}

export function timeDiffCalc(dateFuture, dateNow) {
    let diffInMilliSeconds = Math.abs(dateFuture - dateNow) / 1000;

    // calculate days
    const days = Math.floor(diffInMilliSeconds / 86400);
    diffInMilliSeconds -= days * 86400;
    // console.log('calculated days', days);

    // calculate hours
    const hours = Math.floor(diffInMilliSeconds / 3600) % 24;
    diffInMilliSeconds -= hours * 3600;
    // console.log('calculated hours', hours);

    // calculate minutes
    const minutes = Math.floor(diffInMilliSeconds / 60) % 60;
    diffInMilliSeconds -= minutes * 60;
    // console.log('minutes', minutes);

    let totalHours = days >= 1 ? days * 24 + hours : hours;

    let difference = {
        days: days,
        hours: hours,
        minutes: minutes,
        totalHours: totalHours,
    };
    // if (days > 0) {
    //     difference += (days === 1) ? `${days} day, ` : `${days} days, `;
    // }

    // difference += (hours === 0 || hours === 1) ? `${hours} hour, ` : `${hours} hours, `;

    // difference += (minutes === 0 || hours === 1) ? `${minutes} minutes` : `${minutes} minutes`;

    return difference;
}

export function DateDifference(date) {
    // console.log(date);
    var d1 = new Date();
    var d2 = date ? jsCoreDateCreator(date) : new Date();

    // console.log(d1 <= d2); // prints false (wrong!)
    if (d1 <= d2) return true;
    else return false;
}

export function ReplaceAll(checkMe, toberep, repwith) {
    let temp = checkMe;
    let i = temp.indexOf(toberep);
    while (i > -1) {
        //Loop through and replace all instances
        temp = temp.replace(toberep, repwith);
        i = temp.indexOf(toberep);
    }
    return temp;
}

export function LaunchCamera(options, callbackMethod) {
    return launchCamera(options, callbackMethod);
}

export function calculate_age(dob1) {
    var today = new Date();
    var birthDate = new Date(dob1); // create a date object directly from `dob1` argument
    var age_now = today.getFullYear() - birthDate.getFullYear();
    var m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age_now--;
    }
    //console.log(dob1);
    return age_now;
}

export function checkFileSize(file) {
    var size = 0;
    if (file.type === 'application/pdf') size = file.size;
    else size = file.fileSize ? file.fileSize : file.size;
    var sizeKB = size / 1024;
    var sizeMB = size / 1048576;
    // console.log('sizeKB : ' + sizeKB + ' sizeMB : ' + sizeMB);
    if (sizeMB <= 5) {
        return true;
    } else {
        Alert.showAlert(Constants.warning, Constants.labels_for_non_react_files.file_size_error_message)
        return false;
    }
}

export function getJSObjectFromTimeString(time) {
    // let now = new Date();
    // let nowDateTime = now.toISOString();
    // let nowDate = nowDateTime.split('T')[0];
    // let hms = timeString;
    // let target = new Date(nowDate + hms);
    time = time.split(':');
    let now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate(), ...time);
    // return target;
}

export function isDocOrImage(fileName) {
    if (!fileName)
        return "";
    if (fileName.includes('.pdf') || fileName.includes('.doc') || fileName.includes('.docx')) {
        return 'document'
    }
    else
        return 'image'
}

export function sortStringsContainingNumbers(obj) {
    // Implemented by GAURAV MATHUR
    if (!obj) return {};
    let objTemp = obj;
    let arrayToSort = [];
    let arrayWithOnlyWord = [];
    let objWithKeyAsValueOfObj = [];
    Object.keys(objTemp).map(key => {
        let str = objTemp[key];
        let matches = str.match(/(\d+)/);
        if (matches) {
            arrayToSort.push(parseInt(matches[0]));
            objWithKeyAsValueOfObj[matches[0]] = key;
        } else arrayWithOnlyWord.push(key);
    });
    arrayToSort.sort(function (a, b) {
        return a - b;
    });
    let ansObj = {};
    for (let i = 0; i < arrayToSort.length; i++) {
        let temp = '' + objWithKeyAsValueOfObj[arrayToSort[i]];
        ansObj[temp] = objTemp[temp];
    }
    arrayWithOnlyWord.map(val => {
        ansObj[val] = objTemp[val];
    });
    return ansObj;
}

export async function OpenDocumentPicker(type) {
    // console.log('DocumentPicker.types=====', DocumentPicker.types);
    let res = null;
    try {
        if (type === 'multiple') {
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
        // console.log(
        //     res.uri,
        //     res.type, // mime type
        //     res.name,
        //     res.size
        // );
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

export async function OpenImagePicker(type, alertTexts) {
    let res = null;
    try {
        if (type === 'multiple') {
            res = await ImagePicker.openPicker({
                multiple: true,
                compressImageQuality: 0.9,
                mediaType: 'photo',
            });
        } else {
            res = await ImagePicker.openPicker({
                multiple: false,
                compressImageQuality: 0.9,
                mediaType: 'photo',
            });
        }

        res.map((obj, index) => {
            obj['uri'] = obj.path;
            obj['type'] = obj.mime;
        });
        return res;
    } catch (err) {
        // console.log('err', err);
        //let msg = JSON.stringify(err)
        //console.log(msg)
        if (alertTexts) Alert.showToast(alertTexts);
        else Alert.showToast(err.message);
        throw err;
    }
}

export function getProportionalFontSize(baseFontSize) {
    var intialFontSize = baseFontSize || 14;
    // if (Platform.OS === 'ios') {
    // heightPercentageToDP(fontSizeToReturn );
    // }
    var fontSizeToReturnModerate = moderateScale(intialFontSize);
    var fontSizeToReturnVertical = verticalScale(intialFontSize);
    return Platform.OS == 'ios'
        ? fontSizeToReturnModerate
        : fontSizeToReturnVertical;
}

export function firstLetterFromString(text) {
    var result = text?.split(' ').map(i => i.charAt(0))
    // result = result.toUpperCase()
    result = result.slice(0, 2)
    return result ?? "CL"
}
export function CurruntDate() {
    var currentDate = new Date()
    var day = currentDate.getDate()
    if (day < 10) {
        day = "0" + day
    }
    var month = currentDate.getMonth() + 1
    if (month < 10) {
        month = "0" + month
    }
    var year = currentDate.getFullYear()
    var fullDate = (day + "/" + month + "/" + year)
    var fullDate = (year + "-" + month + "-" + day)
    return fullDate
}
// export const GetDate = () => {
//     var currentDate = new Date()
//     var day = currentDate.getDate()
//     var month = currentDate.getMonth() + 1
//     var year = currentDate.getFullYear()
//     var fullDate = (day + "/" + month + "/" + year)
//     return fullDate
// }

export const createDateFormateFromTime = (time) => {
    // console.log("new date drived from date str-------", new Date() + time)
    return new Date() + time
}

export const CreateLicenseKey = () => {
    const str = "abcdefghijklmnopqrstuvwxyz123456789";
    let string = ""
    for (let i = 0; i < 20; i++) {
        string += str[Math.floor(Math.random() * str.length)]
    }
    const final = `${string.slice(0, 5)}-${string.slice(5, 10)}-${string.slice(10, 15)}-${string.slice(15, 20)}`
    return final.toUpperCase()
    // setLicenseKey(`${final.toUpperCase()}`)
    // setValue("licence_key", `${final.toUpperCase()}`)    
}

export const timeFromNow = (date) => {
    return moment(date).calendar();
}

export const CompareDates = (d1, d2) => {
    var date1 = new Date(d1);
    var date2 = new Date(d2);
    if (date1 >= date2) {
        return true
    }
    else {
        return false
    }
}
export function differenceInWeek(start, end) {
    var endDate = new Date(end);
    var startDate = new Date(start);
    var weeks = Math.round((endDate - startDate) / 604800000);
    return weeks
}
export function differenceInDays(start, end) {
    var endDate = new Date(end);
    var startDate = new Date(start);
    var days = Math.round((endDate - startDate) / 86400000);
    return days
}
export function diffInTime(start, end) {
    var startDate = start
    var endDate = end
    // console.log("startDate----------", startDate);
    // console.log("endDate------------", endDate)
    var diff = endDate.getTime() - startDate.getTime();
    var hours = Math.floor(diff / 1000 / 60 / 60);
    diff -= hours * 1000 * 60 * 60;
    var minutes = Math.floor(diff / 1000 / 60);
    // If using time pickers with 24 hours format, add the below line get exact hours
    if (hours < 0)
        hours = hours + 24;
    return (hours <= 9 ? "0" : "") + hours + ":" + (minutes <= 9 ? "0" : "") + minutes;
}
export const getAgeByPersonalNo = (PN) => {
    if (!PN) {
        // console.log("1hey user your age is undefined ");
        return false;
    }
    let age_now = moment(PN.slice(0, 8), "YYYYMMDD").fromNow();
    if (parseInt(age_now) < 150) {
        age_now = age_now.replace("years ago", "Years old");
        return age_now;
    }
    else {
        // console.log("hey user your age is  ---- ", age_now)
        return false
    }
}
