'use client'
import { useEffect, useMemo, useRef, useState } from "react"
import { useWavesurfer } from "@wavesurfer/react"
import './wave.css'
import { ImgLink } from "@/app/utils/constant"
import { Pause, Play } from "lucide-react"
import Tooltip from "@mui/material/Tooltip"
import { useDispatch, useSelector } from "react-redux"
import { playMusic, setCurrentTime } from "@/redux/features/playListFooter"
import { RootState } from "@/redux/store"
import CommentInput from "./componentInput"
import CommentList from "./commentList"
import { useSession } from "next-auth/react"
import { popupSetContent } from "@/redux/features/popup"
import { useRouter } from "next/navigation"
import { Box, Chip } from "@mui/material"
import FavoriteIcon from '@mui/icons-material/Favorite';
import { PlayArrow } from "@mui/icons-material"
import { useWaveTrackHook } from "@/app/utils/customHook/customHook"
import { likeTrack, postCommentTrack } from "@/app/api/api"
const decodeTime = (stringTime: string) => {
  const minute = stringTime.split(':')[0]
  const second = stringTime.split(':')[1]
  return Number(minute) * 60 + Number(second)
}

const WaveTrack = (
  props: { 
    idTrack: string, 
    audioLink: string, 
    imgLink: string, 
    comments: any[], 
    title: string, 
    des: string,
    isLikedDefault: boolean,
    countLike: number,
    countPlay: number
  }) => {
  const dispatch = useDispatch()
  const { isPlay, curTime } = useSelector((state: RootState) => state.playListFooter);
  const { data: session } = useSession()
  const router = useRouter()
  const containerRef = useRef(null);
  const timeRef = useRef<string>("0:00")
  const durationRef = useRef<string>("0:00")
  let gradient
  let progressGradient
  if(typeof window !== undefined) {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')!

    // Define the waveform gradient
    gradient = useMemo(() => ctx.createLinearGradient(0, 0, 0, canvas.height * 1), [])
    gradient.addColorStop(0, '#656666') // Top color
    gradient.addColorStop((canvas.height * 0.6) / canvas.height, '#656666') // Top color
    gradient.addColorStop((canvas.height * 0.6 + 1) / canvas.height, '#ffffff') // White line
    gradient.addColorStop((canvas.height * 0.6 + 2) / canvas.height, '#ffffff') // White line
    gradient.addColorStop((canvas.height * 0.6 + 3) / canvas.height, '#ddd') // Bottom color
    gradient.addColorStop(1, '#ddd') // Bottom color

    // Define the progress gradient
    progressGradient = useMemo(() => ctx.createLinearGradient(0, 0, 0, canvas.height * 1), [])
    progressGradient.addColorStop(0, '#EE772F') // Top color
    progressGradient.addColorStop((canvas.height * 0.6) / canvas.height, '#EB4926') // Top color
    progressGradient.addColorStop((canvas.height * 0.6 + 1) / canvas.height, '#ffffff') // White line
    progressGradient.addColorStop((canvas.height * 0.6 + 2) / canvas.height, '#ffffff') // White line
    progressGradient.addColorStop((canvas.height * 0.6 + 3) / canvas.height, '#F6B094') // Bottom color
    progressGradient.addColorStop(1, '#F6B094') // Bottom color
  }
  const { idTrack, audioLink, imgLink, comments, title, des, isLikedDefault, countLike, countPlay } = props
  const [isLiked, setLiked] = useState<boolean>(isLikedDefault)

  const { wavesurfer, isPlaying } = useWavesurfer({
    container: containerRef,
    height: 80,
    width: 800,
    waveColor: gradient,
    progressColor: progressGradient,
    url: `/api?audio=${audioLink}`,
    barWidth: 3,
    barGap: 1,
    barRadius: 2,
    normalize: true
  })

  useWaveTrackHook({
    idTrack,
    audioLink,
    title,
    des,
    token: session?.access_token,
    wavesurferPlay: wavesurfer ? () => wavesurfer?.play() : undefined, 
    wavesurferPause: wavesurfer ? () => wavesurfer?.pause() : undefined,
    wavesurferSetTime: wavesurfer ? () => wavesurfer?.setTime(curTime) : undefined
  })

  useEffect(() => {
    const hover = document.querySelector('#hover')! as HTMLElement
    const waveform = document.querySelector('#waveform')
    
    if(waveform) {
      waveform.addEventListener('pointermove', (e) => {
        const event = e as PointerEvent
        return (hover.style.width = `${event.offsetX}px`)
      })
    }
    if(wavesurfer) {
      wavesurfer.setMuted(true)
      wavesurfer.on('decode', (durationTime) => (durationRef.current = formatTime(durationTime)))
      wavesurfer.on('timeupdate', (time) => (timeRef.current = formatTime(time)))
      wavesurfer.on('interaction', (newTime) => {
        dispatch(setCurrentTime({ curTime: newTime }))
        wavesurfer.play()
      })
      wavesurfer.on('ready', (newTime) => {
        wavesurfer.play()
        dispatch(playMusic({ isPlay: true }))
      })
    }
  }, [wavesurfer])

  // Current timeRef & durationRef
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const secondsRemainder = Math.floor(seconds) % 60
    const paddedSeconds = `0${secondsRemainder}`.slice(-2)
    return `${minutes}:${paddedSeconds}`
  }

  const calLeft = (moment: number, duration: number) => {
    const percent = moment/duration * 100
    return `${percent}%`
  }

  const onPause = () => {
    wavesurfer && wavesurfer.pause()
    dispatch(playMusic({ isPlay: false }))
  }

  const onPlay = () => {
    wavesurfer && wavesurfer.play()
    dispatch(playMusic({ isPlay: true }))
  }

  const commentList = useMemo(() => {
    const duration = decodeTime(durationRef.current)
    return (
      <div className="comments">
        {comments.map((i, index) => {
          return (
            <Tooltip arrow title={i.content} key={`${i}-${index}`}>
              <img
                onPointerMove={(e) => {
                  const hover = document.querySelector('#hover')! as HTMLElement;
                  hover.style.width = calLeft(i.moment, duration)
                }}
                src={`${ImgLink}/${imgLink}`}
                key={i.id}
                style={{ zIndex: 20, width: '20px', left: calLeft(i.moment, duration), top: '90px', position: 'absolute' }}>
              </img>
            </Tooltip>
          )
        })}
      </div>
    )
  }, [durationRef.current])

  const postComment = async (comment: string) => {
    const response = await postCommentTrack(dispatch, comment, curTime, idTrack, session?.access_token)
    if (response?.res?.data) {
      dispatch(popupSetContent({message: 'Commented', type: 'success', showMessage: true}))
      router.refresh()
    } else {
      const errorMessage = response?.error ?? response?.res?.error
      dispatch(popupSetContent({message: errorMessage, type: 'error', showMessage: true}))
    }
  }

  const likeOrDisLike = async () => {
    setLiked(prev => !prev)
    const response = await likeTrack(dispatch, idTrack, !isLiked, session?.access_token)
    if (response?.res?.data) {
      dispatch(popupSetContent({message: 'Liked', type: 'success', showMessage: true}))
      router.refresh()
    } else {
      const errorMessage = response?.error ?? response?.res?.error
      dispatch(popupSetContent({message: errorMessage, type: 'error', showMessage: true}))
    }
  }

  const triggerTime = (newTime: number) => {
    wavesurfer && wavesurfer.setTime(newTime)
    dispatch(setCurrentTime({ curTime: newTime }))
  }

  return (
    <div className="container-music">
      <div className="playbox">
        <div className="header-play-box">
          <button className="pause-play-button" id="playButton" onClick={() => isPlay ? onPause() : onPlay()}>
            {isPlay ? <Pause /> : <Play />}
          </button>
          <div className="text-box">
            <div className="text-title">
              {title.length > 40 ? title.slice(0, 40) + '...' : title}
            </div>
            <div className="text-sub">
              {des.length > 40 ? des.slice(0, 40) + '...' : des}
            </div>
          </div>
        </div>
        <div ref={containerRef} id="waveform">
          <div className="time">{timeRef.current}</div>
          <div className="duration">{durationRef.current}</div>
          <div id="hover"></div>
          {commentList}
        </div>
        <div className="element">
          <img src={`${ImgLink}/${imgLink}`}></img>
        </div>
      </div>
      <div className="likeContainer">
        <Chip
          style={{ padding: '5px', borderRadius: '5px' }}
          label="Like"
          variant='filled'
          color={isLiked ? 'error' : 'default'}
          onClick={() => {likeOrDisLike()}}
          icon={<FavoriteIcon/>}
        />
        <Box sx={{ transform: 'scale(0.8)'}}>
          <Chip
            label={countPlay}
            variant='filled'
            icon={<PlayArrow/>}
            style={{color: 'gray', marginRight: '5px'}}
          />
          <Chip
            label={countLike}
            variant='filled'
            icon={<FavoriteIcon/>}
            style={{color: 'gray'}}
          />
        </Box>
      </div>
      <div className="commentContainer">
        <CommentInput onSubmit={postComment}></CommentInput>
        <CommentList comments={comments} triggerTime={triggerTime}></CommentList>
      </div>
    </div>
  )
}
export default WaveTrack