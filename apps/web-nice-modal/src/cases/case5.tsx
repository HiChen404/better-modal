import React, { useState } from 'react'
import NiceModal, { useModal } from '../origin'
import { Form, Input, Modal } from 'antd'

export const MyAntdModal = NiceModal.create(({ name }) => {
  const modal = useModal()
  console.count('modal1重渲染')

  return (
    <Modal title="Hello Antd" open={modal.visible} onOk={modal.hide} onCancel={modal.hide} afterClose={modal.remove}>
      Greetings: {name}!
      <button type="button" onClick={() => NiceModal.show(MyAntdModal2)}>
        show2
      </button>
    </Modal>
  )
})
export const MyAntdModal2 = NiceModal.create(({ name }) => {
  const modal = useModal()
  console.count('modal2重渲染')

  return (
    <Modal title="Hello Antd" open={modal.visible} onOk={modal.hide} onCancel={modal.hide} afterClose={modal.remove}>
      <Form.Item label="name">
        <Form.Item name={'name'}>
          <Input placeholder="请输入" />
        </Form.Item>
      </Form.Item>
      <button type="button" onClick={() => NiceModal.show(MyAntdModal3)}>
        show3
      </button>
    </Modal>
  )
})
export const MyAntdModal3 = NiceModal.create(({ name }) => {
  const modal = useModal()
  console.count('modal3重渲染')

  return (
    <Modal title="Hello Antd" open={modal.visible} onOk={modal.hide} onCancel={modal.hide} afterClose={modal.remove}>
      <Form.Item label="name">
        <Form.Item name={'name'}>
          <Input placeholder="请输入" />
        </Form.Item>
      </Form.Item>
    </Modal>
  )
})

const Case5 = () => {
  const [showChild, setShowChild] = useState(true)
  const [providerId, setProviderId] = useState(1)
  return (
    <NiceModal.Provider providerId={providerId.toString()}>
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
    <NiceModal.Provider>
      <div style={{ backgroundColor: '#ffe6e6', padding: '10px', borderRadius: '5px', margin: '10px 0' }}>
        child
        <button type="button" onClick={() => NiceModal.show(MyAntdModal)}>
          show
          {/* {Math.random()} */}
        </button>
      </div>
    </NiceModal.Provider>
  )
}

export default Case5
