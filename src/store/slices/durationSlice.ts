// redux/slices/durationSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type DurationState = {
  startDate: number | null;
  endDate: number | null;
}

const initialState: DurationState = {
  startDate: null,
  endDate: null,
};

const durationSlice = createSlice({
  name: 'duration',
  initialState,
  reducers: {
    setDuration: (state, action: PayloadAction<{ startDate: number; endDate: number }>) => {
      state.startDate = action.payload.startDate;
      state.endDate = action.payload.endDate;
    },
  },
});

export const { setDuration } = durationSlice.actions;
export default durationSlice.reducer;
