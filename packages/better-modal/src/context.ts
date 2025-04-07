import { createContext, Dispatch } from 'react'
import { DEFAULT_DISPATCH, initialState } from './reducer'
import { NiceModalStore, NiceModalAction } from './types'

export const NiceModalContext = createContext<NiceModalStore>(initialState)
export const DispatchContext = createContext<Dispatch<NiceModalAction>>(DEFAULT_DISPATCH)
export const ProviderIdContext = createContext<string | null>(null)
export const NiceModalIdContext = createContext<string | null>(null)
