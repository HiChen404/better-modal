import { useMemo, useState } from 'react'
import './App.css'
import Case1 from './cases/case1'
import Case2 from './cases/case2'
import Case3 from './cases/case3'
import Case4 from './cases/case4'
import Case5 from './cases/case5'
import NestCase1 from './cases/nest_case1'
const Cases = {
  case1: Case1,
  case2: Case2,
  case3: Case3,
  case4: Case4,
  case5: Case5,
  nestCase1: NestCase1,
}

function App() {
  const [curCase, setCurCase] = useState('case3')
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
        <Case />
      </div>
    </>
  )
}

export default () => {
  return (
    // <NiceModal.Provider>
    <App />
    // </NiceModal.Provider>
  )
}
