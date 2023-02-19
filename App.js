
import React from 'react';
import { LogBox } from 'react-native';
import RootNavigator from './src/Components/RootNavigator';
import { configureFonts, DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import Colors from './src/Constants/Colors';
import { Root } from 'popup-ui'

// REDUX imports
import rootReducer from './src/Redux/Reducers'
import { createStore, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import thunk from 'redux-thunk';


LogBox.ignoreAllLogs();

//const aceussGlobalStore = createStore(rootReducer);
const middleware = [thunk];
const initialState = {}

const aceussGlobalStore = createStore(
    rootReducer,
    initialState,
    applyMiddleware(...middleware)
)
export const reduxStore = aceussGlobalStore
const fontConfig = {
    web: {
        regular: {
            fontFamily: 'Montserrat-Regular',
            fontWeight: 'normal',
        },
        medium: {
            fontFamily: 'Montserrat-Medium',
            fontWeight: 'normal',
        },
        bold: {
            fontFamily: 'Montserrat-Bold',
            fontWeight: 'normal',
        },
        light: {
            fontFamily: 'Montserrat-Light',
            fontWeight: 'normal',
        },
        thin: {
            fontFamily: 'Montserrat-Thin',
            fontWeight: 'normal',
        },

    },
    ios: {
        regular: {
            fontFamily: 'Montserrat-Regular',
            fontWeight: 'normal',
        },
        medium: {
            fontFamily: 'Montserrat-Medium',
            fontWeight: 'normal',
        },
        bold: {
            fontFamily: 'Montserrat-Bold',
            fontWeight: 'normal',
        },
        light: {
            fontFamily: 'Montserrat-Light',
            fontWeight: 'normal',
        },
        thin: {
            fontFamily: 'Montserrat-Thin',
            fontWeight: 'normal',
        },
    },
    android: {
        regular: {
            fontFamily: 'Montserrat-Regular',
            fontWeight: 'normal',
        },
        medium: {
            fontFamily: 'Montserrat-Medium',
            fontWeight: 'normal',
        },
        bold: {
            fontFamily: 'Montserrat-Bold',
            fontWeight: 'normal',
        },
        light: {
            fontFamily: 'Montserrat-Light',
            fontWeight: 'normal',
        },
        thin: {
            fontFamily: 'Montserrat-Thin',
            fontWeight: 'normal',
        },
    }
};

const theme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        primary: Colors.primary,
        error: Colors.red
        //accent: Colors.secondary,
    },
    fonts: configureFonts(fontConfig),
};

export default function App() {
    return (
        <Root>
            <Provider store={aceussGlobalStore}>
                <PaperProvider theme={theme}>
                    <RootNavigator />
                </PaperProvider>
            </Provider >
        </Root>
    )
};

