import { Modal, Button } from 'antd'
import NiceModal, { useModal } from '../origin'

export const MyAntdModal = NiceModal.create(({ name }) => {
  const modal = useModal()
  console.log('🚀 -> MyAntdModal -> modal:', modal)
  return (
    <Modal title="Hello Antd" open={modal.visible} onOk={modal.hide} onCancel={modal.hide} afterClose={modal.remove}>
      Greetings: {name}!
    </Modal>
  )
})

export default function Case3() {
  return (
    <>
      <NiceModal.Provider>
        <Button type="primary" onClick={() => NiceModal.show('my-antd-modal', { name: 'Nate' })}>
          Show Modal
        </Button>
        <div>Declarative https://opensource.ebay.com/nice-modal-react/#declarative</div>
        {/* <Child /> */}
        <MyAntdModal id="my
        
        
        
        -antd-modal" />
      </NiceModal.Provider>
    </>
  )
}

const Child = () => {
  return (
    <NiceModal.Provider>
      child
      <button type="button" onClick={() => NiceModal.show(MyAntdModal)}>
        show
      </button>
    </NiceModal.Provider>
  )
}
