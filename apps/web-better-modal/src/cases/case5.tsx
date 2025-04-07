import React, { useState } from 'react'
import NiceModal, { useModal } from 'better-modal'
import { Modal } from 'antd'

export const MyAntdModal = NiceModal.create(({ name }) => {
  const modal = useModal()
  return (
    <Modal title="Hello Antd" open={modal.visible} onOk={modal.hide} onCancel={modal.hide} afterClose={modal.remove}>
      Greetings: {name}!
    </Modal>
  )
})

const Case5 = () => {
  const [showChild, setShowChild] = useState(true)
  const [providerId, setProviderId] = useState(1)
  return (
    <NiceModal.Provider providerId={providerId}>
      <button type="button" onClick={() => setProviderId(providerId + 1)}>
        change providerId
      </button>
      <div style={{ backgroundColor: '#e6f7ff', padding: '10px', borderRadius: '5px' }}>
        Case5
        <button type="button" onClick={() => NiceModal.show(MyAntdModal)}>
          show
        </button>
        {/* 卸载 Child */}
        <button type="button" onClick={() => setShowChild(!showChild)}>
          卸载child
        </button>
        {showChild && <Child />}
      </div>
    </NiceModal.Provider>
  )
}

const Child = () => {
  return (
    <NiceModal.Provider providerId="child">
      <div style={{ backgroundColor: '#ffe6e6', padding: '10px', borderRadius: '5px', margin: '10px 0' }}>
        child
        <button type="button" onClick={() => NiceModal.show(MyAntdModal)}>
          show
        </button>
      </div>
    </NiceModal.Provider>
  )
}

export default Case5
