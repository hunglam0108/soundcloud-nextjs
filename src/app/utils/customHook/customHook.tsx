import { increaseViewTrack } from '@/app/api/api';
import { resetMusic, setSrcMusic } from '@/redux/features/playListFooter';
import { RootState } from '@/redux/store';
import { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

export const useHasMounted = () => {
    const [hasMounted, setHasMounted] = useState<boolean>(false);
    useEffect(() => {
        setHasMounted(true);
    }, []);

    return hasMounted;
}

export const useScript = (url: string) => {
    useEffect(() => {
        const script = document.createElement('script');

        script.src = url;
        script.async = true;

        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        }
    }, [url]);
};

export const usePreventDoubleClick = <T extends (...args: any[]) => Promise<void> | void>(
  callback: T,
  delay: number = 100
): [boolean, (...args: Parameters<T>) => void] => {
  const [isProcessing, setIsProcessing] = useState(false);

  const wrappedCallback = useCallback(
    async (...args: Parameters<T>) => {
      if (isProcessing) return;

      setIsProcessing(true);
      try {
        await callback(...args);
      } finally {
        setTimeout(() => setIsProcessing(false), delay);
      }
    },
    [callback, isProcessing, delay]
  );

  return [isProcessing, wrappedCallback];
}

export const useWaveTrackHook = (input: {
    idTrack: string,
    audioLink: string,
    title: string,
    des: string,
    token: string | undefined,
    wavesurferPlay?: () => Promise<void>, 
    wavesurferPause?: () => void,
    wavesurferSetTime?: () => void, 
}) => {
    const { idTrack, audioLink, title, des, token, wavesurferPlay, wavesurferPause, wavesurferSetTime} = input
    const dispatch = useDispatch()
    const { isPlay, curTime } = useSelector((state: RootState) => state.playListFooter);
    useEffect(() => {
        if(isPlay) {
          wavesurferPlay && wavesurferPlay()
        }
        else if(!isPlay) {
          wavesurferPause && wavesurferPause()
        }
    }, [isPlay])
    
    useEffect(() => {
        if(curTime) {
            wavesurferSetTime && wavesurferSetTime()
        }
    }, [curTime])

    useEffect(() => {
        if(token) increaseViewTrack(token, idTrack)
    }, [token])
    
    useEffect(() => {
        dispatch(resetMusic({ reset: true }))
        dispatch(setSrcMusic({ idTrack: idTrack ,src: audioLink, title: title, description: des }))
    }, [])
}