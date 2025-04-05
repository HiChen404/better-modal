import { Dispatch, FC } from 'react'
import { NiceModalStore } from './context'
import { getModalId } from './utils'
import { register } from './register'
import { MODAL_REGISTRY } from './register'
export interface NiceModalAction {
  type: 'nice-modal/show' | 'nice-modal/hide' | 'nice-modal/remove'
  payload: {
    modalId: string
    args?: Record<string, unknown>
    flags?: Record<string, unknown>
  }
}

export const reducer = (state: NiceModalStore, action: NiceModalAction): NiceModalStore => {
  switch (action.type) {
    case 'nice-modal/show': {
      const { modalId, args } = action.payload

      return {
        ...state,
        [modalId]: {
          id: modalId,
          visible: true,
        },
      }
    }
    case 'nice-modal/hide': {
      const { modalId } = action.payload
      if (!state[modalId]) return state
      return {
        ...state,
        [modalId]: {
          ...state[modalId],
          id: modalId,
          visible: false,
        },
      }
    }
    case 'nice-modal/remove': {
      const { modalId } = action.payload
      const newState = { ...state }
      // TODO:unregister
      delete newState[modalId]

      return newState
    }
    default:
      console.error(`Unknown action type: ${action.type}`)
      return state
  }
}

function showModal(modalId: string, args?: Record<string, unknown>): NiceModalAction {
  return {
    type: 'nice-modal/show',
    payload: {
      modalId,
      args,
    },
  }
}

export function show(modal: FC<any> | string, args: Record<string, unknown> = {}) {
  const modalId = getModalId(modal)
  if (typeof modal !== 'string' && !MODAL_REGISTRY[modalId]) {
    register({ comp: modal, modalId: modalId })
  }
  ALL_DISPATCHES[id]?.dispatch(showModal(modalId, args))
}

export function remove({ modal, dispatch }: { modal: FC<any> | string; dispatch: Dispatch<NiceModalAction> }) {
  const modalId = getModalId(modal)

  dispatch({
    type: 'nice-modal/remove',
    payload: {
      modalId,
    },
  })
}

export function hide({ modal, dispatch }: { modal: FC<any> | string; dispatch: Dispatch<NiceModalAction> }) {
  const modalId = getModalId(modal)
  dispatch({
    type: 'nice-modal/hide',
    payload: { modalId },
  })
}
