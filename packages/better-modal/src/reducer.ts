import { initialState, NiceModalState, NiceModalStore } from './context'
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
          ...state[modalId],
          id: modalId,
          args,
          visible: true,
          delayVisible: true,
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
      console.log('after remove', {
        newState,
        MODAL_REGISTRY,
      })
      return newState
    }
    default:
      console.error(`Unknown action type: ${action.type}`)
      return state
  }
}
