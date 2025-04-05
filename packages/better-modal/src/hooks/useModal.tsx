      import { useContext, useEffect } from 'react'
import { NiceModalContext, NiceModalDispatchContext, NiceModalIdContext, NiceModalProviderIdContext } from '../context'
import { getModalId } from '../utils'
import { MODAL_REGISTRY, register, unregister } from '../register'
import { hide, remove, show } from '../reducer'

export function useModal(modal?: any, args?: any) {
  const modals = useContext(NiceModalContext)
  const contextModalId = useContext(NiceModalIdContext)
  const dispatch = useContext(NiceModalDispatchContext)

  if (!dispatch) throw new Error('No dispatch found in NiceModal.useModal.')

  let modalId: string | null = null
  const isUseComponent = modal && typeof modal !== 'string'

  if (!modal) {
    modalId = contextModalId
  } else {
    modalId = getModalId(modal)
  }

  if (!modalId) throw new Error('No modal id found in NiceModal.useModal.')

  const mid = modalId as string

  useEffect(() => {
    if (isUseComponent && !MODAL_REGISTRY?.[mid]) {
      register({ modalId: mid, comp: modal })
    }
  }, [isUseComponent, mid, modal])

  const showCallback = (args?: Record<string, unknown>) =>
    show({
      args: args,
      modal: mid,
      dispatch: dispatch,
    })
  const removeCallback = () => {
    return remove({ modal: mid, dispatch: dispatch })
  }

  const hideCallback = () => {
    return hide({ modal: mid, dispatch: dispatch })
  }

  const modalInfo = modals?.[mid]

  return {
    show: showCallback,
    visible: Boolean(modalInfo?.visible),
    remove: removeCallback,
    hide: hideCallback,
  }
}
