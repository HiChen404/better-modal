import { FC, useContext } from 'react'
import { NiceModalContext, NiceModalProviderIdContext } from './context'
import { MODAL_REGISTRY } from './register'

export const NiceModalPlaceholder: FC = () => {
  console.log(222)

  const modals = useContext(NiceModalContext)
  const providerId = useContext(NiceModalProviderIdContext)

  const visibleModalIds = Object.keys(modals).filter((id) => modals[id])

  const toRender = visibleModalIds
    .filter((id) => MODAL_REGISTRY[providerId][id])
    .map((id) => ({
      id,
      ...MODAL_REGISTRY[providerId][id],
    }))

  console.log('🚀 -> toRender:', toRender)
  return (
    <>
      {toRender.map((t) => (
        <t.comp key={t.id} id={t.id} {...t.props} />
      ))}
    </>
  )
}
