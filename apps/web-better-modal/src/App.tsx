import { useMemo, useState } from 'react'
import './App.css'
import Case2 from './cases/case2'
import Case3 from './cases/case3'
const Cases = {
  case2: Case2,
  case3: Case3,
}

function App() {
  const [curCase, setCurCase] = useState('case2')
  const Case = useMemo(() => Cases[curCase as keyof typeof Cases], [curCase])
  // const modal = useModal(TestModal)

  return (
    <>
      <div>
        <div>
          {Object.entries(Cases).map(([key, Case]) => (
            <button key={key} onClick={() => setCurCase(key)} type="button">
              {key}
            </button>
          ))}
        </div>
        {Case && <Case />}
      </div>
    </>
  )
}

export default () => {
  return (
    <>
      <App />
    </>
  )
}
