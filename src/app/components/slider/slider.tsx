'use client';
import React, { useEffect, useMemo, useState } from "react";
import Slider, { Settings } from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Box, Button, Divider, Typography } from "@mui/material";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import Link from "next/link";
import { ImgLink } from "@/app/utils/constant";

interface PropsSlide {
  data: DataMusicType[]
  title: string
}
const MainSlider = (props: PropsSlide) => {
  const { data, title } = props
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
    prevArrow: <PrevArrow/>,
  }

  return (
    <div className="slider-container">
        <Typography sx={{ paddingLeft: '60px', paddingY: '20px', fontWeight: 'bold'}}>
            {title}
        </Typography>
        <Box 
          sx={{
            margin: "0 50px",
            ".element": {
              padding: "0 10px"
            },
            "h4": {
              fontWeight: 'bold',
              paddingTop: '7px'
            },
            "h5": {
              paddingTop: '5px'
            }
          }}
        >
          <div>
            <Slider {...settings}>
              {data.map((track) => (
                <div className="element" key={track._id}>
                  <img src={`${ImgLink}/${track.imgUrl}`}></img>
                  <Link 
                    href={`/track/${track._id}?audio=${track.trackUrl}
                        &img=${track.imgUrl}
                        &title=${track.title}
                        &des=${track.description}`}>
                    <h4>{track.title}</h4>
                  </Link>
                  <h5>{track.description}</h5>
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