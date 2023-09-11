import ffmpegPath from '@ffmpeg-installer/ffmpeg'
import ffprobePath from '@ffprobe-installer/ffprobe'
import ffmpeg, { ffprobe } from 'fluent-ffmpeg'
import { getWindow } from './window'
import log from 'electron-log'

ffmpeg.setFfmpegPath(ffmpegPath.path)
ffmpeg.setFfprobePath(ffprobePath.path)
// ./ffmpeg -i ~/Downloads/liting/端午节海报.mp4 -c:v libx264 -preset medium -crf 23 -c:a aac -b:a 128k ~/Downloads/liting/端午节海报_compressed.mp4
// https://cloud.tencent.com/developer/article/1524052

const compressMp4 =(videoPath: string) => {
  const outputPath = videoPath.replace(/\.mp4/, 'compressed.mp4')
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
        if(progress.percent < 100){
          window?.webContents.send('video:compress:progress', progress.percent)
        }
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

const compressGif =(videoPath: string, rate: number = 10) => {
  const window = getWindow('app')
  const fps = 10;
  const outputPath = videoPath.replace(/\.mp4/, 'compressed.gif')
  ffprobe(videoPath, (err, metadata) => {
    if (err) {
      console.error('无法获取视频元数据:', err);
      return;
    }
  
    const width = metadata.streams[0].width;
    const options = [
      '-vf', 'split[s0][s1];[s0]palettegen[p];[s1][p]paletteuse',
      '-loop 0',
      `-r ${rate}`,
      '-f gif',
    ]
    console.log(options)
    ffmpeg(videoPath)
      .fps(fps)
      // .size(`${width}`)
      // .videoFilter('scale=-1:flags=lanczos')
      // .outputOptions(`-colors 64`)
      .outputOptions(options)
      // .outputOptions('-coalesce')
      .on('progress', function(progress: any) {
        console.log('Processing: ' + progress.percent + '% done');
        if(progress.percent < 100){
          window?.webContents.send('video:compress:progress', progress.percent)
        }
      })
      .on('end', function () {
        console.log('end')
        window?.webContents.send('video:compress:progress', 100)
      })
      .on('error', (err) => {
        log.error('转换出错:', err);
      })
      .output(outputPath)
      .run()
  });
  
}

export const comporessVideo = (videoPath: string, type: string, rate: number) => {
    if(type === 'mp4'){
      compressMp4(videoPath)
    } else if(type === 'gif'){
      compressGif(videoPath, rate)
    }
}