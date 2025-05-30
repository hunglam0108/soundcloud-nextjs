'use client'
import { AppBar, Box, Container } from '@mui/material';
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';
import { useHasMounted } from '../../utils/customHook/customHook';

const FooterPlay: React.FC<{ show?: boolean }> = ({ show }) => {
  const hasMounted =  useHasMounted()
  return (
    !hasMounted || !show ? <></> :
    <AppBar sx={{backgroundColor: "#f2f2f2", width: '100%', position: 'fixed', top: 'auto', bottom: 0}}>
      <Container sx={{ display: 'flex', gap: 10 }}>
        <AudioPlayer
          style={{ 
            backgroundColor: "#f2f2f2",
            width: '80%',
            boxShadow: 'none',
            scale: '0.7 0.7',
            paddingTop: 2,
            paddingBottom: 2
          }}
          autoPlay
          src="https://samplelib.com/lib/preview/mp3/sample-15s.mp3"
          onPlay={e => console.log("onPlay")}
        />
        <Box sx={{ flexDirection: 'column', display: 'flex', minWidth: '100px', justifyContent: 'center'}}>
          <div style={{ color: '#ccc'}}>Edsheren</div>
          <div style={{ color: 'black'}}>Bad Habit</div>
        </Box>
      </Container>
    </AppBar>
  )
}
export default FooterPlay;