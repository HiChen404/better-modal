import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import NiceModal from 'better-modal'
import { Modal } from 'antd'
import './App.css'

const Modal1 = NiceModal.create(() => {
  const modal = NiceModal.useModal()
  return (
    <Modal open={modal.visible} title={'test'} onOk={modal.remove}>
      test
    </Modal>
  )
})

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <NiceModal.Provider>
        <Child />
      </NiceModal.Provider>
    </>
  )
}

function Child() {
  const modal = NiceModal.useModal(Modal1)
  const modal2 = NiceModal.useModal(Modal1)

  return (
    <>
      <div style={{ height: '700px', width: '400px', backgroundColor: 'lightblue', color: 'white' }}>
        <h1>Child1</h1>
        <button
          type="button"
          onClick={() => {
            modal.show()
          }}
        >
          click1
        </button>
        <button
          type="button"
          onClick={() => {
            modal2.show()
          }}
        >
          click2
        </button>
        <NiceModal.Provider>
          <Child2 />
        </NiceModal.Provider>
      </div>
    </>
  )
}

function Child2() {
  const modal = NiceModal.useModal(Modal1)
  return (
    <div style={{ height: '100px', width: '400px', backgroundColor: 'gray', color: 'white' }}>
      Child2
      <div>
        <button onClick={() => modal.show()} type="button">
          click
        </button>
      </div>
    </div>
  )
}

export default App
