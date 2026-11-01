'use client';
import React, { useEffect } from "react";
import Slider, { Settings } from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Box, Button, Divider, Typography } from "@mui/material";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import Link from "next/link";
import { ImgLink } from "@/app/utils/constant";
import { convertSlugUrl } from "@/app/utils/commonFunction";
import { useRouter } from "next/navigation";

interface PropsSlide {
  data: DataMusicType[]
  title: string
}

const NextArrow = (props: any) => {
    return (
      <Button 
        variant="contained" 
        color="inherit"
        onClick={props.onClick}
        sx={{
          zIndex:'2',
          position: 'absolute',
          top: '30%',
          width: 35,
          minWidth: 30,
          right: '0%',
        }}
      >
        <ChevronRight/>
      </Button>
    )
  }
  const PrevArrow = (props: any) => {
    return (
      <Button 
        variant="contained"
        color="inherit"
        onClick={props.onClick}
        sx={{
          zIndex:'2',
          position: 'absolute',
          top: '30%',
          width: 35,
          minWidth: 30,
        }}
      >
        <ChevronLeft/>
      </Button>
    )
  }
  const settings: Settings = {
    arrows: true,
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 1,
    nextArrow: <NextArrow/>,
    prevArrow: <PrevArrow/>
  }

const MainSlider = (props: PropsSlide) => {
  const { data, title } = props
  
  return (
    <div className="slider-container">
      <Typography sx={{ paddingLeft: '60px', paddingY: '20px', fontWeight: 'bold'}}>
          {title}
      </Typography>
      <Box 
        sx={{
          margin: "0 50px",
          ".element": {
            padding: "0 10px",
            height: '100%'
          },
          "h4": {
            fontWeight: 'bold',
            paddingTop: '7px',
            overflowWrap: 'break-word',
            maxHeight: '60px',
            overflow: 'hidden'
          },
          "h5": {
            paddingTop: '5px',
            overflowWrap: 'break-word'
          },
          ".img": {
            height: '180px'
          },
          ".description": {
            marginTop: 'auto'
          }
        }}
      >
        <div>
          <Slider {...settings}>
            {data.map((track) => (
              <div className="element" key={track._id}>
                <img className='img' src={`${ImgLink}/${track.imgUrl}`}></img>
                <div className="description">
                  <Link 
                    href={`/track/${convertSlugUrl(track.title)}-${track._id}?audio=${track.trackUrl}
                      &img=${track.imgUrl}
                      &title=${track.title}
                      &countPlay=${track.countPlay}
                      &countLike=${track.countLike}
                      &des=${track.description}`}>
                    <h4>{track.title}</h4>
                  </Link>
                  <h5>{track.description}</h5>
                </div>
                
              </div>
            ))}
          </Slider>
          <Divider/>
        </div>
      </Box>
    </div>
  );
}
export default MainSlider;