import React from 'react';
//@ts-ignore
import JiraLogo from '../../icons/jira.svg?react'
//@ts-ignore
import JSLogo from '../../icons/js.svg?react'
import useReportingMethod from '../../hooks/useReportingMethod';
import JiraConfigurationForm from '../JiraConfigurationForm/JiraConfigurationForm';
import NodeJSConfigurationForm from '../NodeJsConfigurationForm/NodeJsConfigurationForm';


const reportingMethodToComponent = {
    jira: <JiraConfigurationForm />,
    node: <NodeJSConfigurationForm />,
}

function ReportingMethodConfiguration() {
    const { setReportingMethod, reportingMethod } = useReportingMethod();

    return (
        <>
            <h2 className="text-lg font-semibold" > Select reporting method</h2 >
            <div className="flex flex-row gap-5">
                <JiraLogo className="w-20 h-20 hover:opacity-90 rounded-xl cursor-pointer" onClick={() => setReportingMethod('jira')} />
                <JSLogo className="w-20 h-20 hover:opacity-90 rounded-xl cursor-pointer" onClick={() => setReportingMethod('node')} />
            </div>
            {reportingMethodToComponent[reportingMethod]}
        </>
    )
}

export default ReportingMethodConfiguration;