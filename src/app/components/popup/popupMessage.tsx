'use client'
import { popupSetContent } from "@/redux/features/popup";
import { RootState } from "@/redux/store";
import { Alert, AlertColor } from "@mui/material"
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const PopupMessage = () => {
  const { message, type, showMessage } = useSelector((state: RootState) => state.messageChip);
  const dispatch = useDispatch()
  useEffect(() => {
    if(message && type && showMessage) {
      setTimeout(() => dispatch(popupSetContent({ message: '', showMessage: false})), 4000)
    }
  }, [showMessage])
  return (
    <>
      <Alert 
        style={{ position: 'absolute', top: 0, right: 0, display: showMessage ? undefined : 'none'}} 
        variant="filled"
        severity={type as AlertColor}
      >
        {message}
      </Alert>
    </>
  )
}
export default PopupMessage;