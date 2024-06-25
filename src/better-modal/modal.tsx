import React, { PropsWithChildren, ReactNode, useContext, useEffect, useReducer } from 'react'
import { useModal } from './hooks/useModal'
import { dispatch, NiceModalContext } from './contexts/modal-context'
import { NiceModalIdContext } from './contexts/id-context'
import { NiceModalHocProps, NiceModalStore } from './types'
import { getModalId, getUid, reducer, removeModal } from './utils'

export const symModalId = Symbol('NiceModalId')
export const initialState: NiceModalStore = {}
export const MODAL_REGISTRY: {
  [id: string]: {
    comp: React.FC<any>
    props?: Record<string, unknown>
  }
} = {}
export const ALREADY_MOUNTED: Record<string, any> = {}

// action creator to show a modal

export const remove = (modal: string | React.FC<any>): void => {
  const modalId = getModalId(modal)
  dispatch(removeModal(modalId))
  // delete modalCallbacks[modalId]
  // delete hideModalCallbacks[modalId]
}

export function create<P extends {}>(Comp: React.ComponentType<P>): React.FC<P & NiceModalHocProps> {
  return (props) => {
    const { id } = props
    const { visible } = useModal(id)
    useEffect(() => {
      ALREADY_MOUNTED[id] = true

      return () => {
        delete ALREADY_MOUNTED[id]
      }
    }, [id])
    return (
      <NiceModalIdContext.Provider value={id}>
        <Comp {...(props as P)} />
      </NiceModalIdContext.Provider>
    )
  }
}
export const register = <T extends React.FC<any>>(id: string, comp: T, props: any) => {
  if (!MODAL_REGISTRY[id]) {
    MODAL_REGISTRY[id] = { comp, props }
  } else {
    MODAL_REGISTRY[id].props = props
  }
}
export const unregister = (id: string): void => {
  delete MODAL_REGISTRY[id]
}
