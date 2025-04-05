/* *********************************************************
 * Copyright 2021 eBay Inc.

 * Use of this source code is governed by an MIT-style
 * license that can be found in the LICENSE file or at
 * https://opensource.org/licenses/MIT.
*********************************************************** */

import { FC } from 'react'
import { NiceModalAction, NiceModalStore } from './types'

// Tracking already mounted modals
export const ALREADY_MOUNTED: Record<string, boolean> = {}

export const MODAL_REGISTRY: {
  [id: string]: {
    comp: FC<any>
    props?: Record<string, unknown>
  }
} = {}

const initialState: NiceModalStore = {}

// Modal reducer used in useReducer hook.
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
