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

export function show(modal: FC<any> | string, args?: Record<string, unknown>, dispatch?: Dispatch<NiceModalAction>) {
  console.log('🚀 -> show -> modal:', 1212)
  const modalId = getModalId(modal)

  if (typeof modal !== 'string' && !MODAL_REGISTRY[modalId]) {
    register(modalId, modal)
  }
  dispatch?.(showModal(modalId, args))
}
