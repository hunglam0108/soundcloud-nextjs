import * as React from 'react';
import Container from '@mui/material/Container';
import MainSlider from './components/slider/slider';
import { sendRequest } from './profile/api';

const getDataList = async (category: 'CHILL' | 'WORKOUT' | 'PARTY') => {
  try {
    const response = await sendRequest<IBackendRes<any>>({
      url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/tracks/top`,
      method: "POST",
      body: {
        category,
        limit: 10
      }
    })
    return { response };
  } catch (error: any) {
    return { error: error.message };
  }
}

export default async function Home() {
  const chillList = (await getDataList('CHILL')).response?.data
  const workoutList = (await getDataList('WORKOUT')).response?.data
  const partyList = (await getDataList('PARTY')).response?.data
  return (
    <Container>
      <MainSlider data={chillList} title='Play List Top Chill'></MainSlider>
      <MainSlider data={workoutList} title='Play List Top Workout'></MainSlider>
      <MainSlider data={partyList} title='Play List Top Party'></MainSlider>
    </Container>
  );
}