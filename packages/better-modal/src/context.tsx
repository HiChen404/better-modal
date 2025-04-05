import React, { Dispatch, FC, PropsWithChildren, useEffect, useReducer, useState } from 'react'

import { NiceModalPlaceholder } from './placeholder'
import { NiceModalAction, reducer } from './reducer'

export interface NiceModalState {
  // TODO: 避免与属性冲突
  id: string
  // args?: Record<string, unknown>
  visible?: boolean
}

export interface NiceModalStore {
  [key: string]: NiceModalState
}

export const initialState: NiceModalStore = {}

const ALL_DISPATCHES: Record<string, Dispatch<NiceModalAction>> = {}

export const NiceModalContext = React.createContext(initialState)
export const NiceModalIdContext = React.createContext<string | null>(null)
export const NiceModalDispatchContext = React.createContext<Dispatch<NiceModalAction> | null>(null)
export const NiceModalProviderIdContext = React.createContext<number | string>('default')

NiceModalContext.displayName = 'NiceModalContext'
NiceModalIdContext.displayName = 'NiceModalIdContext'
NiceModalDispatchContext.displayName = 'NiceModalDispatchContext'
NiceModalProviderIdContext.displayName = 'NiceModalProviderIdContext'

export const getRandomId = () => {
  return Date.now()
}

export const Provider: FC<PropsWithChildren> = ({ children }) => {
  const [id, setId] = useState(() => getRandomId())
  const [modals, dispatch] = useReducer(reducer, initialState)

  // 写到全局上
  useEffect(() => {
    ALL_DISPATCHES[id] = dispatch
    return () => {
      delete ALL_DISPATCHES[id]
    }
  }, [id])

  return (
    <NiceModalProviderIdContext.Provider value={id}>
      <NiceModalContext.Provider value={modals}>
        {children}
        <NiceModalPlaceholder />
      </NiceModalContext.Provider>
    </NiceModalProviderIdContext.Provider>
  )
}
