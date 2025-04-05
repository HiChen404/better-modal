import NiceModal, { useModal } from './origin'
import { useMemo, useState } from 'react'
import './App.css'
import Case1 from './cases/case1'
import Case2 from './cases/case2'
import Case3 from './cases/case3'
import { Modal } from 'antd'
import Case4 from './cases/case4'
const Cases = {
  case1: Case1,
  case2: Case2,
  case3: Case3,
  case4: Case4,
}

function App() {
  const [curCase, setCurCase] = useState('case3')
  const Case = useMemo(() => Cases[curCase as keyof typeof Cases], [curCase])
  // const modal = useModal(TestModal)

  return (
    <>
      <div>
        <button
          type="button"
          // onClick={() => NiceModal.show(TestModal)}
          // onClick={() => {
          //   modal.show()
          // }}
        >
          顶级测试
        </button>
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
