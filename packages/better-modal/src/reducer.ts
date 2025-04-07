import { ALREADY_MOUNTED } from '.'
import { initialState } from './context'
import { NiceModalAction, NiceModalStore } from './types'


export const reducer = (
  state: NiceModalStore = initialState,
  action: NiceModalAction,
): NiceModalStore => {
  switch (action.type) {
    case 'nice-modal/show': {
      const { modalId, args } = action.payload
      return {
        ...state,
        [modalId]: {
          ...state[modalId],
          id: modalId,
          args,
          // If modal is not mounted, mount it first then make it visible.
          // There is logic inside HOC wrapper to make it visible after its first mount.
          // This mechanism ensures the entering transition.
          visible: !!ALREADY_MOUNTED[modalId],
          delayVisible: !ALREADY_MOUNTED[modalId],
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
    case 'nice-modal/set-flags': {
      const { modalId, flags } = action.payload
      return {
        ...state,
        [modalId]: {
          ...state[modalId],
          ...flags,
        },
      }
    }
    default:
      return state
  }
}

// action creator to show a modal
export function showModal(modalId: string, args?: Record<string, unknown>): NiceModalAction {
  return {
    type: 'nice-modal/show',
    payload: {
      modalId,
      args,
    },
  }
}

// action creator to set flags of a modal
export function setModalFlags(modalId: string, flags: Record<string, unknown>): NiceModalAction {
  return {
    type: 'nice-modal/set-flags',
    payload: {
      modalId,
      flags,
    },
  }
}
// action creator to hide a modal
export function hideModal(modalId: string): NiceModalAction {
  return {
    type: 'nice-modal/hide',
    payload: {
      modalId,
    },
  }
}

// action creator to remove a modal
export function removeModal(modalId: string): NiceModalAction {
  return {
    type: 'nice-modal/remove',
    payload: {
      modalId,
    },
  }
}
