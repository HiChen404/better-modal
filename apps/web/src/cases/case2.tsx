import NiceModal from 'better-modal'
import { Modal } from 'antd'

const Modal1 = NiceModal.create(() => {
  const modal = NiceModal.useModal()
  return (
    <Modal title="测试" open={modal.visible} onOk={modal.hide} onCancel={modal.remove}>
      测试 {modal.visible.toString()}
    </Modal>
  )
})

export default function Case2() {
  return (
    <>
      <NiceModal.Provider>
        <Child />
      </NiceModal.Provider>
    </>
  )
}

const Child = () => {
  return (
    <button
      type="button"
      onClick={() => {
        NiceModal.show(Modal1)
      }}
    >
      show modal1
    </button>
  )
}
