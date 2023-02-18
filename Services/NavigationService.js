import * as React from 'react';
import { CommonActions } from '@react-navigation/native';

export const navigationRef = React.createRef();
export const isReadyRef = React.createRef();

export function navigate(dispatchNavData, shouldNavigateFromSplashScreen) {
    if (!navigationRef.current)
        return;
    if ((navigationRef.current.getRootState().index == 0 &&
        navigationRef.current.getRootState().routeNames.length >= 0)) {
        if (dispatchNavData)
            dispatchNavData()
        navigateToLogin(shouldNavigateFromSplashScreen)
    }
    else {
        navigate(dispatchNavData, shouldNavigateFromSplashScreen);
    }
}

function navigateToLogin(shouldNavigateFromSplashScreen) {
    navigationRef.current?.dispatch(
        CommonActions.reset({
            index: 0,
            routes: [
                { name: shouldNavigateFromSplashScreen ? "Splash" : "Login" },
            ],
        })
    );

}
