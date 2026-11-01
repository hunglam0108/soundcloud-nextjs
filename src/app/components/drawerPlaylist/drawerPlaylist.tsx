'use client'
import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import CardMedia from '@mui/material/CardMedia';
import { ImgLink } from '@/app/utils/constant';
import { IconButton, Typography } from '@mui/material';
import { reduceText } from '@/app/utils/commonFunction';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { Playlist, setTrackIndexPlaylist } from '@/redux/features/playListFooter';

const DrawerPlaylist = (props: { open: boolean, setStateOpen: (state: boolean) => void}) => {
  const { open, setStateOpen } = props
  const { title, playlistTracks, indexTrack, imageUrl, description } = useSelector((state: RootState) => state.playListFooter);
  const dispatch = useDispatch()
  const dataList = React.useMemo(() => {
    const splitAndMerge = (arr: Playlist[], index: number) => {
      const array1 = arr.slice(0, index);       
      const array2 = arr.slice(index + 1);    
      return [...array2, ...array1];              
    }
    return indexTrack ? splitAndMerge(playlistTracks, indexTrack) : playlistTracks
  }, [indexTrack, playlistTracks])

  const setCurrentTrackIndex = (id: string) => {
    const findIndex = playlistTracks.findIndex((i) => i.idTrack === id)
    if(playlistTracks.length > 0 && findIndex !== -1) {
      dispatch(setTrackIndexPlaylist({ indexTrack: findIndex }))
    }
  }
  
  const list = () => (
    <Box
      sx={{ width: 300, backgroundColor: '#792586ff', height: '100%', color: 'white' }}
      role="presentation"
    >
      <List>
        <ListItem disablePadding>
          <Box sx={{ p: '8px'}}>
            <Box sx={{ backgroundColor: '#b86cc6ff', flexDirection: 'row', display: 'flex', p: '8px', width: '280px', borderRadius: '10px'}}>
              <CardMedia 
                component="img"
                sx={{ width: 45, height: 42, pr: '10px' }} 
                src={`${ImgLink}/${indexTrack ? playlistTracks[indexTrack].imgUrl : imageUrl}`} 
                alt="cover" />
              <Box>
                <div style={{ fontSize: 13, color: 'black' }}>{reduceText(indexTrack ? playlistTracks[indexTrack].title : title)}</div>
                <div style={{ color: '#ccc', fontSize: 12 }}>{reduceText(indexTrack ? playlistTracks[indexTrack].description : description)}</div>
              </Box>
            </Box>
          </Box>
        </ListItem>
        <Divider light/>
        <Typography sx={{ pl: '8px', fontWeight: 'bold', pt: '8px' }}>Next Track</Typography>
        {dataList.map((track) => (
          <ListItem 
            key={track.idTrack}
            disablePadding
            secondaryAction={
            <IconButton
              edge="end"
              // disabled={isProcessing === false ? isProcessing : true}
              onClick={() => setCurrentTrackIndex(track.idTrack)}
            >
              <PlayArrowIcon />
            </IconButton>
          }>
            <ListItemButton>
              <CardMedia component="img" sx={{ width: 45, height: 42, pr: '10px' }} src={`${ImgLink}/${track.imgUrl}`} alt="cover" />
              <Box>
                <div style={{ fontSize: 13 }}>{reduceText(track.title)}</div>
                <div style={{ color: '#ccc', fontSize: 12 }}>{reduceText(track.description)}</div>
              </Box>
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <div>
      <React.Fragment key={'drawer playlist'}>
        <Drawer
          anchor={'right'}
          open={open}
          onClose={() => setStateOpen(false)}
        >
          {list()}
        </Drawer>
      </React.Fragment>
    </div>
  );
}
export default DrawerPlaylist;