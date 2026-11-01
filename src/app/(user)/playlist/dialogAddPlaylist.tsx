'use client'
import { addUpdatePlaylist } from "@/app/api/api"
import { reduceText } from "@/app/utils/commonFunction"
import { popupSetContent } from "@/redux/features/popup"
import { Box, Chip, Typography } from "@mui/material"
import Button from "@mui/material/Button"
import Checkbox from "@mui/material/Checkbox"
import Dialog from "@mui/material/Dialog"
import DialogActions from "@mui/material/DialogActions"
import DialogContent from "@mui/material/DialogContent"
import DialogTitle from "@mui/material/DialogTitle"
import ListItemText from "@mui/material/ListItemText"
import MenuItem from "@mui/material/MenuItem"
import Select from "@mui/material/Select"
import TextField from "@mui/material/TextField"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useDispatch } from "react-redux"

// const availableSongs: string[] = [
//   'Bohemian Rhapsody',
//   'Imagine',
//   'Hotel California',
//   'Billie Jean',s
//   'Smells Like Teen Spirit',
//   'Shape of You',
//   'Blinding Lights',
// ];

const DialogAddPlaylist = (props:{ openDialog: boolean, setOpenDialog: (isOpen: boolean) => void, tracks: DataMusicType[] }) => {
  const { openDialog, setOpenDialog, tracks } = props
  const [selectedSongs, setSelectedSongs] = useState<string[]>([]);
  const [newPlaylistName, setNewPlaylistName] = useState<string>('');
  const { data: session } = useSession()
  const router = useRouter()
  const dispatch = useDispatch()

  const handleCreatePlaylist = async () => {
    if(session?.access_token && newPlaylistName) {
      const data = {
        title: newPlaylistName,
        tracks: selectedSongs
      }
      const response = await addUpdatePlaylist(data, session?.access_token)
      if (response?.res?.data) {
        dispatch(popupSetContent({message: 'Added new Playlist', type: 'success', showMessage: true}))
        setOpenDialog(false)
        router.refresh()
      } else {
        const errorMessage = response?.error ?? response?.res?.error
        dispatch(popupSetContent({message: errorMessage, type: 'error', showMessage: true}))
      }
    }
    if(!newPlaylistName) {
      dispatch(popupSetContent({message: 'Input Playlist Name', type: 'error', showMessage: true}))
    }
  };

  useEffect(() => {
    setSelectedSongs([])
    setNewPlaylistName('')
  }, [openDialog])

  return (
      <Dialog sx={{ m: 3 }} open={openDialog} onClose={() => setOpenDialog(false)} fullWidth maxWidth='sm'>
        <DialogTitle>Create New Playlist</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1, ml: 2, mr: 2 }}>
          <Box sx={{ pb: 1 }}>
            <Typography sx={{ pb: 1 }}>
              Playlist Name
            </Typography>
            <TextField
              value={newPlaylistName}
              onChange={(e) => {setNewPlaylistName(e.target.value)}}
              fullWidth
              required
            />
          </Box>
          <Box>
            <Typography sx={{ pb: 1 }}>Select Tracks</Typography>
            <Select
              multiple
              fullWidth
              value={selectedSongs}
              onChange={(e) => {
                setSelectedSongs(e.target.value as string[])
              }}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((value) => (
                    <Chip key={value} label={reduceText(tracks.find((i) => i._id === value)?.title ?? '')} />
                  ))}
                </Box>
              )}
            >
              {tracks.map((track) => (
                <MenuItem key={track._id} value={track._id}>
                  <Checkbox checked={selectedSongs.includes(track._id)} />
                  <ListItemText primary={reduceText(track.title)} />
                </MenuItem>
              ))}
            </Select>
          </Box>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', pb: 3, pt: 1 }}>
          <Button variant='outlined' onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleCreatePlaylist}>Create</Button>
        </DialogActions>
      </Dialog>
  )
}
export default DialogAddPlaylist;
