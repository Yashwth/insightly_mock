import { AuthState } from "./slices/authSlice";
import { insightlyApi } from "../api/userService";
import { TeamsState } from "./slices/teamSlice";
import { dashboardApi } from "../api/dashboardApi";
import { templatesApi } from "../api/templates";
import { CockpitState } from "./slices/cockpit";    
import { DurationState } from "./slices/durationSlice";

export type RootState ={
    auth :AuthState,
    teams:TeamsState,
    duration:DurationState,
    [insightlyApi.reducerPath]: typeof insightlyApi.reducer,
    [dashboardApi.reducerPath]: typeof dashboardApi.reducer,
    [templatesApi.reducerPath]: typeof templatesApi.reducer,
    cockpit:CockpitState
}