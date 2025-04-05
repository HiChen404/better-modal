import NiceModal, { useModal } from '../origin'
import { Modal } from 'antd'

const Modal1 = NiceModal.create(() => {
  const modal = useModal()
  return (
    <Modal title="测试" open={modal.visible} onOk={modal.hide} onCancel={modal.hide}>
      测试 {modal.visible.toString()}
    </Modal>
  )
})

export default function Case2() {
  return (
    <>
      <NiceModal.Provider>
        <button type="button" onClick={() => NiceModal.show(Modal1)}>
          show modal1
        </button>
        <button type="button" onClick={() => NiceModal.show(Modal1)}>
          show modal1
        </button>
      </NiceModal.Provider>
    </>
  )
}
