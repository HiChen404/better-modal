import React, { Dispatch } from 'react'
import { NiceModalAction } from './reducer'

export interface NiceModalState {
  // TODO: 避免与属性冲突
  id: string
  args?: Record<string, unknown>
  visible?: boolean
  delayVisible?: boolean
  keepMounted?: boolean
}

export interface NiceModalStore {
  [key: string]: string
}

export const initialState: NiceModalStore = {}

export const NiceModalContext = React.createContext(initialState)
export const NiceModalIdContext = React.createContext<string | null>(null)
export const NiceModalDispatchContext = React.createContext<Dispatch<NiceModalAction> | null>(null)
export const NiceModalProviderIdContext = React.createContext<number | string>('default')

NiceModalContext.displayName = 'NiceModalContext'
NiceModalIdContext.displayName = 'NiceModalIdContext'
NiceModalDispatchContext.displayName = 'NiceModalDispatchContext'
NiceModalProviderIdContext.displayName = 'NiceModalProviderIdContext'
