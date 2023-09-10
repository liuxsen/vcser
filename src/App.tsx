import { ChangeEventHandler, useEffect, useRef, useState } from 'react'
import Update from '@/components/update'
import './App.scss'
import { ipcRenderer } from 'electron'

console.log('[App.tsx]', `Hello world from Electron ${process.versions.electron}!`)

function App() {
  const onChange: ChangeEventHandler<HTMLInputElement> = async (e) => {
    const filePath = e.target.files![0].path
    console.log(filePath)
    ipcRenderer.invoke('video:compress', filePath)
      .then(res => {
        console.log('res')
      })
      .catch(err => {
        console.log(err)
      })
  }
  
  const inputRef = useRef<HTMLInputElement>(null)
  const clearInputValue = () => {
    if(inputRef.current){
      inputRef.current.value = ''
      inputRef.current.files = null
    }
  }
  
  const [progress, setProgress] = useState(0)
  useEffect(() => {
    ipcRenderer.on('video:compress:progress', (e, progress: number) => {
      console.log(progress)
      setProgress(progress)
      if(progress >= 100){
        window.alert('压缩成功')
        setProgress(0)
        clearInputValue()
      }
    })
  }, [])

  const renderProgress = Math.round(progress * 100) / 100 + '%'
  
  return (
    <div className='App'>
      <div>
        <input ref={inputRef} type='file' onChange={onChange}></input>
        {
          progress > 0 ? <span>正在压缩： {renderProgress}</span> : null
        }
      </div>
      {/* <Update /> */}
    </div>
  )
}

export default App
