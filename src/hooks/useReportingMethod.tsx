import { create } from 'zustand';

type ReportingMethod = 'node' | 'jira';

export interface ReportingMethodState {
    reportingMethod: ReportingMethod;
    setReportingMethod: (method: ReportingMethod) => void;
    jiraUrl: string;
    setJiraUrl: (url: string) => void;
    jiraProjectKey: string;
    setJiraProjectKey: (key: string) => void;
    jiraUsername: string;
    setJiraUsername: (username: string) => void;
    jiraToken: string;
    setJiraToken: (token: string) => void;
};

const useReportingMethod = create<ReportingMethodState>((set) => ({
    reportingMethod: 'jira',
    setReportingMethod: (method: ReportingMethod) => set({ reportingMethod: method }),
    jiraUrl: '',
    setJiraUrl: (url: string) => set({ jiraUrl: url }),
    jiraProjectKey: '',
    setJiraProjectKey: (key: string) => set({ jiraProjectKey: key }),
    jiraUsername: '',
    setJiraUsername: (username: string) => set({ jiraUsername: username }),
    jiraToken: '',
    setJiraToken: (token: string) => set({ jiraToken: token }),
}));

export default useReportingMethod;