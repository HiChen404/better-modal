import { initialState, NiceModalContext, NiceModalDispatchContext, NiceModalIdContext } from './context'
import React, { FC, PropsWithChildren, useReducer } from 'react'
import { reducer } from './reducer'
import { NiceModalPlaceholder } from './placeholder'

const InnerContextProvider: FC<PropsWithChildren> = ({ children }) => {
  const [modals, dispatch] = useReducer(reducer, initialState)
  return (
    <NiceModalContext.Provider value={modals}>
      <NiceModalDispatchContext.Provider value={dispatch}>
        {children}
        <NiceModalPlaceholder />
      </NiceModalDispatchContext.Provider>
    </NiceModalContext.Provider>
  )
}

export const Provider: FC<PropsWithChildren> = ({ children }) => {
  return <InnerContextProvider>{children}</InnerContextProvider>
}
