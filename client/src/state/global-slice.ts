import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface GlobalState {
  isSidebarCollapsed: boolean;
  isDarkMode: boolean;
  lastActiveProjectTab: string;
  lastActivePriorityView: string;
}

const initialState: GlobalState = {
  isSidebarCollapsed: false,
  isDarkMode: false,
  lastActiveProjectTab: "Board",
  lastActivePriorityView: "list",
};

const reducers = {
  setIsSidebarCollapsed: (
    state: GlobalState,
    action: PayloadAction<boolean>,
  ) => {
    state.isSidebarCollapsed = action.payload;
  },
  setIsDarkMode: (state: GlobalState, action: PayloadAction<boolean>) => {
    state.isDarkMode = action.payload;
  },
  setLastActiveProjectTab: (
    state: GlobalState,
    action: PayloadAction<string>,
  ) => {
    state.lastActiveProjectTab = action.payload;
  },
  setLastActivePriorityView: (
    state: GlobalState,
    action: PayloadAction<string>,
  ) => {
    state.lastActivePriorityView = action.payload;
  },
};

const globalSlice = createSlice({
  name: "global",
  initialState,
  reducers,
});

export const {
  setIsSidebarCollapsed,
  setIsDarkMode,
  setLastActiveProjectTab,
  setLastActivePriorityView,
} = globalSlice.actions;
export default globalSlice.reducer;
