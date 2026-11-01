'use client'
import { reduceText } from "@/app/utils/commonFunction";
import { ImgLink } from "@/app/utils/constant";
import { playMusic, resetMusic, setSrcMusic } from "@/redux/features/playListFooter";
import { RootState } from "@/redux/store";
import { Pause, PlayArrow } from "@mui/icons-material";
import { Box, Card, CardContent, CardMedia, IconButton, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function AudioCard( props: { id: string, title: string, artist: string, image: string, audioSrc: string }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [firstTime, setIsFirstTime] = useState(true);

  const dispatch = useDispatch()
  const { src, idTrack } = useSelector((state: RootState) => state.playListFooter);
  const { id, title, artist, image, audioSrc } = props
  
  const handlePlayPause = () => {
      if (isPlaying) {
        dispatch(playMusic({ isPlay: false }))
        setIsPlaying(false);
      } else {
        setIsPlaying(true);
        if(firstTime || src !== audioSrc) {
          dispatch(resetMusic({ reset: true }))
          dispatch(setSrcMusic({ idTrack: id, src: audioSrc, title: title, description: artist, imgUrl: image }))
          setIsFirstTime(false)
        }
        dispatch(playMusic({ isPlay: true }))
      }
  };

  useEffect(() => {
    if(id !== idTrack) {
      setIsPlaying(false)
    }
    else {
      setIsPlaying(true)
    }
  }, [idTrack])

  return (
    <Card sx={{ display: 'flex', width: '100%' }} key={`${title}`}>
      <CardMedia component="img" sx={{ width: 170, height: 180 }} src={`${ImgLink}/${image}`} alt="cover" />
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <CardContent sx={{ flex: '1 0 auto' }}>
          <Typography component="div" variant="h6">
            {reduceText(title)}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" component="div">
            {reduceText(artist)}
          </Typography>
        </CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', pl: 1, pb: 1 }}>
          <IconButton onClick={handlePlayPause} aria-label="play/pause">
            {isPlaying ? <Pause /> : <PlayArrow />}
          </IconButton>
        </Box>
      </Box>
    </Card>
  );
}