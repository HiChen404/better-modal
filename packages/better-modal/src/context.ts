import { createContext, Dispatch } from 'react'
import { NiceModalStore, NiceModalAction } from './types'
export const initialState: NiceModalStore = {}
export const DEFAULT_DISPATCH = () => {
  throw new Error('No dispatch method detected, did you embed your app with NiceModal.Provider?')
}

export const NiceModalContext = createContext<NiceModalStore>(initialState)
export const DispatchContext = createContext<Dispatch<NiceModalAction>>(DEFAULT_DISPATCH)
export const ProviderIdContext = createContext<string | null>(null)
export const NiceModalIdContext = createContext<string | null>(null)
