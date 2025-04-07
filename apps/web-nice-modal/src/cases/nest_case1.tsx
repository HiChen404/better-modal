// https://github.com/eBay/nice-modal-react/issues/100

import { Modal } from 'antd'
import NiceModal, { useModal } from '../origin'
import { useState } from 'react'

export const MyAntdModal = NiceModal.create(({ name }: { name: string }) => {
  const modal = useModal()
  return (
    <Modal title="Hello Antd" open={modal.visible} onOk={modal.hide} onCancel={modal.hide} afterClose={modal.remove}>
      Greetings: {name}!
    </Modal>
  )
})

export default function Root() {
  return (
    <NiceModal.Provider>
      <NestCase1 />
    </NiceModal.Provider>
  )
}

function NestCase1() {
  const [page, setPage] = useState('a')
  return (
    <div className="App">
      <button type="button" onClick={() => setPage('b')}>
        Click here to go to page B
      </button>
      {page === 'a' && <PageAContainer />}
      {page === 'b' && <PageB text="Hello" />}
    </div>
  )
}

function PageAContainer() {
  return (
    <NiceModal.Provider>
      <PageA />
    </NiceModal.Provider>
  )
}
// function PageA() {
//   const modal = NiceModal.useModal(MyAntdModal)
//   return (
//     <button type="button" onClick={() => modal.show()}>
//       Click here, it works
//     </button>
//   )
// }
// function PageB({ text }: { text: string }) {
//   const modal = NiceModal.useModal(MyAntdModal)
//   return (
//     <button type="button" onClick={() => modal.show()}>
//       Click here, it don't works
//     </button>
//   )
// }
function PageA() {
  // const modal = NiceModal.useModal(MyAntdModal)
  return (
    <button type="button" onClick={() => NiceModal.show(MyAntdModal)}>
      Click here, it works
    </button>
  )
}
function PageB({ text }: { text: string }) {
  // const modal = NiceModal.useModal(MyAntdModal)
  return (
    <button type="button" onClick={() => NiceModal.show(MyAntdModal)}>
      Click here, it don't works
    </button>
  )
}
