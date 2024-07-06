import { useEffect, useState } from 'react';
import { writeFile } from 'fs/promises';
import { ipcRenderer } from 'electron';
import path from 'path';
import useSelectedSource from './useSelectedSource';

const saveChunksToFile = async (chunks: Blob[], fileName: string) => {
    console.log('Saving chunks to file', chunks.length, fileName)

    const blob = new Blob(chunks, { type: 'video/webm; codecs=vp9' });
    const buffer = Buffer.from(await blob.arrayBuffer());
    const recordingsDir = path.join(ipcRenderer.sendSync('getUserDataPath'), 'recordings');
    await writeFile(path.join(recordingsDir, fileName), buffer);
};

const useRecorder = () => {
    const { selectedSource } = useSelectedSource();
    const [stream, setStream] = useState<MediaStream | undefined>(undefined);
    const [captureCallback, setCaptureCallback] = useState<((cb: (date: number) => Promise<void>) => Promise<void>) | undefined>(undefined);
    const [savedLength, setSavedLength] = useState(0);

    useEffect(() => {
        let interval: NodeJS.Timeout | undefined;
        let mediaRecorder: MediaRecorder | undefined;
        let chunks: Blob[] = [];

        const handleDataAvailable = (e: BlobEvent) => {
            console.log('Data available', chunks.length);
            chunks.push(e.data);
            setSavedLength((prev) => prev + 1);
        };

        const handleStop = async (fileName: string) => {
            await saveChunksToFile(chunks, fileName);
            chunks = [];
            if (mediaRecorder && mediaRecorder.state === 'inactive') {
                mediaRecorder.start(1000);
            }
        };

        const startRecording = async () => {
            try {
                const newStream = await navigator.mediaDevices.getUserMedia({
                    audio: false,
                    video: {
                        // @ts-ignore
                        mandatory: {
                            chromeMediaSource: 'desktop',
                            chromeMediaSourceId: selectedSource,
                        },
                    },
                });

                setStream(newStream);
                mediaRecorder = new MediaRecorder(newStream, {
                    mimeType: 'video/webm; codecs=vp9',
                });

                mediaRecorder.ondataavailable = handleDataAvailable;
                mediaRecorder.onstop = async () => {
                    await handleStop(`part-${Date.now()}.webm`);
                };

                mediaRecorder.start(1000);

                interval = setInterval(() => {
                    if (mediaRecorder && mediaRecorder.state === 'recording') {
                        mediaRecorder.stop();
                    }
                    setSavedLength(0);
                }, 10000);

                setCaptureCallback(() => async (cb: (date: number) => Promise<void>) => {
                    if (mediaRecorder && mediaRecorder.state === 'recording') {
                        mediaRecorder.stop();
                    }
                    const date = Date.now();
                    await handleStop(`part-${date}.webm`);
                    await cb(date);
                    if (mediaRecorder && mediaRecorder.state === 'inactive') {
                        mediaRecorder.start(1000);
                    }
                });
            } catch (error) {
                console.error('Error accessing media devices:', error);
            }
        };

        if (selectedSource) {
            startRecording();
        }

        return () => {
            if (interval) {
                clearInterval(interval);
            }
            if (mediaRecorder) {
                if (mediaRecorder.state === 'recording') {
                    mediaRecorder.stop();
                }
                mediaRecorder.ondataavailable = null;
                mediaRecorder.onstop = null;
            }
        };
    }, [selectedSource]);

    return { stream, captureCallback, savedLength };
};

export default useRecorder;
