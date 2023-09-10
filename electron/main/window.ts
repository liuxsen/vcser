import { BrowserWindow, shell } from 'electron'
import { join } from 'node:path'
import { update } from './update'
import { videoEvents } from './video'
import { preload, indexHtml, VITE_DEV_SERVER_URL } from '../utils/constants'
let map = new Map<string, BrowserWindow>()

export const getWindow = (windowName: string) => {
  const win = map.get(windowName)
  return win
}

export const createWindow = (windowName: string) => {
  let win = new BrowserWindow({
    title: 'Main window',
    icon: join(process.env.VITE_PUBLIC, 'favicon.ico'),
    webPreferences: {
      preload: preload,
      // Warning: Enable nodeIntegration and disable contextIsolation is not secure in production
      // Consider using contextBridge.exposeInMainWorld
      // Read more on https://www.electronjs.org/docs/latest/tutorial/context-isolation
      nodeIntegration: true,
      contextIsolation: false,
    },
  })
  if (VITE_DEV_SERVER_URL) { // electron-vite-vue#298
    win.loadURL(VITE_DEV_SERVER_URL)
    // Open devTool if the app is not packaged
    win.webContents.openDevTools()
  } else {
    win.loadFile(indexHtml)
  }

  // Test actively push message to the Electron-Renderer
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', new Date().toLocaleString())
  })

  // Make all links open with the browser, not with the application
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('https:')) shell.openExternal(url)
    return { action: 'deny' }
  })

   // Apply electron-updater
   update(win)
   videoEvents()
   map.set(windowName, win)
   return win
}

// export const appWin = createWindow()