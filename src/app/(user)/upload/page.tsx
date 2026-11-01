'use client'
import { AppBar, Box, Container, IconButton, Tab, Tabs, Typography, useTheme } from "@mui/material";
import React, { CSSProperties, useCallback, useEffect, useState } from "react";
import MusicUploadTab from "./musicUploadTab";
import UploadTab from "./uploadTab";
import CloseIcon from '@mui/icons-material/Close';
import PauseCircleOutlineIcon from '@mui/icons-material/PauseCircleOutline';
import PlayCircleOutlineOutlinedIcon from '@mui/icons-material/PlayCircleOutlineOutlined';
import LinearWithValueLabel from "@/app/components/linear/linearUpload";

interface TabPanelProps {
  children?: React.ReactNode;
  dir?: string;
  index: number;
  value: number;
  styleTab?: CSSProperties
}

const styles: StyleObject = {
  boxMusicUpload: { 
    paddingTop: '8px',
    paddingBottom: '8px',
    paddingLeft: '15px',
    paddingRight: '15px',
    marginTop: 15, 
    backgroundColor:'#D3D3D3', 
    display: 'flex', 
    justifyContent: 'end',
    borderRadius: 20,
    alignItems: 'anchor-center'
  },
  songbar: {
    width: '30%',
    display: 'flex', 
    justifyContent: 'end',
    borderRadius: 20,
    alignItems: 'anchor-center'
  },
  closeButton: { width: 28, height: 28, backgroundColor: 'white', marginLeft: 15 }
}

function TabPanel(props: TabPanelProps ) {
  const { children, value, index,  styleTab, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
      style={{ ...styleTab, height: '100%'}}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `full-width-tab-${index}`,
    'aria-controls': `full-width-tabpanel-${index}`,
  };
}

const UploadPage = () => {
  const [fileUpload, setFileUpload] = useState<FileList | File[] | null>(null)
  const [titleUpload, setTitleUpload] = useState<string>('')
  const [processUpload, setProcessUpload] = useState<number>(0)
  const [backgroundImage, setBackgroundImage] = useState("");
  const theme = useTheme();
  const [valueTab, setValueTab] = React.useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioSrc, setAudioSrc] = useState('');
  const audioRef = React.useRef<HTMLAudioElement>(null);
  const handleChangeTab = (event: React.SyntheticEvent, newValue: number) => {
    setValueTab(newValue);
  };
  const deleteFile = () => {
    setFileUpload(null)
    setIsPlaying(false)
    setBackgroundImage('')
    setValueTab(0)
  };
  const togglePlayPause = useCallback(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {  
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  }, [isPlaying]);

  function bytesToMB(bytes: number) {
    const MB = 1024 * 1024; // 1 MB = 1024 * 1024 bytes
    return (bytes / MB).toFixed(2); // Convert and round to 2 decimal places
  }

  const reduceText = (fileName: string) => {
    return fileName.length > 30 ? fileName.slice(0, 30) + "..." : fileName;
  }

  useEffect(() => {
    if (fileUpload) {
      const reader = new FileReader();

      reader.onload = (e) => {
        setAudioSrc(e.target?.result as string);
      };
      setIsPlaying(false)
      reader.readAsDataURL(fileUpload[0]);
      setValueTab(1)
    }
  }, [fileUpload])

  return (
    <Container>
      {fileUpload && (
        <Box style={styles.boxMusicUpload}>
          <LinearWithValueLabel style={{ width: '65%', paddingRight: '15px' }} processUpload={processUpload}></LinearWithValueLabel>
          <div style={styles.songbar}>
            {audioSrc && (
              <div>
                <audio ref={audioRef} src={audioSrc}></audio>
                <IconButton onClick={togglePlayPause}>
                  {isPlaying ? <PauseCircleOutlineIcon /> : <PlayCircleOutlineOutlinedIcon />}
                </IconButton>
              </div>
            )}
            <Typography fontSize={14}>
              {fileUpload ? `${reduceText(fileUpload[0].name)} - ${bytesToMB(fileUpload[0].size)}MB`: ''}
            </Typography>
          </div>
          
          <IconButton onClick={() => deleteFile()} style={styles.closeButton}>
            <CloseIcon/>
          </IconButton>
        </Box>
      )}
      <Box sx={{ width: '100%', borderBottom: 1, borderColor: 'divider', paddingTop: '15px' }}>
        <AppBar position="static" color="default">
          <Tabs
            value={valueTab}
            onChange={handleChangeTab}
            indicatorColor="secondary"
            textColor="inherit"
            // variant="fullWidth"
            aria-label="full width tabs example"
          >
            <Tab label="Upload music tab" {...a11yProps(0)} wrapped disabled style={{opacity:"1"}}/>
            <Tab label="Info tab" {...a11yProps(1)} wrapped disabled style={{opacity:"1"}}/>
          </Tabs>
        </AppBar>
        <TabPanel value={valueTab} index={0} dir={theme.direction}>
          <MusicUploadTab 
            fileUpload={fileUpload} 
            setFileUpload={setFileUpload}
            setProcessUpload={setProcessUpload}
            setTitleUpload={setTitleUpload}>
          </MusicUploadTab>
        </TabPanel>
        <TabPanel value={valueTab} index={1} dir={theme.direction}>
          <UploadTab 
            backgroundImage={backgroundImage} 
            setBackgroundImage={setBackgroundImage} 
            titleUpload={titleUpload}>
          </UploadTab>
        </TabPanel>
      </Box>
    </Container>
  );
}
export default UploadPage