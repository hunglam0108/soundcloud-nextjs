'use client'
import { Button, FormControl, FormHelperText, Grid, MenuItem, Select, TextField, Typography } from "@mui/material";
import { useCallback, useEffect, useRef } from "react";
import InsertPhotoSharpIcon from '@mui/icons-material/InsertPhotoSharp';
import { Controller, useForm } from "react-hook-form";
import { useSession } from "next-auth/react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { popupSetContent } from "@/redux/features/popup";
import { useRouter } from "next/navigation";
import { submitUpload } from "@/app/api/api";

const styles: StyleObject = {
  imageInput: {
    display: 'flex',
    flexDirection: 'column',
    maxWidth: '100%',
    height: 330,
    width: 300,
    maxHeight: 'auto',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#D3D3D3',
    backgroundSize: "cover",
    backgroundPosition: "center",
  },
  buttonSubmit: {
    marginTop: 30,
    marginLeft: 10
  }
}

const listOptionType = [
  {
    label: 'Chill',
    value: 'CHILL',
  },
  {
    label: 'Workout',
    value: 'WORKOUT',
  },
  {
    label: 'Party',
    value: 'PARTY',
  }
]

const UploadTab = (
  props: { backgroundImage: string, setBackgroundImage: (imageString: string) => void, titleUpload?: string }
) => {
  const dispatch = useDispatch()
  const router = useRouter()
  const { data: session } = useSession()
  const { backgroundImage, setBackgroundImage, titleUpload } = props
  const {
      handleSubmit,
      control,
      trigger,
      formState: { errors },
      watch,
      setValue
    } = useForm<{title: string, description: string, category: string, imgUrl?: string}>()
  const inputRef = useRef<HTMLInputElement>(null);
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target?.files;
    if (file && file[0]) {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        setBackgroundImage(`url(${e.target?.result})`);
      };
      uploadImg(file[0])

      reader.readAsDataURL(file[0]);
    }
  };

  const handleClick = () => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };

  const submitTrack = async () => {
    if(!titleUpload) {
      dispatch(popupSetContent({message: 'Waiting music upload', type: 'error', showMessage: true}))
    } 
    if(!watch('imgUrl')) {
      dispatch(popupSetContent({message: 'Waiting image upload', type: 'error', showMessage: true}))
    }
    if(watch('category') && titleUpload && watch('imgUrl')) {
      const response = await submitUpload({
        title: watch('title'),
        description: watch('description'),
        trackUrl: titleUpload,
        imgUrl: watch('imgUrl') ?? '',
        category: watch('category')
      }, session?.access_token)
      if (response?.res?.data) {
        dispatch(popupSetContent({message: 'Upload success', type: 'success', showMessage: true}))
        router.push('/')
      } else {
        const errorMessage = response?.error ?? response?.res?.error
        dispatch(popupSetContent({message: errorMessage, type: 'error', showMessage: true}))
      }
    }
  }

  const submit = async () => {
    const validate = await trigger()
    if(validate) {
      submitTrack()
    }
  }

  const uploadImg = useCallback(async (file: File) => {
    if(file) {
      const formData = new FormData()
      formData.append('fileUpload', file)
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/files/upload`, formData,
        {
          headers: {
            "Content-Type": 'multipart/form-data',
            Authorization: `Bearer ${session?.access_token}`,
            'target_type': 'images'
          }
        }
      )
      if(response.data?.data) {
        setValue('imgUrl', response.data.data.fileName)
      }
    }
  }, [session])
  const getNameWithoutType = (fileName: string) => {
    return fileName.split('.').slice(0, -1).join('.');
  }

  useEffect(() => { 
    setValue('title', titleUpload ? getNameWithoutType(titleUpload) : '')
  }, [titleUpload])

  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={5} md={4} style={{ padding: '30px' }}>
          <div style={{...styles.imageInput, backgroundImage: backgroundImage, border: backgroundImage ? 'none' : '2px dashed #b887c1'}} 
            onClick={() => handleClick()}>
            {!backgroundImage && (
              <>
                <Typography>Input image</Typography>
                <InsertPhotoSharpIcon style={{ fontSize: 120 }}/>
              </>
            )}
            <input type="file" style={{display: 'none'} } ref={inputRef} accept=".jpg, .png .jpeg" onChange={(e) => handleFileChange(e)}/>
          </div>
        </Grid>
        <Grid item xs={7} md={8} >
          <div className="input-form">
            <Controller
              name="title"
              control={control}
              rules={{ required: "Title is required" }}
              render={({ field }) => 
                <FormControl sx={{ m: 1, width: '100%' }} variant="outlined">
                  <div style={{flexDirection: 'row', display: 'flex'}}>
                    <Typography style={{fontSize: 13}}>Title Track</Typography>
                    <Typography color={'#C10B44'} style={{paddingLeft: 5, fontSize: 13}}>*</Typography> 
                  </div>
                  <TextField
                    size="small"
                    required
                    value={field.value || ''}
                    onChange={(e) => {
                      setValue('title', e.currentTarget.value)
                    }}
                    id="title-required"
                    error={!!errors.title?.message}
                    helperText={errors.title?.message ?? ''}
                  />
                </FormControl>
              }
            />

            <Controller
              name="category"
              rules={{ required: 'Category Required'}}
              control={control}
              render={({ field }) => 
                <FormControl 
                  sx={{ 
                    m: 1, width: '100%',
                  }}
                  variant="outlined"
                >
                  <div style={{flexDirection: 'row', display: 'flex'}}>
                    <Typography style={{fontSize: 13}}>Category</Typography> 
                    <Typography color={'#C10B44'} style={{paddingLeft: 5, fontSize: 13}}>*</Typography> 
                  </div>
                  <Select
                    size="small"
                    required
                    value={field.value || ''}
                    onChange={(e) => {
                      setValue('category', e.target.value)
                    }}
                    id="category-required"
                    error={!!errors.category?.message}
                  >
                    {listOptionType.map((i) => 
                      <MenuItem value={i.value}>{i.label}</MenuItem>
                    )}
                  </Select>
                  <FormHelperText color='red'>{errors.category?.message}</FormHelperText>
                </FormControl>
              }
            />
            
            <Controller
              name="description"
              control={control}
              render={({ field }) => 
                <FormControl 
                  sx={{ 
                    m: 1, width: '100%',
                  }} 
                  variant="outlined"
                >
                  <Typography style={{ fontSize: 13 }}>Description</Typography>
                  <TextField
                    size="small"
                    value={field.value || ''}
                    onChange={(e) => {
                      setValue('description', e.currentTarget.value)
                    }}
                    id="description-option"
                  />
                </FormControl>
              }
            />
          </div>
          <Button variant="contained" color='secondary' style={styles.buttonSubmit} onClick={() => submit()}>
            Save
          </Button>
        </Grid>
      </Grid>
    </>
  )
}
export default UploadTab;