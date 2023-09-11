import { ChangeEventHandler, useState , useEffect} from 'react'

const typeList = [
  {id: 1, label: 'mp4'},
  {id: 2, label: 'gif'},
]
type Props = {
  onChange: (v: string) => void
  value: string
}
const SelectType = (props: Props) => {
  const [state, setState] = useState(props.value)
  const onChange: ChangeEventHandler<HTMLSelectElement> = (e) => {
    const v = e.target.value
    props.onChange(v)
    setState(v)
  }
  useEffect(() => {
    props.onChange(state)
  }, [])
  
  return <select onChange={onChange} value={state}>
    {
      typeList.map(item => {
        return <option key={item.id}>{item.label}</option>
      })
    }
    
  </select>
}

export default SelectType