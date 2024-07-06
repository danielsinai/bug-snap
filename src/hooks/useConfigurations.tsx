import { useState } from 'react';
import useReportingMethod, { ReportingMethodState } from './useReportingMethod';
import useSelectedSource from './useSelectedSource';

type Configuration = {
    reportingMethod: ReportingMethodState['reportingMethod'];
    jiraUrl: ReportingMethodState['jiraUrl'];
    jiraProjectKey: ReportingMethodState['jiraProjectKey'];
    jiraUsername: ReportingMethodState['jiraUsername'];
    jiraToken: ReportingMethodState['jiraToken'];
    selectedSource: string;
};

const useConfigurations = () => {
    const {
        reportingMethod,
        jiraUrl,
        jiraProjectKey,
        jiraToken,
        jiraUsername,
        setJiraProjectKey,
        setJiraToken,
        setJiraUrl,
        setJiraUsername,
        setReportingMethod
    } = useReportingMethod();
    const [isLoading, setIsLoading] = useState(true);
    const { selectedSource, setSelectedSource } = useSelectedSource();

    const loadConfigurations = () => {
        setIsLoading(true);
        window.Main.loadConfigurations();
        window.Main.on('configurations', (configurations: Configuration) => {
            setJiraProjectKey(configurations.jiraProjectKey);
            setJiraToken(configurations.jiraToken);
            setJiraUrl(configurations.jiraUrl);
            setJiraUsername(configurations.jiraUsername);
            setReportingMethod(configurations.reportingMethod);
            setSelectedSource(configurations.selectedSource ?? '');
            setIsLoading(false);
        });
    };

    const saveConfigurations = () => {
        window.Main.saveConfigurations({
            reportingMethod,
            jiraUrl,
            jiraProjectKey,
            jiraToken,
            jiraUsername,
            selectedSource
        });
    };

    return { loadConfigurations, saveConfigurations, isLoading };
};

export default useConfigurations;