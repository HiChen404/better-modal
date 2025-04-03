import { Dispatch, FC } from 'react'
import { NiceModalAction } from './reducer'
import { MODAL_REGISTRY, register } from './register'
import { getModalId } from './utils'
function showModal(modalId: string, args?: Record<string, unknown>): NiceModalAction {
  return {
    type: 'nice-modal/show',
    payload: {
      modalId,
      args,
    },
  }
}

export function show({
  modal,
  args,
  dispatch,
  providerId,
}: {
  providerId: string | number
  modal: FC<any> | string
  args?: Record<string, unknown>
  dispatch: Dispatch<NiceModalAction>
}) {
  const modalId = getModalId(modal)
  console.log(MODAL_REGISTRY)

  if (typeof modal !== 'string' && !MODAL_REGISTRY[modalId]) {
    register({ comp: modal, providerId: providerId, modalId: modalId })
  }
  dispatch(showModal(modalId, args))
}
