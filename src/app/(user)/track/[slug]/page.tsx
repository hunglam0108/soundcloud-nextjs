import { getStatusLikeTrack, sendRequest } from "@/app/api/api";
import { authOption } from "@/app/api/auth/[...nextauth]/authOption";
import CommentInput from "@/app/components/trackComponent/componentInput";
import WaveTrack from "@/app/components/trackComponent/waveTrack";
import { Metadata, ResolvingMetadata } from "next";
import { getServerSession } from "next-auth/next";
import React from "react";

type Props = {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ [key: string]: string | undefined }>
}
 
export async function generateMetadata(
  { params, searchParams }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const path = (await params).slug
  const slug = path.split('-')[path.split('-').length-1]
  // fetch post information
  const res = await sendRequest<IBackendRes<DataMusicType>>({
      url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/tracks/${slug}`,
      method: "GET"
  })
 
  return {
    title: res.data?.title,
    description: res.data?.description,
    authors: [{name: 'Hung Lam', url: '/'}],
    openGraph: {
      title: 'NHACCUATAO is Here',
      description: 'Music page NCT with NextJS',
      type: 'website',
      images: [],
    }
  }
}

const DetailTrackPage = async (props: Props) => {
  const session = await getServerSession(authOption)
  const path = (await props.params).slug;
  const params = (await props.searchParams);

  const slug = path.split('-')[path.split('-').length-1]

  const getDataComments = async () => {
    try {
      const response = await sendRequest<IBackendRes<{result: []}>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/tracks/comments`,
        method: "POST",
        queryParams: {
          current: 1,
          pageSize: 10,
          trackId: slug,
          sort: '-createdAt'
        }
      })
      return({ data: response.data?.result || []});
    } catch (error: any) {
      console.log({ error: error.message })
    }
  }
  const data = await getDataComments()
  const isLikedDefault = session?.access_token ? await getStatusLikeTrack(session?.access_token, slug) : false
  return (
    <>
      <WaveTrack
        idTrack={slug}
        audioLink={params.audio ?? ''} 
        imgLink={params.img ?? ''}
        countPlay={params.countPlay ? Number(params.countPlay) : 0}
        countLike={params.countLike ? Number(params.countLike) : 0}
        comments={data?.data ?? []}
        title={params.title  ?? ''}
        des={params.des ?? ''}
        isLikedDefault={isLikedDefault}
      />
    </>
  )
}
export default DetailTrackPage