import { create } from 'zustand';
import { DesktopCapturerSource } from 'electron/renderer';
import { useEffect, useState } from 'react';

interface SourcesState {
    videoSources: DesktopCapturerSource[];
    setVideoSources: (sources: DesktopCapturerSource[]) => void;
}

const useSources = create<SourcesState>((set) => ({
    videoSources: [],
    setVideoSources: (sources) => set({ videoSources: sources }),
}));

const useSourcesStore = () => {
    const { setVideoSources, videoSources } = useSources();

    useEffect(() => {
        window.Main.getSources();
        const handleSources = (sources: any) => {
            setVideoSources(sources);
        };
        window.Main.on('sources', handleSources);

        return () => {
            window.Main.off('sources', handleSources);
        };
    }, [setVideoSources]);

    return { videoSources };
};

export default useSourcesStore;
