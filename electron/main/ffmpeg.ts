import ffmpegPath from '@ffmpeg-installer/ffmpeg'
import ffprobePath from '@ffprobe-installer/ffprobe'
import ffmpeg from 'fluent-ffmpeg'
import { getWindow } from './window'
import log from 'electron-log'

ffmpeg.setFfmpegPath(ffmpegPath.path)
ffmpeg.setFfprobePath(ffprobePath.path)
// ./ffmpeg -i ~/Downloads/liting/端午节海报.mp4 -c:v libx264 -preset medium -crf 23 -c:a aac -b:a 128k ~/Downloads/liting/端午节海报_compressed.mp4
// https://cloud.tencent.com/developer/article/1524052

export const comporessVideo = (videoPath: string) => {
  const outputPath = videoPath.replace(/\.mp4/, 'compressed.mp4')
  log.info(outputPath)
  const window = getWindow('app')
  try {
    
  
  ffmpeg(videoPath)
    .videoCodec('libx264')
    .on('error', function(err, stdout, stderr) {
      log.info('Cannot process video: ' + err.message);
    })
    .on('codecData', function(data) {
      console.log('Input is ' + data.audio + ' audio ' +
        'with ' + data.video + ' video');
    })
    .on('progress', function(progress) {
      console.log('Processing: ' + progress.percent + '% done');
      window?.webContents.send('video:compress:progress', progress.percent)
    })
    .on('end', function () {
      console.log('end')
      window?.webContents.send('video:compress:progress', 100)
    })
    .output(outputPath)
    .run()
  } catch (error) {
    log.error(error)
  }
}