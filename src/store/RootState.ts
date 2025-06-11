import { AuthState } from "./slices/authSlice";
import { insightlyApi } from "../api/userService";
import { TeamsState } from "./slices/teamSlice";


export type RootState ={
    auth :AuthState,
    teams:TeamsState,
    [insightlyApi.reducerPath]: typeof insightlyApi.reducer,

}