import React from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import { StyleSheet, Text, View, TouchableOpacity, FlatList } from 'react-native';
import Colors from '../Constants/Colors';
import Assets from '../Assets/Assets';
import { TextInput } from 'react-native-paper';
import { getProportionalFontSize } from '../Services/CommonMethods';
import TextInputMask from 'react-native-text-input-mask';
import Constants from '../Constants/Constants';

export default InputValidation = (props) => {

    const isErrorTrue = () => {
        if (props.validationObj && props.uniqueKey && props.validationObj[props.uniqueKey].invalid === true)
            return true;
        return false;
    }

    const doesValueExit = () => {
        if (props.value === null || props.value === undefined || props.value === '')
            return false;
        return true;
    }
    // console.log('props.value', props.value.length)
    // console.log(' props.placeHolder', props.placeHolder)
    return (
        <>
            {
                props.editable === true || props.editable === undefined || props.editable === null
                    ? <View style={{ ...props.style, ...styles.mainView }}>
                        {props.placeHolder
                            ? <Text style={{ ...styles.headingTitleStyle, ...props.headingTitleStyle, color: props.disabled ? Colors.placeholderTextColor : Colors.darkPrimary }}>{props.optional === true ? props.placeHolder : props.placeHolder + "*"}</Text>
                            : null}

                        <TouchableOpacity
                            disabled={props.disabled ? true : false}
                            activeOpacity={props.onPress ? 0 : 1}
                            onPress={props.onPress ? props.onPress : props.onPressIcon ? props.onPressIcon : () => { }}
                        //  style={[styles.inputMainView, props.inputMainViewStyle, { marginTop: props.headingTitle ? 10 : 0, }]}>
                        >
                            {/* Input */}
                            {
                                props.maskedInput ?
                                    <TextInput
                                        disabled={props.disabled ? true : false}
                                        maxLength={props.maxLength ?? 500}
                                        secureTextEntry={props.secureTextEntry}
                                        multiline={props.multiline}
                                        editable={props.editable}
                                        onFocus={props.onFocus}
                                        ref={props.ref}
                                        mode="outlined"
                                        outlineColor={Colors.darkPrimary}
                                        textAlignVertical={'top'}
                                        theme={{ roundness: 10, }}
                                        error={isErrorTrue()}
                                        //label={<Text style={{ fontSize: (props.inputStyle.fontSize + 4) }}>{props.placeHolder}</Text>}
                                        value={props.value}
                                        onChangeText={(text) => { props.onChangeText ? props.onChangeText(text) : null }}
                                        keyboardType={props.keyboardType ? props.keyboardType : 'default'}
                                        style={{ ...styles.inputStyle, ...props.inputStyle }}
                                        placeholder={props.placeHolder}
                                        right={props.iconRight
                                            ? <TextInput.Icon
                                                style={{ marginLeft: 16 }}
                                                name={props.iconRight} size={props.size ? props.size : 25}
                                                color={isErrorTrue() ? Colors.red : props.iconColor ? props.iconColor : Colors.primary}
                                                onPress={(props.isIconTouchable && props.onPressIcon) ? props.onPressIcon : undefined}
                                            /> : null}
                                        left={props.iconLeft
                                            ? <TextInput.Icon
                                                name={props.iconLeft} size={props.size ? props.size : 25}
                                                color={isErrorTrue() ? Colors.red : props.iconColor ? props.iconColor : Colors.primary}
                                                onPress={(props.isIconTouchable && props.onPressIcon) ? props.onPressIcon : undefined}
                                            /> : null}
                                        render={innerProps =>
                                            <TextInputMask
                                                {...innerProps}
                                                mask={props.mask}
                                            />
                                        }
                                    />
                                    :
                                    <TextInput
                                        // disabled={props.disabled ? true : false}
                                        maxLength={props.maxLength ?? 500}
                                        secureTextEntry={props.secureTextEntry}
                                        multiline={props.multiline}
                                        editable={props.editable}
                                        onFocus={props.onFocus}
                                        ref={props.ref}
                                        mode="outlined"
                                        outlineColor={Colors.darkPrimary}
                                        textAlignVertical={'top'}
                                        theme={{
                                            roundness: 10,
                                            // colors: {
                                            //     placeholder: Colors.black,
                                            // }
                                        }}
                                        error={isErrorTrue()}
                                        style={{ ...styles.inputStyle, ...props.inputStyle, }}
                                        //label={<Text style={{ fontSize: (props.inputStyle.fontSize + 4) }}>{props.placeHolder}</Text>}
                                        value={props.value}
                                        onChangeText={(text) => {
                                            if (text == ' ')
                                                text = '';
                                            text = text.includes('  ') ? text.replace(Constants.noSpacePattern, '') : text;
                                            if (props.keyboardType == 'number-pad' || props.keyboardType == 'numeric') {
                                                text = text.replace(Constants.onlyNumberPattern, '')
                                            }
                                            props.onChangeText ? props.onChangeText(text) : null
                                        }}
                                        keyboardType={props.keyboardType ? props.keyboardType : 'default'}
                                        placeholder={props.placeHolder}
                                        right={props.iconRight
                                            ?
                                            <TextInput.Icon
                                                style={{ marginLeft: 16, borderWidth: 0, }}
                                                name={props.iconRight} size={props.size ? props.size : 25}
                                                color={isErrorTrue() ? Colors.red : props.iconColor ? props.iconColor : Colors.primary}
                                                onPress={(props.isIconTouchable && props.onPressIcon) ? props.onPressIcon : undefined}
                                            /> : null}
                                        left={props.iconLeft
                                            ? <TextInput.Icon
                                                name={props.iconLeft} size={props.size ? props.size : 25}
                                                color={isErrorTrue() ? Colors.red : props.iconColor ? props.iconColor : Colors.primary}
                                                onPress={(props.isIconTouchable && props.onPressIcon) ? props.onPressIcon : undefined}
                                            /> : null}
                                    />
                            }
                        </TouchableOpacity>


                        {/* error red text */}
                        {
                            isErrorTrue()
                                ? <Text style={[styles.errorText, props.errorTextStyle]}>{props.validationObj[props.uniqueKey].title}</Text>
                                : null
                        }

                        {/* Drop down list */}
                        {props.dropDownListData && typeof (props.dropDownListData) == "object" && Array.isArray(props.dropDownListData)
                            ? <FlatList
                                nestedScrollEnabled={true}
                                style={{ maxHeight: 300, backgroundColor: Colors.white, borderWidth: props.dropDownListData.length > 0 ? 1 : 0, marginTop: 2, borderColor: Colors.darkPlaceHoldColor, }}
                                contentContainerStyle={{}}
                                keyExtractor={(item, index) => '' + index}
                                data={props.dropDownListData}
                                renderItem={({ item, index }) => {
                                    return (
                                        <TouchableOpacity onPress={props.onPressDropDownListitem ? () => {
                                            props.onPressDropDownListitem(props.dropDownListDataKey ? item[props.dropDownListDataKey] : item.paragraph)
                                        } : () => { }} style={{ width: "100%", padding: 5, marginTop: 5, }}>
                                            <Icon
                                                style={{}}
                                                name={'compass-outline'} size={getProportionalFontSize(20)}
                                                color={Colors.darkPlaceHoldColor}
                                            />
                                            <Text style={{ fontSize: getProportionalFontSize(10), fontFamily: Assets.fonts.semiBold }}>{props.dropDownListDataKey ? item[props.dropDownListDataKey] : item.paragraph}</Text>
                                        </TouchableOpacity>
                                    )
                                }}
                            /> : null}

                    </View >
                    : <View style={{ ...props.style, ...styles.mainView, }}>
                        {props.placeHolder
                            ? <Text style={{ ...props.headingTitleStyle, ...styles.headingTitleStyle, color: props.disabled ? Colors.placeholderTextColor : Colors.darkPrimary }}>{props.optional === true ? props.placeHolder : props.placeHolder + "*"}</Text>
                            : null}

                        <TouchableOpacity
                            disabled={props.disabled ? true : false}
                            activeOpacity={props.onPress ? 0 : 1}
                            onPress={props.onPress ? props.onPress : props.onPressIcon ? props.onPressIcon : () => { }}
                            style={{
                                ...styles.nonEditableView,
                                borderColor: isErrorTrue() ? Colors.red : props.disabled ? Colors.lightGray : Colors.darkPrimary
                            }}
                        >
                            <Text style={{ fontFamily: Assets.fonts.regular, color: props.disabled ? Colors.gray : doesValueExit() ? Colors.black : Colors.darkPlaceHoldColor, ...props.nonEditableTextStyle }}>{doesValueExit() ? props.value : (props.optional === true ? props.placeHolder : props.placeHolder + "*")}</Text>
                            <Icon
                                style={{ marginLeft: 16, borderWidth: 0, }}
                                name={props.iconRight} size={props.size ? props.size : getProportionalFontSize(20)}
                                color={isErrorTrue() ? Colors.red : props.disabled ? Colors.lightGray : props.iconColor ? props.iconColor : Colors.primary}
                            //  onPress={(props.isIconTouchable && props.onPressIcon) ? props.onPressIcon : undefined}
                            />
                        </TouchableOpacity>

                        {/* error red text */}
                        {
                            isErrorTrue()
                                ? <Text style={[styles.errorText, props.errorTextStyle]}>{props.validationObj[props.uniqueKey].title}</Text>
                                : null
                        }
                    </View >
            }
        </>
    );
};

const styles = StyleSheet.create({
    mainView: {
        //borderWidth: 1
    },
    headingTitleStyle: {
        fontFamily: Assets.fonts.robotoMedium,
        fontSize: getProportionalFontSize(15),
        // color: Colors.darkPrimary,
        // fontWeight: "4s00"
    },
    inputMainView: {
        width: '100%',
        minHeight: 50,
        //borderWidth: 1,

        flexDirection: 'row',
        alignItems: "center",
        justifyContent: 'center',
        backgroundColor: Colors.transparent,
    },
    errorText: {
        color: Colors.red,
        fontFamily: Assets.fonts.robotoregular,
        fontSize: getProportionalFontSize(12),
        marginTop: 7
    },
    input: {

    },
    inputStyle: {
        width: '100%',
        marginTop: 0,
        //flex: 1,
        // height: 50,
        //borderRadius: 10,
        backgroundColor: Colors.white,
        //borderColor: Colors.borderColor,
        //justifyContent: "center",
        //justifyContent: 'center',
        //padding: 0,
        //height: 40,
        //borderWidth: 1,
        //fontFamily: Assets.fonts.regular,
    },
    nonEditableView: {
        width: '100%',
        minHeight: 57,
        borderWidth: 1,
        flexDirection: 'row',
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: Colors.white,
        paddingHorizontal: 10,
        marginTop: 5,
        borderRadius: 10,
    }
});

