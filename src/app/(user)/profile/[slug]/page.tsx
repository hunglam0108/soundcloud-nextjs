import { sendRequest } from "@/app/api/api";
import { Container } from "@mui/material";
import AudioCard from "./audioCardList";

const getDataList = async (id: string) => {
  try {
    const response = await sendRequest<IBackendRes<IModelPaginate<DataMusicType[]>>>({
      url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/tracks/users?current=1&pageSize=10`,
      method: "POST",
      body: {
        id
      }
    })
    return { response };
  } catch (error: any) {
    return { error: error.message };
  }
}
const ProfilePage = async ({ params }: { params: { slug: string }}) => {
  const data = await getDataList(params.slug)
  return (
    <>
      <Container style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: 50, marginTop: 20 }}>
        {data.response?.data && data.response?.data.result.map((i: any, index: number) => 
          <div key={`audiokey-${i.title}-${index}`} style={{ display: 'flex', marginBottom: 2, width: '45%' }}>
            <AudioCard id={i._id} title={i.title} artist={i.description} image={i.imgUrl} audioSrc={i.trackUrl}></AudioCard>
          </div>
        )}
      </Container>
    </>
  )
}
export default ProfilePage