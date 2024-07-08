// Native
import path, { join } from 'path';

// Packages
import {
  BrowserWindow,
  app,
  ipcMain,
  IpcMainEvent,
  desktopCapturer,
  globalShortcut,
  Tray,
  Menu,
  nativeImage
} from 'electron';
import isDev from 'electron-is-dev';
import axios from 'axios';
import { createReadStream, readdir, stat, statSync, unlink } from 'fs';
import log from 'electron-log/main';

log.initialize();

const height = 600;
const width = 800;

function createWindow() {
  const window = new BrowserWindow({
    width,
    height,
    frame: false,
    show: true,
    resizable: true,
    fullscreenable: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      nodeIntegrationInWorker: true,
      preload: join(__dirname, 'preload.js'),
      webSecurity: false
    }
  });

  const port = process.env.PORT || 3000;
  const url = isDev ? `http://localhost:${port}` : join(__dirname, '../src/out/index.html');

  // and load the index.html of the app.
  if (isDev) {
    window?.loadURL(url);
  } else {
    window?.loadFile(url);
  }
  // Open the DevTools.
  // window.webContents.openDevTools();

  // For AppBar
  ipcMain.on('minimize', () => {
    // eslint-disable-next-line no-unused-expressions
    window.isMinimized() ? window.restore() : window.minimize();
    // or alternatively: win.isVisible() ? win.hide() : win.show()
  });
  ipcMain.on('maximize', () => {
    // eslint-disable-next-line no-unused-expressions
    window.isMaximized() ? window.restore() : window.maximize();
  });

  ipcMain.on('close', () => {
    window.close();
  });

  globalShortcut.register('CommandOrControl+Alt+j', () => {
    if (window) {
      window.show();
      window.focus();
      window.webContents.send('report');
    }
  });

  window.on('minimize', (event: any) => {
    event.preventDefault();
    window.hide();
  });

  window.on('close', (event) => {
    event.preventDefault();
    window.hide();
  });

  // if mac hide from dock
  if (process.platform === 'darwin') {
    app.dock.hide();
  }

  app.whenReady().then(() => {
    const icon = nativeImage.createFromPath(
      isDev ? join(__dirname, '../resources/icon.png') : join(__dirname, '../src/out/icon.png')
    );
    const trayIcon = icon.resize({ width: 16 });
    trayIcon.setTemplateImage(true);
    tray = new Tray(trayIcon);
    const contextMenu = Menu.buildFromTemplate([
      {
        label: 'Open',
        click: () => {
          window.show();
        }
      },
      {
        label: 'Quit',
        click: () => {
          window.destroy();
          app.quit();
        }
      }
    ]);
    tray.setToolTip('BugSnap');
    tray.on('click', () => {
      window.show();
    });
    tray.setContextMenu(contextMenu);
  });
}

let tray = null;

// Function to delete files older than 1 day
const deleteOldFiles = (dirPath: string, maxAgeInMinutes: number) => {
  log.info('Deleting old files in', dirPath);

  const now = Date.now();
  const maxAgeInMs = maxAgeInMinutes * 60 * 1000;

  readdir(dirPath, (err, files) => {
    if (err) {
      log.error(`Error reading directory ${dirPath}:`, err);
      return;
    }

    files.forEach((file) => {
      const filePath = path.join(dirPath, file);
      stat(filePath, (err, stats) => {
        if (err) {
          log.error(`Error getting stats of file ${filePath}:`, err);
          return;
        }

        if (now - stats.mtimeMs > maxAgeInMs) {
          unlink(filePath, (err) => {
            if (err) {
              log.error(`Error deleting file ${filePath}:`, err);
            } else {
              log.info(`Deleted old file: ${filePath}`);
            }
          });
        }
      });
    });
  });
};

//Create recording directory
const recordingsDir = path.join(app.getPath('userData'), 'recordings');
if (!require('fs').existsSync(recordingsDir)) {
  require('fs').mkdirSync(recordingsDir);
}

// Set interval to delete old files every hour
setInterval(() => {
  deleteOldFiles(recordingsDir, 5); // 1 hour
}, 60 * 1000); // Every minute

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

// listen the channel `message` and resend the received message to the renderer process
ipcMain.on('getSources', async (event: IpcMainEvent) => {
  const sources = await desktopCapturer.getSources({
    types: ['window', 'screen']
  });
  event.sender.send('sources', sources);
});

const Store = require('electron-store');
const store = new Store();

log.info('Starting application at', app.getPath('userData'));

ipcMain.on('saveConfigurations', (_: IpcMainEvent, configurations: any) => {
  store.store = configurations;
});

ipcMain.on('loadConfigurations', (event: IpcMainEvent) => {
  event.sender.send('configurations', store.store);
});

ipcMain.on('getUserDataPath', (event: IpcMainEvent) => {
  event.returnValue = app.getPath('userData');
});

ipcMain.on('getIssueUrgencies', async (event: IpcMainEvent) => {
  const { jiraToken, jiraUrl, jiraUsername } = store.store;
  const headers = {
    Authorization: `Basic ${Buffer.from(`${jiraUsername}:${jiraToken}`).toString('base64')}`
  };

  try {
    const response = await axios.get(`${jiraUrl}/rest/api/3/priority`, { headers });
    event.sender.send('issue-urgencies', { data: response.data, ok: true, error: null });
  } catch (error: any) {
    event.sender.send('issue-urgencies', { error: error?.response?.data, data: [], ok: false });
    log.error('Error getting issue urgencies', error.response.data);
  }
});

ipcMain.on('createIssue', async (event: IpcMainEvent, issue: any) => {
  log.info('Creating issue', issue);
  const { jiraToken, jiraUrl, jiraUsername } = store.store;
  const headers = {
    Authorization: `Basic ${Buffer.from(`${jiraUsername}:${jiraToken}`).toString('base64')}`,
    'Content-Type': 'application/json'
  };

  log.info('Sending request to', `${jiraUrl}/rest/api/3/issue`);

  try {
    const project = await axios.get(`${jiraUrl}/rest/api/3/project/${issue.fields.project.key}`, { headers });

    log.info('Project found', project.data);

    const attachments = issue.attachments;
    delete issue.attachments;
    const bugIssueType =
      project.data.issueTypes.find((issueType: any) => issueType.name === 'Bug') ??
      project.data.issueTypes.find((issueType: any) => issueType.name === 'Task');

    if (!bugIssueType) {
      event.sender.send('issue-created', {
        data: {},
        error: 'Bug or Task issue type not found',
        ok: false
      });
      return;
    }

    issue.fields.issuetype = {
      id: bugIssueType.id
    };

    const issueCreateResponse = await axios.post(`${jiraUrl}/rest/api/3/issue`, issue, {
      headers
    });

    log.info('Issue created', issueCreateResponse.data);

    // Add attachments to issue
    for (const attachment of attachments) {
      log.info('Adding attachment', attachment);
      const FormData = require('form-data');
      const form = new FormData();
      const stats = await statSync(attachment);
      const fileSizeInBytes = stats.size;
      const fileStream = createReadStream(attachment);

      // @ts-ignore
      form.append('file', fileStream, { knownLength: fileSizeInBytes });

      await axios.post(`${jiraUrl}/rest/api/3/issue/${issueCreateResponse.data.id}/attachments`, form, {
        headers: {
          'X-Atlassian-Token': 'no-check',
          ...headers,
          ...form.getHeaders()
        }
      });

      log.info('Attachment added', attachment);
      event.sender.send('issue-created', {
        error: null,
        data: { ...issueCreateResponse.data, link: `${jiraUrl}/browse/${issueCreateResponse.data.key}` },
        ok: true
      });
    }
  } catch (error: any) {
    event.sender.send('issue-created', { data: {}, error: error?.response?.data, ok: false });

    if (error.response) {
      log.error(error.response.data);
    } else {
      log.error(error);
    }
  }
});
