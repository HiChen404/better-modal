import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import NiceModal from 'better-modal'
import { Modal } from 'antd'
import './App.css'

const Modal1 = NiceModal.create(() => {
  const modal = NiceModal.useModal()
  console.log('🚀 -> Modal1 -> modal:', modal)
  return (
    <Modal open={modal.open} title={'test'}>
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

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank" rel="noreferrer">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank" rel="noreferrer">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <button
        type="button"
        onClick={() => {
          modal.show()
        }}
      >
        click1
      </button>
    </>
  )
}

export default App
