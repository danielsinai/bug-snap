import { useEffect } from "react";
import useConfigurations from "./useConfigurations";
import useReportingMethod from "./useReportingMethod";
import fs from 'fs';
import path from 'path';
import { shell } from 'electron';

const getLatestFile = (dirPath: string, date: number) => {
    const files = fs.readdirSync(dirPath).map(file => ({
        path: path.join(dirPath, file),
        mtime: fs.statSync(path.join(dirPath, file)).mtimeMs,
    }));

    const filesLowerThanEqualDate = files.filter(file => file.mtime < date);
    filesLowerThanEqualDate.sort((a, b) => b.mtime - a.mtime);

    return filesLowerThanEqualDate[0];
};

const useJira = () => {
    const { loadConfigurations } = useConfigurations();
    const { jiraProjectKey } = useReportingMethod();

    useEffect(() => {
        loadConfigurations();
    }, []);

    return {
        report: async (size: number, date: number, data: { summary: string, priority: object, description: string }) => {
            const recordingsDir = path.join(window.Main.getUserDataPath(), 'recordings');
            const lastFile = `${recordingsDir}/part-${date}.webm`
            const part2 = getLatestFile(recordingsDir, date);
            const latestFiles = size >= 5 ? [lastFile] : [lastFile, part2.path];

            window.Main.createIssue({
                attachments: latestFiles,
                fields: {
                    project: {
                        key: jiraProjectKey,
                    },
                    ...data,
                    description: {
                        "type": "doc",
                        "version": 1,
                        "content": [
                            {
                                "type": "paragraph",
                                "content": [
                                    {
                                        "type": "text",
                                        "text": "This bug was reported automatically by BugSnap - see attached files for more information.",
                                    },
                                    {
                                        type: "hardBreak",
                                    },
                                    {
                                        "type": "text",
                                        "text": data.description,
                                    },
                                ],
                            },
                        ],
                    },
                },
            });

            const result: any = await new Promise((resolve, reject) => window.Main.on('issue-created', (data) => {
                if (data.ok === false) {
                    reject(data.error);
                } else {
                    resolve(data);
                }
                window.Main.off('issue-created', () => { });
            }));

            shell.openExternal(result.data.link);
        },
        getIssueUrgencies: async (): Promise<{ id: string, name: string }[]> => {
            window.Main.getIssueUrgencies();

            return new Promise((resolve, reject) => window.Main.on('issue-urgencies', (data) => {
                if (data.ok === false) {
                    reject(data.error);
                } else {
                    resolve(data.data);
                }
                window.Main.off('issue-urgencies', () => { });
            }));
        }
    };
};

export default useJira;
