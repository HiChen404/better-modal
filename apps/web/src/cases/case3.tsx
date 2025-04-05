import { Modal, Button } from 'antd'
import NiceModal, { useModal } from 'better-modal'

export const MyAntdModal = NiceModal.create(({ name }: { name: string }) => {
  const modal = useModal()
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
        <Button type="primary" onClick={() => NiceModal.show("my-antd-modal", { name: 'hello' })}>
          Show Modal
        </Button>
        <div>Declarative https://opensource.ebay.com/nice-modal-react/#declarative</div>
        <Child />
        <MyAntdModal id="my-antd-modal" name='hi' />
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
