import { getServerSession } from "next-auth"
import PlaylistManager from "./playlistContainer"
import { authOption } from "@/app/api/auth/[...nextauth]/authOption"
import { getPlaylistByUser, searchListTrack } from "@/app/api/api"

const PlaylistPage = async () => {
    const session = await getServerSession(authOption)
    const getPlaylistData = async () => {
        if(session?.access_token) {
            const response = await getPlaylistByUser(session?.access_token)
            if (response?.res?.data) {
                return(response?.res?.data.result)
            }
            return []
        }
    }
    const getTracksData = async () => {
        const response = await searchListTrack('')
        if (response?.res?.data) {
            return(response?.res?.data.result)
        }
        return []
    }
    const playlists = await getPlaylistData()
    const tracks = await getTracksData()
    return (
        <>
            <PlaylistManager playlistDefault={playlists ?? []} tracks={tracks ?? []} ></PlaylistManager>
        </>
    )
}
export default PlaylistPage