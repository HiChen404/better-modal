import { FC, useContext } from 'react'
import { NiceModalContext, NiceModalProviderIdContext } from './context'
import { MODAL_REGISTRY } from './register'

export const NiceModalPlaceholder: FC = () => {
  const modals = useContext(NiceModalContext)
  const providerId = useContext(NiceModalProviderIdContext)

  const visibleModalIds = Object.values(modals)
  console.log('🚀 -> visibleModalIds:', visibleModalIds)

  const toRender = visibleModalIds
    .filter((id) => MODAL_REGISTRY[providerId][id])
    .map((id) => ({
      id,
      ...MODAL_REGISTRY[providerId][id],
    }))

  return (
    <>
      {toRender.map((t) => (
        <t.comp key={t.id} id={t.id} {...t.props} />
      ))}
    </>
  )
}
