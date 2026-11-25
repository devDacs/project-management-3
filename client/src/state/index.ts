import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface initialStateTypes {
  isSidebarCollapsed: boolean;
  isDarkMode: boolean;
  lastActiveProjectTab: string;
  lastActivePriorityView: string;
}

const initialState: initialStateTypes = {
  isSidebarCollapsed: false,
  isDarkMode: false,
  lastActiveProjectTab: "Board",
  lastActivePriorityView: "list",
};

const reducers = {
  setIsSidebarCollapsed: (
    state: initialStateTypes,
    action: PayloadAction<boolean>,
  ) => {
    state.isSidebarCollapsed = action.payload;
  },
  setIsDarkMode: (state: initialStateTypes, action: PayloadAction<boolean>) => {
    state.isDarkMode = action.payload;
  },
  setLastActiveProjectTab: (
    state: initialStateTypes,
    action: PayloadAction<string>,
  ) => {
    state.lastActiveProjectTab = action.payload;
  },
  setLastActivePriorityView: (
    state: initialStateTypes,
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
