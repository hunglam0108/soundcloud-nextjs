'use client'
import WaveTrack from "@/app/components/trackComponent/waveTrack";
import { sendRequest } from "@/app/profile/api";
import { useSearchParams } from "next/navigation"
import React, { useEffect, useState } from "react";

const DetailTrackPage = (props: { params: { slug: string }}) => {
  const params = React.use(props.params as any) as any;
  const searchParams = useSearchParams()
  const [listComments, setListComments] = useState<[]>([])
  useEffect(() => {
    getDataComments()
    return () => {
      
    }
  }, [])

  const getDataComments = async () => {
    try {
      const response = await sendRequest<IBackendRes<{result: []}>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/tracks/comments`,
        method: "POST",
        queryParams: {
          curren: 1,
          pageSize: 10,
          trackId: params.slug
        }
      })
      setListComments(response.data?.result || []);
    } catch (error: any) {
      console.log({ error: error.message })
    }
  }

  return (
    <>
      <WaveTrack 
        audioLink={searchParams.get('audio') ?? ''} 
        imgLink={searchParams.get('img') ?? ''}
        comments={listComments}
        title={searchParams.get('title') ?? ''}
        des={searchParams.get('des') ?? ''}
      />
    </>
  )
}
export default DetailTrackPage