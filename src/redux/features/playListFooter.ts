import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState = { 
  isPlay: false, 
  src: '', 
  show: false,
  title: '', 
  description: '', 
  curTime: 0,
  reset: false,
  idTrack: '',
  imageUrl: '',
  playlistTracks: [] as Playlist[],
  indexTrack: null as number | null
};

export interface Playlist { 
  src: string, title: string, description: string, idTrack: string, imgUrl: string
}

const playListFooterSlice = createSlice({
  name: "footer",
  initialState,
  reducers: {
    setSrcMusic: (state, actions) => { 
      state.src = actions.payload.src
      state.show = true
      state.title = actions.payload.title
      state.description = actions.payload.description
      state.curTime = 0
      state.imageUrl = actions.payload.imageUrl
      state.idTrack = actions.payload.idTrack
      state.playlistTracks = []
      state.indexTrack = null
    },
    setPlaylist: (state, actions: PayloadAction<{ playlist: Playlist[], indexTrack: number }>) => { 
      state.src = actions.payload.playlist[actions.payload.indexTrack].src
      state.show = true
      state.title = actions.payload.playlist[actions.payload.indexTrack].title
      state.description = actions.payload.playlist[actions.payload.indexTrack].description
      state.curTime = 0
      state.idTrack = actions.payload.playlist[actions.payload.indexTrack].idTrack
      state.playlistTracks = actions.payload.playlist
      state.indexTrack = actions.payload.indexTrack
    },
    playMusic: (state, actions) => { 
      state.isPlay = actions.payload.isPlay
    },
    pauseMusic: (state, actions) => { 
      state.isPlay = actions.payload.isPlay
    },
    setCurrentTime: (state, actions) => {
      state.curTime = actions.payload.curTime
    },
    resetMusic: (state, actions) => {
      state.curTime = 0
      state.reset = actions.payload.reset
    },
    setTrackIndexPlaylist: (state, actions) => {
      if(state.playlistTracks.length > 0) {
        state.src = state.playlistTracks[actions.payload.indexTrack].src
        state.title = state.playlistTracks[actions.payload.indexTrack].title
        state.description = state.playlistTracks[actions.payload.indexTrack].description
        state.curTime = 0
        state.idTrack = state.playlistTracks[actions.payload.indexTrack].idTrack
        state.indexTrack = actions.payload.indexTrack
      }
    }
  }
});

export const { setSrcMusic, playMusic, pauseMusic, setCurrentTime, resetMusic, setPlaylist, setTrackIndexPlaylist } = playListFooterSlice.actions;
export default playListFooterSlice.reducer;