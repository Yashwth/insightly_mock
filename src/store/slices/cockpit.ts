import { createSlice } from "@reduxjs/toolkit";

export type CockpitState = {
    templatesData: any;
    templatesError: any;
    templatesLoading: boolean;
   
};
const initialState : CockpitState = {
    templatesData: null,
    templatesError: null,
    templatesLoading: false,
};

export const cockpitSlice = createSlice({
    name: "cockpit",
    initialState,
    reducers: {
        setTemplatesData: (state, action) => {
            state.templatesData = action.payload;
            
        },
        
    },
});

export const { setTemplatesData } = cockpitSlice.actions;
export default cockpitSlice.reducer;
