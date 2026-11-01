'use client'
import { Button, Typography } from "@mui/material";
import { CloudUploadIcon } from "lucide-react";
import { useCallback, useRef } from "react";
import { useDropzone } from "react-dropzone";
import React from "react";
import { useSession } from "next-auth/react";
import axios from "axios";

const styles: StyleObject = {
  boxMusicUpload: { 
    padding: 10, 
    marginBottom: 20, 
    marginTop: 20, 
    backgroundColor:'#D3D3D3', 
    display: 'flex', 
    justifyContent: 'end',
    borderRadius: 20,
    alignItems: 'anchor-center'
  },
  divUploadMusic: {
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    border: '2px dashed #b887c1', 
    padding: 20, 
    textAlign: 'center', 
    flexDirection: 'column', 
    height: 400, 
    backgroundColor:'#D3D3D3'
  },
  uploadButton: { width: 400, borderRadius: 20, padding: 10, margin: 10 },
  closeButton: { width: 30, height: 30, backgroundColor: 'white', marginLeft: 10 }
}

const MusicUploadTab = (props: {
  fileUpload: File[] | FileList | null, 
  setFileUpload: (fileUpload: File[] | FileList | null) => void
  setProcessUpload: (data: number) => void
  setTitleUpload: (title: string) => void
}) => {
  const { fileUpload, setFileUpload, setProcessUpload, setTitleUpload } = props
  const { data: session } = useSession()
  const inputRef = useRef<HTMLInputElement>(null);
  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFileUpload(acceptedFiles)
    if(acceptedFiles[0]){
      uploadFile(acceptedFiles[0])
    }
    if (inputRef.current) {
      inputRef.current.blur();
    }
  }, []);
  const { getRootProps, getInputProps } = useDropzone({ onDrop });
  const handleClick = () => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files; // No TypeScript error
    setFileUpload(files)
    if(files) {
      uploadFile(files[0])
    }
  };
  const uploadFile = useCallback(async (file: File) => {
    if(file) {
      const formData = new FormData()
      formData.append('fileUpload', file)
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/files/upload`, formData,
        {
          headers: {
            "Content-Type": 'multipart/form-data',
            Authorization: `Bearer ${session?.access_token}`,
            'target_type': 'tracks'
          },
          onUploadProgress: progressEvent => {
            if(progressEvent.total) {
              const percentCompleted = Math.floor((progressEvent.loaded * 100) / progressEvent.total);
              setProcessUpload(percentCompleted)
            }
          }
        }
      )
      if(response.data?.data) {
        setTitleUpload(response.data.data.fileName)
      }
    }
  }, [session])
  return (
    <>
      <div {...getRootProps()} style={styles.divUploadMusic}>
        {fileUpload ? 
          <Typography fontSize={15}>{fileUpload ? fileUpload[0].name : ''}</Typography> :
          <Typography fontWeight={'bold'} fontSize={20}>Drag and drop your music file</Typography>
        }
        <input {...getInputProps()} type="file" style={{display: 'none'}} accept=".mp3" ref={inputRef} onChange={(e) => handleFileChange(e)}/>
        <Button 
          color='secondary' 
          variant="contained" 
          startIcon={<CloudUploadIcon />}
          onClick={() => handleClick()}
          style={styles.uploadButton}
        >
          Choose a file to upload
        </Button>
      </div>
    </>
  )
}
export default MusicUploadTab;