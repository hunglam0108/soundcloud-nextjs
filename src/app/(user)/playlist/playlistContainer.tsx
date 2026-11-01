'use client'
import React, { useState } from 'react';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
  Button,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Typography,
  Divider,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AddIcon from '@mui/icons-material/Add';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import DialogAddPlaylist from './dialogAddPlaylist';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { playMusic, resetMusic, setPlaylist } from '@/redux/features/playListFooter';
import { reduceText } from '@/app/utils/commonFunction';
import { usePreventDoubleClick } from '@/app/utils/customHook/customHook';

const PlaylistManager = (props: { playlistDefault: PlaylistData[], tracks: DataMusicType[] }) => {
  const playlists = props.playlistDefault
  const tracks = props.tracks
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [indexPlayList, setIndexPlayList] = useState<number | null>(null);
  const dispatch = useDispatch()
  const { idTrack, isPlay } = useSelector((state: RootState) => state.playListFooter);
  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const togglePlayList = (playlistIndex: number, songIndex: number) => {
    const track = playlists[playlistIndex].tracks[songIndex]
    setIndexPlayList(playlistIndex)
    if (track._id === idTrack && playlistIndex === indexPlayList) {
      if(isPlay) dispatch(playMusic({ isPlay: false })) 
      else dispatch(playMusic({ isPlay: true }))
    } else {
      dispatch(resetMusic({ reset: true }))
      dispatch(playMusic({ isPlay: true }))
      dispatch(setPlaylist({ 
        playlist: playlists[playlistIndex].tracks.map((track) => ({
          title: track.title,
          idTrack: track._id,
          description: track.description,
          src: track.trackUrl,
          imgUrl: track.imgUrl
        })),
        indexTrack: songIndex
      }))
    }
  };

  const [isProcessing, wrappedCallback] = usePreventDoubleClick((playlistIndex: number, songIndex: number) => togglePlayList(playlistIndex, songIndex))

  return (
    <Box sx={{
      backgroundColor: '#F0FFFF', // light gray background
      borderRadius: 2,
      p: 4,
      boxShadow: 2,
      m: 5
    }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5">🎶 Playlist Manager</Typography>
        <Button variant='outlined' startIcon={<AddIcon />} onClick={handleOpenDialog}>
          Add New Playlist
        </Button>
      </Box>

      <Box sx={{ mt: 3 }}>
        {playlists.map((playlist, pIndex) => (
          <Accordion key={playlists[pIndex]._id} sx={{ mb: 2 }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ backgroundColor: '#808080', color: 'white' }}>
              <Typography variant="h6">{playlist.title}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <List dense>
                {playlist.tracks.map((track: TrackInfo, sIndex: number) => (
                  <>
                    <ListItem
                      key={playlist.tracks[sIndex]._id}
                      sx={{ height: 50 }}
                      secondaryAction={
                        <IconButton
                          edge="end"
                          disabled={isProcessing === false ? isProcessing : true}
                          onClick={() => wrappedCallback(pIndex, sIndex)}
                        >
                          {idTrack === playlists[pIndex].tracks[sIndex]._id && isPlay && indexPlayList === pIndex
                          ? <PauseIcon /> : <PlayArrowIcon />}
                        </IconButton>
                      }
                    >
                      <Box sx={{ flexDirection: 'row', display: 'flex', gap: 2, verticalAlign: 'middle'}}>
                        <ListItemText primary={reduceText(track.title)} />
                        <ListItemText style={{ color: '#ccc' }}>{reduceText(track.description)}</ListItemText>
                      </Box>
                    </ListItem>
                    {sIndex !== playlist.tracks.length - 1 && <Divider orientation='horizontal' variant="middle" flexItem />}
                  </>
                ))}
              </List>
            </AccordionDetails>
          </Accordion>
        ))}
      </Box>
      
      <DialogAddPlaylist tracks={tracks} openDialog={openDialog} setOpenDialog={setOpenDialog}></DialogAddPlaylist>
      
    </Box>
  );
};

export default PlaylistManager;
