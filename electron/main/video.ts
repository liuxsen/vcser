import { ipcMain } from 'electron'
import { comporessVideo } from './ffmpeg'
import log from 'electron-log'
export const videoEvents = () => {
  ipcMain.handle('video:compress', (e, path, type: string, rate: number) => {
    log.info('video:compress', path)
    comporessVideo(path, type, rate)
  })
}