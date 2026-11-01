'use client'
import { Button, Container, Divider, FormControl, FormHelperText, Grid, IconButton, 
  InputAdornment, InputLabel, Link, OutlinedInput, TextField, Typography } from "@mui/material"
import "../signin/signin.css"
import { GitHub, Google, Visibility, VisibilityOff } from "@mui/icons-material"
import React from "react"
import { Controller, Form, useForm } from "react-hook-form"
import { signIn } from "next-auth/react"
import { popupSetContent } from "@/redux/features/popup"
import { useDispatch } from "react-redux"
import { useRouter } from "next/navigation"
import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBackOutlined';

const useStyles = {
  buttonLogin: {
    marginLeft: '8px',
    marginRight: '8px',
    marginTop: '20px'
  }
}

const customStyles = {
  "& input[type='password']::-ms-reveal, & input[type='password']::-webkit-credentials-auto-fill-button": {
    display: "none", // Hide default password visibility icon
  }
};

const SignInPage = () => {
  const {
    control,
    trigger,
    formState: { errors },
    watch,
    setValue
  } = useForm<{userName: string, password: string}>({
    defaultValues: {
      userName: '',
      password: ''
    }
  })
  const dispatch = useDispatch()
  const router = useRouter()
  const [showPW, setShowPW] = React.useState<boolean>(false)
  const onSubmit = async () => {
    const validate = await trigger()
    if(validate) {
      const result = await signIn("credentials", { username: watch('userName'), password: watch('password'), redirect: false, callbackUrl: '/'})
      showMessageLogin(result?.error)
    }
  }

  const signInGithub = async () => {
    const result = await signIn("github", { callbackUrl: "/" })
    showMessageLogin(result?.error)
  }

  const showMessageLogin = (error: string | null | undefined) => {
    if(error) {
      dispatch(popupSetContent({message: error, type: 'error', showMessage: true}))
    }
    else {
      dispatch(popupSetContent({message: 'Login successfully! Welcome', type: 'success', showMessage: true}))
      router.push('/')
    }
  }

  return (
    <>
      <Container>
        <Grid container justifyContent="center" alignItems="center" height={'100vh'}>
          <div className="form-signin">
            <IconButton style={{justifyContent: 'left', display: 'flex', width: '40px', height: '40px'}}>
              <Link href={"/"} color="inherit">
                <ArrowBackOutlinedIcon/>
              </Link>
            </IconButton>
            <Typography fontWeight={'bold'} fontSize={22}>Login</Typography>
            <Form
              control={control}
            >
              <div className="input-form">
                <Controller
                  name="userName"
                  control={control}
                  rules={{ required: "User name is required" }}
                  render={({ field }) => 
                    <FormControl sx={{ m: 1, width: '100%' }} variant="outlined">
                      <TextField
                        required
                        value={field.value}
                        onChange={(e) => {
                          setValue('userName', e.currentTarget.value)
                        }}
                        onKeyDown={(e) => {
                          if(e.key === 'Enter') {
                            onSubmit()
                          }
                        }}
                        id="outlined-required"
                        label="User Name"
                        error={!!errors.userName?.message}
                        helperText={errors.userName?.message ?? ''}
                      />
                    </FormControl>
                  }
                />
                
                <Controller
                  name="password"
                  control={control}
                  rules={{ required: "Password is required" }}
                  render={({ field }) => 
                    <FormControl 
                      sx={{ 
                        m: 1, width: '100%',
                        ...customStyles
                      }} 
                      variant="outlined"
                    >
                      <InputLabel error={!!errors.password?.message} htmlFor="outlined-adornment-password">Password *</InputLabel>
                      <OutlinedInput
                        required
                        id="outlined-adornment-password"
                        type={showPW ? 'text' : 'password'}
                        value={field.value}
                        onChange={(e) => {
                          setValue('password', e.currentTarget.value)
                        }}
                        onKeyDown={(e) => {
                          if(e.key === 'Enter') {
                            onSubmit()
                          }
                        }}
                        error={!!errors.password?.message}
                        endAdornment={
                          <InputAdornment position="end">
                            <IconButton
                              aria-label={
                                showPW ? 'hide the password' : 'display the password'
                              }
                              onClick={() => setShowPW(!showPW)}
                              edge="end"
                            >
                              {showPW ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        }
                        label="Password"
                      />
                      <FormHelperText error>{errors.password?.message ?? ''}</FormHelperText>
                    </FormControl>
                  }
                />
                <Button 
                  color="primary" 
                  variant="contained" 
                  fullWidth
                  style={useStyles.buttonLogin}
                  onClick={() => onSubmit()}
                >
                  Login
                </Button>
              </div>
            </Form>
            <div className="provider-list">
              <Divider>Or using</Divider>
              <IconButton color="secondary" onClick={() => signInGithub()}>
                <GitHub/>
              </IconButton>
              <IconButton color="secondary">
                <Google/>
              </IconButton>
            </div>
          </div>
        </Grid>
      </Container>
    </>
  )
}
export default SignInPage