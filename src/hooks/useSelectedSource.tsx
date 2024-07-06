import { create } from 'zustand';

interface SelectedSourceState {
    selectedSource: string | undefined;
    setSelectedSource: (id: string) => void;
}

const useSelectedSource = create<SelectedSourceState>((set) => ({
    selectedSource: undefined,
    setSelectedSource: (id) => set({ selectedSource: id }),
}));

export default useSelectedSource;
