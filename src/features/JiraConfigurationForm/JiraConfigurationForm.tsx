import React from 'react';
import TextInput from '../../components/inputs/TextInput';
import useReportingMethod from '../../hooks/useReportingMethod';

function JiraConfigurationForm() {
    const {
        jiraUrl,
        jiraProjectKey,
        jiraToken,
        jiraUsername,
        setJiraProjectKey,
        setJiraToken,
        setJiraUrl,
        setJiraUsername
    } = useReportingMethod();

    return (
        <div className="flex flex-col gap-5">
            <h2 className="text-xl font-bold ">Jira Configuration</h2>
            <h2 className="text-lg font-semibold">Jira URL</h2>
            <TextInput onChange={(e) => setJiraUrl(e.target.value)} value={jiraUrl} />
            <h2 className="text-lg font-semibold">Jira Project Key</h2>
            <TextInput onChange={(e) => setJiraProjectKey(e.target.value)} value={jiraProjectKey} />
            <h2 className="text-lg font-semibold">Jira Username</h2>
            <TextInput onChange={(e) => setJiraUsername(e.target.value)} value={jiraUsername} />
            <h2 className="text-lg font-semibold">Jira Personal Token</h2>
            <TextInput onChange={(e) => setJiraToken(e.target.value)} value={jiraToken} />
        </div>
    );
}

export default JiraConfigurationForm;