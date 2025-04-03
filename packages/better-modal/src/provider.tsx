import {
  initialState,
  NiceModalContext,
  NiceModalDispatchContext,
  NiceModalIdContext,
  NiceModalProviderIdContext,
} from './context'
import React, { FC, PropsWithChildren, useReducer, useState } from 'react'
import { reducer } from './reducer'
import { NiceModalPlaceholder } from './placeholder'
export const getRandomId = () => {
  return Date.now()
}

export const Provider: FC<PropsWithChildren> = ({ children }) => {
  const [modals, dispatch] = useReducer(reducer, initialState)
  const [id, setId] = useState(() => getRandomId())
  return (
    <NiceModalProviderIdContext.Provider value={id}>
      <NiceModalContext.Provider value={modals}>
        <NiceModalDispatchContext.Provider value={dispatch}>
          {children}
          <NiceModalPlaceholder />
        </NiceModalDispatchContext.Provider>
      </NiceModalContext.Provider>
    </NiceModalProviderIdContext.Provider>
  )
}
