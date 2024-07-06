import zustand from 'zustand';

type ReportingModalState = {
    isOpen: boolean;
    open: () => void;
    close: () => void;
    size: number;
    setSize: (size: number) => void;
    date: number;
    setDate: (date: number) => void;
};

const useReportingModalStore = zustand<ReportingModalState>((set) => ({
    isOpen: false,
    open: () => set({ isOpen: true }),
    close: () => set({ isOpen: false }),
    size: 0,
    setSize: (size: number) => set({ size }),
    date: Date.now(),
    setDate: (date: number) => set({ date }),
}));

export default useReportingModalStore;