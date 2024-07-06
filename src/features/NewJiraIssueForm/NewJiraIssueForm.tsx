import React, { useEffect, useState } from 'react';
import TextInput from '../../components/inputs/TextInput';
import useReportingMethod from '../../hooks/useReportingMethod';
import useJira from '../../hooks/useJira';
import useReportingModalStore from '../../hooks/useReportingModalStore';
import Button from '../../components/inputs/Button';
import Select from '../../components/inputs/Select';

function NewJiraIssueForm() {
    const [title, setTitle] = useState('');
    const { report, getIssueUrgencies } = useJira();
    const { isOpen, size, close, date } = useReportingModalStore();
    const [urgencies, setUrgencies] = useState<{ label: string, value: string }[]>([]);
    const [urgency, setUrgency] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    useEffect(() => {
        getIssueUrgencies()
            .then((urgencies) => {
                setUrgencies(urgencies.map((urgency) => ({ label: urgency.name, value: urgency.id })))
                setUrgency(urgencies[0].id);
            });
    }, []);

    useEffect(() => {
        // when clicking at the ESC key, close the modal
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                close();
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    })

    if (!isOpen) {
        return null;
    }

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
            <div className="bg-solid-primary-main p-8 rounded shadow-lg text-solid-primary-light w-1/2 h-1/2">
                <form className="w-full flex flex-col h-full" onSubmit={async (e) => {
                    e.preventDefault();
                    try {
                        await report(size, date, { summary: title, priority: { id: urgency }, description });
                        close();
                    } catch (e) {
                        console.error(e);
                    }
                }}>
                    <h1 className="text-2xl font-bold">Report a new Bug 🐞</h1>
                    <h2 className="text-lg font-semi-bold mt-5">Title</h2>
                    <TextInput onChange={(e) => setTitle(e.target.value)} value={title} required />
                    <h2 className="text-lg font-semi-bold mt-5">Urgency</h2>
                    <Select options={urgencies} onChange={(e) => setUrgency(e.target.value)} value={urgency} />
                    <h2 className="text-lg font-semi-bold mt-5">Description</h2>
                    <textarea className="rounded p-2 h-32 bg-solid-primary-dark" onChange={(e) => setDescription(e.target.value)} value={description} required={false} />
                    <div className="mt-auto">
                        <Button name="Report" type="submit" />
                    </div>
                </form>
            </div>
        </div>
    );
}

export default NewJiraIssueForm;
