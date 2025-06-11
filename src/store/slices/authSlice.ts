import { createSlice } from "@reduxjs/toolkit";
import type { User } from "../../types/User";

export type AuthState = {
    user: User;
    config:any,
    showEmailMismatch: boolean;
    featureFlags: any;
    landingPagePreference: string | null;
    favouriteDashboards: any[];
    isLandingPageNotSet: boolean;
};
const initialState : AuthState = {
    user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user') || '{}') : {},
    config:null,
    showEmailMismatch: false,
    featureFlags: null,
    landingPagePreference: null,
    favouriteDashboards: [],
    isLandingPageNotSet: false
};

export const AuthSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload;
            localStorage.setItem('user', JSON.stringify(action.payload));
        },
        logout: ( ) => {
            localStorage.removeItem('user');
        },
    },
});

export const { setUser, logout } = AuthSlice.actions;
export default AuthSlice.reducer;
