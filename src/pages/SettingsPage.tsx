import React, { useEffect } from 'react';
import SourcePreview from '../features/SourcePreview/SourcePreview';
import SelectSource from '../features/SelectSource/SelectSource';
import ReportingMethodConfiguration from '../features/ReportingMethodConfiguration/ReportingMethodConfiguration';
import Button from '../components/inputs/Button';
import useConfigurations from '../hooks/useConfigurations';
import useRecorder from '../hooks/useRecorder';
import useReportBug from '../hooks/useJira';
import { ipcRenderer } from 'electron';
import NewJiraIssueForm from '../features/NewJiraIssueForm/NewJiraIssueForm';
import useReportingModalStore from '../hooks/useReportingModalStore';

function SettingsPage() {
    const { saveConfigurations, loadConfigurations, isLoading } = useConfigurations();
    const { captureCallback, stream, savedLength } = useRecorder();
    const { open, setSize, setDate } = useReportingModalStore();

    useEffect(() => {
        loadConfigurations();
    }, []);

    useEffect(() => {
        ipcRenderer.on('report', () => {
            captureCallback?.(async (date) => {
                setSize(savedLength)
                setDate(date)
                open()
            });
        });

        return () => {
            ipcRenderer.removeAllListeners('report');
        }
    }, [captureCallback]);

    if (isLoading) {
        return <div>Loading...</div>
    }

    return (
        <>
            <NewJiraIssueForm />
            <div className='w-full h-full relative'>
                <div className="flex flex-col h-full text-solid-primary-light p-5 z-10 w-1/2 bg-solid-primary-main">
                    <h1 className="text-2xl font-bold">Settings</h1>
                    <div className="flex flex-col gap-5 mt-5">
                        <SelectSource />
                        <ReportingMethodConfiguration />
                        <div className='mt-16'>
                            <Button name='save' onClick={saveConfigurations} />
                        </div>
                    </div>
                </div>
                <div className='w-[500px] absolute right-0 top-0'>
                    <SourcePreview stream={stream} />
                </div>
            </div>
        </>
    );
}

export default SettingsPage;