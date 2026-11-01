'use client'
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';
import { useHasMounted } from '../../utils/customHook/customHook';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { useEffect, useRef, useState } from 'react';
import H5AudioPlayer from 'react-h5-audio-player';
import { pauseMusic, playMusic, resetMusic, setCurrentTime, setPlaylist } from '@/redux/features/playListFooter';
import DrawerPlaylist from '../drawerPlaylist/drawerPlaylist';
import QueueMusicIcon from '@mui/icons-material/QueueMusic';
import Button from '@mui/material/Button';

const FooterPlay: React.FC = () => {
  const dispatch = useDispatch()
  const [openDrawer, setOpenDrawer] = useState<boolean>(false)
  const playerRef = useRef<H5AudioPlayer>(null);
  const { src, show, description, title, isPlay, curTime, reset, playlistTracks, indexTrack } = useSelector((state: RootState) => state.playListFooter);
  const hasMounted = useHasMounted()
  const reduceText = (fileName: string) => {
    return fileName.length > 30 ? fileName.slice(0, 30) + "..." : fileName;
  }

  const setCurrentTrackIndex = (songIndex: number | null) => {
    if(playlistTracks.length > 0 && songIndex) {
      dispatch(setPlaylist({ 
        playlist: playlistTracks.map((track) => ({
          title: track.title,
          idTrack: track.idTrack,
          description: track.description,
          src: track.src,
          imgUrl: track.imgUrl,
        })),
        indexTrack: songIndex
      }))
      // dispatch(playMusic(true))
    }
  }

  const handleClickNext = () => {
    setCurrentTrackIndex(indexTrack !== null ? indexTrack < playlistTracks.length - 1 ? indexTrack + 1 : 0 : null);
  };

  const handleClickPrevious = () => {
    setCurrentTrackIndex(indexTrack !== null ? indexTrack > 0 ? indexTrack - 1 : playlistTracks.length - 1 : null);
  };

  useEffect(() => {
    if(isPlay) {
      playerRef.current?.audio.current?.play(); // Trigger playback
    }
    else {
      playerRef.current?.audio.current?.pause();
    }
  }, [isPlay])

  useEffect(() => {
    if (curTime && playerRef.current && playerRef.current.audio.current) {
      playerRef.current.audio.current.currentTime = curTime;
    }
  }, [curTime])

  useEffect(() => {
    if(reset && playerRef.current && playerRef.current.audio.current) {
      playerRef.current.audio.current.currentTime = 0;
      dispatch(resetMusic({ reset: false }))
      playerRef.current?.audio.current?.play();
    }
  }, [reset])

  return (
    !hasMounted || !show ? <></> :
    <AppBar sx={{backgroundColor: "#f2f2f2", width: '100%', position: 'fixed', top: 'auto', bottom: 0}}>
      <Container sx={{ display: 'flex', gap: '10px' }}>
        <AudioPlayer
          layout='horizontal-reverse'
          showSkipControls
          style={{ 
            backgroundColor: "#f2f2f2",
            boxShadow: 'none',
            scale: '0.9 0.9',
            paddingTop: 2,
            paddingBottom: 2,
          }}
          autoPlayAfterSrcChange={playlistTracks.length > 0}
          ref={playerRef}
          src={`/api?audio=${src}`}
          onPlay={() => {
            dispatch(pauseMusic({ isPlay: true }))
          }}
          onPause={() => dispatch(pauseMusic({ isPlay: false }))}
          onSeeked={(e) => {
            if(playerRef.current && playerRef.current.audio.current) {
              dispatch(setCurrentTime({ curTime: playerRef?.current.audio.current.currentTime }))
            }
          }}
          onClickPrevious={handleClickPrevious}
          onClickNext={handleClickNext}
          progressJumpSteps={{ forward: 10000, backward: 10000 }}
          onEnded={() => indexTrack ? setCurrentTrackIndex((indexTrack + 1) % playlistTracks.length) : {}}
        />
        <Box sx={{ flexDirection: 'column', display: 'flex', minWidth: '100px', justifyContent: 'center', width: '32%'}}>
          <div style={{ color: '#ccc'}}>{reduceText(description)}</div>
          <div style={{ color: 'black'}}>{reduceText(title)}</div>
        </Box>
        <Button onClick={() => setOpenDrawer(true)}>
          <QueueMusicIcon/>
        </Button>
      </Container>
      <DrawerPlaylist open={openDrawer} setStateOpen={setOpenDrawer}></DrawerPlaylist>
    </AppBar>
  )
}
export default FooterPlay;