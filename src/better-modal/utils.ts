import { ALREADY_MOUNTED, initialState, symModalId } from './modal'
import { NiceModalAction, NiceModalStore } from './types'

let uidSeed = 0

export const getUid = () => `_nice_modal_${uidSeed++}`

export const getModalId = (modal: string | (React.FC & { [symModalId]?: string })): string => {
  if (typeof modal === 'string') return modal as string
  if (!modal[symModalId]) {
    modal[symModalId] = getUid()
  }
  return modal[symModalId]!
}

export const reducer = (state: NiceModalStore = initialState, action: NiceModalAction): NiceModalStore => {
  switch (action.type) {
    case 'nice-modal/show': {
      const { modalId, args } = action.payload
      return {
        ...state,
        [modalId]: {
          ...state[modalId],
          id: modalId,
          args,
          visible: !!ALREADY_MOUNTED?.[modalId],
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
          visible: false,
        },
      }
    }
    case 'nice-modal/remove': {
      const { modalId } = action.payload
      const newState = { ...state }
      delete newState[modalId]
      return newState
    }

    default:
      return state
  }
}

export function showModal(modalId: string, args?: Record<string, unknown>): NiceModalAction {
  return {
    type: 'nice-modal/show',
    payload: {
      modalId,
      args,
    },
  }
}

export function removeModal(modalId: string): NiceModalAction {
  return {
    type: 'nice-modal/remove',
    payload: {
      modalId,
    },
  }
}
