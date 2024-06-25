import { Modal } from 'antd'
import NiceModal from './better-modal'

const Case = () => {
  const modal = NiceModal.useModal(MyModal)
  return (
    <NiceModal.Provider>
      <div
        onClick={() => {
          modal.show()
        }}>
        Open Modal
      </div>
    </NiceModal.Provider>
  )
}

const MyModal = NiceModal.create(() => {
  const modal = NiceModal.useModal()
  return (
    <Modal open={modal.visible} onOk={modal.remove} onClose={modal.remove}>
      Hello
    </Modal>
  )
})

export default Case
