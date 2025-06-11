import { createSlice } from '@reduxjs/toolkit';
import { Team } from '../../types/Team';

export type TeamsState = {
  isTeamsLoading: boolean;
  isMainTeamsLoading: boolean;
  teams: Team[];
  selectedTeam: Team | null;
  selectedMainTeam: Team | null;
  subTeams: Team[];
  mainTeams: Team[];
  teamsBreadcrumbs: Team[]
  checkedKeys: any[];
  checkedUsers: any[];
  teamOwnerIds: number[];
  allAvailableTeamIds: number[];
};

const initialState: TeamsState = {
  isTeamsLoading: false,
  isMainTeamsLoading: false,
  teams: [],
  selectedTeam: null,
  selectedMainTeam: null,
  subTeams: [],
  mainTeams: [],
  teamsBreadcrumbs: [],
  checkedKeys: [],
  checkedUsers: [],
  teamOwnerIds: [],
  allAvailableTeamIds: []
};

export const teamsSlice = createSlice({
  name: 'teams',
  initialState,
  reducers: {
    setIsTeamsLoading(state, action) {
      state.isTeamsLoading = action.payload;
    },
    setIsMainTeamsLoading(state, action) {
      state.isMainTeamsLoading = action.payload;
    },
    setTeams(state, action) {
      state.teams = action.payload;
    },
    setSelectedTeam(state, action) {
      state.selectedTeam = action.payload;
    },
    setSelectedMainTeam(state, action) {
      state.selectedMainTeam = action.payload;
    },
    setSubTeams(state, action) {
      state.subTeams = action.payload;
    },
    setMainTeams(state, action) {
      state.mainTeams = action.payload;
    },
    setTeamsBreadcrumbs(state, action) {
      state.teamsBreadcrumbs = action.payload;
    },
    setCheckedKeys(state, action) {
      state.checkedKeys = action.payload;
    },
    setCheckedUsers(state, action) {
      state.checkedUsers = action.payload;
    },
    setTeamOwnerIds(state, action) {
      state.teamOwnerIds = action.payload;
    },
    setAllAvailableTeamIds(state, action) {
      state.allAvailableTeamIds = action.payload;
    }
  }
});
export const { setIsTeamsLoading, setIsMainTeamsLoading, setTeams, setSubTeams, setMainTeams,setSelectedMainTeam, setSelectedTeam, setTeamsBreadcrumbs, setCheckedKeys, setCheckedUsers , setTeamOwnerIds, setAllAvailableTeamIds} = teamsSlice.actions;

export default teamsSlice.reducer;
