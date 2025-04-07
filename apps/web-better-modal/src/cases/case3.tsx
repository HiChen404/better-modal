import { Button, Modal } from 'antd'
import NiceModal, { useModal } from 'better-modal'
import { createContext, useContext } from 'react'

export const MyAntdModal = NiceModal.create(({ name }: { name: string }) => {
  const modal = useModal()
  const value = useContext(TestContext)
  return (
    <Modal
      title="Hello Antd"
      open={modal.visible}
      onOk={() => {
        modal.resolve('hihihi')
        modal.hide()
      }}
      onCancel={modal.hide}
      afterClose={modal.remove}
    >
      Greetings: {name} and {value}!
    </Modal>
  )
})

export default function Case3() {
  return (
    <>
      <NiceModal.Provider providerId="parent">
        <Button type="primary" onClick={() => NiceModal.show('my-antd-modal', { name: 'hello' })}>
          Show Modal
        </Button>
        <div>Declarative https://opensource.ebay.com/nice-modal-react/#declarative</div>
        <Child />

        <MyAntdModal id="my-antd-modal" name="hi" />
      </NiceModal.Provider>
    </>
  )
}

const TestContext = createContext<number>(123)

const Child = () => {
  const modal = useModal(MyAntdModal)
  // const provider = NiceModal.useProvider()
  return (
    <TestContext.Provider value={99999}>
      <NiceModal.Provider providerId="child">
        child
        <button type="button" onClick={() => modal.show()}>
          show
        </button>
        <GrandChild />
      </NiceModal.Provider>
    </TestContext.Provider>
  )
}

const GrandChild = () => {
  // const modal = useModal(MyAntdModal)
  // const modal = useModal('my-antd-modal2')
  return (
    <div>
      grandchild
      <MyAntdModal id="my-antd-modal2" name="hi" />
      <button
        type="button"
        onClick={async () => {
          NiceModal.show('my-antd-modal2', {}, 'child')
          // modal.show({ name: '哈哈哈' })
          // await modal.show({ name: '哈哈哈' })
          console.log('show done')
        }}
        //  onClick={() => modal.show()}
      >
        show
      </button>
    </div>
  )
}
