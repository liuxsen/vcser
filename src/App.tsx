import { ChangeEventHandler, useEffect, useRef, useState } from 'react'
import { Button, ConfigProvider, DatePicker, Progress, Slider, Space, message } from 'antd';
import zhCN from 'antd/locale/zh_CN';

import Update from '@/components/update'
import './App.scss'
import { ipcRenderer } from 'electron'
import SelectType from './components/selectType'
console.log('[App.tsx]', `Hello world from Electron ${process.versions.electron}!`)

function App() {
  const [filePath, setFilePath] = useState('')
  
  const onChange: ChangeEventHandler<HTMLInputElement> = async (e) => {
    const _filePath = e.target.files![0].path
    setFilePath(_filePath)
  }
  
  const inputRef = useRef<HTMLInputElement>(null)
  
  const [isStarting, setIsStarting] = useState(false)
  const [progress, setProgress] = useState(0)
  const onProgress = (e: any, progress:number) => {
    setIsStarting(false)
    console.log(progress)
    setProgress(progress)
    if(progress >= 100){
      message.success('任务完成')
      setProgress(0)
    }
  }

  useEffect(() => {
    ipcRenderer.on('video:compress:progress', onProgress)
    // return () => {
    //   ipcRenderer.removeListener('video:compress:progress', onProgress)
    // }
  }, [])

  const renderProgress = Math.round(progress * 100)/100
  

  const [type, setType] = useState('mp4')
  const onChangeType = (type: string) => {
    setType(type)
  }

  const [rate, setRate] = useState(10)
  const onChangeRate = (rate: number) => {
    setRate(rate)
  }

  const onStart = () => {
    if(!filePath){
      window.alert('请选择文件')
      return
    }
    if(!type){
      window.alert('请选择转化类型')
      return
    }
    setIsStarting(true)
    ipcRenderer.invoke('video:compress', filePath, type, rate)
      .then(res => {
        message.info('任务启动中')
      })
      .catch(err => {
        console.log(err)
      })
  }

  return (
    <ConfigProvider locale={zhCN}>
      <div className='App' >
        <Space direction='vertical'>
          <div>
            选择文件：
            <input ref={inputRef} type='file' onChange={onChange}></input>
          </div>
          <div>
            选择转化类型：
            <SelectType onChange={onChangeType} value={type}/>
          </div>
          {
            type === 'gif' &&
            <div>
              帧数调整：
                <span style={{color: 'red'}}>(数值越大越流畅，文件越大；反之，数值越小，越流畅文件越小)</span>
                <Slider min={1} max={30} value={rate} onChange={onChangeRate}></Slider>
            </div>
          }
          <div>
            {
              isStarting && <span>任务正在启动中,请稍候...</span>
            }
            {
              progress > 0 ? <span>正在压缩： 
                <Progress percent={renderProgress}></Progress>
                </span> : null
            }
          </div>
          <div>
            <Button type='primary' onClick={onStart}>开始</Button>
          </div>
          </Space>
        {/* <Update /> */}
      </div>
    </ConfigProvider>
  )
}

export default App
