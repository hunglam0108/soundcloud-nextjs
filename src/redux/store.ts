import { configureStore } from "@reduxjs/toolkit";
import popupMessageReducer from "./features/popup";
import playListFooterReducer from "./features/playListFooter";

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const store = configureStore({
  reducer: {
    messageChip: popupMessageReducer,
    playListFooter: playListFooterReducer,
  }
});

export default store;