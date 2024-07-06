import { ipcRenderer } from 'electron';

declare global {
  interface Window {
    Main: typeof api;
    ipcRenderer: typeof ipcRenderer;
  }
}
const api = {
  getSources: () => {
    ipcRenderer.send('getSources');
  },
  saveConfigurations: (configurations: any) => {
    ipcRenderer.send('saveConfigurations', configurations);
  },
  loadConfigurations: () => {
    ipcRenderer.send('loadConfigurations');
  },
  createIssue: (issue: any) => {
    ipcRenderer.send('createIssue', issue);
  },
  getIssueUrgencies: () => {
    ipcRenderer.send('getIssueUrgencies');
  },
  getUserDataPath: () => {
    return ipcRenderer.sendSync('getUserDataPath');
  },
  Minimize: () => {
    ipcRenderer.send('minimize');
  },
  Maximize: () => {
    ipcRenderer.send('maximize');
  },
  Close: () => {
    ipcRenderer.send('close');
  },
  on: (channel: string, callback: (data: any) => void) => {
    ipcRenderer.on(channel, (_, data) => callback(data));
  },
  off: (channel: string, callback: (data: any) => void) => {
    ipcRenderer.off(channel, callback);
  }
};

window.Main = api;
window.ipcRenderer = ipcRenderer;
