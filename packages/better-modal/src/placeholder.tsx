import { FC, useContext } from 'react'
import { NiceModalContext, NiceModalProviderIdContext } from './context'
import { MODAL_REGISTRY } from './register'

export const NiceModalPlaceholder: FC = () => {
  const modals = useContext(NiceModalContext)

  const toRender = Object.values(modals).map((modal) => {
    return {
      ...modal,
      ...MODAL_REGISTRY[modal.id],
    }
  })

  return (
    <>
      {toRender.map((t) => (
        <t.comp key={t.id} id={t.id} />
      ))}
    </>
  )
}
