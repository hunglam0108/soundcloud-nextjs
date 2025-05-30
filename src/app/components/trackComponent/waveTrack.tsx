'use client'
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { useWavesurfer } from "@wavesurfer/react"
import './wave.css'
import { ImgLink } from "@/app/utils/constant"
import { Pause, Play } from "lucide-react"
import { Tooltip } from "@mui/material"

const arrComments = [
  {
      id: 1, 
      avatar: "http://localhost:8000/images/chill1.png",
      moment: 10, 
      user: "username 1", 
      content: "just a comment1"
  },
  {
      id: 2, 
      avatar: "http://localhost:8000/images/chill1.png",
      moment: 30, 
      user: "username 2", 
      content: "just a comment3"
  },
  {
      id: 3, 
      avatar: "http://localhost:8000/images/chill1.png",
      moment: 50, 
      user: "username 3", 
      content: "just a comment3"
  },
    {
      id: 4, 
      avatar: "http://localhost:8000/images/chill1.png",
      moment: 80, 
      user: "username 2", 
      content: "just a comment3"
  },
  {
      id: 5, 
      avatar: "http://localhost:8000/images/chill1.png",
      moment: 120, 
      user: "username 3", 
      content: "just a comment3"
  }
]

const decodeTime = (stringTime: string) => {
  const minute = stringTime.split(':')[0]
  const second = stringTime.split(':')[1]
  return Number(minute) * 60 + Number(second)
}

const WaveTrack = (props: { audioLink: string, imgLink: string, comments: any[], title: string, des: string }) => {
  const { audioLink, imgLink, comments, title, des } = props
  const ref = useRef<HTMLDivElement>(null)
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

  const { wavesurfer, isPlaying, currentTime } = useWavesurfer({
    container: ref,
    height: 80,
    width: 800,
    waveColor: gradient,
    progressColor: progressGradient,
    url: `/api?audio=${audioLink}`,
    barWidth: 3,
    barGap: 1,
    barRadius: 2,
    normalize: true
    // plugins: useMemo(() => [Timeline.create()], []),
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
      wavesurfer.on('decode', (durationTime) => (durationRef.current = formatTime(durationTime)))
      wavesurfer.on('timeupdate', (time) => (timeRef.current = formatTime(time)))
      wavesurfer.on('interaction', (newTime) => {
        wavesurfer.play()
      })
      wavesurfer.on('ready', (newTime) => {
        wavesurfer.play()
      })
    }
  }, [wavesurfer])

  // Current timeRef & durationRef
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const secondsRemainder = Math.round(seconds) % 60
    const paddedSeconds = `0${secondsRemainder}`.slice(-2)
    return `${minutes}:${paddedSeconds}`
  }

  const calLeft = (moment: number, duration: number) => {
    const percent = moment/duration * 100
    return `${percent}%`
  }

  const onPlayPause = useCallback(() => {
    wavesurfer && wavesurfer.playPause()
  }, [wavesurfer])

  const commentList = useMemo(() => {
    const duration = decodeTime(durationRef.current)
    return (
      <div className="comments">
        {arrComments.map((i) => {
          return (
            <Tooltip arrow title={i.content}>
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

  return (
    <div className="container-music">
      <div className="playbox">
        <div className="header-play-box">
          <button className="pause-play-button" id="playButton" onClick={() => onPlayPause()}>
            {isPlaying || currentTime === 0 ? <Pause /> : <Play />}
          </button>
          <div className="text-box">
            <div className="text-title">
              {title}
            </div>
            <div className="text-sub">
              {des}
            </div>
          </div>
        </div>
        <div ref={ref} id="waveform">
          <div className="time">{timeRef.current}</div>
          <div className="duration">{durationRef.current}</div>
          <div id="hover"></div>
          {commentList}
        </div>
        <div className="element">
          <img src={`${ImgLink}/${imgLink}`}></img>
        </div>
      </div>
    </div>
  )
}
export default WaveTrack