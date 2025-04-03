import { FC, useContext } from 'react'
import { NiceModalContext } from './context'

export const NiceModalPlaceholder: FC = () => {
  const modals = useContext(NiceModalContext)
  const visibleModalIds = Object.keys(modals).filter((id) => modals[id])

  // const toRender = visibleModalIds.map()
  return null
}
