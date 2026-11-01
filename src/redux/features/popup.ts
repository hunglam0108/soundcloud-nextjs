import { createSlice } from "@reduxjs/toolkit";
export enum MessageType {
  error =  'error',
  info = 'info',
  warning = 'warning',
  success = 'success'
}

const initialState = { message: '', type: MessageType.error, showMessage: false };

const popupMessageSlice = createSlice({
  name: "popup",
  initialState,
  reducers: {
    popupSetContent: (state, actions) => { 
      state.message = actions.payload.message
      state.type = actions.payload.type
      state.showMessage = actions.payload.showMessage
    }
  },
});

export const { popupSetContent } = popupMessageSlice.actions;
export default popupMessageSlice.reducer;